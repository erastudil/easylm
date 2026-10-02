# SPDX-License-Identifier: AGPL-3.0-or-later
"""Facts for Dewey 000: methods, computing, software, security, ai_ml."""

from .common import Fact

METHODS_FACTS = [
    # Chapter 1: Philosophy of Science & Epistemological Demarcation
    Fact(
        topic="scientific method",
        comment="empirical inquiry via hypothesis generation, systematic observation, reproducible experimentation, and falsification.",
        dewey="001", slug="methods", chapter="chapter 1.1",
        door="https://plato.stanford.edu/entries/scientific-method/", kind="definition"
    ),
    Fact(
        topic="karl popper falsification",
        comment="a hypothesis is scientific only if it makes precise empirical predictions capable of being proven false.",
        dewey="001", slug="methods", chapter="chapter 1.1",
        door="https://plato.stanford.edu/entries/popper/"
    ),
    Fact(
        topic="problem of induction",
        comment="david hume philosophical finding that empirical observation of particulars cannot deductively prove universal generalizations.",
        dewey="001", slug="methods", chapter="chapter 1.1",
        door="https://plato.stanford.edu/entries/induction-problem/"
    ),
    Fact(
        topic="kuhnian paradigm shift",
        comment="revolutionary transition where accumulated empirical anomalies force scientific community to replace foundational model.",
        dewey="001", slug="methods", chapter="chapter 1.2",
        door="https://plato.stanford.edu/entries/thomas-kuhn/"
    ),
    Fact(
        topic="normal science",
        comment="scientific puzzle solving conducted within an accepted paradigm without questioning underlying foundations.",
        dewey="001", slug="methods", chapter="chapter 1.2",
        door="https://plato.stanford.edu/entries/thomas-kuhn/", kind="definition"
    ),

    # Chapter 2: Hypothesis Formulation, Operationalization & Decision Errors
    Fact(
        topic="operationalization",
        comment="process of translating an abstract theoretical concept into an empirical, measurable, and reproducible metric.",
        dewey="001", slug="methods", chapter="chapter 2.1",
        door="https://plato.stanford.edu/entries/scientific-method/", kind="definition"
    ),
    Fact(
        topic="null hypothesis",
        comment="default statistical baseline asserting no true effect, relationship, or difference exists between tested populations.",
        dewey="001", slug="methods", chapter="chapter 2.2",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),
    Fact(
        topic="alternative hypothesis",
        comment="experimental proposition asserting a genuine effect, difference, or relationship exists.",
        dewey="001", slug="methods", chapter="chapter 2.2",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),
    Fact(
        topic="type I error",
        comment="false positive decision error rejecting null hypothesis when null hypothesis is actually true.",
        dewey="001", slug="methods", chapter="chapter 2.3",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),
    Fact(
        topic="type II error",
        comment="false negative decision error failing to reject null hypothesis when alternative hypothesis is true.",
        dewey="001", slug="methods", chapter="chapter 2.3",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),
    Fact(
        topic="alpha significance level",
        comment="maximum acceptable probability of committing type I error conventionally set to 0.05 or 0.01.",
        dewey="001", slug="methods", chapter="chapter 2.3",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),
    Fact(
        topic="statistical power",
        comment="probability of correctly rejecting false null hypothesis calculated as 1 minus beta.",
        dewey="001", slug="methods", chapter="chapter 2.3",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),

    # Chapter 3: Experimental Design, Controls & Randomization
    Fact(
        topic="randomized controlled trial",
        comment="experimental study design allocating participants randomly between treatment and control groups to eliminate confounding.",
        dewey="001", slug="methods", chapter="chapter 3.1",
        door="https://training.cochrane.org/handbook", kind="definition"
    ),
    Fact(
        topic="placebo effect",
        comment="measured psychological or physiological improvement resulting from inert intervention due to subject expectation.",
        dewey="001", slug="methods", chapter="chapter 3.2",
        door="https://training.cochrane.org/handbook", kind="definition"
    ),
    Fact(
        topic="double blind protocol",
        comment="experimental control where neither participants nor researchers know treatment allocation until trial conclusion.",
        dewey="001", slug="methods", chapter="chapter 3.2",
        door="https://training.cochrane.org/handbook", kind="definition"
    ),
    Fact(
        topic="quasi experiment",
        comment="empirical study estimating causal impact of intervention without random assignment of subjects to conditions.",
        dewey="001", slug="methods", chapter="chapter 3.3",
        door="https://ocw.mit.edu/courses/economics/", kind="definition"
    ),

    # Chapter 4: Measurement Theory & Uncertainty Propagation (GUM)
    Fact(
        topic="guide to expression of uncertainty",
        comment="international JCGM metrology standard establishing unified mathematical framework for evaluating measurement uncertainty.",
        dewey="001", slug="methods", chapter="chapter 4.1",
        door="https://www.bipm.org/en/committees/jc/jcgm/publications"
    ),
    Fact(
        topic="systematic error",
        comment="predictable and reproducible directional measurement offset caused by flawed equipment calibration or environmental bias.",
        dewey="001", slug="methods", chapter="chapter 4.2",
        door="https://www.bipm.org/en/committees/jc/jcgm/publications", kind="definition"
    ),
    Fact(
        topic="random error",
        comment="unpredictable stochastic measurement variation arising from unpredictable temporal and spatial fluctuations.",
        dewey="001", slug="methods", chapter="chapter 4.2",
        door="https://www.bipm.org/en/committees/jc/jcgm/publications", kind="definition"
    ),
    Fact(
        topic="uncertainty propagation formula",
        comment="variance of function f of independent variables equals sum of squared partial derivatives times individual variances.",
        dewey="001", slug="methods", chapter="chapter 4.3",
        door="https://www.bipm.org/en/committees/jc/jcgm/publications"
    ),

    # Chapter 5: Statistical Inference, Effect Sizes & Power Analysis
    Fact(
        topic="p value",
        comment="probability of obtaining test results at least as extreme as observed data assuming null hypothesis is true.",
        dewey="001", slug="methods", chapter="chapter 5.1",
        door="https://www.nature.com/articles/d41586-019-00857-9", kind="definition"
    ),
    Fact(
        topic="cohen d",
        comment="standardized effect size measuring difference between two group means divided by pooled standard deviation.",
        dewey="001", slug="methods", chapter="chapter 5.2",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),
    Fact(
        topic="confidence interval",
        comment="interval estimated from sample data that would contain true population parameter at specified long run frequency.",
        dewey="001", slug="methods", chapter="chapter 5.3",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),

    # Chapter 6: Bayesian Inquiry & Belief Revision
    Fact(
        topic="bayes theorem",
        comment="probability of hypothesis given data equals likelihood of data given hypothesis times prior probability divided by evidence.",
        dewey="001", slug="methods", chapter="chapter 6.1",
        door="https://ocw.mit.edu/courses/mathematics/"
    ),
    Fact(
        topic="prior probability",
        comment="probability distribution assigned to hypothesis before incorporating new empirical evidence.",
        dewey="001", slug="methods", chapter="chapter 6.2",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),
    Fact(
        topic="posterior probability",
        comment="updated probability distribution of hypothesis calculated after applying bayes theorem to new data.",
        dewey="001", slug="methods", chapter="chapter 6.2",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),
    Fact(
        topic="credible interval",
        comment="bayesian interval containing true parameter value with specified subjective posterior probability.",
        dewey="001", slug="methods", chapter="chapter 6.3",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),

    # Chapter 7: Causal Inference & Directed Acyclic Graphs (DAGs)
    Fact(
        topic="causal directed acyclic graph",
        comment="graphical mathematical model representing causal assumptions via directed edges without feedback loops.",
        dewey="001", slug="methods", chapter="chapter 7.1",
        door="https://bayes.cs.ucla.edu/jp_home.html", kind="definition"
    ),
    Fact(
        topic="confounder variable",
        comment="common cause influencing both independent exposure variable and dependent outcome variable creating spurious correlation.",
        dewey="001", slug="methods", chapter="chapter 7.2",
        door="https://bayes.cs.ucla.edu/jp_home.html", kind="definition"
    ),
    Fact(
        topic="collider variable",
        comment="variable causally influenced by two distinct parent variables whose conditioning induces spurious association between parents.",
        dewey="001", slug="methods", chapter="chapter 7.2",
        door="https://bayes.cs.ucla.edu/jp_home.html", kind="definition"
    ),
    Fact(
        topic="back door criterion",
        comment="graphical condition identifying whether conditioning on set of covariates blocks all spurious non-causal paths.",
        dewey="001", slug="methods", chapter="chapter 7.3",
        door="https://bayes.cs.ucla.edu/jp_home.html"
    ),
    Fact(
        topic="simpson paradox",
        comment="statistical phenomenon wherein statistical trend observed in aggregate data reverses when partitioned into subgroups.",
        dewey="001", slug="methods", chapter="chapter 7.4",
        door="https://bayes.cs.ucla.edu/jp_home.html", kind="definition"
    ),
    Fact(
        topic="bradford hill criteria",
        comment="nine epidemiological guidelines assessing causality: strength, consistency, specificity, temporality, gradient, plausibility, coherence, experiment, analogy.",
        dewey="001", slug="methods", chapter="chapter 7.5",
        door="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1898525/"
    ),

    # Chapter 8: Survey Methodology, Sampling & Observational Biases
    Fact(
        topic="stratified sampling",
        comment="probability sampling method dividing population into homogeneous subpopulations before drawing independent random samples.",
        dewey="001", slug="methods", chapter="chapter 8.1",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),
    Fact(
        topic="selection bias",
        comment="systematic distortion resulting from non-random participant recruitment leading to unrepresentative sample.",
        dewey="001", slug="methods", chapter="chapter 8.2",
        door="https://training.cochrane.org/handbook", kind="definition"
    ),
    Fact(
        topic="survivorship bias",
        comment="logical error focusing exclusively on entities passing selection process while overlooking failures that fell silent.",
        dewey="001", slug="methods", chapter="chapter 8.3",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),

    # Chapter 9: The Replication Crisis, Pre-Registration & Open Science
    Fact(
        topic="replication crisis",
        comment="methodological crisis in behavioral and biomedical science where independent teams fail to replicate landmark published findings.",
        dewey="001", slug="methods", chapter="chapter 9.1",
        door="https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.0020124", kind="definition"
    ),
    Fact(
        topic="p hacking",
        comment="data dredging practice manipulating model variables, subsets, and covariates until p-value drops below significance threshold.",
        dewey="001", slug="methods", chapter="chapter 9.2",
        door="https://osf.io/", kind="definition"
    ),
    Fact(
        topic="harking",
        comment="hypothesizing after results are known presenting post hoc exploratory findings as a priori confirmatory hypotheses.",
        dewey="001", slug="methods", chapter="chapter 9.2",
        door="https://osf.io/", kind="definition"
    ),
    Fact(
        topic="study preregistration",
        comment="public timestamped archiving of experimental design, hypotheses, and analytical pipeline prior to data collection.",
        dewey="001", slug="methods", chapter="chapter 9.3",
        door="https://osf.io/", kind="definition"
    ),

    # Chapter 10: Evidence Synthesis, Systematic Reviews & Meta-Analysis
    Fact(
        topic="systematic review",
        comment="comprehensive literature synthesis identifying, appraising, and synthesizing all empirical evidence against explicit eligibility criteria.",
        dewey="001", slug="methods", chapter="chapter 10.1",
        door="http://www.prisma-statement.org/", kind="definition"
    ),
    Fact(
        topic="meta analysis",
        comment="statistical integration combining quantitative effect estimates across independent empirical studies into single pooled effect size.",
        dewey="001", slug="methods", chapter="chapter 10.2",
        door="https://training.cochrane.org/handbook", kind="definition"
    ),
    Fact(
        topic="forest plot",
        comment="graphical representation displaying effect size estimates and confidence intervals for individual studies alongside pooled summary.",
        dewey="001", slug="methods", chapter="chapter 10.3",
        door="https://training.cochrane.org/handbook", kind="definition"
    ),
    Fact(
        topic="publication bias",
        comment="systematic distortion where positive statistically significant findings are published more readily than null or negative results.",
        dewey="001", slug="methods", chapter="chapter 10.4",
        door="https://training.cochrane.org/handbook", kind="definition"
    ),
    Fact(
        topic="funnel plot",
        comment="scatter plot of study effect size against sample precision used to visually detect publication bias via asymmetry.",
        dewey="001", slug="methods", chapter="chapter 10.4",
        door="https://training.cochrane.org/handbook", kind="definition"
    ),

    # Chapter 11: Feynman Cargo Cult Science & Core Fallacies
    Fact(
        topic="cargo cult science",
        comment="research mimicking outward formalities and apparatus of science while lacking integrity to thoroughly test contradictory explanations.",
        dewey="001", slug="methods", chapter="chapter 11.1",
        door="https://calteches.library.caltech.edu/51/2/CargoCult.htm", kind="definition"
    ),
    Fact(
        topic="goodhart law",
        comment="when a measure becomes a target, it ceases to be a good measure.",
        dewey="001", slug="methods", chapter="chapter 11.2",
        door="https://ocw.mit.edu/courses/economics/"
    ),
    Fact(
        topic="ecological fallacy",
        comment="logical error inferring individual level relationships directly from aggregated group level statistics.",
        dewey="001", slug="methods", chapter="chapter 11.3",
        door="https://ocw.mit.edu/courses/mathematics/", kind="definition"
    ),
]

