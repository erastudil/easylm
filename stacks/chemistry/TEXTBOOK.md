---
title: "chemistry — undergrad textbook"
date: "2026-09-13"
status: living · undergrad · the-stacks
home: "stacks/chemistry/"
related:
  - "../physics/"
  - "../math/"
  - "../biology/"
---

# Chemistry & Molecular Systems — Atomic Architecture, Chemical Bonding, Thermodynamics & Reaction Dynamics

A comprehensive undergraduate textbook exploring the transformation of matter: quantum mechanical atomic orbitals, periodic trends, chemical bonding and molecular geometry, stoichiometry and the mole concept, thermodynamics ($\Delta H, \Delta S, \Delta G$), reaction kinetics and catalysis, dynamic chemical equilibrium, acid-base systems, electrochemistry, and organic reaction mechanisms.

---

## 0. Syllabus & Structural Map

As Richard Feynman famously observed, if all scientific knowledge were lost in a cataclysm and only one sentence survived, the most profound truth would be: *all things are made of atoms—little particles that move around in perpetual motion, attracting each other when slightly separated, but repelling upon being squeezed together.* 

Chemistry is the science of that interaction. It is the physics of the electron cloud. Every property of matter—the transparency of glass, the sweetness of sugar, the explosive energy of rocket fuel, and the folding of life-giving enzymes—emerges from the electrostatic forces between atomic nuclei and valence electrons seeking lowest-energy configurations.

```
+---------------------------------------------------------------------------------------------------+
|                                     THE MOLECULAR SPECTRUM                                        |
+---------------------------------------------------------------------------------------------------+
|  ATOMIC STRUCTURE (Orbitals)  | Quantum Numbers (n, l, m, s) · Pauli Exclusion · Aufbau Principle |
+-------------------------------+-------------------------------------------------------------------+
|  BONDING & GEOMETRY (Shapes)  | Covalent, Ionic & Metallic · Lewis Structures · VSEPR & Hybrid    |
+-------------------------------+-------------------------------------------------------------------+
|  STOICHIOMETRY (The Bridge)   | The Mole (Avogadro's Constant) · Limiting Reactants · Percent Yield|
+-------------------------------+-------------------------------------------------------------------+
|  STATES OF MATTER (Phases)    | Ideal Gas Law (PV=nRT) · Intermolecular Forces · Phase Diagrams   |
+-------------------------------+-------------------------------------------------------------------+
|  THERMODYNAMICS (Enthalpy)    | 1st/2nd Laws · Hess's Law · Entropy (ΔS) · Gibbs Free Energy (ΔG) |
+-------------------------------+-------------------------------------------------------------------+
|  KINETICS (The Clock)         | Rate Laws · Arrhenius Equation · Activation Energy · Catalysis    |
+-------------------------------+-------------------------------------------------------------------+
|  EQUILIBRIUM (The Balance)    | Law of Mass Action (K_eq) · Le Chatelier's Principle · ICE Tables |
+-------------------------------+-------------------------------------------------------------------+
|  ACID-BASE & REDOX (Transfer) | Brønsted-Lowry · pH Scales · Buffers · Galvanic Cells & Nernst Eq |
+-------------------------------+-------------------------------------------------------------------+
|  ORGANIC ARCHITECTURE (Carbon)| Functional Groups · Isomerism · Nucleophilic / Electrophilic Mech |
+---------------------------------------------------------------------------------------------------+
```

### Table of Contents

