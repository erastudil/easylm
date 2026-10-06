---
title: "open_standards — an RFC as a contract"
date: "2026-09-20"
status: draft
start: read
needs: computers
home: "drafts/agy-review/packs/open_standards/"
---

# An RFC as a contract two shops can both build

You already have files and a browser. This book adds one object: a page two shops can both fetch and both build, so both programs send the same bits.

The computers pack owns the file, the folder, this machine, and the browser. Name that door and stop. HTML, CSS, and HTTP as a page belong to the web platform pack. Its doors include the WHATWG HTML living standard at https://html.spec.whatwg.org/, W3C at https://www.w3.org/, and the HTTP documents on the RFC Editor. This book names those doors and stops. Letter codes and encodings belong to the Unicode standard at https://www.unicode.org/standard/standard.html. Name that door and stop. This pack owns the walk from a shared page to two working programs.

This pack is public general education.

---

## 1. A contract among implementers

Mira at Cedar Post writes a short file for each parcel. Jonah at Mill Wharf reads that file and unloads the boat. If Mira writes `crate 9 holm` and Jonah's program expects `9 crate holm`, the crate sits on the dock and the program reports nothing useful. The bits arrived. The agreement did not.

They pin one sheet to the wall both shops can copy. The sheet says: first word is the kind, `crate` or `sack`. Second word is a whole count. Third word is the dock name in lowercase. A line is three words, separated by spaces, ended by a new line. No extra commas. No extra labels.

Mira now writes `crate 9 holm`. Jonah's program splits on spaces, reads kind, then count, then dock. Nine crates go to Holm. The sheet did that. Two programs, two authors, one page.

People name that shared page a **contract among implementers**. The people who write the programs are the **implementers**. The contract is not a handshake and not a mood. It is the page both sides can fetch, that names the bits, in an order a stranger can follow.

A spoken habit in one shop is not the contract. Mira saying "we always put the count first" does not travel to Mill Wharf. A private email to Jonah does not travel to a third shop that starts next month. The page that both can fetch is the object.

The public internet uses the same object at a larger scale. Two browsers, two mail programs, two clocks: each pair meets because both sides built from a page a stranger can open. Later chapters name the hosts that publish those pages. The job in this chapter is smaller: see the sheet, see two programs, see them meet or miss.

**Check.** Mira sends one new line: `sack 4 mill`. Jonah's program, built from the sheet above, must read kind `sack`, count `4`, dock `mill`. If it stores `4` as the kind, the field order is wrong. New case: both shops change the sheet so the count comes first, then send `11 crate holm`. Jonah must now read `11`, then `crate`, then `holm`. If his program still reads kind first, he is running last week's sheet. The number 11 is new. The miss is the old order.

---

## 2. An RFC

Open a browser. Go to https://www.rfc-editor.org/. The page titles itself the official home of RFCs. It says RFCs outline computer networking and Internet foundations, including Internet Standards and historical or informative content. It says they are published by the RFC Editor for the IETF, the IRTF, the IAB, and independent submissions, which collectively form the authoritative source for RFCs.

On that front door, one of the latest items is **RFC 10050**, titled *Protocol-Specific Profiles for JSContact*. The door lists it as a Proposed Standard, IETF publication, Applications and Real-Time Area, authors R. Stepanek and M. Loffredo, dated September 2026. Another latest item is **RFC 10032**, titled *The AEGIS Authenticated Encryption Algorithms*. The door lists it as Informational, IRTF publication, authors F. Denis and F. Lucas, dated September 2026.

A number, a title, a status, a stream, a date, named authors: that is the handle of one published page. People name that published page an **RFC**. The letters once stood for Request for Comments. The living series is the set of numbered documents the RFC Editor publishes and archives. The introduction to the series lives at https://www.rfc-editor.org/series/rfc/. The full index lives at https://www.rfc-editor.org/rfc-index/.

Status on the front door is part of the contract's weight. The RFC Editor's Standards search is for stable or mature protocols and services. Best Current Practices are common guidelines for policies, operations, or procedures. IETF work, on the same front door, covers protocol standards, best current practices, experimental, and informational documents. IRTF work covers research issues related to the Internet. IAB work covers long-range technical direction. Independent submissions are a separate stream, with their own door under the RFC Editor.

