---
title: "linear_algebra — lists of numbers, stretch, solve"
date: "2026-09-20"
status: draft
start: algebra
needs: algebra
home: "drafts/agy-review/packs/linear_algebra/"
---

# Lists, a grid, a stretch, a solve

Algebra already gave you a blank inside a sentence. This book adds one object: several numbers kept in a fixed order, then a grid that stretches or turns that list, or that solves many sentences at once.

MIT OpenCourseWare course 18.06, Linear Algebra, taught by Prof. Gilbert Strang in Spring 2010, is the long undergraduate walk. The course page calls it a basic subject on matrix theory and linear algebra, with emphasis on topics useful in other disciplines, including systems of equations, vector spaces, determinants, eigenvalues, similarity, and positive definite matrices. This pack links that door. It does not copy the lectures.

NIST DLMF is the door for a named matrix identity. Open that page. Paper first for the sums in this book.

OpenStax *Algebra and Trigonometry 2e* is the school walk for letters and graphs that this book assumes. The details page is the door. Author, ISBN, and update date on that page are unverified in this pack. Open the door. The OpenStax subjects catalog is the shelf of those school books.

The living math pack in `stacks/math/` is a survey of the field. This book owns the list, the grid, the stretch, and the solve.

---

## 1. A list of numbers

A stall writes three counts on Saturday: 5 lamps, 2 chairs, 8 bowls. Keep them in that order. Write

$$(5,\ 2,\ 8)$$

The first slot is lamps. The second is chairs. The third is bowls. Swap two slots and you have named a different stall. $(2,\ 5,\ 8)$ is 2 lamps and 5 chairs, not the stall you counted.

A second stall writes $(3,\ 4,\ 1)$. Together they sold $5+3$ lamps, $2+4$ chairs, $8+1$ bowls:

$$(5,\ 2,\ 8) + (3,\ 4,\ 1) = (8,\ 6,\ 9)$$

Add matching slots. You may not add a three-slot list to a two-slot list. The extra slot has no partner.

Double the first stall: every slot times 2.

$$2 \times (5,\ 2,\ 8) = (10,\ 4,\ 16)$$

That stretch does not mix lamps into chairs. It scales the whole order at once.

Take the second stall away from the first:

$$(5,\ 2,\ 8) - (3,\ 4,\ 1) = (2,\ -2,\ 7)$$

The $-2$ is legal as a comparison: the first stall had two fewer chairs. If the slots are counts of objects on a table, a negative slot is not a possible count. The arithmetic still holds. Algebra already made that last ask.

The empty stall is $(0,\ 0,\ 0)$. Add it to any list and the list stays. Stretch a list by 0 and you get the empty stall.

Two lists that differ only by a stretch sit on one line of stalls. $(5,\ 2,\ 8)$ and $(10,\ 4,\ 16)$ are the same direction. $(5,\ 2,\ 8)$ and $(3,\ 4,\ 1)$ are not: there is no single number $c$ with $c \times (5,\ 2,\ 8) = (3,\ 4,\ 1)$, because $c \times 5 = 3$ wants $c = \frac{3}{5}$, and $\frac{3}{5} \times 2$ is not 4.

That ordered list is a **vector**. The slots are its **components**. How many slots it has is its **dimension** as a list of numbers, before chapter 8 reuses that word for a count of independent directions. This book writes a list in a row when it is a stall record, and down the page when it is about to meet a grid.

**Check.** New lists $(7,\ 0,\ 4)$ and $(1,\ 5,\ 2)$. Sum $(8,\ 5,\ 6)$. Triple the first: $(21,\ 0,\ 12)$. Difference, first minus second: $(6,\ -5,\ 2)$. A failing add: $(7,\ 0,\ 4) + (1,\ 5)$ has no third partner. Do not invent a zero for the missing slot unless a slot was measured and the measure was zero.

---

## 2. A grid of numbers

Two paint recipes share three pigments. Recipe Blue: 2 parts cobalt, 1 part white, 0 parts ochre. Recipe Warm: 0 parts cobalt, 3 parts white, 4 parts ochre. Write the recipes as rows, the pigments as columns:

$$
\begin{pmatrix}
2 & 1 & 0 \\
0 & 3 & 4
\end{pmatrix}
$$

Each meeting of a row and a column is one number. The shape is 2 by 3: two rows, three columns. A 3 by 2 grid is a different object. The same six numbers in a different shape name different meetings.

