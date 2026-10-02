# FACTS — Mathematics & Analysis (510)
# Canonical Progen dialect facts grounded in TEXTBOOK.md and LINK_INDEX.md.

peano axioms : five formal postulates defining natural numbers arithmetic via zero, equality relations, and successor induction function. // door https://plato.stanford.edu/entries/peano/ // ref chapter 1.1

zermelo fraenkel set theory = standard foundational axiomatic system of modern mathematics augmented with axiom of choice designated ZFC. // door https://plato.stanford.edu/entries/set-theory/ // ref chapter 2.1

russell paradox : bertrand russell 1901 proof that naive set comprehension fails because set of all sets that do not contain themselves entails contradiction. // door https://plato.stanford.edu/entries/russell-paradox/ // ref chapter 2.2

cantor diagonal argument : georg cantor proof establishing that real numbers are uncountably infinite, having cardinality strictly greater than natural numbers. // door https://plato.stanford.edu/entries/set-theory/ // ref chapter 2.3

mathematical group definition = algebraic structure consisting of set equipped with binary operation satisfying closure, associativity, identity element, and inverse elements. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 3.1

mathematical field definition = algebraic structure with commutative addition and multiplication operations where every non-zero element has multiplicative inverse. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 3.2

eigenvalue equation : linear transformation identity A times vector v equals scalar lambda times vector v, where lambda is eigenvalue and v is eigenvector. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 4.1

matrix determinant = scalar attribute of square matrix characterizing volume scaling factor and invertibility, where non-zero determinant implies invertible matrix. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 4.2

spectral theorem : theorem stating any symmetric real matrix or hermitian complex operator can be diagonalized by an orthogonal or unitary matrix. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 4.3

singular value decomposition : matrix factorization factoring arbitrary m by n real matrix into orthogonal matrix U, diagonal matrix Sigma, and transposed orthogonal matrix V. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 4.4

epsilon delta limit definition : formal limit definition stating limit of fx as x approaches c is L if for every epsilon greater than zero exists delta greater than zero. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 5.1

bolzano weierstrass theorem : real analysis theorem stating every bounded sequence of real numbers has a convergent subsequence. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 5.2

fundamental theorem of calculus : theorem establishing that differentiation and integration are inverse operations - definite integral of derivative f' equals fb minus fa. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 5.3

taylor series expansion : representation of smooth infinitely differentiable function as infinite polynomial sum of derivatives divided by n factorial. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 5.4

euler identity : mathematical formula connecting five fundamental constants - e raised to power i pi plus one equals zero. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 6.1

fundamental theorem of arithmetic : every integer greater than one can be represented uniquely as product of prime factors up to permutation order. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 7.1

euclid prime proof : proof demonstrating infinitely many primes exist because product of all finite primes plus one yields new prime or composite with new prime factor. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 7.2

prime number theorem : asymptotic distribution of prime numbers stating number of primes less than x approaches x divided by natural logarithm of x. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 7.3

fermat little theorem : number theory theorem stating if p is prime and a not divisible by p, then a raised to power p minus one is congruent to 1 modulo p. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 7.4

central limit theorem : probability theorem establishing that sum or average of independent identically distributed random variables approaches normal distribution. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 8.1

cauchy schwarz inequality : inner product inequality stating absolute inner product of vectors u and v is less than or equal to norm of u times norm of v. // door https://ocw.mit.edu/courses/mathematics/ // ref chapter 8.2

universal quantifier $ : "For every element x in set S, property Px holds.". // door https://dlmf.nist.gov/ // ref 1.1 the anatomy of propositional and predicate logic

existential quantifier $ : "There exists at least one element x in set S satisfying Px.". // door https://dlmf.nist.gov/ // ref 1.1 the anatomy of propositional and predicate logic

the contrapositive : Strictly logically equivalent to P yields Q. If "every differentiable function is continuous," then "every discontinuous function is non-differentiable.". // door https://dlmf.nist.gov/ // ref 1.1 the anatomy of propositional and predicate logic

the converse : Not equivalent! Continuity does not imply differentiability e.g. fx = |x| at x = 0, or the Weierstrass nowhere-differentiable continuous function. // door https://dlmf.nist.gov/ // ref 1.1 the anatomy of propositional and predicate logic

direct proof : Unfolding formal definitions and establishing an unbroken deductive bridge - . // door https://dlmf.nist.gov/ // ref 1.2 the five classical proof architectures

proof by contraposition : Establishing the equivalent statement \neg Q yields \neg P. Used when the negation of the conclusion provides a more tractable algebraic starting point. // door https://dlmf.nist.gov/ // ref 1.2 the five classical proof architectures

