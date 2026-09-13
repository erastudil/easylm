---
title: "language — undergrad textbook"
date: "2026-09-13"
status: living · undergrad · easylm
home: "warehouse/language/"
related:
  - "../literature/"
  - "../philosophy/"
  - "../computing/"
  - "../history/"
  - "../geography/"
  - "warehouse/LAW.md"
---

# language — undergrad textbook

a working book for tongues, desks, and humans who must **name the level, the form, and the meaning**.  
this file teaches. a code point, a language-tag, an etymology, a translation, a speaker count → DONT_KNOW / fetch the named door. **do not invent a code point. do not invent an etymology. do not swap words and call it a translation.**

**law this book applies:** language is a system people share, not a bag of words. speech is not writing. a sign has two sides. Unicode encodes characters, not languages. grammar a writer can use is clause, tense, agreement, modifier placement. rhetoric lives next door in `../literature/`. of which thou knowest not, remain silent.

machine encoding: this pack owns **what text is**. bit layout cousins: `../computing/`. meaning-as-philosophy: `../philosophy/`. stories and persuasion as art: `../literature/`. when a language sat: `../history/`. where it sits: `../geography/`.

---

## 0. how to use this book

read chapter 1, then the chapter the job needs.

| you need | chapter |
|---|---|
| what language is | 1 |
| phonetics, phonology, morphology, syntax, semantics, pragmatics | 2 |
| signifier / signified | 3 |
| writing systems | 4 |
| Unicode and UTF-8 | 5 |
| grammar a writer can use | 6 |
| rhetoric (short) | 7 |
| looking a word up | 8 |
| translation | 9 |
| variation, change, acquisition | 10 |
| generative grammar as theory | 11 |
| naming a language (tags, codes) | 12 |
| Unicode, IPA, MIT OCW, W3C, dictionaries | 13 |
| stuck on a sentence, a word, a byte | 14 |

work order: **why → what → how**. name the **level** (sound, form, meaning, use) before you name a school.

---

## 1. what language is

**language** here is the structured system humans use to mean things for each other: spoken, signed, or written. a good answer names **which system**, **which level** (sound, form, meaning, use), and **what would count as evidence**.

four questions, every time:

1. is this **speech**, **sign**, or **writing**?
2. which **level** is the job (ch 2)?
3. is the claim about a **system**, a **use**, or a **value** ("correct English")?
4. load-bearing fact (code point, tag, etymology, census) — did you **fetch** it?

**a language** vs **language**. *a language* is one system among many (Japanese, Yoruba, ASL). *language* is the human capacity. do not mash the words.

**dialect** vs **language** is not a purity test. mutual intelligibility, history, and politics all get used; none of them is a thermometer. a "dialect" can be a full grammar. a "language" can be two grammars under one name. name the variety. do not rank it.

**idiolect:** one person's system. **register:** the cut of the system for a job (lab note, sermon, chat). **style:** choices inside a register.

**competence** (what the system allows) vs **performance** (what a body did this time, including slips). a typo is performance. a grammar that forbids a pattern is competence. ch 11 for the generative cut of this pair.

**signed languages** are languages. they have phonology (handshape, location, movement), morphology, syntax. they are not pantomime and not "English on the hands." fingerspelling is a bridge to a writing system, not the language.

**writing** is a technology laid on language (ch 4). many languages have no everyday orthography. many people speak a language they do not write.

animal calls, bee dances, and trained apes are **communication**. they are not this book's object unless a claim about *human* language hangs on the comparison — then say so, and do not smuggle "therefore not unique" as a proof.

**natural language** vs **formal language**. English is natural. a programming language is a formal notation (`../computing/`). this pack does not treat Python as a human language. it does treat Unicode as how human writing is stored.

**check:** if you cannot say whether you are talking about sound, form, meaning, or use, you are doing vibe, not linguistics.

---

## 2. the six cuts

school linguistics cuts the object so the job stays small. the cuts are **not** a stack you must climb in order every time. they are names for different objects.

| cut | object | typical question |
|---|---|---|
| **phonetics** | speech sounds as physics and anatomy | what is the air doing? |
| **phonology** | sounds as a system in a language | which differences count? |
| **morphology** | word-internal form | what pieces make this word? |
| **syntax** | how words make phrases and clauses | what may sit where? |
| **semantics** | conventional meaning | what does this form mean? |
| **pragmatics** | meaning in a situation | what is being done *here*? |

method: **name the cut**, then work inside it. a complaint that mixes "this vowel is ugly" (phonetics/aesthetics) with "this sentence is ungrammatical" (syntax) with "that was rude" (pragmatics) is three jobs.

### 2.1 phonetics

**phonetics** describes how sounds are made (**articulatory**), how they travel (**acoustic**), and how they are heard (**auditory**).

articulatory skeleton (spoken languages):

- **pulmonic** air from the lungs is the usual power source.
- **place** of constriction: lips, teeth, alveolar ridge, palate, velum, glottis, ...
- **manner:** stop, fricative, affricate, nasal, approximant, lateral, ...
- **voicing:** vocal folds vibrating or not.
- **vowels:** tongue height, backness, lip rounding; **monophthong** vs **diphthong**.

**IPA** (International Phonetic Alphabet) is the shared notation. the chart is owned by the International Phonetic Association. fetch the chart. do not invent a symbol. do not guess a Unicode code point for a symbol — fetch Unicode / the IPA's own chart notes.

**narrow** transcription tries to catch extra detail. **broad** transcription catches contrasts that matter for the language (and then you are already leaning on phonology).