A second day's recipes:

$$
\begin{pmatrix}
1 & 0 & 2 \\
2 & 1 & 1
\end{pmatrix}
$$

Same shape, so you may add slotwise:

$$
\begin{pmatrix}
2 & 1 & 0 \\
0 & 3 & 4
\end{pmatrix}
+
\begin{pmatrix}
1 & 0 & 2 \\
2 & 1 & 1
\end{pmatrix}
=
\begin{pmatrix}
3 & 1 & 2 \\
2 & 4 & 5
\end{pmatrix}
$$

Stretch every slot by 3 and you scale both recipes at once.

A grid meets a list by walking each row across the list. Multiply matching slots, then add those products. Each row emits one outgoing number.

Take

$$
\begin{pmatrix}
4 & 1 \\
2 & 3
\end{pmatrix}
\begin{pmatrix}
5 \\
2
\end{pmatrix}
$$

First row against the list: $4 \times 5 + 1 \times 2 = 20 + 2 = 22$. Second row: $2 \times 5 + 3 \times 2 = 10 + 6 = 16$. Outgoing list $(22,\ 16)$.

The list must have as many slots as the grid has columns. A 2 by 3 grid wants a 3-slot list and emits a 2-slot list.

$$
\begin{pmatrix}
2 & 0 & 1 \\
4 & 3 & 0
\end{pmatrix}
\begin{pmatrix}
3 \\
1 \\
5
\end{pmatrix}
=
\begin{pmatrix}
2 \times 3 + 0 \times 1 + 1 \times 5 \\
4 \times 3 + 3 \times 1 + 0 \times 5
\end{pmatrix}
=
\begin{pmatrix}
11 \\
15
\end{pmatrix}
$$

That rectangular array is a **matrix**. The walk just done is **matrix-vector multiplication**. Writing the list down the page makes each slot face one column.

A grid of 1s and 0s that copies a list unchanged is a useful tool:

$$
\begin{pmatrix}
1 & 0 \\
0 & 1
\end{pmatrix}
\begin{pmatrix}
7 \\
4
\end{pmatrix}
=
\begin{pmatrix}
7 \\
4
\end{pmatrix}
$$

That copy-grid is an **identity matrix**. Other copy-grids of this kind sit on the diagonal of 1s for three slots, four slots, any matching square shape.

**Check.** New grid $\begin{pmatrix} 3 & 0 \\ 1 & 4 \end{pmatrix}$ times $(2,\ 5)$: first row $6 + 0 = 6$, second row $2 + 20 = 22$. Outgoing $(6,\ 22)$. A second new case: $\begin{pmatrix} 1 & 1 & 1 \end{pmatrix}$ times $(4,\ 0,\ 7)$ is $4+0+7=11$, one outgoing number. A third: $\begin{pmatrix} 1 & 2 \\ 0 & 5 \\ 3 & 1 \end{pmatrix}$ times $(4,\ 2)$ is $(8,\ 10,\ 14)$. Put those three back by writing each row's multiply-and-add. If any one fails, a slot was copied wrong.

---

## 3. Stretch and turn

Take the list $(3,\ 4)$. Double the first slot and leave the second: you get $(6,\ 4)$. Do that to $(1,\ 0)$ and you get $(2,\ 0)$. Do that to $(0,\ 1)$ and you get $(0,\ 1)$. The rule does not change when the incoming list changes. The grid that does this job is

$$
\begin{pmatrix}
2 & 0 \\
0 & 1
\end{pmatrix}
$$

A different rule swaps the slots and flips the sign of the new first slot: $(1,\ 0)$ goes to $(0,\ 1)$, and $(0,\ 1)$ goes to $(-1,\ 0)$. The picture is a quarter turn. The grid is

$$
\begin{pmatrix}
0 & -1 \\
1 & 0
\end{pmatrix}
$$

Send $(3,\ 4)$ through it: first row $0 \times 3 + (-1) \times 4 = -4$. Second row $1 \times 3 + 0 \times 4 = 3$. Outgoing $(-4,\ 3)$.

Two facts hold for both machines, and for every grid times a list.

Add two incoming lists, then send the sum through: you get the same outgoing list as sending each one through and adding. Stretch an incoming list by 5, then send it through: you get 5 times the outgoing list of the unstretched one.

