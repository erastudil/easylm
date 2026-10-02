---
title: "probability — a chance as a share"
date: "2026-09-20"
status: draft
start: algebra
needs: ["algebra", "data"]
home: "drafts/agy-review/packs/probability/"
---

# A chance as a share

You can already put a letter in a sentence and unwrap it. You can already read a table of rows. This book walks one object: a chance as a share. Write the share before you look. Put the letter on a number that has not arrived yet. Update the share when a new fact walks in. Then hold that share next to a sample.

Tables of people, and how a sample sits in a pile, live in the data pack. This book names that door and stops. The long school walks live at OpenStax *Introductory Statistics 2e* and *Introductory Business Statistics 2e*. Author names, ISBNs, and update dates on those details pages are unverified here. Open the doors. A leftover doubt on a measured number lives at NIST. Do not finish an uncertainty formula from memory.


---

## 1. A chance as a share

A jar on a stall holds 14 tokens. Five are stamped. You will draw one token without looking.

The stamped pile is 5. The whole jar is 14. The stamped share is $\frac{5}{14}$.

If every token is as easy to draw as every other token, that share is the chance you draw a stamped one. People name that share a **probability**.

Write it as a fraction, or as a decimal, or per hundred. $\frac{5}{14}$ is the same amount as $0.357$ to three places, which is about $35.7\%$. The fraction is the honest form. The decimal is a rounding.

A chance sits between 0 and 1, including the ends. 0 means the jar has no stamped token, so a stamped draw cannot happen. 1 means every token is stamped, so a stamped draw cannot fail. A share bigger than 1 is not a chance. A share less than 0 is not a chance. If you ever write $1.2$ for a chance, the whole was named wrong.

The letter $p$ is a box for that share, the same way algebra gave you a box for an unknown. $p = \frac{5}{14}$ is a filled box. Until you count the jar, $p$ can wait.

Two stories that look different can name the same share. "5 stamped of 14" is a count of a known jar. "If I could draw from this jar over and over, putting the token back each time, about 5 of every 14 draws would be stamped" is the same share told as a long run. Both are legal. The jar you can count is the cleaner start. The long run is a picture of what the share does if the tries do not change the jar.

A draw that does not put the token back does change the jar. After a stamped draw, 4 stamped remain in 13. The next chance is $\frac{4}{13}$, not $\frac{5}{14}$. Say whether the token went back.

OpenStax *Introductory Statistics 2e* is the long walk on this share. The details page is the door.

**Check.** A new jar: 18 mugs, 3 cracked. One draw, every mug as easy as every other mug. Chance of cracked is $\frac{3}{18} = \frac{1}{6}$. A second new case: 11 jars, 0 sealed. Chance of sealed is $\frac{0}{11} = 0$. A third: 11 jars, 11 sealed. Chance of sealed is $1$. If someone says "3 cracked mugs" and hides the 18, you do not yet have a chance. You have a 3.

---

## 2. And, or, not

Eight ferries sit at a dock. Five carry oars. Three carry a lamp. Two of those eight carry both oars and a lamp.

Pick one ferry without looking. Ask three questions.

Both oars and a lamp: 2 of 8. The chance is $\frac{2}{8} = \frac{1}{4}$. **And** means the ferry sits in both groups at once.

Oars, or a lamp, or both: start with $5 + 3 = 8$, then take off the 2 that were counted twice. $8 - 2 = 6$ ferries. The chance is $\frac{6}{8} = \frac{3}{4}$. **Or** here means at least one of the two. If you add 5 and 3 and stop, you have counted the two double-ferries twice.

Not oars: $8 - 5 = 3$ ferries. The chance is $\frac{3}{8}$. **Not** means the rest of the pile. The oars share and the not-oars share add to 1, because $\frac{5}{8} + \frac{3}{8} = 1$.

Write the same three moves with a letter. Let $A$ be "has oars" and $B$ be "has a lamp." Then $P(A) = \frac{5}{8}$, $P(B) = \frac{3}{8}$, and $P(A\text{ and }B) = \frac{2}{8}$.

$$P(A\text{ or }B) = P(A) + P(B) - P(A\text{ and }B) = \frac{5}{8} + \frac{3}{8} - \frac{2}{8} = \frac{6}{8}$$

