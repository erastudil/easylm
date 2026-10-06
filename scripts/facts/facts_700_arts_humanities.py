# SPDX-License-Identifier: AGPL-3.0-or-later
"""Facts for Dewey 700, 800, 900: art, music, literature, poetry, history, geography."""

from .common import Fact

ART_FACTS = [
    # Chapter 1 & 2: Seeing & Panofsky Analysis
    Fact(
        topic="panofsky three strata of analysis",
        comment="erwin panofsky method analyzing art at primary pre-iconographical visual level, secondary iconographical meaning, and tertiary iconological worldview.",
        dewey="700", slug="art", chapter="chapter 2.1",
        door="https://www.metmuseum.org/toah/"
    ),
    Fact(
        topic="seven formal elements of visual art",
        comment="foundational components of visual composition: line, shape, three-dimensional form, spatial arrangement, color, tonal value, and tactile texture.",
        dewey="700", slug="art", chapter="chapter 3.1",
        door="https://www.nga.gov/"
    ),
    Fact(
        topic="subtractive vs additive color mixing",
        comment="additive color mixing combines light primaries red, green, and blue to produce white; subtractive mixing combines pigment primaries to absorb light.",
        dewey="700", slug="art", chapter="chapter 3.2",
        door="https://www.nga.gov/"
    ),
    Fact(
        topic="linear perspective discovery",
        comment="mathematical system formulated by filippo brunelleschi in 1415 projecting three-dimensional space onto flat surface using orthogonal lines converging at vanishing point.",
        dewey="700", slug="art", chapter="chapter 4.1",
        door="https://www.metmuseum.org/toah/hd/perspective/hd_perspective.htm"
    ),
    Fact(
        topic="chiaroscuro modeling",
        comment="artistic technique utilizing strong tonal contrasts between light and dark to create illusion of rounded three-dimensional volume on two-dimensional plane.",
        dewey="700", slug="art", chapter="chapter 4.2",
        door="https://www.nga.gov/", kind="definition"
    ),
    Fact(
        topic="golden ratio in visual composition",
        comment="mathematical proportion approximately 1.618033 utilized in classical architecture and figurative art to produce balanced harmonious spatial divisions.",
        dewey="700", slug="art", chapter="chapter 4.3",
        door="https://www.nga.gov/"
    ),
    Fact(
        topic="buon fresco technique",
        comment="wall painting method applying alkaline-resistant pigments directly into wet lime plaster, forming permanent crystalline calcium carbonate bond.",
        dewey="700", slug="art", chapter="chapter 5.1",
        door="https://www.metmuseum.org/toah/", kind="definition"
    ),
    Fact(
        topic="classical architectural orders",
        comment="greek and roman column typologies: sturdy unadorned Doric, scroll-voluted Ionic, and ornate acanthus-leaf Corinthian.",
        dewey="700", slug="art", chapter="chapter 7.1",
        door="https://www.metmuseum.org/toah/"
    ),
    Fact(
        topic="printmaking methods",
        comment="graphic reproduction processes partitioned into relief woodcut, intaglio metal etching, planographic stone lithography, and porous silkscreen.",
        dewey="700", slug="art", chapter="chapter 8.1",
        door="https://www.moma.org/collection/terms/printmaking"
    ),
    Fact(
        topic="bauhaus design principle",
        comment="modernist design philosophy established by walter gropius asserting functional utility dictates form and uniting fine art with industrial craft.",
        dewey="700", slug="art", chapter="chapter 10.1",
        door="https://www.moma.org/collection/terms/bauhaus"
    ),
    Fact(
        topic="cubism movement",
        comment="avant-garde art movement pioneered by pablo picasso and georges braque fracturing subjects into multi-perspective geometric planes.",
        dewey="700", slug="art", chapter="chapter 11.1",
        door="https://www.moma.org/collection/terms/cubism", kind="definition"
    ),
]