Check the stretch-grid on $(3,\ 4) + (1,\ 0) = (4,\ 4)$. Outgoing $(8,\ 4)$. Separate: $(6,\ 4) + (2,\ 0) = (8,\ 4)$. Same. Stretch the incoming list by 5: $(15,\ 20)$ goes to $(30,\ 20)$, which is 5 times $(6,\ 4)$.

A machine that keeps those two facts is **linear**. Grid times list is linear because multiply-and-add is linear in the list. A machine that squares each slot is not. $(2,\ 0)$ goes to $(4,\ 0)$. Twice that incoming list is $(4,\ 0)$, which goes to $(16,\ 0)$, not to $2 \times (4,\ 0) = (8,\ 0)$. The square machine fails the stretch fact. It is not a grid-times-list machine.

Do one linear machine, then another. That is still one linear machine. Stretch-by-2-in-both after a swap:

$$
\begin{pmatrix}
2 & 0 \\
0 & 2
\end{pmatrix}
\begin{pmatrix}
0 & 1 \\
1 & 0
\end{pmatrix}
=
\begin{pmatrix}
0 & 2 \\
2 & 0
\end{pmatrix}
$$

Send $(3,\ 1)$ through the swap: $(1,\ 3)$. Then stretch: $(2,\ 6)$. The product grid times $(3,\ 1)$ is $(2,\ 6)$. Same pair. Order matters. Swap after the stretch is a different product. The product of two grids is **matrix multiplication**. The number of columns of the first factor in the written product must match the number of rows of the incoming grid. Here both are 2 by 2.

**Check.** New machine $\begin{pmatrix} 3 & 0 \\ 0 & 3 \end{pmatrix}$ times $(2,\ -1)$ is $(6,\ -3)$. Every slot stretched by 3. A second new case: the quarter-turn grid times $(0,\ 5)$ is $(-5,\ 0)$. Turn that again: $(0,\ -5)$. Two quarter turns reverse both slots. A third: additivity on the quarter-turn grid. $(1,\ 0) + (0,\ 1) = (1,\ 1)$ goes to $(-1,\ 1)$. Separate: $(0,\ 1) + (-1,\ 0) = (-1,\ 1)$. Same.

---

## 4. Many lines at once

Two true sentences can pin two letters. Algebra already unwrapped one pair by substitution. The new writing is a grid times a list of unknowns.

$$
3x + y = 14 \\
x - y = 2
$$

As a grid:

$$
\begin{pmatrix}
3 & 1 \\
1 & -1
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
14 \\
2
\end{pmatrix}
$$

Add the two sentences: $4x = 16$, so $x = 4$. Then $4 - y = 2$, so $y = 2$. Put both back into both sentences: $3 \times 4 + 2 = 14$. $4 - 2 = 2$. True in both.

Each row of the grid is one sentence's coefficients. The outgoing list is the pile each sentence names. Finding the incoming list is **solving a linear system**.

A picture: each sentence is a line of pairs. A pair that sits on both lines is a crossing. Chapter 9 of the algebra pack already crossed two rules. The grid is those two rules stored as rows.

Sometimes the rows are the same fact twice.

$$
3x + y = 14 \\
6x + 2y = 28
$$

The second row is twice the first, and the outgoing 28 is twice 14. Every pair on the first line is on the second. Infinitely many fills.

Change the outgoing pile:

$$
3x + y = 14 \\
6x + 2y = 30
$$

The second row is still twice the first, but 30 is not twice 14. No pair sits on both. The sentences fight.

Three sentences can pin three letters the same way. Three rows, three columns, one 3-slot unknown list. If a row is a stretch-and-add of the others, you have fewer independent facts than letters, and the same fork appears: many fills, or none.

**Check.** New pair: $2p + 3q = 17$ and $p - q = 1$. From the second, $p = q + 1$. Put into the first: $2(q+1) + 3q = 17$, so $2q + 2 + 3q = 17$, so $5q = 15$, $q = 3$, $p = 4$. Put back: $8 + 9 = 17$. $4 - 3 = 1$. True. A second new pair: $5x - y = 9$ and $2x + y = 12$. Add: $7x = 21$, $x = 3$, then $6 + y = 12$, $y = 6$. Put back: $15 - 6 = 9$. $6 + 6 = 12$. True. A fight: $4a + 2b = 10$ and $2a + b = 6$. The first row is twice the second, but 10 is not twice 6. No pair.

---

## 5. The special directions

Send $(1,\ 0)$ through the grid

