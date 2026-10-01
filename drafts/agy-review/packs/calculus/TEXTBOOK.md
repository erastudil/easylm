---
title: "calculus — slope, rate, area under a walk"
date: "2026-09-20"
status: draft
start: algebra
needs: algebra, numeracy
home: "drafts/agy-review/packs/calculus/"
---

# Slope, rate, and area under a walk

You already use a letter for a number you have not filled in yet. Algebra taught you to unwrap a sentence, to put a fill back in, and to read rise over run on a straight line. This book is the next act: a slope that can change as you walk, a rate at one instant, and the area sitting under that walk.

The walks here are that slope, that rate, and that area. The living math pack at `stacks/math/` is the undergrad survey of proof, later analysis, and named structures. This pack names that door and stops.

The longer courses live at official doors. OpenStax *Calculus Volume 1* is the long walk on a shrinking stretch, an instant slope, and an area of slices. OpenStax *Calculus Volume 2* is the long walk on a running pile and on adding forever. This pack links those doors. It does not copy those books. MIT OpenCourseWare course 18.01SC, *Single Variable Calculus*, taught by Prof. David Jerison in Fall 2010, is the lecture door for one variable. NIST's Digital Library of Mathematical Functions, Version 1.2.8, released 15 September 2026, keeps named elementary functions in chapter 4 and named integrals in chapter 6. That is the citation walk for this pack. Other math packs name the DLMF door and stop.


---

## 1. A hill and a slope

A path goes up a hillside. At the bottom a post stands at incoming 0 and height 4 metres. Eight metres of incoming walk later, the height is 28 metres.

The outgoing number rose by $28 - 4 = 24$ metres. The incoming number ran forward by $8 - 0 = 8$ metres. Rise over run is $\frac{24}{8} = 3$. Each metre of incoming walk raises the path 3 metres. Algebra already named that share the **slope** of a straight line. Here the hill is that line, stood up in the world.

The sentence of the path is $y = 3x + 4$. Fill $x = 0$: height 4. Fill $x = 8$: $24 + 4 = 28$. Same slope everywhere, because the multiply-by-3 does not change.

Walk a shorter piece of the same path. From $x = 2$ the height is $6 + 4 = 10$. From $x = 7$ the height is $21 + 4 = 25$. Rise $25 - 10 = 15$. Run $7 - 2 = 5$. Slope $\frac{15}{5} = 3$. Same hill, same slope.

A path that falls has a negative slope. From $(1, 18)$ to $(9, 2)$ the rise is $2 - 18 = -16$ and the run is $8$. Slope $\frac{-16}{8} = -2$. Each incoming metre drops the path 2 metres.

A path that does not rise has slope 0. From $(3, 11)$ to $(10, 11)$ the rise is 0 and the run is 7. Height stays 11.

Units ride along. If $x$ is seconds and $y$ is metres, slope is metres per second: a **rate**. If $x$ is hours and $y$ is litres, slope is litres per hour. Drop the units, and 3 is a number that no longer names the walk.

**Check.** A new walk on $y = 3x + 4$: from $x = 1$ to $x = 6$. Heights $7$ and $22$. Rise $15$, run $5$, slope $3$. A falling walk: from $(0, 20)$ to $(5, 5)$. Rise $-15$, run $5$, slope $-3$. A flat walk: from $(2, 9)$ to $(8, 9)$. Rise $0$, run $6$, slope $0$. Put each slope back as rise-per-run. If a put-back fails, the two posts were copied wrong.

Two posts give a slope. A third post either shares that slope with the first two, and sits on the same hill, or it does not. $(4, 16)$ with $(0, 4)$: rise $12$, run $4$, slope $3$. On the hill. $(4, 15)$ with $(0, 4)$: rise $11$, run $4$, slope $\frac{11}{4}$. Off the hill.

---

## 2. Instant change

A straight path has one slope for the whole walk. A path that bends does not.

Take $y = x^2 + 1$. At $x = 1$ the height is $2$. At $x = 3$ the height is $10$. Rise $8$, run $2$, slope $4$. That $4$ is the average steepness of a two-step stretch. The steepness at $x = 1$ is a different number, and so is the steepness at $x = 3$.

Shrink the stretch, left end glued at $x = 1$.

| right end | height | rise | run | slope |
|---:|---:|---:|---:|---:|
| 3 | 10 | 8 | 2 | 4 |
| 1.5 | 3.25 | 1.25 | 0.5 | 2.5 |
| 1.1 | 2.21 | 0.21 | 0.1 | 2.1 |
| 1.01 | 2.0201 | 0.0201 | 0.01 | 2.01 |

