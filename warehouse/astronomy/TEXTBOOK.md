---
title: "astronomy — undergrad textbook"
date: "2026-09-13"
status: living · undergrad · the-stacks
home: "warehouse/astronomy/"
related:
  - "../physics/"
  - "../math/"
  - "../chemistry/"
  - "../weather/"
---

# Astronomy & Astrophysics — Celestial Mechanics, Stellar Physics & Cosmology

A comprehensive undergraduate textbook exploring the physical architecture of the cosmos: celestial mechanics, planetary dynamics, radiative transfer, stellar structure and nucleosynthesis, stellar death, galactic formation, observational instrumentation, and modern $\Lambda\text{CDM}$ cosmology.

---

## 0. Syllabus & Structural Map

Astronomy applies the fundamental laws of physics and chemistry to celestial bodies and the cosmic vacuum. Its domains scale from planetary orbits within the solar system to the macroscopic geometry of the expanding universe.

```
+---------------------------------------------------------------------------------------------------+
|                                 THE ASTROPHYSICAL SPECTRUM                                        |
+---------------------------------------------------------------------------------------------------+
|  CELESTIAL MECHANICS (Orbits) | Keplerian Laws · Newtonian Gravity · N-Body · Lagrange Points    |
+-------------------------------+-------------------------------------------------------------------+
|  RADIATION & SPECTRA (Light)  | Blackbody Emission · Wien & Stefan-Boltzmann · Spectral Types     |
+-------------------------------+-------------------------------------------------------------------+
|  STELLAR ENGINES (Stars)      | Hydrostatic Equilibrium · Fusion Chains (p-p, CNO) · H-R Diagram  |
+-------------------------------+-------------------------------------------------------------------+
|  STELLAR COMPACTS (Remnants)  | Degeneracy Pressure · White Dwarfs · Supernovae · Neutron Stars   |
+-------------------------------+-------------------------------------------------------------------+
|  GALACTIC STRUCTURE (Islands) | Milky Way Morphology · Rotation Curves · Dark Matter Halos        |
+-------------------------------+-------------------------------------------------------------------+
|  COSMOLOGY (The Whole)        | Hubble Expansion · Cosmic Microwave Background · FLRW Metric      |
+---------------------------------------------------------------------------------------------------+
```

### Table of Contents

