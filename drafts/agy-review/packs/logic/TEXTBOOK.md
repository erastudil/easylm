---
title: "logic — a valid move from sentence to sentence"
date: "2026-09-20"
status: draft
start: read
needs: study
home: "drafts/agy-review/packs/logic/"
---

# A valid move from sentence to sentence

You can already keep a page. This book is the next skill: watching one sentence force another, and watching when it does not.

The object is that force. Two sentences sit on a table as given. A third sentence is offered as what follows. Sometimes you must accept it. Sometimes you may refuse.

The living philosophy pack is the survey of schools and questions. This book names that door and stops. The discrete math pack owns induction on whole numbers. This book names that door and stops.

The longer formal walks live at official doors. Stanford Encyclopedia of Philosophy, *Classical Logic*, first published 16 September 2000, last revised 17 June 2026, sets out the language, the deductions, and the models. Stanford Encyclopedia of Philosophy, *Logical Consequence*, first published 7 January 2005, last revised 17 May 2024, sets out what it is for a conclusion to follow. The Internet Encyclopedia of Philosophy page *Propositional Logic* walks and, or, not, if-then, and the tables of truth-values. Those three doors are in `LINK_INDEX.md`. A count of titles on a landing is unverified here.

---

## 1. A sentence that can be true

The shop on Cedar opens at 8:00. A neighbor can walk to Cedar at 8:00 and read the door. The sentence names a place, an act, and a time. It can turn out true. It can turn out false.

"Close the Cedar shop" tells someone to act. "Is the Cedar shop open?" asks. "I hate this street" reports a feeling. None of those three can be true or false in the way the 8:00 sentence can. A command can be obeyed. A question can be answered. A feeling can be honest. Only the 8:00 sentence stands where a check can land.

The writing pack taught you a claim: one thing you are willing to be wrong about. This book needs that same stand.

People name a sentence of that kind a **statement**. The Internet Encyclopedia of Philosophy page *Propositional Logic* defines a statement as a declarative sentence, or part of a sentence, capable of being true or false. The 8:00 sentence is one. "What a street" is not.

Two further rules sit under the classical walk this book takes. Every statement is either true or false. No statement is both. The same IEP page traces those two rules to Aristotle (384–322 BCE) and names them the Law of Excluded Middle and the Law of Contradiction. Other schools refuse one or both. The living philosophy pack is the survey of that fight. This book keeps the two-valued walk.

A statement can be short. "This jar holds 11 nails" is short. Empty the jar. Count. Length does not make a statement. Being able to be true or false does.

**Check.** Write two rows about a bike shed on Pine. One names the lock and a time: "The Pine shed lock is closed at 21:00." One says the alley feels unsafe. Only the first row tells a stranger what to go and try.

New case: a waiting room with three chairs. "This room holds three chairs at noon" is a statement. "This room is welcoming" is a mood. Count the chairs. If you find two, the first row is false and useful. The second row has nowhere to land.

---

## 2. And, or, not

Two latches sit on the same window, east and west. You can talk about each latch alone. You can also join the two stands into one stand.

"The east latch is closed and the west latch is closed." That joined sentence is true only when both smaller sentences are true. If the east latch is closed and the west latch is open, the joined sentence is false. If both are open, it is false. People name that join **and**, and they name the joined sentence a **conjunction**. The two smaller sentences are the **conjuncts**.

The IEP page *Propositional Logic* gives the four-row table for this join. Write T for true and F for false. Four rows, because each latch has two states, and 2 × 2 = 4: T and T gives T; T and F gives F; F and T gives F; F and F gives F. Redo those four by hand. If any row disagrees, you copied a shape.

"The east latch is closed or the west latch is closed." That joined sentence is false only when both smaller sentences are false. If at least one latch is closed, the joined sentence is true. If both are closed, it is still true. People name that join **or** in the inclusive sense, and they name the joined sentence a **disjunction**. The two smaller sentences are the **disjuncts**.

