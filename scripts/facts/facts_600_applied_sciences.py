# SPDX-License-Identifier: AGPL-3.0-or-later
"""Facts for Dewey 600: health, engineering, agriculture, business, trades."""

from .common import Fact

HEALTH_FACTS = [
    # Chapter 1 & 2: Physiology & Homeostasis
    Fact(
        topic="physiological homeostasis",
        comment="active maintenance of stable internal biological conditions across temperature, pH, fluid volume, and electrolytes via negative feedback.",
        dewey="610", slug="health", chapter="chapter 1.1",
        door="https://www.nih.gov/", kind="definition"
    ),
    Fact(
        topic="claude bernard milieu interieur",
        comment="foundational concept that stability of internal bodily fluid environment is necessary condition for free and independent life.",
        dewey="610", slug="health", chapter="chapter 1.1",
        door="https://www.nih.gov/"
    ),
    Fact(
        topic="negative feedback loop components",
        comment="homeostatic regulatory circuit consisting of physiological sensor monitor, integrating comparator, and effector organ altering variable.",
        dewey="610", slug="health", chapter="chapter 1.2",
        door="https://www.nih.gov/", kind="definition"
    ),
    Fact(
        topic="normal resting blood pressure",
        comment="standard clinical arterial pressure measured in brachial artery with normal systolic under 120 mmHg and diastolic under 80 mmHg.",
        dewey="610", slug="health", chapter="chapter 3.1",
        door="https://www.cdc.gov/bloodpressure/about.htm"
    ),
    Fact(
        topic="normal core body temperature",
        comment="homeostatic human set point maintained by anterior hypothalamus typically ranging between 36.5 and 37.5 degrees Celsius.",
        dewey="610", slug="health", chapter="chapter 3.1",
        door="https://www.cdc.gov/"
    ),
    Fact(
        topic="cardiac electrical conduction path",
        comment="depolarization sequence initiating at sinoatrial SA node pacemaker, conducting through AV node, bundle of His, and Purkinje fibers.",
        dewey="610", slug="health", chapter="chapter 2.1",
        door="https://www.nhlbi.nih.gov/health/heart"
    ),
    Fact(
        topic="systemic vs pulmonary circulation",
        comment="pulmonary circuit pumps deoxygenated blood from right ventricle to lungs; systemic circuit pumps oxygenated blood from left ventricle to body.",
        dewey="610", slug="health", chapter="chapter 2.1",
        door="https://www.nhlbi.nih.gov/health/heart"
    ),

    # Chapter 3 & 4: Respiratory, Renal & Endocrine
    Fact(
        topic="alveolar gas exchange",
        comment="passive diffusion of oxygen and carbon dioxide across thin alveolar-capillary respiratory membrane driven by partial pressure gradients.",
        dewey="610", slug="health", chapter="chapter 2.2",
        door="https://www.nhlbi.nih.gov/"
    ),
    Fact(
        topic="bohr effect",
        comment="physiological phenomenon where increased blood carbon dioxide or decreased pH reduces hemoglobin oxygen affinity facilitating tissue delivery.",
        dewey="610", slug="health", chapter="chapter 2.2",
        door="https://www.ncbi.nlm.nih.gov/books/NBK526028/"
    ),
    Fact(
        topic="glomerular filtration rate",
        comment="renal volume filtered through kidney glomeruli per unit time, averaging approximately 125 milliliters per minute in healthy adults.",
        dewey="610", slug="health", chapter="chapter 2.3",
        door="https://www.niddk.nih.gov/", kind="definition"
    ),
    Fact(
        topic="renin angiotensin aldosterone system",
        comment="endocrine cascade activated by renal hypoperfusion to restore blood pressure and intravascular volume via sodium and water retention.",
        dewey="610", slug="health", chapter="chapter 2.3",
        door="https://www.niddk.nih.gov/", kind="definition"
    ),
    Fact(
        topic="autonomic nervous system divisions",
        comment="sympathetic division prepares body for fight-or-flight via norepinephrine; parasympathetic division promotes rest-and-digest via acetylcholine.",
        dewey="610", slug="health", chapter="chapter 2.4",
        door="https://www.nih.gov/"
    ),

    # Chapter 5 & 6: Immunology, Emergency Care & Trauma
    Fact(
        topic="innate vs adaptive immunity",
        comment="innate immunity provides immediate non-specific barrier and phagocytic defense; adaptive immunity generates specific memory B and T cell responses.",
        dewey="610", slug="health", chapter="chapter 4.1",
        door="https://www.niaid.nih.gov/"
    ),
    Fact(
        topic="complement membrane attack complex",
        comment="cytolytic protein pore formed by complement proteins C5b through C9 inserting into pathogen lipid bilayer to cause osmotic lysis.",
        dewey="610", slug="health", chapter="chapter 4.2",
        door="https://www.niaid.nih.gov/", kind="definition"
    ),
    Fact(
        topic="cardiopulmonary resuscitation cab sequence",
        comment="american heart association emergency life support priority ordering: chest compressions first, followed by airway opening and rescue breathing.",
        dewey="610", slug="health", chapter="chapter 5.1",
        door="https://cpr.heart.org/"
    ),
    Fact(
        topic="cpr compression rate",
        comment="effective adult cardiac chest compressions require rate of 100 to 120 compressions per minute at depth of at least 2 inches.",
        dewey="610", slug="health", chapter="chapter 5.1",
        door="https://cpr.heart.org/"
    ),
    Fact(
        topic="tourniquet placement protocol",
        comment="combat application tourniquet must be applied 2 to 3 inches proximal to severe bleeding extremity wound and tightened until hemorrhage stops.",
        dewey="610", slug="health", chapter="chapter 6.1",
        door="https://www.trauma.org/"
    ),
    Fact(
        topic="rule of nines in burn triage",
        comment="clinical tool dividing adult body surface area into multiples of 9 percent to estimate total burn surface area and guide fluid resuscitation.",
        dewey="610", slug="health", chapter="chapter 6.2",
        door="https://www.trauma.org/"
    ),

    # Chapter 7 & 8: Fluids, Metabolism & Pharmacology
    Fact(
        topic="oral rehydration therapy",
        comment="who formulation utilizing sodium-glucose cotransporter SGLT1 to passively drag water across intestinal epithelium during diarrheal dehydration.",
        dewey="610", slug="health", chapter="chapter 7.1",
        door="https://www.who.int/", kind="definition"
    ),
    Fact(
        topic="macronutrient caloric density",
        comment="physiological fuel values: carbohydrates yield 4 kilocalories per gram, proteins yield 4 kilocalories per gram, fats yield 9 kilocalories per gram.",
        dewey="610", slug="health", chapter="chapter 8.1",
        door="https://www.nal.usda.gov/fnic"
    ),
    Fact(
        topic="pharmacokinetic adme framework",
        comment="quantitative modeling of drug absorption into bloodstream, distribution into tissues, enzymatic metabolism, and renal/biliary excretion.",
        dewey="610", slug="health", chapter="chapter 9.1",
        door="https://www.fda.gov/", kind="definition"
    ),
    Fact(
        topic="drug elimination half life",
        comment="time required for circulating plasma drug concentration to decrease by 50 percent, calculated as 0.693 times volume of distribution divided by clearance.",
        dewey="610", slug="health", chapter="chapter 9.2",
        door="https://www.fda.gov/"
    ),
    Fact(
        topic="therapeutic index",
        comment="safety ratio comparing toxic drug dose TD50 to therapeutic effective dose ED50 where larger ratio denotes wider safety margin.",
        dewey="610", slug="health", chapter="chapter 9.3",
        door="https://www.fda.gov/", kind="definition"
    ),
    Fact(
        topic="number needed to treat",
        comment="epidemiological metric calculated as reciprocal of absolute risk reduction indicating number of patients treated to prevent one adverse event.",
        dewey="610", slug="health", chapter="chapter 10.1",
        door="https://www.cebm.ox.ac.uk/", kind="definition"
    ),
]

