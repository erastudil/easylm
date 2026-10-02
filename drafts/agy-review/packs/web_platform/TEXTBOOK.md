---
title: "web_platform — a page, markup, a request"
date: "2026-09-20"
status: draft
start: read
needs: computers
home: "drafts/agy-review/packs/web_platform/"
---

# A page, markup, and a request

You already have files, folders, and a browser. The computers book named this machine, a file, a folder, a yes-or-no, a list of steps, and the line between this box and a host. This book is the next object: a page made of marks, a request that fetches it, and the bits a browser keeps after the page is drawn.

This book is public general education. A number that must travel comes from a host that owns the fact, or the line says unverified.

This pack owns the walk through markup, style, a script in the page, an address, a request, a form, who can use the page, and what the browser keeps. The computers book owns this-machine versus the network: name that door and stop. A language that runs off the page as its own list of files lives in the python book: name that door and stop. How letters become numbers on the shelf lives in Unicode: name that door and stop.

MDN Web Docs documents CSS, HTML, and JavaScript, and has done so since 2005. The WHATWG HTML Standard is a Living Standard; the introduction page used for dates in this book was last updated 17 September 2026. W3C is the consortium where members, staff, and the public write web standards; its 2026 meeting TPAC is 26-30 October in Dublin, Ireland. HTTP semantics live in RFC 9110, published June 2022 as STD 97. Those four hosts own the load-bearing numbers below.

---

## 1. A page

Open a folder you can see and save a file named `kettle.html`. Put one sentence in it, with no extra marks yet:

The desk on Maple loans one kettle.

Open that file in the browser. You should see those words. The bar at the top may show `file:` and a path on this box. That is still a page: words drawn in the window, from a pile the browser can read. The computers book owns the line between this machine and a host. If the bar later shows `https:` and a host name, the same window is drawing a pile that arrived from elsewhere.

A page is that drawn thing. Not the folder. Not the program that drew it. The window of words, pictures, and controls that came from a file of marks.

The file can live on this box. It can live on another box that answers when this box asks. Either way, the browser's job is the same: read the marks, draw the page, and wait for the next click.

A page can be almost empty. One sentence is a page. A page can hold a heading, a picture, a box to type in, and a list of steps that run after the drawing. Later chapters add those pieces. Here the object is the drawn window itself.

The true kind of the file is in the bits. Naming it `.html` is a hint. Open a picture as if it were a page and you will see junk or a broken picture, not a kettle desk. The bits did not change. The reading did.

**Check.** Put exactly 11 words in `kettle.html`:

The desk on Maple loans one steel kettle today.

Open it. Count the words on the screen. Eleven. Change the file so the sentence has 13 words, by adding `before noon` at the end. Save. Reload. If you still see 11, you opened an old copy, or you did not save. The check is the new count, 13, not the 11 in the first save.

---

## 2. Markup

Take the 13-word kettle sentence and wrap jobs in marks the browser already knows. The words stay. The marks say what job each chunk has: a title for the tab, a heading for the desk, a paragraph for the loan.

A first file of marks:

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Kettle desk</title>
</head>
<body>
  <h1>Kettle desk</h1>
  <p>The desk on Maple loans one steel kettle today before noon.</p>
</body>
</html>
```

The angle-bracket marks are **markup**. The living language for a web page is **HTML**. The WHATWG HTML Standard is that language. Its own introduction says, in short, that this is HTML5, and that HTML is the World Wide Web's core markup language. It was first aimed at scientific documents. The same design now describes many other kinds of page, including a kettle desk.

History, from that introduction, not from memory: HTML's first five years were 1990-1995. HTML 3.2 was completed in 1997. HTML4 followed later that same year. XHTML 1.0 was completed in 2000. In 2019 the WHATWG and W3C signed an agreement to collaborate on a single version of HTML going forward: the living document at the HTML door.

`<!DOCTYPE html>` tells the browser to read the file as current HTML. A document sent with the `text/html` type is processed as HTML. A document sent as `application/xhtml+xml` is processed as XML, and even small syntax errors can stop the drawing. Those two types are named in the HTML Standard's introduction.

`charset="utf-8"` names how the file's bytes map to letters. Unicode owns that map. Name the Unicode door and stop. Do not treat a remembered character total as a fact here.

`<h1>` is a top heading. `<p>` is a paragraph. `<title>` is the tab name. The names arrive after you already saw the jobs: biggest heading, block of words, name in the tab.

Inside the browser those marks become a tree in memory. The HTML Standard calls that in-memory representation DOM HTML, or the **DOM** for short. Change a mark in the file, save, reload, and the tree is built again. The page is not a photograph of the file. It is a reading of the file.

**Check.** Keep the 13-word paragraph. Add a second paragraph with 8 words: `Return the kettle to Maple by dusk.` Reload. You should see two blocks, not one run-on line. If the 8 words sit inside the first paragraph, you forgot to close `</p>` or you nested the second `<p>` in the wrong place. View source. The marks and the drawing must both show two paragraphs. Eight is the new count. Do not reuse 13 as proof that the second block exists.

---

## 3. Style

The heading and the paragraph still look like the same kind of text until you add a second pile of marks. Markup said what the chunks are. The second pile says how they should look: color, size, space, which way the blocks sit.

Add this inside `<head>`:

```
<style>
  h1 { color: teal; }
  p { color: black; }
