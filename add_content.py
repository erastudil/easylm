import os

computing_content = '''

## CPU Pipelines and Branch Prediction

A processor executes instructions like a factory assembly line. Instead of building one car completely before starting the next, different workers handle different stages simultaneously.

- **Pipeline stages**: The sequence of fetching an instruction from memory, decoding what it means, executing the math or logic, and writing the result back to registers.
- **Instruction throughput**: Completing one instruction per clock cycle on average, even if a single instruction takes several cycles from start to finish.
- **Pipeline stall**: A delay that occurs when the next instruction cannot start because it needs data from a previous instruction that has not yet finished.
- **Data hazard**: A conflict where the output of one pipeline stage is immediately required as the input for the next stage, potentially forcing the pipeline to wait.
- **Branch prediction**: The mechanism where the processor guesses which way an if-statement will evaluate so it can keep the pipeline full before the actual condition is calculated.
- **Speculative execution**: The process of running instructions along the predicted path of a branch, which are later committed if the guess was correct or discarded if wrong.
- **Branch target buffer**: A small, fast memory structure that records the destination addresses of previously executed branches to speed up future predictions.

## Memory Hierarchy and TLB Paging

Computer memory balances speed and capacity. The fastest memory is tiny and sits right next to the processor core, while the slowest memory is massive and sits on a separate storage drive. 

- **L1 cache**: The smallest and fastest cache memory built directly into the processor core, usually split into separate instruction and data caches.
- **L2 and L3 caches**: Larger, slightly slower caches that back up the L1 cache; L3 is often shared across multiple processor cores.
- **Cache line**: The basic unit of data transferred between main memory and cache, typically 64 bytes, meaning neighboring data is fetched together.
- **Virtual memory**: A system that gives every program the illusion of having its own massive, contiguous block of memory, isolating it from other programs.
- **Page table**: The data structure used by the operating system to map a program's fake virtual addresses to real physical hardware addresses.
- **Page fault**: An interrupt that occurs when a program tries to access a virtual memory page that is not currently loaded in physical RAM.
- **Translation Lookaside Buffer (TLB)**: A dedicated hardware cache inside the CPU that stores recent virtual-to-physical address translations to skip slow page table lookups.

## Process Scheduling and Compilers

The operating system juggles thousands of tasks on a handful of processor cores by rapidly switching between them.

- **Context switch**: The process of saving the exact state of one running program and loading the state of another so it can take over the processor.
- **Time slice**: The brief window of processor time allocated to a process before the operating system pauses it to give another process a turn.
- **Intermediate Representation (IR)**: A generic, machine-independent code format that compilers use to analyze and optimize a program before translating it into final machine code.
- **Static Single Assignment (SSA)**: A compiler design pattern where every variable is assigned a value exactly once, making it much easier to track data flow and optimize loops.
'''

software_content = '''

## Distributed Systems and Network Partitions

A distributed system splits work across many independent computers that talk to each other. When a network cable is cut or a switch fails, some computers can no longer reach the rest of the group.

- **Fault domain**: A group of components that share a single point of failure, such as servers plugged into the same power strip or network switch.
- **Network partition**: A communication failure that splits a distributed system into isolated groups of nodes that cannot talk to each other.
- **Split-brain**: A dangerous state where a partitioned network causes two disconnected parts of the system to both believe they are the primary leader, potentially overwriting each other's data.
- **CAP theorem**: The principle stating that during a network partition, a distributed system must choose between returning the most recent correct data (Consistency) or remaining online to serve requests (Availability).
- **Eventual consistency**: A guarantee that if no new updates are made, all copies of data across the distributed system will eventually match.
- **Consensus protocol**: An algorithm like Raft or Paxos that allows a cluster of machines to agree on a shared state or leader, even if some machines fail.
- **Heartbeat mechanism**: Periodic signals sent between nodes to prove they are alive; missing heartbeats indicate a node has failed or a network is partitioned.

## Database Isolation and Concurrency

Databases handle thousands of transactions at the same time. They must isolate these transactions so they don't step on each other's toes and corrupt the data.

- **ACID properties**: The fundamental database guarantees of Atomicity (all or nothing), Consistency (valid data), Isolation (transactions don't interfere), and Durability (saved permanently).
- **Serializability**: The highest level of database isolation, guaranteeing that executing transactions concurrently produces the exact same result as if they were executed one after the other.
- **Write skew**: An anomaly where two concurrent transactions read overlapping data and make decisions that invalidate each other, but because they update different rows, standard locks don't catch the conflict.
- **Multiversion Concurrency Control (MVCC)**: A mechanism where the database keeps multiple versions of a row; readers see a snapshot from the past without blocking writers, and writers don't block readers.
- **Deadlock**: A stalemate where two transactions are each waiting for the other to release a lock, requiring the database to forcibly abort one of them.
- **Write-Ahead Log (WAL)**: An append-only file where the database records every change before modifying the actual data tables, ensuring recovery after a power failure.
- **Zero-downtime schema migration**: The process of altering a database table's structure (like adding a column) in small, non-blocking steps so the application stays online the entire time.
- **Blue-green deployment**: A release strategy where a new version of the software is deployed alongside the old version, allowing traffic to be switched over instantly and safely.
'''

