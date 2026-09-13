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

## 1. The Atomic Hypothesis and the First Principles of Chemistry

### 1.1 The Mechanical Intuition: Feynman's Core Axiom

In his famous lectures on physics, Richard Feynman posed a fundamental question: if all scientific knowledge were erased in a cataclysm and only a single sentence could be passed to the next generation, what statement would convey the most information in the fewest words? The answer was:

> *"All things are made of atoms—little particles that move around in perpetual motion, attracting each other when they are a little distance apart, but repelling upon being squeezed into one another."*

Chemistry is the science that governs this attraction and repulsion. At its core, chemistry is not the rote memorization of colorful flames or obscure naming rules; it is the physical study of how atomic nuclei and their surrounding electrons seek lowest-energy configurations.

Every chemical transformation is governed by five foundational invariants:
1. **The Conservation of Mass & Nuclei:** In non-nuclear chemical reactions, atoms are neither created nor destroyed. The total number of atoms of each element entering a reaction equals the total number emerging from it.
2. **The Electrostatic Nature of the Chemical Bond:** Chemical forces are entirely electromagnetic. Negatively charged electrons are attracted to positively charged nuclei; when two atoms share or exchange electrons to achieve lower potential energy, a chemical bond forms.
3. **The Quantized Nature of the Electron Cloud:** Electrons do not orbit nuclei like planets in continuous solar systems. They occupy discrete, quantized energy states called **orbitals**, defined by solutions to the Schrödinger equation.
4. **The Thermodynamic Arrow:** Chemical reactions proceed spontaneously only if they increase the net entropy of the universe ($\Delta S_{\text{univ}} > 0$), manifested at constant temperature and pressure as a negative change in Gibbs free energy ($\Delta G < 0$).
5. **The Countable Bridge (The Mole):** Because atoms are infinitesimally small, macroscopic lab measurements (grams and liters) must be translated into discrete atomic counts via **Avogadro's Constant** ($N_A \approx 6.02214076 \times 10^{23}\text{ mol}^{-1}$).

---

## 2. Atomic Architecture, Orbitals & The Periodic Table

### 2.1 The Nuclear Core and Isotopes

An individual atom consists of a dense, positively charged nucleus surrounded by an electron cloud. The identity of an element is determined exclusively by its **atomic number** $Z$, the number of protons in its nucleus:
- **Mass Number ($A$):** The total count of nucleons: $A = Z + N$, where $N$ is the number of neutrons.
- **Nuclide Notation:** $^{A}_{Z}\text{X}$ denotes an isotope of element $\text{X}$. For example, $^{12}_{\phantom{0}6}\text{C}$ has 6 protons and 6 neutrons, while $^{14}_{\phantom{0}6}\text{C}$ has 6 protons and 8 neutrons.
- **Isotopes:** Atoms with identical $Z$ (same chemical element) but differing $N$. Because chemical behavior is determined by the valence electrons, isotopes exhibit nearly identical chemical reactivity, but differ in mass, nuclear stability (radioactivity), and vibrational/rotational spectra.

### 2.2 Quantum Numbers and Orbital Architecture

Electrons occupy three-dimensional probability density distributions called **atomic orbitals**, defined by four quantum numbers:
1. **Principal Quantum Number ($n \in \{1, 2, 3, \dots\}$):** Dictates the main energy level and radial distance of the electron cloud from the nucleus.
2. **Azimuthal / Angular Momentum Quantum Number ($l \in \{0, 1, \dots, n-1\}$):** Dictates the geometric shape of the orbital ($l = 0 \rightarrow s\text{ (spherical)}$, $l = 1 \rightarrow p\text{ (dumbbell)}$, $l = 2 \rightarrow d\text{ (four-lobed)}$, $l = 3 \rightarrow f$).
3. **Magnetic Quantum Number ($m_l \in \{-l, \dots, 0, \dots, +l\}$):** Dictates the spatial orientation of the orbital in three dimensions ($2l + 1$ distinct orientations per subshell).
4. **Spin Magnetic Quantum Number ($m_s \in \{+\frac{1}{2}, -\frac{1}{2}\}$):** Dictates the intrinsic angular momentum of the electron.

```
Subshell Structure:
  s-subshell (l = 0):  1 orbital  --> Holds max  2 electrons
  p-subshell (l = 1):  3 orbitals --> Holds max  6 electrons
  d-subshell (l = 2):  5 orbitals --> Holds max 10 electrons
  f-subshell (l = 3):  7 orbitals --> Holds max 14 electrons
```

