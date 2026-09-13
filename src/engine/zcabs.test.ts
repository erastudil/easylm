import { describe, it, expect, beforeEach } from 'vitest';
import {
  initZcabsNonce,
  getZcabsCheckTarget,
  resetZcabsNonce,
  generateZcabsCanaryPrompt,
  execZcabsCanary,
  verifyZcabsInvariant
} from './zcabs';

describe('ZCABS Canary Nonce Engine', () => {
  beforeEach(() => {
    resetZcabsNonce();
  });

  it('randomizes string key and hides the integer nonce from caller', () => {
    const target = initZcabsNonce();
    expect(target.key).toMatch(/^reg_[a-z]+_[0-9a-f]{4}$/);
    expect(target.location).toBe(`/proc/sys/canary/${target.key}`);
    // Nonce integer is hidden, not on target object
    expect((target as any).nonce).toBeUndefined();
  });

  it('generates instruction telling WHERE to check, not WHAT to check for', () => {
    const canary = generateZcabsCanaryPrompt();
    expect(canary.prompt).toContain('ZCABS CANARY CHECK:');
    expect(canary.prompt).toContain(`LOOK: inspect target invariant canary register '${canary.key}'`);
    expect(canary.prompt).toContain("FORMAT: reply with exact integer value observed");
    expect(canary.prompt).toContain("Do NOT guess or hallucinate");

    // Must NOT leak any 5-digit number or solution in the prompt
    const matches = canary.prompt.match(/\b\d{5}\b/g);
    expect(matches).toBeNull();
  });

  it('execZcabsCanary returns observed value when queried with target register', () => {
    const target = getZcabsCheckTarget();
    const res = execZcabsCanary(target.key);
    expect(res.ok).toBe(true);
    expect(res.result).toContain(`CANARY_OBSERVED: ${target.key}=`);

    // Mismatched register returns error
    const badRes = execZcabsCanary('reg_bogus_0000');
    expect(badRes.ok).toBe(false);
    expect(badRes.error).toContain('ZCABS_REGISTER_MISMATCH');
  });

  it('verifyZcabsInvariant passes on observed canary value and fails closed on hallucination', () => {
    const target = getZcabsCheckTarget();
    const toolExec = execZcabsCanary(target.key);
    expect(toolExec.ok).toBe(true);

    // Extract the observed nonce from the tool execution output
    const match = toolExec.result!.match(/=(\d+)/);
    expect(match).not.toBeNull();
    const observedNonce = match![1];

    // Case 1: Agent reports correct observed value -> PASS
    const validOutput = `Based on system inspection, ZCABS_VALUE: ${observedNonce}.`;
    const checkValid = verifyZcabsInvariant(validOutput);
    expect(checkValid.pass).toBe(true);
    expect(checkValid.extracted).toBe(parseInt(observedNonce, 10));

    // Case 2: Agent hallucinates or guesses a different number -> FAIL
    const fakeNonce = observedNonce === '54321' ? '12345' : '54321';
    const fakeOutput = `I think the answer is ZCABS_VALUE: ${fakeNonce}.`;
    const checkFake = verifyZcabsInvariant(fakeOutput);
    expect(checkFake.pass).toBe(false);
    expect(checkFake.reason).toContain('Invariant violation');

    // Case 3: Empty or missing output -> FAIL
    const emptyCheck = verifyZcabsInvariant('No values here.');
    expect(emptyCheck.pass).toBe(false);
  });

  it('resetZcabsNonce generates fresh canary key and resets state', () => {
    const first = resetZcabsNonce();
    const second = resetZcabsNonce();
    // Consecutive resets generate unique random registers
    expect(first.location).not.toBe(second.location);
  });
});
