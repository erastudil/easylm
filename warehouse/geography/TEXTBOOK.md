---
title: "geography — undergrad textbook"
date: "2026-09-13"
status: living · easylm
home: "warehouse/geography/"
related:
  - "../weather/"
  - "../agriculture/"
  - "../civics/"
  - "../history/"
  - "../finance/"
  - "EasyLM calc hand"
  - "EasyLM units hand"
  - "warehouse/LAW.md"
---

# geography — undergrad textbook

a working book for tongues, desks, and humans who must **name the place, then the layer**.  
this file teaches. population, GDP, area, lat/long, capital, rank → DONT_KNOW / fetch the named door / call **calc** and **units** on *stated* numbers. **a country is not a coastline.**

**law this book applies:** place first. scale (city ≠ country ≠ continent). numbers have a year. state is a legal box; a people can cross boxes. culture is not a flag. atlas ≠ civics (`../civics/` owns who rules). climate *process* is `../weather/`; this pack owns the belt on the map. do not invent a census.

---

## 0. how to use this book

read chapter 1, then the chapter the job needs.

| you need | chapter |
|---|---|
| what geography is | 1 |
| lat, long, time, datum | 2 |
| earth as a machine (tilt, seasons) | 2b |
| maps, projection, scale | 3 |
| land, water, plate tectonics | 4 |
| climate belts | 5 |
| scale, region | 6 |
| population as a census-fetch | 7 |
| cities | 8 |
| hazards as place | 8b |
| GDP, trade on the map | 9 |
| language, religion, culture as distributions | 10 |
| state, border, capital | 11 |
| named country, four layers | 12 |
| USGS, UN, World Bank, Census | 13 |
| stuck on a problem | 14 |

work order: **why → what → how**. name where before you name a statistic.

---

## 1. what geography is

**geography** is the arrangement of the earth and the humans on it. **physical geography** is land, water, climate as *place*. **human geography** is settlement, work, language, belief, and power *on the map*.

four **layers** (this pack’s working cut):

| layer | ask |
|---|---|
| **place** | where · land · water · climate belt · coordinates |
| **people** | how many · density · cities · languages · ages |
| **money** | what they produce · trade · GDP as a *flow* |
| **culture** | language family · religion · arts · foodways as **systems** |

four questions, every time:

1. **where** (continent/region, neighbors, water, belt)?
2. **who** (count, languages, urban/rural) — with a **year**?
3. **how they live** (work, trade, what is grown or made)?
4. **what they keep** (language, rite, arts as structures) — not a costume essay?

a named country: all four, or say which layer is missing. a number: **fetch**, keep the year. UN / World Bank / national statistical office beat a remembered figure. wiki ranking tables do not survive as SoT.

**check:** if you cannot say the scale and the layer, you do not have geography yet.

---

## 2. the grid

the earth is a nearly-sphere. **latitude** is the angle north or south of the **equator** (0°). **longitude** is the angle east or west of a **prime meridian**. the living geodetic meridian for GPS is a WGS84 / IERS convention — fetch NGS / IERS if the second of arc matters. do not invent a lat/long.

**parallels** run east–west (constant latitude). **meridians** run pole to pole (constant longitude). they meet at right angles on the globe; they do not on every map.

**tropics / polar circles** are parallels defined by the earth’s axial tilt. the *degree* of that tilt is a fetch (NASA / IAU / an almanac), not this page.

**time.** a **time zone** is a political-legal offset from a time standard (UTC), not a slice of longitude with clean edges. some zones are :30 or :45. IANA tz / the state’s statute / BIPM for the second. **date line** is a convention with jogs.

**coordinates without a datum** are incomplete. GPS consumers usually sit on WGS84. a national grid (state plane, UTM zone) is a projection plus a zone — name it.

**great circle** is the shortest path on a sphere. a straight line on a Mercator is a rhumb, not a great circle. ships and planes care.

**graticule** is the drawn grid of meridians and parallels. it is not a road. **geoid** vs **ellipsoid** vs **sphere**: the earth’s gravity surface, a smooth math stand-in, and the classroom ball. GPS heights and “height above sea level” can disagree — fetch NGS if the meter is the job.