### 2.3 Electron Filling Principles

The electronic ground state of an atom is governed by three fundamental physical laws:
1. **The Aufbau Principle ("Building Up"):** Electrons fill subshells in order of increasing energy, generally approximated by the $(n + l)$ Madelung rule: $1s \rightarrow 2s \rightarrow 2p \rightarrow 3s \rightarrow 3p \rightarrow 4s \rightarrow 3d \rightarrow 4p \dots$
2. **The Pauli Exclusion Principle:** No two electrons in the same atom can possess the identical set of all four quantum numbers. Consequently, each spatial orbital ($n, l, m_l$) can hold a maximum of two electrons, and they must have opposite (anti-parallel) spins ($m_s = \pm 1/2$).
3. **Hund's Rule of Maximum Multiplicity:** For degenerate orbitals (orbitals of identical energy, such as the three $2p$ orbitals), electrons occupy separate orbitals singly with parallel spins before pairing up, minimizing electron-electron electrostatic repulsion.

### 2.4 Periodic Trends

The layout of the Periodic Table mirrors the quantum filling of subshells. Across periods and down groups, four foundational periodic trends emerge:
- **Effective Nuclear Charge ($Z_{\text{eff}}$):** The net positive nuclear charge experienced by valence electrons after accounting for the electrostatic shielding (screening) of inner core electrons: $Z_{\text{eff}} = Z - S$. $Z_{\text{eff}}$ increases steadily from left to right across a period.
- **Atomic Radius:** Decreases from left to right across a period because increasing $Z_{\text{eff}}$ pulls the electron cloud tighter toward the nucleus. Increases down a group as new principal quantum shells ($n$) are added.
- **Ionization Energy ($IE$):** The minimum energy required to remove the most loosely bound valence electron from an isolated gaseous atom: $\text{X}(g) \rightarrow \text{X}^+(g) + e^-$. Increases across a period; decreases down a group.
- **Electronegativity ($\chi$):** The dimensionless relative measure (Linus Pauling scale) of an atom's ability to attract shared electron density within a chemical bond. Fluorine is the most electronegative element ($\chi \approx 3.98$), while cesium and francium are the lowest ($\chi \approx 0.79$).

---

## 3. The Mole Bridge, Molar Mass & Solution Concentration

### 3.1 The Mole as the Macroscopic-to-Microscopic Bridge

Because individual atoms have masses on the order of $10^{-24}$ grams, chemical experiments cannot weigh single molecules. The **mole** (symbol: $\text{mol}$) is the SI base unit of amount of substance. 

By international definition (SI Redefinition of 2019), exactly one mole contains:
$$N_A = 6.02214076 \times 10^{23} \text{ elementary entities}$$

The numerical value is chosen so that the mass of exactly one mole of Carbon-12 ($^{12}\text{C}$) atoms is almost exactly 12 grams. Thus:
$$n = \frac{m}{M}$$
where:
- $n$ is the amount of substance in moles ($\text{mol}$).
- $m$ is the macroscopic sample mass in grams ($\text{g}$).
- $M$ is the molar mass in grams per mole ($\text{g}\cdot\text{mol}^{-1}$), obtained by summing standard atomic weights from the periodic table (CIAAW standards).

### 3.2 Quantitative Concentration in Aqueous Solutions

Chemical reactions in biology, industry, and laboratory synthesis frequently occur in liquid solutions. The composition of a solution is quantified using standard concentration metrics:

1. **Molarity (Amount Concentration, $c$ or $M$):** Moles of dissolved solute per liter of total solution:
   $$c = \frac{n_{\text{solute}}}{V_{\text{solution}}} \quad \left[\text{mol}\cdot\text{L}^{-1} \text{ or } \text{M}\right]$$
   *(Note: Because liquid volume expands with temperature, molarity varies slightly with temperature).*
2. **Molality ($b$ or $m$):** Moles of solute per kilogram of pure solvent:
   $$b = \frac{n_{\text{solute}}}{m_{\text{solvent}}} \quad \left[\text{mol}\cdot\text{kg}^{-1}\right]$$
   *(Temperature-independent; essential for thermodynamic and colligative calculations).*
3. **Mole Fraction ($x_i$):** Dimensionless ratio of moles of component $i$ to total moles in the mixture:
   $$x_i = \frac{n_i}{\sum_j n_j}$$