Inclusive is the default in this book. The IEP page says the sign for or is used inclusively: true if either side is true, or both. English sometimes uses or to force a choice. "You may take the last roll or the last loaf; you must choose" wants one, not both. Until a sentence forces that reading, read or as "one, the other, or both."

Four rows for inclusive or: T or T gives T; T or F gives T; F or T gives T; F or F gives F.

"The east latch is not closed." That sentence is true when "the east latch is closed" is false, and false when that sentence is true. People name that flip **not**, and they name the new sentence a **negation**. Two rows: T flips to F, and F flips to T.

A baker's tray holds 24 rolls, or it does not. "The tray holds 24 rolls and the tray does not" is never true. "The tray holds 24 rolls or it does not" is never false. Those are the contradiction rule and the excluded-middle rule, now written with and, or, and not.

Joins nest. "The east latch is closed and the west latch is closed, or the window is boarded." Parentheses, or a careful voice, say which join happens first. Write the grouping. The Stanford *Classical Logic* page proves, as Theorem 6, unique readability: each formula of the formal language is produced in exactly one way. Ordinary English does not give you that gift.

**Check.** East latch closed: T. West latch closed: F. Window boarded: F. Compute "east and west" first: T and F is F. Then "that result or boarded": F or F is F. Write the three letters and the two steps.

New case: same latches, boarded becomes T. "East and west" is still F. F or T is T. If your two cases gave the same final letter, you ignored the boarded bit.

---

## 3. If this then that

The kettle sits on the ring. Someone says: if the kettle is on, steam fogs the kitchen window.

That sentence does not say the kettle is on. It does not say the window is fogged. It rules out one pair: kettle on, window clear. If you find that pair, the if-then sentence is false. Every other pair leaves it standing.

People name the "if" part the **antecedent** and the "then" part the **consequent**. They name the whole sentence a **conditional**. This book's conditional is the truth-functional one, often called the **material** conditional. The IEP page states the four-row table: T then T gives T; T then F gives F; F then T gives T; F then F gives T. Only the second row kills it. A false "if" does not kill it.

That last fact startles English. "If the Cedar shop sits on the moon, the Oak pier light is on." The shop does not sit on the moon, so the antecedent is F. On this table the whole if-then is T whether the pier light is on or off. English "if" often wants a real link. The IEP page says the English operator is not fully truth-functional, and that the arrow is not in all ways the same. This book uses the table.

A useful rewrite lives on the same table. "If the kettle is on, the window fogs" is true in exactly the same rows as "the kettle is not on, or the window fogs." Check the four rows by hand. Same four letters. So you may replace one with the other in this book.

"If and only if" is a tighter join. "The pier light is on if and only if the ferry is running" wants the two sides to share a truth-value: both T or both F. People name that join a **biconditional**. Four rows: T with T gives T, T with F gives F, F with T gives F, F with F gives T.

**Check.** Kettle on: T. Window fogged: F. The if-then is F. Now flip the kettle to F and keep the window clear. The if-then becomes T. Write both rows. The second row is the one English wants to protest. The table still gives T.

New case: "If bus 14 stops at Cedar, the shelter light is on." Bus 14 does not stop (F). The shelter light is on (T). The if-then is T. Write the matching or-sentence: "Bus 14 does not stop, or the shelter light is on." That or-sentence is T, because the first disjunct is T. If you marked the if-then F because the bus did not stop, you used English hope, not the table.

---

## 4. Valid

Two sentences sit on the table as given. A third is offered as what follows.

Given: the kettle is on. Given: if the kettle is on, steam fogs the window. Offered: steam fogs the window.

You cannot find a row where both givens are T and the offered sentence is F. The if-then table forbids kettle-on and window-clear together. So if the two givens hold, the window is fogged. The move is forced.

People name a forced move **valid**. The Stanford *Classical Logic* page says an argument is valid if there is no interpretation in which its premises are all true and its conclusion false. That is the longstanding view that a valid argument is truth-preserving. The Stanford *Logical Consequence* page says the same: if we do not equivocate, and the premises are true, then the conclusion is also true, as a matter of logic. Validity does not certify the givens. It certifies the move.