The slope of the stretch is heading toward 2. Make the run smaller still and the share sits closer to 2. That landing number is the steepness of the path at the single incoming value $x = 1$. People call that landing the **instant slope**, or the **derivative** of the walk at that point.

The shrink is the method. The landing is the object. If the shares bounce and do not head toward one number, that point has no instant slope you can name. This book stays with walks that do land.

A rate is the same object with units. Height in metres, incoming number in seconds: the landing is metres per second at that second. Not over the last two seconds. At that second.

**Check.** A new point on the same walk: $x = 4$, height $17$. Stretch to $4.1$: height $16.81 + 1 = 17.81$. Rise $0.81$, run $0.1$, slope $8.1$. Stretch to $4.01$: height $16.0801 + 1 = 17.0801$. Rise $0.0801$, run $0.01$, slope $8.01$. The shares head toward $8$. At $x = 4$ the instant slope is $8$. A second new point: $x = 0$, height $1$. Stretch to $0.1$: height $1.01$, slope $0.1$. Stretch to $0.01$: height $1.0001$, slope $0.01$. The shares head toward $0$. Flat at the bottom of that bowl.

Do not average $4$ and $8$ to guess the landing at $x = 1$. Average slope over a long stretch is a different object. Shrink from the point you asked about.

---

## 3. Rules for a slope

Shrinking a stretch works. It is also slow. After you have seen the shrink land on a pattern, you may use the pattern, then put it back against one new shrink.

On $y = x^2$ the landings were $2$ at $x = 1$ and $8$ at $x = 4$. Those landings are $2x$. Try $x = 3$: the pattern says $6$. Stretch $3$ to $3.01$: heights $9$ and $9.0601$. Rise $0.0601$, run $0.01$, slope $6.01$. Heading toward $6$. The pattern held.

On $y = x^3$ at $x = 2$ the height is $8$. Stretch to $2.01$: $2.01 \times 2.01 = 4.0401$, times $2.01 = 8.120601$. Rise $0.120601$, run $0.01$, slope $12.0601$. Heading toward $12$, which is $3 \times 2^2$. The landing looks like $3x^2$.

A constant walk $y = 4$ never rises. Every shrink has rise $0$. Instant slope $0$.

A straight walk $y = 7x$ has slope $7$ on every stretch. Instant slope $7$.

Add two walks, add the landings. $y = x^2 + 7x$ should have instant slope $2x + 7$. At $x = 5$ that is $17$. Height at $5$ is $25 + 35 = 60$. Height at $5.01$ is $25.1001 + 35.07 = 60.1701$. Rise $0.1701$, slope $17.01$. Heading toward $17$.

Multiply a walk by a constant, multiply the landing by that constant. $y = 3x^2$ has landing $6x$. At $x = 4$ that is $24$. Height $48$. Height at $4.01$ is $3 \times 16.0801 = 48.2403$. Rise $0.2403$, slope $24.03$. Heading toward $24$.

The pattern for a whole power: $x^n$ lands on $n x^{n-1}$. You saw $n = 2$ and $n = 3$. $n = 1$ is the straight walk $x$, landing $1$. $n = 0$ is the constant $1$, landing $0$. NIST DLMF chapter 4, *Elementary Functions*, Version 1.2.8, is the official door when a later walk is an exponential, a logarithm, a sine, or a cosine, and the landing has to be cited rather than re-shrunk. This pack does not copy those identities.

**Check.** A new walk: $y = 3x^2 + 5x$. Pattern: landing $6x + 5$. At $x = 4$ that is $24 + 5 = 29$. Height at $4$ is $48 + 20 = 68$. Height at $4.01$ is $3 \times 16.0801 + 5 \times 4.01 = 48.2403 + 20.05 = 68.2903$. Rise $0.2903$, slope $29.03$. Heading toward $29$. A second new walk: $y = x^2 - x$ at $x = 6$. Pattern: $2x - 1 = 11$. Height $36 - 6 = 30$. Height at $6.01$ is $36.1201 - 6.01 = 30.1101$. Rise $0.1101$, slope $11.01$. Heading toward $11$. If the shrink and the pattern disagree, you copied. Do not average them.

---

## 4. Thin slices

A walk has a height at each incoming number. Between two incoming numbers that height sits over a strip of the incoming axis. The strip has an area.

