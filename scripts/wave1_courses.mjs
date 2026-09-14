/** Wave 1 Studio packs. Authored keys. Compile strips answers from the public bundle. */

function mc(id, prompt, choices, i, hint) {
  return { id, prompt, qtype: 'mc', choices, answer: choices[i], hint };
}
function num(id, prompt, answer, hint, tolerance = 1e-6) {
  return { id, prompt, qtype: 'numeric', answer, hint, tolerance };
}
function sh(id, prompt, answer, hint) {
  return { id, prompt, qtype: 'short', answer, hint };
}
function multi(id, prompt, choices, idxs, hint) {
  return { id, prompt, qtype: 'multi', choices, answer: idxs.map(i => choices[i]), hint };
}

const RUBRIC = [
  { id: 'claim', criterion: 'States a clear claim', max: 1 },
  { id: 'door', criterion: 'Cites a stack chapter or official door', max: 1 },
  { id: 'check', criterion: 'Shows a check, worked example, or honest limit', max: 1 }
];

function reading(id, lessonId, chapter, source) {
  return { id, kind: 'reading', lessonId, prompt: `Read: ${chapter}`, source };
}
function quiz(id, lessonId, questions, source) {
  return {
    id,
    kind: 'quiz',
    lessonId,
    prompt: 'Practice until every item is right. Tries are not a mark.',
    source,
    questions
  };
}
function exam(id, lessonId, title, questions, source, minutes) {
  return {
    id,
    kind: 'exam',
    lessonId,
    prompt: `${title}. Soft timer only — a suggested sitting, not a cutoff. As many sittings as it takes.`,
    source,
    questions,
    suggestedMinutes: minutes
  };
}
function essay(id, lessonId, prompt, source) {
  return { id, kind: 'essay', lessonId, prompt, source, rubric: RUBRIC };
}
function project(id, lessonId, prompt, steps, source) {
  return { id, kind: 'project', lessonId, prompt, source, steps, rubric: RUBRIC };
}

function build(meta, units) {
  const courseUnits = [];
  const items = [];
  for (const u of units) {
    const lessonId = `${meta.id}-${u.id}-l`;
    const readId = `${meta.id}-${u.id}-read`;
    const quizId = `${meta.id}-${u.id}-quiz`;
    const itemIds = [readId, quizId];
    items.push(reading(readId, lessonId, u.chapter, u.source));
    items.push(quiz(quizId, lessonId, u.questions, u.source));
    for (const extra of u.extras || []) {
      items.push({ ...extra, lessonId });
      itemIds.push(extra.id);
    }
    courseUnits.push({
      id: u.id,
      title: u.title,
      lessons: [{
        id: lessonId,
        title: u.title,
        reading: { stack: meta.stack, chapter: u.chapter },
        doors: u.doors,
        items: itemIds
      }]
    });
  }
  return { course: { ...meta, units: courseUnits }, items };
}

const methods = build(
  {
    id: 'methods-inquiry-1',
    stack: 'methods',
    dewey: '001',
    title: 'Scientific Inquiry I: Evidence, Logic & Empirical Proof',
    level: 'undergrad',
    hours: 40,
    license: {
      spdx: 'AGPL-3.0-or-later',
      attribution: 'EasyLM The Stacks · methods textbook. Doors: NIST e-handbook, ASA p-value statement, COS.',
      sourceUrl: 'https://www.itl.nist.gov/div898/handbook/'
    }
  },
  [
    {
      id: 'u1',
      title: 'Demarcation',
      chapter: '1. The Philosophy of Science & Epistemological Demarcation',
      doors: ['https://www.itl.nist.gov/div898/handbook/'],
      source: { work: 'The Stacks methods', loc: 'ch. 1' },
      questions: [
        mc('m-u1-q1', 'Popper’s demarcation test asks whether a claim is:', ['popular', 'falsifiable', 'mathematical', 'funded'], 1, 'Ask: what observation would kill it?'),
        mc('m-u1-q2', 'A statement that fits any outcome is:', ['a law', 'a protocol', 'unfalsifiable', 'a measurement'], 2, 'If nothing can go wrong, it is not a test.'),
        sh('m-u1-q3', 'One-word name for a community-wide framework shift (Kuhn):', 'paradigm', 'Think “normal science” breaking.'),
        mc('m-u1-q4', 'Cargo-cult science, in Feynman’s sense, is:', ['using a cargo plane', 'copying the forms of science without the honesty', 'peer review', 'using SI units'], 1, 'The dance without the cargo.'),
        mc('m-u1-q5', 'When two official pages disagree on a number you should:', ['average them', 'pick the nicer one', 'say so and fetch the primary', 'ask a model'], 2, 'Stacks law: do not average.')
      ]
    },
    {
      id: 'u2',
      title: 'Hypotheses',
      chapter: '2. Hypothesis Formulation, Operationalization & Decision Errors',
      doors: ['https://www.itl.nist.gov/div898/handbook/'],
      source: { work: 'The Stacks methods', loc: 'ch. 2' },
      questions: [
        mc('m-u2-q1', 'Operationalization turns a fuzzy idea into:', ['a slogan', 'a measurable procedure', 'a p-value', 'a theory of everything'], 1, 'A meter, a count, a protocol.'),
        sh('m-u2-q2', 'The hypothesis that assumes no effect is called the ____ hypothesis.', 'null', 'H0.'),
        mc('m-u2-q3', 'A Type I error is:', ['missing a real effect', 'rejecting a true null', 'a rounding error', 'using the wrong unit'], 1, 'False alarm.'),
        mc('m-u2-q4', 'A Type II error is:', ['rejecting a true null', 'failing to reject a false null', 'dividing by n-1', 'p-hacking'], 1, 'Missed detection.'),
        num('m-u2-q5', 'A test uses α = 0.05. That is a long-run Type I rate of what decimal?', 0.05, 'α is the planned false-alarm rate.')
      ]
    },
    {
      id: 'u3',
      title: 'Design',
      chapter: '3. Experimental Design, Controls & Randomization',
      doors: ['https://www.itl.nist.gov/div898/handbook/'],
      source: { work: 'The Stacks methods', loc: 'ch. 3' },
      questions: [
        mc('m-u3-q1', 'The point of randomization is to:', ['impress funders', 'balance unknown confounders in expectation', 'guarantee truth', 'replace measurement'], 1, 'Unknowns get mixed.'),
        mc('m-u3-q2', 'A control group is for:', ['decoration', 'comparison against the treatment', 'increasing n only', 'dropping outliers'], 1, 'What would have happened anyway.'),
        sh('m-u3-q3', 'Study that assigns treatment at random to units: ____ controlled trial (three letters).', 'rct', 'Randomized controlled trial.'),
        mc('m-u3-q4', 'Blinding is meant to reduce:', ['sample size', 'expectation bias in measurement', 'SI error', 'publication'], 1, 'Who knows the arm.'),
        mc('m-u3-q5', 'Quasi-experiments lack:', ['outcomes', 'random assignment', 'humans', 'numbers'], 1, 'Assignment is not random.')
      ]
    },
    {
      id: 'u4',
      title: 'Measurement',
      chapter: '4. Measurement Theory & Uncertainty Propagation (GUM)',
      doors: ['https://www.bipm.org/en/committees/jc/jcgm/publications'],
      source: { work: 'The Stacks methods', loc: 'ch. 4 · GUM' },
      questions: [
        mc('m-u4-q1', 'Precision is about:', ['closeness to the true value', 'repeat scatter', 'popularity', 'SI prefix'], 1, 'Tight cluster, maybe biased.'),
        mc('m-u4-q2', 'Accuracy is about:', ['how pretty the plot is', 'closeness to the true value', 'sample size only', 'p < 0.05'], 1, 'Where the cluster sits.'),
        sh('m-u4-q3', 'ISO/JCGM guide for expressing uncertainty, three letters:', 'gum', 'Guide to the Expression of Uncertainty in Measurement.'),
        mc('m-u4-q4', 'A number without a unit in a lab notebook is:', ['fine', 'incomplete', 'SI', 'a p-value'], 1, 'What was counted.'),
        num('m-u4-q5', 'Relative uncertainty: 0.2 on a value of 10 is what fraction?', 0.02, '0.2 / 10.')
      ],
      extras: [
        exam('methods-inquiry-1-midterm', '', 'Midterm', [
          mc('m-mt-q1', 'Falsifiability is associated with:', ['Kuhn', 'Popper', 'Fisher only', 'ASA'], 1, 'Demarcation.'),
          sh('m-mt-q2', 'H0 is the ____ hypothesis.', 'null', null),
          mc('m-mt-q3', 'Type I error:', ['false alarm', 'miss', 'bias', 'confound'], 0, null),
          mc('m-mt-q4', 'Randomization fights:', ['known and unknown confounders in expectation', 'all error', 'rounding', 'SI'], 0, null),
          mc('m-mt-q5', 'Precision vs accuracy: a tight off-center cluster is:', ['precise, not accurate', 'accurate, not precise', 'both', 'neither'], 0, null),
          num('m-mt-q6', 'α = 0.01 as a decimal is', 0.01, null),
          mc('m-mt-q7', 'If two official constants disagree:', ['average', 'say so and fetch primary', 'ignore', 'tweet'], 1, null),
          sh('m-mt-q8', 'Three-letter measurement-uncertainty guide:', 'gum', null)
        ], { work: 'The Stacks methods', loc: 'units 1–4' }, 40)
      ]
    },
    {
      id: 'u5',
      title: 'Inference',
      chapter: '5. Statistical Inference, Effect Sizes & Power Analysis',
      doors: ['https://www.amstat.org/asa/files/pdfs/P-ValueStatement.pdf'],
      source: { work: 'ASA p-value statement · Stacks methods ch. 5', loc: 'ch. 5' },
      questions: [
        mc('m-u5-q1', 'A p-value is:', ['P(H0 true | data)', 'P(data as extreme | H0)', 'effect size', 'proof'], 1, 'ASA: not the probability the hypothesis is true.'),
        mc('m-u5-q2', 'p < 0.05 means:', ['the claim is true', 'a pre-set threshold was crossed, not “true”', 'the sample is unbiased', 'power is 95%'], 1, 'A threshold, not a crown.'),
        sh('m-u5-q3', 'Cohen’s d is a kind of ____ size.', 'effect', 'How big, not only how surprising.'),
        mc('m-u5-q4', 'Power is:', ['Type I rate', 'chance of detecting a real effect', 'n', 'bias'], 1, '1 − β.'),
        num('m-u5-q5', 'If β = 0.2, power is', 0.8, '1 − 0.2.')
      ],
      extras: [
        essay('methods-inquiry-1-essay-1', '', 'In your own words: what a p-value is not. Cite the ASA statement door or the stack chapter. One to two pages in Document Studio.', { work: 'ASA p-value statement', loc: 'essay' })
      ]
    },
    {
      id: 'u6',
      title: 'Bayes',
      chapter: '6. Bayesian Inquiry & Belief Revision',
      doors: ['https://openstax.org/details/books/introductory-statistics-2e'],
      source: { work: 'The Stacks methods', loc: 'ch. 6' },
      questions: [
        mc('m-u6-q1', 'Bayes updates:', ['prior with likelihood to a posterior', 'p-values into proof', 'n into truth', 'SI into imperial'], 0, 'Prior × likelihood, then normalize.'),
        sh('m-u6-q2', 'P(data | hypothesis) is the ____.', 'likelihood', 'Not the posterior.'),
        num('m-u6-q3', 'Prior 0.5, two equally likely data worlds after seeing D: if unnormalized posterior mass is 2 and 2, posterior on first is', 0.5, '2/(2+2).'),
        mc('m-u6-q4', 'A prior of 0 is dangerous because:', ['it never updates', 'it is frequentist', 'it is SI', 'it is α'], 0, 'Zero stays zero.'),
        mc('m-u6-q5', 'Posterior odds = prior odds ×', ['n', 'Bayes factor', 'p-value', 'α'], 1, 'Likelihood ratio.')
      ]
    },
    {
      id: 'u7',
      title: 'Cause',
      chapter: '7. Causal Inference & Directed Acyclic Graphs (DAGs)',
      doors: ['https://www.itl.nist.gov/div898/handbook/'],
      source: { work: 'The Stacks methods', loc: 'ch. 7' },
      questions: [
        mc('m-u7-q1', 'Correlation alone:', ['proves cause', 'does not prove cause', 'is a DAG', 'is α'], 1, 'Confounders exist.'),
        sh('m-u7-q2', 'A common cause of X and Y that biases their association is a ____.', 'confounder', null),
        mc('m-u7-q3', 'A DAG is:', ['directed acyclic graph', 'a p-value plot', 'a histogram', 'an SI table'], 0, 'Arrows, no cycles.'),
        mc('m-u7-q4', 'Conditioning on a collider can:', ['always help', 'open a biasing path', 'set α', 'define SI'], 1, 'M-bias / collider bias.'),
        mc('m-u7-q5', 'An RCT identifies a causal effect mainly by:', ['random assignment', 'large n only', 'p-hacking', 'pretty DAGs'], 0, 'Exchangeability.')
      ],
      extras: [
        project(
          'methods-inquiry-1-project',
          '',
          'Pick a public claim. Draw a three-node DAG (treatment, outcome, one confounder). Write what experiment or adjustment would be honest. Export from Document Studio.',
          ['Name the claim and the door you used', 'Draw treatment, outcome, confounder', 'Say what would falsify the story', 'Export'],
          { work: 'The Stacks methods', loc: 'ch. 7 project' }
        )
      ]
    },
    {
      id: 'u8',
      title: 'Surveys',
      chapter: '8. Survey Methodology, Sampling & Observational Biases',
      doors: ['https://www.cos.io/'],
      source: { work: 'The Stacks methods · COS', loc: 'ch. 8' },
      questions: [
        mc('m-u8-q1', 'A convenience sample is:', ['a probability sample', 'whoever is handy, not a random draw', 'a census', 'an RCT'], 1, 'Easy ≠ representative.'),
        sh('m-u8-q2', 'Everyone in the frame has a known chance of selection: ____ sample.', 'probability', null),
        mc('m-u8-q3', 'Nonresponse bias appears when:', ['non-respondents differ on the thing you care about', 'n is even', 'you used SI', 'p < 0.05'], 0, 'Who stayed silent.'),
        mc('m-u8-q4', 'Preregistration is meant to reduce:', ['measurement', 'undisclosed flexibility (QRPs)', 'sample size', 'SI error'], 1, 'Write the plan first.'),
        mc('m-u8-q5', 'A census tries to count:', ['a sample', 'the whole frame', 'only volunteers', 'p-values'], 1, 'Everyone in scope.')
      ],
      extras: [
        essay('methods-inquiry-1-essay-2', '', 'Describe one survey bias (nonresponse, leading item, or convenience). Give a real-world door (census methods or COS). No letter grade — complete when you cite.', { work: 'Stacks methods ch. 8', loc: 'essay' }),
        exam('methods-inquiry-1-final', '', 'Final', [
          mc('m-fn-q1', 'Unfalsifiable claims are:', ['science', 'outside Popper’s test', 'p-values', 'SI'], 1, null),
          mc('m-fn-q2', 'p-value is P(data | H0), not P(H0 | data). True or false? Type true or false.', ['true', 'false'], 0, 'ASA.'),
          sh('m-fn-q3', '1 − β is called ____.', 'power', null),
          mc('m-fn-q4', 'Collider bias comes from conditioning on a:', ['common cause', 'common effect', 'instrument', 'unit'], 1, null),
          num('m-fn-q5', 'Power when β = 0.1', 0.9, null),
          mc('m-fn-q6', 'GUM is about:', ['uncertainty of measurement', 'p-hacking', 'DAGs', 'votes'], 0, null),
          sh('m-fn-q7', 'Randomized controlled trial abbreviation:', 'rct', null),
          mc('m-fn-q8', 'Preregister to reduce:', ['QRPs', 'SI', 'mass', 'voltage'], 0, null)
        ], { work: 'The Stacks methods', loc: 'final' }, 50)
      ]
    }
  ]
);

