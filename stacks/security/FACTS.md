# FACTS — Information Security & Cryptography (005.8)
# Canonical Progen dialect facts grounded in TEXTBOOK.md and LINK_INDEX.md.

cia triad = fundamental information security model consisting of confidentiality, integrity, and availability. // door https://csrc.nist.gov/ // ref chapter 1.1

kerckhoffs principle : cryptographic axiom stating cryptosystem must be secure even if everything about design is public, provided key is secret. // door https://csrc.nist.gov/ // ref chapter 1.1

information theoretic security = security guarantee where ciphertext reveals zero information about plaintext to adversary with infinite computational power. // door https://eprint.iacr.org/ // ref chapter 1.2

one time pad security : the one-time pad achieves perfect information-theoretic secrecy if and only if key is truly random, same length as message, and used once. // door https://eprint.iacr.org/ // ref chapter 1.2

stride threat model = threat classification taxonomy categorizing spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege. // door https://owasp.org/ // ref chapter 1.3

advanced encryption standard = nist fips 197 standard symmetric block cipher operating on 128-bit blocks using 128, 192, or 256-bit keys. // door https://csrc.nist.gov/publications/detail/fips/197/final // ref chapter 2.1

substitution permutation network = block cipher design executing alternating rounds of non-linear byte substitution and linear diffusion bit permutations. // door https://csrc.nist.gov/publications/detail/fips/197/final // ref chapter 2.1

cipher block chaining vulnerability : CBC mode without message authentication is vulnerable to padding oracle attacks leaking plaintext byte by byte. // door https://csrc.nist.gov/ // ref chapter 2.2

galois counter mode = authenticated encryption mode combining counter mode encryption with galois field polynomial multiplication for integrity authentication. // door https://csrc.nist.gov/ // ref chapter 2.2

diffie hellman key exchange = cryptographic protocol allowing two parties to compute shared secret over unencrypted channel via discrete logarithm problem. // door https://www.ietf.org/standards/rfcs/ // ref chapter 3.1

rsa algorithm = public key cryptosystem relying on computational intractability of factoring large composite semiprime integers. // door https://csrc.nist.gov/ // ref chapter 3.2

elliptic curve cryptography = asymmetric cryptography utilizing algebraic structure of elliptic curves over finite fields to achieve equal security with smaller keys. // door https://www.ietf.org/standards/rfcs/ // ref chapter 3.3

forward secrecy = cryptographic property ensuring compromise of server long-term private key does not decrypt recorded past encrypted session traffic. // door https://www.ietf.org/standards/rfcs/ // ref chapter 3.4

cryptographic hash function = deterministic algorithm mapping arbitrary data to fixed-size digest satisfying pre-image, second pre-image, and collision resistance. // door https://csrc.nist.gov/ // ref chapter 4.1

sha 256 hash function = nist fips 180-4 standard cryptographic hash producing 256-bit message digest using merkle damgard compression structure. // door https://csrc.nist.gov/publications/detail/fips/180-4/final // ref chapter 4.1

hmac construction = keyed hash message authentication code combining cryptographic hash function with secret key using nested inner and outer padding. // door https://www.ietf.org/standards/rfcs/ // ref chapter 4.2

tls 1 3 handshake : internet security protocol reducing connection setup to single round-trip time and mandating ephemeral diffie-hellman forward secrecy. // door https://www.ietf.org/standards/rfcs/ // ref chapter 5.1

signal double ratchet algorithm = end-to-end messaging protocol combining symmetric KDF ratchet and asymmetric DH ratchet for self-healing forward and post-compromise secrecy. // door https://signal.org/docs/ // ref chapter 5.2

buffer overflow exploit = memory corruption flaw where unchecked input overwrites adjacent call stack memory altering saved instruction return pointer. // door https://csrc.nist.gov/ // ref chapter 6.1

address space layout randomization = kernel defense randomizing virtual memory offsets of stack, heap, and shared libraries to thwart code reuse attacks. // door https://csrc.nist.gov/ // ref chapter 6.2