security_content = '''

## Modern Cipher Suites

Cryptography scrambles data so only authorized parties can read it. It relies on mathematical operations that are easy to perform in one direction but practically impossible to reverse without a key.

- **Symmetric encryption**: A cryptographic system where the exact same secret key is used both to lock and unlock the data.
- **AES-GCM**: Advanced Encryption Standard in Galois/Counter Mode, the industry standard symmetric cipher that simultaneously encrypts data and proves it hasn't been tampered with.
- **ChaCha20-Poly1305**: A fast, modern symmetric cipher suite designed to be highly secure even on mobile processors that lack dedicated hardware acceleration for AES.
- **Asymmetric encryption**: A cryptographic system using a paired public key for locking data and a mathematically linked private key for unlocking it.
- **Elliptic Curve Cryptography (ECC)**: An asymmetric approach using the algebraic structure of elliptic curves to provide strong security with much smaller key sizes than older methods like RSA.
- **Ed25519**: A specific, highly secure elliptic curve signature scheme known for its speed and resistance to side-channel attacks.
- **Forward secrecy**: A protocol property ensuring that even if a server's long-term private key is stolen in the future, past recorded encrypted conversations cannot be decrypted.

## Hardware Enclaves and Advanced Verification

Attackers don't always try to break the math; they often attack the physical machine running the math or try to steal the keys directly from memory.

- **Side-channel attack**: A method of extracting secrets by observing physical implementation details, like how long a computation takes, how much power it draws, or what sounds the processor makes.
- **Timing attack**: A specific side-channel attack where an attacker measures the exact milliseconds a server takes to reject a password, using those tiny differences to guess the correct characters.
- **Constant-time algorithm**: Cryptographic code explicitly written so that its execution time is identical regardless of the secret data being processed, neutralizing timing attacks.
- **Trusted Execution Environment (TEE)**: A secure area inside a main processor that guarantees code and data loaded inside are protected with respect to confidentiality and integrity.
- **Hardware secure enclave**: A physical implementation of a TEE, like Intel SGX or Apple Secure Enclave, that isolates sensitive operations from the rest of the operating system.
- **Zero-knowledge proof**: A cryptographic method allowing one party to prove to another that a statement is true without revealing any actual information beyond the truth of the statement.
- **Hash function**: A one-way mathematical algorithm that takes input data of any size and deterministically maps it to a fixed-size string of characters.
- **Salting**: The practice of appending a unique, random string to a password before hashing it to ensure that identical passwords yield completely different hashes, blocking rainbow table attacks.
'''