4. **Mass Percent:**
   $$\text{Mass } \% = \left(\frac{m_{\text{solute}}}{m_{\text{total solution}}}\right) \times 100\%$$

### 3.3 Conservation of Solute in Dilution

When pure solvent is added to a concentrated stock solution, the mass and amount of solute remain strictly conserved:
$$n_{\text{initial}} = n_{\text{final}} \implies c_1 V_1 = c_2 V_2$$

---

## 4. Chemical Bonding, Electronegativity & Molecular Geometry

### 4.1 The Three Classical Bonding Archetypes

Chemical bonding occurs when atoms lower their total electrostatic potential energy:
1. **Ionic Bonding ($\Delta \chi \gtrsim 2.0$):** Complete or near-complete transfer of valence electrons from an electropositive metal to an electronegative nonmetal, creating discrete cations and anions held together in an extended three-dimensional crystalline lattice by Coulombic attraction:
   $$E_{\text{Coulomb}} = -\frac{1}{4\pi\varepsilon_0} \frac{|z_1 z_2| e^2}{r}$$
2. **Covalent Bonding ($\Delta \chi \lesssim 1.7$):** Electrostatic attraction between two positive atomic nuclei and a shared pair of valence electrons localized between them. If $\Delta \chi = 0$, the bond is **nonpolar covalent**; if $0.4 < \Delta \chi < 1.7$, the bond is **polar covalent**, creating a permanent bond dipole moment $\boldsymbol{\mu} = q \cdot \mathbf{r}$.
3. **Metallic Bonding:** Positive metallic cation cores immersed in a delocalized, mobile "sea" of valence conduction electrons. This delocalization explains high electrical conductivity, thermal conductivity, and mechanical ductility.

### 4.2 Lewis Dot Structures and Formal Charge Bookkeeping

Lewis structures map the connectivity and valence electron distribution in covalent molecules:
- **The Octet Rule:** Main group elements (Periods 2 and 3) strive to achieve a noble gas valence shell of 8 electrons (hydrogen strives for a duet of 2).
- **Formal Charge ($FC$):** A bookkeeping tool that tracks hypothetical charge localization:
  $$FC = V - N - \frac{B}{2}$$
  where $V$ is valence electrons of the neutral free atom, $N$ is number of non-bonding lone pair electrons, and $B$ is number of shared bonding electrons.
- **Resonance:** When a single Lewis formula cannot accurately represent a molecule with delocalized $\pi$-electrons (such as the planar benzene ring $\text{C}_6\text{H}_6$ or carbonate ion $\text{CO}_3^{2-}$), the true electronic structure is a quantum superposition (resonance hybrid) of canonical contributing structures.

### 4.3 VSEPR Theory & 3D Molecular Geometry

The **Valence Shell Electron Pair Repulsion (VSEPR)** model posits that electron pairs (both bonding pairs and non-bonding lone pairs) surrounding a central atom repel each other electrostatically, adopting spatial orientations that maximize mutual distance.

```
Steric No.  Electron-Domain Shape     Lone Pairs   Molecular Geometry     Example
----------------------------------------------------------------------------------
    2       Linear (180°)                 0        Linear                 CO2, BeCl2
    3       Trigonal Planar (120°)        0        Trigonal Planar        BF3
                                          1        Bent (<120°)           SO2, NO2-
    4       Tetrahedral (109.5°)          0        Tetrahedral            CH4, CCl4
                                          1        Trigonal Pyramidal     NH3 (107°)
                                          2        Bent (<109.5°)         H2O (104.5°)
    5       Trigonal Bipyramidal          0        Trigonal Bipyramidal   PCl5
                                          1        Seesaw                 SF4
                                          2        T-Shaped               ClF3
                                          3        Linear                 XeF2
    6       Octahedral (90°)              0        Octahedral             SF6
                                          1        Square Pyramidal       BrF5
                                          2        Square Planar          XeF4
```

*Core Distinction:* Non-bonding lone pairs exert greater electrostatic repulsion than bonding pairs because they are anchored to only one nucleus. Consequently, lone pairs compress adjacent bond angles (e.g. the tetrahedral angle of $109.5^\circ$ in $\text{CH}_4$ shrinks to $107^\circ$ in $\text{NH}_3$ and $104.5^\circ$ in $\text{H}_2\text{O}$).

### 4.4 Intermolecular Forces (IMFs)