memory safety = programming language property guaranteeing execution remains free from buffer overflows, use-after-free, and dangling pointers. // door https://csrc.nist.gov/ // ref chapter 6.3

sql injection vulnerability = application security flaw allowing malicious user input to manipulate SQL syntax and query execution structure. // door https://owasp.org/ // ref chapter 7.1

cross site scripting = vulnerability executing arbitrary client script in victim browser due to application reflecting unsanitized untrusted user input. // door https://owasp.org/ // ref chapter 7.2

cross site request forgery = attack forcing authenticated user browser to transmit unauthorized commands to vulnerable web application using ambient credentials. // door https://owasp.org/ // ref chapter 7.3

bitcoin proof of work = nakamoto consensus protocol where network agreement requires miners to find partial SHA-256 hash pre-images below difficulty target. // door https://bitcoin.org/en/developer-documentation // ref chapter 8.1

byzantine fault tolerance = distributed network capability to reach consensus despite arbitrary, corrupt, or malicious actor node behaviors. // door https://bitcoin.org/en/developer-documentation // ref chapter 8.2

zero knowledge proof = cryptographic protocol where prover demonstrates statement validity to verifier without revealing any information beyond validity. // door https://eprint.iacr.org/ // ref chapter 8.3

kerckhoffs's principle : A cryptographic system should be secure even if everything about the system, except the key, is public knowledge. // door https://csrc.nist.gov/ // ref 1.1 the fundamental security triad cia & kerckhoffs's principle

the one-time pad theorem : Perfect secrecy requires two immutable physical conditions - . // door https://csrc.nist.gov/ // ref 1.2 information-theoretic vs computational security claude shannon

computational security : In practice, transmitting gigabytes of true one-time keys is physically impractical. Modern cryptology therefore relies on computational hardness - breaking the cipher is mathematically possible, but requires an amount of computational work 2^{128} or 2^{256} operations that would consume more energy than boiling all the oceans on Earth, rendering brute-force search physically impossible before the heat death of the universe. // door https://csrc.nist.gov/ // ref 1.2 information-theoretic vs computational security claude shannon

s - spoofing : Pretending to be another entity mitigated by cryptographic authentication / digital signatures. // door https://csrc.nist.gov/ // ref 1.3 threat modeling frameworks stride & attack trees

t - tampering : Modifying data in transit or at rest mitigated by hashes, MACs, authenticated encryption. // door https://csrc.nist.gov/ // ref 1.3 threat modeling frameworks stride & attack trees

r - repudiation : Denying having performed an action mitigated by digital signatures, non-repudiable audit logs. // door https://csrc.nist.gov/ // ref 1.3 threat modeling frameworks stride & attack trees

i - information disclosure : Leaking secret data mitigated by symmetric/asymmetric encryption, access controls. // door https://csrc.nist.gov/ // ref 1.3 threat modeling frameworks stride & attack trees

d - denial of service : Exhausting system resources mitigated by rate limiting, resource quotas, Proof-of-Work. // door https://csrc.nist.gov/ // ref 1.3 threat modeling frameworks stride & attack trees

e - elevation of privilege : Gaining unauthorized capabilities mitigated by least-privilege compartmentalization. // door https://csrc.nist.gov/ // ref 1.3 threat modeling frameworks stride & attack trees

substitution-permutation networks : Shannon identified the two pillars of symmetric security - . // door https://csrc.nist.gov/ // ref 2.1 block ciphers & the advanced encryption standard aes

the nonce-reuse disaster in gcm : In AES-GCM, reusing a 96-bit initialization vector nonce with the same key allows an attacker to compute the GHASH authentication key H = EK0, completely destroying both authenticity and confidentiality. // door https://csrc.nist.gov/ // ref 2.2 cipher modes the fatal flaw of ecb & the triumph of aead

preimage resistance : Given h, it is computationally infeasible to find m such that Hm = h 2^{256} operations. // door https://csrc.nist.gov/ // ref 2.3 cryptographic hash functions & merkle trees

