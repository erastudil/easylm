# SPDX-License-Identifier: AGPL-3.0-or-later
"""Facts for Dewey 300: sociology, civics, finance, law."""

from .common import Fact

SOCIOLOGY_FACTS = [
    # Chapter 1 & 2: Social Facts & Classical Foundations
    Fact(
        topic="social facts",
        comment="emile durkheim concept defining manners of acting, thinking, and feeling external to individual and endowed with coercive power.",
        dewey="300", slug="sociology", chapter="chapter 1.1",
        door="https://plato.stanford.edu/entries/durkheim/", kind="definition"
    ),
    Fact(
        topic="mechanical solidarity",
        comment="social cohesion in traditional societies based on shared consensus, collective conscience, and low division of labor.",
        dewey="300", slug="sociology", chapter="chapter 1.2",
        door="https://plato.stanford.edu/entries/durkheim/", kind="definition"
    ),
    Fact(
        topic="organic solidarity",
        comment="social cohesion in modern industrial societies based on functional interdependence arising from specialized division of labor.",
        dewey="300", slug="sociology", chapter="chapter 1.2",
        door="https://plato.stanford.edu/entries/durkheim/", kind="definition"
    ),
    Fact(
        topic="anomie",
        comment="state of social deregulation and normlessness occurring when rapid societal change outpaces normative moral constraints.",
        dewey="300", slug="sociology", chapter="chapter 1.3",
        door="https://plato.stanford.edu/entries/durkheim/", kind="definition"
    ),

    # Chapter 3 & 4: Weber, Marx & Critical Traditions
    Fact(
        topic="weberian rationalization",
        comment="max weber concept describing historical transition from magical and traditional worldviews toward calculable bureaucratic efficiency.",
        dewey="300", slug="sociology", chapter="chapter 2.1",
        door="https://plato.stanford.edu/entries/weber/", kind="definition"
    ),
    Fact(
        topic="iron cage of bureaucracy",
        comment="weber metaphor describing trapping of individuals in teleological systems based purely on instrumental rationality and bureaucratic control.",
        dewey="300", slug="sociology", chapter="chapter 2.2",
        door="https://plato.stanford.edu/entries/weber/"
    ),
    Fact(
        topic="weber three types of authority",
        comment="sociological classification of legitimate rule: traditional rooted in custom, charismatic in heroic devotion, rational-legal in enacted rules.",
        dewey="300", slug="sociology", chapter="chapter 2.3",
        door="https://plato.stanford.edu/entries/weber/"
    ),
    Fact(
        topic="historical materialism",
        comment="karl marx methodological framework asserting material relations of production form economic base determining legal and cultural superstructure.",
        dewey="300", slug="sociology", chapter="chapter 3.1",
        door="https://plato.stanford.edu/entries/marx/", kind="definition"
    ),
    Fact(
        topic="marxian alienation",
        comment="condition in capitalist production where worker loses autonomy over labor process, product, fellow workers, and human species essence.",
        dewey="300", slug="sociology", chapter="chapter 3.2",
        door="https://plato.stanford.edu/entries/marx/", kind="definition"
    ),

    # Chapter 5 & 6: Culture, Habitus & Interactionism
    Fact(
        topic="cultural capital",
        comment="pierre bourdieu concept encompassing non-financial institutional assets like linguistic competence, credentials, and aesthetic tastes.",
        dewey="300", slug="sociology", chapter="chapter 4.1",
        door="https://plato.stanford.edu/entries/bourdieu/", kind="definition"
    ),
    Fact(
        topic="bourdieu habitus",
        comment="system of internalized embodied dispositions, schemes of perception, and habits structuring practices without conscious coordination.",
        dewey="300", slug="sociology", chapter="chapter 4.2",
        door="https://plato.stanford.edu/entries/bourdieu/", kind="definition"
    ),
    Fact(
        topic="dramaturgical analysis",
        comment="erving goffman sociological perspective modeling human interaction as theatrical performance divided between front stage and back stage.",
        dewey="300", slug="sociology", chapter="chapter 5.1",
        door="https://plato.stanford.edu/entries/goffman/", kind="definition"
    ),
    Fact(
        topic="looking glass self",
        comment="charles horton cooley psychological concept positing self-concept emerges from imagining how one appears to others and their judgments.",
        dewey="300", slug="sociology", chapter="chapter 5.2",
        door="https://plato.stanford.edu/entries/interactionism/", kind="definition"
    ),
    Fact(
        topic="intersectionality",
        comment="analytical framework examining how interconnected social identities such as race, class, and gender compound systemic advantage and disadvantage.",
        dewey="300", slug="sociology", chapter="chapter 6.1",
        door="https://plato.stanford.edu/entries/feminist-philosophy/", kind="definition"
    ),
]

