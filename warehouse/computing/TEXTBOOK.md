---
title: "computing — undergrad textbook"
date: "2026-09-13"
status: living · easylm
home: "warehouse/computing/"
related:
  - "../math/"
  - "../engineering/"
  - "warehouse/LAW.md"
---

# Computing — Undergraduate Foundations & Machine Architecture

A comprehensive undergraduate textbook covering computer science foundations, machine models, data representation, programming language theory, type systems, algorithms, systems programming, and the software stack required to engineer general-purpose software.

---

## 0. Syllabus & Structural Map

This textbook provides the theoretical bedrock and practical mechanics required to understand, design, and implement general-purpose software systems. It bridges the gap between hardware architecture and high-level software engineering.

```
+-----------------------------------------------------------------------------------+
|                            APPLICATION LAYER                                      |
|   Services · Libraries · User interfaces · Embedded and mobile clients            |
+-----------------------------------------------------------------------------------+
                                        |
+-----------------------------------------------------------------------------------+
|                        RUNTIME & EXECUTION LAYER                                  |
|   CPython VM · V8 JS Engine · JVM · Native ELF/PE Binaries · Wasm Sandbox         |
+-----------------------------------------------------------------------------------+
                                        |
+-----------------------------------------------------------------------------------+
|                      OPERATING SYSTEM & SYSTEMS LAYER                             |
|   Processes · Threads · Virtual Memory (Paging) · Sockets · File Descriptors      |
+-----------------------------------------------------------------------------------+
                                        |
+-----------------------------------------------------------------------------------+
|                         HARDWARE ARCHITECTURE                                     |
|   CPU (Registers, ALU, Pipeline) · Cache (L1/L2/L3) · RAM · Storage Bus · Network |
+-----------------------------------------------------------------------------------+
```

### Table of Contents

