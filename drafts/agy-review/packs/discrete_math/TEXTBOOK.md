---
title: "discrete_math — count, graph, induction"
date: "2026-09-20"
status: draft
start: algebra
needs: algebra
home: "drafts/agy-review/packs/discrete_math/"
---

# Count, graph, induction

Algebra already taught you to unwrap a sentence until a letter sits alone. This book adds three objects: a count you can finish without listing every case, a picture of dots joined by walks, and a ladder that carries a rule from the first whole number to every whole number after it.

People also call this family **discrete mathematics**. The family name can wait. The work is finite piles, finite maps, and a proof that does not skip a step.

The longer course lives at MIT OpenCourseWare: *Mathematics for Computer Science*, course 6.042J, Fall 2010, taught by Prof. Tom Leighton and Dr. Marten van Dijk. This pack links that door. Combinatorial identities live on NIST DLMF chapter 26. OpenStax *Precalculus 2e* is the school door when a sequence sits next to algebra you already have.

A later pack in this library treats machines: a list of steps a device can follow. That pack owns the machine. This pack owns the finite count, the graph walk, and the induction. Name that door and stop. Chance as a share lives in the probability pack. Name that door and stop.

A named identity that must travel goes to MIT OCW, NIST DLMF, or OpenStax, or the line says unverified.

---

## 1. Count without listing

Mara glazes pots. She has 4 glaze colors and 7 stamp marks. She wants one glaze and one stamp on each pot. How many different pots can she make?

You could write a table: ash glaze with oak stamp, ash glaze with wave stamp, and so on, until 28 rows. The table is honest. It is also slow. The first choice has 4 options. For each of those, the second choice has 7 options. The count is $4 \times 7 = 28$. You did not list the pots. You counted the slots.

When one choice is independent of another, the total count is the product of the sizes. That product is the **product rule**. Independent here means: picking a glaze does not change how many stamps remain.

Three slots. Oren's ferry sells a ticket with a boat, a dock, and a time of day. 3 boats, 5 docks, 2 times of day. $3 \times 5 \times 2 = 30$ tickets. Still no list.

Order can matter. Tess has 5 chapbooks and a windowsill that holds 3 of them in a row. Left, middle, right are different places. The left place has 5 choices. The middle then has 4. The right then has 3. $5 \times 4 \times 3 = 60$ rows. That is a **permutation**: an ordered filling of slots from a pile, without reuse.

If she used all 5 chapbooks in a line, the count would be $5 \times 4 \times 3 \times 2 \times 1 = 120$. People write that falling product as $5!$. The exclamation is a name for the product, not a shout. $4! = 4 \times 3 \times 2 \times 1 = 24$. $1! = 1$. $0!$ is 1: there is one way to line up an empty row, the way of doing nothing.

Order can fail to matter. Mara picks 3 of 8 paints for a tray, and the tray does not care which paint sat down first. If order counted, she would have $8 \times 7 \times 6 = 336$ lined-up triples. Each unordered trio of paints can be lined up in $3 \times 2 \times 1 = 6$ ways, so those 336 lined-up triples are 6 copies of each tray. The tray count is $336 \div 6 = 56$. An unordered pick of $k$ things from $n$ is a **combination**. The working fraction is

$$\frac{n \times (n-1) \times \cdots \times (n-k+1)}{k \times (k-1) \times \cdots \times 1}$$

NIST DLMF chapter 26 is the official door when a binomial identity must be cited rather than re-derived. This chapter keeps the fraction and the product.

A listing is a check on a small count, not a method for a large one. If you cannot name the slots, you are not ready to multiply. If two slots share a restriction, the product overcounts or undercounts. Then you split the story into cases, or you divide out the copies, as with the paints.