$$P(\text{not }A) = 1 - P(A) = 1 - \frac{5}{8} = \frac{3}{8}$$

Neither oars nor lamp: $8 - 6 = 2$ ferries, chance $\frac{2}{8} = \frac{1}{4}$. That is $1 - P(A\text{ or }B)$.

If the two groups cannot sit on the same ferry, and is already 0, and or is just the sum. Five ferries with oars and three with lamps, and no ferry with both, would make $P(A\text{ or }B) = \frac{5}{8} + \frac{3}{8} = 1$. The whole dock would be one or the other.

A share for and cannot beat the smaller of the two shares. You cannot have 2 "both" ferries if only 3 have lamps. If a poster writes $P(A\text{ and }B) = 0.9$ while $P(B) = 0.2$, the poster is broken.

**Check.** A new rail: 25 jackets. 12 red. 8 torn. 3 red and torn. Chance of red and torn: $\frac{3}{25}$. Chance of red or torn: $\frac{12 + 8 - 3}{25} = \frac{17}{25}$. Chance of not red: $\frac{13}{25}$. Chance of neither red nor torn: $\frac{25 - 17}{25} = \frac{8}{25}$. A second new case: 20 trays, 9 glazed, 6 chipped, 0 both. Chance of glazed or chipped is $\frac{9}{20} + \frac{6}{20} = \frac{15}{20} = \frac{3}{4}$, because and is already 0.

---

## 3. Given that

You already know the ferry has oars. What is the chance it also has a lamp?

The whole dock is no longer 8. The world you are in is the 5 ferries with oars. Among those 5, 2 have a lamp. The chance is $\frac{2}{5}$.

The same question the other way: you already know the ferry has a lamp. Among the 3 lamp ferries, 2 have oars. The chance is $\frac{2}{3}$.

Knowing a fact can change the share. People name the new share a **conditional probability**. "Given that" is the English. The written form is $P(B\text{ given }A)$, or $P(B \mid A)$.

$$P(B \mid A) = \frac{P(A\text{ and }B)}{P(A)} = \frac{2/8}{5/8} = \frac{2}{5}$$

$$P(A \mid B) = \frac{P(A\text{ and }B)}{P(B)} = \frac{2/8}{3/8} = \frac{2}{3}$$

The two given-thats are not the same number. The and-share in the top is the same. The bottom is whichever group you were told you are in. Divide only when that bottom is not 0. If no ferry has a lamp, "given a lamp" has no meaning.

A new pile, so the arithmetic is not the dock again. 30 envelopes. 12 stamped. 8 blue. 5 stamped and blue.

|  | blue | not blue | total |
|---|---:|---:|---:|
| stamped | 5 | 7 | 12 |
| not stamped | 3 | 15 | 18 |
| total | 8 | 22 | 30 |

Given stamped, blue is $\frac{5}{12}$. Given blue, stamped is $\frac{5}{8}$. Unconditional blue is $\frac{8}{30} = \frac{4}{15}$. Stamped changed the blue chance, so stamped and blue are not independent. Chapter 8 takes the case where a fact does not change the share.

The table is a teaching grid of four counts that add to 30. How a survey sample sits in a town is the data pack. Name that door and stop.

**Check.** A new kiln: 40 trays. 14 glazed. 11 chipped. 9 glazed and chipped. Given glazed, chipped is $\frac{9}{14}$. Given chipped, glazed is $\frac{9}{11}$. Unconditional chipped is $\frac{11}{40}$. A second new case: 16 cards in a box, 4 marked, 8 thick, 2 marked and thick. Given marked, thick is $\frac{2}{4} = \frac{1}{2}$. Unconditional thick is $\frac{8}{16} = \frac{1}{2}$. Marked did not change the thick chance. That pair is waiting for chapter 8.

---

## 4. Updating a guess

A thousand crates sit in a warehouse. Forty of them are damp. A sniff test flags 36 of those 40 damp crates. It also flags 96 of the 960 dry crates.

Before any sniff, the chance a random crate is damp is $\frac{40}{1000} = \frac{1}{25}$. That is the guess you walk in with.

A crate gets flagged. The world you are in is now the flagged pile. Flagged damp: 36. Flagged dry: 96. Flagged in all: $36 + 96 = 132$. Given a flag, the chance the crate is damp is $\frac{36}{132} = \frac{3}{11}$.