**UTM** (Universal Transverse Mercator) slices the world into numbered zones, each a transverse Mercator good enough for a strip. name the zone. a six-digit easting without a zone is a rumor.

**check:** lat vs long. datum. zone vs solar noon. sphere vs ellipsoid if the meter matters.

---

## 2b. earth as a machine (thin, then weather pack)

**rotation** gives day and the Coriolis *idea* (moving things deflect relative to the spinning frame — weather pack for the fluid). **orbit and tilt** give seasons: the hemisphere pointed at the sun gets the high sun, not “closer in summer” as the classroom error.

**earth-sun geometry** defines tropics and polar circles as *parallels of tilt*. the degree of tilt: fetch NASA / an almanac. do not recite.

**magnetic pole ≠ geographic pole.** a compass points along the field; declination is a chart (NOAA / a national hydrographic office).

**check:** season as tilt, not distance. compass vs true north.

---

## 3. maps, projection, scale

a **map** is a claim about space: what is shown, what is left out, which **projection**. a projection cannot keep area, shape, distance, and direction all true on a flat sheet. say which property you needed.

**projection families** (names, not a catalog of every EPSG code):

| family | what it tends to keep | cost |
|---|---|---|
| **cylindrical** (Mercator as the famous case) | local shape; rhumb lines as straight | inflates high latitudes |
| **equal-area** (Mollweide, equal-earth, Albers as names) | area | shapes stretch |
| **conic** | mid-latitude east–west regions | poles and the other hemisphere suffer |
| **azimuthal** | direction from one point; some keep distance from that point | the rest of the globe warps |
| **compromise** (Robinson as a name) | nothing exactly; a teaching globe-look | not for measuring |

**Mercator** keeps local shape and rhumb lines; it inflates high latitudes. it is a navigation tool, not a moral. **Web Mercator** is what many slippy maps use — still a Mercator cousin; Greenland still looks huge.

**scale** is map distance : ground distance, or a representative fraction (1:24,000 as a USGS topo habit — fetch the sheet). a bar scale survives photocopying better than a verbal scale. **units** tool if you convert.

**large-scale vs small-scale** (cartographic dialect): a large-scale map shows a small area in detail (city plan). a small-scale map shows a large area (world wall map). this is the opposite of everyday “large = big area.” say which dialect.

**atlas** is a bound set of maps plus a gazetteer. this pack is the *method*; a living atlas is a door (UN geospatial, USGS, a national mapping agency).

**GIS** is the same claims in a database: layers, CRS, attributes. a shapefile without a CRS is a rumor.

**CRS / EPSG.** a coordinate reference system is a datum plus a projection plus units. EPSG codes (WGS 84 as 4326, Web Mercator as 3857 as named common ones) are catalog numbers — fetch epsg.io / the national mapping agency if the code is the job. **reprojecting** is a computation; it is not “the real shape.”

**vector vs raster.** points, lines, polygons with attributes vs a grid of measured cells. mixing them without a shared CRS is how you put a city in the ocean.

**remote sensing** is a measured image (satellite, air). NASA Earth Observatory / USGS EarthExplorer. a color composite is a choice. **resolution** (pixel size) is not the same as **scale**. a 10 m pixel is not a 1:10,000 map until someone makes one.

**check:** which projection property. which CRS. which year of the coastline. large-scale or small-scale. vector or raster.

---

## 4. land, water, plate tectonics

**landform** is the shape: mountain, plain, plateau, valley, coast, ice as names. **process** (weathering, erosion, deposition, tectonics) is why it looks like that. USGS for a named range or a hazard. this book does not recite a height of a peak.

**plate tectonics** is the large-scale engine of crust: the lithosphere in plates that move relative to each other. three boundary *ideas*:

| boundary | usual story |
|---|---|
| **divergent** | plates move apart; new crust (rift, mid-ocean ridge) |
| **convergent** | plates move together; subduction or collision (trench, arc, high range) |
| **transform** | plates slide past (a named fault is a fetch) |

volcano and earthquake as place-hazards: USGS. a magnitude *now*: fetch. **this book does not predict a quake.**