**Check.** A new shop: 6 glazes and 3 clay bodies, one of each. $6 \times 3 = 18$ pots. A new row: 2 lids, 8 jars, 3 labels. $2 \times 8 \times 3 = 48$. A new permutation: 4 of 7 tools in a belt, order matters. $7 \times 6 \times 5 \times 4 = 840$. A new combination: 2 of 11 postcards, order does not matter. $\frac{11 \times 10}{2 \times 1} = 55$. If you listed 18 glaze-and-clay pairs and got 17, the list missed a pair. The product is the count.

---

## 2. A pile and a rule

A drawer holds 6 chisels. You can point at each one. You can also name the drawer by a rule: "the chisels in Tess's bench." Both namings pick out the same pile.

A **set** is a pile of distinct things, named by listing them or by a rule that decides membership. Inside curly braces, order does not count and copies collapse. $\{oak, ash, elm\}$ is the same pile as $\{elm, oak, ash\}$. $\{oak, oak\}$ is $\{oak\}$.

A thing is **in** the pile or it is not. There is no "almost in." Mara's stamp set is $\{wave, oak, dot, vine\}$. The mark "oak" is in. The mark "star" is not.

A **subset** is a pile taken from a pile. $\{wave, oak\}$ sits inside $\{wave, oak, dot, vine\}$. The empty pile sits inside every pile: you can choose nothing. The whole pile sits inside itself: you can choose everything.

How many subsets? For each thing you have two moves: take it, or leave it. Two things: $2 \times 2 = 4$ subsets, including empty and full. Four postcards: $2 \times 2 \times 2 \times 2 = 16$. In a letter: if the pile has $n$ things, it has $2^n$ subsets. Six stickers: $2^6 = 64$. Eight tools: $2^8 = 256$.

Two piles can overlap. Tess's weekday stamps are $\{oak, wave, dot\}$. Mara's tray stamps are $\{wave, vine, star\}$. The stamps in both piles are $\{wave\}$. That overlap is the **intersection**. The stamps in at least one of the two piles are $\{oak, wave, dot, vine, star\}$. That combined pile is the **union**. Count the union with care: $|A| + |B|$ counts the overlap twice, so take the overlap off once. Weekday pile 3, tray pile 3, overlap 1. Union $3 + 3 - 1 = 5$.

A rule can be a test. "the even numbers among 8, 11, 14, 17, 20" names $\{8, 14, 20\}$. The test is the membership. If the test is muddy, the pile is not yet a set.

The empty pile is a legal pile. It is not a missing answer. Zero things is a count.

**Check.** A new pile of 5 postcards. Subsets: $2^5 = 32$, including empty. A new overlap: pile $A$ has 9 marks, pile $B$ has 4, and 2 marks sit in both. Union $9 + 4 - 2 = 11$. A new membership: among $\{2, 5, 8, 11, 14\}$, the multiples of 2 are $\{2, 8, 14\}$. Three things, not five. If you counted 5, you ignored the rule.

---

## 3. True or false

A crate on Oren's dock is painted red, or the crate is painted some other color. The sentence "the crate is red" holds, or that sentence fails. Those two fills are the whole shelf.

A sentence that is true or false is a **claim**. Algebra already used this: $7 + 4 = 11$ is true. $7 + 4 = 10$ is false. $x + 3 = 11$ is a claim once you fill $x$. Discrete work writes claims about piles, walks, and counts, then combines them.

**And** needs both. "The crate is red and the crate is on the dock." If it is red and on the dock, the and-sentence is true. If either half fails, the and-sentence is false.

**Or** needs at least one. "The crate is red or the crate is marked fragile." Red unmarked: true. Brown fragile: true. Red fragile: true. Brown unmarked: false. This or includes the both-true case.

**Not** flips. If "the crate is red" is true, "the crate is not red" is false.

**If-then** is a promise. "If the crate is red, then it rides the noon boat." The promise fails only when the crate is red and it misses the noon boat. A brown crate that misses the noon boat does not break that promise: the if-part never started. A brown crate on the noon boat also leaves the promise standing. The surprising case is the true if-then with a false if-part. Algebra already had this shape: a sentence that does not apply is not a counterexample.

