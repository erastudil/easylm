# -*- coding: utf-8 -*-
import os

base_dir = r"C:\Users\jpm05\Documents\hnai\easylm\stacks"

content = {
    "philosophy": """
## Advanced Logic and Ethics

- **Syllogistic reasoning**: Deductive inference where a conclusion follows necessarily from two premises that share exactly one middle term.
- **Categorical propositions**: Statements affirming or denying relationships between classes, quantified as universal or particular.
- **Barbara syllogism**: A valid argument form consisting of three universal affirmative statements (All M are P; All S are M; Therefore, all S are P).
- **Truth tables**: Matrices that exhaustively map truth-value assignments for propositional variables to determine compound statement validity.
- **Modus ponens**: A valid propositional rule affirming the consequent by affirming the antecedent (If P then Q; P; Therefore Q).
- **Modus tollens**: A valid propositional rule denying the antecedent by denying the consequent (If P then Q; Not Q; Therefore Not P).
- **Modal logic S5**: An axiomatic system where possible necessity implies actual necessity, establishing equivalence across all accessible worlds.
- **Necessity operator**: A modal logical operator indicating a proposition is true in every accessible possible world.
- **Possibility operator**: A modal logical operator indicating a proposition is true in at least one accessible possible world.
- **Epistemology of testimony**: The study of under what conditions beliefs acquired from the statements of others are justified.
- **Reductionism in testimony**: The view that testimony is justified only if corroborated by independent inductive evidence.
- **Anti-reductionism**: The view that testimony grants prima facie justification without requiring independent inductive verification.
- **Ethics of autonomy**: The moral principle prioritizing an individual's rational capacity for self-governance and uncoerced choice.
- **Categorical imperative**: Kant's unconditional moral law demanding actions be universalizable without logical contradiction.
- **Informed consent**: The practical application of autonomy requiring transparent disclosure before individuals assume risks.
""",
    "psychology": """
## Cognitive Processing and Neurobiology

- **Dual-process theory**: A framework dividing cognition into two systems, one fast and intuitive, the other slow and analytical.
- **System 1 cognition**: Automatic, effortless, and rapid pattern recognition operating below conscious deliberation.
- **System 2 cognition**: Resource-intensive, sequential, and logical processing requiring deliberate focus and working memory.
- **Anchoring heuristic**: A cognitive bias where initial exposure to arbitrary numbers disproportionately skews subsequent quantitative estimates.
- **Availability heuristic**: A cognitive shortcut substituting the ease of recalling examples for actual statistical probability.
- **Representativeness heuristic**: A judgment strategy estimating probability based on similarity to a mental prototype while ignoring base rates.
- **Working memory constraints**: The cognitive bottleneck limiting active information retention to a handful of items for a brief duration.
- **Cognitive load**: The total mental effort imposed on working memory by task complexity, environmental noise, and learning schema.
- **Chunking strategy**: Compressing multiple discrete information units into single meaningful concepts to bypass working memory limits.
- **Neuroplasticity**: The physical capacity of neural networks to rewire their structural connections in response to learning and experience.
- **Synaptic pruning**: The biological mechanism eliminating weak or unused neural connections to optimize network efficiency.
- **Long-term potentiation**: The persistent strengthening of synapses following high-frequency stimulation, forming the physical basis of memory.
- **Myelination**: The biological process of insulating axons with lipid layers to accelerate signal transmission speeds.
- **Habituation**: A decrease in neurological and behavioral response after repeated exposure to a non-threatening stimulus.
- **Executive function**: Higher-order cognitive control processes including inhibition, planning, and task-switching regulated by the prefrontal cortex.
""",
    "civics": """
## Constitutional Mechanics and Federalism

- **Checks and balances**: A structural mechanism allowing distinct government branches to veto or delay actions of other branches.
- **Separation of powers**: The division of legislative, executive, and judicial authority into independent institutions to prevent consolidated control.
- **Federalism mechanics**: The division of sovereign authority between a central national government and constituent regional states.
- **Enumerated powers**: Specific authorities explicitly granted to the national government by a constitutional text.
- **Implied powers**: Unwritten national authorities logically necessary to execute explicitly granted constitutional powers.
- **Concurrent powers**: Governing authorities held simultaneously and independently by both national and state governments.
- **Legislative committee procedure**: The institutional workflow where specialized subgroups draft, amend, and filter legislation before full assembly votes.
- **Markup session**: The specific procedural phase where legislative committees debate and rewrite the text of a proposed bill.
- **Filibuster mechanic**: A legislative delaying tactic in a Senate requiring a supermajority vote to end debate and force a final decision.
- **Electoral systems**: The mathematical rules and structures determining how citizen votes translate into allocated representative seats.
- **First-past-the-post**: A plurality voting system where the single candidate with the most votes wins, regardless of majority status.
- **Proportional representation**: An electoral system allocating legislature seats corresponding precisely to the total vote percentages secured by each party.
- **Ranked-choice voting**: An electoral system allowing voters to order candidate preferences, redistributing votes from eliminated candidates.
- **Gerrymandering**: The deliberate manipulation of electoral district boundaries to manufacture an artificial structural advantage for a specific faction.
- **Judicial review**: The institutional authority of courts to invalidate legislative acts or executive actions that violate constitutional law.
""",
    "law": """
## Legal Doctrine and Liability

- **Stare decisis**: The legal doctrine compelling courts to follow established historical precedents when deciding subsequent similar cases.
- **Binding precedent**: Prior judicial decisions from higher courts that lower courts are strictly required to apply.
- **Persuasive precedent**: Prior decisions from parallel or lower courts that inform but do not mandate a specific ruling.
- **Tort liability**: Civil legal responsibility for causing harm or injury to another party through unreasonable action or omission.
- **Negligence standard**: Liability arising when a party breaches a duty of reasonable care, proximately causing foreseeable harm.
- **Strict liability**: Absolute legal responsibility for damages regardless of fault, care, or intent, typically applied to inherently hazardous activities.
- **Proximate cause**: The legal boundary limiting liability to those harms that are reasonably foreseeable consequences of an action.
- **Contract formation**: The creation of binding legal agreements requiring offer, acceptance, and consideration.
- **Mutual assent**: The objective manifestation of an agreement between parties on the material terms of a contract.
- **Consideration**: The bargained-for exchange of legal value, benefit, or detriment establishing an enforceable contract.
- **Breach of contract**: The failure of a party, without legal excuse, to perform any promise forming the whole or part of a contract.
- **Procedural due process**: The constitutional requirement that government must follow fair procedures before depriving a person of life, liberty, or property.
- **Notice requirement**: The due process obligation to inform individuals of impending legal action against them.
- **Opportunity to be heard**: The due process right to present evidence and challenge accusations before a neutral adjudicator.
- **Standard of proof**: The specific threshold of evidence required to validate a claim, varying from preponderance of evidence to beyond a reasonable doubt.
""",
    "finance": """
## Valuation and Capital Markets

- **Discounted cash flow**: A valuation method estimating investment value by forecasting future cash flows and discounting them to present value.
- **Time value of money**: The financial axiom that a unit of currency available today is worth more than the identical unit in the future.
- **Discount rate**: The interest rate used in discounted cash flow analysis to convert future cash returns into current value.
- **Bond yield curves**: Graphical plots illustrating the relationship between interest rates and the time to maturity for identical debt securities.
- **Normal yield curve**: An upward-sloping curve indicating longer-term debt carries higher interest rates to compensate for duration risk.
- **Inverted yield curve**: A downward-sloping curve where short-term rates exceed long-term rates, historically preceding economic recessions.
- **Capital asset pricing model**: A mathematical framework calculating expected investment returns based on the risk-free rate and asset systematic risk.
- **Systematic risk**: Unavoidable market-wide volatility that cannot be eliminated through portfolio diversification.
- **Idiosyncratic risk**: Asset-specific volatility that can be neutralized by holding a diverse portfolio of uncorrelated investments.
- **Beta coefficient**: A quantitative measure representing the volatility of an individual asset relative to the broader market index.
- **Black-Scholes intuition**: An options pricing model assuming price movements follow a geometric Brownian motion with continuous hedging.
- **Call option**: A financial contract granting the right, without obligation, to purchase an asset at a predetermined strike price.
- **Put option**: A financial contract granting the right, without obligation, to sell an asset at a predetermined strike price.
- **Implied volatility**: The market's expectation of future price fluctuations, reverse-engineered from current option premiums.
- **Arbitrage**: The simultaneous purchase and sale of identical assets in different markets to capture risk-free price differentials.
""",
    "history": """
## Historical Causality and Mechanics

- **Historical causality**: The analytical study identifying structural, immediate, and systemic forces driving chronological events.
- **Longue duree**: The historical approach focusing on slow-moving geographic, climatic, and demographic structures over centuries.
- **Contingency**: The historical principle that specific events were not inevitable and depended on precise, unpredictable interacting variables.
- **Primary sources**: Unfiltered original documents, artifacts, or recordings created during the specific historical period under study.
- **Secondary sources**: Interpretive analyses and synthetic accounts constructed by later historians using primary materials.
- **Historiography**: The study of how historical interpretations, methodologies, and dominant narratives evolve over time.
- **Teleology in history**: The flawed narrative assumption that historical events march inevitably toward a specific, predetermined outcome.
- **Structural factors**: Deep economic, geographic, or institutional foundations that constrain or enable historical action.
- **Proximate triggers**: Immediate catalysts or specific human actions that directly ignite an underlying structural tension into an event.
- **Demographic shifts**: Large-scale changes in population birth rates, migration patterns, and mortality that drive economic and political transformations.
- **Technological determinism**: The theory that changes in technology are the primary independent variable shaping social structures and cultural values.
- **Great man theory**: An outdated historiographical framework attributing historical momentum primarily to the actions of exceptional individuals.
- **Materialism**: The historical methodology arguing that economic conditions and resource control form the base driving all political and cultural phenomena.
- **Cultural hegemony**: The mechanism by which a dominant class maintains control not through force, but by establishing its worldview as common sense.
- **Historical revisionism**: The critical re-examination of accepted historical narratives based on newly discovered evidence or alternative analytical frameworks.
""",
    "language": """
## Syntax and Phonology

- **Generative grammar**: A linguistic framework modeling the unconscious mental rules that enable speakers to produce infinite valid sentences.
- **Syntax trees**: Hierarchical branching diagrams visually representing the underlying phrase structure of a sentence.
- **Constituency**: The syntactic principle where groups of words function together as a single structural unit within a sentence.
- **Noun phrase**: A syntactic constituent headed by a noun or pronoun that can function as a subject or object.
- **Verb phrase**: A syntactic constituent headed by a verb that functions as the predicate of a clause.
- **Recursion**: The linguistic property allowing constituents to be embedded infinitely within constituents of the same type.
- **Phonology**: The systematic study of how individual speech sounds function and pattern within a specific language's mental grammar.
- **Phoneme**: The smallest abstract unit of sound that can distinguish semantic meaning between words in a given language.
- **Allophone**: A predictable phonetic variant of a phoneme that does not change the meaning of a word.
- **Minimal pairs**: Pairs of words differing by exactly one phonological element, proving those elements are distinct phonemes.
- **Articulatory phonetics**: The study of how vocal tracts physically produce individual speech sounds via airflow manipulation.
- **Place of articulation**: The specific physical location in the vocal tract where airflow is obstructed to create a consonant sound.
- **Manner of articulation**: The specific method and degree of airflow obstruction used to generate speech sounds.
- **Syllable structure**: The hierarchical phonological organization grouping sounds into onsets, nuclei, and codas.
- **Morphology**: The linguistic study of the internal structure and formation rules of words from smaller units of meaning.
"""
}

for subject, text in content.items():
    file_path = os.path.join(base_dir, subject, "TEXTBOOK.md")
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "a", encoding="utf-8") as f:
        f.write("\n" + text.strip() + "\n")
    print(f"Updated {file_path}")

print("Python script completed.")