The guess moved from $\frac{1}{25}$ to $\frac{3}{11}$. $\frac{1}{25} = 0.04$. $\frac{3}{11} \approx 0.273$. The flag was evidence. It did not make damp certain. Most flagged crates are still dry, because dry crates are common and the test flags some of them.

Write the same walk with letters. Let $D$ be damp and $F$ be flagged.

$$P(D \mid F) = \frac{P(F \mid D)\,P(D)}{P(F)}$$

$P(F \mid D) = \frac{36}{40} = \frac{9}{10}$. $P(D) = \frac{40}{1000}$. $P(F) = \frac{132}{1000}$. Then

$$\frac{(9/10) \times (40/1000)}{132/1000} = \frac{36/1000}{132/1000} = \frac{36}{132} = \frac{3}{11}$$

The top is flagged-and-damp. The bottom is flagged. That is chapter 3 again, with the first guess written in the product. People name this update **Bayes' rule**. The name arrives after the crate count.

A test can be strong on damp crates and still leave you unsure, if damp crates are rare. The 96 dry flags outnumber the 36 true flags. Count both.

A crate that is not flagged: unflagged damp is $40 - 36 = 4$. Unflagged dry is $960 - 96 = 864$. Unflagged in all is 868. Given no flag, damp is $\frac{4}{868} = \frac{1}{217}$. The guess fell.

**Check.** A new shed: 200 lamps. 10 broken. A beep catches 8 of the 10 broken lamps, and beeps on 18 of the 190 working lamps. Beeps in all: $8 + 18 = 26$. Given a beep, broken is $\frac{8}{26} = \frac{4}{13}$. The walk-in guess was $\frac{10}{200} = \frac{1}{20}$. The beep raised the guess. A second new case: 500 tiles, 20 cracked. A tap catches 16 of 20 cracked, and taps 24 of 480 whole. Taps in all: 40. Given a tap, cracked is $\frac{16}{40} = \frac{2}{5}$. Walk-in guess $\frac{20}{500} = \frac{1}{25}$. Same move, new counts.

---

## 5. A number that waits

A hopper has not dumped yet. When it dumps, the count of bolts will be 0, 1, or 3. Half the dumps are 0. One third are 1. One sixth are 3.

$$\frac{1}{2} + \frac{1}{3} + \frac{1}{6} = \frac{3}{6} + \frac{2}{6} + \frac{1}{6} = 1$$

The shares fill the whole. One dump will be exactly one of those three counts.

You do not have the count yet. You still need a letter for it, the same way algebra gave you a letter for a bag of apples. Call the waiting count $X$. Algebra's letter was a blank you planned to fill. This letter is a blank the hopper will fill. People name a number that waits on a chance a **random variable**.

$X$ can be 0, 1, or 3. Those are the values. Next to each value sits its share:

| $X$ | share |
|---:|---:|
| 0 | $\frac{1}{2}$ |
| 1 | $\frac{1}{3}$ |
| 3 | $\frac{1}{6}$ |

$P(X = 0) = \frac{1}{2}$. $P(X = 1) = \frac{1}{3}$. $P(X = 3) = \frac{1}{6}$. $P(X = 2) = 0$, because 2 is not a dump this hopper makes. $P(X \ge 1) = P(X = 1) + P(X = 3) = \frac{1}{3} + \frac{1}{6} = \frac{1}{2}$.

The letter is not a secret extra number. It is a name for whichever dump arrives. After the dump, $X$ is an ordinary count and the chance walk is over.

A waiting number can be a yes-or-no coded as 1 and 0. Draw one token from the 14-token jar. Let $Y = 1$ if the token is stamped, $Y = 0$ if not. Then $P(Y = 1) = \frac{5}{14}$ and $P(Y = 0) = \frac{9}{14}$. Chapter 1's share is this waiting number with two values.

**Check.** A new hopper dumps 2 bolts with share $\frac{3}{4}$, or 6 bolts with share $\frac{1}{4}$. The waiting number $W$ has two values. $P(W = 2) = \frac{3}{4}$. $P(W = 6) = \frac{1}{4}$. $P(W = 4) = 0$. $P(W > 2) = \frac{1}{4}$. Shares add: $\frac{3}{4} + \frac{1}{4} = 1$. A second new case: a stall prints a ticket 1, 4, or 5 with shares $\frac{1}{2}$, $\frac{1}{4}$, $\frac{1}{4}$. $P(\text{ticket } = 4\text{ or }5) = \frac{1}{2}$.