Letters can stand for claims, the same way they stand for numbers. Let $R$ mean "the crate is red." Let $D$ mean "the crate is on the dock." Then $R$ and $D$ is the and-sentence. The letter is a box for a true-or-false, not a count. Fill it with true or false, not with 7.

A later pack treats longer proof systems. This chapter is enough true-or-false to count cases and to climb a ladder. Name that longer door and stop.

You can count truth-fills. Two claims, each true or false: $2 \times 2 = 4$ fills. Three claims: $2^3 = 8$ fills. The product rule from chapter 1 is still the count.

**Check.** New sentences. $P$: "Tess has 4 stamps." $Q$: "Mara has 3 glazes." Suppose $P$ is true and $Q$ is true. Then $P$ and $Q$ is true. $P$ or $Q$ is true. Not $P$ is false. If $P$ then $Q$ is true. A new fill: $P$ true, $Q$ false. Then $P$ and $Q$ is false. $P$ or $Q$ is true. If $P$ then $Q$ is false, because the if-part held and the then-part failed. A third fill: $P$ false, $Q$ true. If $P$ then $Q$ is true. The promise was not asked to work.

---

## 4. Induction

A ladder stands against Tess's loft. You can stand on the first rung. If you are standing on any rung, you can step to the next one. Then you can stand on every rung. You do not jump from the first to the twentieth. You keep a step that never runs out.

That is **induction** on the whole numbers that start at 1. Two pieces, both required:

1. A base. The claim holds at the first number you care about, often $n = 1$.
2. A step. If the claim holds at $n = k$, then it holds at $n = k + 1$.

The step is a promise about a letter $k$. You do not pick a favorite $k$. You unwrap as in algebra, using the assumption at $k$ to reach $k + 1$.

Tess stacks crates. Row 1 has 1 crate. Row 2 has 2 crates. Row $n$ has $n$ crates. Let $T(n)$ be the total after $n$ rows. Then $T(1) = 1$, and $T(n) = T(n-1) + n$. Claim: $T(n) = \frac{n(n+1)}{2}$.

Base. $n = 1$. Right side $\frac{1 \times 2}{2} = 1$. Matches $T(1)$.

Step. Suppose $T(k) = \frac{k(k+1)}{2}$. The next row adds $k + 1$ crates:

$$T(k+1) = T(k) + (k+1) = \frac{k(k+1)}{2} + (k+1) = (k+1)\left(\frac{k}{2} + 1\right) = (k+1)\frac{k+2}{2} = \frac{(k+1)(k+2)}{2}$$

That is the claimed formula at $n = k + 1$. Base and step together: the formula holds for every whole number $n \geq 1$.

A second ladder, a square of tiles. Layer 1 is 1 tile. Each new layer is an L of the next odd count: 3, then 5, then 7. After $n$ layers the figure is an $n$ by $n$ square, so $n^2$ tiles. The odd numbers $1 + 3 + 5 + \cdots + (2n-1)$ sum to $n^2$. Base $n = 1$: $1 = 1^2$. Step: if the first $k$ odds sum to $k^2$, adding the next odd $2k+1$ gives $k^2 + 2k + 1 = (k+1)^2$.

Induction does not guess the formula. It carries a formula you already wrote. If the base fails, the ladder never starts. If the step fails at even one $k$, the ladder breaks there and every later rung is unearned.

**Check.** New number for the crate stack: $n = 7$. $\frac{7 \times 8}{2} = 28$. Count the rows: $1+2+3+4+5+6+7 = 28$. A second new number: $n = 11$. $\frac{11 \times 12}{2} = 66$. A new odd-sum: first 5 odds $1+3+5+7+9 = 25 = 5^2$. First 7 odds: $7^2 = 49$. If someone claims $T(8) = 40$, put 8 in: $\frac{8 \times 9}{2} = 36$, not 40. The fill is wrong. Do not average 40 toward 36.