CIVICS_FACTS = [
    # Chapter 1 & 2: Sovereignty & Constitutional Design
    Fact(
        topic="separation of powers",
        comment="constitutional doctrine dividing governmental authority into distinct legislative, executive, and judicial branches to prevent tyranny.",
        dewey="320", slug="civics", chapter="chapter 1.1",
        door="https://www.archives.gov/founding-docs/constitution", kind="definition"
    ),
    Fact(
        topic="checks and balances",
        comment="constitutional mechanisms allowing each branch of government to restrain, review, and veto unilateral actions of peer branches.",
        dewey="320", slug="civics", chapter="chapter 1.1",
        door="https://www.archives.gov/founding-docs/constitution", kind="definition"
    ),
    Fact(
        topic="social contract theory",
        comment="political philosophy asserting legitimate political authority derives from consent of governed surrendering certain liberties in exchange for security.",
        dewey="320", slug="civics", chapter="chapter 1.2",
        door="https://plato.stanford.edu/entries/social-contract/", kind="definition"
    ),
    Fact(
        topic="marbury v madison",
        comment="landmark 1803 supreme court decision authored by john marshall establishing power of judicial review to invalidate unconstitutional statutes.",
        dewey="320", slug="civics", chapter="chapter 2.1",
        door="https://www.oyez.org/cases/1789-1850/5us137"
    ),

    # Chapter 3 & 4: Legislative, Executive & Judicial Frameworks
    Fact(
        topic="bicameral legislature",
        comment="two-chamber legislative assembly dividing lawmaking between proportional lower house and equal-representation upper chamber.",
        dewey="320", slug="civics", chapter="chapter 3.1",
        door="https://www.senate.gov/", kind="definition"
    ),
    Fact(
        topic="electoral college",
        comment="us presidential selection mechanism allocating electors to states proportional to congressional representation.",
        dewey="320", slug="civics", chapter="chapter 3.2",
        door="https://www.archives.gov/electoral-college"
    ),
    Fact(
        topic="federalism",
        comment="dual-tier system of governance distributing sovereign powers constitutionally between national federal government and regional states.",
        dewey="320", slug="civics", chapter="chapter 4.1",
        door="https://www.archives.gov/founding-docs/constitution", kind="definition"
    ),
    Fact(
        topic="tenth amendment",
        comment="constitutional provision reserving all powers not delegated to the federal government to the individual states or people.",
        dewey="320", slug="civics", chapter="chapter 4.2",
        door="https://www.archives.gov/founding-docs/bill-of-rights"
    ),

    # Chapter 5 & 6: Rights, Suffrage & Voting Systems
    Fact(
        topic="first amendment freedoms",
        comment="protects freedom of speech, press, religion establishment, free exercise of religion, peaceful assembly, and petitioning government.",
        dewey="320", slug="civics", chapter="chapter 5.1",
        door="https://www.archives.gov/founding-docs/bill-of-rights"
    ),
    Fact(
        topic="fourteenth amendment due process",
        comment="guarantees no state shall deprive any person of life, liberty, or property without due process of law nor deny equal protection.",
        dewey="320", slug="civics", chapter="chapter 5.2",
        door="https://www.archives.gov/founding-docs/constitution"
    ),
    Fact(
        topic="gerrymandering",
        comment="manipulation of electoral district boundaries to establish partisan political advantage for a specific party or incumbent.",
        dewey="320", slug="civics", chapter="chapter 6.1",
        door="https://www.census.gov/", kind="definition"
    ),
    Fact(
        topic="arrow impossibility theorem",
        comment="kenneth arrow mathematical proof demonstrating no ranked voting system can convert individual preferences into collective preference while satisfying minimal fairness criteria.",
        dewey="320", slug="civics", chapter="chapter 6.2",
        door="https://plato.stanford.edu/entries/arrows-theorem/"
    ),
    Fact(
        topic="duverger law",
        comment="political science principle holding that single-member district plurality voting systems structurally favor a two-party system.",
        dewey="320", slug="civics", chapter="chapter 6.3",
        door="https://plato.stanford.edu/entries/electoral-systems/"
    ),
]

