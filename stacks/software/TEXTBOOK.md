---
Title: "software — undergrad textbook"
Date: "2026-09-13"
Status: living · undergrad · the-stacks
Home: "stacks/software/"
Related:
  - "../computing/"
  - "../math/"
  - "../methods/"
---

# Software Engineering & Architecture — System Specification, Invariant Design, Distributed Versioning & Resilient Delivery

A comprehensive undergraduate textbook exploring the principles and practices of modern software engineering: formal specifications, invariant-driven design, cryptographic version control via Merkle DAGs, automated test harnesses, network protocols (HTTP/1.1–HTTP/3), data serialization standards, relational persistence, failure domains, and zero-defect deployment pipelines.

---

## 0. Syllabus & Structural Map

Software engineering is not the casual act of writing code; it is the discipline of creating predictable, maintainable, and verifiable state machines under physical and cognitive constraints. Just as civil engineers must calculate load distributions, material fatigue, and thermal expansion before pouring concrete, software engineers must establish clear contracts, prove invariants, manage state mutations, and construct automated verification harnesses before deploying code to production.

```
+---------------------------------------------------------------------------------------------------+
|                                 THE SOFTWARE ENGINEERING LIFECYCLE                                |
+---------------------------------------------------------------------------------------------------+
|  SPECIFICATION (The Contract)   | Invariants · User-Visible Deltas · State Transition Pre/Post    |
+---------------------------------+-----------------------------------------------------------------+
|  VERSION CONTROL (The History)  | Merkle Directed Acyclic Graphs · Immutable Trees · Cryptography  |
+---------------------------------+-----------------------------------------------------------------+
|  VERIFICATION (The Proof)       | Unit & Integration Harnesses · Property Fuzzing · Failing Closed|
+---------------------------------+-----------------------------------------------------------------+
|  PROTOCOLS & DATA (The Wire)    | HTTP/1.1–HTTP/3 Semantics (RFC 9110) · Strict JSON (RFC 8259)   |
+---------------------------------+-----------------------------------------------------------------+
|  PERSISTENCE (The Storage)      | Relational Algebra · ACID Transactions · SQLite B-Tree Internals|
+---------------------------------+-----------------------------------------------------------------+
|  RESILIENCE & SECRETS (Safety)  | Structured Logging · Idempotent Retries · Ephemeral Env Secrets |
+---------------------------------+-----------------------------------------------------------------+
|  PRODUCTION SHIP (Delivery)     | Static Bundling · Web Workers · Wasm Sandboxing · Zero-Leakage  |
+---------------------------------------------------------------------------------------------------+
```

### Table of Contents

