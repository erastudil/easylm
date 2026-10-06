---
title: "real_analysis — a limit that is honest"
date: "2026-09-21"
status: draft
start: undergrad
needs: calculus
home: "drafts/agy-review/packs/real_analysis/"
---

# A limit that is honest

A rain stick on the Reed Cut towpath holds last night's water. You walk it at dawn, at nine, at noon. Each reading is a height in millimeters. The heights drop. Someone says they head toward a dry stick. That sentence is a promise about later readings, not a mood about rain.

You already have slope, rate, and area under a walk. Those three live in the calculus book. OpenStax Calculus Volume 1 is that door. MIT OpenCourseWare 18.01SC Single Variable Calculus is that door too. Name them and stop. This book is the next skill: you pick how close is close enough, then you find a stage after which every later reading stays inside that closeness.

The function-table door and the long course door are in `LINK_INDEX.md`. A publication year or a chapter count that the page did not show is unverified.

---

## 1. A limit that is honest

Nia reads the Holt mill hopper every minute after the gate opens. Minute 1: the grain sits 1/4 meter high. Minute 2: 1/5 meter. Minute 3: 1/6 meter. The heights are 1/(n+3) meters after n minutes. They drop. Someone claims they head toward an empty hopper.

A guess is cheap. Honesty is a deal. Nia names a closeness first. She names 0.02 meter. Then she must find a minute N after which every later reading is closer to 0 than 0.02 meter. If she cannot find that N, the claim is not earned for that closeness.

At minute n the distance from empty is 1/(n+3). She needs 1/(n+3) < 0.02. That is 1/(n+3) < 1/50, so n+3 > 50, so n > 47. Minute 48 works. At n=48 the height is 1/51 meter, which is less than 0.02. At n=49 it is smaller still. Every later minute stays inside 0.02. The deal holds for this closeness.

The closeness she named first is **epsilon**. People write it as a positive number you are free to pick, as small as you like, before you hunt for N. The stage she found is **N**. The claim that the heights head toward 0 is a **limit**. In signs: the limit of 1/(n+3) as n goes through 1, 2, 3, ... is 0.

The order is the honesty. Epsilon first. N second. If you name N first and then invent a closeness that happens to fit, you have a story, not a deal a stranger can replay with a tighter closeness.

A limit can be a number other than 0. The hopper that sits 4 + 1/(n+3) meters high heads toward 4, by the same deal, because the extra 4 does not move.

**Check.** Same hopper 1/(n+3). New closeness 0.01 meter. You need n+3 > 100, so n > 97. Take N=98. At n=98 the height is 1/101, which is less than 0.01. If you wrote N=50, you answered the old closeness.

New case: a rain stick that reads 2 + 3/(n+1) millimeters after n walks. The claim is that the readings head toward 2. Distance from 2 is 3/(n+1). For closeness 0.05 you need 3/(n+1) < 0.05, so n+1 > 60, so n > 59. Take N=60. At n=60 the distance is 3/61, which is less than 0.05. If you chased 0 instead of 2, you measured the wrong pile.

---

## 2. Completeness

Ivo walks Reed Cut with a chain marked only at fractions of a meter. Every mark is a ratio of whole numbers. Between any two marks he can find another. The chain still has holes.

He wants a post whose distance L from the lock satisfies L times L equals 7. Two meters: 4, too small. Three meters: 9, too big. 2.6 meters: 2.6 times 2.6 is 6.76, still under 7. 2.7 meters: 2.7 times 2.7 is 7.29, over 7. No fraction on the chain hits 7 on the nose. The hole sits between 2.6 and 2.7, and between any later pair of fractions that squeeze it.

A nested pair of marks can shrink forever and still refuse to land on a fraction. The real line fills that hole. Every nested shrinking closed stretch of real numbers, with lengths heading to 0, holds exactly one real point. Every nonempty pile of real numbers that has an upper bound has a least upper bound. People name that filling **completeness**.

The least upper bound of the pile of chain-marks whose square is less than 7 is the missing L. The pile is bounded above by 3. Completeness hands you a least such cap. That cap squares to 7. The rationals do not hand you that cap as one of their own marks.

MIT OpenCourseWare 18.100A, Fall 2020, studies real numbers as the place where those abstract claims earn their keep. The longer construction of the reals from cuts or from Cauchy piles lives at that course door. This chapter needs the filling, and the right to use it.