---

## 6. What you expect

That hopper will dump a count. You cannot name the count yet. You can still name a fair price for one dump if you will face this hopper many times.

Half the dumps give 0. One third give 1. One sixth give 3. The long-run mix is

$$0 \times \frac{1}{2} + 1 \times \frac{1}{3} + 3 \times \frac{1}{6} = 0 + \frac{1}{3} + \frac{1}{2} = \frac{5}{6}$$

If each dump is a bolt you receive, $\frac{5}{6}$ of a bolt is the fair price of one dump. Pay $\frac{5}{6}$ each time, play many times, and the pile of payments and the pile of dumps meet. Pay 1 each time and you lose $\frac{1}{6}$ per dump in the long run.

People name that weighted mix the **expected value**. Write $E(X)$ for it.

$$E(X) = \sum x\,P(X = x)$$

The sum walks the values. Each value is multiplied by its share. It is algebra's multiply and numeracy's share, lined up.

The expected value does not have to be a dump the hopper can make. $\frac{5}{6}$ is not 0, 1, or 3. It is a mix. A single dump will still be 0, 1, or 3. The $\frac{5}{6}$ is about the long run, or about a fair price, not about what the next dump "should look like."

A yes-or-no waiting number has a short mix. $Y = 1$ with share $p$, and $Y = 0$ with share $1 - p$. Then $E(Y) = 1 \times p + 0 \times (1 - p) = p$. The expected value of a 0-or-1 is the chance of 1. Chapter 1's share and this chapter's mix are the same number in that case.

If every dump is the same number, the expected value is that number. A hopper that always dumps 4 has $E = 4$. There is nothing to mix.

**Check.** A stall prize is 0 with share $\frac{3}{5}$, or 10 with share $\frac{2}{5}$. Expected prize: $0 \times \frac{3}{5} + 10 \times \frac{2}{5} = 4$. Pay 4, fair. Pay 5, long-run loss 1 per play. A second new case: a ticket pays 1, 1, 1, or 9, each with share $\frac{1}{4}$. Expected pay: $\frac{1 + 1 + 1 + 9}{4} = 3$. The 9 is in the mix. A single ticket is still 1 or 9.

---

## 7. Spread of chance

Two hoppers both have a fair price of 4 bolts. Hopper A always dumps 4. Hopper B dumps 0 half the time and 8 half the time.

$$E(A) = 4$$

$$E(B) = 0 \times \frac{1}{2} + 8 \times \frac{1}{2} = 4$$

The fair prices match. The dumps do not. Every dump from A sits on 4. A dump from B sits 4 bolts away from 4, one way or the other.

Distance from the expected value is the first picture of spread. For B, the two distances are $0 - 4 = -4$ and $8 - 4 = 4$. Signs cancel if you add those raw distances with equal shares: $-4 \times \frac{1}{2} + 4 \times \frac{1}{2} = 0$. Spread would look like none. Square the distances first so both ways count: $(-4)^2 = 16$ and $4^2 = 16$. The mean square is 16.

People name that mean square the **variance**. The square root puts the spread back in bolt units. $\sqrt{16} = 4$. People name that root the **standard deviation**. Hopper A has variance 0 and standard deviation 0. Hopper B has variance 16 and standard deviation 4.

For a waiting number $X$ with expected value $\mu = E(X)$,

$$\mathrm{Var}(X) = E\!\left((X - \mu)^2\right)$$

The standard deviation is $\sqrt{\mathrm{Var}(X)}$. NIST owns leftover doubt on a measured number, which is a cousin question about spread after an instrument has spoken. Fetch NIST. Do not finish a coverage-factor formula from memory. This chapter is the spread of a waiting number before the dump.

Same expected value, different spread, is a different stall. A prize that is always 4 is not a prize that is 0 or 8. If you cannot afford an 0, hopper B is the wrong hopper even though the fair prices match.