A work in progress is not yet an RFC. The front door sends you to https://datatracker.ietf.org/ for works in progress. A file on Mira's laptop titled `draft-cedar-wharf-ticket` is a draft. It becomes an RFC only when the RFC Editor publishes it with a number. Until then, Jonah cannot treat the laptop file as the public contract.

This book does not copy RFC 10050's field list. The body of that RFC was not fetched. Any claim about a JSContact key in these pages is unverified. Open https://www.rfc-editor.org/info/rfc10050/ when the fields themselves must travel. The front door is enough for the handle: number, title, status, stream, date.

Many RFCs mark some sentences as stronger than others. The exact table of those words is unverified here. Open the RFC you are building. Use the words that RFC defines. Do not import a remembered table from another number.

**Check.** On the RFC Editor front door, RFC 10050 is a Proposed Standard from the IETF, September 2026. Write that handle on a card. New case: RFC 10032, same month, is Informational from the IRTF. If your card says RFC 10032 is a Proposed Standard because the number sits near 10050, you invented the status. Fetch the living list. Copy the status from the door, not from the neighboring number.

---

## 3. A consortium page

Mira and Jonah both open https://www.w3.org/. The host is the World Wide Web Consortium. The front door says W3C is an international community where Members, full-time staff, and the public work together to develop web standards. It says those standards are implemented in browsers, blogs, search engines, and other software.

A page on that host is a **consortium page**. A consortium here is a named group that publishes the page, with Members, staff, and a public door. The contract is still the page. The consortium is the shop that keeps the page.

W3C's standards door is https://www.w3.org/standards/. The front door also names a yearly gathering: TPAC 2026 runs 26 to 30 October, in Dublin, Ireland. Work groups meet that week to coordinate work that advances web standardization. The governing bodies named on that banner are the Board of Directors, the Advisory Board, the Technical Architecture Group, and the Advisory Committee. Those are seats for the people who run the consortium. They are not extra fields in Mira's ticket file.

A First Public Working Draft is an early consortium page. On the same front door, W3C lists a First Public Working Draft for *SHACL 1.2 Inference Rules*, which the news line says defines Inference Rules support of the SHACL Shapes Constraint Language, and a First Public Working Draft for *Web Authentication: An API for accessing Public Key Credentials Level 4*. Early is a status. Treat an early page as an early page. Do not pin it as the finished contract.

A second consortium door for HTML as a page is the WHATWG living standard at https://html.spec.whatwg.org/. That URL is the door. The page is large. This book does not quote a tag, an attribute, or a parsing rule from it. The web platform pack owns HTML as a page. Name the living URL and stop.

Two hosts can both speak about the web. W3C's front door and WHATWG's HTML URL are two doors. Chapter 8 is the method when they disagree. This chapter only needs the shape: a consortium publishes a page at a stable URL, and implementers build from that URL.

**Check.** Write one sentence that names who, on W3C's front door, develops web standards: Members, full-time staff, and the public. New case: TPAC 2026 is 26-30 October in Dublin. That is a meeting. If a program refuses a ticket because the calendar is not in Dublin, the meeting leaked into the contract. Keep the gathering on the calendar. Keep the bits on the spec page.

---

## 4. A version

Mira builds from a printed sheet dated 12 March. Jonah bookmarks a URL. In April the host rewrites the URL. Jonah's program now reads a different page than Mira's printout. They miss, and both can point at "the spec."

A **version** is the handle that stops that miss: a number, a date, a URL, and a status, written next to the program. RFC 10050 is one version: number 10050, September 2026, Proposed Standard, IETF stream, at the RFC Editor. A datatracker draft of a similar title is a different object. A First Public Working Draft on W3C, such as SHACL 1.2 Inference Rules on the 2026 news list, is a different object again. Same topic words do not make the same version.

RFCs are fetched by number. The RFC Editor publishes and archives official RFCs. A later RFC on the same topic gets its own number. The old number still names the old page. Consortium pages often keep one URL and rewrite the text under it. WHATWG HTML uses one living URL. W3C pages often carry a level or a date in the title, as in Web Authentication Level 4. Write down which of those you built.

If the program must keep working after the host rewrites the living URL, store a dated copy with the program's notes, and record the URL and the date you fetched. The living URL remains the door for "what the host says now." The dated copy is what this build used. Both facts belong on the card. Mixing them is how two shops fight while quoting the same link.

Do not invent a version number the host did not print. "We are on HTML 5" as a remembered slogan is unverified here. Open the door the pack names. Copy the label the host prints.