MUSIC_FACTS = [
    # Chapter 1 & 2: Acoustics & Harmonic Overtone Series
    Fact(
        topic="standard musical concert pitch",
        comment="international standard ISO 16 defining reference pitch A4 above middle C at fundamental frequency of exactly 440 Hertz.",
        dewey="780", slug="music", chapter="chapter 1.1",
        door="https://www.iso.org/standard/3601.html"
    ),
    Fact(
        topic="harmonic overtone series",
        comment="sequence of pure sinusoidal frequencies integer multiples of fundamental frequency f: octave 2f, fifth 3f, fourth 4f, major third 5f.",
        dewey="780", slug="music", chapter="chapter 2.1",
        door="https://ocw.mit.edu/courses/music-and-theater-arts/"
    ),
    Fact(
        topic="pythagorean comma",
        comment="acoustic discrepancy of approximately 23.46 cents between twelve pure musical fifths and seven pure musical octaves.",
        dewey="780", slug="music", chapter="chapter 4.1",
        door="https://ocw.mit.edu/courses/music-and-theater-arts/"
    ),
    Fact(
        topic="twelve tone equal temperament",
        comment="tuning system dividing musical octave into twelve semitones each having identical frequency ratio of twelfth root of two, approximately 1.059463.",
        dewey="780", slug="music", chapter="chapter 4.2",
        door="https://ocw.mit.edu/courses/music-and-theater-arts/", kind="definition"
    ),

    # Chapter 5 & 6: Diatonic Scales, Modes & Cadences
    Fact(
        topic="major diatonic scale formula",
        comment="seven note step sequence comprised of whole step, whole step, half step, whole step, whole step, whole step, half step.",
        dewey="780", slug="music", chapter="chapter 5.1",
        door="https://ocw.mit.edu/courses/music-and-theater-arts/"
    ),
    Fact(
        topic="circle of fifths",
        comment="geometric clockwise representation of chromatic twelve tones where adjacent keys are separated by interval of a perfect fifth.",
        dewey="780", slug="music", chapter="chapter 5.2",
        door="https://ocw.mit.edu/courses/music-and-theater-arts/", kind="definition"
    ),
    Fact(
        topic="authentic musical cadence",
        comment="harmonic progression moving from dominant fifth V chord to tonic root I chord creating strong musical resolution.",
        dewey="780", slug="music", chapter="chapter 6.1",
        door="https://ocw.mit.edu/courses/music-and-theater-arts/", kind="definition"
    ),
    Fact(
        topic="species counterpoint parallel motion prohibition",
        comment="voice leading rule formulated by johann joseph fux strictly prohibiting parallel motion between two voices by perfect fifths or perfect octaves.",
        dewey="780", slug="music", chapter="chapter 7.1",
        door="https://ocw.mit.edu/courses/music-and-theater-arts/"
    ),
    Fact(
        topic="sonata allegro form",
        comment="classical musical architecture consisting of thematic exposition, harmonically unstable development section, and tonic recapitulation.",
        dewey="780", slug="music", chapter="chapter 8.1",
        door="https://ocw.mit.edu/courses/music-and-theater-arts/", kind="definition"
    ),
    Fact(
        topic="triad harmonic inversions",
        comment="triads inverted by placing third in bass to create first inversion 6-3, or placing fifth in bass to create second inversion 6-4.",
        dewey="780", slug="music", chapter="chapter 6.2",
        door="https://ocw.mit.edu/courses/music-and-theater-arts/"
    ),
    Fact(
        topic="standard orchestral instrument sections",
        comment="four acoustic symphonic choirs: bowed strings, woodwinds, valved brass, and tuned/untuned percussion.",
        dewey="780", slug="music", chapter="chapter 9.1",
        door="https://ocw.mit.edu/courses/music-and-theater-arts/"
    ),
]