A decreasing hopper that never goes below 0 must settle. Completeness is why. Bounded and always dropping is enough. The rationals can drop toward the hole at square 7 and never settle on a mark.

**Check.** Write two fractions around the hole for square 7: 2.6 with square 6.76, and 2.7 with square 7.29. The hole is in between. If you wrote 2 and 3 only, you named a yard, not a squeeze.

New case: a post whose cube is 20. Two cubed is 8. Three cubed is 27. 2.7 cubed is 2.7 times 2.7 times 2.7, which is 7.29 times 2.7, which is 19.683, under 20. 2.8 cubed is 7.84 times 2.8, which is 21.952, over 20. The hole sits between 2.7 and 2.8. Completeness puts a real number there. The chain of fractions does not have to.

---

## 3. Sequences

Oak Pier posts a wait, in minutes, each morning for fourteen days. Day 1: 12. Day 2: 9. Day 3: 8. Day 4: 7.5. After that the posted wait is 6 + 6/n minutes on day n. The list 12, 9, 8, 7.5, ... is a **sequence**. One number for each whole n, in order.

A sequence can head toward a number. That is the limit from chapter 1, now said of a list. For 6 + 6/n the extra term is 6/n. For closeness 0.1 you need 6/n < 0.1, so n > 60. Day 61 and every later day sit inside 0.1 of 6. The limit is 6.

A sequence can refuse. The waits 2, 9, 2, 9, 2, 9, ... never settle. No N puts every later wait inside 0.5 of a single number, because 2 and 9 stay 7 apart.

Honesty has a second form that does not name the landing first. Take two late days n and m, both after some stage N. If those two waits are always close to each other, the list is squeezing even if you have not yet named the limit. People name that a **Cauchy** sequence. Completeness of the line says every Cauchy sequence of real numbers has a real limit. On the chain of fractions, a Cauchy list can squeeze toward the hole at square 7 and fail to land on a mark.

If a sequence has a limit, it is Cauchy. If two late terms are each within epsilon/2 of the same landing, they are within epsilon of each other. The converse needs completeness.

Bounded is weaker than Cauchy. The 2, 9, 2, 9 list is bounded. It is not Cauchy.

**Check.** The list 4 + 1/n. Distance from 4 is 1/n. For closeness 0.05 you need n > 20. Take N=21. At n=21 the distance is 1/21, which is less than 0.05. Write 4 as the limit. If you wrote 5, you measured from the wrong landing.

New case: the list 11 - 2/n. Distance from 11 is 2/n. For closeness 0.08 you need 2/n < 0.08, so n > 25. Take N=26. At n=26 the distance is 2/26, which is less than 0.08. Two late terms after day 26 are each within 0.08 of 11, so within 0.16 of each other. That is the Cauchy deal for a looser closeness, read off the same N.

---

## 4. Continuity

Pell cracks a kiln damper a finger width and the pyrometer on the shelf moves. The damper setting is an input. The temperature is an output. A small move of the damper should make a small move of the pyrometer if the kiln is steady.

Honesty is again a deal. Pell names a closeness for temperature first, say 0.5 degree. Then he must find a closeness for the damper, a width delta, so that every damper setting within delta of the present setting keeps the temperature within 0.5 degree of the present temperature. If he can do that for every positive temperature closeness, the output **depends continuously** on the input at that setting. People name that **continuity** at a point.

A jump kills the deal. The kiln has a latch. Below 4 on the damper the flame is off and the pyrometer reads 20. At 4 and above the flame is on and the pyrometer reads 80. Sit at 4. Name temperature closeness 10. Any damper width, however small, still includes settings below 4 where the reading is 20, which is 60 away from 80. No delta earns 10. The output is not continuous at 4.

A line with a steady slope is continuous. The rule 3x + 1 at x=2 gives 7. A change of size h in x changes the output by 3h. To keep 3h inside 0.12 you keep h inside 0.04. Delta is 0.04 for that epsilon. The same pattern works at every x.

Continuity on a closed stretch from a to b is continuity at every point of that stretch, ends included. On a closed kiln range the same delta can often be chosen to work for the whole range when the rule is a line. That stronger sameness is **uniform continuity**. MIT OpenCourseWare 18.100A owns the long walk for uniformity and for sequences of functions. Name that door and stop.

**Check.** Rule 3x + 1 at x=2. Output 7. Want output closeness 0.12. Need |x-2| < 0.04. Write delta = 0.04. If you wrote 0.12 for delta, you copied epsilon onto the damper.

