---
title: "operating_systems — a program that is running"
date: "2026-09-21"
status: draft
start: algebra
needs: computers
home: "drafts/agy-review/packs/operating_systems/"
---

# A program that is running

A plate file can sit in a folder all night and do nothing. At 06:40 Ivo at Holm Press on Quay Lane starts the cutter job from that file. The folder still holds the file. Something else is now on the bench: the job, using cubbies, holding keys, taking turns, able to wreck only itself or, if the clerk fails, the whole box. That something is the object of this book.

The computers book already named this machine, a file on the shelf, a folder, and a list of steps. Name that door and stop. This pack owns the walk through a running job, the cubbies it holds, and who is allowed to touch it. A language you write as its own list of files lives in the python book. Name that door and stop.

The kernel manual, the POSIX door, the FreeBSD Handbook, and the school catalog are in `LINK_INDEX.md`. A number that did not appear on the page you opened is unverified, or it is a worked case invented for Holm Press so you can finish the arithmetic by hand. The POSIX door answered with a frames warning on this sitting, so a POSIX constant stays unverified until the non-frame index is open. The school homepage did not name an operating-systems course.

---

## 1. A program that is running

Ivo's plate file is 11 000 bytes on the shelf. He starts the cutter from it. The shelf still holds 11 000 bytes. The bench now also holds a moving copy: instructions being read, numbers being written, the cutter arm taking orders.

The sitting file is not the moving copy. Delete the sitting file while the job runs and the moving copy can still finish the plate it already loaded. Start the same file twice and you have two moving copies. They do not share a pencil. They can fight over the cutter. They can also ignore each other.

That moving copy is a **program that is running**. The sitting file is a program that is not. People also say **running program**. The family name **operating system** can wait. It is the clerk and the rules around that running copy, not the copy itself.

Cal keeps one shared box on the bench. Many files live on its shelf. Only the jobs that have been started are on the mill. At 06:40 Ivo has one job on. At 06:41 he starts a second job from a different file, a stamp aligner. Two running programs. The box did not become two boxes.

The clerk that starts jobs, hands out cubbies, and stops a job that reaches into the wrong cubby is the **kernel**. The Linux kernel documentation tree, fetched for this sitting, calls itself the top level of the kernel's documentation, and says that documentation, like the kernel itself, is very much a work in progress. That sentence is about the manuals. It is also a true picture of the clerk: always being patched, never a finished statue.

User-facing manuals on that same tree are named Administration, Build system, Reporting issues, Userspace tools, and Userspace API. That is five doors for people who run the clerk or write programs against it. The Linux man pages are kept separately from the kernel's own documentation. Open those doors when a command or a call must be cited. Do not finish a man-page number from memory.

Holm Press numbers below are invented. 11 000 bytes is Ivo's plate this morning, not a kernel constant.

**Check.** Ren starts the night aligner from a 7 200 byte file, then starts it again from the same file without stopping the first. How many sitting files. One. How many running programs. Two. A new case: three plate files on the shelf, and Ren starts two of them. Sitting files still three. Running programs two. If you wrote three running programs, you counted a file that is only sitting.

---

## 2. Memory as a place

The shared box has a finite pile of cubbies. Each cubby holds one small pile of bits. A running program needs cubbies for the instructions it is in the middle of, the numbers it has written, and the plate it is building.

Ivo's cutter job, invented, asks for 48 cubby-units. Ren's night aligner asks for 32. The box has 96. Taken: $48 + 32 = 80$. Left: $96 - 80 = 16$. If Cal starts a third job that wants 24, it will not fit. $80 + 24 = 104$, which is more than 96. The clerk must refuse, or it must push some of Ivo's idle cubbies off onto the shelf and pretend they are still in place. That pretend is a later move. The honest count is 96.

The pile of cubbies a running program may use is **memory**. Not the shelf of files. Memory is the place the job is in right now. The shelf is the place a file can wait for years.

The clerk does not let Ivo's 48 and Ren's 32 occupy the same cubbies at the same time. If they did, Ivo's plate numbers would land in Ren's aligner, and the night job would print garbage, or stop, or write Ivo's plate onto the wrong stock. Isolation is the rule: each running program sees a private stretch of cubbies. The physical pile is still one pile. The clerk maps each job's private names onto real cubbies, or onto shelf space that is swapped in when needed. The private names are **virtual**. The real cubbies are **physical**. Those two words wait until you have seen the two piles.

How large a cubby is on a real kernel, and how the map is walked, did not appear on the four pages fetched for this sitting. Page size, in bytes, is unverified here. Do not write a remembered page size as a fact. Holm Press uses invented units so the add and leftover work.