A cart runs at a steady 5 metres per second for 8 seconds. The graph of speed is a flat line at height 5. The strip is a rectangle: width 8 seconds, height 5 metres per second. Area $5 \times 8 = 40$. That area is 40 metres of path. Rate times time is distance when the rate stays.

Now the speed changes. Speed $v = 2t$ metres per second from $t = 0$ to $t = 4$. At $t = 4$ the speed is 8. The graph is a rising line. The region under it is a triangle: base 4, height 8, area $\frac{1}{2} \times 4 \times 8 = 16$ metres. The cart travelled 16 metres.

You can also pile rectangles and squeeze. Four 1-second slices, height taken at the right end of each slice: speeds 2, 4, 6, 8. Areas $2 + 4 + 6 + 8 = 20$. Too high, because each slice used the fastest speed in that second. Four slices with the left end: speeds 0, 2, 4, 6. Areas $12$. Too low. The true 16 sits between 12 and 20.

Eight slices of 0.5 second, right ends: speeds 1, 2, 3, 4, 5, 6, 7, 8. Each width 0.5, so the pile is $(1+2+3+4+5+6+7+8) \times 0.5 = 18$. Left ends: $(0+1+2+3+4+5+6+7) \times 0.5 = 14$. The window is now 14 to 18, still around 16. Thinner slices squeeze tighter.

That squeezed area under the walk is the **integral** of the walk from one incoming number to another. The slices are the method. The landing of the pile, as the slices get thin, is the object.

A slice below the incoming axis has negative height and subtracts. A walk that dips under zero spends negative area. Net area is signed. If you want paint on the paper, take the size of each piece and forget the sign. Those are two different questions. Name which one you are asking.

**Check.** A new speed $v = 3t$ from $t = 0$ to $t = 2$. Triangle base 2, height 6, area $6$. Two 1-second right slices: $3 + 6 = 9$. Left: $0 + 3 = 3$. Four 0.5-second right slices: $(1.5 + 3 + 4.5 + 6) \times 0.5 = 7.5$. Left: $(0 + 1.5 + 3 + 4.5) \times 0.5 = 4.5$. The window 4.5 to 7.5 still holds 6, and is tighter than 3 to 9. A second new walk: steady 7 metres per second for 3 seconds. Rectangle $21$ metres. No squeeze needed. The slice of a constant walk is already exact.

OpenStax *Calculus Volume 1* is the official long walk on this squeeze. MIT 18.01SC is the lecture door. The numbers above are invented cases. Redo the multiplies.

---

## 5. The two directions meet

One job reads how steep a walk is. The other job piles the height of a walk into an area. Those two jobs undo each other, once you name the starting height.

Take the walk $y = t^2$. From $t = 0$ to $t = 3$ the height rises from 0 to 9. The change in height is 9.

The instant slope of $t^2$ is $2t$, from chapter 3. Pile the area under $2t$ from 0 to 3. That graph is a triangle: base 3, height 6, area 9. Same 9. The area under the slope-walk, from here to there, is how much the original walk rose from here to there.

Start at $t = 1$ instead of 0. $y = t^2$ goes from 1 to 9 as $t$ goes from 1 to 3. Rise $8$. Area under $2t$ from 1 to 3: a trapezoid with heights 2 and 6, width 2. Area $\frac{2+6}{2} \times 2 = 8$. Same 8. The starting incoming number matters. The pile from here to there matches the rise from here to there.

The other way. Pile a rate into a running total, then read the instant slope of that total. You get the rate back. Speed $2t$, piled from 0, gives distance $t^2$. Instant slope of $t^2$ is $2t$. The speed you started with.

A starting pile that is not zero does not change the slope. Distance $t^2 + 4$ still has instant slope $2t$. The $+4$ is where you stood at $t = 0$. Area under the slope still recovers the rise, not the starting height. To recover the walk itself you must be told where it started, or where it stood at one incoming number.

This meeting is the load-bearing fact of the book. Shrink a stretch to get a slope. Slice a region to get an area. Do them in either order, with the starting height named, and you return.

NIST DLMF chapter 1, *Algebraic and Analytic Methods*, Version 1.2.8, is the methods door when a later pack must cite a named identity rather than re-walk this meeting. OpenStax *Calculus Volume 1* is the full school walk.