ENGINEERING_FACTS = [
    # Chapter 1 & 2: Statics & Equilibrium
    Fact(
        topic="static mechanical equilibrium",
        comment="state where vector sum of all external forces equals zero and sum of all external moments about any point equals zero.",
        dewey="620", slug="engineering", chapter="chapter 2.1",
        door="https://ocw.mit.edu/courses/mechanical-engineering/"
    ),
    Fact(
        topic="free body diagram",
        comment="graphical representation isolating a structural component showing all applied forces, reaction forces, and moments acting upon it.",
        dewey="620", slug="engineering", chapter="chapter 2.2",
        door="https://ocw.mit.edu/courses/mechanical-engineering/", kind="definition"
    ),
    Fact(
        topic="method of joints in trusses",
        comment="analytical procedure solving axial forces in pinned truss members by satisfying static concurrent force equilibrium at each joint.",
        dewey="620", slug="engineering", chapter="chapter 2.3",
        door="https://ocw.mit.edu/courses/mechanical-engineering/"
    ),

    # Chapter 3: Solid Mechanics & Materials
    Fact(
        topic="hooke law for linear elasticity",
        comment="normal stress sigma is directly proportional to normal strain epsilon: sigma equals Young modulus E times epsilon.",
        dewey="620", slug="engineering", chapter="chapter 3.1",
        door="https://ocw.mit.edu/courses/mechanical-engineering/"
    ),
    Fact(
        topic="poisson ratio",
        comment="dimensionless ratio of transverse contraction strain to longitudinal extension strain under axial mechanical loading.",
        dewey="620", slug="engineering", chapter="chapter 3.1",
        door="https://ocw.mit.edu/courses/materials-science-and-engineering/", kind="definition"
    ),
    Fact(
        topic="factor of safety",
        comment="structural design ratio dividing material ultimate or yield strength by maximum allowable working stress.",
        dewey="620", slug="engineering", chapter="chapter 3.2",
        door="https://ocw.mit.edu/courses/mechanical-engineering/", kind="definition"
    ),
    Fact(
        topic="mohr circle for stress",
        comment="graphical 2D coordinate transformation mapping normal and shear stress components to determine principal stresses and maximum shear.",
        dewey="620", slug="engineering", chapter="chapter 3.3",
        door="https://ocw.mit.edu/courses/mechanical-engineering/"
    ),
    Fact(
        topic="beam bending stress formula",
        comment="flexural normal stress sigma equals internal bending moment M times distance from neutral axis y divided by second moment of area I.",
        dewey="620", slug="engineering", chapter="chapter 3.4",
        door="https://ocw.mit.edu/courses/mechanical-engineering/"
    ),

    # Chapter 4 & 5: Electrical Circuits & Machine Elements
    Fact(
        topic="ohm law for electric circuits",
        comment="voltage V across ideal conductor equals electric current I times resistance R: V equals I times R.",
        dewey="620", slug="engineering", chapter="chapter 4.1",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ),
    Fact(
        topic="kirchhoff current law",
        comment="conservation of charge principle stating sum of electrical currents entering any circuit node identically equals sum leaving node.",
        dewey="620", slug="engineering", chapter="chapter 4.2",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ),
    Fact(
        topic="kirchhoff voltage law",
        comment="conservation of energy principle stating directed sum of electrical potential differences around any closed circuit loop is zero.",
        dewey="620", slug="engineering", chapter="chapter 4.2",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ),
    Fact(
        topic="thevenin equivalent circuit",
        comment="circuit theorem stating any linear two-terminal electrical network can be replaced by equivalent voltage source V_th in series with resistance R_th.",
        dewey="620", slug="engineering", chapter="chapter 4.3",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ),
    Fact(
        topic="involute gear profile",
        comment="gear tooth curve ensuring conjugate action maintaining constant angular velocity ratio throughout tooth meshing engagement.",
        dewey="620", slug="engineering", chapter="chapter 5.1",
        door="https://ocw.mit.edu/courses/mechanical-engineering/", kind="definition"
    ),

    # Chapter 6 & 7: Fluid Mechanics, Thermodynamics & Control
    Fact(
        topic="bernoulli principle",
        comment="in steady inviscid fluid flow along a streamline, static pressure plus dynamic pressure plus hydrostatic pressure remains constant.",
        dewey="620", slug="engineering", chapter="chapter 6.1",
        door="https://ocw.mit.edu/courses/mechanical-engineering/"
    ),
    Fact(
        topic="reynolds number",
        comment="dimensionless ratio of inertial fluid forces to viscous forces characterizing transition between laminar and turbulent flow.",
        dewey="620", slug="engineering", chapter="chapter 6.2",
        door="https://ocw.mit.edu/courses/mechanical-engineering/", kind="definition"
    ),
    Fact(
        topic="fourier law of heat conduction",
        comment="heat transfer rate q per unit area is proportional to negative temperature gradient: q equals negative thermal conductivity k times dT/dx.",
        dewey="620", slug="engineering", chapter="chapter 6.3",
        door="https://ocw.mit.edu/courses/mechanical-engineering/"
    ),
    Fact(
        topic="closed loop feedback control",
        comment="control architecture comparing measured process variable to setpoint to compute corrective controller output minimizing error.",
        dewey="620", slug="engineering", chapter="chapter 7.1",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/", kind="definition"
    ),
    Fact(
        topic="pid controller terms",
        comment="three-term control algorithm applying corrective output proportional to error, accumulated integral of error, and derivative rate of error.",
        dewey="620", slug="engineering", chapter="chapter 7.2",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ),
    Fact(
        topic="nyquist shannon sampling theorem",
        comment="continuous signal can be completely reconstructed if discrete sampling frequency is strictly greater than twice highest signal frequency.",
        dewey="620", slug="engineering", chapter="chapter 8.1",
        door="https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"
    ),
]