---

## 5. Dots and edges

Oren runs a small ferry. He paints a map. Each dock is a dot. Each run that actually sails is a line between two dots. The map is not the water. The map is the service.

A **graph** in this book is a finite pile of dots, and a finite pile of edges that join pairs of dots. An **edge** is a walk-between. Two dots joined by an edge are **neighbors**.

Five docks: Ash, Bay, Cedar, Dock, Elm. Seven runs: Ash-Bay, Ash-Cedar, Bay-Cedar, Bay-Dock, Cedar-Dock, Cedar-Elm, Dock-Elm. You can count those seven without listing twice if you name each pair once.

The **degree** of a dot is how many edges meet it. Ash meets 2. Bay meets 3. Cedar meets 4. Dock meets 3. Elm meets 2. Add the degrees: $2+3+4+3+2 = 14$. Each edge was counted twice, once at each end. So the number of edges is $14 \div 2 = 7$. In a letter: the sum of degrees equals twice the number of edges. That double-count is the same move as the union overlap in chapter 2: count two ways, then match.

A **walk** is a sequence of dots where each step is an edge. Ash to Bay to Dock is a walk of two edges. A **path** is a walk that does not repeat a dot. Ash to Cedar to Elm is a path. A **cycle** is a path that returns to its start and otherwise does not repeat: Bay to Cedar to Dock to Bay.

The map can have a loop of docks. It can have a dock with no run, degree 0, sitting as a dot with no edge. It can have two runs between the same pair; this book will say so if a map needs two. Until then, at most one edge per pair, and no edge from a dock to itself.

The picture does not argue with the count. If the degrees sum to 14, there are 7 edges. If you drew 8 lines, the drawing is wrong or a degree is wrong.

A later pack treats machines that follow a list of steps along such a map. That pack owns the machine. The map is still this object's.

**Check.** A new map: 6 dots in a ring, each joined to the next, and the last joined to the first. Each degree is 2. Sum of degrees $6 \times 2 = 12$. Edges $12 \div 2 = 6$. A second new map: 4 dots in a line, three edges. Degrees $1, 2, 2, 1$. Sum 6, edges 3. A broken claim: five docks, degrees $3, 3, 3, 3, 3$. Sum 15, which is odd. Twice a count of edges cannot be odd. That list of degrees cannot be a graph.

---

## 6. A tree

Tess lays paths among 9 mailboxes so each box can reach every other box, and so there is no loop. She lays 8 paths. If she lays a ninth path between two boxes that already connect through others, a cycle appears. If she pulls one of the 8, some box is cut off.

A **tree** is a graph that is connected and has no cycle. **Connected** means you can walk from any dot to any other along edges. No cycle means there is not a closed tour that returns without repeating a dot.

On a tree there is exactly one path between any two dots. If there were two different paths, those two would make a cycle. If there were no path, the graph would fail to be connected.

A tree with $n$ dots has $n - 1$ edges. Nine mailboxes, 8 paths. Fourteen dots, 13 edges. Four dots, 3 edges. You can see the count by growing the tree: start with 1 dot and 0 edges. Each new dot arrives with exactly one new edge, the path that attaches it. After $n$ dots you have added $n-1$ edges.

The same count in reverse: a tree with at least two dots has a leaf, a dot of degree 1. Pull the leaf and its edge. What remains is a smaller tree. Repeat until one dot remains. You pulled $n-1$ edges.

Add one edge to a tree, keep it connected: you now have $n$ edges on $n$ dots, and exactly one cycle. Remove one edge from a tree: you now have two separate piles of dots. Those two pictures are how you check a map that claims to be a tree.

A forest is a pile of trees. This chapter owns one tree. A town road map with a loop is a graph from chapter 5, not a tree.

