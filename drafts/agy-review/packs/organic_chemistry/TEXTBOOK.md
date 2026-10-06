---
title: "organic_chemistry — carbon chains, groups, a rewrite"
date: "2026-09-20"
status: draft
start: algebra
needs: algebra
home: "drafts/agy-review/packs/organic_chemistry/"
---

# Carbon chains, groups, a rewrite

Algebra taught you to unwrap a sentence and put a fill back in. This book is the next act: a chain of carbons, a group on that chain that does a job, and a rewrite that turns one molecule into another.

The living chemistry pack at `stacks/chemistry/` is the survey of atoms, moles, and the big table of elements. This pack names that door and stops. The walks here are carbon-chain walks.

OpenStax keeps an organic chemistry textbook. The details page is the long-course door. Authors, ISBN, and edition dates are unverified here. NIST Chemistry WebBook is the door for a compound spectrum and a compound heat. PubChem is the NIH compound door. A recorded formula, an identifier, a boiling point: fetch the compound page, or write unverified. IUPAC is the International Union of Pure and Applied Chemistry. A name that must travel goes to that union, or the line says unverified.

This book is public general education.

---

## 1. Carbon chains

Lila has a bottle of lamp oil. The oil is not one long mystery. It is a crowd of small sticks. Each stick is carbons holding to carbons, with hydrogens filling the leftover holds.

A carbon in this book has four holds. A hydrogen has one. Oxygen has two. Nitrogen has three. Those holds are the working rules of these chapters, not a NIST measurement. A number that must travel as a measured length, a mass, or a spectrum peak goes to NIST WebBook or PubChem, or the line says unverified.

One carbon with four hydrogens is the smallest stick: $\mathrm{CH}_4$. Two carbons sharing one hold, each with three hydrogens, is $\mathrm{C}_2\mathrm{H}_6$. Three carbons in a row is $\mathrm{C}_3\mathrm{H}_8$.

A longer straight stick follows a count you can finish with a letter. Let $n$ be the number of carbons in a chain that uses only single holds, no loops. Each carbon wants 4 holds. The chain uses $2(n-1)$ of those holds to join carbon to carbon, because each join spends one hold on each of two carbons. Hydrogens take the rest:

$$4n - 2(n-1) = 2n + 2$$

So the formula is $\mathrm{C}_n\mathrm{H}_{2n+2}$. Fill $n = 8$: hydrogens $2 \times 8 + 2 = 18$. The stick is $\mathrm{C}_8\mathrm{H}_{18}$. Fill $n = 11$: hydrogens $2 \times 11 + 2 = 24$. The stick is $\mathrm{C}_{11}\mathrm{H}_{24}$. Put the fills back. The same rule wrote both.

A branch does not change that count. Eight carbons as a straight stick, or seven in a row with one carbon stuck to the side, both have 18 hydrogens if every hold is a single hold and there is no loop. Same pile of atoms. Different wiring. Two different objects can share a formula.

A chain with only those single holds is an **alkane**. The name can wait until the count is in your hand. The object is the stick of carbons.

**Check.** A new fill: $n = 9$. Hydrogens $2 \times 9 + 2 = 20$. Formula $\mathrm{C}_9\mathrm{H}_{20}$. A second new stick: $n = 4$. Hydrogens $8 + 2 = 10$. Formula $\mathrm{C}_4\mathrm{H}_{10}$. A third: a straight stick of 7 carbons and a branched stick of 7 carbons, both single holds, no loop. Both are $\mathrm{C}_7\mathrm{H}_{16}$. If you wrote $\mathrm{C}_7\mathrm{H}_{18}$ for either, you counted a chain as if it had two extra hydrogens that the four-hold rule does not give.

A recorded formula on a bottle is a PubChem fetch, not a memory. The count above is the four-hold rule on paper.

---

## 2. A group that does work

Omar's five-carbon stick is not only carbons and hydrogens. One hydrogen is gone. In its place sits $\mathrm{OH}$: oxygen holding the carbon, hydrogen holding the oxygen.