FINANCE_FACTS = [
    # Chapter 1 & 2: Accounting Engine & Primary Statements
    Fact(
        topic="double entry bookkeeping",
        comment="accounting methodology codified by luca pacioli in 1494 requiring every financial transaction to record equal debit and credit entries.",
        dewey="330", slug="finance", chapter="chapter 1.1",
        door="https://www.sec.gov/", kind="definition"
    ),
    Fact(
        topic="fundamental accounting equation",
        comment="identity stating that total company assets must identically equal total liabilities plus shareholders equity.",
        dewey="330", slug="finance", chapter="chapter 1.2",
        door="https://www.fasb.org/"
    ),
    Fact(
        topic="balance sheet",
        comment="financial statement reporting an entity assets, liabilities, and equity at a precise single point in time.",
        dewey="330", slug="finance", chapter="chapter 2.1",
        door="https://www.sec.gov/", kind="definition"
    ),
    Fact(
        topic="income statement",
        comment="financial statement detailing company revenues, expenses, and resulting net income over a specified accounting period.",
        dewey="330", slug="finance", chapter="chapter 2.2",
        door="https://www.sec.gov/", kind="definition"
    ),
    Fact(
        topic="cash flow statement",
        comment="financial statement tracking cash inflows and outflows partitioned into operating, investing, and financing activities.",
        dewey="330", slug="finance", chapter="chapter 2.3",
        door="https://www.sec.gov/", kind="definition"
    ),
    Fact(
        topic="working capital",
        comment="liquidity metric calculated as current assets minus current liabilities measuring operational short-term buffer.",
        dewey="330", slug="finance", chapter="chapter 3.1",
        door="https://www.fasb.org/", kind="definition"
    ),

    # Chapter 4 & 5: Time Value of Money & Valuation
    Fact(
        topic="time value of money",
        comment="financial principle that money available at present is worth more than identical sum in future due to potential earning capacity.",
        dewey="330", slug="finance", chapter="chapter 4.1",
        door="https://ocw.mit.edu/courses/sloan-school-of-management/", kind="definition"
    ),
    Fact(
        topic="present value formula",
        comment="present value PV equals future value FV divided by one plus discount rate r raised to period power n.",
        dewey="330", slug="finance", chapter="chapter 4.2",
        door="https://ocw.mit.edu/courses/sloan-school-of-management/"
    ),
    Fact(
        topic="net present value",
        comment="sum of discounted future cash inflows minus initial capital outlay evaluating investment profitability.",
        dewey="330", slug="finance", chapter="chapter 5.1",
        door="https://ocw.mit.edu/courses/sloan-school-of-management/", kind="definition"
    ),
    Fact(
        topic="internal rate of return",
        comment="discount rate that equates net present value of all cash flows from an investment project exactly to zero.",
        dewey="330", slug="finance", chapter="chapter 5.2",
        door="https://ocw.mit.edu/courses/sloan-school-of-management/", kind="definition"
    ),

    # Chapter 6 & 7: Portfolio Theory & Asset Pricing
    Fact(
        topic="capital asset pricing model",
        comment="asset valuation equation: expected return equals risk-free rate plus beta times equity market risk premium.",
        dewey="330", slug="finance", chapter="chapter 6.1",
        door="https://ocw.mit.edu/courses/sloan-school-of-management/"
    ),
    Fact(
        topic="financial beta",
        comment="measure of systematic undiversifiable volatility of a security relative to market portfolio as a whole.",
        dewey="330", slug="finance", chapter="chapter 6.2",
        door="https://ocw.mit.edu/courses/sloan-school-of-management/", kind="definition"
    ),
    Fact(
        topic="sharpe ratio",
        comment="metric measuring excess investment return over risk-free rate per unit of total portfolio volatility.",
        dewey="330", slug="finance", chapter="chapter 6.3",
        door="https://ocw.mit.edu/courses/sloan-school-of-management/", kind="definition"
    ),
    Fact(
        topic="efficient market hypothesis",
        comment="eugene fama hypothesis asserting asset prices fully reflect all available information across weak, semi-strong, and strong forms.",
        dewey="330", slug="finance", chapter="chapter 7.1",
        door="https://ocw.mit.edu/courses/sloan-school-of-management/", kind="definition"
    ),
    Fact(
        topic="liquidity ratio",
        comment="current ratio dividing current assets by current liabilities measuring solvency ability to cover short-term debts.",
        dewey="330", slug="finance", chapter="chapter 8.1",
        door="https://www.sec.gov/", kind="definition"
    ),
]