Algebra already lets a letter stand for a count. Let $M$ be the box total, $A$ Ivo's hold, $B$ Ren's hold. Leftover $L = M - (A + B)$. Fill $M = 96$, $A = 48$, $B = 32$: $L = 16$. Solve for Ren if leftover must stay 16 and Ivo grows to 52: $B = M - L - A = 96 - 16 - 52 = 28$. Ren has to shrink, or the leftover promise fails.

The kernel documentation lists CPU architectures the clerk has been taught to run on, including ARM, ARM64, RISC-V, x86, powerpc, and others, sixteen names in the architecture index of that fetch. Sixteen is a count of manuals, not a count of cubbies in Ivo's box. Do not treat 16 as Holm's memory.

**Check.** A new box with 64 units. Day job 21, night job 19. Taken $21 + 19 = 40$. Left $64 - 40 = 24$. A second fill: leftover must be 12, day job 21. Then night may take $64 - 12 - 21 = 31$. If someone writes leftover 24 as a kernel page size, they mixed the invented shop with a door. Open the kernel documentation. 24 is leftover cubbies on this 64-unit box.

---

## 3. A file the kernel sees

The computers book owns the file on this machine: a named pile in a folder, a path you can point at, a thing you can copy. Name that door and stop.

This chapter is a different object. Ivo's running cutter needs the plate file, and it also needs the cutter itself, and a log. The clerk does not hand the whole shelf to the job. The job asks to open. The clerk checks the keys, then hands back a small ticket: "this job, slot 3, is the plate." Later the job says "write 80 bytes on slot 3." It does not say the long path again.

That ticket is **a file the kernel sees**. People also call the ticket a **file descriptor** once you have seen the slot number. The path is a name on the shelf. The ticket is an open hold, belonging to one running program, lasting until that program closes it or dies.

Ivo opens three things: the plate, the log, the cutter. Three tickets. He closes the log. Two tickets remain. The log file is still on the shelf. The kernel no longer sees it as open in Ivo's job.

Two running copies of the same plate file can each hold their own ticket. Slot numbers can match and still be different holds, because each job has its own table of tickets. Ivo's slot 3 is not Ren's slot 3.

POSIX would be the contract for how those tickets behave across Unix-like clerks. The Issue 7, 2018 edition door did not yield a body in this sitting. How many standard slots a job starts with, and the exact close rules, stay unverified here. Holm Press invents the slot counts so you can add.

The FreeBSD Handbook, fetched for this sitting, covers installation and day to day use of FreeBSD 15.1-RELEASE, 14.4-RELEASE, and 13.5-RELEASE. That is three release lines in one book. Last modified on 17 June 2026, by Alexander Ziaee, as printed on the handbook page. Copyright on that page runs 1995-2026, The FreeBSD Documentation Project. Those are handbook facts. They are not Ivo's three tickets.

**Check.** A new job opens 6 files, then closes 2. Tickets left: $6 - 2 = 4$. The shelf still has all 6 names if none were deleted. A new case: two jobs each open the same log. Ticket tables: two. Shelf files named log: one. If you wrote two logs on the shelf, you counted tickets as copies of the file. If you wrote that POSIX promises 6 starter tickets, you finished a sentence the Issue 7 body never gave this sitting.

---

## 4. A process

Ivo's cutter is not only a moving copy of a file. It has cubbies. It has tickets. It has a name the clerk uses when Cal asks "what is on the mill." At 06:44 the clerk has painted 1403 on Ivo's cutter and 1409 on the second start of the same file.

That whole bundle — running copy, cubbies, tickets, painted number, and the person-keys it carries — is a **process**. The painted number is a **process identifier** once you have seen the paint. Two processes can come from one file. Killing 1403 does not kill 1409. They are not one object with two names. They are two objects that began from one sitting file.

A process is the clerk's answer to "who is running." A program that is sitting is not a process. A program that is running is a process, or it is several, if it asked the clerk to split.

Cal lists the mill. Eleven processes this morning, invented. One of them is the clerk's own helpers. Ten are press jobs. The list is not the shelf. The shelf can hold 200 plate files while 11 processes run.

The kernel documentation's Userspace API manual is the door for how a program asks the Linux clerk about this bundle. The man pages, kept separately, are the door for the typed commands that print the list. This sitting did not open those inner pages. The letters `ps` as a command name, and the exact columns they print, stay unverified here. Holm's 1403 and 1409 are paint on invented tickets.