The givens are the **premises**. The offered sentence is the **conclusion**. Together they are an **argument**. One premise is enough. Zero premises is allowed: then the conclusion has to stand on logic alone. The count of premises is not the test. The missing row is the test: true premises, false conclusion. If that row cannot occur, the argument is valid. If that row can occur, it is **invalid**.

Valid is not the same as true. "If the Cedar shop sits on the moon, the pier light is on. The Cedar shop sits on the moon. Therefore the pier light is on." The move is valid. The second given is F. A valid move from a false given can still land on a falsehood. What it cannot do is take you from all-true givens to a false landing.

The IEP page *Propositional Logic* lists, from Chrysippus (roughly 280–205 BCE), a first schema that matches the kettle move: if the first, then the second; but the first; therefore the second. Later pages name that schema **modus ponens**. The name is a handle for a move you already ran.

A second forced move: if the first, then the second; but not the second; therefore not the first. If the kettle is on, the window fogs. The window is clear. Therefore the kettle is not on. Same table. The only killer of the if-then is T then F. People name this move **modus tollens**. Chrysippus's second schema, on the IEP page, is this one.

**Check.** Premises: if the Pine shed lock is closed, bike 19 is inside. The Pine shed lock is closed. Conclusion: bike 19 is inside. Search for a row with both premises T and the conclusion F. There is none. Valid.

New case: premises: if the Pine shed lock is closed, bike 19 is inside. Bike 19 is inside. Conclusion: the Pine shed lock is closed. Lock open (F), bike inside (T), if-then is T (F then T). Both premises T, conclusion F. Invalid. Chapter 5 is that row, named.

---

## 5. A counterexample

Someone tells you: if the shop on Cedar is open, the lamp in the window is lit. The lamp is lit. Therefore the shop is open.

The move feels tidy. The lamp is evidence, in life, that someone is inside. Life is not the test this book is running. The test is: can the premises be true while the conclusion is false.

Find a night. The shop is locked. A cleaner left the lamp on. Then "if open, then lamp lit" can still be true, because the shop is not open, and F then T is T. "The lamp is lit" is T. "The shop is open" is F. Both premises T, conclusion F. The move fails.

People name that breaking situation a **counterexample**. The Stanford *Logical Consequence* page says a counterexample is an argument of the same form with true premises and a false conclusion, or a circumstance in which the premises are true and the conclusion is false. Later work develops that idea into a theory of **models**. This pack owns the walk: find the breaking case, or show there is none. The living philosophy pack can survey the mathematical object.

A counterexample must match the form, not just the topic. "The lamp is lit, so the shop is open" has the same form as "the pan is hot, so the stove clicked twice." A hot pan on leftover coals, stove off, is another breaking case of the same shape. One breaking case is enough. The form is invalid.

The form in the Cedar case is: if A then B; B; therefore A. People name that failure **affirming the consequent**. You affirmed B, the "then" side, and tried to force A. The table never gave you that force. Chapter 4's valid twin was: if A then B; A; therefore B.

A second common break: if A then B; not A; therefore not B. "If the ferry is running, the pier light is on. The ferry is not running. Therefore the pier light is off." A pier light can sit on a timer. Ferry tied up, light still on. Premises T, conclusion F. People name that failure **denying the antecedent**. The valid twin is modus tollens: if A then B; not B; therefore not A.

Inductive hops are a different family. "Every heron I have seen on this pond was grey. Therefore the next heron is grey." A white heron can land. That is a guess, not a valid move. The Stanford *Logical Consequence* page draws that same line between deductive and inductive consequence.

When you cannot find a breaking case after a real search, write every row. The IEP page states that if a formula has n distinct statement letters, the number of possible truth-value assignments is 2^n. Two letters: 4 rows. Three letters: 8 rows. You can write 2 × 2 × 2 = 8 by hand. If no row has all premises T and the conclusion F, the argument is valid.

