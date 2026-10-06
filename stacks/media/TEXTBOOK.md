---
title: "media — textbook"
date: "2026-09-18"
status: living · multi-level · the-stacks
level: "hs"
floor_age: 13
needs: []
home: "stacks/media/"
related:
  - "../sociology/"
  - "../psychology/"
  - "../civics/"
  - "../security/"
  - "../methods/"
---

# Media, Social Platforms & Information Disorders

A textbook about the machinery behind the feed: how platforms earn money from attention, how claims spread and decay, how recommenders choose what you see next, and how a careful reader can audit any claim in minutes. Chapters are tagged by level: **hs** (open to readers 13 and up — no algebra needed), **undergrad** (some statistics), **grad** (network science and regulation research).

---

## 1. How a Feed Works [level: hs]

### 1.1 The Attention Economy in One Sentence

You do not pay money for a social platform; you pay attention, and the platform sells your attention to advertisers. Every design choice you feel — infinite scroll, autoplay, pull-to-refresh — exists because it increases the number of ads that can be shown.

### 1.2 Why the Slot Machine Feeling Is Not an Accident

Psychology (see `stacks/psychology/TEXTBOOK.md`) shows that a reward delivered on a **variable ratio schedule** — sometimes after one pull, sometimes after twenty — produces the most persistent behavior of any reward pattern. Pull-to-refresh on a feed is the same lever arm a slot machine uses. Knowing the mechanism is the defense: the urge to check is engineered, not a personal failure.

### 1.3 The Three Currencies of a Post

| currency | what it measures | who benefits |
|---|---|---|
| attention | time spent viewing | the platform (more ad slots) |
| engagement | reactions, comments, shares | the poster (reach) |
| data | signals for targeting | advertisers |

Outrage and novelty earn engagement faster than nuance, so engagement-ranked feeds systematically over-deliver emotional content. This is a structural result of the metric, not a conspiracy of individuals.

---

## 2. Reading a Claim: The Lateral Method [level: hs]

### 2.1 Provenance Before Content

The first question is never "is this well written?" It is "**who owns this, and how do they know?**" A screenshot can be real text with a fake origin. A confident tone is free to manufacture.

### 2.2 The Ten-Minute Lateral Audit (worked method)

1. **Stop.** Strong emotion is a signal to slow down, not speed up (the emotional spike is often the point of the post).
2. **Open a new tab and search the source.** Who runs it? What else do they publish? Wikipedia's article on the outlet is a legitimate starting map, then go to the outlet's own "about" page.
3. **Find better coverage.** Search the claim's key names and numbers. Do independent outlets agree on the basic fact?
4. **Trace to the original.** Find the study, statute, transcript, or dataset. Read the primary source or its abstract before sharing.

If step 4 finds no primary source, the correct output is "unverified" — and the correct action is not sharing.

### 2.3 A Field Guide to Information Disorders

| term | the speaker's intent | example |
|---|---|---|
| **misinformation** | false, but shared without intent to deceive | a friend passes on an outdated recall notice |
| **disinformation** | false and spread deliberately to deceive | a fabricated quote with a real logo |
| **malinformation** | true, but shared to cause harm | leaking private messages to humiliate someone |

The intent line matters because remedies differ: misinformation yields to correction; disinformation yields to provenance habits and platform friction; malinformation yields to privacy law and norms.

---

## 3. Your Data, Their Model [level: hs]

### 3.1 What a Platform Collects

Declared data (profile, follows, likes), behavioral data (dwell time, scroll speed, pauses on an image), and inferred data (demographic and interest estimates from the first two). Inferred data is the product advertisers buy.

### 3.2 Targeting Without Reading Your Mind

No single data point identifies you. The signal comes from **aggregation**: many weak signals combined give a strong prediction. The defensive principle is the same as in `stacks/security/TEXTBOOK.md` — reduce the surface. Practical moves, in order of power: turn off ad personalization in platform settings, deny optional permissions, use the web version instead of always-on apps where practical.