Algebra: let $n$ be the number of processes started from one file. Ivo starts the cutter, then starts it twice more without stopping the first. $n = 3$. Three painted numbers. One sitting file. If he then stops the middle one, $n = 2$ still running, and the sitting file is still one.

**Check.** New paint: 1881 and 1902 from the stamp file, then 1910 from the aligner. Processes: 3. Sitting files used: 2. A new case: stop 1881. Processes left from that list: 2. If you wrote that 1881 and 1902 were one process because they share a file, you collapsed the bundle back into the shelf. The file is shared as a source. The cubbies and tickets are not.

---

## 5. Time sharing

The bench has one pair of hands. Eight processes want those hands. The clerk does not wait for Ivo's cutter to finish the whole plate. It lets 1403 run for a short turn, then 1409, then the next, then back to 1403. Each process is told it has the bench. None of them has it the whole morning.

That taking of turns is **time sharing**. The clerk that picks the next turn is the **scheduler** once you have seen the picking. On one pair of hands, two processes are never truly in the same instant. They interleave. On two pairs of hands, two processes can be in the same instant. Holm's box this morning, invented, has one pair. Eight processes interleave.

Fair turns, invented: 40 ticks in a window, 8 processes, each process $40 \div 8 = 5$ ticks if none of them waits. If two processes are waiting for the cutter to move, they skip their turn. Six remain. Those six share 40: $40 \div 6$ is not a whole number. The clerk can give some 7 and some 6, because $4 \times 7 + 2 \times 6 = 28 + 12 = 40$. Unfair on purpose, or leftover ticks. Write the rule you used. Do not hide a 7 as if every process got 5.

A process that never yields and that the clerk cannot preempt will starve the others. Time sharing only works if the clerk can take the bench back. How Linux and FreeBSD name that preemption did not appear on the four fetched pages. Unverified here.

The FreeBSD Handbook is the day-to-day door for one Unix that does this turn-taking. Its three release lines, 15.1, 14.4, and 13.5, are the versions that handbook claims to cover as of the 17 June 2026 modification printed on the page. A tick length in milliseconds is not on that landing page. Unverified.

Let $T$ be ticks in a window, $n$ the processes that are ready. Equal share is $T / n$ when $n$ divides $T$. $T = 42$, $n = 6$: each ready process 7. If $n = 0$, there is no share to compute. The bench idles.

**Check.** New window: 24 ticks, 6 ready processes. Equal share $24 \div 6 = 4$. A new mix: 5 ready, 24 ticks. $4 \times 5 = 20$, leftover 4 ticks. You can give four processes 5 and one process 4, because $4 \times 5 + 4 = 24$. Another: 1 ready process, 24 ticks. That one gets 24. If you wrote 5, you still had the old eight-process morning in your head.

---

## 6. Permission

Ren can start the night aligner. A visitor standing at the counter cannot. Cal can replace the clerk. Ivo cannot. The difference is not skill. It is a key the clerk checks before it opens a file, starts a job, or writes a cubby.

That key is **permission**. A process carries a person-identity the clerk trusts, or refuses. The sitting file on the shelf also carries a note: who may read it, who may write it, who may start it as a job. The computers book named files on this machine. This chapter owns the walk: the clerk is the one who actually says yes or no when a running program asks.

Three yes-or-no marks on one file, invented for Holm: read, write, start. Each mark is yes or no. Combinations: $2 \times 2 \times 2 = 8$. Cal's wage file: Ivo may read, may not write, may not start. That is one of the eight. The visitor: no, no, no. Another of the eight. Cal: yes, yes, yes.

A process that has no write key on the wage file can still try. The clerk returns a refusal. The cubbies of that process do not gain the wage numbers. Isolation from chapter 2 is not enough. Isolation stops accidents across cubbies. Permission stops a process that is supposed to be Ivo from becoming Cal.

POSIX would be the contract for user, group, and other, and for the bits that encode those eight combinations. The Issue 7 body did not arrive. Those bit patterns stay unverified here. Do not write a remembered mode number as Issue 7.

The kernel documentation's Administration manual is the user-oriented door for how a Linux clerk is told who may do what. This sitting opened only the tree's top page, which lists that manual. Inner pages were not fetched. Commands that change keys stay unverified here.

**Check.** Ren may read 14 plate files and may not write the 3 files Cal locked. How many of those 17 may she write. Zero of the locked 3, and the 14 are a different pile. If the 14 are unlocked for her, she may write 14. If you added $14 + 3 = 17$ and called 17 writable, you ignored the lock. A new case: visitor process, wage file marked no-no-no. The process asks to read. The clerk refuses. If the visitor's window still shows wages, those numbers came from somewhere the clerk did not permit, or you invented a yes.