The bulk physical properties of liquids and solids (boiling point, vapor pressure, surface tension, viscosity) are dictated by intermolecular non-covalent forces:
1. **London Dispersion Forces:** Temporary, quantum-fluctuation induced dipole-induced dipole attractions present in all molecules. Strength scales with molecular polarizability and surface contact area.
2. **Dipole-Dipole Attractions:** Electrostatic attractions between the permanent dipoles of polar molecules.
3. **Hydrogen Bonding:** An unusually strong, highly directional dipole attraction occurring when hydrogen is covalently bonded to a small, highly electronegative atom ($\text{F}, \text{O}, \text{N}$) and interacts with a lone pair on an adjacent $\text{F}, \text{O}, \text{N}$ atom. Responsible for water's anomalously high boiling point, surface tension, and open crystalline ice structure.

---

## 5. Stoichiometry: Conservation of Mass & Limiting Reactants

### 5.1 Balancing Chemical Equations

A chemical equation represents the reorganization of atomic bonds:
$$a\text{A} + b\text{B} \longrightarrow c\text{C} + d\text{D}$$

Mass conservation requires that for every chemical element, the sum of atoms on the reactant side equals the sum on the product side.

*Inspection Balance Method (Combustion Example):*
$$\text{C}_3\text{H}_8(g) + \text{O}_2(g) \longrightarrow \text{CO}_2(g) + \text{H}_2\text{O}(g)$$
1. Balance Carbon: 3 carbons in propane $\implies 3\text{CO}_2$.
2. Balance Hydrogen: 8 hydrogens in propane $\implies 4\text{H}_2\text{O}$.
3. Balance Oxygen: Product side has $(3 \times 2) + (4 \times 1) = 10$ oxygen atoms $\implies 5\text{O}_2$.
4. Result: $\text{C}_3\text{H}_8(g) + 5\text{O}_2(g) \longrightarrow 3\text{CO}_2(g) + 4\text{H}_2\text{O}(g)$.

### 5.2 The Stoichiometric Highway & Limiting Reactants

Stoichiometric coefficients define molar ratios, *never* direct mass ratios. The universal problem-solving pathway is:
$$\text{Mass A (g)} \xrightarrow{\div M_A} \text{Moles A} \xrightarrow{\times \frac{c}{a}} \text{Moles C} \xrightarrow{\times M_C} \text{Mass C (g)}$$

**Identifying the Limiting Reactant:**
When two or more reactants are mixed in arbitrary quantities, one reactant will be exhausted first, halting the reaction:
1. Convert the starting mass of each reactant into moles ($n_i$).
2. Divide each molar amount by its stoichiometric coefficient: $\frac{n_i}{\nu_i}$.
3. The species with the smallest ratio $\frac{n_i}{\nu_i}$ is the **limiting reactant**.
4. All theoretical yields must be computed strictly from the moles of this limiting reactant.
5. **Percent Yield:**
   $$\text{Percent Yield} = \left(\frac{\text{Actual Experimental Yield}}{\text{Theoretical Stoichiometric Yield}}\right) \times 100\%$$

---

## 6. States of Matter: Ideal & Real Gases, Solutions & Phase Transitions

### 6.1 The Ideal Gas Law

At low pressures and high temperatures, gases behave as collections of non-interacting point particles undergoing elastic collisions. The state of an ideal gas is governed by:
$$P V = n R T$$
where:
- $P$ is absolute pressure ($\text{Pa} = \text{N}\cdot\text{m}^{-2}$ or $\text{atm}$, where $1\text{ atm} = 101,325\text{ Pa}$).
- $V$ is volume ($\text{m}^3$ or $\text{L}$).
- $n$ is amount of gas ($\text{mol}$).
- $T$ is thermodynamic temperature in Kelvin ($T/\text{K} = t/^\circ\text{C} + 273.15$).
- $R$ is the universal gas constant ($R = 8.314462618\text{ J}\cdot\text{mol}^{-1}\cdot\text{K}^{-1} = 0.082057\text{ L}\cdot\text{atm}\cdot\text{mol}^{-1}\cdot\text{K}^{-1}$).

### 6.2 Dalton's Law of Partial Pressures

In a mixture of non-reacting ideal gases, each gas exerts a partial pressure equal to the pressure it would exert if it occupied the entire container alone:
$$P_{\text{total}} = \sum_{i} P_i, \quad \text{where } P_i = x_i P_{\text{total}}$$

### 6.3 Deviations in Real Gases: The Van der Waals Equation