**Check.** Argument: if the rain gauge on the roof shows 4, the barrel is wet. The rain gauge shows 4. Therefore the barrel is wet. Write the four rows of the if-then. On every row where both premises are T, the conclusion is T. No counterexample. Valid.

New case: argument: if the rain gauge shows 4, the barrel is wet. The barrel is wet. Therefore the rain gauge shows 4. Find one row: gauge shows 2 (F), barrel wet from a hose (T). If-then is T. Conclusion F. Invalid. The hose is the counterexample.

---

## 6. All and some

Every crate in the shed is stamped pears. Crate 7 is in the shed. Therefore crate 7 is stamped pears.

The first given does not name crate 7. It names a whole pile and a stamp. Once crate 7 is in that pile, the stamp is forced. There is no breaking case inside the shed as described. If you find crate 7 in the shed with no stamp, you have not found a counterexample to the move. You have found that the first given was false.

People name "every" and "all" a **universal** claim. People name "some" and "at least one" an **existential** claim. The Stanford *Classical Logic* page writes a universal as "for all" and an existential as "there is." This book uses the English words until a later course needs the signs.

"Some crate in the shed is empty. Crate 3 is empty and in the shed. Therefore some crate in the shed is empty." The move from a named instance to "some" is forced. You exhibited one. A named empty crate is already a "some."

"Some" does not name which. "Some crate in the shed is empty. Therefore crate 3 is empty." Invalid. Crate 3 may be full, and crate 4 empty. The breaking case is easy to draw: two crates, 3 full, 4 empty. First given T, conclusion F.

If a sentence says "every crate in the shed," treat the shed as a pile you can point at, with at least the crates the problem names.

Two "some"s and two "all"s can swap order and change the stand. "Every crate has some pear in it" can be true if crate 7 has pear A and crate 8 has pear B. "Some pear is in every crate" needs one pear that sits in all the crates. Draw the crates. Do not swap the words.

A mixed break: every duck on this pond can swim. Ink can swim. Therefore Ink is a duck. Ink can be a dog who swam. That is affirming the consequent with a pile. The valid twin is: every duck on this pond can swim. Ink is a duck on this pond. Therefore Ink can swim.

The Stanford *Classical Logic* page gives introduction and elimination rules for both quantifiers, with a side condition that the named example must be arbitrary when you move from one instance to "all." If you proved something about crate 7 without using any special fact about 7, you may write "every crate." If you used "crate 7 is by the door," you may not. The discrete math pack owns induction on whole numbers. This book names that door and stops.

**Check.** Premises: every parcel left at door 19 is marked fragile. This parcel is left at door 19. Conclusion: this parcel is marked fragile. Search for a breaking case that keeps both premises. There is none. Valid.

New case: premises: some parcel left at door 19 is marked fragile. This parcel is left at door 19. Conclusion: this parcel is marked fragile. Breaking case: two parcels at door 19. Parcel A marked fragile. Parcel B, the one in your hand, unmarked. First given T, second T, conclusion F. Invalid.

---

## 7. A chain

You are allowed one forced step. Then another. The last sentence is forced if each step was forced.

If the stove clicks twice, the flame is on. If the flame is on, the pan heats. The stove clicks twice. Therefore the pan heats.

First step: clicks, and if-clicks-then-flame, so flame. That is the valid move from chapter 4. Second step: flame, and if-flame-then-pan, so pan. Same move, new sentences. The two steps glue. People name a glued walk of forced steps a **deduction**, or a **proof**, or a **chain**. The Stanford *Classical Logic* page defines an argument as derivable if there is a deduction from some or all of its premises to its conclusion.

You may also glue two if-thens into one if-then. From "if clicks then flame" and "if flame then pan," you may write "if clicks then pan." Whenever clicks is T, flame is T, hence pan is T.

Chrysippus's list, on the IEP page, is a box of allowed steps. The first two you already have. A third: not both the first and the second; but the first; therefore not the second. "The window is not both boarded and latched. It is boarded. Therefore it is not latched." Inclusive or plus a denial of one side forces the other: the ferry is running or the clerk is on the pier; the clerk is not on the pier; therefore the ferry is running.