---

## 7. A device

The cutter is not a file on the shelf. It is a machine in the room: an arm, a blade, a port into the box. The keyboard is a machine. The disk that holds the shelf is a machine. Ivo's process does not spark the blade itself. It writes to a ticket. The clerk turns that write into a motion.

That machine, as the clerk presents it to a process, is a **device**. The program inside the clerk that speaks the machine's private language is a **driver** once you have seen that there is a private language. Ivo still sees a ticket. The driver sees pulses.

Two kinds, in ordinary English. A stream: the next letter from the keyboard, then the next, no useful meaning to "letter 4000." A numbered shelf: the disk, block 4000, then block 4001, which you can ask for by number. Holm invents those names. The kernel documentation's Driver APIs manual is the door for how Linux talks to hardware. Inner pages were not fetched. Register layouts stay unverified.

Unplug the cutter. The ticket Ivo holds can still exist for a moment. Writes then fail. The process is still a process. The device is gone. Plug in a second cutter. Two devices. The clerk must name them apart. Holm, invented, calls them cutter-a and cutter-b. A process with a ticket for cutter-a does not move cutter-b.

The architecture list on the kernel documentation names sixteen CPU families, from ARC and ARM through x86 and Xtensa. A CPU is also a device in the loose sense, but it is the pair of hands from chapter 5, not a cutter. Do not file the CPU under cutter-a.

Firmware, on that same documentation tree, has its own manuals: Firmware, and Firmware and Devicetree. Those pages were listed, not opened. What a device tree is stays unverified here. The object in this chapter is still the machine the clerk presents as a ticket.

**Check.** Two cutters. Unplug cutter-b. Devices left that can move: 1. Tickets a process already held to cutter-b now fail on write. A new case: a disk of 12 numbered blocks, invented, and a process that asks for block 13. There is no 13. The clerk refuses. If you treated the keyboard as block 13, you put a stream on a numbered shelf. Count the 12. Do not invent a thirteenth block.

---

## 8. A crash

Ivo's cutter process reaches for cubby 900, and cubby 900 is not in its map. The clerk can stop that process, take its cubbies back, close its tickets, and leave Ren's aligner running. Eleven processes, invented, one illegal reach, ten remain. The box stays up.

That stop of one process is a **crash** of the job, not of the mill. People also say the process **faulted**. The important split is the same split as chapter 1: the job is not the box.

If the clerk itself reaches into a hole, or a driver writes the wrong pulse into the disk map, there may be no one left to take the bench back. Then the mill stops. All eleven processes are gone at once. The shelf may still be intact, or it may not, if the last writes never landed. That mill-stop is a **kernel crash**. How Linux names a panic, and how FreeBSD names a panic, did not appear on the four fetched landings. Unverified. Holm will say mill-stop when the clerk dies, and job-stop when only one process dies.

A job-stop can be caused by a bug in Ivo's plate program, by a missing device, by a refusal that the program did not handle, or by Cal sending a stop. The clerk's job is to keep the blast inside that process when it can. Isolation and permission are why a visitor's crashed toy should not take the wage file with it.

The kernel documentation lists Fault injection and Livepatching among developer manuals. Those pages were listed, not opened. Whether a live patch can fix a mill-stop without a restart stays unverified here. The object is the blast radius: one process, or the clerk.

**Check.** Nine processes on. One job-stop. Left: 8. A new case: mill-stop. Left: 0 processes, even if 9 files still sit on the shelf. Another: two job-stops from the same sitting file. Two painted numbers gone, one file still sitting. If you wrote that a job-stop of 1881 took 1902 with it because they share a file, you forgot chapter 4. If you wrote a remembered panic string as a FreeBSD fact, open the handbook. This sitting did not fetch that string.

---

## 9. What the user sees

Ivo does not see cubbies. He sees a window, or a blinking line that takes typing, and a list of jobs he asked for. He types a name. A process starts. He closes the window. The process may still be on the mill, or it may have gone with the window. Those two outcomes are different objects: the surface he looks at, and the process.

That surface is **what the user sees**. People also call a typed line a **shell**, and a pointer-and-windows layer a **desktop**, once you have seen the two surfaces. Neither surface is the kernel. The kernel does not draw the blinking line. A process draws it, using devices, cubbies, and tickets, under permission.