COMPUTING_FACTS = [
    # Chapter 1: Theory of Computation & Machine Models
    Fact(
        topic="universal turing machine",
        comment="abstract mathematical model executing any computable transformation via state transitions over infinite discrete tape.",
        dewey="004", slug="computing", chapter="chapter 1.2",
        door="https://plato.stanford.edu/entries/turing-machine/", kind="definition"
    ),
    Fact(
        topic="church turing thesis",
        comment="conjecture that any function computeable by effective algorithm can be computed by universal turing machine.",
        dewey="004", slug="computing", chapter="chapter 1.2",
        door="https://plato.stanford.edu/entries/church-turing/"
    ),
    Fact(
        topic="halting problem",
        comment="alan turing 1936 proof that no general algorithm exists that can decide whether arbitrary program halts on given input.",
        dewey="004", slug="computing", chapter="chapter 1.3",
        door="https://plato.stanford.edu/entries/turing-machine/"
    ),
    Fact(
        topic="shannon entropy formula",
        comment="information uncertainty H of discrete variable equals negative sum of probability p times log base 2 of p.",
        dewey="004", slug="computing", chapter="chapter 1.4",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ),
    Fact(
        topic="shannon channel capacity",
        comment="maximum error-free channel capacity C equals bandwidth B times log2 of one plus signal to noise ratio.",
        dewey="004", slug="computing", chapter="chapter 1.4",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ),

    # Chapter 2: Computer Architecture & Hardware Hierarchy
    Fact(
        topic="von neumann architecture",
        comment="computer system sharing unified physical memory space and bus for both program instructions and runtime data.",
        dewey="004", slug="computing", chapter="chapter 2.1",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),
    Fact(
        topic="von neumann bottleneck",
        comment="throughput throughput limit imposed by shared physical bus between central processing unit and memory.",
        dewey="004", slug="computing", chapter="chapter 2.1",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),
    Fact(
        topic="instruction pipeline",
        comment="processor architecture technique executing multiple instruction phases in parallel across fetch, decode, execute, memory, writeback.",
        dewey="004", slug="computing", chapter="chapter 2.2",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),
    Fact(
        topic="cache line",
        comment="minimum unit of data transferred between DRAM and CPU cache hierarchy, conventionally 64 bytes.",
        dewey="004", slug="computing", chapter="chapter 2.3",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),
    Fact(
        topic="memory hierarchy",
        comment="stratified storage architecture balancing access latency against capacity: registers, L1 cache, L2 cache, L3 cache, DRAM, NVMe SSD.",
        dewey="004", slug="computing", chapter="chapter 2.3",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),

    # Chapter 3: Data Representation, Encodings & Memory Layout
    Fact(
        topic="twos complement",
        comment="binary signed integer encoding where negative value formed by bitwise NOT followed by adding one.",
        dewey="004", slug="computing", chapter="chapter 3.1",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),
    Fact(
        topic="ieee 754 binary64",
        comment="standard double precision floating point format composed of 1 sign bit, 11 exponent bits, and 52 fraction bits.",
        dewey="004", slug="computing", chapter="chapter 3.2",
        door="https://standards.ieee.org/ieee/754/6210/"
    ),
    Fact(
        topic="utf 8 encoding",
        comment="variable length Unicode character encoding utilizing 1 to 4 bytes backwards compatible with 7-bit ASCII.",
        dewey="004", slug="computing", chapter="chapter 3.3",
        door="https://www.unicode.org/faq/utf_bom.html", kind="definition"
    ),
    Fact(
        topic="endianness",
        comment="byte ordering of multi-byte words in physical memory where little-endian stores least significant byte at lowest address.",
        dewey="004", slug="computing", chapter="chapter 3.4",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),

    # Chapter 4: Programming Language Theory & Type Systems
    Fact(
        topic="curry howard isomorphism",
        comment="direct algorithmic correspondence between computational type systems and formal constructive mathematical proofs.",
        dewey="004", slug="computing", chapter="chapter 4.1",
        door="https://plato.stanford.edu/entries/type-theory/"
    ),
    Fact(
        topic="hindley milner type inference",
        comment="algorithm deducing most general principal type for untyped lambda calculus expressions without explicit type annotations.",
        dewey="004", slug="computing", chapter="chapter 4.2",
        door="https://plato.stanford.edu/entries/type-theory/"
    ),
    Fact(
        topic="structural typing",
        comment="type compatibility system determining equivalence based on object shape and members rather than explicit nominal declarations.",
        dewey="004", slug="computing", chapter="chapter 4.3",
        door="https://www.typescriptlang.org/docs/handbook/intro.html", kind="definition"
    ),

    # Chapter 5: Compilers, Interpreters, JIT, and Runtimes
    Fact(
        topic="context free grammar",
        comment="formal grammar where every production rule maps a single nonterminal symbol to a string of terminals and nonterminals.",
        dewey="004", slug="computing", chapter="chapter 5.1",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),
    Fact(
        topic="abstract syntax tree",
        comment="hierarchical tree representation of source code syntactic structure produced during compilation parsing phase.",
        dewey="004", slug="computing", chapter="chapter 5.2",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),
    Fact(
        topic="just in time compilation",
        comment="execution strategy dynamically compiling bytecode into native machine instructions at runtime based on profiling hotspots.",
        dewey="004", slug="computing", chapter="chapter 5.3",
        door="https://v8.dev/docs", kind="definition"
    ),

    # Chapter 6: Core Data Structures & Abstract Data Types
    Fact(
        topic="hash table lookup complexity",
        comment="hash table achieves O(1) average time complexity for key lookup using collision resolution via chaining or open addressing.",
        dewey="004", slug="computing", chapter="chapter 6.1",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ),
    Fact(
        topic="binary search tree",
        comment="node based binary tree where left child key is less than parent key and right child key is greater.",
        dewey="004", slug="computing", chapter="chapter 6.2",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),
    Fact(
        topic="b tree balance guarantee",
        comment="self-balancing multi-way search tree maintaining balanced node depths ensuring O(log n) disk block lookups.",
        dewey="004", slug="computing", chapter="chapter 6.3",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ),

    # Chapter 7: Algorithmic Complexity & Fundamental Algorithms
    Fact(
        topic="big o complexity",
        comment="asymptotic upper bound describing algorithmic resource scaling as input size n approaches infinity.",
        dewey="004", slug="computing", chapter="chapter 7.1",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),
    Fact(
        topic="dijkstra shortest path algorithm",
        comment="greedy graph traversal algorithm computing shortest paths from single source node using min-priority queue.",
        dewey="004", slug="computing", chapter="chapter 7.2",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ),
    Fact(
        topic="np completeness",
        comment="complexity class of decision problems in NP to which every other problem in NP can be reduced in polynomial time.",
        dewey="004", slug="computing", chapter="chapter 7.3",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),

    # Chapter 8: Concurrency, Parallelism & Asynchronous I/O
    Fact(
        topic="race condition",
        comment="concurrency software defect where program output depends unpredictably on uncoordinated thread execution ordering.",
        dewey="004", slug="computing", chapter="chapter 8.1",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),
    Fact(
        topic="mutex lock",
        comment="mutual exclusion synchronization primitive guaranteeing only one execution thread enters critical section at a time.",
        dewey="004", slug="computing", chapter="chapter 8.2",
        door="https://pubs.opengroup.org/onlinepubs/9699919799/", kind="definition"
    ),
    Fact(
        topic="deadlock necessary conditions",
        comment="four coffman conditions required for deadlock: mutual exclusion, hold and wait, no preemption, circular wait.",
        dewey="004", slug="computing", chapter="chapter 8.3",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ),

    # Chapter 9: Operating System Interfaces, Processes & Virtual Memory
    Fact(
        topic="virtual memory translation",
        comment="hardware memory management unit converts virtual page numbers to physical page frames using operating system page tables.",
        dewey="004", slug="computing", chapter="chapter 9.1",
        door="https://www.kernel.org/"
    ),
    Fact(
        topic="page fault",
        comment="hardware interrupt raised when program accesses memory page mapped in virtual address space but absent from physical RAM.",
        dewey="004", slug="computing", chapter="chapter 9.2",
        door="https://www.kernel.org/", kind="definition"
    ),
    Fact(
        topic="file descriptor",
        comment="non-negative integer handle index in operating system process table referencing an open file, socket, or pipe stream.",
        dewey="004", slug="computing", chapter="chapter 9.3",
        door="https://pubs.opengroup.org/onlinepubs/9699919799/", kind="definition"
    ),

    # Chapter 10: Network Protocols & Distributed Communication
    Fact(
        topic="transmission control protocol",
        comment="connection-oriented transport protocol providing reliable, ordered, and error-checked byte stream delivery via three-way handshake.",
        dewey="004", slug="computing", chapter="chapter 10.1",
        door="https://www.rfc-editor.org/rfc/rfc9293", kind="definition"
    ),
    Fact(
        topic="user datagram protocol",
        comment="stateless connectionless transport protocol offering low latency packet transmission without ordering or delivery guarantees.",
        dewey="004", slug="computing", chapter="chapter 10.2",
        door="https://www.rfc-editor.org/rfc/rfc768", kind="definition"
    ),
    Fact(
        topic="osi seven layer model",
        comment="conceptual networking framework: physical, data link, network, transport, session, presentation, application.",
        dewey="004", slug="computing", chapter="chapter 10.3",
        door="https://www.ietf.org/standards/rfcs/", kind="definition"
    ),
]

