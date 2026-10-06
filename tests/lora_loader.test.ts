import { describe, it, expect } from 'vitest';
import {
  parseSafeTensorsHeader,
  applyLoRAWeights,
  type LoRAHeader
} from '../src/services/lora_loader';

describe('lora_loader', () => {
  describe('parseSafeTensorsHeader', () => {
    function createSafeTensorsBuffer(headerObj: Record<string, any>, dataBytes: number = 0): ArrayBuffer {
      const headerStr = JSON.stringify(headerObj);
      const headerBytes = new TextEncoder().encode(headerStr);
      const headerLength = headerBytes.byteLength;
      const totalLength = 8 + headerLength + dataBytes;
      const buffer = new ArrayBuffer(totalLength);
      const view = new DataView(buffer);
      view.setBigUint64(0, BigInt(headerLength), true); // little-endian
      const u8 = new Uint8Array(buffer);
      u8.set(headerBytes, 8);
      return buffer;
    }

    it('parses valid SafeTensors header and calculates offset', () => {
      const headerObj = {
        'model.layers.0.self_attn.q_proj.lora_A.weight': {
          dtype: 'F32',
          shape: [16, 2048],
          data_offsets: [0, 131072]
        },
        __metadata__: { format: 'pt' }
      };
      const buffer = createSafeTensorsBuffer(headerObj, 64);
      const { header, offset } = parseSafeTensorsHeader(buffer);

      expect(header).toEqual(headerObj);
      const expectedLength = new TextEncoder().encode(JSON.stringify(headerObj)).byteLength;
      expect(offset).toBe(8 + expectedLength);
    });

    it('rejects buffers smaller than 8 bytes', () => {
      const smallBuffer = new ArrayBuffer(4);
      expect(() => parseSafeTensorsHeader(smallBuffer)).toThrow(
        /SafeTensors buffer must be an ArrayBuffer of at least 8 bytes/
      );
    });

    it('rejects truncated buffers where byteLength is less than declared header', () => {
      const buffer = new ArrayBuffer(16);
      const view = new DataView(buffer);
      view.setBigUint64(0, 100n, true); // claims 100 bytes of header, but buffer is only 16 bytes
      expect(() => parseSafeTensorsHeader(buffer)).toThrow(/SafeTensors buffer is truncated/);
    });

    it('rejects invalid or non-JSON header content', () => {
      const rawText = '{ not valid json:';
      const rawBytes = new TextEncoder().encode(rawText);
      const buffer = new ArrayBuffer(8 + rawBytes.byteLength);
      new DataView(buffer).setBigUint64(0, BigInt(rawBytes.byteLength), true);
      new Uint8Array(buffer).set(rawBytes, 8);
      expect(() => parseSafeTensorsHeader(buffer)).toThrow(/SafeTensors header is not valid JSON/);
    });

    it('rejects non-object JSON header', () => {
      const rawBytes = new TextEncoder().encode('"a string"');
      const buffer = new ArrayBuffer(8 + rawBytes.byteLength);
      new DataView(buffer).setBigUint64(0, BigInt(rawBytes.byteLength), true);
      new Uint8Array(buffer).set(rawBytes, 8);
      expect(() => parseSafeTensorsHeader(buffer)).toThrow(/SafeTensors header must encode a JSON object/);
    });
  });

  describe('applyLoRAWeights', () => {
    it('applies scalar scaling correctly according to W\' = W + (alpha / rank) * (B @ A)', () => {
      // Dimensions: outFeatures = 2, inFeatures = 2, rank = 1
      // baseTensor W = [[1, 2], [3, 4]]
      // loraB (2 x 1) = [[1], [2]]
      // loraA (1 x 2) = [[3, 4]]
      // B @ A = [[3, 4], [6, 8]]
      // alpha = 4, rank = 1 -> scale = 4.0
      // Delta = 4.0 * [[3, 4], [6, 8]] = [[12, 16], [24, 32]]
      // W' = [[1+12, 2+16], [3+24, 4+32]] = [[13, 18], [27, 36]]
      const baseTensor = new Float32Array([1, 2, 3, 4]);
      const loraB = new Float32Array([1, 2]);
      const loraA = new Float32Array([3, 4]);

      const result = applyLoRAWeights(baseTensor, loraA, loraB, 4, 1);
      expect(result).toBeInstanceOf(Float32Array);
      expect(Array.from(result)).toEqual([13, 18, 27, 36]);
    });

    it('handles zero LoRA weights without altering base tensor', () => {
      const baseTensor = new Float32Array([10, 20, 30, 40]);
      const loraA = new Float32Array([0, 0]);
      const loraB = new Float32Array([0, 0]);

      const result = applyLoRAWeights(baseTensor, loraA, loraB, 32, 1);
      expect(Array.from(result)).toEqual([10, 20, 30, 40]);
    });

    it('preserves numerical precision across rank=2 expansion', () => {
      // outFeatures = 2, inFeatures = 3, rank = 2
      // baseTensor = all 0s
      // loraB = [[1, 0.5], [2, -1]] (2x2)
      // loraA = [[0.1, 0.2, 0.3], [1.0, 2.0, 3.0]] (2x3)
      // alpha = 16, rank = 2 -> scale = 8.0
      // B[0] = [1, 0.5]
      //   j=0: 1*0.1 + 0.5*1.0 = 0.6 -> scale*0.6 = 4.8
      //   j=1: 1*0.2 + 0.5*2.0 = 1.2 -> scale*1.2 = 9.6
      //   j=2: 1*0.3 + 0.5*3.0 = 1.8 -> scale*1.8 = 14.4
      // B[1] = [2, -1]
      //   j=0: 2*0.1 + (-1)*1.0 = -0.8 -> scale*(-0.8) = -6.4
      //   j=1: 2*0.2 + (-1)*2.0 = -1.6 -> scale*(-1.6) = -12.8
      //   j=2: 2*0.3 + (-1)*3.0 = -2.4 -> scale*(-2.4) = -19.2
      const baseTensor = new Float32Array(6);
      const loraB = new Float32Array([1.0, 0.5, 2.0, -1.0]);
      const loraA = new Float32Array([0.1, 0.2, 0.3, 1.0, 2.0, 3.0]);

      const result = applyLoRAWeights(baseTensor, loraA, loraB, 16, 2);
      expect(result.length).toBe(6);
      expect(result[0]).toBeCloseTo(4.8, 5);
      expect(result[1]).toBeCloseTo(9.6, 5);
      expect(result[2]).toBeCloseTo(14.4, 5);
      expect(result[3]).toBeCloseTo(-6.4, 5);
      expect(result[4]).toBeCloseTo(-12.8, 5);
      expect(result[5]).toBeCloseTo(-19.2, 5);
    });

    it('validates matrix dimensions and throws on mismatch', () => {
      const base = new Float32Array([1, 2, 3, 4]); // 2x2
      const invalidA = new Float32Array([1, 2, 3]); // length 3 not divisible by rank 2
      const validB = new Float32Array([1, 2, 3, 4]);

      expect(() => applyLoRAWeights(base, invalidA, validB, 16, 2)).toThrow(
        /loraA length \(3\) must be a positive multiple of rank \(2\)/
      );

      const invalidB = new Float32Array([1, 2, 3]);
      const validA = new Float32Array([1, 2, 3, 4]);
      expect(() => applyLoRAWeights(base, validA, invalidB, 16, 2)).toThrow(
        /loraB length \(3\) must be a positive multiple of rank \(2\)/
      );
    });

    it('validates baseTensor dimension matches outFeatures * inFeatures', () => {
      // rank = 1, loraA length 2 (inFeatures = 2), loraB length 2 (outFeatures = 2)
      // Expected base length = 4. Provided = 3.
      const baseMismatch = new Float32Array([1, 2, 3]);
      const loraA = new Float32Array([1, 2]);
      const loraB = new Float32Array([3, 4]);

      expect(() => applyLoRAWeights(baseMismatch, loraA, loraB, 16, 1)).toThrow(
        /Dimension mismatch: baseTensor has 3 elements but LoRA matrices imply 2x2 = 4 elements/
      );
    });

    it('rejects invalid rank and alpha parameters', () => {
      const base = new Float32Array([1]);
      const a = new Float32Array([1]);
      const b = new Float32Array([1]);

      expect(() => applyLoRAWeights(base, a, b, NaN, 1)).toThrow(/alpha must be a finite number/);
      expect(() => applyLoRAWeights(base, a, b, 16, 0)).toThrow(/rank must be a positive integer/);
      expect(() => applyLoRAWeights(base, a, b, 16, -2)).toThrow(/rank must be a positive integer/);
      expect(() => applyLoRAWeights(base, a, b, 16, 1.5)).toThrow(/rank must be a positive integer/);
    });
  });
});