At high pressures (molecules crowded close together) and low temperatures (molecules moving slowly), real gases deviate from ideal behavior because:
1. Gas molecules possess finite volume ($b$).
2. Gas molecules exert attractive intermolecular forces ($a$).

Johannes Diderik van der Waals corrected the ideal equation:
$$\left( P + a \frac{n^2}{V^2} \right) (V - n b) = n R T$$
- The pressure term $a \frac{n^2}{V^2}$ accounts for attractive forces reducing wall collisions.
- The volume term $n b$ accounts for the excluded volume occupied by the molecules themselves.

---

## 7. Chemical Thermodynamics & Reaction Kinetics

### 7.1 Enthalpy ($\Delta H$) and Thermochemistry

Chemical reactions absorb or release thermal energy:
- **Exothermic ($\Delta H < 0$):** Chemical bonds formed in the products are more stable and release more energy than the bonds broken in the reactants (heat released to surroundings).
- **Endothermic ($\Delta H > 0$):** Energy absorbed from surroundings to break stronger reactant bonds.
- **Hess's Law of Heat Summation:** Because enthalpy is a thermodynamic state function, the net enthalpy change for a chemical process is independent of the pathway or number of steps:
  $$\Delta H^\circ_{\text{rxn}} = \sum \nu_p \Delta H^\circ_{f,\text{products}} - \sum \nu_r \Delta H^\circ_{f,\text{reactants}}$$
  where $\Delta H^\circ_f$ is the standard molar enthalpy of formation from elements in their standard reference states (by definition, $\Delta H^\circ_f = 0$ for pure elements in standard states).

### 7.2 Entropy ($\Delta S$) and Gibbs Free Energy ($\Delta G$)

The Second Law of Thermodynamics dictates that spontaneous processes must increase total universal entropy: $\Delta S_{\text{universe}} = \Delta S_{\text{system}} + \Delta S_{\text{surroundings}} > 0$.

At constant temperature and pressure, the criterion for chemical spontaneity is the **Gibbs Free Energy** $G = H - TS$:
$$\Delta G = \Delta H - T\Delta S$$

```
Spontaneity Decision Table:
  ΔH      ΔS      ΔG = ΔH - TΔS           Reaction Behavior
-------------------------------------------------------------------------
  < 0     > 0     Always < 0               Spontaneous at all temperatures
  > 0     < 0     Always > 0               Non-spontaneous at all temperatures
  < 0     < 0     < 0 at low T, > 0 at high T Spontaneous at low T (enthalpy driven)
  > 0     > 0     > 0 at low T, < 0 at high T Spontaneous at high T (entropy driven)
```

### 7.3 Reaction Kinetics: The Clock vs. The Scale

Thermodynamics predicts whether a reaction *can* occur ($\Delta G < 0$); **kinetics** dictates *how fast* it actually occurs. A mixture of gasoline vapor and oxygen has a large negative $\Delta G$, yet sits indefinitely at room temperature because it lacks activation energy ($E_a$).

1. **Differential Rate Law:** Determined exclusively by laboratory experiment, not by overall stoichiometric coefficients:
   $$\text{Rate} = -\frac{1}{a}\frac{d[\text{A}]}{dt} = k [\text{A}]^m [\text{B}]^n$$
   where $m$ and $n$ are reaction orders with respect to reactants $\text{A}$ and $\text{B}$, and $k$ is the temperature-dependent rate constant.
2. **The Arrhenius Equation:** Rate constants increase exponentially with temperature:
   $$k = A e^{-\frac{E_a}{R T}}$$
   where $E_a$ is the activation energy barrier and $A$ is the frequency factor (collision frequency and steric orientation).
3. **Catalysis:** A catalyst accelerates a reaction by introducing an alternative reaction mechanism with a lower activation energy ($E_a$). A catalyst speeds up both forward and reverse rates equally; **a catalyst never changes the equilibrium constant $K$ or the net thermodynamic $\Delta G$**.

---

## 8. Dynamic Chemical Equilibrium

### 8.1 The Nature of Dynamic Balance

Most chemical reactions are reversible. When reactants $\text{A}$ and $\text{B}$ form products $\text{C}$ and $\text{D}$, the accumulating products begin colliding to regenerate reactants. **Chemical equilibrium** is reached when the forward reaction rate equals the reverse reaction rate:
$$\text{Rate}_{\text{forward}} = \text{Rate}_{\text{reverse}}$$
At equilibrium, molecular transformations continue ceaselessly at the microscopic level, but macroscopic concentrations remain invariant.

