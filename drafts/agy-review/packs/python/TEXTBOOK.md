---
title: "python — a program as a list of steps in Python"
date: "2026-09-20"
status: draft
start: read
needs: computers
home: "drafts/agy-review/packs/python/"
---

# A program as a list of steps in Python

You already have files, folders, and this machine. This book adds one object: a list of steps written so a Python interpreter can run them.

The computers pack owns the file, the folder, and this machine. Name that door and stop. A pack on computing owns the machine that follows a list. Name that door and stop. A pack on software owns how a group keeps a program. Name that door and stop. This pack owns the Python language walk.

The tutorial on the official documentation host is written for people who already know some other program. This book starts earlier. You can read, you have this machine, and you have not yet written a step this interpreter will take. The language reference, the tutorial, and the style door are in `LINK_INDEX.md`.

The tutorial says the interpreter and the standard library are freely available from https://www.python.org/, in source or binary form, for the major platforms, and may be freely distributed. Get the interpreter from that door. This book is the list of steps it runs.

This pack is public general education.

---

## 1. A list of steps

Nia wants a machine to write the number of seed packets on the counter. She does not wave at the screen. She writes a line the interpreter can take.

    print(14)

`print` is a step that writes a line out so a person can see it. `14` is the thing to write. The parentheses mark what that step is given. Run that line, and the interpreter writes `14`. One step, one result.

Two steps run in the order you wrote them:

    print(14)
    print(3)

First 14. Then 3. Swap the lines, and the outgoing order swaps. The list is the program. The interpreter does not guess which line you meant first.

A blank line is not a step. A line that starts with `#` is a note for a person. The interpreter skips it.

    # packets on the counter this morning
    print(14)

The note does not change the 14. It keeps the reason next to the step.

A step can do arithmetic before it writes. `print(14 + 3)` writes `17`. `print(8 * 7)` writes `56`. `print(45 / 5)` writes `9.0`. The slash with one line is a share that may have a fractional part. Two slashes share and keep the whole count: `print(19 // 4)` writes `4`. The leftover after that share is `print(19 % 4)`, which writes `3`. Check those by hand: 4 groups of 4 make 16, leftover 3, and 16 + 3 is 19.

Order of steps is not the same as order inside a step. Inside one step, multiply and share bind tighter than add and take away, the same way they do on paper. `print(2 + 3 * 4)` writes `14`, because 3 groups of 4 make 12, then 2 more make 14. Parentheses change the grouping: `print((2 + 3) * 4)` writes `20`.

If a line is not a legal step, the interpreter stops and names the break. Chapter 8 takes that stop. Here, the object is the list itself: lines in order, each a step, each either done or refused.

**Check.** A new list:

    print(23 - 6)
    print(11 * 4)

First line writes `17`. Second writes `44`. Do both by hand. If the interpreter writes 17 then 44, the list ran in order. If it writes 44 first, the lines were swapped. A third new step: `print(18 // 5)` writes `3`, leftover `print(18 % 5)` writes `3`, because 3 groups of 5 make 15, leftover 3.

---

## 2. A name for a value

Nia counts 14 packets, then three more arrive. She could write `print(14)` and later `print(14 + 3)`. The 14 now lives in two places. Change the morning count, and you must hunt every copy.

Give the count a name.

    packets = 14
    print(packets)

`packets` is a label stuck on the value 14. The equals sign here is not a claim that both sides were already the same. It is a step: make this name mean this value. After that line, `packets` names 14. `print(packets)` writes `14`.

Change the name when the pile changes.

    packets = 14
    packets = packets + 3
    print(packets)

Read the middle line from the right. Take the value `packets` now names, add 3, and stick the name on the new value. 14 + 3 is 17. The last line writes `17`. The name stayed. The value moved.

A name is not the number. Two names can point at the same kind of thing.

    morning = 14
    noon = 8
    print(morning + noon)

That writes `22`. `morning` and `noon` are two labels. Adding the names adds the values they currently name.

