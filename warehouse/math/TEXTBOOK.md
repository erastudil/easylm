---
title: "math — undergrad textbook"
date: "2026-09-13"
status: living · undergrad
home: "warehouse/math/"
related:
  - "../physics/"
  - "../computing/"
  - "../methods/"
  - "EasyLM calc hand"
  - "EasyLM units hand"
  - "warehouse/LAW.md"
---

# math — undergrad textbook

a working book for people who must **state a claim and a reason**.
this file teaches. numbers you cannot check → DONT_KNOW / fetch the door. arithmetic, algebra, calculus, and undergrad stats only with **EasyLM calc**.

**law this book applies:** definition first. same both sides. domain. inverse under stated conditions. existence is not construction. proof is a check. compute with a tool, never with weights.

**constants.** if a physics constant (G, h, k, N_A, R) sneaks into an applied problem: fetch NIST https://physics.nist.gov/cuu/Constants/ then EasyLM calc. **c = 299792458 m/s** is SI-defined. this pack does not store those digits.

---

## 0. how to use this book

read chapter 1, then the chapter the job needs. LINK_INDEX.md is official doors, not the lesson.

| you need | chapter |
|---|---|
| what a proof is | 1 |
| numbers, equations, polynomials | 2 |
| maps, inverses, families | 3 |
| space, angle, triangle | 4 |
| vectors, matrices, `Ax = b` | 5 |
| limit, derivative, integral | 6 |
| DE, Fourier | 7 |
| sets, logic, graphs, counting | 8 |
| chance, data | 9 |
| integers, primes, Collatz | 10 |
| approx, optimize | 11 |
| do the arithmetic on this box | 12 |
| stuck on a problem | 13 |

work order every time: **why → what → how**. name the structure before you pick a formula.

---

## 1. what mathematics is

mathematics studies **structure**: number, space, change, chance, discrete objects. an answer is a **claim plus a reason** another person can check.

four questions, every time:

1. what is **given**, what is **unknown**?
2. which **structure** (equation, function, matrix, graph, measure)?
3. what **must stay true** (identity, dimension, domain)?
4. does the result pass a **limit / unit / special-case** check?

**definition first.** say what the object is before you compute. “let `f` be …” is the start of the work, not decoration.

**statement kinds**

| kind | job |
|---|---|
| **definition** | names an object. not argued. used. |
| **axiom** | taken as given in this theory |
| **theorem / lemma / corollary** | a claim with a proof |
| **conjecture** | claimed, not proved. treat as open |
| **identity** | equality that holds on a stated domain |
| **construction** | an object you can exhibit |

**existence vs construction.** “there is a root” is not “here is the root.” intermediate-value existence does not hand you a formula. if the job is to *build*, you need an algorithm or a closed form. if the job is to *know it exists*, a proof of existence is enough.

**proof** is a finite chain from agreed axioms and already-proved theorems to the claim. styles you will meet: direct, contrapositive, contradiction, induction, construction, exhaustion on a finite set. a picture can *suggest*; it does not close the argument unless the course has said the picture *is* the proof (rare, and then it must still be checkable).

worked proof method (write this skeleton every time):

1. **restate** given and to-prove, with domains.
2. **name the style** (direct, contrapositive, contradiction, induction, construction).
3. **unpack definitions** (what “even,” “continuous,” “invertible” mean in symbols).
4. **chain** licensed steps (algebra, a named theorem, a previous lemma). each step a reason.
5. **close** by repeating the claim as now shown.
6. **check** a special case and the converse (the converse may be false).

example style, direct: to prove “if n is even then n² is even,” write n = 2k, square, factor 2, done. contrapositive of the same family: if n² is odd then n is odd. contradiction: assume n even and n² odd, derive 0 = 1 in the integers. induction lives in ch 8; it is the style for statements indexed by naturals.

**quantifiers.** “for all ε > 0 there exists N” is not “there exists N for all ε.” swapping them is a different claim. write them in order before you prove a limit.

**discrete vs continuous.** counting vs measuring. pick one model. mixing them without a limit, a measure, or a generating function is how you get a fluent wrong answer.

**check:** if you cannot say whether you are defining, proving, computing, or conjecturing, you are not ready to pick a how.

---

## 2. numbers and algebra