**Check.** A new hopper dumps 2, 2, 8, or 8, each with share $\frac{1}{4}$. Expected dump: $\frac{2+2+8+8}{4} = 5$. Distances from 5: $-3, -3, 3, 3$. Squares: 9, 9, 9, 9. Variance 9. Standard deviation 3. A second new case: dumps 0, 6, 6, each with share $\frac{1}{3}$. Expected dump: $\frac{0+6+6}{3} = 4$. Distances: $-4, 2, 2$. Squares: 16, 4, 4. Variance $\frac{16+4+4}{3} = 8$. Standard deviation $\sqrt{8}$. Not 0. The 0-dump is the wide step.

---

## 8. Independent repeats

A radio beeps on a try with chance 1 in 4, and one try does not change the next.

Two tries. Chance the first beeps: $\frac{1}{4}$. Chance the second beeps, even after you heard the first: still $\frac{1}{4}$. The second try does not read the first. People name tries like that **independent**.

Chance both beep: $\frac{1}{4} \times \frac{1}{4} = \frac{1}{16}$. Chance neither beeps: $\frac{3}{4} \times \frac{3}{4} = \frac{9}{16}$. Chance the first beeps and the second does not: $\frac{1}{4} \times \frac{3}{4} = \frac{3}{16}$. The four and-shares add to 1:

$$\frac{1}{16} + \frac{3}{16} + \frac{3}{16} + \frac{9}{16} = 1$$

If tries are independent, and is the product. Chapter 3's given-that then does not move the share: $P(\text{second beeps} \mid \text{first beeped}) = P(\text{second beeps})$. The thick-card case at the end of chapter 3 was this fact in a table.

Now three independent kiln firings. Each tile cracks with chance $\frac{1}{5}$. Chance of exactly one crack.

The crack can sit in firing 1, or 2, or 3. Three patterns: CNN, NCN, NNC. One pattern, CNN, has share

$$\frac{1}{5} \times \frac{4}{5} \times \frac{4}{5} = \frac{16}{125}$$

Each of the three patterns has that same share, because the product does not care about order when the shares match. Three patterns: $\frac{48}{125}$.

Chance of no crack: $\left(\frac{4}{5}\right)^3 = \frac{64}{125}$. Chance of three cracks: $\left(\frac{1}{5}\right)^3 = \frac{1}{125}$.

The count of cracks among a fixed number of independent same-chance tries is a waiting number. People name that waiting number a **binomial** count. The ingredients are: how many tries, the chance of a hit on one try, and how many hits you asked about. List the patterns when the numbers are small. A later combinatorics walk counts the patterns without listing. This pack lists.

Putting a token back in the jar, or drawing from a huge jar, is how you keep the chance still from try to try. Drawing without putting back is a different walk. The shares then change, as in chapter 1.

**Check.** Four independent radio tries, beep chance $\frac{1}{3}$. Chance of exactly two beeps. Beeps in positions (1,2), (1,3), (1,4), (2,3), (2,4), (3,4). Six patterns. One pattern has share $\left(\frac{1}{3}\right)^2\left(\frac{2}{3}\right)^2 = \frac{4}{81}$. Six of those: $\frac{24}{81} = \frac{8}{27}$. A second new case: two independent draws with a token put back, stamped chance $\frac{5}{14}$. Chance both stamped: $\frac{5}{14} \times \frac{5}{14} = \frac{25}{196}$. Chance first stamped and second not: $\frac{5}{14} \times \frac{9}{14} = \frac{45}{196}$.

---

## 9. A shape of chance

Write every possible dump next to its share. The shares add to 1. That list is the shape of the waiting number.

The hopper from chapter 5 has shape 0 with $\frac{1}{2}$, 1 with $\frac{1}{3}$, 3 with $\frac{1}{6}$. Most of the mass sits on 0. A little sits on 3. The shape is lopsided.

Two independent radio tries, beep chance $\frac{1}{2}$. Let $K$ be the number of beeps. Then $K$ is 0, 1, or 2.

| $K$ | share |
|---:|---:|
| 0 | $\frac{1}{4}$ |
| 1 | $\frac{1}{2}$ |
| 2 | $\frac{1}{4}$ |

More mass sits in the middle than on either end. That is already a small mound.

Change the beep chance to $\frac{1}{5}$. Two tries. $K = 0$ has share $\left(\frac{4}{5}\right)^2 = \frac{16}{25}$. $K = 1$ has share $2 \times \frac{1}{5} \times \frac{4}{5} = \frac{8}{25}$. $K = 2$ has share $\frac{1}{25}$. Most mass sits on 0. The mound leans toward the end that the single-try chance named.

