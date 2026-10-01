---
title: "computers — this machine, a file, and a browser"
date: "2026-09-20"
status: draft
start: read
home: "drafts/agy-review/packs/computers/"
---

# This machine, a file, and a browser

You already sit at a box that follows lists. This book names what you are looking at when you sit down: the box itself, a saved pile, a list of piles, a yes-or-no step, a list of steps, a request to another box, a window that shows a page, what remains after that window is gone, a name with a secret, and the message when a step fails.

You do not need a theory of every possible machine. A later book in this library treats that. This is the first computer book: files and browsers, on this machine and on the public network.

EasyLM is public general education. These pages are textbooks plus official doors. The app's license is AGPL-3.0-or-later. A number that must travel comes from a host that owns the fact, or the line says unverified.

---

## 1. This machine

Look at the screen, the pointer, and the keys. Some boxes are a slab you hold. Some sit under a desk with a separate screen. Inside, three jobs run whether you see them or not.

The first job is a worker that follows instructions, one tiny step after another, very fast. While it works it needs a short-term table: a grid of cells it can read and write in a hurry. Power drops, that table empties. The third job is a longer-term shelf. What you saved stays on the shelf after the power is gone, after you close the program, after you come back tomorrow.

People name the worker a **processor** or **CPU**. They name the short-term table **memory** or **RAM**. They name the shelf a **drive**. The whole box, worker and table and shelf and screen together, is the **computer**. The name arrives after the three jobs. The jobs are what you are looking at.

A program that is running lives in the short-term table. That is why unsaved typing vanishes when the power drops or the program is killed. Save writes a copy onto the shelf. Save is the act that crosses from table to shelf.

You are reading this on such a box. The page is using this box's worker and this box's table. If the textbooks were stored on this box, they can be read with the network off. Chat on this page is not a person in another building unless a network tool was turned on.

Clock speeds, core counts, and how many cells of table a given box has are load-bearing numbers. They live on the maker's spec sheet for that box. Unverified here. Do not steal them from memory and do not build a purchase on a remembered size.

**Check.** Type one new sentence in a notes program. Do not save. Close the program the hard way, or restart the box. Open the program again. The sentence is gone. That was the table. Type the sentence again, save, close, open. The sentence is there. That was the shelf. The check uses a new sentence each time you run it, so you cannot fool yourself with an old file.

---

## 2. A file

Write one sentence on paper. Photograph the paper. Record yourself reading it. You now have three piles, each a different kind, each able to sit on the shelf with a name so the box can find it again.

That named pile is a **file**. The name is how humans and programs ask for it. The bits are the pile. Two files can hold the same words and still be two piles, because they sit in two places or under two names.

The last part of the name, after a dot, is a hint about the kind: `.txt` for plain letters, `.md` for text with light marks, `.png` for a picture, `.pdf` for a page image, `.py` for a Python list of instructions. The hint can lie. You can name a picture `notes.txt`. The true kind is in the bits. The hint is how humans and programs guess.

A file has a size: how much shelf it occupies. I did not fetch a standards page that defines the size of a **byte** this sitting. Many machines group eight yes-or-no answers and call that group a byte. Treat eight as a common habit, not as a law measured here. If a size must travel, read it off the file's own properties on this box.

Copying a file writes a second pile. Change the second pile; the first pile does not change. Moving a file changes the label of the same pile. There is still one pile. A "download", a "copy" in a chat, a "duplicate": each is a second pile unless the tool says it moved. This is the whole of a lot of later confusion.

The browser's File API, on MDN, is the door for how a web page is allowed to see a file you pick. I fetched MDN's front door, not that API page, so I will not print a remembered method name as law. Open the File API door from the link index when a page asks to read a file.

**Check.** Create a file `a.txt` whose only line is `alpha`. Copy it to `b.txt`. Change `b.txt` so its only line is `beta`. Open `a.txt`. It still says `alpha`. That is copy. Now move `a.txt` into a new place and open it. One pile, new label. The line is still `alpha`. If `a.txt` said `beta`, you edited the original by mistake.

---

## 3. A folder