$$
\begin{pmatrix}
5 & 4 \\
0 & 1
\end{pmatrix}
$$

Outgoing $(5,\ 0)$, which is 5 times $(1,\ 0)$. The list did not turn. It only stretched.

Send $(1,\ -1)$ through the same grid. First row $5 - 4 = 1$. Second row $0 - 1 = -1$. Outgoing $(1,\ -1)$, which is 1 times the incoming list. Again no turn. A stretch of 1 leaves the list as it was.

Send $(1,\ 1)$. Outgoing $(9,\ 1)$. That is not a stretch of $(1,\ 1)$, because a stretch would keep the two slots equal. This incoming list turned.

A list that comes out as a single stretch of itself is a **special direction** of the grid. The stretch amount is an **eigenvalue**. The list (except the zero list) is an **eigenvector**. The zero list always comes out zero, for every stretch amount, so it does not name a direction.

The two special amounts here are 5 and 1. They can be read from the diagonal when the grid is already triangular, as this one is: nothing sits below the diagonal, and the diagonal slots are 5 and 1. A general square grid hides those amounts. MIT OCW 18.06 is the long walk that finds them for a general square grid. This chapter's job is to see one, and to refuse a list that turned.

A grid may have fewer special directions than slots. $\begin{pmatrix} 2 & 1 \\ 0 & 2 \end{pmatrix}$ sends $(1,\ 0)$ to $(2,\ 0)$. Stretch 2. A list $(a,\ b)$ with $b \neq 0$ goes to $(2a+b,\ 2b) = 2(a,\ b) + (b,\ 0)$, which is not a stretch of $(a,\ b)$ unless $b = 0$. Only one special direction.

**Check.** New grid $\begin{pmatrix} 6 & 0 \\ 2 & 3 \end{pmatrix}$. Send $(0,\ 1)$: outgoing $(0,\ 3) = 3 \times (0,\ 1)$. Special, stretch 3. Send $(3,\ 2)$: outgoing $(18,\ 6+6) = (18,\ 12) = 6 \times (3,\ 2)$. Special, stretch 6. Send $(1,\ 1)$: outgoing $(6,\ 5)$. The slots 6 and 5 are not equal, so this is not a stretch of $(1,\ 1)$. A second new grid $\begin{pmatrix} 2 & 0 \\ 0 & 5 \end{pmatrix}$ on $(1,\ 0)$ stretches by 2, on $(0,\ 1)$ stretches by 5, on $(1,\ 1)$ emits $(2,\ 5)$, which turned.

---

## 6. Length and angle

Walk 6 steps east and 8 steps north. The two legs are 6 and 8. The straight path back to the start squares those legs, adds, and takes the square root: $36 + 64 = 100$, square root 10. The length of the list $(6,\ 8)$ is 10.

The same walk on $(5,\ 12)$: $25 + 144 = 169$, square root 13. On $(8,\ 15)$: $64 + 225 = 289$, square root 17. On $(9,\ 12)$: $81 + 144 = 225$, square root 15. Each of those is ordinary arithmetic you can redo. A list of three slots uses three squares: $(2,\ 3,\ 6)$ has $4 + 9 + 36 = 49$, square root 7.

That length is the **norm** of the list. The zero list has length 0. Stretch a list by 3 and the length stretches by 3. Stretch by $-3$ and the length still stretches by 3: length does not carry the sign.

How aligned two lists are uses the multiply-and-add of matching slots, the same walk a grid row already did.

$(3,\ 4)$ against $(4,\ 3)$: $12 + 12 = 24$.

$(5,\ 0)$ against $(0,\ 9)$: $0 + 0 = 0$. One list is pure east, the other pure north. The multiply-and-add vanishes. The lists meet at a right angle.

$(3,\ 0)$ against $(3,\ 4)$: $9 + 0 = 9$. The first list has length 3, the second length 5. The share $\frac{9}{3 \times 5} = \frac{3}{5}$ is how aligned they are. When the share is 1, the lists point the same way. When the share is 0, they are at a right angle. When the share is $-1$, they point opposite ways.

That multiply-and-add is the **dot product**. The share is the cosine of the angle between the lists. NIST DLMF chapter 4 is the official door for the cosine as an elementary function. This pack does not load a cosine table. The share $\frac{3}{5}$ is the number you need, and you already have it.