SOFTWARE_FACTS = [
    # Chapter 1: Foundations of Software Engineering
    Fact(
        topic="software engineering",
        comment="systematic application of engineering approaches to software specification, design, construction, verification, and maintenance.",
        dewey="005", slug="software", chapter="chapter 1.1",
        door="https://standards.ieee.org/", kind="definition"
    ),
    Fact(
        topic="technical debt",
        comment="implied future cost incurred by choosing expedited sub-optimal technical solutions over maintainable architectures.",
        dewey="005", slug="software", chapter="chapter 1.2",
        door="https://martinfowler.com/bliki/TechnicalDebt.html", kind="definition"
    ),

    # Chapter 2: Version Control Systems & The Git Object Model
    Fact(
        topic="git object model",
        comment="content-addressed storage engine storing blobs, trees, commits, and annotated tags indexed by SHA hashes.",
        dewey="005", slug="software", chapter="chapter 2.1",
        door="https://git-scm.com/docs", kind="definition"
    ),
    Fact(
        topic="git commit object",
        comment="immutable metadata record pointing to root tree hash, parent commit hashes, author, committer, and commit message.",
        dewey="005", slug="software", chapter="chapter 2.2",
        door="https://git-scm.com/docs", kind="definition"
    ),
    Fact(
        topic="git directed acyclic graph",
        comment="topological branch history where every commit points backward to zero, one, or multiple parent commits.",
        dewey="005", slug="software", chapter="chapter 2.3",
        door="https://git-scm.com/docs"
    ),

    # Chapter 3: Software Architecture Patterns & Modularity
    Fact(
        topic="separation of concerns",
        comment="architectural design principle dividing computer program into distinct sections each addressing a separate domain responsibility.",
        dewey="005", slug="software", chapter="chapter 3.1",
        door="https://martinfowler.com/architecture/", kind="definition"
    ),
    Fact(
        topic="solid single responsibility principle",
        comment="software module should have one, and only one, reason to change.",
        dewey="005", slug="software", chapter="chapter 3.2",
        door="https://martinfowler.com/architecture/"
    ),
    Fact(
        topic="solid open closed principle",
        comment="software entities should be open for extension, but closed for modification.",
        dewey="005", slug="software", chapter="chapter 3.2",
        door="https://martinfowler.com/architecture/"
    ),
    Fact(
        topic="solid liskov substitution principle",
        comment="subtypes must be substitutable for their base types without altering program correctness.",
        dewey="005", slug="software", chapter="chapter 3.2",
        door="https://martinfowler.com/architecture/"
    ),
    Fact(
        topic="solid interface segregation principle",
        comment="clients should not be forced to depend upon interfaces they do not use.",
        dewey="005", slug="software", chapter="chapter 3.2",
        door="https://martinfowler.com/architecture/"
    ),
    Fact(
        topic="solid dependency inversion principle",
        comment="high-level modules should not depend on low-level modules; both should depend on abstractions.",
        dewey="005", slug="software", chapter="chapter 3.2",
        door="https://martinfowler.com/architecture/"
    ),

    # Chapter 4: Relational Database Architecture & SQL Engines
    Fact(
        topic="acid atomicity",
        comment="database transaction guarantee that all operations succeed completely or entire transaction aborts leaving state unchanged.",
        dewey="005", slug="software", chapter="chapter 4.1",
        door="https://www.sqlite.org/docs.html", kind="definition"
    ),
    Fact(
        topic="acid consistency",
        comment="transaction guarantee that database state transitions only between valid states satisfying all defined schema invariants.",
        dewey="005", slug="software", chapter="chapter 4.1",
        door="https://www.sqlite.org/docs.html", kind="definition"
    ),
    Fact(
        topic="acid isolation",
        comment="transaction guarantee that concurrent transaction execution yields same state as if executed serially.",
        dewey="005", slug="software", chapter="chapter 4.1",
        door="https://www.sqlite.org/docs.html", kind="definition"
    ),
    Fact(
        topic="acid durability",
        comment="transaction guarantee that committed state changes survive subsequent system crashes and power failures.",
        dewey="005", slug="software", chapter="chapter 4.1",
        door="https://www.sqlite.org/docs.html", kind="definition"
    ),
    Fact(
        topic="sqlite wal mode",
        comment="write-ahead logging architecture enabling concurrent readers to execute without blocking writers by recording changes to log.",
        dewey="005", slug="software", chapter="chapter 4.2",
        door="https://www.sqlite.org/docs.html"
    ),

    # Chapter 5: Distributed Systems & Consensus
    Fact(
        topic="cap theorem",
        comment="distributed systems theorem stating network-partitioned system can guarantee either data consistency or system availability, not both.",
        dewey="005", slug="software", chapter="chapter 5.1",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ),
    Fact(
        topic="raft consensus algorithm",
        comment="distributed consensus protocol managing replicated state machine via leader election, log replication, and commit safety.",
        dewey="005", slug="software", chapter="chapter 5.2",
        door="https://raft.github.io/", kind="definition"
    ),

    # Chapter 6: Network APIs & HTTP Semantics
    Fact(
        topic="rest architectural style",
        comment="web architecture enforcing client-server separation, stateless requests, cacheability, uniform resource URIs, and layered systems.",
        dewey="005", slug="software", chapter="chapter 6.1",
        door="https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm", kind="definition"
    ),
    Fact(
        topic="http idempotent methods",
        comment="HTTP methods GET, PUT, DELETE, and HEAD are idempotent because multiple identical requests produce identical resource side effects.",
        dewey="005", slug="software", chapter="chapter 6.2",
        door="https://www.rfc-editor.org/rfc/rfc9110"
    ),
    Fact(
        topic="http status 200 ok",
        comment="standard response code indicating HTTP client request succeeded and server returned requested entity.",
        dewey="005", slug="software", chapter="chapter 6.3",
        door="https://www.rfc-editor.org/rfc/rfc9110", kind="definition"
    ),
    Fact(
        topic="http status 404 not found",
        comment="client error response code indicating server cannot map requested URI to any resource.",
        dewey="005", slug="software", chapter="chapter 6.3",
        door="https://www.rfc-editor.org/rfc/rfc9110", kind="definition"
    ),
    Fact(
        topic="http status 500 internal server error",
        comment="server error response code indicating unexpected server failure prevented fulfilling client request.",
        dewey="005", slug="software", chapter="chapter 6.3",
        door="https://www.rfc-editor.org/rfc/rfc9110", kind="definition"
    ),

    # Chapter 7: Testing Strategy & Verification
    Fact(
        topic="test pyramid",
        comment="testing strategy recommending broad base of fast unit tests, intermediate integration tests, and small tier of end-to-end tests.",
        dewey="005", slug="software", chapter="chapter 7.1",
        door="https://martinfowler.com/articles/practical-test-pyramid.html", kind="definition"
    ),
    Fact(
        topic="code coverage",
        comment="metric measuring percentage of codebase lines, branches, or functions executed by automated test suite.",
        dewey="005", slug="software", chapter="chapter 7.2",
        door="https://martinfowler.com/bliki/TestCoverage.html", kind="definition"
    ),
    Fact(
        topic="semantic versioning",
        comment="specification defining version format MAJOR.MINOR.PATCH incremented for breaking changes, features, and bug fixes respectively.",
        dewey="005", slug="software", chapter="chapter 7.3",
        door="https://semver.org/", kind="definition"
    ),
]

