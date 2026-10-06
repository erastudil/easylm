# SPDX-License-Identifier: AGPL-3.0-or-later
"""Facts for Dewey 100 & 200: philosophy, psychology, tao_te_ching, religion."""

from .common import Fact

PHILOSOPHY_FACTS = [
    # Chapter 1 & 2: Nature of Inquiry & Distinctions
    Fact(
        topic="philosophical argument",
        comment="set of declarative propositions where premises are offered to logically support truth of a stated conclusion.",
        dewey="100", slug="philosophy", chapter="chapter 1.1",
        door="https://plato.stanford.edu/entries/argument/", kind="definition"
    ),
    Fact(
        topic="deductive validity",
        comment="structural argument property where it is logically impossible for conclusion to be false if all premises are true.",
        dewey="100", slug="philosophy", chapter="chapter 1.2",
        door="https://plato.stanford.edu/entries/logic-classical/", kind="definition"
    ),
    Fact(
        topic="deductive soundness",
        comment="argument property satisfying both conditions: formal deductive validity and factual truth of all premises.",
        dewey="100", slug="philosophy", chapter="chapter 1.2",
        door="https://plato.stanford.edu/entries/logic-classical/", kind="definition"
    ),
    Fact(
        topic="a priori knowledge",
        comment="epistemic justification completely independent of empirical sensory experience, such as mathematical proofs and tautologies.",
        dewey="100", slug="philosophy", chapter="chapter 2.1",
        door="https://plato.stanford.edu/entries/apriori/", kind="definition"
    ),
    Fact(
        topic="a posteriori knowledge",
        comment="epistemic justification depending entirely on empirical sensory observation and physical evidence.",
        dewey="100", slug="philosophy", chapter="chapter 2.1",
        door="https://plato.stanford.edu/entries/apriori/", kind="definition"
    ),
    Fact(
        topic="analytic synthetic distinction",
        comment="immanuel kant distinction between propositions true by definition alone and propositions asserting synthetic empirical claims.",
        dewey="100", slug="philosophy", chapter="chapter 2.2",
        door="https://plato.stanford.edu/entries/analytic-synthetic/"
    ),

    # Chapter 3 & 4: Formal & Informal Logic
    Fact(
        topic="modus ponens",
        comment="valid deductive inference rule stating that if P implies Q, and P is true, then Q must be true.",
        dewey="100", slug="philosophy", chapter="chapter 3.1",
        door="https://plato.stanford.edu/entries/logic-classical/"
    ),
    Fact(
        topic="modus tollens",
        comment="valid deductive inference rule stating that if P implies Q, and Q is false, then P must be false.",
        dewey="100", slug="philosophy", chapter="chapter 3.1",
        door="https://plato.stanford.edu/entries/logic-classical/"
    ),
    Fact(
        topic="affirming the consequent",
        comment="formal logical fallacy incorrectly inferring truth of premise P from conditional P implies Q and observation Q.",
        dewey="100", slug="philosophy", chapter="chapter 3.2",
        door="https://plato.stanford.edu/entries/fallacies/", kind="definition"
    ),
    Fact(
        topic="ad hominem fallacy",
        comment="informal logical fallacy attacking an advocate personal characteristics rather than engaging substance of their argument.",
        dewey="100", slug="philosophy", chapter="chapter 4.1",
        door="https://plato.stanford.edu/entries/fallacies/", kind="definition"
    ),
    Fact(
        topic="straw man fallacy",
        comment="informal fallacy misrepresenting an opponent position as weaker or more extreme to facilitate refutation.",
        dewey="100", slug="philosophy", chapter="chapter 4.1",
        door="https://plato.stanford.edu/entries/fallacies/", kind="definition"
    ),

    # Chapter 5: Epistemology & Theory of Knowledge
    Fact(
        topic="justified true belief",
        comment="classical tripartite definition analyzing propositional knowledge as belief that is both true and epistemically justified.",
        dewey="100", slug="philosophy", chapter="chapter 5.1",
        door="https://plato.stanford.edu/entries/knowledge-analysis/", kind="definition"
    ),
    Fact(
        topic="gettier problem",
        comment="edmund gettier 1963 demonstration via counterexamples that justified true belief is not sufficient for knowledge.",
        dewey="100", slug="philosophy", chapter="chapter 5.1",
        door="https://plato.stanford.edu/entries/knowledge-analysis/"
    ),
    Fact(
        topic="agrippa trilemma",
        comment="epistemic foundational problem demonstrating all justification terminates in infinite regress, circular reasoning, or dogmatic assertion.",
        dewey="100", slug="philosophy", chapter="chapter 5.2",
        door="https://plato.stanford.edu/entries/skepticism/"
    ),
    Fact(
        topic="cartesian foundationalism",
        comment="rene descartes epistemological method rebuilding knowledge from indubitable foundational cogito ergo sum.",
        dewey="100", slug="philosophy", chapter="chapter 5.3",
        door="https://plato.stanford.edu/entries/descartes-epistemology/"
    ),
    Fact(
        topic="tabula rasa",
        comment="john locke empiricist doctrine asserting human mind begins as blank slate deriving all ideas from sensory experience.",
        dewey="100", slug="philosophy", chapter="chapter 5.3",
        door="https://plato.stanford.edu/entries/locke/", kind="definition"
    ),

    # Chapter 7 & 8: Metaphysics & Philosophy of Mind
    Fact(
        topic="quine ontological criterion",
        comment="willard van orman quine criterion stating that to be is to be the value of a bound variable in a true theory.",
        dewey="100", slug="philosophy", chapter="chapter 7.1",
        door="https://plato.stanford.edu/entries/quine/"
    ),
    Fact(
        topic="ship of theseus",
        comment="metaphysical identity paradox investigating whether an object remains numerically identical when all constituent parts are replaced.",
        dewey="100", slug="philosophy", chapter="chapter 7.2",
        door="https://plato.stanford.edu/entries/identity-time/"
    ),
    Fact(
        topic="cartesian substance dualism",
        comment="metaphysical position positing mind and body are fundamentally distinct substances: thinking res cogitans and extended res extensa.",
        dewey="100", slug="philosophy", chapter="chapter 8.1",
        door="https://plato.stanford.edu/entries/dualism/", kind="definition"
    ),
    Fact(
        topic="hard problem of consciousness",
        comment="david chalmers formulation asking why and how physical neurobiological processes produce subjective phenomenal experience.",
        dewey="100", slug="philosophy", chapter="chapter 8.2",
        door="https://plato.stanford.edu/entries/consciousness/"
    ),
    Fact(
        topic="chinese room argument",
        comment="john searle thought experiment demonstrating syntactic symbol manipulation cannot produce genuine semantic comprehension.",
        dewey="100", slug="philosophy", chapter="chapter 8.3",
        door="https://plato.stanford.edu/entries/chinese-room/"
    ),

    # Chapter 9: Philosophy of Language & Meaning
    Fact(
        topic="sense and reference",
        comment="gottlob frege distinction between linguistic mode of presentation Sinn and objective entity designated Bedeutung.",
        dewey="100", slug="philosophy", chapter="chapter 9.1",
        door="https://plato.stanford.edu/entries/frege/"
    ),
    Fact(
        topic="speech act theory",
        comment="j l austin linguistic framework analyzing utterances as locutionary acts, illocutionary forces, and perlocutionary effects.",
        dewey="100", slug="philosophy", chapter="chapter 9.2",
        door="https://plato.stanford.edu/entries/speech-acts/"
    ),
    Fact(
        topic="language games",
        comment="ludwig wittgenstein concept in philosophical investigations asserting word meaning is determined by rule-governed use within human practices.",
        dewey="100", slug="philosophy", chapter="chapter 9.3",
        door="https://plato.stanford.edu/entries/wittgenstein/", kind="definition"
    ),

    # Chapter 10 & 11: Moral & Political Philosophy
    Fact(
        topic="utilitarianism",
        comment="consequentialist normative ethical theory holding that actions are morally right in proportion as they promote overall happiness.",
        dewey="100", slug="philosophy", chapter="chapter 10.1",
        door="https://plato.stanford.edu/entries/utilitarianism-history/", kind="definition"
    ),
    Fact(
        topic="kant categorical imperative",
        comment="deontological moral law commanding agents to act only according to maxims they can simultaneously will as universal laws.",
        dewey="100", slug="philosophy", chapter="chapter 10.2",
        door="https://plato.stanford.edu/entries/kant-moral/"
    ),
    Fact(
        topic="aristotelian virtue ethics",
        comment="ethical framework locating moral excellence in character traits and practical wisdom phronesis rather than rules or outcomes.",
        dewey="100", slug="philosophy", chapter="chapter 10.3",
        door="https://plato.stanford.edu/entries/ethics-virtue/", kind="definition"
    ),
    Fact(
        topic="is ought problem",
        comment="david hume principle asserting descriptive statements of what is cannot logically entail normative statements of what ought to be.",
        dewey="100", slug="philosophy", chapter="chapter 10.4",
        door="https://plato.stanford.edu/entries/hume-moral/"
    ),
    Fact(
        topic="rawls veil of ignorance",
        comment="john rawls thought experiment deriving principles of justice by choosing societal rules without knowing one social position.",
        dewey="100", slug="philosophy", chapter="chapter 11.1",
        door="https://plato.stanford.edu/entries/rawls/"
    ),
]

