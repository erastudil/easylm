---
title: "music — undergrad textbook"
date: "2026-09-13"
status: living · undergrad · the-stacks
home: "stacks/music/"
related:
  - "../physics/"
  - "../math/"
  - "../art/"
  - "../literature/"
---

# Music Theory, Acoustics & Form — Wave Physics, Harmonic Series, Temperaments & Counterpoint

A comprehensive undergraduate textbook exploring the physics, mathematics, and architectural grammar of music: acoustic wave mechanics, the harmonic overtone series, interval ratios, scale systems and temperaments (Pythagorean, Just, Meantone, 12-TET), rhythm and metric hierarchy, functional diatonic harmony, species counterpoint and voice leading, formal analysis (Sonata-Allegro, Fugue, Rondo), timbral orchestration, and global tuning systems.

---

## 0. Syllabus & Structural Map

Music is acoustic physics transformed into mathematical architecture and aesthetic emotion. When an instrument vibrates, it sets air molecules into periodic longitudinal compression waves that strike the human tympanic membrane, stimulating the cochlea's basilar membrane where different frequencies trigger tonotopically mapped hair cells. The human brain perceives simple integer frequency ratios—$2:1$ (octave), $3:2$ (perfect fifth), $4:3$ (perfect fourth)—not as dry arithmetic, but as profound perceptual consonance and emotional resonance.

```
+---------------------------------------------------------------------------------------------------+
|                                      THE ACOUSTIC SPECTRUM                                        |
+---------------------------------------------------------------------------------------------------+
|  ACOUSTIC PHYSICS (The Wave)      | Frequency (Hz) · Amplitude (dB) · Standing Waves · Harmonics  |
+-----------------------------------+---------------------------------------------------------------+
|  HARMONIC SERIES (The Natural Law)| Fundamental (f0) · Overtones (2f, 3f, 4f, 5f) · Timbre        |
+-----------------------------------+---------------------------------------------------------------+
|  INTERVALS & RATIOS (The Math)    | Octave (2:1) · Fifth (3:2) · Fourth (4:3) · Third (5:4)       |
+-----------------------------------+---------------------------------------------------------------+
|  TEMPERAMENT (The Solution)       | Pythagorean Comma · Just Intonation · Equal Temperament (12-TET)|
+-----------------------------------+---------------------------------------------------------------+
|  TONAL HARMONY (The Chords)       | Diatonic Triads · Roman Numeral Analysis · Cadences · Dominant |
+-----------------------------------+---------------------------------------------------------------+
|  COUNTERPOINT (The Lines)         | Species Counterpoint (Fux) · Voice Leading · Voice Independence|
+-----------------------------------+---------------------------------------------------------------+
|  METRIC ARCHITECTURE (Time)       | Pulse, Meter & Subdivision · Syncopation · Polyrhythms        |
+-----------------------------------+---------------------------------------------------------------+
|  MUSICAL FORM (The Structure)     | Binary (AB) · Ternary (ABA) · Rondo · Sonata-Allegro · Fugue  |
+-----------------------------------+---------------------------------------------------------------+
|  ORCHESTRATION & TIMBRE (Color)   | Formants · Envelope (ADSR) · Strings, Woodwinds, Brass, Perc  |
+-----------------------------------+---------------------------------------------------------------+
|  COMPARATIVE SYSTEMS (The World)  | Indian Ragas & Talas · Arabic Maqam · Gamelan Slendro/Pelog   |
+---------------------------------------------------------------------------------------------------+
```

### Table of Contents