A right angle is the working test later chapters use. If two lists have multiply-and-add 0, they are **orthogonal**. The leftover in a projection will have to pass that test.

**Check.** Length of $(8,\ 15)$ is 17, already used as a walk; redo $64 + 225 = 289$. Length of $(4,\ 0,\ 3)$: $16 + 0 + 9 = 25$, square root 5. Multiply-and-add of $(2,\ 3)$ and $(4,\ 1)$ is $8 + 3 = 11$. Of $(7,\ 0)$ and $(0,\ 2)$ is 0: a right angle. Of $(3,\ 4)$ and $(3,\ 4)$ is $9 + 16 = 25$, which is the length 5 squared. A list against itself is always the square of its length.

---

## 7. Projection

A lamp stands at $(8,\ 6)$. The wall is the east-west line, the lists $(c,\ 0)$. Drop a perpendicular from the lamp to the wall. The foot of that drop is $(8,\ 0)$. The leftover is $(0,\ 6)$, straight north, multiply-and-add with the wall $0$. Right angle. That foot is the **projection** of $(8,\ 6)$ onto the east-west lists.

The same drop onto a wall that is not an axis. Take the wall through $(4,\ 3)$. That wall-list has length 5, because $16 + 9 = 25$. Multiply-and-add of $(8,\ 6)$ with $(4,\ 3)$ is $32 + 18 = 50$. The stretch amount along the wall is $\frac{50}{25} = 2$. The foot is $2 \times (4,\ 3) = (8,\ 6)$. The lamp already sat on that wall. Leftover $(0,\ 0)$.

A lamp off that wall: $(4,\ 4)$ onto $(2,\ 0)$. Multiply-and-add $8$. Wall against itself $4$. Stretch $\frac{8}{4} = 2$. Foot $2 \times (2,\ 0) = (4,\ 0)$. Leftover $(0,\ 4)$. Leftover against wall: $0$. The drop was true.

The rule in slots: for a list $a$ dropped onto a nonzero list $b$, the foot is

$$
\frac{a \cdot b}{b \cdot b}\, b
$$

The top is multiply-and-add. The bottom is the square of the length of $b$. You never divide by the length, then multiply by a unit list, unless you want that writing. Dividing by $b \cdot b$ keeps the arithmetic in whole squares.

The leftover $a$ minus the foot is orthogonal to $b$ when the drop is true. That is the check, not a courtesy. If the leftover still has a piece along $b$, you used the wrong stretch amount.

Dropping onto a whole plane of lists, not one line, is the same idea with more columns. Chapter 9 uses that for a fit.

**Check.** Project $(9,\ 12)$ onto $(3,\ 4)$. Multiply-and-add $27 + 48 = 75$. Bottom $9 + 16 = 25$. Stretch $3$. Foot $(9,\ 12)$. Already on the wall. A new drop: $(6,\ 2)$ onto $(1,\ 0)$. Foot $(6,\ 0)$. Leftover $(0,\ 2)$. Leftover against $(1,\ 0)$ is 0. A third: $(5,\ 5)$ onto $(3,\ 4)$. Multiply-and-add $15 + 20 = 35$. Bottom 25. Stretch $\frac{35}{25} = \frac{7}{5}$. Foot $\frac{7}{5}(3,\ 4) = \left(\frac{21}{5},\ \frac{28}{5}\right)$. Leftover $\left(\frac{4}{5},\ -\frac{3}{5}\right)$. Leftover against $(3,\ 4)$: $\frac{12}{5} - \frac{12}{5} = 0$. True.

---

## 8. How much is independent

Two lists $(2,\ 0)$ and $(6,\ 0)$ are the same direction. The second is 3 times the first. Keep one, throw the other away, and you can still reach every list on that line by stretching.

Two lists $(2,\ 0)$ and $(0,\ 5)$ are not stretches of each other. Stretch and add them and you can reach every list of two slots: $(2,\ 0)$ covers east-west, $(0,\ 5)$ covers north-south. Together they are a full set of directions for the page.

Three lists $(1,\ 2)$, $(2,\ 4)$, $(3,\ 6)$ all sit on one line. One independent list, two extras.

A pile of lists is **linearly independent** when none of them is a stretch-and-add of the others. Otherwise the pile is **dependent**. The number of lists you must keep to reach every list you could already reach is the **rank** of the pile. For a grid, rank is how many independent rows it holds, which is also how many independent columns it holds.