### 3.3 Defaults Are Decisions

Most users never change a default. Regulators treat this asymmetry as a duty placed on the platform ("privacy by default"), which is why **collect it anyway** consent walls are a compliance question, not just an etiquette question.

---

## 4. The Health of the Scroll [level: hs]

### 4.1 What the Evidence Says — Carefully

Public-health bodies (US Surgeon General advisory, APA health advisories) do not say "social media causes harm" as a single blanket claim. The honest summary: heavy **unbounded** use is associated with worse sleep and more social comparison in adolescents; the effect sizes in the literature are real but modest and contested; displacement of sleep and face-to-face time is the most consistently supported mechanism. Anyone quoting a single alarming statistic without its comparison group is doing the thing Chapter 2 teaches you to catch.

### 4.2 Designing Your Own Boundaries (worked method)

1. Name the displacement: what would the scroll hour otherwise buy (sleep, a person, a project)?
2. Move the boundary into the environment, not the willpower: log out, grayscale, notifications off for non-human senders.
3. Review weekly with one question: did this week look like the week I wanted?

---

## 5. Network Structure: Why Your Feed Is Not Everyone's [level: undergrad]

### 5.1 Platforms as Graphs

Model users as **nodes** and follows or friendships as **edges**. Three structural facts drive everything else:

- **Homophily:** edges form preferentially between similar nodes. Similarity here includes what you already believe.
- **Clustering:** your friends' friends tend to be your friends, producing dense local neighborhoods — the raw material of an **echo chamber**.
- **Bridges and brokers:** a small set of edges span otherwise separate clusters. Content that crosses a bridge escapes its neighborhood; this is why a niche post can become a global one overnight.

### 5.2 Filter Bubbles vs Echo Chambers

A **filter bubble** is algorithmic: the recommender narrows what reaches you. An **echo chamber** is social: even with an unfiltered pipe, your network re-delivers your own views with social reward attached. The two compound, and they have different fixes — bubble effects yield to feed choice; echo chambers yield to network composition (who you follow), which no ranking change can repair.

---

## 6. How Falsehood Travels [level: undergrad]

### 6.1 The Spread Advantage of Novelty

Research on cascades (Vosoughi, Roy & Aral, *Science*, 2018) found false news spreads farther, faster, and more broadly than true news on the same platform, and that humans — not bots — did most of the sharing. Novelty earns engagement; falsehood is cheaper to manufacture than truth is to verify, so the supply of novel falsehood outpaces verified novelty.

### 6.2 The Illusory Truth Effect and Its Limits

Repetition increases perceived truth (Hasher, Goldstein & Toppino, 1977) — hearing a claim three times makes it feel truer, with no new evidence. Corrections work best when they **repeat the fact once, not the myth**, and when they offer an alternative account that fills the gap the myth was filling. A bare "that's false" leaves a narrative hole that the myth refills on the next scroll.

### 6.3 Debunk vs Prebunk

**Debunking** corrects after exposure; **prebunking** (inoculation) teaches the manipulation technique — emotional hijack, fake consensus, stolen provenance — before a live example arrives. Field studies find prebunking effects smaller but more durable and more scalable than per-claim debunking.

---

## 7. Recommender Systems: The Ranking Objective [level: undergrad]

### 7.1 The Core Problem

A platform must choose, per user, the top $k$ items from millions. Collaborative filtering predicts affinity from the item–user interaction matrix $R$, classically by matrix factorization: approximate $R \approx UV^\top$ where latent factors encode user and item features. Modern systems blend this with a learned engagement model and a business-rules layer.

### 7.2 Optimization Follows the Metric

The system optimizes the objective you give it. An engagement objective (predicted dwell, reaction probability) is measurable at scale and highly correlated with revenue; user-welfare objectives ("did this use session leave better off?") are expensive to measure and lag. Because the metric is chosen by the business, ranking behavior is a **policy decision wearing a math costume** — which is exactly why regulators now write the metric requirements into law.

### 7.3 Amplification vs Personalization