**Check.** A new walk $y = t^3$ from $t = 1$ to $t = 2$. Heights 1 and 8. Rise $7$. Instant slope $3t^2$. Area under $3t^2$ from 1 to 2 must be 7 if the meeting holds. The undo of $3t^2$ is $t^3$, and $8 - 1 = 7$. A second new walk: $y = t^2 + 4$ from $t = 2$ to $t = 5$. Heights $8$ and $29$. Rise $21$. Instant slope $2t$. Area under $2t$ from 2 to 5: trapezoid heights 4 and 10, width 3, area $\frac{4+10}{2} \times 3 = 21$. Same 21. If a later pair disagrees, a factor was dropped. Do not split the difference.

---

## 6. A graph of change

Take a walk. At each incoming number, write the instant slope as a new outgoing number. The new pairs are themselves a graph.

On $y = x^2 - 6x + 10$ the landing from chapter 3 is $2x - 6$. That slope-graph is a straight line. It crosses zero at $x = 3$.

| $x$ | height $y$ | instant slope |
|---:|---:|---:|
| 0 | 10 | $-6$ |
| 1 | 5 | $-4$ |
| 2 | 2 | $-2$ |
| 3 | 1 | 0 |
| 4 | 2 | 2 |
| 5 | 5 | 4 |

Where the slope-graph is negative, the original walk is falling: 10, then 5, then 2, then 1. Where the slope-graph is positive, the original walk is rising: 1, then 2, then 5. Where the slope-graph crosses zero, the original walk stops falling and starts rising. That point is a valley. Height at $x = 3$ is $9 - 18 + 10 = 1$, the lowest row in the table.

A peak is the other crossing: slope-graph goes from plus to minus. The original walk was rising, then falling.

A slope-graph that stays positive means the original walk only rises. $y = x^3 + x$ has landing $3x^2 + 1$, which is at least 1. Always rising.

Read the slope-graph as a story about the original, not as a second decoration. A slope-graph of metres per second, drawn against seconds, is the speed of a cart. Where that speed-graph sits above zero, the cart is moving forward. Where it sits below zero, the cart is moving back. Where it crosses zero, the cart turns.

The original walk's intercept, slope, and pairs still mean what algebra taught. The new graph is the rate of that walk at every incoming number at once.

**Check.** A new walk $y = -x^2 + 8x$. Landing $-2x + 8$. Zero at $x = 4$. Height at $4$ is $-16 + 32 = 16$. At $x = 2$, height $12$, slope $4$: still rising. At $x = 6$, height $12$, slope $-4$: now falling. A peak at $(4, 16)$. A second new walk: $y = x^2 - 4x + 7$. Landing $2x - 4$, zero at $x = 2$. Height $4 - 8 + 7 = 3$. At $x = 1$, height $4$, slope $-2$: falling. At $x = 3$, height $4$, slope $2$: rising. A valley at $(2, 3)$. If the slope-graph says zero and the original walk is still clearly rising through that point, you differentiated a different walk than the one you drew.

---

## 7. Accumulation

A tank holds 11 litres. A pipe adds water. The pipe's rate is the height of a walk. The water in the tank is the area under that walk, plus the 11.

Steady pipe, 5 litres per minute for 7 minutes. Rectangle $5 \times 7 = 35$ litres added. Tank ends at $11 + 35 = 46$ litres.

A pipe that changes: rate $2 + 3t$ litres per minute from $t = 0$ to $t = 4$. Instant slope of a pile $2t + \frac{3}{2}t^2$ is $2 + 3t$, by chapter 3 run backwards. At $t = 4$ that pile is $8 + \frac{3}{2} \times 16 = 8 + 24 = 32$ litres added. Tank ends at $11 + 32 = 43$ litres.

The running pile at each minute is an **accumulation**: how much has arrived so far. At $t = 2$, the pile $2t + \frac{3}{2}t^2$ is $4 + 6 = 10$ litres added, tank at 21. At $t = 0$ the pile is 0, tank at 11. The starting 11 never comes from the pipe. It is the height you were told at the start.

A pipe that empties has negative rate. Rate $7 - t$ from $t = 0$ to $t = 5$ starts at 7 litres per minute and falls to 2. Still filling, slower. Pile $7t - \frac{1}{2}t^2$. At 5 minutes: $35 - 12.5 = 22.5$ litres added.

Distance is accumulation of speed. Charge is accumulation of current. A bank balance is accumulation of deposits minus withdrawals. The graph is the same object. Name the units so the area names a thing.

OpenStax *Calculus Volume 2* is the official long walk once the pile is fluent and the next course wants methods for harder walks. This chapter is the pile itself.