New case: rule 5x - 4 at x=3. Output 11. Want output closeness 0.2. The change in output is 5 times the change in x, so you need |x-3| < 0.04. Write delta = 0.04. Same 0.04 as the last check, new slope, new epsilon. If you reused 0.12, you ignored the 5.

---

## 5. A derivative as a limit

Two posts sit on Reed Cut, one at 3 meters from the lock and one a little farther. The towpath height at a post x meters from the lock is x times x, in meters. At 3 meters the height is 9. At 3+h the height is (3+h) times (3+h), which is 9 + 6h + h times h. The rise over the run is (6h + h times h)/h, which is 6+h, for h not 0.

The calculus book owns slope and slices. Name that door and stop. This chapter owns the honesty of the remaining limit. You want the rise-over-run numbers to head toward a single number as h heads toward 0, h never 0. That landing, when it exists, is the **derivative** at 3. Here the rise-over-run is 6+h, so the landing is 6.

Epsilon first, still. Name 0.01. You need |h| < 0.01, h not 0. Then 6+h sits inside 0.01 of 6. The deal is the same deal as chapter 1, now said of a difference quotient.

If the landing fails, there is no derivative at that post. A corner with two different side landings fails. A jump in height fails. Continuity of the height is needed, and it is not enough. A kink can be continuous and still refuse one landing for the rise-over-run.

The derivative is a function of the post when the landing exists at many posts. For height x times x the landing at a post a is 2a. At 3 it was 6. At 5 it will be 10. The calculus book owns the shortcut rules that spit 2a out. This book owns why 2a is a limit of ( (a+h) times (a+h) - a times a ) / h.

**Check.** Height x times x at the 3-meter post. Rise-over-run 6+h. For closeness 0.01, take |h| < 0.01, h not 0. Write 6 for the derivative. If you wrote 9, you copied the height.

New case: the same height rule at the 5-meter post. Height 25. Rise-over-run (25 + 10h + h times h - 25)/h = 10+h. Landing 10. For closeness 0.02, take |h| < 0.02, h not 0. Write 10. If you wrote 6, you stayed at the old post.

---

## 6. An integral as a limit of sums

A rain board 5 meters long sits under the Holt gutter, wet to a height of 2 millimeters all along. Area of wetness is height times length if the height is steady: 2 times 5 = 10 square millimeters. Cut the board into 7 equal planks. Each plank is 5/7 meter wide and 2 millimeters high. Seven rectangles. Sum: 7 times (2 times 5/7) = 10. Cut into 11 planks. Sum still 10.

The calculus book owns slices. Name that door and stop. This chapter owns the honesty of the remaining limit. When the height changes along the board, each plank gets its own height, taken at the left edge, or the right, or a sample inside. You add those rectangle areas. Then you drive the plank width toward 0. If those sums head toward one number, independent of how you sample inside each plank as the mesh goes to 0, that number is the **definite integral** of the height along the board. People also name the rectangle sum a **Riemann sum**, and the integral a **Riemann integral**.

A jump of finite size still lets the sums settle. A wild height that spikes on every fraction can refuse. 18.100A owns the long walk for which heights earn a Riemann integral. Name that door and stop.

Take height equal to position x, from 0 to 4 meters, in millimeters per meter of board. Four planks of width 1. Left samples 0, 1, 2, 3. Sum 0+1+2+3 = 6. Right samples 1, 2, 3, 4. Sum 10. The two sums disagree by 4. Eight planks of width 1/2. Left samples 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5. Sum of samples is 14. Times width 1/2 is 7. The left sums climb toward 8. The right sums drop toward 8. The integral is 8.

The landing 8 is the area under that walk. Completeness is why the squeezed left and right piles have a common real cap.

**Check.** Height 2 on a board of length 5. Seven planks or eleven, the sum is 10. Write 10. If you wrote 7, you counted planks instead of area.

New case: height x from 0 to 4, eight planks, left sum 7 as above. The true landing is 8. The gap 8-7=1. If you claimed the left sum was already the integral, you stopped before the limit.

---

## 7. Series that earn it

Holt mill dumps 1/5 kilogram of grain, then 1/25 kilogram, then 1/125 kilogram, and keeps that pattern. The n-th dump is 1/5^n kilograms. The running total after one dump is 1/5. After two dumps: 1/5 + 1/25 = 6/25. After three: 6/25 + 1/125 = 31/125. The running totals are a sequence. If that sequence has a limit, the endless dump **earns a sum**. People name the endless dump a **series**, and the running totals **partial sums**.