**number systems** (nested, usual undergrad path): naturals ⊂ integers ⊂ rationals ⊂ reals ⊂ complexes. each step adds a closure: subtraction, division (except 0), limits of cauchy sequences, a root of `x² + 1`. do not mix “undefined” with “infinite.” division by zero is not a number in these fields.

**arithmetic** is the operations. **algebra** is the same operations with **variables** — symbols for unspecified values — so one identity covers a class.

local primer identities (use these; do not invent siblings):

- `a^m a^n = a^{m+n}`
- `(a^m)^n = a^{mn}`
- `log(ab) = log a + log b` (same base, positive args)
- quadratic: `x = (−b ± √(b² − 4ac)) / (2a)` when `a ≠ 0`. discriminant `b² − 4ac` decides two reals / one / none (over reals).

pass algebra to **EasyLM calc** (`expand`, `factor`, `solve`, arithmetic). do not expand a quadratic in weights. if the live tool disagrees with a remembered integer, the live tool wins.

worked algebra method:

1. name the domain (reals? integers? a ≠ 0?).
2. isolate, or bring to 0 and factor.
3. each operation is reversible except where you multiplied/divided by an expression that might be 0 — track those cases.
4. check by substitution into the original, with EasyLM calc.

**linear equations.** isolate. systems: substitution, elimination, or `Ax = b` (ch 5).

**polynomials.** degree, leading coefficient, roots. factoring, completing the square, division. over complexes, a non-constant polynomial has a root (fundamental theorem of algebra) — existence. finding the root is a different job.

**abstract algebra** (name only at this level): a **group** is a set with an associative invertible operation; a **ring** has two operations like + and ×; a **field** lets you divide by non-zero elements. integers are a ring. rationals, reals, complexes are fields. you need this language before you quote “the multiplicative group of units.” details: DEEP track 2, then AMS / a course door.

**domain.** `1/x` is not defined at 0. `√x` over reals needs `x ≥ 0`. log needs positive argument. write the domain or you have not stated the identity.

---

## 3. functions

a **function** `f: A → B` assigns to each element of domain `A` exactly one element of codomain `B`. **range** (image) is the set of values actually hit.

**composition** `(f ∘ g)(x) = f(g(x))` when the image of `g` sits in the domain of `f`.

**inverse.** `f` has an inverse function when it is one-to-one onto its image (bijective onto range). inverse undoes: `f^{-1}(f(x)) = x` on the domain. exp and log are the model pair, on their domains.

families you must recognize on sight:

| family | shape |
|---|---|
| linear | `f(x) = mx + b` |
| polynomial | finite sum of powers |
| rational | ratio of polynomials |
| exponential | `a^x` (`a > 0`, `a ≠ 1`) |
| log | inverse of exp |
| trig | circle coordinates (ch 4) |
| piecewise | different rules on pieces; check the joints |

**even / odd.** `f(-x) = f(x)` even; `f(-x) = -f(x)` odd. useful for integrals on symmetric intervals.

**one-to-one / onto.** injective: f(x1) = f(x2) implies x1 = x2. surjective onto B: every b in B is hit. bijective: both. inverse functions exist precisely then (onto the range, or onto B if you named the codomain that way). horizontal-line test is a picture of injectivity on a graph, not a proof for a formula you have not analyzed.

worked function method:

1. write f: A → B explicitly (A is the domain you will actually use).
2. ask: value? inverse? composition? limit? root? each is a different job.
3. invert only after injectivity on that domain (restrict arcsin, sqrt, log as usual).
4. check (f^{-1} ∘ f)(x) = x on A and (f ∘ f^{-1})(y) = y on the image.

**check:** name domain, then rule, then what you want out (value, inverse, limit, root). do not start at a plotted vibe.

---

## 4. geometry and trigonometry

**euclidean plane / space.** points, lines, planes, distance, angle. **pythagoras** on a right triangle: `a² + b² = c²` with `c` the hypotenuse. distance between points is that theorem in coordinates.

**congruence / similarity.** same shape and size vs same shape, scaled. similar triangles give proportional sides — the engine under trig.

**trigonometry** is the study of those ratios, then of the functions that extend them to the whole real line via the unit circle.

on a right triangle: opposite / hypotenuse = sine, adjacent / hypotenuse = cosine, opposite / adjacent = tangent (acute angles). on the unit circle, `(cos θ, sin θ)` is the point at angle `θ` from the positive x-axis. that definition survives obtuse and negative angles.

