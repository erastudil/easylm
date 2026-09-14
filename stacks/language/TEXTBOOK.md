---
Title: "language — undergrad textbook"
Date: "2026-09-13"
Status: living · undergrad · the-stacks
Home: "stacks/language/"
Related:
  - "../literature/"
  - "../philosophy/"
  - "../computing/"
  - "../history/"
  - "../geography/"
---

# Linguistics & Language Systems — Phonology, Generative Syntax, Semantics, Pragmatics & Digital Encodings

A comprehensive undergraduate textbook exploring the science of human language: articulatory and acoustic phonetics (IPA), phonological systems, morphological derivation and inflection, formal syntactic hierarchies and phrase-structure grammars, truth-conditional and lexical semantics, pragmatic speech-act theory, historical comparative linguistics, sociolinguistic variation, and computational text encodings (Unicode and UTF-8).

---

## 0. Syllabus & Structural Map

Language is humanity's most extraordinary cognitive and symbolic technology. By modulating acoustic pressure waves in the air through vocal cords, tongue, and palate, or by inscribing geometric marks on a substrate, human beings transmit internal mental simulations, counterfactual scenarios, and logical deductions across space and time. Linguistics investigates the universal mathematical and biological architecture that enables infinite expressive variety from a finite vocabulary of discrete phonetic atoms.

```
+---------------------------------------------------------------------------------------------------+
|                                     THE LINGUISTIC MATRIX                                         |
+---------------------------------------------------------------------------------------------------+
|  ACOUSTICS & PHONETICS (Sound)    | Articulatory Vocal Tract · Formants (F1/F2) · IPA Transcription|
+-----------------------------------+---------------------------------------------------------------+
|  PHONOLOGY (The Sound Rules)      | Phonemes vs Allophones · Distinctive Features · Syllable Mora |
+-----------------------------------+---------------------------------------------------------------+
|  MORPHOLOGY (The Word Building)   | Free / Bound Morphemes · Derivation vs Inflection · Agglutin  |
+-----------------------------------+---------------------------------------------------------------+
|  SYNTAX (The Sentence Tree)       | Generative Grammar · X-Bar Theory · Constituency · Movement    |
+-----------------------------------+---------------------------------------------------------------+
|  SEMANTICS (The Core Meaning)     | Principle of Compositionality · Truth-Conditional · Entailment|
+-----------------------------------+---------------------------------------------------------------+
|  PRAGMATICS (Context & Action)    | Speech Acts (Austin/Searle) · Gricean Maxims · Implicature    |
+-----------------------------------+---------------------------------------------------------------+
|  WRITING SYSTEMS (Inscription)    | Logograms · Syllabaries · Alphabets · Abjads · Abugidas       |
+-----------------------------------+---------------------------------------------------------------+
|  DIGITAL ENCODING (The Bits)      | ASCII (7-bit) · Unicode Universal Character Set · UTF-8 Bytes |
+-----------------------------------+---------------------------------------------------------------+
|  HISTORICAL & SOCIOLINGUISTICS    | Proto-Indo-European Roots · Grimm's Law · Dialects & Prestige |
+---------------------------------------------------------------------------------------------------+
```

### Table of Contents