A name must be written the way the language allows: letters, digits, underscore. It cannot start with a digit. `2packets` is not a name. `packets2` is. The language also reserves some words for its own steps. `print` is already a step. `if` and `for` and `def` are already structure. Do not reuse those as names. The language reference keeps the full list of reserved words. This book uses plain names: `packets`, `shelf`, `total`.

A name that has not been given a value is not a quiet zero. It is a missing label. Using it is an error. Chapter 8 takes that stop. Give the name a value before you ask for it.

Numbers come in two everyday kinds. A whole count is an integer: 14, 0, 3. A number with a fractional part is a float: `9.0`, `2.5`. `45 / 5` gives `9.0` even though 9 is whole, because one-slash share is defined to give a float. `45 // 5` gives `9`, a whole count.

**Check.** A new shop morning: `trays = 8`, then `trays = trays * 7`, then `print(trays)`. 8 groups of 7 is 56. The name `trays` means 56 after the second line. A second new fill: `left = 23`, `taken = 6`, `print(left - taken)` writes `17`. If you print `left` after that line and still see 23, you computed the difference without renaming `left`. The take-away does not change `left` unless you write `left = left - taken`.

---

## 3. A choice

Wren sells ferry tickets. If a dock has at least 12 waiting, she opens a second gangway. If it has fewer, she does not. The next step depends on a yes or a no.

    waiting = 15
    if waiting >= 12:
        print("second gangway")
    else:
        print("one gangway")

The line with `if` tests a claim. `>=` means at least. 15 is at least 12, so the claim is true, and the indented step under `if` runs. The indented step under `else` is skipped. The interpreter writes `second gangway`.

Change the number.

    waiting = 9
    if waiting >= 12:
        print("second gangway")
    else:
        print("one gangway")

9 is not at least 12. The `if` claim is false. The `else` step runs. The interpreter writes `one gangway`.

The indent is the grouping. Steps that belong to the choice sit farther in than the `if` line. Python reads that indent as structure, not as decoration. A later line that sits back at the left is not part of the choice. It runs after the choice is over.

A claim in this language is `True` or `False`. Those two words are values, with the capitals. `print(15 >= 12)` writes `True`. `print(9 >= 12)` writes `False`. Other tests: `==` asks whether two values are the same, `!=` asks whether they differ, `<` less, `>` greater, `<=` at most. `print(3 == 3)` writes `True`. `print(3 == 4)` writes `False`. One equals assigns a name. Two equals ask a question. Mixing them is a usual break.

Two claims can sit together. `and` needs both true. `or` needs at least one true. `not` flips true to false and false to true.

    waiting = 15
    windy = False
    if waiting >= 12 and not windy:
        print("second gangway")
    else:
        print("hold")

15 is at least 12, and it is not windy, so both halves hold. The interpreter writes `second gangway`. If `windy` were `True`, `not windy` would be false, the `and` would fail, and the line would write `hold`.

A third branch uses `elif`, a second test that runs only if the first claim failed.

    waiting = 12
    if waiting > 12:
        print("second gangway")
    elif waiting == 12:
        print("stand by")
    else:
        print("one gangway")

12 is not greater than 12. The `elif` claim is true. The interpreter writes `stand by`. Only one of those three branches runs.

**Check.** A new dock: `waiting = 4`. Using the first program in this chapter, 4 is not at least 12, so the outgoing line is `one gangway`. A new pair: `waiting = 20` and `windy = True`. Using the `and not windy` program, the `and` fails, so the outgoing line is `hold`. A new comparison: `print(11 * 4 == 44)` writes `True`. `print(11 * 4 == 43)` writes `False`. If both printed `True`, the second test was written with one equals, which assigns, rather than with two, which asks.

---

## 4. A repeat

Ivo paints trail posts. There are five posts. He could write `print` five times. Tomorrow there are forty. The list of steps should not grow with the pile.

Name the pile, then walk it.

    posts = [1, 2, 3, 4, 5]
    for post in posts:
        print(post)