**Check.** New tree: 14 mailboxes. Edges $14 - 1 = 13$. A new small tree: 4 dots, 3 edges, degrees $1, 1, 1, 3$ (one hub, three leaves). Sum of degrees 6, twice 3. A map that fails: 9 dots, 9 edges, and still connected. Then a cycle is in it: a connected graph with one extra edge. Another fail: 9 dots, 8 edges, and two separate clumps. That map is two trees, a forest. The edge count of a single tree matched by accident.

---

## 7. Recurrence

Mara's kiln. On week 1 she has 4 pots ready. Each later week she keeps last week's pots and adds 5 new ones. Let $a_n$ be the count on week $n$. Then $a_1 = 4$ and $a_n = a_{n-1} + 5$ for $n \geq 2$.

Week 2: $4 + 5 = 9$. Week 3: $14$. Week 4: $19$. You can keep adding 5, or you can name the pile after $n$ weeks in one line. Starting at 4, you added 5 a total of $n-1$ times: $a_n = 4 + 5(n-1) = 5n - 1$. Week 6: $5 \times 6 - 1 = 29$. Week 8: $39$. Put those back into the week-by-week rule: $29 = 24 + 5$, and week 5 would have been $5 \times 5 - 1 = 24$. True.

A rule that names today's pile from earlier piles is a **recurrence**. The first values you state are the **initial conditions**. The closed line $a_n = 5n - 1$ is a solution of that recurrence. Induction from chapter 4 is how you prove the closed line matches the recurrence for every $n$, not only the weeks you listed.

A second kiln, doubling. $b_0 = 3$ and $b_n = 2 b_{n-1}$. Then $3, 6, 12, 24, 48$. After $n$ doublings, $b_n = 3 \times 2^n$. Check $n = 5$: $3 \times 32 = 96$. From the recurrence, $b_5 = 2 \times b_4 = 2 \times 48 = 96$.

A rail of $n$ spans. Tess covers it with boards of 1 span and boards of 2 spans. Let $t_n$ be the number of coverings. A covering of $n$ either ends with a 1-board, after a covering of $n-1$, or ends with a 2-board, after a covering of $n-2$. So $t_n = t_{n-1} + t_{n-2}$. Need two starts. $t_1 = 1$ (one single board). $t_2 = 2$ (two singles, or one double). Then $t_3 = 3$, $t_4 = 5$, $t_5 = 8$, $t_6 = 13$, $t_7 = 21$. You count a few terms by unfolding. A closed line for this two-step rule is a named identity; cite NIST DLMF chapter 26 or MIT 6.042J if you need the named form to travel. The recurrence plus the two starts already lets you compute $t_8 = t_7 + t_6 = 21 + 13 = 34$ by hand.

A recurrence without starts does not name a pile. $c_n = c_{n-1} + 3$ with no $c_1$ is a shape, not a count.

**Check.** New linear rule: $a_1 = 7$, $a_n = a_{n-1} + 4$. Closed line $a_n = 7 + 4(n-1) = 4n + 3$. At $n = 6$, $4 \times 6 + 3 = 27$. Unfold: $7, 11, 15, 19, 23, 27$. Matches. A new doubling: $b_0 = 5$, $b_n = 2 b_{n-1}$. Then $b_4 = 5 \times 16 = 80$. A new rail: $t_8 = 34$ as above. $t_9 = 34 + 21 = 55$. If someone claims $t_9 = 54$, they dropped a covering. Unfold from the starts rather than patching 54.

---

## 8. Wrap-around numbers

Oren's clock has 12 hours. It is 8. A 17-hour watch later, the hand does not point at 25. It wraps. $8 + 17 = 25$. Take away two full turns of 12: $25 - 24 = 1$. The hand points at 1.

A week works the same way with 7. A tray with 10 slots works the same way with 10. The pile of possible remainders is finite. After you pass the last, you are back at the first.

Divide 25 by 12. $12 \times 2 = 24$, remainder 1. Divide 25 by 7. $7 \times 3 = 21$, remainder 4. The remainder is the wrap-around name of that number on a clock of that size. Two whole numbers are **congruent** modulo $m$ when they leave the same remainder on division by $m$, or when their difference is a multiple of $m$. People write $25 \equiv 1 \pmod{12}$ and $25 \equiv 4 \pmod{7}$. The short word **mod** is that remainder clock.