A geometric dump with first term a and common ratio r, with r between -1 and 1 exclusive of the ends, earns a/(1-r). Here a=1/5 and r=1/5, so the sum is (1/5)/(4/5) = 1/4 kilogram. Partial sums 0.2, 0.24, 0.248, heading toward 0.25. You can see the formula from S = a + r S, so S - r S = a, so S(1-r)=a, once you believe the limit exists. Completeness plus the Cauchy deal on the tail earn existence when |r| < 1.

Not every dump earns a sum. Add 1/2, then 1/3, then 1/4, then 1/5, ... Group 1/2. Then 1/3+1/4, which is more than 1/2. Then 1/5+1/6+1/7+1/8, which is more than 4 times 1/8, which is 1/2. Each next block of doubling length adds more than 1/2. The partial sums pass 1/2, then 1, then 3/2, without bound. The series does not earn a finite sum. People name that the **harmonic** series.

A series of positive terms that sits under a geometric dump with |r|<1 earns a sum. A series whose terms do not head to 0 cannot earn a sum. Terms heading to 0 is not enough, as the harmonic dump shows.

Sequences of functions, and when two limits may trade places, live at 18.100A. Name that door and stop.

**Check.** Dumps 1/5 + 1/25 + 1/125 + ... Write the earned sum 1/4. Partial sum after two dumps is 6/25 = 0.24, which is 0.01 short of 0.25. If you wrote 1/5 for the endless sum, you stopped at the first dump.

New case: dumps 2/3 + 2/9 + 2/27 + ... First term 2/3, ratio 1/3. Earned sum (2/3)/(2/3) = 1. Partial sums: 2/3, 8/9, 26/27. After three dumps you sit 1/27 short of 1. If you wrote 2, you added the first term to itself and called it a sum.

---

## 8. The line as a space

Every mark on the Reed Cut chain has nearby marks, and some stretches of chain include their ends. Distance between two points x and y is the absolute value |x-y|. That one number, with the filling from chapter 2, turns the line into a **space** you can talk about without a picture of a towpath.

A **neighborhood** of the 7-meter post, of radius 0.3, is every point whose distance from 7 is less than 0.3. It is the open stretch (6.7, 7.3). The ends 6.7 and 7.3 are out. An **open** stretch does not include its ends. A **closed** stretch [2, 8] includes 2 and 8.

A pile of points is **bounded** if some neighborhood of 0, large enough, holds all of them. [2, 8] is bounded. The whole line is not.

An infinite list stuffed into [2, 8] must cluster. The list 4, 7, 4, 7, 4, 7, ... has two cluster points, 4 and 7, both inside [2, 8]. The list 7, 7.5, 7.25, 7.125, ... heads toward 8, and 8 is inside [2, 8]. People name that forced clustering **Bolzano-Weierstrass**. Completeness is the engine. A closed bounded stretch of the line is the kind of set where this happens.

Cover [2, 8] with open stretches. Finitely many of them already do the job. That is the line's compact gift, often named **Heine-Borel** after you have seen the finite subcover. 18.100A owns the proof. Name that door and stop.

Limits, continuity, and Cauchy lists are now sentences about distance. |a_n - L| < epsilon is the n-th term sitting in the epsilon-neighborhood of L. Continuity is: the output-neighborhood has a matching input-neighborhood.

**Check.** Open stretch (2, 8). Is 2 in. No. Is 8 in. No. Is 2.01 in. Yes. Write those three answers. If you put 2 in, you closed the stretch.

New case: closed stretch [2, 8]. 2 is in. 8 is in. 1.99 is out. The neighborhood of 2 of radius 0.3 sticks out of [2, 8] to the left. Closed is not the same as open. If you treated 2 as an interior point of [2, 8], you borrowed a neighborhood the stretch does not own.

---

## 9. A proof that closes

A stranger names 0.03 as the closeness they will accept for the claim that (5n+1)/(n+2) heads toward 5. You may not wave. You write a chain that starts at the named closeness and ends at an N the stranger can check.

Distance from 5:

|(5n+1)/(n+2) - 5| = |(5n+1 - 5(n+2))/(n+2)| = |(5n+1 - 5n - 10)/(n+2)| = 9/(n+2).

You need 9/(n+2) < 0.03. That is 9 < 0.03 (n+2), so n+2 > 9/0.03 = 300, so n > 298. Take N=299. For every n at least 299, the distance is 9/(n+2) which is at most 9/301, and 9/301 is less than 0.03.

