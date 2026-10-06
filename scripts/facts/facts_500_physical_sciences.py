# SPDX-License-Identifier: AGPL-3.0-or-later
"""Facts for Dewey 500: astronomy, physics, chemistry, earth_sciences, biology."""

from .common import Fact

ASTRONOMY_FACTS = [
    # Chapter 1: Celestial Mechanics & Orbital Dynamics
    Fact(
        topic="kepler first law of planetary motion",
        comment="planetary orbits are ellipses with the central gravitational star located at one focus.",
        dewey="520", slug="astronomy", chapter="chapter 1.1",
        door="https://ssd.jpl.nasa.gov/"
    ),
    Fact(
        topic="kepler second law of planetary motion",
        comment="areal velocity vector of an orbiting body sweeps out equal areas in equal intervals of time due to angular momentum conservation.",
        dewey="520", slug="astronomy", chapter="chapter 1.1",
        door="https://ssd.jpl.nasa.gov/"
    ),
    Fact(
        topic="kepler third law of planetary motion",
        comment="the square of the orbital period T is directly proportional to the cube of the semi-major axis a of the orbit.",
        dewey="520", slug="astronomy", chapter="chapter 1.1",
        door="https://ssd.jpl.nasa.gov/"
    ),
    Fact(
        topic="astronomical unit",
        comment="standard unit of length defined exactly as 149597870700 meters representing mean Earth Sun distance.",
        dewey="520", slug="astronomy", chapter="chapter 1.2",
        door="https://www.iau.org/", kind="definition"
    ),
    Fact(
        topic="parsec unit",
        comment="astronomical distance unit defined as distance at which one astronomical unit subtends an angle of one arcsecond, approximately 3.26 light years.",
        dewey="520", slug="astronomy", chapter="chapter 1.2",
        door="https://www.iau.org/", kind="definition"
    ),

    # Chapter 2 & 3: Stellar Structure & Hydrostatic Equilibrium
    Fact(
        topic="stellar hydrostatic equilibrium",
        comment="inward gravitational compression is balanced continuously by outward radiative and thermal gas pressure gradient dP/dr.",
        dewey="520", slug="astronomy", chapter="chapter 3.1",
        door="https://openstax.org/details/books/astronomy-2e"
    ),
    Fact(
        topic="stefan boltzmann luminosity law",
        comment="total radiant energy emitted per second by a star equals surface area 4 pi R squared times stefan boltzmann constant times T to the fourth power.",
        dewey="520", slug="astronomy", chapter="chapter 2.1",
        door="https://openstax.org/details/books/astronomy-2e"
    ),
    Fact(
        topic="wien displacement law",
        comment="the peak emission wavelength of blackbody radiation is inversely proportional to absolute thermodynamic temperature lambda_max times T equals b.",
        dewey="520", slug="astronomy", chapter="chapter 2.2",
        door="https://physics.nist.gov/cuu/Constants/"
    ),

    # Chapter 4 & 5: Nuclear Astrophysics & H-R Diagram
    Fact(
        topic="proton proton chain",
        comment="primary nuclear fusion reaction sequence converting four hydrogen protons into helium four in stellar cores with temperatures below 15 million Kelvin.",
        dewey="520", slug="astronomy", chapter="chapter 4.1",
        door="https://openstax.org/details/books/astronomy-2e", kind="definition"
    ),
    Fact(
        topic="hertzsprung russell diagram",
        comment="astrophysical scatter plot showing relationship between stellar luminosity and surface temperature or spectral type.",
        dewey="520", slug="astronomy", chapter="chapter 5.1",
        door="https://openstax.org/details/books/astronomy-2e", kind="definition"
    ),
    Fact(
        topic="main sequence stars",
        comment="stable stellar evolutionary phase where stars generate core energy through sustained hydrogen fusion in hydrostatic balance.",
        dewey="520", slug="astronomy", chapter="chapter 5.2",
        door="https://openstax.org/details/books/astronomy-2e", kind="definition"
    ),

    # Chapter 6 & 7: Stellar Remnants & Black Holes
    Fact(
        topic="chandrasekhar mass limit",
        comment="maximum theoretical mass of a stable non-rotating white dwarf supported by electron degeneracy pressure at approximately 1.4 solar masses.",
        dewey="520", slug="astronomy", chapter="chapter 6.1",
        door="https://openstax.org/details/books/astronomy-2e"
    ),
    Fact(
        topic="neutron star",
        comment="compact stellar remnant supported against gravitational collapse by quantum mechanical neutron degeneracy pressure.",
        dewey="520", slug="astronomy", chapter="chapter 6.2",
        door="https://openstax.org/details/books/astronomy-2e", kind="definition"
    ),
    Fact(
        topic="schwarzschild radius formula",
        comment="event horizon radius of non-rotating black hole equals two times gravitational constant G times mass M divided by speed of light squared.",
        dewey="520", slug="astronomy", chapter="chapter 7.1",
        door="https://openstax.org/details/books/astronomy-2e"
    ),

    # Chapter 8 & 9: Cosmology & Galaxy Evolution
    Fact(
        topic="hubble lemaitre law",
        comment="astronomical observation that recessional velocity v of distant galaxies is directly proportional to their physical distance d from observer.",
        dewey="520", slug="astronomy", chapter="chapter 8.1",
        door="https://openstax.org/details/books/astronomy-2e"
    ),
    Fact(
        topic="cosmic microwave background",
        comment="thermal relic blackbody radiation filling the universe with isotropic temperature of 2.7255 Kelvin decoupled 380000 years after Big Bang.",
        dewey="520", slug="astronomy", chapter="chapter 8.2",
        door="https://openstax.org/details/books/astronomy-2e"
    ),
    Fact(
        topic="cosmic energy inventory",
        comment="standard Lambda-CDM cosmological model composition: 68 percent dark energy, 27 percent dark matter, and 5 percent baryonic matter.",
        dewey="520", slug="astronomy", chapter="chapter 9.1",
        door="https://openstax.org/details/books/astronomy-2e"
    ),
]