On a 12-hour clock, 25 and 1 are the same place. On a 7-day week, 25 and 4 are the same place if you numbered days 0 through 6, or the same remainder. Keep the numbering honest. If slots are 1 through 12, remainder 0 is slot 12, the last slot, because a full turn landed exactly.

Algebra still works if you stay on the clock. Add 5 hours to 8: 13, wrap to 1. Same as $8 + 5 = 13 \equiv 1 \pmod{12}$. Multiply 5 by 5 on a 12-clock: $25 \equiv 1 \pmod{12}$. Put back: 5 hours, five times, is 25 hours, which is two full turns and 1 hour.

Not every unwrap survives. On a 12-clock, multiplying by 2 can land on 6 from both 3 and 9, because $2 \times 3 = 6$ and $2 \times 9 = 18 \equiv 6 \pmod{12}$. Dividing by 2 does not name a single fill. The algebra pack already stopped you from dividing by zero. Wrap-around adds this sibling: dividing by a number that shares a factor with the clock size can fail to name one fill.

NIST DLMF chapter 27, functions of number theory, is the official door when a congruence identity must be cited. MIT 6.042J lists integer congruences among its topics. This chapter keeps remainders you can finish by hand.

**Check.** New watch: 41 hours after 6 on a 12-hour clock. $41 = 3 \times 12 + 5$, remainder 5. $6 + 5 = 11$. The hand points at 11. A second new watch: 100 hours after 7. $100 = 8 \times 12 + 4$. $7 + 4 = 11$. A new remainder: $41$ divided by 7 is 5 remainder 6, so $41 \equiv 6 \pmod{7}$. A 10-slot tray, slots numbered 0 through 9, item in slot 3, advance 18: $3 + 18 = 21$, $21 = 2 \times 10 + 1$, slot 1. If you wrote slot 21, you did not wrap.

---

## 9. Functions on finite piles

Nia has a cubby wall with 5 cubbies and a pile of 5 letters. She puts each letter in one cubby. Each letter goes somewhere. No letter is split. That assignment is a **function** from the letter pile to the cubby pile: each incoming thing is sent to exactly one outgoing thing.

A function is not a suggestion. It does not send one letter to two cubbies. It may send two letters to one cubby. It may miss a cubby.

If different incoming things always land on different outgoing things, the function is **one-to-one**. Five letters, five cubbies, no shared cubby: one-to-one. Five letters, four cubbies: two letters must share, so the function cannot be one-to-one.

If every outgoing thing is hit at least once, the function is **onto**. Five letters into five cubbies, every cubby used: onto. Five letters into six cubbies: at least one cubby empty, so not onto.

If the function is both one-to-one and onto, it is an exact matching of two piles of the same size. You can undo it: each cubby names one letter. Algebra's unwrap is the same idea on numbers. Here the piles are finite and named.

Count the functions. Each of 3 stamps may go to either of 2 trays: $2^3 = 8$ functions. Each incoming thing chooses one outgoing thing. The product rule again. One-to-one functions from 3 stamps to 6 trays: first stamp 6 choices, second 5, third 4, so $6 \times 5 \times 4 = 120$. That is a permutation of chapter 1, now read as a function that does not collide.

More incoming than outgoing forces a collision. 7 letters, 5 cubbies: at least one cubby holds at least two letters. 10 postcards, 9 hooks: at least one hook holds two. 30 students, 29 desks: at least one desk is shared if every student sits. That collision is the **pigeonhole** fact: if $n$ things go into $m$ holes and $n > m$, some hole has at least two. You do not name which hole. You know a share exists.

The empty incoming pile has one function to any outgoing pile: the function that does nothing. That matches $0! = 1$ from chapter 1, the one empty lining-up.

