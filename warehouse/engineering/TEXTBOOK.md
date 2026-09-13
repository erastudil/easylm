---
title: "engineering — undergrad textbook"
date: "2026-08-28"
status: living · undergrad · foundational-textbook
home: "warehouse/engineering/"
related:
  - "../physics/"
  - "../math/"
  - "../chemistry/"
  - "../ops_5s_kaizen/"
  - "../computing/"
  - "../methods/"
  - "EasyLM calc and units hands"
  - "warehouse/LAW.md"
---

# Engineering — Mechanical, Electrical & Systems Foundations

A comprehensive undergraduate textbook and engineering manual covering physical units, statics, mechanics of materials, machine design, gear kinematics, CNC machining & feeds/speeds, metallurgy, thermodynamics, fluid dynamics, circuit analysis, AC power, electronics, electric machines, control theory, and engineering failure diagnostics.

---

## 0. Syllabus & Structural Map

Engineering is the application of mathematical and physical principles to the **design, analysis, and fabrication of physical structures, machines, circuits, and systems under constraints**.

```
+---------------------------------------------------------------------------------------------------+
|                                 THE ENGINEERING ARCHITECTURE                                      |
+---------------------------------------------------------------------------------------------------+
|  MECHANICS & SOLIDS           | Statics (ΣF=0, ΣM=0) · Stress/Strain · Mohr's Circle · Beam Bending|
+-------------------------------+-------------------------------------------------------------------+
|  MACHINE DESIGN & GEARS       | Shaft Fatigue · Bearings (L10) · Involute Gears · Fastener Clamp  |
+-------------------------------+-------------------------------------------------------------------+
|  MANUFACTURING & CNC          | Feeds/Speeds (SFM/IPT) · G-Code · Fits (ANSI/ISO) · GD&T (Y14.5)  |
+-------------------------------+-------------------------------------------------------------------+
|  MATERIALS & METALLURGY       | Phase Diagrams (Fe-C) · Heat Treat · Hardness (HRC) · Corrosion   |
+-------------------------------+-------------------------------------------------------------------+
|  THERMAL & FLUID SYSTEMS      | 1st/2nd Laws · Cycles · Conduction/Convection · Darcy-Weisbach    |
+-------------------------------+-------------------------------------------------------------------+
|  ELECTRICAL CIRCUITS & AC     | Ohm · KCL/KVL · Thévenin · Phasors (Z=R+jX) · 3-Phase (Y/Δ)       |
+-------------------------------+-------------------------------------------------------------------+
|  ELECTRONICS & MACHINES       | Diodes · BJTs · MOSFETs · Op-Amps · DC / Induction / BLDC Motors  |
+-------------------------------+-------------------------------------------------------------------+
|  CONTROL & FEEDBACK           | Transfer Functions · Stability (Bode) · PID Controllers · Windup  |
+-------------------------------+-------------------------------------------------------------------+
|  CODES & SAFETY STANDARDS     | Machinery's Handbook · ASME · IEEE · NEC/NFPA · OSHA · FMEA       |
+-------------------------------+-------------------------------------------------------------------+
```

### Table of Contents