**Check.** Mira's card says RFC 10050, Proposed Standard, September 2026. Jonah's card says a datatracker draft with the same title words. They are two objects. New case: a W3C First Public Working Draft of Web Authentication Level 4 is an early consortium page. If Jonah's notes say "Level 4, done," he upgraded the status. Copy "First Public Working Draft" from the news line, or fetch the document and copy the status it prints.

---

## 5. An erratum

Line 14 of Mira's sheet says the kind word is `crate`. Jonah ships that. A week later Mira posts a note on the shop door: line 14 should have said `box`. Programs that never read the note still talk to each other. A third shop that applied the note now sends `box 9 holm` and the first two shops reject it.

People name a published correction of that kind an **erratum**. The RFC Editor keeps a door for errors and corrections in RFCs at https://www.rfc-editor.org/series/rfc-errata/. The contract you build is the RFC plus the errata the Editor has recorded for that number, once you have opened that list.

This book did not fetch a specific erratum body. Any claim that RFC 10050, or any other number, has a verified correction in these pages is unverified. The method is the load-bearing fact: open the RFC, then open errata for that RFC. If the list is empty, write "no errata listed on the date I fetched." If an entry is there, read its status on that door. Build the status the Editor printed, not a rumor that "everyone knows about the typo."

A blog post that says the RFC meant something else is not an erratum. A chat message from an author is not an erratum until it sits on the Editor's errata door, or until a later RFC with a new number replaces the page. Mira's handwritten note on the shop door is a local erratum. It binds Cedar Post. It does not bind a stranger unless it is on the public errata door or in a new published page.

When two shops disagree about a typo, fetch the RFC and the errata list. Do not average the two readings. Chapter 8 is that method at a larger scale.

**Check.** Local case: the sheet says `crate`. The shop-door note says `box`. Two programs that ignore the note both accept `crate 9 holm` and both reject `box 9 holm`. They interoperate with each other and miss the third shop. New case: pick RFC 10050. Open https://www.rfc-editor.org/series/rfc-errata/ and find that number. Write what the live list shows: entries, or none. If you skip the errata door, you have the RFC without its recorded corrections.

---

## 6. Who may implement

Jonah fetches RFC 10050's info page with no membership card. He reads the title and status the RFC Editor printed. He writes a program that follows the bits that RFC names, once he has opened the RFC itself. Cedar Post did not send him a license in the mail. The public door was the permission to read.

**Who may implement** is the question: may a stranger write a second program from this page, without a private deal with the first shop? On the RFC Editor and on W3C's front door, reading is public. W3C's front door also says everyone can get involved, and it points to ways to participate. Being a **Member** is a different seat. Members join to work with the consortium on the direction of core web technologies. Fetching the page does not put Jonah on the Advisory Committee.

TPAC 2026, 26-30 October in Dublin, is a week of work-group meetings and governing-body meetings. Attendance at TPAC is not the test for whether Jonah may build. The test is whether the spec page is fetchable and whether the page, or a license line on the same host, says he may implement. Exact patent and copyright lines for W3C and for the RFC series were not fetched. Unverified here. Open the document you are building and read the copyright and status sections on that document. Copy those lines. Do not import a remembered "anyone may implement" sentence from another host.

A shop that publishes a page and then telephones Jonah to say he must pay Cedar Post before his program may send `crate 9 holm` is adding a second contract. The public page is one object. The telephone deal is another. This book teaches the public page. A later pack on licenses owns who may copy a file. Name that door when the question is copyright in the shop's own code. Stay here when the question is: can two implementers meet from a standards host.

W3C's front door also notes a pilot program to support open source projects that mature inside an ecosystem with processes and IPR policies designed to support interoperability, quality, and W3C values. That is a consortium program. It is not a substitute for reading the spec you are building.

**Check.** Jonah fetches https://www.rfc-editor.org/ and reads RFC 10050's title and status with no login. That is the public read. New case: he wants to sit on W3C's Advisory Committee. Fetching the spec does not grant that seat. Two jobs: implement from the page, or join the consortium. Write which job you are doing. If your notes say "I read the page, so I vote in Dublin in October," you mixed the seats.

---

## 7. A registry

Mira and Jonah pick the number 99 to mean `crate` in a private field. A third shop, Holm Dock, also picks 99, and means `sack`. Tickets cross. Unloading fails. The miss is not a bug in the splitter. The miss is two shops minting the same number for two jobs.