LITERATURE_FACTS = [
    # Chapter 1 & 2: Classical Poetics & Genre
    Fact(
        topic="aristotelian mimesis",
        comment="aristotle concept defining literature and dramatic art as creative representation and philosophical imitation of human life and action.",
        dewey="800", slug="literature", chapter="chapter 1.1",
        door="https://plato.stanford.edu/entries/aristotle-rhetoric/", kind="definition"
    ),
    Fact(
        topic="aristotelian catharsis",
        comment="purgation and emotional clarification of pity and fear evoked in audience by serious dramatic tragedy.",
        dewey="800", slug="literature", chapter="chapter 1.1",
        door="https://plato.stanford.edu/entries/aristotle-rhetoric/", kind="definition"
    ),
    Fact(
        topic="tragic hamartia",
        comment="critical error of judgment, blind spot, or character defect in protagonist that precipitates their downfall.",
        dewey="800", slug="literature", chapter="chapter 1.1",
        door="https://plato.stanford.edu/entries/aristotle-rhetoric/", kind="definition"
    ),
    Fact(
        topic="dramatic peripeteia",
        comment="sudden reversal of fortune or circumstance in dramatic narrative turning action from apparent triumph to catastrophic defeat.",
        dewey="800", slug="literature", chapter="chapter 1.2",
        door="https://plato.stanford.edu/entries/aristotle-rhetoric/", kind="definition"
    ),
    Fact(
        topic="dramatic anagnorisis",
        comment="crucial moment of cognitive discovery where protagonist recognizes previously hidden truth about their identity or circumstances.",
        dewey="800", slug="literature", chapter="chapter 1.2",
        door="https://plato.stanford.edu/entries/aristotle-rhetoric/", kind="definition"
    ),

    # Chapter 3 & 4: Plot Architecture & Narratology
    Fact(
        topic="freytag dramatic pyramid",
        comment="five part narrative structure: exposition setting baseline, rising action building conflict, climax turning point, falling action, and resolution.",
        dewey="800", slug="literature", chapter="chapter 4.1",
        door="https://www.britannica.com/art/Freytags-pyramid"
    ),
    Fact(
        topic="fabula and syuzhet",
        comment="russian formalist distinction between raw chronological timeline of story events fabula and artistic plot arrangement syuzhet.",
        dewey="800", slug="literature", chapter="chapter 4.2",
        door="https://plato.stanford.edu/entries/literary-theory/", kind="definition"
    ),
    Fact(
        topic="free indirect discourse",
        comment="narrative technique presenting character internal stream of thought in third person past tense without quotation tags.",
        dewey="800", slug="literature", chapter="chapter 5.1",
        door="https://www.britannica.com/art/free-indirect-discourse", kind="definition"
    ),
    Fact(
        topic="aristotle rhetorical appeals",
        comment="three classical modes of persuasion: ethos appealing to character and credibility, pathos appealing to emotion, logos appealing to logical reasoning.",
        dewey="800", slug="literature", chapter="chapter 6.1",
        door="https://plato.stanford.edu/entries/aristotle-rhetoric/"
    ),
    Fact(
        topic="literary allegory",
        comment="extended narrative metaphor where characters, settings, and events consistently represent broader moral, spiritual, or political truths.",
        dewey="800", slug="literature", chapter="chapter 7.1",
        door="https://www.britannica.com/art/allegory-literature", kind="definition"
    ),
    Fact(
        topic="stream of consciousness technique",
        comment="modernist narrative style reproducing continuous chaotic flow of subjective perceptions, memories, and associations in human mind.",
        dewey="800", slug="literature", chapter="chapter 10.1",
        door="https://www.britannica.com/art/stream-of-consciousness", kind="definition"
    ),
    Fact(
        topic="homodiegetic narrator",
        comment="first-person narrative voice belonging to a character who directly participates in the events of the fictional story world.",
        dewey="800", slug="literature", chapter="chapter 5.2",
        door="https://plato.stanford.edu/entries/literary-theory/", kind="definition"
    ),
    Fact(
        topic="heterodiegetic narrator",
        comment="third-person narrative voice situated outside the fictional story world looking in upon characters and events.",
        dewey="800", slug="literature", chapter="chapter 5.2",
        door="https://plato.stanford.edu/entries/literary-theory/", kind="definition"
    ),
    Fact(
        topic="unreliable narrator",
        comment="narrator whose reporting credibility is compromised by subjective bias, cognitive delusion, naive innocence, or intentional deceit.",
        dewey="800", slug="literature", chapter="chapter 5.3",
        door="https://www.britannica.com/art/unreliable-narrator", kind="definition"
    ),
    Fact(
        topic="dramatic irony",
        comment="narrative device where audience or reader possesses crucial factual knowledge that characters within the story do not yet know.",
        dewey="800", slug="literature", chapter="chapter 7.2",
        door="https://www.britannica.com/art/dramatic-irony", kind="definition"
    ),
    Fact(
        topic="metaphor and metonymy",
        comment="metaphor creates figurative equivalence by implicit comparison; metonymy substitutes an associated attribute or contiguous object for the referent.",
        dewey="800", slug="literature", chapter="chapter 7.3",
        door="https://plato.stanford.edu/entries/metaphor/"
    ),
    Fact(
        topic="pathetic fallacy",
        comment="literary device attributing human emotions, agency, or psychological states to natural inanimate phenomena or weather.",
        dewey="800", slug="literature", chapter="chapter 7.4",
        door="https://www.britannica.com/art/pathetic-fallacy", kind="definition"
    ),
    Fact(
        topic="bildungsroman genre",
        comment="coming-of-age novel tracing moral, psychological, and intellectual maturation of a protagonist from youth into adulthood.",
        dewey="800", slug="literature", chapter="chapter 8.1",
        door="https://www.britannica.com/art/bildungsroman", kind="definition"
    ),
]