That $\mathrm{OH}$ is a small tool bolted onto the stick. The stick is still five carbons. The tool is what water, acid, and a rewrite will notice first. A cluster of atoms that does a job like that is a **functional group**. The ordinary sentence is: a group that does work.

Swap the tool, keep the five carbons, and you have a different object.

- $\mathrm{OH}$ on the chain: an **alcohol**.
- $\mathrm{C{=}O}$ with two carbons beside the carbon of that double hold: a **ketone**.
- $\mathrm{COOH}$ at the end: a **carboxylic acid**. The carbon of that group holds a double-held oxygen and an $\mathrm{OH}$.
- $\mathrm{NH}_2$ on the chain: an **amine**.

You do not need twenty names today. You need one group you can point at, and a formula you can count.

Omar's alcohol, five carbons, single holds, one $\mathrm{OH}$: start from the alkane $\mathrm{C}_5\mathrm{H}_{12}$, take away one hydrogen, add $\mathrm{OH}$. The formula is $\mathrm{C}_5\mathrm{H}_{12}\mathrm{O}$. Same count written $\mathrm{C}_5\mathrm{H}_{11}\mathrm{OH}$. Both writings name the same pile.

A ketone on five carbons: the middle carbon of the chain uses two holds on an oxygen instead of two hydrogens. Relative to $\mathrm{C}_5\mathrm{H}_{12}$, two hydrogens are gone and one oxygen is in. Formula $\mathrm{C}_5\mathrm{H}_{10}\mathrm{O}$.

A carboxylic acid on four carbons in the chain counting the acid carbon: formula $\mathrm{C}_4\mathrm{H}_8\mathrm{O}_2$. Do not finish a boiling point or a strength number from memory. Those are PubChem or NIST WebBook, or unverified.

**Check.** A new alcohol: $n = 7$ carbons, one $\mathrm{OH}$, no extra double holds, no loop. Formula $\mathrm{C}_7\mathrm{H}_{16}\mathrm{O}$. A new ketone: $n = 7$ carbons, one $\mathrm{C{=}O}$ in the chain, no other extra group. Formula $\mathrm{C}_7\mathrm{H}_{14}\mathrm{O}$. A new acid: six carbons counting the $\mathrm{COOH}$ carbon. Formula $\mathrm{C}_6\mathrm{H}_{12}\mathrm{O}_2$. If the seven-carbon alcohol and the seven-carbon ketone got the same hydrogen count, the double hold was not charged.

The group is the part you rewrite in later chapters. The chain is the rest of the stick.

---

## 3. Drawing

A full writing of Lila's eight-carbon stick would paint every C and every H. The page fills. The holds you care about vanish in the crowd.

So the working picture drops the C marks and the H marks. A zigzag of lines. Each end and each bend is a carbon. A hydrogen is not drawn. It is implied: each carbon still wants four holds, and every hold not shown as a line to another carbon, oxygen, or nitrogen is a hydrogen.

A carbon with two lines leaving it has two implied hydrogens. A carbon with three lines leaving it has one. A carbon with four lines leaving it has none. An end carbon has one line leaving it, so three implied hydrogens.

A double hold is two lines between the same pair. That carbon then has two of its four holds already spent on that neighbor. Count the other lines. Fill the rest with hydrogen.

A branch is a line that leaves the main zigzag. The carbon at that fork has three carbon neighbors if the fork is in the middle of a chain with one extra carbon stuck on. Then it has one implied hydrogen.

Read a drawing by counting carbons first, then filling hydrogens from the four-hold rule, then naming any group that is actually drawn: $\mathrm{OH}$, $\mathrm{C{=}O}$, $\mathrm{COOH}$, $\mathrm{NH}_2$.

Tess draws a five-carbon zigzag, no extra marks. Carbons: 5. Hydrogens: $2 \times 5 + 2 = 12$. The drawing is $\mathrm{C}_5\mathrm{H}_{12}$. She then puts an $\mathrm{OH}$ on the end carbon. That end carbon now shows two lines out (one to the next carbon, one to oxygen), so it has two implied hydrogens, not three. The oxygen shows one hydrogen. Formula $\mathrm{C}_5\mathrm{H}_{12}\mathrm{O}$.

