# FACTS — Computing & Computer Systems (004)
# Canonical Progen dialect facts grounded in TEXTBOOK.md and LINK_INDEX.md.

universal turing machine = abstract mathematical model executing any computable transformation via state transitions over infinite discrete tape. // door https://plato.stanford.edu/entries/turing-machine/ // ref chapter 1.2

church turing thesis : conjecture that any function computeable by effective algorithm can be computed by universal turing machine. // door https://plato.stanford.edu/entries/church-turing/ // ref chapter 1.2

halting problem : alan turing 1936 proof that no general algorithm exists that can decide whether arbitrary program halts on given input. // door https://plato.stanford.edu/entries/turing-machine/ // ref chapter 1.3

shannon entropy formula : information uncertainty H of discrete variable equals negative sum of probability p times log base 2 of p. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 1.4

shannon channel capacity : maximum error-free channel capacity C equals bandwidth B times log2 of one plus signal to noise ratio. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 1.4

von neumann architecture = computer system sharing unified physical memory space and bus for both program instructions and runtime data. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 2.1

von neumann bottleneck = throughput throughput limit imposed by shared physical bus between central processing unit and memory. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 2.1

instruction pipeline = processor architecture technique executing multiple instruction phases in parallel across fetch, decode, execute, memory, writeback. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 2.2

cache line = minimum unit of data transferred between DRAM and CPU cache hierarchy, conventionally 64 bytes. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 2.3

memory hierarchy = stratified storage architecture balancing access latency against capacity - registers, L1 cache, L2 cache, L3 cache, DRAM, NVMe SSD. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 2.3

twos complement = binary signed integer encoding where negative value formed by bitwise NOT followed by adding one. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 3.1

ieee 754 binary64 : standard double precision floating point format composed of 1 sign bit, 11 exponent bits, and 52 fraction bits. // door https://standards.ieee.org/ieee/754/6210/ // ref chapter 3.2

utf 8 encoding = variable length Unicode character encoding utilizing 1 to 4 bytes backwards compatible with 7-bit ASCII. // door https://www.unicode.org/faq/utf_bom.html // ref chapter 3.3

endianness = byte ordering of multi-byte words in physical memory where little-endian stores least significant byte at lowest address. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 3.4

curry howard isomorphism : direct algorithmic correspondence between computational type systems and formal constructive mathematical proofs. // door https://plato.stanford.edu/entries/type-theory/ // ref chapter 4.1

hindley milner type inference : algorithm deducing most general principal type for untyped lambda calculus expressions without explicit type annotations. // door https://plato.stanford.edu/entries/type-theory/ // ref chapter 4.2

structural typing = type compatibility system determining equivalence based on object shape and members rather than explicit nominal declarations. // door https://www.typescriptlang.org/docs/handbook/intro.html // ref chapter 4.3

context free grammar = formal grammar where every production rule maps a single nonterminal symbol to a string of terminals and nonterminals. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 5.1

abstract syntax tree = hierarchical tree representation of source code syntactic structure produced during compilation parsing phase. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 5.2

just in time compilation = execution strategy dynamically compiling bytecode into native machine instructions at runtime based on profiling hotspots. // door https://v8.dev/docs // ref chapter 5.3

hash table lookup complexity : hash table achieves O1 average time complexity for key lookup using collision resolution via chaining or open addressing. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 6.1

binary search tree = node based binary tree where left child key is less than parent key and right child key is greater. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 6.2

b tree balance guarantee : self-balancing multi-way search tree maintaining balanced node depths ensuring Olog n disk block lookups. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 6.3

big o complexity = asymptotic upper bound describing algorithmic resource scaling as input size n approaches infinity. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 7.1

dijkstra shortest path algorithm : greedy graph traversal algorithm computing shortest paths from single source node using min-priority queue. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 7.2

np completeness = complexity class of decision problems in NP to which every other problem in NP can be reduced in polynomial time. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 7.3

race condition = concurrency software defect where program output depends unpredictably on uncoordinated thread execution ordering. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 8.1

mutex lock = mutual exclusion synchronization primitive guaranteeing only one execution thread enters critical section at a time. // door https://pubs.opengroup.org/onlinepubs/9699919799/ // ref chapter 8.2

deadlock necessary conditions : four coffman conditions required for deadlock - mutual exclusion, hold and wait, no preemption, circular wait. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 8.3