**hotspot** (a named plume idea) can sit *inside* a plate and leave a chain of volcanoes as the plate moves. **passive margin** vs **active margin**: a quiet continental edge vs one that is a plate boundary. coasts are not all the same machine.

**rock cycle** as a place-story: igneous, sedimentary, metamorphic. the geology of a named range is a USGS / national survey page. this book will not recite a formation age.

**water.** freshwater vs salt. river basin, groundwater, lake, glacier, wetland as names. **watershed / catchment / drainage basin** is the area that drains to a point. a continental divide is a ridge of those basins. **discharge** is volume per time at a gauge — USGS water data if a US river; the national hydro office otherwise. do not invent a flow.

**groundwater** is water in pores and fractures. an **aquifer** is a body that yields useful amounts. a recharge area is not always next to the well. overdraft is a measured budget, not a vibe.

**floodplain** is the land a river has a right to occupy when it rises. building there is a land-use choice (civics / local law). **100-year flood** is a statistical name for a recurrence interval — fetch the agency’s definition; it is not a promise of a century of safety.

oceans: the IHO names and limits — fetch if a boundary is the job. **Southern Ocean** as a named fifth is a convention; say the IHO page. **EEZ** (exclusive economic zone) is a legal belt (`../law/` / UNCLOS text), not a current.

**coast.** depositional vs erosional. a tide is physics + local basin. a **tsunami** is a hazard page (USGS / NOAA), not a vibe.

**soil** sits on rock + climate + time + organisms. agriculture pack for the farm; this chapter places the dirt.

**check:** form vs process. belt vs this afternoon’s rain (weather pack). plate boundary named only after a map.

---

## 5. climate belts

**climate** is the *statistics* of weather at a place (`../weather/` for the atmosphere clock). a **climate belt** is a region where those statistics look alike enough to name.

**Köppen** (and cousins) classify by temperature and precipitation patterns, often with vegetation as a hint. a belt is not a country. equator ≠ tropics as a political region.

school belts as a *teaching grid*, not a law of air:

| belt (school name) | usual mark |
|---|---|
| **tropical** | warm year-round; wet, monsoon, or dry-winter subtypes |
| **dry (arid / semi-arid)** | evaporation beats rain; desert and steppe |
| **temperate / mid-latitude** | real seasons; wet or summer-dry (Mediterranean as a named subtype) |
| **continental** | bigger seasonal swing, often interior |
| **polar** | cold; tundra / ice |

**orographic** rain: wind hits a range, rises, cools, drops water on the windward side; leeward is drier. **continentality:** interiors swing more than coasts. **ocean current** as a heat-mover: name the current from a chart, do not invent a temperature.

a **normal** (30-year climate normal as a WMO habit) is a statistic with a period. fetch NCEI / climate.gov / the national met office. this year’s drought is weather until the series says otherwise.

**altitude.** temperature generally falls with height in the troposphere (weather pack for the lapse). a highland in the tropics can wear a temperate crop. **aspect** (which way the slope faces) is a local climate.

**urban heat.** cities are often warmer than their hinterland at night. a city climate is not the country’s climate.

**check:** belt vs this afternoon. Köppen letter only after a source. year of the normal. highland vs latitude.

---

## 6. scale and region

**scale** is the size of the question. a neighborhood fact is not a national fact. a continent average hides the valley.

three scale *senses* (do not mash):

1. **cartographic scale** — representative fraction on a map (ch 3).
2. **geographic scale** — the size of the process (a street, a watershed, a trade bloc).
3. **analytic scale** — the unit you chose to count (person, census tract, country).

**modifiable areal unit.** the same people look different if you redraw the boxes. say the box.

**region** is a cut you chose: physical (basin, range), cultural (language area), economic (trade bloc), administrative (state, province). say the cut.

**continent** is a convention. the usual school six/seven (Africa, Antarctica, Asia, Europe, North America, South America, plus Australia/Oceania as a naming fight) is a *teaching grid*, not a law of rock. Europe/Asia as one landmass (Eurasia) is also true. **Oceania** is the region that holds Australia, New Zealand, and the Pacific islands — not the same word as the country Australia.