**Check.** A new drawing: a six-carbon zigzag with a one-carbon branch on the second carbon of the chain. Carbons: $6 + 1 = 7$. Single holds, no loop, no extra group. Hydrogens $2 \times 7 + 2 = 16$. Formula $\mathrm{C}_7\mathrm{H}_{16}$. A second new drawing: a four-carbon zigzag with $\mathrm{C{=}O}$ on carbon 2, carbons numbered from the nearer end. Carbons: 4. The double hold removes two hydrogens from the alkane count. Formula $\mathrm{C}_4\mathrm{H}_8\mathrm{O}$. If you counted 10 hydrogens, you treated the double hold as a single hold.

A published structure on PubChem is the recorded drawing for that compound. Your zigzag is the working copy. If they disagree, fetch the record. Do not average two wirings.

---

## 4. Shape

Kenji builds two sticks with the same four attachments on one carbon: a hydrogen, a methyl, an ethyl, and an $\mathrm{OH}$. On the table they look like the same kit. In space they need not be the same object.

Four holds around one carbon sit as far apart as they can. The carbon is in the middle. The four groups point toward the corners of a tetrahedron. The measured angle of that spread is unverified here. NIST WebBook and PubChem are the doors for a recorded geometry. The working picture is: four directions, not a flat plus-sign on the page.

A single hold between two carbons can spin. The groups on one carbon can rotate past the groups on the next. A double hold cannot spin that way. The two carbons of a double hold, and the four attachments around that pair, lie in a flat sheet. Swap two groups on one of those carbons and you have a different object, even if the formula did not change.

Same formula, different placement in space, is a different molecule when no spin of a single hold can turn one into the other. The page drawing in chapter 3 hid that. Shape is the object the page flattened.

If a carbon holds four groups that are all different, two mirror placements exist. They match if you lift one off the table and turn it, only if you are allowed to use a mirror. Your hands are that pair. People call a carbon with four different attachments a **chiral** carbon after you have seen the two placements. The ordinary sentence is: this carbon has a left and a right.

Kenji's carbon (H, methyl, ethyl, $\mathrm{OH}$) has four different groups. Two objects. A bottle that holds only one of them is not the same bottle as a mix of both. Which bottle you have is a recorded fact. Fetch PubChem, or write unverified.

**Check.** A new carbon: attachments methyl, ethyl, propyl, and hydrogen. Four different groups. Two mirror placements. A second new carbon: attachments methyl, methyl, ethyl, and hydrogen. Two of the four are the same. A mirror swap of those two methyls does not make a new object. One shape, not two. A third case: two carbons joined by a double hold, each also holding a methyl and a hydrogen. Swap the methyl and the hydrogen on one carbon. You cannot spin the double hold to undo the swap. Two objects, same formula.

If a drawing on paper looks identical for two bottles, check whether a spin is allowed. Single hold: often yes. Double hold: no. Four different groups on one carbon: look for a left and a right.

---

## 5. A reaction as a rewrite

Priya heats Omar's five-carbon alcohol with an acid helper. Water leaves. What remains is a five-carbon chain with a double hold between the carbon that had the $\mathrm{OH}$ and a neighbor that lost a hydrogen.

Write the two sides.

Before: $\mathrm{C}_5\mathrm{H}_{12}\mathrm{O}$.

The piece that left: $\mathrm{H}_2\mathrm{O}$.

After: $\mathrm{C}_5\mathrm{H}_{10}$.

Check the atoms. Carbons $5 = 5$. Hydrogens $12 = 10 + 2$. Oxygen $1 = 1$. The pile going in matches the pile coming out. A **reaction** is that rewrite. The ordinary sentence is: one molecule becomes another, and the atom count still closes.

The reverse rewrite adds water across a double hold. Before: $\mathrm{C}_5\mathrm{H}_{10} + \mathrm{H}_2\mathrm{O}$. After: $\mathrm{C}_5\mathrm{H}_{12}\mathrm{O}$. Same close, other direction.