### 8.2 The Equilibrium Constant ($K$) and Mass Action

For a general reversible reaction:
$$a\text{A} + b\text{B} \rightleftharpoons c\text{C} + d\text{D}$$

The **Law of Mass Action** defines the equilibrium constant:
$$K_c = \frac{[\text{C}]^c [\text{D}]^d}{[\text{A}]^a [\text{B}]^b}$$

*Core Conventions:*
- **Pure solids and pure liquid solvents are omitted** from $K$ expressions because their chemical activities are unity ($a = 1$).
- For gas-phase equilibria, $K_p$ is expressed in partial pressures:
  $$K_p = K_c (R T)^{\Delta n_g}, \quad \text{where } \Delta n_g = (c + d) - (a + b)$$
- Connection to Thermodynamics:
  $$\Delta G^\circ = -R T \ln K$$

### 8.3 The Reaction Quotient ($Q$) and Predicting Direction

The reaction quotient $Q$ has the identical algebraic form as $K$, but uses instantaneous non-equilibrium concentrations:
- If $Q < K$: Products are deficient; reaction shifts **forward** (left to right).
- If $Q > K$: Products are in excess; reaction shifts **reverse** (right to left).
- If $Q = K$: The system is at dynamic equilibrium.

### 8.4 Le Chatelier's Principle

When a chemical system at equilibrium is subjected to an external disturbance (change in concentration, pressure, or temperature), the system shifts its equilibrium position in a manner that counteracts the disturbance:
1. **Adding Reactant or Product:** Adding reactant shifts equilibrium forward ($\rightarrow$); adding product shifts equilibrium reverse ($\leftarrow$).
2. **Volume / Pressure Change (Gases):** Compressing a gas mixture (increasing pressure) shifts equilibrium toward the side with fewer moles of gas ($\Delta n_g$). Expanding volume shifts toward more gas moles.
3. **Temperature Changes:**
   - For exothermic reactions ($\Delta H < 0$), heat acts as a product. Raising temperature shifts equilibrium reverse ($\leftarrow$) and decreases the numerical value of $K$.
   - For endothermic reactions ($\Delta H > 0$), heat acts as a reactant. Raising temperature shifts equilibrium forward ($\rightarrow$) and increases the numerical value of $K$.

---

## 9. Aqueous Equilibria: Acids, Bases, pH & Buffers

### 9.1 Acid-Base Models

1. **Arrhenius Model:** Acids produce $\text{H}^+$ ions in aqueous solution; bases produce $\text{OH}^-$ ions.
2. **Brønsted-Lowry Model:** An acid is a **proton donor** ($\text{H}^+$); a base is a **proton acceptor**. Every acid-base reaction involves conjugate pairs:
   $$\underbrace{\text{HA}}_{\text{Acid}} + \underbrace{\text{H}_2\text{O}}_{\text{Base}} \rightleftharpoons \underbrace{\text{H}_3\text{O}^+}_{\text{Conjugate Acid}} + \underbrace{\text{A}^-}_{\text{Conjugate Base}}$$
3. **Lewis Model:** An acid is an **electron-pair acceptor** (electrophile); a base is an **electron-pair donor** (nucleophile). Encompasses reactions without protons (e.g. $\text{BF}_3 + \text{NH}_3 \rightarrow \text{F}_3\text{B-NH}_3$).

### 9.2 The Autoionization of Water and the pH Scale

Water undergoes self-ionization:
$$2\text{H}_2\text{O}(l) \rightleftharpoons \text{H}_3\text{O}^+(aq) + \text{OH}^-(aq)$$
$$K_w = [\text{H}_3\text{O}^+][\text{OH}^-] = 1.0 \times 10^{-14} \quad (\text{at } 25^\circ\text{C})$$

The logarithmic scale defines:
$$\text{pH} = -\log_{10}[\text{H}_3\text{O}^+], \quad \text{pOH} = -\log_{10}[\text{OH}^-]$$
$$\text{pH} + \text{pOH} = \text{pK}_w = 14.00 \quad (\text{at } 25^\circ\text{C})$$

### 9.3 Weak Acids, Weak Bases and ICE Calculations

Strong acids ($\text{HCl}, \text{HBr}, \text{HI}, \text{HNO}_3, \text{HClO}_4, \text{H}_2\text{SO}_4$) dissociate completely in water ($[\text{H}^+] = c_0$). 