second preimage resistance : Given m1, infeasible to find m2 \ne m1 such that Hm1 = Hm2 2^{256}. // door https://csrc.nist.gov/ // ref 2.3 cryptographic hash functions & merkle trees

collision resistance : Infeasible to find any pair m1 \ne m2 such that Hm1 = Hm2. By the Birthday Paradox, this requires \sqrt{2^{256}} = 2^{128} operations. // door https://csrc.nist.gov/ // ref 2.3 cryptographic hash functions & merkle trees

merkle-damgård construction : Iterative compression functions. Vulnerable to Length-Extension Attacks if an attacker knows HM and |M|, they can compute HM \parallel M{suffix} without knowing M. Mitigated by using HMAC HK \oplus opad \parallel HK \oplus ipad \parallel M. // door https://csrc.nist.gov/ // ref 2.3 cryptographic hash functions & merkle trees

sponge construction : State divided into bitrate r and capacity c. Immune to length extension. // door https://csrc.nist.gov/ // ref 2.3 cryptographic hash functions & merkle trees

merkle trees : Binary trees where every non-leaf node is the hash of its children - . // door https://csrc.nist.gov/ // ref 2.3 cryptographic hash functions & merkle trees

logarithmic proof of inclusion : To prove transaction Tx C belongs to the block with Root R, the prover provides only Tx C, sibling HD, and cousin HAB. The verifier computes HHC \parallel HD \to H{CD}, then HH{AB} \parallel H{CD} \to R. Verifying a record among 1,000,000 items requires only \log210^6 \approx 20 hashes. // door https://csrc.nist.gov/ // ref 2.3 cryptographic hash functions & merkle trees

mandatory modern padding : Textbook RSA m^e \pmod n is deterministic and completely broken. It must always use randomized OAEP Optimal Asymmetric Encryption Padding for encryption and PSS Probabilistic Signature Scheme for digital signatures. // door https://csrc.nist.gov/ // ref 3.2 rsa rivest-shamir-adleman & prime factorization

the group law : Adding two points P and Q geometrically means drawing a straight line through them; the line intersects the curve at exactly one third point -R. Reflecting -R across the horizontal x-axis gives the sum R = P + Q. // door https://csrc.nist.gov/ // ref 3.3 elliptic curve cryptography ecc

scalar multiplication : Given base generator point G, multiplying by scalar k means adding G to itself k times - P = k \cdot G. // door https://csrc.nist.gov/ // ref 3.3 elliptic curve cryptography ecc

elliptic curve discrete logarithm problem : Given G and P = k \cdot G, finding the integer k requires O\sqrt{p} operations via Pollard's rho algorithm. For a 256-bit prime, this requires 2^{128} operations. // door https://csrc.nist.gov/ // ref 3.3 elliptic curve cryptography ecc

grover's algorithm : Quadratic speedup for unstructured search O\sqrt{N}. Halves symmetric key security AES-128 drops to 64 bits of security; AES-256 remains secure at 128 bits. // door https://csrc.nist.gov/ // ref 4.1 shor's algorithm & the threat of quantum computers

the hard problems : Finding the shortest non-zero vector Shortest Vector Problem, SVP or closest vector CVP in an arbitrary high-dimensional lattice n \ge 512 is NP-hard. Even quantum computers have found no polynomial-time algorithm to solve high-dimensional lattice problems. // door https://csrc.nist.gov/ // ref 4.2 lattice-based cryptography & learning with errors lwe

break-in recovery : If an attacker steals your key today, the moment you send new messages, the protocol automatically "heals" and locks the attacker out of tomorrow's messages. // door https://csrc.nist.gov/ // ref 5.2 the signal protocol x3dh & the double ratchet

extended triple diffie-hellman : Establishes initial shared secret using four DH exchanges between ephemeral and pre-published identity keys. // door https://csrc.nist.gov/ // ref 5.2 the signal protocol x3dh & the double ratchet

the symmetric kdf chain ratchet : Advances with every single message sent, deriving a unique single-use message key Ki that is deleted the microsecond it is used. // door https://csrc.nist.gov/ // ref 5.2 the signal protocol x3dh & the double ratchet