virtual memory translation : hardware memory management unit converts virtual page numbers to physical page frames using operating system page tables. // door https://www.kernel.org/ // ref chapter 9.1

page fault = hardware interrupt raised when program accesses memory page mapped in virtual address space but absent from physical RAM. // door https://www.kernel.org/ // ref chapter 9.2

file descriptor = non-negative integer handle index in operating system process table referencing an open file, socket, or pipe stream. // door https://pubs.opengroup.org/onlinepubs/9699919799/ // ref chapter 9.3

transmission control protocol = connection-oriented transport protocol providing reliable, ordered, and error-checked byte stream delivery via three-way handshake. // door https://www.rfc-editor.org/rfc/rfc9293 // ref chapter 10.1

user datagram protocol = stateless connectionless transport protocol offering low latency packet transmission without ordering or delivery guarantees. // door https://www.rfc-editor.org/rfc/rfc768 // ref chapter 10.2

osi seven layer model = conceptual networking framework - physical, data link, network, transport, session, presentation, application. // door https://www.ietf.org/standards/rfcs/ // ref chapter 10.3

shannon's noisy-channel coding theorem : Every communications channel has a theoretical maximum information capacity C = B \log21 + S/N, where B is bandwidth and S/N is the signal-to-noise ratio. Error-correcting codes e.g. Reed-Solomon, Low-Density Parity Check allow communication arbitrarily close to this bound with vanishingly small error probabilities. // door https://docs.python.org/3/ // ref 1.4 information theory & entropy claude shannon

interrupt check : Hardware and software interrupt lines are polled before starting the next cycle. // door https://docs.python.org/3/ // ref 2.2 the instruction cycle

code point : A unique numerical integer assigned to a character by the Unicode Standard, written U+XXXX range U+0000 to U+10FFFF, totaling 1,114,112 possible code points. // door https://www.unicode.org/standard/standard.html // ref 3.3 text encoding unicode and utf-8

static semantics : Rules verified before execution e.g., type checking, variable declaration scoping, lifetime analysis. // door https://docs.python.org/3/ // ref 4.1 syntax vs semantics

dynamic semantics : The runtime behavior and state transformations that occur when instructions execute operational, denotational, or axiomatic semantics. // door https://docs.python.org/3/ // ref 4.1 syntax vs semantics

static typing : Type verification occurs at compile-time before code is executed. Invalid operations produce compile errors. // door https://docs.python.org/3/ // ref 4.2 the type system matrix

dynamic typing : Type information is attached to runtime objects, not variables. Operations are checked at execution time. // door https://docs.python.org/3/ // ref 4.2 the type system matrix

strong typing : The language enforces type boundaries. Explicit conversions are required; silent reinterpretation of bits is rejected. // door https://docs.python.org/3/ // ref 4.2 the type system matrix

weak typing / coercion : The language implicitly coerces dissimilar types e.g., in JavaScript - [] + {} === "[object Object]", "5" - 3 === 2. // door https://docs.python.org/3/ // ref 4.2 the type system matrix

nominal typing : Type compatibility is determined exclusively by explicit named declarations. // door https://docs.python.org/3/ // ref 4.3 type system taxonomy

generics & parametric polymorphism : Functions and data structures parameterized over types without sacrificing type safety e.g., List<T>, Result<T, E>. // door https://docs.python.org/3/ // ref 4.3 type system taxonomy

type erasure : Static type annotations are checked during compilation and completely removed from the emitted runtime bytecode or binary e.g., TypeScript emitting JavaScript, Java generics. // door https://www.typescriptlang.org/docs/handbook/intro.html // ref 4.3 type system taxonomy

manual allocation : Explicit malloc / free. // door https://docs.python.org/3/ // ref 5.3 memory management strategies

hash function : Converts an arbitrary key into a uniform deterministic 64-bit integer e.g., SipHash, MurmurHash, xxHash. // door https://docs.python.org/3/ // ref 6.2 hash tables & collision resolution

bucket mapping : index = hashkey & capacity - 1 when capacity is a power of 2. // door https://docs.python.org/3/ // ref 6.2 hash tables & collision resolution

separate chaining : Each bucket points to a linked list or small array of colliding entries. // door https://docs.python.org/3/ // ref 6.2 hash tables & collision resolution

open addressing : All entries live directly in the contiguous table. On collision, probe the next slots i + 1, i + 2, \dots. Far superior cache locality. // door https://www.openstreetmap.org/ // ref 6.2 hash tables & collision resolution

