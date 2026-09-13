---
title: "weather — undergrad textbook"
date: "2026-09-13"
status: living · undergrad
home: "warehouse/weather/"
related:
  - "../physics/"
  - "../geography/"
  - "../agriculture/"
  - "../methods/"
  - "EasyLM calc hand"
  - "EasyLM units hand"
  - "warehouse/LAW.md"
---

# weather — undergrad textbook

a working book for people who must **name the clock, the measurement, and the system**.
this file teaches. live obs, forecasts, CO₂ ppm, lapse rates, category winds, composition percents → DONT_KNOW / fetch the named door. arithmetic on *stated* numbers only with **EasyLM calc** and **EasyLM units**. **do not invent a forecast.**

**law this book applies:** weather is the atmosphere at a time and place. climate is the long average over a stated period. pressure and water are the engines. a forecast is a model output with a valid time and a source. tropical cyclone ≠ tornado. SI / hPa; convert with EasyLM units. physics owns the fluid and the ideal gas.

**constants.** G, h, k, N_A, R: fetch NIST https://physics.nist.gov/cuu/Constants/ then calc. **c = 299792458 m/s** is SI-defined if a radiation job needs it. do not invent a lapse rate in K/km.

---

## 0. how to use this book

read chapter 1, then the chapter the job needs. LINK_INDEX.md is official doors, not the lesson.

| you need | chapter |
|---|---|
| weather vs climate vs meteorology | 1 |
| layers, air as a mixture | 2 |
| T, p, humidity, wind as state | 3 |
| radiation, energy budget as structure | 4 |
| clouds, rain, snow | 5 |
| stability, convection | 6 |
| wind, cells, jet | 7 |
| fronts, midlatitude cyclone | 8 |
| thunderstorm, tornado | 9 |
| tropical cyclone | 10 |
| forecast as a model | 11 |
| climate as statistics | 12 |
| NWS, NHC, SPC, IPCC | 13 |
| stuck on a problem | 14 |

work order: **why → what → how**. name now-vs-climate before you name a storm.

place and climate belts: `../geography/`. crop/frost: `../agriculture/`. `pV = nRT`, hydrostatic fluid: `../physics/`.

---

## 1. what weather is

**weather** is the state of the atmosphere at a **time** and **place**. **meteorology** is the science of that state and its change. **climatology** is the statistics of weather over a **stated period** (normals are a NCEI / WMO product — fetch the period).

four questions, every time:

1. **now**, a **forecast** (hours–days), or **climate** (years)?
2. what is **measured** (temperature, pressure, wind, water in air, precipitation)?
3. which **system** (front, cyclone, convection, tropical cyclone, orographic)?
4. a live number or “what is it doing today” — **fetch** NWS / the named Met service. this pack is the vocabulary.

**atmosphere** is the fluid envelope held by gravity. weather lives mostly in the **troposphere**. space-edge conventions (Kármán line) are a fetch if the job is aerospace, not rain.

**check:** if you cannot say the clock and the place, you do not have weather yet.

---

## 2. the atmosphere (structure)

air is a **mixture**. dry-air majority: nitrogen, oxygen, argon; **carbon dioxide** and other traces; **water vapor** is the big variable. mole fractions and a current CO₂ value: fetch NOAA GML / a NASA fact sheet. do not recite a percent from wiki.

**layers** (temperature-structure names, bottom up):

| layer | temperature story (qualitative) | weather job |
|---|---|---|
| **troposphere** | T generally falls with height; weather lives here | clouds, storms, fronts |
| **tropopause** | the lid | aircraft and sounding landmark |
| **stratosphere** | T generally rises with height (ozone heating) | ozone chemistry; few weather clouds |
| **mesosphere** | T falls again | later atmospheric science |
| **thermosphere** | T rises; very thin | aurora, orbit drag as names |
| **exosphere** | fades into space | not rain |

heights of the tropopause vary with latitude and season — fetch a sounding or a standard-atmosphere table (COESA / ICAO), do not recite km. polar tropopause is lower than tropical, as a pattern; today’s number is a sounding.

**standard atmosphere** is a *defined* profile for engineering (ICAO / NASA). it is not today’s sounding.

**hydrostatic** (structure): in the vertical, pressure decrease balances weight of the air above when the fluid is at rest in that direction. dp/dz = −ρg in the usual sign. the equation and g: physics pack + EasyLM units. a sounding is a measured profile (NWS / University of Wyoming archive / the Met service).

**boundary layer** is the lowest part of the troposphere coupled to the ground by turbulence on a diurnal clock. fog, frost, and gusts often live there. night inversions trap smoke and cold; afternoon mixing can break them. a sounding shows the inversion as a layer where T *rises* with height near the ground.

