---
title: "finance — link index"
date: "2026-09-13"
status: living · easylm
home: "stacks/finance/"
---

# Finance — Link Index

The authoritative directory of verified financial data portals, corporate filing databases, regulatory bodies, accounting standards, and university open courseware.

---

## 1. Primary Market Data & Macroeconomic Feeds

| Resource | Scope / Function | Target Search Query | Official Door |
|---|---|---|---|
| **FRED (Federal Reserve Bank of St. Louis)** | Benchmark economic time series (Rates, CPI, GDP, M2) | `site:fred.stlouisfed.org [series name]` | https://fred.stlouisfed.org/ |
| **Bureau of Labor Statistics (BLS)** | Consumer Price Index (CPI), PPI, Employment data | `site:bls.gov/cpi [month year report]` | https://www.bls.gov/cpi/ |
| **Bureau of Economic Analysis (BEA)** | Gross Domestic Product (GDP), PCE Inflation, Corporate Profits | `site:bea.gov GDP release` | https://www.bea.gov/ |
| **US Treasury Fiscal Data** | National debt, federal spending, interest rates, daily yields | `Treasury Fiscal Data portal` | https://fiscaldata.treasury.gov/ |
| **Federal Reserve Board of Governors** | FOMC statements, discount rate, H.15 interest rates | `site:federalreserve.gov FOMC statement` | https://www.federalreserve.gov/ |
| **Bank for International Settlements (BIS)**| Central bank statistics, Basel standards, FX turnover | `site:bis.org statistics` | https://www.bis.org/ |
| **International Monetary Fund (IMF)** | World Economic Outlook, global debt database | `site:imf.org data` | https://www.imf.org/ |
| **World Bank Open Data** | Global development, trade, and economic indicators | `World Bank open data portal` | https://data.worldbank.org/ |

---

## 2. Corporate Filings & Accounting Standards

| Resource | Scope / Function | Target Search Query | Official Door |
|---|---|---|---|
| **SEC EDGAR Database** | Form 10-K, 10-Q, 8-K, Form 4 insider trades, S-1 prospectuses | `site:sec.gov/edgar [company ticker/CIK]` | https://www.sec.gov/edgar |
| **SEC Investor.gov** | Regulatory disclosures, fee calculators, investor education | `SEC investor.gov education tools` | https://www.investor.gov/ |
| **FASB (US GAAP)** | Accounting Standards Codification (ASC) | `FASB Accounting Standards Codification` | https://www.fasb.org/ |
| **IFRS Foundation / IASB** | International Financial Reporting Standards (IFRS / IAS) | `IFRS accounting standards search` | https://www.ifrs.org/ |
| **PCAOB** | Public Company Accounting Oversight Board (Audit rules) | `site:pcaobus.org standards` | https://pcaobus.org/ |
| **GASB** | Governmental Accounting Standards Board (State/Local US) | `site:gasb.org standards` | https://www.gasb.org/ |
| **Internal Revenue Service (IRS)** | Internal Revenue Code (IRC), tax forms, instructions, brackets | `site:irs.gov [form or topic]` | https://www.irs.gov/ |

---

## 3. Regulatory Authorities & Market Oversight

| Agency | Jurisdiction & Mandate | Search Query | Official Door |
|---|---|---|---|
| **Securities and Exchange Commission (SEC)** | Primary/secondary US securities markets and public issuers | `US Securities and Exchange Commission` | https://www.sec.gov/ |
| **Commodity Futures Trading Commission (CFTC)** | US derivatives, futures, commodity options, and swaps | `Commodity Futures Trading Commission` | https://www.cftc.gov/ |
| **Financial Industry Regulatory Authority (FINRA)** | US broker-dealer regulation and BrokerCheck oversight | `FINRA broker check search` | https://www.finra.org/ |
| **Federal Deposit Insurance Corp (FDIC)** | US commercial bank deposit insurance and resolution | `FDIC bank data search` | https://www.fdic.gov/ |
| **Office of the Comptroller of the Currency (OCC)**| Chartering and supervising national banks and federal thrifts | `Office of the Comptroller of the Currency`| https://www.occ.gov/ |
| **Consumer Financial Protection Bureau (CFPB)** | Consumer credit, mortgages, credit reporting oversight | `Consumer Financial Protection Bureau` | https://www.consumerfinance.gov/ |

---

## 4. University Courseware & Standard Textbooks

| Institution / Platform | Course / Textbook | Search Query | Official Door |
|---|---|---|---|
| **MIT OpenCourseWare (15.401)** | Finance Theory I (Prof. Andrew Lo) | `MIT OCW 15.401 Finance Theory I` | https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/ |
| **OpenStax Principles of Finance** | Peer-reviewed open college textbook | `OpenStax Principles of Finance` | https://openstax.org/details/books/principles-finance |
| **OpenStax Financial Accounting** | Peer-reviewed financial accounting text | `OpenStax Financial Accounting` | https://openstax.org/details/books/principles-financial-accounting |
| **OpenStax Managerial Accounting** | Peer-reviewed managerial accounting text | `OpenStax Managerial Accounting` | https://openstax.org/details/books/principles-managerial-accounting |
| **OpenStax Principles of Economics 3e** | Micro and macroeconomics foundation | `OpenStax Principles of Economics 3e` | https://openstax.org/details/books/principles-economics-3e |
| **NYU Stern (Aswath Damodaran)** | Corporate Finance & Valuation Masterclasses | `Damodaran Online NYU Stern Valuation` | https://pages.stern.nyu.edu/~adamodar/ |

---

## 5. Verification & Anti-Hallucination Protocol

1. **Verify Before Quoting:** Asset prices, corporate filings, bond yields, tax rates, and macroeconomic prints must be fetched from verified sources. Never quote market numbers from memory.
2. **Execute via Deterministic Computation:** For any present value, future value, annuity, WACC, duration, or option pricing calculation, compute deterministically using exact mathematical formulas (the EasyLM calc hand / `calc`).
3. **Empty Source = DONT_KNOW:** If a historical financial ratio, unlisted corporate valuation, or specific statutory paragraph cannot be retrieved via verified doors, immediately return **DONT_KNOW**.

---

## 6. Sibling packs (The Stacks)

| Domain | File Path |
|---|---|
| **Textbook** | [TEXTBOOK.md](TEXTBOOK.md) |
| **Law & securities statutes** | `../law/TEXTBOOK.md` |
| **Methods & empirical testing** | `../methods/TEXTBOOK.md` |
| **Mathematics identities** | `../math/TEXTBOOK.md` |
| **Civics & monetary policy** | `../civics/TEXTBOOK.md` |
| **Arithmetic on stated numbers** | EasyLM calc hand |

```
CITE: stacks/finance/LINK_INDEX.md
```