**Check.** New cubbies: 8 letters, 7 cubbies. Some cubby has at least two. A new matching: 4 workers, 4 lockers, each locker used once. One-to-one and onto. A new miss: 4 workers, 5 lockers. Cannot be onto. A new count: functions from a 2-pile to a 3-pile: $3^2 = 9$. One-to-one among them: $3 \times 2 = 6$. If someone says 8 letters into 7 cubbies can still be one-to-one, they have invented an eighth cubby.

---

## 10. A check

Write the finite pile. Name the slots, the dots, or the first whole number. Finish the arithmetic by hand. Put the number back into the story. Ask whether the fill can be the thing you named. If the claim is a named identity that must travel, open MIT OCW 6.042J, NIST DLMF chapter 26 or 27, or OpenStax *Precalculus 2e*. If the door and a remembered line disagree, believe the door. If the door will not open, write unverified and stop building on it.

A count without listing. 3 coats, 5 scarves, 2 bags. Independent slots: $3 \times 5 \times 2 = 30$ outfits. A permutation: 3 of 6 chapbooks in a window, order matters. $6 \times 5 \times 4 = 120$. A combination: 3 of 7 paints, order does not matter. $\frac{7 \times 6 \times 5}{3 \times 2 \times 1} = 35$. If a list of the 35 trays has 34 rows, the list is short, not the fraction.

A pile and a rule. 6 stickers, subsets $2^6 = 64$. Union of 8 and 5 with overlap 3: $8 + 5 - 3 = 10$.

True or false. $P$ true, $Q$ false: $P$ and $Q$ false, $P$ or $Q$ true, if $P$ then $Q$ false.

Induction. Crate rows at $n = 12$: $\frac{12 \times 13}{2} = 78$. First 7 odds sum to $49$. Someone claims the first 7 odds sum to 48. Then they dropped a tile from a 7 by 7 square. The square is 49.

Dots and edges. New map: 8 dots, degrees $3, 3, 2, 2, 2, 2, 1, 1$. Sum $16$, edges $8$. A degree list that sums to 17 cannot be a graph.

A tree. 11 mailboxes, 10 paths, connected, no cycle. Add an eleventh path and you created a cycle. Drop one of the 10 and you split the town.

Recurrence. $a_1 = 4$, add 5 each week, week 8 is 39. Rail coverings $t_9 = 55$. Someone claims $t_9 = 56$. Unfold from $t_1 = 1$, $t_2 = 2$ rather than patching.

Wrap-around. 41 hours after 6 is 11 on a 12-hour clock. $41 \equiv 6 \pmod{7}$. Slot 3 advanced 18 on a 10-slot tray of 0 through 9 lands on 1.

Functions. 8 letters, 7 cubbies: a share. 4 lockers, 4 workers, each used once: an exact matching. Functions from 2 to 3: 9. One-to-one among them: 6.

A fill can satisfy arithmetic and still fail the named thing. Negative 3 edges is not a graph. A remainder 12 on a 12-hour clock whose labels are 1 through 12 is 12, not 0, if you are reading the face. $T(n) = \frac{n(n+1)}{2}$ at $n = 0$ is 0, which can name an empty stack, not a row of crates already built.

A broken check is useful. Someone claims 4 glazes and 7 stamps make 11 pots, adding instead of multiplying. Put the slots back: each of 4 glazes still has 7 stamps, $4 \times 7 = 28$. Do not average 11 toward 28. Name the slots again.

This pack owns finite counting and graph walks. Computing is machines. Probability is chance as a share. Algebra remains the letter and the unwrap. Name those doors and stop. NIST DLMF chapter 26 for combinatorial analysis, chapter 27 for functions of number theory. MIT OpenCourseWare 6.042J Fall 2010 for the longer undergraduate walk. OpenStax *Precalculus 2e* for the school sequence door. The doors sit in `LINK_INDEX.md`.

Paper first for the arithmetic.
