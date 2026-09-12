export interface WarehouseDoc {
  dewey: string;
  title: string;
  category: string;
  snippet: string;
  tier?: 'novice' | 'intermediate' | 'advanced';
}

export const WAREHOUSE_DOCS: WarehouseDoc[] = [
  // ==========================================
  // 000 — COMPUTER SCIENCE, INFORMATION & GENERAL WORKS
  // ==========================================
  {
    dewey: "001",
    title: "Epistemology of Science & Falsificationism (Karl Popper)",
    category: "Information & Methodology",
    tier: "intermediate",
    snippet: "Demarcation criterion of empirical science: a hypothesis is scientific if and only if it is empirically falsifiable. Inductive verification is asymmetrical—a million white swans cannot prove all swans are white, but a single black swan refutes the universal claim. Science advances through bold conjectures and refutations."
  },
  {
    dewey: "003",
    title: "Information Theory & Entropy (Claude Shannon)",
    category: "Computing & Systems",
    tier: "advanced",
    snippet: "Foundational 1948 mathematical framework: Information entropy H(X) = -sum(p(x) * log2(p(x))) quantifies the fundamental limit of lossless data compression. The Noisy-Channel Coding Theorem proves that error-free communication is achievable up to the channel capacity C = B * log2(1 + S/N)."
  },
  {
    dewey: "004",
    title: "Data Structures & Algorithmic Complexity",
    category: "Computer Science",
    tier: "intermediate",
    snippet: "Core computer science fundamentals: Hash tables with O(1) amortized lookup, balanced search trees (AVL, Red-Black) with O(log n) guarantees, B-trees for block storage. Graph search algorithms (Dijkstra, A*, BFS, DFS) and dynamic programming optimizations (memoization, bottom-up tabulation)."
  },
  {
    dewey: "005",
    title: "Operating Systems, Concurrency & Memory Paging",
    category: "Computer Systems",
    tier: "advanced",
    snippet: "Kernel architecture, process scheduling, virtual memory management via page tables and translation lookaside buffers (TLB). Concurrency synchronization primitives (mutexes, semaphores, atomic CAS operations). The four Coffman conditions for deadlock: mutual exclusion, hold and wait, no preemption, and circular wait."
  },
  {
    dewey: "006",
    title: "Neural Networks, Transformers & WebGPU Inference",
    category: "Computing & Machine Learning",
    tier: "advanced",
    snippet: "Modern LLM architecture: Scaled Dot-Product Attention Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V, Multi-Head Attention, Rotary Position Embeddings (RoPE), KV-cache allocation, and low-bit quantization (Q4_F16). Real-time client-side execution in browser VRAM via WebGPU compute shaders. Chat tokens remain on user GPU; optional hands send external lookups."
  },

  // ==========================================
  // 100 — PHILOSOPHY, LOGIC & PSYCHOLOGY
  // ==========================================
  {
    dewey: "160",
    title: "Syllogistic Logic & Formal Deduction",
    category: "Philosophy & Logic",
    tier: "intermediate",
    snippet: "Aristotelian logic based on categorical syllogisms: Major Premise, Minor Premise, and Conclusion. Standard valid forms (Barbara, Celarent, Darii, Ferio). Key structural fallacies: Undistributed Middle, Affirming the Consequent, and Denying the Antecedent."
  },
  {
    dewey: "161",
    title: "Occam's Razor (Lex Parsimoniae)",
    category: "Philosophy & Logic",
    tier: "intermediate",
    snippet: "Attributed to William of Ockham: 'Entia non sunt multiplicanda praeter necessitatem' (Entities must not be multiplied beyond necessity). When presented with competing hypotheses that make identical empirical predictions, select the one that introduces the fewest unsupported assumptions."
  },
  {
    dewey: "162",
    title: "The Pragmatist's Razor (Anti-Hype & Common-Sense Sifter)",
    category: "Critical Thinking",
    tier: "novice",
    snippet: "A pragmatic razor for the age of technical hype: 'If you strip away the million-dollar jargon and marketing claims, what is this system actually doing, who benefits, and how does it prove itself empirically?' If an explanation cannot withstand a blunt, plain-English common-sense question, it is unsubstantiated noise."
  },
  {
    dewey: "170",
    title: "The Categorical Imperative & Deontological Ethics (Kant)",
    category: "Moral Philosophy",
    tier: "advanced",
    snippet: "Immanuel Kant's foundational supreme principle of practical reason. Formula 1 (Universal Law): 'Act only according to that maxim whereby you can at the same time will that it become a universal law.' Formula 2 (Humanity as an End): 'Act in such a way that you treat humanity, whether in your own person or in the person of any other, never merely as a means to an end, but always at the same time as an end.' Demands moral autonomy and absolute duty regardless of inclination."
  },
  {
    dewey: "171",
    title: "Virtue Ethics & The Golden Mean (Aristotle)",
    category: "Moral Philosophy",
    tier: "intermediate",
    snippet: "Aristotle's Nicomachean Ethics: morality is not merely following rules or calculating utility, but cultivating virtuous character (arete) toward human flourishing (eudaimonia). Every virtue is the 'Golden Mean' between two extremes of excess and deficiency (e.g., Courage is the mean between Cowardice and Recklessness; Generosity is the mean between Stinginess and Profligacy)."
  },
  {
    dewey: "172",
    title: "Utilitarianism & Consequentialist Ethics (Bentham & Mill)",
    category: "Moral Philosophy",
    tier: "intermediate",
    snippet: "Normative ethics holding that actions are right in proportion as they tend to promote overall well-being and wrong as they produce the reverse. Jeremy Bentham's quantitative hedonic calculus vs. John Stuart Mill's qualitative hierarchy between higher intellectual pleasures and lower animal appetites."
  },
  {
    dewey: "181",
    title: "Wu Wei & Effortless Action (Lao Tzu, Zhuangzi & Computational Taoism)",
    category: "Eastern Philosophy",
    tier: "intermediate",
    snippet: "The Daoist doctrine of 'Wu Wei' (non-forcing, action without artificial friction). Like water carving granite by yielding rather than striking head-on, optimal systems align with natural gradients rather than imposing wasteful coercive control. Foundation for computational taoism: clean while we work, minimal state, 5S discipline, and architectures that run without a watcher."
  },
  {
    dewey: "188",
    title: "Stoic Philosophy & The Dichotomy of Control (Aurelius, Seneca & Epictetus)",
    category: "Moral Philosophy",
    tier: "intermediate",
    snippet: "Hellenistic and Roman philosophy centered on the radical division: what is up to us (our judgments, intentions, desires, character) vs. what is not up to us (external events, the bodies and opinions of others, health, outcomes). Freedom and tranquility (ataraxia) arise from mastering the former and accepting the latter (amor fati, memento mori)."
  },
  {
    dewey: "189",
    title: "The Socratic Method (Elenchus & Dialectic)",
    category: "Philosophy & Logic",
    tier: "novice",
    snippet: "Cooperative argumentative dialogue based on asking and answering questions to stimulate critical thinking and draw out underlying presuppositions. Rather than claiming dogmatic knowledge ('I know that I know nothing'), the questioner acts as a philosophical midwife (maieutics), testing definitions until internal contradictions reveal themselves."
  },

  // ==========================================
  // 300 — SOCIAL SCIENCES, ECONOMICS & LAW
  // ==========================================
  {
    dewey: "320",
    title: "Political Philosophy & The Social Contract (Locke & Montesquieu)",
    category: "Political Science",
    tier: "intermediate",
    snippet: "John Locke's Second Treatise of Government: sovereignty derives from the consent of the governed to protect natural rights (life, liberty, estate). Montesquieu's Spirit of the Laws: constitutional liberty requires the strict separation of legislative, executive, and judicial powers to prevent despotism."
  },
  {
    dewey: "330",
    title: "Microeconomics, Marginal Utility & Elasticity",
    category: "Economics",
    tier: "intermediate",
    snippet: "Core economic models: Opportunity cost, supply and demand equilibrium, price elasticity of demand (percentage change in quantity over percentage change in price), diminishing marginal utility, consumer and producer surplus, and market failures caused by negative externalities."
  },
  {
    dewey: "340",
    title: "Jurisprudence, Common Law & Due Process",
    category: "Law & Jurisprudence",
    tier: "intermediate",
    snippet: "The doctrine of stare decisis (abiding by precedent), adversarial legal procedure, the distinction between procedural due process (fair notice and impartial adjudication) and substantive due process, and the core burden of proof standards (beyond a reasonable doubt vs. preponderance of the evidence)."
  },

  // ==========================================
  // 400 — LANGUAGE & LINGUISTICS
  // ==========================================
  {
    dewey: "410",
    title: "Linguistics, Universal Grammar & Semiotics (Chomsky & Saussure)",
    category: "Linguistics",
    tier: "intermediate",
    snippet: "Ferdinand de Saussure's semiotic sign (signifier sound-image + signified mental concept) linked by arbitrary convention. Noam Chomsky's Generative Grammar and Poverty of the Stimulus argument: humans possess innate cognitive capacity (Universal Grammar) enabling infinite recursive syntactic generation from finite input."
  },

  // ==========================================
  // 500 — NATURAL SCIENCES & MATHEMATICS
  // ==========================================
  {
    dewey: "510",
    title: "Mathematics, Discrete Logic & Universal Constants",
    category: "Mathematics",
    tier: "intermediate",
    snippet: "Fundamental physical constants: speed of light (c = 299,792,458 m/s), Planck constant (h = 6.62607015e-34 J*s), gravitational constant (G = 6.67430e-11 N*m^2/kg^2), pi (3.14159265), Euler's number (e = 2.718281828). Core methods: mathematical induction, proof by contradiction, linear algebra vector spaces, and Fourier transforms."
  },
  {
    dewey: "512",
    title: "Abstract Algebra & Number Theory",
    category: "Mathematics",
    tier: "advanced",
    snippet: "Algebraic structures: Groups (closure, associativity, identity, invertibility), Rings, and Fields. Modular arithmetic, Fermat's Little Theorem (a^(p-1) = 1 mod p), the Fundamental Theorem of Arithmetic (unique prime factorization), and the RSA asymmetric public-key cryptosystem."
  },
  {
    dewey: "515",
    title: "Calculus, Differential Equations & Analysis",
    category: "Mathematics",
    tier: "advanced",
    snippet: "Fundamental Theorem of Calculus: differentiation and integration as inverse operations. Taylor series expansions f(x) = sum(f^(n)(a)/n! * (x-a)^n). Ordinary differential equations (ODEs), partial differential equations (PDEs), gradient descent vector fields, and divergence and curl theorems (Stokes' and Gauss's Theorems)."
  },
  {
    dewey: "519",
    title: "Probability, Statistics & Bayesian Inference",
    category: "Mathematics",
    tier: "intermediate",
    snippet: "Bayes' Theorem P(A|B) = [P(B|A) * P(A)] / P(B), relating prior probability, likelihood, and posterior probability. The Law of Large Numbers, the Central Limit Theorem (sample mean approaches normal distribution regardless of underlying distribution), and statistical hypothesis testing (p-values, Type I and Type II errors)."
  },
  {
    dewey: "520",
    title: "Astronomy, Astrophysics & General Relativity",
    category: "Astronomy",
    tier: "advanced",
    snippet: "Kepler's Laws of planetary motion; Newton's universal gravitation; Einstein's Field Equations G_uv + Lambda*g_uv = (8*pi*G / c^4) * T_uv relating spacetime curvature to stress-energy. The Big Bang model, Hubble-Lemaitre expansion v = H_0 * d, stellar nucleosynthesis, and event horizons of Schwarzschild black holes."
  },
  {
    dewey: "530",
    title: "Classical & Lagrangian Mechanics",
    category: "Physics",
    tier: "advanced",
    snippet: "Newtonian dynamics (F = dp/dt) formulated in generalized coordinates via the Lagrangian L = T - V and Euler-Lagrange equations d/dt(dL/dq_dot) - dL/dq = 0. Noether's Theorem: every continuous symmetry corresponds to a conserved quantity (time invariance -> energy conservation, translational invariance -> momentum conservation, rotational invariance -> angular momentum conservation)."
  },
  {
    dewey: "531",
    title: "The Feynman Method & Intuitive Physics (Richard Feynman)",
    category: "Physics",
    tier: "novice",
    snippet: "Richard Feynman's approach to physics: If you cannot explain a phenomenon to a bright freshman without hiding behind fifty-dollar technical jargon, you do not understand it. Path integral formulation of quantum mechanics (summing over histories), Feynman diagrams, and the foundational principle that nature cannot be fooled; experiment is the ultimate arbiter."
  },
  {
    dewey: "532",
    title: "Thermodynamics & Statistical Mechanics",
    category: "Physics",
    tier: "advanced",
    snippet: "Four Laws of Thermodynamics: 0th (Temperature equilibrium), 1st (Conservation of energy dU = dQ - dW), 2nd (Entropy of isolated systems never decreases dS >= 0), 3rd (Entropy approaches a constant at absolute zero). Ludwig Boltzmann's statistical entropy S = k_B * ln(Omega), canonical ensembles, and Carnot engine efficiency limit eta = 1 - T_C/T_H."
  },
  {
    dewey: "535",
    title: "Electromagnetism & Maxwell's Equations",
    category: "Physics",
    tier: "advanced",
    snippet: "James Clerk Maxwell's four differential equations uniting electricity and magnetism: Gauss's Law (div E = rho/epsilon_0), Gauss's Law for Magnetism (div B = 0), Faraday's Law of Induction (curl E = -dB/dt), and the Ampere-Maxwell Law (curl B = mu_0*J + mu_0*epsilon_0*dE/dt). Predicts electromagnetic wave propagation at light speed c = 1 / sqrt(mu_0 * epsilon_0)."
  },
  {
    dewey: "540",
    title: "Chemistry, Atomic Structure & Periodic Law",
    category: "Chemistry",
    tier: "intermediate",
    snippet: "Mendeleev's periodic law, electron configurations across atomic orbitals (s, p, d, f) governed by the Pauli Exclusion Principle, Hund's Rule, and the Aufbau Principle. Covalent, ionic, and hydrogen bonding. Chemical stoichiometry, Gibbs free energy Delta G = Delta H - T*Delta S, and reaction equilibrium constants."
  },
  {
    dewey: "570",
    title: "Molecular Biology & Genetics",
    category: "Biological Sciences",
    tier: "intermediate",
    snippet: "The Central Dogma of Molecular Biology: DNA replicates, transcribes into messenger RNA, and translates into functional proteins at the ribosome. Double-helix DNA structure (Watson, Crick, Franklin), codons and amino acids, Mendelian inheritance ratios, and modern CRISPR-Cas9 targeted genome editing."
  },
  {
    dewey: "576",
    title: "Evolutionary Biology & Natural Selection (Darwin & Wallace)",
    category: "Biological Sciences",
    tier: "intermediate",
    snippet: "Descent with modification driven by phenotypic variation, differential reproductive fitness, and heritable genetic traits. Allopatric and sympatric speciation, genetic drift, founder effects, and the modern evolutionary synthesis uniting Mendelian population genetics with Darwinian natural selection."
  },

  // ==========================================
  // 600 — TECHNOLOGY, MEDICINE & APPLIED SCIENCES
  // ==========================================
  {
    dewey: "600",
    title: "5S, Kaizen & Operational Engineering",
    category: "Engineering & Operations",
    tier: "intermediate",
    snippet: "Continuous incremental improvement (Kaizen) combined with workplace and codebase discipline (5S: Seiri/Cut, Seiton/Place, Seiso/See, Seiketsu/Hold, Shitsuke/Become). Problem is treasure; eliminate dead code, stubs, and false claims; build software that respects the user, the planet, and teaches by being used."
  },
  {
    dewey: "612",
    title: "Human Anatomy, Physiology & Homeostasis",
    category: "Medical Sciences",
    tier: "intermediate",
    snippet: "Biological homeostasis maintained through negative feedback loops (thermoregulation, blood glucose regulation via insulin/glucagon, acid-base buffering). Cardiovascular hemodynamics, pulmonary alveolar gas exchange, autonomic nervous system divisions (sympathetic fight-or-flight vs parasympathetic rest-and-digest), and neurochemical synaptic signaling."
  },
  {
    dewey: "620",
    title: "Materials Science, Statics & Mechanical Engineering",
    category: "Engineering",
    tier: "advanced",
    snippet: "Stress-strain constitutive relationships: Hooke's Law sigma = E * epsilon, yield strength, ultimate tensile strength, ductile vs brittle failure, and fracture mechanics. Mohr's circle for plane stress, shear stress, and thermodynamic cycles (Rankine, Brayton, Diesel, Otto)."
  },
  {
    dewey: "621",
    title: "Electrical Engineering & Circuit Theory",
    category: "Engineering",
    tier: "intermediate",
    snippet: "Kirchhoff's Current Law (KCL: conservation of charge at nodes) and Kirchhoff's Voltage Law (KVL: conservation of energy around closed loops). Ohm's Law V = I*R, impedance Z in AC RLC circuits, semiconductor physics (p-n junctions, MOSFET transistors in saturation and triode regions), and operational amplifiers (op-amps)."
  },

  // ==========================================
  // 700 — ARTS, MUSIC & AESTHETICS
  // ==========================================
  {
    dewey: "701",
    title: "Aesthetics, Visual Composition & Color Theory",
    category: "Arts & Aesthetics",
    tier: "novice",
    snippet: "Visual design principles: balance, emphasis, contrast, proportion (the golden ratio 1.618), rhythm, and visual hierarchy. Color theory: additive (RGB) vs subtractive (CMYK), complementary harmonies, hue/saturation/luminance, and psychological affordances in user interface typography and layout."
  },
  {
    dewey: "781",
    title: "Music Theory, Acoustic Harmonics & Counterpoint",
    category: "Music Theory",
    tier: "intermediate",
    snippet: "Acoustic harmonic series (overtones generated by integer multiples of fundamental frequency). The Circle of Fifths, diatonic scales, modal theory (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian), tonal harmony, voice leading, and Bachian species counterpoint."
  },

  // ==========================================
  // 800 — LITERATURE & CLASSICAL RHETORIC
  // ==========================================
  {
    dewey: "808",
    title: "Classical Rhetoric & Persuasion (Aristotle)",
    category: "Literature & Rhetoric",
    tier: "novice",
    snippet: "The Aristotelian rhetorical triad: Ethos (authority, credibility, and character of the speaker), Pathos (sympathetic emotional appeal to the audience), and Logos (reasoned argument, evidence, and logical proof). Kairos: opportune timing and cultural context of delivery. Fallacy detection: ad hominem, straw man, false dichotomy."
  },
  {
    dewey: "820",
    title: "Literary Theory, Narrative Structure & Archetypes",
    category: "Literature",
    tier: "intermediate",
    snippet: "Structural narrative dynamics: Freytag's pyramid (exposition, rising action, climax, falling action, denouement). Joseph Campbell's Hero's Journey (Departure, Initiation, Return). Literary devices: dramatic irony, unreliable narrators, allegorical symbolism, and stream of consciousness in modernist prose."
  },

  // ==========================================
  // 900 — HISTORY, GEOGRAPHY & CIVILIZATIONS
  // ==========================================
  {
    dewey: "900",
    title: "World History & Turning Points in Civilizations",
    category: "World History",
    tier: "novice",
    snippet: "Civilizational inflection points: Neolithic Agricultural Revolution, rise of hydraulic civilizations (Nile, Tigris-Euphrates, Indus, Yellow River), Classical antiquity (Athens, Rome, Han China), the Islamic Golden Age, the printing press, the Scientific Revolution, the Industrial Revolution, and modern sovereign computing."
  },
  {
    dewey: "901",
    title: "Historiography & Primary Source Evaluation",
    category: "Historical Method",
    tier: "intermediate",
    snippet: "Historical methodology: distinguishing between primary sources (contemporary eyewitness records, manuscripts, treaties) and secondary accounts. Sourcing heuristic: provenance, authorial motive, contemporary bias, material preservation, and corroboration across independent historical records."
  }
];