**composition vs weather.** the N2/O2/Ar mix is almost a constant for meteorology; water vapor is not. a CO2 ppm from NOAA GML is a climate/composition number, not this afternoon’s rain. do not paste a remembered 78% / 21% as a substitute for a fetch if the job is a mole fraction.

**check:** mixture vs layer vs today’s profile. today’s profile is an observation.

---

## 3. the state of the air

four working variables:

| variable | is |
|---|---|
| **temperature** | kinetic story of the gas; thermometer, radiosonde, satellite retrieval |
| **pressure** | force per area; falls with height. meteorology often reports **hPa** (same size as millibar) |
| **humidity** | water in the air — vapor pressure, mixing ratio, relative humidity, dew point as *different* numbers. name which |
| **wind** | air in motion. direction is **from** which it blows in the usual METAR/NWS convention. say the convention |

**station vs sea-level pressure.** maps that look like “highs and lows” are usually reduced to a common level. a station pressure without the reduction is a different sentence.

**density** ties T, p, composition through the gas law (`../physics/` · `pV = nRT` or the meteorology form with specific gas constant). **R** from NIST. compute only from stated numbers with EasyLM calc. T in K: T/K = t/°C + 273.15.

**units.** SI first. convert with **EasyLM units**. knot, mph, °F are allowed *after* you name them. do not mix in one equation.

**Beaufort** is a 0–12 force scale of *effect* on sea (and a land cousin). knot bands: WMO / NWS fetch. this book is not a speed table.

**METAR / TAF** are coded obs and airport forecasts. decode from the issuing office; do not guess a group.

**check:** which humidity. station or MSLP. which wind convention.

---

## 4. energy and radiation

the sun is the input. the earth-atmosphere system emits infrared. **weather is redistribution** of that energy plus latent heat in water.

**budget** (structure): incoming shortwave, reflected (albedo), absorbed, outgoing longwave, greenhouse trapping as a *named process* (gases absorb and emit IR). a global number of W/m², an imbalance, a climate sensitivity: **NASA / NOAA / IPCC fetch**. do not recite.

**diurnal cycle** is the day-night swing. **seasons** are orbital geometry (physics / astronomy), not a mood.

**greenhouse effect** is physics in the air. **climate change** as an observed and forced change of the statistics is ch 12. they are not the same sentence.

**check:** which flux. which period. number → named budget page.

---

## 5. water in the air

**phase.** vapor, liquid, ice. latent heat is why condensation heats the parcel and evaporation cools it (physics thermo).

**saturation.** enough vapor at that T (and p) that net condensation can begin. **dew point** is the T where that happens for this mixing ratio. **relative humidity** is not “how much water” by itself — it is a ratio. name the variable. **wet-bulb** is another T; it is not dew point. mixing ratio and specific humidity are mass-based; they travel with the parcel better than RH.

**cloud** is condensed water (or ice) suspended. form names (cumulus, stratus, cirrus, nimbus as the old genera) are a classification. a satellite product is a fetch.

**precipitation:** rain, drizzle, snow, sleet, graupel, hail as kinds. **how** (warm rain, ice process) is a microphysics course. **amount** is a measurement (gauge, radar estimate with a method). radar QPE is a model+obs blend — say so.

**fog** is a cloud on the ground. **dew** and **frost** are surface condensation/deposition.

**check:** vapor vs condensate. RH vs dew point. amount → obs.

---

## 6. stability and convection

a **parcel** lifted (or pushed) may be denser or lighter than its surroundings. **stability** is that comparison.

**lapse rate** is how T changes with height in the environment. **adiabatic** rates are the parcel’s T change if no mixing and no condensation / with condensation. the numbers (K/km): fetch a meteo table / COESA. do not recite.

**CAPE, CIN, lifted index** are sounding-derived indices. they are computed, not remembered. a live sounding: SPC / University of Wyoming archive / the Met service.

**convection** is buoyancy-driven vertical motion. it makes showers and thunderstorms (ch 9) when moisture and a trigger join.

**orographic** lift: the mountain is the trigger. **convergence** at the surface is another.

**check:** environment vs parcel. index → computed from a named sounding.

---

## 7. wind

wind exists because **pressure is not uniform** and the earth **rotates**.

**pressure-gradient** force: air is pushed toward lower pressure. **Coriolis** (named): apparent deflection in the rotating frame — right in the northern hemisphere, left in the southern, for the usual large-scale wind. **friction** slows and turns the wind near the surface. **geostrophic** is the balance of PGF and Coriolis when you neglect friction and acceleration — a model, not the ground. **gradient wind** adds curvature. **ageostrophic** leftovers are how systems intensify.

**Buys Ballot** (rule of thumb, NH): with the wind at your back, low pressure is on the left — a geostrophic cartoon, not a forecast.

**global cells** (names): Hadley, Ferrel, polar. **trade winds, westerlies, doldrums, ITCZ** as observed patterns. they move with season. a climatology map: NCEI / NASA.