POETRY_FACTS = [
    # Chapter 1 & 2: Prosody & Scansion
    Fact(
        topic="poetic meter",
        comment="structured rhythmic temporal recurrence of accented and unaccented syllabic beats organizing verse lines.",
        dewey="811", slug="poetry", chapter="chapter 1.1",
        door="https://www.poetryfoundation.org/learn/glossary-terms/meter", kind="definition"
    ),
    Fact(
        topic="iambic metric foot",
        comment="two-syllable poetic foot composed of an unstressed short syllable followed by a stressed long syllable.",
        dewey="811", slug="poetry", chapter="chapter 3.1",
        door="https://www.poetryfoundation.org/learn/glossary-terms/iamb", kind="definition"
    ),
    Fact(
        topic="trochaic metric foot",
        comment="two-syllable poetic foot composed of a stressed long syllable followed by an unstressed short syllable.",
        dewey="811", slug="poetry", chapter="chapter 3.1",
        door="https://www.poetryfoundation.org/learn/glossary-terms/trochee", kind="definition"
    ),
    Fact(
        topic="anapestic metric foot",
        comment="three-syllable poetic foot composed of two unstressed syllables followed by one stressed syllable.",
        dewey="811", slug="poetry", chapter="chapter 3.1",
        door="https://www.poetryfoundation.org/learn/glossary-terms/anapest", kind="definition"
    ),
    Fact(
        topic="dactylic metric foot",
        comment="three-syllable poetic foot composed of one stressed syllable followed by two unstressed syllables.",
        dewey="811", slug="poetry", chapter="chapter 3.1",
        door="https://www.poetryfoundation.org/learn/glossary-terms/dactyl", kind="definition"
    ),
    Fact(
        topic="spondaic metric foot",
        comment="two-syllable poetic foot composed of two equally stressed long syllables producing heavy metrical accent.",
        dewey="811", slug="poetry", chapter="chapter 3.1",
        door="https://www.poetryfoundation.org/learn/glossary-terms/spondee", kind="definition"
    ),
    Fact(
        topic="iambic pentameter line",
        comment="verse line composed of five consecutive iambic feet comprising ten syllables with alternating unstressed and stressed pattern.",
        dewey="811", slug="poetry", chapter="chapter 3.2",
        door="https://www.poetryfoundation.org/learn/glossary-terms/iambic-pentameter", kind="definition"
    ),
    Fact(
        topic="blank verse",
        comment="unrhymed metric verse composed in regular iambic pentameter widely favored in classical english dramatic and epic poetry.",
        dewey="811", slug="poetry", chapter="chapter 3.3",
        door="https://www.poetryfoundation.org/learn/glossary-terms/blank-verse", kind="definition"
    ),
    Fact(
        topic="free verse cadence",
        comment="poetic form dispensing with regular meter and rhyme schemes, organized instead around natural speech cadence and typographic lineation.",
        dewey="811", slug="poetry", chapter="chapter 10.1",
        door="https://www.poetryfoundation.org/learn/glossary-terms/free-verse", kind="definition"
    ),

    # Chapter 5 & 8: Lineation & Stanzaic Architecture
    Fact(
        topic="poetic enjambment",
        comment="syntactic continuation of sentence across line break without terminating punctuation pause.",
        dewey="811", slug="poetry", chapter="chapter 5.1",
        door="https://www.poetryfoundation.org/learn/glossary-terms/enjambment", kind="definition"
    ),
    Fact(
        topic="poetic caesura",
        comment="audible metric pause or rhythmic fracture occurring within interior of a poetic verse line.",
        dewey="811", slug="poetry", chapter="chapter 5.2",
        door="https://www.poetryfoundation.org/learn/glossary-terms/caesura", kind="definition"
    ),
    Fact(
        topic="petrarchan sonnet structure",
        comment="fourteen line verse form composed of an initial eight line octave establishing problem followed by a volta turn and six line sestet.",
        dewey="811", slug="poetry", chapter="chapter 8.1",
        door="https://www.poetryfoundation.org/learn/glossary-terms/sonnet-petrarchan"
    ),
    Fact(
        topic="shakespearean sonnet structure",
        comment="fourteen line verse form composed of three rhyming quatrains abab cdcd efef concluding with a rhyming heroic couplet gg.",
        dewey="811", slug="poetry", chapter="chapter 8.2",
        door="https://www.poetryfoundation.org/learn/glossary-terms/sonnet-shakespearean"
    ),
    Fact(
        topic="villanelle closed form",
        comment="nineteen line poetic form consisting of five tercets and concluding quatrain structured around two repeating refrains and two rhyme sounds.",
        dewey="811", slug="poetry", chapter="chapter 8.3",
        door="https://www.poetryfoundation.org/learn/glossary-terms/villanelle", kind="definition"
    ),
    Fact(
        topic="classical haiku form",
        comment="traditional japanese poetic form consisting of seventeen morae in 5-7-5 metric measure containing seasonal kigo and cutting word kireji.",
        dewey="811", slug="poetry", chapter="chapter 9.1",
        door="https://www.poetryfoundation.org/learn/glossary-terms/haiku"
    ),
    Fact(
        topic="terza rima stanza scheme",
        comment="interlocking three-line rhyme scheme aba bcb cdc invented by dante alighieri for the divine comedy.",
        dewey="811", slug="poetry", chapter="chapter 5.3",
        door="https://www.poetryfoundation.org/learn/glossary-terms/terza-rima"
    ),
    Fact(
        topic="spenserian stanza architecture",
        comment="nine-line verse form rhyming ababbcbcc with eight iambic pentameter lines and concluding twelve-syllable iambic hexameter alexandrine.",
        dewey="811", slug="poetry", chapter="chapter 5.4",
        door="https://www.poetryfoundation.org/learn/glossary-terms/spenserian-stanza"
    ),
    Fact(
        topic="ottava rima structure",
        comment="eight-line iambic pentameter stanza rhyming abababcc utilized in narrative epic verse by boccaccio, ariosto, and lord byron.",
        dewey="811", slug="poetry", chapter="chapter 5.5",
        door="https://www.poetryfoundation.org/learn/glossary-terms/ottava-rima"
    ),
    Fact(
        topic="ballad meter stanza",
        comment="traditional four-line quatrain alternating four-stress iambic tetrameter and three-stress iambic trimeter rhyming abcb or abab.",
        dewey="811", slug="poetry", chapter="chapter 11.1",
        door="https://www.poetryfoundation.org/learn/glossary-terms/ballad-meter"
    ),
    Fact(
        topic="sestina closed form",
        comment="thirty-nine line poetic form consisting of six six-line stanzas and a three-line envoi repeating six terminal teleuton words in rotating sequence.",
        dewey="811", slug="poetry", chapter="chapter 8.4",
        door="https://www.poetryfoundation.org/learn/glossary-terms/sestina"
    ),
]