AGRICULTURE_FACTS = [
    # Chapter 1 & 2: Pedology & Soil Physics
    Fact(
        topic="soil texture classes",
        comment="usda classification partitioning mineral soil particles into sand 0.05 to 2 mm, silt 0.002 to 0.05 mm, and clay under 0.002 mm.",
        dewey="630", slug="agriculture", chapter="chapter 2.1",
        door="https://www.nrcs.usda.gov/"
    ),
    Fact(
        topic="soil cation exchange capacity",
        comment="total capacity of soil particles to hold and exchange positively charged nutrient ions like calcium, magnesium, potassium, and ammonium.",
        dewey="630", slug="agriculture", chapter="chapter 2.2",
        door="https://www.nrcs.usda.gov/", kind="definition"
    ),
    Fact(
        topic="optimal soil ph for crop uptake",
        comment="most field crops exhibit maximal macro and micronutrient bioavailability in soil pH range between 6.0 and 7.0.",
        dewey="630", slug="agriculture", chapter="chapter 2.3",
        door="https://www.nrcs.usda.gov/"
    ),
    Fact(
        topic="soil horizons profile",
        comment="vertical soil stratification consisting of O organic horizon, A topsoil, B mineral subsoil accumulation, and C weathered parent rock.",
        dewey="630", slug="agriculture", chapter="chapter 2.4",
        door="https://www.nrcs.usda.gov/"
    ),

    # Chapter 3 & 4: Mineral Nutrition & Crop Physiology
    Fact(
        topic="primary plant macronutrients npk",
        comment="three vital elements required in largest quantities: nitrogen for vegetative leaves, phosphorus for roots and ATP, potassium for enzyme activation.",
        dewey="630", slug="agriculture", chapter="chapter 3.1",
        door="https://www.usda.gov/"
    ),
    Fact(
        topic="liebig law of the minimum",
        comment="agricultural yield is dictated not by total available soil nutrients but by scarcest essential limiting nutrient available.",
        dewey="630", slug="agriculture", chapter="chapter 3.1",
        door="https://www.usda.gov/"
    ),
    Fact(
        topic="haber bosch ammonia synthesis",
        comment="chemical process synthesizing anhydrous ammonia fertilizer directly from atmospheric nitrogen gas and hydrogen gas over iron catalyst.",
        dewey="630", slug="agriculture", chapter="chapter 3.2",
        door="https://www.usda.gov/"
    ),
    Fact(
        topic="c4 photosynthetic pathway",
        comment="carbon fixation adaptation using kranz anatomy and PEP carboxylase to concentrate CO2, eliminating photorespiration in warm environments.",
        dewey="630", slug="agriculture", chapter="chapter 4.1",
        door="https://www.ars.usda.gov/", kind="definition"
    ),
    Fact(
        topic="cam photosynthesis adaptation",
        comment="crassulacean acid metabolism opening stomata at night to store carbon dioxide as malate, minimizing daytime evapotranspiration water loss.",
        dewey="630", slug="agriculture", chapter="chapter 4.2",
        door="https://www.ars.usda.gov/", kind="definition"
    ),

    # Chapter 5 & 6: Irrigation, Agronomy & Pest Management
    Fact(
        topic="soil field capacity",
        comment="amount of soil moisture retained in root zone after excess gravitational water has fully drained away.",
        dewey="630", slug="agriculture", chapter="chapter 5.1",
        door="https://www.nrcs.usda.gov/", kind="definition"
    ),
    Fact(
        topic="permanent wilting point",
        comment="minimum soil moisture threshold at which soil water suction exceeds plant root osmotic absorption pressure causing irreversible plant wilting.",
        dewey="630", slug="agriculture", chapter="chapter 5.1",
        door="https://www.nrcs.usda.gov/", kind="definition"
    ),
    Fact(
        topic="integrated pest management",
        comment="decision-making framework coordinating biological controls, cultural practices, crop monitoring, and judicious chemical applications.",
        dewey="630", slug="agriculture", chapter="chapter 6.1",
        door="https://www.epa.gov/safepestcontrol/integrated-pest-management-ipm-principles", kind="definition"
    ),
    Fact(
        topic="economic injury level",
        comment="lowest pest population density that causes economic crop damage equal to cost of artificial pest control intervention.",
        dewey="630", slug="agriculture", chapter="chapter 6.2",
        door="https://www.epa.gov/safepestcontrol/integrated-pest-management-ipm-principles", kind="definition"
    ),
    Fact(
        topic="crop rotation benefits",
        comment="systematic planting sequence disrupting host-specific pest and pathogen lifecycles while replenishing soil nitrogen through legumes.",
        dewey="630", slug="agriculture", chapter="chapter 7.1",
        door="https://www.nrcs.usda.gov/"
    ),
]