1. [Chapter 1: Celestial Mechanics & Orbital Dynamics](#1-celestial-mechanics--orbital-dynamics)
2. [Chapter 2: Electromagnetic Radiation & Astronomical Spectroscopy](#2-electromagnetic-radiation--astronomical-spectroscopy)
3. [Chapter 3: Stellar Structure & Hydrostatic Equilibrium](#3-stellar-structure--hydrostatic-equilibrium)
4. [Chapter 4: Nuclear Astrophysics & Stellar Energy Generation](#4-nuclear-astrophysics--stellar-energy-generation)
5. [Chapter 5: The Hertzsprung-Russell Diagram & Stellar Evolution](#5-the-hertzsprung-russell-diagram--stellar-evolution)
6. [Chapter 6: Degenerate Matter & Compact Stellar Remnants](#6-degenerate-matter--compact-stellar-remnants)
7. [Chapter 7: The Interstellar Medium & Star Formation](#7-the-interstellar-medium--star-formation)
8. [Chapter 8: Galaxies, Dark Matter & Extragalactic Architecture](#8-galaxies-dark-matter--extragalactic-architecture)
9. [Chapter 9: Cosmology, Cosmic Microwave Background & the Big Bang](#9-cosmology-cosmic-microwave-background--the-big-bang)
10. [Chapter 10: Observational Systems, Telescopes & Astronomical Instruments](#10-observational-systems-telescopes--astronomical-instruments)

---

## 1. Celestial Mechanics & Orbital Dynamics

### 1.1 Kepler's Laws of Planetary Motion

Planetary dynamics emerge from gravitational central force fields. Johannes Kepler derived the empirical kinematical rules governing planetary orbits:

1. **The First Law (Elliptical Paths):** The orbit of each planet is an ellipse with the Sun located at one of the two foci. In polar coordinates centered on a focus:
   $$r(\theta) = \frac{a(1 - e^2)}{1 + e \cos\theta}$$
   where $a$ is the semi-major axis and $e$ is orbital eccentricity ($0 \le e < 1$ for bound closed orbits).

2. **The Second Law (Equal Areas in Equal Times):** The position vector connecting the central body to the orbiting body sweeps out equal planar areas in equal increments of time:
   $$\frac{dA}{dt} = \frac{1}{2} r^2 \frac{d\theta}{dt} = \frac{L}{2\mu} = \text{constant}$$
   This is equivalent to the conservation of orbital angular momentum $\mathbf{L} = \mathbf{r} \times \mathbf{p}$ in a spherically symmetric central potential.

3. **The Third Law (Harmonic Law):** The square of the orbital period $P$ is directly proportional to the cube of the semi-major axis $a$:
   $$P^2 = \left( \frac{4\pi^2}{G(M_1 + M_2)} \right) a^3$$
   For planets orbiting the Sun where $M_{\text{planet}} \ll M_\odot$, measuring $P$ in years and $a$ in astronomical units ($\text{AU}$) yields $P^2 \approx a^3$.

### 1.2 Gravitational Escape Velocity and Vis-Viva Equation

The instantaneous orbital speed $v$ at distance $r$ from the primary mass $M$ is given by the **Vis-Viva equation**:
$$v^2 = G M \left( \frac{2}{r} - \frac{1}{a} \right)$$
Parabolic escape velocity ($a \to \infty$) defines the minimum kinetic energy required to decouple from a gravitational well:
$$v_{\text{esc}} = \sqrt{\frac{2GM}{r}}$$
For the Earth at sea level, $v_{\text{esc}} \approx 11.186\text{ km/s}$; for the solar surface, $v_{\text{esc}} \approx 617.5\text{ km/s}$.

### 1.3 Restricted Three-Body Dynamics & Lagrange Points

When a small mass $m$ moves in the planar gravitational potential of two massive orbiting bodies $M_1$ and $M_2$, five equilibrium points emerge in the co-rotating reference frame:
- **Collinear Points ($L_1, L_2, L_3$):** Lie along the axis connecting the two primaries. Unstable equilibria; space observatories (e.g. SOHO at $L_1$, JWST at $L_2$) maintain quasi-periodic halo orbits using station-keeping propellant.
- **Triangular Points ($L_4, L_5$):** Form equilateral triangles with the primaries, leading and trailing by $60^\circ$. Stable when the mass ratio $M_1 / M_2 > 24.96$ (holding Trojan asteroids in Jupiter's orbit).

---

## 2. Electromagnetic Radiation & Astronomical Spectroscopy

### 2.1 Blackbody Physics & Stellar Luminosity

Stars radiate approximately as thermal blackbody cavities in thermodynamic equilibrium. The spectral radiance is governed by Planck's distribution:
$$B_\lambda(T) = \frac{2hc^2}{\lambda^5} \frac{1}{e^{hc / (\lambda k_B T)} - 1}$$

- **Wien's Displacement Law:** The wavelength of peak emission $\lambda_{\max}$ is inversely proportional to effective surface temperature $T_{\text{eff}}$:
  $$\lambda_{\max} T_{\text{eff}} = b \approx 2.89777 \times 10^{-3}\text{ m}\cdot\text{K}$$
  A star like the Sun ($T_{\text{eff}} \approx 5778\text{ K}$) peaks at $\lambda_{\max} \approx 501\text{ nm}$ (visible green-yellow light).

- **Stefan-Boltzmann Law:** The total energy flux $F$ radiated per unit surface area is:
  $$F = \sigma T_{\text{eff}}^4 \quad (\sigma \approx 5.670374 \times 10^{-8}\text{ W}\cdot\text{m}^{-2}\cdot\text{K}^{-4})$$
  Integrating over a spherical stellar surface of radius $R$ yields total **bolometric luminosity**:
  $$L = 4\pi R^2 \sigma T_{\text{eff}}^4$$

### 2.2 Spectral Classification: The Harvard OBAFGKM Sequence

Absorption lines in stellar photospheres reveal ionization states, chemical abundance, and surface gravity:
$$\text{O} \to \text{B} \to \text{A} \to \text{F} \to \text{G} \to \text{K} \to \text{M}$$
- **O-type:** $T > 30,000\text{ K}$, ionized helium lines (He II), intense ultraviolet emission.
- **B-type:** $10,000 - 30,000\text{ K}$, neutral helium (He I), Balmer hydrogen strengthening.
- **A-type:** $7,500 - 10,000\text{ K}$, peak Balmer hydrogen absorption lines (e.g. Vega, Sirius).
- **F-type:** $6,000 - 7,500\text{ K}$, ionized calcium (Ca II H & K lines) appearing.
- **G-type:** $5,200 - 6,000\text{ K}$, prominent solar-type stars with strong neutral iron and ionized calcium lines.
- **K-type:** $3,700 - 5,200\text{ K}$, orange dwarfs dominated by metallic lines.
- **M-type:** $2,400 - 3,700\text{ K}$, red dwarfs and red supergiants dominated by titanium oxide (TiO) molecular bands.

---

## 3. Stellar Structure & Hydrostatic Equilibrium

### 3.1 The Equation of Hydrostatic Equilibrium

A stable star maintains balance between inward gravitational attraction and outward thermal and radiation pressure gradients:
$$\frac{dP}{dr} = -\frac{G M(r) \rho(r)}{r^2}$$
where $M(r)$ is the enclosed mass within concentric spherical shell of radius $r$:
$$\frac{dM}{dr} = 4\pi r^2 \rho(r)$$

### 3.2 The Four Fundamental Equations of Stellar Structure

Complete stellar interior models require simultaneously solving four coupled non-linear differential equations:
1. **Mass conservation:** $dM/dr = 4\pi r^2 \rho$
2. **Hydrostatic balance:** $dP/dr = -G M \rho / r^2$
3. **Energy generation:** $dL/dr = 4\pi r^2 \rho (\epsilon_{\text{nuc}} - \epsilon_\nu)$
4. **Energy transport:**
   - Radiative regime: $\frac{dT}{dr} = -\frac{3 \kappa \rho L}{16 \pi a c r^2 T^3}$
   - Convective regime (Schwarzschild criterion): $\left|\frac{dT}{dr}\right| > \left(1 - \frac{1}{\gamma}\right) \frac{T}{P}\left|\frac{dP}{dr}\right|$

---

## 4. Nuclear Astrophysics & Stellar Energy Generation

### 4.1 The Proton-Proton (p-p) Chain

In stars with core temperatures $T_c \lesssim 1.5 \times 10^7\text{ K}$ (including the Sun), hydrogen fuses into helium-4 predominantly via the proton-proton chain:
$$4 \, {}^1\text{H} \to {}^4\text{He} + 2e^+ + 2\nu_e + 2\gamma + 26.73\text{ MeV}$$
The rate-limiting initial step relies on the weak nuclear force to convert a proton into a neutron during a quantum tunneling collision:
$${}^1\text{H} + {}^1\text{H} \to {}^2\text{H} + e^+ + \nu_e \quad (\tau \sim 10^9\text{ years in the solar core})$$

### 4.2 The CNO Cycle

In massive stars ($M \gtrsim 1.3 M_\odot$) where $T_c > 1.6 \times 10^7\text{ K}$, carbon, nitrogen, and oxygen act as nuclear catalysts. The energy generation rate scales steeply:
$$\epsilon_{\text{CNO}} \propto T^{16} \quad \text{versus} \quad \epsilon_{\text{pp}} \propto T^4$$
This extreme temperature sensitivity produces intense energy flux in the core, driving vigorous convective core mixing.

---

## 5. The Hertzsprung-Russell Diagram & Stellar Evolution

### 5.1 The Morphology of the H-R Diagram

The Hertzsprung-Russell (H-R) diagram graphs stellar luminosity ($L / L_\odot$ or absolute magnitude $M_V$) on the vertical axis against effective surface temperature $T_{\text{eff}}$ (or spectral class / color index $B - V$) decreasing to the right.

1. **The Main Sequence:** Core hydrogen-burning phase; stars spend $\sim 90\%$ of their nuclear lifespans here. The mass-luminosity relation follows:
   $$L \propto M^{3.5} \implies \tau_{\text{ms}} \approx 10^{10} \left( \frac{M_\odot}{M} \right)^{2.5}\text{ years}$$
   A $10 M_\odot$ star burns through its core hydrogen in $\sim 30\text{ million years}$, while a $0.2 M_\odot$ red dwarf endures for trillions of years.

2. **Red Giant Branch (RGB) & Asymptotic Giant Branch (AGB):** Core hydrogen exhaustion causes core gravitational contraction and heating, igniting hydrogen shell burning and expanding the outer convective envelope by two orders of magnitude. Helium core flash occurs at $T_c \approx 10^8\text{ K}$ through the triple-alpha process:
   $$3 \, {}^4\text{He} \to {}^{12}\text{C} + \gamma$$

3. **Planetary Nebulae:** Stars with initial masses $M \lesssim 8 M_\odot$ shed their outer envelopes via pulsating stellar winds, leaving exposed degenerate carbon-oxygen cores as white dwarfs.

---

## 6. Degenerate Matter & Compact Stellar Remnants

### 6.1 White Dwarfs & the Chandrasekhar Mass Limit

When thermal pressure ceases, quantum mechanical Pauli exclusion principle prevents identical fermions (electrons) from occupying the same quantum states. Electron degeneracy pressure supports the star:
$$P_e \propto \rho^{5/3} \quad (\text{non-relativistic}) \implies R \propto M^{-1/3}$$
As stellar mass increases, the degenerate electrons become relativistic ($P_e \propto \rho^{4/3}$). At this threshold, degeneracy pressure cannot sustain gravitational collapse against a critical mass:
$$M_{\text{Ch}} \approx 1.44 M_\odot$$
Exceeding this boundary produces catastrophic gravitational collapse or thermonuclear detonation (Type Ia supernova).

### 6.2 Neutron Stars, Pulsars & Black Holes

For progenitor stars with $M_{\text{init}} \approx 8 - 25 M_\odot$, iron core collapse forces electron capture:
$$p + e^- \to n + \nu_e$$
The resulting neutron degeneracy pressure stabilizes a radius $R \sim 10 - 12\text{ km}$ with density $\rho \sim 10^{17}\text{ kg/m}^3$. Rapid conservation of angular momentum and magnetic flux creates rapidly spinning magnetized **pulsars**. The upper theoretical limit on neutron star mass (**Tolman-Oppenheimer-Volkoff limit**) is $\sim 2.1 - 2.3 M_\odot$; above this threshold, complete gravitational collapse into a Schwarzschild spacetime singularity (**stellar-mass black hole**) is mathematically inevitable.

---

## 7. The Interstellar Medium & Star Formation

### 7.1 The Jeans Instability Criterion

Gravitational collapse of an interstellar molecular gas cloud occurs when self-gravity overcomes thermal gas pressure. The minimum mass (**Jeans Mass**) required for collapse is:
$$M_J = \left( \frac{5 k_B T}{G \mu m_H} \right)^{3/2} \left( \frac{3}{4\pi \rho_0} \right)^{1/2}$$
Cool ($T \sim 10 - 20\text{ K}$), dense ($\rho_0 \sim 10^{-19}\text{ g/cm}^3$) giant molecular clouds have $M_J \sim 100 - 1000 M_\odot$, fragmenting hierarchically during collapse to produce open stellar clusters and protoplanetary accretion disks.

---

## 8. Galaxies, Dark Matter & Extragalactic Architecture

### 8.1 Galactic Dynamics & Galactic Rotation Curves

In a Keplerian system where mass is concentrated at the center, orbital velocity falls as $v(r) \propto r^{-1/2}$. However, Doppler velocity measurements of neutral hydrogen (21-cm spin-flip line) in spiral galaxies show flat rotation curves at large radii:
$$v(r) \approx \text{constant} \implies M(r) \propto r$$
This empirical divergence mandates the presence of an extended, non-luminous **dark matter halo** containing roughly 5 times the mass of baryonic matter.

---

## 9. Cosmology, Cosmic Microwave Background & the Big Bang

### 9.1 The Hubble-Lemaître Law & Cosmological Redshift

Spectroscopic observations of distant galaxies demonstrate systematic spectral line shifts towards longer wavelengths. The cosmological redshift parameter $z$ is:
$$z = \frac{\lambda_{\text{obs}} - \lambda_{\text{emit}}}{\lambda_{\text{emit}}} = \frac{a(t_{\text{obs}})}{a(t_{\text{emit}})} - 1$$
where $a(t)$ is the cosmic scale factor. For local galaxies ($z \ll 1$):
$$v = c z = H_0 d$$
where $H_0 \approx 67 - 73\text{ km}\cdot\text{s}^{-1}\cdot\text{Mpc}^{-1}$ is the current Hubble expansion rate.

### 9.2 The Friedmann Equation & The $\Lambda\text{CDM}$ Model

Applying Einstein's general relativity to an isotropic, homogeneous cosmos (FLRW metric) yields the Friedmann equation:
$$\left( \frac{\dot{a}}{a} \right)^2 = \frac{8\pi G}{3}\rho - \frac{k c^2}{a^2} + \frac{\Lambda c^2}{3}$$
Normalizing against the critical density $\rho_c = \frac{3 H^2}{8\pi G}$ yields the cosmic energy budget:
$$\Omega_M + \Omega_R + \Omega_k + \Omega_\Lambda = 1$$
Precision satellite observations (COBE, WMAP, Planck) confirm a flat universe ($k = 0$) dominated by dark energy ($\Omega_\Lambda \approx 0.69$), cold dark matter ($\Omega_c \approx 0.26$), and baryonic matter ($\Omega_b \approx 0.05$).

### 9.3 The Cosmic Microwave Background (CMB)

At epoch $z \approx 1090$ ($t \approx 380,000\text{ years}$ post-Big Bang), temperature dropped to $T \approx 3000\text{ K}$, allowing electrons and protons to form neutral hydrogen (**recombination**). Photons decoupled from matter and streamed freely across the universe. Today, cosmological redshifting stretches this primordial light into the microwave spectrum, exhibiting an isotropic blackbody spectrum at:
$$T_0 = 2.72548 \pm 0.00057\text{ K}$$
Temperature fluctuations $\Delta T / T_0 \sim 10^{-5}$ encode primordial density perturbations that seeded all subsequent galaxies and cosmic web filaments.

---

## 10. Observational Systems, Telescopes & Astronomical Instruments

Astronomical discovery relies on resolving power and light gathering capacity.
- **Diffraction Limit (Rayleigh Criterion):** Angular resolution $\theta$ is limited by aperture diameter $D$:
  $$\theta \approx 1.22 \frac{\lambda}{D}\text{ radians}$$
- **Atmospheric Seeing & Adaptive Optics:** Ground-based optical observatories compensate for atmospheric turbulence using laser guide stars and deformable mirrors updating at kilohertz frequencies.
- **Interferometry:** Combining signals from an array of separated apertures (e.g. ALMA, Event Horizon Telescope, VLTI) synthesizes an effective aperture equivalent to the baseline distance between antennas.