PHYSICS_FACTS = [
    # Chapter 1: Architecture of Physical Law & Symmetries
    Fact(
        topic="noether theorem",
        comment="every continuous differentiable symmetry of the action of a physical system corresponds to an exact physical conservation law.",
        dewey="530", slug="physics", chapter="chapter 1.2",
        door="https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/"
    ),
    Fact(
        topic="time translation symmetry",
        comment="the invariance of physical laws under continuous time shifts mathematically yields the conservation of total energy.",
        dewey="530", slug="physics", chapter="chapter 1.2",
        door="https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/"
    ),
    Fact(
        topic="spatial translation symmetry",
        comment="the invariance of physical laws under spatial displacements mathematically yields the conservation of linear momentum.",
        dewey="530", slug="physics", chapter="chapter 1.2",
        door="https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/"
    ),
    Fact(
        topic="rotational symmetry",
        comment="the invariance of physical laws under spatial coordinate rotations mathematically yields the conservation of angular momentum.",
        dewey="530", slug="physics", chapter="chapter 1.2",
        door="https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/"
    ),

    # Chapter 2: Newtonian Kinematics & Vector Dynamics
    Fact(
        topic="newton first law of motion",
        comment="an object remains in a state of rest or uniform rectilinear motion unless compelled to change that state by an external net force.",
        dewey="530", slug="physics", chapter="chapter 2.2",
        door="https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/"
    ),
    Fact(
        topic="newton second law of motion",
        comment="net force F equals the instantaneous time rate of change of linear momentum dp/dt, reducing to mass times acceleration for constant mass.",
        dewey="530", slug="physics", chapter="chapter 2.2",
        door="https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/"
    ),
    Fact(
        topic="newton third law of motion",
        comment="when body A exerts a force on body B, body B simultaneously exerts an equal and opposite force on body A: F_AB equals negative F_BA.",
        dewey="530", slug="physics", chapter="chapter 2.2",
        door="https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/"
    ),

    # Chapter 3 & 4: Work, Energy, Rotation & Central Forces
    Fact(
        topic="work kinetic energy theorem",
        comment="the net work performed on a particle by all external forces equals the exact change in its kinetic energy one half m v squared.",
        dewey="530", slug="physics", chapter="chapter 3.1",
        door="https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/"
    ),
    Fact(
        topic="conservative force",
        comment="a force is conservative if and only if the work done around any closed loop is zero, allowing it to be expressed as negative potential gradient.",
        dewey="530", slug="physics", chapter="chapter 3.2",
        door="https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/", kind="definition"
    ),
    Fact(
        topic="torque and angular momentum",
        comment="net external torque tau equals the cross product of position r and force F, matching the instantaneous rate of change of angular momentum dL/dt.",
        dewey="530", slug="physics", chapter="chapter 4.1",
        door="https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/"
    ),

    # Chapter 5 & 6: SI Base Constants & Thermodynamics
    Fact(
        topic="speed of light in vacuum",
        comment="universal fundamental constant c defined exactly as 299792458 meters per second in the International System of Units.",
        dewey="530", slug="physics", chapter="chapter 1.1",
        door="https://physics.nist.gov/cuu/Constants/"
    ),
    Fact(
        topic="planck constant",
        comment="fundamental quantum constant h defined exactly as 6.62607015 times 10 to the negative 34 joule seconds.",
        dewey="530", slug="physics", chapter="chapter 1.1",
        door="https://physics.nist.gov/cuu/Constants/"
    ),
    Fact(
        topic="elementary charge",
        comment="electric charge of a proton defined exactly as 1.602176634 times 10 to the negative 19 coulombs.",
        dewey="530", slug="physics", chapter="chapter 1.1",
        door="https://physics.nist.gov/cuu/Constants/"
    ),
    Fact(
        topic="boltzmann constant",
        comment="thermodynamic constant k defined exactly as 1.380649 times 10 to the negative 23 joules per kelvin.",
        dewey="530", slug="physics", chapter="chapter 1.1",
        door="https://physics.nist.gov/cuu/Constants/"
    ),
    Fact(
        topic="first law of thermodynamics",
        comment="the change in internal energy delta U of a closed system equals heat added Q minus mechanical work performed W.",
        dewey="530", slug="physics", chapter="chapter 6.1",
        door="https://openstax.org/details/books/university-physics-volume-2"
    ),
    Fact(
        topic="second law of thermodynamics",
        comment="the total entropy of an isolated thermodynamic system can never decrease over time, delta S is greater than or equal to zero.",
        dewey="530", slug="physics", chapter="chapter 6.2",
        door="https://openstax.org/details/books/university-physics-volume-2"
    ),
    Fact(
        topic="carnot engine efficiency limit",
        comment="the maximum theoretical thermodynamic efficiency of a heat engine equals one minus the cold reservoir temperature divided by hot reservoir temperature.",
        dewey="530", slug="physics", chapter="chapter 6.3",
        door="https://openstax.org/details/books/university-physics-volume-2"
    ),

    # Chapter 7 & 8: Electromagnetism & Quantum Mechanics
    Fact(
        topic="gauss law for electricity",
        comment="the divergence of the electric field E equals the electric charge density rho divided by vacuum permittivity epsilon_0.",
        dewey="530", slug="physics", chapter="chapter 7.1",
        door="https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/"
    ),
    Fact(
        topic="gauss law for magnetism",
        comment="the divergence of the magnetic field B is identically zero, establishing that magnetic monopoles do not exist in classical electrodynamics.",
        dewey="530", slug="physics", chapter="chapter 7.1",
        door="https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/"
    ),
    Fact(
        topic="faraday law of induction",
        comment="the curl of the electric field E equals negative time rate of change of the magnetic field B, generating induced electromotive force.",
        dewey="530", slug="physics", chapter="chapter 7.1",
        door="https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/"
    ),
    Fact(
        topic="ampere maxwell law",
        comment="the curl of the magnetic field B equals permeability mu_0 times current density J plus displacement current mu_0 epsilon_0 dE/dt.",
        dewey="530", slug="physics", chapter="chapter 7.1",
        door="https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/"
    ),
    Fact(
        topic="heisenberg uncertainty principle",
        comment="the product of the uncertainty in position delta x and uncertainty in momentum delta p must be greater than or equal to h bar divided by two.",
        dewey="530", slug="physics", chapter="chapter 8.1",
        door="https://openstax.org/details/books/university-physics-volume-3"
    ),
]

