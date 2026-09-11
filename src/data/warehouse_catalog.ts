export interface WarehouseDoc {
  dewey: string;
  title: string;
  category: string;
  snippet: string;
}

export const WAREHOUSE_DOCS: WarehouseDoc[] = [
  {
    dewey: "000",
    title: "Computer Science & Artificial Intelligence",
    category: "Computing",
    snippet: "Fundamentals of machine learning, neural networks, language modeling, and client-side WebGPU execution. Local inference allows private processing without third-party servers."
  },
  {
    dewey: "100",
    title: "Philosophy of Science & Logic",
    category: "Philosophy & Logic",
    snippet: "Deductive and inductive reasoning, epistemic humility, the scientific method, and distinguishing empirical evidence from speculation."
  },
  {
    dewey: "200",
    title: "Ethics & Technology Standards",
    category: "Ethics",
    snippet: "Transparency, privacy as a fundamental right, user sovereignty over personal data, and prevention of deceptive artificial intelligence."
  },
  {
    dewey: "500",
    title: "Natural Sciences & Physical Laws",
    category: "Natural Sciences",
    snippet: "Classical mechanics, thermodynamics, electromagnetism, and atomic theory. Conservation of energy and momentum in physical systems."
  },
  {
    dewey: "510",
    title: "Mathematics & Physical Constants",
    category: "Mathematics",
    snippet: "Speed of light (c = 299,792,458 m/s), Planck constant (h = 6.626e-34 J*s), gravitational constant (G = 6.674e-11 N*m^2/kg^2), pi (3.14159265), Euler's number (e = 2.71828)."
  },
  {
    dewey: "550",
    title: "Earth Science & Meteorology",
    category: "Earth Sciences",
    snippet: "Atmospheric pressure, weather forecasting principles, Coriolis effect, ocean currents, and the Beaufort wind force scale (0 Calm to 12 Hurricane)."
  },
  {
    dewey: "600",
    title: "Technology & Applied Engineering",
    category: "Engineering",
    snippet: "Materials science, structural engineering, semiconductor fabrication, digital logic gates, and software architecture."
  },
  {
    dewey: "900",
    title: "World History & Civilization",
    category: "History",
    snippet: "Major historical milestones: the agricultural revolution, the printing press, the Industrial Revolution, the advent of computing, and the digital information age."
  }
];