`for` takes one item at a time from the pile, sticks the name `post` on that item, and runs the indented step. First `post` names 1, and the interpreter writes `1`. Then 2. Then 3. Then 4. Then 5. Five turns, one step written once.

The pile in square brackets is a list. Chapter 6 takes the list as an object. Here the object is the repeat: the same indented step, once per item.

`range` names a run of whole numbers. `range(5)` is 0, 1, 2, 3, 4. Five numbers, starting at 0, stopping before 5.

    for n in range(5):
        print(n)

That writes 0 then 1 then 2 then 3 then 4. `range(1, 6)` is 1, 2, 3, 4, 5. The left end is in. The right end is out.

A repeat can add.

    total = 0
    for n in [4, 0, 11]:
        total = total + n
    print(total)

Start at 0. Add 4: now 4. Add 0: still 4. Add 11: now 15. The last line writes `15`. The name `total` is the running pile. The `for` line does not add. The indented line does.

A repeat that waits on a claim uses `while`. The indented steps run as long as the claim stays true.

    left = 3
    while left > 0:
        print(left)
        left = left - 1

3 is greater than 0, so write 3, then `left` becomes 2. 2 is greater than 0, write 2, then 1. 1 is greater than 0, write 1, then 0. 0 is not greater than 0, so the repeat stops. The interpreter wrote 3, then 2, then 1.

If the claim never goes false, the repeat never stops. `while True:` with no change inside is that trap. Change a name inside the body so the claim can fail, or do not use `while`.

`for` is the repeat when you already have the pile, or a `range`. `while` is the repeat when you only have a claim. Prefer `for` when the pile is known.

**Check.** A new pile: `for n in [8, 7, 2]:` with `total` starting at 0 and `total = total + n` each turn. 8 + 7 + 2 is 17. The print after the loop writes `17`. A new `range`: `range(4)` is 0, 1, 2, 3. Four turns, not five. A new `while`: `left = 2`, same body as above. Outgoing lines: `2` then `1`. If you also see `0`, the claim was `left >= 0` rather than `left > 0`.

---

## 5. A function

Calder weighs three kiln shelves. Each time he takes a raw weight and adds 2 for the empty board. He could copy `raw + 2` at every call. Copying the arithmetic copies the mistakes.

Give the job a name.

    def boarded(raw):
        return raw + 2

    print(boarded(11))
    print(boarded(7))

`def` starts a function: a named list of steps you can run later. `boarded` is the name of the job. `raw` is a name that exists inside the job, filled by whatever you hand in. `return` sends a value back out. `boarded(11)` runs the job with `raw` naming 11. 11 + 2 is 13, so that line writes `13`. The next line hands in 7 and writes `9`.

The name `raw` inside the job is not a name outside it. After those lines, there is no `raw` sitting in the rest of the program unless you also made one there. The job's names stay in the job. That is the point of the wrapping: you can use `boarded` without caring what it called its incoming number.

A function can take more than one incoming value.

    def remaining(start, sold):
        return start - sold

    print(remaining(23, 6))

23 take away 6 is 17. The first incoming value fills `start`. The second fills `sold`. Order is the match.

A function can run a choice or a repeat. The body is an ordinary list of steps, indented under the `def` line.

    def gangway(waiting):
        if waiting >= 12:
            return "second"
        else:
            return "one"

    print(gangway(15))
    print(gangway(4))

First call writes `second`. Second writes `one`. The choice from chapter 3 now sits behind one name.

If a function has no `return`, it still runs its steps. The value it sends back is `None`, a value that means nothing was sent. `print` writes a line out and sends `None` back. Do not add the result of `print`. Add the result of a function that returns a number.

**Check.** A new job: `def packed(boxes, extra): return boxes * extra`. `print(packed(8, 7))` writes `56`. A second new job: `def leftover(count, group): return count % group`. `print(leftover(19, 4))` writes `3`. A new choice job: `gangway(12)` with the function above. 12 is at least 12, so it returns `second`. If you got `one`, the test was `>` rather than `>=`. Put 12 back into the test by hand before you trust the name.

