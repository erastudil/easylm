---
title: "software — undergrad textbook"
date: "2026-09-13"
home: "warehouse/software/"
related:
  - "../computing/"
  - "../math/"
  - "../methods/"
  - "EasyLM calc and units hands"
  - "warehouse/LAW.md"
---

# software — undergrad textbook

a working book for people who must **specify, build, check, and ship** programs.
this file teaches. protocol numbers, git object layout, SQL limits, status codes → fetch the named door / call **calc**. the model does not invent the constant.

**law this book applies:** name the job before the code. a change that cannot be checked did not happen. secrets never enter git. HTTP methods mean what RFC 9110 says they mean. JSON is RFC 8259, not “whatever my language prints.” Hands: **calc** and **units** do arithmetic. warehouse returns the chapter.

---

## 0. how to use this book

read chapter 1, then the chapter the job needs.

| you need | chapter |
|---|---|
| what software engineering is | 1 |
| spec before code | 2 |
| git objects, branch, merge, rebase | 3 |
| remotes, push, evidence | 4 |
| tests that fail closed | 5 |
| HTTP methods and status | 6 |
| JSON | 7 |
| SQL and SQLite | 8 |
| Big-O and common structures | 9 |
| errors, logs, idempotence | 10 |
| secrets | 11 |
| ship a web app | 12 |
| types and public surface | 13 |
| stuck on a bug | 14 |

work order every time: **why → what → how**. name the user-visible change before you open an editor.

computing pack owns machines, languages, compilers. this pack owns **the craft of making software that other people can run and keep**.

---

## 1. what software engineering is

**definition.** software engineering is the disciplined construction of programs that **do what the package says**, can be changed without guessing, and fail in a way a human can see. it is not “typing until it runs.” it is not a stack of tools. it is a chain: intent → spec → implementation → check → ship → observe.

four questions, every time:

1. what is the **user-visible** change (one sentence)?
2. what would **falsify** “it works”?
3. what is the **smallest** thing that can be shipped and checked?
4. what must **never** be in the repo (secrets, generated junk, private data)?

**engineering vs a demo.** a demo shows a path that once worked on one machine. engineering leaves a trail another person can replay: spec, tests, logs, a version. if you cannot say how a stranger would know it is broken, you have a demo.

**the product is the package.** users do not receive your editor. they receive a binary, a site, a library, a container. if the package does not match the README, the software is wrong even if the source looks clever.

**constraints are the job.** time, memory, network, battery, licence, accessibility, threat model. unconstrained “clean code” that misses a constraint is not engineering. pick the constraint that would hurt the user first (wrong money, lost data, leaked token, hung UI) and design from there.

three objects you must be able to name:

| object | is |
|---|---|
| **requirement** | a checkable claim about the running system |
| **implementation** | code + data + config that is supposed to meet it |
| **evidence** | tests, logs, traces, a review of the diff — not a vibe |

a program that “works on my machine” is a prototype. engineering starts when a stranger can follow a path (clone, install, test, run) and get the same behavior.

**law.** software that cannot be checked is not finished. a comment that says “should work” is not a check. a badge that says tests pass while the test command is skipped is a stub claiming done.

**check.** take any feature you shipped last week. write one sentence: “it is correct if and only if ___.” if you cannot fill the blank without waving at the whole app, the spec is missing. go to chapter 2.

---

## 2. spec before code

**definition.** a spec is a **checkable claim** about behaviour. it names inputs, outputs, errors, and what stays unchanged. it is short. it is not a novel. it is not the code.

a usable spec answers:

| slot | question |
|---|---|
| **actor** | who calls this? human, another service, a cron |
| **given** | what is true before |
| **when** | the action (HTTP method + path, button, CLI verb) |
| **then** | observable result (status, body, file, UI) |
| **fail** | how it fails closed (4xx/5xx, thrown error, rollback) |
| **unchanged** | what must not move (other rows, other users’ data) |

**why before how.** if you start at how, you will invent a stack and then hunt for a problem that fits it. name the job in the user’s words. then pick the smallest mechanism.

**acceptance is a test, not a vibe.** “feels fast” is not acceptance. “p95 under 200 ms on this fixture” is, and then you measure. numbers you did not measure → DONT_KNOW / fetch / **calc**.

**invariants.** an invariant is a sentence that stays true across calls. examples: “every order has exactly one owner”; “GET does not create a row”; “retrying a paid invoice does not charge twice.” write invariants in the spec. tests encode them. logs prove you looked.

**interface first.** the public surface (function signature, HTTP resource, CLI) is the contract. internals may change. if two hosts (desktop, browser, phone) claim the same job, they use the **same names** for the same operations. renaming per platform is a second product.

**scope cut.** a spec that lists twelve features is a wishlist. cut to the one path that teaches the system. ship that. then the next. unfinished code that claims done is a stub: finish it or mark it blocked. do not sign off an outline as a program.

**fail closed on the unknown.** unknown unit, unknown origin, unknown tool name → error. inventing a 1:1 conversion or a 200 OK for a bad request is a lie with a green status.