</style>
```

Reload. The heading should be teal. The paragraph should stay ordinary black. The words did not change. The look did.

Those look-marks are **CSS**, Cascading Style Sheets. MDN documents CSS. W3C publishes CSS among its web standards. This pack owns the walk: a rule names which bits, which look, and which setting. `h1` is which bits. `color` is which look. `teal` is the setting.

A rule can live in the page, as above. A rule can live in its own file, linked from the page. Same object: a list of looks. Two files, one drawing.

Two rules can name the same heading. Put this second:

```
h1 { color: green; }
```

Reload. The heading is green if the later rule wins on this page. Swap the two `h1` rules. Reload. If the color does not follow the swap, you edited a different file, or the browser is holding an old copy. The exact order of winning, when many files and many kinds of rule pile up, is unverified here. MDN is the door for that order.

Style does not replace markup. A teal heading is still a heading. A person who cannot see teal still has the heading job in the marks. Chapter 8 takes that case. Here the object is the look pile.

You can style one paragraph and leave the other alone. Give the dusk paragraph a class, then name that class in a rule. The HTML Standard's introduction lists `class` as a way authors extend elements while still using a real HTML element. The class is a label you invented. The heading and paragraph names are not.

**Check.** Make the heading teal, then green, as above. Write down the color you see after the swap. Then set only the dusk paragraph to a background of gold, by a class you name `due`, and leave the 13-word paragraph untouched. If both paragraphs turn gold, the rule hit `p` instead of `.due`. The new case is one gold block, not two.

---

## 4. A script in the page

The page is already on the screen. A list of steps sitting in that page can still change a word after the drawing.

Add a named box and a list:

```
<p id="free">unfilled</p>
<script>
document.getElementById("free").textContent = "7 chairs free";
</script>
```

Reload. The box should show `7 chairs free`, not `unfilled`. The file on the shelf still has both strings. The list ran, found the box named `free`, and put new words in it.

That list is a **script** in the page. The usual language for that list is **JavaScript**. MDN documents it. The HTML Standard treats script as part of authoring a page, from a static document to a small application. The spelling of `getElementById` and `textContent` is owned by MDN and the HTML Standard. If this spelling fails in your browser, those doors own the truth, not a remembered command.

A script in the page is not a program that lives as its own file of steps outside the page. That other object is a language off the page. The python book owns that walk. Name that door and stop. Do not paste a Python list into `<script>` and expect the browser to run it.

The HTML Standard's design notes say the HTML and DOM APIs are built so that no script can ever detect the simultaneous execution of other scripts. Lists in the page take turns. The spec names `SharedArrayBuffer` as an exception. This book does not walk that exception. The claim you can use now: ordinary page scripts are written as if one list runs, then another.

A script can read a click and then change a word. A script can fail. The failure is a fact: copy the words the browser used. MDN is the door for how a browser reports a failed script. Do not invent a code from memory.

**Check.** Change the list so it writes `4 chairs free`. Reload. The box must show 4, not 7. If it still shows 7, the old list ran: you did not save, or another script on the page wrote after yours. Then change the `id` on the paragraph to `seats` and leave the script looking for `free`. Reload. The box should stay `unfilled` or show the file's original words, because the list looked for a name that is not there. Four is the new number. The missing name is the new case.

---

## 5. An address

Read the bar at the top of the browser. It holds a path to a door: how to ask, who to ask, which pile, and sometimes a jump inside the page.

A worked address:

`https://desk.example.org/loan/kettle`

`https` is how to ask: a locked channel. RFC 9110 defines the `https` URI scheme. If the port is omitted, TCP port 443 is the default. The `http` scheme uses TCP port 80 as the default. Those two port numbers are from RFC 9110, not from habit.