---

## 6. A list of things

Nia's counter holds four named packets: cedar, ash, oak, pine. That is one pile, in order, that can grow and shrink.

    kinds = ["cedar", "ash", "oak", "pine"]
    print(kinds[0])
    print(kinds[3])
    print(len(kinds))

Square brackets make the list. The first slot is number 0, not 1. `kinds[0]` is `"cedar"`. `kinds[3]` is `"pine"`. Four things, last index 3. `len(kinds)` is 4, the count of slots.

Index 4 is not a slot. Asking for `kinds[4]` is an error. The last legal index is `len(kinds) - 1`.

A negative index counts from the end. `kinds[-1]` is `"pine"`, the last thing. `kinds[-2]` is `"oak"`.

Change a slot by naming it on the left of equals.

    kinds[1] = "maple"
    print(kinds[1])

Slot 1 was `"ash"`. Now it is `"maple"`. The list is the same object. One slot moved.

Add a slot at the end with `append`.

    kinds.append("beech")
    print(len(kinds))

Five slots now. `kinds[4]` is `"beech"`.

Walk the list with `for`, as in chapter 4.

    for kind in kinds:
        print(kind)

Each turn, `kind` names the next text. You do not have to write the indexes unless you need the number of the slot. If you need the number and the thing, `range(len(kinds))` gives 0 through 4 for a list of five, and `kinds[i]` is the thing at slot `i`.

A list can hold numbers.

    rain = [4, 0, 11, 7, 2]
    total = 0
    for mm in rain:
        total = total + mm
    print(total)

4 + 0 + 11 + 7 + 2 is 24. The list is the pile. The loop is the walk. The name `total` is the running sum.

An empty list is `[]`. `len([])` is 0. You can append onto empty. Empty is a legal pile, not a missing answer.

Two lists joined with `+` make a new list: `[1, 2] + [3]` is `[1, 2, 3]`. The originals stay unless you rename.

**Check.** A new list: `docks = ["north", "east", "west"]`. `docks[0]` is `"north"`. `docks[2]` is `"west"`. `len(docks)` is 3. Last legal index is 2. A new number list: `[8, 7, 2]`, sum with a running total starting at 0. The print is `17`. A new append: start with `[1, 2]`, append 9, length is 3, last slot is 9. If `docks[3]` ran, that slot does not exist. The check is the error, not a blank.

---

## 7. Text

A packet name is not a count. It is letters in order. Python writes text in quotes.

    label = "cedar"
    print(label)
    print(len(label))

`label` names the text `cedar`. `len` on text counts the characters. c-e-d-a-r is 5. `print(len("oak"))` writes `3`.

Quotes can be single or double. `"oak"` and `'oak'` are the same text. Pick one pair and close it. If the text itself holds a quote, wrap with the other kind: `"Wren's dock"` or `'say "wait"'`.

Add text to text with `+`. That is joining, not arithmetic.

    print("ash" + "oak")

That writes `ashoak` with no space. The space is a character you must put in: `"ash" + " " + "oak"` writes `ash oak`.

A number is not text. `print("shelf " + 3)` is an error: the two sides of `+` are different kinds. Turn the number into text with `str`: `print("shelf " + str(3))` writes `shelf 3`. Turn digits in text into a number with `int`: `int("14") + 3` is 17. `int` wants digits, not `"fourteen"`.

A formatted line can drop a name into text. Put `f` before the quotes, and write the name in braces.

    packets = 14
    print(f"{packets} packets on the counter")

That writes `14 packets on the counter`. The braces are a slot. The name's current value fills it.

Characters have indexes, like a list of letters. `"cedar"[0]` is `"c"`. `"cedar"[4]` is `"r"`. A slice takes a run: `"cedar"[0:3]` is `"ced"`. The left index is in. The right index is out. Same rule as `range`.

Ask whether a piece sits inside a text with `in`. `"ed" in "cedar"` is `True`. `"oak" in "cedar"` is `False`. That `in` is a claim, so it can drive an `if`.