**check:** you can point at a place and a manner, or you fetched a spectrogram / IPA cell. "it sounds like X" is a start, not a description.

### 2.2 phonology

**phonology** is the system of contrasts and patterns in **one** language (or one variety).

**phoneme:** a contrast that can distinguish words. **allophone:** a variant of a phoneme that does not, in that language, make a different word. a pair of words that differ by one contrast is a **minimal pair**. if you cannot exhibit a pair, you do not yet have a phoneme; you have a guess.

**phonotactics:** what sequences the language allows. English allows *str-* at the start of a word; Japanese (as usually described) does not allow the same cluster. do not universalize English clusters.

**prosody:** stress, length, tone, intonation — sound structure above the segment. a **tone language** uses pitch to distinguish words. English uses pitch more for phrase meaning (intonation) than for word identity. fetch the language before you declare it "tonal."

**check:** contrast shown, or distribution stated, for **this** language. a phonetic difference is not automatically a phoneme.

### 2.3 morphology

**morphology** is how **words** are built from smaller meaningful pieces.

**morpheme:** a smallest conventional pairing of form and meaning (or grammatical job). **free** morphemes can stand as words. **bound** morphemes cannot (*-ed*, *un-*, case suffixes, ...).

**root** vs **affix**. **prefix, suffix, infix, circumfix** as position names. **stem** is what the affix attaches to this round.

**inflection** fits a word to syntax (tense, number, case, agreement) without making a new dictionary word. **derivation** makes a new word (*happy* → *happiness*). **compounding** joins words (*blackboard*). the border is messy; name the job, not the trophy.

**allomorphy:** one morpheme, more than one shape (*a* / *an*; English plural *-s* / *-z* / *-əz* as a school example — fetch a phonology note if the exact conditioning is the job).

**productivity:** whether speakers still make new forms with that pattern. a fossil is not a rule.

**isolating / agglutinating / fusional / polysynthetic** are **tendencies**, not boxes you drop a language into once. a language can be isolating in one corner and fusional in another.

**check:** can you split the word into pieces that each have a job? if a split explains nothing, do not split.

### 2.4 syntax

**syntax** is how words form **phrases** and **clauses**.

**constituent:** a group that behaves as a unit (moves together, replaces together, stands as an answer). tests: substitution, movement, coordination, standalone answer. one test is weak; several agreeing is better.

**head:** the word that determines the phrase's kind. a **noun phrase** is headed by a noun (or a thing doing that job). a **verb phrase** by a verb. **complement** is required by the head. **adjunct** is extra (time, place, manner).

**argument structure:** how many and what kind of arguments a verb wants (intransitive, transitive, ditransitive as school names). **valency** is the count. languages mark this with order, case, agreement, or a mix.

**word order** as a default, not a law of nature. school labels **SVO, SOV, VSO, ...** describe a **dominant** order of subject, object, verb. English is typically SVO in declarative clauses. Japanese is typically SOV. fetch the language. do not call a focused or question order "the language's order."

**recursion / embedding:** clauses inside clauses. "the cat the dog chased ran" is English syntax working, not a riddle from space.

**ungrammatical** means the system of that variety does not allow the form. it does not mean "I dislike it" or "a teacher marked it." mark the variety.

writer-facing syntax continues in ch 6.

**check:** name the head, the clause type, and the test that shows a constituent. vibe is not a tree.

### 2.5 semantics

**semantics** is conventional meaning: what the form contributes **across** situations, before this room and this feud.

