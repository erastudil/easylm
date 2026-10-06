---
title: "databases — a table that lasts"
date: "2026-09-21"
status: draft
start: algebra
needs: computers
home: "drafts/agy-review/packs/databases/"
---

# A table that lasts

A card in a drawer can hold four apple lots, and a file on this machine can hold the same four lines. You already keep files. Algebra already let you put a letter on a number you have not filled in yet. The data pack is a table as a teaching picture. The computers pack is the file on this machine. Stay here for the grid that is still there after you quit, the handle that finds one row, the question that does not rewrite the grid, and the pair of writes that both land or both fail.

Vendor language pages and the SQL framework cards are in `LINK_INDEX.md`. A version, a reserved word, or an isolation table you did not open on that host is unverified. Run a line on a program installed on this machine.

This pack is public general education.

---

## 1. A table that lasts

Ivy at Thornwell Orchard writes four apple lots on a card:

| lot_id | variety | crates |
|---|---|---|
| 1004 | russet | 41 |
| 1009 | pippin | 18 |
| 1016 | winesap | 7 |
| 1021 | ashmead | 22 |

She closes the card in a drawer. In the morning the four rows are still there. That is the first job: the grid survives a close.

A scrap on the press that blows into the millrace does not survive. A window that forgets when she quits the program does not survive. A file of four lines can survive, and the computers pack already owns that file. The extra job here is that the grid has named columns, that every row uses those columns in the same order, and that tomorrow she can ask a question of the grid without rewriting it by hand.

She tells the program the shape once.

    CREATE TABLE lots (
      lot_id INTEGER,
      variety TEXT,
      crates INTEGER
    );

Four rows go in.

    INSERT INTO lots VALUES (1004, 'russet', 41);
    INSERT INTO lots VALUES (1009, 'pippin', 18);
    INSERT INTO lots VALUES (1016, 'winesap', 7);
    INSERT INTO lots VALUES (1021, 'ashmead', 22);

`CREATE TABLE` names the grid and the columns. `INSERT` puts a row in. `INTEGER` is a whole count. `TEXT` is letters. The names of those types, and which spellings a given program accepts, live on the vendor language pages. PostgreSQL 18.6 data definition is one door. SQLite's SQL language page is another. MariaDB Server is a third. This chapter keeps the shape: named columns, rows that last.

People name that lasting grid a **table**. The language that writes the shape, puts a row in, asks a question, and changes a row is **SQL**. ISO/IEC 9075 is the catalog name for that language family. The 2016 framework page is withdrawn. The 2023 framework page was not opened past its catalog card. Run a line against a vendor that is installed on this machine. Do not treat a remembered standard clause as the run.

Ivy quits the program. She starts it again. She asks for the russet row. If lot 1004 still holds 41 crates, the table lasted. If the grid is empty, she wrote to a window, not to a table.

A teaching picture of a row and a column, used to count a group or name a rate, lives in the data pack. Name that door and stop. The object here is the same grid after a restart, ready for a question.

**Check.** New rows, not the four above. Lot 1108, variety `spitzenburg`, 12 crates. Lot 1112, variety `newton`, 29 crates. `INSERT` both. Close the program. Open it. Ask for both rows. 12 and 29 must still be there. If 29 became 0, the write did not last. If 1108 is missing and 1112 remains, one `INSERT` never reached the table. Two new rows. One close. Both still there, or the object failed.

---

## 2. A key

Two lots on Ivy's grid both say russet. One is from the north slope, 41 crates. One is from the windbreak, 14 crates. If she writes `variety` as the only handle, she cannot tell Cal which russet to press. The word russet names a kind. It does not name a row.

She already has `lot_id`. 1004 is the north slope. 1033 is the windbreak. No other row may use 1004. No other row may use 1033. The number is not the apples. The number is the handle.

Algebra already let a letter stand for a fill you have not chosen yet. Let `k` be the handle of a row. For two rows in the same table, `k` on the first and `k` on the second must not be the same fill. If they are the same fill, the handle failed.

