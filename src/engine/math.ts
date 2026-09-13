/**
 * Deterministic math. Recursive descent. No Function, no eval.
 */

const FUNC_ARITY: Record<string, number> = {
  sqrt: 1,
  sin: 1,
  cos: 1,
  tan: 1,
  abs: 1,
  log: 1,
  ln: 1,
  pow: 2
};

function applyFunc(name: string, args: number[]): number {
  switch (name) {
    case 'sqrt':
      return Math.sqrt(args[0]);
    case 'sin':
      return Math.sin(args[0]);
    case 'cos':
      return Math.cos(args[0]);
    case 'tan':
      return Math.tan(args[0]);
    case 'abs':
      return Math.abs(args[0]);
    case 'log':
      return Math.log10(args[0]);
    case 'ln':
      return Math.log(args[0]);
    case 'pow':
      return Math.pow(args[0], args[1]);
    default:
      throw new Error(`Unknown function ${name}`);
  }
}

type Tok =
  | { t: 'num'; v: number }
  | { t: 'id'; v: string }
  | { t: 'op'; v: string }
  | { t: 'eof' };

function tokenize(src: string): Tok[] {
  const s = src.trim();
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ' || c === '\t' || c === '\n') {
      i++;
      continue;
    }
    if (c === '*' && s[i + 1] === '*') {
      out.push({ t: 'op', v: '^' });
      i += 2;
      continue;
    }
    if ('+-*/^(),'.includes(c)) {
      out.push({ t: 'op', v: c });
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      const m = s.slice(i).match(/^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/);
      if (!m) throw new Error('Invalid number');
      const n = Number(m[0]);
      if (!Number.isFinite(n)) throw new Error('Invalid number');
      out.push({ t: 'num', v: n });
      i += m[0].length;
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      const m = s.slice(i).match(/^[a-zA-Z]+/);
      if (!m) throw new Error('Invalid identifier');
      out.push({ t: 'id', v: m[0].toLowerCase() });
      i += m[0].length;
      continue;
    }
    throw new Error(`Prohibited character "${c}"`);
  }
  out.push({ t: 'eof' });
  return out;
}

class Parser {
  i = 0;
  constructor(private toks: Tok[]) {}

  peek(): Tok {
    return this.toks[this.i];
  }

  eat(): Tok {
    return this.toks[this.i++];
  }

  expr(): number {
    let v = this.term();
    while (this.peek().t === 'op' && (this.peek() as { v: string }).v === '+' || (this.peek().t === 'op' && (this.peek() as { v: string }).v === '-')) {
      const op = (this.eat() as { v: string }).v;
      const r = this.term();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  }

  term(): number {
    let v = this.power();
    while (this.peek().t === 'op' && ((this.peek() as { v: string }).v === '*' || (this.peek() as { v: string }).v === '/')) {
      const op = (this.eat() as { v: string }).v;
      const r = this.power();
      if (op === '/') {
        if (r === 0) throw new Error('Division by zero');
        v = v / r;
      } else {
        v = v * r;
      }
    }
    return v;
  }

  power(): number {
    const v = this.unary();
    if (this.peek().t === 'op' && (this.peek() as { v: string }).v === '^') {
      this.eat();
      return Math.pow(v, this.unary());
    }
    return v;
  }

  unary(): number {
    if (this.peek().t === 'op' && (this.peek() as { v: string }).v === '-') {
      this.eat();
      return -this.unary();
    }
    if (this.peek().t === 'op' && (this.peek() as { v: string }).v === '+') {
      this.eat();
      return this.unary();
    }
    return this.primary();
  }

  primary(): number {
    const tok = this.peek();
    if (tok.t === 'num') {
      this.eat();
      return tok.v;
    }
    if (tok.t === 'id') {
      this.eat();
      const name = tok.v;
      if (name === 'pi') return Math.PI;
      if (name === 'e') return Math.E;
      if (!(name in FUNC_ARITY)) throw new Error(`Unknown identifier ${name}`);
      if (!(this.peek().t === 'op' && (this.peek() as { v: string }).v === '(')) {
        throw new Error(`Function ${name} requires parentheses`);
      }
      this.eat();
      const args: number[] = [this.expr()];
      while (this.peek().t === 'op' && (this.peek() as { v: string }).v === ',') {
        this.eat();
        args.push(this.expr());
      }
      if (!(this.peek().t === 'op' && (this.peek() as { v: string }).v === ')')) {
        throw new Error('Missing closing parenthesis');
      }
      this.eat();
      const arity = FUNC_ARITY[name];
      if (args.length !== arity) throw new Error(`${name} expects ${arity} argument(s)`);
      const result = applyFunc(name, args);
      if (!Number.isFinite(result)) throw new Error('Expression did not evaluate to a valid number');
      return result;
    }
    if (tok.t === 'op' && tok.v === '(') {
      this.eat();
      const v = this.expr();
      if (!(this.peek().t === 'op' && (this.peek() as { v: string }).v === ')')) {
        throw new Error('Missing closing parenthesis');
      }
      this.eat();
      return v;
    }
    throw new Error('Unexpected token in math expression');
  }
}

export function execMath(expr: string): { ok: boolean; result?: string; error?: string } {
  try {
    const src = String(expr || '').trim();
    if (!src) return { ok: false, error: 'Empty expression' };
    if (src.length > 400) return { ok: false, error: 'Expression too long' };
    const toks = tokenize(src);
    const p = new Parser(toks);
    const val = p.expr();
    if (p.peek().t !== 'eof') return { ok: false, error: 'Unexpected trailing input' };
    if (typeof val !== 'number' || !Number.isFinite(val)) {
      return { ok: false, error: 'Expression did not evaluate to a valid number' };
    }
    return { ok: true, result: String(val) };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Math evaluation error' };
  }
}