From "east closed and west closed" you may write "east closed." From "east closed" you may write "east closed or west closed." Length does not make a chain valid. If step 4 is "the pan heats, so the stove clicked," you slipped in the broken form from chapter 5.

The Stanford *Classical Logic* page proves a cut rule: if you deduced ψ from one pile, and you deduced θ from another pile plus ψ, you may deduce θ from the two piles together. That is the license to prove a middle sentence and use it later. You already did that with the flame.

**Check.** Premises: if the ferry at Oak is running, the pier light is on. If the pier light is on, the night clerk is awake. The ferry is running. Write a three-line chain to "the night clerk is awake." Line 1: ferry, so pier light. Line 2: pier light, so clerk. Line 3: clerk. If you cannot name which given fed each line, you do not have a chain. You have a hope.

New case: premises: the east latch is closed and the west latch is closed. Conclusion: the east latch is closed or the window is boarded. Chain: from the and-sentence, take east closed. From east closed, write east closed or boarded. Two forced steps. Valid, even though boarded was never given. A true side makes the or-sentence true.

---

## 8. A broken chain

The lamp in the Cedar window is lit. Someone says the shop is therefore open. You already have the breaking night: cleaner, lamp on, door locked. The chain was one step, and the step was not forced.

A longer chain can hide the same break in the middle. If the shop is open, the lamp is lit. If the lamp is lit, the till has been counted. The till has been counted. Therefore the shop is open. The last hop reversed the if-thens. Still one breaking case: a counted till from last night, shop locked, lamp on a timer. Name the break where it happens.

Another break: treating "some" as "all." Some crates in the shed are stamped pears. Crate 7 is in the shed. Therefore crate 7 is stamped pears. The two-crate picture from chapter 6 still breaks it. Swapping "every" and "some" is the same family of error: every crate has some pear does not give you one pear in every crate.

A pile of true facts is not a chain. The east latch is closed. The west latch is closed. The window is boarded. Therefore the Cedar shop opens at 8:00. Each given may be T. The move is still invalid: a morning exists with those three window facts and a shut shop.

The Stanford *Classical Logic* page notes that some logicians object to a rule that lets anything follow from a contradiction, on grounds of relevance. That fight is named on the door. This book's table still says: a pile that contains a sentence and its negation has no live row, so every conclusion is vacuously valid from that pile. Use that as a warning that your givens cannot all be true.

When a chain breaks, write the breaking case, then name the illegal step in ordinary words. Affirming the consequent, denying the antecedent: those names are handles for pictures you already drew.

**Check.** Argument: if bus 14 stops at Cedar, the shelter light is on. Bus 14 does not stop at Cedar. Therefore the shelter light is off. Give a breaking case in one sentence. A timer can keep the shelter light on after the last bus. Premises can be T, conclusion F. Invalid. Name the break: denied the "if" side and forced the "then" side to be false.

New case: argument: every tray from this baker holds 24 rolls. This tray holds 24 rolls. Therefore this tray is from this baker. Breaking case: a tray from a different baker, also 24. Invalid. Name the break: you used the "then" side of "if from this baker, then 24" to force the "if" side.

---

## 9. Two voices

One way to trust a move is to write every forced step until the last sentence lands. That is the chain voice. It speaks in allowed steps: from both sides, write and; from and, take a side; from if-then and the "if," write the "then"; from a named crate, write some; from an arbitrary crate, write every.

The other way is to hunt a breaking case. That is the counterexample voice. It speaks in rows and pictures: lock open, bike inside; cleaner, lamp on; dog in the pond; eight pears in eight crates. If the hunt succeeds, the move is invalid. If the hunt fails after every row is written, the move is valid.

