---
title: "ai_ml — chapter 0"
date: "2026-09-16"
status: draft · agy review
insert: "stacks/ai_ml/TEXTBOOK.md, before chapter 1"
needs: ["computing", "algebra", "data"]
---

# Chapter 0. A guess from many examples

You show a box many pairs: a picture of a cat, the word cat; a picture of a dog, the word dog. The box tunes a pile of knobs so that a new picture is more often given the matching word. No one wrote a list of whisker rules. The list was grown from the pairs.

That grown list is a **model**. The knobs are **parameters**. The tuning is **training**. Using the tuned knobs on a new input is **inference**. This app, when a local model is loaded, is doing inference on this box.

The box can be fluent and wrong. Fluency is a guess that sounds like the examples. Truth is a check against a door: a measurement, a statute, a file on this machine. This library's tools exist because the guess is not the check.

Later chapters name tokens, gradients, attention, and quantization. They are machinery for the same object: examples in, knobs tuned, a next mark out. If a vector and a slope are new, open algebra. If a file and a program are new, open computers, then computing. If a sample is being treated as the whole world, open data.
