---
title: "engineering — link index & primary doors"
date: "2026-08-28"
status: living · undergrad · link-index
home: "warehouse/engineering/"
---

# Engineering — Verified Primary Doors & Reference Repositories

Authoritative repositories, statutory standards organizations, primary engineering literature, open courseware, and query templates.

---

## 1. Verified Official Doors

```
+------------------------------------+--------------------------------------------------------------+
| DOMAIN / STANDARD BODY             | SCOPE & MANDATE                                              |
+------------------------------------+--------------------------------------------------------------+
| **Industrial Press**               | Publisher of *Machinery's Handbook* (Definitive machining,   |
| (Machinery's Handbook)             | thread profiles, gear geometry, fits, speeds/feeds manual)   |
|                                    | https://industrialpress.com/machinerys-handbook/             |
+------------------------------------+--------------------------------------------------------------+
| **NIST (National Institute of**    | Physical reference data, SI definitions, CODATA fundamental  |
| **Standards and Technology)**      | constants, engineering material properties databases         |
|                                    | https://www.nist.gov/ | https://physics.nist.gov/            |
+------------------------------------+--------------------------------------------------------------+
| **ASME (American Society of**      | Boiler & Pressure Vessel Code (BPVC), Y14.5 GD&T standards,  |
| **Mechanical Engineers)**          | B4.1 Fits/Limits, B1.1 Unified Screw Threads                 |
|                                    | https://www.asme.org/                                        |
+------------------------------------+--------------------------------------------------------------+
| **IEEE (Institute of Electrical &**| Electrical engineering, IEEE Xplore, power grid standards,  |
| **Electronics Engineers)**         | NESC National Electrical Safety Code, wireless IEEE 802      |
|                                    | https://www.ieee.org/ | https://ieeexplore.ieee.org/         |
+------------------------------------+--------------------------------------------------------------+
| **NFPA / National Electrical Code**| NFPA 70 National Electrical Code (NEC), conductor ampacity,  |
| **(NEC)**                          | electrical safety in workplace NFPA 70E                      |
|                                    | https://www.nfpa.org/                                        |
+------------------------------------+--------------------------------------------------------------+
| **ASTM International**             | Standard test methods and material specifications (Steels,   |
|                                    | Aluminum alloys, Polymers, Concrete, Composites)             |
|                                    | https://www.astm.org/                                        |
+------------------------------------+--------------------------------------------------------------+
| **ISO / ANSI Standards**           | ISO 286 ISO System of Limits and Fits, ISO 9001 quality,     |
|                                    | ISO 12100 Safety of Machinery risk assessment                |
|                                    | https://www.iso.org/ | https://www.ansi.org/                  |
+------------------------------------+--------------------------------------------------------------+
| **OSHA (Occupational Safety &**    | Code of Federal Regulations (29 CFR 1910), machine guarding, |
| **Health Administration)**         | Lockout/Tagout (LOTO 1910.147), arc flash safety             |
|                                    | https://www.osha.gov/                                        |
+------------------------------------+--------------------------------------------------------------+
| **NCEES (FE / PE Licensing)**      | NCEES Reference Handbooks (Fundamentals of Engineering FE &  |
|                                    | Principles and Practice of Engineering PE exams)             |
|                                    | https://ncees.org/                                           |
+------------------------------------+--------------------------------------------------------------+
| **OpenStax University Physics**    | Peer-reviewed open textbooks (Mechanics, Waves, Thermo, EM)  |
|                                    | https://openstax.org/subjects/science                        |
+------------------------------------+--------------------------------------------------------------+
| **MIT OpenCourseWare (MechE/EECS)**| MIT Mechanical Engineering (2.001, 2.003) & EECS (6.002)     |
|                                    | https://ocw.mit.edu/                                         |
+------------------------------------+--------------------------------------------------------------+
```

---

## 2. Targeted Search Templates

When retrieving specific code values, material yield numbers, or statutory standards, use explicit targeted query strings:

```
# Machinery's Handbook / Fits & Threads
"Machinery's Handbook" AND "Unified Screw Threads" AND ("UNC" OR "UNF")
"ANSI B4.1" AND "preferred limits and fits" AND "RC" OR "LC" OR "FN"
"AGMA" AND "involute gear geometry" AND "diametral pitch" AND "Lewis form factor"

# Materials & Metallurgy Specifications
"ASTM A36" AND "minimum yield strength" AND "tensile strength" filetype:pdf
"AISI 4140" AND "quenched and tempered" AND "mechanical properties" AND "hardness HRC"
"Aluminum 6061-T6" AND "thermal conductivity" AND "fatigue strength"

# Electrical & National Electrical Code (NEC)
"NFPA 70" OR "NEC" AND "Table 310.16" AND "ampacities of insulated conductors"
"IEEE Std 1584" AND "arc flash hazard calculations"
"NEMA" AND "motor frame dimensions" AND "torque speed curve"

# Pressure Vessels & Structural Codes
"ASME BPVC Section VIII" AND "maximum allowable working pressure"
"AISC Steel Construction Manual" AND "wide flange beam" AND "plastic section modulus"
"ASCE 7-22" AND "minimum design loads" AND "wind load" OR "seismic design category"
```

---

## 3. Grounded Citation & Verification Rules

1. **Never Invent Material Numbers:**
   Yield strength ($S_y$), modulus of elasticity ($E$), and thermal conductivity ($k$) must be cited from mill certificates, ASTM standards, or the NIST WebBook.
2. **Never Guess Safety Codes or Ampacity:**
   Wire ampacity must be verified against NFPA 70 / NEC tables. Structural load factors must be verified against ASCE 7 / AISC.
3. **Use Deterministic Math:**
   Always compute gear ratios, feeds/speeds, and Reynolds numbers using calculation tools (`calc` / `units`).

```
```
