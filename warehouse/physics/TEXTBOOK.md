---
title: "physics — undergrad textbook"
date: "2026-09-13"
status: living · undergrad · the-stacks
home: "warehouse/physics/"
related:
  - "../math/"
  - "../astronomy/"
  - "../chemistry/"
  - "../engineering/"
---

# Physics — Classical Mechanics, Electrodynamics, Thermodynamics & Quantum Theory

A comprehensive undergraduate textbook exploring the fundamental principles governing matter, energy, space, and time: Newtonian, Lagrangian, and Hamiltonian mechanics, conservation laws and Noether's theorem, continuum mechanics and fluids, electrodynamics and Maxwell's equations, thermodynamics and statistical mechanics, special and general relativity, and non-relativistic quantum wave mechanics.

---

## 0. Syllabus & Structural Map

Physics investigates the universal laws of reality through mathematical modeling verified by quantitative empirical measurement. Every physical theory balances continuous mathematical invariants against observable experimental phenomena.

```
+---------------------------------------------------------------------------------------------------+
|                                      THE PHYSICAL SPECTRUM                                        |
+---------------------------------------------------------------------------------------------------+
|  CLASSICAL MECHANICS (Motion) | Newton · Work-Energy · Lagrangian Mechanics · Noether Symmetries  |
+-------------------------------+-------------------------------------------------------------------+
|  FIELDS & FLUIDS (Continua)   | Navier-Stokes · Wave Mechanics · Harmonic Oscillators · Sound     |
+-------------------------------+-------------------------------------------------------------------+
|  ELECTRODYNAMICS (Maxwell)    | Gauss · Faraday · Ampère-Maxwell · Electromagnetic Waves · Light  |
+-------------------------------+-------------------------------------------------------------------+
|  THERMAL & STATISTICAL (Heat) | Laws of Thermodynamics · Entropy · Boltzmann · Partition Function |
+-------------------------------+-------------------------------------------------------------------+
|  SPACETIME & RELATIVITY (c)   | Lorentz Transformations · Spacetime Invariant · E=mc² · Equiv     |
+-------------------------------+-------------------------------------------------------------------+
|  QUANTUM MECHANICS (Quanta)   | Wave-Particle Duality · Schrödinger Equation · Uncertainty · Spin |
+---------------------------------------------------------------------------------------------------+
```

### Table of Contents