engineering_content = '''

## Solid Mechanics and Tensors

When a physical object is squeezed, stretched, or bent, the internal material reacts. Engineers calculate these internal forces to ensure bridges and machine parts do not break under load.

- **Stress**: The internal force exerted by neighboring particles of a continuous material upon each other, measured as force per unit area.
- **Strain**: The measure of physical deformation representing the displacement between particles in the material body relative to a reference length.
- **Young's modulus**: A mechanical property that measures the stiffness of a solid material, defining the linear relationship between stress and strain in the elastic region.
- **Stress-strain tensor**: A mathematical matrix that fully describes the state of stress and deformation at a specific point inside a 3D volume, accounting for forces pulling in all spatial directions.
- **Yield strength**: The maximum stress a material can endure before it permanently bends or deforms, transitioning from elastic behavior to plastic deformation.
- **Beam deflection**: The degree to which a structural element bends under a load, dependent on the beam's material, length, cross-sectional shape, and how it is supported.
- **Moment of inertia**: A geometric property of a beam's cross-section that dictates its resistance to bending and deflection; a taller I-beam has a much higher moment of inertia than a flat plate.

## Thermodynamics and Control Loops

Engines turn heat into motion, and refrigerators turn motion into cooling. Automated systems monitor these processes and adjust themselves to maintain precise temperatures or speeds.

- **First law of thermodynamics**: The principle of energy conservation stating that energy cannot be created or destroyed, only transformed from one state, like heat, to another, like mechanical work.
- **Carnot cycle**: An idealized thermodynamic cycle that sets the absolute maximum theoretical efficiency any heat engine can achieve when operating between two temperatures.
- **Enthalpy**: A thermodynamic quantity equivalent to the total heat content of a system, used to calculate energy transfers during heating or cooling processes.
- **Entropy**: A measure of the unavailable energy in a closed thermodynamic system that is also considered a measure of the system's disorder or randomness.
- **PID controller**: A control loop mechanism that continuously calculates an error value as the difference between a desired setpoint and a measured variable, applying a correction based on proportional, integral, and derivative terms.
- **Proportional band**: The part of a PID loop that applies a correction directly proportional to the current size of the error; a large error triggers a large correction.
- **Integral action**: The part of a PID loop that looks at the history of the error over time, steadily increasing the correction to eliminate any tiny, persistent gap between the target and actual value.
- **Derivative action**: The part of a PID loop that predicts future errors based on the current rate of change, acting as a brake to prevent the system from overshooting the target.
'''

trades_content = '''

## Machining and Metallurgy

Fabricating parts from raw metal requires careful control of how cutting tools interact with the material and how heat changes the metal's physical properties.

- **Speeds and feeds**: The fundamental variables of machining: the rotational speed of the cutting tool (RPM) and the speed at which the tool advances through the material (feed rate).
- **Chip load**: The physical thickness of the metal shaving removed by a single cutting edge on a tool during one revolution.
- **Surface feet per minute (SFM)**: A measure of the cutting speed representing how fast the outer edge of the cutting tool travels across the surface of the workpiece.
- **Work hardening**: A phenomenon where a metal becomes physically harder and more brittle as it is deformed or cut, often destroying cutting tools if the feed rate is too slow.
- **Annealing**: A heat treatment process that alters a metal's physical properties to increase its ductility and reduce its hardness, making it easier to bend or machine.
- **Weld penetration**: The physical depth to which the melted weld pool extends into the base metal, critical for the structural integrity of the joint.
- **Heat-affected zone (HAZ)**: The area of base metal surrounding a weld that did not melt but whose microscopic mechanical properties were altered by the intense heat.

## Electrical Systems and Plumbing

Installing building infrastructure requires precise calculations to prevent electrical fires and ensure water systems remain leak-free under pressure.

- **Ampacity**: The maximum electrical current, in amperes, that a conductor can carry continuously under the conditions of use without exceeding its temperature rating.
- **Voltage drop**: The loss of electrical potential along a wire's length due to its physical resistance, requiring thicker wires for long cable runs to ensure equipment receives enough power.
- **Overcurrent protection**: Devices like circuit breakers or fuses designed to automatically cut power when the current exceeds the safe capacity of the wires, preventing overheating and fires.
- **Ground fault circuit interrupter (GFCI)**: A fast-acting electrical safety device that constantly monitors the balance of current between the hot and neutral wires, instantly cutting power if it detects a leak to the ground.
- **Capillary action**: The physical mechanism that draws liquid solder into the microscopic gap between a copper pipe and a fitting against the force of gravity.
- **Flux**: A chemical cleaning agent applied before soldering that removes oxidation from the copper surface and prevents new oxidation during heating, allowing the solder to bond.
- **Galvanic corrosion**: An electrochemical process where one metal corrodes faster than normal when it is in direct contact with a different type of metal in the presence of an electrolyte like water.
- **Water hammer**: A destructive pressure surge or wave caused when a fluid in motion is forced to stop or change direction suddenly, often mitigated by installing physical air chambers or arrestors.
'''

files = {
    "computing": computing_content,
    "software": software_content,
    "security": security_content,
    "engineering": engineering_content,
    "trades": trades_content,
}

base_path = "C:/Users/jpm05/Documents/hnai/easylm/stacks"
for folder, content in files.items():
    filepath = os.path.join(base_path, folder, "TEXTBOOK.md")
    if os.path.exists(filepath):
        with open(filepath, "a", encoding="utf-8") as f:
            f.write(content)
        print(f"Appended {folder}")
    else:
        print(f"File not found: {filepath}")