**worked method.**

job: “user can add a unit conversion to a note.”

bad spec: “build a conversion feature with a nice UI.”

better spec:

- given a note open and a number selected
- when the user asks to convert `5 km` to miles
- then the note shows the converted value from the units hand, not from the model’s memory
- fail: unknown unit → error string, note unchanged
- unchanged: other notes, any secret store

EasyLM’s calc and units hands are this pattern: arithmetic is a tool with a spec, not a fluent guess. warehouse returns a chapter. the model does not invent the constant.

**check.** if a teammate can implement the spec without asking what “success” looks like, the spec is ready. if they have to guess the status code, it is not. write the failing test or the refused case before the happy path.

---

## 3. version control — git objects, branch, merge, rebase

facts in this chapter come from the Git book at git-scm, not from folklore. door: https://git-scm.com/book/en/v2

### 3.1 what git is

**definition.** Git is a **content-addressable filesystem** with a version-control user interface on top. at the core it is a key-value store: you insert content, Git hands back a key (a hash of a typed header plus the content), and you retrieve by that key.

Git stores **snapshots**, not a list of diffs as the primary object. a commit points at a tree (the project snapshot). the next commit points at the previous commit (its parent) and at a new tree.

**object types** (Git Internals — Git Objects, https://git-scm.com/book/en/v2/Git-Internals-Git-Objects):

| type | is |
|---|---|
| **blob** | the contents of a file. no filename inside the blob |
| **tree** | a directory listing: mode, type, hash, filename; each entry a blob or another tree |
| **commit** | pointer to a tree, zero or more parent commits, author, committer, message |
| **tag** | a named pointer, often annotated, to a commit |

Git writes each object as a header (`blob <size>\0` or `tree …` or `commit …`) plus content, then hashes that, historically with **SHA-1** (40 hex characters). the object file lives under `.git/objects/ab/…` where `ab` is the first two hex digits. Git may later pack objects; the logical model does not change. SHA-256 repositories exist as a format; if you need which hash a given repo uses, inspect that repo, do not guess.

the Git book’s own example: `echo 'test content' | git hash-object -w --stdin` stores a blob and prints `d670460b4b4aece5915caf5c68d12f560a9fe3e4`. `git cat-file -p` of that hash prints `test content`. `git cat-file -t` prints `blob`. if you need a hash for *your* file, compute it with Git on this box; do not reuse the book’s hash as if it were yours.

a commit object, pretty-printed, looks like:

```
tree <hash>
parent <hash>
author Name <email> <unix time> <tz>
committer Name <email> <unix time> <tz>

message
```

zero parents on the first commit. one parent on a normal commit. two parents on a merge commit.

**law.** the hash is of the **object bytes**, not of the filename. rename a file: new tree, same blob if contents did not change. change one byte: new blob, new hash.

**check.** `git cat-file -t HEAD` and `git cat-file -p HEAD`. you should see a commit that names a tree. then `git cat-file -p HEAD^{tree}` (quoting as your shell requires) lists names. if you cannot find a blob for a file you committed, you are looking at the working tree, not the object database.

### 3.2 branch

**definition.** a branch in Git is a **lightweight movable pointer to a commit** (Git book: Branches in a Nutshell). it is a file under `.git/refs/heads/` whose content is a commit hash (or a packed-ref). it is not a copy of the project.

`HEAD` is a pointer to the **current branch** (or, in detached HEAD, to a commit). `git branch testing` creates a new pointer at the current commit. it does not switch. `git switch testing` or `git checkout testing` moves `HEAD` to that branch.

the default name created by `git init` has historically been `master`. Git itself does not treat that name as magic; it is a branch like any other. many hosts now default to `main`. the fact is the pointer, not the label.

**law.** creating a branch is cheap because it writes a hash. it does not copy trees. two branch names on the same commit are two pointers, not two copies.

**check.** `git log --oneline --decorate`. you should see `HEAD ->` on the branch you have checked out, and other names sitting on commits.

### 3.3 merge

**definition.** a merge joins two lines of history. Git finds a common ancestor, diffs each side against it, and applies both sets of changes. if the result is clean, Git can make a **merge commit**: a commit with **two parents**. if both sides changed the same region, Git stops and asks you to resolve.

a fast-forward is the special case where one side has no unique commits: Git just slides the branch pointer forward. no merge commit is required.

**law.** merge **preserves** the commits that existed on both sides. it adds a node that points at both tips. it does not rewrite those commits.

**check.** after `git merge other`, `git cat-file -p HEAD` should show two `parent` lines if it was a true merge. `git log --graph --oneline` should show the join. if you see one parent, it was a fast-forward (or you merged nothing).

### 3.4 rebase

**definition.** rebase takes the **patch** of each commit on your branch that is not on the new base, and **replays** those patches on top of the new base. the result is new commit objects (new hashes, new parents). the old commits remain in the object database until garbage-collected; the branch pointer moves to the replayed tip.

from the Git book (Branching — Rebasing): rebase is a way to make a linear story. it is also a way to **rewrite history** that other people may have built on.

**law.** do not rebase commits that exist outside your repository and that others may have based work on. rewriting a published tip forces everyone else to recover. merge is the cooperative default on a shared branch. rebase is for local cleanup before you share, or for a workflow the whole team has agreed.

**check.** after a rebase onto `main`, `git log main..HEAD` should show your commits with new hashes sitting on the current `main`. `git merge-base HEAD main` should be the tip of `main` if the rebase was complete. if a colleague still has the old hashes, you rewrote published history — stop and recover, do not force-push as a reflex.

### 3.5 working tree, index, HEAD

Git has three trees you must keep distinct:

| name | is |
|---|---|
| **working tree** | files on disk you edit |
| **index / staging area** | what the next commit will contain |
| **HEAD** | the last commit on the current branch |

`git add` copies working-tree bytes into a blob and records the name in the index. `git commit` writes a tree from the index and a commit pointing at it. `git restore` / `git reset` move content between these three; they are not synonyms. fetch the Git book “Reset Demystified” if you are about to run `reset --hard` on uncommitted work.

**check.** `git status` names the three areas in English. if status is dirty and you cannot say whether the bytes live in the index or only on disk, do not commit yet.

---

## 4. remotes, push, evidence

**definition.** a **remote** is a named URL of another repository. `origin` is only a convention. `git fetch` copies objects and updates remote-tracking refs (`origin/main`). `git pull` is fetch plus a merge or rebase. `git push` updates a branch on the remote to point at a commit you have, sending missing objects.

**law.** the remote does not magically contain your working tree. uncommitted bytes are not backed up by push. a green “synced” icon on a dirty tree is a lie. `git status` clean on the branch you meant to ship is the evidence.

**force-push.** `git push --force` (and `--force-with-lease`) moves a remote branch pointer to a commit that may not be a descendant of what was there. on a shared `main`, that is how you lose the evidence other people pulled. `--force-with-lease` still rewrites; it only refuses if the remote moved since you last fetched. it is not a licence to rewrite public history.

**messages.** a commit message says **why**. the diff says what. “fix” and “wip” are not why.

**check.** after push, clone into a fresh directory and run the test command from the README. if that clone cannot run, you did not ship a repository; you shipped a laptop state.

---

## 5. tests that fail closed

**definition.** a test is a **machine-runnable claim** about a spec. fail closed means: if the claim is false, or the test cannot run, **the change does not ship**. fail open means: a skip, a swallowed exception, a missing file, or a flaky retry that eventually greens, and the change ships anyway.

**law.** the default is fail closed. an empty test suite that “passes” is fail open. a test that mocks the entire system and asserts `true` is fail open. a CI job that is allowed to fail is fail open for that job.

pytest (https://docs.pytest.org/en/stable/) discovers tests and treats a failed assertion as a failed test. official example from that door:

```
def inc(x):
    return x + 1

def test_answer():
    assert inc(3) == 5
```

`inc(3)` is `4`, so the assertion fails and pytest exits non-zero. that is the point. the test is not decoration; it is the gate.

**kinds of test (use the cheapest that can falsify the claim):**

| kind | job | typical fail |
|---|---|---|
| **unit** | one function, in-process | wrong return, thrown type |
| **contract** | HTTP/JSON/SQL shape | 500, malformed body, missing column |
| **integration** | two real pieces | timeout, schema drift |
| **end-to-end** | a user path | UI missing, auth broken |

do not start at end-to-end. an e2e suite that cannot name the unit that broke is a fog machine.

**write the failing test first** when the spec is new. see red. then write the minimum code that turns it green. then see red again if you break it. a test written after the code that only repeats the implementation is a snapshot, not a spec.

**determinism.** a test that depends on clock, network, or unordered maps without a seed will flake. freeze time, fake the network at a seam, sort when order is not the spec. flaky tests train humans to ignore red — that is fail open.

**coverage is not the goal.** a 100% line-covered function can still be wrong if no assertion names the invariant. prefer one sharp assertion per claim over a carpet of existence checks. coverage percent is not a spec. a fully covered wrong conversion is still wrong.

**names.** `refuses_unknown_unit_pairs` is a claim. `test1` is not.

**worked check.** spec: `parse_int("12")` returns integer 12; `parse_int("x")` fails closed (error, no silent 0).

```
def test_parse_int_ok():
    assert parse_int("12") == 12

def test_parse_int_bad_fails():
    try:
        parse_int("x")
        raise AssertionError("should have failed")
    except ValueError:
        pass
```

if `parse_int` returns `0` on junk, the second test is the one that catches it. the first test alone is fail open on the error path.

EasyLM’s own bar, as a worked product example: unknown units **error**; they do not invent 1:1. warehouse miss **says miss**. those are tests you can write without a browser. calc does arithmetic; the model does not.

**check.** delete the implementation; the test must go red. if it stays green, it was not testing the thing. run the suite until it fails on purpose (break the code). if nothing goes red, you do not have a test. you have a script that prints ok.

---

## 6. HTTP — RFC 9110 methods and status

door: https://www.rfc-editor.org/rfc/rfc9110 — HTTP Semantics, June 2022, STD 97, Fielding, Nottingham, Reschke. this RFC is the **semantics** shared by HTTP/1.1, HTTP/2, and HTTP/3. wire syntax lives in other RFCs (9112, 9113, 9114). if a blog and this RFC disagree, the RFC wins.

**definition.** HTTP is a **stateless request/response protocol**. a client sends a request with a **method** and a **target resource**. a server returns a **status code** and, often, a **representation** (bytes plus metadata). the protocol does not define your database. it defines the uniform interface.

core terms from RFC 9110 §3:

| term | is |
|---|---|
| **resource** | the target of a request, identified by a URI |
| **representation** | bytes + metadata that stand for a state of the resource |
| **origin server** | the program that can answer authoritatively for that URI |
| **safe method** | essentially read-only; no obligation to change state (§9.2.1) |
| **idempotent method** | N identical requests have the same effect as one (§9.2.2) |

URI schemes: `http` default TCP port 80; `https` default TCP port 443, with TLS. an origin is scheme + host + port after normalisation (RFC 9110 §4.3.1). `https://Example.Com/happy.js` has origin `{ "https", "example.com", "443" }`. two origins that differ in scheme, host, or port are distinct.

### 6.1 methods (RFC 9110 §9)

registered methods in this RFC:

| method | intent | safe | idempotent |
|---|---|---|---|
| **GET** | transfer a current representation of the target resource | yes | yes |
| **HEAD** | like GET, but the server does not send content | yes | yes |
| **POST** | process the request content according to the resource’s own semantics (often create or append) | no | no |
| **PUT** | replace the target resource with the enclosed representation | no | yes |
| **DELETE** | remove the association between the target resource and its current functionality | no | yes |
| **CONNECT** | establish a tunnel to the origin | no | no |
| **OPTIONS** | request communication options for the target | yes | yes |
| **TRACE** | message loop-back for diagnostics | yes | yes |

**PATCH** (partial update) is defined in RFC 5789, not as a core method of RFC 9110. if you implement PATCH, fetch RFC 5789. do not invent “PATCH is like PUT.” PATCH is not required to be idempotent.

**law.**

- GET and HEAD must not be used to change server state as part of their contract. a GET that deletes a row is a bug, even if your framework makes it easy.
- PUT of the same body twice leaves the resource in the same state (idempotent). POST twice may create two rows.
- the method is the verb. the URI is the noun. do not bury the verb in `/api/doCreateUser` and then POST to it as theatre. `POST /users` or `PUT /users/{id}` is the uniform interface.

**worked check.**

invoice pay endpoint.

wrong: `GET /invoices/9/pay` — GET is safe; paying is not.

right: `POST /invoices/9/payments` with a client-generated **idempotency key** (chapter 10), so a retry does not pay twice. PUT of a payment resource at a client-chosen URI (`PUT /invoices/9/payments/{key}`) is also idempotent by construction.

### 6.2 status codes (RFC 9110 §15)

classes:

| class | meaning | client should |
|---|---|---|
| **1xx** | informational | wait; not the final answer |
| **2xx** | success | the request was understood and accepted |
| **3xx** | redirection | look at Location / cache rules |
| **4xx** | client error | fix the request; do not blindly retry as-is |
| **5xx** | server error | the server failed; retry only if the method is idempotent and the failure is transient |

common codes you must not mix up:

| code | name | use |
|---|---|---|
| 200 | OK | GET succeeded; body is the representation |
| 201 | Created | a new resource exists; Location often set |
| 204 | No Content | success, empty body (common after DELETE or an empty PUT) |
| 304 | Not Modified | conditional GET; cache is still good |
| 400 | Bad Request | the request is malformed |
| 401 | Unauthorized | missing or bad credentials (despite the name: *unauthenticated*) |
| 403 | Forbidden | credentials understood, access refused |
| 404 | Not Found | no current representation, or you will not admit it |
| 409 | Conflict | current state does not allow the method |
| 429 | Too Many Requests | rate limit |
| 500 | Internal Server Error | the server hit a bug; log it |
| 502 | Bad Gateway | this server, as gateway, got a bad answer upstream |
| 503 | Service Unavailable | overloaded or down; Retry-After if you know |

**law.** do not return 200 with `{"error": ...}` as your only signal. clients, caches, and monitors read the status. a JSON error field is extra; the status is the contract. do not return 500 for a missing id — that is 404 or 400. do not return 401 when the user is known and not allowed — that is 403.

**example exchange** (RFC 9110 §3.9, abbreviated):

```
GET /hello.txt HTTP/1.1
Host: www.example.com

HTTP/1.1 200 OK
Content-Type: text/plain

Hello World! My content includes a trailing CRLF.
```

**check.** for each endpoint, write the method, the success status, and one 4xx. if two endpoints share a method+path and mean different things, the spec is colliding. fetch RFC 9110 §9 and §15 when you are about to invent a new verb or a new meaning for 200.

---

## 7. JSON — RFC 8259

door: https://www.rfc-editor.org/rfc/rfc8259 — The JavaScript Object Notation (JSON) Data Interchange Format, December 2017, Bray ed. obsoletes RFC 7159.

**definition.** JSON is a **text format** for structured data. it can represent four primitive types (string, number, boolean, null) and two structured types (object, array). it is language-independent. it is not JavaScript. it is not YAML. it is not “whatever `print` emitted.”

**grammar, compressed:**

- a JSON **text** is `ws value ws` — a single value, optionally padded with insignificant whitespace (space, tab, LF, CR). older lore that “JSON must be an object or array” is from earlier specs; RFC 8259 allows any value. generators that only emit object or array stay maximally interoperable.
- **object:** `{` string `:` value (`,` string `:` value)* `}`. names **SHOULD** be unique. duplicate names make receiver behaviour unpredictable.
- **array:** `[` value (`,` value)* `]`. order matters. types may mix.
- **number:** base-10, optional minus, no leading zeros, optional fraction and exponent. **Infinity and NaN are not permitted.**
- **string:** Unicode text in double quotes, with the usual escapes.
- literals: `true` `false` `null` — lowercase only.

**encoding (RFC 8259 §8.1).** JSON text **SHALL** be encoded in UTF-8. it **SHALL NOT** begin with a byte order mark.

**law.**

- no comments. no trailing commas. no single quotes. those are JavaScript / JSONC / JSON5, not JSON.
- object member **order is not significant** for meaning. if you need order, use an array.
- numbers are decimal text, not IEEE floats, at the JSON layer. your language will parse them into floats or decimals. large integers (`2^53` and above in IEEE binary64) will silently round in many runtimes. if the id must round-trip, use a **string**. money: integers of cents, or a decimal type, not `0.1 + 0.2` in IEEE. **calc** does the arithmetic.
- `null` is a value. omitting a key is a different fact. pick one and document it.
- never build JSON by concatenating user strings. parse, then pick fields.

**schema.** if two processes exchange JSON, name the keys and types. reject extras or missing required keys on the boundary that faces the world.

**worked check.**

valid:

```
{"id":"12","ok":true,"n":0.5,"tags":["a",null]}
```

not JSON:

```
{id: 12,}
{'id': Infinity}
```

parse with a real parser (`json.loads` in Python, `JSON.parse` in JS). do not split on commas. do not `eval`.

**check.** round-trip: parse, serialise, parse again. if a float changes, you have a number-precision problem — switch that field to string or to an integer you can represent, or use **calc** on the exact decimal. if two official parsers disagree on a document, the document is not interoperable; fix the document.

---

## 8. SQL and SQLite

doors: https://www.sqlite.org/docs.html · https://www.sqlite.org/about.html · https://www.sqlite.org/lang.html · https://www.sqlite.org/limits.html

**definition.** SQL is a language for defining and querying **relations** (tables of rows with named columns). a query names *what* you want; the engine picks *how* (mostly). SQLite is an **in-process, serverless, zero-configuration, transactional** SQL engine that reads and writes a **single ordinary file**. public-domain source. sqlite.org says: think of it as a replacement for `fopen()`, not as a replacement for a networked cluster database.

from sqlite.org/about (fetched for this book): ACID transactions even after power loss; stable file format; max database size **281 terabytes** (2^48 bytes); max row size **1 gigabyte**. if a limit is load-bearing for your app, fetch https://www.sqlite.org/limits.html again; do not rely on this paragraph if the live page moved.

### 8.1 relational core

a **table** is a set of rows. a **primary key** uniquely identifies a row. a **foreign key** says a value must exist in another table (if you turn enforcement on). a **NULL** is “unknown / missing,” not the string `"null"` and not `0` and not `''`.

four verbs you will actually use:

| verb | job |
|---|---|
| **SELECT** | read rows; does not change the database |
| **INSERT** | add rows |
| **UPDATE** | change columns in existing rows |
| **DELETE** | remove rows |

**law.** write the **WHERE** before you run UPDATE or DELETE. `DELETE FROM t` with no WHERE deletes every row. that is not a trick; it is the language. wrap multi-statement changes in a **transaction** (`BEGIN` … `COMMIT`). if you error, `ROLLBACK`. SQLite’s ACID claim is about transactions, not about a sequence of autocommit statements you hoped were atomic.

**parameterise.** never build SQL by concatenating user strings. use placeholders (`?` in SQLite). concatenation is how injection happens. this is not optional.

**worked check.**

```
CREATE TABLE note (
  id   INTEGER PRIMARY KEY,
  body TEXT NOT NULL
);

INSERT INTO note (body) VALUES (?);
SELECT id, body FROM note WHERE id = ?;
```

if `SELECT` returns no row, the id does not exist. do not invent a row in the application to look helpful.

### 8.2 joins and indexes

a **join** combines rows from two tables on a condition, usually a key.

```
SELECT note.id, tag.name
FROM note
JOIN note_tag ON note_tag.note_id = note.id
JOIN tag ON tag.id = note_tag.tag_id
WHERE note.id = ?;
```

inner join: only rows that match. if you meant “notes even without tags,” that is a different join (LEFT). pick it in the spec, not after the empty result surprises you.

an **index** is extra structure so a lookup does not scan the whole table. SQLite will use an index when it helps; `EXPLAIN QUERY PLAN` is how you see. an index is not free: writes maintain it. index the columns you **filter and join** on, not every column “just in case.”

**check.** a constraint that can fire. a test that inserts a duplicate primary key and expects failure. a test that EXPLAIN QUERY PLAN on the hot SELECT does not say “SCAN” of a table you believed was keyed — or you accept the scan in writing.

### 8.3 SQLite specifics

- one writer at a time on a database file (WAL mode allows concurrent readers). if you need many writers across machines, you need a different engine. say so; do not pretend.
- types are **dynamic** with declared type affinity. an INTEGER column can still store text if you bind text. if you need strictness, fetch the current `STRICT` table docs on sqlite.org; do not guess the version that added them.
- `INTEGER PRIMARY KEY` is an alias for the rowid. that is a SQLite fact; other engines differ.
- backup is “copy the file” only if no writer is in the middle; use the backup API or VACUUM INTO for a consistent snapshot.

**check.** after INSERT, SELECT the row back. after crash recovery, SELECT again. if the row vanished, you were not in a committed transaction. fetch sqlite.org/transactional.html rather than trusting a blog about fsync.

---

## 9. complexity, Big-O, common structures

math pack owns the formal definition of a function’s growth. this chapter is the **engineering use**: how many steps as input size `n` grows, so you pick a structure that will still return before the user leaves.

**definition.** Big-O names an **upper bound** on growth, ignoring constants and lower-order terms. `O(n)` means “at most proportional to n, for large n.” it is not a timing in milliseconds. it is not a promise about n=3. worst case unless you say average.

common classes, slowest last among these:

| class | name | when you see it |
|---|---|---|
| `O(1)` | constant | array index, hash-table hit (average), dict lookup |
| `O(log n)` | logarithmic | binary search, balanced tree |
| `O(n)` | linear | scan a list, single pass |
| `O(n log n)` | linearithmic | good comparison sorts |
| `O(n²)` | quadratic | nested loops over the same n |
| `O(2^n)` | exponential | naive subset / recursion without memory |

**law.** measure the **input that actually grows**. if you sort 20 config keys, `O(n²)` is noise. if you nest a linear scan inside a linear scan over a million rows, you will wait. constants matter at small n; structure matters at large n. if you did not measure, you DONT_KNOW the millisecond cost — call a profiler, not a model.

### 9.1 structures

| structure | get by key / index | insert | extra |
|---|---|---|---|
| **array / vec** | `O(1)` index | `O(n)` in the middle; amortised `O(1)` append | contiguous; good cache |
| **linked list** | `O(n)` scan | `O(1)` at a known node | poor cache; rarely the default |
| **hash table** | average `O(1)` | average `O(1)` | worst case `O(n)` if everything collides; no order |
| **balanced BST** | `O(log n)` | `O(log n)` | ordered iteration |
| **heap** | `O(1)` peek min/max | `O(log n)` push/pop | not a search tree |
| **B-tree** | `O(log n)` | `O(log n)` | disk / SQLite indexes live here |
| **queue / stack** | `O(1)` at the end you chose | `O(1)` | FIFO / LIFO |

a **graph** is nodes plus edges. BFS/DFS are `O(V+E)` on an adjacency list if you mark visited. binary search requires a **sorted** array; the sort is the precondition. Dijkstra on non-negative weights is the standard shortest-path tool; fetch a named algorithms text if you need the exact heap complexity for your variant. do not quote a number you did not check.

**worked check.**

you have `n` user ids and want “is this id in the set?” `n` times.

- list scan each time: `n` queries × `n` scan = `O(n²)`
- put ids in a hash set once `O(n)`, then `n` lookups average `O(1)` each = `O(n)`

for n=10 both feel instant. for n=10^6 the nested scan is a bug. **calc** `n*n` if you want the comparison count; warehouse does not invent a clock time.

**check.** name n, name the structure, name the class. if you wrote a double `for` over the same array and n is unbounded, you owe a reason or a different structure. if you say O(1) and you walk the whole table, you lied.

---

## 10. errors, logs, idempotence

### 10.1 errors

**definition.** an error is a **named failure** the caller can handle. it is not a printed stack that vanishes. it is not `null` with no comment.

two families:

| family | is | example |
|---|---|---|
| **expected** | in the spec: bad input, not found, conflict | 404, `ValueError`, unique-key fail |
| **unexpected** | a bug or an environment break | null deref, disk full, upstream 500 |

**law.** expected errors stay **structured** (type, code, field). unexpected errors **fail closed**: stop the operation, roll back the transaction, log with a correlation id, return 500 or crash the worker. do not convert an unexpected error into an empty success.

map errors at the boundary. inside the core, use types. at HTTP, use RFC 9110 status. do not leak stack traces to the public client.

### 10.2 logs

**definition.** a log is a **time-ordered record of facts** a human or a machine can grep later. it is not a debug print you will delete. it is not a second database of user content.

each line should contain: time (UTC), level, **correlation id**, the operation, the outcome, and identifiers that are not secrets. one event per line. JSON logs are greppable if you keep the schema small.

**law.** never log tokens, passwords, raw cards, session cookies, or private message bodies. log the **id** of the object, not the secret that opens it. if you are unsure whether a field is a secret, it is a secret.

levels: error = operator must look; warn = degraded; info = state change you would want in an incident; debug = off in production unless a named session turns it on.

**check.** trigger a 500 in dev. the log line must name the request id and the function. the HTTP body must not contain the stack. the token used to call the API must not appear in the log file.

### 10.3 idempotence and retries

**definition.** an operation is idempotent if **doing it N times has the same effect as doing it once.** RFC 9110 §9.2.2 defines this for HTTP methods. you also need it for **your** POST handlers, because networks retry.

**timeout.** a deadline, then stop. an unbounded wait is not patience; it is a leak of workers.

**retry.** only if the operation is idempotent or you have a dedupe key. retrying a non-idempotent POST without a key is how you double-charge.

**law.** any effect that charges money, sends mail, or creates a unique real-world event must be keyed. the client sends an **idempotency key**. the server stores the key with the result. a second POST with the same key returns the first result and does not repeat the effect.

worked:

1. client generates `key = <uuid>`
2. `POST /charges` with header `Idempotency-Key: <key>` and body `{ "amount": 10 }`
3. server `INSERT` the key first (unique constraint). if the insert loses a race, SELECT the stored result and return it
4. a retry with the same key does not create a second charge

GET, PUT, DELETE are already idempotent at the HTTP layer **if you implemented them as RFC 9110 says**. POST is not; you add the key.

**check.** send the same POST twice in a test. assert one row, one side effect. if two rows appear, the handler is not idempotent. fail closed. unplug the network in the middle of the write. does retry duplicate? if you do not know, you have not designed it.

---

## 11. secrets never in git

**definition.** a secret is a value that **grants power**: API token, private key, password, session signing key, webhook secret, cloud credential. if it is in a git object, it is in **every clone** of that history, forever until you rotate the secret **and** purge the object (purging hashes is hard; rotation is the real fix).

**law.**

1. secrets live in the **environment** or in a restricted secret store, not in source.
2. `.env` files are local. they are listed in `.gitignore`. they are never `git add`ed.
3. example files are `env.example` with **empty or fake** values.
4. if a secret was committed, **rotate it now**. rewriting history without rotating leaves the old secret valid in every laptop that already fetched.
5. CI gets secrets from the host’s secret mechanism, not from a file in the repo.
6. do not paste tokens into a model prompt. the prompt is not a vault.
7. least privilege: the token that can only do this job.

GitHub documents secret scanning and removing sensitive data: https://docs.github.com/en — fetch the current page if you are in an incident. the Git book covers credential helpers; it does not make it legal to commit a token.

**supply chain.** dependencies are code you did not write running in your process. pin versions with a lockfile. read the licence. a postinstall script is a program you just executed. lockfiles exist so two installs match.

EasyLM is GPLv3. dependencies keep their own licences (model weights are not GPL just because the app is). say the split in the README. do not launder a proprietary blob as “the app is free” without that split.

**worked check.**

```
# .gitignore
.env
.env.*
!.env.example
*.pem
```

```
# .env.example
API_TOKEN=
```

```
# app reads
token = os.environ["API_TOKEN"]
```

missing env → fail closed (KeyError / explicit error), not a silent empty string that calls the API unsigned.

grep the tree for `sk-`, `BEGIN PRIVATE KEY`, `ghp_`, `AKIA`. if you find a real one, rotate. do not “just delete the file” in a new commit and call it done — the blob is still in history.

**check.** `git grep` and `git log -p --all -S 'BEGIN PRIVATE KEY'`. empty is the passing test. a comment that says “do not commit secrets” is not a check.

---

## 12. how to ship a web app (build, static host)

**definition.** shipping is moving a **specific version** of the program to a place users can run, with a way to roll back. for a front-end web app the usual shape is: source → **build** → **static files** → **host** that serves them over HTTPS.

### 12.1 build

a build is a **pure function** from source + lockfile to artefacts. given the same git commit and the same tool versions, you should get the same files (or a documented reason you do not).

typical web app:

1. install dependencies from a **lockfile** (`package-lock.json`, `pnpm-lock.yaml`, `Cargo.lock`)
2. typecheck
3. run tests (fail closed)
4. compile/bundle TypeScript/JS/CSS to a `dist/` of HTML, JS, CSS, assets
5. the server users hit is either that static `dist/` or a small backend plus `dist/`

Vite (https://vite.dev/guide/) is one bundler used for this; the law is the pipeline, not the brand. TypeScript’s contract is the handbook at https://www.typescriptlang.org/docs/handbook/intro.html. MDN documents the Web platform the bundle runs on: https://developer.mozilla.org/docs/Web

**law.** you ship the **artefact**, not your `node_modules`. you pin versions. an unpinned `latest` on the day you ship is a different program tomorrow. a git SHA is evidence of source; the live JS hash is evidence of what users run. they must match the build you meant.

### 12.2 static host

static hosting means: files on disk, HTTPS in front, `index.html` for the app shell, correct `Content-Type`, and a rule for client-side routes (usually “unknown path serves `index.html`” for a single-page app, **except** for real files).

checklist:

| item | why |
|---|---|
| HTTPS | HTTP scheme is a different origin; credentials leak on the wire |
| cache hashed assets forever; `index.html` short cache | otherwise users keep a stale shell or re-download everything |
| `Content-Type` matches the file | JS served as text/plain will not run |
| no secrets in the bundle | anything in `dist/` is public. public keys for a client API are not secrets; private keys are |
| source maps off or restricted in production | maps are a gift to attackers if they include original source and you did not mean to publish it |
| one URL per deploy | you can point DNS or a release alias back |
| Origin / CORS match the documented origins | a prefix regex that lets an attacker’s sibling host through is a hole |

**rollback.** keep the previous `dist/` (or the previous container image tag). shipping without a pointer to “last known good” is a one-way door.

**CI.** the pipeline is a test that runs on a clean machine. install from lockfile, test, build. if CI is skippable, it is fail open. the README command and the CI command must be the same job.

**worked path.**

```
git switch main
git pull
npm ci
npm test
npm run build
```

then upload `dist/` to the static host.

```
GET https://example.com/  → 200, text/html
GET https://example.com/assets/index-<hash>.js → 200, application/javascript
```

**check.** after deploy, fetch the page yourself. read the status code. if you only looked at the CI green check, you have not shipped; you have compiled. if `index.html` still references a JS hash that 404s, the upload was partial — fail closed, roll back. Network tab on first paint: every host you see is in the README split.

EasyLM as a public example of this shape: a static web app, local model inference in the browser, calc/units/warehouse as local hands. the production URL is the product. prove the live bundle; do not assume a git push updated every host.

---

## 13. interfaces, types, and the public surface

**definition.** a type is a **name for a set of values** and the operations that are legal on them. at the software-engineering layer, types are how you keep the spec from rotting: if the JSON field is a string id, the type says `string`, not “whatever.”

Python 3 types and the language reference: https://docs.python.org/3/
TypeScript handbook: https://www.typescriptlang.org/docs/handbook/intro.html
Rust book (ownership as a type-system fact): https://doc.rust-lang.org/book/

**law.** the **public surface** is typed and small. internals can be messy for a day; the surface cannot. if the function can return empty or a value, the type says so. if HTTP can return 404, the client type is a result, not a naked record.

**compatibility.** adding an optional JSON field is usually safe. removing a field, changing its type, or reusing a name for a new meaning is a **breaking change**. bump the version. do not silently reinterpret.

**check.** change a field from number to string in the spec. the typecheck or a contract test must go red. if only production goes red, the surface was untyped.

---

## 14. stuck on a bug

work this list in order. do not skip to rewriting the module.

1. **name the failure** in one sentence.
2. **reproduce** in one command or one request. if you cannot reproduce, you do not have a bug yet; you have a story.
3. **smallest input** that still fails. the smallest JSON that 500s is the spec of the bug.
4. **name the layer:** spec wrong, test wrong, code wrong, data wrong, environment wrong. only one is the first cause.
5. **read the error.** status, exception type, log line with correlation id. if there is no log line, add one, do not add features.
6. **bisect.** `git bisect` on a failing test is faster than staring. Git records snapshots; use them.
7. **check the RFC / language door** if the fight is about HTTP, JSON, SQL, or git. folklore loses.
8. **arithmetic** goes to **calc**. units go to **units**. this book does not multiply in prose.
9. if the official page and this textbook disagree on a load-bearing number → **DONT_KNOW**, fetch the door, then fix the book.

do not add a second stack because the first one hurt. fix the contract.

**done** means: a test that failed is green, the spec sentence still true, nothing secret in git, the ship checklist in chapter 12 has been walked, not imagined.

---

## 15. what this book will not do

it will not pick your framework. it will not quote a star count as evidence. it will not treat a vendor tutorial as RFC 9110. it will not store a token in a gist “just for now.”

when the job is a language primitive, fetch Python / TypeScript / Rust / MDN. when the job is a protocol, fetch the RFC. when the job is git, fetch git-scm. when the job is a number, **calc**.

doors for this pack: `LINK_INDEX.md` in this directory.
)