CHEMISTRY_FACTS = [
    # Chapter 1 & 2: Atomic Architecture & The Periodic Table
    Fact(
        topic="avogadro constant",
        comment="fundamental physical constant N_A defined exactly as 6.02214076 times 10 to the 23 reciprocal moles.",
        dewey="540", slug="chemistry", chapter="chapter 3.1",
        door="https://physics.nist.gov/cuu/Constants/"
    ),
    Fact(
        topic="pauli exclusion principle",
        comment="quantum mechanical rule stating no two identical fermions in an atom can occupy the same quantum state or four identical quantum numbers.",
        dewey="540", slug="chemistry", chapter="chapter 2.2",
        door="https://openstax.org/details/books/chemistry-2e"
    ),
    Fact(
        topic="hund rule of maximum multiplicity",
        comment="electrons occupy degenerate orbitals singly with parallel spins before doubly occupying any single orbital to minimize repulsion.",
        dewey="540", slug="chemistry", chapter="chapter 2.3",
        door="https://openstax.org/details/books/chemistry-2e"
    ),
    Fact(
        topic="aufbau principle",
        comment="electrons progressively fill atomic subshells of lowest available energy levels before filling higher energy subshells.",
        dewey="540", slug="chemistry", chapter="chapter 2.3",
        door="https://openstax.org/details/books/chemistry-2e", kind="definition"
    ),
    Fact(
        topic="pauling electronegativity scale",
        comment="dimensionless relative scale quantifying the chemical ability of an atom in a molecule to attract shared bonding electrons to itself.",
        dewey="540", slug="chemistry", chapter="chapter 4.1",
        door="https://openstax.org/details/books/chemistry-2e"
    ),

    # Chapter 3 & 4: Bonding, Geometry & Ideal Gas Law
    Fact(
        topic="ideal gas law",
        comment="equation of state PV equals nRT relating pressure P, volume V, moles n, gas constant R, and absolute temperature T.",
        dewey="540", slug="chemistry", chapter="chapter 3.2",
        door="https://openstax.org/details/books/chemistry-2e"
    ),
    Fact(
        topic="molar gas constant",
        comment="universal gas constant R defined as Avogadro constant times Boltzmann constant, approximately 8.314462618 joules per mole kelvin.",
        dewey="540", slug="chemistry", chapter="chapter 3.2",
        door="https://physics.nist.gov/cuu/Constants/"
    ),
    Fact(
        topic="vsepr theory",
        comment="valence shell electron pair repulsion model predicting 3D molecular geometries by minimizing electrostatic repulsion between valence electron pairs.",
        dewey="540", slug="chemistry", chapter="chapter 4.2",
        door="https://openstax.org/details/books/chemistry-2e", kind="definition"
    ),

    # Chapter 5 & 6: Thermodynamics, Equilibrium & Kinetics
    Fact(
        topic="gibbs free energy equation",
        comment="thermodynamic state function delta G equals delta H minus T delta S where negative delta G indicates a spontaneous chemical process.",
        dewey="540", slug="chemistry", chapter="chapter 6.1",
        door="https://openstax.org/details/books/chemistry-2e"
    ),
    Fact(
        topic="le chatelier principle",
        comment="when an external chemical system at equilibrium is disturbed by change in concentration, pressure, or temperature, it shifts to counteract change.",
        dewey="540", slug="chemistry", chapter="chapter 6.2",
        door="https://openstax.org/details/books/chemistry-2e"
    ),
    Fact(
        topic="arrhenius equation",
        comment="kinetic equation k equals A times e to the power negative E_a divided by RT relating reaction rate constant k to activation energy E_a.",
        dewey="540", slug="chemistry", chapter="chapter 7.1",
        door="https://openstax.org/details/books/chemistry-2e"
    ),

    # Chapter 7 & 8: Acids, Bases & Electrochemistry
    Fact(
        topic="ph definition",
        comment="quantitative measure of solution acidity defined mathematically as negative logarithm base 10 of hydronium ion activity.",
        dewey="540", slug="chemistry", chapter="chapter 8.1",
        door="https://openstax.org/details/books/chemistry-2e", kind="definition"
    ),
    Fact(
        topic="bronsted lowry acid base definition",
        comment="acid is a proton donor and base is a proton acceptor in chemical proton transfer reactions.",
        dewey="540", slug="chemistry", chapter="chapter 8.1",
        door="https://openstax.org/details/books/chemistry-2e"
    ),
    Fact(
        topic="redox reaction",
        comment="chemical process involving concurrent reduction where a species gains electrons and oxidation where a species loses electrons.",
        dewey="540", slug="chemistry", chapter="chapter 9.1",
        door="https://openstax.org/details/books/chemistry-2e", kind="definition"
    ),
    Fact(
        topic="faraday constant",
        comment="magnitude of electric charge per mole of electrons equal to elementary charge times Avogadro constant, approximately 96485.33 coulombs per mole.",
        dewey="540", slug="chemistry", chapter="chapter 9.2",
        door="https://physics.nist.gov/cuu/Constants/"
    ),
]