$$
\begin{pmatrix}
1 & 2 \\
2 & 4
\end{pmatrix}
$$

has rank 1: the second row is twice the first.

$$
\begin{pmatrix}
1 & 2 \\
3 & 4
\end{pmatrix}
$$

has rank 2: $\frac{2}{1} = 2$ and $\frac{4}{3}$ are not the same stretch.

The copy-grid of two slots has rank 2. The zero grid has rank 0.

A 2 by 2 grid sends the unit square with corners at $(0,\ 0)$, $(1,\ 0)$, $(1,\ 1)$, $(0,\ 1)$ to a parallelogram. $\begin{pmatrix} 2 & 0 \\ 0 & 3 \end{pmatrix}$ sends it to a rectangle of width 2 and height 3, area 6. $\begin{pmatrix} 3 & 1 \\ 6 & 2 \end{pmatrix}$ flattens the square onto a line, area 0, and the columns are dependent. That signed area is the **determinant**. For $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ the arithmetic is $ad - bc$. Nonzero determinant, independent columns, the grid is reversible. Zero determinant, the special-direction story of chapter 5 has a stretch amount 0, and some nonzero list goes to zero.

How many independent directions the picture has is the **dimension** of that picture. The whole page of two-slot lists has dimension 2. A line through the origin has dimension 1. The origin alone has dimension 0. Chapter 1's "three slots" was a count of components. This dimension is a count of independent directions.

**Check.** $(4,\ 2)$ and $(2,\ 1)$ are dependent: the first is twice the second. $(4,\ 2)$ and $(2,\ 3)$ are independent: no $c$ with $c \times (4,\ 2) = (2,\ 3)$, because $c = \frac{1}{2}$ from the first slot would need the second slot to be 1, not 3. New grid $\begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 2 & 3 & 0 \end{pmatrix}$: the third row is 2 times the first plus 3 times the second, and the third column is all zeros. Two independent rows, rank 2. Determinant of $\begin{pmatrix} 4 & 1 \\ 2 & 3 \end{pmatrix}$ is $12 - 2 = 10$, nonzero, rank 2. Determinant of $\begin{pmatrix} 4 & 2 \\ 2 & 1 \end{pmatrix}$ is $4 - 4 = 0$, rank 1.

---

## 9. A fit

Three people guess a hidden length: 11, 14, and 14. One number has to stand for all three. The average is $\frac{11+14+14}{3} = 13$. Leftovers: $-2$, $1$, $1$. Squares: $4 + 1 + 1 = 6$.

Pick 14 instead. Leftovers $-3$, $0$, $0$. Squares $9 + 0 + 0 = 9$, worse than 6. Pick 11. Leftovers $0$, $3$, $3$. Squares $0 + 9 + 9 = 18$, worse. Among constant guesses, 13 is the one whose leftover squares add to the least. That is a **least-squares** fit for a single unknown.

A line through the origin is the same job with a stretch. Hours $1,\ 2,\ 4$. Crates $3,\ 5,\ 6$. Want crates $\approx m \times$ hours.

$$
1 \cdot m \approx 3,\quad 2 \cdot m \approx 5,\quad 4 \cdot m \approx 6
$$

Three sentences, one unknown. They fight. Drop the crate list $(3,\ 5,\ 6)$ onto the hours list $(1,\ 2,\ 4)$, chapter 7. Multiply-and-add $3 + 10 + 24 = 37$. Hours against hours $1 + 4 + 16 = 21$. Stretch $m = \frac{37}{21}$. Predictions $\frac{37}{21}$, $\frac{74}{21}$, $\frac{148}{21}$. The leftover is orthogonal to the hours list, by the projection check.

A line with a starting pile as well as a slope uses two columns: a column of 1s, and a column of the incoming numbers. The crate list is dropped onto the plane of those two columns. The foot is the fitted pairs. OpenStax *Introductory Statistics* is the door for that picture as a scatter with a line through it. This pack owns the drop.

Work one two-column drop by hand. Incoming $0,\ 1,\ 2$. Outgoing $1,\ 2,\ 2$. The two columns are $(1,\ 1,\ 1)$ and $(0,\ 1,\ 2)$. Call the unknown intercept $b$ and the slope $m$. Multiply-and-add of the columns against themselves and each other:

| | ones | incoming |
|---|---:|---:|
| ones | 3 | 3 |
| incoming | 3 | 5 |