the asymmetric dh ratchet : Advances every time a conversation turn flips Alice sends, Bob replies. Bob sends a new ephemeral public key, forcing Alice to mix a new DH shared secret into the root KDF chain, instantly breaking the adversary's compromise. // door https://csrc.nist.gov/ // ref 5.2 the signal protocol x3dh & the double ratchet

onion routing mechanics : Client creates an encrypted circuit across three volunteer relays - Guard/Entry node, Middle relay, and Exit node. // door https://csrc.nist.gov/ // ref 5.3 metadata protection & onion routing the tor network

the anonymity guarantee : No single node in the circuit knows both the source IP and destination IP. // door https://csrc.nist.gov/ // ref 5.3 metadata protection & onion routing the tor network

difficulty adjustment : The target T adjusts dynamically every 2016 blocks ~2 weeks in Bitcoin so that blocks are found on average every 10 minutes - . // door https://csrc.nist.gov/ // ref 6.1 the double-spending problem & nakamoto consensus

nakamoto consensus : If two blocks are mined simultaneously, nodes track both branches. Whichever branch accumulates the greatest cumulative Proof-of-Work becomes the canonical truth. Rewriting past blocks requires an attacker to control >50\% of global hash power. // door https://csrc.nist.gov/ // ref 6.1 the double-spending problem & nakamoto consensus

arithmetic underflow / overflow : Mitigated in Solidity 0.8+ via built-in checked arithmetic. // door https://csrc.nist.gov/ // ref 6.2 transaction architectures utxo vs account state models

front-running & mev : Arbitrage bots monitoring the public mempool to insert transactions ahead of target transactions via higher gas fees. // door https://csrc.nist.gov/ // ref 6.2 transaction architectures utxo vs account state models

hardened derivation : Prevents deriving parent private keys if an attacker compromises a child private key and the master public key. // door https://csrc.nist.gov/ // ref 6.4 hierarchical deterministic hd wallets & key architecture

dep / $w\oplus x$ : Pages marked writable the stack, heap are hard-faulted by the CPU memory management unit MMU if executed. // door https://csrc.nist.gov/ // ref 7.2 return-oriented programming rop & binary defenses

stack canaries : Compiler places a random 64-bit secret value with a null byte immediately before the saved RBP. Before RET, the function checks if the canary has changed; if modified, the process terminates immediately stackchkfail. // door https://csrc.nist.gov/ // ref 7.2 return-oriented programming rop & binary defenses

the rop counter-attack : Attackers bypass W\oplus X by chaining together tiny snippets of legitimate executable instructions ending in RET "gadgets" already present in executable library memory e.g. pop rdi; ret in libc. By building a fake stack of gadget addresses, the attacker executes arbitrary shellcode using existing trusted code. // door https://csrc.nist.gov/ // ref 7.2 return-oriented programming rop & binary defenses

tcp syn floods : Attacker transmits rapid TCP SYN packets with forged IP addresses, consuming the server's connection listen backlog queue mitigated by SYN Cookies where connection state is cryptographically encoded into the sequence number. // door https://csrc.nist.gov/ // ref 8.1 core internet protocol fragilities

dns cache poisoning : Bypassing DNS resolution with forged responses Dan Kaminsky vulnerability. // door https://csrc.nist.gov/ // ref 8.1 core internet protocol fragilities

dnssec solution : Hierarchical cryptographic digital signatures over DNS resource records using asymmetric RRSIG and DNSKEY records anchored in the root zone trust anchor. // door https://csrc.nist.gov/ // ref 8.1 core internet protocol fragilities

bgp route hijacking : Autonomous Systems AS broadcasting unauthorized IP prefix announcements to redirect global traffic through adversarial countries. Mitigated by RPKI Resource Public Key Infrastructure cryptographic Route Origin Authorizations ROAs. // door https://csrc.nist.gov/ // ref 8.1 core internet protocol fragilities

the principle of manufacturing tolerances : Because no machine tool is perfect, pin holes in the plug are never perfectly concentric or aligned along a straight line. // door https://csrc.nist.gov/ // ref 9.1 mechanical lock architecture & lockpicking mechanics