PSYCHOLOGY_FACTS = [
    # Chapter 1 & 2: Foundations & Neurobiology
    Fact(
        topic="resting membrane potential",
        comment="baseline electrical voltage of neuron membrane at approximately negative 70 millivolts maintained by sodium potassium pump.",
        dewey="150", slug="psychology", chapter="chapter 2.1",
        door="https://www.ncbi.nlm.nih.gov/books/NBK538339/", kind="definition"
    ),
    Fact(
        topic="action potential threshold",
        comment="critical membrane depolarization level of approximately negative 55 millivolts triggering all or none voltage gated sodium influx.",
        dewey="150", slug="psychology", chapter="chapter 2.1",
        door="https://www.ncbi.nlm.nih.gov/books/NBK538339/", kind="definition"
    ),
    Fact(
        topic="sodium potassium pump",
        comment="membrane transport protein actively expelling three sodium ions for every two potassium ions imported using ATP hydrolysis.",
        dewey="150", slug="psychology", chapter="chapter 2.1",
        door="https://www.ncbi.nlm.nih.gov/books/NBK538339/", kind="definition"
    ),
    Fact(
        topic="synaptic vesicle exocytosis",
        comment="calcium-dependent fusion of neurotransmitter vesicles with presynaptic membrane releasing transmitters into synaptic cleft.",
        dewey="150", slug="psychology", chapter="chapter 2.2",
        door="https://www.ncbi.nlm.nih.gov/books/NBK538339/"
    ),
    Fact(
        topic="cerebral cortex lobes",
        comment="four anatomical mammalian brain lobes: frontal for executive control, parietal for somatosensation, temporal for memory and audition, occipital for vision.",
        dewey="150", slug="psychology", chapter="chapter 2.3",
        door="https://www.ncbi.nlm.nih.gov/books/NBK538339/"
    ),

    # Chapter 3 & 4: Perception & Conditioning
    Fact(
        topic="weber fechner law",
        comment="psychophysical law stating that perceived subjective sensation intensity is proportional to logarithm of objective stimulus intensity.",
        dewey="150", slug="psychology", chapter="chapter 3.1",
        door="https://plato.stanford.edu/entries/perception-problem/"
    ),
    Fact(
        topic="classical conditioning",
        comment="learning process discovered by ivan pavlov pairing neutral conditioned stimulus with biological unconditioned stimulus.",
        dewey="150", slug="psychology", chapter="chapter 4.1",
        door="https://www.apa.org/topics/learning", kind="definition"
    ),
    Fact(
        topic="operant conditioning",
        comment="b f skinner learning paradigm modifying behavior frequency through rewarding reinforcement or punitive consequences.",
        dewey="150", slug="psychology", chapter="chapter 4.2",
        door="https://www.apa.org/topics/learning", kind="definition"
    ),
    Fact(
        topic="variable ratio schedule",
        comment="operant reinforcement schedule delivering reward after unpredictable number of responses yielding highest resistance to extinction.",
        dewey="150", slug="psychology", chapter="chapter 4.3",
        door="https://www.apa.org/topics/learning", kind="definition"
    ),

    # Chapter 5 & 6: Memory, Attention & Executive Function
    Fact(
        topic="working memory capacity",
        comment="george miller finding that human working memory holds approximately 7 plus or minus 2 chunks of information.",
        dewey="150", slug="psychology", chapter="chapter 5.1",
        door="https://www.apa.org/topics/memory"
    ),
    Fact(
        topic="baddeley working memory model",
        comment="multicomponent cognitive architecture comprising central executive, phonological loop, visuospatial sketchpad, and episodic buffer.",
        dewey="150", slug="psychology", chapter="chapter 5.2",
        door="https://www.apa.org/topics/memory", kind="definition"
    ),
    Fact(
        topic="hippocampal memory consolidation",
        comment="biological process where hippocampus coordinates gradual transfer of temporary memories into permanent neocortical storage.",
        dewey="150", slug="psychology", chapter="chapter 5.3",
        door="https://www.ncbi.nlm.nih.gov/books/NBK538339/"
    ),
    Fact(
        topic="ebbinghaus forgetting curve",
        comment="mathematical model showing exponential decay of learned memory retention over time unless reinforced through active spaced retrieval.",
        dewey="150", slug="psychology", chapter="chapter 5.4",
        door="https://www.apa.org/topics/memory"
    ),
    Fact(
        topic="stroop effect",
        comment="demonstration of cognitive interference where reading font color of mismatched color word causes delayed reaction time.",
        dewey="150", slug="psychology", chapter="chapter 6.1",
        door="https://www.apa.org/topics/cognition", kind="definition"
    ),

    # Chapter 7 & 8: Decision Theory & Developmental Trajectories
    Fact(
        topic="dual process theory",
        comment="kahneman framework dividing cognition into system 1 fast intuitive heuristic and system 2 slow analytical deliberative.",
        dewey="150", slug="psychology", chapter="chapter 7.1",
        door="https://www.apa.org/topics/decision-making", kind="definition"
    ),
    Fact(
        topic="prospect theory loss aversion",
        comment="behavioral economics finding that psychological pain of monetary loss is roughly twice as intense as pleasure of equivalent gain.",
        dewey="150", slug="psychology", chapter="chapter 7.2",
        door="https://www.apa.org/topics/decision-making"
    ),
    Fact(
        topic="availability heuristic",
        comment="cognitive shortcut evaluating event probability by ease with which relevant instances come immediately to mind.",
        dewey="150", slug="psychology", chapter="chapter 7.3",
        door="https://www.apa.org/topics/decision-making", kind="definition"
    ),
    Fact(
        topic="piaget developmental stages",
        comment="four cognitive development stages: sensorimotor 0-2, preoperational 2-7, concrete operational 7-11, formal operational 11 onwards.",
        dewey="150", slug="psychology", chapter="chapter 8.1",
        door="https://www.apa.org/topics/developmental-psychology"
    ),
    Fact(
        topic="zone of proximal development",
        comment="lev vygotsky developmental space between what learner can accomplish independently and what they achieve with expert guidance.",
        dewey="150", slug="psychology", chapter="chapter 8.2",
        door="https://www.apa.org/topics/developmental-psychology", kind="definition"
    ),

    # Chapter 9 & 10: Personality & Clinical Science
    Fact(
        topic="big five personality traits",
        comment="empirically validated psychometric taxonomy measuring openness, conscientiousness, extraversion, agreeableness, and neuroticism.",
        dewey="150", slug="psychology", chapter="chapter 9.1",
        door="https://www.apa.org/topics/personality", kind="definition"
    ),
    Fact(
        topic="cognitive behavioral therapy",
        comment="evidence based psychotherapy modifying maladaptive thoughts, cognitive distortions, and behaviors to alleviate psychiatric distress.",
        dewey="150", slug="psychology", chapter="chapter 10.1",
        door="https://www.apa.org/topics/psychotherapy", kind="definition"
    ),
]