1. [Chapter 1: The Architecture of Physical Law & Coordinate Systems](#1-the-architecture-of-physical-law--coordinate-systems)
2. [Chapter 2: Newtonian Kinematics & Vector Dynamics](#2-newtonian-kinematics--vector-dynamics)
3. [Chapter 3: Work, Energy & Conservation Theorems](#3-work-energy--conservation-theorems)
4. [Chapter 4: Rotational Dynamics, Angular Momentum & Central Forces](#4-rotational-dynamics-angular-momentum--central-forces)
5. [Chapter 5: Analytical Mechanics: Lagrangian & Hamiltonian Formulations](#5-analytical-mechanics-lagrangian--hamiltonian-formulations)
6. [Chapter 6: Oscillations, Resonance & Mechanical Waves](#6-oscillations-resonance--mechanical-waves)
7. [Chapter 7: Fluid Mechanics & Transport Phenomena](#7-fluid-mechanics--transport-phenomena)
8. [Chapter 8: Electromagnetism & Maxwell's Unified Field Equations](#8-electromagnetism--maxwells-unified-field-equations)
9. [Chapter 9: Thermodynamics, Heat Engines & Statistical Entropy](#9-thermodynamics-heat-engines--statistical-entropy)
10. [Chapter 10: Special & General Relativity](#10-special--general-relativity)
11. [Chapter 11: Quantum Mechanics & Wave-Particle Duality](#11-quantum-mechanics--wave-particle-duality)
12. [Chapter 12: Fundamental Constants & Dimensional Analysis](#12-fundamental-constants--dimensional-analysis)

---

## 1. The Architecture of Physical Law & Coordinate Systems

### 1.1 The Nature of Physical Models

A physical theory is a mathematical framework that predicts observable quantities from specified initial and boundary conditions. Physical systems are defined by:
1. **The State Space:** The set of variables required to uniquely specify the configuration (e.g. coordinates and momenta $(q_i, p_i)$ in phase space).
2. **The Dynamical Laws:** Differential equations governing the evolution of state through time (e.g. Newton's laws, Maxwell's equations, the Schrödinger equation).
3. **The Conservation Laws:** Quantities that remain constant throughout all admissible physical transformations (e.g. energy, momentum, charge).

### 1.2 Coordinate Transformations & Symmetries

Physical reality exists independently of the coordinate system chosen by the observer. Fundamental dynamical equations must maintain **invariance of form (covariance)** across valid coordinate transformations:
- **Galilean Covariance:** Invariance under spatial rotations, translations, and constant-velocity boosts in non-relativistic mechanics.
- **Lorentz Covariance:** Invariance under rotations and boosts in four-dimensional Minkowski spacetime.

---

## 2. Newtonian Kinematics & Vector Dynamics

### 2.1 Kinematics of Continuous Motion

For a point particle tracing a trajectory $\mathbf{r}(t) \in \mathbb{R}^3$, the instantaneous velocity and acceleration vectors are defined via calculus:
$$\mathbf{v}(t) = \frac{d\mathbf{r}}{dt}, \quad \mathbf{a}(t) = \frac{d\mathbf{v}}{dt} = \frac{d^2\mathbf{r}}{dt^2}$$

In curvilinear Frenet-Serret coordinates along a path with radius of curvature $\rho$:
$$\mathbf{a}(t) = \frac{dv}{dt} \hat{\mathbf{T}} + \frac{v^2}{\rho} \hat{\mathbf{N}}$$
where the first term represents tangential acceleration altering speed, and the second represents centripetal acceleration altering direction.

### 2.2 Newton's Three Laws of Motion

1. **First Law (Inertia):** In an inertial reference frame, an isolated body persists in its state of rest or uniform rectilinear motion unless compelled to change by a net external force:
   $$\sum \mathbf{F}_{\text{ext}} = 0 \implies \mathbf{v} = \text{constant}$$
2. **Second Law (Momentum Flux):** The net applied force is equal to the time rate of change of the body's linear momentum $\mathbf{p} = m\mathbf{v}$:
   $$\mathbf{F}_{\text{net}} = \frac{d\mathbf{p}}{dt} = m\frac{d\mathbf{v}}{dt} + \mathbf{v}\frac{dm}{dt}$$
   For constant mass ($dm/dt = 0$), this simplifies to $\mathbf{F} = m\mathbf{a}$.
3. **Third Law (Reciprocal Action):** When body $A$ exerts force $\mathbf{F}_{AB}$ on body $B$, body $B$ simultaneously exerts an equal and opposite force $\mathbf{F}_{BA}$ on body $A$:
   $$\mathbf{F}_{AB} = -\mathbf{F}_{BA}$$

---

## 3. Work, Energy & Conservation Theorems

### 3.1 Work and the Line Integral

The mechanical work $W$ performed by a force field $\mathbf{F}(\mathbf{r})$ along a path $C$ from point $A$ to point $B$ is:
$$W = \int_{A}^{B} \mathbf{F} \cdot d\mathbf{r}$$

- **The Work-Kinetic Energy Theorem:** Net work done on a particle equals the change in its kinetic energy $T = \frac{1}{2}mv^2$:
  $$W_{\text{net}} = \Delta T = \frac{1}{2}mv_B^2 - \frac{1}{2}mv_A^2$$

### 3.2 Conservative Forces & Potential Energy

A force field $\mathbf{F}$ is conservative if any of the following equivalent conditions hold:
1. The line integral around any closed loop vanishes: $\oint_C \mathbf{F} \cdot d\mathbf{r} = 0$.
2. The work is path-independent, depending solely on endpoints $A$ and $B$.
3. The curl of the force field vanishes everywhere: $\nabla \times \mathbf{F} = \mathbf{0}$.
4. The force field is expressible as the negative gradient of a scalar potential energy function $U(\mathbf{r})$:
   $$\mathbf{F} = -\nabla U$$

Total mechanical energy $E = T + U$ is strictly conserved in the presence of purely conservative forces:
$$\frac{dE}{dt} = 0 \implies \frac{1}{2}mv^2 + U(\mathbf{r}) = \text{constant}$$

---

## 4. Rotational Dynamics, Angular Momentum & Central Forces

### 4.1 Torque & Angular Momentum

For a particle at position $\mathbf{r}$ relative to an origin, its orbital angular momentum is:
$$\mathbf{L} = \mathbf{r} \times \mathbf{p}$$
Differentiating with respect to time yields the rotational analogue of Newton's second law:
$$\frac{d\mathbf{L}}{dt} = \mathbf{r} \times \frac{d\mathbf{p}}{dt} = \mathbf{r} \times \mathbf{F} = \boldsymbol{\tau}_{\text{net}}$$
where $\boldsymbol{\tau}$ is the net applied torque. If $\boldsymbol{\tau}_{\text{net}} = \mathbf{0}$, angular momentum is invariant.

### 4.2 Central Force Fields

A central force acts along the line connecting the particle to the origin: $\mathbf{F}(\mathbf{r}) = f(r)\hat{\mathbf{r}}$. Because $\boldsymbol{\tau} = \mathbf{r} \times f(r)\hat{\mathbf{r}} = \mathbf{0}$, all central forces conserve angular momentum $\mathbf{L}$, confining all central orbits to a fixed two-dimensional plane.

---

## 5. Analytical Mechanics: Lagrangian & Hamiltonian Formulations

### 5.1 Hamilton's Principle of Least Action

Classical trajectories in configuration space extremize the action functional $S$:
$$S[q(t)] = \int_{t_1}^{t_2} L(q_i, \dot{q}_i, t) \, dt, \quad \delta S = 0$$
where $L = T - U$ is the **Lagrangian** of the system.

Applying the calculus of variations yields the **Euler-Lagrange equations**:
$$\frac{d}{dt}\left( \frac{\partial L}{\partial \dot{q}_i} \right) - \frac{\partial L}{\partial q_i} = 0 \quad (i = 1, \dots, n)$$

### 5.2 Noether's Theorem: Symmetry & Conservation

Formulated by Emmy Noether in 1915: **Every continuous differentiable symmetry of the action corresponds to a physical conservation law.**
- Invariance under time translation ($t \to t + \delta t$) $\implies$ **Conservation of Energy**.
- Invariance under spatial translation ($\mathbf{r} \to \mathbf{r} + \delta\mathbf{r}$) $\implies$ **Conservation of Linear Momentum**.
- Invariance under spatial rotation ($\theta \to \theta + \delta\theta$) $\implies$ **Conservation of Angular Momentum**.
- Invariance under gauge transformations $\implies$ **Conservation of Electric Charge**.

---

## 6. Electromagnetism & Maxwell's Unified Field Equations

In 1865, James Clerk Maxwell unified electrostatics, magnetism, and optics into four coupled vector field equations:

```
+---------------------------------------------------------------------------------------------------+
|                                      MAXWELL'S EQUATIONS (SI)                                     |
+---------------------------------------------------------------------------------------------------+
|  1. GAUSS'S LAW (Electric Flux)      |  ∇ · E = ρ / ε₀                                            |
|     Electric field lines originate on positive charges and terminate on negative charges.         |
+--------------------------------------+------------------------------------------------------------+
|  2. GAUSS'S LAW FOR MAGNETISM        |  ∇ · B = 0                                                 |
|     Magnetic field lines form closed loops; no magnetic monopoles exist in classical nature.      |
+--------------------------------------+------------------------------------------------------------+
|  3. FARADAY'S LAW OF INDUCTION       |  ∇ × E = -∂B / ∂t                                          |
|     A time-varying magnetic field induces a circulation of electric field.                        |
+--------------------------------------+------------------------------------------------------------+
|  4. AMPÈRE-MAXWELL LAW               |  ∇ × B = μ₀ J + μ₀ ε₀ (∂E / ∂t)                            |
|     Magnetic fields arise from electric currents and time-varying electric displacement flux.    |
+---------------------------------------------------------------------------------------------------+
```

### 6.1 Electromagnetic Waves in the Vacuum

In a vacuum with no free charges ($\rho = 0$) and no free currents ($\mathbf{J} = \mathbf{0}$), taking the curl of Faraday's law and applying vector identities yields decoupled three-dimensional wave equations:
$$\nabla^2 \mathbf{E} = \mu_0 \varepsilon_0 \frac{\partial^2 \mathbf{E}}{\partial t^2}, \quad \nabla^2 \mathbf{B} = \mu_0 \varepsilon_0 \frac{\partial^2 \mathbf{B}}{\partial t^2}$$
Comparing with the general wave equation $\nabla^2 \psi = \frac{1}{v^2}\frac{\partial^2\psi}{\partial t^2}$ reveals that electromagnetic disturbances propagate at speed:
$$c = \frac{1}{\sqrt{\mu_0 \varepsilon_0}} \equiv 299,792,458\text{ m/s}$$
proving that light is fundamentally an electromagnetic wave.

---

## 7. Thermodynamics, Heat Engines & Statistical Entropy

### 7.1 The Four Laws of Thermodynamics

- **Zeroth Law (Thermal Equilibrium):** If system $A$ is in thermal equilibrium with $B$, and $B$ with $C$, then $A$ is in equilibrium with $C$, defining empirical temperature $T$.
- **First Law (Energy Conservation):** Internal energy $U$ changes via heat added ($Q$) and work done by the system ($W$):
  $$dU = dQ - dW$$
- **Second Law (Irreversibility & Entropy):** No cyclic process can convert heat completely into work without producing waste heat (Kelvin-Planck). For any isolated system:
  $$dS \ge \frac{dQ}{T} \implies \Delta S_{\text{universe}} \ge 0$$
- **Third Law (Nernst Heat Theorem):** The entropy of a pure crystalline substance approaches zero as temperature approaches absolute zero ($T \to 0\text{ K}$).

### 7.2 Boltzmann's Statistical Entropy

Ludwig Boltzmann connected macroscopic thermodynamic entropy to the microscopic multiplicity $W$ of accessible microstates:
$$S = k_B \ln W \quad (k_B \approx 1.380649 \times 10^{-23}\text{ J/K})$$
Entropy is a measure of the logarithmic statistical probability of a macroscopic configuration.

---

## 8. Special & General Relativity

### 8.1 The Postulates of Special Relativity (1905)

1. **Principle of Relativity:** The laws of physics take identical mathematical form in all inertial reference frames.
2. **Invariance of the Speed of Light:** The speed of light in vacuum $c$ is constant for all inertial observers, independent of the motion of the emitting source.

### 8.2 The Lorentz Transformation

For frames in relative motion at velocity $v$ along the $x$-axis:
$$x' = \gamma(x - vt), \quad y' = y, \quad z' = z, \quad t' = \gamma\left(t - \frac{vx}{c^2}\right)$$
where the Lorentz factor is:
$$\gamma = \frac{1}{\sqrt{1 - v^2/c^2}}$$

- **Time Dilation:** Moving clocks run slow: $\Delta t = \gamma \Delta t_0$.
- **Length Contraction:** Moving rods contract along motion axis: $L = L_0 / \gamma$.
- **Relativistic Invariant Interval:** Spacetime distance between events is invariant across all inertial observers:
  $$\Delta s^2 = c^2 \Delta t^2 - (\Delta x^2 + \Delta y^2 + \Delta z^2)$$
- **Relativistic Energy-Momentum Relation:**
  $$E^2 = (pc)^2 + (m_0 c^2)^2$$
  At rest ($p = 0$), mass and rest energy are equivalent: $E_0 = m_0 c^2$.

---

## 9. Quantum Mechanics & Wave-Particle Duality

### 9.1 De Broglie Hypothesis & The Uncertainty Principle

All matter exhibits both wave-like and particle-like properties. A particle with linear momentum $p$ possesses de Broglie wavelength:
$$\lambda = \frac{h}{p}$$

Werner Heisenberg's **Uncertainty Principle** establishes that canonically conjugate observables cannot be simultaneously determined with arbitrary precision:
$$\Delta x \Delta p \ge \frac{\hbar}{2}, \quad \Delta E \Delta t \ge \frac{\hbar}{2} \quad \left(\hbar = \frac{h}{2\pi}\right)$$

### 9.2 The Time-Dependent Schrödinger Equation

The state of a non-relativistic quantum particle is described by a complex probability wave function $\Psi(\mathbf{r}, t)$ evolving according to:
$$i\hbar \frac{\partial \Psi}{\partial t} = \hat{H}\Psi = \left( -\frac{\hbar^2}{2m}\nabla^2 + V(\mathbf{r}, t) \right) \Psi$$
Max Born's probability interpretation dictates that $|\Psi(\mathbf{r}, t)|^2 \, d^3\mathbf{r}$ represents the probability of finding the particle within volume element $d^3\mathbf{r}$.