1. [Chapter 1: The First Principles of Software Engineering](#1-the-first-principles-of-software-engineering)
2. [Chapter 2: Specification Before Implementation & Invariant Design](#2-specification-before-implementation--invariant-design)
3. [Chapter 3: The Merkle DAG: How Git Actually Works Under the Hood](#3-the-merkle-dag-how-git-actually-works-under-the-hood)
4. [Chapter 4: Distributed Collaboration: Remotes, Branches & Evidence](#4-distributed-collaboration-remotes-branches--evidence)
5. [Chapter 5: Automated Verification: Tests That Fail Closed](#5-automated-verification-tests-that-fail-closed)
6. [Chapter 6: Network Protocols: The Formal Semantics of HTTP](#6-network-protocols-the-formal-semantics-of-http)
7. [Chapter 7: Data Serialization: Strict Parsing of RFC 8259 JSON](#7-data-serialization-strict-parsing-of-rfc-8259-json)
8. [Chapter 8: Relational Persistence: SQL & SQLite Internals](#8-relational-persistence-sql--sqlite-internals)
9. [Chapter 9: Algorithmic Complexity in Practice: Big-O & CPU Caches](#9-algorithmic-complexity-in-practice-big-o--cpu-caches)
10. [Chapter 10: Fault Tolerance: Error Envelopes, Structured Logs & Idempotence](#10-fault-tolerance-error-envelopes-structured-logs--idempotence)
11. [Chapter 11: Cryptographic Secrets & Supply-Chain Hygiene](#11-cryptographic-secrets--supply-chain-hygiene)
12. [Chapter 12: Production Delivery: Static Packaging & Web Deployment](#12-production-delivery-static-packaging--web-deployment)
13. [Chapter 13: Type Systems as Executable Proofs](#13-type-systems-as-executable-proofs)
14. [Chapter 14: Systematic Debugging: The Scientific Method in Silicon](#14-systematic-debugging-the-scientific-method-in-silicon)
15. [Chapter 15: Authoritative Standards & RFC Repository Doors](#15-authoritative-standards--rfc-repository-doors)

---

## 1. The First Principles of Software Engineering

Consider an ordinary elevator in an office building. When you press the button for the fourth floor, the light turns on. The motor activates, the elevator car rises smoothly to the fourth floor, the doors slide open, and the button light turns off.

Now imagine if the elevator occasionally took you to the basement when you pressed the roof, or forgot your button press unless you tapped it three times, or opened its doors between floors while moving. In physical machines, we would call that a mechanical failure. But in software, we call such things "bugs"—even though software has no gears that wear down, no bearings that seize, and no belts that snap.

Why do digital programs fail?

Because software is not a physical contraption; it is a **formal specification of logic and state**. When a program misbehaves, it is almost never because the computer got tired or the electricity was dirty. It fails because the instructions written by humans were contradictory, incomplete, or made fragile assumptions about the world that crumbled when reality intervened.

**Software engineering** is the disciplined craft of designing digital machines that **do exactly what the package says**, remain maintainable over years of change, and fail safely when the unexpected occurs. It is not "typing until it compiles," and it is not about chasing trendy frameworks. It is an unbroken chain: **intent → specification → implementation → automated proof → delivery → observation**.

### 1.1 The Four Core Intuitions

To think like a software engineer, ground your thinking in four fundamental ideas:

1. **State and Transitions (The Scoreboard):**
   Think of a basketball arena scoreboard. At any given moment, the scoreboard displays a snapshot of the game: *Home: 42, Away: 39, Period: 3, Clock: 4:15*. That snapshot is called **state**. When a player sinks a free throw, a single number increments to 43. That controlled update is a **state transition**. If a player scores and the clock unexpectedly resets to 12:00 while the Away score vanishes, the scoreboard's state transitions are corrupt. A software engineer's first duty is to precisely define valid states and ensure only legitimate events can trigger transitions between them.

2. **The Invariant (The Sacred Rule):**
   An **invariant** is a physical or logical condition that must remain true through every single operation. In a bank account system, the invariant is absolute: after a money transfer, the sender's account must decrease by the exact sum the recipient's account increases. Even if the network drops mid-transaction, power blinks, or two users click transfer at the same millisecond, money cannot magically evaporate or duplicate. Engineers design invariants first, and construct code to protect them.

3. **Failing Closed (The Emergency Brake):**
   On a railway train, the air brake system is pressurized. If a pipe tears or pressure drops, heavy mechanical springs automatically force the brake shoes against the wheels, bringing the train to a halt. The system **fails closed** (or fail-safe). In software, when an error occurs—an unparseable data packet, an unknown user ID, an unreachable database—the system must never guess, fabricate dummy data, or pretend success. It must fail closed: halt the risky operation, roll back changes, preserve data integrity, and surface an unambiguous error.

4. **Verifiable Proof (Engineering vs. a Demo):**
   A demo is something that worked once on the developer's personal laptop under ideal conditions. Engineering leaves a reproducible trail of evidence: written specifications, automated test suites that run in fresh environments, structured logs, and cryptographic version control. If a stranger on the other side of the world cannot clone your repository, run the verification harness, and observe identical behavior, you have a demo, not an engineering artifact.

Three tangible objects anchor every legitimate software project:

| Object | Everyday Reality | What It Proves |
|---|---|---|
| **Requirement** | The promise | A checkable claim about what the software does for the user |
| **Implementation** | The mechanism | The code, configuration, and data structures built to fulfill the promise |
| **Evidence** | The receipt | Automated test runs, reproducible traces, and diffs proving the claim is met |

**The Law of Done:** Software that cannot be independently checked is not finished. A comment saying "this should work" is a hope, not a proof. A green status badge whose test command was commented out is a stub claiming completion.

**The First Practice:** Take any feature or script you wrote recently. Formulate a single falsifiable statement: *"This system is correct if and only if ______."* If you cannot complete that sentence without vague hand-waving, your specification does not exist yet. Chapter 2 shows how to write one.

---

## 2. Specification Before Implementation & Invariant Design

**Definition.** a spec is a **checkable claim** about behaviour. It names inputs, outputs, errors, and what stays unchanged. It is short. It is not a novel. It is not the code.

A usable spec answers:

| Slot | Question |
|---|---|
| **actor** | Who calls this? human, another service, a cron |
| **given** | What is true before |
| **when** | The action (HTTP method + path, button, CLI verb) |
| **then** | Observable result (status, body, file, UI) |
| **fail** | How it fails closed (4xx/5xx, thrown error, rollback) |
| **unchanged** | What must not move (other rows, other users’ data) |

**Why before how.** if you start at how, you will invent a stack and then hunt for a problem that fits it. Name the job in the user’s words. Then pick the smallest mechanism.

**Acceptance is a test, not a vibe.** “feels fast” is not acceptance. “p95 under 200 ms on this fixture” is, and then you measure. Numbers you did not measure → state unverified / fetch / **calc**.

**Invariants.** an invariant is a sentence that stays true across calls. Examples: “every order has exactly one owner”; “GET does not create a row”; “retrying a paid invoice does not charge twice.” write invariants in the spec. Tests encode them. Logs prove you looked.

**Interface first.** the public surface (function signature, HTTP resource, CLI) is the contract. Internals may change. If two hosts (desktop, browser, phone) claim the same job, they use the **same names** for the same operations. Renaming per platform is a second product.

**Scope cut.** a spec that lists twelve features is a wishlist. Cut to the one path that teaches the system. Ship that. Then the next. Unfinished code that claims done is a stub: finish it or mark it blocked. Do not sign off an outline as a program.

**Fail closed on the unknown.** unknown unit, unknown origin, unknown tool name → error. Inventing a 1:1 conversion or a 200 OK for a bad request is a lie with a green status.

**Worked method.**

Job: “user can add a unit conversion to a note.”

Bad spec: “build a conversion feature with a nice UI.”

Better spec:

- Given a note open and a number selected
- When the user asks to convert `5 km` to miles
- Then the note shows the converted value from the units hand, not from the model’s memory
- Fail: unknown unit → error string, note unchanged
- Unchanged: other notes, any secret store

EasyLM’s calc and units hands are this pattern: arithmetic is a tool with a spec, not a fluent guess. The Stacks returns a chapter. The model does not invent the constant.

**Check.** if a teammate can implement the spec without asking what “success” looks like, the spec is ready. If they have to guess the status code, it is not. Write the failing test or the refused case before the happy path.

---

## 3. The Merkle DAG: How Git Actually Works Under the Hood

Facts in this chapter come from the Git book at git-scm, not from folklore. Door: https://git-scm.com/book/en/v2

### 3.1 what git is

**Definition.** Git is a **content-addressable filesystem** with a version-control user interface on top. At the core it is a key-value store: you insert content, Git hands back a key (a hash of a typed header plus the content), and you retrieve by that key.

Git stores **snapshots**, not a list of diffs as the primary object. A commit points at a tree (the project snapshot). The next commit points at the previous commit (its parent) and at a new tree.

**Object types** (Git Internals — Git Objects, https://git-scm.com/book/en/v2/Git-Internals-Git-Objects):

| Type | Is |
|---|---|
| **blob** | The contents of a file. No filename inside the blob |
| **tree** | A directory listing: mode, type, hash, filename; each entry a blob or another tree |
| **commit** | Pointer to a tree, zero or more parent commits, author, committer, message |
| **tag** | A named pointer, often annotated, to a commit |

Git writes each object as a header (`blob <size>\0` or `tree …` or `commit …`) plus content, then hashes that, historically with **SHA-1** (40 hex characters). The object file lives under `.git/objects/ab/…` where `ab` is the first two hex digits. Git may later pack objects; the logical model does not change. SHA-256 repositories exist as a format; if you need which hash a given repo uses, inspect that repo, do not guess.

The Git book’s own example: `echo 'test content' | git hash-object -w --stdin` stores a blob and prints `d670460b4b4aece5915caf5c68d12f560a9fe3e4`. `git cat-file -p` of that hash prints `test content`. `git cat-file -t` prints `blob`. If you need a hash for *your* file, compute it with Git on this box; do not reuse the book’s hash as if it were yours.

A commit object, pretty-printed, looks like:

```
tree <hash>
parent <hash>
author Name <email> <unix time> <tz>
committer Name <email> <unix time> <tz>

message
```

Zero parents on the first commit. One parent on a normal commit. Two parents on a merge commit.

**Law.** the hash is of the **object bytes**, not of the filename. Rename a file: new tree, same blob if contents did not change. Change one byte: new blob, new hash.

**Check.** `git cat-file -t HEAD` and `git cat-file -p HEAD`. You should see a commit that names a tree. Then `git cat-file -p HEAD^{tree}` (quoting as your shell requires) lists names. If you cannot find a blob for a file you committed, you are looking at the working tree, not the object database.

### 3.2 branch

**Definition.** a branch in Git is a **lightweight movable pointer to a commit** (Git book: Branches in a Nutshell). It is a file under `.git/refs/heads/` whose content is a commit hash (or a packed-ref). It is not a copy of the project.

`HEAD` is a pointer to the **current branch** (or, in detached HEAD, to a commit). `git branch testing` creates a new pointer at the current commit. It does not switch. `git switch testing` or `git checkout testing` moves `HEAD` to that branch.

The default name created by `git init` has historically been `master`. Git itself does not treat that name as magic; it is a branch like any other. Many hosts now default to `main`. The fact is the pointer, not the label.

**Law.** creating a branch is cheap because it writes a hash. It does not copy trees. Two branch names on the same commit are two pointers, not two copies.

**Check.** `git log --oneline --decorate`. You should see `HEAD ->` on the branch you have checked out, and other names sitting on commits.

### 3.3 merge

**Definition.** a merge joins two lines of history. Git finds a common ancestor, diffs each side against it, and applies both sets of changes. If the result is clean, Git can make a **merge commit**: a commit with **two parents**. If both sides changed the same region, Git stops and asks you to resolve.

A fast-forward is the special case where one side has no unique commits: Git just slides the branch pointer forward. No merge commit is required.

**Law.** merge **preserves** the commits that existed on both sides. It adds a node that points at both tips. It does not rewrite those commits.

**Check.** after `git merge other`, `git cat-file -p HEAD` should show two `parent` lines if it was a true merge. `git log --graph --oneline` should show the join. If you see one parent, it was a fast-forward (or you merged nothing).

### 3.4 rebase

**Definition.** rebase takes the **patch** of each commit on your branch that is not on the new base, and **replays** those patches on top of the new base. The result is new commit objects (new hashes, new parents). The old commits remain in the object database until garbage-collected; the branch pointer moves to the replayed tip.

From the Git book (Branching — Rebasing): rebase is a way to make a linear story. It is also a way to **rewrite history** that other people may have built on.

**Law.** do not rebase commits that exist outside your repository and that others may have based work on. Rewriting a published tip forces everyone else to recover. Merge is the cooperative default on a shared branch. Rebase is for local cleanup before you share, or for a workflow the whole team has agreed.

**Check.** after a rebase onto `main`, `git log main..HEAD` should show your commits with new hashes sitting on the current `main`. `git merge-base HEAD main` should be the tip of `main` if the rebase was complete. If a colleague still has the old hashes, you rewrote published history — stop and recover, do not force-push as a reflex.

### 3.5 working tree, index, HEAD

Git has three trees you must keep distinct:

| Name | Is |
|---|---|
| **working tree** | Files on disk you edit |
| **index / staging area** | What the next commit will contain |
| **HEAD** | The last commit on the current branch |

`git add` copies working-tree bytes into a blob and records the name in the index. `git commit` writes a tree from the index and a commit pointing at it. `git restore` / `git reset` move content between these three; they are not synonyms. Fetch the Git book “Reset Demystified” if you are about to run `reset --hard` on uncommitted work.

**Check.** `git status` names the three areas in English. If status is dirty and you cannot say whether the bytes live in the index or only on disk, do not commit yet.

---

## 4. Distributed Collaboration: Remotes, Branches & Evidence

**Definition.** a **remote** is a named URL of another repository. `origin` is only a convention. `git fetch` copies objects and updates remote-tracking refs (`origin/main`). `git pull` is fetch plus a merge or rebase. `git push` updates a branch on the remote to point at a commit you have, sending missing objects.

**Law.** the remote does not magically contain your working tree. Uncommitted bytes are not backed up by push. A green “synced” icon on a dirty tree is a lie. `git status` clean on the branch you meant to ship is the evidence.

**Force-push.** `git push --force` (and `--force-with-lease`) moves a remote branch pointer to a commit that may not be a descendant of what was there. On a shared `main`, that is how you lose the evidence other people pulled. `--force-with-lease` still rewrites; it only refuses if the remote moved since you last fetched. It is not a licence to rewrite public history.

**Messages.** a commit message says **why**. The diff says what. “fix” and “wip” are not why.

**Check.** after push, clone into a fresh directory and run the test command from the README. If that clone cannot run, you did not ship a repository; you shipped a laptop state.

---

## 5. Automated Verification: Tests That Fail Closed

**Definition.** a test is a **machine-runnable claim** about a spec. Fail closed means: if the claim is false, or the test cannot run, **the change does not ship**. Fail open means: a skip, a swallowed exception, a missing file, or a flaky retry that eventually greens, and the change ships anyway.

**Law.** the default is fail closed. An empty test suite that “passes” is fail open. A test that mocks the entire system and asserts `true` is fail open. A CI job that is allowed to fail is fail open for that job.

Pytest (https://docs.pytest.org/en/stable/) discovers tests and treats a failed assertion as a failed test. Official example from that door:

```
def inc(x):
    return x + 1

def test_answer():
    assert inc(3) == 5
```

`inc(3)` is `4`, so the assertion fails and pytest exits non-zero. That is the point. The test is not decoration; it is the gate.

**Kinds of test (use the cheapest that can falsify the claim):**

| Kind | Job | Typical fail |
|---|---|---|
| **unit** | One function, in-process | Wrong return, thrown type |
| **contract** | HTTP/JSON/SQL shape | 500, malformed body, missing column |
| **integration** | Two real pieces | Timeout, schema drift |
| **end-to-end** | A user path | UI missing, auth broken |

Do not start at end-to-end. An e2e suite that cannot name the unit that broke is a fog machine.

**Write the failing test first** when the spec is new. See red. Then write the minimum code that turns it green. Then see red again if you break it. A test written after the code that only repeats the implementation is a snapshot, not a spec.

**Determinism.** a test that depends on clock, network, or unordered maps without a seed will flake. Freeze time, fake the network at a seam, sort when order is not the spec. Flaky tests train humans to ignore red — that is fail open.

**Coverage is not the goal.** a 100% line-covered function can still be wrong if no assertion names the invariant. Prefer one sharp assertion per claim over a carpet of existence checks. Coverage percent is not a spec. A fully covered wrong conversion is still wrong.

**Names.** `refuses_unknown_unit_pairs` is a claim. `test1` is not.

**Worked check.** spec: `parse_int("12")` returns integer 12; `parse_int("x")` fails closed (error, no silent 0).

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

If `parse_int` returns `0` on junk, the second test is the one that catches it. The first test alone is fail open on the error path.

EasyLM’s own bar, as a worked product example: unknown units **error**; they do not invent 1:1. The Stacks miss **says miss**. Those are tests you can write without a browser. Calc does arithmetic; the model does not.

**Check.** delete the implementation; the test must go red. If it stays green, it was not testing the thing. Run the suite until it fails on purpose (break the code). If nothing goes red, you do not have a test. You have a script that prints ok.

---

## 6. Network Protocols: The Formal Semantics of HTTP

Door: https://www.rfc-editor.org/rfc/rfc9110 — HTTP Semantics, June 2022, STD 97, Fielding, Nottingham, Reschke. This RFC is the **semantics** shared by HTTP/1.1, HTTP/2, and HTTP/3. Wire syntax lives in other RFCs (9112, 9113, 9114). If a blog and this RFC disagree, the RFC wins.

**Definition.** HTTP is a **stateless request/response protocol**. A client sends a request with a **method** and a **target resource**. A server returns a **status code** and, often, a **representation** (bytes plus metadata). The protocol does not define your database. It defines the uniform interface.

Core terms from RFC 9110 §3:

| Term | Is |
|---|---|
| **resource** | The target of a request, identified by a URI |
| **representation** | Bytes + metadata that stand for a state of the resource |
| **origin server** | The program that can answer authoritatively for that URI |
| **safe method** | Essentially read-only; no obligation to change state (§9.2.1) |
| **idempotent method** | N identical requests have the same effect as one (§9.2.2) |

URI schemes: `http` default TCP port 80; `https` default TCP port 443, with TLS. An origin is scheme + host + port after normalisation (RFC 9110 §4.3.1). `https://Example.Com/happy.js` has origin `{ "https", "example.com", "443" }`. Two origins that differ in scheme, host, or port are distinct.

### 6.1 methods (RFC 9110 §9)

Registered methods in this RFC:

| Method | Intent | Safe | Idempotent |
|---|---|---|---|
| **GET** | Transfer a current representation of the target resource | Yes | Yes |
| **HEAD** | Like GET, but the server does not send content | Yes | Yes |
| **POST** | Process the request content according to the resource’s own semantics (often create or append) | No | No |
| **PUT** | Replace the target resource with the enclosed representation | No | Yes |
| **DELETE** | Remove the association between the target resource and its current functionality | No | Yes |
| **CONNECT** | Establish a tunnel to the origin | No | No |
| **OPTIONS** | Request communication options for the target | Yes | Yes |
| **TRACE** | Message loop-back for diagnostics | Yes | Yes |

**PATCH** (partial update) is defined in RFC 5789, not as a core method of RFC 9110. If you implement PATCH, fetch RFC 5789. Do not invent “PATCH is like PUT.” PATCH is not required to be idempotent.

**Law.**

- GET and HEAD must not be used to change server state as part of their contract. A GET that deletes a row is a bug, even if your framework makes it easy.
- PUT of the same body twice leaves the resource in the same state (idempotent). POST twice may create two rows.
- The method is the verb. The URI is the noun. Do not bury the verb in `/api/doCreateUser` and then POST to it as theatre. `POST /users` or `PUT /users/{id}` is the uniform interface.

**Worked check.**

Invoice pay endpoint.

Wrong: `GET /invoices/9/pay` — GET is safe; paying is not.

Right: `POST /invoices/9/payments` with a client-generated **idempotency key** (chapter 10), so a retry does not pay twice. PUT of a payment resource at a client-chosen URI (`PUT /invoices/9/payments/{key}`) is also idempotent by construction.

### 6.2 status codes (RFC 9110 §15)

Classes:

| Class | Meaning | Client should |
|---|---|---|
| **1xx** | Informational | Wait; not the final answer |
| **2xx** | Success | The request was understood and accepted |
| **3xx** | Redirection | Look at Location / cache rules |
| **4xx** | Client error | Fix the request; do not blindly retry as-is |
| **5xx** | Server error | The server failed; retry only if the method is idempotent and the failure is transient |

Common codes you must not mix up:

| Code | Name | Use |
|---|---|---|
| 200 | OK | GET succeeded; body is the representation |
| 201 | Created | A new resource exists; Location often set |
| 204 | No Content | Success, empty body (common after DELETE or an empty PUT) |
| 304 | Not Modified | Conditional GET; cache is still good |
| 400 | Bad Request | The request is malformed |
| 401 | Unauthorized | Missing or bad credentials (despite the name: *unauthenticated*) |
| 403 | Forbidden | Credentials understood, access refused |
| 404 | Not Found | No current representation, or you will not admit it |
| 409 | Conflict | Current state does not allow the method |
| 429 | Too Many Requests | Rate limit |
| 500 | Internal Server Error | The server hit a bug; log it |
| 502 | Bad Gateway | This server, as gateway, got a bad answer upstream |
| 503 | Service Unavailable | Overloaded or down; Retry-After if you know |

**Law.** do not return 200 with `{"error": ...}` as your only signal. Clients, caches, and monitors read the status. A JSON error field is extra; the status is the contract. Do not return 500 for a missing id — that is 404 or 400. Do not return 401 when the user is known and not allowed — that is 403.

**Example exchange** (RFC 9110 §3.9, abbreviated):

```
GET /hello.txt HTTP/1.1
Host: www.example.com

HTTP/1.1 200 OK
Content-Type: text/plain

Hello World! My content includes a trailing CRLF.
```

**Check.** for each endpoint, write the method, the success status, and one 4xx. If two endpoints share a method+path and mean different things, the spec is colliding. Fetch RFC 9110 §9 and §15 when you are about to invent a new verb or a new meaning for 200.

---

## 7. Data Serialization: Strict Parsing of RFC 8259 JSON

Door: https://www.rfc-editor.org/rfc/rfc8259 — The JavaScript Object Notation (JSON) Data Interchange Format, December 2017, Bray ed. Obsoletes RFC 7159.

**Definition.** JSON is a **text format** for structured data. It can represent four primitive types (string, number, boolean, null) and two structured types (object, array). It is language-independent. It is not JavaScript. It is not YAML. It is not “whatever `print` emitted.”

**Grammar, compressed:**

- A JSON **text** is `ws value ws` — a single value, optionally padded with insignificant whitespace (space, tab, LF, CR). Older lore that “JSON must be an object or array” is from earlier specs; RFC 8259 allows any value. Generators that only emit object or array stay maximally interoperable.
- **object:** `{` string `:` value (`,` string `:` value)* `}`. Names **SHOULD** be unique. Duplicate names make receiver behaviour unpredictable.
- **array:** `[` value (`,` value)* `]`. Order matters. Types may mix.
- **number:** base-10, optional minus, no leading zeros, optional fraction and exponent. **Infinity and NaN are not permitted.**
- **string:** Unicode text in double quotes, with the usual escapes.
- Literals: `true` `false` `null` — lowercase only.

**Encoding (RFC 8259 §8.1).** JSON text **SHALL** be encoded in UTF-8. It **SHALL NOT** begin with a byte order mark.

**Law.**

- No comments. No trailing commas. No single quotes. Those are JavaScript / JSONC / JSON5, not JSON.
- Object member **order is not significant** for meaning. If you need order, use an array.
- Numbers are decimal text, not IEEE floats, at the JSON layer. Your language will parse them into floats or decimals. Large integers (`2^53` and above in IEEE binary64) will silently round in many runtimes. If the id must round-trip, use a **string**. Money: integers of cents, or a decimal type, not `0.1 + 0.2` in IEEE. **calc** does the arithmetic.
- `null` is a value. Omitting a key is a different fact. Pick one and document it.
- Never build JSON by concatenating user strings. Parse, then pick fields.

**Schema.** if two processes exchange JSON, name the keys and types. Reject extras or missing required keys on the boundary that faces the world.

**Worked check.**

Valid:

```
{"id":"12","ok":true,"n":0.5,"tags":["a",null]}
```

Not JSON:

```
{id: 12,}
{'id': Infinity}
```

Parse with a real parser (`json.loads` in Python, `JSON.parse` in JS). Do not split on commas. Do not `eval`.

**Check.** round-trip: parse, serialise, parse again. If a float changes, you have a number-precision problem — switch that field to string or to an integer you can represent, or use **calc** on the exact decimal. If two official parsers disagree on a document, the document is not interoperable; fix the document.

---

## 8. Relational Persistence: SQL & SQLite Internals

Doors: https://www.sqlite.org/docs.html · https://www.sqlite.org/about.html · https://www.sqlite.org/lang.html · https://www.sqlite.org/limits.html

**Definition.** SQL is a language for defining and querying **relations** (tables of rows with named columns). A query names *what* you want; the engine picks *how* (mostly). SQLite is an **in-process, serverless, zero-configuration, transactional** SQL engine that reads and writes a **single ordinary file**. Public-domain source. Sqlite.org says: think of it as a replacement for `fopen()`, not as a replacement for a networked cluster database.

From sqlite.org/about (fetched for this book): ACID transactions even after power loss; stable file format; max database size **281 terabytes** (2^48 bytes); max row size **1 gigabyte**. If a limit is load-bearing for your app, fetch https://www.sqlite.org/limits.html again; do not rely on this paragraph if the live page moved.

### 8.1 relational core

A **table** is a set of rows. A **primary key** uniquely identifies a row. A **foreign key** says a value must exist in another table (if you turn enforcement on). A **NULL** is “unknown / missing,” not the string `"null"` and not `0` and not `''`.

Four verbs you will actually use:

| Verb | Job |
|---|---|
| **SELECT** | Read rows; does not change the database |
| **INSERT** | Add rows |
| **UPDATE** | Change columns in existing rows |
| **DELETE** | Remove rows |

**Law.** write the **WHERE** before you run UPDATE or DELETE. `DELETE FROM t` with no WHERE deletes every row. That is not a trick; it is the language. Wrap multi-statement changes in a **transaction** (`BEGIN` … `COMMIT`). If you error, `ROLLBACK`. SQLite’s ACID claim is about transactions, not about a sequence of autocommit statements you hoped were atomic.

**Parameterise.** never build SQL by concatenating user strings. Use placeholders (`?` in SQLite). Concatenation is how injection happens. This is not optional.

**Worked check.**

```
CREATE TABLE note (
  id   INTEGER PRIMARY KEY,
  body TEXT NOT NULL
);

INSERT INTO note (body) VALUES (?);
SELECT id, body FROM note WHERE id = ?;
```

If `SELECT` returns no row, the id does not exist. Do not invent a row in the application to look helpful.

### 8.2 joins and indexes

A **join** combines rows from two tables on a condition, usually a key.

```
SELECT note.id, tag.name
FROM note
JOIN note_tag ON note_tag.note_id = note.id
JOIN tag ON tag.id = note_tag.tag_id
WHERE note.id = ?;
```

Inner join: only rows that match. If you meant “notes even without tags,” that is a different join (LEFT). Pick it in the spec, not after the empty result surprises you.

An **index** is extra structure so a lookup does not scan the whole table. SQLite will use an index when it helps; `EXPLAIN QUERY PLAN` is how you see. An index is not free: writes maintain it. Index the columns you **filter and join** on, not every column “just in case.”

**Check.** a constraint that can fire. A test that inserts a duplicate primary key and expects failure. A test that EXPLAIN QUERY PLAN on the hot SELECT does not say “SCAN” of a table you believed was keyed — or you accept the scan in writing.

### 8.3 SQLite specifics

- One writer at a time on a database file (WAL mode allows concurrent readers). If you need many writers across machines, you need a different engine. Say so; do not pretend.
- Types are **dynamic** with declared type affinity. An INTEGER column can still store text if you bind text. If you need strictness, fetch the current `STRICT` table docs on sqlite.org; do not guess the version that added them.
- `INTEGER PRIMARY KEY` is an alias for the rowid. That is a SQLite fact; other engines differ.
- Backup is “copy the file” only if no writer is in the middle; use the backup API or VACUUM INTO for a consistent snapshot.

**Check.** after INSERT, SELECT the row back. After crash recovery, SELECT again. If the row vanished, you were not in a committed transaction. Fetch sqlite.org/transactional.html rather than trusting a blog about fsync.

---

## 9. Algorithmic Complexity in Practice: Big-O & CPU Caches

Math pack owns the formal definition of a function’s growth. This chapter is the **engineering use**: how many steps as input size `n` grows, so you pick a structure that will still return before the user leaves.

**Definition.** Big-O names an **upper bound** on growth, ignoring constants and lower-order terms. `O(n)` means “at most proportional to n, for large n.” it is not a timing in milliseconds. It is not a promise about n=3. Worst case unless you say average.

Common classes, slowest last among these:

| Class | Name | When you see it |
|---|---|---|
| `O(1)` | Constant | Array index, hash-table hit (average), dict lookup |
| `O(log n)` | Logarithmic | Binary search, balanced tree |
| `O(n)` | Linear | Scan a list, single pass |
| `O(n log n)` | Linearithmic | Good comparison sorts |
| `O(n²)` | Quadratic | Nested loops over the same n |
| `O(2^n)` | Exponential | Naive subset / recursion without memory |

**Law.** measure the **input that actually grows**. If you sort 20 config keys, `O(n²)` is noise. If you nest a linear scan inside a linear scan over a million rows, you will wait. Constants matter at small n; structure matters at large n. If you did not measure, you do not know the millisecond cost — call a profiler, not a model.

### 9.1 structures

| Structure | Get by key / index | Insert | Extra |
|---|---|---|---|
| **array / vec** | `O(1)` index | `O(n)` in the middle; amortised `O(1)` append | Contiguous; good cache |
| **linked list** | `O(n)` scan | `O(1)` at a known node | Poor cache; rarely the default |
| **hash table** | Average `O(1)` | Average `O(1)` | Worst case `O(n)` if everything collides; no order |
| **balanced BST** | `O(log n)` | `O(log n)` | Ordered iteration |
| **heap** | `O(1)` peek min/max | `O(log n)` push/pop | Not a search tree |
| **B-tree** | `O(log n)` | `O(log n)` | Disk / SQLite indexes live here |
| **queue / stack** | `O(1)` at the end you chose | `O(1)` | FIFO / LIFO |

A **graph** is nodes plus edges. BFS/DFS are `O(V+E)` on an adjacency list if you mark visited. Binary search requires a **sorted** array; the sort is the precondition. Dijkstra on non-negative weights is the standard shortest-path tool; fetch a named algorithms text if you need the exact heap complexity for your variant. Do not quote a number you did not check.

**Worked check.**

You have `n` user ids and want “is this id in the set?” `n` times.

- List scan each time: `n` queries × `n` scan = `O(n²)`
- Put ids in a hash set once `O(n)`, then `n` lookups average `O(1)` each = `O(n)`

For n=10 both feel instant. For n=10^6 the nested scan is a bug. **calc** `n*n` if you want the comparison count; the Stacks does not invent a clock time.

**Check.** name n, name the structure, name the class. If you wrote a double `for` over the same array and n is unbounded, you owe a reason or a different structure. If you say O(1) and you walk the whole table, you lied.

---

## 10. Fault Tolerance: Error Envelopes, Structured Logs & Idempotence

### 10.1 errors

**Definition.** an error is a **named failure** the caller can handle. It is not a printed stack that vanishes. It is not `null` with no comment.

Two families:

| Family | Is | Example |
|---|---|---|
| **expected** | In the spec: bad input, not found, conflict | 404, `ValueError`, unique-key fail |
| **unexpected** | A bug or an environment break | Null deref, disk full, upstream 500 |

**Law.** expected errors stay **structured** (type, code, field). Unexpected errors **fail closed**: stop the operation, roll back the transaction, log with a correlation id, return 500 or crash the worker. Do not convert an unexpected error into an empty success.

Map errors at the boundary. Inside the core, use types. At HTTP, use RFC 9110 status. Do not leak stack traces to the public client.

### 10.2 logs

**Definition.** a log is a **time-ordered record of facts** a human or a machine can grep later. It is not a debug print you will delete. It is not a second database of user content.

Each line should contain: time (UTC), level, **correlation id**, the operation, the outcome, and identifiers that are not secrets. One event per line. JSON logs are greppable if you keep the schema small.

**Law.** never log tokens, passwords, raw cards, session cookies, or private message bodies. Log the **id** of the object, not the secret that opens it. If you are unsure whether a field is a secret, it is a secret.

Levels: error = operator must look; warn = degraded; info = state change you would want in an incident; debug = off in production unless a named session turns it on.

**Check.** trigger a 500 in dev. The log line must name the request id and the function. The HTTP body must not contain the stack. The token used to call the API must not appear in the log file.

### 10.3 idempotence and retries

**Definition.** an operation is idempotent if **doing it N times has the same effect as doing it once.** RFC 9110 §9.2.2 defines this for HTTP methods. You also need it for **your** POST handlers, because networks retry.

**Timeout.** a deadline, then stop. An unbounded wait is not patience; it is a leak of workers.

**Retry.** only if the operation is idempotent or you have a dedupe key. Retrying a non-idempotent POST without a key is how you double-charge.

**Law.** any effect that charges money, sends mail, or creates a unique real-world event must be keyed. The client sends an **idempotency key**. The server stores the key with the result. A second POST with the same key returns the first result and does not repeat the effect.

Worked:

1. Client generates `key = <uuid>`
2. `POST /charges` with header `Idempotency-Key: <key>` and body `{ "amount": 10 }`
3. Server `INSERT` the key first (unique constraint). If the insert loses a race, SELECT the stored result and return it
4. A retry with the same key does not create a second charge

GET, PUT, DELETE are already idempotent at the HTTP layer **if you implemented them as RFC 9110 says**. POST is not; you add the key.

**Check.** send the same POST twice in a test. Assert one row, one side effect. If two rows appear, the handler is not idempotent. Fail closed. Unplug the network in the middle of the write. Does retry duplicate? if you do not know, you have not designed it.

---

## 11. Cryptographic Secrets & Supply-Chain Hygiene

**Definition.** a secret is a value that **grants power**: API token, private key, password, session signing key, webhook secret, cloud credential. If it is in a git object, it is in **every clone** of that history, forever until you rotate the secret **and** purge the object (purging hashes is hard; rotation is the real fix).

**Law.**

1. Secrets live in the **environment** or in a restricted secret store, not in source.
2. `.env` files are local. They are listed in `.gitignore`. They are never `git add`Ed.
3. Example files are `env.example` with **empty or fake** values.
4. If a secret was committed, **rotate it now**. Rewriting history without rotating leaves the old secret valid in every laptop that already fetched.
5. CI gets secrets from the host’s secret mechanism, not from a file in the repo.
6. Do not paste tokens into a model prompt. The prompt is not a vault.
7. Least privilege: the token that can only do this job.

GitHub documents secret scanning and removing sensitive data: https://docs.github.com/en — fetch the current page if you are in an incident. The Git book covers credential helpers; it does not make it legal to commit a token.

**Supply chain.** dependencies are code you did not write running in your process. Pin versions with a lockfile. Read the licence. A postinstall script is a program you just executed. Lockfiles exist so two installs match.

EasyLM is AGPL-3.0-or-later. Dependencies keep their own licences (model weights are not AGPL just because the app is). Say the split in the README. Do not launder a proprietary blob as “the app is free” without that split.

**Worked check.**

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

Missing env → fail closed (KeyError / explicit error), not a silent empty string that calls the API unsigned.

Grep the tree for `sk-`, `BEGIN PRIVATE KEY`, `ghp_`, `AKIA`. If you find a real one, rotate. Do not “just delete the file” in a new commit and call it done — the blob is still in history.

**Check.** `git grep` and `git log -p --all -S 'BEGIN PRIVATE KEY'`. Empty is the passing test. A comment that says “do not commit secrets” is not a check.

---

## 12. Production Delivery: Static Packaging & Web Deployment

**Definition.** shipping is moving a **specific version** of the program to a place users can run, with a way to roll back. For a front-end web app the usual shape is: source → **build** → **static files** → **host** that serves them over HTTPS.

### 12.1 build

A build is a **pure function** from source + lockfile to artefacts. Given the same git commit and the same tool versions, you should get the same files (or a documented reason you do not).

Typical web app:

1. Install dependencies from a **lockfile** (`package-lock.json`, `pnpm-lock.yaml`, `Cargo.lock`)
2. Typecheck
3. Run tests (fail closed)
4. Compile/bundle TypeScript/JS/CSS to a `dist/` of HTML, JS, CSS, assets
5. The server users hit is either that static `dist/` or a small backend plus `dist/`

Vite (https://vite.dev/guide/) is one bundler used for this; the law is the pipeline, not the brand. TypeScript’s contract is the handbook at https://www.typescriptlang.org/docs/handbook/intro.html. MDN documents the Web platform the bundle runs on: https://developer.mozilla.org/docs/Web

**Law.** you ship the **artefact**, not your `node_modules`. You pin versions. An unpinned `latest` on the day you ship is a different program tomorrow. A git SHA is evidence of source; the live JS hash is evidence of what users run. They must match the build you meant.

### 12.2 static host

Static hosting means: files on disk, HTTPS in front, `index.html` for the app shell, correct `Content-Type`, and a rule for client-side routes (usually “unknown path serves `index.html`” for a single-page app, **except** for real files).

Checklist:

| Item | Why |
|---|---|
| HTTPS | HTTP scheme is a different origin; credentials leak on the wire |
| Cache hashed assets forever; `index.html` short cache | Otherwise users keep a stale shell or re-download everything |
| `Content-Type` matches the file | JS served as text/plain will not run |
| No secrets in the bundle | Anything in `dist/` is public. Public keys for a client API are not secrets; private keys are |
| Source maps off or restricted in production | Maps are a gift to attackers if they include original source and you did not mean to publish it |
| One URL per deploy | You can point DNS or a release alias back |
| Origin / CORS match the documented origins | A prefix regex that lets an attacker’s sibling host through is a hole |

**Rollback.** keep the previous `dist/` (or the previous container image tag). Shipping without a pointer to “last known good” is a one-way door.

**CI.** the pipeline is a test that runs on a clean machine. Install from lockfile, test, build. If CI is skippable, it is fail open. The README command and the CI command must be the same job.

**Worked path.**

```
git switch main
git pull
npm ci
npm test
npm run build
```

Then upload `dist/` to the static host.

```
GET https://example.com/  → 200, text/html
GET https://example.com/assets/index-<hash>.js → 200, application/javascript
```

**Check.** after deploy, fetch the page yourself. Read the status code. If you only looked at the CI green check, you have not shipped; you have compiled. If `index.html` still references a JS hash that 404s, the upload was partial — fail closed, roll back. Network tab on first paint: every host you see is in the README split.

EasyLM as a public example of this shape: a static web app, local model inference in the browser, calc/units/stacks as sovereign hands. The production URL is the product. Prove the live bundle; do not assume a git push updated every host.

---

## 13. Type Systems as Executable Proofs

**Definition.** a type is a **name for a set of values** and the operations that are legal on them. At the software-engineering layer, types are how you keep the spec from rotting: if the JSON field is a string id, the type says `string`, not “whatever.”

Python 3 types and the language reference: https://docs.python.org/3/
TypeScript handbook: https://www.typescriptlang.org/docs/handbook/intro.html
Rust book (ownership as a type-system fact): https://doc.rust-lang.org/book/

**Law.** the **public surface** is typed and small. Internals can be messy for a day; the surface cannot. If the function can return empty or a value, the type says so. If HTTP can return 404, the client type is a result, not a naked record.

**Compatibility.** adding an optional JSON field is usually safe. Removing a field, changing its type, or reusing a name for a new meaning is a **breaking change**. Bump the version. Do not silently reinterpret.

**Check.** change a field from number to string in the spec. The typecheck or a contract test must go red. If only production goes red, the surface was untyped.

---

## 14. Systematic Debugging: The Scientific Method in Silicon

Work this list in order. Do not skip to rewriting the module.

1. **name the failure** in one sentence.
2. **reproduce** in one command or one request. If you cannot reproduce, you do not have a bug yet; you have a story.
3. **smallest input** that still fails. The smallest JSON that 500s is the spec of the bug.
4. **name the layer:** spec wrong, test wrong, code wrong, data wrong, environment wrong. Only one is the first cause.
5. **read the error.** status, exception type, log line with correlation id. If there is no log line, add one, do not add features.
6. **bisect.** `git bisect` on a failing test is faster than staring. Git records snapshots; use them.
7. **check the RFC / language door** if the fight is about HTTP, JSON, SQL, or git. Folklore loses.
8. **arithmetic** goes to **calc**. Units go to **units**. This book does not multiply in prose.
9. If the official page and this textbook disagree on a load-bearing number → state unverified, fetch the door, then fix the book.

Do not add a second stack because the first one hurt. Fix the contract.

**Done** means: a test that failed is green, the spec sentence still true, nothing secret in git, the ship checklist in chapter 12 has been walked, not imagined.

---

## 15. Authoritative Standards & RFC Repository Doors

It will not pick your framework. It will not quote a star count as evidence. It will not treat a vendor tutorial as RFC 9110. It will not store a token in a gist “just for now.”

When the job is a language primitive, fetch Python / TypeScript / Rust / MDN. When the job is a protocol, fetch the RFC. When the job is git, fetch git-scm. When the job is a number, **calc**.

Doors for this pack: `LINK_INDEX.md` in this directory.
)