1. [Chapter 1: The First Principles of Music and Acoustic Sound](#1-the-first-principles-of-music-and-acoustic-sound)
2. [Chapter 2: Acoustic Wave Mechanics and the Harmonic Overtone Series](#2-acoustic-wave-mechanics-and-the-harmonic-overtone-series)
3. [Chapter 3: Intervals and Small-Integer Frequency Ratios](#3-intervals-and-small-integer-frequency-ratios)
4. [Chapter 4: The Temperament Dilemma: The Pythagorean Comma and 12-TET](#4-the-temperament-dilemma-the-pythagorean-comma-and-12-tet)
5. [Chapter 5: Rhythm, Metric Hierarchy, and Temporal Architecture](#5-rhythm-metric-hierarchy-and-temporal-architecture)
6. [Chapter 6: Melodic Contour, Voice Leading, and Phrase Structure](#6-melodic-contour-voice-leading-and-phrase-structure)
7. [Chapter 7: Functional Diatonic Harmony: Triads, Seventh Chords, and Cadences](#7-functional-diatonic-harmony-triads-seventh-chords-and-cadences)
8. [Chapter 8: Species Counterpoint and Polyphonic Voice Independence](#8-species-counterpoint-and-polyphonic-voice-independence)
9. [Chapter 9: Musical Texture: Monophony, Polyphony, and Homophony](#9-musical-texture-monophony-polyphony-and-homophony)
10. [Chapter 10: Architectural Forms: Binary, Ternary, Rondo, and Sonata-Allegro](#10-architectural-forms-binary-ternary-rondo-and-sonata-allegro)
11. [Chapter 11: Notation Systems and the Semiotics of the Western Score](#11-notation-systems-and-the-semiotics-of-the-western-score)
12. [Chapter 12: Timbre, Orchestration, and Instrument Acoustic Physics](#12-timbre-orchestration-and-instrument-acoustic-physics)
13. [Chapter 13: Global Non-Western Tuning and Rhythmic Paradigms](#13-global-non-western-tuning-and-rhythmic-paradigms)
14. [Chapter 14: Electroacoustic Sound, Synthesis, and Digital Audio Physics](#14-electroacoustic-sound-synthesis-and-digital-audio-physics)
15. [Chapter 15: Primary Musicological Repositories and Open Score Doors](#15-primary-musicological-repositories-and-open-score-doors)
16. [Chapter 16: Analytical Method: Step-by-Step Harmonic Analysis](#16-analytical-method-step-by-step-harmonic-analysis)

---

## 1. The First Principles of Music and Acoustic Sound

### 1.1 The Physical Nature of Sound
Sound is a mechanical disturbance propagating through an elastic medium (such as air) as a longitudinal pressure wave. Regions of compressed air molecules (**compressions**) alternate with regions of expanded air molecules (**rarefactions**).
- **Propagation Speed ($v$):** In dry air at $20^\circ\text{C}$, the speed of sound is approximately:
  $$v \approx 343\text{ m/s}$$
- **Wavelength ($\lambda$), Frequency ($f$), and Speed ($v$):**
  $$v = f \cdot \lambda$$
  where $f$ is measured in cycles per second (**Hertz**, $\text{Hz}$) and $\lambda$ is measured in meters.

### 1.2 The Four Psychoacoustic Parameters
Every musical event can be analyzed across four distinct perceptual dimensions that correspond directly to physical wave properties:

| Perceptual Parameter | Physical Correlate | Measurement Unit | Primary Governing Mechanism |
| :--- | :--- | :--- | :--- |
| **Pitch** | Fundamental Frequency ($f_0$) | Hertz ($\text{Hz}$) | Rate of periodic repetition of the waveform |
| **Loudness** | Sound Pressure Level (SPL) | Decibels ($\text{dB}$) | Amplitude of acoustic pressure deviations ($p$) |
| **Duration** | Temporal Duration | Seconds ($\text{s}$) / Beats | Time envelope and metric subdivision |
| **Timbre (Tone Color)** | Harmonic Spectrum & Formants | Spectral distribution | Relative amplitudes of harmonic overtones and ADSR envelope |

---

## 2. Acoustic Wave Mechanics and the Harmonic Overtone Series

### 2.1 Standing Waves in Resonators
When a stretched string or an air column vibrates, waves reflect back and forth between the fixed boundaries, interfering constructively to generate **standing waves**. The boundaries enforce boundary conditions:
- Stretched strings and open pipes enforce zero displacement (**nodes**) or maximum displacement (**antinodes**) at the ends.
- This mechanical constraint dictates that the resonator can vibrate steadily *only* at integer multiples of its fundamental resonant frequency $f_0$.

```
                        STANDING WAVE HARMONIC MODES
    Mode 1 (n = 1):  [Node]===================Antinode===================[Node]  (f0)
    Mode 2 (n = 2):  [Node]=========Antinode=========[Node]=========Antinode=========[Node]  (2*f0)
    Mode 3 (n = 3):  [Node]====Anti====[Node]====Anti====[Node]====Anti====[Node]  (3*f0)
```

### 2.2 The Harmonic Series
When an acoustic instrument plays a single note (e.g., $C_2 = 65.4\text{ Hz}$), it produces not a pure sinusoidal frequency, but a complex composite wave containing an entire ladder of integer harmonics:
$$f_n = n \cdot f_0, \quad \text{for } n = 1, 2, 3, 4, 5, \dots$$

```
                          THE HARMONIC OVERTONE LADDER
    Harmonic (n)   Frequency Ratio    Musical Interval from Root    Example (from C2)
    ---------------------------------------------------------------------------------
    n = 1          1 : 1              Fundamental (Unison)          C2  (65.4 Hz)
    n = 2          2 : 1              Octave                        C3  (130.8 Hz)
    n = 3          3 : 1              Octave + Perfect Fifth        G3  (196.2 Hz)
    n = 4          4 : 1              Two Octaves                   C4  (261.6 Hz)
    n = 5          5 : 1              Two Octaves + Major Third     E4  (327.0 Hz)
    n = 6          6 : 1              Two Octaves + Perfect Fifth   G4  (392.4 Hz)
    n = 7          7 : 1              Two Octaves + Harmonic 7th    Bb4 (approximate)
    n = 8          8 : 1              Three Octaves                 C5  (523.2 Hz)
```
The natural acoustic harmonic series embeds the major triad ($4 : 5 : 6 \rightarrow C : E : G$) directly inside physical law.

---

## 3. Intervals and Small-Integer Frequency Ratios

In the 6th century BCE, Pythagoras discovered that musical intervals sound harmonious and consonant to the human ear when their string lengths form simple, small-integer ratios:
- **Octave ($2 : 1$):** Doubling the frequency raises the pitch by exactly one octave. In human perception, notes separated by a factor of 2 share **octave equivalence** and are assigned the identical pitch class name.
- **Perfect Fifth ($3 : 2$):** The frequency of the 3rd harmonic divided by the 2nd harmonic:
  $$f_{\text{fifth}} = 1.5 \cdot f_{\text{root}}$$
- **Perfect Fourth ($4 : 3$):** The inversion of the fifth within an octave:
  $$\frac{2 / 1}{3 / 2} = \frac{4}{3} \approx 1.3333$$
- **Just Major Third ($5 : 4$):** Ratio $1.2500$.
- **Just Minor Third ($6 : 5$):** Ratio $1.2000$.

### Consonance, Dissonance, and Acoustic Roughness
Hermann von Helmholtz (*On the Sensations of Tone*, 1863) proved that musical **dissonance** is caused by rapid acoustic **beating** between overlapping upper partials. When two frequencies differ by $10$ to $40\text{ Hz}$, the human inner ear cannot resolve them into distinct pitches; they produce a harsh, sensory roughness perceived as dissonant. Small integer ratios align harmonic overtones so their partials coincide, minimizing auditory roughness and maximizing consonance.

---

## 4. The Temperament Dilemma: The Pythagorean Comma and 12-TET

### 4.1 The Pythagorean Comma
If one attempts to tune an instrument (like a piano or organ) by stacking twelve pure acoustic perfect fifths ($3 : 2$) up the scale, one should theoretically arrive back at the same note class as stacking seven pure octaves ($2 : 1$):
- Stacking twelve perfect fifths:
  $$\left(\frac{3}{2}\right)^{12} = \frac{531441}{4096} \approx 129.7463$$
- Stacking seven octaves:
  $$2^7 = 128.0000$$

The two numbers do not match! The mathematical discrepancy is the **Pythagorean Comma**:
$$\text{Comma} = \frac{(3/2)^{12}}{2^7} = \frac{531441}{524288} \approx 1.013643 \quad (\approx 23.46\text{ cents})$$
Because $3^{12} \neq 2^{19}$, it is mathematically impossible to construct a fixed-pitch scale where all octaves are pure ($2 : 1$) and all fifths are pure ($3 : 2$).

```
             THE PYTHAGOREAN CIRCLE GAP
     12 Pure Fifths: (3/2)^12 = 129.746  ─────────┐
                                                  ├──► GAP: 23.46 Cents (The Comma)
      7 Pure Octaves:    2^7  = 128.000  ─────────┘
```

### 4.2 Historical Solutions and 12-Tone Equal Temperament (12-TET)
- **Just Intonation:** Tunes all triads to pure integer ratios ($4:5:6$). Pure chords sound luminous, but modulating to distant keys produces unplayable, howling dissonances ("wolf intervals").
- **Meantone Temperament:** Narrows the fifths to preserve pure major thirds ($5:4$), common in Renaissance and early Baroque music.
- **12-Tone Equal Temperament (12-TET):** Solves the dilemma by distributing the Pythagorean comma equally across all twelve semitones in the octave. The mathematical semitone frequency ratio is the twelfth root of 2:
  $$r = 2^{1/12} = \sqrt[12]{2} \approx 1.059463094$$
- In 12-TET, every semitone is defined as exactly **100 cents** ($1\text{ octave} = 1200\text{ cents}$). An equal-tempered fifth ($700\text{ cents}$) is flattened by only $1.96\text{ cents}$ compared to a pure acoustic fifth ($701.96\text{ cents}$), a compromise the human ear readily tolerates in exchange for total freedom to modulate to any key.

---

## 5. Rhythm, Metric Hierarchy, and Temporal Architecture

Rhythm is the organization of musical duration and accent in time.
- **Pulse (Tactus):** The underlying, regular, isochronous beat that listeners tap their feet to.
- **Meter:** The periodic grouping of pulses into recurring metric units called **measures (bars)**, marked by hierarchical patterns of strong and weak accents:
  - *Duple Meter ($2/4$ or $4/4$):* Strong-weak or Strong-weak-Medium-weak.
  - *Triple Meter ($3/4$):* Strong-weak-weak (e.g., Minuet, Waltz).
  - *Compound Meter ($6/8, 9/8, 12/8$):* The beat is divided into three equal subdivisions rather than two.
- **Syncopation:** A deliberate metric displacement where an accent or articulation occurs on a normally weak beat or off-beat, creating dynamic rhythmic tension.
- **Polyrhythm:** The simultaneous sounding of two or more conflicting rhythmic subdivisions (e.g., $3 : 2$ "three against two", or $4 : 3$ "four against three").

---

## 6. Melodic Contour, Voice Leading, and Phrase Structure

### 6.1 Melodic Mechanics
A melody is a coherent linear succession of musical tones perceived as a singular aesthetic entity.
- **Conjunct Motion (Stepwise):** Moving by intervals of a second (smooth, vocal, connected).
- **Disjunct Motion (Leaps):** Moving by intervals of a third or larger.
- **Law of Recovery:** In classical melodic design, a large disjunct leap is followed by conjunct stepwise motion in the opposite direction (*post-leap reversal*), restoring equilibrium to the vocal contour.

### 6.2 Structural Period Design
Classical melodies are structured around linguistic-style symmetry:
- **The Antecedent-Consequent Period:**
  - *Antecedent Phrase (Question):* Typically 4 bars, terminating on a weak, unresolved **half cadence** (resting on the dominant V).
  - *Consequent Phrase (Answer):* 4 bars, beginning similarly to the antecedent but resolving definitively on an **authentic cadence** (resting on the tonic I).

---

## 7. Functional Diatonic Harmony: Triads, Seventh Chords, and Cadences

### 7.1 Diatonic Triad Construction
Building triads in thirds on the degrees of a major scale produces seven diatonic chords:

```
    DEGREE:      I         ii        iii       IV        V         vi        vii°
    NAME:      Tonic   Supertonic  Mediant  Subdominant Dominant Submediant Leading-Tone
    QUALITY:   Major     minor      minor     Major     Major    minor     diminished
    FUNCTION:  Home      Pre-Dom    Color    Pre-Dom    Tension   Color      Tension
```

### 7.2 The Tonal Syntax: T-PD-D-T
Western functional tonal harmony is driven by a syntactic gravitational pull:
$$\text{Tonic (I)} \longrightarrow \text{Pre-Dominant (IV or ii)} \longrightarrow \text{Dominant (V or } \text{V}^7) \longrightarrow \text{Tonic (I)}$$
- The dominant chord ($\text{V}$) contains the **leading tone** (7th scale degree, e.g., $B$ in $C$ major), which has an intense melodic tendency to resolve upward by semitone to the tonic ($C$).
- When an added minor 7th is placed on the dominant chord ($\text{V}^7$, e.g., $G-B-D-F$), an internal **tritone** interval ($B$ to $F$, $600\text{ cents}$) is formed. This unstable tritone resolves with immense acoustic satisfaction: $B$ steps up to $C$, while $F$ steps down to $E$, collapsing tension into the root tonic triad.

```
                  THE DOMINANT 7TH TRITONE RESOLUTION
                  F (4th scale degree)  ──────►  E (Steps down to 3rd)
                     \                 /
                      Tritone (600 cents)
                     /                 \
                  B (Leading tone)      ──────►  C (Steps up to Tonic root)
```

### 7.3 Canonical Cadences
- **Perfect Authentic Cadence (PAC):** $\text{V} \rightarrow \text{I}$ with both chords in root position and the tonic scale degree in the soprano voice. The strongest conclusive harmonic punctuation.
- **Half Cadence (HC):** Pauses on $\text{V}$, leaving the phrase unresolved.
- **Plagal Cadence:** $\text{IV} \rightarrow \text{I}$ ("Amen" cadence).
- **Deceptive Cadence:** $\text{V} \rightarrow \text{vi}$ (the dominant resolves unexpectedly to the submediant, thwarting resolution).

---

## 8. Species Counterpoint and Polyphonic Voice Independence

Counterpoint is the art of combining distinct, independent melodic lines into a coherent harmonic whole. Formulated systematically by Johann Joseph Fux in *Gradus ad Parnassum* (1725):

```
                   THE FIVE SPECIES OF COUNTERPOINT
    Species 1: Note-against-note (1:1)       Whole note against whole note
    Species 2: Two notes against one (2:1)   Two half notes against each whole note
    Species 3: Four notes against one (4:1)  Four quarter notes (passing & neighboring tones)
    Species 4: Suspensions (Syncopated)      Tied notes creating prepared dissonances
    Species 5: Florid Counterpoint           Free combination of all four previous species
```

### Core Voice-Leading Rules
1. **Motion Types:** Contrary motion (voices move in opposite directions) is preferred over similar or parallel motion because it maximally preserves the acoustic independence of the voices.
2. **Prohibition of Parallel Fifths and Octaves:** Two voices may never move from one perfect fifth to another perfect fifth, or from one perfect octave to another octave, by parallel motion. Parallel octaves destroy voice independence, causing the two voices to acoustically fuse into a single reinforced timbre.

---

## 9. Musical Texture: Monophony, Polyphony, and Homophony

- **Monophony:** A single melodic line sounded alone without harmonic accompaniment (e.g., Gregorian chant, solo flute).
- **Polyphony:** Two or more independent melodic lines occurring simultaneously, possessing equal rhythmic and melodic importance (e.g., Bach fugues, Renaissance motets by Palestrina).
- **Homophony:** A single dominant melodic line supported by chordal harmonic accompaniment moving in the same rhythm or supporting arpeggiation (e.g., Classical string quartets, modern popular songs).
- **Heterophony:** The simultaneous performance of different ornamental variations of the same underlying melody across multiple instruments (common in traditional East Asian, Irish, and Middle Eastern ensembles).

---

## 10. Architectural Forms: Binary, Ternary, Rondo, and Sonata-Allegro

Form is the macroscopic architecture of musical time, balancing unity (repetition) with variety (contrast).

```
                      MACROSCOPIC MUSICAL FORMS
    BINARY FORM (AB):           [ Section A (Tonic) ] ──► [ Section B (Dominant) ]
    TERNARY FORM (ABA):         [ A (Tonic) ] ──► [ B (Contrasting Key) ] ──► [ A (Tonic) ]
    RONDO FORM:                 [ A ] ──► [ B ] ──► [ A ] ──► [ C ] ──► [ A ]
```

### 10.1 Sonata-Allegro Form
The preeminent large-scale structural form of the Classical and Romantic eras (symphonies, sonatas, concertos):

```
                      THE SONATA-ALLEGRO ARCHITECTURE
    1. EXPOSITION (Introduces thematic material):
       - Primary Theme (Theme 1) in Tonic key
       - Modulating Transition (Bridge)
       - Secondary Theme (Theme 2) in Dominant / Relative Major
       - Closing Theme & Repeat
            │
            ▼
    2. DEVELOPMENT (Harmonic instability and transformation):
       - Fragmentation, sequence, and recombining of themes
       - Modulations through distant, volatile tonal regions
       - Retransition building pedal point on dominant
            │
            ▼
    3. RECAPITULATION (Tonal resolution):
       - Theme 1 returns in Tonic
       - Transition modified (does not modulate)
       - Theme 2 returns resolved in the TONIC key
       - Coda (Definitive structural conclusion)
```

---

## 11. Notation Systems and the Semiotics of the Western Score

The standard Western musical score provides a two-dimensional Cartesian graph: the horizontal axis represents chronological time; the vertical axis represents acoustic frequency.
- **Clefs:** Anchor specific pitches on the 5-line staff:
  - *Treble Clef (G-Clef):* Curls around $G_4$ ($392\text{ Hz}$).
  - *Bass Clef (F-Clef):* Two dots frame $F_3$ ($174.6\text{ Hz}$).
  - *C-Clefs (Alto / Tenor):* Center indentation designates Middle $C$ ($C_4 = 261.6\text{ Hz}$).
- **The Circle of Fifths:** A clockwise geometric progression by perfect fifths adding sharps ($F^\sharp, C^\sharp, G^\sharp, D^\sharp, A^\sharp, E^\sharp, B^\sharp$), or counter-clockwise by fourths adding flats ($B^\flat, E^\flat, A^\flat, D^\flat, G^\flat, C^\flat, F^\flat$).

---

## 12. Timbre, Orchestration, and Instrument Acoustic Physics

### 12.1 The Hornbostel-Sachs Taxonomic Classification
Instruments are categorized by the physical mechanism that initiates the acoustic vibration:
1. **Chordophones:** Sound produced by vibrating strings (violins, pianos, harps, guitars).
2. **Aerophones:** Sound produced by vibrating air columns (flutes, oboes, trumpets, pipe organs).
3. **Membranophones:** Sound produced by a tightly stretched vibrating membrane (timpani, snare drums).
4. **Idiophones:** Sound produced by the vibration of the instrument's own rigid resonant body (cymbals, xylophones, bells).
5. **Electrophones:** Sound generated primarily through electronic oscillation and amplified circuitry (analog synthesizers, digital samplers).

### 12.2 The Acoustic Envelope (ADSR)
The temporal evolution of an instrument's timbre is governed by its ADSR envelope:

```
          THE ATTACK-DECAY-SUSTAIN-RELEASE (ADSR) ENVELOPE
          Amplitude
             ^        /\  <-- Peak Attack Level
             |       /  \
             |      /    \______  <-- Sustain Level (Held)
             |     /            \
             |    /              \
             +---+----+---------+----+---> Time
                 | A  | D|   S   | R |
                 Attack  Decay  Sustain Release
```

---

## 13. Global Non-Western Tuning and Rhythmic Paradigms

- **Indian Classical Music:** Governed by **Raga** (a nuanced modal framework embodying specific melodic ascending/descending contours, microtonal inflections termed *shrutis*, and emotional moods) and **Tala** (metric rhythmic cycles, such as the 16-beat *Tintal*, counted by claps and wave gestures).
- **Arabic Maqam System:** Built upon modal scales employing microtonal quarter-tones and three-to-four note scalar cells (**jins**).
- **Indonesian Gamelan:** Employs non-Western equidistant scale temperaments: **Slendro** (a five-tone scale dividing the octave into roughly five equal steps) and **Pelog** (a seven-tone scale with unequal intervals), combined in intricate, stratified polyphonic layers (*colotomic meter*).

---

## 14. Electroacoustic Sound, Synthesis, and Digital Audio Physics

- **Subtractive Synthesis:** Starts with harmonically rich waveforms (sawtooth, square, triangle waves generated by voltage-controlled oscillators) and carves away frequencies using low-pass, high-pass, or band-pass filters.
- **The Nyquist-Shannon Sampling Theorem:** To digitally reconstruct an analog acoustic wave without aliasing distortion, the digital sampling rate $f_s$ must be at least twice the highest frequency present in the signal:
  $$f_s \ge 2 \cdot f_{\max}$$
  Since human hearing extends to approximately $20\text{ kHz}$, standard CD audio specifies a sampling rate of $44.1\text{ kHz}$ ($> 2 \times 20\text{ kHz}$).
- **Bit Depth and Dynamic Range:** The resolution of each audio sample. Each bit of quantization precision yields approximately $6.02\text{ dB}$ of dynamic range:
  $$\text{Dynamic Range} \approx 6.02 \times N\text{ dB}$$
  A 16-bit digital audio system achieves $\approx 96.3\text{ dB}$ of signal-to-noise dynamic range.

---

## 15. Primary Musicological Repositories and Open Score Doors

Rigorous musicological analysis requires consulting uncompressed scores and historical treatises:

| Repository / Project | Organization / Host | Holdings & Collections |
| :--- | :--- | :--- |
| **IMSLP (Petrucci Music Library)** | [IMSLP.org](https://imslp.org/) | Over 700,000 public domain musical scores and historical parts |
| **Open Music Theory (OMT)** | [OpenMusicTheory.com](https://openmusictheory.com/) | Peer-reviewed, open-source undergraduate music theory curriculum |
| **ISO 16 Acoustic Standard** | [ISO.org](https://www.iso.org/standard/3601.html) | International standard reference pitch ($A_4 = 440.0\text{ Hz}$) |
| **MusicBrainz** | [MusicBrainz.org](https://musicbrainz.org/) | Open encyclopedia of music metadata, discography, and recordings |
| **Choral Public Domain Library (CPDL)** | [CPDL.org](https://www.cpdl.org/) | Thousands of free choral and vocal scores in modern notation |

---

## 16. Analytical Method: Step-by-Step Harmonic Analysis

When performing Roman numeral analysis on a classical score excerpt, execute this rigorous protocol:

```
+---------------------------------------------------------------------------------------------------+
|                            HARMONIC ANALYSIS PROTOCOL                                             |
+---------------------------------------------------------------------------------------------------+
| 1. IDENTIFY KEY & TONIC CENTER     | Check key signature and cadential landing points             |
| 2. ISOLATE BASS NOTE & INVERSION   | Note bass pitch: root, 3rd (6), 5th (6/4), or 7th (4/2)      |
| 3. ASSEMBLE PITCH COLLECTION       | Stack notes into thirds to identify underlying chord quality  |
| 4. DETECT NON-CHORD TONES (NCTs)   | Identify passing tones, neighbor tones, suspensions, escapes |
| 5. ASSIGN ROMAN NUMERAL & FUNCTION | Determine syntax: Tonic (I), Pre-Dominant (IV/ii), Dominant (V)|
| 6. EVALUATE CADENCE TYPE           | Classify termination: PAC, IAC, HC, or Deceptive             |
+---------------------------------------------------------------------------------------------------+
```

### Worked Analytical Check: Bach Chorale Excerpt
**Measure:** Final cadence in $G$ Major. Bass sings $D_3$, Soprano sings $F^\sharp_4$, Tenor sings $A_3$, Alto sings $C_4$. This is immediately followed by Bass $G_2$, Soprano $G_4$, Tenor $B_3$, Alto $D_4$.
1. **Chord 1:** Pitches are $D-F^\sharp-A-C$. Stacked in thirds: root $D$, major 3rd $F^\sharp$, perfect 5th $A$, minor 7th $C$. This is a dominant 7th chord. Bass has the root $D$. Roman numeral: $\text{V}^7$.
2. **Chord 2:** Pitches are $G-B-D-G$. Stacked in thirds: root $G$, major 3rd $B$, perfect 5th $D$. Bass has the root $G$. Soprano ends on the tonic $G$. Roman numeral: $\text{I}$.
3. **Cadence:** $\text{V}^7 \rightarrow \text{I}$ in root position with tonic in the soprano voice. Classification: **Perfect Authentic Cadence (PAC)**.

---

## Close & Archival Citation

Music is the architecture of acoustic time. By bridging mathematical ratios, vibrational physics, and structural form, music theory unlocks the deep order underlying human auditory expression.

```
CITE: stacks/music/TEXTBOOK.md
AUTHORITY: The Stacks Copyleft Academic Repositories
LICENSING: GNU AGPL-3.0-or-later & The Open Covenant
```