A letter keeps the count honest for a longer stick. An alcohol $\mathrm{C}_n\mathrm{H}_{2n+2}\mathrm{O}$ that drops water becomes $\mathrm{C}_n\mathrm{H}_{2n}$. Fill $n = 8$: before $\mathrm{C}_8\mathrm{H}_{18}\mathrm{O}$, after $\mathrm{C}_8\mathrm{H}_{16}$. Fill $n = 10$: before $\mathrm{C}_{10}\mathrm{H}_{22}\mathrm{O}$, after $\mathrm{C}_{10}\mathrm{H}_{20}$. Put the fills back. Carbons stay. Two hydrogens and one oxygen leave as water.

A rewrite can also swap a group. An $\mathrm{OH}$ replaced by $\mathrm{Cl}$ is a different sentence: $\mathrm{C}_n\mathrm{H}_{2n+1}\mathrm{OH}$ to $\mathrm{C}_n\mathrm{H}_{2n+1}\mathrm{Cl}$, with water or another small piece carrying what was dropped. Count every atom on both sides before you believe the arrow.

Heat of that rewrite, whether it runs by itself, how far it goes: those are thermochemical numbers. NIST WebBook keeps reaction thermochemistry for over 8000 reactions. A number that did not come from that door is unverified here. The atom close is the paper check. The energy close is a fetch.

**Check.** A new alcohol: $n = 6$. Before $\mathrm{C}_6\mathrm{H}_{14}\mathrm{O}$. Drop water. After $\mathrm{C}_6\mathrm{H}_{12}$. Hydrogens $14 = 12 + 2$. Oxygen left with the water. A second new rewrite: add water to $\mathrm{C}_9\mathrm{H}_{18}$. After $\mathrm{C}_9\mathrm{H}_{20}\mathrm{O}$. If you wrote $\mathrm{C}_9\mathrm{H}_{18}\mathrm{O}$, you added oxygen and forgot the two hydrogens. A third: $\mathrm{C}_4\mathrm{H}_{10}\mathrm{O}$ to $\mathrm{C}_4\mathrm{H}_8$ plus $\mathrm{H}_2\mathrm{O}$. Carbons 4 and 4. Hydrogens $10 = 8 + 2$. Oxygen 1 and 1. The arrow is allowed by count.

The helper that made Priya's rewrite run is not in the formula of the product. It is a tool. The rewrite still has to close without it, or the tool is a reactant you forgot to write.

---

## 6. Acid and base as a first look

Tess has two bottles. One holds a four-carbon chain with $\mathrm{COOH}$ at the end. The other holds a four-carbon chain with $\mathrm{NH}_2$ at the end. She mixes a little of each in water.

The acid group can give away its $\mathrm{OH}$ hydrogen. What remains on that carbon is $\mathrm{COO}$ with an extra electron, written $\mathrm{COO}^-$. The amine can take a hydrogen. What it becomes is $\mathrm{NH}_3^+$. The rewrite is:

$$\mathrm{R{-}COOH} + \mathrm{R'{-}NH}_2 \rightarrow \mathrm{R{-}COO}^- + \mathrm{R'{-}NH}_3^+$$

$R$ and $R'$ are the rest of the sticks. The sticks did not have to break. The hydrogen moved. An **acid** in this first look is a group that gives that hydrogen. A **base** is a group that takes it. The living chemistry pack owns the wider acid-and-base survey. This pack names that door and stops. The object here is the hydrogen move on a carbon chain.

Omar's alcohol $\mathrm{OH}$ is not the same tool as $\mathrm{COOH}$. It can give a hydrogen in a harder story. In this first look, $\mathrm{COOH}$ is the giver you expect, $\mathrm{NH}_2$ is the taker you expect, and a plain alkane is neither.

How far the gift goes is a measured strength. A remembered strength number stays off this page. PubChem and the living chemistry pack are the doors. Unverified here.