`desk.example.org` is who to ask: the host. `/loan/kettle` is which pile on that host.

RFC 9110 defines the **origin** of a URI as the triple of scheme, host, and port, after lowercasing scheme and host and dropping leading zeros on the port. If the port is omitted, the default for the scheme is used. The RFC's own example: `https://Example.Com/happy.js` has origin `{ "https", "example.com", "443" }`. Path does not enter the origin. `/loan/kettle` and `/loan/saw` on the same host and port share an origin. `https://desk.example.org` and `http://desk.example.org` do not, because the scheme differs. `https://desk.example.org` and `https://desk.example.org:8443` do not, because the port differs.

Two origins are distinct if they differ in scheme, host, or port. Even when the same person controls both, the namespaces stay distinct unless a server authoritative for that origin aliases them.

A query can sit after `?`. `https://desk.example.org/loan/kettle?hours=3` still has the same origin. The query is part of the ask. A fragment can sit after `#`. `https://desk.example.org/loan/kettle#desk` jumps inside the page. RFC 9110 notes that the fragment identifier is not part of the `http` and `https` scheme definitions, so it is not sent as part of that URI scheme. The host does not receive `#desk`.

RFC 9110 recommends that senders and recipients support URIs of at least 8000 octets in protocol elements. Treat 8000 as that recommendation, not as a hard ceiling your browser printed.

Do not put a name and a password in the address. RFC 9110 deprecates `user:password` in the userinfo part of `http` and `https` URIs, and says a sender must not generate that userinfo when the URI is a target or a field value in a message. A secret in the bar is a secret on the screen, in the history, and in the next log.

The WHATWG URL Standard is the door for the exact grammar of addresses. Name it from the link index. This chapter used RFC 9110's HTTP-related URI rules.

**Check.** Write four pieces for `https://desk.example.org/loan/kettle?hours=3#desk`: scheme `https`, host `desk.example.org`, path `/loan/kettle`, query `hours=3`. Then write the origin as scheme, host, and port: `https`, `desk.example.org`, `443`. New case: change only the port to 8443. That is a different origin. The path can stay `/loan/kettle`. If you wrote the same origin for both, you let the path or the query stand in for the port.

---

## 6. A request

Click a link, or type an address, and the browser sends a short ask. A host answers with a short report and, often, a page.

RFC 9110 is HTTP Semantics, June 2022, STD 97. HTTP is a stateless application-level protocol: each request message's semantics can be understood in isolation. The browser is one kind of **user agent**. The program that can originate an authoritative answer for a resource is the **origin server**. The ask is a **request**. The report is a **response**. The thing named by the address is a **resource**. What travels is a **representation** of that resource, not the kettle itself.

The request names a **method**. RFC 9110's table of standardized methods:

- GET: transfer a current representation of the target resource
- HEAD: same as GET, but do not transfer the response content
- POST: perform resource-specific processing on the request content
- PUT: replace all current representations of the target resource with the request content
- DELETE: remove all current representations of the target resource
- CONNECT: establish a tunnel to the server identified by the target resource
- OPTIONS: describe the communication options for the target resource
- TRACE: perform a message loop-back test along the path to the target resource

All general-purpose servers must support GET and HEAD. The other methods are optional.

GET, HEAD, OPTIONS, and TRACE are **safe**: the client does not request a state change on the origin server. PUT, DELETE, and the safe methods are **idempotent**: several identical requests are meant to have the same effect as one. POST is neither safe nor idempotent in that table. A wait-list join belongs on POST, not on GET. RFC 9110 warns that a URI such as `page?do=delete` will be walked by spiders and pre-fetchers if the unsafe action is allowed on a safe method.

The response names a **status code**: a three-digit integer from 100 to 599 inclusive. The first digit is the class:

- 1xx: informational, request received, continuing
- 2xx: successful
- 3xx: further action needed
- 4xx: the request has bad syntax or cannot be fulfilled
- 5xx: the server failed to fulfill an apparently valid request

A client must understand the class. An unrecognized 471 is treated like 400. Values outside 100-599 are invalid; a client that receives one should treat the response as a 5xx.

RFC 9110's own GET example, on `http://www.example.com/hello.txt`:

```
GET /hello.txt HTTP/1.1
User-Agent: curl/7.64.1
Host: www.example.com
Accept-Language: en, mi
```

The response begins:

```
HTTP/1.1 200 OK
```