A **registry** is the public list that stops that minting. IANA, the Internet Assigned Numbers Authority, sits at https://www.iana.org/. The front door splits the work in three. Domain Names: management of the DNS root zone, including assignments of ccTLDs and gTLDs, plus .int and .arpa, and an IDN practices repository. Number Resources: coordination of the global IP and AS number spaces, such as allocations made to Regional Internet Registries. Protocol Assignments: the central repository for protocol name and number registries used in many Internet protocols, with a door to apply for an assignment, and a Time Zone Database.

When a contract says "this field is a number from the registry," the RFC or consortium page names the field, and IANA holds the values. Building the RFC without fetching the registry is building half the contract. The protocol registries door is https://www.iana.org/protocols. The time zone door is https://www.iana.org/time-zones.

This book did not fetch a row from a protocol registry. Any port number, any header name assignment, any media type in these pages is unverified. Open the registry when the value must travel. Copy the row. If the name you want is not in the registry, you do not have a public assignment. You have a private number, and a third shop may pick it too.

Applying for an assignment is its own door: https://www.iana.org/protocols/apply. Mira cannot invent a public kind-code by printing 99 on the Cedar Post wall. She can use 99 inside one pair of shops that never meet a third. The moment a third shop must interoperate, the number needs a registry row, or the contract must use a name the registry already holds.

Unicode owns the codes for letters. Name https://www.unicode.org/standard/standard.html and stop. Do not treat IANA as the encoding door. Do not treat Unicode as the protocol-number door.

**Check.** Mira and Jonah use private kind-code 99 for `crate`. Holm Dock uses 99 for `sack`. Three shops, one number, two meanings. New case: before shipping a public kind-code, open https://www.iana.org/protocols and search the registry the RFC names. If the code is not there, you do not have a public assignment. Write "private" on the card, or apply. Do not print a remembered port or header and call it a registry row.

---

## 8. When two pages fight

Mira's printout of the ticket sheet puts kind first. Jonah's bookmark, rewritten in April, puts count first. Both say "the spec." The crate of 9 never lands. Averaging the two pages into "kind or count, either is fine" produces a third page that neither shop built.

When two pages fight, fetch both. Write the URL, the date, the status, and one sentence of what each page actually says about the field. Pick the page you are building. Write that pick next to the program. Do not average. Do not invent a blend. The library law for a load-bearing fact is the same: if two official pages disagree, say so.

A living consortium URL and a dated RFC can fight. WHATWG HTML at https://html.spec.whatwg.org/ is a living page. An RFC on the RFC Editor is a numbered snapshot. HTML, CSS, and HTTP as a page belong to the web platform pack. This pack owns the fight as a method. If your job is to render a page, open the web platform doors and stop here. If your job is to choose which contract two implementers share, stay on this method: two handles, two fetches, one pick.

A blog that summarizes RFC 10050 is not a second official page. It is a third voice. When the blog and the RFC disagree, the RFC Editor page wins for that RFC. When W3C news says First Public Working Draft and a slide deck says the work is finished, the W3C document status wins. When IANA's registry row and Mira's wall disagree on a number, IANA's row is the public assignment.

Works in progress on https://datatracker.ietf.org/ can disagree with a published RFC of a nearby title. The published RFC is the RFC. The datatracker page is the draft. If you are implementing the RFC, fetch the RFC. If you are implementing the draft, write that you are implementing a draft, and expect it to move.

**Check.** Mira builds from RFC 10050 as listed on the RFC Editor in September 2026, Proposed Standard. Jonah builds from a blog that says JSContact profiles "work like Mira's ticket sheet." The blog is not the contract. New case: Jonah switches to a datatracker draft with similar title words. Now two official-looking pages can fight. Fetch both. Copy status from each door. Pick one. If the program mixes a Proposed Standard field from the RFC with a draft field from the datatracker, the mix is a third page that neither door published.

---

## 9. Open enough to build

A stranger with a browser, no membership card, and a weekend tries to write a second program that talks to Cedar Post. She can open https://www.rfc-editor.org/ without a login. She can read that RFC 10050 exists, that it is a Proposed Standard, that it is dated September 2026. She can follow the info link and, on a full fetch of that RFC, read the bits. That page is **open enough to build** if those bits are on the page and a second implementation does not require a private PDF from Mira.

Open enough is a test you can run. Can you fetch the page? Can you read the field names and the order? Can a second shop build without telephoning the first shop? If any answer is no, you do not yet have this book's object. You have a product sheet, a membership memo, or a rumor.