1. [Chapter 1: Units, Dimensional Analysis & Measurement Error](#1-units-dimensional-analysis--measurement-error)
2. [Chapter 2: Engineering Mechanics I: Statics & Equilibrium](#2-engineering-mechanics-i-statics--equilibrium)
3. [Chapter 3: Mechanics of Materials & Solid Mechanics](#3-mechanics-of-materials--solid-mechanics)
4. [Chapter 4: Machine Design, Power Transmission & Fasteners](#4-machine-design-power-transmission--fasteners)
5. [Chapter 5: Involute Gear Design & Kinematics](#5-involute-gear-design--kinematics)
6. [Chapter 6: Manufacturing Processes & CNC Machining Mechanics](#6-manufacturing-processes--cnc-machining-mechanics)
7. [Chapter 7: Materials Science, Metallurgy & Heat Treatment](#7-materials-science-metallurgy--heat-treatment)
8. [Chapter 8: Thermodynamics & Heat Transfer](#8-thermodynamics--heat-transfer)
9. [Chapter 9: Fluid Mechanics & Hydraulic Machinery](#9-fluid-mechanics--hydraulic-machinery)
10. [Chapter 10: Electrical Circuits & Network Analysis](#10-electrical-circuits--network-analysis)
11. [Chapter 11: AC Circuit Analysis & Three-Phase Power](#11-ac-circuit-analysis--three-phase-power)
12. [Chapter 12: Analog & Digital Electronics](#12-analog--digital-electronics)
13. [Chapter 13: Electromagnetics & Electric Machines](#13-electromagnetics--electric-machines)
14. [Chapter 14: Control Systems & Feedback Theory](#14-control-systems--feedback-theory)
15. [Chapter 15: Engineering Standards, Scholarly Corpora & Primary Doors](#15-engineering-standards-scholarly-corpora--primary-doors)
16. [Chapter 16: Diagnostic Protocols, Failure Modes & Engineering Problem-Solving](#16-diagnostic-protocols-failure-modes--engineering-problem-solving)

---

## 1. Units, Dimensional Analysis & Measurement Error

Engineering calculations require explicit dimensional consistency. Every numerical value must carry its associated physical unit.

### 1.1 SI Base Units and Engineering Conversions

```
+---------------------+-------------------+--------------+------------------------------------------+
| Quantity            | SI Base / Derived | Symbol       | Fundamental Dimensions                   |
+---------------------+-------------------+--------------+------------------------------------------+
| Length              | Metre             | $\text{m}$   | $[\text{L}]$                             |
| Mass                | Kilogram          | $\text{kg}$  | $[\text{M}]$                             |
| Time                | Second            | $\text{s}$   | $[\text{T}]$                             |
| Electric Current    | Ampere            | $\text{A}$   | $[\text{I}]$                             |
| Thermodynamic Temp  | Kelvin            | $\text{K}$   | $[\Theta]$                               |
| Force               | Newton            | $\text{N}$   | $\text{kg}\cdot\text{m}/\text{s}^2$      |
| Pressure / Stress   | Pascal            | $\text{Pa}$  | $\text{N}/\text{m}^2 = \text{J}/\text{m}^3$ |
| Energy / Work       | Joule             | $\text{J}$   | $\text{N}\cdot\text{m} = \text{W}\cdot\text{s}$ |
| Power               | Watt              | $\text{W}$   | $\text{J}/\text{s} = \text{V}\cdot\text{A}$|
| Electric Potential  | Volt              | $\text{V}$   | $\text{W}/\text{A} = \text{J}/\text{C}$  |
| Electrical Resist.  | Ohm               | $\Omega$     | $\text{V}/\text{A}$                      |
+---------------------+-------------------+--------------+------------------------------------------+
```

$$\text{US Customary Conversions:} \quad 1\text{ inch} = 25.4\text{ mm} \qquad 1\text{ lbf} \approx 4.44822\text{ N} \qquad 1\text{ psi} \approx 6,894.76\text{ Pa}$$

### 1.2 The Buckingham $\Pi$ Theorem
Any physically meaningful equation involving $n$ physical variables expressible in terms of $k$ independent fundamental dimensions can be restructured into an equivalent equation of $p = n - k$ dimensionless groups ($\Pi_1, \Pi_2, \dots, \Pi_p$).

### 1.3 Propagation of Measurement Uncertainty
For a calculated quantity $f(x_1, x_2, \dots, x_n)$ with independent measurement uncertainties $\delta x_i$:

$$\delta f = \sqrt{ \sum_{i=1}^n \left( \frac{\partial f}{\partial x_i} \delta x_i \right)^2 }$$

---

## 2. Engineering Mechanics I: Statics & Equilibrium

Statics analyzes stationary physical systems where forces and moments balance to zero.

### 2.1 The Equations of Equilibrium

$$\sum \mathbf{F} = \mathbf{0} \iff \sum F_x = 0, \quad \sum F_y = 0, \quad \sum F_z = 0$$

$$\sum \mathbf{M}_O = \mathbf{0} \iff \sum M_x = 0, \quad \sum M_y = 0, \quad \sum M_z = 0$$

- **Free-Body Diagram (FBD):** The isolated mechanical body with all applied external forces, gravitational body forces, and reaction forces/moments at the boundaries explicitly drawn.
- **Support Reactions in 2D:**
  - **Roller Support:** 1 reaction force normal to the surface ($R_y$).
  - **Pinned Joint:** 2 orthogonal reaction forces ($R_x, R_y$).
  - **Fixed / Built-in Support:** 2 reaction forces plus 1 restraining moment ($R_x, R_y, M_z$).

### 2.2 Planar Trusses & Frames
- **Method of Joints:** Isolate individual pin joints ($\sum F_x = 0, \sum F_y = 0$). Ideal for finding forces in all members.
- **Method of Sections:** Cut through a maximum of three unknown members and apply full equilibrium ($\sum F_x = 0, \sum F_y = 0, \sum M = 0$). Ideal for finding internal loads in specific interior members.

### 2.3 Coulomb Dry Friction

$$F_f \le \mu_s N \quad (\text{Static, impending slip}) \qquad F_k = \mu_k N \quad (\text{Dynamic sliding, } \mu_k < \mu_s)$$

---

## 3. Mechanics of Materials & Solid Mechanics

Mechanics of materials evaluates internal stresses, strains, deformations, and failure thresholds of deformable bodies.

### 3.1 Normal and Shear Stress & Strain

$$\text{Engineering Normal Stress:} \quad \sigma = \frac{P}{A_0} \qquad \text{Engineering Normal Strain:} \quad \epsilon = \frac{\Delta L}{L_0}$$

$$\text{Hooke's Law (1D Isotropic Elastic):} \quad \sigma = E \epsilon \qquad \tau = G \gamma \qquad G = \frac{E}{2(1 + \nu)}$$

- $E = \text{Young's Modulus (Stiffness)}, \quad G = \text{Shear Modulus}, \quad \nu = \text{Poisson's Ratio } (\nu \approx 0.3 \text{ for steels})$.

### 3.2 2D Stress Transformation & Mohr's Circle

$$\sigma_{x'} = \frac{\sigma_x + \sigma_y}{2} + \frac{\sigma_x - \sigma_y}{2}\cos(2\theta) + \tau_{xy}\sin(2\theta)$$

$$\tau_{x'y'} = - \frac{\sigma_x - \sigma_y}{2}\sin(2\theta) + \tau_{xy}\cos(2\theta)$$

$$\text{Principal Stresses } (\sigma_1, \sigma_2): \quad \sigma_{1,2} = \frac{\sigma_x + \sigma_y}{2} \pm \sqrt{ \left(\frac{\sigma_x - \sigma_y}{2}\right)^2 + \tau_{xy}^2 }$$

$$\text{Maximum In-Plane Shear Stress:} \quad \tau_{\max} = \sqrt{ \left(\frac{\sigma_x - \sigma_y}{2}\right)^2 + \tau_{xy}^2 } = \frac{\sigma_1 - \sigma_2}{2}$$

### 3.3 Yield Criteria for Ductile Materials

```
+------------------------------------+--------------------------------------------------------------+
| YIELD CRITERION                    | FORMULA & FAILURE BOUNDARY                                   |
+------------------------------------+--------------------------------------------------------------+
| Maximum Shear Stress (Tresca)      | $\tau_{\max} = \frac{\sigma_1 - \sigma_3}{2} \ge \frac{S_y}{2} \implies \sigma_1 - \sigma_3 \ge S_y$ |
+------------------------------------+--------------------------------------------------------------+
| Distortion Energy (von Mises)      | $\sigma' = \sqrt{ \frac{(\sigma_1-\sigma_2)^2 + (\sigma_2-\sigma_3)^2 + (\sigma_3-\sigma_1)^2}{2} } \ge S_y$ |
| (Plane Stress $\sigma_3=0$)        | $\sigma' = \sqrt{\sigma_x^2 - \sigma_x\sigma_y + \sigma_y^2 + 3\tau_{xy}^2} \ge S_y$        |
+------------------------------------+--------------------------------------------------------------+
```

### 3.4 Beam Bending, Transverse Shear & Torsion

$$\text{Flexure Formula (Pure Bending):} \quad \sigma_x = - \frac{M y}{I} \qquad I = \int y^2 dA \quad \left(I_{\text{rect}} = \frac{b h^3}{12}\right)$$

$$\text{Transverse Shear Stress:} \quad \tau = \frac{V Q}{I t} \qquad Q = \int_y^{c} y' dA' = \bar{y}' A'$$

$$\text{Torsion of Circular Shafts:} \quad \tau = \frac{T r}{J} \qquad \theta = \frac{T L}{J G} \qquad J = \frac{\pi d^4}{32} \quad (\text{Polar MOI})$$

### 3.5 Euler Column Buckling

$$P_{cr} = \frac{\pi^2 E I}{(K L)^2} \qquad \sigma_{cr} = \frac{\pi^2 E}{(K L / r)^2} \quad \text{where } r = \sqrt{\frac{I}{A}} \text{ (Radius of Gyration)}$$

- $K = 1.0 \text{ (Pinned-Pinned)}, \quad K = 0.5 \text{ (Fixed-Fixed)}, \quad K = 0.7 \text{ (Fixed-Pinned)}, \quad K = 2.0 \text{ (Fixed-Free)}$.

---

## 4. Machine Design, Power Transmission & Fasteners

Machine design integrates solid mechanics, material properties, and fatigue theory to size mechanical components for infinite life or target duty cycles.

### 4.1 Shaft Fatigue & Combined Loading (Modified Goodman)

$$\frac{\sigma_a}{S_e} + \frac{\sigma_m}{S_{ut}} = \frac{1}{n} \quad (\text{Modified Goodman Criterion})$$

- $\sigma_a = \text{Alternating Stress Amplitude}, \quad \sigma_m = \text{Mean Stress}$
- $S_e = \text{Endurance Limit of Part } (S_e = k_a k_b k_c k_d k_e S_e')$, where $k_i$ are surface, size, load, temp factors.
- $S_{ut} = \text{Ultimate Tensile Strength}, \quad n = \text{Design Factor of Safety}$.

### 4.2 Fastener Mechanics & Joint Clamping Torque

$$\text{Preload / Proof Tension:} \quad F_i = 0.75 \times A_t \times S_p$$

$$\text{Tightening Torque Formula:} \quad T = K \cdot F_i \cdot d$$

- $T = \text{Nominal Tightening Torque}, \quad K = \text{Torque Coefficient } (K \approx 0.20 \text{ dry, } K \approx 0.15 \text{ lubricated})$
- $F_i = \text{Initial Bolt Preload Tension}, \quad d = \text{Nominal Major Bolt Diameter}, \quad A_t = \text{Tensile Stress Area}$.

### 4.3 Rolling-Element Bearing Life (ISO 281 / AFBMA)

$$L_{10} = \left( \frac{C}{P} \right)^p \times 10^6 \text{ revolutions} \qquad L_{10h} = \frac{10^6}{60 \cdot N} \left( \frac{C}{P} \right)^p \text{ hours}$$

- $C = \text{Basic Dynamic Load Rating (From Manufacturer Catalog)}, \quad P = \text{Equivalent Dynamic Radial Load}$
- $p = 3 \text{ for Ball Bearings}, \quad p = 10/3 \approx 3.33 \text{ for Roller Bearings}, \quad N = \text{RPM}$.

---

## 5. Involute Gear Design & Kinematics

Gears transmit rotational power between shafts with a constant angular velocity ratio via conjugately meshing teeth.

```
                  INVOLUTE GEAR TOOTH PROFILE
        +-------------------------------------------------+  <-- Top of Tooth (Addendum Circle)
        |                 /\
        |                /  \  <-- Involute Profile
        |===============(====)============================|  <-- Pitch Circle (d = N / DP = m * N)
        |                \  /
        |                 \/
        +-------------------------------------------------+  <-- Root Circle (Dedendum Circle)
```

### 5.1 Fundamental Gear Geometry Formulas

```
+-----------------------------------+-----------------------------------+-----------------------------------+
| Parameter                         | US Customary Formula (DP)         | SI Metric Formula (Module m)      |
+-----------------------------------+-----------------------------------+-----------------------------------+
| Pitch Diameter ($d$)              | $d = \frac{N}{DP}$                | $d = m \cdot N$                   |
| Module / Diametral Pitch Relation | $m = \frac{25.4}{DP}$             | $DP = \frac{25.4}{m}$             |
| Circular Pitch ($p$)              | $p = \frac{\pi}{DP} = \pi \cdot m$| $p = \pi \cdot m$                 |
| Standard Addendum ($a$)           | $a = \frac{1.0}{DP} = 1.0 \cdot m$| $a = 1.0 \cdot m$                 |
| Standard Dedendum ($b$)           | $b = \frac{1.25}{DP} = 1.25\cdot m$| $b = 1.25 \cdot m$               |
| Outside Diameter ($d_o$)          | $d_o = d + 2a = \frac{N + 2}{DP}$ | $d_o = m(N + 2)$                  |
| Root Diameter ($d_r$)             | $d_r = d - 2b = \frac{N - 2.5}{DP}$| $d_r = m(N - 2.5)$               |
| Base Circle Diameter ($d_b$)      | $d_b = d \cos(\phi)$              | $d_b = d \cos(\phi)$              |
+-----------------------------------+-----------------------------------+-----------------------------------+
```

- Standard Pressure Angle: $\phi = 20^\circ$ (Modern standard; avoids undercutting on pinions with $N \ge 17$ teeth).
- **Gear Velocity Ratio:** $\frac{\omega_1}{\omega_2} = \frac{N_2}{N_1} = \frac{d_2}{d_1} = \frac{T_2}{T_1 \cdot \eta}$

### 5.2 AGMA Bending & Contact Stress (Lewis Equation Foundation)

$$\text{Bending Stress (Lewis Equation):} \quad \sigma_b = \frac{F_t \cdot DP}{b \cdot Y} = \frac{F_t}{b \cdot m \cdot Y_m}$$

- $F_t = \text{Transmitted Tangential Force } (F_t = \frac{2 T}{d} = \frac{33,000 \cdot \text{HP}}{V_{\text{pitch}}})$, $\quad b = \text{Face Width}$, $\quad Y = \text{Lewis Form Factor}$.

---

## 6. Manufacturing Processes & CNC Machining Mechanics

Machining removes material through controlled plastic shear failure using hardened cutting tools.

### 6.1 Feeds and Speeds Calculations

$$\mathbf{Spindle\ Speed\ (RPM):} \quad N = \frac{\text{Cutting Speed (SFM)} \times 12}{\pi \times \text{Tool Diameter } D \text{ (inches)}} \approx \frac{\text{SFM} \times 3.82}{D_{\text{in}}} \qquad \left(\text{Metric:} \quad N = \frac{1000 \times V_c (\text{m/min})}{\pi \times D_{\text{mm}}}\right)$$

$$\mathbf{Table\ Feed\ Rate\ (IPM):} \quad F_{\text{IPM}} = N (\text{RPM}) \times z (\text{Flutes}) \times f_z (\text{Feed per tooth / Chip Load IPT})$$

$$\mathbf{Material\ Removal\ Rate\ (MRR):} \quad \text{MRR} = w (\text{Radial Width of Cut}) \times d (\text{Axial Depth of Cut}) \times F_{\text{IPM}} \quad [\text{in}^3/\text{min}]$$

$$\mathbf{Cutting\ Power\ Required\ (HP):} \quad \text{HP}_{\text{cut}} = \text{MRR} \times U_c \quad (U_c = \text{Unit Power Factor, e.g. } \approx 0.3 \text{ Al}, \approx 1.0 \text{ Steel})$$

### 6.2 Taylor's Tool Life Equation

$$V \cdot T^n = C$$

- $V = \text{Cutting Speed (SFM or m/min)}, \quad T = \text{Tool Life (Minutes)}$
- $n = \text{Taylor Exponent } (\approx 0.125 \text{ HSS}, \approx 0.25\text{–}0.30 \text{ Uncoated Carbide}, \approx 0.40 \text{ Coated Carbide})$
- $C = \text{Constant (Cutting speed for a 1-minute tool life)}$.

### 6.3 Standard Fits & Tolerances (ANSI B4.1 / ISO 286)

```
+---------------------+-----------------------------------------------------+-----------------------+
| Fit Class           | Mechanical Behavior                                 | Standard Application  |
+---------------------+-----------------------------------------------------+-----------------------+
| **RC (Running)**    | Clearance fit with guaranteed lubrication oil gap   | Journal bearings      |
| **LC (Locating Clr)**| Snug slip fit; parts assemble by hand without play | Dowel locating pins   |
| **LT (Transition)** | Slight clearance to slight interference             | Precision gear hubs   |
| **FN (Force / Press)| Guaranteed interference; requires hydraulic press   | Bearing outer rings,  |
|                     | or thermal shrink-fitting ($\Delta T$)              | rigid shaft couplings |
+---------------------+-----------------------------------------------------+-----------------------+
```

### 6.4 Geometric Dimensioning & Tolerancing (GD&T / ASME Y14.5)
- **Feature Control Frame:** `[ Feature Symbol | Tolerance Value (e.g. ⌀0.05) | Material Condition (MMC/LMC) | Datum A | Datum B | Datum C ]`
- **Key Characteristics:** True Position (locational boundary), Flatness (form), Perpendicularity (orientation), Total Runout (circularity + coaxiality under rotation).

---

## 7. Materials Science, Metallurgy & Heat Treatment

Mechanical properties are dictated by atomic bonding, crystal lattice structures, microstructural grain boundaries, and thermal processing history.

### 7.1 The Iron-Carbon ($\text{Fe-C}$) Equilibrium Diagram

```
TEMPERATURE (°C)
  ^
  |        [Liquid]
1400|       . - ~ ~ ~ - .
  |     [Austenite (gamma)] \
912|    . '                  \
  |   . '                     \  Eutectic (4.3% C)
727|--+------------------------[Eutectoid Line (0.76% C)]---------------+
  |   | [Ferrite (alpha)] + [Cementite (Fe3C)] / Pearlite              |
  +---+-----------------------------------------------------------------> WEIGHT % CARBON
      0                      0.76%                                  6.67%
```

### 7.2 Steel Heat Treatment & Microstructures
1. **Austenitizing:** Heating steel above upper critical temperature ($A_3 / A_{cm}$, typically $800\text{–}900^\circ\text{C}$) to form face-centered cubic ($\text{FCC}$) Austenite ($\gamma$).
2. **Quenching:** Rapid cooling in water, oil, or brine to bypass the pearlite/bainite nose, trapping carbon into a highly strained body-centered tetragonal ($\text{BCT}$) lattice: **Martensite** (Extremely hard, high strength, brittle).
3. **Tempering:** Reheating quenched martensite below $A_1$ ($150\text{–}650^\circ\text{C}$) to precipitate fine carbides, relieving internal stress and restoring fracture toughness.
4. **Annealing / Normalizing:** Slow furnace cooling to produce soft, ductile, equilibrium **Pearlite** + **Ferrite** for optimal machinability.

---

## 8. Thermodynamics & Heat Transfer

Thermodynamics governs energy transformations and efficiency limits; heat transfer governs the rate at which thermal energy moves across boundaries.

### 8.1 First and Second Laws for Control Volumes

$$\mathbf{1st\ Law\ (Open\ System):} \quad \dot{Q} - \dot{W}_{cv} = \sum \dot{m}_{out} \left(h_{out} + \frac{V_{out}^2}{2} + g z_{out}\right) - \sum \dot{m}_{in} \left(h_{in} + \frac{V_{in}^2}{2} + g z_{in}\right)$$

$$\mathbf{Carnot\ Maximum\ Thermal\ Efficiency:} \quad \eta_{\text{carnot}} = 1 - \frac{T_L}{T_H} \quad (T \text{ in Kelvin})$$

### 8.2 The Three Modes of Heat Transfer

```
+-----------------------------------+---------------------------------------------------------------+
| MODE                              | GOVERNING EQUATION & PARAMETERS                               |
+-----------------------------------+---------------------------------------------------------------+
| **Conduction (Fourier's Law)**    | $q = - k A \frac{dT}{dx} \qquad \dot{Q} = \frac{k A}{L}(T_1 - T_2)$ |
|                                   | $k = \text{Thermal Conductivity } [\text{W}/(\text{m}\cdot\text{K})]$ |
+-----------------------------------+---------------------------------------------------------------+
| **Convection (Newton's Cooling)** | $\dot{Q} = h A (T_s - T_\infty)$                              |
|                                   | $h = \text{Convective Heat Transfer Coeff } [\text{W}/(\text{m}^2\cdot\text{K})]$|
+-----------------------------------+---------------------------------------------------------------+
| **Radiation (Stefan-Boltzmann)**  | $\dot{Q} = \epsilon \sigma A (T_1^4 - T_2^4)$                 |
|                                   | $\sigma = 5.670 \times 10^{-8} \text{ W}/(\text{m}^2\cdot\text{K}^4), \quad \epsilon = \text{Emissivity}$|
+-----------------------------------+---------------------------------------------------------------+
```

---

## 9. Fluid Mechanics & Hydraulic Machinery

Fluid mechanics analyzes fluids in static equilibrium and in laminar/turbulent flow regimes.

### 9.1 The Extended Bernoulli Equation & Pipe Head Loss

$$\frac{p_1}{\gamma} + \frac{v_1^2}{2g} + z_1 + h_{\text{pump}} = \frac{p_2}{\gamma} + \frac{v_2^2}{2g} + z_2 + h_{\text{turbine}} + h_L$$

$$\text{Major Friction Head Loss (Darcy-Weisbach):} \quad h_f = f \cdot \left(\frac{L}{D}\right) \cdot \left(\frac{v^2}{2g}\right)$$

$$\text{Reynolds Number:} \quad \text{Re} = \frac{\rho v D}{\mu} = \frac{v D}{\nu} \quad (\text{Laminar: } \text{Re} < 2300, \quad \text{Friction Factor: } f = \frac{64}{\text{Re}})$$

For turbulent flow ($\text{Re} > 4000$), $f$ is determined via the **Moody Chart** or the **Colebrook Equation** as a function of relative roughness ($\epsilon / D$).

### 9.2 Centrifugal Pump Power & Net Positive Suction Head (NPSH)

$$\text{Hydraulic Power Delivered to Fluid:} \quad P_{\text{fluid}} = \rho g Q H = \gamma Q H \qquad \text{Brake Horsepower:} \quad P_{\text{brake}} = \frac{\gamma Q H}{\eta_{\text{pump}}}$$

$$\mathbf{Cavitation\ Criterion:} \quad \text{NPSH}_{\text{available}} = \left( \frac{p_s}{\gamma} + \frac{v_s^2}{2g} \right) - \frac{p_v}{\gamma} > \text{NPSH}_{\text{required}}$$

---

## 10. Electrical Circuits & Network Analysis

Circuit analysis models electrical systems within the lumped-parameter abstraction where electromagnetic wavelengths far exceed component dimensions.

### 10.1 Fundamental Circuit Laws

$$\mathbf{Ohm's\ Law:} \quad V = I \cdot R \qquad \mathbf{Joule's\ Power\ Law:} \quad P = V \cdot I = I^2 R = \frac{V^2}{R}$$

$$\mathbf{Kirchhoff's\ Current\ Law\ (KCL):} \quad \sum_{k=1}^n I_k = 0 \quad (\text{Conservation of Charge at a Node})$$

$$\mathbf{Kirchhoff's\ Voltage\ Law\ (KVL):} \quad \sum_{k=1}^m V_k = 0 \quad (\text{Conservation of Energy around a Closed Loop})$$

### 10.2 Thévenin and Norton Equivalent Circuits

```
THÉVENIN EQUIVALENT                      NORTON EQUIVALENT
   +---[ R_th ]---+                           +-------+-------+
   |              |                           |       |       |
  (~) V_th        O Terminals A-B            (^) I_no [ R_no ]O Terminals A-B
   |              |                           |       |       |
   +--------------+                           +-------+-------+
```

$$\mathbf{Th\acute{e}venin\ Voltage\ (V_{th}):} \quad \text{Open-circuit voltage across terminals A-B } (V_{OC})$$

$$\mathbf{Norton\ Current\ (I_{no}):} \quad \text{Short-circuit current between terminals A-B } (I_{SC})$$

$$\mathbf{Equivalent\ Resistance\ (R_{th}):} \quad R_{th} = R_{no} = \frac{V_{OC}}{I_{SC}} = \frac{V_{th}}{I_{no}}$$

### 10.3 Dynamic Components: Capacitors and Inductors

$$i_C(t) = C \frac{dv_C(t)}{dt} \qquad v_L(t) = L \frac{di_L(t)}{dt}$$

$$\text{First-Order RC Transient Charging:} \quad v_C(t) = V_S \left(1 - e^{-t / \tau}\right) \quad \text{where } \tau = R C$$

$$\text{First-Order RL Transient Current:} \quad i_L(t) = I_{\max} \left(1 - e^{-t / \tau}\right) \quad \text{where } \tau = \frac{L}{R}$$

---

## 11. AC Circuit Analysis & Three-Phase Power

Alternating current analysis transforms linear differential equations into algebraic complex equations using phasors.

### 11.1 Phasor Representation and Complex Impedance

$$v(t) = V_{\max} \cos(\omega t + \theta) \iff \mathbf{V} = V_{\text{rms}} \angle \theta = \frac{V_{\max}}{\sqrt{2}} e^{j \theta}$$

```
+-------------------+-----------------------------------+-------------------------------------------+
| Component         | Time-Domain Law                   | Complex Impedance (Z)                     |
+-------------------+-----------------------------------+-------------------------------------------+
| Resistor (R)      | $v = i R$                         | $\mathbf{Z}_R = R$                        |
| Inductor (L)      | $v = L \frac{di}{dt}$             | $\mathbf{Z}_L = j \omega L = \omega L \angle 90^\circ$ |
| Capacitor (C)     | $i = C \frac{dv}{dt}$             | $\mathbf{Z}_C = \frac{1}{j \omega C} = -j \frac{1}{\omega C} = \frac{1}{\omega C} \angle -90^\circ$ |
+-------------------+-----------------------------------+-------------------------------------------+
```

$$\mathbf{Total\ Complex\ Impedance:} \quad \mathbf{Z} = R + j X = |\mathbf{Z}| e^{j \phi} \quad \left(|\mathbf{Z}| = \sqrt{R^2 + X^2}, \quad \phi = \arctan\left(\frac{X}{R}\right)\right)$$

### 11.2 The AC Power Triangle

$$\mathbf{Complex\ Power\ (S):} \quad \mathbf{S} = \mathbf{V}_{\text{rms}} \mathbf{I}_{\text{rms}}^* = P + j Q$$

- **Real / Active Power ($P$):** $P = |\mathbf{V}| |\mathbf{I}| \cos(\phi) \quad [\text{Watts, W}]$ (Performs physical work/heat).
- **Reactive Power ($Q$):** $Q = |\mathbf{V}| |\mathbf{I}| \sin(\phi) \quad [\text{Volt-Amps Reactive, VAR}]$ (Sustains magnetic/electric fields).
- **Apparent Power ($S$):** $S = |\mathbf{S}| = \sqrt{P^2 + Q^2} \quad [\text{Volt-Amps, VA}]$.
- **Power Factor ($\text{PF}$):** $\text{PF} = \cos(\phi) = \frac{P}{S} \quad (\text{Lagging for inductive loads, Leading for capacitive})$.

### 11.3 Balanced Three-Phase Systems ($\text{Y}$ and $\Delta$)

```
+-----------------------+---------------------------------------+-----------------------------------+
| Configuration         | Voltage Relation                      | Current Relation                  |
+-----------------------+---------------------------------------+-----------------------------------+
| **Wye ($\text{Y}$)**  | $V_{\text{Line-Line}} = \sqrt{3} \cdot V_{\text{Phase}} \angle +30^\circ$ | $I_{\text{Line}} = I_{\text{Phase}}$ |
| **Delta ($\Delta$)**  | $V_{\text{Line-Line}} = V_{\text{Phase}}$ | $I_{\text{Line}} = \sqrt{3} \cdot I_{\text{Phase}} \angle -30^\circ$ |
+-----------------------+---------------------------------------+-----------------------------------+
```

$$\mathbf{Total\ 3\text{-}Phase\ Real\ Power:} \quad P_{\text{total}} = \sqrt{3} \cdot V_{\text{LL}} \cdot I_{\text{Line}} \cdot \cos(\phi) = 3 \cdot V_{\text{Phase}} \cdot I_{\text{Phase}} \cdot \cos(\phi)$$

---

## 12. Analog & Digital Electronics

Electronics leverages semiconductor junctions to amplify signals, switch currents, and process discrete logic states.

### 12.1 Operational Amplifiers (Op-Amps)
The Ideal Op-Amp model operates under two golden rules when configured in negative feedback:
1. **Zero Input Current:** $I_+ = I_- = 0$ (Infinite input impedance $R_{\text{in}} \to \infty$).
2. **Virtual Short:** $V_+ = V_-$ (Infinite open-loop gain $A_{OL} \to \infty$).

```
+-----------------------------------+---------------------------------------------------------------+
| OP-AMP CIRCUIT CONFIGURATION      | CLOSED-LOOP VOLTAGE GAIN / TRANSFER FUNCTION                  |
+-----------------------------------+---------------------------------------------------------------+
| Inverting Amplifier               | $V_{out} = - \left( \frac{R_f}{R_{\text{in}}} \right) V_{\text{in}}$ |
| Non-Inverting Amplifier           | $V_{out} = \left( 1 + \frac{R_f}{R_1} \right) V_{\text{in}}$  |
| Voltage Follower (Buffer)         | $V_{out} = V_{\text{in}} \quad (\text{Gain } = +1)$           |
| Inverting Summing Amplifier       | $V_{out} = - R_f \left( \frac{V_1}{R_1} + \frac{V_2}{R_2} + \dots \right)$ |
| Active Low-Pass Filter (1st Order)| $H(s) = - \frac{R_f / R_{\text{in}}}{1 + s R_f C} \quad (\omega_c = \frac{1}{R_f C})$ |
+-----------------------------------+---------------------------------------------------------------+
```

### 12.2 MOSFET Transistor Operating Regimes (NMOS)
- **Cutoff ($V_{GS} < V_{th}$):** $I_D = 0$ (Transistor acts as open switch).
- **Linear / Triode ($V_{GS} \ge V_{th}$ and $V_{DS} < V_{GS} - V_{th}$):**
  $$I_D = \mu_n C_{ox} \left(\frac{W}{L}\right) \left[ (V_{GS} - V_{th}) V_{DS} - \frac{V_{DS}^2}{2} \right]$$
- **Saturation ($V_{GS} \ge V_{th}$ and $V_{DS} \ge V_{GS} - V_{th}$):**
  $$I_D = \frac{1}{2} \mu_n C_{ox} \left(\frac{W}{L}\right) (V_{GS} - V_{th})^2 (1 + \lambda V_{DS})$$

---

## 13. Electromagnetics & Electric Machines

Electric machines exploit Lorentz forces and Faraday induction to convert electrical energy into mechanical torque.

### 13.1 Maxwell's Core Machine Laws

$$\mathbf{Faraday's\ Law\ of\ Induction:} \quad \mathcal{E} = - N \frac{d\Phi_B}{dt} \qquad \mathbf{Lorentz\ Force:} \quad \mathbf{F} = q (\mathbf{E} + \mathbf{v} \times \mathbf{B}) \implies d\mathbf{F} = I (d\mathbf{L} \times \mathbf{B})$$

### 13.2 Electric Motor Taxonomy & Operating Physics

```
+-----------------------+---------------------------------------+-----------------------------------+
| Motor Type            | Operating Mechanism                   | Key Torque-Speed Characteristic   |
+-----------------------+---------------------------------------+-----------------------------------+
| **DC Brushed**        | Mechanical commutator, constant flux  | Linear drop: $T = T_{\text{stall}} (1 - \omega/\omega_0)$ |
| **AC Induction**      | Rotating magnetic stator field induces| Torque peaks at breakdown slip $s$;|
|                       | rotor currents (Asynchronous: $s > 0$)| zero torque at synchronous speed. |
| **BLDC (Brushless)**  | Electronic inverter commutation, PM   | High efficiency, high torque-to-  |
|                       | rotor, Hall / sensorless feedback     | inertia ratio, flat speed-torque. |
| **Stepper Motor**     | Variable reluctance / PM stepped teeth| Maximum holding torque at zero RPM;|
|                       | open-loop discrete angular steps      | torque rolls off at high step rate|
+-----------------------+---------------------------------------+-----------------------------------+
```

$$\text{Synchronous Speed of AC Field:} \quad N_s = \frac{120 \times f (\text{Hz})}{P (\text{Poles})} \quad [\text{RPM}] \qquad \text{Rotor Slip:} \quad s = \frac{N_s - N_r}{N_s}$$

---

## 14. Control Systems & Feedback Theory

Control theory analyzes dynamic systems to achieve stable target outputs through feedback error minimization.

```
                    FEEDBACK CONTROL LOOP ARCHITECTURE
                  +------------+     +-----------+     +-------+
  Setpoint R(s) ->| Error E(s) |---->|Controller |---->| Plant |----+----> Output Y(s)
             +   +|  (R - Y)   |     |   C(s)    |     | G(s)  |    |
             ^    +------------+     +-----------+     +-------+    |
             |                                                      |
             +-----------------------[ Sensor H(s) ]----------------+
```

### 14.1 Closed-Loop Transfer Function

$$T(s) = \frac{Y(s)}{R(s)} = \frac{C(s) G(s)}{1 + C(s) G(s) H(s)}$$

- **Stability Criterion:** All roots of the characteristic equation ($1 + C(s) G(s) H(s) = 0$) must lie strictly in the **Open Left-Half of the Complex $s$-Plane** ($\text{Re}(s_i) < 0$).

### 14.2 The PID Controller

$$u(t) = K_p e(t) + K_i \int_0^t e(\tau) d\tau + K_d \frac{de(t)}{dt} \iff C(s) = K_p + \frac{K_i}{s} + K_d s$$

```
+---------------------+-------------------+---------------------+-------------------+-------------------+
| Parameter           | Rise Time         | Overshoot           | Settling Time     | Steady-State Error|
+---------------------+-------------------+---------------------+-------------------+-------------------+
| Increase $K_p$      | Decreases (Faster)| Increases           | Minor change      | Decreases         |
| Increase $K_i$      | Decreases         | Increases           | Increases (Slower)| Eliminates to Zero|
| Increase $K_d$      | Minor change      | Decreases (Damping) | Decreases         | Minor change      |
+---------------------+-------------------+---------------------+-------------------+-------------------+
```

- **Integral Anti-Windup:** Disabling or clamping the integral accumulator when the actuator reaches physical saturation limits to prevent severe overshoot recovery delays.

---

## 15. Engineering Standards, Scholarly Corpora & Primary Doors

Rigorous engineering design requires direct integration with verified primary engineering standards, material test codes, and reference compendiums.

### 15.1 Authoritative Mechanical & Electrical Doors

| Domain / Body | Scope & Mandate | Target Search Query | Official Door |
|---|---|---|---|
| **Industrial Press (*Machinery's Handbook*)**| The definitive manufacturing, thread, gear, fit, and tooling reference | `Machinery's Handbook 31st edition Industrial Press` | https://industrialpress.com/machinerys-handbook/ |
| **National Institute of Standards (NIST)** | Fundamental constants, SI standards, CODATA, materials data | `site:nist.gov engineering reference data` | https://www.nist.gov/ |
| **ASME (Mechanical Engineers)** | Boiler & Pressure Vessel Code (BPVC), Y14.5 GD&T, B4.1 Fits | `ASME standards Y14.5 BPVC` | https://www.asme.org/ |
| **IEEE (Electrical & Electronics)** | Electrical standards, National Electrical Safety Code (NESC) | `IEEE standards association Xplore` | https://www.ieee.org/ |
| **National Fire Protection (NFPA / NEC)** | NFPA 70 National Electrical Code (NEC), wiring ampacity | `NFPA 70 National Electrical Code NEC` | https://www.nfpa.org/ |
| **ASTM International** | Material specifications (A36 steel, 6061 Al), tensile testing | `ASTM material standard specifications` | https://www.astm.org/ |
| **ISO / ANSI Standards** | International tolerance grades (ISO 286), ISO 9001 quality | `ISO standards store search` | https://www.iso.org/ |
| **OSHA Regulations** | US workplace machine guarding, lockout/tagout (LOTO) | `site:osha.gov machine guarding standards` | https://www.osha.gov/ |
| **OpenStax University Physics** | Mechanics, thermodynamics, electricity & magnetism | `OpenStax University Physics volumes 1 2 3` | https://openstax.org/ |
| **MIT OCW Engineering** | MIT MechE (2.001/2.003) & EECS (6.002) full courseware | `MIT OpenCourseWare mechanical electrical engineering`| https://ocw.mit.edu/ |

---

## 16. Diagnostic Protocols, Failure Modes & Engineering Problem-Solving

When designing, testing, or diagnosing any physical, mechanical, or electrical system, execute this standardized diagnostic protocol:

```
+---------------------------------------------------------------------------------------------------+
| ENGINEERING DIAGNOSTIC PROTOCOL                                                                   |
+---------------------------------------------------------------------------------------------------+
|  1. DEFINE BOUNDARY & UNITS -> Establish control volume/circuit nodes; convert to consistent units|
|  2. STATE CONSERVATION LAWS -> Apply Mass, Energy, Momentum, Charge (KCL/KVL, ΣF=0, 1st Law).    |
|  3. ISOLATE FAILURE MODES   -> Yield, Buckle, Fatigue, Overheating, Short, Cavitation, Resonate.  |
|  4. COMPUTE DETERMINISTIC   -> Calculate stresses, currents, feeds/speeds via exact formulas.    |
|  5. VERIFY LIMITS & CODES   -> Check dimensional homogeneity, verify Factor of Safety (n),        |
|                                and consult official ASME/IEEE/NEC standards doors.                |
+---------------------------------------------------------------------------------------------------+
```

### 16.1 Diagnostic Matrix: Fatal Engineering Pathologies

| Diagnostic Failure | Underlying Error | Algorithmic Correction |
|---|---|---|
| **Unit System Mixing** | Combining Inches with Millimeters or lbf with Newtons | Enforce strict single-system conversion (the EasyLM units hand).|
| **Omitted FBD Reaction** | Missing moment or shear at fixed support boundary | Draw complete isolated Free-Body Diagram before equations.|
| **Unchecked Buckling** | Sizing slender compression member purely for yield ($\sigma_y$)| Compute Euler critical buckling load $P_{cr} = \frac{\pi^2 EI}{(KL)^2}$.|
| **Static Fatigue Error** | Using static yield strength for cyclic oscillating loads | Apply S-N curve and Modified Goodman fatigue criterion.|
| **G-Code Feed Crash** | Confusing Feed per Rev/Tooth with Inches per Minute | Verify $F_{\text{IPM}} = \text{RPM} \times z \times \text{IPT}$ via `calc`.|
| **Zero-Tolerance Drawing** | Specifying exact nominal dimensions without limits | Apply ANSI B4.1 fit classes and ASME Y14.5 GD&T datum frames.|
| **Pump Cavitation** | Suction pressure dropping below fluid vapor pressure ($p_v$)| Ensure $\text{NPSH}_{\text{available}} > \text{NPSH}_{\text{required}}$ at operating temp.|
| **Floating Circuit Node** | High-impedance input picking up environmental noise | Install pull-up/pull-down resistor or tied ground reference.|
| **Thermal Over-Constraint** | Clamping expanding metal shaft rigidly at both ends | Use floating bearing arrangement on one end for expansion.|
| **Hallucinated Material Spec**| Quoting steel yield or wire ampacity from memory | Fetch official ASTM mill certificate or NFPA 70 table.|

---

## 17. Summary & Closure

Engineering transforms abstract mathematical models into reliable physical reality through rigorous unit accounting, conservation laws, standardized tolerances, and deterministic safety limits. Draw the boundary, name the failure mode, compute with precision, verify against *Machinery's Handbook* and statutory codes, and build systems that protect human life.

```
```