pythagorean identity (confirm with EasyLM calc `simplify(sin(x)**2 + cos(x)**2)` when you need a machine check):

`sin²θ + cos²θ = 1`

other angle-addition identities: fetch OpenStax / MIT 18.01 / NIST DLMF. do not recite a table from memory.

**radians** are the calculus unit (arc length on the unit circle). degrees are a human scale. convert with a tool if the job mixes them.

**analytic geometry.** line slope, circle equation, conics. vector geometry lives in ch 5.

non-euclidean geometries (spherical, hyperbolic) change the parallel axiom. name them if the space is a globe or a saddle. otherwise stay euclidean.

---

## 5. linear algebra

this is the language of almost every later course and of ML. one picture: **linear maps on vector spaces, written as matrices once you pick a basis.**

**vector space.** a set of vectors closed under addition and scalar multiplication, with the usual axioms (zero vector, inverses, distributivity). ℝⁿ is the working example. functions can be vectors; that is how Fourier and DE theory talk.

**span, independence, basis, dimension.** a basis is a linearly independent spanning set. dimension is the size of a basis. all bases of a finite-dimensional space have the same size. if you change basis, the *vector* is the same object; the *coordinates* change.

**matrix.** a rectangular array that represents a linear map in a chosen basis, or a system of linear equations. product `AB` is composition of maps: `A` is m×k, `B` is k×n, `AB` is m×n (inner dimension `k` must match). **order matters.** `AB` and `BA` need not exist, and if both exist they need not be equal.

**system** `Ax = b`.

| case | meaning |
|---|---|
| unique solution | `A` invertible (square, full rank) |
| none | `b` not in the column space |
| infinitely many | free variables; null space non-trivial |

**rank** = dimension of column space = dimension of row space. **null space** = solutions of `Ax = 0`. rank-nullity: rank + nullity = number of columns.

**inverse.** `A^{-1}A = I = AA^{-1}` when it exists. **determinant** is a scalar test for invertibility (square matrices): `det A ≠ 0` iff invertible. pass `det` to EasyLM calc; do not compute 4×4 dets in weights.

**dot product, norm, orthogonality.** `u · v = 0` means orthogonal. orthonormal bases make coordinates cheap (projections become dots).

**eigenvalues / eigenvectors.** `Av = λv` with `v ≠ 0`. λ is a stretch factor along v. diagonalization is “the map is stretch-along-axes in a well-chosen basis.” not every matrix diagonalizes over the reals; then you fetch Jordan / SVD from a linear algebra door (MIT 18.06).

**SVD / least squares** (name): when `Ax = b` has no exact solution, minimize `‖Ax − b‖`. this is the linear model under regression. details: DEEP numerical + stats tracks.

worked `Ax = b` method:

1. write the shape of A (m × n) and of b (m × 1).
2. row-reduce the augmented matrix, or call EasyLM calc / a CAS for `rref` / `solve`. do not invert a 4×4 in weights.
3. if rank(A) < rank([A|b]): inconsistent, no solution.
4. if rank(A) = rank([A|b]) = n: unique.
5. if rank(A) = rank([A|b]) < n: free variables; write the general solution as particular + null-space.

**check:** if you cannot say the shape of `A` and whether you want a solve, a projection, or a spectrum, you are not ready to type a solver.

---

## 6. calculus

calculus studies **change** and **accumulation** through **limits**.

**limit.** the value approached as the input approaches a point (or ±∞), independent of whether the function attains it. `lim_{x→0} sin(x)/x = 1` (calc this session). a limit can exist when the function has a hole. left and right limits must agree for a two-sided limit on the line.

**continuity.** `lim_{x→a} f(x) = f(a)`. polynomials are continuous everywhere they are defined. rational functions fail where the denominator is zero, unless a factor cancels and you have extended continuously — say so.

**derivative.** rate of change; slope of the tangent. definition: limit of the difference quotient. if the limit does not exist, `f` is not differentiable there (corner, jump, vertical tangent).

rules (names; apply with **EasyLM calc**, do not expand in prose):

| rule | use |
|---|---|
| power | `d/dx x^n = n x^{n-1}` |
| product | uv |
| quotient | u/v |
| chain | composition |
| exp / log / trig | fetch the table or call EasyLM calc |

pass `diff(...)` to EasyLM calc. a remembered derivative is not a check.