Add more independent same-chance 0-or-1 tries and the count of hits still has a shape. For many tries the mass heaps near the expected count and thins toward the far counts. People name one famous heap a **normal** shape. The exact shares for that heap, and how much mass sits one or two spread-steps from the middle, live on the OpenStax statistics doors. Those percents are unverified here. Do not finish a 68-or-95 line from memory.

A shape is not a sample. A shape is the list you write before you look. Twenty dumps from hopper B in chapter 7 will not print 0, 8, 0, 8 in a pretty rhythm. They will print some mix whose long-run shares walk toward $\frac{1}{2}$ and $\frac{1}{2}$. The data pack owns the table of those twenty rows. This chapter owns the list of shares that the twenty rows are trying to look like.

Expected value is a pin in the shape. Spread is how wide the shape sits around that pin. Two shapes can share a pin and not share a width, as in chapter 7.

**Check.** Three independent kiln firings, crack chance $\frac{1}{5}$. Let $C$ be the crack count. $P(C = 0) = \frac{64}{125}$. $P(C = 1) = \frac{48}{125}$. $P(C = 2) = 3 \times \left(\frac{1}{5}\right)^2\left(\frac{4}{5}\right) = \frac{12}{125}$. $P(C = 3) = \frac{1}{125}$. Sum: $\frac{64+48+12+1}{125} = 1$. The shape leans toward 0. A second new case: one dump that is 4 with share 1. The shape is a single spike. Expected value 4. Spread 0.

---

## 10. A check against a sample

A chance share is a number you write before you look. A sample share is a number you write after you look at some rows.

A ferry office says a run is late with chance $\frac{1}{10}$. You watch 50 runs. Fourteen are late. The sample share is $\frac{14}{50} = \frac{7}{25} = 0.28$. The model share is $0.10$. The expected late count in 50 independent runs is $50 \times \frac{1}{10} = 5$. You saw 14.

Write both shares. Write the count you expected and the count you saw. The sample fights the model, or the 50 runs were not the kind of run the office meant. A storm week is a different jar. Who was easy to catch, and how a sample sits in a pile, live in the data pack. Name that door and stop.

A second model. A jar says stamped with chance $\frac{1}{4}$. You draw 40 times, putting the token back. Eleven stamped. Sample share $\frac{11}{40} = 0.275$. Model share $0.25$. Expected stamped count $40 \times \frac{1}{4} = 10$. You saw 11. Close. A fight this small can be ordinary spread from chapter 7. Do not promote it into a claim that the jar was wrong.

The close is a habit. Name the chance model, including whether tries are independent. Name the sample count and the sample whole. Convert both to shares. Convert the model to an expected count. If the two shares sit far apart, ask whether the sample was drawn from the jar the model named. If you cannot name the jar, you cannot finish the fight.

A national typical income is not a chance share. On 15 September 2026 the Census Bureau announced that median household income was 87,460 dollars in 2025. That line lives on the Census homepage and on the income press-release door. It is a typical value from a survey. The data pack owns that table. This book names that door and stops. A chance model of household income would be a shape from chapter 9. Checking that shape against Census rows is a later statistics walk on the OpenStax doors.

NIST is the door when the number came from an instrument and you need the leftover doubt named. The chance walks in this book do not replace that door.

OpenStax *Introductory Statistics 2e* and *Introductory Business Statistics 2e* are the next long walks. Census is the sample door for people and money in the United States. The data pack is the table door. This pack is the chance-as-a-share door.

**Check.** A new model: each crate is chipped with chance $\frac{1}{5}$. Sample of 25 crates, 12 chipped. Sample share $\frac{12}{25} = 0.48$. Model share $0.20$. Expected chipped count $25 \times \frac{1}{5} = 5$. You saw 12. Far. Ask whether those 25 were independent draws from the jar the model named. A second new case: beep chance $\frac{1}{3}$, 12 independent tries, 3 beeps. Sample share $\frac{3}{12} = \frac{1}{4}$. Model share $\frac{1}{3}$. Expected beeps 4. You saw 3. Close enough to keep the model until a larger watch, or until you learn the tries were not independent.

