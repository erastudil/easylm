---
title: "math — undergrad textbook"
date: "2026-09-13"
status: living · undergrad · the-stacks
home: "stacks/math/"
related:
  - "../physics/"
  - "../computing/"
  - "../philosophy/"
  - "../methods/"
---

# Mathematics & Analysis — Proof Theory, Algebra, Real Analysis & Discrete Structures

A comprehensive undergraduate textbook covering mathematical foundations, formal proof systems, abstract algebra, linear algebra, multivariable analysis, complex analysis, ordinary and partial differential equations, probability theory, and discrete mathematics.

---

## 0. Syllabus & Structural Map

Mathematics is the rigorous study of structural relations, abstract geometries, transformations, and quantitative invariants. Mathematical statements are validated not by empirical observation, but by deductive demonstration from explicit axiomatic foundations.

```
+---------------------------------------------------------------------------------------------------+
|                                     THE MATHEMATICAL LANDSCAPE                                    |
+---------------------------------------------------------------------------------------------------+
|  FOUNDATIONS & PROOFS (Logic) | Propositional & Predicate Calculus · ZFC Axioms · Proof Forms     |
+-------------------------------+-------------------------------------------------------------------+
|  ALGEBRAIC STRUCTURES (Group) | Groups · Rings · Fields · Ideals · Morphisms · Galois Foundations |
+-------------------------------+-------------------------------------------------------------------+
|  LINEAR ALGEBRA (Spaces)      | Vector Spaces · Transformations · Spectral Theorem · SVD · Norms  |
+-------------------------------+-------------------------------------------------------------------+
|  ANALYSIS & CALCULUS (Limits) | Metric Spaces · Completeness · ε-δ Limits · Lebesgue Integration  |
+-------------------------------+-------------------------------------------------------------------+
|  COMPLEX ANALYSIS (i)         | Holomorphic Maps · Cauchy-Riemann · Contour Integrals · Residues  |
+-------------------------------+-------------------------------------------------------------------+
|  DIFFERENTIAL EQUATIONS (ODE) | Linear ODEs · Laplace Transforms · Boundary Value PDEs · Heat/Wave|
+-------------------------------+-------------------------------------------------------------------+
|  PROBABILITY & DATA (Chance)  | Kolmogorov Axioms · Bayes Theorem · Central Limit · Markov Chains |
+-------------------------------+-------------------------------------------------------------------+
|  DISCRETE STRUCTURES (Graphs) | Combinatorics · Graph Theory · Generating Functions · Induction   |
+---------------------------------------------------------------------------------------------------+
```

### Table of Contents