**sense** vs **reference** (Frege's school cut): sense is the way of presenting; reference is what is picked out. "the morning star" and "the evening star" can share a reference and differ in sense. philosophy pack owns the fight about propositions; this chapter owns the linguistic cut.

**lexical** semantics: word meaning, relations among words.

- **synonymy** is rare if you demand identity of sense, register, *and* collocation.
- **antonymy** has kinds (gradable *hot/cold*, complementary *dead/alive*, converse *buy/sell*).
- **hyponymy:** *spaniel* is a hyponym of *dog*.
- **meronymy:** part-whole (*finger*–*hand*).
- **homonymy** vs **polysemy:** accident of form vs related senses of one word. dictionaries disagree; fetch two and say so.

**compositionality:** the meaning of a complex form is computed from the meanings of the parts and the way they are combined. idioms (*kick the bucket*) are the named exception: the whole is not the sum. do not use the exception to deny the rule.

**truth-conditional** talk: a sentence's semantics as the conditions under which it would be true. useful. not the whole of meaning (ch 2.6).

**scope:** which operator a word sits under. *every student read a book* has two school readings (one book vs possibly different books). if a fight is about "what it means," draw the scopes before you moralize.

**check:** paraphrase without upgrading. if you added a moral, that was not the semantics.

### 2.6 pragmatics

**pragmatics** is meaning that depends on **this** situation: who is speaking, to whom, with what shared knowledge, doing what action.

**speech act:** a sentence can **assert, ask, order, promise, warn, name**. the grammatical mood (declarative, interrogative, imperative) is a clue, not a census. "can you pass the salt?" is usually a request, not a question about ability.

**implicature** (Grice's school name): what is suggested without being said. *some of the students passed* often implicates *not all*. the implicature can be cancelled: *some — in fact all — passed*. conventional meaning cannot be cancelled that way.

**presupposition:** what is taken as already on the table. *the king of France is bald* presupposes there is a king of France. a *the*-phrase often carries existence; fetch a semantics text if the job is the formal account.

**deixis:** meaning that needs the situation to lock: *I, you, here, now, this*. a transcript without the pointing is incomplete.

**politeness and face** are pragmatic. so is **irony**. so is **register**. none of these is "not grammar." they are grammar's neighbor.

**check:** what is said vs what is done vs what is hinted. if you cannot split those, you are not done.

---

## 3. the sign

**the linguistic sign** is a teaching cut, not a mystic object. Saussure's school pair:

| side | is |
|---|---|
| **signifier** (*signifiant*) | the form you can hear, see, or feel (a stretch of sound, a written word, a sign-language form) |
| **signified** (*signifié*) | the concept that form is paired with in the system |

the sign is **both sides together**. a sound with no conventional pairing is noise. a concept with no form in the language is not a word of that language.

**arbitrariness:** the pairing is conventional, not a picture of the world. nothing about the sounds of *tree* (English) or *arbre* (French) or *ki* (Japanese) is the tree. **onomatopoeia** and **ideophones** are limited iconic corners. they do not cancel the rule.

**value in the system:** a sign means what it means **against the other signs**. a color word's range depends on how many color words the language cuts. this is not "language determines thought" as a slogan. it is: **do not assume English cuts are nature.**

**langue** vs **parole** (Saussure's names): the shared system vs this utterance. **synchrony** vs **diachrony:** the system at a time vs the system through time. you can study today's grammar without telling the etymology. you can study the etymology without pretending it rules today's meaning (ch 8).

this is a **teaching idea**. Saussure's *Cours de linguistique générale* (1916) was assembled after his death from notes. it is a historical book, not a living standards body. there is no official Saussure site to fetch as SoT. for philosophy of the cut, fetch Stanford Encyclopedia **philosophy of linguistics**. for the text, fetch a named edition from a library. do not invent a homepage.

later structuralists and then **generativists** (ch 11) argued with this picture. you do not need to pick a church to use the two-sided sign as a tool: **form and meaning are paired; neither side is the whole word.**

**check:** can you name the form and the concept separately, then the pairing? if you only have a translation into English, you do not yet have the sign.

---

## 4. writing systems

**writing** records language with visible (or tactile) marks. it is not speech slowed down. it is a second system, with its own history, gaps, and politics.

### 4.1 kinds (school types)

types are **how the marks relate to the language**, not how pretty they look.

| type | typical job of a graph | school examples (names, not a census) |
|---|---|---|
| **alphabet** | consonants and vowels as letters | Latin, Greek, Cyrillic |
| **abjad** | consonants; vowels optional or diacritic | Arabic, Hebrew (as usually described) |
| **abugida** (alphasyllabary) | consonant+vowel units; vowel changes by mark | Devanagari, Ethiopic |
| **syllabary** | syllables | kana, Cherokee |
| **logosyllabary / morphosyllabary** | morphemes or words, often with phonetic parts | Chinese characters as usually taught |
| **featural** | graphs built from phonetic features | Hangul (as a design) |

a real orthography is often a **mix**. English is an alphabet with heavy historical spelling. Japanese mixes morphographic *kanji* with syllabic *kana*. do not force a type on a mixed page.

**orthography** is the conventional spelling of a language (or a standard of it). **script** is the set of graphs (Latin script, Arabic script). one script, many orthographies. one language, sometimes more than one script.

**transliteration** maps one script to another **by letters**. **transcription** maps **sounds** (often IPA). they are not the same job. pinyin is a transcription/romanization of Mandarin, not "how Chinese is written" as a replacement for characters.

### 4.2 direction, space, punctuation

**directionality:** left-to-right, right-to-left, top-to-bottom, and historical boustrophedon. Unicode stores characters in **logical order** (roughly the order they are typed / the order of the language's stream), not necessarily the order of pixels. bidirectional display is a rendering job. fetch Unicode / W3C if the pixels fight the bytes.

**word spacing** is not universal. many scripts historically did not put spaces between words. punctuation sets are historical, not natural law. a full stop is a writing convention, not a clause detector you can trust in every language.

**capitalization, hyphenation, and "a word"** are orthographic decisions. Unicode encodes characters. it does not tell you where English hyphenates. language-specific rules live in CLDR, layout notes (W3C language enablement), and dictionaries — fetch them.

### 4.3 speech and writing come apart

writing **underrepresents** speech (no full intonation, often no exact vowel quality) and **overrepresents** history (English *knight*, French silent letters). **spelling pronunciation** is speech changing to match writing. **eye dialect** is writing pretending to be speech.

**literacy** is skill in a writing system. it is not intelligence and it is not "having a language."

**check:** script, orthography, direction. speech or writing. if you cite a "letter," is it a graph, a phoneme, or a Unicode character? those three are different (ch 5).

---

## 5. Unicode and UTF-8

this chapter is **load-bearing**. numbers, ranges, and byte sequences below are from the Unicode Consortium's own pages and from RFC 3629 (UTF-8). if you need a **specific character**, fetch **Unicode charts** or **Where is my Character?** do **not** invent a code point from memory. do not finish a `U+....` from vibe.

### 5.1 what Unicode is

the **Unicode Standard** is the universal character encoding for computer processing of text. versions of Unicode are kept in sync with **ISO/IEC 10646** (the Universal Character Set). a conformant Unicode implementation is also conformant to ISO/IEC 10646 on the shared repertoire.

Unicode assigns each **character** a unique **numeric value** (a **code point**) and a **unique name**. when written in text, a code point is hexadecimal after the prefix `U+`.

from Unicode's own technical introduction (fetched): **U+0041** is **LATIN CAPITAL LETTER A**. that is an official example. for any other character you care about, fetch the chart.

Unicode encodes **characters**, not **glyphs**. a character is an abstract identity ("LATIN CAPITAL LETTER A"). a **glyph** is a mark on screen or paper. fonts and rendering engines choose the glyph. Unicode does not specify size, serif, or handwriting.

Unicode encodes **plain text**. it does not encode bold, font, or "this is English." language identity is a separate tag (ch 12).

### 5.2 principles (names)

Unicode's own list of fundamental principles (technical introduction): **universal repertoire, logical order, efficiency, unification, characters not glyphs, dynamic composition, semantics, stability, plain text, convertibility.**

**unification:** equivalent forms inside a script are not given duplicate codes just because two languages use them. CJK ideographs that are historically the same character are unified rather than triplicated per language. this is an encoding policy. it is not a claim that Chinese, Japanese, and Korean are one language.

**stability:** assignment is **additive**. characters are not removed or reinterpreted incompatibly. fetch the Unicode stability policies if a product depends on that guarantee.

**characters, not glyphs; dynamic composition:** a base character plus combining marks can make what a reader thinks of as "one letter." a **precomposed** character (compatibility with older sets) can often be decomposed. "the same thing to a reader" can therefore be **more than one code-point sequence**. that fact is a security and matching issue (RFC 3629 section 10; Unicode Normalization). fetch **UAX #15** if you must compare strings for identity.

### 5.3 codespace, not a 16-bit set

Unicode is **not** "16-bit." Unicode's own FAQ: from Unicode 2.0 (July 1996) the encoded range is **U+0000 .. U+10FFFF**, a 21-bit codespace.

that range is the **UTF-16 accessible range**. Unicode and ISO 10646 policy: future assignments stay inside the integers UTF-16 can express. over a million possible codes is a ceiling for **characters**, not for every ink mark in history.

the first 64K code points are the **Basic Multilingual Plane (BMP)**. other planes are **supplementary**. popular emoji, many historic scripts, and various CJK extensions live outside the BMP. "BMP-only" software is incomplete. fetch the charts; do not assume a plane from a vibe.

**surrogate** code points are reserved for UTF-16 pairing. they do **not** represent characters by themselves. RFC 3629: UTF-8 **must not** encode U+D800 .. U+DFFF as if they were characters.

**private-use** code points have **no** universal meaning. vendors may assign them. they are not portable identity. do not cite a private-use code as "the Unicode for X."

**unassigned** code points are not yours to fill. conformance: do not use unassigned codes; do not corrupt unknown characters.

for **how many characters are encoded today**, fetch **the latest Unicode version**. the technical introduction's running prose will lag. a count in this book would rot.

### 5.4 encoding forms: UTF-8, UTF-16, UTF-32

an **encoding form** maps code points to **code units** in bits.

Unicode defines three forms. they encode the **same** repertoire and convert without loss:

| form | code unit | school use |
|---|---|---|
| **UTF-8** | 8-bit bytes, 1-4 per character | web, files, most internet protocols |
| **UTF-16** | 16-bit units; supplementary characters as a **surrogate pair** | Java, Windows APIs as commonly described |
| **UTF-32** | one 32-bit unit per code point | some Unix internals, easy indexing by code point |

W3C internationalization: **use UTF-8** for web content unless you have a special reason not to.

a **UTF** (Unicode Transformation Format) is an algorithmic mapping from every Unicode code point **except surrogate code points** to a **unique** byte sequence. round-trip is lossless. reserved and unassigned code points still have mappings; that is required for round-trip.

**UCS-2** is obsolete terminology (Unicode FAQ): Unicode 1.1-era 16-bit, no supplementary characters. do not say UCS-2 when you mean UTF-16.

### 5.5 UTF-8 definition (RFC 3629 + Unicode FAQ)

**UTF-8** is the byte-oriented encoding form. authoritative definition: **the Unicode Standard** (encoding forms). internet profile: **RFC 3629** (STD 63, November 2003), which obsoletes RFC 2279. ISO/IEC 10646 Annex D also describes it.

RFC 3629 characteristics (paraphrase, not a substitute for the RFC):

- U+0000 .. U+007F (US-ASCII) map to single bytes `00` .. `7F`. a plain ASCII string **is** valid UTF-8.
- US-ASCII byte values do not appear inside a non-ASCII UTF-8 character. parsers that look for ASCII syntax (slash, space, NUL) do not get false ASCII from later bytes of a multi-byte character.
- one to four bytes per character in the U+0000 .. U+10FFFF range.
- the first byte of a multi-byte sequence tells the length.
- octet values **C0, C1, F5-FF never appear** in well-formed UTF-8.
- character boundaries can be found from the byte stream.
- **overlong** encodings are illegal (e.g. C0 80 is **not** U+0000).

RFC 3629 bit layout (the table the RFC prints):

```
Char. number range  | UTF-8 octet sequence (binary)
0000 0000-0000 007F | 0xxxxxxx
0000 0080-0000 07FF | 110xxxxx 10xxxxxx
0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
```

there is **only one** valid way to encode a given character. implementations **MUST** refuse invalid sequences. a naive decoder that accepts overlong forms or surrogate pairs as UTF-8 is a **security** bug. RFC 3629 records real exploits that used illegal sequences to sneak `../` and NUL past filters.

**CESU-8** encodes UTF-16 code units instead of code points. it is **not** valid UTF-8 and is not for the internet.

UTF-8 has **no endianness**. a BOM in UTF-8 is **only** a signature that the file is UTF-8, not a byte-order switch. the UTF-8 BOM bytes are **EF BB BF** (Unicode BOM FAQ table). some protocols (Unix `#!` scripts, protocols that require a given ASCII start) should **not** use a UTF-8 BOM.

Unicode FAQ: where a BOM is used with UTF-8, it has **nothing to do with byte order**.

### 5.6 BOM table (Unicode FAQ, fetched)

when U+FEFF sits at the start of a stream as a signature, the **bytes** depend on the encoding form. Unicode's own table:

| bytes | encoding form |
|---|---|
| 00 00 FE FF | UTF-32, big-endian |
| FF FE 00 00 | UTF-32, little-endian |
| FE FF | UTF-16, big-endian |
| FF FE | UTF-16, little-endian |
| EF BB BF | UTF-8 |

in the middle of a file, U+FEFF is historically ZERO WIDTH NO-BREAK SPACE. Unicode prefers **U+2060 WORD JOINER** for word-joining, so U+FEFF can be a signature without confusion. fetch the FAQ if a file is full of mystery FEFF.

tagged `UTF-16BE` / `UTF-16LE` / `UTF-32BE` / `UTF-32LE` streams **must not** use a BOM. the tag already named the order.

### 5.7 character vs grapheme vs byte vs code unit

four different meters. mixing them is how software eats a name.

| meter | counts |
|---|---|
| **byte** | octets on disk or wire |
| **code unit** | 8-bit (UTF-8), 16-bit (UTF-16), or 32-bit (UTF-32) units |
| **code point** | Unicode scalar identity |
| **grapheme cluster** | what a user thinks of as "a character" (base + combining marks, many emoji sequences) |

a combining sequence (base + acute, a flag emoji of several code points, a Korean syllable as *jamo*) is **one** user-perceived character and **several** code points. Unicode **UAX #29** (text segmentation) is the door for grapheme clusters. if you index "the nth character" in a UI, you almost certainly wanted grapheme clusters, not code units.

**do not** invent the code points of those sequences here. fetch.

### 5.8 what Unicode is not

Unicode is not a font. not a language. not a keyboard. not a locale. not a grammar. not a translation memory.

**collation** (sort order) is language-specific. UTF-8 byte order is **not** a cultural sort (RFC 3629 says this outright). fetch the **Unicode Collation Algorithm** (UTS #10) and CLDR if you must sort names for humans.

**normalization** (NFC, NFD, ...) is UAX #15. needed when one precomposed accented letter must match a base letter plus combining mark for identity. fetch it. do not roll your own.

**check:** encoding named (UTF-8?). sequence well-formed? comparing bytes, code points, or graphemes? specific `U+....` fetched from Unicode, not remembered.

---

## 6. grammar a writer can use

this chapter is **English school grammar for making sentences that do the job**. it is not a claim that English is language. it is not a morality. other languages have other agreements, other tense systems, other places for modifiers. if the text is not English, fetch a grammar of **that** language.

style-book fights (Oxford comma as a religion, "they" as singular) belong to a named publication style. US literature classrooms often default to **MLA**; other fields to **Chicago**. those manuals are products. this book teaches the **clause**. for a word's existence and sense, **Merriam-Webster**. for a character, **Unicode**.

### 6.1 the clause

a **clause** has a **predicate** (usually a finite verb) and, in English declaratives, a **subject**.

- **independent clause:** can stand as a sentence.
- **dependent (subordinate) clause:** cannot; it hangs on another clause (*because ...*, *who ...*, *that ...*).

**sentence** types by job: **declarative, interrogative, imperative, exclamative**. a period does not make a clause complete. "Running down the road." is a phrase wearing a capital letter.

**simple** sentence: one independent clause. **compound:** coordinated independents. **complex:** independent + subordinate. names help you punctuate. they are not a scoring system.

**fragment:** a group punctuated as a sentence that is not an independent clause. illegal in many formal registers. legal as a rhetorical punch (ch 7). know which register you are in.

**run-on:** two independents jammed without coordination or a fit stop. a comma between independents with no coordinator is a **comma splice**. both are clause-boundary failures.

method: **find the finite verbs. draw the clause boundaries. then punctuate.**

### 6.2 subject, verb, object, complement

English default declarative order is **SVO**. that is a default, not a cage: questions invert, relatives front, passives promote objects.

**subject-verb agreement** (standard written English): a singular subject takes a singular verb form where English still marks it (*the box is*; *the boxes are*). traps:

- **intervening phrases** do not change the head: *the box of nails is* (head = *box*).
- **coordination:** *and* usually plural; *or* agrees with the nearer conjunct in many school rules — fetch the style book if the sentence is on trial.
- **collective nouns** (*committee, team*) vary by variety (US often singular, some UK usage plural when the members act separately). name the variety.
- **there is / there are:** the delayed noun is the agreement controller in the school rule: *there are three reasons*.
- **none, data, media:** usage is shifting; a dictionary + a style book beat a remembered prohibition.

**case** in English is thin: *I/me, he/him, who/whom* as the surviving school set. after a preposition, object form (*between you and me*). *whom* is formal; many registers use *who*. do not fake a *whom* and miss the clause.

**complement:** what completes the verb. *be* and other linking verbs take a **subject complement** (*she is the chair*), not an object. confusing those two makes bad case and bad passives.

### 6.3 tense, aspect, modality

**tense** locates the situation in time (English: past vs non-past as the marked morphological pair). **aspect** is the internal shape (ongoing, completed, habitual). **modality** is necessity, possibility, obligation (*must, may, should*, and periphrasis).

school English names (useful, slightly fictional as a system):

| school name | typical form | typical job |
|---|---|---|
| simple present | *walks* | habit, general fact, scheduled future, live report |
| present progressive | *is walking* | ongoing now, temporary, arranged future |
| simple past | *walked* | completed in a past time |
| past progressive | *was walking* | ongoing in the past |
| present perfect | *has walked* | past with present relevance |
| past perfect | *had walked* | earlier than another past |
| *will* / *going to* | *will walk* | future as prediction or intention (not a morphological tense) |

**do not** use past perfect just because the event is "very past." use it when one past is **before** another past the reader must keep.

**sequence of tenses** in reported speech is a register habit, not physics.

**passive** (*was written*) promotes the patient, demotes or drops the agent. it is a tool. it is not inherently cowardly. it is cowardly when it hides an agent the reader is owed.

**subjunctive** remnants: *if I were*, *that she see*. rare. do not spray them.

### 6.4 modifiers — put them where they belong

a **modifier** should sit next to what it modifies. English is unforgiving here because it has little case.

**misplaced modifier:** *I wrote about the dog in my pyjamas* — who is wearing the pyjamas? move the phrase.

**dangling modifier:** an introductory phrase whose implied subject is not the grammatical subject. *Walking down the street, the building exploded.* the building was not walking. fix the subject or rewrite.

**limiting modifiers** (*only, even, almost, nearly, just*): *only* attaches to the next eligible unit. *I only tested three cases* vs *I tested only three cases*. put *only* against the thing you mean to limit.

**relative clauses:**

- **restrictive** (defines which one): usually no commas; *that* or *which* in US school fights; many UK styles allow *which* without commas for restrictive. fetch the style book; do not invent a universal.
- **non-restrictive** (adds extra): commas; *which* (or *who*). the commas are meaning.

**participial phrases** after a noun attach to **that** noun. *the man eating a sandwich* vs *the man, eating a sandwich, ...* — punctuation changes the job.

**stacking adjectives:** English has a preferred order (opinion, size, age, color, origin, material, purpose as a school mnemonic). native speakers hear a violation. if a string of adjectives creaks, reorder or split.

### 6.5 parallelism, reference, and noise

**parallelism:** coordinated pieces should share a shape. *to err is human; to forgive, divine* works because both sides are infinitival. *she likes hiking, to swim, and bikes* does not.

**pronoun reference:** a pronoun needs an unambiguous **antecedent**. *they* as a singular generic is ordinary English; make the antecedent clear anyway. **this** at the start of a sentence with no noun is a fog machine — *this claim*, *this result*.

**agreement in number** with *everyone, each*: school formal English treats them as singular (*everyone has his or her* / *everyone has their* — pick a style and hold it).

**double negative** as agreement vs as logic: in many English varieties *I don't know nothing* is negative concord (still one negation). in standard written English it is read as a logic error or a dialect feature you did not mean to signal. know the register.

**check:** finite verb found. clause boundary drawn. agreement with the **head**. modifier touching its noun. *only* next to the limited thing. pronoun has one antecedent.

---

## 7. rhetoric (short)

rhetoric is the craft of **moving** an audience. the literature pack owns the long form (`../literature/` ch 11). this pack owns the **linguistic** overlap: a sentence is already a speech act (ch 2.6).

Aristotle's school triad: **ethos** (why this speaker may be believed), **pathos** (what feeling is stirred), **logos** (what follows). fetch the *Rhetoric* on Perseus if you will quote it. the **canons** (invention, arrangement, style, memory, delivery) are a later Roman school list.

**register** is the first rhetorical choice a linguist can name: who is to be moved, on what occasion (**kairos**). a clause that is grammatical and still wrong for the occasion is a pragmatic miss, not a syntax miss.

figures that are **grammar in costume**:

- **anaphora:** repeat at the left edge.
- **parallelism:** ch 6.5 as rhetoric, not only as correctness.
- **antithesis:** two clauses set against each other.
- **rhetorical question:** an interrogative doing an assertion.
- **passive and nominalization:** hide or highlight agents.

literature pack: tropes (metaphor, irony) and close reading. this chapter: **do not call a grammatical failure a style.** fix the clause, then decide whether the fragment is a punch.

**check:** who is to be moved. by which means. on which occasion. the literature pack if the object is a novel or a speech as art.

---

## 8. looking a word up

**lexicography** is how dictionaries are made: evidence of use, then a definition. **etymology** is the history of a form. they are different jobs.

### 8.1 method (lookup)

1. **write the form you actually have** (spelling, capitalization, morphology). a declined or inflected form may need the citation form (*went* → *go*).
2. **open a dictionary that names its evidence.** for contemporary US English, **Merriam-Webster** is the public door this pack names. historical sense, first dates, and finer splits often need a historical dictionary (OED is a product; fetch if you have it). bilingual jobs need a bilingual dictionary **plus** a monolingual in the source language.
3. **read the whole entry:** part of speech, numbered senses, examples, usage labels (*dated, slang, technical, offensive*).
4. **pick the sense that fits this sentence.** do not paste sense 1 into a sentence that wanted sense 4.
5. if two reputable dictionaries disagree, **say so**. do not average them.

**collocation:** words that habitually sit together (*make a decision*, *strong tea*). a synonym that breaks the collocation is not a synonym in use.

**corpus check:** if the job is "do people say this," a dictionary example is a start; a corpus (or honest search in a named collection) is better. do not take a comment-section majority as a corpus.

### 8.2 what not to do (folk etymology)

**folk etymology** is a story that **sounds** like history: *history* from *his story*; *avocado* from a tale you just coined; *nice* "originally" meaning a moral you need for a sermon.

method against invention:

- an etymology without a **cited dictionary or historical grammar** is a guess.
- **cognates** are related by descent, not by meaning today. resemblance across languages is not a shared soul. fetch the dictionary; do not preach from a rhyme.
- **false friends** are lookalikes across languages with different meanings. they are a translation hazard (ch 9).
- **acronym lore** (*posh* as a steamship ticket, and cousins) is almost always false. if an acronym origin is real, a dictionary will say so.
- **oldest meaning owns us** is a fallacy. etymology does not police today's sense. fetch the usage note, then decide for **this** register. history is not a warrant.

**morphological transparency** (*un-happy*) is not etymology. it is living structure (ch 2.3). a word can be morphologically opaque and still current (*cranberry*).

**check:** dictionary named, sense numbered, etymology only if the dictionary or a historical grammar funded it. empty hit → DONT_KNOW. never invent a root.

---

## 9. translation is not word-swap

**translation** maps **meaning and job** from a source language into a target language. it is not a column of dictionary equivalents.

### 9.1 why word-swap fails

- **sense inventories differ.** a source word with four senses is not four copies of one target word.
- **grammar differs.** a language that marks evidentiality, honorifics, or dual number forces the translator to **add** or **drop** distinctions English does not mark.
- **collocation and idiom** are not compositional (ch 2.5). *kick the bucket* word-swapped is a kick and a bucket.
- **register and speech act** (ch 2.6, ch 7). a polite formula swapped literally becomes rude or comic.
- **names and culture.** a food, a legal office, a kinship term may have no one-word target. **gloss**, **loan**, or **explain** — pick on purpose.

**calque** (loan translation) copies structure. sometimes it works (*loanword* itself is a calque of German *Lehnwort*). sometimes it produces English nobody asked for.

**false friends:** see ch 8. a shared Latin ancestor is not a shared sense.

### 9.2 method

1. **read the source as a text** (genre, speaker, clause, implicature). literature pack if it is art.
2. **name the job in the target** (legal force, joke, warning, lyric).
3. **translate clauses**, not words. keep argument structure unless the target grammar requires a rebuild.
4. **then** choose words that carry the sense **and** the register.
5. if a wording is load-bearing (a statute, a poem, a UI string, a religious text), **fetch the source** and say what you cannot carry.

**machine translation** is a draft. it word-swaps at industrial scale, with fluent cover. **check** every proper name, negation, number, and scope. a missing *not* is a different speech act.

**localization** is translation plus locale: date formats, decimal marks, honorifics, legal copy, layout (W3C i18n). encoding is UTF-8 (ch 5). language tags are BCP 47 (ch 12). none of those is the translation itself.

**back-translation** is a check, not a proof. if the back-translation is identical, you may have written English wearing a costume.

**check:** source language named. target register named. what could not be carried is stated. no invented proverb.

---

## 10. variation, change, acquisition

### 10.1 variation

**everybody** speaks a variety. **standard** is a variety with institutions (schools, offices, publishers). it is not the language's essence.

**accent** is pronunciation. **dialect** includes grammar and lexicon. **code-switching** is moving between systems on purpose. none of these is "broken."

**prestige** and **stigma** are social facts. they are not phonology.

when a writer's job is standard written English, say so and use ch 6. when the job is to describe a variety, describe it. do not "correct" a transcript of speech into a textbook and call it the data.

### 10.2 change

languages change. **sound change**, **analogy**, **borrowing**, **grammaticalization** (content word to grammatical piece) are school names. **diachrony** (ch 3) is this cut.

**relatedness** is family descent (Romance, Germanic, Bantu as names of families), not "they look similar." **regular sound correspondence** is the method. resemblance without correspondence is a guess. do not invent a proto-form.

**contact:** pidgins, creoles, mixed varieties, areal features. a creole is a language. it is not a failed standard.

fetch a historical grammar for a reconstruction. this book will not reconstruct Proto-Indo-European on a dare.

### 10.3 acquisition

children build a grammar from the language around them, without being taught the six cuts. **critical period** talk is a research program — fetch a survey, do not cite a remembered age as law.

**second-language** learning is not first-language acquisition with worse luck. it has transfer, instruction, and adult attention.

MIT OCW **24.900 Introduction to Linguistics** is the undergrad door this pack names for acquisition, historical change, and signed languages as course objects.

**check:** variety named. change claimed only with a source. acquisition claims fetched, not remembered from a magazine.

---

## 11. generative grammar as theory

**Noam Chomsky's** program (from the 1950s onward) is a **theory of what a grammar is**, not a writing handbook and not an official web standard. there is no Chomsky URL in this pack's index. if you need a page, fetch a paper or a textbook citation. do not invent a homepage and call it SoT.

core teaching claims, as the school actually uses them:

- a grammar is a **finite system** that generates **unbounded** expressions (the "infinite use of finite means" slogan is older; the generative cut is explicit mechanism).
- **I-language:** the internal state of a speaker. **E-language:** external corpora, social objects. the theory's object is I-language.
- **competence / performance** (ch 1): the theory is about competence. slips, memory limits, and corpus frequencies are performance unless you have a theory that joins them.
- **universal grammar (UG):** the hypothesis that humans come with a specifically linguistic initial state. this is a **research program**, not a list of universals you can paste. **poverty of the stimulus** is the named argument that the data underdetermine the grammar the child reaches. philosophers and psychologists fight this (SEP: philosophy of linguistics, language and innateness). do not pretend the fight is over.
- **syntactic structure is real:** constituency, movement, hierarchical embedding — trees, not only word chains. **colorless green ideas sleep furiously** is the school sentence for "grammatical but semantically odd."
- later names (**Government and Binding, Minimalist Program, merge**) are stages of the same family. you do not need them to write English. you need them to read a syntax paper.

**not** what the theory is:

- not "Chomsky said never use the passive."
- not a spellchecker.
- not a claim that all languages have English parts of speech under English names.
- not a URL.

**descriptive** vs **prescriptive:** generative grammar is descriptive of I-language. ch 6 is **prescriptive for a written register** on purpose. keep the hats off each other's heads.

**check:** are you describing a speaker's system, or editing a page? if editing, ch 6. if theorizing, name the claim so it can be wrong.

---

## 12. naming a language

computers and catalogs need **tags**. humans need **names**. they are not the same.

**BCP 47** (IETF Best Current Practice 47) is how the internet tags languages. it currently includes **RFC 5646** (tags) and **RFC 4647** (matching). W3C tells authors to **choose a language tag** and put it on HTML (`lang`). fetch W3C "Choosing a Language Tag" and the **IANA Language Subtag Registry**. do not invent a subtag.

school shape of a tag (read the RFC for the grammar): a **primary language** subtag, then optional **script**, **region**, **variant** subtags, hyphen-separated. examples belong on the IANA registry and W3C's article — fetch them for the language you have. a two-letter code you remember from high school may be ISO 639-1 and still be the wrong tag for the **variety** on the page.

**ISO 639** language codes: the Library of Congress is the coding agency for **ISO 639-2** (Set 2). that LoC page is the authorized list for those three-letter codes. **ISO 639-3** aims at comprehensive coverage of individual languages; it is a different set with a different agency. **do not** treat Ethnologue's product pages as the free public SoT for a code. if you need a catalog of languoids and references, **Glottolog** is a research catalog (Max Planck). speaker counts rot; fetch and date them.

**macro-languages** and **language vs dialect** (ch 1) reappear here as tag fights. a tag is an identifier for an information object. it is not a political recognition of a people. still: tagging a person with the wrong language is a practical harm. pick the tag that matches the **text**.

**check:** tag fetched from IANA / W3C / LoC. script subtag only if the script is not the default. no homemade codes.

---

## 13. fetch on this stack

| job | door |
|---|---|
| what Unicode is | **Unicode Standard** · technical introduction · glossary |
| a specific character | **Unicode charts** · Where is my Character? |
| UTF-8 bytes, well-formedness, BOM | **Unicode UTF-8/BOM FAQ** · **RFC 3629** |
| web encoding and language tags | **W3C Internationalization** |
| language tags | **BCP 47 / RFC 5646** · IANA subtag registry · W3C choosing tags |
| ISO 639-2 codes | **Library of Congress** ISO 639-2 |
| IPA chart | **International Phonetic Association** |
| fonts that cover IPA / many Latin diacritics | **SIL** fonts (Doulos, Charis, Gentium) |
| undergrad linguistics course | **MIT OCW 24.900** |
| philosophy of the field | **Stanford Encyclopedia: philosophy of linguistics** |
| English word sense | **Merriam-Webster** |
| rhetoric / literature as art | `../literature/` |
| bits, files, encodings as CS | `../computing/` |

never invent a **code point**, a **byte sequence**, an **etymology**, a **speaker count**, or a **language tag**. format a search. cite the URL. wiki orients; it does not beat Unicode on a character or IETF on UTF-8.

---

## 14. how to attack a language job

1. **name the object:** speech, sign, or writing; which language / variety.
2. **name the cut** (ch 2). one cut first.
3. if the job is **bytes**, ch 5. encoding named. ill-formed sequences refused.
4. if the job is **a sentence on a page**, ch 6. clauses, then modifiers, then rhetoric.
5. if the job is **a word**, ch 8. dictionary, numbered sense. no folk root.
6. if the job is **another language's text**, ch 9. meaning and job, not a swap.
7. FOUND empty → **DONT_KNOW**. fetch the door in ch 13.

stuck patterns:

| symptom | try |
|---|---|
| "bad grammar" with no variety named | ch 1, ch 6, ch 10 |
| IPA symbol from memory | IPA chart; Unicode if you need a code point |
| `U+` finished from vibe | stop. Unicode charts |
| mojibake / "weird letters" | ch 5: wrong encoding or ill-formed UTF-8 |
| *only* in the wrong place | ch 6.4 |
| dangling *-ing* phrase | ch 6.4 |
| translation that reads like a dictionary | ch 9 |
| "originally the word meant..." | ch 8.2 |
| Chomsky quote as a style rule | ch 11 vs ch 6 |
| dialect as broken standard | ch 10.1 |
| signed language as mime | ch 1 |
| word count vs character count in software | ch 5.7 grapheme clusters |

---

## close

language is a system with levels. writing is a technology. Unicode encodes characters; UTF-8 is how those characters usually move on the wire. a writer still needs clauses. a translator still needs meaning. fetch the character, the tag, and the dictionary. do not invent them.

```
CITE: warehouse/language/TEXTBOOK.md
```