Count the hydrogens in Tess's mix as a rewrite. Four-carbon acid $\mathrm{C}_4\mathrm{H}_8\mathrm{O}_2$. Four-carbon amine $\mathrm{C}_4\mathrm{H}_{11}\mathrm{N}$. After the hydrogen move, the acid side has lost one hydrogen and the amine side has gained one. Total hydrogens still $8 + 11 = 19$. Total carbons 8. Total oxygens 2. Total nitrogen 1. The gift does not destroy atoms.

**Check.** A new pair: a three-carbon acid $\mathrm{C}_3\mathrm{H}_6\mathrm{O}_2$ and a two-carbon amine $\mathrm{C}_2\mathrm{H}_7\mathrm{N}$. After the hydrogen move, totals are carbons 5, hydrogens $6 + 7 = 13$, oxygens 2, nitrogen 1. A second new case: a six-carbon alkane $\mathrm{C}_6\mathrm{H}_{14}$ mixed with water. No $\mathrm{COOH}$, no $\mathrm{NH}_2$. Do not write a hydrogen gift for that alkane in this first look. A third: two acids and no base. Both can give. Neither has the taker from this chapter. The mix is not the rewrite above.

If you need a number that says which giver wins in water, fetch it. Do not finish that sentence from a table in your head.

---

## 7. Naming

A stick with seven carbons and a methyl branch needs a name another bench can rebuild. IUPAC keeps the worldwide naming work. This book uses one starter rule. The full rule set is the IUPAC door. A preferred name that must travel goes there, or the line says unverified.

Starter rule. Find the longest carbon chain. That chain's length is the stem. Number the chain from the end that gives the group that does work the smaller number. If there is no such group, number from the end that gives the first branch the smaller number. Name the branch as a small chain stuck on, with its carbon number in front.

A chain of six carbons, no group that does work, a one-carbon branch on carbon 3 when you number from the nearer end: the stem is six, the branch is a methyl on 3. The working name is 3-methylhexane. If you numbered from the other end, the branch would sit on carbon 4. 4 is larger than 3. You numbered from the wrong end.

An $\mathrm{OH}$ beats a methyl when you choose the low number. A seven-carbon chain, $\mathrm{OH}$ on carbon 2, methyl on carbon 5, numbered so the $\mathrm{OH}$ gets 2, not 6: the working name is 5-methylheptan-2-ol. The $\mathrm{OH}$ set the numbering. The methyl took the number it got.

A double hold is named in the stem. A five-carbon chain with a double hold starting at carbon 1 is pent-1-ene in that starter writing. The exact punctuation and the living preferred form are IUPAC. Unverified here as a legal preferred name. The count is not: five carbons, one double hold, formula $\mathrm{C}_5\mathrm{H}_{10}$.

**Check.** A new stick: eight carbons in the longest chain, a one-carbon branch. Numbered from the nearer end, the branch is on carbon 4. Working name: 4-methyloctane. If you wrote 5-methyloctane, you numbered from the far end. A second new stick: six-carbon chain, $\mathrm{OH}$ on carbon 1, methyl on carbon 4. The $\mathrm{OH}$ is at the end, so it gets 1. Working name: 4-methylhexan-1-ol. Formula $\mathrm{C}_7\mathrm{H}_{16}\mathrm{O}$. A third: longest chain five, two methyls on carbon 2 when numbered from the nearer end. Working name: 2,2-dimethylpentane. Carbons $5 + 2 = 7$. Formula $\mathrm{C}_7\mathrm{H}_{16}$. If the carbon count in the name and the formula disagree, the name is wrong.

PubChem records names people actually printed on a bottle, including extra names. IUPAC is the union for the worldwide rule. They can differ. Do not average two names.

---

## 8. A ring

Kenji takes a six-carbon chain $\mathrm{C}_6\mathrm{H}_{14}$ and joins the two ends. Two hydrogens come off, one from each end, so those two carbons can hold to each other. The new formula is $\mathrm{C}_6\mathrm{H}_{12}$. The object is a loop. A chain that has been closed is a **ring**.