Weak acids dissociate partially, governed by the acid dissociation constant $K_a$:
$$\text{HA}(aq) + \text{H}_2\text{O}(l) \rightleftharpoons \text{H}_3\text{O}^+(aq) + \text{A}^-(aq), \quad K_a = \frac{[\text{H}_3\text{O}^+][\text{A}^-]}{[\text{HA}]}$$

*Worked Example:* Calculate pH of $0.10\text{ M}$ acetic acid ($\text{CH}_3\text{COOH}$, $K_a = 1.8 \times 10^{-5}$):
```
Species:        HA     + H2O  <===> H3O+   + A-
Initial (I):    0.10                0        0
Change  (C):    -x                 +x       +x
Equil   (E):    0.10 - x            x        x
```
$$K_a = \frac{x^2}{0.10 - x} \approx \frac{x^2}{0.10} = 1.8 \times 10^{-5} \implies x^2 = 1.8 \times 10^{-6} \implies x \approx 1.34 \times 10^{-3}\text{ M}$$
$$\text{pH} = -\log_{10}(1.34 \times 10^{-3}) \approx 2.87$$
*(The approximation $0.10 - x \approx 0.10$ is valid because $\frac{1.34 \times 10^{-3}}{0.10} \times 100\% = 1.34\% < 5\%$).*

### 9.4 Buffer Solutions & The Henderson-Hasselbalch Equation

A **buffer** is an aqueous solution containing comparable concentrations of a weak conjugate acid-base pair ($\text{HA}$ and $\text{A}^-$). Buffers resist changes in pH when small amounts of strong acid or base are added.

Applying the logarithm to the $K_a$ definition yields the **Henderson-Hasselbalch Equation**:
$$\text{pH} = \text{pK}_a + \log_{10}\left( \frac{[\text{A}^-]}{[\text{HA}]} \right)$$

When $[\text{A}^-] = [\text{HA}]$, $\text{pH} = \text{pK}_a$. Effective buffering capacity is generally constrained to the window $\text{pH} = \text{pK}_a \pm 1$.

---

## 10. Electrochemistry: Redox Systems & Galvanic Cells

### 10.1 Oxidation-Reduction Mechanics

Redox reactions involve electron transfer:
- **Oxidation:** Loss of electrons ($\text{LEO}$); oxidation number increases.
- **Reduction:** Gain of electrons ($\text{GER}$); oxidation number decreases.
- **Oxidation Numbers:** Bookkeeping formalisms assigned according to electronegativity:
  1. Pure elemental forms have oxidation state 0 (e.g. $\text{Fe}, \text{O}_2, \text{P}_4$).
  2. Monatomic ions equal ionic charge ($\text{Na}^+ = +1, \text{Fe}^{3+} = +3, \text{Cl}^- = -1$).
  3. Fluorine is always $-1$. Oxygen is $-2$ (except in peroxides where it is $-1$, and in $\text{OF}_2$ where it is $+2$).
  4. Hydrogen is $+1$ with nonmetals, $-1$ with metal hydrides ($\text{NaH}$).
  5. The sum of oxidation states over a neutral molecule equals 0; in a polyatomic ion, it equals the net ionic charge.

### 10.2 Galvanic (Voltaic) Cells & Standard Potentials

A **galvanic cell** separates oxidation and reduction half-reactions into physical compartments, forcing electron flow through an external circuit to generate electric work:
- **Anode:** The electrode where **oxidation** occurs. Electrons flow *out* of the anode.
- **Cathode:** The electrode where **reduction** occurs. Electrons flow *into* the cathode.
- **Salt Bridge:** Completes the electrical circuit by permitting mobile ions to migrate, neutralizing charge buildup in each half-cell.

```
Galvanic Cell Layout:
  [ Anode Compartment ]                 [ Cathode Compartment ]
     Zn(s) Electrode                       Cu(s) Electrode
            |                                     |
            v                                     ^
     Zn -> Zn2+ + 2e-    --- External Wire --->  Cu2+ + 2e- -> Cu
    (Oxidation / Anode)     [e- flow ----->]     (Reduction / Cathode)
            \                                     /
             \------- Salt Bridge (K+, Cl-) -----/
```

The standard cell potential $E^\circ_{\text{cell}}$ is computed from tabulated standard reduction potentials ($E^\circ$):
$$E^\circ_{\text{cell}} = E^\circ_{\text{cathode}} - E^\circ_{\text{anode}}$$

### 10.3 Thermodynamic & Non-Standard Cell Equations