1. [Chapter 1: Theory of Computation & Machine Models](#1-theory-of-computation--machine-models)
2. [Chapter 2: Computer Architecture & Hardware Hierarchy](#2-computer-architecture--hardware-hierarchy)
3. [Chapter 3: Data Representation, Encodings & Memory Layout](#3-data-representation-encodings--memory-layout)
4. [Chapter 4: Programming Language Theory & Type Systems](#4-programming-language-theory--type-systems)
5. [Chapter 5: Compilers, Interpreters, JIT, and Runtimes](#5-compilers-interpreters-jit-and-runtimes)
6. [Chapter 6: Core Data Structures & Abstract Data Types](#6-core-data-structures--abstract-data-types)
7. [Chapter 7: Algorithmic Complexity & Fundamental Algorithms](#7-algorithmic-complexity--fundamental-algorithms)
8. [Chapter 8: Concurrency, Parallelism & Asynchronous I/O](#8-concurrency-parallelism--asynchronous-io)
9. [Chapter 9: Operating System Interfaces, Processes & Virtual Memory](#9-operating-system-interfaces-processes--virtual-memory)
10. [Chapter 10: Network Protocols & Distributed Communication](#10-network-protocols--distributed-communication)
11. [Chapter 11: Data Persistence, Relational Theory & SQL Engines](#11-data-persistence-relational-theory--sql-engines)
12. [Chapter 12: Regular Expressions, Automata & Formal Grammars](#12-regular-expressions-automata--formal-grammars)
13. [Chapter 13: Language Families & Engineering Idioms](#13-language-families--engineering-idioms)
14. [Chapter 14: Specification, Testing & Problem Decomposition](#14-specification-testing--problem-decomposition)

---

## 1. Theory of Computation & Machine Models

### 1.1 Computation as State Transformation

Computation is the deterministic manipulation of symbols according to a finite set of transformation rules. Formally, a computational system transitions through a sequence of discrete configurations:

$$S_0 \xrightarrow{\delta} S_1 \xrightarrow{\delta} S_2 \xrightarrow{\delta} \dots \xrightarrow{\delta} S_{\text{halt}}$$

where $S$ represents the total machine state and $\delta: S \times \Sigma \to S \times \Sigma \times \{L, R, N\}$ is the transition function over an alphabet $\Sigma$.

### 1.2 The Turing Machine & Computability

The abstract foundation of modern computing is the Universal Turing Machine (UTM), formulated by Alan Turing in 1936. A Turing machine consists of:
- An infinitely long tape divided into discrete cells, each holding a symbol from a finite alphabet $\Gamma$.
- A read/write head capable of reading, writing, and moving left ($L$) or right ($R$).
- A finite state control $Q$ with an initial state $q_0$ and halting/accepting states.
- A transition function $\delta: Q \times \Gamma \to Q \times \Gamma \times \{L, R\}$.

**The Church-Turing Thesis:** Any function that can be computed by an effective algorithm can be computed by a Turing machine. All general-purpose programming languages (Python, TypeScript, Rust, C) and execution kernels that support unbounded looping, memory storage, conditional branching, and pointer/variable manipulation are **Turing complete**.

### 1.3 The Halting Problem and Undecidability

Alan Turing proved that there exists no general algorithm that can determine whether an arbitrary program $P$ running on input $I$ will eventually halt or loop indefinitely.

### 1.3b Information entropy (Claude Shannon)

Information theory is not “computers feel informative.” Shannon’s 1948 measure of uncertainty for a discrete source:

`H(X) = −Σ p(x) log2 p(x)`  (bits when the log is base 2)

A fair coin is 1 bit. A sure event is 0 bits. Channel capacity bounds error-free rate; the noisy-channel coding theorem is the existence proof that codes can approach that bound. Fetch Shannon’s paper or a named information-theory door for proofs. Do not invent a capacity number for a radio you did not measure.

$$\text{HALT}(P, I) = \begin{cases} \text{true} & \text{if } P(I) \text{ terminates} \\ \text{false} & \text{if } P(I) \text{ runs forever} \end{cases}$$

**Theorem:** $\text{HALT}(P, I)$ is undecidable.
*Consequence for software engineering:* No static analyzer, compiler, or verification engine can universally prove arbitrary code terminates or is free of infinite loops without restricting the language's computational power.

### 1.4 The Chomsky Hierarchy

Formal grammars and computational languages are classified by the Chomsky Hierarchy:

| Level | Grammar Type | Automaton Model | Production Rules | Applications |
|---|---|---|---|---|
| **Type 3** | Regular | Deterministic / Nondeterministic Finite Automaton (DFA/NFA) | $A \to aB \text{ or } A \to a$ | Lexers, regular expressions, tokenizers |
| **Type 2** | Context-Free | Pushdown Automaton (PDA with stack) | $A \to \alpha \quad (\alpha \in (V \cup \Sigma)^*)$ | Programming language syntax, JSON/XML parsing |
| **Type 1** | Context-Sensitive | Linear Bounded Automaton (LBA) | $\alpha A \beta \to \alpha \gamma \beta$ | Natural language processing constraints |
| **Type 0** | Recursively Enumerable | Universal Turing Machine | $\alpha \to \beta$ | General-purpose computation, code execution |

---

## 2. Computer Architecture & Hardware Hierarchy

### 2.1 The von Neumann Architecture

Modern hardware follows the von Neumann architectural model, where program instructions and data share the same address space and physical memory bus:

```
+--------------------------------------------------------------------+
|                      CENTRAL PROCESSING UNIT (CPU)                 |
|                                                                    |
|  +-----------------------+     +--------------------------------+  |
|  |     CONTROL UNIT      |     |  ARITHMETIC LOGIC UNIT (ALU)   |  |
|  |  [Program Counter PC] |<--->|  [Status / Condition Flags]    |  |
|  |  [Instruction Reg IR] |     |  [Fixed & Floating Operations] |  |
|  +-----------------------+     +--------------------------------+  |
|              ^                                  ^                  |
|              |                                  |                  |
|              +---------> [REGISTERS] <----------+                  |
|                   (General Purpose: RAX, RBX... )                  |
+--------------------------------------------------------------------+
                                 ^
                                 |  [System Bus / Memory Controller]
                                 v
+--------------------------------------------------------------------+
|                        MEMORY HIERARCHY                            |
|     L1 Cache (32KB, ~1ns)  -->  L2 Cache (512KB, ~4ns)             |
|     --> L3 Cache (16MB, ~12ns) --> Main RAM (DDR5, ~60-100ns)      |
|     --> NVMe SSD / Disk (Storage Bus, ~10-100 microseconds)        |
+--------------------------------------------------------------------+
```

### 2.2 The Instruction Cycle

The central processing unit executes a continuous loop known as the Fetch-Decode-Execute cycle:

1. **Fetch:** The Control Unit reads the instruction at the physical memory address indicated by the Program Counter ($PC$) into the Instruction Register ($IR$). $PC$ is incremented by the instruction width.
2. **Decode:** The instruction's opcode and operand fields are decoded by the micro-architecture.
3. **Execute:** The ALU performs arithmetic/logic computations, evaluates branches, or the memory management unit (MMU) loads/stores data from/to registers.
4. **Interrupt Check:** Hardware and software interrupt lines are polled before starting the next cycle.

### 2.3 The Memory Hierarchy & Latency Numbers

A software engineer must know the relative latency costs of hardware operations. Memory is not uniform; accessing data that is not in the CPU cache stalls instruction pipelines.

| Level | Typical Capacity | Access Latency | Cycles (@ 3 GHz) | Relative Visual Scale |
|---|---|---|---|---|
| **CPU Register** | ~1 KB | 0.3 ns | 1 cycle | 1 second |
| **L1d / L1i Cache** | 32–64 KB | ~1 ns | 3–4 cycles | 3 seconds |
| **L2 Cache** | 512 KB – 1 MB | ~3–4 ns | 10–14 cycles | 12 seconds |
| **L3 Cache (Shared)** | 16–64 MB | ~10–15 ns | 30–50 cycles | 40 seconds |
| **Main Memory (DRAM)**| 16–128 GB | ~60–80 ns | ~200 cycles | 4 minutes |
| **NVMe SSD Read** | 1–4 TB | ~20–50 $\mu$s | ~100,000 cycles | 2 days |
| **SATA SSD Read** | 500 GB – 2 TB | ~150–200 $\mu$s | ~500,000 cycles | 1 week |
| **HDD Seek & Read** | 2–16 TB | ~5–10 ms | ~20,000,000 cycles | 6 months |
| **Network (Local DC)**| N/A | ~500 $\mu$s | ~1,500,000 cycles | 2.5 weeks |
| **Network (Cross-US)**| N/A | ~30–70 ms | ~150,000,000 cycles | 4 years |

*Key principle:* Cache lines are typically 64 bytes. Accessing contiguous sequential memory (spatial locality) allows prefetchers to saturate L1 cache, outperforming random pointer-chasing by orders of magnitude.

---

## 3. Data Representation, Encodings & Memory Layout

### 3.1 Binary Numbers, Two's Complement & Endianness

All digital information is represented as binary digits ($0$ or $1$).
- A **nibble** is 4 bits ($2^4 = 16$ states, represented by one hexadecimal character `0-F`).
- A **byte** (octet) is 8 bits ($2^8 = 256$ distinct values, `0x00` to `0xFF`).
- A **word** matches the native register width of the architecture (32-bit = 4 bytes; 64-bit = 8 bytes).

#### Signed Integers: Two's Complement

To allow addition and subtraction circuits to be identical, signed integers are stored in Two's Complement format. For an $n$-bit signed integer:
- The most significant bit (MSB) has negative weight $-2^{n-1}$.
- Positive numbers: $0$ prefix (e.g., $00000101_2 = +5$).
- Negation algorithm: Invert all bits and add $1$.
  - $+5 = 00000101_2 \xrightarrow{\text{invert}} 11111010_2 \xrightarrow{+1} 11111011_2 = -5$.
- Range for $n$ bits: $[-2^{n-1}, 2^{n-1} - 1]$. For an 8-bit byte: $[-128, 127]$.

#### Endianness (Byte Order)

When multi-byte words are stored in byte-addressable memory:
- **Little-Endian (x86, ARM):** Least significant byte (LSB) stored at lowest memory address.
  - Value `0x12345678` at address `0x1000`: `[0x78, 0x56, 0x34, 0x12]`.
- **Big-Endian (Network Byte Order):** Most significant byte (MSB) stored at lowest memory address.
  - Value `0x12345678` at address `0x1000`: `[0x12, 0x34, 0x56, 0x78]`.

### 3.2 Floating-Point Arithmetic (IEEE 754) & Financial Accuracy

Floating-point numbers approximate real numbers using scientific notation in base 2:

$$V = (-1)^s \times (1 + \text{fraction}) \times 2^{(\text{exponent} - \text{bias})}$$

| Precision | Total Bits | Sign ($s$) | Exponent ($e$) | Mantissa / Fraction ($f$) | Precision |
|---|---|---|---|---|---|
| **Single (`f32`, `float`)** | 32 | 1 bit | 8 bits (bias 127) | 23 bits | ~7 decimal digits |
| **Double (`f64`, `double`)**| 64 | 1 bit | 11 bits (bias 1023)| 52 bits | ~15–17 decimal digits |

#### The Financial Danger of Binary Floating-Point

Numbers like $0.1_{10}$ cannot be represented exactly in binary floating-point (it is an infinite repeating binary fraction $0.0001100110011\dots_2$).

```python
# The classic floating-point imprecision hazard
assert 0.1 + 0.2 != 0.3
print(0.1 + 0.2)  # 0.30000000000000004
```

**Absolute Law for Financial Systems:** Never store currency or exact counts in binary floating-point (`float`, `double`, `f64`). Use:
1. Integer minor currency units (e.g., cents, satoshis, micro-units).
2. Fixed-point or arbitrary-precision decimal representations (e.g., Python `decimal.Decimal`, Rust `rust_decimal::Decimal`).

### 3.3 Text Encoding: Unicode and UTF-8

- **Character:** An abstract textual unit (e.g., letter 'A', '€', '日').
- **Code Point:** A unique numerical integer assigned to a character by the Unicode Standard, written `U+XXXX` (range `U+0000` to `U+10FFFF`, totaling 1,114,112 possible code points).
- **Encoding:** The deterministic mapping from code point integers to physical byte sequences.

#### UTF-8 Variable-Length Encoding

UTF-8 is the universal standard for all files, network protocols, and storage. It is backward-compatible with 7-bit ASCII and self-synchronizing.

| Code Point Range (Hex) | Bytes | UTF-8 Byte Format (Binary) | Description |
|---|---|---|---|
| `U+0000` .. `U+007F` | 1 | `0xxxxxxx` | Standard ASCII (0–127) |
| `U+0080` .. `U+07FF` | 2 | `110xxxxx 10xxxxxx` | Latin, Greek, Cyrillic, Arabic |
| `U+0800` .. `U+FFFF` | 3 | `1110xxxx 10xxxxxx 10xxxxxx` | Asian scripts, Common Symbols |
| `U+10000` .. `U+10FFFF`| 4 | `11110xxx 10xxxxxx 10xxxxxx 10xxxxxx` | Emojis, Historic, Rare scripts |

*Properties of UTF-8:*
- ASCII bytes (`0x00`–`0x7F`) never appear as continuation bytes (`10xxxxxx`).
- A missing or corrupt byte cannot corrupt subsequent characters beyond the damaged sequence.
- No byte order mark (BOM) is required; UTF-8 has no endianness ambiguity.

---

## 4. Programming Language Theory & Type Systems

### 4.1 Syntax vs Semantics

- **Syntax:** The formal structural rules governing valid symbol combinations (checked during lexing and parsing). Expressed via Context-Free Grammars (EBNF).
- **Static Semantics:** Rules verified before execution (e.g., type checking, variable declaration scoping, lifetime analysis).
- **Dynamic Semantics:** The runtime behavior and state transformations that occur when instructions execute (operational, denotational, or axiomatic semantics).

### 4.2 The Type System Matrix

A type system is a tractable syntactic method for proving the absence of certain program behaviors by classifying phrases according to the kinds of values they compute (Pierce, 2002).

```
                      TYPE CHECKING TIMING
                 Static                 Dynamic
          +----------------------+----------------------+
          | Rust, C++, Java,     | Python, Ruby,        |
   Strong | Haskell, Kotlin,     | Common Lisp          |
          | TypeScript (compile) |                      |
TYPE      +----------------------+----------------------+
STRENGTH  | C, C++               | JavaScript, PHP      |
   Weak   | (unchecked casts,    | (implicit type       |
          | raw pointer math)    | coercions)           |
          +----------------------+----------------------+
```

- **Static Typing:** Type verification occurs at compile-time before code is executed. Invalid operations produce compile errors.
- **Dynamic Typing:** Type information is attached to runtime objects, not variables. Operations are checked at execution time.
- **Strong Typing:** The language enforces type boundaries. Explicit conversions are required; silent reinterpretation of bits is rejected.
- **Weak Typing / Coercion:** The language implicitly coerces dissimilar types (e.g., in JavaScript: `[] + {} === "[object Object]"`, `"5" - 3 === 2`).

### 4.3 Type System Taxonomy

1. **Nominal Typing:** Type compatibility is determined exclusively by explicit named declarations.
   - Example: Java, Rust, Kotlin (`struct Point { x: i32 }` is distinct from `struct Vector { x: i32 }`).
2. **Structural Typing ("Duck Typing" with proofs):** Type compatibility is determined by shape and structure, regardless of name.
   - Example: TypeScript, Go interfaces (`interface Reader { read(): string }` matches any object having a conforming `read()` method).
3. **Generics & Parametric Polymorphism:** Functions and data structures parameterized over types without sacrificing type safety (e.g., `List<T>`, `Result<T, E>`).
4. **Type Erasure:** Static type annotations are checked during compilation and completely removed from the emitted runtime bytecode or binary (e.g., TypeScript emitting JavaScript, Java generics).

---

## 5. Compilers, Interpreters, JIT, and Runtimes

### 5.1 The Translation Pipeline

```
 Source Code (.rs, .ts, .py)
             |
             v  [Lexical Analysis / Tokenizer]
        Token Stream
             |
             v  [Syntactic Analysis / Parser]
   Abstract Syntax Tree (AST)
             |
             v  [Semantic Analysis / Type Checker]
     Decorated AST / Symbol Table
             |
             v  [Intermediate Representation (IR) Generation]
      High-Level / Low-Level IR (e.g., LLVM IR, Bytecode)
             |
     +-------+-------------------------+
     |                                 |
     v [Ahead-Of-Time (AOT)]           v [Virtual Machine / Interpreter]
 Target Machine Code (ELF, PE)      Bytecode Evaluation Loop (CPython, JVM)
             |                                 |
             v                                 v [Just-In-Time (JIT)]
 Native CPU Execution               Dynamic Native Machine Code (V8, PyPy)
```

### 5.2 Execution Models Compared

| Execution Model | Compilation Time | Startup Latency | Peak Throughput | Memory Footprint | Examples |
|---|---|---|---|---|---|
| **Pure Interpreter** | None | Instant (~0 ms) | Low (10x–100x slower)| Minimal | Shell scripts, Tree-walk evaluators |
| **Bytecode Interpreter** | Very fast | Fast (~10–50 ms) | Moderate | Small–Medium | CPython, Ruby MRI |
| **JIT Compiler (Tiered)**| Moderate | Fast–Moderate | High (approaches native)| High (stores code cache) | V8 (Node/Chrome), HotSpot JVM |
| **AOT Native Compiler** | Slow (seconds–minutes) | Instant (~1 ms) | Maximum (hardware limits)| Lean & deterministic | Rust (`rustc`), C/C++ (`gcc`/`clang`), Go |

### 5.3 Memory Management Strategies

Every program must allocate, manage, and reclaim memory for dynamic data structures.

1. **Manual Allocation (C, C++):** Explicit `malloc()` / `free()`.
   - *Hazards:* Memory leaks, use-after-free, double free, buffer overflows, dangling pointers.
2. **Tracing Garbage Collection (V8, JVM, Go, CPython cyclic):**
   - The runtime periodically traverses object reference graphs starting from root pointers (stack frames, global variables). Unreachable objects are marked and swept.
   - *Trade-offs:* Eliminates manual memory safety bugs; introduces non-deterministic GC pauses and higher memory overhead.
3. **Reference Counting with Cycle Detection (CPython, Swift):**
   - Every object maintains an internal integer counter tracking incoming references. When `refcount == 0`, memory is immediately freed. Cyclic references require a periodic cycle-breaker collector.
4. **Compile-Time Ownership & Affine Lifetimes (Rust):**
   - Every piece of memory has exactly one owner at any given time. When the owner goes out of scope, the compiler inserts deterministic deallocation code (`drop`). Borrowing rules (`&T` immutable shared, `&mut T` exclusive mutable) are proven at compile time without any runtime GC pause.

---

## 6. Core Data Structures & Abstract Data Types

Understanding the structural mechanics, memory layouts, and algorithmic trade-offs of data structures is foundational to writing high-performance software.

```
+-----------------------------------------------------------------------------------+
|                            DATA STRUCTURE MEMORY LAYOUTS                          |
|                                                                                   |
|  1. CONTIGUOUS ARRAY (High Cache Locality, Random Access O(1))                   |
|     +--------+--------+--------+--------+--------+                                |
|     | Item 0 | Item 1 | Item 2 | Item 3 | Item 4 |                                |
|     +--------+--------+--------+--------+--------+                                |
|     Addr: 0x00    0x08     0x10     0x18     0x20                                 |
|                                                                                   |
|  2. SINGLY LINKED LIST (Non-contiguous, Pointer Chasing, O(n) Access)             |
|     +------+------+      +------+------+      +------+------+                     |
|     | Data | Next |----->| Data | Next |----->| Data | NULL |                     |
|     +------+------+      +------+------+      +------+------+                     |
|     Heap: 0x1040         Heap: 0x2080         Heap: 0x1500                        |
|                                                                                   |
|  3. HASH TABLE (Buckets + Open Addressing / Chaining)                             |
|     Key -> hash(Key) % Capacity -> Bucket Index -> Value                          |
|                                                                                   |
|  4. BINARY SEARCH TREE (Left < Root < Right) & BALANCED TREES (AVL, Red-Black)    |
|                          [ Root: 50 ]                                             |
|                          /          \                                             |
|                   [ Left: 20 ]   [ Right: 80 ]                                    |
+-----------------------------------------------------------------------------------+
```

### 6.1 Contiguous vs Node-Based Structures

| Structure | Access Time | Insertion (Beginning) | Insertion (End) | Deletion | Cache Locality | Overhead |
|---|---|---|---|---|---|---|
| **Array (Fixed)** | $O(1)$ | $O(n)$ | N/A | $O(n)$ | Optimal | Zero |
| **Dynamic Array (`Vec`, `list`)**| $O(1)$ | $O(n)$ | Amortized $O(1)$| $O(n)$ | Optimal | Capacity buffer |
| **Singly Linked List** | $O(n)$ | $O(1)$ | $O(n)$ or $O(1)$ | $O(1)$ (at ptr) | Poor | 1 pointer / node |
| **Doubly Linked List** | $O(n)$ | $O(1)$ | $O(1)$ | $O(1)$ (at ptr) | Poor | 2 pointers / node|

### 6.2 Hash Tables & Collision Resolution

A Hash Table implements an associative array mapping keys to values with average $O(1)$ lookup, insertion, and deletion.

1. **Hash Function:** Converts an arbitrary key into a uniform deterministic 64-bit integer (e.g., SipHash, MurmurHash, xxHash).
2. **Bucket Mapping:** `index = hash(key) & (capacity - 1)` (when capacity is a power of 2).
3. **Collision Resolution:**
   - **Separate Chaining:** Each bucket points to a linked list or small array of colliding entries.
   - **Open Addressing (Linear Probing, Robin Hood Hashing):** All entries live directly in the contiguous table. On collision, probe the next slots ($i + 1, i + 2, \dots$). Far superior cache locality.
4. **Load Factor:** $\alpha = \frac{N}{\text{capacity}}$. When $\alpha > 0.75$, the table is resized (doubled) and all entries are rehashed.

### 6.3 Trees and Hierarchical Structures

1. **Binary Search Tree (BST):** Left child $< \text{node} < \text{right child}$. Degenerates to $O(n)$ if unbalanced.
2. **Self-Balancing Trees (AVL, Red-Black):** Maintain tree height $h \le 2 \log_2(n)$ via tree rotations, guaranteeing $O(\log n)$ operations.
3. **B-Trees & $B^+$ Trees:** Multi-way balanced search trees optimized for block storage (disk, SSD, database pages). Nodes match disk page size (typically 4 KB or 16 KB) with high fan-out (hundreds of keys per node) to minimize I/O seeks.
4. **Binary Heap (Priority Queue):** Complete binary tree stored inside a contiguous array satisfying the heap invariant (Parent $\le$ Children for Min-Heap). Root extraction is $O(\log n)$, insertion is $O(\log n)$, peek is $O(1)$.

---

## 7. Algorithmic Complexity & Fundamental Algorithms

### 7.1 Asymptotic Analysis (Big-O Notation)

Asymptotic notation characterizes the growth rate of an algorithm's resource consumption (time or memory) as the input size $n$ approaches infinity:

- **$O(g(n))$ [Upper Bound]:** $f(n) \in O(g(n))$ if $\exists c > 0, n_0 > 0$ such that $0 \le f(n) \le c \cdot g(n) \quad \forall n \ge n_0$.
- **$\Omega(g(n))$ [Lower Bound]:** $f(n) \in \Omega(g(n))$ if $\exists c > 0, n_0 > 0$ such that $0 \le c \cdot g(n) \le f(n) \quad \forall n \ge n_0$.
- **$\Theta(g(n))$ [Tight Bound]:** $f(n) \in \Theta(g(n))$ if $f(n) \in O(g(n))$ and $f(n) \in \Omega(g(n))$.

```
Operations (Time)
  ^
  |                                        O(n!) / O(2^n) - Exponential (Intractable)
  |                                   |   /
  |                                   |  /  O(n^2) - Quadratic (Nested Loops)
  |                                   | /
  |                                   |/   O(n log n) - Linearithmic (Optimal Sort)
  |                                  /|
  |                                 / |    O(n) - Linear (Single Pass)
  |                                /  |
  |  -----------------------------/---|--- O(log n) - Logarithmic (Binary Search)
  |  =================================+=-- O(1) - Constant (Hash Lookup, Register Math)
  +------------------------------------------------------------> Input Size (n)
```

### 7.2 Sorting Algorithms

| Algorithm | Best Time | Average Time | Worst Time | Space | Stable | Method |
|---|---|---|---|---|---|---|
| **Quicksort (Dual-Pivot)** | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | No | Divide & Conquer (Partition) |
| **Mergesort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Yes | Divide & Conquer (Merge) |
| **Heapsort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ | No | Selection (Heap Invariant) |
| **Timsort (Python/V8)** | $O(n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Yes | Hybrid Insertion + Merge |

*Lower Bound Theorem:* Any comparison-based sorting algorithm requires at least $\Omega(n \log n)$ comparisons in the worst case.

### 7.3 Graph Algorithms

A graph $G = (V, E)$ consists of a set of vertices $V$ and edges $E$.

1. **Breadth-First Search (BFS):** Explores vertices level-by-level using a FIFO queue. Time: $O(|V| + |E|)$. Computes shortest path on unweighted graphs.
2. **Depth-First Search (DFS):** Explores along branches as deep as possible using recursion/LIFO stack. Time: $O(|V| + |E|)$. Used for topological sorting and cycle detection.
3. **Dijkstra's Algorithm:** Computes single-source shortest path on weighted graphs with non-negative edge weights using a priority queue. Time: $O((|V| + |E|) \log |V|)$.
4. **$A^*$ Search:** Guided shortest-path search using a heuristic function $h(n)$ estimating distance to target: $f(n) = g(n) + h(n)$.

---

## 8. Concurrency, Parallelism & Asynchronous I/O

### 8.1 Concurrency vs Parallelism

- **Concurrency:** Dealing with lots of things at once (structure of a system managing multiple out-of-order execution threads or tasks).
- **Parallelism:** Doing lots of things at once (physical simultaneous execution of multiple operations on multiple CPU cores).

### 8.2 Processes vs OS Threads vs Green Threads

| Model | Memory Space | Context Switch Cost | Creation Cost | Synchronization |
|---|---|---|---|---|
| **OS Process** | Isolated virtual address space | High (MMU flush, page tables)| High | IPC (Pipes, Sockets, Shared Memory) |
| **OS Thread** | Shared within process | Medium (Register saves, kernel)| Medium | Mutexes, Atomics, Semaphores, RWLocks |
| **Async / Coroutines** | Shared single thread / pool | Low (User-space state machine)| Minimal (bytes) | Event Loop, Queues, Channels |

### 8.3 Concurrency Hazards & Coffman Deadlock Conditions

- **Race Condition:** Software behavior depends on the non-deterministic timing or interleaving of concurrent execution units.
- **Data Race:** Two or more threads concurrently access the same memory location where at least one access is a write, without synchronization.

#### The Four Coffman Deadlock Conditions

A deadlock occurs if and only if all four conditions hold simultaneously:
1. **Mutual Exclusion:** Resources cannot be shared; held in non-shareable mode.
2. **Hold and Wait:** A thread holds at least one resource while waiting to acquire another.
3. **No Preemption:** Resources cannot be forcibly confiscated from a thread.
4. **Circular Wait:** A closed chain of threads exists where each thread waits for a resource held by the next.

*Prevention:* Acquire locks in a strict global deterministic order to eliminate circular wait.

### 8.4 Event Loops & Asynchronous I/O (epoll / kqueue / IOCP)

Traditional synchronous network servers allocate one thread per connection, failing at scale (the C10K problem) due to stack memory overhead and context switching.

Asynchronous event-driven runtimes (Node.js/V8, Python `asyncio`, Rust `tokio`) multiplex thousands of non-blocking sockets on a single thread using OS-native readiness notifications:
- Linux: `epoll`
- macOS / BSD: `kqueue`
- Windows: I/O Completion Ports (`IOCP`)

```
                  THE EVENT LOOP ARCHITECTURE
                  
  +---------------------------------------------------------+
  |                   CALL STACK (Synchronous)              |
  |   Executes current frame to completion (Run-To-Completion)|
  +---------------------------------------------------------+
                              |
                              v (Initiates Async I/O / Timer)
  +---------------------------------------------------------+
  |              OS KERNEL (epoll / IOCP / Timer)           |
  |   Monitors network sockets, file descriptors, clocks    |
  +---------------------------------------------------------+
                              |
                              v (Ready Signal / Completion Event)
  +---------------------------------------------------------+
  |                     EVENT QUEUE                         |
  |   [ Task Callback 1 ] -> [ Task Callback 2 ] -> ...     |
  +---------------------------------------------------------+
                              ^
                              | (Pops next task when Stack is empty)
                     [ EVENT LOOP RUNNER ]
```

---

## 9. Operating System Interfaces, Processes & Virtual Memory

### 9.1 Virtual Memory & Paging

Modern operating systems provide every process with the illusion of an isolated, continuous, private address space (typically 128 TB on 64-bit architectures).

```
  Process Virtual Address Space                  Physical RAM (DRAM)
  +---------------------------+             +---------------------------+
  | Code / Text Segment       | Page Table  | Physical Frame 412        |
  | Data / BSS (Globals)      | ----------> | Physical Frame 809        |
  | Heap (grows upward)       |             | Physical Frame 12         |
  |   ...                     |             | ...                       |
  | Stack (grows downward)    |             +---------------------------+
  +---------------------------+
```

1. **Pages and Frames:** Virtual memory is split into uniform **Pages** (typically 4 KB). Physical RAM is split into matching **Page Frames**.
2. **Page Tables & MMU:** The CPU Memory Management Unit translates virtual addresses to physical frames using hardware page tables.
3. **Page Fault:** If a virtual page is not mapped to physical RAM (e.g., swapped out or lazily allocated), the MMU triggers a hardware page fault trap, prompting the kernel to page in the required data.
4. **Memory Protection:** Page table entries contain permission bits (`Read`, `Write`, `Execute` - $W \oplus X$ policy prevents executing code from writable stack memory).

### 9.2 Process Anatomy in Memory

```
High Memory (0x7FFFFFFFFFFF)
+-------------------------------------------------------------+
| Kernel Space (Mapped into process, inaccessible in user mode) |
+-------------------------------------------------------------+
| Stack (Local variables, return addresses; grows DOWNWARD)   |
|   |                                                         |
|   v                                                         |
|                                                             |
|   ^                                                         |
|   |                                                         |
| Heap (Dynamically allocated memory `malloc`; grows UPWARD)   |
+-------------------------------------------------------------+
| BSS Segment (Uninitialized global and static variables)     |
+-------------------------------------------------------------+
| Data Segment (Initialized global and static variables)      |
+-------------------------------------------------------------+
| Text / Code Segment (Executable machine instructions, read-only)|
+-------------------------------------------------------------+
Low Memory (0x000000000000 - Protected null page)
```

---

## 10. Network Protocols & Distributed Communication

### 10.1 The Network Model: OSI vs TCP/IP

```
    OSI 7-LAYER MODEL                      TCP/IP 4-LAYER MODEL
+-----------------------+              +---------------------------+
| 7. Application Layer  | <----------> | Application Layer         |
| 6. Presentation Layer |              | (HTTP, DNS, SSH, TLS)     |
| 5. Session Layer      |              +---------------------------+
+-----------------------+              | Transport Layer           |
| 4. Transport Layer    | <----------> | (TCP, UDP, QUIC)          |
+-----------------------+              +---------------------------+
| 3. Network Layer      | <----------> | Internet Layer (IP, ICMP) |
+-----------------------+              +---------------------------+
| 2. Data Link Layer    | <----------> | Network Interface         |
| 1. Physical Layer     |              | (Ethernet, Wi-Fi, Fiber)  |
+-----------------------+              +---------------------------+
```

### 10.2 TCP vs UDP

- **Transmission Control Protocol (TCP - RFC 9293):**
  - Connection-oriented (Three-way handshake: `SYN` $\to$ `SYN-ACK` $\to$ `ACK`).
  - Guaranteed ordered delivery, byte-stream abstraction, packet retransmission.
  - Congestion control (AIMD, BBR) and flow control (sliding window).
  - Use: Web (HTTP/1.1, HTTP/2), database connections, SSH, file transfer.
- **User Datagram Protocol (UDP - RFC 768):**
  - Connectionless, unreliable, unordered datagram delivery.
  - Zero handshake latency, minimal header overhead (8 bytes vs TCP 20+ bytes).
  - Use: Real-time gaming, DNS queries, video streaming, QUIC (HTTP/3).

### 10.3 HTTP Semantics & REST Architecture

**HTTP/1.1 (RFC 9112) / HTTP/2 (RFC 9113) / HTTP/3 (RFC 9114):**
- **Methods:**
  - `GET`: Safe, idempotent retrieval of representation. No side-effects.
  - `POST`: Create subordinate resource or trigger server processing. Non-idempotent.
  - `PUT`: Complete resource replacement at specified URI. Idempotent.
  - `PATCH`: Partial resource modification. Non-idempotent by default.
  - `DELETE`: Remove resource. Idempotent.
- **Status Code Classes:**
  - `1xx` Informational (e.g., `101 Switching Protocols`)
  - `2xx` Success (`200 OK`, `201 Created`, `204 No Content`)
  - `3xx` Redirection (`301 Moved Permanently`, `304 Not Modified`)
  - `4xx` Client Error (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable Entity`)
  - `5xx` Server Error (`500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout`)

---

## 11. Data Persistence, Relational Theory & SQL Engines

### 11.1 Relational Algebra & The Relational Model

Formulated by Edgar F. Codd (1970), data is structured into **relations** (tables), consisting of a heading of attributes (columns) and a body of **tuples** (rows).

Core Operations:
1. **Selection ($\sigma_{\phi}(R)$):** Filter tuples satisfying predicate $\phi$.
2. **Projection ($\pi_{a_1, \dots, a_k}(R)$):** Select a subset of attributes.
3. **Cartesian Product ($R \times S$):** All pair combinations.
4. **Join ($R \bowtie_{\theta} S$):** Product followed by selection on join condition $\theta$.

### 11.2 ACID Transaction Guarantees

- **Atomicity:** All operations within a transaction complete successfully, or all are completely aborted and rolled back. No partial writes.
- **Consistency:** A transaction transitions the database from one valid state satisfying all schema constraints, invariants, and foreign keys to another.
- **Isolation:** Concurrent transactions execute without interfering with one another, preventing anomalies (dirty reads, non-repeatable reads, phantom reads).
- **Durability:** Once committed, transaction results survive system crashes, power failures, or OS restarts (enforced via Write-Ahead Logging).

### 11.3 Database Indexing Mechanics

A database table without an index requires a sequential full table scan ($O(n)$) to locate matching rows.

- **B-Tree Index:** Stores key-pointer pairs in a balanced search tree. Enables exact match ($O(\log n)$), range scans (`BETWEEN`, `>`, `<`), and prefix searches in $O(\log n)$ time.
- **Write-Ahead Logging (WAL):** Modifications are appended sequentially to a log file on disk before dirty database pages are written to the main data file. Enables atomic rollback and fast crash recovery.

---

## 12. Regular Expressions, Automata & Formal Grammars

### 12.1 Regular Expressions & Finite State Automata

A regular expression describes a regular language (Type 3 in the Chomsky hierarchy) and is mathematically equivalent to a Finite State Automaton.

```
Regex: /a(b|c)*d/

State Transition Diagram (DFA):
       +-------+   'a'   +-------+
------>|  S0   |-------->|  S1   |
       +-------+         +-------+
                          |   ^
                    'b','c'|   | 'b','c'
                          v   |
                         +-------+   'd'   +==============+
                         |  S2   |-------->|| S3 (Accept) ||
                         +-------+         +==============+
```

1. **Nondeterministic Finite Automaton (NFA - Thompson's Construction):** Can transition to multiple states on a single input or via $\epsilon$-transitions.
2. **Deterministic Finite Automaton (DFA - Powerset Construction):** Exactly one deterministic next state for every (state, input symbol) pair. Execution time is strictly linear $O(n)$ with input length.
3. **Catastrophic Backtracking Hazard:** Naive backtracking regex engines (used in Python `re`, JavaScript RegExp) can exhibit exponential $O(2^n)$ worst-case time complexity when evaluating nested ambiguous quantifiers like `(a+)+$`. Avoid unbounded nested quantifiers on untrusted input.

---

## 13. Language Families & Engineering Idioms

Languages are tools with different cost models. No single “lane” is required. Pick by **machine target, type discipline, and memory model**.

| Family (school cut) | Typical job | Example languages (not a census) |
|---|---|---|
| **Systems / native** | OS interfaces, compilers, tight latency | C, C++, Rust, Zig |
| **Managed / VM** | Portable services, large codebases | Java, Kotlin, C#, Go |
| **Scripting / dynamic** | glue, analysis, prototypes | Python, Ruby, Lua |
| **Web client** | DOM, browser APIs | JavaScript, TypeScript |
| **Query** | set-oriented data | SQL (SQLite, PostgreSQL, …) |
| **Sandbox bytecode** | in-browser or plugin compute | WebAssembly |

Official doors live in `LINK_INDEX.md` (Python docs, ECMA-262, MDN, Rust book, Kotlin, SQLite). fetch the language’s own book; do not invent a standard from memory.

### 13.1 Language Selection Matrix (worked examples)

| Language | Primary machine target | Type system | Memory model | When it earns its keep |
|---|---|---|---|---|
| **Python 3** | CPython VM | Dynamic + optional type hints | Reference counting + cycle GC | Scripts, services, scientific glue |
| **TypeScript** | Emitted JavaScript → a JS engine | Static (structural, erased) | Tracing GC of the host | Typed web programs |
| **JavaScript** | Browser / Node / Deno | Dynamic, with coercions | Tracing GC | The web execution runtime |
| **Rust** | Native (and Wasm) | Static, ownership/lifetimes | RAII, no tracing GC | Memory-critical native code |
| **Kotlin** | JVM / Android ART | Static, null-safe | Tracing GC | JVM and Android clients |
| **SQL** | A database engine | Manifest types per engine | Engine buffer / WAL | Persistent relational data |

These are **examples**. Fortran, Haskell, Swift, COBOL, and assembly remain real languages with real jobs.

**check:** target machine, type story, who frees the memory. a language slogan is not an architecture.

---

## 14. Specification, Testing & Problem Decomposition

### 14.1 Work order: why → what → how

Do not start at “how.” Resolve:

1. **Why:** what capability is missing, or what failure occurs. one sentence.
2. **What:** machine model, data contracts (schemas, lifetimes, invariants), failure modes.
3. **How:** pick a language, write a spec or a type, write a failing test, implement the smallest fix, then refactor.

### 14.2 Tests as checks

| kind | asks |
|---|---|
| **unit** | one function, mocked neighbors |
| **integration** | two real pieces together |
| **end-to-end** | the user-visible path |
| **property / fuzz** | random inputs against an invariant |

a test that cannot fail is decoration. a test that needs the network for a pure function is in the wrong layer.

### 14.3 Debugging

1. **reproduce** with a small input.
2. **locate** (stack, log, bisect, type error).
3. **name the invariant** that broke.
4. **fix the invariant**, not the symptom.
5. **add a check** so the class of bug cannot return unnoticed.

**undefined behavior** (C, C++, data races) is not a “heisenbug personality.” it is a contract hole. sanitizers and race detectors are tools; fetch their docs.

Doors: `LINK_INDEX.md`. Load-bearing constants and RFCs → fetch the named host.

```
CITE: warehouse/computing/TEXTBOOK.md
```