TAO_TE_CHING_FACTS = [
    # Foundational Principles & Metadata
    Fact(
        topic="tao te ching structure",
        comment="classical chinese philosophical text comprising 81 chapters divided into book I the dao and book II the de.",
        dewey="181", slug="tao_te_ching", chapter="chapter 0.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="laozi authorship",
        comment="traditional author of the tao te ching associated with spring and autumn and warring states classical period.",
        dewey="181", slug="tao_te_ching", chapter="chapter 0.1",
        door="https://plato.stanford.edu/entries/laozi/"
    ),
    Fact(
        topic="dao ineffability",
        comment="chapter 1 core axiom stating the dao that can be described or named in words is not the eternal absolute dao.",
        dewey="181", slug="tao_te_ching", chapter="chapter 1.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="wu wei",
        comment="classical daoist principle of non-coercive non-contriving action moving in effortless alignment with natural systemic gradients.",
        dewey="181", slug="tao_te_ching", chapter="chapter 0.2",
        door="https://plato.stanford.edu/entries/daoism/", kind="definition"
    ),
    Fact(
        topic="pu uncarved block",
        comment="symbol of original unconditioned simplicity and maximal entropy possessing unbounded potential before artificial specialization.",
        dewey="181", slug="tao_te_ching", chapter="chapter 0.3",
        door="https://plato.stanford.edu/entries/daoism/", kind="definition"
    ),
    Fact(
        topic="ziran",
        comment="philosophical concept of primordial spontaneity and self-so naturalness existing without imposed external artifice.",
        dewey="181", slug="tao_te_ching", chapter="chapter 0.4",
        door="https://plato.stanford.edu/entries/daoism/", kind="definition"
    ),
    Fact(
        topic="yin yang polarity",
        comment="cosmological principle that opposing complementary forces mutually generate, sustain, and define each other in dynamic equilibrium.",
        dewey="181", slug="tao_te_ching", chapter="chapter 2.1",
        door="https://plato.stanford.edu/entries/daoism/", kind="definition"
    ),
    Fact(
        topic="mutual arising of opposites",
        comment="chapter 2 principle stating beauty and ugliness, difficult and easy, long and short, high and low define each other through contrast.",
        dewey="181", slug="tao_te_ching", chapter="chapter 2.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="dao as empty vessel",
        comment="chapter 4 metaphor modeling dao as bottomless reservoir that is used without ever being exhausted or filled.",
        dewey="181", slug="tao_te_ching", chapter="chapter 4.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="straw dogs metaphor",
        comment="chapter 5 statement that heaven and earth are impartial treating ten thousand things like ceremonial straw dogs without favoritism.",
        dewey="181", slug="tao_te_ching", chapter="chapter 5.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="water metaphor highest virtue",
        comment="shang shan ruo shui principle holding that highest excellence resembles water benefiting all things without contention and seeking low ground.",
        dewey="181", slug="tao_te_ching", chapter="chapter 8.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="mechanics of emptiness",
        comment="chapter 11 axiom demonstrating utility of wheel spokes, clay vessels, and rooms resides entirely in their hollow empty void.",
        dewey="181", slug="tao_te_ching", chapter="chapter 11.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="stillness and return to root",
        comment="chapter 16 doctrine stating attaining utmost emptiness and maintaining stillness allows ten thousand things to flourish and return to their root.",
        dewey="181", slug="tao_te_ching", chapter="chapter 16.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="shadow leadership",
        comment="chapter 17 political axiom stating of highest rulers people barely know they exist, and when their task is done people say we did it ourselves.",
        dewey="181", slug="tao_te_ching", chapter="chapter 17.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="yielding to remain whole",
        comment="chapter 22 paradox holding that what bends stays unbroken, what is bent becomes straight, and what is empty becomes full.",
        dewey="181", slug="tao_te_ching", chapter="chapter 22.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="four great powers",
        comment="chapter 25 cosmological hierarchy stating humans follow earth, earth follows heaven, heaven follows dao, and dao follows ziran.",
        dewey="181", slug="tao_te_ching", chapter="chapter 25.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="self knowledge true wisdom",
        comment="chapter 33 distinction stating knowing others is ordinary intelligence, but knowing oneself is enlightened wisdom.",
        dewey="181", slug="tao_te_ching", chapter="chapter 33.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="loss of dao hierarchy",
        comment="chapter 38 moral erosion stating when dao is lost virtue arises, when virtue is lost benevolence arises, when benevolence is lost righteousness arises, when righteousness is lost ritual arises.",
        dewey="181", slug="tao_te_ching", chapter="chapter 38.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="movement of dao is return",
        comment="chapter 40 mechanical law stating returning is movement of dao and yielding is function of dao; ten thousand things are born from being, and being from non-being.",
        dewey="181", slug="tao_te_ching", chapter="chapter 40.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="cosmological generation sequence",
        comment="chapter 42 genesis stating dao generates one, one generates two, two generates three, and three generates ten thousand things.",
        dewey="181", slug="tao_te_ching", chapter="chapter 42.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="subduing hardness with softness",
        comment="paradoxical law stating softest substances in the world overcome hardest materials just as water erodes solid granite.",
        dewey="181", slug="tao_te_ching", chapter="chapter 43.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="daily decrease in dao",
        comment="chapter 48 epistemic contrast stating pursuit of academic learning gains daily while pursuit of dao decreases daily until non-action is reached.",
        dewey="181", slug="tao_te_ching", chapter="chapter 48.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="silence of the knower",
        comment="chapter 56 aphorism stating those who truly know do not speak, and those who speak incessantly do not know.",
        dewey="181", slug="tao_te_ching", chapter="chapter 56.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="governance via non contention",
        comment="ruling principle advising that governing a large nation requires gentle restraint like cooking a delicate small fish without over-turning.",
        dewey="181", slug="tao_te_ching", chapter="chapter 60.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="three treasures of laozi",
        comment="chapter 67 ethical virtues: compassion ci, frugality jian, and refusal to claim supremacy before the world bugan wei tianxia xian.",
        dewey="181", slug="tao_te_ching", chapter="chapter 67.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="bow string oscillation metaphor",
        comment="chapter 77 physical model stating the way of heaven resembles drawing a bow pulling down what is high and raising what is low.",
        dewey="181", slug="tao_te_ching", chapter="chapter 77.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="suppleness of life",
        comment="chapter 76 biological principle stating human body while alive is soft and supple, but in death becomes stiff and rigid; stiffness is disciple of death.",
        dewey="181", slug="tao_te_ching", chapter="chapter 76.1",
        door="https://ctext.org/dao-de-jing"
    ),
    Fact(
        topic="sage leadership posture",
        comment="leadership axiom holding that effective sage places self behind others yet finds self ahead and acts without claiming credit.",
        dewey="181", slug="tao_te_ching", chapter="chapter 7.1",
        door="https://ctext.org/dao-de-jing"
    ),
]