BUSINESS_FACTS = [
    # Chapter 1 & 2: Economic Foundations & Structure
    Fact(
        topic="nature of the firm transaction costs",
        comment="ronald coase 1937 theorem establishing that firms emerge because administrative coordination reduces market contracting and search transaction costs.",
        dewey="650", slug="business", chapter="chapter 1.1",
        door="https://www.nobelprize.org/prizes/economic-sciences/1991/coase/facts/"
    ),
    Fact(
        topic="porter five forces model",
        comment="framework analyzing industry profitability based on supplier power, buyer power, competitive rivalry, threat of substitution, threat of new entrants.",
        dewey="650", slug="business", chapter="chapter 1.2",
        door="https://www.isc.hbs.edu/strategy/business-strategy/Pages/the-five-forces.aspx", kind="definition"
    ),
    Fact(
        topic="porter generic strategies",
        comment="strategic positioning options achieving competitive advantage through broad cost leadership, broad differentiation, or focused market niche.",
        dewey="650", slug="business", chapter="chapter 1.3",
        door="https://www.isc.hbs.edu/strategy/business-strategy/Pages/the-five-forces.aspx"
    ),
    Fact(
        topic="span of control",
        comment="number of direct subordinate employees reporting directly to a single organizational manager or executive.",
        dewey="650", slug="business", chapter="chapter 2.1",
        door="https://hbr.org/", kind="definition"
    ),
    Fact(
        topic="matrix organizational structure",
        comment="management architecture where employees maintain dual reporting relationships to both functional department managers and product project managers.",
        dewey="650", slug="business", chapter="chapter 2.2",
        door="https://hbr.org/", kind="definition"
    ),
    Fact(
        topic="psychological safety in teams",
        comment="amy edmondson concept of shared belief held by team members that the team is safe for interpersonal risk-taking and error reporting.",
        dewey="650", slug="business", chapter="chapter 4.1",
        door="https://hbr.org/", kind="definition"
    ),

    # Chapter 3 & 4: Operations, Quality & Supply Chain
    Fact(
        topic="lean manufacturing principles",
        comment="toyota production system methodology systematically eliminating waste muda while maximizing customer-defined product value.",
        dewey="650", slug="business", chapter="chapter 3.1",
        door="https://www.lean.org/", kind="definition"
    ),
    Fact(
        topic="5s operational framework",
        comment="workplace organization methodology comprising Sort seiri, Set in order seiton, Shine seiso, Standardize seiketsu, Sustain shitsuke.",
        dewey="650", slug="business", chapter="chapter 3.2",
        door="https://www.lean.org/"
    ),
    Fact(
        topic="six sigma quality standard",
        comment="data-driven defect reduction methodology requiring process output variation to remain within 3.4 defects per million opportunities.",
        dewey="650", slug="business", chapter="chapter 3.3",
        door="https://asq.org/quality-resources/six-sigma", kind="definition"
    ),
    Fact(
        topic="supply chain bullwhip effect",
        comment="distortion phenomenon where small fluctuations in consumer retail demand trigger progressively amplified demand swings up the wholesale supply chain.",
        dewey="650", slug="business", chapter="chapter 8.1",
        door="https://hbr.org/", kind="definition"
    ),
    Fact(
        topic="economic order quantity",
        comment="optimal inventory order volume minimizing total combined inventory holding costs and fixed order processing costs.",
        dewey="650", slug="business", chapter="chapter 8.2",
        door="https://hbr.org/", kind="definition"
    ),

    # Chapter 5 & 6: Unit Economics & Governance
    Fact(
        topic="customer lifetime value to cac ratio",
        comment="unit economics benchmark requiring customer lifetime value LTV divided by customer acquisition cost CAC to exceed 3 to 1 for sustainable growth.",
        dewey="650", slug="business", chapter="chapter 6.1",
        door="https://hbr.org/"
    ),
    Fact(
        topic="customer churn rate",
        comment="percentage of subscribed customers who cancel or fail to renew service subscriptions over a designated billing interval.",
        dewey="650", slug="business", chapter="chapter 6.2",
        door="https://hbr.org/", kind="definition"
    ),
    Fact(
        topic="fiduciary duty of directors",
        comment="legal obligation binding corporate officers and board directors comprising duty of loyalty avoiding self-dealing and duty of prudent care.",
        dewey="650", slug="business", chapter="chapter 12.1",
        door="https://www.sec.gov/", kind="definition"
    ),
]