She tells the program that rule when she names the grid.

    CREATE TABLE lots (
      lot_id INTEGER PRIMARY KEY,
      variety TEXT,
      crates INTEGER
    );

`PRIMARY KEY` on `lot_id` is the rule: every row has a handle, and the handle does not repeat. An `INSERT` that tries a second 1004 is refused. The 41-crate russet stays 41. The windbreak russet must take a new handle, 1033, and then it may sit.

People name that never-repeating handle a **key**. When the handle is the one the table itself uses to mean "this row and no other," people name it a **primary key**. A second column can also refuse repeats without being the primary handle. `variety` must not be that column here. Two russets are legal. Two 1004s are not.

A name is not a key just because it is a word. `pippin` will come back next year. The new pippin is a new row. It needs a new `lot_id`. Last year's 1009 stays 1009 in the record, even if those crates are gone.

Cal's press log will later point at `lot_id`, not at the letters `russet`. Chapter 4 takes that pointing. Here the job is smaller: one table, one handle, no twins.

**Check.** New table, new numbers. Lot 2044, variety `cox`, 31 crates, sits as the primary key 2044. A second `INSERT` with `lot_id` 2044 and 8 crates of `cox` must be refused. The row that remains must still say 31, not 8, not 39. A third `INSERT` with `lot_id` 2045 and 8 crates of `cox` must sit. Two `cox` rows, two handles, 31 and 8. If both 2044 rows sit, the key did no work.

---

## 3. A query

Ivy wants every lot with more than 20 crates. She could slide a finger down the card: 41 is more, 18 is not, 7 is not, 22 is more. Four rows, the finger works. Four thousand rows, the finger lies.

She asks the table.

    SELECT lot_id, variety, crates
    FROM lots
    WHERE crates > 20;

The program returns two rows from the four in chapter 1: 1004 russet 41, and 1021 ashmead 22. 1009 and 1016 stay in the table. They do not appear in this answer. The ask did not delete them.

`SELECT` names the columns she wants to see. `FROM` names the table. `WHERE` names the test. `crates > 20` is ordinary comparison. Fill `crates` with 41: 41 > 20 is true, so 1004 is in the answer. Fill with 18: 18 > 20 is false, so 1009 is out. The letter in algebra was a blank in a sentence. The column here is a blank that already has a fill on each row. The test runs once per row.

People name that ask a **query**. The query does not rewrite the table unless she writes a different kind of sentence, an `UPDATE` or a `DELETE`. This chapter's query only reads.

A missing crate count is not 0. 0 means she counted none. A blank cell means the count was not written. A test `crates > 20` does not pick a blank. Dialect rules for a blank cell live on the vendor NULL pages. This sitting did not fetch SQLite's null-handling page. Treat a blank as "not yet written," and do not invent a three-valued table from memory.

She can ask with a letter she fills in.

    SELECT lot_id, crates
    FROM lots
    WHERE lot_id = 1016;

That answer is one row: 1016, 7 crates. If she fills 1099 and no row has that handle, the answer is empty. Empty is a legal answer. It is not an error. The table lasted. The handle was not in it.

**Check.** New test on the chapter 1 four: `crates < 10`. Only 1016 winesap 7 must come back. If 1009 pippin 18 comes back, the test used the wrong comparison. New test: `variety = 'russet'`. Only 1004 with 41 must come back. If both russet and ashmead come back, the test matched the wrong column. New fill: `WHERE lot_id = 1004 AND crates > 40`. 41 > 40 is true, so 1004 returns. Change the 40 to 41. 41 > 41 is false, so the answer is empty. The row is still in the table with 41. The query did not take it away.

---

## 4. Join

Cal's press log names lots by number. Ivy's lot grid names lots by number too. Cal wrote:

| press_id | lot_id | used |
|---|---|---|
| 3 | 1009 | 5 |
| 4 | 1004 | 11 |

He wants the variety next to each press, not only the number. The variety does not live in his log. It lives in `lots`. The shared fill is `lot_id`.

One sentence can walk both grids.

    SELECT lots.lot_id, lots.variety, presses.press_id, presses.used
    FROM lots
    JOIN presses ON lots.lot_id = presses.lot_id;