RELIGION_FACTS = [
    # Chapter 1 & 2: Dimensions & Comparative Methodology
    Fact(
        topic="seven dimensions of religion",
        comment="ninian smart comparative taxonomy: doctrinal, mythological, ethical, ritual, experiential, institutional, material.",
        dewey="200", slug="religion", chapter="chapter 1.1",
        door="https://plato.stanford.edu/entries/philosophy-religion/", kind="definition"
    ),
    Fact(
        topic="hierophany",
        comment="mircea eliade concept denoting manifestation of sacred reality breaking through profane physical space and time.",
        dewey="200", slug="religion", chapter="chapter 1.2",
        door="https://plato.stanford.edu/entries/philosophy-religion/", kind="definition"
    ),
    Fact(
        topic="axis mundi",
        comment="symbolic universal central cosmic pillar or world axis connecting earthly realm to underworld and celestial heavens.",
        dewey="200", slug="religion", chapter="chapter 1.2",
        door="https://plato.stanford.edu/entries/philosophy-religion/", kind="definition"
    ),

    # Chapter 3 & 4: Dharmic Traditions: Hinduism & Buddhism
    Fact(
        topic="vedic literature corpus",
        comment="ancient sanskrit religious scriptures comprising four samhitas rig, yajur, sama, atharva plus brahmanas, aranyakas, and upanishads.",
        dewey="200", slug="religion", chapter="chapter 3.1",
        door="https://sacred-texts.com/hin/index.htm"
    ),
    Fact(
        topic="brahman and atman identity",
        comment="vedantic core realization expressed in upanishads that individual eternal soul atman is identical with ultimate cosmic reality brahman.",
        dewey="200", slug="religion", chapter="chapter 3.2",
        door="https://plato.stanford.edu/entries/hindu-philosophy/"
    ),
    Fact(
        topic="four noble truths",
        comment="buddhist core doctrine: existence is suffering dukkha, suffering arises from craving tanha, cessation is nirvana, path is eightfold path.",
        dewey="200", slug="religion", chapter="chapter 4.1",
        door="https://www.accesstoinsight.org/ptf/dhamma/sacca/"
    ),
    Fact(
        topic="noble eightfold path",
        comment="buddhist spiritual discipline: right view, intention, speech, action, livelihood, effort, mindfulness, concentration.",
        dewey="200", slug="religion", chapter="chapter 4.2",
        door="https://www.accesstoinsight.org/ptf/dhamma/sacca/"
    ),
    Fact(
        topic="anatta doctrine",
        comment="buddhist insight holding that all conditioned phenomena are devoid of permanent enduring substantial self.",
        dewey="200", slug="religion", chapter="chapter 4.3",
        door="https://www.accesstoinsight.org/ptf/anatta.html", kind="definition"
    ),
    Fact(
        topic="pratityasamutpada",
        comment="principle of dependent origination asserting that all phenomena arise strictly dependent upon preexisting causes and conditions.",
        dewey="200", slug="religion", chapter="chapter 4.4",
        door="https://plato.stanford.edu/entries/buddha/", kind="definition"
    ),

    # Chapter 5 & 6: Abrahamic Traditions: Judaism, Christianity, Islam
    Fact(
        topic="abrahamic covenant",
        comment="theological bond establishing reciprocal covenant between monotheistic deity and people, foundational to judaism, christianity, and islam.",
        dewey="200", slug="religion", chapter="chapter 5.1",
        door="https://sacred-texts.com/bib/index.htm", kind="definition"
    ),
    Fact(
        topic="torah corpus",
        comment="primary scripture of judaism consisting of five books of moses: genesis, exodus, leviticus, numbers, and deuteronomy.",
        dewey="200", slug="religion", chapter="chapter 5.2",
        door="https://sacred-texts.com/jud/index.htm", kind="definition"
    ),
    Fact(
        topic="nicene creed",
        comment="christian ecumenical statement adopted in 325 CE defining doctrine of the trinity and consubstantial nature of jesus christ.",
        dewey="200", slug="religion", chapter="chapter 6.1",
        door="https://sacred-texts.com/chr/index.htm"
    ),
    Fact(
        topic="five pillars of islam",
        comment="obligatory islamic practices: shahada creed, salat ritual prayer, zakat almsgiving, sawm ramadan fasting, hajj mecca pilgrimage.",
        dewey="200", slug="religion", chapter="chapter 7.1",
        door="https://sacred-texts.com/isl/index.htm"
    ),
    Fact(
        topic="tawhid monotheism",
        comment="central islamic theological concept asserting indivisible, absolute, transcendent oneness of god.",
        dewey="200", slug="religion", chapter="chapter 7.2",
        door="https://sacred-texts.com/isl/index.htm", kind="definition"
    ),

    # Chapter 8 & 9: Mythological Structures & Heroic Architecture
    Fact(
        topic="monomyth hero journey",
        comment="joseph campbell mythological architecture tracing universal tripartite narrative arc: separation departure, initiation trials, return with boon.",
        dewey="200", slug="religion", chapter="chapter 8.1",
        door="https://plato.stanford.edu/entries/myth/", kind="definition"
    ),
    Fact(
        topic="psychological archetypes",
        comment="carl jung concept of inherited instinctual patterns and symbols structuring collective unconscious across world mythologies.",
        dewey="200", slug="religion", chapter="chapter 8.2",
        door="https://plato.stanford.edu/entries/myth/", kind="definition"
    ),
]
