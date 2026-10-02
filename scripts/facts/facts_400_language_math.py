# SPDX-License-Identifier: AGPL-3.0-or-later
"""Facts for Dewey 400 & 510: language and math."""

from .common import Fact

LANGUAGE_FACTS = [
    # Chapter 1 & 2: Structural Levels & Foundations
    Fact(
        topic="linguistic sign",
        comment="ferdinand de saussure semiotic unit uniting acoustic sound-image signifier with mental concept signified.",
        dewey="400", slug="language", chapter="chapter 1.1",
        door="https://plato.stanford.edu/entries/linguistics/", kind="definition"
    ),
    Fact(
        topic="arbitrariness of the sign",
        comment="saussurean principle that there is no natural or intrinsic link between phonetic signifier and concept signified.",
        dewey="400", slug="language", chapter="chapter 1.1",
        door="https://plato.stanford.edu/entries/linguistics/"
    ),
    Fact(
        topic="phoneme",
        comment="smallest contrastive unit in a language phonological system capable of distinguishing one word meaning from another.",
        dewey="400", slug="language", chapter="chapter 2.1",
        door="https://www.internationalphoneticassociation.org/", kind="definition"
    ),
    Fact(
        topic="morpheme",
        comment="smallest meaningful or grammatical morphological unit in a language that cannot be further divided.",
        dewey="400", slug="language", chapter="chapter 2.2",
        door="https://plato.stanford.edu/entries/linguistics/", kind="definition"
    ),
    Fact(
        topic="syntax",
        comment="rules and hierarchical structures governing how words combine into phrases, clauses, and sentences.",
        dewey="400", slug="language", chapter="chapter 2.3",
        door="https://plato.stanford.edu/entries/linguistics/", kind="definition"
    ),
    Fact(
        topic="principle of compositionality",
        comment="gottlob frege principle stating meaning of complex expression is determined by meanings of its syntactic parts and rules used to combine them.",
        dewey="400", slug="language", chapter="chapter 2.4",
        door="https://plato.stanford.edu/entries/compositionality/"
    ),

    # Chapter 3 & 4: Generative Syntax & Universal Grammar
    Fact(
        topic="universal grammar",
        comment="noam chomsky theoretical framework positing innate biological human cognitive capacity structuring syntax acquisition.",
        dewey="400", slug="language", chapter="chapter 3.1",
        door="https://plato.stanford.edu/entries/chomsky/", kind="definition"
    ),
    Fact(
        topic="poverty of the stimulus",
        comment="argument that child linguistic competence cannot be acquired purely from degenerate environmental input without innate linguistic constraints.",
        dewey="400", slug="language", chapter="chapter 3.2",
        door="https://plato.stanford.edu/entries/chomsky/"
    ),
    Fact(
        topic="context free phrase structure grammar",
        comment="formal grammar generating syntactic tree structures via recursive production rules mapping non-terminals to constituent phrases.",
        dewey="400", slug="language", chapter="chapter 3.3",
        door="https://plato.stanford.edu/entries/linguistics/", kind="definition"
    ),

    # Chapter 5 & 6: Writing Systems & Digital Encodings
    Fact(
        topic="typology of writing systems",
        comment="classification into logographic word characters, syllabic mora graphs, alphabetic phoneme symbols, abjad consonants, and abugida alphasyllabaries.",
        dewey="400", slug="language", chapter="chapter 4.1",
        door="https://www.unicode.org/standard/standard.html"
    ),
    Fact(
        topic="unicode standard",
        comment="universal character encoding standard assigning unique numeric code points across U+0000 to U+10FFFF for all world scripts.",
        dewey="400", slug="language", chapter="chapter 5.1",
        door="https://www.unicode.org/standard/standard.html", kind="definition"
    ),
    Fact(
        topic="utf 8 byte allocation",
        comment="variable-width encoding allocating 1 byte for ASCII code points, 2 bytes for European scripts, 3 bytes for CJK, and 4 bytes for emoji.",
        dewey="400", slug="language", chapter="chapter 5.2",
        door="https://www.unicode.org/faq/utf_bom.html"
    ),

    # Chapter 7 & 8: Pragmatics, Historical Linguistics & Comparative Grammar
    Fact(
        topic="gricean cooperative principle",
        comment="four conversational maxims facilitating efficient communication: quantity of information, quality of truth, relation of relevance, manner of clarity.",
        dewey="400", slug="language", chapter="chapter 6.1",
        door="https://plato.stanford.edu/entries/implicature/"
    ),
    Fact(
        topic="grimm law",
        comment="historical linguistic sound shift showing proto-indo-european voiceless stops shifted systematically to protogermanic voiceless fricatives.",
        dewey="400", slug="language", chapter="chapter 7.1",
        door="https://www.britannica.com/topic/Grimms-law"
    ),
    Fact(
        topic="proto indo european language",
        comment="reconstructed prehistoric ancestral language ancestor of romance, germanic, slavic, indo-iranian, celtic, and greek families.",
        dewey="400", slug="language", chapter="chapter 7.2",
        door="https://www.britannica.com/topic/Proto-Indo-European-language", kind="definition"
    ),
    Fact(
        topic="sapir whorf hypothesis",
        comment="principle of linguistic relativity positing structure of human language influences its speakers world perception and cognitive patterns.",
        dewey="400", slug="language", chapter="chapter 8.1",
        door="https://plato.stanford.edu/entries/linguistics/", kind="definition"
    ),
]