TRADES_FACTS = [
    # Chapter 1 & 2: Precision Machining & CNC
    Fact(
        topic="machining cutting speed formula",
        comment="surface cutting speed V_c in meters per minute equals pi times tool diameter D times spindle revolutions per minute N divided by 1000.",
        dewey="690", slug="trades", chapter="chapter 1.1",
        door="https://www.mmsonline.com/"
    ),
    Fact(
        topic="material removal rate",
        comment="volumetric rate of metal cutting calculated as cutting speed times radial depth of cut times axial depth of cut in cubic centimeters per minute.",
        dewey="690", slug="trades", chapter="chapter 1.2",
        door="https://www.mmsonline.com/", kind="definition"
    ),
    Fact(
        topic="cnc g code modal commands",
        comment="g00 executes rapid positioning at maximum traverse speed; g01 commands linear interpolation feed rate cutting; g02 and g03 execute circular interpolation.",
        dewey="690", slug="trades", chapter="chapter 2.1",
        door="https://www.mmsonline.com/"
    ),
    Fact(
        topic="gauge block calibration standard",
        comment="johansson blocks precision ground to within millionths of an inch used as physical metrology reference for calibrating calipers and micrometers.",
        dewey="690", slug="trades", chapter="chapter 2.2",
        door="https://www.nist.gov/"
    ),

    # Chapter 3 & 4: Electrical Trade & National Electrical Code
    Fact(
        topic="national electrical code ampacity",
        comment="nfpa 70 standards: 14 AWG copper conductor is rated for 15 amperes, 12 AWG for 20 amperes, and 10 AWG for 30 amperes.",
        dewey="690", slug="trades", chapter="chapter 3.1",
        door="https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70"
    ),
    Fact(
        topic="gfci breaker tripping threshold",
        comment="ground fault circuit interrupters must trip within 25 milliseconds when differential current between hot and neutral conductors reaches 4 to 6 milliamperes.",
        dewey="690", slug="trades", chapter="chapter 3.2",
        door="https://www.cpsc.gov/"
    ),
    Fact(
        topic="electrical grounding vs bonding",
        comment="grounding connects system neutral to physical earth for surge protection; bonding electrically interconnects metallic parts ensuring low impedance fault clearing.",
        dewey="690", slug="trades", chapter="chapter 3.3",
        door="https://www.nfpa.org/"
    ),

    # Chapter 5 & 6: Plumbing DWV & Carpentry
    Fact(
        topic="plumbing dwv slope standard",
        comment="drain-waste-vent horizontal sewer piping of 2-inch diameter or less must maintain minimum downward slope of one-quarter inch per foot.",
        dewey="690", slug="trades", chapter="chapter 4.1",
        door="https://www.iapmo.org/"
    ),
    Fact(
        topic="p trap water seal depth",
        comment="fixture drain trap must maintain vertical water seal between 2 and 4 inches depth to block toxic sewer gases from entering habitable spaces.",
        dewey="690", slug="trades", chapter="chapter 4.2",
        door="https://www.iapmo.org/"
    ),
    Fact(
        topic="plumbing stack vent function",
        comment="vertical extension of drainage stack above highest drainage connection terminating outdoors through roof to equalize pneumatic pressure.",
        dewey="690", slug="trades", chapter="chapter 4.3",
        door="https://www.iapmo.org/", kind="definition"
    ),
    Fact(
        topic="platform wood framing load path",
        comment="structural load sequence transferring gravity roof loads through rafters to ceiling joists, stud walls, sole plates, floor joists, foundation sill, and footings.",
        dewey="690", slug="trades", chapter="chapter 5.1",
        door="https://www.awc.org/"
    ),

    # Chapter 7: Welding Metallurgy & Processes
    Fact(
        topic="shielded metal arc welding",
        comment="stick welding process using consumable flux-coated electrode that decomposes during electric arc melting to produce shielding gas and slag.",
        dewey="690", slug="trades", chapter="chapter 6.1",
        door="https://www.aws.org/", kind="definition"
    ),
    Fact(
        topic="gas metal arc welding",
        comment="mig welding process continuously feeding solid consumable wire through gun surrounded by externally supplied argon-co2 shielding gas.",
        dewey="690", slug="trades", chapter="chapter 6.2",
        door="https://www.aws.org/", kind="definition"
    ),
    Fact(
        topic="gas tungsten arc welding",
        comment="tig welding process using non-consumable tungsten electrode and inert argon shielding gas to produce high-precision welds without spatter.",
        dewey="690", slug="trades", chapter="chapter 6.3",
        door="https://www.aws.org/", kind="definition"
    ),
    Fact(
        topic="weld heat affected zone",
        comment="non-melted portion of base metal whose microstructural properties and mechanical grain size are altered by welding heat thermal cycle.",
        dewey="690", slug="trades", chapter="chapter 6.4",
        door="https://www.aws.org/", kind="definition"
    ),
]