Outgoing against ones: $1+2+2=5$. Outgoing against incoming: $0+2+4=6$. The two sentences for the drop are

$$
3b + 3m = 5 \\
3b + 5m = 6
$$

Subtract: $2m = 1$, so $m = \frac{1}{2}$. Then $3b + \frac{3}{2} = 5$, so $3b = \frac{7}{2}$, $b = \frac{7}{6}$. Predictions: at 0, $\frac{7}{6}$; at 1, $\frac{10}{6}$; at 2, $\frac{13}{6}$. Leftovers $-\frac{1}{6}$, $\frac{1}{3}$, $-\frac{1}{6}$. Against ones: $-\frac{1}{6}+\frac{2}{6}-\frac{1}{6}=0$. Against incoming: $0 + \frac{1}{3} + 2\left(-\frac{1}{6}\right) = 0$. The leftover is orthogonal to both columns. The drop was true.

**Check.** New constant guesses 8, 10, 12. Average 10. Leftovers $-2$, $0$, $2$. Squares $4+0+4=8$. Pick 11: leftovers $-3$, $-1$, $1$. Squares $9+1+1=11$, worse. A new through-origin fit: incoming $(1,\ 2,\ 3)$, outgoing $(2,\ 5,\ 7)$. Multiply-and-add $2+10+21=33$. Incoming against itself $1+4+9=14$. Stretch $m=\frac{33}{14}$. Leftover against incoming must be 0: predictions $\frac{33}{14}$, $\frac{66}{14}$, $\frac{99}{14}$; leftover $\frac{28-33}{14}$, $\frac{70-66}{14}$, $\frac{98-99}{14}$ = $-\frac{5}{14}$, $\frac{4}{14}$, $-\frac{1}{14}$. Against $(1,\ 2,\ 3)$: $-\frac{5}{14}+\frac{8}{14}-\frac{3}{14}=0$. True.

---

## 10. A check

Two shops make lamps and chairs. Shop P: 3 lamps and 1 chair per shift. Shop Q: 1 lamp and 2 chairs per shift. A hall wants 11 lamps and 12 chairs.

$$
3p + q = 11 \\
p + 2q = 12
$$

From the first, $q = 11 - 3p$. Put into the second: $p + 2(11-3p) = 12$, so $p + 22 - 6p = 12$, so $-5p = -10$, $p = 2$. Then $q = 5$. Put both back into both original sentences: $6 + 5 = 11$. $2 + 10 = 12$. True. Two shifts at P and five at Q fill the hall.

The rows are independent: $\frac{3}{1} = 3$ and $\frac{1}{2}$ are not the same stretch. Determinant $3 \times 2 - 1 \times 1 = 5$, nonzero. One pair, not a line of pairs, not a fight.

A fill can satisfy the arithmetic and still fail the named thing. $p = 2$ and $q = 5$ are possible shift counts. A fill $p = -1$ in some other hall-sentence would unwrap and put back, and still not be a possible count of shifts. The last question is part of naming the slots.

A broken check is useful. Someone claims $p = 3$, $q = 2$ for this hall. Put back: $9 + 2 = 11$ on lamps, good; $3 + 4 = 7$ on chairs, not 12. The fill is wrong. Do not average 3 toward 2. Unwrap again from the original sentences.

Special directions close the same way. The grid $\begin{pmatrix} 5 & 4 \\ 0 & 1 \end{pmatrix}$ was claimed to stretch $(1,\ -1)$ by 1. Send it through: $(1,\ -1)$. It matches. Send $(1,\ 1)$ through: $(9,\ 1)$, not a stretch. The claim was for one list, not for every list.

A projection closes by the leftover test. Foot plus leftover must rebuild the original list, and leftover against the wall must be 0. If either fails, the stretch amount was wrong.

A fit closes by the same leftover test against every column you used. Chapter 9 already did that for ones and incoming. If a leftover still leans along a column, the line is not the drop.

Units ride along. Lamps are lamps. Shifts are shifts. The grid slots are lamps per shift and chairs per shift. Mixing lamps into the chair row without a conversion is a broken row, the same way a two-slot list cannot add to a three-slot list.

MIT OCW 18.06 is the next long walk on lists and grids. OpenStax *Introductory Statistics* is the scatter picture when the fit is the object you want as a graph. Named matrix identities live on the DLMF door in `LINK_INDEX.md`. Chapter 35 of that library is functions of a matrix argument.