A PDF behind Cedar Post's login is not open enough for Holm Dock. A slide from TPAC week in Dublin may hint at a change. The spec URL is the contract. A paywalled catalog that sells a numbered "standard" may still be a standard in some industries. It is not the object this book walks, because a stranger cannot fetch it and build. Exact prices and login rules for any paywalled catalog are unverified here. The RFC Editor front door and the W3C front door were fetchable as public pages.

Open enough is not the same as finished. A First Public Working Draft on W3C is fetchable and still early. You may build a prototype from it. You may not tell Jonah it is the finished contract. Open enough is not the same as wise. RFC 10032 is Informational from the IRTF. You can read it. Informational is the status. Do not upgrade it to Internet Standard by enthusiasm.

The Unicode standard door is open for encodings. Name it and stop. The WHATWG HTML door is open for HTML as a page. Name it and stop. This chapter's test applies to those doors too, and those packs own the walks.

**Check.** Open https://www.rfc-editor.org/ with the network on. Confirm RFC 10050's title and Proposed Standard status without creating an account. That is the public-read half of the test. New case: Mira emails Jonah a PDF named `wharf-ticket-v3-final.pdf` that is not on the RFC Editor, not on W3C, not on IANA. Holm Dock cannot fetch it. The PDF may be a fine local contract for two shops. It is not open enough for a third implementer. Put the page on a public standards host, or admit the contract is private.

---

## 10. A check against the living RFC

The object of this book is a page two implementers can both fetch and both build. The check is a new walk on a living door, then a second number that must not collapse into the first.

Open https://www.rfc-editor.org/. Find RFC 10050. On the front door as fetched for this book, the handle is: *Protocol-Specific Profiles for JSContact*, Proposed Standard, IETF publication, Applications and Real-Time Area, R. Stepanek and M. Loffredo, September 2026. Write that handle on a card. Open https://www.rfc-editor.org/info/rfc10050/ and confirm the live info page still carries that number. If the live page disagrees with this paragraph, the live page wins. This book is not the RFC.

Do not implement JSContact from memory. Fetch the RFC body from the Editor when the fields must travel. Then open https://www.rfc-editor.org/series/rfc-errata/ for that number. Write what the errata door shows. If you skip either fetch, you are not yet building RFC 10050. You are building a remembered shape.

New case, new number. Open the same front door and find RFC 10032. Handle: *The AEGIS Authenticated Encryption Algorithms*, Informational, IRTF publication, F. Denis and F. Lucas, September 2026. Same month as RFC 10050. Different number, different title, different status, different stream. If a note in your program says both documents are Proposed Standards because both appeared in September 2026, the date leaked into the status. Copy status from each door.

Third case, different host. Open https://www.w3.org/. Confirm the front door still says Members, full-time staff, and the public work together to develop web standards. Confirm TPAC 2026 is 26-30 October, Dublin, if that banner is still up. A missing banner means the event page moved. Fetch https://www.w3.org/news-events/tpac/2026/ rather than inventing the dates. Open https://www.iana.org/ and confirm the three jobs: Domain Names, Number Resources, Protocol Assignments. If you need a protocol number, continue to https://www.iana.org/protocols and copy a row. If you need HTML as a page, stop and open the web platform doors. If you need encodings, stop and open Unicode.

Cedar Post and Mill Wharf still help as a local picture. `crate 9 holm` meets `crate 9 holm` only when both programs were built from the same page, the same version, with the same errata, and with registry values the public list actually holds. Swap in `sack 2 mill` as a new line. Kind `sack`, count `2`, dock `mill`. If Jonah's program prints `2` crates at a dock named `sack`, the fields slid. The contract did not fail. The build did.

Works in progress stay on https://datatracker.ietf.org/ until the RFC Editor publishes a number. Independent submissions, IETF, IRTF, and IAB remain the streams the RFC Editor named. A consortium Working Draft remains a Working Draft until the consortium page says otherwise. Two pages that fight are two fetches and one pick. A page a stranger cannot fetch is not open enough to build.

The RFC Editor at https://www.rfc-editor.org/ is the living door for the numbered series. W3C at https://www.w3.org/ is the living door for that consortium's pages. IANA at https://www.iana.org/ is the living door for the public lists of names and numbers. Build from those pages. When a number in this book and a number on the door disagree, the door wins.