LAW_FACTS = [
    # Chapter 1 & 2: Jurisprudence & Legal Traditions
    Fact(
        topic="common law tradition",
        comment="legal system originating in england based on judicial precedent, adversarial courtroom trials, and developing judge-made doctrine.",
        dewey="340", slug="law", chapter="chapter 2.1",
        door="https://www.law.cornell.edu/wex/common_law", kind="definition"
    ),
    Fact(
        topic="civil law tradition",
        comment="legal system derived from roman law prioritizing comprehensive codified statutes and inquisitorial judicial inquiry over judge-made precedent.",
        dewey="340", slug="law", chapter="chapter 2.2",
        door="https://www.law.cornell.edu/wex/civil_law", kind="definition"
    ),
    Fact(
        topic="stare decisis",
        comment="doctrine obligating courts to stand by established precedent and adhere to settled points of law from superior tribunals.",
        dewey="340", slug="law", chapter="chapter 5.1",
        door="https://www.law.cornell.edu/wex/stare_decisis", kind="definition"
    ),
    Fact(
        topic="ratio decidendi",
        comment="the essential legal rationale and principle of law upon which a court binding judicial ruling is definitively based.",
        dewey="340", slug="law", chapter="chapter 5.2",
        door="https://www.law.cornell.edu/wex/ratio_decidendi", kind="definition"
    ),
    Fact(
        topic="obiter dictum",
        comment="incidental judicial remark or observation stated in judicial opinion that is not necessary to resolve case and lacks binding force.",
        dewey="340", slug="law", chapter="chapter 5.2",
        door="https://www.law.cornell.edu/wex/dicta", kind="definition"
    ),

    # Chapter 6 & 7: Statutory Construction & Hierarchy
    Fact(
        topic="plain meaning rule",
        comment="canon of statutory construction directing courts to interpret unambiguous statutory language according to its ordinary grammatical meaning.",
        dewey="340", slug="law", chapter="chapter 4.1",
        door="https://www.law.cornell.edu/wex/statutory_construction"
    ),
    Fact(
        topic="supremacy clause",
        comment="article VI of us constitution establishing federal constitution, laws, and treaties as supreme law of the land overriding state law.",
        dewey="340", slug="law", chapter="chapter 3.1",
        door="https://www.law.cornell.edu/constitution/articlevi"
    ),

    # Chapter 8: Torts & Civil Wrongs
    Fact(
        topic="tort of negligence elements",
        comment="plaintiff must establish four elements: defendant owed legal duty of care, breached duty, breach caused injury, and plaintiff suffered damages.",
        dewey="340", slug="law", chapter="chapter 8.1",
        door="https://www.law.cornell.edu/wex/negligence"
    ),
    Fact(
        topic="res ipsa loquitur",
        comment="evidentiary doctrine inferring negligence from very nature of accident that ordinarily does not occur in absence of someone negligence.",
        dewey="340", slug="law", chapter="chapter 8.2",
        door="https://www.law.cornell.edu/wex/res_ipsa_loquitur", kind="definition"
    ),
    Fact(
        topic="proximate cause",
        comment="legal cause requirement demanding that injury was foreseeable natural consequence unbroken by independent superseding cause.",
        dewey="340", slug="law", chapter="chapter 8.3",
        door="https://www.law.cornell.edu/wex/proximate_cause", kind="definition"
    ),

    # Chapter 9 & 10: Contracts & Property
    Fact(
        topic="contract formation elements",
        comment="legally enforceable agreement requires unambiguous offer, mirror image acceptance, adequate consideration, and mutual manifestation of assent.",
        dewey="340", slug="law", chapter="chapter 9.1",
        door="https://www.law.cornell.edu/wex/contract"
    ),
    Fact(
        topic="consideration in contracts",
        comment="bargained-for legal value exchanged between contracting parties consisting of performance, forbearance, or return promise.",
        dewey="340", slug="law", chapter="chapter 9.2",
        door="https://www.law.cornell.edu/wex/consideration", kind="definition"
    ),
    Fact(
        topic="statute of frauds",
        comment="statutory rule requiring certain contracts such as land sales and guarantees to be evidenced in signed writing to be enforceable.",
        dewey="340", slug="law", chapter="chapter 9.3",
        door="https://www.law.cornell.edu/wex/statute_of_frauds", kind="definition"
    ),

    # Chapter 11 & 12: Criminal Law & Procedure
    Fact(
        topic="actus reus and mens rea",
        comment="criminal culpability requires concurrence of voluntary prohibited physical act actus reus and guilty culpable state of mind mens rea.",
        dewey="340", slug="law", chapter="chapter 11.1",
        door="https://www.law.cornell.edu/wex/mens_rea"
    ),
    Fact(
        topic="burden of proof standards",
        comment="criminal prosecution requires proof beyond reasonable doubt; civil lawsuits require preponderance of evidence or clear and convincing evidence.",
        dewey="340", slug="law", chapter="chapter 12.1",
        door="https://www.law.cornell.edu/wex/beyond_a_reasonable_doubt"
    ),
    Fact(
        topic="exclusionary rule",
        comment="constitutional criminal procedure doctrine prohibiting introduction of evidence gathered in violation of fourth amendment rights.",
        dewey="340", slug="law", chapter="chapter 12.2",
        door="https://www.law.cornell.edu/wex/exclusionary_rule", kind="definition"
    ),
]