People name the chain voice **proof** or **derivation**. People name the row voice **models** or **interpretations**. The Stanford *Classical Logic* page keeps both. An argument is derivable if there is a deduction from the premises to the conclusion. An argument is valid if there is no interpretation in which the premises are all true and the conclusion false. Then it proves two meta-facts. If an argument is derivable, it is valid. That feature is **soundness**. If an argument is valid, it is derivable. That converse is **completeness**.

Those two words are handles for a match you can already want. Allowed steps should never lie. A move with no breaking case should be writable as a chain. The SEP page proves both for classical first-order logic. This book uses the match as a work rule: when a chain and a row-hunt disagree, you made a mistake in one of the voices.

The Stanford *Logical Consequence* page says twentieth-century work centered on those two tools, proof theory and model theory, and that the two approaches often coincide in extension. Other logics exist. The living philosophy pack is the survey. This book stays with the match you can practice: a chain, or a breaking case.

If you believe a move is valid, write the chain. If you believe it is invalid, write the breaking case. A person can offer a chain with an illegal step: ask for the step, and offer a breaking case. A person can offer a picture that kills a premise: that picture is not a counterexample. The Cedar cleaner works only if "if open then lamp lit" can stay T. It can, because F then T is T.

**Check.** Take the stove chain from chapter 7: if clicks then flame; if flame then pan; clicks; therefore pan. Voice one: write the two modus ponens steps. Voice two: try to build a row with clicks T and pan F while keeping both if-thens T. You cannot. Both voices agree: valid.

New case: if clicks then flame; pan heats; therefore clicks. Voice two first: leftover coals, pan hot, stove silent. Clicks F, pan T, if-then T. Breaking case found. Voice one should refuse to write a chain. If you wrote one, an illegal reverse of the if-then sat in it.

---

## 10. A check

A neighbor says: if the ferry at Oak is running, the pier light is on. The pier light is on. So the ferry is running.

Do not answer from the feel of a harbor. Run the object of this book. Write the form. If A then B. B. Therefore A. That is the Cedar-lamp form. It is invalid if a breaking case exists.

Build the case. A: ferry running. B: pier light on. Need A false, B true, and the if-then true. Ferry tied up (A is F). Pier light on a timer (B is T). If A then B is F then T, which is T. Premises T, conclusion F. Counterexample found. The neighbor's move is invalid.

Now change one given. The neighbor instead says: if the ferry is running, the pier light is on. The ferry is running. So the pier light is on. Form: if A then B; A; therefore B. Hunt a row with A T, if-then T, B F. The if-then forbids A T and B F. No row. Valid. Write the one-step chain: from the if-then and A, write B.

Third change. The neighbor says: if the ferry is running, the pier light is on. The pier light is off. So the ferry is not running. Form: if A then B; not B; therefore not A. Hunt: A T and B F would break it, but that pair kills the if-then. With the if-then T and B F, A must be F. No counterexample. Valid. Chain: modus tollens.

Fourth change, with a pile. Every crate in the Oak shed is stamped ferry. Crate 7 is in the Oak shed. So crate 7 is stamped ferry. Valid: a crate without a stamp would kill the "every," not the move. Fifth change: some crate is stamped ferry; crate 7 is in the shed; so crate 7 is stamped. Two crates, 7 plain and 8 stamped, break it.

The IEP page *Propositional Logic* is the door for the four-row tables and for the count 2^n of rows. The Stanford *Classical Logic* page, revised 17 June 2026, is the door for validity and for soundness and completeness. The Stanford *Logical Consequence* page, revised 17 May 2024, is the door for counterexample. If a definition here and a host disagree, believe the host.

**Check.** Invent one new argument with two premises about a roof rain gauge that shows 4, and a barrel. Make it valid. Write the chain. Then change only the conclusion so the new argument is invalid. Write the breaking row. If both arguments are valid, you did not change the conclusion. If both are invalid, you never had a forced move.

New case: take your invalid argument and add one extra premise that kills the breaking row. If you added "the gauge shows 4 if and only if the barrel is wet," the hose-picture from chapter 5 dies, because that picture makes the two sides differ. Validity can appear when a premise is added. It cannot appear when you only stare harder at a form you already broke.