mathematical induction : The domino effect over the well-ordered set of natural numbers \mathbb{N} - . // door https://dlmf.nist.gov/ // ref 1.2 the five classical proof architectures

constructive vs. non-constructive proofs : A constructive proof demonstrates existence by providing an explicit algorithm or formula to produce the object. A non-constructive proof invokes topological theorems such as the Intermediate Value Theorem or Brouwer's Fixed Point Theorem to prove existence while offering zero clues on how to compute it. // door https://dlmf.nist.gov/ // ref 1.2 the five classical proof architectures

natural numbers : Built from the Peano Axioms - zero exists 0 \in \mathbb{N}, every number has a unique successor Sn, zero is nobody's successor, and mathematical induction holds. // door https://dlmf.nist.gov/ // ref 2.1 the nested hierarchy of numbers

rational numbers : Equivalence classes of pairs of integers a, b with b \ne 0, under the equivalence relation a, b \sim c, d \iff ad = bc. \mathbb{Q} is dense between any two rationals lies another rational, but it is riddled with "holes." The square root of 2 \sqrt{2} is not in \mathbb{Q}, as proved by Hippasus of Metapontum. // door https://dlmf.nist.gov/ // ref 2.1 the nested hierarchy of numbers

real numbers : Constructed by filling all topological holes in \mathbb{Q} via Dedekind Cuts or equivalence classes of Cauchy Sequences. \mathbb{R} is the unique complete ordered field. Completeness is formalized by the Least Upper Bound Supremum Property - every non-empty set of real numbers bounded above has a least upper bound in \mathbb{R}. // door https://dlmf.nist.gov/ // ref 2.1 the nested hierarchy of numbers

complex numbers : Formed by adjoining the algebraic element i satisfying i^2 = -1. Geometrically, the complex plane transforms multiplication into a combined stretching and rotation - . // door https://dlmf.nist.gov/ // ref 2.1 the nested hierarchy of numbers

lagrange's theorem : For any finite group G and subgroup H \le G, the order of the subgroup |H| must evenly divide the order of the parent group |G| - . // door https://dlmf.nist.gov/ // ref 3.1 groups the mathematics of symmetry

ring $$ : An algebraic structure that has two operations - it is an abelian group under addition +, and a monoid closed, associative, has identity under multiplication \cdot, with multiplication distributing over addition - . // door https://www.itl.nist.gov/div898/handbook/ // ref 3.2 rings and fields

field $$ : A commutative ring where every non-zero element has a multiplicative inverse a \cdot a^{-1} = 1. In a field, you can freely add, subtract, multiply, and divide by anything except zero. // door https://dlmf.nist.gov/ // ref 3.2 rings and fields

the rank-nullity theorem : The dimension of the domain decomposes cleanly into the dimension of what gets flattened to zero \kerT plus the dimension of what survives in the image \operatorname{im}T - . // door https://dlmf.nist.gov/ // ref 4.1 vector spaces as stretchy sheets of space

the characteristic polynomial : \detA - \lambda I = 0. The roots of this polynomial are the system's eigenvalues. // door https://dlmf.nist.gov/ // ref 4.2 eigenvalues, eigenvectors & the spectral theorem

the spectral theorem : If a real matrix is symmetric A = A^T, its eigenvectors are mutually orthogonal, its eigenvalues are guaranteed to be purely real, and it can be factored into a pure rotation, an independent axial scaling, and a counter-rotation - . // door https://dlmf.nist.gov/ // ref 4.2 eigenvalues, eigenvectors & the spectral theorem

cauchy sequences & completeness : A sequence xn is Cauchy if its terms bunch arbitrarily close together as indices advance - \lim{m,n \to \infty} dxm, xn = 0. A space is complete if every Cauchy sequence converges to a limit that actually lives inside the space. The rational numbers \mathbb{Q} are incomplete \lim 1 + 1/n^n = e \notin \mathbb{Q}; the real numbers \mathbb{R} are complete by construction. // door https://oeis.org/ // ref 5.2 metric topology & compactness

chain rule : The derivative of a composite function is the product of rates - . // door https://dlmf.nist.gov/ // ref 6.1 the derivative the instantaneous rate of change

the fundamental theorem of calculus : The bridge connecting differential and integral calculus. Differentiation and integration are inverse operations - . // door https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/ // ref 6.2 the integral summing the infinitesimal slices

the gradient : For a scalar terrain fx, y, z, \nabla f = \left[ \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z} \right]^T points in the direction of steepest uphill ascent, and its magnitude is the rate of ascent. // door https://dlmf.nist.gov/ // ref 7.1 gradient, divergence & curl