A thousand named piles in one heap is a hunt. Sit a named list beside them: this group, that group. A list can hold files and other lists.

That list is a **folder**. Some docs say **directory**. Same object: a named list, not a second kind of shelf. The bits of the files still live as files. The folder is the label that groups the names.

To find a file you walk a trail of folder names, then the file name. That trail is a **path**. On many boxes the names are separated by `/`. On some Windows tools you will also see `\`. Same idea: a sequence of names from a starting place down to the pile.

Two files may share a short name if they sit in different folders. `practice/note.txt` and `other/note.txt` are two piles. The short name `note.txt` is not enough. The path is.

A folder can be empty. Empty is a list with no names yet. Deleting a folder is a different act from deleting a file: you are removing a list, and some tools refuse if the list still has names. Deleting a file does not delete the folder it sat in.

Some folders are special only because a program agreed to look there: Downloads, Desktop, a project folder you made. The box does not love those names. The program does.

**Check.** Make a folder `practice`. Inside it save `note.txt` with the line `outer`. Inside `practice` make a folder `inner`. Save `practice/inner/note.txt` with the line `inner line`. Open both. Two files, same short name, two lines. Count the folders you can see from `practice`: one file and one folder, or two files if you asked the box to show everything inside. The path is what told the two `note.txt` piles apart. If both lines say `outer`, you saved twice in the same place.

If your box hid the folders, ask it to show them. A file you cannot find is often a file whose path you are not looking at.

---

## 4. Yes and no

Every mark the box keeps is built from answers that have only two sides: on or off, yes or no, 1 or 0.

One such answer is a **bit**. A file is a long row of bits with a name. A picture, a song, a letter, a program: each is bits. The program that opens the file decides how to read the row. Open a picture as if it were text and you will see junk. The bits did not change. The reading did.

Letters, digits, and marks from many writing systems need a shared numbering so two machines write the same mark. The Unicode Standard is that encoding. The Unicode Consortium publishes it. At the door fetched for this chapter, a version is defined by an edition of the core specification together with the Code Charts, the Unicode Standard Annexes, and the Unicode Character Database. The documentation for the latest version is always at `https://www.unicode.org/versions/latest/`. I did not fetch a count of characters this sitting. Do not treat a remembered total as a fact.

How those numbers sit as groups of bits on the shelf is a separate agreement. UTF-8 is one common way. I did not fetch the UTF-8 FAQ body this sitting, so the exact byte patterns are unverified here. The claim you can use now: the same letter can be one mark in Unicode and a short or long group of bits on the shelf, depending on the encoding.

Python 3 writes the two sides as `True` and `False` in its docs. The Python 3 documentation fetched for this book is for Python 3.14.7. Open that door before you trust a remembered spelling. A later chapter will treat a whole list of steps. Here the object is one yes-or-no.

**Check.** Save a file whose only text is `cafe`. Save a second file whose only text is `café`. They are not the same pile. The mark on the e is a real extra character, not decoration. Open both. If your box shows the same letters, look closer at the second file; if it turned `é` into junk, the reading used the wrong encoding. Two files, two rows of bits.

---

## 5. A program as a list

A recipe is a list a cook can follow. Some files are lists the worker can follow. Open the list, the worker starts at the top, does each step, sometimes jumps, sometimes stops.

That file of instructions is a **program**. The worker does not guess. It follows the list it was given. A wrong step is followed as faithfully as a right one.

Menus and buttons are names for steps. If a button does not say what it does in ordinary words, it is a bad button. When a program asks to use the microphone, the camera, or the network, it is asking to step outside the page. You can say no. The page should still teach.

One language with an official door is Python 3. The documentation fetched for this book is Python 3.14.7 at `https://docs.python.org/3/`. That front door points at a tutorial as the start for syntax, then at built-ins, the library, and the language reference. Believe those pages for spelling. A remembered command is not a source.

Here is a list in ordinary words:

1. Put 2 in a box named `a`.
2. Put 3 in a box named `b`.
3. Add them.
4. Show the sum.

In Python 3 that list is often written:

```
a = 2
b = 3
print(a + b)
```

If that spelling fails on your box, the tutorial owns the truth, not this paragraph. The object is the list, not the punctuation.