and includes `Content-Length: 51` with a body that starts `Hello World!`. **200 (OK)** means the request succeeded. **201 (Created)** means one or more new resources were created. **404 (Not Found)** means the origin server did not find a current representation, or is not willing to disclose that one exists. **403 (Forbidden)** means the server understood the request but refuses to fulfill it. **401 (Unauthorized)** means valid authentication credentials are missing. **400 (Bad Request)** means the server sees a client error. **405 (Method Not Allowed)** means the method is known but not supported for that resource. **501 (Not Implemented)** means the method is unrecognized or not implemented.

**Check.** Read RFC 9110's GET example and write three facts: method GET, status 200, content length 51. New case: you ask for `/loan/kettle-missing-17` on a host you control, or you read the 404 definition next to 200. 200 is success. 404 is no current representation, or a refusal to disclose one. If both of your notes say 200, you asked for a pile that exists. Change the path until the class is 4xx, or keep the 404 definition in writing beside the 200 example. Seventeen in the path is so you do not mix this ask with an old missing file.

---

## 7. A form

A desk can ask how many hours you want the kettle. The page shows a labeled box and a button. You type `3`. You press the button. The browser builds a request from those answers.

That cluster of labeled boxes and a send act is a **form**. Markup names the boxes. The request carries the answers.

A small form:

```
<form method="post" action="/wait">
  <label for="hours">Hours wanted</label>
  <input id="hours" name="hours" value="3">
  <button type="submit">Join wait-list</button>
</form>
```

`method="post"` makes the ask a POST. The answers ride in the request content. `method="get"` would put them in the address, as a query. RFC 9110 says that building a GET URI from user-provided form fields can put data in the URI that should not be disclosed there, and that POST can carry that information in the request content instead. A wait-list join changes the host's list. Use POST.

If the join succeeded and a new resource was created, RFC 9110 says the origin server should send **201 (Created)** with a Location identifier for the primary resource created. Do not treat a remembered 200 as the only success.

Fourteen people already sit on Saturday's wait-list. Your POST of `hours=3` is a fifteenth slot only if the host accepts it. The page cannot promise the count. The host's next GET of the list is the representation.

A GET of `/wait?hours=3` uses a safe method. If that GET appends a name to the wait-list, a spider that walks every link may join the list. That is the unsafe-on-GET failure RFC 9110 names. The form's method is part of the object's job, not decoration.

`label for="hours"` ties the words "Hours wanted" to the box whose `id` is `hours`. Chapter 8 needs that tie. Here it already helps a person click the words and land in the box.

RFC 9110 mentions `multipart/form-data` as a type often used for carrying form data, and points at RFC 7578. The exact boundary grammar is unverified here. Open that RFC when a form sends a file. This chapter's object is the labeled send, as GET or POST.

**Check.** Keep `hours` at 3. Write the request you expect: method POST, path `/wait`, field `hours=3`. Then change the box to `5` and write the new field `hours=5`. Do not send the form to a host you do not control. The new number is 5. If both of your notes still say 3, you copied the markup and did not change the value. New case: rewrite the same form with `method="get"` and say, in one sentence, where `hours=5` would now sit (the address). That sentence is the check. A GET join is the failure mode, not the homework.

---

## 8. Who can use it

A person who cannot see the kettle picture still needs the fact the picture carried. A person who cannot use a pointer still needs a path through the boxes. A person who reads the heading list still needs those headings to name real sections.

Markup already has jobs for this. A picture takes words that name the fact:

```
<img src="kettle.png" alt="steel kettle on the Maple desk">
```

If `kettle.png` fails to load, the words remain. If a reader cannot see the picture, the words remain. Empty `alt` on a picture that carries a fact is a missing sentence.

A form box takes a label, as in chapter 7. A heading takes heading marks, not teal text in a paragraph. A button takes a name that says the act: `Join wait-list`, not `Submit` if the act is a join.

W3C develops web standards, including the rules for a page people can use. The W3C accessibility door in the link index owns the written tests. Contrast ratios, timing limits, and numbered success criteria are unverified here. Do not steal a remembered ratio. Open that door when a number must travel.

Who can use the page is not a coat of paint at the end. It is whether the jobs in the markup are true. A teal heading that is secretly a paragraph has a look and no heading job. A picture with no words has a look and no sentence. A box with no label has a hole.

The HTML Standard's scope, from its introduction, is a semantic-level markup language and associated APIs for authoring accessible pages, from static documents to dynamic applications. Accessible is in the scope sentence. It is not an extra product.

A script that writes `4 chairs free` must leave those words in the page as text, not only as a drawing on a canvas the reader cannot reach. If the only place the count exists is a picture of the number 4, the person who needs words does not have 4.

