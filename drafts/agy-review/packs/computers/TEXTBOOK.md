---
title: "computers — this machine and a file"
date: "2026-09-16"
status: draft · agy review · start: read
home: "drafts/agy-review/packs/computers/"
---

# This machine, a file, and a network

A computer is a box that follows a list of tiny yes-or-no steps very fast. You do not need the list yet. You need to know what you are looking at when you sit down, what is saved, and what left the box.

---

## 1. The box in front of you

Screen, pointer, keys. Inside: a worker that follows instructions, a short-term table it thinks in, and a longer-term shelf that keeps things when the power is gone.

While a program is running, it lives in the short-term table. If the power drops, that table empties. The shelf, the **drive**, still holds what you saved.

EasyLM in the browser is using this box's worker and this box's shelf. Chat on this page is not a person in another building, unless you turned on a network tool.

---

## 2. A named pile of bits

A letter, a picture, a song, a program: each can be a named pile of bits the box knows how to find again. That named pile is a **file**.

The last part of the name, after the dot, is a hint about the kind: `.txt` for plain letters, `.md` for text with light marks, `.png` for a picture, `.pdf` for a page image. The hint can lie. The true kind is in the bits. The hint is how humans and programs guess.

A named list of files and other lists sits beside them so a thousand names do not sit in one pile. That list is a **folder**. It does not hold the bits in a special way. It is a label.

**Check.** Create a folder called `practice`. Save a one-line text file into it. Close everything. Open the folder. The line is still there. That is the shelf, not the short-term table.

---

## 3. Copy is not move

Copying a file writes a second pile. Changing the second pile does not change the first.

Moving a file changes the label of the same pile. There is still one pile.

This is the whole of a lot of later confusion. A "copy" in a chat, a "download", a "clone" of a project: each is a second pile unless the tool says it moved.

---

## 4. The program you are in

Some files are instructions the worker can follow. The browser is one of those files, running. EasyLM is a page the browser is following. A word processor is another. They all read files, change the short-term table, and sometimes write the shelf. A file of instructions is a **program**.

Menus and buttons are names for instructions. If a button does not say what it does in ordinary words, it is a bad button. This app's own law: buttons use human nouns, and a page wraps instead of scrolling sideways.

When a program asks to use the microphone, the camera, or the network, it is asking to step outside the page. You can say no. The page should still teach.

---

## 5. Here versus elsewhere

Some bits live only on this box. Some live on another box that answers when this box asks, over a wire or a radio. That asking is the **network**. The public network of networks is the **internet**.

A page can be:

- files already on this box, opened as a page
- files fetched once, then kept in the browser's own shelf
- files fetched every time you open the address

EasyLM's textbooks ship with the app. Model weights, if you load a local model, download once into the browser's shelf and stay. A link in a link index goes elsewhere. That elsewhere is a door, not this library.

**Check.** Turn the network off. Open a stack chapter. It still reads. Open a NIST constants page. It does not. That is the line.

---

## 6. An address

A web address, a URL, is a path to a door: who to ask, and which file to ask for.

`https://physics.nist.gov/cuu/Constants/` means: use a locked channel, ask the host named `physics.nist.gov`, fetch the constants directory.

The lock, `https`, means the bits between you and that host are harder to read in transit. It does not mean the host is honest. Honesty is about who owns the fact. NIST owns a constant. A homework mill does not.

---

## 7. An account is a name plus a secret

Some doors ask who you are. They store a name and a secret. The secret is often a password. Sometimes it is a file of keys on this box.

If the program can act as you, the secret is a key to your name. Do not paste keys into a chat. Do not put them in a textbook. Do not commit them to a shared project. This house's law on tokens is the same idea: env or a local connector directory, never the page another person will clone.

EasyLM's official app does not want an account. Study record stays on this device. That is a choice about where the bits live.

---

## 8. Run, save, snapshot

If a later chapter says "run this," the worker follows that file of instructions. If it says "commit," take a snapshot of named files on the shelf so you can return. Software's git chapter will show the snapshot as a tree of hashes. The pile is still a named file, copied on purpose.

The computing pack starts next: a machine that can follow any finite unambiguous list.