The chain has four jobs, in order.

1. Name epsilon. Here 0.03, given by the stranger.
2. Rewrite the distance until it is a simple comparison, here 9/(n+2).
3. Solve the comparison for n. Here n > 298.
4. Pick a whole N that is large enough, here 299, and state that every later n works.

If any job is missing, the proof does not close. An N without the algebra is a guess. Algebra without a named epsilon is a calculation with no deal.

The same chain works for Cauchy form. After N=299, two terms n and m both at least 299 each sit within 0.03 of 5, so within 0.06 of each other.

18.100A, Fall 2020, Dr. Casey Rodriguez, teaches construction of proofs as a course object, next to the theorems. The live page is the door for the longer drills. This chapter owns the four-job chain for a limit on the line.

**Check.** Redo 9/301 against 0.03. 0.03 times 301 is 9.03. 9 < 9.03, so 9/301 < 0.03. Write 9.03. If you compared 9 to 300, you dropped the +1 in 301.

New case: claim that (7n-2)/(n+1) heads toward 7. Distance |7n-2 - 7(n+1)|/(n+1) = 9/(n+1). Stranger names 0.05. Need n+1 > 9/0.05 = 180, so n > 179. Take N=180. At n=180 the distance is 9/181. 0.05 times 181 is 9.05, and 9 < 9.05. If you reused N=299, you answered the old fraction.

---

## 10. A check

After n minutes the Holt hopper stands 8/(n+1) meters high. The claim is that the heights head toward 0.

Limit. Name closeness 0.01. Need 8/(n+1) < 0.01, so n+1 > 800, so n > 799. Take N=800. At n=800 the height is 8/801, which is less than 0.01. Every later minute is smaller. The deal holds.

Completeness. The list 8, 4, 8/3, 2, 8/5, ... drops at every step and stays above 0. A decreasing sequence that is bounded below has a real limit. That is completeness, used. The limit cannot be a number L greater than 0, because eventually 8/(n+1) falls below L/2. So the limit is 0, which matches the deal.

Sequences. The same list is Cauchy. After minute 800 every term sits inside 0.01 of 0, so two late terms sit inside 0.02 of each other.

Continuity. The rule 8/(x+1) for x > 0 moves steadily. At x=3 the output is 2. A small move of x makes a small move of 8/(x+1). The hopper list is this rule sampled at whole minutes.

A derivative as a limit. The calculus book owns the shortcut for the slope of 8/(x+1). Name that door and stop. The difference quotient at a post a>0 is a limit in the sense of chapter 5. This check does not need its value.

An integral as a limit of sums. The area under 8/(x+1) from 1 to 3 is a Riemann-sum limit. 18.100A owns the longer existence walk. Name that door and stop.

Series. The dumps 8/2 + 8/3 + 8/4 + ... are 8 times a tail of the harmonic series. They do not earn a finite sum. Heights heading to 0 did not make the series earn it.

The line as a space. Each height 8/(n+1) sits in (0, 8]. The list clusters at 0. 0 is a limit point of the set of heights. 0 is not one of the heights.

A proof that closes. Epsilon 0.01. Distance 8/(n+1). N=800. For n at least 800, 8/(n+1) at most 8/801. 0.01 times 801 is 8.01, and 8 < 8.01. Four jobs, done.

Open the 18.100A door. Copy the course number, the term Fall 2020, and the instructor name Dr. Casey Rodriguez. If those three match, you have the living page this book used. If the host is dark, write unverified and do not invent a term.

Open the DLMF door. Copy Version 1.2.8 and release date 2026-09-15 if they still show. The version walk lives in the calculus book. Name the door and stop. If the host shows a later version, the door wins.

The OpenStax Calculus Volume 1 details page returned only a host name on this fetch. Do not invent a year for it.

**Check.** Write N=800 for closeness 0.01 on 8/(n+1). Write height 8/801 at that N. Write 0.01 times 801 = 8.01. If those three numbers are not on your paper, you described an emptying hopper and you did not walk the object.

New case: same hopper, closeness 0.04. Need n+1 > 8/0.04 = 200, so n > 199. Take N=200. Height 8/201. 0.04 times 201 is 8.04, and 8 < 8.04. If you kept N=800, you answered the old closeness. If you wrote N=20, you divided 8 by 0.4 and skipped a zero.
