---
title: "physics — undergrad textbook"
date: "2026-09-13"
status: living · undergrad
home: "warehouse/physics/"
related:
  - "../math/"
  - "../chemistry/"
  - "../weather/"
  - "EasyLM calc hand"
  - "EasyLM units hand"
  - "warehouse/LAW.md"
---

# physics — undergrad textbook

a working book for people who must **name a model, then predict a measurement**.
this file teaches. constants you cannot check → DONT_KNOW / fetch NIST or the named door. arithmetic only with **EasyLM calc**. unit conversion only with **EasyLM units**.

**law this book applies:** SI first. dimensional check. draw the system. conservation only when the condition holds. superposition only in linear models. say the frame. orbits live **in this pack**. do not invent G, h, e, k, μ.

**constants.** G, h, k, N_A, R, and other CODATA values: fetch the live page https://physics.nist.gov/cuu/Constants/ then pass stated numbers to EasyLM calc. do not invent digits. **c = 299792458 m/s** is exact by SI definition (BIPM). Celsius: T/K = t/°C + 273.15 (definitional). standard atmosphere 101325 Pa is a defined conventional value; still convert other pressure units with EasyLM units.

---

## 0. how to use this book

read chapter 1, then the chapter the job needs. LINK_INDEX.md is official doors, not the lesson.

| you need | chapter |
|---|---|
| what a model is | 1 |
| units, SI, dimensions | 2 |
| motion, force, energy, spin | 3 |
| gravity, kepler, transfers | 4 |
| fluids | 5 |
| waves, sound, light | 6 |
| charge, fields, circuits, Maxwell | 7 |
| heat, entropy, gases | 8 |
| c invariant, γ | 9 |
| photons, atoms, particles | 10 |
| stars, cosmos (undergrad) | 11 |
| compute / constants | 12 |
| stuck on a problem | 13 |

work order: **why → what → how**. name the system and the model before you write an equation.

---

## 1. what physics is

physics builds **models** that map a system to a number you could, in principle, measure. a good answer names:

1. the **system** (what you keep, what you throw away)
2. the **model** (classical point mass, rigid body, ideal gas, ray optics, two-body gravity, …)
3. the **assumptions** (no drag, v ≪ c, isolated, continuum, …)
4. the **equation**
5. the **check** (units, limit, special case)

four questions, every time:

1. what are the **units**?
2. what is **conserved** — and is the condition actually true here?
3. is the model **classical, EM, thermo, wave, quantum, or relativistic**?
4. what **number** is needed — and is it on a named page?

**a model is not the world.** newtonian gravity is a model. Maxwell is a model. Schrödinger is a model. each has a domain. when v is not ≪ c, newtonian mechanics is the wrong tool, not a moral failure.

**theory vs experiment.** theory constrains what may happen. experiment (or a cited table) is how a constant or a cross-section enters the page. inference does not remember G to eight places.

**check:** if you cannot say the model and the frame, you are not ready to compute.

---

## 2. units, SI, measurement

**SI base:** m, kg, s, A, K, mol, cd. derived units (N, J, W, Pa, C, V, T, Hz, …) are combinations of these. write them on both sides of every equation.

**dimensional check** catches most algebra bugs. if the left side is a force and the right side is an energy, stop.