EARTH_SCIENCES_FACTS = [
    # Chapter 1: Earth Internal Structure & Geophysics
    Fact(
        topic="earth layered internal structure",
        comment="concentric spherical geospheres consisting of silicate crust, solid peridotite mantle, liquid iron-nickel outer core, and solid iron inner core.",
        dewey="550", slug="earth_sciences", chapter="chapter 1.1",
        door="https://www.usgs.gov/"
    ),
    Fact(
        topic="mohorovicic discontinuity",
        comment="seismic boundary marking compositional transition between Earth silica-rich crust and underlying denser peridotite mantle.",
        dewey="550", slug="earth_sciences", chapter="chapter 1.2",
        door="https://www.usgs.gov/", kind="definition"
    ),
    Fact(
        topic="geomagnetic geodynamo",
        comment="convective circulation of molten liquid iron-nickel in outer core generating Earth protective planetary dipole magnetic field.",
        dewey="550", slug="earth_sciences", chapter="chapter 1.3",
        door="https://www.usgs.gov/", kind="definition"
    ),

    # Chapter 2: Plate Tectonics & Structural Geology
    Fact(
        topic="plate tectonics theory",
        comment="geological model establishing that Earth lithosphere is fragmented into rigid plates moving over ductile asthenosphere.",
        dewey="550", slug="earth_sciences", chapter="chapter 2.1",
        door="https://www.usgs.gov/", kind="definition"
    ),
    Fact(
        topic="subduction zone",
        comment="convergent plate boundary where denser oceanic lithosphere sinks beneath buoyant continental or younger oceanic plate into mantle.",
        dewey="550", slug="earth_sciences", chapter="chapter 2.2",
        door="https://www.usgs.gov/", kind="definition"
    ),
    Fact(
        topic="mid ocean ridge spreading",
        comment="divergent plate boundary where upwelling mantle decompressively melts creating new basaltic oceanic crust along rift axis.",
        dewey="550", slug="earth_sciences", chapter="chapter 2.3",
        door="https://www.usgs.gov/"
    ),
    Fact(
        topic="seismic body waves",
        comment="primary P-waves are longitudinal compressional waves traveling through solid and liquid; secondary S-waves are transverse shear waves traversing solids only.",
        dewey="550", slug="earth_sciences", chapter="chapter 2.4",
        door="https://www.usgs.gov/"
    ),

    # Chapter 3: Mineralogy & The Rock Cycle
    Fact(
        topic="geological rock cycle",
        comment="continuous geodynamic cycle transforming rock matter between igneous crystallization, sedimentary deposition and lithification, and metamorphic recrystallization.",
        dewey="550", slug="earth_sciences", chapter="chapter 3.1",
        door="https://www.usgs.gov/", kind="definition"
    ),
    Fact(
        topic="law of superposition",
        comment="stratigraphic principle stating that in undeformed sedimentary rock strata, older layers lie beneath younger overlying beds.",
        dewey="550", slug="earth_sciences", chapter="chapter 3.2",
        door="https://www.usgs.gov/"
    ),

    # Chapter 4 & 5: Atmospheric Structure & Dynamic Meteorology
    Fact(
        topic="atmospheric layers",
        comment="thermal stratification comprising troposphere, stratosphere containing protective ozone layer, mesosphere, and thermosphere.",
        dewey="550", slug="earth_sciences", chapter="chapter 4.1",
        door="https://www.noaa.gov/"
    ),
    Fact(
        topic="coriolis acceleration in meteorology",
        comment="apparent deflection produced by Earth rotation deflecting moving air parcels to right in Northern Hemisphere and left in Southern Hemisphere.",
        dewey="550", slug="earth_sciences", chapter="chapter 5.1",
        door="https://www.noaa.gov/"
    ),
    Fact(
        topic="geostrophic wind balance",
        comment="theoretical horizontal atmospheric wind resulting from exact balance between horizontal pressure gradient force and Coriolis force.",
        dewey="550", slug="earth_sciences", chapter="chapter 5.2",
        door="https://www.noaa.gov/", kind="definition"
    ),
    Fact(
        topic="hydrological cycle water budget",
        comment="planetary freshwater constitutes 2.5 percent of total hydrosphere, with 68.7 percent in glaciers and ice caps, 30.1 percent in groundwater, and 1.2 percent in surface water.",
        dewey="550", slug="earth_sciences", chapter="chapter 6.1",
        door="https://www.usgs.gov/"
    ),
]