**Check.** New starting tank 4 litres. Rate $7 - t$ from 0 to 5. Added $22.5$. End $26.5$ litres. A second new case: start 20 litres, steady drain 4 litres per minute for 3 minutes. Added $-12$. End 8 litres. A third: rate $2t$ from 0 to 4, start 0. Added 16, matching chapter 4's triangle. If the end amount and the start-plus-area disagree, the undo of the rate was wrong, or the start was dropped. Put the rate back as the instant slope of your pile and look again.

---

## 8. Adding forever

Add $\frac{1}{2}$, then $\frac{1}{4}$, then $\frac{1}{8}$, then $\frac{1}{16}$. The pile is $\frac{1}{2}$, then $\frac{3}{4}$, then $\frac{7}{8}$, then $\frac{15}{16}$. Each leftover is half the leftover before. The leftover heads toward 0. The pile heads toward 1.

You can keep adding. After $n$ terms the leftover is $\frac{1}{2^n}$, the pile is $1 - \frac{1}{2^n}$. No finite $n$ reaches 1. The landing of the forever-pile is 1.

Not every forever-pile lands. Add $1 + \frac{1}{2} + \frac{1}{3} + \frac{1}{4} + \frac{1}{5} + \frac{1}{6} + \frac{1}{7} + \frac{1}{8}$. Group: $1 + \frac{1}{2} + (\frac{1}{3}+\frac{1}{4}) + (\frac{1}{5}+\frac{1}{6}+\frac{1}{7}+\frac{1}{8})$. The pair $\frac{1}{3}+\frac{1}{4} = \frac{7}{12} > \frac{1}{2}$. The four $\frac{1}{5}+\frac{1}{6}+\frac{1}{7}+\frac{1}{8} > 4 \times \frac{1}{8} = \frac{1}{2}$. The pile already exceeds $1 + \frac{1}{2} + \frac{1}{2} + \frac{1}{2} = 2.5$. Later groups of the same shape each exceed $\frac{1}{2}$. The pile grows without a ceiling. Forever here does not land.

A pile that takes a constant share of the last term, with that share between $-1$ and $1$ and not $\pm 1$, does land. First term $\frac{2}{3}$, each next term one third of the last: $\frac{2}{3} + \frac{2}{9} + \frac{2}{27} + \frac{2}{81}$. Partial piles: $\frac{2}{3}$, $\frac{8}{9}$, $\frac{26}{27}$, $\frac{80}{81}$. Leftover $\frac{1}{3}$, $\frac{1}{9}$, $\frac{1}{27}$, $\frac{1}{81}$. The leftover heads toward 0. The pile heads toward 1.

The landing of first term $a$, share $r$ with $-1 < r < 1$, is $\frac{a}{1-r}$. For $a = \frac{2}{3}$ and $r = \frac{1}{3}$: $\frac{2/3}{2/3} = 1$. Same landing you saw by leftover. If $|r| \ge 1$ and $a$ is not 0, the terms do not shrink and the forever-pile does not land.

OpenStax *Calculus Volume 2* is the official door for which forever-piles land, and for tests this book does not walk. NIST DLMF chapter 1 is the methods door when a named series must be cited. The cases here are invented finite piles you can add by hand.

**Check.** A new pile: $\frac{4}{5} + \frac{4}{25} + \frac{4}{125}$. First term $\frac{4}{5}$, share $\frac{1}{5}$. Three-term pile: $0.8 + 0.16 + 0.032 = 0.992$. Leftover to the landing 1 is $0.008$, which is $\frac{1}{125}$. Pattern $\frac{a}{1-r} = \frac{4/5}{4/5} = 1$. A second new pile: $\frac{5}{10} + \frac{5}{100} + \frac{5}{1000} + \cdots$. First term $\frac{1}{2}$, share $\frac{1}{10}$. Landing $\frac{1/2}{9/10} = \frac{5}{9}$. Partial: $0.5 + 0.05 + 0.005 = 0.555$, heading toward $0.555\ldots = \frac{5}{9}$. If someone claims a forever-pile of $1 + 1 + 1 + \cdots$ lands on a finite number, the terms are not shrinking. Refuse the landing.

---

## 9. Related change

A square tile has side 5 centimetres. The side is growing 2 centimetres per second. The area is the side used as a factor twice. The area is growing too, and not at 2 centimetres per second.

Area $A = s^2$. Instant slope of $A$ with respect to $s$ is $2s$, from chapter 3. At $s = 5$ that is 10 square centimetres of area per centimetre of side. The side itself is growing 2 centimetres per second. Area's rate in time is $10 \times 2 = 20$ square centimetres per second.