**site vs situation.** site is the local facts (harbor, floodplain). situation is where it sits in the network (between X and Y, on the strait). cities live and die on situation as much as site.

**check:** which scale. which cut of region. Australia the state vs the continent word.

---

## 7. population as a census-fetch

**demography** is the measurement of populations: size, age, birth, death, migration. a **count** is a census or an estimate with a **year** and a **method**. UN DESA / Census / the national statistical office. do not recite a world population.

**census vs estimate vs register.** a census is a (usually decennial) attempt to count. an estimate interpolates or uses a sample. a register is a living file (some countries). name which. **undercount** is a known problem; the statistical office publishes it when they have it.

**density** = people / area (stated numbers, then **calc**). crude density is a poor story where people pile in cities and the rest is desert — say rural vs urban if you have it.

**age structure** (pyramid) is the future of labor and care. a median age: fetch. **crude birth / death rates** are per-thousand of the mid-year population — fetch the definition with the number.

**demographic transition** is a *school sketch*: high birth and death → death falls → birth falls → older, slower growth. it is a pattern some countries followed, not a law. do not invent a stage number for a named country without a source.

**migration** is a flow with a push and a pull. stocks vs flows: name which. a refugee definition is a legal page (`../civics/` / UNHCR) as well as a map.

**ethnicity** is a social category people use. it is not a blood myth and not a language and not a passport. **race** as a census box is a state’s invention; biology pack for why it is a bad species cut.

**check:** year. estimate vs census. density as a fraction. do not recite a world total.

---

## 8. cities

**urbanization** is the city *share* of people, and the process of becoming city. a percent: fetch, with year.

**city vs metro vs admin unit.** Tokyo, Mexico City, Lagos — the rank depends on the definition (city proper / urban agglomeration / metro). UN World Urbanization Prospects / the national office. do not argue “largest city” without the definition.

**functions.** port, capital, primate city, industrial, sacred, sprawl as names. **primate** is a huge first city relative to the second — a pattern, not a moral.

**land use** inside the city: core, housing, industry, informal. a zoning map is local law.

**site and situation** (ch 6) decide a lot of urban luck. a capital can be *placed* (a planned seat) or *grown*.

**check:** which urban definition. which year.

---

## 8b. hazards as place

a **hazard** is a process that can harm (quake, flood, cyclone, drought, wildfire, landslide, heat). **risk** is hazard × exposure × vulnerability. a desert is a climate; a drought in a farm belt is a hazard-event.

**named doors:** USGS (quake, volcano, landslide, some water), NOAA / national met office (storm, flood forecast), national disaster agency. a magnitude *now* or a cone of a storm: fetch. this book does not forecast.

**mitigation** is land use, building code, warning, insurance — civics and law as much as maps. a floodplain map is a claim with a year.

**check:** process vs this event. exposure named. door for the live number.

---

## 9. money on the map

**GDP** is a *flow* of output in a year, not a pile of cash (`../finance/` for the identity). **nominal** vs **PPP** are different lists. say which. World Bank / IMF / the national accounts. do not recite a dollar figure or a rank.

**GDP per capita** is GDP / people (stated, then calc). it is not a wage and not a welfare.

**“developed / developing / Global South”** are contested frames. name the source (World Bank income groups, UNDP HDI, a paper). do not use them as a climate.

**trade** is imports and exports of goods and services. a surplus/deficit is a balance-of-payments sentence. what they *make or grow*: FAO / UN Comtrade / ERS for a sector.

**resources** (ore, oil, soil, fish) are geography until they are a market. a reserve number: USGS mineral yearbook / the ministry. do not invent a barrel.

**check:** flow vs stock. nominal vs PPP. year.

---

## 10. culture as distribution

**culture** here is what people keep and transmit: language, rite, foodways, arts as **systems**. this pack **places** them. craft lives in `../music/` `../art/` `../literature/`.

**language.** a language is a spoken/signed/written system. a **family** is a relatedness hypothesis (like a tree of descent), not a race. ISO 639 codes; Glottolog / Ethnologue as *catalogs* with methods; UNESCO for vitality. a speaker count: fetch, year.