A program that never leaves a step is a list with a loop that does not exit. You stop it from outside: close the program, or kill the worker's task. The list itself will not get bored.

**Check.** Run the list so it shows a sum. Then change the 2 to 4 and the 3 to 5. Run it again. The new sum must be 9. If it is still 5, you ran the old list: the worker is following the file on the shelf, and you did not save, or you opened a different file. The check is the new pair, 4 and 5, not the pair in the lesson.

---

## 6. This machine and the network

Some piles live only on this box. Some live on another box that answers when this box asks, over a wire or a radio.

That asking is the **network**. The public network of networks is the **internet**. This box is one speaker. The other box is a **host**. The ask is: who to speak to, and which pile to ask for. The answer is bits that this box then keeps in its table, and sometimes writes to its shelf.

A page can be files already on this box, opened as a page. It can be files fetched once, then kept in the browser's own shelf. It can be files fetched every time you open the address. Textbooks that ship with an app are the first kind. A link in a link index is the third kind. That elsewhere is a door, not this library.

The numbered papers that describe those ask-and-answer rules are **RFCs**. The RFC Editor is the official home of RFCs. At the door fetched for this chapter, RFCs are published by the RFC Editor for the IETF, the IRTF, the IAB, and the independent submission stream. They outline computer networking and Internet foundations, including Internet Standards. I did not fetch a particular RFC body this sitting. HTTP semantics, the rules for asking a web host for a page, live at RFC 9110 on that host. TLS, the lock on the channel, lives at RFC 8446. Open those doors for codes, versions, and exact words.

The lock in an address that starts `https` means the bits between you and that host are harder to read in transit. It does not mean the host is honest. Honesty is about who owns the fact. NIST owns a constant. A homework mill does not.

**Check.** Turn the network off. Open a stack chapter that already lives on this box. It still reads. Open `https://physics.nist.gov/cuu/Constants/`. It does not. That is the line between this machine and the network. Turn the network on and open the NIST page again. If it loads, the ask reached a host that answered. If it still fails, write down what the box said; that failure is the next chapter's object, not proof that NIST is gone.

---

## 7. A browser

You need a program whose job is: take an address, ask the host, show what comes back, and let you click the next address.

That program is a **browser**. You are in one now if you are reading this as a page. The browser is a file of instructions, running. It reads addresses, fetches files, draws them on the screen, and keeps a short history of where you have been in this window.

An address, a **URL**, is a path to a door: how to ask, who to ask, and which file to ask for. `https://physics.nist.gov/cuu/Constants/` means: use a locked channel, ask the host named `physics.nist.gov`, fetch the constants directory. The WHATWG URL Standard is the door for the exact grammar of addresses. I did not fetch that spec body this sitting. Read the address bar as those three pieces and you already have the object.

What comes back is often a page written in HTML, dressed by CSS, with extra lists in JavaScript the page may run. MDN Web Docs, fetched for this book, documents CSS, HTML, and JavaScript, and has done so since 2005. The WHATWG HTML Standard is the living page language. W3C also publishes web standards. If two official pages disagree, say so. Do not average them. I fetched MDN's front door, not the HTML spec body, this sitting.

A click on a link is a new address. The browser asks again. What you see is what this host sent, drawn by this browser, on this machine. Another browser may draw the same page a little differently. The bits on the host did not have to change.

**Check.** Read the address bar on this page. Write down the host, the part between `://` and the next `/`. Change one letter of that host in your head. That would be a different door. Do not go there. The check is the writing-down, and the fact that one letter is enough. If the bar shows `file:` or no host, you are reading a pile on this box, not a host on the network.

---

## 8. What stays when you close the tab

Close the window. Some things vanish. Some things were written to the shelf on purpose.

Typed-but-unsaved words in the page usually go with the tab. They lived in the short-term table. A file you **downloaded** was written to this machine's shelf, often into a folder named Downloads. Close the tab. The file is still there. That pile is yours now, a second copy of what the host sent, unless the tool moved it.