BIOLOGY_FACTS = [
    # Chapter 1 & 2: Foundations & Molecular Scale
    Fact(
        topic="cell theory principles",
        comment="all living organisms are composed of one or more cells, cell is fundamental functional unit of life, and all cells arise from pre-existing cells.",
        dewey="570", slug="biology", chapter="chapter 1.1",
        door="https://openstax.org/details/books/biology-2e"
    ),
    Fact(
        topic="dna double helix architecture",
        comment="watson crick model of antiparallel polynucleotide chains wound around common helical axis held by complementary Watson-Crick hydrogen base pairing.",
        dewey="570", slug="biology", chapter="chapter 2.1",
        door="https://openstax.org/details/books/biology-2e"
    ),
    Fact(
        topic="dna complementary base pairing",
        comment="adenine pairs strictly with thymine via two hydrogen bonds, and guanine pairs strictly with cytosine via three hydrogen bonds.",
        dewey="570", slug="biology", chapter="chapter 2.1",
        door="https://openstax.org/details/books/biology-2e"
    ),

    # Chapter 3 & 4: Cellular Architecture & The Central Dogma
    Fact(
        topic="fluid mosaic membrane model",
        comment="biological membranes consist of phospholipid bilayer with hydrophobic interior and hydrophilic surfaces studded with laterally diffusing integral proteins.",
        dewey="570", slug="biology", chapter="chapter 3.1",
        door="https://openstax.org/details/books/biology-2e", kind="definition"
    ),
    Fact(
        topic="central dogma of molecular biology",
        comment="framework describing directional flow of sequential genetic information from DNA to RNA transcripts to functional proteins.",
        dewey="570", slug="biology", chapter="chapter 4.1",
        door="https://openstax.org/details/books/biology-2e"
    ),
    Fact(
        topic="universal genetic code",
        comment="64 triplet mRNA codons translate into 20 standard protein amino acids with AUG serving as methionine start codon and UAA, UAG, UGA as stop signals.",
        dewey="570", slug="biology", chapter="chapter 4.2",
        door="https://openstax.org/details/books/biology-2e"
    ),

    # Chapter 5 & 6: Genetics, Respiration & Photosynthesis
    Fact(
        topic="mendel law of segregation",
        comment="two alleles for each gene segregate during gamete formation in meiosis so each gamete carries only one allele.",
        dewey="570", slug="biology", chapter="chapter 5.1",
        door="https://openstax.org/details/books/biology-2e"
    ),
    Fact(
        topic="mendel law of independent assortment",
        comment="alleles of two or more different genes sort independently into gametes during gamete formation provided genes are unlinked.",
        dewey="570", slug="biology", chapter="chapter 5.1",
        door="https://openstax.org/details/books/biology-2e"
    ),
    Fact(
        topic="cellular respiration atp yield",
        comment="catabolic oxidation of one glucose molecule yields approximately 30 to 32 ATP through glycolysis, citric acid cycle, and oxidative phosphorylation.",
        dewey="570", slug="biology", chapter="chapter 6.1",
        door="https://openstax.org/details/books/biology-2e"
    ),
    Fact(
        topic="atp synthase rotary mechanism",
        comment="membrane enzyme complex utilizing transmembrane proton motive gradient to mechanically rotate gamma subunit and synthesize ATP from ADP and phosphate.",
        dewey="570", slug="biology", chapter="chapter 6.2",
        door="https://openstax.org/details/books/biology-2e"
    ),
    Fact(
        topic="photosynthetic light reactions",
        comment="photochemical process in chloroplast thylakoid membranes splitting water molecules to release oxygen and generate ATP and NADPH.",
        dewey="570", slug="biology", chapter="chapter 6.3",
        door="https://openstax.org/details/books/biology-2e"
    ),
    Fact(
        topic="rubisco carbon fixation",
        comment="ribulose-1,5-bisphosphate carboxylase oxygenase catalyzes primary rate limiting carbon dioxide fixation step in photosynthetic Calvin cycle.",
        dewey="570", slug="biology", chapter="chapter 6.4",
        door="https://openstax.org/details/books/biology-2e"
    ),

    # Chapter 7: Evolution by Natural Selection
    Fact(
        topic="natural selection mechanism",
        comment="differential survival and reproduction of individuals due to phenotypic trait differences that enhance reproductive fitness in specific environments.",
        dewey="570", slug="biology", chapter="chapter 7.1",
        door="https://openstax.org/details/books/biology-2e"
    ),
]