The program lines up rows where the two `lot_id` fills are the same. Press 3 used 5 crates from 1009, which is pippin. Press 4 used 11 crates from 1004, which is russet. Lot 1016 winesap has no press row, so it does not appear. Lot 1021 ashmead has no press row, so it does not appear. They are still in `lots`.

People name that lining-up a **join**. The join is not a third table she must keep by hand. It is an ask that uses two tables and a test that the handles match. Algebra would write the match as `lots.lot_id = presses.lot_id`, two letters that must take the same fill on a paired row.

If Cal writes `lot_id` 1099 in the press log, and 1099 is not in `lots`, a plain join of this shape drops that press row from the answer. The log still holds 1099. The join found no partner. Chapter 7 can refuse the 1099 write in the first place. This chapter only reads.

A join on the wrong column is a quiet miss. If she writes `ON lots.crates = presses.used`, 11 crates of russet would pair with a press that used 11, even if that press drank a different lot. Same number, different object. Match the handle, not a count that happens to look alike.

**Check.** New press row: press 5, lot 1021, used 4. The join must now add ashmead next to press 5. Three answer rows: pippin with 5 used, russet with 11 used, ashmead with 4 used. Winesap still absent from the answer, still present in `lots` with 7. New miss: press 6, lot 1099, used 2. A join that requires a partner does not show press 6. If press 6 appears with a blank variety, the ask was a different join than this chapter wrote. If winesap appears with used 0, the join invented a press row. It must not.

---

## 5. A transaction

Lot 1009 holds 18 crates. Cal takes 11. Rui takes 11. Both write at once.

Without a wrap, both can read 18. Cal computes 18 − 11 = 7 and writes 7. Rui computes 18 − 11 = 7 and writes 7. Each take looks legal in isolation. Together they took 22 from 18. The table now says 7. The barn is short 11 crates that both people believe they hold.

Let `C` be crates on the row at the start of a take. Let `T` be the take. The leftover is `L = C − T`. The take is legal only if `L >= 0`. Cal's fill: `C = 18`, `T = 11`, `L = 7`. Legal if he is alone. Rui's fill uses the same `C = 18` only if he did not see Cal's write. Two takes from one start is the sentence `L = C − T1 − T2`. Fill `T1 = 11`, `T2 = 11`: `L = 18 − 11 − 11 = −4`. Negative leftover is not a pile. The pair must not both commit.

The wrap is: begin, do the reads and writes, then either keep all of them or keep none of them.

    BEGIN;
    UPDATE lots SET crates = crates - 11 WHERE lot_id = 1009;
    COMMIT;

If Cal's wrap still holds the row, Rui's wrap must wait, or it must read 7, compute 7 − 11 = −4, and **roll back**: undo its own writes, leave 7. After a rollback, lot 1009 still has whatever the other wrap kept. It does not keep 7 from Rui and 7 from Cal as if both takes had fit.

    BEGIN;
    UPDATE lots SET crates = crates - 11 WHERE lot_id = 1009;
    ROLLBACK;

People name that wrap a **transaction**. All of the writes inside it happen, or none of them do. The other person does not see a row in the middle of the wrap. PostgreSQL names concurrency control and transaction processing as chapters 13 and 67 in the 18.6 table of contents. SQLite names a page on how atomic commit is implemented, and a page on isolation. This sitting fetched those titles, not those bodies. Any claim about snapshot names, lock names, or write-ahead log layout is unverified. The orchard fact is enough to start: two takes from 18 cannot both keep 11.

A crash in the middle of the wrap must finish the way a rollback does: the row is as it was before the wrap, or as it is after a full commit, never a mix of the two. SQLite's atomic-commit door is the page when that crash story must be exact. Until you open it, treat "all or none" as the rule you can check with 18, 11, and 11.

**Check.** New pile: lot 1016 holds 7. Cal takes 4. Rui takes 4. `L = 7 − 4 − 4 = −1`. One wrap may commit. The other must roll back. After both finish, crates must be 3, not −1, not 7, not 4. New legal pair: lot 1004 holds 41. Cal takes 11. Rui takes 8. `L = 41 − 11 − 8 = 22`. Both may commit, in some order, ending at 22. If the table ends at 30, one take vanished. If it ends at 41, neither take lasted. If it ends at 22, the wraps did the arithmetic.