**Check.** A new word: `len("beech")` is 5. `"beech"[0]` is `"b"`. `"beech"[0:3]` is `"bee"`. A new join: `"pine" + " " + "lot"` writes `pine lot`. A new fill: `n = 8`, then `f"{n} trays"` writes `8 trays`. A new number-from-text: `int("23") - 6` is 17. If `int("23") - 6` failed, the quotes were still on in a join, and you added text to a number. Strip the problem to `int("23")` first. That value is 23, a count.

---

## 8. An error

Sela divides rain by the number of days she recorded. One morning the notebook is empty. Days is 0. Share by 0 is not a number. The interpreter stops and names the break.

    print(24 / 0)

That line does not write a share. It raises `ZeroDivisionError`. The program ends at that line unless you catch the stop.

An error is a stop with a name. The name tells you which kind of break. Using a name you never filled is `NameError`. Asking for slot 4 in a list of four is `IndexError`. Adding text to a number is `TypeError`. Opening a file this machine does not have is `FileNotFoundError`. Writing a line the language cannot parse is a syntax error: the list is not even a program yet, so no step runs.

The stop is useful. It is the interpreter refusing to guess. A quiet wrong number is worse than a named stop.

You can catch a named stop and take another step.

    days = 0
    total = 24
    try:
        print(total / days)
    except ZeroDivisionError:
        print("no days recorded")

`try` marks the step that might break. `except` names the break you are willing to handle. Days is 0, so the share fails, the `except` body runs, and the interpreter writes `no days recorded`. The program continues after that. If `days` were 4, the share would be 6.0, the `except` body would not run, and the line would write `6.0`.

Catch the error you can answer. Do not catch every stop and hide it. An `except` that swallows a `NameError` you did not expect will hide a misspelled name. Name the error. Handle that case. Let other stops still stop.

You can raise a stop on purpose when a value is not usable.

    def boarded(raw):
        if raw < 0:
            raise ValueError("raw weight below 0")
        return raw + 2

`boarded(-1)` does not return 1. It raises `ValueError`. A negative kiln weight is not a case this job will paper over.

Syntax errors are fixed in the text before a run. A missing colon after `if waiting >= 12`, or an indent that does not match, or a quote left open: the interpreter points at the line. Fix the line. Do not catch syntax with `try`. `try` handles stops that happen while steps run.

**Check.** A new share: `total = 18`, `days = 5`. 18 / 5 is 3.6. No error. A new empty: `days = 0` with the `try` above. Outgoing text is `no days recorded`. A new missing name: `print(trays)` when `trays` was never filled. That is `NameError`, not 0. A new slot: `kinds = ["cedar", "ash"]`, then `kinds[2]`. Two slots, legal indexes 0 and 1. Index 2 is `IndexError`. If that line printed `ash`, you counted from 1. Count from 0.

---

## 9. A file

The computers pack already taught what a file is, and that this machine keeps files in folders. Name that door and stop. This chapter is the Python step that opens a file, reads text, or writes text.

Sela keeps millimetres of rain in a file named `rain.txt` in the same folder as the program. Each line is one day.

    4
    0
    11
    7
    2

A program can open that file, read the lines, and close it.

    with open("rain.txt") as notebook:
        text = notebook.read()
    print(text)

`open` is the step that reaches the file by name. `with` makes sure the file is closed when the indented block ends, even if a step inside breaks. `read` pulls the whole text into one string. `print` then writes that text out. After the `with` block, the name `notebook` is not a still-open file.

Read line by line when you want one number per turn.

    total = 0
    with open("rain.txt") as notebook:
        for line in notebook:
            total = total + int(line)
    print(total)

Each `line` is text, including the end-of-line mark. `int` reads the digits and ignores the extra space around them. 4 + 0 + 11 + 7 + 2 is 24. The file is the pile. The loop is the walk. `int` is the bridge from text to a count.

Writing uses a mode. Open for write with `"w"`. That mode creates the file if it is missing, and it erases an existing file of that name before it writes.

    with open("total.txt", "w") as out:
        out.write("24\n")