1. [Chapter 1: The First Principles of Language and Communication](#1-the-first-principles-of-language-and-communication)
2. [Chapter 2: The Structural Levels of Linguistics: From Acoustics to Pragmatics](#2-the-structural-levels-of-linguistics-from-acoustics-to-pragmatics)
3. [Chapter 3: Semiotics: Signifier, Signified, and the Arbitrariness of the Sign](#3-semiotics-signifier-signified-and-the-arbitrariness-of-the-sign)
4. [Chapter 4: Writing Systems: The Typology of Graphic Inscription](#4-writing-systems-the-typology-of-graphic-inscription)
5. [Chapter 5: Digital Text: The Architecture of Unicode and UTF-8 Encodings](#5-digital-text-the-architecture-of-unicode-and-utf-8-encodings)
6. [Chapter 6: Applied Grammar for Authors: Clauses, Voice, and Syntactic Clarity](#6-applied-grammar-for-authors-clauses-voice-and-syntactic-clarity)
7. [Chapter 7: Rhetorical Structures: Persuasion, Coherence, and Style](#7-rhetorical-structures-persuasion-coherence-and-style)
8. [Chapter 8: Lexicography and Etymology: The Biography of Words](#8-lexicography-and-etymology-the-biography-of-words)
9. [Chapter 9: The Theory of Translation: Equivalence, Fidelity, and Pragmatic Loss](#9-the-theory-of-translation-equivalence-fidelity-and-pragmatic-loss)
10. [Chapter 10: Sociolinguistics, Dialectology, and First Language Acquisition](#10-sociolinguistics-dialectology-and-first-language-acquisition)
11. [Chapter 11: Generative Grammar and Universal Linguistic Principles](#11-generative-grammar-and-universal-linguistic-principles)
12. [Chapter 12: Standardization and Identification: BCP 47 and ISO 639 Language Tags](#12-standardization-and-identification-bcp-47-and-iso-639-language-tags)
13. [Chapter 13: Authoritative Linguistic Portals: Unicode Consortium, IPA, and W3C](#13-authoritative-linguistic-portals-unicode-consortium-ipa-and-w3c)
14. [Chapter 14: Systematic Diagnostic Inquest for Linguistic and Textual Problems](#14-systematic-diagnostic-inquest-for-linguistic-and-textual-problems)

---

## 1. The First Principles of Language and Communication

Right now, your eyes are scanning dark marks on a bright glass screen. Almost instantly, without conscious effort, your brain translates those optical shapes into sounds, concepts, mental images, and complex ideas.

Or consider a three-year-old child: an infant sits in a room bathed in a continuous, unbroken stream of noisy acoustic sound waves. Adult speech has no pauses or spaces between words; on an oscilloscope, it looks like an unbroken undulating wave. Yet within three short years, without ever opening a textbook or receiving a formal grammar lesson, that child effortlessly segments that continuous acoustic stream into discrete words, decodes the invisible grammatical rules of their community, and begins uttering completely original sentences that have never been spoken before in human history.

How is this possible?

**Language** is humanity's most extraordinary cognitive and social technology. It is the structured system that allows one human being to modulate physical air pressure with vocal cords, tongue, and lips—or make precise geometric motions with hands and face—so that another human being across the room constructs an identical mental simulation inside their mind.

### 1.1 The Four Pillars of Linguistic Intuition

To explore language scientifically, begin with four everyday observations:

1. **The Stream and the Atoms (Continuous Sound to Discrete Units):**
   Physically, human speech is continuous. The phrases *"I scream"* and *"ice cream"* produce nearly identical acoustic waveforms in the air. Yet your mind does not hear a blurry smudge; it perceives distinct, crisp units of sound (**phonemes**), meaningful word-parts (**morphemes**), and sentences. Linguistics studies how the human mind bridges the physical world of sound waves with the symbolic world of discrete meaning.

2. **Infinite Expression from Finite Tools (The Generative Engine):**
   English has approximately 44 spoken sounds and a finite vocabulary. Yet with those modest ingredients, you can generate an infinite number of sentences. Read this sentence: *"A purple giraffe ordered a double espresso while debating maritime law in Antarctica."* You have never encountered that exact sequence of words in your life, yet you understood its precise meaning immediately. Language is not a frozen tape recording we memorize; it is a generative, rule-based system of infinite creativity.

3. **The Arbitrary Agreement (The Social Contract):**
   Why do we call a four-legged barking animal a "dog"? There is nothing inherently dog-like about the sounds /d/, /ɔ/, and /ɡ/. A speaker of Spanish calls the same animal a *perro*; a speaker of French says *chien*; a speaker of Japanese says *inu*. The connection between the sound (the *signifier*) and the creature in the physical world (the *signified*) is an arbitrary social contract maintained by a community of speakers. Once that convention is shared, communication becomes effortless.

4. **Speech and Sign are Biological; Writing is Technology:**
   Every healthy human child naturally acquires spoken or signed language simply by growing up around other people, without formal instruction. Spoken and signed languages are deep biological adaptations hundreds of thousands of years old. **Writing**, by contrast, is a relatively recent human invention—an ingenious technology developed roughly 5,000 years ago to freeze transient acoustic words onto clay tablets, parchment, or silicon chips. Millions of people speak rich, complex languages that have never had a written alphabet.

Linguistics is the empirical study of how these living systems work. It does not judge whether people speak "properly" or "badly"; it observes, maps, and explains the universal architecture of human thought and communication.

| Concept | The Common Experience | What It Reveals |
|---|---|---|
| **Natural Language** | How people actually talk and sign | Living, evolving biological systems acquired in childhood |
| **Dialect & Variety** | Regional accents and phrasing | Complete, systematic grammars adapted to communities |
| **Register & Style** | Talking to a judge vs. a close friend | Context-dependent shifts in tone, vocabulary, and formality |
| **Writing System** | Alphabet, characters, or syllabary | Technological artifacts designed to record living speech |

**The Linguistic Standard:** Whenever you analyze a statement or text, clarify what you are observing: the physical acoustic sound (**phonetics**), the structural rules (**grammar and syntax**), the dictionary meaning (**semantics**), or how context shapes what the speaker intends (**pragmatics**). Chapter 2 maps these structural levels.

---

## 2. The Structural Levels of Linguistics: From Acoustics to Pragmatics

School linguistics cuts the object so the job stays small. The cuts are **not** a stack you must climb in order every time. They are names for different objects.

| Cut | Object | Typical question |
|---|---|---|
| **phonetics** | Speech sounds as physics and anatomy | What is the air doing? |
| **phonology** | Sounds as a system in a language | Which differences count? |
| **morphology** | Word-internal form | What pieces make this word? |
| **syntax** | How words make phrases and clauses | What may sit where? |
| **semantics** | Conventional meaning | What does this form mean? |
| **pragmatics** | Meaning in a situation | What is being done *here*? |

Method: **name the cut**, then work inside it. A complaint that mixes "this vowel is ugly" (phonetics/aesthetics) with "this sentence is ungrammatical" (syntax) with "that was rude" (pragmatics) is three jobs.

### 2.1 phonetics

**Phonetics** describes how sounds are made (**articulatory**), how they travel (**acoustic**), and how they are heard (**auditory**).

Articulatory skeleton (spoken languages):

- **pulmonic** air from the lungs is the usual power source.
- **place** of constriction: lips, teeth, alveolar ridge, palate, velum, glottis, ...
- **manner:** stop, fricative, affricate, nasal, approximant, lateral, ...
- **voicing:** vocal folds vibrating or not.
- **vowels:** tongue height, backness, lip rounding; **monophthong** vs **diphthong**.

**IPA** (International Phonetic Alphabet) is the shared notation. The chart is owned by the International Phonetic Association. Fetch the chart. Do not invent a symbol. Do not guess a Unicode code point for a symbol — fetch Unicode / the IPA's own chart notes.

**Narrow** transcription tries to catch extra detail. **broad** transcription catches contrasts that matter for the language (and then you are already leaning on phonology).

**Check:** you can point at a place and a manner, or you fetched a spectrogram / IPA cell. "it sounds like X" is a start, not a description.

### 2.2 phonology

**Phonology** is the system of contrasts and patterns in **one** language (or one variety).

**Phoneme:** a contrast that can distinguish words. **allophone:** a variant of a phoneme that does not, in that language, make a different word. A pair of words that differ by one contrast is a **minimal pair**. If you cannot exhibit a pair, you do not yet have a phoneme; you have a guess.

**Phonotactics:** what sequences the language allows. English allows *str-* at the start of a word; Japanese (as usually described) does not allow the same cluster. Do not universalize English clusters.

**Prosody:** stress, length, tone, intonation — sound structure above the segment. A **tone language** uses pitch to distinguish words. English uses pitch more for phrase meaning (intonation) than for word identity. Fetch the language before you declare it "tonal."

**Check:** contrast shown, or distribution stated, for **this** language. A phonetic difference is not automatically a phoneme.

### 2.3 morphology

**Morphology** is how **words** are built from smaller meaningful pieces.

**Morpheme:** a smallest conventional pairing of form and meaning (or grammatical job). **free** morphemes can stand as words. **bound** morphemes cannot (*-ed*, *un-*, case suffixes, ...).

**Root** vs **affix**. **prefix, suffix, infix, circumfix** as position names. **stem** is what the affix attaches to this round.

**Inflection** fits a word to syntax (tense, number, case, agreement) without making a new dictionary word. **derivation** makes a new word (*happy* → *happiness*). **compounding** joins words (*blackboard*). The border is messy; name the job, not the trophy.

**Allomorphy:** one morpheme, more than one shape (*a* / *an*; English plural *-s* / *-z* / *-əz* as a school example — fetch a phonology note if the exact conditioning is the job).

**Productivity:** whether speakers still make new forms with that pattern. A fossil is not a rule.

**Isolating / agglutinating / fusional / polysynthetic** are **tendencies**, not boxes you drop a language into once. A language can be isolating in one corner and fusional in another.

**Check:** can you split the word into pieces that each have a job? if a split explains nothing, do not split.

### 2.4 syntax

**Syntax** is how words form **phrases** and **clauses**.

**Constituent:** a group that behaves as a unit (moves together, replaces together, stands as an answer). Tests: substitution, movement, coordination, standalone answer. One test is weak; several agreeing is better.

**Head:** the word that determines the phrase's kind. A **noun phrase** is headed by a noun (or a thing doing that job). A **verb phrase** by a verb. **complement** is required by the head. **adjunct** is extra (time, place, manner).

**Argument structure:** how many and what kind of arguments a verb wants (intransitive, transitive, ditransitive as school names). **valency** is the count. Languages mark this with order, case, agreement, or a mix.

**Word order** as a default, not a law of nature. School labels **SVO, SOV, VSO, ...** describe a **dominant** order of subject, object, verb. English is typically SVO in declarative clauses. Japanese is typically SOV. Fetch the language. Do not call a focused or question order "the language's order."

**Recursion / embedding:** clauses inside clauses. "the cat the dog chased ran" is English syntax working, not a riddle from space.

**Ungrammatical** means the system of that variety does not allow the form. It does not mean "I dislike it" or "a teacher marked it." mark the variety.

Writer-facing syntax continues in ch 6.

**Check:** name the head, the clause type, and the test that shows a constituent. Vibe is not a tree.

### 2.5 semantics

**Semantics** is conventional meaning: what the form contributes **across** situations, before this room and this feud.

**Sense** vs **reference** (Frege's school cut): sense is the way of presenting; reference is what is picked out. "the morning star" and "the evening star" can share a reference and differ in sense. Philosophy pack owns the fight about propositions; this chapter owns the linguistic cut.

**Lexical** semantics: word meaning, relations among words.

- **synonymy** is rare if you demand identity of sense, register, *and* collocation.
- **antonymy** has kinds (gradable *hot/cold*, complementary *dead/alive*, converse *buy/sell*).
- **hyponymy:** *spaniel* is a hyponym of *dog*.
- **meronymy:** part-whole (*finger*–*hand*).
- **homonymy** vs **polysemy:** accident of form vs related senses of one word. Dictionaries disagree; fetch two and say so.

**Compositionality:** the meaning of a complex form is computed from the meanings of the parts and the way they are combined. Idioms (*kick the bucket*) are the named exception: the whole is not the sum. Do not use the exception to deny the rule.

**Truth-conditional** talk: a sentence's semantics as the conditions under which it would be true. Useful. Not the whole of meaning (ch 2.6).

**Scope:** which operator a word sits under. *every student read a book* has two school readings (one book vs possibly different books). If a fight is about "what it means," draw the scopes before you moralize.

**Check:** paraphrase without upgrading. If you added a moral, that was not the semantics.

### 2.6 pragmatics

**Pragmatics** is meaning that depends on **this** situation: who is speaking, to whom, with what shared knowledge, doing what action.

**Speech act:** a sentence can **assert, ask, order, promise, warn, name**. The grammatical mood (declarative, interrogative, imperative) is a clue, not a census. "can you pass the salt?" is usually a request, not a question about ability.

**Implicature** (Grice's school name): what is suggested without being said. *some of the students passed* often implicates *not all*. The implicature can be cancelled: *some — in fact all — passed*. Conventional meaning cannot be cancelled that way.

**Presupposition:** what is taken as already on the table. *the king of France is bald* presupposes there is a king of France. A *the*-phrase often carries existence; fetch a semantics text if the job is the formal account.

**Deixis:** meaning that needs the situation to lock: *I, you, here, now, this*. A transcript without the pointing is incomplete.

**Politeness and face** are pragmatic. So is **irony**. So is **register**. None of these is "not grammar." they are grammar's neighbor.

**Check:** what is said vs what is done vs what is hinted. If you cannot split those, you are not done.

---

## 3. Semiotics: Signifier, Signified, and the Arbitrariness of the Sign

**The linguistic sign** is a teaching cut, not a mystic object. Saussure's school pair:

| Side | Is |
|---|---|
| **signifier** (*signifiant*) | The form you can hear, see, or feel (a stretch of sound, a written word, a sign-language form) |
| **signified** (*signifié*) | The concept that form is paired with in the system |

The sign is **both sides together**. A sound with no conventional pairing is noise. A concept with no form in the language is not a word of that language.

**Arbitrariness:** the pairing is conventional, not a picture of the world. Nothing about the sounds of *tree* (English) or *arbre* (French) or *ki* (Japanese) is the tree. **onomatopoeia** and **ideophones** are limited iconic corners. They do not cancel the rule.

**Value in the system:** a sign means what it means **against the other signs**. A color word's range depends on how many color words the language cuts. This is not "language determines thought" as a slogan. It is: **do not assume English cuts are nature.**

**Langue** vs **parole** (Saussure's names): the shared system vs this utterance. **synchrony** vs **diachrony:** the system at a time vs the system through time. You can study today's grammar without telling the etymology. You can study the etymology without pretending it rules today's meaning (ch 8).

This is a **teaching idea**. Saussure's *Cours de linguistique générale* (1916) was assembled after his death from notes. It is a historical book, not a living standards body. There is no official Saussure site to fetch as primary authority. For philosophy of the cut, fetch Stanford Encyclopedia **philosophy of linguistics**. For the text, fetch a named edition from a library. Do not invent a homepage.

Later structuralists and then **generativists** (ch 11) argued with this picture. You do not need to pick a church to use the two-sided sign as a tool: **form and meaning are paired; neither side is the whole word.**

**Check:** can you name the form and the concept separately, then the pairing? if you only have a translation into English, you do not yet have the sign.

---

## 4. Writing Systems: The Typology of Graphic Inscription

**Writing** records language with visible (or tactile) marks. It is not speech slowed down. It is a second system, with its own history, gaps, and politics.

### 4.1 kinds (school types)

Types are **how the marks relate to the language**, not how pretty they look.

| Type | Typical job of a graph | School examples (names, not a census) |
|---|---|---|
| **alphabet** | Consonants and vowels as letters | Latin, Greek, Cyrillic |
| **abjad** | Consonants; vowels optional or diacritic | Arabic, Hebrew (as usually described) |
| **abugida** (alphasyllabary) | Consonant+vowel units; vowel changes by mark | Devanagari, Ethiopic |
| **syllabary** | Syllables | Kana, Cherokee |
| **logosyllabary / morphosyllabary** | Morphemes or words, often with phonetic parts | Chinese characters as usually taught |
| **featural** | Graphs built from phonetic features | Hangul (as a design) |

A real orthography is often a **mix**. English is an alphabet with heavy historical spelling. Japanese mixes morphographic *kanji* with syllabic *kana*. Do not force a type on a mixed page.

**Orthography** is the conventional spelling of a language (or a standard of it). **script** is the set of graphs (Latin script, Arabic script). One script, many orthographies. One language, sometimes more than one script.

**Transliteration** maps one script to another **by letters**. **transcription** maps **sounds** (often IPA). They are not the same job. Pinyin is a transcription/romanization of Mandarin, not "how Chinese is written" as a replacement for characters.

### 4.2 direction, space, punctuation

**Directionality:** left-to-right, right-to-left, top-to-bottom, and historical boustrophedon. Unicode stores characters in **logical order** (roughly the order they are typed / the order of the language's stream), not necessarily the order of pixels. Bidirectional display is a rendering job. Fetch Unicode / W3C if the pixels fight the bytes.

**Word spacing** is not universal. Many scripts historically did not put spaces between words. Punctuation sets are historical, not natural law. A full stop is a writing convention, not a clause detector you can trust in every language.

**Capitalization, hyphenation, and "a word"** are orthographic decisions. Unicode encodes characters. It does not tell you where English hyphenates. Language-specific rules live in CLDR, layout notes (W3C language enablement), and dictionaries — fetch them.

### 4.3 speech and writing come apart

Writing **underrepresents** speech (no full intonation, often no exact vowel quality) and **overrepresents** history (English *knight*, French silent letters). **spelling pronunciation** is speech changing to match writing. **eye dialect** is writing pretending to be speech.

**Literacy** is skill in a writing system. It is not intelligence and it is not "having a language."

**Check:** script, orthography, direction. Speech or writing. If you cite a "letter," is it a graph, a phoneme, or a Unicode character? those three are different (ch 5).

---

## 5. Digital Text: The Architecture of Unicode and UTF-8 Encodings

This chapter is **load-bearing**. Numbers, ranges, and byte sequences below are from the Unicode Consortium's own pages and from RFC 3629 (UTF-8). If you need a **specific character**, fetch **Unicode charts** or **Where is my Character?** do **not** invent a code point from memory. Do not finish a `U+....` from vibe.

### 5.1 what Unicode is

The **Unicode Standard** is the universal character encoding for computer processing of text. Versions of Unicode are kept in sync with **ISO/IEC 10646** (the Universal Character Set). A conformant Unicode implementation is also conformant to ISO/IEC 10646 on the shared repertoire.

Unicode assigns each **character** a unique **numeric value** (a **code point**) and a **unique name**. When written in text, a code point is hexadecimal after the prefix `U+`.

From Unicode's own technical introduction (fetched): **U+0041** is **LATIN CAPITAL LETTER A**. That is an official example. For any other character you care about, fetch the chart.

Unicode encodes **characters**, not **glyphs**. A character is an abstract identity ("LATIN CAPITAL LETTER A"). A **glyph** is a mark on screen or paper. Fonts and rendering engines choose the glyph. Unicode does not specify size, serif, or handwriting.

Unicode encodes **plain text**. It does not encode bold, font, or "this is English." language identity is a separate tag (ch 12).

### 5.2 principles (names)

Unicode's own list of fundamental principles (technical introduction): **universal repertoire, logical order, efficiency, unification, characters not glyphs, dynamic composition, semantics, stability, plain text, convertibility.**

**Unification:** equivalent forms inside a script are not given duplicate codes just because two languages use them. CJK ideographs that are historically the same character are unified rather than triplicated per language. This is an encoding policy. It is not a claim that Chinese, Japanese, and Korean are one language.

**Stability:** assignment is **additive**. Characters are not removed or reinterpreted incompatibly. Fetch the Unicode stability policies if a product depends on that guarantee.

**Characters, not glyphs; dynamic composition:** a base character plus combining marks can make what a reader thinks of as "one letter." a **precomposed** character (compatibility with older sets) can often be decomposed. "the same thing to a reader" can therefore be **more than one code-point sequence**. That fact is a security and matching issue (RFC 3629 section 10; Unicode Normalization). Fetch **UAX #15** if you must compare strings for identity.

### 5.3 codespace, not a 16-bit set

Unicode is **not** "16-bit." Unicode's own FAQ: from Unicode 2.0 (July 1996) the encoded range is **U+0000 .. U+10FFFF**, a 21-bit codespace.

That range is the **UTF-16 accessible range**. Unicode and ISO 10646 policy: future assignments stay inside the integers UTF-16 can express. Over a million possible codes is a ceiling for **characters**, not for every ink mark in history.

The first 64K code points are the **Basic Multilingual Plane (BMP)**. Other planes are **supplementary**. Popular emoji, many historic scripts, and various CJK extensions live outside the BMP. "BMP-only" software is incomplete. Fetch the charts; do not assume a plane from a vibe.

**Surrogate** code points are reserved for UTF-16 pairing. They do **not** represent characters by themselves. RFC 3629: UTF-8 **must not** encode U+D800 .. U+DFFF as if they were characters.

**Private-use** code points have **no** universal meaning. Vendors may assign them. They are not portable identity. Do not cite a private-use code as "the Unicode for X."

**Unassigned** code points are not yours to fill. Conformance: do not use unassigned codes; do not corrupt unknown characters.

For **how many characters are encoded today**, fetch **the latest Unicode version**. The technical introduction's running prose will lag. A count in this book would rot.

### 5.4 encoding forms: UTF-8, UTF-16, UTF-32

An **encoding form** maps code points to **code units** in bits.

Unicode defines three forms. They encode the **same** repertoire and convert without loss:

| Form | Code unit | School use |
|---|---|---|
| **UTF-8** | 8-bit bytes, 1-4 per character | Web, files, most internet protocols |
| **UTF-16** | 16-bit units; supplementary characters as a **surrogate pair** | Java, Windows APIs as commonly described |
| **UTF-32** | One 32-bit unit per code point | Some Unix internals, easy indexing by code point |

W3C internationalization: **use UTF-8** for web content unless you have a special reason not to.

A **UTF** (Unicode Transformation Format) is an algorithmic mapping from every Unicode code point **except surrogate code points** to a **unique** byte sequence. Round-trip is lossless. Reserved and unassigned code points still have mappings; that is required for round-trip.

**UCS-2** is obsolete terminology (Unicode FAQ): Unicode 1.1-era 16-bit, no supplementary characters. Do not say UCS-2 when you mean UTF-16.

### 5.5 UTF-8 definition (RFC 3629 + Unicode FAQ)

**UTF-8** is the byte-oriented encoding form. Authoritative definition: **the Unicode Standard** (encoding forms). Internet profile: **RFC 3629** (STD 63, November 2003), which obsoletes RFC 2279. ISO/IEC 10646 Annex D also describes it.

RFC 3629 characteristics (paraphrase, not a substitute for the RFC):

- U+0000 .. U+007F (US-ASCII) map to single bytes `00` .. `7F`. A plain ASCII string **is** valid UTF-8.
- US-ASCII byte values do not appear inside a non-ASCII UTF-8 character. Parsers that look for ASCII syntax (slash, space, NUL) do not get false ASCII from later bytes of a multi-byte character.
- One to four bytes per character in the U+0000 .. U+10FFFF range.
- The first byte of a multi-byte sequence tells the length.
- Octet values **C0, C1, F5-FF never appear** in well-formed UTF-8.
- Character boundaries can be found from the byte stream.
- **overlong** encodings are illegal (e.g. C0 80 is **not** U+0000).

RFC 3629 bit layout (the table the RFC prints):

```
Char. number range  | UTF-8 octet sequence (binary)
0000 0000-0000 007F | 0xxxxxxx
0000 0080-0000 07FF | 110xxxxx 10xxxxxx
0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
```

There is **only one** valid way to encode a given character. Implementations **MUST** refuse invalid sequences. A naive decoder that accepts overlong forms or surrogate pairs as UTF-8 is a **security** bug. RFC 3629 records real exploits that used illegal sequences to sneak `../` and NUL past filters.

**CESU-8** encodes UTF-16 code units instead of code points. It is **not** valid UTF-8 and is not for the internet.

UTF-8 has **no endianness**. A BOM in UTF-8 is **only** a signature that the file is UTF-8, not a byte-order switch. The UTF-8 BOM bytes are **EF BB BF** (Unicode BOM FAQ table). Some protocols (Unix `#!` scripts, protocols that require a given ASCII start) should **not** use a UTF-8 BOM.

Unicode FAQ: where a BOM is used with UTF-8, it has **nothing to do with byte order**.

### 5.6 BOM table (Unicode FAQ, fetched)

When U+FEFF sits at the start of a stream as a signature, the **bytes** depend on the encoding form. Unicode's own table:

| Bytes | Encoding form |
|---|---|
| 00 00 FE FF | UTF-32, big-endian |
| FF FE 00 00 | UTF-32, little-endian |
| FE FF | UTF-16, big-endian |
| FF FE | UTF-16, little-endian |
| EF BB BF | UTF-8 |

In the middle of a file, U+FEFF is historically ZERO WIDTH NO-BREAK SPACE. Unicode prefers **U+2060 WORD JOINER** for word-joining, so U+FEFF can be a signature without confusion. Fetch the FAQ if a file is full of mystery FEFF.

Tagged `UTF-16BE` / `UTF-16LE` / `UTF-32BE` / `UTF-32LE` streams **must not** use a BOM. The tag already named the order.

### 5.7 character vs grapheme vs byte vs code unit

Four different meters. Mixing them is how software eats a name.

| Meter | Counts |
|---|---|
| **byte** | Octets on disk or wire |
| **code unit** | 8-bit (UTF-8), 16-bit (UTF-16), or 32-bit (UTF-32) units |
| **code point** | Unicode scalar identity |
| **grapheme cluster** | What a user thinks of as "a character" (base + combining marks, many emoji sequences) |

A combining sequence (base + acute, a flag emoji of several code points, a Korean syllable as *jamo*) is **one** user-perceived character and **several** code points. Unicode **UAX #29** (text segmentation) is the door for grapheme clusters. If you index "the nth character" in a UI, you almost certainly wanted grapheme clusters, not code units.

**Do not** invent the code points of those sequences here. Fetch.

### 5.8 what Unicode is not

Unicode is not a font. Not a language. Not a keyboard. Not a locale. Not a grammar. Not a translation memory.

**Collation** (sort order) is language-specific. UTF-8 byte order is **not** a cultural sort (RFC 3629 says this outright). Fetch the **Unicode Collation Algorithm** (UTS #10) and CLDR if you must sort names for humans.

**Normalization** (NFC, NFD, ...) is UAX #15. Needed when one precomposed accented letter must match a base letter plus combining mark for identity. Fetch it. Do not roll your own.

**Check:** encoding named (UTF-8?). Sequence well-formed? comparing bytes, code points, or graphemes? specific `U+....` fetched from Unicode, not remembered.

---

## 6. Applied Grammar for Authors: Clauses, Voice, and Syntactic Clarity

This chapter is **English school grammar for making sentences that do the job**. It is not a claim that English is language. It is not a morality. Other languages have other agreements, other tense systems, other places for modifiers. If the text is not English, fetch a grammar of **that** language.

Style-book fights (Oxford comma as a religion, "they" as singular) belong to a named publication style. US literature classrooms often default to **MLA**; other fields to **Chicago**. Those manuals are products. This book teaches the **clause**. For a word's existence and sense, **Merriam-Webster**. For a character, **Unicode**.

### 6.1 the clause

A **clause** has a **predicate** (usually a finite verb) and, in English declaratives, a **subject**.

- **independent clause:** can stand as a sentence.
- **dependent (subordinate) clause:** cannot; it hangs on another clause (*because ...*, *who ...*, *that ...*).

**Sentence** types by job: **declarative, interrogative, imperative, exclamative**. A period does not make a clause complete. "Running down the road." is a phrase wearing a capital letter.

**Simple** sentence: one independent clause. **compound:** coordinated independents. **complex:** independent + subordinate. Names help you punctuate. They are not a scoring system.

**Fragment:** a group punctuated as a sentence that is not an independent clause. Illegal in many formal registers. Legal as a rhetorical punch (ch 7). Know which register you are in.

**Run-on:** two independents jammed without coordination or a fit stop. A comma between independents with no coordinator is a **comma splice**. Both are clause-boundary failures.

Method: **find the finite verbs. Draw the clause boundaries. Then punctuate.**

### 6.2 subject, verb, object, complement

English default declarative order is **SVO**. That is a default, not a cage: questions invert, relatives front, passives promote objects.

**Subject-verb agreement** (standard written English): a singular subject takes a singular verb form where English still marks it (*the box is*; *the boxes are*). Traps:

- **intervening phrases** do not change the head: *the box of nails is* (head = *box*).
- **coordination:** *and* usually plural; *or* agrees with the nearer conjunct in many school rules — fetch the style book if the sentence is on trial.
- **collective nouns** (*committee, team*) vary by variety (US often singular, some UK usage plural when the members act separately). Name the variety.
- **there is / there are:** the delayed noun is the agreement controller in the school rule: *there are three reasons*.
- **none, data, media:** usage is shifting; a dictionary + a style book beat a remembered prohibition.

**Case** in English is thin: *I/me, he/him, who/whom* as the surviving school set. After a preposition, object form (*between you and me*). *whom* is formal; many registers use *who*. Do not fake a *whom* and miss the clause.

**Complement:** what completes the verb. *be* and other linking verbs take a **subject complement** (*she is the chair*), not an object. Confusing those two makes bad case and bad passives.

### 6.3 tense, aspect, modality

**Tense** locates the situation in time (English: past vs non-past as the marked morphological pair). **aspect** is the internal shape (ongoing, completed, habitual). **modality** is necessity, possibility, obligation (*must, may, should*, and periphrasis).

School English names (useful, slightly fictional as a system):

| School name | Typical form | Typical job |
|---|---|---|
| Simple present | *walks* | Habit, general fact, scheduled future, live report |
| Present progressive | *is walking* | Ongoing now, temporary, arranged future |
| Simple past | *walked* | Completed in a past time |
| Past progressive | *was walking* | Ongoing in the past |
| Present perfect | *has walked* | Past with present relevance |
| Past perfect | *had walked* | Earlier than another past |
| *will* / *going to* | *will walk* | Future as prediction or intention (not a morphological tense) |

**Do not** use past perfect just because the event is "very past." use it when one past is **before** another past the reader must keep.

**Sequence of tenses** in reported speech is a register habit, not physics.

**Passive** (*was written*) promotes the patient, demotes or drops the agent. It is a tool. It is not inherently cowardly. It is cowardly when it hides an agent the reader is owed.

**Subjunctive** remnants: *if I were*, *that she see*. Rare. Do not spray them.

### 6.4 modifiers — put them where they belong

A **modifier** should sit next to what it modifies. English is unforgiving here because it has little case.

**Misplaced modifier:** *I wrote about the dog in my pyjamas* — who is wearing the pyjamas? move the phrase.

**Dangling modifier:** an introductory phrase whose implied subject is not the grammatical subject. *Walking down the street, the building exploded.* the building was not walking. Fix the subject or rewrite.

**Limiting modifiers** (*only, even, almost, nearly, just*): *only* attaches to the next eligible unit. *I only tested three cases* vs *I tested only three cases*. Put *only* against the thing you mean to limit.

**Relative clauses:**

- **restrictive** (defines which one): usually no commas; *that* or *which* in US school fights; many UK styles allow *which* without commas for restrictive. Fetch the style book; do not invent a universal.
- **non-restrictive** (adds extra): commas; *which* (or *who*). The commas are meaning.

**Participial phrases** after a noun attach to **that** noun. *the man eating a sandwich* vs *the man, eating a sandwich, ...* — punctuation changes the job.

**Stacking adjectives:** English has a preferred order (opinion, size, age, color, origin, material, purpose as a school mnemonic). Native speakers hear a violation. If a string of adjectives creaks, reorder or split.

### 6.5 parallelism, reference, and noise

**Parallelism:** coordinated pieces should share a shape. *to err is human; to forgive, divine* works because both sides are infinitival. *she likes hiking, to swim, and bikes* does not.

**Pronoun reference:** a pronoun needs an unambiguous **antecedent**. *they* as a singular generic is ordinary English; make the antecedent clear anyway. **this** at the start of a sentence with no noun is a fog machine — *this claim*, *this result*.

**Agreement in number** with *everyone, each*: school formal English treats them as singular (*everyone has his or her* / *everyone has their* — pick a style and hold it).

**Double negative** as agreement vs as logic: in many English varieties *I don't know nothing* is negative concord (still one negation). In standard written English it is read as a logic error or a dialect feature you did not mean to signal. Know the register.

**Check:** finite verb found. Clause boundary drawn. Agreement with the **head**. Modifier touching its noun. *only* next to the limited thing. Pronoun has one antecedent.

---

## 7. Rhetorical Structures: Persuasion, Coherence, and Style

Rhetoric is the craft of **moving** an audience. The literature pack owns the long form (`../literature/` ch 11). This pack owns the **linguistic** overlap: a sentence is already a speech act (ch 2.6).

Aristotle's school triad: **ethos** (why this speaker may be believed), **pathos** (what feeling is stirred), **logos** (what follows). Fetch the *Rhetoric* on Perseus if you will quote it. The **canons** (invention, arrangement, style, memory, delivery) are a later Roman school list.

**Register** is the first rhetorical choice a linguist can name: who is to be moved, on what occasion (**kairos**). A clause that is grammatical and still wrong for the occasion is a pragmatic miss, not a syntax miss.

Figures that are **grammar in costume**:

- **anaphora:** repeat at the left edge.
- **parallelism:** ch 6.5 as rhetoric, not only as correctness.
- **antithesis:** two clauses set against each other.
- **rhetorical question:** an interrogative doing an assertion.
- **passive and nominalization:** hide or highlight agents.

Literature pack: tropes (metaphor, irony) and close reading. This chapter: **do not call a grammatical failure a style.** fix the clause, then decide whether the fragment is a punch.

**Check:** who is to be moved. By which means. On which occasion. The literature pack if the object is a novel or a speech as art.

---

## 8. Lexicography and Etymology: The Biography of Words

**Lexicography** is how dictionaries are made: evidence of use, then a definition. **etymology** is the history of a form. They are different jobs.

### 8.1 method (lookup)

1. **write the form you actually have** (spelling, capitalization, morphology). A declined or inflected form may need the citation form (*went* → *go*).
2. **open a dictionary that names its evidence.** for contemporary US English, **Merriam-Webster** is the public door this pack names. Historical sense, first dates, and finer splits often need a historical dictionary (OED is a product; fetch if you have it). Bilingual jobs need a bilingual dictionary **plus** a monolingual in the source language.
3. **read the whole entry:** part of speech, numbered senses, examples, usage labels (*dated, slang, technical, offensive*).
4. **pick the sense that fits this sentence.** do not paste sense 1 into a sentence that wanted sense 4.
5. If two reputable dictionaries disagree, **say so**. Do not average them.

**Collocation:** words that habitually sit together (*make a decision*, *strong tea*). A synonym that breaks the collocation is not a synonym in use.

**Corpus check:** if the job is "do people say this," a dictionary example is a start; a corpus (or honest search in a named collection) is better. Do not take a comment-section majority as a corpus.

### 8.2 what not to do (folk etymology)

**Folk etymology** is a story that **sounds** like history: *history* from *his story*; *avocado* from a tale you just coined; *nice* "originally" meaning a moral you need for a sermon.

Method against invention:

- An etymology without a **cited dictionary or historical grammar** is a guess.
- **cognates** are related by descent, not by meaning today. Resemblance across languages is not a shared soul. Fetch the dictionary; do not preach from a rhyme.
- **false friends** are lookalikes across languages with different meanings. They are a translation hazard (ch 9).
- **acronym lore** (*posh* as a steamship ticket, and cousins) is almost always false. If an acronym origin is real, a dictionary will say so.
- **oldest meaning owns us** is a fallacy. Etymology does not police today's sense. Fetch the usage note, then decide for **this** register. History is not a warrant.

**Morphological transparency** (*un-happy*) is not etymology. It is living structure (ch 2.3). A word can be morphologically opaque and still current (*cranberry*).

**Check:** dictionary named, sense numbered, etymology only if the dictionary or a historical grammar funded it. Empty hit → state unverified. Never invent a root.

---

## 9. The Theory of Translation: Equivalence, Fidelity, and Pragmatic Loss

**Translation** maps **meaning and job** from a source language into a target language. It is not a column of dictionary equivalents.

### 9.1 why word-swap fails

- **sense inventories differ.** a source word with four senses is not four copies of one target word.
- **grammar differs.** a language that marks evidentiality, honorifics, or dual number forces the translator to **add** or **drop** distinctions English does not mark.
- **collocation and idiom** are not compositional (ch 2.5). *kick the bucket* word-swapped is a kick and a bucket.
- **register and speech act** (ch 2.6, ch 7). A polite formula swapped literally becomes rude or comic.
- **names and culture.** a food, a legal office, a kinship term may have no one-word target. **gloss**, **loan**, or **explain** — pick on purpose.

**Calque** (loan translation) copies structure. Sometimes it works (*loanword* itself is a calque of German *Lehnwort*). Sometimes it produces English nobody asked for.

**False friends:** see ch 8. A shared Latin ancestor is not a shared sense.

### 9.2 method

1. **read the source as a text** (genre, speaker, clause, implicature). Literature pack if it is art.
2. **name the job in the target** (legal force, joke, warning, lyric).
3. **translate clauses**, not words. Keep argument structure unless the target grammar requires a rebuild.
4. **then** choose words that carry the sense **and** the register.
5. If a wording is load-bearing (a statute, a poem, a UI string, a religious text), **fetch the source** and say what you cannot carry.

**Machine translation** is a draft. It word-swaps at industrial scale, with fluent cover. **check** every proper name, negation, number, and scope. A missing *not* is a different speech act.

**Localization** is translation plus locale: date formats, decimal marks, honorifics, legal copy, layout (W3C i18n). Encoding is UTF-8 (ch 5). Language tags are BCP 47 (ch 12). None of those is the translation itself.

**Back-translation** is a check, not a proof. If the back-translation is identical, you may have written English wearing a costume.

**Check:** source language named. Target register named. What could not be carried is stated. No invented proverb.

---

## 10. Sociolinguistics, Dialectology, and First Language Acquisition

### 10.1 variation

**Everybody** speaks a variety. **standard** is a variety with institutions (schools, offices, publishers). It is not the language's essence.

**Accent** is pronunciation. **dialect** includes grammar and lexicon. **code-switching** is moving between systems on purpose. None of these is "broken."

**Prestige** and **stigma** are social facts. They are not phonology.

When a writer's job is standard written English, say so and use ch 6. When the job is to describe a variety, describe it. Do not "correct" a transcript of speech into a textbook and call it the data.

### 10.2 change

Languages change. **sound change**, **analogy**, **borrowing**, **grammaticalization** (content word to grammatical piece) are school names. **diachrony** (ch 3) is this cut.

**Relatedness** is family descent (Romance, Germanic, Bantu as names of families), not "they look similar." **regular sound correspondence** is the method. Resemblance without correspondence is a guess. Do not invent a proto-form.

**Contact:** pidgins, creoles, mixed varieties, areal features. A creole is a language. It is not a failed standard.

Fetch a historical grammar for a reconstruction. This book will not reconstruct Proto-Indo-European on a dare.

### 10.3 acquisition

Children build a grammar from the language around them, without being taught the six cuts. **critical period** talk is a research program — fetch a survey, do not cite a remembered age as law.

**Second-language** learning is not first-language acquisition with worse luck. It has transfer, instruction, and adult attention.

MIT OCW **24.900 Introduction to Linguistics** is the undergrad door this pack names for acquisition, historical change, and signed languages as course objects.

**Check:** variety named. Change claimed only with a source. Acquisition claims fetched, not remembered from a magazine.

---

## 11. Generative Grammar and Universal Linguistic Principles

**Noam Chomsky's** program (from the 1950s onward) is a **theory of what a grammar is**, not a writing handbook and not an official web standard. There is no Chomsky URL in this pack's index. If you need a page, fetch a paper or a textbook citation. Do not invent a homepage and call it primary authority.

Core teaching claims, as the school actually uses them:

- A grammar is a **finite system** that generates **unbounded** expressions (the "infinite use of finite means" slogan is older; the generative cut is explicit mechanism).
- **I-language:** the internal state of a speaker. **E-language:** external corpora, social objects. The theory's object is I-language.
- **competence / performance** (ch 1): the theory is about competence. Slips, memory limits, and corpus frequencies are performance unless you have a theory that joins them.
- **universal grammar (UG):** the hypothesis that humans come with a specifically linguistic initial state. This is a **research program**, not a list of universals you can paste. **poverty of the stimulus** is the named argument that the data underdetermine the grammar the child reaches. Philosophers and psychologists fight this (SEP: philosophy of linguistics, language and innateness). Do not pretend the fight is over.
- **syntactic structure is real:** constituency, movement, hierarchical embedding — trees, not only word chains. **colorless green ideas sleep furiously** is the school sentence for "grammatical but semantically odd."
- Later names (**Government and Binding, Minimalist Program, merge**) are stages of the same family. You do not need them to write English. You need them to read a syntax paper.

**Not** what the theory is:

- Not "Chomsky said never use the passive."
- Not a spellchecker.
- Not a claim that all languages have English parts of speech under English names.
- Not a URL.

**Descriptive** vs **prescriptive:** generative grammar is descriptive of I-language. Ch 6 is **prescriptive for a written register** on purpose. Keep the hats off each other's heads.

**Check:** are you describing a speaker's system, or editing a page? if editing, ch 6. If theorizing, name the claim so it can be wrong.

---

## 12. Standardization and Identification: BCP 47 and ISO 639 Language Tags

Computers and catalogs need **tags**. Humans need **names**. They are not the same.

**BCP 47** (IETF Best Current Practice 47) is how the internet tags languages. It currently includes **RFC 5646** (tags) and **RFC 4647** (matching). W3C tells authors to **choose a language tag** and put it on HTML (`lang`). Fetch W3C "Choosing a Language Tag" and the **IANA Language Subtag Registry**. Do not invent a subtag.

School shape of a tag (read the RFC for the grammar): a **primary language** subtag, then optional **script**, **region**, **variant** subtags, hyphen-separated. Examples belong on the IANA registry and W3C's article — fetch them for the language you have. A two-letter code you remember from high school may be ISO 639-1 and still be the wrong tag for the **variety** on the page.

**ISO 639** language codes: the Library of Congress is the coding agency for **ISO 639-2** (Set 2). That LoC page is the authorized list for those three-letter codes. **ISO 639-3** aims at comprehensive coverage of individual languages; it is a different set with a different agency. **do not** treat Ethnologue's product pages as the free public primary authority for a code. If you need a catalog of languoids and references, **Glottolog** is a research catalog (Max Planck). Speaker counts rot; fetch and date them.

**Macro-languages** and **language vs dialect** (ch 1) reappear here as tag fights. A tag is an identifier for an information object. It is not a political recognition of a people. Still: tagging a person with the wrong language is a practical harm. Pick the tag that matches the **text**.

**Check:** tag fetched from IANA / W3C / LoC. Script subtag only if the script is not the default. No homemade codes.

---

## 13. Authoritative Linguistic Portals: Unicode Consortium, IPA, and W3C

| Job | Door |
|---|---|
| What Unicode is | **Unicode Standard** · technical introduction · glossary |
| A specific character | **Unicode charts** · Where is my Character? |
| UTF-8 bytes, well-formedness, BOM | **Unicode UTF-8/BOM FAQ** · **RFC 3629** |
| Web encoding and language tags | **W3C Internationalization** |
| Language tags | **BCP 47 / RFC 5646** · IANA subtag registry · W3C choosing tags |
| ISO 639-2 codes | **Library of Congress** ISO 639-2 |
| IPA chart | **International Phonetic Association** |
| Fonts that cover IPA / many Latin diacritics | **SIL** fonts (Doulos, Charis, Gentium) |
| Undergrad linguistics course | **MIT OCW 24.900** |
| Philosophy of the field | **Stanford Encyclopedia: philosophy of linguistics** |
| English word sense | **Merriam-Webster** |
| Rhetoric / literature as art | `../literature/` |
| Bits, files, encodings as CS | `../computing/` |

Never invent a **code point**, a **byte sequence**, an **etymology**, a **speaker count**, or a **language tag**. Format a search. Cite the URL. Wiki orients; it does not beat Unicode on a character or IETF on UTF-8.

---

## 14. Systematic Diagnostic Inquest for Linguistic and Textual Problems

1. **name the object:** speech, sign, or writing; which language / variety.
2. **name the cut** (ch 2). One cut first.
3. If the job is **bytes**, ch 5. Encoding named. Ill-formed sequences refused.
4. If the job is **a sentence on a page**, ch 6. Clauses, then modifiers, then rhetoric.
5. If the job is **a word**, ch 8. Dictionary, numbered sense. No folk root.
6. If the job is **another language's text**, ch 9. Meaning and job, not a swap.
7. Primary record missing → state unverified. Fetch the door in ch 13.

Stuck patterns:

| Symptom | Try |
|---|---|
| "bad grammar" with no variety named | Ch 1, ch 6, ch 10 |
| IPA symbol from memory | IPA chart; Unicode if you need a code point |
| `U+` finished from vibe | Stop. Unicode charts |
| Mojibake / "weird letters" | Ch 5: wrong encoding or ill-formed UTF-8 |
| *only* in the wrong place | Ch 6.4 |
| Dangling *-ing* phrase | Ch 6.4 |
| Translation that reads like a dictionary | Ch 9 |
| "originally the word meant..." | Ch 8.2 |
| Chomsky quote as a style rule | Ch 11 vs ch 6 |
| Dialect as broken standard | Ch 10.1 |
| Signed language as mime | Ch 1 |
| Word count vs character count in software | Ch 5.7 grapheme clusters |

---

## close

Language is a system with levels. Writing is a technology. Unicode encodes characters; UTF-8 is how those characters usually move on the wire. A writer still needs clauses. A translator still needs meaning. Fetch the character, the tag, and the dictionary. Do not invent them.

```
CITE: stacks/language/TEXTBOOK.md
```