**jet stream** is a fast upper current. position *today*: fetch NCEP / NWS. this book does not place it from memory.

**local:** sea breeze, mountain/valley, downslope (chinook / foehn as names), urban. fetch the local forecast discussion if the job is *this afternoon*.

**check:** scale (global / synoptic / meso / local). model vs obs.

---

## 8. fronts and midlatitude cyclones

a **front** is a boundary between air masses. weather at a front is the *change*: wind shift, T, dew point, pressure tendency, clouds. on a surface chart, fronts are drawn where those gradients concentrate.

| front | working picture |
|---|---|
| **cold** | colder air advances; often a sharper T drop, a wind shift, a line of convection possible |
| **warm** | warmer air advances; often a broader cloud/precip shield ahead |
| **stationary** | air masses stall; weather can hang |
| **occluded** | the cold front has caught the warm front in the classic cartoon; the warm sector is lifted off the surface |

these are **names of analyses**, not laws. a real chart can be messier than the four icons. fetch the NWS WPC surface analysis if the job is *today’s* fronts.

an **air mass** is a large body of air with a history (continental/maritime, polar/tropical as the usual letters: cP, mT, …). source region is geography. air masses modify as they move.

**midlatitude cyclone** (extratropical): a low with fronts, fed by temperature contrast (**baroclinic**). it is not a tropical cyclone. the Norwegian-school cartoon (open wave → occlusion) is a *sketch*. a real storm is a chart: NWS WPC / Met Office. upper-level support (trough, jet streak) is why some surface lows deepen and some do not — fetch the discussion, do not diagnose a bomb from a memory of millibars.

**high** (anticyclone): often quieter, not always. night fog, winter cold: possible. fetch the discussion.

**how to read a surface chart (NWS WPC):**

1. find the **lows and highs** (MSLP labels). the number is reduced pressure, not station pressure.
2. find the **fronts** (symbols: cold triangles, warm semicircles, occluded pips, stationary both).
3. note **isobars**: close packing means a strong pressure gradient and, usually, stronger wind.
4. match to the **forecast discussion** if the job is *why this weather*, not just the icon.
5. a cartoon in this book is not the chart. the chart is the fetch.

**check:** extra-tropical vs tropical. front type. chart vs cartoon.

---

## 9. thunderstorms and tornadoes

a **thunderstorm** is a convective storm with lightning. ingredients (usual undergrad list): moisture, instability, lift. **shear** organizes it.

**kinds** (names): single-cell, multicell, supercell, squall line, MCS. **severe** is a *definition* on a NWS/SPC page (hail size, wind, tornado) — fetch the threshold. do not recite an inch.

**lightning** is an electrical discharge. distance tricks and “count the seconds” mnemonics are not this book’s SoT; shelter is the safety page (NWS).

**tornado** is a violently rotating column, from cloud to ground. **EF scale** is a *damage* scale (NWS/SPC). wind bands on that scale: fetch. a tornado is not a tropical cyclone and not a dust devil.

**watch vs warning.** watch: conditions favorable in a region and window. warning: the hazard is occurring or imminent for a smaller place. NWS. this book does not issue either.

**check:** convective vs synoptic. watch vs warning. EF is damage, not a measured wind unless they measured one.

---

## 10. tropical cyclones

a **tropical cyclone** is a warm-core low over warm water, with organized convection and a closed surface circulation. **hurricane / typhoon / cyclone** are regional names for the same class above a stated wind threshold. the threshold and the **Saffir–Simpson** (or regional) category: **NHC / JTWC / JMA / WMO** fetch. do not recite a knot.

**not** a midlatitude cyclone: no fronts as the engine; the engine is latent heat and a warm ocean. **extratropical transition** is a named change of type.

**track and intensity** *now*: NHC (Atlantic/East Pacific) / CPHC / JTWC / JMA / the RSMC. this book does not forecast a landfall.

**storm surge, rain, wind, tornadoes** are different hazards of the same storm. name which.

**check:** basin and the issuing centre. category is a wind definition, not a total-damage score.

---

## 11. forecasting

a **forecast** is a model (or a human using models and obs) speaking about a **valid time**. it has a **source**. it is not a feeling and not this textbook.

**obs:** surface stations, radiosondes, radar, satellite, aircraft, ships, profilers. **analysis** is the estimated state now. **NWP** is the equations stepped forward (physics + numerics + a grid). **ensemble** is many runs for spread. **MOS** and **nowcast** are other layers. name which.

**verification** is methods pack: a score on a stated set. do not quote a “percent accurate” from memory.

**how to fetch a US forecast (NWS).** for a place in the US:

1. open **https://www.weather.gov/** (or the local WFO page).
2. set the **point**: lat/lon, city, or click the map.
3. read **now** (obs, radar, warnings) vs **forecast** (period, valid time).
4. open the **forecast discussion** (AFD) when you need the *why* — that is the human meteorologist’s reasoning on the models.
5. watches / warnings / advisories are products with a VTEC and a polygon. the map on weather.gov is the living list. this book does not issue them.
6. aviation: `aviationweather.gov` / the state’s AIS.
7. if they asked *today*, fetch *today*. yesterday’s screenshot is not a forecast.

elsewhere: Met Office, JMA, ECMWF, the named national service. say the issuing office.

**NWS product names you will actually open:**

| product | is |
|---|---|
| **AFD** | area forecast discussion — the why |
| **ZFP / PFM** | zone / point forecast — the what, with valid times |
| **hazard map** | watches, warnings, advisories in force |
| **radar / satellite** | obs now, not a day-3 forecast |
| **WPC surface analysis** | fronts and lows as drawn this hour |
| **SPC convective outlook** | severe risk *categories* for a day, not a warning |
| **NHC advisory** | tropical cyclone track/intensity for a named storm |

**limits.** chaos: small errors grow. a day-8 forecast is a different object from a nowcast. say the lead time.

**check:** valid time. issuing office. deterministic vs ensemble.

---

## 12. climate as statistics

**climate** is the distribution of weather over a stated period at a place (or a globe). **normals** (often 30 years) are a product: NCEI / WMO. a “climate of X” without the period is incomplete.

**Köppen** and cousins are *classifications* of those statistics. geography pack owns the atlas of belts.

**forcing and feedback** as names: solar, volcanic, greenhouse gases, albedo, water-vapor, clouds. a sensitivity in °C per doubling: IPCC / a named paper, not memory.

**observed change** (global T, sea level, ice, extremes) is an assessment product. **IPCC**, **NASA GISS**, **NCEI**, **WMO state of the climate**. cite the report year. do not invent a degree.

**attribution** of a single storm to climate change is a methods problem. the honest sentence is often “this kind of event, this shift of odds” — fetch the attribution page if the job needs it.

**check:** period. place vs globe. assessment vs this afternoon’s rain.

---

## 13. compute and fetch

| job | do |
|---|---|
| US forecast, obs, discussion | **NWS** https://www.weather.gov/ |
| US model/guidance | **NCEP** / WPC |
| tornado / severe | **SPC** |
| Atlantic / E. Pacific tropical | **NHC** |
| climate normals, archives | **NCEI** |
| climate education / maps | **climate.gov** |
| seasonal | **CPC** |
| global assessment | **IPCC** · **WMO** |
| satellite / earth energy | **NASA** (GISS, Earth Observatory) |
| CO₂ / gases | **NOAA GML** |
| standard atmosphere | **ICAO** / **NASA COESA** |
| international forecast | **Met Office** · **JMA** · **ECMWF** · the national service |
| undergrad dynamics | **MIT OCW** atmosphere-ocean |
| NWS education modules | **NWS JetStream** |
| T/p arithmetic | **EasyLM calc** + **EasyLM units** |
| R, other constants | **NIST** https://physics.nist.gov/cuu/Constants/ |
| fluid / gas law | `../physics/` |

never invent a forecast, a category wind, a current temperature, or a climate degree. format a search. cite the URL. `ok` false → DONT_KNOW.

adjacent: `../physics/` (fluid, radiation) · `../geography/` (place, belts) · `../agriculture/` (frost, drought, growing season) · `../methods/` (verification). this pack owns the atmosphere’s *weather* vocabulary and where to fetch the living map.

---

## 14. how to attack a problem

1. name **now / forecast / climate**.
2. name **place** and **clock**.
3. name what is **measured**.
4. name the **system** (front, convection, tropical, orographic, …).
5. if they asked what it is doing **today** — fetch NWS / the Met service. stop inventing.
6. if they asked a **warning** — the issuing office, not this book.
7. constants, winds of a category, CO₂, lapse rate → LINK_INDEX, cite.
8. compute only from stated numbers, with EasyLM calc/units.

stuck patterns:

| symptom | try |
|---|---|
| climate sentence for this afternoon | ch 1, 11 |
| hurricane called a tornado | ch 9–10 |
| RH treated as water amount | ch 5 |
| remembered category-3 knots | ch 10. NHC |
| jet stream placed from memory | ch 7. NCEP |
| wiki composition percent as SoT | ch 2. NOAA / NASA |
| Beaufort as a knot from scratch | ch 3. WMO |
| invented 7-day skill | ch 11. methods |
| front type from a cartoon only | ch 8. WPC analysis |

---

## close

weather is the air at a time and place. climate is the long average. fetch the NWS map. LINK_INDEX.md is doors.

home: `warehouse/weather/TEXTBOOK.md`