**script** is the writing system. it can cross languages (Latin, Arabic, Chinese characters as names of scripts).

**religion** as a distribution: tradition, practice, institution. a percent of a census is a census box, not a soul count. do not flatten a people into a single rite.

**foodways** sit on agriculture + trade + rite. a “national dish” is often a marketing sentence.

**check:** language ≠ ethnicity ≠ state. which catalog. which year.

---

## 11. states on the map

a **sovereign state** is a legal person in the international system (territory, population, government, capacity to enter relations — the usual school list). a **nation** is a people who claim a we. they do not always match. a **country** in speech can mean either — say which.

**border** is a line with a treaty or a war or a custom. the living line: UN geospatial / the two states’ maps / a court. this book does not draw a disputed line as settled.

**capital** is the seat the state names (sometimes more than one: admin / legislative / winter). fetch. do not invent.

**UN membership** is a fact of the UN. it is not identical with “exists as a state.” list of members: UN door.

**dependency, autonomous region, occupied territory** are other legal boxes. civics + law packs for the doctrine; this chapter for the *where*.

**check:** state vs nation vs UN seat. whose map.

---

## 12. how to read a named country

when they name a country, walk the four layers. stop where FOUND is empty.

1. **place** — continent/region, neighbors, coast or landlocked, climate belt, one landform that matters. lat/long of a point only if fetched.
2. **people** — population with year, languages, urban share if you have it.
3. **money** — GDP nominal or PPP (say which) with year, what is produced or traded.
4. **culture** — language family, a rite distribution, not a costume paragraph.
5. **seat** — capital, UN membership if relevant. constitution and form of government → `../civics/`.

do not dump a wiki country article into the answer. fetch World Factbook / UN / World Bank / the national statistical office. keep the year on every number.

**check:** four layers or an honest hole.

---

## 13. compute and fetch on this stack

| job | do |
|---|---|
| US place, land, hazard | **USGS** |
| geodesy, datum | **NGS** · **IERS** |
| US people | **Census** |
| world people estimates | **UN DESA** · **UNSD** |
| GDP, income groups | **World Bank** · **IMF** |
| country brief | **CIA World Factbook** |
| UN membership, maps | **UN** · **UN geospatial** |
| country codes | **ISO 3166** |
| oceans names/limits | **IHO** |
| climate belt / normals | `../weather/` · **NCEI** · **climate.gov** |
| land use / crops | `../agriculture/` · **FAO** |
| language catalog | **Glottolog** · **UNESCO** |
| mineral reserves | **USGS** commodity |
| urban definitions | **UN** World Urbanization Prospects |
| arithmetic on *stated* pop/area | EasyLM **calc** + **units** |

never invent a population, GDP, capital, or lat/long. format a search. cite the URL. `ok` false → DONT_KNOW.

adjacent: `../weather/` (atmosphere clock) · `../agriculture/` (the farm) · `../civics/` (who rules) · `../history/` (when) · `../finance/` (GDP identity). this pack owns **where** and the four layers.

---

## 14. how to attack a problem

1. name the **scale**.
2. name the **layer** (place / people / money / culture / seat).
3. if a **number** is required — fetch, keep the year.
4. if a **border or capital** is required — fetch; disputed → say disputed.
5. climate *today* → weather pack. climate *belt* → this pack + NCEI.
6. who rules / constitution → civics.
7. compute only from stated numbers.

stuck patterns:

| symptom | try |
|---|---|
| remembered world population | ch 7. UN DESA |
| GDP rank from memory | ch 9. World Bank, year, nominal vs PPP |
| Mercator as “the real map” | ch 3. name the property |
| nation = state | ch 11 |
| culture = flag | ch 10 |
| continent average as a village | ch 6 |
| invented capital | ch 11–12. Factbook / UN |
| civics asked, atlas given | `../civics/` |
| this afternoon’s rain as climate | `../weather/` |
| peak height from memory | ch 4. USGS / the national mapping agency |

---

## close

geography is place plus a layer. scale, year, door. population is a census-fetch.

```
CITE: warehouse/geography/TEXTBOOK.md
```