Cell potential directly measures the thermodynamic driving force of the reaction:
$$\Delta G^\circ = -n F E^\circ_{\text{cell}}$$
where:
- $n$ is moles of electrons transferred in the balanced reaction.
- $F$ is Faraday's constant ($F = 96,485.33212\text{ C}\cdot\text{mol}^{-1}$).

Under non-standard concentrations, cell voltage obeys the **Nernst Equation**:
$$E_{\text{cell}} = E^\circ_{\text{cell}} - \frac{R T}{n F} \ln Q$$
At $T = 298.15\text{ K}$ ($25^\circ\text{C}$), this reduces to:
$$E_{\text{cell}} = E^\circ_{\text{cell}} - \frac{0.05916}{n} \log_{10} Q$$

---

## 11. Organic Chemistry: Functional Groups & Reaction Mechanisms

Carbon possesses the unique capacity for **catenation**—forming stable, covalent carbon-carbon bonds in chains, branched frameworks, and rings of limitless complexity.

### 11.1 Major Organic Functional Families

```
Family        Structure             Functional Group           Example
-----------------------------------------------------------------------------------
Alkane        R-CH2-CH3             C-C Single Bond            Ethane (CH3CH3)
Alkene        R-CH=CH-R'            C=C Double Bond            Ethene (H2C=CH2)
Alkyne        R-C≡C-R'              C≡C Triple Bond            Ethyne (HC≡CH)
Arene         Ar-H                  Aromatic Ring              Benzene (C6H6)
Alcohol       R-OH                  Hydroxyl                   Ethanol (CH3CH2OH)
Ether         R-O-R'                Alkoxy                     Diethyl ether
Aldehyde      R-CH=O                Carbonyl (terminal)        Acetaldehyde
Ketone        R-C(=O)-R'            Carbonyl (internal)        Acetone (CH3COCH3)
Carboxylic    R-COOH                Carboxyl                   Acetic acid
Ester         R-COOR'               Carboalkoxy                Ethyl acetate
Amine         R-NH2                 Amino                      Methylamine
Amide         R-CONH2               Carboxamide                Acetamide
```

### 11.2 Core Mechanistic Paradigms

Organic reactions proceed via curved-arrow mechanisms tracking electron-pair movement:
1. **Nucleophilic Substitution ($S_N1$ and $S_N2$):**
   - $S_N2$: Concerted, bimolecular backside attack by a nucleophile with simultaneous displacement of a leaving group. Inverts stereochemical configuration (Walden inversion).
   - $S_N1$: Stepwise, unimolecular loss of leaving group forming a planar carbocation intermediate, followed by nucleophilic attack. Yields racemic mixtures.
2. **Elimination ($E1$ and $E2$):** Dehydrohalogenation producing alkenes governed by Zaitsev's rule (forming the more substituted, thermodynamically stable alkene).
3. **Electrophilic Aromatic Substitution (EAS):** Benzene rings preserve their resonance-stabilized aromaticity by undergoing substitution rather than addition when attacked by powerful electrophiles ($\text{NO}_2^+, \text{Br}^+, \text{R}^+$).

---

## 12. Chemical Safety, Hazards & Authoritative Standards

Chemical manipulation demands strict empirical adherence to verified toxicology and thermodynamics:
- **Safety Data Sheets (SDS):** Under the UN Globally Harmonized System (GHS), every pure chemical and commercial mixture must carry an SDS detailing:
  1. Section 2: Hazard Identification (pictograms, signal words "DANGER" vs "WARNING", H-statements).
  2. Section 8: Exposure Controls and Personal Protection (OSHA PEL, ACGIH TLV).
  3. Section 10: Chemical Stability and Incompatibility (e.g. avoiding mixing bleach and ammonia, which liberates lethal chloramine gas $\text{NH}_2\text{Cl}$).
- **Authoritative Doors:**
  - Standard Thermodynamic Properties: **NIST Chemistry WebBook** (`https://webbook.nist.gov/chemistry/`).
  - Fundamental Physical Constants: **NIST CODATA** (`https://physics.nist.gov/cuu/Constants/`).
  - Standard Atomic Weights: **IUPAC CIAAW** (`https://www.ciaaw.org/`).
  - Chemical Structure and Toxicology: **NIH PubChem** (`https://pubchem.ncbi.nlm.nih.gov/`) and **NIOSH Pocket Guide** (`https://www.cdc.gov/niosh/npg/`).
