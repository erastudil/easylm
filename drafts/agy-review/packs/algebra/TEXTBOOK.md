---
title: "algebra — a letter for a number"
date: "2026-09-16"
status: draft · agy review · start: count
home: "drafts/agy-review/packs/algebra/"
needs: ["numeracy"]
---

# A letter that stands for a number

You can already add, multiply, share, and name a percent. This book is the move the math and physics packs assume: write a box for a number you have not filled in yet, then undo the wrapping until the box is alone.

---

## 1. A box

A bag holds some apples. You do not count them yet. You still need a way to talk about that bag in a sentence with other numbers.

Pick a letter. People often pick $x$. The letter is a name for the unknown count, the same way "the bag" is a name for the bag.

$x + 3$ means the bag, and three more apples beside it.

$2x$ means two bags of the same size, which is $x + x$.

The letter is not a secret code. It is a blank you are allowed to write in a line of arithmetic.

---

## 2. The same amount on both sides

A balanced scale. Left pan: the bag and 3 loose apples. Right pan: 11 apples. The pans match.

Whatever you do to one pan, do to the other, or the match breaks. Take 3 apples off both pans. Left: the bag. Right: 8 apples. So the bag was 8.

We write that story as:

$$x + 3 = 11$$

Take 3 from both sides:

$$x = 8$$

The written sentence with an equals sign is an **equation**. Both sides name the same amount. The work is keeping that sameness while you unwrap.

**Check.** Put 8 back in. $8 + 3 = 11$. True.

---

## 3. Undoing

Each move has a reverse.

| you wrapped with | undo by |
|---|---|
| add 4 | subtract 4 |
| subtract 4 | add 4 |
| multiply by 3 | divide by 3 |
| divide by 3 | multiply by 3 |

Unwrap from the outside, the last wrap first.

$3x + 2 = 14$. First the $+2$ was added to $3x$. Subtract 2: $3x = 12$. Then the $3$ was a multiply. Divide by 3: $x = 4$.

**Check.** $3 \times 4 + 2 = 14$.

A wrap you must not undo by dividing: both sides zero, or a hidden divide by zero. If your unwrap asks you to divide by $x - x$, you have left the legal moves. Stop and look at the original sentence.

---

## 4. Letters on both sides

$2x + 1 = x + 7$.

The unknown sits in two places. Gather the bags on one side and the loose numbers on the other, still doing the same thing to both sides.

Subtract $x$ from both sides: $x + 1 = 7$. Subtract 1: $x = 6$.

**Check.** Left: $2 \times 6 + 1 = 13$. Right: $6 + 7 = 13$.

If the bags cancel and you get a true number sentence with no letter, $4 = 4$, every number works. If you get a false one, $4 = 5$, no number works. Those two outcomes are legal. They are the whole story for that sentence.

---

## 5. A picture of a rule

Take a number. Multiply by 2. Add 1. That rule eats one number and gives another.

When the incoming number is 0, the outgoing is 1. When 1 comes in, 3 goes out. When 2 comes in, 5 goes out.

Draw two number lines, or a grid with incoming across and outgoing up. Put a dot at each pair. The dots sit on a straight line.

The rule $y = 2x + 1$ is that line. $y$ is the outgoing number. $x$ is the incoming. The steepness is how much $y$ rises when $x$ steps by 1. Here it rises by 2. That rise-per-step is the **slope**.

The line hits the outgoing axis, where $x = 0$, at $1$. That hit is the **intercept**.

**Check.** From $x = 3$ to $x = 4$, $y$ goes from 7 to 9. Rise 2, step 1, slope 2.

Physics will call a similar picture a graph of motion. Finance will call it a graph of a balance. Same object: a rule you can see.

---

## 6. Two rules at once

Two lines on the same grid. Where they cross, both rules are true at the same time.

$y = 2x + 1$ and $y = 11 - x$. At the crossing, the two $y$ names are the same amount, so $2x + 1 = 11 - x$. That is chapter 4. $x = \frac{10}{3}$, $y = \frac{23}{3}$.

You may also add or subtract the two sentences so one letter vanishes. That is legal because both sentences name true amounts, and sums of equals are equal.

**Check.** Plug both numbers back into both rules.

No crossing: the lines are parallel, same slope, different intercept. Every crossing: the lines are the same line written twice.

---

## 7. Powers

$x \times x$ is $x^2$. The small 2 counts how many times $x$ is a factor. $x^3 = x \times x \times x$.

$x^2$ is not $2x$. Two bags is $2x$. A square of side $x$ has area $x^2$. Those are different pictures.

A square root undoes a square for amounts that are not negative: if $x^2 = 9$, then $x = 3$ or $x = -3$, because $(-3) \times (-3) = 9$ as well.

**Check.** $(5)^2 = 25$. $(10)^2 = 100$. A square that grows from side 10 to side 11 does not grow its area by 1. It grows by $21$. Area is not linear. That surprise is why physics and finance cannot live on slope alone.

---

## 8. A formula you will meet later

A changing amount, a small step in time, a rise. Slope of a curve at one point is the idea calculus names a **derivative**. You do not need the full machine yet. You need this: if $y$ is meters and $x$ is seconds, the slope is meters per second, a speed.

Undo of slope, adding up thin slices of height times width, is the idea calculus names an **integral**. Area under a speed graph is distance.

The math pack will make those names precise.

---

## 9. Worked habit

1. Write the sentence with a letter.
2. Name what the letter counts, with units if there are units.
3. Unwrap, same move on both sides.
4. Put the number back in.
5. Ask whether the number is a possible count: negative apples, a divide by zero, a slope with mixed units.

When a later pack writes $F = ma$ or $PV = nRT$ or $A = P(1 + r)^t$, it is this habit. The letters are bags. The equals is a scale. Your job is to keep the scale true.