The same number from the time rule: $A = s^2$, so the landing in time is $2s$ times the landing of $s$ in time. $2 \times 5 \times 2 = 20$. Two walks tied by a sentence. The rate of one, and the sentence, name the rate of the other.

A cube of side 5 centimetres, same growth 2 centimetres per second. Volume $V = s^3$. Landing in $s$ is $3s^2 = 75$. Times 2 centimetres per second: $150$ cubic centimetres per second.

A rectangle. Length 8 centimetres growing 1 centimetre per second. Width 3 centimetres shrinking 0.5 centimetres per second. Area $A = \ell w$. A little later the length has added a strip of size $w$ times the extra length, and the width has added a strip of size $\ell$ times the extra width. The tiny corner rectangle vanishes in the shrink. So the rate of area is $\ell$ times the width's rate plus $w$ times the length's rate: $8 \times (-0.5) + 3 \times 1 = -4 + 3 = -1$. Area is falling 1 square centimetre per second.

That tying of rates is **related change**. You do not shrink two stretches separately if you already have the sentence that ties the two letters and the two instant slopes.

Units must match the sentence. Side in centimetres, time in seconds, area in square centimetres. Mixing seconds of side-growth with minutes of area-growth is two stories. Convert first, the same way numeracy converted before adding.

**Check.** A new square, side 7 centimetres, growing 3 centimetres per second. Area rate $2 \times 7 \times 3 = 42$ square centimetres per second. A new cube, same side 7, same 3 centimetres per second. Volume rate $3 \times 49 \times 3 = 441$ cubic centimetres per second. A new rectangle: length 10 growing 2, width 4 growing 1. Area rate $10 \times 1 + 4 \times 2 = 18$. Put each back: after a tiny $0.01$ second the square of side 7 is side $7.03$, area $49.4209$, rise $0.4209$ in $0.01$ second, slope $42.09$, heading toward 42. If the tiny-step slope and the tied-rate sentence disagree, a factor $2s$ or $3s^2$ was dropped.

---

## 10. A check that closes

Write a walk. Find the instant slope at a new point two ways. The shrink and the rule must head toward the same number. Then pile a rate and take the slope of the pile. You must get the rate back. Name the letter, with units if there are units. Ask whether the landing can be a rate of the thing you named.

Walk $y = 2x^2 + 3$. Rule from chapter 3: instant slope $4x$. At $x = 5$ that is $20$. Height at 5 is $50 + 3 = 53$. Height at $5.01$ is $2 \times 25.1001 + 3 = 53.2002$. Rise $0.2002$, run $0.01$, slope $20.02$. Heading toward 20. Shrink and rule close.

Pile the rate $6x$ from $x = 1$ to $x = 4$. Undo: $3x^2$. $3 \times 16 - 3 \times 1 = 48 - 3 = 45$. Instant slope of $3x^2$ is $6x$. At $x = 4$ that is 24, which is the original rate at 4. Pile and slope close.

A tank starts at 11 litres. Rate $2 + 3t$ for 4 minutes. Chapter 7 added 32 litres, end 43. Instant slope of the pile $2t + \frac{3}{2}t^2$ is $2 + 3t$. At $t = 4$ that is 14 litres per minute, which is the pipe at minute 4. The tank amount 43 is a possible volume. The check closes.

A fill can satisfy the arithmetic and fail the named thing. Side of a square growing so fast that a later second would make the side negative is not a possible side. The algebra of the rate can still hold for a short stretch. The last question is whether the landing can be the thing you named.

A broken check is useful. Suppose someone claims the instant slope of $x^2$ at $x = 4$ is 4, copying the average slope from 0 to 4. Shrink $4$ to $4.01$: slope $8.01$, heading toward 8, not 4. Do not average 4 toward 8. Shrink from the point you asked about, or use the rule and put it back.

When a later pack writes a speed from a position, or a total from a rate, or two changing lengths tied by a sentence, it is this habit. The letter is a box. The walk has a slope. The region under the walk has an area. The two directions meet. Your job is to shrink or to slice, then ask whether the landing can be the thing you named.

OpenStax *Calculus Volume 1* is the next long walk on slope and area. *Calculus Volume 2* is the next walk when the pile and the forever-add are fluent. MIT 18.01SC, Jerison, Fall 2010, is the lecture door. NIST DLMF Version 1.2.8, released 15 September 2026, is the named-function door. The living math pack at `stacks/math/` is the undergrad survey. This pack named that door and stopped. The doors sit in `LINK_INDEX.md`.