Login is a permission event from chapter 6. Ivo types a name and a secret. A helper process asks the clerk to treat later processes as Ivo. The visitor at the counter who never logged in does not get Ivo's keys by looking at Ivo's screen.

Closing a window is not a mill-stop. It may send a stop to the processes that window started. It may not. Holm, invented: Ivo starts job 1902 from a window, then closes the window, and 1902 is still in the mill list. The surface died. The process did not. Killing 1902 then leaves the next window empty of that job. Two checks, two objects.

The kernel documentation splits user-oriented manuals from internal API manuals. Users see Administration, Reporting issues, Userspace tools, Userspace API. Developers wiring the clerk see Core API, Driver APIs, Subsystems, Locking. That split on the fetched tree is the same split as this chapter: the glass, and the mill. Translations of that documentation exist in seven languages on the tree: Chinese Simplified, Chinese Traditional, Italian, Japanese, Korean, Portuguese Brazilian, and Spanish. Seven is a count of translations, not a count of Holm's windows.

MIT OpenCourseWare remains the school door for lecture notes you can fetch without registering. It is not the clerk. Watching a lecture about processes is not starting a process.

**Check.** Start job 2044 from a window. Close the window. Read the mill list. If 2044 is still painted, the surface was not the process. A new case: 2044 is gone after the close. Then that window's rule was to stop its children. Write which rule you saw. Another: two windows, one mill. Processes: whatever the mill list says, not "2" just because two windows are open. If you counted windows as processes, you counted glass.

---

## 10. A check

Walk a new morning at Holm Press. Do not reuse 48, 32, 96, 1403, 1409, or 11 as the proof that the walk closed.

Shelf, invented: 17 plate files. Ivo starts 4 of them, then starts the first one a second time. Sitting files: 17. Running programs: 5. Processes: 5. Painted numbers, invented: 2201, 2204, 2207, 2210, 2213.

Memory, invented: box 80 units. The five processes ask 12, 9, 8, 14, 10. Taken $12+9+8+14+10 = 53$. Left $80 - 53 = 27$. 27 is leftover cubbies, not a kernel page size. If a sixth process asks 30, $53 + 30 = 83$, which is more than 80. The clerk refuses, or it must push idle cubbies to the shelf. Write which.

Tickets: process 2210 opens 5 files and closes 1. Tickets left on 2210: 4. Process 2213 opens the same log 2210 still holds. Shelf logs: 1. Ticket tables that mention it: 2.

Turns: 35 ticks, 5 ready processes. Equal share $35 \div 5 = 7$. Then 2213 waits on the cutter. 4 ready. $35 \div 4$ is not whole. Four fives and leftover 15 is a wrong split, because $4 \times 5 = 20$, leftover 15, and you still have 15 ticks to give. Better: three processes get 9, one gets 8, because $3 \times 9 + 8 = 27 + 8 = 35$. Write the split.

Permission: Cal locks 2 of the 17 plates as no-write for Ivo. Ivo's 5 processes may still read those 2 if the read mark is yes. They may not save over them. A visitor process, no-no-no on wages, must not display wages.

Device: cutter-a present, cutter-b unplugged. Writes to cutter-b fail. Disk of 18 blocks, invented. Ask for block 18 if blocks are numbered 1 through 18, or ask for block 17 if they are numbered 0 through 17. Do not invent block 19. This sitting did not fetch a kernel rule for 0-based disks. Unverified. Pick a numbering, write it, stay inside it.

Crash: job-stop 2207. Processes left: 4. Mill-stop: processes left 0, shelf still 17 if the disk held.

Surface: close the window that started 2213. Read the mill list. 2213 present or absent is the rule you are testing. Do not call the window a process.

Doors. Linux kernel documentation owns the clerk manuals, the sixteen architecture pages, the five user-oriented manuals, the separate man pages, and the note that the tree is a work in progress. The Open Group Issue 7, 2018 edition owns POSIX when its body is readable; this sitting got a frames warning, so POSIX numbers stay unverified. The FreeBSD Handbook owns 15.1-RELEASE, 14.4-RELEASE, 13.5-RELEASE, and the 17 June 2026 modification line. MIT OpenCourseWare did not name an operating-systems course on the homepage fetch. A course number for this object stays unverified.

The mill is still one box. The object was never the shelf of files. It was the job on the bench, the cubbies it held, the tickets it was allowed, the turns it took, the key it carried, and the crash that did or did not take the rest. Computers still owns the files on this machine. Python still owns a language. Open the doors when a number must travel. Holm's 17, 5, 80, and 35 are shop paint. They do not leave the shop as kernel law.