HISTORY_FACTS = [
    # Chapter 1 & 2: Historiographical Method & Evidence
    Fact(
        topic="rankean empirical historiography",
        comment="leopold von ranke methodology demanding historians reconstruct past exactly as it actually occurred based on primary archival evidence.",
        dewey="900", slug="history", chapter="chapter 2.1",
        door="https://www.historians.org/"
    ),
    Fact(
        topic="primary vs secondary historical sources",
        comment="primary sources are contemporary artifacts or documents created during period under study; secondary sources are subsequent retrospective analyses.",
        dewey="900", slug="history", chapter="chapter 3.1",
        door="https://www.archives.gov/"
    ),
    Fact(
        topic="gregorian calendar reform",
        comment="calendar reform enacted in 1582 by pope gregory XIII correcting ten-day drift of Julian calendar and refining leap year frequency.",
        dewey="900", slug="history", chapter="chapter 4.1",
        door="https://www.britannica.com/topic/Gregorian-calendar"
    ),

    # Chapter 5 & 6: Revolutions & Epochs
    Fact(
        topic="neolithic agrarian revolution",
        comment="prehistoric transition beginning approximately 10000 BCE shifting human populations from mobile hunting and gathering to sedentary agricultural farming.",
        dewey="900", slug="history", chapter="chapter 5.1",
        door="https://www.britannica.com/event/Neolithic-Revolution"
    ),
    Fact(
        topic="emergence of cuneiform writing",
        comment="earliest verified written script invented in ancient sumerian mesopotamia approximately 3200 BCE using reed styluses on clay tablets.",
        dewey="900", slug="history", chapter="chapter 5.2",
        door="https://www.britishmuseum.org/"
    ),
    Fact(
        topic="code of hammurabi",
        comment="ancient babylonian legal code inscribed on basalt stele c 1750 BCE codifying lex talionis reciprocal justice and commercial regulations.",
        dewey="900", slug="history", chapter="chapter 5.3",
        door="https://www.louvre.fr/en"
    ),
    Fact(
        topic="fall of western roman empire",
        comment="traditional milestone marking end of western classical antiquity in 476 CE when germanic general odoacer deposed emperor romulus augustulus.",
        dewey="900", slug="history", chapter="chapter 6.1",
        door="https://www.britannica.com/place/ancient-Rome"
    ),
    Fact(
        topic="gutenberg movable type press",
        comment="johannes gutenberg mechanized movable metal type printing press in mainz approximately 1440 accelerating dissemination of knowledge.",
        dewey="900", slug="history", chapter="chapter 8.1",
        door="https://www.britannica.com/technology/printing-press"
    ),
    Fact(
        topic="peace of westphalia treaties",
        comment="1648 diplomatic agreements ending thirty years war establishing modern framework of nation-state sovereignty and non-interference.",
        dewey="900", slug="history", chapter="chapter 9.1",
        door="https://www.britannica.com/event/Peace-of-Westphalia"
    ),
    Fact(
        topic="first industrial revolution",
        comment="transformation beginning in great britain around 1760 mechanizing manufacturing with steam power, iron smelting, and textile factories.",
        dewey="900", slug="history", chapter="chapter 10.1",
        door="https://www.britannica.com/event/Industrial-Revolution"
    ),
]