**higher derivatives.** acceleration is the second derivative of position, when the model says so. Taylor polynomials approximate `f` near a point by matching derivatives. remainder bounds: fetch a calculus door. do not invent a remainder number.

**integral.** accumulation; signed area. **indefinite** integral = antiderivative family `+ C`. **definite** integral = number, limit of Riemann sums (or a later integral: lebesgue, in DEEP analysis).

pass `integrate(...)` to EasyLM calc for an antiderivative. indefinite integrals need `+ C`.

**FTC** (fundamental theorem of calculus). two theorems, one idea: derivative and definite integral invert.

**FTC I.** let \(f\) be continuous on \([a,b]\). define \(F(x) = \int_a^x f(t)\,dt\). then \(F\) is differentiable on \((a,b)\) and \(F'(x) = f(x)\). the integral-from-a-fixed-lower-limit is an antiderivative.

**FTC II.** let \(f\) be continuous on \([a,b]\) and let \(G\) be any antiderivative of \(f\) (so \(G' = f\)). then \(\int_a^b f(x)\,dx = G(b) - G(a)\).

conditions matter. continuity of \(f\) is the undergrad hypothesis that makes both forms clean. weaker hypotheses (integrable discontinuities, fundamental theorem for Lebesgue integrals): later analysis. fetch OpenStax / MIT 18.01 for the exact hypothesis list the course is using.

worked FTC method:

1. name the interval and check the integrand is continuous there (or name the finite jump you are allowing).
2. find an antiderivative G (EasyLM calc `integrate`, then differentiate to check).
3. evaluate G(b) − G(a). that difference is the definite integral, not “the area” until you have said the integrand is non-negative.
4. variable limits: if the upper limit is u(x), chain rule on FTC I: d/dx ∫_a^{u(x)} f = f(u(x)) u'(x).
5. check a special case you already know (∫_0^1 1 dx = 1, ∫_0^π sin = 2).

the net: to compute a definite integral, find any antiderivative and subtract. to recover f from accumulated area, differentiate. that is the whole point.

**multivariable.** partial derivatives, gradient, chain rule in several variables, double/triple integrals, green / stokes / divergence — MIT 18.02. vector calculus is linear algebra + FTC in higher dimension.

**series.** geometric, taylor, convergence tests. a series is a limit of partial sums. “the series equals” without a convergence statement is unfinished.

**check:** every differentiation step is a limit in disguise. if the function is not nice (absolute value at 0, step, 1/x), draw and fetch, do not bluff smoothness.

---

## 7. differential equations and Fourier

a **differential equation** relates a function to its derivatives. **ODE** = one independent variable. **PDE** = several.

**order** = highest derivative. **linear** ODE: unknown and its derivatives appear to the first power, no products of them.

working undergrad toolkit:

| kind | move |
|---|---|
| separable | `dy/dx = g(x)h(y)` → separate, integrate |
| linear first-order | integrating factor |
| constant-coefficient linear | characteristic polynomial, then superposition |
| systems | linear algebra on the coefficient matrix (eigenvalues) |

existence/uniqueness theorems tell you a solution *lives* in a neighborhood of initial data. they do not write the closed form. many useful DEs have no elementary antiderivative. then: series, numerical (ch 11), or a named special function (NIST DLMF).

**Fourier.** write a (nice enough) function as a sum/integral of sines and cosines, or complex exponentials. the **Fourier transform** maps a time/space picture to a frequency picture. inversion recovers the original under stated conditions. convolution in one domain is multiplication in the other — why filters and PDEs on the line/circle get easier.

parseval / plancherel, distributions, FFT: DEEP track 4. identities: fetch DLMF or a Fourier door. do not quote a transform pair from memory.

applied orbits, heat, waves: the *math* is ODE/PDE + linear algebra. constants such as `G` live in the physics pack. fetch there. do not copy a gravity number into this book.

---

## 8. discrete mathematics

the discrete side: finite or countable objects, no limit required for the definition (induction and generating functions may still use limits).

**sets.** element, subset, union, intersection, complement, power set, cartesian product. empty set is a set. a set does not contain itself in ordinary undergrad set theory; paradoxes are why we have axioms (DEEP foundations).

**logic.** and, or, not, implies, iff. **quantifiers:** for all, there exists. order of quantifiers changes the claim. `∀ε ∃N` is not `∃N ∀ε`. implication `P → Q` is false only when P is true and Q is false.

**proof by induction.** (1) prove the base case. (2) assume true for `k`, prove for `k+1`. state what is being inducted on. strong induction lets you assume all smaller cases. a failed base case kills the argument no matter how pretty the step is.

**counting.** `n!` = permutations of n distinct objects. `C(n,k)` = ways to choose k from n without order. if you cannot say whether order matters and whether repetition is allowed, you cannot pick the formula.

**graphs.** vertices and edges. directed vs undirected, simple vs multi, weighted. degree, path, cycle, connected, tree (connected acyclic). adjacency matrix is linear algebra on a graph. euler / hamilton, planarity, coloring: named problems — fetch a graph-theory door when the named theorem is load-bearing.

**recursion.** a sequence defined from earlier terms plus a base. solving linear recurrences uses the same characteristic polynomial as linear DEs. that is not an accident.

**algorithms as math.** correctness + complexity. big-O is an inequality about growth, not a vibe about “fast.” computing pack owns implementations; this pack owns the counting.

---

## 9. probability and statistics

**probability is a measure** on a space of outcomes, with values in `[0, 1]`. stories come after axioms.

kolmogorov, working form:

- `P(Ω) = 1`
- `P(A) ≥ 0`
- disjoint union adds (countable additivity in the full theory)

local identities:

- `P(A ∪ B) = P(A) + P(B) − P(A ∩ B)`
- independent: `P(A ∩ B) = P(A)P(B)`
- conditional: `P(A|B) = P(A ∩ B) / P(B)` when `P(B) > 0`

**random variable** = a numerical function of the outcome. **distribution** = how probability is spread on those numbers. discrete: pmf. continuous: pdf, probabilities from integrals, point probability zero.

named families you will be asked to recognize: bernoulli, binomial, geometric, poisson; uniform, exponential, normal. parameters live in the definition. numerical cdf/ppf values: call **EasyLM calc** (`normal_cdf`, `binom_pmf`, …) or fetch NIST. do not invent a tail probability.

**Bayes.** from the definition of conditional probability, when P(B) > 0:

\[
P(A\mid B) = \frac{P(B\mid A)\,P(A)}{P(B)}
\]

and the law of total probability expands the denominator over a partition \{A_i\}:

\[
P(B) = \sum_i P(B\mid A_i)\,P(A_i)
\]

so

\[
P(A_i\mid B) = \frac{P(B\mid A_i)\,P(A_i)}{\sum_j P(B\mid A_j)\,P(A_j)}
\]

this is not a third kind of probability. it is the same axioms, rearranged. **prior** P(A_i) is the weight before seeing B. **likelihood** P(B|A_i) is the sampling story. **posterior** P(A_i|B) is the updated weight. skip the prior and you have not used Bayes; you have a likelihood ratio looking for a home.

worked Bayes method (finite partition):

1. name the partition (the A_i are exclusive and exhaustive).
2. write the prior numbers (they must sum to 1).
3. write P(B|A_i) for each i from the problem statement — these are not the posteriors.
4. compute each joint P(B and A_i) = P(B|A_i) P(A_i).
5. P(B) = sum of joints. posterior = joint / P(B). EasyLM calc for the arithmetic.
6. check: posteriors sum to 1; a rare A_i with a noisy test stays rare unless the likelihood ratio is huge.

base-rate neglect is the usual failure: a highly specific test for a rare event still yields a modest posterior. methods pack uses the same identity for study design; this pack owns the algebra.

independence is the special case P(A|B) = P(A), which is equivalent to P(A ∩ B) = P(A)P(B). Bayes does not assume independence; it is most useful when they are not.

**expectation, variance.** mean is a center; variance is spread. linearity of expectation holds even without independence. variance of a sum needs uncorrelated / independent to drop the cross term — say which you used.

**statistics** infers about a **population** from a **sample**. estimate, interval, test. a p-value is a tail probability under a stated null. it is not “probability the hypothesis is true.”

**correlation is not cause.** two series can move together because of a third variable, a trend, or chance. regression is a fitted map, not a proof of mechanism.

sample vs population, bias vs variance, design of experiments: NIST e-handbook door. do not invent a critical value. call EasyLM calc or fetch.

---

## 10. number theory

integers, divisibility, primes, congruences.

**divides.** `a | b` means `b = aq` for some integer `q`. division algorithm: remainder in `{0, …, |a|−1}` for `a ≠ 0`.

**gcd**, euclidean algorithm. **primes**: integers `> 1` whose only positive divisors are 1 and themselves. unique factorization (fundamental theorem of arithmetic) — existence and uniqueness of prime factorization, up to order.

**modular arithmetic.** `a ≡ b (mod n)` means `n` divides `a − b`. this is the ring `ℤ/nℤ`. invertible elements exist iff gcd with `n` is 1.

**named theorems** (fermat little, euler totient, chinese remainder): fetch a number-theory door for the exact hypothesis. do not quote a modulus example from memory if the job cares.

**Collatz / 3n+1.** hailstone map: if even, divide by 2; if odd, `3n+1`. conjecture: every positive integer eventually reaches 1. **open.** do not announce a proof. verification bounds and partial results: fetch a number-theory door / arXiv, then cite. a proposed solution is not settled until the field says so.

other famous opens (goldbach, twin primes, Riemann): name them as open. clay millennium list is a door, not a scoreboard you recite.

---

## 11. numerical analysis and optimization

**numerical analysis** studies algorithms that approximate mathematical objects with finite arithmetic.

the three sins: **roundoff** (IEEE 754 floats are finite), **truncation** (you stopped a series or a mesh), **ill-conditioning** (the problem itself amplifies input error). a stable algorithm does not make a well-conditioned problem worse than it has to.

working list: root-finding (bisection, newton — newton needs a derivative and a good start), interpolation vs least squares, quadrature, timestepping for ODE, gaussian elimination with pivoting. complexity and error bounds live in the course, not in this page.

**IEEE 754** is the floating-point spec. fetch the IEEE door. python `float` is binary64 on this stack; if you need exact rationals, say so and use a CAS / fractions.

**optimization.** maximize or minimize `f` over a set. unconstrained: critical points `∇f = 0`, then hessian / tests / numerics. constrained: lagrange, KKT (DEEP). linear programming, convex programs: the constraint set’s shape is the whole subject. a local min is not global unless convexity (or a special structure) says so.

**check:** report the algorithm, the stopping rule, and the residual. a number with no residual is a decoration.

---

## 12. compute on this stack

math on this box is a **tool**, not a tongue.

| job | do |
|---|---|
| arithmetic, algebra, calculus, undergrad stats | **EasyLM calc** |
| convert units | **EasyLM units** |
| what is a derivative | this book, then a door |
| a named constant’s digits | NIST https://physics.nist.gov/cuu/Constants/ · DLMF |
| a named theorem’s hypotheses | fetch the door, cite |

never subtract, invert, or differentiate in model weights. fluent wrong integer is the failure mode. format `expr`. pass `result`. `ok` false → DONT_KNOW. do not round unless asked.

adjacent packs: `../computing/` (langs, algorithms) · `../physics/` (applied constants live there, fetched from NIST) · `../methods/` (design of a test). this pack owns the *structure*.

special functions, integrals with no elementary antiderivative, high-precision digits: **NIST DLMF**. do not scrape a blog table.

---

## 13. how to attack a problem

1. restate **given** and **unknown** in one sentence each.
2. name the **structure** (ch 0 table).
3. write **domain** and what must stay true (units, degree, probability in `[0,1]`, matrix shape).
4. pick a **move**: isolate, substitute, invert, differentiate, integrate, induct, count, simulate.
5. **compute** with EasyLM calc when the step is calculation.
6. **check:** special case, limit, dimension, inverse operation, a tiny example.
7. if a named identity is required and not on this page — fetch LINK_INDEX, cite. do not invent the statement.
8. if nothing sticks → DONT_KNOW.

stuck patterns:

| symptom | try |
|---|---|
| too many letters | rename; set a constant to 0 or 1 and see |
| ugly algebra | factor / expand with EasyLM calc; maybe the wrong structure |
| “should be a derivative” | write the limit definition or call `diff` |
| counting argument feels off | order? repetition? overcount? |
| probability > 1 | axioms failed; you added overlapping events |
| matrix product error | write the shapes first |

---

## close

mathematics is claims with reasons. definitions first. compute with EasyLM calc. fetch a door for a named theorem, a constant, or a special function. LINK_INDEX.md is doors.

home: `warehouse/math/TEXTBOOK.md`