the divergence : Measures the net outward flux of a vector field per unit volume. It is positive at sources like a faucet pouring water into a sink and negative at sinks like an open drain. // door https://dlmf.nist.gov/ // ref 7.1 gradient, divergence & curl

the curl : Measures the microscopic rotational circulation of the field. If you placed a tiny paddle wheel in a river, the curl vector points along the axis about which the paddle wheel spins, with magnitude proportional to angular speed. // door https://dlmf.nist.gov/ // ref 7.1 gradient, divergence & curl

the heat / diffusion equation : \frac{\partial u}{\partial t} = \alpha \nabla^2 u Parabolic; smooths out sharp gradients over time; irreversible. // door https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/ // ref 9.2 partial differential equations pdes of mathematical physics

the wave equation : \frac{\partial^2 u}{\partial t^2} = c^2 \nabla^2 u Hyperbolic; propagates disturbances at finite speed c without dissipation. // door https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/ // ref 9.2 partial differential equations pdes of mathematical physics

laplace's / poisson's equation : \nabla^2 u = -\rho Elliptic; describes static equilibrium fields, electrostatics, gravitational potentials. // door https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/ // ref 9.2 partial differential equations pdes of mathematical physics

countable additivity : For disjoint events E1, E2, \dots - . // door https://dlmf.nist.gov/ // ref 10.1 kolmogorov's axioms

strong law of large numbers : The sample average \bar{X}n = \frac{1}{n}\sum{i=1}^n Xi of i.i.d. variables converges almost surely to the true expected value \mu - P\lim{n \to \infty} \bar{X}n = \mu = 1. // door https://dlmf.nist.gov/ // ref 10.3 the law of large numbers & central limit theorem

the pigeonhole principle : If n items are placed into m containers and n > m, at least one container must hold more than one item. Used to prove non-obvious existence results e.g. in any group of 6 people, there are either 3 mutual acquaintances or 3 mutual strangers. // door https://dlmf.nist.gov/ // ref 11.1 the art of counting

euler's königsberg bridge problem : An Eulerian path crossing every edge exactly once exists if and only if the graph is connected and has either 0 or 2 vertices of odd degree. // door https://dlmf.nist.gov/ // ref 11.2 graph theory networks of relations

confusing implication with equivalence : Assuming P yields Q means Q yields P. For example - every differentiable function is continuous, but continuity does not imply differentiability. // door https://dlmf.nist.gov/ // ref 12.1 the top mathematical misconceptions

dividing by zero through concealed variables : In algebraic derivations, dividing by a - b without proving a \ne b produces bogus proofs that 1 = 2. // door https://dlmf.nist.gov/ // ref 12.1 the top mathematical misconceptions

treating infinity as a real number : Infinity \infty is a limit behavior or cardinality, not an element of \mathbb{R}. Performing arithmetic like \infty - \infty = 0 or \infty / \infty = 1 leads directly to mathematical nonsense. // door https://dlmf.nist.gov/ // ref 12.1 the top mathematical misconceptions

neglecting non-linear superposition : Assuming fx + y = fx + fy for non-linear operations e.g. \sqrt{a^2 + b^2} \ne a + b, and \sinx + y \ne \sin x + \sin y. // door https://dlmf.nist.gov/ // ref 12.1 the top mathematical misconceptions

the gambler's fallacy : Believing that after five coin flips of heads, tails is "due." Independent trials have no memory. // door https://dlmf.nist.gov/ // ref 12.1 the top mathematical misconceptions

understand the problem : What is the unknown? What are the given data? What is the condition? Can you satisfy the condition? Is it sufficient, redundant, or contradictory?. // door https://dlmf.nist.gov/ // ref 12.2 george pólya's four-stage problem-solving method

devise a plan : Have you seen this problem before? Look at the unknown and try to recall a familiar theorem with the same or similar unknown. Solve an easier, related problem first e.g. drop from 3 dimensions down to 2, or test n = 1, 2, 3. // door https://dlmf.nist.gov/ // ref 12.2 george pólya's four-stage problem-solving method

carry out the plan : Check each step. Can you prove clearly that each algebraic or logical step is correct?. // door https://dlmf.nist.gov/ // ref 12.2 george pólya's four-stage problem-solving method

look back : Can you check the result? Can you derive the result differently? Can you see it at a glance? Can you use the result or method for some other problem?. // door https://dlmf.nist.gov/ // ref 12.2 george pólya's four-stage problem-solving method