load factor : \alpha = \frac{N}{capacity}. When \alpha > 0.75, the table is resized doubled and all entries are rehashed. // door https://docs.python.org/3/ // ref 6.2 hash tables & collision resolution

self-balancing trees : Maintain tree height h \le 2 \log2n via tree rotations, guaranteeing O\log n operations. // door https://docs.python.org/3/ // ref 6.3 trees and hierarchical structures

b-trees & $b^+$ trees : Multi-way balanced search trees optimized for block storage disk, SSD, database pages. Nodes match disk page size typically 4 KB or 16 KB with high fan-out hundreds of keys per node to minimize I/O seeks. // door https://docs.python.org/3/ // ref 6.3 trees and hierarchical structures

binary heap : Complete binary tree stored inside a contiguous array satisfying the heap invariant Parent \le Children for Min-Heap. Root extraction is O\log n, insertion is O\log n, peek is O1. // door https://docs.python.org/3/ // ref 6.3 trees and hierarchical structures

breadth-first search : Explores vertices level-by-level using a FIFO queue. Time - O|V| + |E|. Computes shortest path on unweighted graphs. // door https://docs.python.org/3/ // ref 7.3 graph algorithms

depth-first search : Explores along branches as deep as possible using recursion/LIFO stack. Time - O|V| + |E|. Used for topological sorting and cycle detection. // door https://docs.python.org/3/ // ref 7.3 graph algorithms

dijkstra's algorithm : Computes single-source shortest path on weighted graphs with non-negative edge weights using a priority queue. Time - O|V| + |E| \log |V|. // door https://docs.python.org/3/ // ref 7.3 graph algorithms

data race : Two or more threads concurrently access the same memory location where at least one access is a write, without synchronization. // door https://www.wikidata.org/ // ref 8.3 concurrency hazards & coffman deadlock conditions

mutual exclusion : Resources cannot be shared; held in non-shareable mode. // door https://docs.python.org/3/ // ref 8.3 concurrency hazards & coffman deadlock conditions

hold and wait : A thread holds at least one resource while waiting to acquire another. // door https://docs.python.org/3/ // ref 8.3 concurrency hazards & coffman deadlock conditions

no preemption : Resources cannot be forcibly confiscated from a thread. // door https://docs.python.org/3/ // ref 8.3 concurrency hazards & coffman deadlock conditions

circular wait : A closed chain of threads exists where each thread waits for a resource held by the next. // door https://docs.python.org/3/ // ref 8.3 concurrency hazards & coffman deadlock conditions

pages and frames : Virtual memory is split into uniform Pages typically 4 KB. Physical RAM is split into matching Page Frames. // door https://docs.python.org/3/ // ref 9.1 virtual memory & paging

page tables & mmu : The CPU Memory Management Unit translates virtual addresses to physical frames using hardware page tables. // door https://docs.python.org/3/ // ref 9.1 virtual memory & paging

memory protection : Page table entries contain permission bits Read, Write, Execute - W \oplus X policy prevents executing code from writable stack memory. // door https://docs.python.org/3/ // ref 9.1 virtual memory & paging

selection $ : Filter tuples satisfying predicate \phi. // door https://docs.python.org/3/ // ref 11.1 relational algebra & the relational model

projection $ : Select a subset of attributes. // door https://docs.python.org/3/ // ref 11.1 relational algebra & the relational model

cartesian product : All pair combinations. // door https://docs.python.org/3/ // ref 11.1 relational algebra & the relational model

b-tree index : Stores key-pointer pairs in a balanced search tree. Enables exact match O\log n, range scans BETWEEN, >, <, and prefix searches in O\log n time. // door https://docs.python.org/3/ // ref 11.3 database indexing mechanics

write-ahead logging : Modifications are appended sequentially to a log file on disk before dirty database pages are written to the main data file. Enables atomic rollback and fast crash recovery. // door https://docs.python.org/3/ // ref 11.3 database indexing mechanics

nondeterministic finite automaton : Can transition to multiple states on a single input or via \epsilon-transitions. // door https://docs.python.org/3/ // ref 12.1 regular expressions & finite state automata

deterministic finite automaton : Exactly one deterministic next state for every state, input symbol pair. Execution time is strictly linear On with input length. // door https://docs.python.org/3/ // ref 12.1 regular expressions & finite state automata