After that program, `total.txt` holds the line `24`. The `\n` is a new line. Without it, the next write would sit on the same line.

Open with `"a"` to append: add to the end, keep what was there. Open with `"r"` to read, which is the default. Do not open a log with `"w"` if you meant to keep last week's numbers. `"w"` starts a new file.

If the name `rain.txt` is not in the folder the interpreter is using, `open("rain.txt")` raises `FileNotFoundError`. The computers pack owns folders and where a name points. This pack owns the stop: catch it, or put the file where the name says.

A file is text on this machine. A name in the program is a value in memory. Reading copies text into a name. Writing copies a name out to text. Closing (or leaving the `with` block) finishes the copy. If you rename `total` in memory and never write, the file is unchanged.

**Check.** A new notebook with three lines, `8`, `7`, and `2`. The line-by-line program sums to 17. A new write: `out.write("17\n")` into `total.txt` in `"w"` mode. The file then holds `17` and a new line, and whatever used to be in `total.txt` is gone. A new miss: `open("missing.txt")` with no such file. That is `FileNotFoundError`. If the sum of 8, 7, and 2 printed 872, you joined text instead of running `int` on each line. `"8" + "7" + "2"` is `"872"`. `int("8") + int("7") + int("2")` is 17.

---

## 10. A check

The object of this book is a list of steps the Python interpreter can run. A check is a new case that uses the pieces and still closes by hand.

Sela's week: five days of rain, already in `rain.txt` as 4, 0, 11, 7, 2. She wants a total, a word for the week, and a file that stores the total. Wet week if the total is at least 20. Dry week otherwise.

    def week_word(total):
        if total >= 20:
            return "wet week"
        else:
            return "dry week"

    def sum_file(path):
        total = 0
        with open(path) as notebook:
            for line in notebook:
                total = total + int(line)
        return total

    mm = sum_file("rain.txt")
    word = week_word(mm)
    with open("summary.txt", "w") as out:
        out.write(f"{mm} {word}\n")
    print(word)

Hand the arithmetic first, without the machine. 4 + 0 = 4. 4 + 11 = 15. 15 + 7 = 22. 22 + 2 = 24. 24 is at least 20, so `week_word(24)` returns `wet week`. The print writes `wet week`. The file `summary.txt` holds the line `24 wet week`.

Put a new number through the same jobs. New file `rain.txt` with three lines: 8, 7, 2. Sum 17. 17 is not at least 20, so the word is `dry week`. The summary line is `17 dry week`. If that run still says `wet week`, `sum_file` did not reread the file, or `week_word` still has 24 sitting in a name you did not refresh.

Empty file. `sum_file` should return 0. `week_word(0)` returns `dry week`. If instead the program raises `ZeroDivisionError`, a later step shared by the count of days, and the count was 0. This check does not share. It adds. Empty is a legal pile. The total is 0.

A line that is not digits. `int("cedar")` raises `ValueError`. Catch that in `sum_file` only if you have a rule for a bad line. This check has no such rule. Let the stop name the bad line. Fix the file.

A missing file. `sum_file("rain.txt")` raises `FileNotFoundError`. That stop is the answer until the file exists in the folder the interpreter is using.

The language reference at https://docs.python.org/3/reference/ is the exact page when a line's meaning must be pinned. The tutorial at https://docs.python.org/3/tutorial/ is the longer informal walk, written for people who already know some other program. PEP 8 at https://peps.python.org/pep-0008/ is the style door for how a group writes Python. PEP 20 at https://peps.python.org/pep-0020/ is the short page of proverbs. This book does not copy those pages. It taught one object: a list of steps, with names, a choice, a repeat, a function, a list of things, text, a named stop, and a file, that Python 3.14.7 as documented on 21 September 2026 can run.

Do the 24 millimetre week by hand. Do the 17 millimetre week by hand. If both close, the list of steps is doing the job. If one fails, the fill was copied wrong, not "almost right."