SECURITY_FACTS = [
    # Chapter 1: First Principles & Security Foundations
    Fact(
        topic="cia triad",
        comment="fundamental information security model consisting of confidentiality, integrity, and availability.",
        dewey="005.8", slug="security", chapter="chapter 1.1",
        door="https://csrc.nist.gov/", kind="definition"
    ),
    Fact(
        topic="kerckhoffs principle",
        comment="cryptographic axiom stating cryptosystem must be secure even if everything about design is public, provided key is secret.",
        dewey="005.8", slug="security", chapter="chapter 1.1",
        door="https://csrc.nist.gov/"
    ),
    Fact(
        topic="information theoretic security",
        comment="security guarantee where ciphertext reveals zero information about plaintext to adversary with infinite computational power.",
        dewey="005.8", slug="security", chapter="chapter 1.2",
        door="https://eprint.iacr.org/", kind="definition"
    ),
    Fact(
        topic="one time pad security",
        comment="the one-time pad achieves perfect information-theoretic secrecy if and only if key is truly random, same length as message, and used once.",
        dewey="005.8", slug="security", chapter="chapter 1.2",
        door="https://eprint.iacr.org/"
    ),
    Fact(
        topic="stride threat model",
        comment="threat classification taxonomy categorizing spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege.",
        dewey="005.8", slug="security", chapter="chapter 1.3",
        door="https://owasp.org/", kind="definition"
    ),

    # Chapter 2: Symmetric Cryptography & Block Ciphers
    Fact(
        topic="advanced encryption standard",
        comment="nist fips 197 standard symmetric block cipher operating on 128-bit blocks using 128, 192, or 256-bit keys.",
        dewey="005.8", slug="security", chapter="chapter 2.1",
        door="https://csrc.nist.gov/publications/detail/fips/197/final", kind="definition"
    ),
    Fact(
        topic="substitution permutation network",
        comment="block cipher design executing alternating rounds of non-linear byte substitution and linear diffusion bit permutations.",
        dewey="005.8", slug="security", chapter="chapter 2.1",
        door="https://csrc.nist.gov/publications/detail/fips/197/final", kind="definition"
    ),
    Fact(
        topic="cipher block chaining vulnerability",
        comment="CBC mode without message authentication is vulnerable to padding oracle attacks leaking plaintext byte by byte.",
        dewey="005.8", slug="security", chapter="chapter 2.2",
        door="https://csrc.nist.gov/"
    ),
    Fact(
        topic="galois counter mode",
        comment="authenticated encryption mode combining counter mode encryption with galois field polynomial multiplication for integrity authentication.",
        dewey="005.8", slug="security", chapter="chapter 2.2",
        door="https://csrc.nist.gov/", kind="definition"
    ),

    # Chapter 3: Asymmetric Cryptography, Key Exchange & Public Key Infrastructure
    Fact(
        topic="diffie hellman key exchange",
        comment="cryptographic protocol allowing two parties to compute shared secret over unencrypted channel via discrete logarithm problem.",
        dewey="005.8", slug="security", chapter="chapter 3.1",
        door="https://www.ietf.org/standards/rfcs/", kind="definition"
    ),
    Fact(
        topic="rsa algorithm",
        comment="public key cryptosystem relying on computational intractability of factoring large composite semiprime integers.",
        dewey="005.8", slug="security", chapter="chapter 3.2",
        door="https://csrc.nist.gov/", kind="definition"
    ),
    Fact(
        topic="elliptic curve cryptography",
        comment="asymmetric cryptography utilizing algebraic structure of elliptic curves over finite fields to achieve equal security with smaller keys.",
        dewey="005.8", slug="security", chapter="chapter 3.3",
        door="https://www.ietf.org/standards/rfcs/", kind="definition"
    ),
    Fact(
        topic="forward secrecy",
        comment="cryptographic property ensuring compromise of server long-term private key does not decrypt recorded past encrypted session traffic.",
        dewey="005.8", slug="security", chapter="chapter 3.4",
        door="https://www.ietf.org/standards/rfcs/", kind="definition"
    ),

    # Chapter 4: Cryptographic Hash Functions & Message Authentication
    Fact(
        topic="cryptographic hash function",
        comment="deterministic algorithm mapping arbitrary data to fixed-size digest satisfying pre-image, second pre-image, and collision resistance.",
        dewey="005.8", slug="security", chapter="chapter 4.1",
        door="https://csrc.nist.gov/", kind="definition"
    ),
    Fact(
        topic="sha 256 hash function",
        comment="nist fips 180-4 standard cryptographic hash producing 256-bit message digest using merkle damgard compression structure.",
        dewey="005.8", slug="security", chapter="chapter 4.1",
        door="https://csrc.nist.gov/publications/detail/fips/180-4/final", kind="definition"
    ),
    Fact(
        topic="hmac construction",
        comment="keyed hash message authentication code combining cryptographic hash function with secret key using nested inner and outer padding.",
        dewey="005.8", slug="security", chapter="chapter 4.2",
        door="https://www.ietf.org/standards/rfcs/", kind="definition"
    ),

    # Chapter 5: Network Security, TLS 1.3 & Protocol Architecture
    Fact(
        topic="tls 1 3 handshake",
        comment="internet security protocol reducing connection setup to single round-trip time and mandating ephemeral diffie-hellman forward secrecy.",
        dewey="005.8", slug="security", chapter="chapter 5.1",
        door="https://www.ietf.org/standards/rfcs/"
    ),
    Fact(
        topic="signal double ratchet algorithm",
        comment="end-to-end messaging protocol combining symmetric KDF ratchet and asymmetric DH ratchet for self-healing forward and post-compromise secrecy.",
        dewey="005.8", slug="security", chapter="chapter 5.2",
        door="https://signal.org/docs/", kind="definition"
    ),

    # Chapter 6: Systems Security, Memory Safety & Exploitation Mechanics
    Fact(
        topic="buffer overflow exploit",
        comment="memory corruption flaw where unchecked input overwrites adjacent call stack memory altering saved instruction return pointer.",
        dewey="005.8", slug="security", chapter="chapter 6.1",
        door="https://csrc.nist.gov/", kind="definition"
    ),
    Fact(
        topic="address space layout randomization",
        comment="kernel defense randomizing virtual memory offsets of stack, heap, and shared libraries to thwart code reuse attacks.",
        dewey="005.8", slug="security", chapter="chapter 6.2",
        door="https://csrc.nist.gov/", kind="definition"
    ),
    Fact(
        topic="memory safety",
        comment="programming language property guaranteeing execution remains free from buffer overflows, use-after-free, and dangling pointers.",
        dewey="005.8", slug="security", chapter="chapter 6.3",
        door="https://csrc.nist.gov/", kind="definition"
    ),

    # Chapter 7: Web Application Security & OWASP Top 10
    Fact(
        topic="sql injection vulnerability",
        comment="application security flaw allowing malicious user input to manipulate SQL syntax and query execution structure.",
        dewey="005.8", slug="security", chapter="chapter 7.1",
        door="https://owasp.org/", kind="definition"
    ),
    Fact(
        topic="cross site scripting",
        comment="vulnerability executing arbitrary client script in victim browser due to application reflecting unsanitized untrusted user input.",
        dewey="005.8", slug="security", chapter="chapter 7.2",
        door="https://owasp.org/", kind="definition"
    ),
    Fact(
        topic="cross site request forgery",
        comment="attack forcing authenticated user browser to transmit unauthorized commands to vulnerable web application using ambient credentials.",
        dewey="005.8", slug="security", chapter="chapter 7.3",
        door="https://owasp.org/", kind="definition"
    ),

    # Chapter 8: Distributed Consensus, Blockchains & Zero-Knowledge Proofs
    Fact(
        topic="bitcoin proof of work",
        comment="nakamoto consensus protocol where network agreement requires miners to find partial SHA-256 hash pre-images below difficulty target.",
        dewey="005.8", slug="security", chapter="chapter 8.1",
        door="https://bitcoin.org/en/developer-documentation", kind="definition"
    ),
    Fact(
        topic="byzantine fault tolerance",
        comment="distributed network capability to reach consensus despite arbitrary, corrupt, or malicious actor node behaviors.",
        dewey="005.8", slug="security", chapter="chapter 8.2",
        door="https://bitcoin.org/en/developer-documentation", kind="definition"
    ),
    Fact(
        topic="zero knowledge proof",
        comment="cryptographic protocol where prover demonstrates statement validity to verifier without revealing any information beyond validity.",
        dewey="005.8", slug="security", chapter="chapter 8.3",
        door="https://eprint.iacr.org/", kind="definition"
    ),
]