The browser also has its own small shelves. A host may ask to leave a small note so the next visit is recognized. That note is often called a cookie. The page can also keep a pile in the browser's own shelf for that host. Close the tab, those notes can still be there. Clear site data, they go. I did not fetch MDN's cookie or storage pages this sitting, so sizes, lifetimes, and the exact API names are unverified here. MDN is the door.

The browser may keep a copy of a page so the next open is faster. That copy can go stale. Reload asks the host again. "I closed the tab" and "I deleted the file" are different sentences. One may still leave notes. The other removes a pile from the shelf.

A page can be installed or cached so it works with the network off. That is still this machine's shelf, under the browser's name. It is not the host. When the host changes the real file, this copy can lag until something fetches again.

**Check.** Make a tiny text file on a host you control, or use a file this app already has, and download it under a new name, `stay.txt`, whose only line is `still here`. Close the tab. Open your Downloads folder. Open `stay.txt`. The line is still `still here`. That is the machine's shelf, not the tab. Then clear that site's data in the browser if you want the notes gone, and see that `stay.txt` on the shelf does not vanish with them. Two shelves, two outcomes.

---

## 9. A name and a secret

A door may ask who you are. What it stores is a public name and a private proof.

Together they are an **account**. The public part is a **username** or an email address. The private part is often a **password**. Sometimes it is a file of keys on this box. If the program can act as you, the secret is a key to your name.

A name without a secret is not an account. A secret typed into a page is a secret that page can see. A secret pasted into a chat is a secret the chat can see. Do not paste keys into a chat. Do not put them in a textbook. Do not put them in a shared project. A file named `password.txt` on a shared shelf is a secret you gave away.

The lock on `https` still does not make the host honest. It makes the trip harder to read. Who you are sending the secret to is the host in the address bar. Read that host before you type.

This app's official shape does not need an account for study. A study record that stays on this device is a choice about where the bits live. Other doors will ask. You can refuse. Some pages will then not work. That is the trade.

Computer security as a field has a public landing at NIST's Computer Security Resource Center. Open that door for checklists and publications. I fetched none of its inner pages this sitting. Unverified here: password length rules, rotation periods, and any number someone quotes from memory.

**Check.** Write, on paper, a fake name `practice-user` and a fake secret `orange-12`. Do not use a real secret. Ask: who would see this if I typed it into a chat. Who would see it if I saved it as `secret.txt` in a folder I share. Who would see it if I typed it only into the host named in the address bar. Three places, three answers. The object is the pair, name plus secret, and where the secret went.

---

## 10. When something breaks

A step fails. The useful move is to read the failure as a fact, not as weather.

Write three things: what you asked for, where you asked, and what the box said. Change one of those three, try again. That is debugging at this level. You do not yet need a theory of every fault.

Common cases, in ordinary words:

The file is not at that path. You are in the wrong folder, or the name is spelled differently, or the pile was never saved.

The host did not answer. The network is off, the name of the host is wrong, or that box is down.

The host answered, and the page is gone or refused. You asked for a pile it does not have, or you are not allowed, or the host has a problem of its own.

The list of steps had a bad step. The worker followed it. The message names a line if you are lucky. Read the line. The Python 3 docs, Python 3.14.7 at the fetch for this book, are the door for how that language reports a bad step. MDN is the door for how a browser reports a failed page load. RFC 9110 is the door for how a web host reports the outcome of an ask. I did not fetch the code table in RFC 9110 this sitting, so I will not print a remembered code as law.

A failure you cannot read is still a fact: copy the words, copy the address, copy the path. Search those words at the official door for the tool you were in, not at a random explainer.

**Check.** Ask this box to open a file you did not create, named `missing-17.txt`, in a folder you can see. Write down the three facts: name `missing-17.txt`, the folder you were in, the words the box used. Then create `missing-17.txt` with one line, `now it exists`, and ask again. The second try must differ in the third fact. If it does not, you asked a different path the second time. The new number in the name is so you cannot mix this check with an old file.

A later book treats machines that can follow any finite unambiguous list, and the limits of that idea. This book stops at the object in front of you: this machine, a file, a folder, a yes-or-no, a list of steps, a network ask, a browser, what stays, a name with a secret, and a failure you can write down.