The hydrogen count for a single ring with only single holds is $2n$, not $2n+2$. The two missing hydrogens paid for the extra carbon-carbon join. Fill $n = 8$: chain $\mathrm{C}_8\mathrm{H}_{18}$, ring $\mathrm{C}_8\mathrm{H}_{16}$. Fill $n = 5$: chain $\mathrm{C}_5\mathrm{H}_{12}$, ring $\mathrm{C}_5\mathrm{H}_{10}$. A double hold on a chain also removes two hydrogens. So $\mathrm{C}_6\mathrm{H}_{12}$ might be a six-carbon ring with single holds, or a six-carbon chain with one double hold. Same formula, different wiring. The drawing in chapter 3 is how you tell them apart. A name that says cyclo points at the ring.

A six-carbon ring that shares a special evenness of extra holds is a **benzene** ring. The working drawing is a hexagon, often with a circle inside, or with three double holds drawn on alternating sides. Why those six sit even is a later door. This book uses the ring as a shape you can count. Formula of benzene itself: $\mathrm{C}_6\mathrm{H}_6$. That is six carbons, six hydrogens, a much leaner hydrogen count than a six-carbon alkane. A recorded spectrum or a heat of formation for benzene is NIST WebBook or PubChem, or unverified.

A ring can carry a group that does work. $\mathrm{OH}$ on a benzene ring is a different tool than $\mathrm{OH}$ on Omar's chain. Do not treat them as the same rewrite target. The ring is part of the object.

**Check.** A new ring: $n = 7$, single holds, one loop, no extra group. Formula $\mathrm{C}_7\mathrm{H}_{14}$. The open chain with 7 carbons would have been $\mathrm{C}_7\mathrm{H}_{16}$. Difference: 2 hydrogens. A second new case: formula $\mathrm{C}_5\mathrm{H}_{10}$. Two wirings that fit this chapter: a five-carbon ring with single holds, or a five-carbon chain with one double hold. A drawing, or a name with cyclo or ene, picks one. A third: benzene $\mathrm{C}_6\mathrm{H}_6$ is not $\mathrm{C}_6\mathrm{H}_{12}$. If you used the single-ring single-hold count on benzene, you wrote six extra hydrogens the even ring does not carry.

Closing a chain is a rewrite. Atoms still have to close. Two hydrogens leave, or they sit on another product you must write.

---

## 9. A spectrum as a door

Priya has a bottle. The label is smudged. The drawing is a guess. She needs the molecule to answer for itself.

A **spectrum** is that answer written as a pattern: how the molecule takes in light, or how it breaks when smashed, plotted against a stick such as wavelength, wavenumber, or piece-mass. The ordinary sentence is: a door that reports how this bottle answers.

NIST Chemistry WebBook keeps infrared spectra for over 16,000 compounds, mass spectra for over 33,000 compounds, ultraviolet and visible spectra for over 1600 compounds, and electronic and vibrational spectra for over 5000 compounds. PubChem points at compound records. You look the bottle up. You do not remember a peak.

Infrared light is answered by holds that can stretch and bend. An $\mathrm{OH}$ answers in a different region than a $\mathrm{C{=}O}$. The wavenumber of either region is unverified here. Open the WebBook record for the compound you named. If the record is missing, write unverified. Do not finish a peak from a poster.

A mass spectrum is a list of piece-masses after a smash. A whole-molecule mark, if it appears, is a clue to the formula. A piece that matches the whole minus a $\mathrm{CH}_3$ is a clue that a methyl was available to fall off. The gram-per-mole numbers of those pieces are recorded masses. Fetch NIST or PubChem, or write unverified. The count you can do on paper is the atom loss: minus $\mathrm{CH}_3$ means one carbon and three hydrogens left the parent as a piece.

A spectrum is not a name. Two wirings can share a formula and still answer differently. Two bottles can share a name printed by a shop and still be mixed. Match the pattern to a record. Then keep the drawing that the record supports.