1. [Chapter 1: Mathematical Logic & Structural Proof Systems](#1-mathematical-logic--structural-proof-systems)
2. [Chapter 2: Number Systems & Set-Theoretic Foundations](#2-number-systems--set-theoretic-foundations)
3. [Chapter 3: Abstract Algebra: Groups, Rings & Fields](#3-abstract-algebra-groups-rings--fields)
4. [Chapter 4: Linear Algebra, Spectral Theory & Inner Product Spaces](#4-linear-algebra-spectral-theory--inner-product-spaces)
5. [Chapter 5: Real Analysis: Metric Spaces, Continuity & Limits](#5-real-analysis-metric-spaces-continuity--limits)
6. [Chapter 6: Differential & Integral Calculus](#6-differential--integral-calculus)
7. [Chapter 7: Vector Calculus & Integral Theorems](#7-vector-calculus--integral-theorems)
8. [Chapter 8: Complex Analysis & Contour Integration](#8-complex-analysis--contour-integration)
9. [Chapter 9: Differential Equations & Dynamical Systems](#9-differential-equations--dynamical-systems)
10. [Chapter 10: Probability Theory, Random Variables & Stochastic Systems](#10-probability-theory-random-variables--stochastic-systems)
11. [Chapter 11: Combinatorics, Generating Functions & Graph Theory](#11-combinatorics-generating-functions--graph-theory)

---

## 1. Mathematical Logic & Structural Proof Systems

### 1.1 Propositional & First-Order Predicate Logic

Mathematical arguments are built from declarative propositions evaluated under truth-functional semantics:
- **Implication ($\implies$):** $P \implies Q \equiv \neg P \lor Q$. False premises vacuously imply any conclusion.
- **Contrapositive Equivalence:** $P \implies Q \iff \neg Q \implies \neg P$.
- **Quantifiers:**
  - Universal ($\forall x \in S, P(x)$): "For all $x$ in $S$, $P(x)$ holds."
  - Existential ($\exists x \in S \text{ such that } P(x)$): "There exists at least one $x$ in $S$ satisfying $P(x)$."
  - Quantifier order is non-commutative: $\forall \varepsilon > 0 \, \exists \delta > 0$ is fundamentally distinct from $\exists \delta > 0 \, \forall \varepsilon > 0$.

### 1.2 The Anatomy of Proof Styles

1. **Direct Proof:** Unfolding definitions and chaining established theorems:
   $$P \implies Q_1 \implies Q_2 \implies \dots \implies Q$$
2. **Proof by Contraposition:** Proving the logically equivalent assertion $\neg Q \implies \neg P$.
3. **Proof by Contradiction (*Reductio ad Absurdum*):** Assuming the conjunction $P \land \neg Q$ and deriving a formal impossibility ($R \land \neg R \equiv \bot$).
4. **Mathematical Induction:** For statements $P(n)$ over the natural numbers $\mathbb{N}$:
   - *Base Case:* Establish $P(n_0)$ is true.
   - *Inductive Step:* Prove $\forall k \ge n_0, P(k) \implies P(k+1)$.
   - Conclude $\forall n \ge n_0, P(n)$ holds.
5. **Proof by Construction vs. Existence:** Demonstrating existence by exhibiting an explicit algorithm or instance, contrasted with non-constructive proofs (e.g. Intermediate Value Theorem, Axiom of Choice).

---

## 2. Number Systems & Set-Theoretic Foundations

### 2.1 The Nested Hierarchy of Numbers

$$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}$$
- **Naturals ($\mathbb{N}$):** Peano axioms (successor function $S(n)$, induction schema).
- **Integers ($\mathbb{Z}$):** Closure under subtraction; forms an additive abelian group and integral domain.
- **Rationals ($\mathbb{Q}$):** Equivalence classes of pairs $(a, b)$ with $b \ne 0$; forms an Archimedean field, but topologically incomplete (contains gaps, e.g. $\sqrt{2} \notin \mathbb{Q}$).
- **Reals ($\mathbb{R}$):** Unique complete ordered field; constructed via Dedekind cuts or Cauchy sequences of rationals. Possesses the **Least Upper Bound (Supremum) Property**.
- **Complex Numbers ($\mathbb{C}$):** Algebraic closure of $\mathbb{R}$ obtained by adjoining the imaginary unit $i = \sqrt{-1}$. By the Fundamental Theorem of Algebra, every polynomial of degree $n \ge 1$ with complex coefficients has exactly $n$ complex roots (counting multiplicity).

---

## 3. Abstract Algebra: Groups, Rings & Fields

### 3.1 Group Theory

A group $(G, \cdot)$ is a set equipped with a binary operation satisfying:
1. **Closure:** $\forall a, b \in G, a \cdot b \in G$.
2. **Associativity:** $\forall a, b, c \in G, (a \cdot b) \cdot c = a \cdot (b \cdot c)$.
3. **Identity Element:** $\exists e \in G \text{ such that } \forall a \in G, e \cdot a = a \cdot e = a$.
4. **Inverse Element:** $\forall a \in G, \exists a^{-1} \in G \text{ such that } a \cdot a^{-1} = a^{-1} \cdot a = e$.

- **Lagrange's Theorem:** If $H$ is a subgroup of a finite group $G$, then the order of $H$ divides the order of $G$:
  $$|G| = [G : H] \cdot |H|$$
- **Normal Subgroups & Quotient Groups:** A subgroup $N \le G$ is normal ($gNg^{-1} = N, \forall g \in G$) if and only if the coset space $G/N$ forms a well-defined quotient group under coset multiplication.

### 3.2 Rings & Fields

- **Ring $(R, +, \cdot)$:** An abelian group under addition and a monoid under multiplication, satisfying left and right distributivity.
- **Field $(F, +, \cdot)$:** A commutative ring with unity where every non-zero element possesses a multiplicative inverse (e.g. $\mathbb{Q}, \mathbb{R}, \mathbb{C}$, finite Galois fields $\mathbb{F}_p$).

---

## 4. Linear Algebra, Spectral Theory & Inner Product Spaces

### 4.1 Vector Spaces & Linear Transformations

A vector space $V$ over a field $F$ satisfies axioms of vector addition and scalar multiplication. A mapping $T: V \to W$ is linear if:
$$T(c\mathbf{u} + \mathbf{v}) = cT(\mathbf{u}) + T(\mathbf{v})$$
The **Rank-Nullity Theorem** establishes:
$$\dim(\ker(T)) + \dim(\operatorname{im}(T)) = \dim(V)$$

### 4.2 Eigenvalues, Eigenvectors & Diagonalization

For a square linear operator $A \in \mathbb{R}^{n \times n}$, a non-zero vector $\mathbf{v}$ is an eigenvector associated with eigenvalue $\lambda$ if:
$$A\mathbf{v} = \lambda\mathbf{v} \iff (A - \lambda I)\mathbf{v} = \mathbf{0}$$
Non-trivial solutions exist if and only if the **characteristic polynomial** vanishes:
$$\det(A - \lambda I) = 0$$

- **The Spectral Theorem:** Every real symmetric matrix ($A = A^T$) is orthogonally diagonalizable:
  $$A = Q \Lambda Q^T$$
  where $Q$ is an orthogonal matrix of eigenvectors ($Q^T Q = I$) and $\Lambda$ is a diagonal matrix of real eigenvalues.
- **Singular Value Decomposition (SVD):** Any matrix $M \in \mathbb{R}^{m \times n}$ factors uniquely into:
  $$M = U \Sigma V^T$$
  where $U \in \mathbb{R}^{m \times m}$ and $V \in \mathbb{R}^{n \times n}$ are orthogonal, and $\Sigma \in \mathbb{R}^{m \times n}$ contains non-negative singular values $\sigma_i = \sqrt{\lambda_i(M^T M)}$.

---

## 5. Real Analysis: Metric Spaces, Continuity & Limits

### 5.1 Formal Epsilon-Delta Limits

Let $f: D \subseteq \mathbb{R} \to \mathbb{R}$. The limit $\lim_{x \to c} f(x) = L$ means:
$$\forall \varepsilon > 0, \, \exists \delta > 0 \text{ such that } 0 < |x - c| < \delta \implies |f(x) - L| < \varepsilon$$

### 5.2 Metric Topology & Compactness

A metric space $(M, d)$ is a set equipped with a distance function satisfying positivity, symmetry, and the triangle inequality $d(x, z) \le d(x, y) + d(y, z)$.
- **Completeness:** A metric space is complete if every Cauchy sequence ($\lim_{m,n \to \infty} d(x_m, x_n) = 0$) converges to a limit inside $M$.
- **Heine-Borel Theorem:** In Euclidean space $\mathbb{R}^n$, a subset $K$ is compact (every open cover has a finite subcover) if and only if it is closed and bounded.
- **Extreme Value Theorem:** Continuous real-valued functions on compact sets attain their absolute maximum and minimum.

---

## 6. Vector Calculus & Integral Theorems

The fundamental theorems of vector calculus generalize the Fundamental Theorem of Calculus ($\int_a^b f'(x)dx = f(b) - f(a)$) to differential forms on manifolds:

```
+---------------------------------------------------------------------------------------------------+
|                                  THE INTEGRAL THEOREMS OF VECTOR CALCULUS                         |
+---------------------------------------------------------------------------------------------------+
|  1. GREEN'S THEOREM (Plane)      |  ∮_C (P dx + Q dy) = ∬_R (∂Q/∂x - ∂P/∂y) dA                   |
|     Line integral around loop equals double integral of curl over enclosed planar region.        |
+----------------------------------+----------------------------------------------------------------+
|  2. STOKES' THEOREM (Surface)    |  ∮_∂S F · dr = ∬_S (∇ × F) · n̂ dS                              |
|     Circulation of vector field around boundary curve equals flux of curl across surface.         |
+----------------------------------+----------------------------------------------------------------+
|  3. DIVERGENCE THEOREM (Gauss)   |  ∯_∂V F · n̂ dS = ∭_V (∇ · F) dV                                |
|     Outward flux of vector field across closed surface equals volume integral of its divergence.  |
+---------------------------------------------------------------------------------------------------+
```

---

## 7. Complex Analysis & Contour Integration

### 7.1 Holomorphic Functions & Cauchy-Riemann Equations

A function $f(z) = u(x, y) + i v(x, y)$ is complex-differentiable at $z_0 = x_0 + i y_0$ if and only if the partial derivatives of $u$ and $v$ satisfy the **Cauchy-Riemann equations**:
$$\frac{\partial u}{\partial x} = \frac{\partial v}{\partial y} \quad \text{and} \quad \frac{\partial u}{\partial y} = -\frac{\partial v}{\partial x}$$

### 7.2 Cauchy's Residue Theorem

If $f$ is holomorphic inside and on a positively oriented simple closed contour $C$, except for isolated singularities at points $z_1, z_2, \dots, z_k$, then:
$$\oint_C f(z) \, dz = 2\pi i \sum_{j=1}^k \operatorname{Res}(f, z_j)$$
This provides a powerful method for evaluating difficult improper real integrals $\int_{-\infty}^\infty f(x)dx$ via contour integration in the complex plane.

---

## 8. Probability Theory & Stochastic Systems

### 8.1 Kolmogorov Axioms & Conditional Probability

Probability is defined on a sample space $\Omega$ with event $\sigma$-algebra $\mathcal{F}$ and measure $P$:
1. $P(E) \ge 0$ for all $E \in \mathcal{F}$.
2. $P(\Omega) = 1$.
3. For mutually exclusive events $E_1, E_2, \dots$: $P(\bigcup_{i=1}^\infty E_i) = \sum_{i=1}^\infty P(E_i)$.

- **Bayes' Theorem:** Updating conditional probabilities in light of new evidence:
  $$P(A|B) = \frac{P(B|A) P(A)}{P(B)} = \frac{P(B|A) P(A)}{\sum_i P(B|A_i) P(A_i)}$$

- **The Central Limit Theorem:** The normalized sum of $n$ independent, identically distributed random variables with mean $\mu$ and variance $\sigma^2$ converges in distribution to the standard Gaussian normal distribution $\mathcal{N}(0, 1)$ as $n \to \infty$:
  $$Z_n = \frac{\sum_{i=1}^n X_i - n\mu}{\sigma \sqrt{n}} \xrightarrow{d} \mathcal{N}(0, 1)$$
