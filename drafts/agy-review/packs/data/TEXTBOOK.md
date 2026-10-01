---
title: "data — a table, a rate, a claim about a group"
date: "2026-09-20"
status: draft
start: count
needs: numeracy
home: "drafts/agy-review/packs/data/"
---

# A table, a rate, and a group

You can already count, share, name a percent, and keep a unit on a number. This book is what those moves do when the numbers came from the world: a stall, a clinic, a town, a survey. One object at a time. A table. A rate. A sample. A typical value. A spread. A claim about a group. Then a check on that claim.

The long school walk lives at OpenStax *Introductory Statistics*. The details page is the door. The fetch for this sitting returned almost no body text, so author, edition, ISBN, and update date are unverified here. Open the door. Counts of people and money in the United States live at the Census Bureau. Comparable country tables live at World Bank Open Data. Fetch those hosts. Do not finish a national number from memory.

This pack is general education for EasyLM. License AGPL-3.0-or-later.

---

## 1. A row and a column

A stall keeper writes one line for each stall on a Saturday. First stall: 4 crates, 2 lamps. Second stall: 6 crates, 0 lamps. Third stall: 5 crates, and the lamp count was never written.

| stall | crates | lamps |
|---:|---:|---:|
| 1 | 4 | 2 |
| 2 | 6 | 0 |
| 3 | 5 |  |

Each line across is one stall. Each question asked of every stall sits in its own upright list: crates in one list, lamps in another. The meeting of a line and an upright list is one answer, or a blank.

That grid of lines and upright lists is a **table**. A line across is a **row**. An upright list is a **column**. One meeting of a row and a column is a **cell**.

A blank cell is not a zero. Zero is an answer: stall 2 had no lamps, and the keeper wrote 0. Stall 3 has no lamp answer. You may not average a blank as if it were 0, and you may not drop stall 3 from the crate column just because lamps are missing. The crate column still has three answers: 4, 6, 5.

A table can hold words as well as counts. A column of yes and no is still a column. A column of town names is still a column. The rule does not change: one row, one thing; one column, one question.

Write the units in the column name when the answers are measured. Crates are crates. Minutes are minutes. Mixing minutes and hours in one column without a conversion is a broken column, the same way numeracy refused to add meters to seconds.