MEDIA_FACTS = [
    Fact(
        topic="attention economics",
        comment="commercial framework where human attention is the scarce commodity monetized through targeted advertising.",
        dewey="302.23", slug="media", chapter="chapter 1.1",
        door="https://www.ftc.gov/", kind="definition"
    ),
    Fact(
        topic="variable ratio schedule",
        comment="behavioral reinforcement pattern delivering rewards at unpredictable intervals producing durable engagement.",
        dewey="302.23", slug="media", chapter="chapter 1.2",
        door="https://www.apa.org/", kind="definition"
    ),
    Fact(
        topic="pull to refresh mechanism",
        comment="user interface gesture modeling a slot machine lever arm triggering intermittent reward evaluation.",
        dewey="302.23", slug="media", chapter="chapter 1.2",
        door="https://www.apa.org/", kind="definition"
    ),
    Fact(
        topic="lateral reading",
        comment="verification technique opening new browser tabs to assess source provenance before examining content.",
        dewey="302.23", slug="media", chapter="chapter 2.1",
        door="https://www.pewresearch.org/", kind="definition"
    ),
    Fact(
        topic="information disorder taxonomy",
        comment="classification of false communication into misinformation, disinformation, and malinformation.",
        dewey="302.23", slug="media", chapter="chapter 2.3",
        door="https://www.nature.com/", kind="definition"
    ),
    Fact(
        topic="misinformation",
        comment="inaccurate information created or shared without malicious intent to deceive.",
        dewey="302.23", slug="media", chapter="chapter 2.3",
        door="https://www.nature.com/", kind="definition"
    ),
    Fact(
        topic="disinformation",
        comment="false or manipulated content deliberately created and disseminated to deceive or cause harm.",
        dewey="302.23", slug="media", chapter="chapter 2.3",
        door="https://www.nature.com/", kind="definition"
    ),
    Fact(
        topic="malinformation",
        comment="genuine information shared with deliberate intent to cause harm or breach confidentiality.",
        dewey="302.23", slug="media", chapter="chapter 2.3",
        door="https://www.nature.com/", kind="definition"
    ),
    Fact(
        topic="behavioral targeting",
        comment="advertising practice tracking user actions across sites to construct predictive affinity profiles.",
        dewey="302.23", slug="media", chapter="chapter 3.1",
        door="https://www.ftc.gov/", kind="definition"
    ),
    Fact(
        topic="data broker ecosystem",
        comment="commercial market aggregating consumer personal data from public records and app telemetry.",
        dewey="302.23", slug="media", chapter="chapter 3.2",
        door="https://www.ftc.gov/", kind="definition"
    ),
    Fact(
        topic="adolescent mental health advisory",
        comment="public health alert warning of social media risks to adolescent developmental wellbeing.",
        dewey="302.23", slug="media", chapter="chapter 4.1",
        door="https://www.hhs.gov/"
    ),
    Fact(
        topic="social comparison mechanism",
        comment="psychological process evaluating personal worth against curated peer highlights on feeds.",
        dewey="302.23", slug="media", chapter="chapter 4.2",
        door="https://www.apa.org/", kind="definition"
    ),
    Fact(
        topic="homophily in networks",
        comment="structural tendency of social graph nodes to form edges preferentially with similar nodes.",
        dewey="302.23", slug="media", chapter="chapter 5.1",
        door="https://www.nature.com/", kind="definition"
    ),
    Fact(
        topic="network clustering",
        comment="graph density where neighbors of a node maintain high probability of mutual interconnection.",
        dewey="302.23", slug="media", chapter="chapter 5.1",
        door="https://www.nature.com/", kind="definition"
    ),
    Fact(
        topic="filter bubble",
        comment="algorithmic recommender bias narrowing exposure to content reinforcing past engagement patterns.",
        dewey="302.23", slug="media", chapter="chapter 5.2",
        door="https://digital-strategy.ec.europa.eu/", kind="definition"
    ),
    Fact(
        topic="echo chamber",
        comment="sociological network structure where homophilic social ties repeatedly reinforce existing beliefs.",
        dewey="302.23", slug="media", chapter="chapter 5.2",
        door="https://www.pewresearch.org/", kind="definition"
    ),
    Fact(
        topic="falsehood spread advantage",
        comment="vosoughi finding that false rumors spread farther and faster than true news due to novelty.",
        dewey="302.23", slug="media", chapter="chapter 6.1",
        door="https://www.nature.com/"
    ),
    Fact(
        topic="illusory truth effect",
        comment="cognitive bias where repeated exposure increases perceived truth value of statements.",
        dewey="302.23", slug="media", chapter="chapter 6.2",
        door="https://www.apa.org/", kind="definition"
    ),
    Fact(
        topic="prebunking",
        comment="psychological inoculation technique teaching recognition of manipulation tactics before exposure occurs.",
        dewey="302.23", slug="media", chapter="chapter 6.3",
        door="https://www.nature.com/", kind="definition"
    ),
    Fact(
        topic="collaborative filtering",
        comment="recommender algorithm predicting item affinity from latent user-item interaction matrix factors.",
        dewey="302.23", slug="media", chapter="chapter 7.1",
        door="https://digital-strategy.ec.europa.eu/", kind="definition"
    ),
    Fact(
        topic="independent cascade model",
        comment="stochastic information diffusion model where activated nodes get one attempt to activate neighbors.",
        dewey="302.23", slug="media", chapter="chapter 8.1",
        door="https://www.nature.com/", kind="definition"
    ),
    Fact(
        topic="linear threshold model",
        comment="diffusion model where nodes activate once weighted fraction of active neighbors crosses threshold.",
        dewey="302.23", slug="media", chapter="chapter 8.1",
        door="https://www.nature.com/", kind="definition"
    ),
    Fact(
        topic="bounded confidence opinion model",
        comment="dynamical system where agents update beliefs only toward peers within difference epsilon.",
        dewey="302.23", slug="media", chapter="chapter 8.3",
        door="https://www.nature.com/", kind="definition"
    ),
    Fact(
        topic="communications decency act section 230",
        comment="federal statute shielding internet platforms from publisher liability for user content.",
        dewey="302.23", slug="media", chapter="chapter 9.1",
        door="https://www.congress.gov/"
    ),
    Fact(
        topic="eu digital services act",
        comment="comprehensive european regulation imposing systemic risk assessment and researcher data access duties.",
        dewey="302.23", slug="media", chapter="chapter 9.1",
        door="https://digital-strategy.ec.europa.eu/", kind="definition"
    ),
    Fact(
        topic="children online privacy protection act",
        comment="federal statute restricting personal data collection from children under age thirteen.",
        dewey="302.23", slug="media", chapter="chapter 9.2",
        door="https://www.ftc.gov/", kind="definition"
    ),
    Fact(
        topic="age appropriate design code",
        comment="regulatory framework enforcing high privacy defaults and protective design for minors.",
        dewey="302.23", slug="media", chapter="chapter 9.2",
        door="https://ico.org.uk/"
    ),
]