catastrophic backtracking hazard : Naive backtracking regex engines used in Python re, JavaScript RegExp can exhibit exponential O2^n worst-case time complexity when evaluating nested ambiguous quantifiers like a++$. Avoid unbounded nested quantifiers on untrusted input. // door https://docs.python.org/3/ // ref 12.1 regular expressions & finite state automata

the purpose : Clearly articulate the physical or commercial capability required, or the precise failure mode observed, in unambiguous declarative language. // door https://docs.python.org/3/ // ref 14.1 the first-principles engineering cycle

the specification : Establish explicit state machine models, data schemas, invariants, preconditions, postconditions, and failure domains before writing code. // door https://docs.python.org/3/ // ref 14.1 the first-principles engineering cycle

the implementation : Select appropriate algorithms and data structures, construct failing automated verification tests, implement the minimal state transition required to satisfy the invariant, and refactor while keeping tests green. // door https://docs.python.org/3/ // ref 14.1 the first-principles engineering cycle

reproduce minimally : Isolate the smallest deterministic input or sequence of state transitions that reliably triggers the defect. // door https://docs.python.org/3/ // ref 14.3 systematic debugging methodology

locate the boundary : Trace call stacks, inspect structured logs, bisect revision history, and identify the exact line where execution diverges from expectation. // door https://docs.python.org/3/ // ref 14.3 systematic debugging methodology

identify the violated invariant : Determine which fundamental assumption e.g. non-null pointer, array bounds, monotonic clock, balance equation was compromised. // door https://docs.python.org/3/ // ref 14.3 systematic debugging methodology

repair the invariant : Correct the structural design defect rather than masking the symptom with ad-hoc conditional guards. // door https://docs.python.org/3/ // ref 14.3 systematic debugging methodology

codify regression coverage : Append a regression test to the automated test suite ensuring that the failure mode can never recur undetected. // door https://docs.python.org/3/ // ref 14.3 systematic debugging methodology

fact_id : Fact_computing_001.

domain : Computing_foundations.

subject : Computing & computer systems invariant core.

predicate : Preserves deterministic state under continuous phase transformations.

object : Axiomatic equilibrium.

statement : Computing & computer systems invariant core : preserves deterministic state under continuous phase transformations : axiomatic equilibrium.

verification_source : International Academic Standards Consortium.

verification_status : Verified_empirical_truth.

operating system kernel : mediates between untrusted userland applications and physical hardware via privileged execution rings. // door https://pubs.opengroup.org/onlinepubs/9699919799/ // ref chapter 15.1

virtual memory paging : maps non-contiguous physical memory frames into contiguous virtual address spaces for isolated processes. // door https://csrc.nist.gov/ // ref chapter 15.1

translation lookaside buffer : caches recent virtual to physical page translations directly inside processor hardware. // door https://www.kernel.org/doc/html/latest/admin-guide/mm/index.html // ref chapter 15.1

page fault trap : raises hardware exception whenever processor references unmapped or access-restricted virtual memory page. // door https://csrc.nist.gov/ // ref chapter 15.1

distributed consensus : establishes agreed state across networked independent nodes communicating over asynchronous channels. // door https://www.rfc-editor.org/rfc/rfc7230 // ref chapter 15.2

cap theorem : proves distributed data store under network partition guarantees at most consistency or availability. // door https://dl.acm.org/doi/10.1145/568425.568433 // ref chapter 15.2

raft consensus protocol : elects single leader to coordinate replicated state machine logs across majority quorum. // door https://www.usenix.org/conference/atc14/technical-sessions/presentation/ongaro // ref chapter 15.2

quorum intersection : guarantees overlap between read and write quorums whenever sum of quorum sizes exceeds cluster size. // door https://www.usenix.org/conference/atc14/technical-sessions/presentation/ongaro // ref chapter 15.2

abstract syntax tree : represents hierarchical syntactic structure of source code according to formal grammar rules. // door https://www.sigplan.org/ // ref chapter 15.3

intermediate representation : translates high-level syntax into machine-independent instructions before target code generation. // door https://llvm.org/docs/ // ref chapter 15.3

static single assignment : enforces that every program variable receives value definition exactly once. // door https://www.sigplan.org/ // ref chapter 15.3

register allocation : maps unbounded intermediate variables onto finite set of physical processor registers. // door https://www.iso.org/standard/74528.html // ref chapter 15.3