Official tables of people, housing, and money in the United States sit at the Census Bureau. The homepage fetched for this sitting, 20 September 2026, is [census.gov](https://www.census.gov/). Searchable tables sit at [data.census.gov](https://data.census.gov/). World tables sit at [data.worldbank.org](https://data.worldbank.org/). A cell you need for a country or a county comes from those hosts, not from a chart in a slide.

**Check.** A new table of four buses. Columns: bus, seats, riders.

| bus | seats | riders |
|---:|---:|---:|
| 11 | 40 | 18 |
| 12 | 40 | 0 |
| 14 | 40 |  |
| 15 | 40 | 27 |

Bus 12 rode empty: 0 is an answer. Bus 14 has no rider count: the cell is blank. How many rider answers do you have? Three: 18, 0, 27. How many buses? Four. The blank does not shrink the fleet. A second new case: add a column "late, in minutes" with 4, 0, 9, 1. Four answers, no blank. The late column is ready to add. The rider column is not, until bus 14 is filled or you name that you are adding only the three known rider counts.

---

## 2. A count of a group

Twenty-four stalls stood in a Saturday market. Walk the bread column. Nine stalls sold bread. The other fifteen did not.

The pile is 24 stalls. The group you asked about is the bread stalls. The count of that group is 9.

How many rows share one answer in a column is a **frequency**. 9 is the frequency of "bread" in that column. 15 is the frequency of "no bread." $9 + 15 = 24$. The two groups fill the pile. If they added to 23, a row was lost. If they added to 25, a row was counted twice.

A share of the pile is the group over the whole. $\frac{9}{24} = \frac{3}{8}$. Per hundred: $\frac{9}{24} = 0.375 = 37.5\%$. Numeracy already did per hundred. The new work is naming the whole. "9 bread stalls" is a count. "9 of 24 stalls sold bread on that Saturday" is a count of a group.

A column with more than two answers still uses the same walk. Thirty-two jackets: 7 red, 11 blue, 14 green. $7 + 11 + 14 = 32$. The blue group is 11 of 32. The red group is 7 of 32. A jacket cannot sit in two color groups unless you defined the groups that way. If 2 jackets were red-and-blue and you put them in both, the frequencies will add to more than 32. Say so.

The Census Bureau's job, as printed on the homepage fetched for this sitting, includes a Decennial Census of Population and Housing, conducted every 10 years, and an Economic Census, conducted every 5 years. Those are attempts to count large piles of people and of businesses. The homepage also lists the American Community Survey and the Current Population Survey as conducted monthly. Monthly work of that kind is usually a sample, which is chapter 4. The cadence is what the homepage printed. The exact questionnaire is on those program pages, not in this paragraph.

World Bank Open Data, fetched the same sitting, calls World Development Indicators a compilation of internationally comparable statistics about global development and the fight against poverty. I did not fetch an indicator table, so I will not print a country count from memory. Open the door and read the cell.

**Check.** Forty-five seats in a room. 18 filled. The filled group is 18 of 45. The empty group is 27 of 45. $18 + 27 = 45$. The filled share is $\frac{18}{45} = \frac{2}{5} = 40\%$. A new case: 28 bikes, 7 with lights. Lights group 7 of 28, which is $\frac{1}{4} = 25\%$. The no-light group is 21 of 28. $7 + 21 = 28$. If someone says "7 bikes had lights" and hides the 28, you do not yet have a count of a group. You have a 7.

---

## 3. A rate

Sixteen paint scratches showed up in a year on two thousand cars in one town. Sixteen scratches also showed up in a year on eighty thousand cars in a city. The raw 16 matches. The story does not.

Write per. $\frac{16}{2000} = \frac{8}{1000}$. Eight scratches per thousand cars in the town. $\frac{16}{80000} = \frac{0.2}{1000}$. Two-tenths of a scratch per thousand cars in the city. Per car, the city had far fewer scratches. The town looks worse once the whole is named.

A count with the whole named, and usually with a time, is a **rate**. Percents are rates per hundred. They still need the whole. "Up 50%" of 8 crates is a rise of 4 crates. "Up 5%" of 200 crates is a rise of 10 crates. The smaller percent moved more crates because the pile was larger.

Name three pieces or the rate is unfinished: the count, the whole, the time. "16" is not a rate. "16 scratches" is not a rate. "16 scratches per 2,000 cars in 2025" is a rate.

A second worked case. Twelve leaks in a year among 3,000 pipes is 4 leaks per thousand pipes. Twelve leaks in a year among 60,000 pipes is 0.2 leaks per thousand pipes. Same 12. Different rates.

On 15 September 2026 the Census homepage listed an America Counts story: the Hispanic population's poverty rate fell to 13.9% in 2025, down 1.2 percentage points from 2024. I fetched the homepage, not the story body. The 13.9% is printed on census.gov as of that fetch. A poverty rate is a count of a group over a whole, per hundred. Open the story for the table, the survey name, and who sits in the whole. Do not treat 13.9 as a free-floating number you can move to another year or another group.

World Bank Open Data prints indicator charts on its homepage, including codes such as `SI.POV.DDAY` for a poverty series. I did not open those chart pages, so the plotted values are unverified here. Open the indicator and read the year and the whole.

**Check.** Eighteen chips in a year among 4,500 plates. $\frac{18}{4500} = \frac{4}{1000}$. Four chips per thousand plates. A new case: 18 chips among 900 plates in the same year. $\frac{18}{900} = \frac{20}{1000}$. Twenty chips per thousand plates. The second pile is smaller and the rate is five times the first. Another: 8 of 40 repaired radios is $\frac{8}{40} = 20\%$. Same cut as 10 of 50, which is also 20%. The percents match. The counts 8 and 10 do not.

---

## 4. A sample and a pile

Six hundred apple trees stand in an orchard. You cannot weigh every apple. You walk the road that cuts the orchard and pick 25 trees. You weigh apples from those 25.

The 25 trees you actually measured are a **sample**. The 600 trees you want the number to speak for are the **population**, the pile.

A number from the 25 is a claim about the 25 first. It becomes a claim about the 600 only if the 25 were mixed the way the 600 are mixed. Road trees get more dust, more passing, maybe more water from a ditch. A road sample can be a sample of road trees. Write that.

Every tree had a chance: that is what people mean by **random** here. It is a design, not a mood. A sloppy grab of whichever trees were easy is a different bias, not a small random. If you only pick trees with fruit you can reach, you have a sample of reachable fruit.

A second picture. Eight hundred houses on a hill. You knock on 40 doors along the bus route. Those 40 are a sample of houses on the bus route unless you can show the route mixes the hill. A number about "the hill" from the bus route is unfinished.

The Census homepage lists the American Community Survey as conducted monthly and the Current Population Survey as conducted monthly. Those programs are the Bureau's ongoing household samples. The Decennial Census, every 10 years, is the attempt to count the pile. I fetched the homepage, not the methods pages, so sample sizes and response rates are unverified here. Open the ACS and CPS doors in the link index for those figures.

World Bank Open Data points at a Microdata Library for data collected through sample surveys. That is the official door when a later sentence needs a household survey from another country. I did not fetch a survey file. No cell from that library is printed here.

**Check.** A grove of 480 pines. You measure 30 pines at the gate. The sample is 30. The pile is 480. If the 30 at the gate average 12 cones and the far trees are older, 12 cones is a gate number. A new case: a school of 90 rooms, you visit 10 rooms on the first floor. First-floor rooms are the sample. The 90 rooms are the pile. A claim about "the school" from 10 first-floor rooms has to say first floor, or it is a bigger claim than the catch.

---

## 5. Typical

Five people sat in a clinic. Their waits in minutes were 7, 9, 9, 10, and 41.

You want one number that stands for "about how long." Line the five waits from smallest to largest. They are already lined. The middle wait is 9. Two waits sit at or below 9, two sit at or above 9, once you split the middle. That middle of the lined pile is the **median**.

Add the five waits and share by five. $7 + 9 + 9 + 10 + 41 = 76$. $76 \div 5 = 15.2$. That share of the total is the **mean**, the everyday "average."

The mean is 15.2 minutes. The median is 9 minutes. The 41 dragged the mean. It barely moved the median. If someone says "the typical wait is 15 minutes," they used the mean and hid the 41. If they say "the typical wait is 9 minutes," they used the median and the 41 is still in the pile, just not in that one-number name.

When the lined pile has an even count, there is no single middle row. Four waits: 7, 9, 10, 12. The two middles are 9 and 10. The median people usually write is the mean of those two: $\frac{9+10}{2} = 9.5$. Say that you averaged the two middles, so a reader can redo it.

A single giant value is a reason to print both names. A pile with no giant, 7, 9, 9, 10, 12: mean $\frac{47}{5} = 9.4$, median 9. The two names sit close. That closeness is information.

On 15 September 2026 the U.S. Census Bureau homepage stated that median household income was $87,460 in 2025. They published a median. A mean household income would be a different number, pulled by the upper tail, and it is not the figure on that homepage line. Fetch [census.gov](https://www.census.gov/) or the 15 September 2026 income press release when the dollar figure must travel. A later story on the same day's list said real income increased at the top but not the bottom of the income distribution from 2024 to 2025. I fetched the homepage, not the story body, so that split is a headline on the page. Open the story for the table.

**Check.** A new pile: 4, 6, 6, 8, 26. Lined already. Median 6. Sum $4+6+6+8+26 = 50$. Mean $50 \div 5 = 10$. The 26 dragged the mean. A second new pile with no giant: 5, 7, 8, 8, 10. Median 8. Sum 38. Mean $38 \div 5 = 7.6$. The two names sit close. A third: six numbers, 2, 3, 5, 7, 8, 9. Two middles 5 and 7. Median $\frac{5+7}{2} = 6$. Sum 34. Mean $34 \div 6$, which is $5\frac{2}{3}$. Write both.

---

## 6. Spread

Take those five clinic waits again: 7, 9, 9, 10, 41.

The smallest is 7. The largest is 41. The distance from smallest to largest is $41 - 7 = 34$. That distance is the **range**.

The mean was 15.2 and the median was 9. The range is 34 minutes. A typical-value name without a spread hides the 41 just as hard as a mean without a median. Print the smallest and the largest next to the typical value until you have a better spread.

Drop the 41 and put 12 in its place: 7, 9, 9, 10, 12. Range $12 - 7 = 5$. Mean $\frac{47}{5} = 9.4$. Median 9. The typical names barely moved. The range collapsed. The story of the pile lives in the spread as much as in the middle.

A cheap extra: how far each wait sits from the mean, ignoring sign. Mean 15.2 on the original five. Distances: $15.2-7=8.2$, $15.2-9=6.2$, $6.2$ again, $15.2-10=5.2$, $41-15.2=25.8$. Share those five distances by 5: $\frac{8.2+6.2+6.2+5.2+25.8}{5} = \frac{51.6}{5} = 10.32$. That is a mean distance from the mean. Later books name variance and standard deviation with a square and a different divisor. The arithmetic above is only a first look at "how far." I will not print a NIST formula for a standard uncertainty. The NIST page listed on this pack's card, [nist.gov/itl/sed/uncertainty](https://www.nist.gov/itl/sed/uncertainty), returned not found when fetched on 20 September 2026. Treat a remembered coverage factor, a GUM clause, or a $k=2$ rule as unverified until you open a live NIST door.

Two piles can share a mean and disagree in spread. Pile A: 8, 10, 10, 12. Mean 10, range 4. Pile B: 2, 4, 16, 18. Mean 10, range 16. "Both average 10" is true and thin.

**Check.** A new pile: 3, 5, 5, 8, 19. Range $19-3=16$. Median 5. Sum 40. Mean 8. Drop 19, put 9: 3, 5, 5, 8, 9. Range 6. Sum 30. Mean 6. Median 5. The median held. The mean and the range moved. A second new pile: 11, 11, 11, 11. Range 0. Mean 11. Median 11. No spread. Every row is the typical value.

---

## 7. A claim about a group

Someone says the clinic wait is fifteen minutes.

Put the sentence on the table you already have. Five waits: 7, 9, 9, 10, 41. Mean 15.2, which they rounded to 15. Median 9. Range 34. Sample of 5 people, on one afternoon, at one desk. The clinic that week saw 140 people. The 5 are a sample. The 140 are a pile you did not measure.

The claim used the mean, hid the 41, hid the 5, hid the afternoon, and spoke as if it named the 140. A **claim about a group** is a sentence that points at a pile or a sample and says something about it. The sentence is only as wide as the rows it actually has, plus the argument that those rows mix the pile.

Write five tags on the claim or it is unfinished: who, how many, of how many, in what time, which typical name. "Fifteen minutes" has none of the five. "Mean wait 15.2 minutes among 5 afternoon patients at this desk, median 9, range 34" has them.

A small sample swings. 1 late bus in 8 is 12.5%. 1 late bus in 80 is 1.25%. Same one bus. The percent moved because the whole moved. Chapter 2's frequency still needs chapter 3's whole.

The 13.9% Hispanic poverty rate on the Census homepage is a claim about a group. It names a rate, a year (2025), and a group. The homepage line also said the rate was down 1.2 percentage points from 2024, the lowest on record, and still disproportionately high. I fetched the homepage, not the story. Open [the story door](https://www.census.gov/library/stories/2026/09/hispanic-poverty.html) for the survey, the whole, and the table. A percent without those pieces is a poster.

World Development Indicators, on the World Bank door, is a compilation of comparable country statistics. A claim that copies a WDI cell still needs the year, the country, and the indicator name. I did not fetch a cell. No country rate is printed here from memory.

**Check.** New claim: "most of these waits were under 10 minutes." Pile 7, 9, 9, 10, 41. Under 10: 7, 9, 9. That is 3 of 5, which is most of the sample. The 10 is not under 10. The 41 is not. The claim is true of the 5 and silent about the 140. A second new claim: "typical sale is 22 crates," from 8, 10, 10, 12, 70. Sum 110. Mean 22. Median 10. Range 62. The 22 is the mean with the 70 inside it. Write "mean 22 crates among 5 stalls, median 10" or the claim is the hiding.

---

## 8. A picture of numbers

Four colors of jackets hung on a rail: 7 red, 11 blue, 14 green, 0 yellow.

| color | count |
|---|---:|
| red | 7 |
| blue | 11 |
| green | 14 |
| yellow | 0 |

Draw four bars. The height of each bar is the count. Yellow still gets a bar of height 0, because yellow was a color you asked about. Leaving yellow off the picture would hide a question you asked.

A picture whose bars are named groups, not a number line, is a **bar chart**. The names sit under the bars. The counts are the heights. $7+11+14+0 = 32$. If the heights do not add to the pile, a bar was dropped or a row sat in two bars.

A picture that bins a number line is a **histogram**. Wait times 7, 9, 9, 10, 41. Bins of width 10 minutes: 0 to 10 gets 7, 9, 9, 10, four waits. 10 to 20 gets none if 10 already sat in the first bin: say which edge is included. 20 to 30 none. 30 to 40 none. 40 to 50 gets 41, one wait. Four bars of height 4, 0, 0, 1, or, if 10 belongs in 10 to 20, heights 3, 1, 0, 1. The picture changed because the edge rule changed. Write the edge rule.

A picture can hide the whole as easily as a sentence can. Always keep the count on the axis, or write $n$ next to the picture. A pretty shape with no $n$ is decoration.

Census and World Bank pages draw charts. The homepage charts I saw on World Bank Open Data are pictures of indicators. I did not read the plotted values off those images. A picture on a host is still not a substitute for the cell. Open the table.

**Check.** Books sold Monday to Thursday: 5, 2, 9, 4. Four bars. Heights 5, 2, 9, 4. Sum 20. If a poster shows only Monday and Wednesday, heights 5 and 9, the picture dropped Tuesday and Thursday and the 20 is gone. A new histogram: 6 wait times, 3, 4, 4, 12, 13, 21. Bins 0 to 10, 10 to 20, 20 to 30, left edge in, right edge out, last right edge in. Heights: 3, 2, 1. Sum 6. Move the 10-edge rule and 12 still sits in 10 to 20. The 21 sits in 20 to 30 either way. Redo the heights if you change the width.

---

## 9. When two numbers move together

Four garden beds got different hours of sun: 2, 3, 5, 6. Tomato counts from those beds: 8, 11, 17, 20.

| sun hours | tomatoes |
|---:|---:|
| 2 | 8 |
| 3 | 11 |
| 5 | 17 |
| 6 | 20 |

As sun hours rise, tomatoes rise. Each bed is a pair. Plot each pair as a dot, sun across, tomatoes up. The dots climb.

Two columns that rise together, or fall together, **move together**. The picture of the pairs is a **scatter**. A number that names how tightly they track is a later book's job. OpenStax *Introductory Statistics* is the door for that name. Unverified here, because the details page returned almost no body.

Moving together is not because. The gardener also watered more on the sunnier days. Water is a third column. Sun and tomatoes can both follow water, or water and tomatoes can both follow sun, or all three can follow a fourth thing, the month. A third thing that drives two columns is a **confounder**.

A second pair of columns. Umbrellas sold: 4, 8, 12. Wet-sidewalk complaints: 1, 3, 5. Both rise. Rain is the third thing. Umbrellas did not cause the wet sidewalks.

To get closer to because, change one thing on purpose and keep the rest still, or compare groups that were assigned without picking the outcome. This pack's rule is smaller: "after" is not "because," and a climbing scatter is not a mechanism. Ask what else moved.

Algebra's slope is a cousin: rise over run between two pairs. From (2, 8) to (6, 20) the tomato rise is 12 and the sun run is 4. $\frac{12}{4} = 3$ tomatoes per extra sun hour, on that walk. The next walk, (3, 11) to (5, 17): rise 6, run 2, $\frac{6}{2} = 3$ again. These four dots happen to share that slope. Real tables often will not. A changing slope is still a scatter. It is not a straight rule.

**Check.** A new pair of columns. Hours of practice: 1, 2, 4, 5. Missed throws out of 20: 14, 11, 6, 5. Practice rises, misses fall. They move together, opposite ways. From (1, 14) to (5, 5): rise $5-14=-9$, run 4, $\frac{-9}{4} = -2.25$ misses per extra hour on that walk. A third column that could have moved: the later hours were cooler, or the hoop was lowered. Name one. A second new case: heating bills 40, 70, 90 and ice-cream sales 12, 5, 2. Bills rise, ice cream falls. Month of year is a third thing. Do not write that heat cut ice cream until you have a design that holds the month still.

---

## 10. A check on the claim

A claim about a group is a sentence you can take apart. Do the taking apart on paper before you believe the sentence, share it, or put it in a later book.

Write the table. Name the column. Name the rows. Count the rows you actually have. Name the pile you wish they spoke for. If those two counts differ, you have a sample. Say who was easy to catch.

Name the typical value two ways if a giant sits in the pile. Mean and median. Print the smallest and the largest. Write the rate with the whole and the time. Name one other column that could have moved with the one in the claim. If the claim is about a country, a county, a disease, wages, or weather, fetch the host that owns the fact. Census, World Bank, BLS, CDC, NWS, NIST. A chart on a poster is not the host.

Worked close. "Average sale is 22 crates." Table: 8, 10, 10, 12, 70 crates on five stalls, one Saturday, 80 stalls in the market. Sum 110. Mean 22. Median 10. Range 62. Sample 5 of 80. Time: one Saturday. The 22 is the mean with the 70 inside it. The claim survives as "mean 22 crates among these 5 stalls, median 10, range 62, Saturday only." It does not survive as the market's typical stall.

A second close, new numbers. "This town is safer: only 9 falls this year." Town workers: 1,500. City workers: 30,000, with 90 falls in the same year. Town rate: $\frac{9}{1500} = \frac{6}{1000}$. City rate: $\frac{90}{30000} = \frac{3}{1000}$. Per thousand workers, the city had fewer falls. The raw 9 is smaller because the town is smaller. The rate reversed the poster.

A third close, new case. "Most riders wait under 8 minutes." You timed 6 riders: 4, 5, 7, 8, 9, 22. Under 8: 4, 5, 7. That is 3 of 6, not most. At most half, if you count 8 as not under. Median 7.5 if you average 7 and 8. Mean $\frac{55}{6} \approx 9.2$, dragged by 22. The claim fails the sample it came from. Stop. Do not widen it to the whole route.

When the number must travel as a national fact, fetch. Median household income $87,460 in 2025 is a Census homepage line from 15 September 2026. Hispanic poverty 13.9% in 2025 is a Census homepage line from the same day. World Bank Open Data is the door for a comparable country series. The NIST uncertainty URL on this pack's card returned not found on 20 September 2026; do not carry a remembered uncertainty formula. OpenStax *Introductory Statistics* is the next long walk. Open the door. Do not copy the book into this file.

EasyLM. Public general education. AGPL-3.0-or-later.