1. [Chapter 1: The Atomic Hypothesis and the First Principles of Chemistry](#1-what-chemistry-is)
2. [Chapter 2: Atomic Architecture, Orbitals, and the Periodic Table](#2-atoms-isotopes-the-table)
3. [Chapter 3: The Mole Bridge, Molar Mass, and Concentration](#3-mole-molar-mass-concentration)
4. [Chapter 4: Chemical Bonding, Electronegativity, and Molecular Geometry](#4-bonds-and-shape)
5. [Chapter 5: Stoichiometry: Conservation of Mass and Limiting Reactants](#5-balance-limiting-reagent-yield)
6. [Chapter 6: States of Matter: Gases, Solutions, and Phase Transitions](#6-gas-solution-phase)
7. [Chapter 7: Thermochemistry: Enthalpy, Entropy, and Gibbs Free Energy](#7-heat-of-reaction-how-fast)
8. [Chapter 8: Chemical Equilibrium: The Dynamic Tug-of-War](#8-k-le-chatelier)
9. [Chapter 9: Aqueous Equilibria: Acids, Bases, and Buffer Systems](#9-acids-bases-ph)
10. [Chapter 10: Electrochemistry: Redox Reactions and Electrochemical Cells](#10-redox-cells)
11. [Chapter 11: Organic Chemistry: The Endless Architecture of Carbon](#11-carbon-skeletons-polymers)
12. [Chapter 12: Laboratory Safety, Chemical Hazards, and Epistemic Limits](#12-is-this-safe)
13. [Chapter 13: Computational Chemistry and Authoritative Standards (NIST, IUPAC)](#13-compute--tables)
14. [Chapter 14: Systematic Problem-Solving in Chemical Systems](#14-stuck-on-a-problem)

---

## 1. what chemistry is

chemistry is what **matter** is made of and how it **changes**. the countable unit is the **mole**. an answer names:

1. the **species** (atoms, ions, molecules, phases)
2. the **change** (reaction, phase, electron transfer, proton transfer)
3. the **count** (moles, not grams first)
4. the **conditions** (T, p, solvent, open vs closed)
5. the **check** (atoms, charge, units, limiting reagent)

four questions, every time:

1. what **species**?
2. is the equation **balanced** (atoms and charge)?
3. what is **limiting**?
4. is this **stoich, thermo, equilibrium, acid-base, redox, or organic**?

**macro vs micro.** grams and liters are what you weigh. moles and molecules are what the equation is about. conversion between them is ch 3.

**model.** ideal gas, dilute aqueous, strong acid, elementary step — each has a domain. outside the domain, fetch a better model (van der waals, activity, mechanism).

**check:** if you cannot name the species and the balanced equation, you are not ready to compute a mass.

---

## 2. atoms and the periodic table

an **atom** has Z protons (atomic number), a mass number A = Z + neutrons, and electrons that make it neutral or an ion. **isotopes** of an element share Z and differ in neutrons. chemical behavior is mostly Z and the valence electrons; nuclear mass matters for molar mass and for spectroscopy.

**nuclide notation.** \(^{A}_{Z}\mathrm{X}\) names the isotope. number of neutrons = A − Z. a **neutral atom** has Z electrons. a cation has fewer; an anion has more. write the charge on the species (`Fe^{2+}`, `Cl^{-}`), not as a vibe about “iron-ness.”

**electron configuration** (undergrad): shells and subshells, aufbau as a first sketch, pauli, hund. fill order is a sketch of ground-state occupancy, not a law of every ion. exceptions exist; fetch a named configuration rather than forcing the sketch. valence electrons are the ones that do chemistry; core electrons mostly do not.

**periodic table** is a map of Z, groups (valence pattern), periods (shell). groups 1 and 2 and 13–18 (IUPAC numbering) carry the main-group story; d-block is the transition metals; f-block the lanthanoids/actinoids. trends to name, values to **fetch** (OpenStax / a table door): atomic radius, ionization energy, electron affinity, electronegativity. do not recite a Pauling number from memory.

**standard atomic weights** are CIAAW/IUPAC recommended values for normal terrestrial material. some elements are **intervals** (H, C, Li, …) because isotopic composition varies. for a precise mass, fetch **CIAAW**. a bottle’s certificate beats the table if they disagree.

**ions.** metals tend to lose electrons (cations); nonmetals tend to gain (anions). polyatomic ions are named species — fetch the formula if you cannot write it without guessing. isoelectronic species share an electron count; they need not share chemistry.

physics pack owns nuclei as particles and spectra as QM. this pack owns the *chemical* atom: valence, table, mole.

---

## 3. the mole and measurement

the **mole** is an SI base unit. it counts specified entities (atoms, molecules, ions, electrons, formula units). **N_A** (Avogadro constant) is a defining constant of the 2019 SI. do not improvise digits: fetch **NIST** CODATA at https://physics.nist.gov/cuu/Constants/ then do arithmetic with EasyLM calc.

**molar mass** M: mass per mole of the specified entity, from CIAAW weights (or a bottle assay). lab units often g/mol, which is the same size as kg/kmol. **n = m / M**. invert: m = n M. entity must match: molar mass of O is not molar mass of O2.

**amount concentration.** amount concentration c = n / V of solution. the old name **molarity** with symbol M meaning mol/L is still lab speech; say T if it matters (volume of the solution depends on T). **molality** b = n(solute) / mass(solvent in kg) — use when T-independence matters. **mole fraction** x_i = n_i / n_total. **mass percent** is 100 × m_i / m_total. these are different numbers; name which.

worked method (dilution, conservation of solute amount):

1. name the solute.
2. n is the same before and after if you only add solvent: n = c1 V1 = c2 V2.
3. put the stated volumes and concentrations into EasyLM calc. do not convert mL in your head if you might drop a factor of 1000 — use EasyLM units.

**SI.** chemistry shares m, kg, s, K, mol, A, cd with physics. dimensional check still applies. **R** (molar gas constant) and **F** (Faraday constant): fetch NIST. do not mix cal and J in one line without converting (EasyLM units).

**measurement.** a mass to three decimals is not three decimals of moles unless M is that good. propagate the uncertainty you actually have. significant figures follow the data, not a vibe.

**check:** entity named? n before m? concentration kind named?

---

## 4. bonding and molecular shape

**chemical bond:** a lasting arrangement of nuclei and electrons with a lower energy than the separated pieces, on the chemical time scale.

three undergrad sketches:

| kind | picture |
|---|---|
| **ionic** | electron transfer; lattice of ions. metals + nonmetals is the cartoon, not a law |
| **covalent** | shared electron pair. polarity when the atoms differ |
| **metallic** | delocalized electrons in a lattice of cations |

**lewis** structures are bookkeeping: count valence electrons for the species (watch the charge), place a skeleton, complete octets (hydrogen duet), then multiple bonds if needed. **formal charge** = (valence electrons on the free atom) − (nonbonding electrons) − (½ of bonding electrons). rank candidate structures by small formal charges and negative charge on the more electronegative atom. exceptions (odd electron, expanded octet, electron deficient) exist — fetch the named molecule.

**VSEPR** predicts shape from electron-pair domains around a central atom. two domains: linear. three: trigonal planar (bent if one is a lone pair). four: tetrahedral (trigonal pyramidal or bent if lone pairs). five: trigonal bipyramidal family. six: octahedral family. electron-domain geometry ≠ molecular geometry when lone pairs occupy domains. bond-angle tables: fetch OpenStax. a sketch is not a crystal structure.

**polarity.** a bond is polar when the two atoms differ in electronegativity. a **molecule** is polar if the vector sum of bond dipoles is nonzero. shape decides: CO2 is linear and the bond dipoles cancel; H2O is bent and they do not. do not dump a dipole moment in debye from memory — fetch NIST webbook if you need the number.

**bond order, length, strength (qualitative).** more shared pairs → shorter, stronger, as a trend. bond enthalpies in tables are **averages** over molecules; they estimate, they do not beat a webbook ΔHf for a named reaction.

**intermolecular.** hydrogen bonding (H on N/O/F toward a lone pair), dipole–dipole, dispersion. they set boiling-point and solubility *trends*. values: NIST webbook. “like dissolves like” is a polarity heuristic, not a calculation.

**beyond lewis.** valence bond / hybridization (sp, sp2, sp3 as names for domain counts 2, 3, 4), MO theory: later course. enough undergrad: lewis + VSEPR + polarity get you through general chemistry; organic will demand them fluently.

**check:** electron count, formal charge, domain count, then polarity.

---

## 5. reactions and stoichiometry

a **chemical reaction** rearranges atoms into new species. the **equation** is the map.

**balance:** atoms in = atoms out. charge in = charge out (including e⁻ in half-reactions). states (s)(l)(g)(aq) change what “exists” and what K looks like. if you omit them, K and thermo later will lie.

worked balance (inspection, combustion of propane as a type):

1. write formulas you actually have, not names.
2. balance C, then H, then O (O2 last is the usual combustion move).
3. clear fractions by multiplying through.
4. check every element and the charge.

example skeleton: `C3H8 + O2 → CO2 + H2O` balances to `C3H8 + 5 O2 → 3 CO2 + 4 H2O`. count: C 3=3, H 8=8, O 10=10.

**stoichiometry** is mole ratios from the balanced equation. grams are not the ratio. map:

grams A → moles A (÷ M_A) → moles B (× coefficient B / coefficient A) → grams B (× M_B)

M from CIAAW / the bottle. arithmetic with EasyLM calc. never skip the mole step.

**limiting reagent:** the reactant that runs out. the other is excess.

worked method:

1. convert each given mass (or volume of gas/solution) to moles.
2. divide each mole amount by its coefficient.
3. the smallest ratio is limiting.
4. theoretical product moles = (limiting moles) × (coeff product / coeff limiting).
5. leftover excess = starting excess moles − moles consumed.

example with stated amounts (no invented M): 2.00 mol H2 and 2.00 mol O2 for `2 H2 + O2 → 2 H2O`. ratios: H2 / 2 = 1.00; O2 / 1 = 2.00. H2 limits. water produced = 2.00 mol. O2 leftover = 2.00 − 1.00 = 1.00 mol.

**percent yield:** actual / theoretical, as a fraction or percent. theoretical is from the limiting reagent, not from whichever bottle looks bigger. a yield over 100% is a measurement or identity problem, not a miracle. **percent by mass composition** of a compound is n_element × M_element / M_compound; empirical formula from mass percents is the reverse (assume 100 g, convert to moles, divide by smallest, clear to integers).

**reaction types** to recognize: combination, decomposition, single replacement, double replacement (including precipitation), combustion, acid-base, redox. the type is a label; the balanced equation is the work.

**net ionic.** in aqueous ionic reactions, strong electrolytes are written as ions; spectator ions drop. write the species that actually change. solubility of a named salt: fetch a table; do not guess “all nitrates” from a half-remembered rule if the job cares — then fetch OpenStax solubility rules and still treat them as a first cut, not a measurement.

---

## 6. gases, solutions, phases

**ideal gas:** `p V = n R T`. assumptions: point particles, no interactions, elastic collisions — good when the gas is dilute and far from condensation. **R**: fetch NIST (https://physics.nist.gov/cuu/Constants/). T is absolute (K). Celsius to kelvin is definitional: T/K = t/°C + 273.15. convert other pressure and volume units with EasyLM units. do not mix torr, atm, and Pa in one equation without converting.

rearrangements you will use: n = pV / RT; density ρ = m/V = p M / R T for an ideal gas of molar mass M. **standard pressure and temperature** for a gas table: say which standard (IUPAC vs old “STP” vs SATP). they are not the same; fetch the table’s footnote.

**dalton:** total pressure is the sum of partial pressures of non-reacting ideal gases. p_i = x_i p_total. collecting a gas over water: p_gas = p_total − p_water(T); p_water is a fetch (webbook), not a remembered 23 torr.

**real gases.** at high p / low T, fetch a better EOS (van der waals, virial) and the constants for *that* gas (NIST webbook fluids).

**phases.** solid, liquid, gas, and aqueous as a named mixture. a **phase change** at constant p eats or gives latent heat; temperature does not climb through the plateau. heating curves: qualitative here; numbers from webbook. **phase diagram:** solid/liquid/gas regions, fusion and vaporization curves, critical point, triple point as names. a named substance’s triple point: fetch.

**solutions.** solute in solvent. dilute aqueous is the general-chemistry default. **solubility** is a measured equilibrium (Ksp later). concentration: ch 3. colligative properties (vapor-pressure lowering, boiling-point elevation, freezing-point depression, osmotic pressure): fetch OpenStax for the formulas and the van ’t Hoff factor; do not invent Kb of water.

**electrolytes.** strong: essentially fully dissociated in the dilute-water story. weak: equilibrium. nonelectrolyte: no ions. this split drives ch 9–10.

**check:** T in K. R from NIST. which concentration. real vs ideal.

---

## 7. thermochemistry and kinetics

**thermochemistry** is the heat of chemical change. **ΔH** (enthalpy change) at constant pressure is the usual lab number. **exothermic** ΔH < 0 (system releases heat). **endothermic** ΔH > 0. sign convention: state it. physics pack first law still holds; here the system is the reaction.

**first-law bookkeeping for a reaction.** ΔU = q + w with the sign convention stated (physics pack). at constant pressure, q_p = ΔH. at constant volume, q_v = ΔU. they differ by the pΔV work of gases; for ideal-gas mole change, ΔH = ΔU + Δn_g R T (derivation in OpenStax; R from NIST; Δn_g from the balanced equation).

**hess’s law:** ΔH is a state function. add reactions, add ΔH. formation enthalpies ΔHf°: fetch **NIST webbook**. bond enthalpies are averages, useful for estimates, worse than webbook ΔHf.

worked Hess move: reverse a formation reaction → change the sign of ΔH; multiply a reaction by n → multiply ΔH by n; add. the target reaction’s ΔH is the sum.

**calorimetry** measures q. q = m c ΔT for a single phase with no phase change; c is a fetch. bomb vs coffee-cup: constant V vs constant p. the calorimeter constant (energy per kelvin of the apparatus) is measured, not guessed.

**spontaneity** is ΔG, not ΔH. ΔG = ΔH − TΔS (constant T). negative ΔG is the direction a process can go *under the stated conditions*. a slow reaction can still have ΔG < 0. that is why kinetics is a separate half of this chapter. ΔG° refers to the standard state; ΔG at other Q is ΔG = ΔG° + RT ln Q (log form: fetch OpenStax; R from NIST).

**kinetics** is how fast. **rate law** is experimental: rate = k [A]^m [B]^n with m, n from data, not from stoich unless the step is elementary. **k** depends on T (Arrhenius: k = A e^{−Ea/RT}; Ea and A from a plot or a table, not from memory). **activation energy** Ea is the barrier. **catalyst** lowers the barrier for *both* directions; it does not change K or ΔG_rxn. **rate ≠ equilibrium**.

integrated rate laws (undergrad): zeroth, first, second order have different plots that are linear. half-life of a first-order process is ln 2 / k — ln 2 is math; k is data. do not steal a half-life from a different order.

mechanisms: elementary steps that sum to the net reaction. the slow step dominates the rate law. intermediates are not in the net equation. enzymes are biological catalysts (biology pack).

---

## 8. chemical equilibrium

many reactions do not “finish.” **equilibrium** is when forward and reverse rates are equal. amounts stop changing; both species are still there.

**K** is the equilibrium constant, a number **at a stated T**, built from the balanced equation. gases: often Kp in partial pressures; aqueous: Kc in concentrations, later activities. **pure solids and pure liquids do not appear** in the usual K expression. if you put them in, you are not using the general-chemistry convention.

example form (do not invent a number): for `a A(g) + b B(g) ⇌ c C(g) + d D(g)`, Kp is built from partial pressures raised to the stoichiometric powers. Kc analogously from concentrations. relation Kp vs Kc involves (RT)^{Δn}; R from NIST; do the exponent with EasyLM calc.

**Q** is the same expression with the current amounts. Q < K → net forward. Q > K → net reverse. Q = K → at equilibrium.

**ICE table** (initial, change, equilibrium) is the worked method:

1. write the balanced equation.
2. row I: initial moles or concentrations (gases: sometimes p).
3. row C: change is −x times coefficient on reactants, +x on products (or the reverse if Q > K).
4. row E: add.
5. plug E into K and solve. quadratic formula is math pack + EasyLM calc. approximation x ≪ initial is a check after, not a religion.

**le chatelier:** stress → shift. add a product, net reverse. add a reactant, net forward. change volume of a gas system: the side with more gas moles is favored by expansion. raise T: treat heat as a product if exo, a reactant if endo — **K itself changes with T**. a catalyst does **not** shift K; it only gets you there faster. inert gas at constant volume does not change partial pressures of the reactants; at constant pressure it dilutes them — say which.

**K from ΔG°.** the relation is a thermo identity (ΔG° = −RT ln K); fetch OpenStax for the exact log form and the standard state. do not invent a numerical K.

multiple equilibria (solubility + acid, buffers): stack K expressions. **Ksp** is K for dissolving a sparingly soluble ionic solid. do not invent a Ksp. common-ion effect: extra ion from another source lowers solubility of the salt that shares it (le chatelier on the dissolve equation).

---

## 9. acids, bases, pH

**acid–base** is proton transfer (Brønsted–Lowry) in the water story that general chemistry uses. acid donates H+; base accepts H+. the **conjugate** of an acid is what remains after the proton leaves. Lewis (electron pair) is the wider net; organic will need it. Arrhenius (H+ / OH− in water) is the narrow historical cut.

**strong vs weak.** strong acids/bases: treat as fully dissociated in the dilute-water story (named list: fetch OpenStax — do not guess whether HNO3 is strong). weak: Ka or Kb equilibrium. for a conjugate pair, Ka × Kb = Kw at that T.

**pH:** `pH = −log₁₀ a(H+)` ; the dilute-aqueous working form is `pH = −log₁₀[H+]`. pOH analogously. in that story, pH + pOH = 14 only when Kw matches that T. **Kw is T-dependent.** fetch the value at the T you have. do not assume 1.0×10⁻¹⁴ at every temperature.

worked strong-acid method (stated concentration): a strong monoprotic acid at 0.010 mol/L, dilute-water story, complete dissociation → [H+] = 0.010 mol/L → pH = −log10(0.010). pass that log to EasyLM calc. do not do the log in weights. if the acid is so dilute that water’s own H+ is comparable, you needed Kw and a better charge-balance — fetch the treatment.

worked weak-acid method: HA ⇌ H+ + A− with given Ka (from a table door, not memory). ICE as in ch 8. if you approximate [H+] ≈ √(Ka c0), check that x is small compared with c0 after. if not, quadratic.

**buffers.** weak acid + its conjugate base (or weak base + conjugate acid). they resist pH change. Henderson–Hasselbalch is an approximation: pH ≈ pKa + log10([A−]/[HA]). fetch the conditions (comparable amounts, not too dilute). do not invent a pKa. adding strong acid converts A− → HA; adding strong base converts HA → A−; then recompute the ratio.

**titration.** strong–strong is a stoich problem plus the water equilibrium at the equivalence point. weak–strong needs Ka. at half-equivalence for a weak acid, [HA] = [A−] and pH ≈ pKa under the usual approximation. indicators: fetch their range; they are themselves weak acids.

**polyprotic.** stepwise Ka1, Ka2, … fetch the table. the first step usually dominates if the K’s are well separated.

**check:** strong or weak? T on Kw? log via EasyLM calc? pKa from a door?

---

## 10. redox and electrochemistry

**redox:** oxidation is loss of electrons; reduction is gain. **oxidation numbers** are bookkeeping. working rules (apply in order; fetch OpenStax if a case fights you):

1. atoms in an element: 0.
2. monatomic ion: the charge.
3. fluorine in compounds: −1. oxygen usually −2 (peroxides −1; O2+ exceptions exist). hydrogen usually +1 (hydrides −1).
4. the sum over a species equals the charge of the species.

they are not ion charges except when they are.

**half-reactions.** oxidation and reduction written separately, then added so e⁻ cancel. **balance atoms and charge**, including H2O, H⁺ or OH⁻ in aqueous media. say acidic or basic.

worked aqueous acidic method:

1. split into halves.
2. balance atoms other than O and H.
3. add H2O for O, then H+ for H.
4. add e⁻ to balance charge.
5. multiply halves so e⁻ match; add; cancel spectators.

basic medium: do the acidic balance, then add OH− to both sides to neutralize H+, and cancel water.

**electrochemical cell.** oxidation at the **anode**, reduction at the **cathode**. electrons run in the external wire from anode to cathode. ions run in the electrolyte / salt bridge to keep charge neutrality. **E°** values: fetch a standard reduction potential table (OpenStax / a CRC-shaped door). do not remember E°(Cu²⁺/Cu). **E°_cell = E°_cathode − E°_anode** with both written as reductions, or add E°_ox + E°_red consistently — pick a convention and hold it. E°_cell > 0 (that convention) means the reaction as written is spontaneous under standard conditions.

**nernst** corrects E for nonstandard Q. formula: fetch OpenStax (the RT/nF form; R, F from NIST; T in K). the “0.0592 / n” classroom form is a special case at one T — do not treat it as a constant of nature. **ΔG° = −n F E°** (n moles of e⁻ per reaction as written; F from NIST).

**batteries, electrolysis, corrosion** are the same bookkeeping plus engineering. current and time give moles of e⁻ (Faraday). plating: n(e⁻) = I t / F, then stoich to metal moles. I in amperes is C/s; t in seconds; F from NIST; EasyLM calc for the quotient.

**check:** oxidation numbers before and after; e⁻ cancel; acidic vs basic; E° from a table.

---

## 11. organic chemistry and polymers

**organic** is the chemistry of carbon skeletons, with H, O, N, S, halogens, and a few others as the usual extras. carbon’s four bonds and catenation make the zoo.

**hydrocarbon frames:** alkane (single bonds), alkene (C=C), alkyne (C≡C), arene (aromatic ring). isomerism: constitutional (different connectivity), then stereo (cis/trans, E/Z, R/S) when the course needs it. **functional groups:** alcohol, carbonyl (aldehyde/ketone), carboxyl, amine, haloalkane, ether, ester, amide. the group is the reactivity. name the longest chain; the group suffix/prefix is IUPAC — fetch Gold Book / a nomenclature door if the name is the job.

**curly arrows** move electrons. nucleophile (electron pair donor) / electrophile (electron pair acceptor). undergrad map: addition, substitution, elimination, carbonyl addition, acid–base at heteroatoms. **SN1 / SN2, E1 / E2**: later organic course (MIT 5.12). this chapter only demands: name the group, don’t break carbon’s tetravalence without a reason, count hydrogens.

**aromaticity** (benzene as the type): extra stability, substitution not addition as the default. fetch 5.12 when that is the job.

**polymers:** repeating units. addition (olefin chain growth) vs condensation (small-molecule byproduct). plastics, proteins, nucleic acids, polysaccharides are polymers with different links. biology pack owns the living ones as function; this pack owns the repeat-unit chemistry.

**inorganic** rest of the table: coordination complexes, crystal-field as a later sketch, main-group patterns from the table. nuclear chemistry (decay, half-life): NNDC / physics; this pack only if the job is a radioisotope as a *reagent*.

---

## 12. safety

hazards are **facts on a page**, not vibes. if someone asks “is this safe,” treat it as serious.

| need | do |
|---|---|
| identity of a bottle | label + **PubChem** / CAS |
| workplace exposure, PPE, first aid | **NIOSH** pocket guide · **SDS** from the supplier |
| regulatory / hazcom | **OSHA** · **GHS** |
| lab procedure | trained human. this book does not run a hood |

do not invent an LD50, a flash point, or a “just dilute it.” do not write a synthesis that is an exploit of a person or a facility. no recipes for harm.

SDS beats wiki. a supplier SDS beats a random PDF. if fetch is empty → DONT_KNOW, and do not proceed as if it were water.

---

## 13. compute and tables

| job | do |
|---|---|
| arithmetic, logs (pH), algebra | **EasyLM calc** |
| unit conversion | **EasyLM units** |
| N_A, R, F, k, h | **NIST** CODATA https://physics.nist.gov/cuu/Constants/ |
| atomic weights | **CIAAW** |
| ΔHf, spectra, vapor pressure, fluids | **NIST webbook** |
| compound identity, structure | **PubChem** |
| terminology | **IUPAC gold book** |
| particle / nuclear | PDG / NNDC (physics pack) |
| hazard | SDS · NIOSH · OSHA |
| what is a mole, what is K | this book, then a door |

never do the stoich arithmetic in model weights. format expr. pass `result`. `ok` false → DONT_KNOW.

adjacent: `../physics/` (thermo, QM, SI) · `../math/` (logs, DE for rate laws) · `../biology/` (enzymes, metabolism). this pack owns species, the mole, and the reaction.

---

## 14. how to attack a problem

1. name the **species** and the **phase**.
2. write a **balanced** equation (atoms + charge).
3. mark **knowns / unknowns** with units. moles before grams.
4. ask which **chapter-tool**: stoich, gas, thermo, K, acid-base, redox, organic.
5. **limiting**? if two amounts, yes until proven otherwise.
6. **compute** with EasyLM calc / units. table values from CIAAW / webbook / OpenStax, not from weights.
7. **check:** atoms, charge, units, magnitude (pH of a strong acid is not 11), T on K and Kw.
8. named constant or Ka missing → fetch LINK_INDEX, cite.

stuck patterns:

| symptom | try |
|---|---|
| grams that ignore coefficients | you skipped moles |
| pH of a weak acid treated as strong | you needed Ka |
| K with solids in it | drop pure s and l |
| catalyst “shifts equilibrium” | it does not; it speeds both ways |
| ΔH as spontaneity | you wanted ΔG, and maybe kinetics |
| redox that will not balance | split halves; say acid or base |
| “safe because dilute” | fetch SDS |
| log or quadratic in weights | EasyLM calc |

---

## close

chemistry is species plus a balanced change plus a count. mole first. fetch the table. compute with EasyLM calc. LINK_INDEX.md is doors.

home: `stacks/chemistry/TEXTBOOK.md`