---

## 6. An index

The grid has 4,100 lots. Ivy asks for lot 1009.

    SELECT variety, crates
    FROM lots
    WHERE lot_id = 1009;

Without help, the program may walk row 1, row 2, row 3, until it finds 1009 or runs out. If 1009 is last, that is 4,100 looks for one handle. The answer is still pippin, 18. The walk was the cost.

She can keep an extra ordered list of `lot_id` values, each pointing at the row that holds that handle. Finding 1009 in an ordered list does not require touching every lot. The extra list is not a second table Ivy edits by hand. The program maintains it when a row is inserted, changed, or deleted.

    CREATE INDEX lots_by_id ON lots (lot_id);

A primary key already needs a way to refuse twins, so many programs already keep such a list on the primary key. An extra index is for a column she searches that is not the primary key: variety, a harvest day, a barn bay. Each extra list has a write cost. An `INSERT` of lot 2044 must add the row and add the handle to each list. A table with five indexes has five extra writes on every insert. If she never asks by that column, the extra list is a tax with no return.

People name that extra ordered list an **index**. PostgreSQL 18.6 has a chapter titled Indexes. SQLite's documentation index lists indexes on expressions and partial indexes. This sitting did not fetch those chapter bodies. This chapter keeps one column, one extra list, one search.

An index does not change the meaning of a query. `WHERE lot_id = 1009` still means "the row whose handle is 1009." It may change how long the program takes to find it. If the answer with the index is newton 29, and the answer without it is pippin 18, the index is wrong, or she is looking at two different tables. Same ask, same table, same answer.

**Check.** New search column: variety. Lots 1004 and 1033 are both russet. `CREATE INDEX lots_by_variety ON lots (variety)` then `SELECT lot_id, crates FROM lots WHERE variety = 'russet'`. Both 1004 with 41 and 1033 with 14 must return, in some order. If only 1004 returns, the index covered a leftover subset, or the second russet was never inserted. New write: `INSERT` lot 2046, variety `pippin`, 16 crates. A search `WHERE variety = 'pippin'` must now include 2046 with 16 as well as 1009 with 18. If 2046 is missing from that answer but present in `SELECT * FROM lots`, the extra list was not updated. The row lasted. The index did not.

---

## 7. A constraint

Rui types minus 3 crates for lot 1004. The barn cannot hold minus 3. The table can, unless someone told it not to.

    CREATE TABLE lots (
      lot_id INTEGER PRIMARY KEY,
      variety TEXT NOT NULL,
      crates INTEGER CHECK (crates >= 0)
    );

`NOT NULL` on `variety` refuses a row with no variety written. `CHECK (crates >= 0)` refuses a negative pile. `PRIMARY KEY` already refused a second 1004. Those rules sit in the table. They fire on `INSERT` and on `UPDATE`. Rui does not have to remember them on Tuesday if they were named on Monday.

    INSERT INTO lots VALUES (1088, 'winesap', -3);

That sentence must fail. Lot 1088 must not sit. Lot 1004 must still hold 41, not 38, not −3.

Cal's press log can be told to point only at a `lot_id` that already exists.

    CREATE TABLE presses (
      press_id INTEGER PRIMARY KEY,
      lot_id INTEGER,
      used INTEGER CHECK (used >= 0),
      FOREIGN KEY (lot_id) REFERENCES lots (lot_id)
    );

`INSERT INTO presses VALUES (6, 1099, 2)` must fail if 1099 is not in `lots`. Chapter 4's join dropped an unmatched 1099 from a read. This rule drops it from a write.

People name those rules **constraints**. A primary key is one. A check on a count is one. A foreign key, the pointer that may only land on a living handle, is one. SQLite's documentation index names foreign key support as introduced in version 3.6.19. Whether a given SQLite build has that support turned on is a runtime fact. This sitting did not fetch the foreign-key chapter body. If an `INSERT` of press 6 with lot 1099 sits, either the rule was not declared, or the program is not enforcing it. The orchard rule is the same either way: do not point at a lot that is not there.