single pin picking : Applying light rotational torque with a tension wrench binds the single most misaligned pin against the hull wall. Lifting that specific pin with a pick until its driver clears the shear line produces a tactile click as the plug rotates a fraction of a degree, creating a ledge that holds the driver pin above the plug. Repeating this for all pins opens the lock. // door https://csrc.nist.gov/ // ref 9.1 mechanical lock architecture & lockpicking mechanics

timing attacks : If a string comparison function memcmp exits early upon finding the first non-matching byte, an attacker measures response times in microseconds to determine correct key bytes one by one. // door https://csrc.nist.gov/ // ref 9.2 hardware side-channel attacks power, timing & faults

differential power analysis : Modern CMOS gates consume dynamic power only when switching states 0 o 1 or 1 o 0. By attaching an oscilloscope to the CPU power supply line and measuring thousands of cryptographic operations, an attacker calculates correlation between power consumption fluctuations and the Hamming weight of intermediate cipher values, extracting secret AES keys. // door https://csrc.nist.gov/ // ref 9.2 hardware side-channel attacks power, timing & faults

fault injection attacks : Briefly pulsing the CPU clock line or dropping supply voltage V{cc} for nanoseconds causes the CPU to misread instructions e.g. skipping a conditional JNE security check or corrupt cryptographic calculations, inducing mathematical errors that reveal RSA private exponents. // door https://csrc.nist.gov/ // ref 9.2 hardware side-channel attacks power, timing & faults

van eck phreaking : Wim van Eck proved that electromagnetic radiation emitted by computer monitor video cables can be picked up by a standard television receiver hundreds of meters away and reconstructed into a clear image of what is displayed on the screen. // door https://csrc.nist.gov/ // ref 9.3 electromagnetic emanations tempest & van eck phreaking

distance & attenuation : Physical isolation zoning. // door https://csrc.nist.gov/ // ref 9.3 electromagnetic emanations tempest & van eck phreaking

faraday cages : Grounded conductive copper/aluminum mesh enclosures blocking all RF signals. // door https://csrc.nist.gov/ // ref 9.3 electromagnetic emanations tempest & van eck phreaking

filtered lines : High-attenuation low-pass ferrite filters on all power and data lines penetrating the secure space. // door https://csrc.nist.gov/ // ref 9.3 electromagnetic emanations tempest & van eck phreaking

red/black separation : Strict physical and spatial separation between unencrypted plain text circuits "RED" and encrypted ciphertext circuits "BLACK". // door https://csrc.nist.gov/ // ref 9.3 electromagnetic emanations tempest & van eck phreaking

high-impedance parallel taps : Bridging high-impedance voltage taps onto copper communications lines drawing microamps of current, avoiding line resistance drops. // door https://csrc.nist.gov/ // ref 9.4 physical surveillance, wiretapping & bug sweeping

inductive couplers : Clamping an inductive coil around an insulated wire to pick up signal magnetic fields without stripping insulation. // door https://csrc.nist.gov/ // ref 9.4 physical surveillance, wiretapping & bug sweeping

fiber optic macrobending : Bending an optical fiber cable beyond its critical angle causes a small fraction ~1\% of laser photons to leak through the cladding, captured by a sensitive photodetector without disrupting the primary link. // door https://csrc.nist.gov/ // ref 9.4 physical surveillance, wiretapping & bug sweeping

non-linear junction detectors : Transmits an RF microwave signal and listens for second and third harmonics. Semiconductor p-n junctions transistors, diodes in hidden microphones or transmitters uniquely reflect harmonic signals, detecting electronic bugs even if powered off. // door https://csrc.nist.gov/ // ref 9.4 physical surveillance, wiretapping & bug sweeping

social engineering vectors : Pretexting, spear phishing, authority exploitation, and physical tailgating through access control mantraps. Human vigilance and protocol enforcement are the indispensable final perimeter of defense. // door https://csrc.nist.gov/ // ref 9.5 operational security opsec & human factor defenses