const math = build(
  {
    id: 'math-calc-1',
    stack: 'math',
    dewey: '510',
    title: 'Calculus I: Limits, Derivatives & Rates of Change',
    level: 'undergrad',
    hours: 48,
    license: {
      spdx: 'CC-BY-4.0',
      attribution: 'Adapted from OpenStax Calculus Volume 1 (CC BY 4.0) and EasyLM math stack.',
      sourceUrl: 'https://openstax.org/details/books/calculus-volume-1'
    }
  },
  [
    {
      id: 'u1',
      title: 'Logic of proof',
      chapter: '1. Mathematical Logic & Structural Proof Systems',
      doors: ['https://openstax.org/details/books/calculus-volume-1'],
      source: { work: 'The Stacks math', loc: 'ch. 1' },
      questions: [
        mc('x-u1-q1', 'A proposition is:', ['a command', 'a statement that is true or false', 'a guess', 'a unit'], 1, 'Declarative, two-valued.'),
        sh('x-u1-q2', 'The connective for “and” in logic (word):', 'conjunction', '∧.'),
        mc('x-u1-q3', 'P → Q is false only when:', ['P true, Q false', 'P false, Q true', 'both false', 'both true'], 0, 'Material implication.'),
        mc('x-u1-q4', 'Proof by contradiction assumes:', ['the claim', 'the negation of the claim', 'a sample', 'SI'], 1, 'Derive absurdity.'),
        mc('x-u1-q5', '∀ means:', ['there exists', 'for all', 'therefore', 'limit'], 1, 'Universal quantifier.')
      ]
    },
    {
      id: 'u2',
      title: 'Numbers',
      chapter: '2. Number Systems & Set-Theoretic Foundations',
      doors: ['https://dlmf.nist.gov/'],
      source: { work: 'The Stacks math · NIST DLMF', loc: 'ch. 2' },
      questions: [
        sh('x-u2-q1', 'Integers symbol (one letter, blackboard bold name spelled):', 'integers', 'ℤ. Type the word.'),
        mc('x-u2-q2', 'Q, the rationals, are:', ['ratios of integers (denominator ≠ 0)', 'only positives', 'irrationals', 'matrices'], 0, 'p/q.'),
        num('x-u2-q3', 'How many real solutions to x^2 + 1 = 0?', 0, 'Need i.'),
        mc('x-u2-q4', 'A set with no members is the ____ set.', ['power', 'empty', 'open', 'closed'], 1, '∅.'),
        num('x-u2-q5', 'The next integer after 7 is', 8, null)
      ]
    },
    {
      id: 'u3',
      title: 'Linear algebra',
      chapter: '4. Linear Algebra, Spectral Theory & Inner Product Spaces',
      doors: ['https://openstax.org/details/books/calculus-volume-1'],
      source: { work: 'The Stacks math', loc: 'ch. 4' },
      questions: [
        mc('x-u3-q1', 'A vector space is closed under:', ['addition and scalar multiplication', 'division only', 'logs', 'limits of all functions'], 0, 'Axioms of a space.'),
        num('x-u3-q2', 'Dot product of (1,2) and (3,4)', 11, '1*3+2*4.'),
        sh('x-u3-q3', 'A nonzero vector that only stretches under a linear map is an ____vector.', 'eigen', 'Av = λv.'),
        num('x-u3-q4', 'Determinant of [[1,0],[0,1]]', 1, 'Identity.'),
        mc('x-u3-q5', 'Two vectors with dot product 0 are:', ['parallel', 'orthogonal', 'equal', 'complex'], 1, 'Right angle.')
      ]
    },
    {
      id: 'u4',
      title: 'Limits',
      chapter: '5. Real Analysis: Metric Spaces, Continuity & Limits',
      doors: ['https://openstax.org/details/books/calculus-volume-1'],
      source: { work: 'OpenStax Calculus Vol 1 · Stacks math ch. 5', loc: 'limits' },
      questions: [
        mc('x-u4-q1', 'lim x→0 sin(x)/x =', ['0', '1', '∞', 'undefined'], 1, 'Standard squeeze.'),
        num('x-u4-q2', 'lim x→∞ 1/x', 0, 'Goes to 0.'),
        mc('x-u4-q3', 'A function is continuous at a if:', ['lim = f(a)', 'it has a corner', 'it is integer-valued', 'p < 0.05'], 0, 'Limit meets value.'),
        sh('x-u4-q4', 'ε–δ is the ____ definition of limit (one word: epsilon).', 'epsilon', 'The machine shop.'),
        num('x-u4-q5', 'lim x→2 (x-2)/(x-2) does not exist as a two-sided real limit because the function is undefined at 2; the removed-discontinuity value is', 1, 'Cancel to 1.')
      ],
      extras: [
        exam('math-calc-1-midterm', '', 'Midterm', [
          num('x-mt-q1', 'd/dx x^2 at x=3', 6, '2x.'),
          num('x-mt-q2', '(1,2)·(3,4)', 11, null),
          mc('x-mt-q3', 'lim sin(x)/x as x→0', ['0', '1', 'x', '∞'], 1, null),
          sh('x-mt-q4', 'Av = λv: v is an ____vector.', 'eigen', null),
          num('x-mt-q5', 'det I_2', 1, null),
          mc('x-mt-q6', 'P → Q fails when', ['P true Q false', 'both true', 'both false', 'P false'], 0, null),
          num('x-mt-q7', 'lim 1/x as x→∞', 0, null),
          mc('x-mt-q8', 'Orthogonal means dot product', ['1', '0', '∞', '-1 always'], 1, null)
        ], { work: 'OpenStax Calculus Vol 1', loc: 'midterm' }, 45)
      ]
    },
    {
      id: 'u5',
      title: 'Calculus',
      chapter: '6. Differential & Integral Calculus',
      doors: ['https://openstax.org/details/books/calculus-volume-1', 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/'],
      source: { work: 'OpenStax Calculus Vol 1', loc: 'derivatives & integrals' },
      questions: [
        num('x-u5-q1', 'd/dx x^3 at x=2', 12, '3x^2.'),
        num('x-u5-q2', 'd/dx sin(x) at x=0', 1, 'cos(0)=1.'),
        num('x-u5-q3', '∫_0^1 2x dx', 1, 'x^2 from 0 to 1.'),
        mc('x-u5-q4', 'FTC says differentiation and integration are:', ['unrelated', 'inverses (under hypotheses)', 'the same symbol', 'only for integers'], 1, 'Fundamental theorem.'),
        num('x-u5-q5', 'd/dx e^x at x=0', 1, 'e^x is its own derivative.')
      ],
      extras: [
        essay('math-calc-1-essay-1', '', 'Explain the derivative as a microscope on a hill (slope) using one worked example from OpenStax Calculus Vol 1 or the stack. Cite the door.', { work: 'OpenStax Calculus Vol 1', loc: 'essay' })
      ]
    },
    {
      id: 'u6',
      title: 'Vector calculus',
      chapter: '7. Vector Calculus & Integral Field Theorems',
      doors: ['https://openstax.org/details/books/calculus-volume-1'],
      source: { work: 'The Stacks math', loc: 'ch. 7' },
      questions: [
        mc('x-u6-q1', 'Gradient points:', ['toward steepest increase', 'along a level set always', 'randomly', 'to the origin always'], 0, '∇f.'),
        sh('x-u6-q2', 'div F measures local ____ (one word: source or divergence).', 'divergence', 'Source vs sink.'),
        mc('x-u6-q3', 'Stokes relates a surface integral of curl to:', ['a volume integral of mass', 'a boundary line integral', 'a p-value', 'det'], 1, 'Boundary.'),
        num('x-u6-q4', 'div (x, y, z) in R^3 (Cartesian)', 3, '1+1+1.'),
        mc('x-u6-q5', 'Green’s theorem is Stokes in the plane. Type true or pick:', ['true', 'false'], 0, null)
      ]
    },
    {
      id: 'u7',
      title: 'Differential equations',
      chapter: '9. Differential Equations & Dynamical Systems',
      doors: ['https://openstax.org/details/books/calculus-volume-1'],
      source: { work: 'The Stacks math', loc: 'ch. 9' },
      questions: [
        mc('x-u7-q1', 'y\' = ky has solutions:', ['exponentials', 'only polynomials of degree 2', 'logs only', 'constants only'], 0, 'y = Ce^{kt}.'),
        num('x-u7-q2', 'If y\' = 0, y is a constant. The derivative of 5 is', 0, null),
        sh('x-u7-q3', 'Second-order linear constant-coeff ODEs use the ____ equation (characteristic).', 'characteristic', 'r^2 + … = 0.'),
        mc('x-u7-q4', 'Heat equation is a:', ['PDE', 'group', 'p-value', 'DAG'], 0, 'Partial.'),
        num('x-u7-q5', 'For y\' = 2y, growth rate k is', 2, null)
      ],
      extras: [
        project(
          'math-calc-1-project',
          '',
          'Pick f(x). Plot it in Math Grapher. In Document Studio, write the derivative at one point and the definite integral on an interval you name. Cite OpenStax or the stack.',
          ['Choose f', 'Graph', 'Compute one derivative value', 'Compute one definite integral', 'Export'],
          { work: 'OpenStax Calculus Vol 1', loc: 'project' }
        )
      ]
    },
    {
      id: 'u8',
      title: 'Chance',
      chapter: '10. Probability Theory & Stochastic Processes',
      doors: ['https://dlmf.nist.gov/'],
      source: { work: 'The Stacks math', loc: 'ch. 10' },
      questions: [
        num('x-u8-q1', 'Fair coin P(heads)', 0.5, null),
        mc('x-u8-q2', 'Bayes revises:', ['prior with data', 'n only', 'units', 'eigenvalues'], 0, null),
        sh('x-u8-q3', 'CLT is the ____ limit theorem.', 'central', null),
        num('x-u8-q4', 'P(sure event)', 1, null),
        mc('x-u8-q5', 'Independent events: P(A and B) =', ['P(A)+P(B)', 'P(A)P(B)', '1', '0 always'], 1, null)
      ],
      extras: [
        essay('math-calc-1-essay-2', '', 'What is an integral as a loaf sliced thin? One example, one door (OpenStax or DLMF).', { work: 'OpenStax Calculus Vol 1', loc: 'essay 2' }),
        exam('math-calc-1-final', '', 'Final', [
          num('x-fn-q1', 'd/dx x^3 at 2', 12, null),
          num('x-fn-q2', '∫_0^1 2x dx', 1, null),
          num('x-fn-q3', 'div (x,y,z)', 3, null),
          num('x-fn-q4', 'P(heads) fair coin', 0.5, null),
          mc('x-fn-q5', 'FTC: differentiation and integration are', ['inverses under hypotheses', 'unrelated', 'p-values', 'units'], 0, null),
          sh('x-fn-q6', 'y\' = ky solutions are ____ functions.', 'exponential', null),
          num('x-fn-q7', 'd/dx e^x at 0', 1, null),
          mc('x-fn-q8', 'lim sin(x)/x x→0', ['1', '0', '∞', 'x'], 0, null)
        ], { work: 'OpenStax Calculus Vol 1', loc: 'final' }, 50)
      ]
    }
  ]
);

const physics = build(
  {
    id: 'physics-college-1',
    stack: 'physics',
    dewey: '530',
    title: 'Physics I: Mechanics, Motion & Energy',
    level: 'undergrad',
    hours: 48,
    license: {
      spdx: 'CC-BY-4.0',
      attribution: 'Adapted from OpenStax College Physics 2e (CC BY 4.0) and EasyLM physics stack. Constants: NIST CODATA.',
      sourceUrl: 'https://openstax.org/details/books/college-physics-2e'
    }
  },
  [
    {
      id: 'u1',
      title: 'Physical law',
      chapter: '1. The Architecture of Physical Law & Coordinate Systems',
      doors: ['https://physics.nist.gov/cuu/Constants/'],
      source: { work: 'NIST CODATA · Stacks physics', loc: 'ch. 1' },
      questions: [
        mc('p-u1-q1', 'A physical law is a:', ['slogan', 'model that predicts measurements', 'vote', 'p-value'], 1, 'Predict, then check.'),
        sh('p-u1-q2', 'SI base unit of time:', 'second', 'NIST / BIPM.'),
        mc('p-u1-q3', 'Noether ties symmetries to:', ['conservation laws', 'p-values', 'votes', 'fonts'], 0, 'Time-translation → energy.'),
        mc('p-u1-q4', 'A number from memory instead of CODATA is:', ['fine', 'not a cite', 'SI', 'a vector'], 1, 'Fetch the door.'),
        num('p-u1-q5', 'How many SI base units in the 2019 system?', 7, 's, m, kg, A, K, mol, cd.')
      ]
    },
    {
      id: 'u2',
      title: 'Newton',
      chapter: '2. Newtonian Kinematics & Vector Dynamics',
      doors: ['https://openstax.org/details/books/college-physics-2e'],
      source: { work: 'OpenStax College Physics 2e', loc: 'Newton' },
      questions: [
        num('p-u2-q1', 'F = ma. m=2 kg, a=3 m/s^2. F in newtons', 6, '2*3.'),
        mc('p-u2-q2', 'Newton I: if F_net = 0, velocity is:', ['zero always', 'constant', 'infinite', 'random'], 1, 'Uniform motion.'),
        sh('p-u2-q3', 'Newton III: forces come in ____ pairs.', 'equal and opposite', 'Action-reaction. Type: equal and opposite'),
        num('p-u2-q4', 'A car goes 10 m in 2 s at constant speed. Speed in m/s', 5, '10/2.'),
        mc('p-u2-q5', 'Acceleration is:', ['dv/dt', 'v/x always', 'mass', 'a vote'], 0, 'Rate of velocity.')
      ]
    },
    {
      id: 'u3',
      title: 'Energy',
      chapter: '3. Work, Energy & Conservation Theorems',
      doors: ['https://openstax.org/details/books/college-physics-2e'],
      source: { work: 'OpenStax College Physics 2e', loc: 'energy' },
      questions: [
        num('p-u3-q1', 'Work: F=5 N along 2 m, force parallel to displacement. W in J', 10, 'F·Δx.'),
        mc('p-u3-q2', 'A conservative force has work independent of:', ['path', 'mass', 'SI', 'time of day'], 0, 'Potential exists.'),
        sh('p-u3-q3', 'KE = (1/2) m v^2 is ____ energy.', 'kinetic', null),
        num('p-u3-q4', 'KE of 2 kg at 3 m/s', 9, '0.5*2*9.'),
        mc('p-u3-q5', 'Energy is conserved when:', ['the book says so without a system', 'the system is isolated in the relevant sense', 'p < 0.05', 'we like the answer'], 1, 'Name the system.')
      ]
    },
    {
      id: 'u4',
      title: 'Rotation',
      chapter: '4. Rotational Dynamics, Angular Momentum & Central Forces',
      doors: ['https://openstax.org/details/books/university-physics-volume-1'],
      source: { work: 'OpenStax University Physics Vol 1', loc: 'rotation' },
      questions: [
        mc('p-u4-q1', 'Torque is:', ['r × F', 'F·a', 'mv', 'p-value'], 0, 'Lever arm.'),
        sh('p-u4-q2', 'L = Iω is ____ momentum.', 'angular', null),
        num('p-u4-q3', 'For a point mass, I = m r^2. m=2, r=1. I', 2, null),
        mc('p-u4-q4', 'Kepler II (equal areas) is conservation of:', ['charge', 'angular momentum', 'color', 'p'], 1, 'Central force.'),
        num('p-u4-q5', 'ω = 4 rad/s, t=2 s of constant ω. Angle in rad', 8, 'θ=ωt.')
      ],
      extras: [
        exam('physics-college-1-midterm', '', 'Midterm', [
          num('p-mt-q1', 'F=ma, m=2, a=3', 6, null),
          num('p-mt-q2', 'W=FΔx, F=5, Δx=2', 10, null),
          num('p-mt-q3', 'KE 2 kg at 3 m/s', 9, null),
          num('p-mt-q4', 'I=mr^2, m=2, r=1', 2, null),
          mc('p-mt-q5', 'Newton I: net force 0 means', ['constant velocity', 'zero mass', 'infinite a', 'heat'], 0, null),
          sh('p-mt-q6', 'SI time unit', 'second', null),
          num('p-mt-q7', 'SI base unit count (2019)', 7, null),
          mc('p-mt-q8', 'Conservative force: work is path-____ (independent/dependent)', ['independent', 'dependent'], 0, null)
        ], { work: 'OpenStax College Physics 2e', loc: 'midterm' }, 45)
      ]
    },
    {
      id: 'u5',
      title: 'Oscillation',
      chapter: '6. Oscillations, Resonance & Mechanical Waves',
      doors: ['https://openstax.org/details/books/college-physics-2e'],
      source: { work: 'OpenStax College Physics 2e', loc: 'SHM' },
      questions: [
        mc('p-u5-q1', 'SHM restoring force is:', ['−kx', 'kx^2', 'constant', 'random'], 0, 'Hooke.'),
        num('p-u5-q2', 'T = 2π√(m/k). If T doubles when m→4m, that matches √4 = ?', 2, 'Period scales with sqrt(m).'),
        sh('p-u5-q3', 'Driving at natural frequency: ____.', 'resonance', null),
        mc('p-u5-q4', 'A wave carries:', ['energy', 'the medium’s net mass always to infinity', 'votes', 'SI prefixes'], 0, 'Disturbance travels.'),
        num('p-u5-q5', 'f = 1/T. T=0.5 s. f in Hz', 2, null)
      ],
      extras: [
        essay('physics-college-1-essay-1', '', 'Explain resonance with one physical picture (swing, bridge, or RLC). Cite OpenStax or the stack. No grade — complete when cited.', { work: 'OpenStax College Physics 2e', loc: 'essay' })
      ]
    },
    {
      id: 'u6',
      title: 'E&M',
      chapter: '8. Electromagnetism & Maxwell\'s Unified Field Equations',
      doors: ['https://openstax.org/details/books/college-physics-2e'],
      source: { work: 'OpenStax College Physics 2e', loc: 'Maxwell' },
      questions: [
        mc('p-u6-q1', 'Maxwell’s equations unify:', ['electricity, magnetism, light', 'only gravity', 'only heat', 'ballots'], 0, 'Light is the wave.'),
        sh('p-u6-q2', 'c is the speed of ____ in vacuum.', 'light', 'NIST.'),
        num('p-u6-q3', 'Two like charges: the force is repulsive. Type 1 if you agree, 0 if not.', 1, 'Coulomb.'),
        mc('p-u6-q4', 'A changing B field makes:', ['an electric field (Faraday)', 'mass', 'p-values', 'color'], 0, 'Induction.'),
        mc('p-u6-q5', 'In vacuum Maxwell waves travel at:', ['c', 'sound speed', '0', 'whatever you like'], 0, 'CODATA c.')
      ]
    },
    {
      id: 'u7',
      title: 'Thermo',
      chapter: '9. Thermodynamics, Heat Engines & Statistical Entropy',
      doors: ['https://openstax.org/details/books/college-physics-2e'],
      source: { work: 'OpenStax College Physics 2e', loc: 'thermo' },
      questions: [
        mc('p-u7-q1', 'Zeroth law is about:', ['thermal equilibrium / temperature', '0 K engines', 'Newton III', 'charge'], 0, 'Transitivity of equilibrium.'),
        sh('p-u7-q2', 'First law is conservation of ____.', 'energy', null),
        mc('p-u7-q3', 'Second law: isolated entropy', ['does not decrease', 'always drops', 'is a vote', 'is α'], 0, 'Arrow of processes.'),
        num('p-u7-q4', 'Absolute zero in celsius (integer)', -273, 'Approx; 0 K. Use −273.'),
        mc('p-u7-q5', 'Boltzmann relates entropy to:', ['log of microstate count', 'p-values', 'votes', 'color'], 0, 'S = k ln W.')
      ],
      extras: [
        project(
          'physics-college-1-project',
          '',
          'Work a one-dimensional motion problem (OpenStax). Show F=ma, a work-energy check, and cite NIST if you use a constant. Graph v(t) or x(t) in Math Grapher if useful.',
          ['State givens', 'Newton check', 'Energy check', 'Cite door', 'Export'],
          { work: 'OpenStax College Physics 2e', loc: 'project' }
        )
      ]
    },
    {
      id: 'u8',
      title: 'Quantum glance',
      chapter: '11. Quantum Mechanics & Wave-Particle Duality',
      doors: ['https://physics.nist.gov/cuu/Constants/'],
      source: { work: 'NIST · Stacks physics ch. 11', loc: 'quantum' },
      questions: [
        mc('p-u8-q1', 'A photon’s energy is:', ['hf', 'mc only for photons at rest', 'kT always', 'qV only'], 0, 'Planck.'),
        sh('p-u8-q2', 'ψ is the ____function.', 'wave', null),
        mc('p-u8-q3', 'Heisenberg: you cannot sharply know both:', ['x and p', 'name and date', 'mass and SI', 'color and vote'], 0, 'σx σp ≥ ħ/2.'),
        num('p-u8-q4', 'Double-slit: interference is evidence of wave behavior. Type 1 if true, 0 if false.', 1, null),
        mc('p-u8-q5', 'Fetch h from:', ['memory', 'NIST CODATA', 'a homework mill', 'a vibe'], 1, 'Door.')
      ],
      extras: [
        essay('physics-college-1-essay-2', '', 'Why we fetch c and h from NIST rather than from a model’s memory. One paragraph plus the door URL.', { work: 'NIST CODATA', loc: 'essay' }),
        exam('physics-college-1-final', '', 'Final', [
          num('p-fn-q1', 'F=ma m=2 a=3', 6, null),
          num('p-fn-q2', 'KE 2 kg 3 m/s', 9, null),
          num('p-fn-q3', 'f=1/T T=0.5', 2, null),
          mc('p-fn-q4', 'Maxwell light speed in vacuum', ['c', 'sound', '0'], 0, null),
          sh('p-fn-q5', 'First law conserves', 'energy', null),
          mc('p-fn-q6', 'SHM F =', ['-kx', 'kx^2', 'mg only'], 0, null),
          num('p-fn-q7', 'SI base units count', 7, null),
          mc('p-fn-q8', 'Photon E =', ['hf', 'mgh always', '0'], 0, null)
        ], { work: 'OpenStax College Physics 2e', loc: 'final' }, 50)
      ]
    }
  ]
);

const chemistry = build(
  {
    id: 'chemistry-2e-1',
    stack: 'chemistry',
    dewey: '540',
    title: 'Chemistry I: Atoms, Bonding & Chemical Reactions',
    level: 'undergrad',
    hours: 48,
    license: {
      spdx: 'CC-BY-4.0',
      attribution: 'Adapted from OpenStax Chemistry 2e (CC BY 4.0) and EasyLM chemistry stack. Masses: CIAAW. Terms: IUPAC Gold Book.',
      sourceUrl: 'https://openstax.org/details/books/chemistry-2e'
    }
  },
  [
    {
      id: 'u1',
      title: 'Atoms',
      chapter: '1. The Atomic Hypothesis and the First Principles of Chemistry',
      doors: ['https://goldbook.iupac.org/'],
      source: { work: 'OpenStax Chemistry 2e · IUPAC Gold Book', loc: 'atoms' },
      questions: [
        mc('c-u1-q1', 'Feynman’s core chemistry axiom is that things are made of:', ['atoms', 'p-values', 'votes', 'ether'], 0, 'Tiny particles that attract and stick.'),
        sh('c-u1-q2', 'Positive nucleus, negative ____.', 'electrons', null),
        mc('c-u1-q3', 'A chemical change rearranges:', ['atoms into new substances', 'SI prefixes only', 'votes', 'fonts'], 0, 'Bonds.'),
        num('c-u1-q4', 'Hydrogen atomic number', 1, 'Z=1.'),
        mc('c-u1-q5', 'Fetch names of substances from:', ['IUPAC', 'a meme', 'a mill', 'vibes'], 0, 'Gold Book.')
      ]
    },
    {
      id: 'u2',
      title: 'Periodic',
      chapter: '2. Atomic Architecture, Orbitals & The Periodic Table',
      doors: ['https://www.ciaaw.org/atomic-weights.htm'],
      source: { work: 'CIAAW · OpenStax Chemistry 2e', loc: 'periodic' },
      questions: [
        mc('c-u2-q1', 'Atomic number Z is:', ['proton count', 'neutron count', 'mass number only', 'p-value'], 0, 'Defines the element.'),
        sh('c-u2-q2', 'Same Z, different N: ____.', 'isotopes', null),
        mc('c-u2-q3', 'A filled shell is associated with:', ['noble-gas stability', 'always metals', 'always radioactivity', 'p < 0.05'], 0, 'Octet story, with exceptions.'),
        num('c-u2-q4', 'Carbon Z', 6, null),
        mc('c-u2-q5', 'Standard atomic weights: fetch', ['CIAAW', 'memory to 9 places', 'a mill', 'Wikipedia as last word'], 0, 'Door.')
      ]
    },
    {
      id: 'u3',
      title: 'Mole',
      chapter: '3. The Mole Bridge, Molar Mass & Solution Concentration',
      doors: ['https://openstax.org/details/books/chemistry-2e'],
      source: { work: 'OpenStax Chemistry 2e', loc: 'mole' },
      questions: [
        num('c-u3-q1', 'Moles in 36 g of H2O if M = 18 g/mol', 2, '36/18.'),
        sh('c-u3-q2', 'The SI amount-of-substance unit is the ____.', 'mole', '2019 SI.'),
        num('c-u3-q3', 'Molarity: 0.5 mol in 1 L is what M?', 0.5, 'mol/L.'),
        mc('c-u3-q4', 'Dilution conserves:', ['moles of solute', 'molarity always', 'volume always', 'pH always'], 0, 'M1V1 = M2V2.'),
        num('c-u3-q5', 'M1V1=M2V2: 2 M × 0.1 L → 0.5 M needs V2 in L', 0.4, '0.2 / 0.5.')
      ]
    },
    {
      id: 'u4',
      title: 'Bonding',
      chapter: '4. Chemical Bonding, Electronegativity & Molecular Geometry',
      doors: ['https://goldbook.iupac.org/'],
      source: { work: 'IUPAC · OpenStax Chemistry 2e', loc: 'bonding' },
      questions: [
        mc('c-u4-q1', 'Ionic bonding is:', ['electron transfer and electrostatics', 'always H-bonds', 'nuclear fusion', 'a vote'], 0, 'Metals/nonmetals cartoon.'),
        sh('c-u4-q2', 'Shared electron pair: ____ bond.', 'covalent', null),
        mc('c-u4-q3', 'VSEPR predicts:', ['shape from electron domains', 'nuclear spin', 'p-values', 'price'], 0, 'Repulsion.'),
        mc('c-u4-q4', 'Water’s bent shape is from:', ['two bonds + two lone pairs on O', 'four bonds, no lone pairs', 'metallic lattice', 'α'], 0, 'Tetrahedral domains, bent molecule.'),
        num('c-u4-q5', 'Methane has how many C–H bonds?', 4, null)
      ],
      extras: [
        exam('chemistry-2e-1-midterm', '', 'Midterm', [
          num('c-mt-q1', 'Z of C', 6, null),
          num('c-mt-q2', 'mol in 36 g water M=18', 2, null),
          num('c-mt-q3', '2M × 0.1 L to 0.5 M, V2 L', 0.4, null),
          sh('c-mt-q4', 'Same Z different N', 'isotopes', null),
          mc('c-mt-q5', 'Covalent means', ['shared pairs', 'free electrons in a metal only', 'neutrons'], 0, null),
          num('c-mt-q6', 'H atomic number', 1, null),
          sh('c-mt-q7', 'SI amount unit', 'mole', null),
          mc('c-mt-q8', 'VSEPR is about', ['shape', 'p-values', 'votes'], 0, null)
        ], { work: 'OpenStax Chemistry 2e', loc: 'midterm' }, 45)
      ]
    },
    {
      id: 'u5',
      title: 'Stoichiometry',
      chapter: '5. Stoichiometry: Conservation of Mass & Limiting Reactants',
      doors: ['https://openstax.org/details/books/chemistry-2e'],
      source: { work: 'OpenStax Chemistry 2e', loc: 'stoich' },
      questions: [
        mc('c-u5-q1', 'A balanced equation conserves:', ['atoms of each element', 'moles of molecules always 1:1', 'volume of all gases at any T', 'p-values'], 0, 'Dalton / Lavoisier.'),
        num('c-u5-q2', '2 H2 + O2 → 2 H2O. H2 moles needed for 1 mol O2', 2, '2:1.'),
        sh('c-u5-q3', 'The reactant that runs out first is ____.', 'limiting', null),
        num('c-u5-q4', 'If 2 mol H2 meet 2 mol O2, moles of leftover O2', 1, 'Need 1 mol O2 for 2 mol H2.'),
        mc('c-u5-q5', 'Coefficients are:', ['mole ratios', 'always grams', 'always liters at STP without saying so', 'p-values'], 0, 'Read the equation.')
      ],
      extras: [
        essay('chemistry-2e-1-essay-1', '', 'Explain limiting reactant with one numbers example. Cite OpenStax Chemistry 2e.', { work: 'OpenStax Chemistry 2e', loc: 'essay' })
      ]
    },
    {
      id: 'u6',
      title: 'Gases',
      chapter: '6. States of Matter: Ideal & Real Gases, Solutions & Phase Transitions',
      doors: ['https://webbook.nist.gov/'],
      source: { work: 'NIST WebBook · OpenStax Chemistry 2e', loc: 'gases' },
      questions: [
        mc('c-u6-q1', 'Ideal gas law is:', ['PV = nRT', 'F = ma', 'E = hf', 'p < 0.05'], 0, 'State equation.'),
        num('c-u6-q2', 'If n,R,T fixed and V doubles, P is multiplied by', 0.5, 'Boyle.'),
        sh('c-u6-q3', 'Dalton: total P is sum of ____ pressures.', 'partial', null),
        mc('c-u6-q4', 'Real gases need corrections at:', ['high P / low T', 'always 1 atm only', '0 K only', 'in vacuum only'], 0, 'Van der Waals.'),
        num('c-u6-q5', 'n = PV/RT. If P,V,R,T give n=2, n is', 2, null)
      ]
    },
    {
      id: 'u7',
      title: 'Thermo & kinetics',
      chapter: '7. Chemical Thermodynamics & Reaction Kinetics',
      doors: ['https://webbook.nist.gov/'],
      source: { work: 'NIST WebBook', loc: 'thermo' },
      questions: [
        mc('c-u7-q1', 'ΔH < 0 is:', ['exothermic', 'endothermic', 'a p-value', 'nuclear only'], 0, 'Heat out of system (usual chem sign).'),
        sh('c-u7-q2', 'Spontaneity under const T,P: look at Δ____.', 'g', 'Gibbs. Type g.'),
        mc('c-u7-q3', 'Kinetics is about:', ['how fast', 'only ΔG', 'only color', 'votes'], 0, 'Rate ≠ extent.'),
        num('c-u7-q4', 'First-order: if rate = k[A] and [A] doubles, rate multiplies by', 2, null),
        mc('c-u7-q5', 'Fetch a tabulated enthalpy from:', ['NIST WebBook', 'memory to 9 places', 'a mill', 'a vibe'], 0, 'Door.')
      ],
      extras: [
        project(
          'chemistry-2e-1-project',
          '',
          'Balance one reaction from OpenStax. Compute moles of product from a limiting reactant. If you cite an enthalpy, fetch NIST WebBook — do not invent the number.',
          ['Write balanced equation', 'Identify limiting reactant', 'Compute product moles', 'Cite door', 'Export'],
          { work: 'OpenStax Chemistry 2e', loc: 'project' }
        )
      ]
    },
    {
      id: 'u8',
      title: 'Equilibrium & acid-base',
      chapter: '9. Aqueous Equilibria: Acids, Bases, pH & Buffers',
      doors: ['https://openstax.org/details/books/chemistry-2e'],
      source: { work: 'OpenStax Chemistry 2e', loc: 'pH' },
      questions: [
        num('c-u8-q1', 'pH of [H+] = 1e-3', 3, 'pH = −log10.'),
        sh('c-u8-q2', 'pH + pOH = 14 (approx 25 °C) is about water’s ____.', 'autoionization', 'Kw. Type autoionization'),
        mc('c-u8-q3', 'A buffer resists:', ['pH change', 'mass', 'volume always', 'SI'], 0, 'Weak acid + conjugate.'),
        mc('c-u8-q4', 'Le Chatelier: add product, equilibrium shifts:', ['toward reactants', 'toward more product always', 'nowhere', 'to SI'], 0, 'Relieve the stress.'),
        num('c-u8-q5', 'Neutral water pH (approx 25 °C, integer)', 7, null)
      ],
      extras: [
        essay('chemistry-2e-1-essay-2', '', 'What pH is (log scale of hydronium). One numeric example. Cite OpenStax or IUPAC.', { work: 'OpenStax Chemistry 2e', loc: 'essay 2' }),
        exam('chemistry-2e-1-final', '', 'Final', [
          num('c-fn-q1', '36 g water, M=18, moles', 2, null),
          num('c-fn-q2', 'pH of 1e-3 H+', 3, null),
          num('c-fn-q3', '2 H2 + O2, H2 moles for 1 mol O2', 2, null),
          sh('c-fn-q4', 'Runs out first', 'limiting', null),
          mc('c-fn-q5', 'PV=nRT is', ['ideal gas', 'Newton II', 'Bayes'], 0, null),
          num('c-fn-q6', 'Z of C', 6, null),
          mc('c-fn-q7', 'ΔH<0', ['exothermic', 'endothermic'], 0, null),
          num('c-fn-q8', 'pH 7 water integer', 7, null)
        ], { work: 'OpenStax Chemistry 2e', loc: 'final' }, 50)
      ]
    }
  ]
);

const biology = build(
  {
    id: 'biology-2e-1',
    stack: 'biology',
    dewey: '570',
    title: 'Biology I: Cellular Life & Molecular Biology',
    level: 'undergrad',
    hours: 48,
    license: {
      spdx: 'CC-BY-4.0',
      attribution: 'Adapted from OpenStax Biology 2e (CC BY 4.0) and EasyLM biology stack. Sequences/accessions: NCBI.',
      sourceUrl: 'https://openstax.org/details/books/biology-2e'
    }
  },
  [
    {
      id: 'u1',
      title: 'Life',
      chapter: '1. The First Principles of Life and Biological Scale',
      doors: ['https://openstax.org/details/books/biology-2e'],
      source: { work: 'OpenStax Biology 2e', loc: 'ch. 1' },
      questions: [
        mc('b-u1-q1', 'Living systems persist by:', ['coupling to energy flows and keeping order locally', 'violating thermodynamics', 'never using ATP', 'votes'], 0, 'Open systems.'),
        sh('b-u1-q2', 'Cell is the basic ____ of life.', 'unit', null),
        mc('b-u1-q3', 'Emergent properties appear:', ['at higher scales', 'only in physics', 'never', 'as p-values'], 0, 'Tissue ≠ cell dump.'),
        num('b-u1-q4', 'How many domains in the three-domain tree (Bacteria, Archaea, Eukarya)?', 3, null),
        mc('b-u1-q5', 'Fetch an accession from:', ['NCBI', 'a mill', 'memory', 'a vibe'], 0, 'Door.')
      ]
    },
    {
      id: 'u2',
      title: 'Molecules',
      chapter: '2. Molecular Building Blocks: Water, Carbon & Macromolecules',
      doors: ['https://openstax.org/details/books/biology-2e'],
      source: { work: 'OpenStax Biology 2e', loc: 'macromolecules' },
      questions: [
        mc('b-u2-q1', 'Water is a good solvent because it is:', ['polar', 'nonpolar like oil', 'a noble gas', 'a metal'], 0, 'H-bonds.'),
        sh('b-u2-q2', 'Proteins are polymers of ____ acids.', 'amino', null),
        mc('b-u2-q3', 'DNA / RNA are:', ['nucleic acids', 'triglycerides', 'steroids only', 'p-values'], 0, 'Nucleotides.'),
        num('b-u2-q4', 'How many canonical DNA bases in the alphabet A,C,G,T?', 4, null),
        mc('b-u2-q5', 'Primary protein structure is:', ['amino-acid sequence', 'the whole fold only', 'the cell wall', 'a vote'], 0, 'Beads on a string.')
      ]
    },
    {
      id: 'u3',
      title: 'Cell',
      chapter: '3. Cellular Architecture: Membranes, Compartments & Rotary Motors',
      doors: ['https://openstax.org/details/books/biology-2e'],
      source: { work: 'OpenStax Biology 2e', loc: 'cell' },
      questions: [
        mc('b-u3-q1', 'Fluid mosaic is a model of the:', ['membrane', 'nucleus only', 'cell wall of plants only', 'atmosphere'], 0, 'Lipids + proteins.'),
        sh('b-u3-q2', 'Mitochondria are linked to ____ theory of eukaryotic origins.', 'endosymbiotic', 'Endosymbiosis. Type endosymbiotic'),
        mc('b-u3-q3', 'ATP synthase is a:', ['rotary motor', 'gene', 'p-value', 'chromosome'], 0, 'Turbine.'),
        mc('b-u3-q4', 'Prokaryotes lack:', ['a nucleus', 'DNA', 'ribosomes', 'membranes of any kind'], 0, 'No nuclear envelope.'),
        num('b-u3-q5', 'Lipid bilayers have how many leaflets?', 2, null)
      ]
    },
    {
      id: 'u4',
      title: 'Central dogma',
      chapter: '4. The Central Dogma: Information Flow from DNA to Protein',
      doors: ['https://www.ncbi.nlm.nih.gov/'],
      source: { work: 'NCBI · OpenStax Biology 2e', loc: 'dogma' },
      questions: [
        mc('b-u4-q1', 'Central dogma flow is:', ['DNA → RNA → protein', 'protein → DNA always', 'lipid → gene', 'vote → law'], 0, 'Crick, with known exceptions (RT).'),
        sh('b-u4-q2', 'A pairs with ____ in DNA.', 't', 'Thymine. Type t'),
        num('b-u4-q3', 'Codon length in bases', 3, null),
        mc('b-u4-q4', 'Replication of DNA is:', ['semi-conservative', 'conservative only', 'dispersive only', 'a vote'], 0, 'Meselson-Stahl.'),
        mc('b-u4-q5', 'Look up a gene at:', ['NCBI Gene', 'a mill', 'memory of an accession', 'Chegg'], 0, 'Door.')
      ],
      extras: [
        exam('biology-2e-1-midterm', '', 'Midterm', [
          num('b-mt-q1', 'DNA alphabet size A C G T', 4, null),
          num('b-mt-q2', 'Codon length', 3, null),
          sh('b-mt-q3', 'A pairs with', 't', null),
          mc('b-mt-q4', 'Dogma', ['DNA to RNA to protein', 'protein to DNA always'], 0, null),
          sh('b-mt-q5', 'Protein monomers', 'amino acids', 'Type amino acids'),
          mc('b-mt-q6', 'Membrane model', ['fluid mosaic', 'solid brick'], 0, null),
          num('b-mt-q7', 'Bilayer leaflets', 2, null),
          mc('b-mt-q8', 'Three domains of life count', ['3', '2', '5'], 0, null)
        ], { work: 'OpenStax Biology 2e', loc: 'midterm' }, 45)
      ]
    },
    {
      id: 'u5',
      title: 'Genetics',
      chapter: '5. Heredity, Chromosomes & Mendelian Genetics',
      doors: ['https://openstax.org/details/books/biology-2e'],
      source: { work: 'OpenStax Biology 2e', loc: 'Mendel' },
      questions: [
        num('b-u5-q1', 'Aa × Aa, P(aa) if Mendelian unlinked', 0.25, '1/4.'),
        sh('b-u5-q2', 'Alternate versions of a gene are ____.', 'alleles', null),
        mc('b-u5-q3', 'Hardy–Weinberg needs:', ['no selection, no drift, no mutation, no migration, random mating', 'p < 0.05', 'always selection', 'a mill'], 0, 'Null model.'),
        num('b-u5-q4', 'If p = 0.5, 2pq =', 0.5, '2*0.5*0.5.'),
        mc('b-u5-q5', 'Linked genes sit on:', ['the same chromosome and may hitchhike', 'always different planets', 'lipids', 'ribosomes only'], 0, 'Recombination can unhook them.')
      ],
      extras: [
        essay('biology-2e-1-essay-1', '', 'Explain one Mendelian cross with a Punnett square. Cite OpenStax Biology 2e.', { work: 'OpenStax Biology 2e', loc: 'essay' })
      ]
    },
    {
      id: 'u6',
      title: 'Energy',
      chapter: '6. Bioenergetics: Photosynthesis & Cellular Respiration',
      doors: ['https://openstax.org/details/books/biology-2e'],
      source: { work: 'OpenStax Biology 2e', loc: 'ATP' },
      questions: [
        sh('b-u6-q1', 'Universal short-term energy coin in cells: ____.', 'atp', 'Type atp'),
        mc('b-u6-q2', 'Photosynthesis stores photon energy in:', ['chemical bonds (sugars etc.)', 'only heat', 'votes', 'p-values'], 0, 'Chloroplast.'),
        mc('b-u6-q3', 'Mitochondrial respiration harvests energy from:', ['fuel molecules like glucose', 'photons only in animals', 'DNA replication only', 'sound'], 0, 'Electron transport.'),
        num('b-u6-q4', 'Glycolysis net ATP per glucose (canonical textbook integer)', 2, 'Net 2.'),
        mc('b-u6-q5', 'Do not quote “36 ATP” from memory as a law. True?', ['true', 'false'], 0, 'Yields vary; cite a door.')
      ]
    },
    {
      id: 'u7',
      title: 'Evolution',
      chapter: '7. Evolution, Natural Selection & The Tree of Life',
      doors: ['https://www.ncbi.nlm.nih.gov/taxonomy'],
      source: { work: 'NCBI Taxonomy · OpenStax Biology 2e', loc: 'evolution' },
      questions: [
        mc('b-u7-q1', 'Natural selection requires:', ['variation, heredity, differential success', 'a goal toward perfection', 'p-values', 'a designer in the mechanism'], 0, 'Darwin’s machine.'),
        sh('b-u7-q2', 'A clade is an ancestor plus all ____.', 'descendants', null),
        mc('b-u7-q3', 'A phylogeny is a hypothesis about:', ['relatedness', 'pH', 'SI', 'votes'], 0, 'Tree.'),
        mc('b-u7-q4', 'Look up a taxon at:', ['NCBI Taxonomy', 'a mill', 'memory of a common name only', 'Chegg'], 0, 'Door.'),
        num('b-u7-q5', 'Minimum tips on a tree that can show a sister pair', 2, null)
      ],
      extras: [
        project(
          'biology-2e-1-project',
          '',
          'Pick a gene or taxon. Fetch the NCBI door (Gene or Taxonomy). Write what the record is, what it is not, and one evolutionary or molecular fact you can actually point to on that page.',
          ['Name the record', 'Paste the official URL', 'What the record is', 'One fact from the page', 'Export'],
          { work: 'NCBI', loc: 'project' }
        )
      ]
    },
    {
      id: 'u8',
      title: 'Ecology',
      chapter: '8. Ecology, Population Dynamics & Biogeochemical Cycles',
      doors: ['https://openstax.org/details/books/biology-2e'],
      source: { work: 'OpenStax Biology 2e', loc: 'ecology' },
      questions: [
        mc('b-u8-q1', 'Exponential growth is:', ['dN/dt = rN', 'always logistic', 'a p-value', 'a vote'], 0, 'Unlimited cartoon.'),
        sh('b-u8-q2', 'Carrying capacity letter in logistic models: ____.', 'k', 'Type k'),
        mc('b-u8-q3', 'Energy along a food chain generally:', ['decreases at higher trophic levels', 'increases without bound', 'is a vote', 'is α'], 0, 'Trophic pyramid.'),
        num('b-u8-q4', 'If r=0, exponential model: dN/dt', 0, null),
        mc('b-u8-q5', 'A carbon cycle is:', ['biogeochemical', 'only politics', 'only quantum', 'a mill'], 0, 'Pools and fluxes.')
      ],
      extras: [
        essay('biology-2e-1-essay-2', '', 'Exponential vs logistic growth. One graph in words, one OpenStax cite.', { work: 'OpenStax Biology 2e', loc: 'essay 2' }),
        exam('biology-2e-1-final', '', 'Final', [
          sh('b-fn-q1', 'A pairs with', 't', null),
          num('b-fn-q2', 'Codon length', 3, null),
          num('b-fn-q3', 'Aa×Aa P(aa)', 0.25, null),
          sh('b-fn-q4', 'Energy coin', 'atp', null),
          mc('b-fn-q5', 'Selection needs variation, heredity, differential success', ['true', 'false'], 0, null),
          sh('b-fn-q6', 'Logistic capacity letter', 'k', null),
          num('b-fn-q7', 'Net glycolysis ATP (canonical)', 2, null),
          mc('b-fn-q8', 'Accessions live at', ['NCBI', 'a mill', 'memory'], 0, null)
        ], { work: 'OpenStax Biology 2e', loc: 'final' }, 50)
      ]
    }
  ]
);

const civics = build(
  {
    id: 'civics-us-1',
    stack: 'civics',
    dewey: '320',
    title: 'Civics I: Constitutional Democracy, Civil Rights & Governance',
    level: 'high',
    hours: 40,
    license: {
      spdx: 'CC-BY-4.0',
      attribution: 'Adapted from OpenStax American Government 3e (CC BY 4.0) and EasyLM civics stack. Text of the U.S. Constitution: NARA.',
      sourceUrl: 'https://openstax.org/details/books/american-government-3e'
    }
  },
  [
    {
      id: 'u1',
      title: 'Social contract',
      chapter: '1. First Principles: Sovereignty, Power, and the Social Contract',
      doors: ['https://openstax.org/details/books/american-government-3e'],
      source: { work: 'OpenStax American Government 3e', loc: 'ch. 1' },
      questions: [
        mc('v-u1-q1', 'Weber: the state claims a monopoly of legitimate:', ['force', 'trade', 'language', 'p-values'], 0, 'Violence with a claim of right.'),
        sh('v-u1-q2', 'Hobbes, Locke, Rousseau: ____ contract tradition.', 'social', null),
        mc('v-u1-q3', 'Sovereignty is:', ['ultimate authority in a territory', 'a p-value', 'a font', 'GDP'], 0, 'Who decides.'),
        mc('v-u1-q4', 'Legitimacy is:', ['why people treat power as rightful', 'raw force only', 'SI', 'n'], 0, 'Consent, tradition, law…'),
        num('v-u1-q5', 'A monopoly is how many sellers in the extreme model?', 1, 'Here: one claimant of legitimate force.')
      ]
    },
    {
      id: 'u2',
      title: 'Regimes',
      chapter: '2. Typologies of Regimes: Democracies, Republics, and Autocracies',
      doors: ['https://openstax.org/details/books/american-government-3e'],
      source: { work: 'OpenStax American Government 3e', loc: 'ch. 2' },
      questions: [
        mc('v-u2-q1', 'A republic in the Madisonian sense emphasizes:', ['representation and law over raw majority will', 'one autocrat', 'no elections ever', 'p-values'], 0, 'Federalist 10 vibe.'),
        sh('v-u2-q2', 'Rule by one: ____cracy / autocracy. Type autocracy.', 'autocracy', null),
        mc('v-u2-q3', 'Democracy without constitutional limits can still:', ['harm minorities', 'never err', 'replace physics', 'set c'], 0, 'Tyranny of the majority.'),
        mc('v-u2-q4', 'An autocracy concentrates:', ['executive power with weak checks', 'only local zoning', 'SI units', 'p-values'], 0, 'Few constrain the ruler.'),
        num('v-u2-q5', 'Bicameral legislature has how many chambers?', 2, null)
      ]
    },
    {
      id: 'u3',
      title: 'Constitutions',
      chapter: '3. Constitutional Architecture: Codification, Entrenchment, and Amendment',
      doors: ['https://www.archives.gov/founding-docs/constitution', 'https://constitution.congress.gov/'],
      source: { work: 'NARA Constitution · OpenStax', loc: 'Article V' },
      questions: [
        mc('v-u3-q1', 'A codified constitution is:', ['written in a canonical text', 'only custom', 'a p-value', 'a mill'], 0, 'One instrument.'),
        sh('v-u3-q2', 'U.S. amendment article number (roman or arabic): type v or 5.', '5', 'Article V. Accept 5.'),
        mc('v-u3-q3', 'Entrenchment means:', ['harder to change than ordinary law', 'easier than a statute', 'never changeable by anyone', 'SI'], 0, 'Supermajority etc.'),
        num('v-u3-q4', 'U.S. Article V: fraction of both houses to propose (as decimal 2/3)', 0.666667, 'Two-thirds. tolerance will catch 0.67.', 0.01),
        mc('v-u3-q5', 'Read the text at:', ['NARA / constitution.congress.gov', 'a mill', 'memory of a meme', 'Chegg'], 0, 'Door.')
      ]
    },
    {
      id: 'u4',
      title: 'Separation of powers',
      chapter: '4. The Separation of Powers and Checks & Balances',
      doors: ['https://constitution.congress.gov/'],
      source: { work: 'Constitution Annotated', loc: 'separation' },
      questions: [
        mc('v-u4-q1', 'Montesquieu’s trias politica splits:', ['legislative, executive, judicial', 'federal only vs local only', 'p-values', 'SI'], 0, 'Three functions.'),
        sh('v-u4-q2', 'Madison: ambition must counteract ____.', 'ambition', 'Federalist 51.'),
        mc('v-u4-q3', 'A veto is a check by the:', ['executive on legislation', 'judiciary on gravity', 'census on SI', 'mill'], 0, 'Presentment.'),
        mc('v-u4-q4', 'Judicial review is a check by courts on:', ['statutes and acts’ constitutionality', 'the speed of light', 'pH', 'mass'], 0, 'Marbury story — fetch the court.'),
        num('v-u4-q5', 'How many branches in the classical tripartite cartoon?', 3, null)
      ],
      extras: [
        exam('civics-us-1-midterm', '', 'Midterm', [
          sh('v-mt-q1', 'Social ____ tradition (Hobbes/Locke).', 'contract', null),
          num('v-mt-q2', 'Bicameral chambers', 2, null),
          num('v-mt-q3', 'Tripartite branches', 3, null),
          sh('v-mt-q4', 'Ambition counteracts', 'ambition', null),
          mc('v-mt-q5', 'Article V is about', ['amendment', 'taxes only', 'navies only'], 0, null),
          mc('v-mt-q6', 'Read the Constitution at', ['NARA', 'a mill', 'memory'], 0, null),
          sh('v-mt-q7', 'Weber monopoly of legitimate', 'force', null),
          num('v-mt-q8', '2/3 as decimal (approx)', 0.666667, null, 0.01)
        ], { work: 'OpenStax American Government 3e', loc: 'midterm' }, 40)
      ]
    },
    {
      id: 'u5',
      title: 'Federalism',
      chapter: '5. Federalism and Devolution: Multi-Tier Sovereignty',
      doors: ['https://constitution.congress.gov/'],
      source: { work: 'Constitution Annotated', loc: 'federalism' },
      questions: [
        mc('v-u5-q1', 'Federalism splits power between:', ['national and subnational governments', 'only cities', 'only courts', 'SI labs'], 0, 'Two+ sovereigns.'),
        sh('v-u5-q2', 'U.S. 10th Amendment: powers not delegated are ____ to the states or the people.', 'reserved', null),
        mc('v-u5-q3', 'Enumerated powers are:', ['listed to the federal government', 'whatever a mayor wants', 'p-values', 'physics constants'], 0, 'Article I style.'),
        mc('v-u5-q4', 'Concurrent powers are:', ['shared', 'impossible', 'only treaties', 'only war'], 0, 'Tax, e.g.'),
        num('v-u5-q5', 'Tenth Amendment number', 10, null)
      ],
      extras: [
        essay('civics-us-1-essay-1', '', 'What federalism is, with one U.S. example (commerce, militia, or 10th Amendment). Cite NARA or constitution.congress.gov.', { work: 'NARA / Constitution Annotated', loc: 'essay' })
      ]
    },
    {
      id: 'u6',
      title: 'Legislation',
      chapter: '6. The Legislative Process: Representation and Statutory Drafting',
      doors: ['https://www.congress.gov/'],
      source: { work: 'congress.gov · OpenStax', loc: 'how a bill' },
      questions: [
        mc('v-u6-q1', 'A bill becomes a statute through:', ['introduction, committee, floor, presentment', 'a tweet', 'a p-value', 'a mill'], 0, 'The pipeline.'),
        sh('v-u6-q2', 'Two chambers: ____ism.', 'bicameral', null),
        mc('v-u6-q3', 'Look up a live bill at:', ['congress.gov', 'a mill', 'memory', 'Chegg'], 0, 'Door.'),
        mc('v-u6-q4', 'Codification gathers session laws into:', ['a code', 'a p-value table', 'SI brochure', 'a meme'], 0, 'U.S. Code, e.g.'),
        num('v-u6-q5', 'U.S. Congress chambers', 2, null)
      ]
    },
    {
      id: 'u7',
      title: 'Judiciary',
      chapter: '9. The Judiciary and Constitutional Review',
      doors: ['https://www.supremecourt.gov/'],
      source: { work: 'supremecourt.gov', loc: 'courts' },
      questions: [
        mc('v-u7-q1', 'Judicial independence is meant to protect:', ['reasoned judgment from short-term politics', 'physics constants', 'p-values', 'fonts'], 0, 'Tenure, salary, etc.'),
        sh('v-u7-q2', 'Highest U.S. court: Supreme ____.', 'court', null),
        mc('v-u7-q3', 'Opinions live at:', ['supremecourt.gov', 'a mill', 'memory of a headline', 'Chegg'], 0, 'Door.'),
        mc('v-u7-q4', 'Constitutional review asks whether an act:', ['fits the constitution', 'is popular', 'is SI', 'has p < 0.05'], 0, 'Ultra vires.'),
        num('v-u7-q5', 'U.S. Supreme Court justices, statutory size (integer)', 9, 'By statute, not the 1789 text.')
      ],
      extras: [
        project(
          'civics-us-1-project',
          '',
          'Pick one clause (speech, search, or due process). Read it on NARA or constitution.congress.gov. In Document Studio, write: the clause, what it does, one limit, and the URL.',
          ['Paste clause text from the door', 'State what it does', 'State one limit or case name you actually opened', 'URL', 'Export'],
          { work: 'NARA / Constitution Annotated', loc: 'project' }
        )
      ]
    },
    {
      id: 'u8',
      title: 'Rights',
      chapter: '12. Civil Liberties, Procedural Rights, and the Citizen\'s Shield',
      doors: ['https://www.archives.gov/founding-docs/constitution'],
      source: { work: 'NARA · OpenStax', loc: 'rights' },
      questions: [
        mc('v-u8-q1', 'Negative rights are mainly:', ['freedoms from interference', 'guaranteed cash always', 'SI units', 'p-values'], 0, 'Hands off.'),
        sh('v-u8-q2', 'Habeas corpus is the great ____ (writ).', 'writ', 'Great writ. Type writ'),
        mc('v-u8-q3', 'Due process is about:', ['fair procedure (and sometimes substance) before deprivation', 'winning elections only', 'NIST', 'mills'], 0, 'Life, liberty, property.'),
        mc('v-u8-q4', 'Read the Bill of Rights at:', ['NARA', 'a mill', 'memory of a poster only', 'Chegg'], 0, 'Door.'),
        num('v-u8-q5', 'First ten amendments: how many in the Bill of Rights as usually counted?', 10, null)
      ],
      extras: [
        essay('civics-us-1-essay-2', '', 'Due process in one page. Cite the Constitution text (NARA or constitution.congress.gov), not a homework mill.', { work: 'NARA', loc: 'essay 2' }),
        exam('civics-us-1-final', '', 'Final', [
          sh('v-fn-q1', 'Social ____', 'contract', null),
          num('v-fn-q2', 'Branches cartoon', 3, null),
          num('v-fn-q3', 'Bill of Rights count', 10, null),
          sh('v-fn-q4', 'Ambition counteracts', 'ambition', null),
          mc('v-fn-q5', 'Article V', ['amendment', 'taxes only'], 0, null),
          sh('v-fn-q6', '10th: powers ____ to states/people', 'reserved', null),
          mc('v-fn-q7', 'Bills at', ['congress.gov', 'a mill'], 0, null),
          num('v-fn-q8', 'SCOTUS size (statute)', 9, null)
        ], { work: 'OpenStax American Government 3e', loc: 'final' }, 50)
      ]
    }
  ]
);

const health = build(
  {
    id: 'health-physio-1',
    stack: 'health',
    dewey: '610',
    title: 'Health Sciences I: Human Physiology, Wellness & Disease',
    level: 'undergrad',
    hours: 45,
    license: {
      spdx: 'AGPL-3.0-or-later',
      attribution: 'EasyLM The Stacks · health textbook. Doors: OpenStax A&P 2e, MedlinePlus, CDC, WHO, AHA, PubMed.',
      sourceUrl: 'https://openstax.org/details/books/anatomy-and-physiology-2e'
    }
  },
  [
    {
      id: 'u1',
      title: 'Homeostasis & Boundaries',
      chapter: '1. The First Principles of Physiology and the Clinical Boundary',
      doors: ['https://openstax.org/details/books/anatomy-and-physiology-2e'],
      source: { work: 'OpenStax A&P 2e · The Stacks', loc: 'homeostasis' },
      questions: [
        mc('h-u1-q1', 'Homeostasis is the active maintenance of:', ['internal stability against entropic dissipation', 'rigid stasis with zero molecular motion', 'constant body weight only', 'external atmospheric pressure'], 0, 'Dynamic equilibrium preserving low internal entropy.'),
        sh('h-u1-q2', 'Negative feedback loops return a regulated physiological variable toward its ____ point.', 'set', 'Set point. Type set'),
        mc('h-u1-q3', 'EasyLM and digital health systems operate under the hard boundary:', ['educational inquiry and triage literacy, not direct clinical prescription', 'replacing emergency medical services', 'prescribing prescription drugs', 'dispensing medicine'], 0, 'Sovereign educational boundary.'),
        num('h-u1-q4', 'Canonical baseline arterial blood pH is tightly regulated around:', 7.4, 'Standard human arterial pH ~7.35–7.45.', 0.05),
        mc('h-u1-q5', 'Look up peer-reviewed medical consensus at:', ['MedlinePlus and PubMed', 'social media reels', 'unverified health blogs', 'rumors'], 0, 'Authoritative door.')
      ]
    },
    {
      id: 'u2',
      title: 'Organ Systems as Engines',
      chapter: '2. The Organ Systems as Interconnected Functional Engines',
      doors: ['https://openstax.org/details/books/anatomy-and-physiology-2e'],
      source: { work: 'OpenStax A&P 2e', loc: 'systems' },
      questions: [
        mc('h-u2-q1', 'The primary function of the circulatory system is:', ['bulk convection transport of oxygen, nutrients, hormones, and waste', 'direct synthesis of all amino acids', 'generating electrical power for the grid', 'filtering air before entering the nose'], 0, 'Hemodynamic convective engine.'),
        sh('h-u2-q2', 'The structural and functional filtration unit of the human kidney is the ____.', 'nephron', 'Nephron. Type nephron'),
        mc('h-u2-q3', 'Gas exchange in the human lungs occurs across the thin respiratory membrane of the:', ['alveoli', 'bronchi', 'trachea', 'larynx'], 0, 'Pulmonary alveoli.'),
        num('h-u2-q4', 'How many major anatomical organ systems coordinate human physiology?', 11, 'Circulatory, respiratory, digestive, renal, nervous, endocrine, musculoskeletal, integumentary, lymphatic, reproductive, immune.'),
        mc('h-u2-q5', 'Endocrine signaling differs from neural signaling primarily in:', ['traveling via bloodstream hormones rather than axonal action potentials', 'being instantaneous across microseconds', 'using light pulses', 'acting only on skin'], 0, 'Hormonal chemical signaling.')
      ]
    },
    {
      id: 'u3',
      title: 'Vital Signs & Equilibrium',
      chapter: '3. Homeostasis, Dynamic Equilibrium & Vital Signs',
      doors: ['https://medlineplus.gov/'],
      source: { work: 'MedlinePlus · NIH', loc: 'vitals' },
      questions: [
        mc('h-u3-q1', 'Normal resting adult heart rate typically falls within the physiological range of:', ['60 to 100 beats per minute', '20 to 40 beats per minute', '140 to 180 beats per minute', '200 to 250 beats per minute'], 0, 'AHA standard resting adult range.'),
        sh('h-u3-q2', 'Blood pressure is recorded as systolic over ____ pressure.', 'diastolic', 'Diastolic. Type diastolic'),
        num('h-u3-q3', 'Normal resting adult respiratory rate in breaths per minute is typically between 12 and:', 20, '12 to 20 breaths per minute.'),
        mc('h-u3-q4', 'Arterial oxygen saturation (SpO2) in healthy individuals breathing room air at sea level is:', ['95% to 100%', '70% to 80%', '50% to 60%', 'below 50%'], 0, 'Normal pulse oximetry.'),
        mc('h-u3-q5', 'Core body temperature is homeostatically regulated primarily by the:', ['hypothalamus', 'cerebellum', 'pancreas', 'spleen'], 0, 'Thermoregulatory control center.')
      ]
    },
    {
      id: 'u4',
      title: 'Immunology & Pathogens',
      chapter: '4. Immunology, Infectious Pathogens & Vaccines',
      doors: ['https://www.cdc.gov/'],
      source: { work: 'CDC · OpenStax Microbiology', loc: 'immunology' },
      questions: [
        mc('h-u4-q1', 'The innate immune system provides:', ['immediate, non-specific barrier and phagocytic defense', 'highly specific cloned antibody affinity maturation', 'instant memory B cell recall only', 'sterile eradication of all flora'], 0, 'First-line evolutionary defense.'),
        sh('h-u4-q2', 'Adaptive immune humoral immunity relies on B lymphocytes producing ____.', 'antibodies', 'Antibodies. Type antibodies'),
        mc('h-u4-q3', 'Vaccination stimulates active immunity by:', ['exposing the immune system to an antigen without causing full virulent disease', 'permanently altering somatic human DNA', 'sterilizing the entire microbiome', 'providing lifelong antibiotics'], 0, 'Immunological memory.'),
        num('h-u4-q4', 'How many primary classes of human immunoglobulins exist (IgG, IgM, IgA, IgE, IgD)?', 5, 'Five isotope classes.'),
        mc('h-u4-q5', 'Official immunization schedules must be fetched from primary authoritative doors like:', ['CDC and WHO', 'unreferenced social media memes', 'random internet forums', 'outdated marketing pamphlets'], 0, 'CDC Vaccines and Immunization Schedules.')
      ],
      extras: [
        exam('health-physio-1-midterm', '', 'Midterm Exam: Foundations of Human Physiology', [
          num('h-mt-q1', 'Canonical arterial blood pH', 7.4, null, 0.05),
          num('h-mt-q2', 'Organ systems count', 11, null),
          sh('h-mt-q3', 'Kidney filtration unit', 'nephron', null),
          mc('h-mt-q4', 'Gas exchange site', ['alveoli', 'larynx'], 0, null),
          sh('h-mt-q5', 'Blood pressure denominator', 'diastolic', null),
          num('h-mt-q6', 'Resting respiratory rate upper bound', 20, null),
          mc('h-mt-q7', 'Thermoregulation center', ['hypothalamus', 'spleen'], 0, null),
          sh('h-mt-q8', 'B cells produce', 'antibodies', null)
        ], { work: 'OpenStax A&P 2e · CDC', loc: 'midterm' }, 45)
      ]
    },
    {
      id: 'u5',
      title: 'Life Support Hierarchy',
      chapter: '5. Emergency First Aid: The Life Support Hierarchy (C-A-B)',
      doors: ['https://cpr.heart.org/'],
      source: { work: 'American Heart Association (AHA)', loc: 'life-support' },
      questions: [
        mc('h-u5-q1', 'AHA CPR protocol prioritizes the sequence:', ['C-A-B: Compressions, Airway, Breathing', 'A-B-C: Airway, Breathing, Compressions', 'B-A-C: Breathing, Airway, Compressions', 'Diagnostics before action'], 0, 'Circulation first.'),
        num('h-u5-q2', 'Target chest compression rate for adult CPR in compressions per minute:', 100, '100 to 120 compressions per minute.', 20),
        sh('h-u5-q3', 'An automated electronic device that analyzes heart rhythm and delivers a shock is an ____.', 'aed', 'Type aed'),
        mc('h-u5-q4', 'For an unresponsive adult with no breathing and no pulse, the immediate step is:', ['activate emergency response (911) and begin high-quality chest compressions', 'wait 15 minutes to see if they wake up', 'administer oral water', 'search their pockets for ID'], 0, 'Rapid activation and compressions.'),
        num('h-u5-q5', 'Standard adult CPR compression depth is at least how many inches?', 2, 'At least 2 inches (5 cm).')
      ],
      extras: [
        essay('health-physio-1-essay-1', '', 'Explain the physiological rationale behind switching the CPR sequence from A-B-C to C-A-B. Cite AHA guidelines.', { work: 'AHA CPR Guidelines', loc: 'essay-1' })
      ]
    },
    {
      id: 'u6',
      title: 'Trauma & Hemorrhage Control',
      chapter: '6. Trauma Mechanics: Hemorrhage, Shock, Burns & Fractures',
      doors: ['https://www.redcross.org/take-a-class/first-aid'],
      source: { work: 'American Red Cross · Stop the Bleed', loc: 'trauma' },
      questions: [
        mc('h-u6-q1', 'The most immediate life-saving intervention for severe, life-threatening arterial limb bleeding is:', ['firm, direct pressure and application of an arterial tourniquet proximal to the wound', 'washing the wound with soap and water', 'applying butter or grease', 'elevating the feet only'], 0, 'Stop the bleed.'),
        sh('h-u6-q2', 'Inadequate cellular perfusion and tissue oxygenation throughout the body is termed ____.', 'shock', 'Shock. Type shock'),
        mc('h-u6-q3', 'When an arterial tourniquet is applied, you must:', ['note the exact time of application and never loosen it until surgical care', 'loosen it every 5 minutes to test', 'hide it under clothing', 'remove it as soon as bleeding slows slightly'], 0, 'Continuous occlusion and timestamp.'),
        mc('h-u6-q4', 'First-line immediate field cooling for a thermal burn is:', ['cool, clean running tap water for 10 to 20 minutes', 'ice directly on the open blister', 'butter or flour', 'rubbing alcohol'], 0, 'Clean cool running water.'),
        num('h-u6-q5', 'In triage, severe arterial hemorrhage can cause exsanguination within how many minutes if uncontrolled?', 3, 'Critical minutes (typically 3–5 min).')
      ]
    },
    {
      id: 'u7',
      title: 'Fluid Balance & ORT',
      chapter: '7. Fluid Balance, Dehydration & Oral Rehydration Therapy (ORT)',
      doors: ['https://www.who.int/'],
      source: { work: 'World Health Organization (WHO)', loc: 'ort' },
      questions: [
        mc('h-u7-q1', 'Oral Rehydration Salts (ORS) work on the biological principle of:', ['intestinal sodium-glucose co-transport (SGLT1) driving passive water absorption', 'chemical sterilization of gut bacteria', 'inducing immediate vomiting', 'acidifying the colon'], 0, 'SGLT1 co-transport.'),
        sh('h-u7-q2', 'The primary intracellular cation that maintains resting membrane potential is ____.', 'potassium', 'Potassium. Type potassium'),
        num('h-u7-q3', 'WHO reduced osmolarity ORS target total osmolarity is approximately how many mOsm/L?', 245, 'WHO formula: ~245 mOsm/L.', 10),
        mc('h-u7-q4', 'Severe dehydration in infants manifests as:', ['sunken fontanelle, lack of tears, lethargy, and delayed capillary refill', 'hyperactivity and excessive urination', 'immediate fever with no fluid loss', 'normal skin turgor'], 0, 'Signs of hypovolemia.'),
        mc('h-u7-q5', 'Drinking pure sea water causes cellular dehydration because sea water is:', ['hypertonic relative to human plasma', 'hypotonic relative to human plasma', 'isotonic', 'sterile'], 0, 'Hypertonic fluid shifts.')
      ],
      extras: [
        project(
          'health-physio-1-project',
          '',
          'Analyze the WHO Oral Rehydration Salts (ORS) formula. Fetch the WHO door, explain the stoichiometric ratio of anhydrous glucose to sodium chloride, and document how SGLT1 co-transport prevents mortality from cholera and diarrheal dehydration.',
          ['Fetch WHO ORS specifications', 'Record chemical stoichiometry', 'Diagram SGLT1 co-transport mechanism', 'Document historical impact on global child mortality', 'Export study artifact'],
          { work: 'WHO ORS Technical Document', loc: 'project' }
        )
      ]
    },
    {
      id: 'u8',
      title: 'Clinical Reasoning & Triage',
      chapter: '13. Systematic Differential Problem-Solving in Health Inquiries',
      doors: ['https://pubmed.ncbi.nlm.nih.gov/'],
      source: { work: 'PubMed · MedlinePlus', loc: 'differential' },
      questions: [
        mc('h-u8-q1', 'The highest grade in the hierarchy of clinical evidence is generally:', ['systematic reviews and meta-analyses of randomized controlled trials (RCTs)', 'expert opinion and personal anecdote', 'single case reports', 'animal in vitro assays'], 0, 'Level 1 evidence.'),
        sh('h-u8-q2', 'The proportion of actual positives correctly identified by a diagnostic test is its ____.', 'sensitivity', 'Sensitivity. Type sensitivity'),
        mc('h-u8-q3', 'Red flag triage symptoms (crushing chest pain, sudden unilateral weakness, severe stridor) require:', ['immediate emergency activation (911 / emergency department)', 'scheduling a routine clinic visit in three weeks', 'drinking herbal tea and waiting', 'running an internet search poll'], 0, 'Emergency triage.'),
        num('h-u8-q4', 'If a diagnostic test has 90% sensitivity, what percentage of true positive cases are missed (false negatives)?', 10, '100% - 90% = 10%.'),
        mc('h-u8-q5', 'In health reasoning, correlation between a lifestyle factor and disease outcome proves causation:', ['false: confounding variables and reverse causality must be rigorously ruled out', 'true: any statistical correlation is definitive proof of direct cause', 'true only if p < 0.05', 'true if published on a blog'], 0, 'Epistemic caution.')
      ],
      extras: [
        essay('health-physio-1-essay-2', '', 'Compare diagnostic sensitivity and specificity. Explain why a screening test requires high sensitivity while a confirmatory test requires high specificity.', { work: 'PubMed / MedlinePlus', loc: 'essay-2' }),
        exam('health-physio-1-final', '', 'Final Comprehensive Exam: Human Physiology & Health Science', [
          sh('h-fn-q1', 'Negative feedback returns to ____ point', 'set', null),
          num('h-fn-q2', 'Baseline arterial blood pH', 7.4, null, 0.05),
          sh('h-fn-q3', 'Kidney functional unit', 'nephron', null),
          mc('h-fn-q4', 'Normal adult resting heart rate range', ['60 to 100 beats per minute', '140 to 180 beats per minute'], 0, null),
          sh('h-fn-q5', 'Blood pressure denominator', 'diastolic', null),
          mc('h-fn-q6', 'CPR sequence priority', ['C-A-B: Compressions, Airway, Breathing', 'A-B-C: Airway, Breathing, Compressions'], 0, null),
          sh('h-fn-q7', 'Hypoperfusion of tissues is', 'shock', null),
          sh('h-fn-q8', 'Intestinal co-transport carrier for ORS: SGLT____', '1', 'Type 1'),
          num('h-fn-q9', 'Adult CPR compression depth in inches at least', 2, null),
          mc('h-fn-q10', 'Highest grade clinical evidence', ['systematic reviews and meta-analyses of RCTs', 'personal anecdotes'], 0, null)
        ], { work: 'OpenStax A&P 2e · WHO · AHA', loc: 'final' }, 50)
      ]
    }
  ]
);

export const WAVE1 = [methods, math, physics, chemistry, biology, civics, health];