**Check.** Add the kettle picture with the `alt` sentence above. Turn the picture off, or open the file before `kettle.png` exists. You should still have the words `steel kettle on the Maple desk`. Then remove `alt` and reload. The fact is gone from the text. Put `alt` back. New case: the hours box from chapter 7, with the label removed. Click the words "Hours wanted" if they remain as a bare sentence. They should not move the cursor into the box. Restore `for="hours"` and `id="hours"`. The new case is the broken label, not the picture.

---

## 9. What the browser keeps

Close the tab and name what vanished and what did not.

Typed-but-unsent words in a form usually go with the tab. They lived in the short-term table on this machine. The computers book owns that table-versus-shelf line. Name it and stop.

A file you downloaded was written to this machine's shelf. Close the tab. The file is still there. That pile is yours, a second copy of what a host sent, unless the tool moved it.

The browser also keeps small notes for a host so the next request can be recognized. People name one such note a **cookie**. The page can also keep a pile in the browser's own shelf for that origin. Close the tab, those notes can still be there. Clear site data, they go. Sizes, lifetimes, and the exact storage names are unverified here. MDN is the door. RFC 9110 points at the Cookie protocol as an extension that can let information set by one service affect communication with other services in a matching group of host domains, and says such extensions ought to be designed with care.

The browser may keep a copy of a page so the next open is faster. That copy can go stale. Reload asks the host again. "I closed the tab" and "I deleted the file" are different sentences.

HTTP is stateless at the request. The notes are how a later request still seems to know you. The next GET does not remember the last GET by magic. It sends what the browser kept, or it does not.

A cache can answer without walking all the way to the origin. RFC 9110 defines a cache as a local store of previous response messages and the subsystem that controls storage, retrieval, and deletion. Caching rules in full live in the companion document RFC 9111, which this book does not fetch. Unverified here: how many seconds a given page may be reused. The object's claim: a fast second load may be a kept copy, not a new answer.

Notes are scoped by origin. Chapter 5's triple is the fence. A note from `https://desk.example.org` is not, by default, a note for `http://desk.example.org` or for port 8443. Do not treat two similar host names as one shelf.

**Check.** Save a tiny text file as `stay-kettle.txt` whose only line is `still 3`. Download it or copy it into Downloads under that name. Close the tab. Open Downloads. Open `stay-kettle.txt`. The line is still `still 3`. That is this machine's shelf. New case: type `hours=5` in the form and do not send it. Close the tab. Open the page again. The 5 is usually gone. Two shelves, two outcomes. If the 5 is still there, the browser restored the form from its own notes; write that down as a third shelf, and clear site data if you want those notes gone. Three is the download's number. Five is the unsaved form's number. Do not mix them.

---

## 10. A check

Build one new page that uses a new number in the heading, the script, and the form. Do not reuse 13, 7, 4, or 3 as the proof that the walk closed.

Save `maple-desk.html` with:

- a title and an `h1` that both say `Maple desk 21`
- a paragraph of 9 words: `The Sunday kettle slot holds twenty one names.`
- a style rule that makes `h1` teal
- a picture with `alt` naming a steel kettle
- a paragraph `id="free"` whose script writes `21 names on Sunday`
- a POST form to `/wait` whose hours box starts at `8`
- a label that matches that box

Open the file. You should see 21 in the heading, teal on that heading, 9 words in the first paragraph, 21 names in the script box, and 8 in the hours box. View source. The marks must show `alt`, the label `for`, `method="post"`, and the script. If the screen shows 21 but the source still says 7, you opened the old kettle file.

Then, on paper, write the address you would use on a host: `https://desk.example.org/loan/maple-desk`. Write the origin: `https`, `desk.example.org`, `443`. Write the request for a missing twin: GET `/loan/maple-desk-missing-21`, expected class 4xx if the host has no such resource. Write 200 beside it as the class for a successful GET of a page that exists.

If the heading is not teal, the style rule missed `h1`. If the script box still says `unfilled`, the `id` and the script disagree. If the form would put `8` in the address bar, the method is GET. If the picture dies and no words remain, `alt` is missing. Each failure names one chapter.

The object of this book is still three things: a page, markup, a request. Style, script, form, address, who can use it, and what stays are how those three things work in a browser. The computers book remains the door for this machine versus the network. The python book remains the door for a language off the page. Unicode remains the door for encodings. MDN, the HTML Standard, W3C, and RFC 9110 remain the doors for the numbers that must travel.
