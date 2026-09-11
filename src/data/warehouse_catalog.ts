export interface WarehouseDoc {
  dewey: string;
  title: string;
  category: string;
  snippet: string;
  tier?: 'novice' | 'intermediate' | 'advanced';
}

export const WAREHOUSE_DOCS: WarehouseDoc[] = [
  // --- PHILOSOPHICAL RAZORS & LOGIC ---
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
    title: "The Pragmatist's Razor (Anti-Information Overload & Plain-English Sifter)",
    category: "Critical Thinking",
    tier: "novice",
    snippet: "A pragmatic razor for the age of tech hype and cognitive overload: 'If you strip away the million-dollar jargon, the slick marketing pitch, and the earnest hand gestures, what is this widget actually doing, who is profiting, and why should an ordinary person with a mortgage and a lawnmower give a damn?' If an explanation cannot withstand a blunt, plain-English common-sense question, it is hot air."
  },
  {
    dewey: "189",
    title: "The Socratic Method (Elenchus & Dialectic)",
    category: "Philosophy & Logic",
    tier: "novice",
    snippet: "A cooperative argumentative dialogue between individuals, based on asking and answering questions to stimulate critical thinking and draw out underlying ideas and presuppositions. Rather than claiming knowledge ('I know that I know nothing'), the questioner acts as a philosophical midwife (maieutics), testing definitions until internal contradictions reveal themselves."
  },

  // --- MORAL & ETHICAL PHILOSOPHY ---
  {
    dewey: "170",
    title: "The Categorical Imperative & Deontological Ethics (Kant)",
    category: "Moral Philosophy",
    tier: "advanced",
    snippet: "Immanuel Kant's foundational supreme principle of practical reason. Formula 1 (Universal Law): 'Act only according to that maxim whereby you can at the same time will that it become a universal law.' Formula 2 (Humanity as an End): 'Act in such a way that you treat humanity, whether in your own person or in the person of any other, never merely as a means to an end, but always at the same time as an end.' Demands moral autonomy and absolute duty regardless of emotional inclination."
  },
  {
    dewey: "188",
    title: "Stoic Philosophy & The Dichotomy of Control (Marcus Aurelius & Epictetus)",
    category: "Moral Philosophy",
    tier: "intermediate",
    snippet: "Hellenistic and Roman philosophy (Epictetus, Seneca, Marcus Aurelius) centered on the radical division: what is up to us (our judgments, intentions, desires, character) vs. what is not up to us (external events, the bodies and opinions of others, health, outcomes). Freedom and tranquility (ataraxia) arise from mastering the former and accepting the latter (amor fati, memento mori)."
  },
  {
    dewey: "181",
    title: "Wu Wei & Effortless Action (Lao Tzu, Zhuangzi & Computational Taoism)",
    category: "Eastern Philosophy",
    tier: "intermediate",
    snippet: "The Daoist doctrine of 'Wu Wei' (non-forcing, action without artificial friction). Like water carving granite by yielding rather than striking head-on, optimal systems align with natural gradients rather than imposing wasteful coercive control. Foundation for computational taoism: clean while we work, minimal state, 5S discipline, and architectures that run without a watcher."
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
    snippet: "Normative ethics holding that actions are right in proportion as they tend to promote overall happiness and wrong as they produce the reverse of happiness. Bentham's quantitative hedonic calculus vs. J.S. Mill's qualitative distinctions between higher intellectual pleasures and lower physical pleasures."
  },

  // --- NATURAL SCIENCES & PHYSICAL LAWS ---
  {
    dewey: "500",
    title: "Natural Sciences & Physical Laws",
    category: "Natural Sciences",
    tier: "intermediate",
    snippet: "Classical mechanics, thermodynamics, electromagnetism, and atomic theory. Conservation of energy, conservation of momentum, and conservation of electric charge in closed physical systems."
  },
  {
    dewey: "530",
    title: "Classical & Lagrangian Mechanics (BS Physics Core)",
    category: "Physics",
    tier: "advanced",
    snippet: "Newtonian formulations (F = dp/dt) generalized into Lagrangian mechanics using generalized coordinates L = T - V and Euler-Lagrange equations d/dt(dL/dq_dot) - dL/dq = 0. Noether's Theorem: every continuous symmetry of the action yields a fundamental conservation law (time translation -> energy, spatial translation -> momentum, rotational symmetry -> angular momentum)."
  },
  {
    dewey: "531",
    title: "The Feynman Method & Intuitive Physics (Richard Feynman)",
    category: "Physics",
    tier: "novice",
    snippet: "Richard Feynman's approach to physics and learning: If you cannot explain a concept using freshman-level analogies without relying on opaque technical jargon, you do not understand it. Formulations of quantum electrodynamics using path integrals (summing all possible histories) and intuitive Feynman diagrams. Relentless insistence that 'nature cannot be fooled' and experiment is the sole judge of scientific truth."
  },
  {
    dewey: "532",
    title: "Thermodynamics & Statistical Mechanics (BS Physics Core)",
    category: "Physics",
    tier: "advanced",
    snippet: "Laws of Thermodynamics: 0th (Thermal equilibrium/temperature), 1st (Conservation of energy dU = dQ - dW), 2nd (Entropy of isolated systems never decreases dS >= 0), 3rd (Entropy approaches a constant as T approaches absolute zero). Boltzmann's entropy formula S = k_B * ln(Omega), microcanonical and canonical ensembles, and the Carnot heat engine efficiency limit eta = 1 - T_C/T_H."
  },
  {
    dewey: "510",
    title: "Mathematics, Discrete Logic & Universal Constants",
    category: "Mathematics",
    tier: "intermediate",
    snippet: "Fundamental constants: speed of light (c = 299,792,458 m/s), Planck constant (h = 6.626e-34 J*s), gravitational constant (G = 6.674e-11 N*m^2/kg^2), pi (3.14159265), Euler's number (e = 2.71828). Core mathematical methods: mathematical induction, contradiction proofs, linear algebra vector spaces, and Fourier analysis."
  },
  {
    dewey: "550",
    title: "Earth Science & Meteorology",
    category: "Earth Sciences",
    tier: "novice",
    snippet: "Atmospheric pressure gradients, Coriolis effect on rotating reference frames, adiabatic cooling and lapse rates, jet streams, and the empirical Beaufort wind force scale (Force 0 Calm < 1 kt to Force 12 Hurricane >= 64 kt)."
  },

  // --- COMPUTER SCIENCE & TECHNOLOGY ---
  {
    dewey: "000",
    title: "Computer Science, Automata & Complexity (BS CS Core)",
    category: "Computing",
    tier: "advanced",
    snippet: "Theoretical foundations: Turing machines, Chomsky hierarchy, undecidability of the Halting Problem, and computational complexity classes (P, NP, NP-Complete via Karp reductions). Big-O asymptotic analysis for time and space complexity."
  },
  {
    dewey: "004",
    title: "Neural Networks, Transformers & WebGPU Inference",
    category: "Computing",
    tier: "intermediate",
    snippet: "Architecture of modern large language models: Scaled Dot-Product Attention, Multi-Head Attention, Rotary Position Embeddings (RoPE), KV-cache memory dynamics, and low-bit weight quantization (Q4_F16). Real-time execution in client-side browser VRAM via WebGPU compute shaders. Chat tokens stay on device; optional tools send lookups."
  },
  {
    dewey: "600",
    title: "5S, Kaizen & Operational Engineering",
    category: "Engineering",
    tier: "intermediate",
    snippet: "Continuous incremental improvement (Kaizen) combined with workplace and codebase discipline (5S: Seiri/Cut, Seiton/Place, Seiso/See, Seiketsu/Hold, Shitsuke/Become). Problem is treasure; eliminate dead code and stub claims; build systems that teach themselves by being used."
  },
  {
    dewey: "900",
    title: "World History & Dialectical Milestones",
    category: "History",
    tier: "novice",
    snippet: "Historical inflection points: Agricultural Revolution, the Athenian Golden Age, the printing press, the Enlightenment, the Industrial Revolution, the advent of digital computation, and the shift toward sovereign personal computing."
  }
];