AI_ML_FACTS = [
    # Chapter 1: Foundations of Machine Learning & Optimization
    Fact(
        topic="machine learning",
        comment="computational paradigm where algorithms learn parameter representations directly from empirical data without explicit procedural rules.",
        dewey="006", slug="ai_ml", chapter="chapter 1.1",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),
    Fact(
        topic="supervised learning",
        comment="machine learning methodology training model parameters on paired input-output training datasets to minimize loss function.",
        dewey="006", slug="ai_ml", chapter="chapter 1.1",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),
    Fact(
        topic="loss function",
        comment="mathematical function quantifying discrepancy between model predictions and empirical ground truth target values.",
        dewey="006", slug="ai_ml", chapter="chapter 1.2",
        door="https://pytorch.org/docs/stable/nn.html", kind="definition"
    ),
    Fact(
        topic="gradient descent algorithm",
        comment="first-order optimization algorithm updating parameters in opposite direction of loss gradient proportional to learning rate.",
        dewey="006", slug="ai_ml", chapter="chapter 1.3",
        door="https://pytorch.org/docs/stable/optim.html", kind="definition"
    ),

    # Chapter 2: Neural Networks & Backpropagation
    Fact(
        topic="artificial neuron",
        comment="computational unit computing linear dot product of input vector and weight vector plus bias, followed by activation function.",
        dewey="006", slug="ai_ml", chapter="chapter 2.1",
        door="https://pytorch.org/docs/stable/nn.html", kind="definition"
    ),
    Fact(
        topic="backpropagation algorithm",
        comment="efficient algorithm calculating loss function gradient with respect to all network weights using multivariable calculus chain rule.",
        dewey="006", slug="ai_ml", chapter="chapter 2.2",
        door="https://pytorch.org/docs/stable/autograd.html", kind="definition"
    ),
    Fact(
        topic="rectified linear unit",
        comment="activation function defined as max(0, x) preventing vanishing gradients in deep feedforward architectures.",
        dewey="006", slug="ai_ml", chapter="chapter 2.3",
        door="https://pytorch.org/docs/stable/nn.html", kind="definition"
    ),

    # Chapter 3: The Transformer Architecture & Self-Attention
    Fact(
        topic="transformer model",
        comment="neural network architecture discarding recurrence and convolution entirely in favor of self-attention mechanisms.",
        dewey="006", slug="ai_ml", chapter="chapter 3.1",
        door="https://arxiv.org/abs/1706.03762", kind="definition"
    ),
    Fact(
        topic="scaled dot product attention",
        comment="attention formula computing softmax of query Q times transposed key K divided by square root of key dimension d_k, multiplied by value V.",
        dewey="006", slug="ai_ml", chapter="chapter 3.2",
        door="https://arxiv.org/abs/1706.03762"
    ),
    Fact(
        topic="multi head attention",
        comment="mechanism projecting queries, keys, and values into multiple representation subspaces in parallel before concatenation.",
        dewey="006", slug="ai_ml", chapter="chapter 3.2",
        door="https://arxiv.org/abs/1706.03762", kind="definition"
    ),
    Fact(
        topic="rotary position embedding",
        comment="positional encoding method multiplying query and key vectors by rotation matrix incorporating relative token distances.",
        dewey="006", slug="ai_ml", chapter="chapter 3.3",
        door="https://arxiv.org/abs/2104.09864", kind="definition"
    ),

    # Chapter 4: Tokenization & Representation Learning
    Fact(
        topic="tokenization",
        comment="preprocessing stage partitioning raw text into integer token ids matching a pre-trained vocabulary.",
        dewey="006", slug="ai_ml", chapter="chapter 4.1",
        door="https://huggingface.co/docs/tokenizers", kind="definition"
    ),
    Fact(
        topic="byte pair encoding",
        comment="subword tokenization algorithm iteratively merging most frequent adjacent character or byte pairs in training corpus.",
        dewey="006", slug="ai_ml", chapter="chapter 4.2",
        door="https://huggingface.co/docs/tokenizers", kind="definition"
    ),
    Fact(
        topic="vector embedding space",
        comment="continuous high-dimensional geometric space where semantically similar tokens and concepts cluster near each other.",
        dewey="006", slug="ai_ml", chapter="chapter 4.3",
        door="https://arxiv.org/abs/1301.3781", kind="definition"
    ),

    # Chapter 5: Pre-Training, Fine-Tuning & Alignment
    Fact(
        topic="autoregressive language modeling",
        comment="unsupervised training task predicting conditional probability distribution of next token given sequence of prior tokens.",
        dewey="006", slug="ai_ml", chapter="chapter 5.1",
        door="https://arxiv.org/abs/1706.03762", kind="definition"
    ),
    Fact(
        topic="instruction fine tuning",
        comment="supervised training stage adapting foundation model weights on prompt-demonstration datasets to follow user instructions.",
        dewey="006", slug="ai_ml", chapter="chapter 5.2",
        door="https://huggingface.co/docs/transformers", kind="definition"
    ),
    Fact(
        topic="rlhf alignment",
        comment="reinforcement learning from human feedback optimizing policy model against learned reward model using proximal policy optimization.",
        dewey="006", slug="ai_ml", chapter="chapter 5.3",
        door="https://arxiv.org/abs/2203.02155", kind="definition"
    ),

    # Chapter 6: Scaling Laws & Computational Efficiency
    Fact(
        topic="chinchilla scaling law",
        comment="empirical finding that for compute-optimal training, model parameter count and training token volume should scale in equal proportion.",
        dewey="006", slug="ai_ml", chapter="chapter 6.1",
        door="https://arxiv.org/abs/2203.15556"
    ),
    Fact(
        topic="kv cache optimization",
        comment="inference mechanism caching previously computed key and value attention tensors to avoid quadratic recomputation during generation.",
        dewey="006", slug="ai_ml", chapter="chapter 6.2",
        door="https://huggingface.co/docs/transformers"
    ),
    Fact(
        topic="model quantization",
        comment="compression technique mapping model weight tensors from 16-bit floating point to 8-bit or 4-bit integers to reduce VRAM requirements.",
        dewey="006", slug="ai_ml", chapter="chapter 6.3",
        door="https://github.com/ggerganov/llama.cpp", kind="definition"
    ),
    Fact(
        topic="webgpu in browser inference",
        comment="w3c standard providing direct hardware acceleration and compute pipelines for local neural model execution inside web browsers.",
        dewey="006", slug="ai_ml", chapter="chapter 6.4",
        door="https://www.w3.org/TR/webgpu/"
    ),
    Fact(
        topic="hallucination phenomenon",
        comment="large language model failure mode where model outputs statistically fluent but factually untrue or fabricated assertions.",
        dewey="006", slug="ai_ml", chapter="chapter 6.5",
        door="https://www.nist.gov/itl/ai-risk-management-framework", kind="definition"
    ),
]