MATH_FACTS = [
    # Chapter 1 & 2: Logic, Axioms & Set Theory
    Fact(
        topic="peano axioms",
        comment="five formal postulates defining natural numbers arithmetic via zero, equality relations, and successor induction function.",
        dewey="510", slug="math", chapter="chapter 1.1",
        door="https://plato.stanford.edu/entries/peano/"
    ),
    Fact(
        topic="zermelo fraenkel set theory",
        comment="standard foundational axiomatic system of modern mathematics augmented with axiom of choice designated ZFC.",
        dewey="510", slug="math", chapter="chapter 2.1",
        door="https://plato.stanford.edu/entries/set-theory/", kind="definition"
    ),
    Fact(
        topic="russell paradox",
        comment="bertrand russell 1901 proof that naive set comprehension fails because set of all sets that do not contain themselves entails contradiction.",
        dewey="510", slug="math", chapter="chapter 2.2",
        door="https://plato.stanford.edu/entries/russell-paradox/"
    ),
    Fact(
        topic="cantor diagonal argument",
        comment="georg cantor proof establishing that real numbers are uncountably infinite, having cardinality strictly greater than natural numbers.",
        dewey="510", slug="math", chapter="chapter 2.3",
        door="https://plato.stanford.edu/entries/set-theory/"
    ),

    # Chapter 3 & 4: Abstract Algebra & Linear Algebra
    Fact(
        topic="mathematical group definition",
        comment="algebraic structure consisting of set equipped with binary operation satisfying closure, associativity, identity element, and inverse elements.",
        dewey="510", slug="math", chapter="chapter 3.1",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),
    Fact(
        topic="mathematical field definition",
        comment="algebraic structure with commutative addition and multiplication operations where every non-zero element has multiplicative inverse.",
        dewey="510", slug="math", chapter="chapter 3.2",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),
    Fact(
        topic="eigenvalue equation",
        comment="linear transformation identity A times vector v equals scalar lambda times vector v, where lambda is eigenvalue and v is eigenvector.",
        dewey="510", slug="math", chapter="chapter 4.1",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),
    Fact(
        topic="matrix determinant",
        comment="scalar attribute of square matrix characterizing volume scaling factor and invertibility, where non-zero determinant implies invertible matrix.",
        dewey="510", slug="math", chapter="chapter 4.2",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),
    Fact(
        topic="spectral theorem",
        comment="theorem stating any symmetric real matrix or hermitian complex operator can be diagonalized by an orthogonal or unitary matrix.",
        dewey="510", slug="math", chapter="chapter 4.3",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),
    Fact(
        topic="singular value decomposition",
        comment="matrix factorization factoring arbitrary m by n real matrix into orthogonal matrix U, diagonal matrix Sigma, and transposed orthogonal matrix V.",
        dewey="510", slug="math", chapter="chapter 4.4",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),

    # Chapter 5 & 6: Real Analysis, Limits & Calculus
    Fact(
        topic="epsilon delta limit definition",
        comment="formal limit definition stating limit of f(x) as x approaches c is L if for every epsilon greater than zero exists delta greater than zero.",
        dewey="510", slug="math", chapter="chapter 5.1",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),
    Fact(
        topic="bolzano weierstrass theorem",
        comment="real analysis theorem stating every bounded sequence of real numbers has a convergent subsequence.",
        dewey="510", slug="math", chapter="chapter 5.2",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),
    Fact(
        topic="fundamental theorem of calculus",
        comment="theorem establishing that differentiation and integration are inverse operations: definite integral of derivative f' equals f(b) minus f(a).",
        dewey="510", slug="math", chapter="chapter 5.3",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),
    Fact(
        topic="taylor series expansion",
        comment="representation of smooth infinitely differentiable function as infinite polynomial sum of derivatives divided by n factorial.",
        dewey="510", slug="math", chapter="chapter 5.4",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),
    Fact(
        topic="euler identity",
        comment="mathematical formula connecting five fundamental constants: e raised to power i pi plus one equals zero.",
        dewey="510", slug="math", chapter="chapter 6.1",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),

    # Chapter 7 & 8: Number Theory & Probability
    Fact(
        topic="fundamental theorem of arithmetic",
        comment="every integer greater than one can be represented uniquely as product of prime factors up to permutation order.",
        dewey="510", slug="math", chapter="chapter 7.1",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),
    Fact(
        topic="euclid prime proof",
        comment="proof demonstrating infinitely many primes exist because product of all finite primes plus one yields new prime or composite with new prime factor.",
        dewey="510", slug="math", chapter="chapter 7.2",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),
    Fact(
        topic="prime number theorem",
        comment="asymptotic distribution of prime numbers stating number of primes less than x approaches x divided by natural logarithm of x.",
        dewey="510", slug="math", chapter="chapter 7.3",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),
    Fact(
        topic="fermat little theorem",
        comment="number theory theorem stating if p is prime and a not divisible by p, then a raised to power p minus one is congruent to 1 modulo p.",
        dewey="510", slug="math", chapter="chapter 7.4",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),
    Fact(
        topic="central limit theorem",
        comment="probability theorem establishing that sum or average of independent identically distributed random variables approaches normal distribution.",
        dewey="510", slug="math", chapter="chapter 8.1",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),
    Fact(
        topic="cauchy schwarz inequality",
        comment="inner product inequality stating absolute inner product of vectors u and v is less than or equal to norm of u times norm of v.",
        dewey="510", slug="math", chapter="chapter 8.2",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),
]