**Check.** A new bottle: you guess 3-methylheptane, formula $\mathrm{C}_8\mathrm{H}_{18}$. Open NIST WebBook. If an infrared record exists among those over 16,000 compounds, compare. If it does not, write unverified. Do not invent the peaks. A second new case: a smash list shows a parent that fits $\mathrm{C}_5\mathrm{H}_{12}\mathrm{O}$ and a piece that fits loss of $\mathrm{H}_2\mathrm{O}$. That piece supports an alcohol that can drop water, not a proof by itself. A third: two drawings, both $\mathrm{C}_6\mathrm{H}_{12}$, one a ring, one a chain with a double hold. One spectrum record cannot be both. Fetch. Pick one drawing. Do not average.

The spectrum is a door. The chain, the group, and the rewrite still have to close on paper after the door speaks.

---

## 10. A check

A new bottle, not used in the earlier chapters. Lila's scrap reads: a six-carbon longest chain, an $\mathrm{OH}$ on carbon 2, a methyl on carbon 4, numbered so the $\mathrm{OH}$ gets the lower number. Single holds besides that $\mathrm{OH}$. No ring.

Chain. Longest walk: 6 carbons. Branch: 1 carbon. Total carbons: 7.

Group that does work. $\mathrm{OH}$ on carbon 2. An alcohol, not a $\mathrm{COOH}$, not an amine.

Drawing. A six-carbon zigzag. $\mathrm{OH}$ on the second carbon. A one-carbon branch on the fourth. Implied hydrogens fill every carbon to four holds.

Shape. Carbon 2 holds $\mathrm{OH}$, hydrogen, a one-carbon side, and a four-carbon side. Those four are different. Two mirror placements exist. Which placement is in the bottle is unverified here. Fetch PubChem, or write unverified. Carbon 4 holds two hydrogens, the methyl, and two different chain directions. Four groups, but two of them are hydrogen, so carbon 4 is not a left-and-right carbon.

Rewrite. Drop water from this alcohol. Before: $\mathrm{C}_7\mathrm{H}_{16}\mathrm{O}$. After: $\mathrm{C}_7\mathrm{H}_{14}$. Hydrogens $16 = 14 + 2$. Oxygen leaves with the water. The double hold can sit between carbon 1 and 2, or between carbon 2 and 3. Those are two different alkenes. The arrow does not pick for you unless you add a rule. This book only closes the count.

Acid and base as a first look. There is no $\mathrm{COOH}$. There is no $\mathrm{NH}_2$. The $\mathrm{OH}$ is Omar's tool, not Tess's giver. Do not write the hydrogen-gift rewrite of chapter 6 for this bottle.

Naming. Working name: 4-methylhexan-2-ol. If you numbered from the far end, the $\mathrm{OH}$ would be on carbon 5. That numbering is the wrong end. Preferred IUPAC form is the union's door, or unverified.

Ring. None. Formula is the open-chain alcohol $\mathrm{C}_7\mathrm{H}_{16}\mathrm{O}$, not $\mathrm{C}_7\mathrm{H}_{14}\mathrm{O}$.

Spectrum. Open NIST WebBook and PubChem for 4-methylhexan-2-ol. Infrared among those over 16,000 records, mass spectrum among those over 33,000, or write unverified. Do not invent a wavenumber.

Put the formula back one more time. Alkane of 7 carbons: $\mathrm{C}_7\mathrm{H}_{16}$. Replace one hydrogen with $\mathrm{OH}$: $\mathrm{C}_7\mathrm{H}_{16}\mathrm{O}$. Same as counting 6 chain carbons plus 1 branch, alcohol, no ring, no extra double hold. If any of those writings disagree, a carbon was dropped or a hydrogen was invented.

**Check.** A last new case, smaller. Longest chain 4, $\mathrm{OH}$ on carbon 1, no branch, no ring. Formula $\mathrm{C}_4\mathrm{H}_{10}\mathrm{O}$. Working name: butan-1-ol. Drop water: $\mathrm{C}_4\mathrm{H}_8$. Spectrum: fetch, or unverified. If you wrote $\mathrm{C}_4\mathrm{H}_8\mathrm{O}$ after dropping water, the oxygen did not leave.

The objects of this book are the chain, the group that does work, the drawing, the shape, the rewrite, the hydrogen gift, the name, the ring, and the spectrum door. A bottle is closed when those nine agree, and when every load-bearing measured number has a host.