A constraint is not a query. A query asks. A constraint refuses. After a refused `INSERT`, a `SELECT` for 1088 is empty. The failure is the result.

**Check.** New legal row: lot 1088, winesap, 0 crates. 0 is a pile. The check was `>= 0`, so 0 sits. New illegal `UPDATE`: set lot 1088 crates to −1. The row must remain 0. New foreign key: press 7, lot 1088, used 0. 1088 now exists, so press 7 may sit. Press 8, lot 1099, used 1, must fail if 1099 still does not exist. If press 8 sits, the pointer rule is off. If lot 1088 vanished when press 7 sat, the insert overwrote the wrong table.

---

## 8. Who may read

A visitor walks the tasting room and asks what varieties are in stock. Ivy is willing to say russet, pippin, winesap, ashmead. She is not willing to let the visitor change 41 to 0, and she is not willing to post the crate counts on the wall.

The computers pack already walked a name and a secret for this machine. Name that door and stop. Once the program believes you are Ivy, or believes you are the visitor, the remaining question is: which verbs, on which columns, of which table.

Ivy may `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on `lots`. The visitor may `SELECT variety FROM lots` and nothing else. A visitor `UPDATE lots SET crates = 0 WHERE lot_id = 1004` must be refused. Lot 1004 stays 41. A visitor `SELECT crates FROM lots` must be refused, or must return no crate column, according to how the program names a column privilege. The exact `GRANT` spelling, role catalog, and login rules live in PostgreSQL 18.6 chapters 20 and 21, Client Authentication and Database Roles. This sitting fetched those titles from the table of contents, not those bodies. Any default privilege table printed from memory is unverified.

People name the visitor's allowed verbs a **privilege**, and the named bundle of privileges a **role**. Ivy and the visitor are two roles. The table is the same table. The asks they may issue are not the same asks.

A query that is legal for Ivy can be the same text that is illegal for the visitor. `SELECT crates FROM lots` does not change meaning. The program answers or refuses based on who asked. If the visitor learns 41 because the tasting-room display prints the whole row, the display is a second path. The table's privilege did not fail. The display did.

MariaDB Server documentation is another vendor door for the same object under that product's names. This sitting did not fetch a MariaDB privilege chapter. Do not copy a remembered `GRANT` from one vendor onto the other.

**Check.** New person: Ned, the press lead. Ned may `SELECT` and `UPDATE` crates on `lots`, and may `INSERT` into `presses`. Ned may not `DELETE` a lot. `DELETE FROM lots WHERE lot_id = 1016` as Ned must be refused. 1016 remains, 7 crates. New visitor ask: `SELECT variety FROM lots`. Four names, or more if later rows sat, and no crate column. If 41 appears in the visitor's answer, the privilege leaked a count. If Ned's `UPDATE` of lot 1009 from 18 to 7 is refused, Ned was given the visitor's verbs by mistake.

---

## 9. A copy that can restore

Frost cracks a pipe in the barn office. The machine that held the grid will not start. Ivy needs the four lots back: 41, 18, 7, 22.

A table that lasts through a quit is not yet a table that lasts through a dead machine. She needs a second copy, on a second disk or a second machine, taken on purpose, that she can turn back into the table.

The computers pack owns the file. Name that door and stop. SQLite often keeps the table in one file on this machine. Copying that file can be the copy, if no wrap is still writing at the moment of the copy. Copying a file in the middle of Cal's `UPDATE` can give her a grid that never existed: 7 crates in one place, 18 in another, and an index that does not match the rows. PostgreSQL 18.6 has a chapter titled Backup and Restore. SQLite's documentation index lists a backup interface and write-ahead log mode. This sitting fetched those titles, not those bodies. Any flag list for a hot copy is unverified. The orchard test is simpler: take a copy, change the live table, restore the copy, and see the old fills return.

Ivy takes a copy on Monday night. The copy holds 1004 russet 41, 1009 pippin 18, 1016 winesap 7, 1021 ashmead 22. Tuesday, Cal presses 11 from 1004. The live table now holds 30 on 1004. The pipe bursts. She restores Monday's copy. 1004 is 41 again. Tuesday's 30 is gone. That is the trade: the restore returns the copy she took, not the last wrap she wished she had taken.

People name that taken copy a **backup**, and the act of making the live table match the copy a **restore**. A backup you have never restored is an unverified backup. Restore onto a spare, then `SELECT` the four lots. If 41, 18, 7, and 22 are there, the copy worked. If the spare is empty, the copy was a path to nowhere.

Two copies taken at two times are two objects. Monday's copy and Tuesday's copy will disagree on 1004. Pick the time you mean. Do not average 41 and 30.

**Check.** New live table after Monday's copy: add lot 2044 cox 31, and set 1009 to 7 after Cal's take. Restore Monday's copy onto a spare. The spare must show 1004 41, 1009 18, 1016 7, 1021 22. It must not show 2044. It must not show 1009 as 7. The live table, if it still runs, may still hold 2044 and 7 until she chooses to replace it. New miss: restore the spare, then find 2044 sitting on the spare. Monday's copy was taken too late, or she restored the wrong file. Name the file. Open the spare. Read the four fills.

---

## 10. A check

A new season. New numbers. Same jobs. Lot 2044, variety `cox`, 31 crates, primary key 2044. Press 5 uses 11 crates from 2044. Two people try to take 16 each from the leftover. A search by `lot_id` uses an index. A row with crates −1 is refused. A visitor may read `cox` and may not change 31. A Monday copy must put the starting 31 back.

Make the table.

    CREATE TABLE lots (
      lot_id INTEGER PRIMARY KEY,
      variety TEXT NOT NULL,
      crates INTEGER CHECK (crates >= 0)
    );
    CREATE TABLE presses (
      press_id INTEGER PRIMARY KEY,
      lot_id INTEGER,
      used INTEGER CHECK (used >= 0),
      FOREIGN KEY (lot_id) REFERENCES lots (lot_id)
    );
    CREATE INDEX lots_by_id ON lots (lot_id);

Insert lot 2044, cox, 31. Insert press 5, lot 2044, used 11. `UPDATE lots SET crates = crates - 11 WHERE lot_id = 2044`. Leftover `L = 31 − 11 = 20`. A query `SELECT crates FROM lots WHERE lot_id = 2044` must return 20. A join of `lots` to `presses` on `lot_id` must show cox next to press 5, used 11.

Two wraps now try `T = 16` from that 20. `L = 20 − 16 − 16 = −12`. One wrap may commit, leftover 4. The other must roll back. After both finish, crates must be 4, not −12, not 20, not 16. If both commit, the transaction failed the pair.

`INSERT INTO lots VALUES (2044, 'cox', 8)` must fail on the primary key. `INSERT INTO lots VALUES (2047, 'cox', -1)` must fail on the check. `INSERT INTO presses VALUES (9, 2099, 2)` must fail on the foreign key if 2099 was never inserted.

As the visitor, `SELECT variety FROM lots` may return `cox`. `UPDATE lots SET crates = 0 WHERE lot_id = 2044` must be refused. The 4, or 20 if the takes were not yet run, stays.

Take a copy before the press. Restore that copy onto a spare. The spare must show 31, not 20, not 4. Lot 2047 must not sit on the spare. Press 9 must not sit.

Do the arithmetic by hand first. 31 − 11 = 20. 20 − 16 = 4. The second 16 does not fit. 0 is legal. −1 is not. 2044 does not repeat. 2099 does not exist. The visitor does not write. The Monday copy is 31.

If any one of those fills fails, the fill was copied wrong, not almost right. PostgreSQL 18.6, SQLite's language page, MariaDB Server, and the ISO/IEC 9075 catalog cards are the doors when a dialect line must travel. This sitting did not fetch the 2023 framework body, a current SQLite version off the documentation index, or a MariaDB Community Server version off the landing. Walk 2044 on a program you can run. The orchard numbers above are this book's. They are not a vendor example.