GEOGRAPHY_FACTS = [
    # Chapter 1 & 2: Geodesy & Coordinates
    Fact(
        topic="earth oblate spheroid shape",
        comment="rotational centrifugal force deforms Earth into an oblate ellipsoid with equatorial radius 6378 kilometers slightly exceeding polar radius.",
        dewey="910", slug="geography", chapter="chapter 2.1",
        door="https://www.usgs.gov/"
    ),
    Fact(
        topic="geographic coordinate system",
        comment="spherical reference system measuring latitude in degrees north or south of Equator and longitude east or west of Greenwich Prime Meridian.",
        dewey="910", slug="geography", chapter="chapter 2.2",
        door="https://www.usgs.gov/", kind="definition"
    ),
    Fact(
        topic="earth axial obliquity",
        comment="rotational axis tilt of Earth at approximately 23.44 degrees relative to orbital ecliptic plane driving annual seasonal changes in solar insolation.",
        dewey="910", slug="geography", chapter="chapter 3.1",
        door="https://www.usgs.gov/"
    ),

    # Chapter 4 & 5: Cartography & Climate
    Fact(
        topic="mercator map projection distortion",
        comment="conformal cylindrical cartographic projection preserving local angles and rhumb lines while distorting relative land areas severely toward polar latitudes.",
        dewey="910", slug="geography", chapter="chapter 4.1",
        door="https://www.usgs.gov/"
    ),
    Fact(
        topic="gis vector vs raster data models",
        comment="geographic information systems store spatial features either as discrete geometric points, lines, and polygons or as continuous gridded pixel cells.",
        dewey="910", slug="geography", chapter="chapter 4.2",
        door="https://www.usgs.gov/"
    ),
    Fact(
        topic="koppen climate classification",
        comment="empirical climate categorization system dividing global terrestrial regions into tropical, arid, temperate, continental, and polar zones.",
        dewey="910", slug="geography", chapter="chapter 6.1",
        door="https://www.noaa.gov/", kind="definition"
    ),
    Fact(
        topic="demographic transition model",
        comment="population framework tracing historical transition from high birth and death rates to low birth and death rates as a society industrializes.",
        dewey="910", slug="geography", chapter="chapter 8.1",
        door="https://www.census.gov/", kind="definition"
    ),
    Fact(
        topic="karst topography landforms",
        comment="landscape produced by chemical dissolution of soluble carbonate limestone bedrock creating sinkholes, caves, and subterranean drainage systems.",
        dewey="910", slug="geography", chapter="chapter 5.1",
        door="https://www.usgs.gov/", kind="definition"
    ),
    Fact(
        topic="oxbow lake formation",
        comment="crescent shaped lake formed when meandering river erodes narrow neck and cuts direct new channel abandoning previous curved loop.",
        dewey="910", slug="geography", chapter="chapter 5.2",
        door="https://www.usgs.gov/", kind="definition"
    ),
]