**2019 SI.** the system is defined by a set of exact defining constants (c, h, e, k, N_A, Δν_Cs, K_cd). **c = 299792458 m/s** is one of those definitions. digits of the others and the brochure: fetch **BIPM** / **NIST** (https://physics.nist.gov/cuu/Constants/). after that redefinition, ε₀ and μ₀ are **measured**, not exact. do not quote a vacuum-permittivity value from memory.

**CODATA** is the international adjustment of the remaining constants (G among them). door: NIST fundamental constants. PDG reprints a table and adds particle-physics quantities. if two tables disagree on a digit, say so; do not average.

**measurement** is a comparison to a standard, with an uncertainty. a number with no unit and no uncertainty is a decoration. significant figures follow the uncertainty, not a vibe.

**prefixes** (k, M, μ, n, …) are SI. mix of cgs and SI in one line is how 4π sneaks in and kills you. this book works in SI unless a named course (cgs E&M) says otherwise.

**check:** both sides same dimension. constant from NIST, not from memory.

---

## 3. classical mechanics

### kinematics

definitions (inertial frame, one dimension first):

- velocity \(v = dx/dt\)
- acceleration \(a = dv/dt\)

constant-\(a\) follows by integration:

- \(v = v_0 + a t\)
- \(x = x_0 + v_0 t + \tfrac{1}{2} a t^2\)
- \(v^2 = v_0^2 + 2 a (x - x_0)\)

these are the same statement; pick the one that hides the unknown you do not have. from rest under constant g, position \(\tfrac{1}{2} g t^2\) has speed \(g t\). confirm a derivative with EasyLM calc (`diff`) when the algebra is messy. two- and three-dimensional motion is the same derivatives on vectors. projectile: constant g down, no drag, until you say otherwise. g here is a local acceleration, not G; a value for a place is a measurement or a geodesy fetch.

circular: speed may be constant while acceleration is centripetal, toward the center, magnitude \(v^2/r\) (or \(\omega^2 r\)). kinematics does not explain *why*; dynamics does.

### newton

in an **inertial** frame: \(\Sigma F = dp/dt\). for constant mass, \(\Sigma F = ma\).

three laws, working form:

1. if the net force is zero, the momentum is constant (inertia).
2. net force is the rate of change of momentum.
3. forces between two bodies are equal and opposite **and of the same kind** (action-reaction pairs live on *different* free-body diagrams).

**free-body diagram** is the move. draw every force on *this* body. then project on axes. friction, tension, normal, gravity, drag — name them. “the force of motion” is not a force.

worked method (block on a slope, no numbers invented):

1. draw the block; axes parallel/perpendicular to the plane often save a component.
2. forces: gravity \(mg\) down, normal, friction if the problem named it (static \(\le \mu_s N\), kinetic \(\mu_k N\), directions opposite the would-be / actual slip).
3. \(\Sigma F_x = ma_x\), \(\Sigma F_y = 0\) if no jump off the plane.
4. μ from a table or the problem statement — do not invent a coefficient.

**momentum** \(p = mv\). conserved for a system when the net *external* impulse is zero. collisions: say elastic (KE also conserved) or inelastic (not). 1D elastic two-body with masses m1, m2 is a solvable linear system (momentum + KE); EasyLM calc for the algebra. explosions and rockets are momentum with changing mass — fetch MIT 8.01 if that is the job.

### energy and work

work \(W = \int \mathbf{F} \cdot d\mathbf{x}\). for constant force along a straight displacement, \(W = F \Delta x \cos\theta\).

**work–energy theorem:** net work on a particle equals the change in kinetic energy. kinetic energy \(KE = \tfrac{1}{2} m v^2\) in the newtonian model.

**potential energy** exists when the force is conservative (\(\oint F\cdot dx = 0\), or F = −∇U). examples: \(U = m g y\) near earth’s surface (uniform g), \(U = \tfrac{1}{2} k x^2\) for a Hookean spring, \(U = -G m_1 m_2 / r\) for newtonian gravity (G from NIST; see ch 4). the zero of U is a convention; ΔU is the physics.

mechanical energy \(E = KE + U\) is conserved when non-conservative work is zero (no friction, no time-dependent constraints you forgot). if friction is in the problem, energy is still a bookkeeping tool: \(W_{nc} = \Delta KE + \Delta U\). heat and deformation took the missing piece.

power is work per time, \(P = dW/dt\). for a force on a moving point, \(P = \mathbf{F}\cdot\mathbf{v}\). in circuits it will look like \(P = I V\) (ch 7). same word, check the units.

### rotation

for a rigid body about a fixed axis: \(\tau = I \alpha\), \(L = I \omega\). torque \(\boldsymbol{\tau} = \mathbf{r} \times \mathbf{F}\). moment of inertia \(I = \int r_\perp^2 dm\) depends on the axis; parallel-axis theorem \(I = I_{cm} + M d^2\) when the first axis is through the CM and parallel. do not grab a formula for the wrong axis. rolling without slipping couples translation and rotation: \(a = r\alpha\), \(v = r\omega\). angular momentum of a system is conserved when external torque about that point is zero.

**frames.** Newton’s laws as \(\Sigma F = ma\) need an inertial frame. accelerating cars and rotating earth are not. fictitious forces are bookkeeping in non-inertial frames — name the frame.

**continuum vs particle.** a rigid body is a model. a point mass is a model. if the object deforms, you left this chapter.

---

## 4. gravity and orbits

this pack **owns orbits**. they are not a sister subject.

**newton gravity** (structure): two point masses attract along the line joining them; magnitude \(G m_1 m_2 / r^2\). **G** is a measured constant. fetch **NIST** (https://physics.nist.gov/cuu/Constants/). do not improvise digits. do not invent a numerical \(\mu = GM\).

**standard gravitational parameter** \(\mu\) of a primary is the useful combination for orbits around that body. M and \(\mu\) for sun/earth/planets: fetch **JPL** / **IAU** / NASA fact sheets. then the two-body formulas below may be used.

**two-body** with inverse-square force: relative motion is a conic with a focus at the primary (bound: ellipse, including the circle; unbound: parabola / hyperbola). reduced mass is the honest mass in the relative problem; for a satellite ≪ primary, satellite mass drops out of the acceleration.

local identities (use these; do not invent siblings). \(\mu\) from a named door, then EasyLM calc:

- circular: \(v = \sqrt{\mu / r}\)
- period: \(T = 2\pi \sqrt{r^3 / \mu}\)  (Kepler 3 for circular / for semi-major axis \(a\) in the ellipse form)
- vis-viva: \(v^2 = \mu (2/r − 1/a)\)
- escape: \(v^2 \ge 2\mu / r\)  (from rest at infinity, energy zero)

**Kepler**, working:

1. ellipse, primary at a focus
2. equal areas in equal times (angular momentum)
3. \(T^2 \propto a^3\)  (same primary)

**Hohmann:** two burns between circular coplanar orbits. Δv numbers need \(\mu\) and the two radii — fetch those, then calc. real transfers have plane changes, atmosphere, third bodies.

**assumptions to state:** point masses (or spherical shells), isolated two-body, no drag, no thrust except named burns, newtonian. ephemerides of real solar-system bodies: **JPL Horizons**, not this page.

n-body, perturbations, CR3BP, patched conics: later orbital course.

---

## 5. fluids

a **fluid** does not support static shear. **density** ρ, **pressure** p (force per area, isotropic in a static fluid).

hydrostatics: \(dp/dz = -\rho g\) in the usual “z up” sign. for incompressible ρ, Δp = ρ g h. buoyancy is the weight of displaced fluid (Archimedes) when that model applies.

**continuum** assumption: mean free path ≪ the object. rarefied gas is a different model.

moving fluids, inviscid, steady, along a streamline: Bernoulli is an energy statement with conditions. viscosity, turbulence, shocks violate those conditions. **continuity** is conservation of mass. for incompressible flow in a pipe, \(A v\) is constant.

dimensionless numbers (Reynolds, Mach) tell you which terms dominate. do not invent a critical Reynolds number; fetch a fluids door for the regime.

ideal-gas pressure of ch 8 is the microscopic cousin of this chapter’s p.

---

## 6. oscillations, waves, optics

**simple harmonic motion** when the restoring force is \(-k x\) (or the small-angle pendulum). \(\omega = \sqrt{k/m}\) for the mass-spring; \(\omega = \sqrt{g/L}\) for the small-angle simple pendulum. x(t) = A cos(ωt + φ). damping and driving: fetch 8.03 / OpenStax when the job is resonance.

**wave** on a string / sound / EM in vacuum: a disturbance that transports energy. \(v = f \lambda\). **superposition** holds in linear media. interference and diffraction are superposition with a path difference. two-slit, single-slit, thin film: fetch the named formula when you need the sine of the angle.

sound is a pressure wave in a material. EM waves in vacuum travel at c (defined, SI). mechanical waves do not.

**optics.** ray model: wavelength ≪ the apparatus. reflection, refraction. **Snell:** n1 sin θ1 = n2 sin θ2; n from a table at a named wavelength. do not recite an index table. mirrors and thin lenses: paraxial equation 1/s + 1/s' = 1/f, sign convention **stated**. wave model: interference, diffraction, polarization. photon model: ch 10.

dispersion: v (hence n) depends on frequency. that is why prisms work and why “the speed of light in glass” without a wavelength is unfinished.

---

## 7. electromagnetism

**charge** is conserved. two signs. Coulomb: inverse-square force along the line joining point charges. the SI prefactor involves ε₀ — **measured** after 2019. fetch NIST for the constant; do not mix cgs.

**field.** \(\mathbf{F} = q(\mathbf{E} + \mathbf{v}\times\mathbf{B})\) (Lorentz). E and B are the objects Maxwell’s equations constrain. potential V is a scalar whose gradient is −E in electrostatics (conservative field, no changing B).

**current** \(I = dq/dt\). steady current in a wire is charge per time through a surface.

**circuits**, lumped model: Ohm \(V = IR\) for the materials that obey it. power \(P = IV\). series / parallel, Kirchhoff: conservation of charge (junction) and of energy (loop) in the lumped graph. capacitors store energy in E; inductors in B. RC / RL / RLC: DE with initial conditions (math pack).

**magnetism.** moving charges (and intrinsic moments) produce B. force on a moving charge is perpendicular to v and to B — it does no work. force on a current element: \(I\,d\mathbf{l}\times\mathbf{B}\).

**Faraday:** a changing magnetic flux through a loop produces an emf. Lenz: the induced current fights the change. this is how generators and transformers exist.

### Maxwell’s four equations (SI, undergrad)

integral form (any closed surface S bounding volume V; any loop C bounding surface Σ):

1. **Gauss for E:** \(\displaystyle \oint_S \mathbf{E}\cdot d\mathbf{A} = \frac{Q_{\mathrm{enc}}}{\varepsilon_0}\)
2. **Gauss for B:** \(\displaystyle \oint_S \mathbf{B}\cdot d\mathbf{A} = 0\)
3. **Faraday:** \(\displaystyle \oint_C \mathbf{E}\cdot d\mathbf{l} = -\frac{d\Phi_B}{dt}\)
4. **Ampère–Maxwell:** \(\displaystyle \oint_C \mathbf{B}\cdot d\mathbf{l} = \mu_0 I_{\mathrm{enc}} + \mu_0\varepsilon_0 \frac{d\Phi_E}{dt}\)

differential form (same content, local):

1. \(\nabla\cdot\mathbf{E} = \rho/\varepsilon_0\)
2. \(\nabla\cdot\mathbf{B} = 0\)
3. \(\nabla\times\mathbf{E} = -\partial\mathbf{B}/\partial t\)
4. \(\nabla\times\mathbf{B} = \mu_0\mathbf{J} + \mu_0\varepsilon_0 \partial\mathbf{E}/\partial t\)

what they say, in order: charge is the source of E; there are no magnetic monopoles as sources of B; a changing B makes a circling E; currents *and* a changing E make a circling B. the last term (Maxwell’s displacement current) is why a charging capacitor is consistent with charge conservation and why the equations imply electromagnetic waves.

in vacuum, J = 0 and ρ = 0, the wave equation follows for E and B with speed \(1/\sqrt{\mu_0\varepsilon_0}\), which is c. ε₀ and μ₀: fetch NIST; do not invent the product. c itself is the defined 299792458 m/s.

**static vs dynamic.** electrostatics is the ∂B/∂t = 0 slice. magnetostatics is the steady-current slice. radiation needs acceleration of charge.

**check:** SI vs cgs. integral vs differential is the same law. constants from NIST.

---

## 8. thermodynamics and statistical mechanics

**thermo** is energy and entropy for systems too big to track particle by particle.

state variables: p, V, T, U, S, … **temperature** is the thing that equalizes in thermal contact. SI kelvin is defined via k (fetch BIPM / NIST). T/K = t/°C + 273.15.

**zeroth law.** if A is in thermal equilibrium with B, and B with C, then A with C. that transitivity is what makes “same temperature” a consistent label.

**heat** Q and **work** W are process quantities, not state functions. **first law:** ΔU equals heat plus work, **with the sign convention stated**. common: ΔU = Q − W (W by the system) or ΔU = Q + W (W on the system). pick one and hold it. without the sentence, the equation is ambiguous.

**ideal gas:** \(p V = n R T\). **R** is a constant (molar); fetch NIST. T is absolute (K). real gases need a different equation of state. U of a monatomic ideal gas depends only on T (undergrad kinetic-theory result); degrees of freedom change the heat capacity — fetch a table for a named gas.

**second law.** entropy of an **isolated** irreversible process increases. reversible processes on the system can keep ΔS_universe = 0. Clausius: heat does not flow by itself from cold to hot. Kelvin–Planck: a cycle cannot convert heat from a single reservoir entirely into work with no other effect. heat engines: Carnot efficiency between two reservoirs is 1 − T_c/T_h (T absolute); real engines are worse. do not invent an efficiency number.

entropy change of the universe is the bookkeeping that makes those statements quantitative. for a reversible heat transfer, dS = đQ_rev / T.

**third law** (name): S → a constant as T → 0 for a perfect crystal. engineering tables: NIST webbook.

**statistical mechanics** connects microscopic counting to thermo. temperature ↔ average energy in a named ensemble. Boltzmann factor, partition function: later course. kinetic theory of gases is the undergrad bridge (pressure from momentum transfer).

**check:** sign convention on W. isolated vs closed. T in K. R from NIST.

---

## 9. special relativity

postulates, working: the laws have the same form in every inertial frame; **c** is invariant (same in all those frames). c = 299792458 m/s is a defining SI constant.

when v is not ≪ c, newtonian addition of velocities is the wrong model.

**what relativity changes** (and what it does not):

| newtonian habit | relativistic replacement |
|---|---|
| absolute time | time between two events depends on the frame |
| absolute simultaneity | two events with Δx ≠ 0 can be simultaneous in one inertial frame and not in another |
| length of a moving stick | proper length is the rest-frame length; moving lengths contract along the motion |
| u = u' + v | velocity addition saturates at c |
| p = mv, KE = ½mv² | p = γ m v, E = γ m c², KE = (γ − 1) m c² |
| gravity as GMm/r² | that force law is not the relativistic gravity theory (GR is later) |

Newton’s second law as F = dp/dt still has a place if p is the relativistic momentum. F = ma with constant m does not.

**γ** from the primer: \(\gamma = 1 / \sqrt{1 - v^2/c^2}\). time dilation, length contraction, simultaneity failure — all γ, all with the pair of events named. do not apply time dilation to a problem until you have said whose clock and which two events. Lorentz transformation (standard configuration): fetch OpenStax / 8.20 for the exact x, t mix; do not sign-error it from memory if the job cares.

**energy and momentum.** rest energy E_rest = m c² (massive particle); \(E^2 - (pc)^2 = (mc^2)^2\). massless: E = p c. kinetic energy is E − m c², not ½ m v², unless you are in the v ≪ c limit (γ → 1, recover Newton).

**general relativity** is the gravity track (later). this chapter does not do curved spacetime.

**check:** whose clock. which two events. v vs c. G still from NIST if someone mixed in a gravity number.

---

## 10. quantum mechanics and particles

classical particles and classical waves both fail at atomic scale. **quantum mechanics** is the undergrad replacement: a state, an amplitude, a measurement postulate.

**photon:** E = h f. **h** fetch NIST (https://physics.nist.gov/cuu/Constants/). photoelectric: light ejects electrons from a metal with a frequency threshold; intensity does not replace frequency. that is why the photon model earned its keep.

**de Broglie:** λ = h / p. matter diffracts.

**Bohr atom** is a historical model with a limited domain. use it to *order* hydrogen lines if a course still does; do not treat orbits of electrons as classical ellipses. modern intro: standing waves in a potential, discrete spectra, quantum numbers.

**wavefunction.** |ψ|² is the probability density (Born), with the caveats of the course. Schrödinger equation is the dynamical law in the non-relativistic theory. operators ↔ observables. uncertainty: you cannot prepare a state with arbitrarily sharp x and p together. exact inequality: fetch 8.04 / OpenStax.

**spin, identical particles, Pauli.** fermions vs bosons. chemistry pack uses this without re-deriving it.

**particles.** the standard model is a map of quarks, leptons, gauge bosons, Higgs — plus gravity not in that quantum field theory. **masses, widths, branching fractions: PDG.** do not remember a quark mass. nuclear: NNDC. “atom smashers” without a named detector and a PDG citation are stories.

---

## 11. astrophysics (undergrad)

astro applies the rest of this book to objects you cannot put on a bench.

- gravity + hydrostatics → stellar structure (order of magnitude)
- fusion as a nuclear process (Q values: NNDC / a named table)
- EM + QM → spectra, why we know compositions
- orbits (ch 4) → binary masses, exoplanets, spacecraft
- SR / GR when compact objects or cosmology demand it
- statistical mechanics → degenerate matter (white dwarf / neutron star as named limits; fetch a stellar-structure door for the masses)

**Hubble, CMB, dark matter, dark energy** are observational facts-plus-models. values of H₀ and cosmological parameters: fetch PDG astro tables or a named mission. do not recite.

this chapter does not replace JPL for a launch window.

---

## 12. compute and constants

| job | do |
|---|---|
| algebra, derivatives, integrals, undergrad stats | **EasyLM calc** |
| convert units | **EasyLM units** |
| G, h, e, k, c, R, α, m_e, N_A, … | **NIST** CODATA https://physics.nist.gov/cuu/Constants/ |
| particle properties | **PDG** |
| solar-system numbers, ephemerides | **JPL Horizons** / NASA fact sheets / **IAU** |
| what is a derivative, what is a field | this book, then a door |
| a named experimental value | fetch the door, cite |

never do the arithmetic or the unit conversion in model weights. format the expr. pass `result`. `ok` false → DONT_KNOW.

adjacent: `../math/` (structure) · `../chemistry/` (bonds, thermo tables) · `../weather/` (atmosphere as a fluid). this pack owns the physical model and **orbits**.

---

## 13. how to attack a problem

1. draw the **system**. what is inside, what forces cross the boundary.
2. name the **model** and the **frame**.
3. list **knowns / unknowns** with **units**.
4. ask what is **conserved** (energy, momentum, angular momentum, charge, baryon number, …) and whether the hypothesis holds.
5. write the **equation** (Newton, energy, Maxwell slice, first law, vis-viva, …).
6. **compute** with EasyLM calc / units. constants from NIST / PDG / JPL, not from weights.
7. **check:** dimensions, limit (m → 0, v → 0, r → ∞, ħ → 0), special case you already know.
8. if a named constant or a sine-form identity is required and not on this page — fetch LINK_INDEX, cite.

stuck patterns:

| symptom | try |
|---|---|
| units do not match | you added a force to an energy, or mixed SI/cgs |
| “lost” energy | friction, radiation, heat; or the wrong zero of PE |
| orbit number looks like earth’s | you used G·M with invented digits. fetch μ |
| γ ≈ 1 but you used SR | v ≪ c; Newton was enough |
| current with no loop | you needed a complete circuit, or a displacement current |
| thermo sign fight | you did not state Q/W convention |
| probability of a particle | you are in ch 10; \|ψ\|², not a Newton trajectory |
| Maxwell prefactor from memory | ε₀, μ₀ from NIST after 2019 |

---

## close

physics is models that survive measurement. name the system. fetch the constant at NIST. compute with EasyLM calc. LINK_INDEX.md is doors.

home: `warehouse/physics/TEXTBOOK.md`