Empirically, recommender rank effects are real but bounded: most of a user's exposure is still determined by their own choices of network and topic. The research consensus is that neither "the algorithm did it all" nor "the algorithm is neutral" survives contact with the data. Attribution studies (feed ablations, rank-randomized experiments) are the only clean instrument, and platforms rarely publish them.

---

## 8. Diffusion: Contagion Models of Information [level: grad]

### 8.1 Compartmental and Cascade Models

Information spread is modeled with the same machinery as epidemics. In the **independent cascade** model, each newly activated node gets one probabilistic attempt to activate each neighbor; in the **linear threshold** model, a node activates when the weighted fraction of active neighbors crosses a threshold $\theta$. The SIR compartments map as: susceptible (not seen) → infected (shared) → recovered (refractory, stops sharing).

### 8.2 Epidemic Thresholds and Heterogeneity

On a homogeneous network, spread requires an effective reproduction number $R_0 > 1$. Real social graphs are heavy-tailed ( hubs), which lowers the threshold: super-spreader nodes carry cascades, so reach is dominated by seeding near brokers and bridges. This is the quantitative basis for influencer marketing and for astroturfing both — the same math serves the honest and the manufactured campaign.

### 8.3 Opinion Dynamics

The **DeGroot** model iterates $x(t+1) = Wx(t)$ where $W$ is a row-stochastic influence matrix; consensus occurs when $W$ is primitive, and the limiting beliefs are a function of network centrality. **Bounded-confidence** models (Deffuant et al.) add the empirically crucial constraint: agents update only toward opinions within distance $\epsilon$. With bounded confidence, mixing produces polarization clusters rather than consensus — a formal argument for why more exposure between distant camps can *increase* sorting.

### 8.4 Identifying Coordinated Inauthentic Behavior

Detection research treats manipulation as an anomaly-detection problem over the interaction graph: near-duplicate posting times, shared infrastructure, statistically improbable synchronization of engagement. The honest open problem is base rates — detector precision outside lab conditions is contested, and false positives fall on real users.

---

## 9. Platform Governance: The Regulatory Layer [level: grad]

### 9.1 Two Legal Traditions

US law (Communications Decency Act §230, 47 U.S.C. 230) treats hosting platforms largely as non-liable for third-party content, making moderation a private-law matter. The EU **Digital Services Act** instead imposes procedural duties: risk assessments for systemic risks, researcher data access, transparency of recommender parameters, and a ban on advertising targeted at minors. The US regulates by liability shield; the EU regulates by duty of care. Read both texts, not summaries — the definitions ("active recipient", "systemic risk") carry the law.

### 9.2 Age Assurance and the 13 Floor

COPPA (15 U.S.C. 6501) restricts collection from children under 13, which is why platform terms set the floor at 13 — it is a legal line, not a developmental one. Post-13 adolescent protections (ad targeting bans, default privacy, age-appropriate design codes such as the UK Age Appropriate Design Code) are the current regulatory frontier. For materials designers: 13 is the floor for self-directed social media study; curricular maturity controls remain the educator's layer.

### 9.3 Auditing Research

Independent audit methods include sock-puppet audits (controlled accounts), random-rank perturbation experiments, and researcher access under DSA Article 40. The standing critique of the field: access is asymmetric, replication is rare, and platform-independent benchmarks for "amplification" do not yet exist.

---

## 10. Core Checks and Fallacies [all levels]

1. **The metric fallacy:** treating a platform's engagement count as a measure of truth, popularity-with-people, or importance. It measures engagement.
2. **The consensus fake:** purchased reactions and bot amplification simulate social proof. Social proof is only evidence when the proof is authentic.
3. **The single-study headline:** one preprint with a startling number is not a finding; Chapter 2's step 4 exists precisely for this.
4. **The attribution error, platform edition:** "my feed shows it, therefore it is widespread." Your feed is a sample of size you.
5. **The authenticity trap:** fluent, confident, well-produced content is the cheapest thing on the internet to fake. Production quality is uncorrelated with accuracy.