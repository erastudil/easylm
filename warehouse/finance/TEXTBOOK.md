---
title: "finance — undergrad textbook"
date: "2026-09-13"
status: living · easylm
home: "warehouse/finance/"
related:
  - "../math/"
  - "../methods/"
  - "../computing/"
  - "../law/"
  - "../civics/"
  - "EasyLM calc and units hands"
  - "warehouse/LAW.md"
---

# Finance — Undergraduate Foundations & Financial Architecture

A comprehensive undergraduate textbook covering financial accounting, time value of money, corporate finance, capital structure, fixed income, equity valuation, derivative contracts, modern portfolio theory, market microstructure, central banking, financial regulation, and personal wealth mechanics.

---

## 0. Syllabus & Structural Map

Finance is the science of **cash flows, claims, valuation, and risk across time under uncertainty**. Accounting is the measurement and communication system that records those claims. Economics provides the macro-environment of scarcity and incentives.

```
+---------------------------------------------------------------------------------------------------+
|                                   THE FINANCIAL ARCHITECTURE                                      |
+---------------------------------------------------------------------------------------------------+
|  ACCOUNTING (The Ledger)    | Double-Entry · Balance Sheet · Income Statement · Cash Flow · GAAP  |
+-----------------------------+---------------------------------------------------------------------+
|  VALUATION (The Clock)      | Time Value of Money · Discounted Cash Flow (DCF) · NPV / IRR · WACC |
+-----------------------------+---------------------------------------------------------------------+
|  CONTRACTS (The Claims)     | Equities · Bonds & Yield Curves · Options (Black-Scholes) · Swaps   |
+-----------------------------+---------------------------------------------------------------------+
|  INVESTING (The Portfolio)  | Modern Portfolio Theory · Efficient Frontier · CAPM · Factor Models |
+-----------------------------+---------------------------------------------------------------------+
|  MARKETS (The Mechanism)    | Order Books · Market Makers · Bid-Ask Spread · Clearing & Settlement|
+-----------------------------+---------------------------------------------------------------------+
|  MONEY & MACRO (The Engine) | Central Banks · Fractional Reserves · Repo Markets · Yield Curves   |
+-----------------------------+---------------------------------------------------------------------+
|  LAW & GOVERNANCE (Rules)   | SEC Acts (1933/34) · Dodd-Frank · Basel III/IV · Fiduciary Standards|
+---------------------------------------------------------------------------------------------------+
```

### Table of Contents

1. [Chapter 1: The Accounting Engine & Double-Entry Bookkeeping](#1-the-accounting-engine--double-entry-bookkeeping)
2. [Chapter 2: The Three Primary Financial Statements & Articulation](#2-the-three-primary-financial-statements--articulation)
3. [Chapter 3: Cash vs. Accrual & Working Capital Dynamics](#3-cash-vs-accrual--working-capital-dynamics)
4. [Chapter 4: Time Value of Money & Cash Flow Mathematics](#4-time-value-of-money--cash-flow-mathematics)
5. [Chapter 5: Capital Budgeting & Valuation Engines](#5-capital-budgeting--valuation-engines)
6. [Chapter 6: Capital Structure, Cost of Capital & Modigliani-Miller](#6-capital-structure-cost-of-capital--modigliani-miller)
7. [Chapter 7: Fixed Income & Debt Contracts](#7-fixed-income--debt-contracts)
8. [Chapter 8: Equity Instruments & Corporate Valuation](#8-equity-instruments--corporate-valuation)
9. [Chapter 9: Derivatives, Options & Hedging Mechanics](#9-derivatives-options--hedging-mechanics)
10. [Chapter 10: Modern Portfolio Theory & Asset Allocation](#10-modern-portfolio-theory--asset-allocation)
11. [Chapter 11: Market Microstructure, Order Books & Execution Mechanics](#11-market-microstructure-order-books--execution-mechanics)
12. [Chapter 12: Banking Systems, Central Banks & Monetary Mechanics](#12-banking-systems-central-banks--monetary-mechanics)
13. [Chapter 13: Financial Law, Regulation & Compliance Architecture](#13-financial-law-regulation--compliance-architecture)
14. [Chapter 14: Personal Finance, Capital Allocation & Tax Architecture](#14-personal-finance-capital-allocation--tax-architecture)
15. [Chapter 15: Scholarly Corpora, Primary Data Feeds & Citation Standards](#15-scholarly-corpora-primary-data-feeds--citation-standards)
16. [Chapter 16: Diagnostic Protocols & Financial Problem-Solving](#16-diagnostic-protocols--financial-problem-solving)

---

## 1. The Accounting Engine & Double-Entry Bookkeeping

Accounting is the formal information system that measures business activities, processes data into reports, and communicates results to decision-makers.

### 1.1 The Fundamental Accounting Equation

$$\mathbf{Assets} = \mathbf{Liabilities} + \mathbf{Equity}$$

- **Assets ($A$):** Probable future economic benefits obtained or controlled by a particular entity as a result of past transactions (Cash, Accounts Receivable, Inventory, Equipment, Real Estate, Patents).
- **Liabilities ($L$):** Probable future sacrifices of economic benefits arising from present obligations to transfer assets or provide services to other entities (Accounts Payable, Notes Payable, Bonds, Deferred Revenue).
- **Equity ($E$):** The residual interest in the assets of an entity that remains after deducting its liabilities ($E = A - L$). Also termed Net Worth, Net Assets, or Book Value.

$$\mathbf{Assets} = \mathbf{Liabilities} + (\mathbf{Contributed\ Capital} + \mathbf{Retained\ Earnings_{\text{Beginning}}} + \mathbf{Revenues} - \mathbf{Expenses} - \mathbf{Dividends})$$

### 1.2 The Debit-Credit Mechanism
Double-entry bookkeeping mandates that every financial transaction impacts at least two accounts, with total debits strictly equaling total credits.

$$\sum \text{Debits} = \sum \text{Credits}$$

```
+---------------------------------------------------------------------------------------------------+
| ACCOUNT TYPE          | NORMAL BALANCE   | INCREASE VIA       | DECREASE VIA                      |
+-----------------------+------------------+--------------------+-----------------------------------+
| Asset                 | Debit (Dr)       | Debit              | Credit                            |
| Expense               | Debit (Dr)       | Debit              | Credit                            |
| Dividend / Drawing    | Debit (Dr)       | Debit              | Credit                            |
+-----------------------+------------------+--------------------+-----------------------------------+
| Liability             | Credit (Cr)      | Credit             | Debit                             |
| Equity / Capital      | Credit (Cr)      | Credit             | Debit                             |
| Revenue / Income      | Credit (Cr)      | Credit             | Debit                             |
+---------------------------------------------------------------------------------------------------+
```

### 1.3 The Full Accounting Cycle

```
[1. Source Document] -> [2. Journal Entry] -> [3. General Ledger] -> [4. Unadjusted Trial Balance]
                                                                                    |
[8. Post-Close Trial] <- [7. Closing Entries] <- [6. Financial Statements] <- [5. Adjusting Entries]
```

1. **Transaction Analysis:** Identify economic events affecting financial position.
2. **Journalizing:** Record debits and credits chronologically in the General Journal.
3. **Posting:** Transfer journal debits and credits to individual T-accounts in the General Ledger.
4. **Unadjusted Trial Balance:** Verify arithmetic equality of total debit and credit balances.
5. **Adjusting Entries:** Record end-of-period adjustments (accruals, deferrals, depreciation).
6. **Financial Statements:** Prepare the Income Statement, Balance Sheet, and Statement of Cash Flows.
7. **Closing Entries:** Zero out temporary accounts (Revenues, Expenses, Dividends) into Retained Earnings.
8. **Post-Closing Trial Balance:** Confirm only permanent balance sheet accounts remain open.

---

## 2. The Three Primary Financial Statements & Articulation

Financial statements present the financial status and operational performance of an entity across specific time horizons.

```
+---------------------------------------------------------------------------------------------------+
| STATEMENT             | TIME HORIZON     | PRIMARY FUNCTION                                       |
+-----------------------+------------------+--------------------------------------------------------+
| Income Statement      | Period of Time   | Measures profitability: Revenue - Expenses = Net Income|
| Balance Sheet         | Point in Time    | Measures financial position: Assets = Liab + Equity    |
| Cash Flow Statement   | Period of Time   | Measures actual cash movements: Operating/Invest/Fin   |
+---------------------------------------------------------------------------------------------------+
```

### 2.1 The Multi-Step Income Statement

$$\begin{aligned}
\text{Gross Revenue} - \text{Returns/Discounts} &= \mathbf{Net\ Revenue} \\
\text{Net Revenue} - \text{Cost of Goods Sold (COGS)} &= \mathbf{Gross\ Profit} \\
\text{Gross Profit} - \text{Operating Expenses (SG\&A, R\&D, D\&A)} &= \mathbf{Operating\ Income\ (EBIT)} \\
\text{EBIT} + \text{Non-Operating Income} - \text{Interest\ Expense} &= \mathbf{Earnings\ Before\ Taxes\ (EBT)} \\
\text{EBT} - \text{Income\ Tax\ Expense} &= \mathbf{Net\ Income\ (EAT)}
\end{aligned}$$

$$\text{EBITDA} = \text{Operating Income (EBIT)} + \text{Depreciation} + \text{Amortization}$$

### 2.2 The Classified Balance Sheet

```
+---------------------------------------------------------------------------------------------------+
| ASSETS (Classified by Liquidity)          | LIABILITIES & EQUITY (Classified by Maturity)         |
+-------------------------------------------+-------------------------------------------------------+
| CURRENT ASSETS:                           | CURRENT LIABILITIES:                                  |
|   Cash and Cash Equivalents               |   Accounts Payable                                    |
|   Short-Term Marketable Securities        |   Short-Term Notes Payable / Line of Credit           |
|   Accounts Receivable (less Allowances)   |   Accrued Expenses (Wages, Taxes)                     |
|   Inventory (FIFO / LIFO / Weighted Avg)  |   Current Portion of Long-Term Debt (CPLTD)           |
|   Prepaid Expenses                        |   Deferred / Unearned Revenue                         |
| NON-CURRENT ASSETS:                       | LONG-TERM LIABILITIES:                                |
|   Property, Plant & Equipment (Gross)     |   Long-Term Bonds & Bank Debt                         |
|   less: Accumulated Depreciation          |   Lease Liabilities & Pension Obligations             |
|   Intangible Assets (Patents, Trademarks) | SHAREHOLDERS' EQUITY:                                 |
|   Goodwill                                |   Common Stock (Par Value) + Additional Paid-in (APIC)|
|   Long-Term Investments                   |   Retained Earnings (Cumulative Net Income - Divs)    |
|                                           |   less: Treasury Stock (Contra-Equity)                |
+-------------------------------------------+-------------------------------------------------------+
| TOTAL ASSETS                              | TOTAL LIABILITIES & SHAREHOLDERS' EQUITY              |
+---------------------------------------------------------------------------------------------------+
```

### 2.3 The Statement of Cash Flows (Indirect Method)
The cash flow statement reconciles beginning cash to ending cash across three distinct activity buckets:

1. **Cash Flow from Operating Activities ($\text{CFO}$):**
   $$\text{CFO} = \text{Net Income} + \text{Non-Cash Items (D\&A)} - \Delta \text{Non-Cash Current Assets} + \Delta \text{Current Liabilities}$$
2. **Cash Flow from Investing Activities ($\text{CFI}$):**
   $$\text{CFI} = - \text{Capital Expenditures (CapEx)} - \text{Acquisitions} + \text{Sale of PP\&E/Securities}$$
3. **Cash Flow from Financing Activities ($\text{CFF}$):**
   $$\text{CFF} = \text{Debt Issued} - \text{Debt Repaid} + \text{Stock Issued} - \text{Stock Repurchased} - \text{Dividends Paid}$$

$$\Delta \mathbf{Cash} = \text{CFO} + \text{CFI} + \text{CFF}$$

### 2.4 Articulation of the Three Statements

```
                 INCOME STATEMENT (Period t)
                 +--------------------------+
                 | Revenue                  |
                 | Expenses                 |
                 |--------------------------|
                 | NET INCOME ------------+ |
                 +------------------------|-+
                                          |
                                          v (feeder)
      STATEMENT OF CASH FLOWS             |      BALANCE SHEET (Date t)
      +-----------------------------+     |      +--------------------------+
      | CFO: Net Income <-----------+-----+----->| Retained Earnings        |
      |      + Depreciation         |            | (Prior RE + Net Income   |
      |      - Change in NWC        |            |  - Dividends)            |
      | CFI: CapEx                  |            |--------------------------|
      | CFF: Debt/Equity/Dividends  |            | Ending Cash <------------+
      |-----------------------------|            +--------------------------+
      | NET CHANGE IN CASH ---------+
      +-----------------------------+
```

---

## 3. Cash vs. Accrual & Working Capital Dynamics

Understanding the divergence between accounting profit and physical cash movement is critical to assessing solvency and operating runway.

### 3.1 Accrual Principles vs. Cash Accounting
- **Cash Basis:** Revenue is recognized only when cash is received; expenses are recognized only when cash is paid. Used by individuals, cash books, and small sole proprietorships.
- **Accrual Basis (GAAP/IFRS):**
  - **Revenue Recognition (ASC 606 / IFRS 15):** Revenue is recognized when performance obligations are satisfied, regardless of when cash is collected.
  - **Matching Principle:** Expenses are recognized in the same period as the revenues they helped generate.

### 3.2 Depreciation and Cost Allocation

$$\text{Straight-Line Depreciation} = \frac{\text{Historical Cost} - \text{Salvage Value}}{\text{Useful Life (Years)}}$$

$$\text{Double-Declining Balance (DDB)} = \text{Book Value at Start of Year} \times \left( \frac{2}{\text{Useful Life}} \right)$$

*Note:* Depreciation is a non-cash expense that shields operating income from corporate taxation:

$$\text{Depreciation Tax Shield} = \text{Depreciation Expense} \times \text{Marginal Tax Rate } (T_c)$$

### 3.3 Working Capital Metrics & The Cash Conversion Cycle

$$\mathbf{Net\ Working\ Capital\ (NWC)} = \text{Current Assets} - \text{Current Liabilities}$$

$$\mathbf{Operating\ Working\ Capital\ (OWC)} = (\text{Current Assets} - \text{Cash}) - (\text{Current Liabilities} - \text{Short-Term Debt})$$

```
+---------------------------------------------------------------------------------------------------+
| METRIC                           | FORMULA                                                        |
+----------------------------------+----------------------------------------------------------------+
| Days Inventory Outstanding (DIO) | $\text{DIO} = \frac{\text{Average Inventory}}{\text{COGS}} \times 365$ |
| Days Sales Outstanding (DSO)     | $\text{DSO} = \frac{\text{Average AR}}{\text{Total Credit Sales}} \times 365$ |
| Days Payable Outstanding (DPO)   | $\text{DPO} = \frac{\text{Average AP}}{\text{COGS (or Purchases)}} \times 365$ |
| Cash Conversion Cycle (CCC)      | $\mathbf{CCC} = \text{DIO} + \text{DSO} - \text{DPO}$          |
+---------------------------------------------------------------------------------------------------+
```

A negative Cash Conversion Cycle (e.g., Amazon, Dell) means the business collects cash from customers before paying suppliers, generating zero-cost float to finance operations.

---

## 4. Time Value of Money & Cash Flow Mathematics

The core axiom of financial mathematics: **A dollar received today is worth more than a dollar received in the future** due to its earning potential (opportunity cost of capital, inflation, and risk).

### 4.1 Discrete and Continuous Compounding

```
+--------------------------+------------------------------------+-----------------------------------+
| Compounding Frequency    | Future Value (FV)                  | Present Value (PV)                |
+--------------------------+------------------------------------+-----------------------------------+
| Simple Interest          | $FV = PV(1 + r \cdot t)$           | $PV = \frac{FV}{1 + r \cdot t}$   |
| Discrete ($m$ times/yr)  | $FV = PV\left(1 + \frac{r}{m}\right)^{m \cdot t}$ | $PV = \frac{FV}{\left(1 + \frac{r}{m}\right)^{m \cdot t}}$ |
| Annual ($m = 1$)         | $FV = PV(1 + r)^t$                 | $PV = \frac{FV}{(1 + r)^t}$       |
| Continuous ($m \to \infty$)| $FV = PV \cdot e^{r \cdot t}$    | $PV = FV \cdot e^{-r \cdot t}$    |
+--------------------------+------------------------------------+-----------------------------------+
```

### 4.2 Nominal APR vs. Effective Annual Rate (EAR)
The Annual Percentage Rate (APR) is a nominal quotation that ignores compounding within the year. The Effective Annual Rate (EAR) reflects the true economic yield:

$$\mathbf{EAR} = \left(1 + \frac{\text{APR}}{m}\right)^m - 1 \qquad \mathbf{EAR}_{\text{continuous}} = e^{\text{APR}} - 1$$

### 4.3 Annuity and Perpetuity Formulas

$$\text{Ordinary Annuity Present Value } (\text{Payments at End of Period } t=1 \dots n): \quad \mathbf{PV} = C \left[ \frac{1 - (1 + r)^{-n}}{r} \right]$$

$$\text{Annuity Due Present Value } (\text{Payments at Beginning of Period } t=0 \dots n-1): \quad \mathbf{PV}_{\text{due}} = \mathbf{PV}_{\text{ordinary}} \times (1 + r)$$

$$\text{Growing Annuity Present Value } (\text{Cash flow grows at rate } g < r): \quad \mathbf{PV} = \frac{C_1}{r - g} \left[ 1 - \left(\frac{1 + g}{1 + r}\right)^n \right]$$

$$\text{Perpetuity Present Value } (n \to \infty): \quad \mathbf{PV} = \frac{C}{r}$$

$$\text{Growing Perpetuity (Gordon Growth Model):} \quad \mathbf{PV} = \frac{C_1}{r - g} \quad (r > g)$$

### 4.4 Loan Amortization Mathematics
For a fully amortizing fixed-rate loan of principal $P_0$ over $n$ periods at rate $r$ per period, the level periodic payment $PMT$ is:

$$PMT = P_0 \left[ \frac{r(1 + r)^n}{(1 + r)^n - 1} \right]$$

- **Interest Payment in Period $t$:** $I_t = \text{Balance}_{t-1} \times r$
- **Principal Payment in Period $t$:** $P_t = PMT - I_t$
- **Ending Balance in Period $t$:** $\text{Balance}_t = \text{Balance}_{t-1} - P_t$

---

## 5. Capital Budgeting & Valuation Engines

Capital budgeting is the corporate decision process for allocating capital toward long-term investment projects.

### 5.1 Decision Rules: NPV, IRR, and Payback

```
+---------------------------------------------------------------------------------------------------+
| METHOD                  | FORMULA & DECISION CRITERION                                            |
+-------------------------+-------------------------------------------------------------------------+
| Net Present Value (NPV) | $\mathbf{NPV} = \sum_{t=0}^N \frac{CF_t}{(1 + r)^t} - \text{Initial\ Outlay}$ |
|                         | *Criterion:* Accept if $\text{NPV} > 0$. The gold standard for value.   |
+-------------------------+-------------------------------------------------------------------------+
| Internal Rate of Return | $\sum_{t=0}^N \frac{CF_t}{(1 + \text{IRR})^t} = 0$                      |
| (IRR)                   | *Criterion:* Accept if $\text{IRR} > \text{Hurdle Rate } (r)$.          |
|                         | *Pitfalls:* Multiple IRRs if signs alternate; scale insensitivity.      |
+-------------------------+-------------------------------------------------------------------------+
| Profitability Index     | $\mathbf{PI} = \frac{\sum_{t=1}^N \frac{CF_t}{(1 + r)^t}}{\text{Initial\ Outlay}} = \frac{\text{NPV} + \text{Outlay}}{\text{Outlay}}$ |
| (PI)                    | *Criterion:* Accept if $\text{PI} > 1.0$. Optimizes under capital rationing.|
+-------------------------+-------------------------------------------------------------------------+
| Payback Period          | Time $T$ such that $\sum_{t=1}^T CF_t = \text{Initial\ Outlay}$.         |
|                         | *Pitfalls:* Ignores TVM and all cash flows after payback cutoff.        |
+---------------------------------------------------------------------------------------------------+
```

### 5.2 Discounted Cash Flow (DCF) Valuation Architecture

$$\mathbf{Enterprise\ Value\ (EV)} = \sum_{t=1}^T \frac{\text{FCFF}_t}{(1 + \text{WACC})^t} + \frac{\text{Terminal\ Value}_T}{(1 + \text{WACC})^T}$$

1. **Free Cash Flow to Firm ($\text{FCFF}$):**
   $$\text{FCFF} = \text{EBIT}(1 - T_c) + \text{D\&A} - \text{CapEx} - \Delta \text{NWC}$$
2. **Free Cash Flow to Equity ($\text{FCFE}$):**
   $$\text{FCFE} = \text{Net Income} + \text{D\&A} - \text{CapEx} - \Delta \text{NWC} + \text{Net Debt Issued}$$
3. **Terminal Value ($\text{TV}$):**
   $$\text{Perpetuity Growth Method:} \quad \text{TV}_T = \frac{\text{FCFF}_{T+1}}{\text{WACC} - g} = \frac{\text{FCFF}_T (1 + g)}{\text{WACC} - g}$$
   $$\text{Exit Multiple Method:} \quad \text{TV}_T = \text{EBITDA}_T \times (\text{Target EV/EBITDA Multiple})$$

$$\mathbf{Equity\ Value} = \mathbf{Enterprise\ Value} - \text{Total Debt} - \text{Preferred Stock} - \text{Minority Interest} + \text{Cash}$$

$$\mathbf{Fair\ Value\ per\ Share} = \frac{\mathbf{Equity\ Value}}{\text{Diluted Shares Outstanding}}$$

---

## 6. Capital Structure, Cost of Capital & Modigliani-Miller

How a firm funds its overall operations and growth through a mix of debt, equity, and hybrid securities.

### 6.1 The Weighted Average Cost of Capital (WACC)

$$\mathbf{WACC} = \left( \frac{E}{V} \right) r_e + \left( \frac{D}{V} \right) r_d (1 - T_c) + \left( \frac{P}{V} \right) r_p$$

- $E = \text{Market Value of Equity}, \quad D = \text{Market Value of Debt}, \quad P = \text{Market Value of Preferred Stock}$
- $V = E + D + P = \text{Total Capital Structure}$
- $r_e = \text{Cost of Equity}, \quad r_d = \text{Pre-Tax Cost of Debt}, \quad r_p = \text{Cost of Preferred Stock}$
- $T_c = \text{Marginal Corporate Income Tax Rate}$
- $(1 - T_c) = \text{Interest Tax Shield adjustment}$

### 6.2 Cost of Equity via CAPM

$$r_e = r_f + \beta_e (r_m - r_f)$$

- $r_f = \text{Risk-Free Rate (e.g., 10-Year US Treasury yield)}$
- $\beta_e = \text{Equity Beta (Systematic risk coefficient)}$
- $(r_m - r_f) = \text{Equity Risk Premium (ERP)}$

**Unlevering and Relevering Beta (Hamada's Equation):**
$$\beta_{\text{unlevered}} = \frac{\beta_{\text{levered}}}{1 + (1 - T_c)\left(\frac{D}{E}\right)} \qquad \beta_{\text{levered}} = \beta_{\text{unlevered}} \left[ 1 + (1 - T_c)\left(\frac{D}{E}\right) \right]$$

### 6.3 Modigliani-Miller Capital Structure Theorems

```
+---------------------------------------------------------------------------------------------------+
| THEOREM                         | KEY PROPOSITION                                                 |
+---------------------------------+-----------------------------------------------------------------+
| MM Proposition I (No Taxes)     | Firm value is independent of capital structure: $V_U = V_L$.    |
| (1958)                          | Operating earnings and asset risk determine value, not funding. |
+---------------------------------+-----------------------------------------------------------------+
| MM Proposition II (No Taxes)    | Cost of equity rises linearly with financial leverage:           |
| (1958)                          | $r_e = r_0 + \frac{D}{E}(r_0 - r_d)$. Risk offsets cheap debt.  |
+---------------------------------+-----------------------------------------------------------------+
| MM Proposition I (With Taxes)   | Debt adds value via interest tax shield: $V_L = V_U + T_c D$.   |
| (1963)                          | Optimal structure theoretically approaches 100% debt.           |
+---------------------------------+-----------------------------------------------------------------+
| Trade-Off Theory (Modern)       | $V_L = V_U + \text{PV(Tax Shields)} - \text{PV(Financial Distress Costs)}$.|
|                                 | Balances tax deductibility against bankruptcy/agency costs.     |
+---------------------------------------------------------------------------------------------------+
```

---

## 7. Fixed Income & Debt Contracts

Debt contracts represent legally binding obligations to repay borrowed capital according to explicit interest schedules.

### 7.1 Bond Pricing Formula

$$P_0 = \sum_{t=1}^{n \cdot m} \frac{\frac{C}{m}}{\left(1 + \frac{y}{m}\right)^t} + \frac{F}{\left(1 + \frac{y}{m}\right)^{n \cdot m}}$$

- $P_0 = \text{Clean Price of the Bond}, \quad F = \text{Face / Par Value (typically \$1,000)}$
- $C = \text{Annual Coupon Payment } (C = \text{Coupon Rate} \times F)$
- $m = \text{Coupon Frequency per year (e.g., } m=2 \text{ for semi-annual)}$
- $y = \text{Yield to Maturity (YTM)}, \quad n = \text{Years to Maturity}$

$$\text{Dirty Price (Invoice Price)} = \text{Clean Price} + \text{Accrued Interest}$$

$$\text{Accrued Interest} = \frac{C}{m} \times \left( \frac{\text{Days since last coupon}}{\text{Days in coupon period}} \right)$$

### 7.2 Yield Curve Morphology & Term Structure Theories

```
YIELD
  ^
  |          Normal (Upward sloping: Long rates > Short rates)
  |        . - ~ ~ ~ - .
  |     . '              Inverted (Short rates > Long rates: Recession signal)
  |   . - - - - - - - - - - .
  |  '                        ` .
  +-------------------------------------> MATURITY
```

1. **Pure Expectations Theory:** Forward rates represent unbiased market expectations of future spot rates.
2. **Liquidity Preference Theory:** Investors demand an extra term premium for locking up capital in long-duration debt.
3. **Segmented Markets / Preferred Habitat Theory:** Institutional supply and demand within specific maturity buckets determine yields independently.

### 7.3 Interest Rate Risk: Duration and Convexity

$$\mathbf{Macaulay\ Duration\ (D_{\text{mac}})} = \frac{\sum_{t=1}^N \frac{t \cdot CF_t}{(1+y)^t}}{P_0} \quad (\text{Weighted average time to receive cash flows, in years})$$

$$\mathbf{Modified\ Duration\ (D^*)} = \frac{D_{\text{mac}}}{1 + \frac{y}{m}} \qquad \frac{\Delta P}{P} \approx - D^* \cdot \Delta y$$

$$\mathbf{Dollar\ Duration\ (DV01)} = D^* \times P_0 \times 0.0001 \quad (\text{Price change per 1 basis point shift in yield})$$

$$\mathbf{Convexity\ (C)} = \frac{1}{P_0 (1+y)^2} \sum_{t=1}^N \frac{t(t+1) CF_t}{(1+y)^t}$$

$$\text{Total Price Approximation (Second-Order Taylor Series):} \quad \frac{\Delta P}{P} \approx - D^* \Delta y + \frac{1}{2} C (\Delta y)^2$$

---

## 8. Equity Instruments & Corporate Valuation

Equities represent residual ownership stakes in the assets and cash flows of an enterprise after all debt obligations are satisfied.

### 8.1 Dividend Discount Models (DDM)

$$\text{Constant Growth DDM (Gordon):} \quad P_0 = \frac{D_1}{r_e - g} = \frac{D_0 (1 + g)}{r_e - g} \quad (r_e > g)$$

$$\text{Sustainable Growth Rate } (g): \quad g = \text{ROE} \times b = \text{ROE} \times (1 - \text{Dividend Payout Ratio})$$

$$\text{Two-Stage DDM:} \quad P_0 = \sum_{t=1}^T \frac{D_0 (1 + g_{\text{high}})^t}{(1 + r_e)^t} + \frac{D_T (1 + g_{\text{stable}})}{(r_e - g_{\text{stable}})(1 + r_e)^T}$$

### 8.2 Relative Valuation Multiples

```
+---------------------------------------------------------------------------------------------------+
| MULTIPLE               | FORMULA                                | USE CASE & INTERPRETATION       |
+------------------------+----------------------------------------+---------------------------------+
| Price-to-Earnings (P/E)| $\text{P/E} = \frac{\text{Price per Share}}{\text{EPS}}$ | Compares equity price to net profit.|
| Enterprise Multiple    | $\frac{\text{Enterprise Value}}{\text{EBITDA}}$ | Capital-structure-neutral firm value.|
| Price-to-Book (P/B)    | $\text{P/B} = \frac{\text{Price per Share}}{\text{Book Value per Share}}$ | Useful for banks and capital-heavy firms.|
| PEG Ratio              | $\text{PEG} = \frac{\text{P/E Ratio}}{\text{Earnings Growth Rate } g}$ | Normalizes P/E for projected growth.|
+---------------------------------------------------------------------------------------------------+
```

---

## 9. Derivatives, Options & Hedging Mechanics

Derivatives are financial contracts whose value is derived from the performance of an underlying asset, index, or rate.

### 9.1 Forwards, Futures, and Swaps
- **Forward Contract:** Customized, private, over-the-counter (OTC) agreement between two parties to buy/sell an asset at a specified future date for a predetermined forward price ($F_0 = S_0 e^{(r+c-y)T}$). Settlement occurs at maturity; carries counterparty credit risk.
- **Futures Contract:** Standardized, exchange-traded contract with daily mark-to-market settlement, guaranteed by a central clearinghouse.
  - **Initial Margin:** Deposit required to open a futures position.
  - **Maintenance Margin:** Minimum equity required; falling below triggers a **Margin Call** requiring immediate cash deposit to restore the account to the initial margin level.
- **Interest Rate Swap:** An agreement where Party A pays a fixed interest rate on a notional principal while Party B pays a floating rate (e.g., SOFR).

### 9.2 Options Fundamentals & Put-Call Parity
- **Call Option:** The right, but not obligation, to **buy** underlying asset $S$ at strike price $K$ on or before expiration $T$.
  $$\text{Call Payoff at Expiration:} \quad C_T = \max(0, S_T - K)$$
- **Put Option:** The right, but not obligation, to **sell** underlying asset $S$ at strike price $K$ on or before expiration $T$.
  $$\text{Put Payoff at Expiration:} \quad P_T = \max(0, K - S_T)$$

$$\mathbf{Put\text{-}Call\ Parity\ (European\ Options):} \quad C + K e^{-rT} = P + S_0$$

### 9.3 The Black-Scholes-Merton (BSM) Model

$$C(S, t) = S_0 N(d_1) - K e^{-rT} N(d_2) \qquad P(S, t) = K e^{-rT} N(-d_2) - S_0 N(-d_1)$$

$$d_1 = \frac{\ln(S_0 / K) + \left(r + \frac{\sigma^2}{2}\right)T}{\sigma \sqrt{T}} \qquad d_2 = d_1 - \sigma \sqrt{T}$$

- $S_0 = \text{Current Stock Price}, \quad K = \text{Strike Price}, \quad r = \text{Risk-Free Interest Rate}$
- $T = \text{Time to Expiration (Years)}, \quad \sigma = \text{Implied Volatility of Underlying Asset}$
- $N(\cdot) = \text{Standard Normal Cumulative Distribution Function}$

### 9.4 The Option Greeks

```
+---------------------------------------------------------------------------------------------------+
| GREEK         | DEFINITION                                 | FORMULA (Call)   | SENSITIVITY       |
+---------------+--------------------------------------------+------------------+-------------------+
| Delta ($\Delta$) | Rate of change of option price w.r.t. stock price | $\frac{\partial C}{\partial S} = N(d_1)$ | Directional risk  |
| Gamma ($\Gamma$) | Rate of change of Delta w.r.t. stock price | $\frac{\partial^2 C}{\partial S^2} = \frac{N'(d_1)}{S \sigma \sqrt{T}}$ | Delta stability   |
| Theta ($\Theta$) | Rate of change of option price w.r.t. time (Time decay) | $\frac{\partial C}{\partial t}$ | Daily time loss   |
| Vega ($\nu$)  | Rate of change of option price w.r.t. volatility | $\frac{\partial C}{\partial \sigma} = S \sqrt{T} N'(d_1)$ | Volatility risk   |
| Rho ($\rho$)  | Rate of change of option price w.r.t. interest rates | $\frac{\partial C}{\partial r} = K T e^{-rT} N(d_2)$ | Rate risk         |
+---------------------------------------------------------------------------------------------------+
```

---

## 10. Modern Portfolio Theory & Asset Allocation

Modern Portfolio Theory (Harry Markowitz, 1952) formalizes how risk-averse investors construct optimal portfolios to maximize expected return for a given level of market risk.

### 10.1 Two-Asset Portfolio Mathematics

$$E(R_p) = w_A E(R_A) + w_B E(R_B) \quad \text{where } w_A + w_B = 1$$

$$\sigma_p^2 = w_A^2 \sigma_A^2 + w_B^2 \sigma_B^2 + 2 w_A w_B \text{Cov}(R_A, R_B) = w_A^2 \sigma_A^2 + w_B^2 \sigma_B^2 + 2 w_A w_B \rho_{AB} \sigma_A \sigma_B$$

When correlation $\rho_{AB} < 1.0$, portfolio variance $\sigma_p$ is strictly less than the weighted average of individual asset variances. This is the **mathematical proof of diversification** (the only "free lunch" in finance).

### 10.2 The Efficient Frontier & Capital Allocation Line (CAL)

```
EXPECTED RETURN E(R)
  ^
  |                                 / Capital Allocation Line (CAL)
  |                               /
  |                      [Tangency Portfolio M]
  |                     . - ~ ~ ~ - .   <-- Markowitz Efficient Frontier
  |                  . '             `.
  |               . '
  |  [Risk-Free Rf]
  |
  +---------------------------------------------> VOLATILITY / RISK (Sigma)
```

- **Efficient Frontier:** The set of optimal portfolios that offer the highest expected return for a defined level of risk.
- **Capital Allocation Line (CAL):** The linear combination of the risk-free asset and the optimal risky portfolio $M$.
  $$\text{Slope of CAL (Sharpe Ratio of } M) = \frac{E(R_M) - R_f}{\sigma_M}$$

### 10.3 Risk-Adjusted Performance Metrics

```
+---------------------------------------------------------------------------------------------------+
| METRIC               | FORMULA                                      | PURPOSE                     |
+----------------------+----------------------------------------------+-----------------------------+
| Sharpe Ratio         | $\text{Sharpe} = \frac{R_p - R_f}{\sigma_p}$ | Excess return per unit of   |
|                      |                                              | total risk ($\sigma$).      |
| Sortino Ratio        | $\text{Sortino} = \frac{R_p - R_f}{\sigma_{\text{downside}}}$ | Penalizes only downside vol.|
| Treynor Ratio        | $\text{Treynor} = \frac{R_p - R_f}{\beta_p}$ | Excess return per unit of   |
|                      |                                              | systematic risk ($\beta$).  |
| Jensen's Alpha       | $\alpha = R_p - [R_f + \beta_p(R_m - R_f)]$  | Value added above CAPM bench.|
| Information Ratio    | $\text{IR} = \frac{R_p - R_b}{\sigma(R_p - R_b)}$ | Active return vs. tracking error.|
+---------------------------------------------------------------------------------------------------+
```

### 10.4 Multifactor Asset Pricing Models

$$\text{Fama-French 3-Factor Model (1993):} \quad E(R_i) - R_f = \beta_{i1}(R_m - R_f) + \beta_{i2}\mathbf{SMB} + \beta_{i3}\mathbf{HML}$$

- $\mathbf{SMB} \text{ (Small Minus Big):}$ Size risk factor premium.
- $\mathbf{HML} \text{ (High Minus Low):}$ Value risk factor premium (High Book-to-Market vs. Low Book-to-Market).

$$\text{Carhart 4-Factor Model (1997):} \quad + \beta_{i4}\mathbf{WML} \quad (\text{Winners Minus Losers / Momentum})$$

---

## 11. Market Microstructure, Order Books & Execution Mechanics

Market microstructure studies the operational mechanisms, rules, and behavior of trading venues through which buyer and seller intentions are transformed into executed transactions.

### 11.1 The Limit Order Book (LOB) Architecture

```
                  LIMIT ORDER BOOK (LOB)
  --------------------------------------------------------
   ASK DEPTH (Sellers)     PRICE ($)     BID DEPTH (Buyers)
  --------------------------------------------------------
         1,200             100.05
           800             100.04
           500             100.03  <-- Lowest Ask / Offer
  ========================================================  Spread = $0.02
                           100.01  <-- Highest Bid
                                         1,500
                                         2,100
  --------------------------------------------------------
```

$$\mathbf{Bid\text{-}Ask\ Spread} = \text{Lowest Ask Price} - \text{Highest Bid Price}$$

$$\mathbf{Mid\ Price} = \frac{\text{Highest Bid} + \text{Lowest Ask}}{2}$$

### 11.2 Order Typology & Execution Dynamics
- **Market Order:** Immediate execution at the best currently available price in the order book. Consumes liquidity (pays the bid-ask spread).
- **Limit Order:** Order to buy/sell at a specified price or better. Rests in the book, providing liquidity (earns the spread or waits for match).
- **Stop-Loss Order:** Becomes an active market order once a designated stop price is triggered, limiting downside loss.
- **Slippage / Market Impact:** The difference between the expected price of a trade and the actual executed average price, caused by large orders consuming multiple depth tiers of the LOB.

### 11.3 Clearing, Settlement & Custody Infrastructure
- **Trade Execution (T+0):** Legal agreement on price and quantity.
- **Clearing (Central Counterparty / CCP):** Novation process where the clearinghouse (e.g., DTCC, OCC) becomes the buyer to every seller and seller to every buyer, eliminating bilateral counterparty risk.
- **Settlement ($T+1$ standard):** Delivery of securities versus payment (DvP) transferring legal ownership.

---

## 12. Banking Systems, Central Banks & Monetary Mechanics

How the financial architecture creates money, channels liquidity, and executes monetary policy.

### 12.1 Fractional Reserve Banking & Money Creation

```
Central Bank reserves ($100) -> Commercial Bank A loans $90 (holds $10 reserve)
                             -> Deposited in Bank B
                             -> Bank B loans $81 (holds $9 reserve) -> ...
```

$$\text{Theoretical Simple Money Multiplier} = \frac{1}{\text{Reserve Requirement Ratio } (RRR)}$$

In modern banking systems, commercial banks create new deposit money *endogenously* whenever they originate loans, constrained by capital adequacy ratios (Basel III), liquidity buffers, and borrower creditworthiness.

### 12.2 Central Bank Policy Toolset
1. **Target Policy Rate (Federal Funds Rate / Overnight Rate):** The interest rate commercial banks charge each other for overnight uncollateralized loans of reserves.
2. **Interest on Reserve Balances (IORB):** The rate paid by the central bank to commercial banks on reserves held, establishing the floor for short-term money market rates.
3. **Open Market Operations (OMO):** The buying and selling of government securities to inject or drain reserve balances.
4. **Quantitative Easing (QE) & Quantitative Tightening (QT):** Large-scale asset purchases (expanding central bank balance sheet) to suppress long-term yields vs. allowing bonds to mature without reinvestment (contracting balance sheet).
5. **Repurchase Agreements (Repo) & Reverse Repo (RRP):**
   - **Repo:** Sale of securities combined with an agreement to repurchase them at a higher price the next day (collateralized loan).
   - **Overnight Reverse Repo Facility (ON RRP):** Financial institutions deposit cash with the central bank overnight against Treasury collateral, setting a hard floor on money market yields.

---

## 13. Financial Law, Regulation & Compliance Architecture

The legal and regulatory framework protecting market integrity, preventing systemic collapse, and mitigating fraud.

```
+---------------------------------------------------------------------------------------------------+
| REGULATION / STATUTE      | JURISDICTION & MANDATE                                                |
+---------------------------+-----------------------------------------------------------------------+
| Securities Act of 1933    | US: Regulates primary securities offerings; mandates full prospectus   |
|                           | registration and disclosure (Form S-1). "Truth in Securities".        |
+---------------------------+-----------------------------------------------------------------------+
| Securities Exchange Act   | US: Created the SEC; regulates secondary trading, brokers, exchanges, |
| of 1934                   | and periodic corporate reporting (10-K, 10-Q, 8-K, Proxy Statements).  |
+---------------------------+-----------------------------------------------------------------------+
| Investment Advisers Act   | US: Establishes fiduciary duty for registered investment advisers     |
| of 1940                   | (RIAs), requiring undivided loyalty and disclosure of conflicts.      |
+---------------------------+-----------------------------------------------------------------------+
| Sarbanes-Oxley Act (SOX)  | US (2002): Section 404 internal financial controls; CEO/CFO personal  |
|                           | certification of financial statements; independent audit oversight.   |
+---------------------------+-----------------------------------------------------------------------+
| Dodd-Frank Wall Street    | US (2010): Volcker Rule (bans proprietary trading by deposit banks);  |
| Reform Act                | CFPB creation; mandatory clearing of OTC derivatives; stress tests.   |
+---------------------------+-----------------------------------------------------------------------+
| Basel III / IV Accords    | Global (BIS): Mandates bank capital adequacy (CET1 $\ge 4.5\%$,       |
|                           | Total Capital $\ge 8\%$), Liquidity Coverage Ratio (LCR), and NSFR.   |
+---------------------------------------------------------------------------------------------------+
```

---

## 14. Personal Finance, Capital Allocation & Tax Architecture

Applying financial principles to household solvency, liquidity preservation, tax optimization, and long-term capital accumulation.

### 14.1 The Wealth Accumulation Protocol

```
+---------------------------------------------------------------------------------------------------+
| STEP 1: LIQUIDITY RUNWAY  | Maintain 3-6 months of living expenses in cash / short Treasury bills.|
+---------------------------+-----------------------------------------------------------------------+
| STEP 2: HIGH-INTEREST DEBT| Aggressively eliminate consumer debt with APR > 7% (Credit cards, etc)|
+---------------------------+-----------------------------------------------------------------------+
| STEP 3: MATCH CAPTURE     | Maximize employer retirement plan match (Immediate 100% ROI).         |
+---------------------------+-----------------------------------------------------------------------+
| STEP 4: TAX-ADVANTAGED    | Fully fund Health Savings Account (HSA), Roth IRA, and 401(k)/403(b). |
+---------------------------+-----------------------------------------------------------------------+
| STEP 5: TAXABLE BROKERAGE | Invest surplus in diversified, low-cost broad market index funds.    |
+---------------------------------------------------------------------------------------------------+
```

### 14.2 Tax Architecture: Vehicle Comparison

```
+-------------------+--------------------+--------------------+-------------------------------------+
| Vehicle           | Contributions      | Growth             | Withdrawals                         |
+-------------------+--------------------+--------------------+-------------------------------------+
| Traditional 401k  | Pre-Tax (Deductible| Tax-Deferred       | Taxed as Ordinary Income at current |
| / Traditional IRA | from gross income) |                    | retirement tax bracket.             |
+-------------------+--------------------+--------------------+-------------------------------------+
| Roth 401k         | Post-Tax (No       | Tax-Free           | Completely Tax-Free after age 59½   |
| / Roth IRA        | upfront deduction) |                    | and 5-year account seasoning.       |
+-------------------+--------------------+--------------------+-------------------------------------+
| Health Savings    | Pre-Tax            | Tax-Free           | Completely Tax-Free when used for   |
| Account (HSA)     | (Triple Tax-Adv.)  |                    | qualified medical expenses.         |
+-------------------+--------------------+--------------------+-------------------------------------+
| Taxable Account   | Post-Tax           | Taxed on dividends | Capital Gains Tax rates (Long-Term  |
|                   |                    | & realized gains   | 0%/15%/20% if held > 1 year).       |
+-------------------+--------------------+--------------------+-------------------------------------+
```

---

## 15. Scholarly Corpora, Primary Data Feeds & Citation Standards

Rigorous financial analysis requires direct integration with verified primary data sources and standard academic literature.

### 15.1 Authoritative Financial Data Doors

| Domain | Entity / Repository | Target Search Query | Official Door |
|---|---|---|---|
| **Macroeconomic Time Series** | Federal Reserve Bank of St. Louis (FRED) | `FRED St Louis Fed [series ID]` | https://fred.stlouisfed.org/ |
| **SEC Corporate Filings** | SEC EDGAR Database | `SEC EDGAR company filings search` | https://www.sec.gov/edgar |
| **US Accounting Standards** | Financial Accounting Standards Board (FASB) | `FASB Accounting Standards Codification` | https://www.fasb.org/ |
| **International Standards** | IFRS Foundation / IASB | `IFRS accounting standards search` | https://www.ifrs.org/ |
| **Fiscal Data & Debt** | US Department of the Treasury | `Treasury Fiscal Data portal` | https://fiscaldata.treasury.gov/ |
| **Price Indices & Labor** | Bureau of Labor Statistics (BLS) | `BLS Consumer Price Index CPI` | https://www.bls.gov/cpi/ |
| **National Accounts / GDP** | Bureau of Economic Analysis (BEA) | `BEA Gross Domestic Product data` | https://www.bea.gov/ |
| **Central Bank Research** | Bank for International Settlements (BIS) | `BIS statistics and research papers` | https://www.bis.org/ |
| **Global Macro & Debt** | International Monetary Fund (IMF) | `IMF World Economic Outlook database` | https://www.imf.org/ |

### 15.2 Anti-Hallucination Law in Financial Computation
1. **Never Remember Live Quotes:** Asset prices, yields, exchange rates, and index prints change continuously. Always fetch live data or declare the historical timestamp.
2. **Never Guess Tax Brackets:** Statutory tax rates, contribution limits, and phaseouts are fixed by statute and annual inflation adjustments. Consult IRS doors.
3. **Execute via Deterministic Arithmetic:** Execute all TVM, NPV, IRR, WACC, and option calculations using deterministic calculation tools (`calc`) on stated parameters.

---

## 16. Diagnostic Protocols & Financial Problem-Solving

When analyzing any financial situation, contract, or problem, execute this standardized diagnostic protocol:

```
+---------------------------------------------------------------------------------------------------+
| FINANCIAL DIAGNOSTIC PROTOCOL                                                                     |
+---------------------------------------------------------------------------------------------------+
|  1. CLASSIFY RECORD       -> Is this Cash or Accrual? (Household cash books vs corporate accrual)|
|  2. IDENTIFY STATEMENT    -> Balance Sheet (date), Income Statement (period), or Cash Flow?       |
|  3. MAP THE TIME HORIZON  -> Define cash flow timing $t_0 \dots t_n$ and state discount rate $r$. |
|  4. CHECK IDENTITY        -> Confirm Assets = Liabilities + Equity and debits equal credits.      |
|  5. VALUATE CASH FLOWS    -> Compute NPV / DCF using deterministic arithmetic on stated numbers.  |
|  6. AUDIT RISKS           -> Differentiate idiosyncratic risk from systematic beta exposure.      |
|  7. AUDIT STATUTE / TAX   -> Verify statutory compliance and tax incidence against official doors.|
+---------------------------------------------------------------------------------------------------+
```

### 16.1 Diagnostic Matrix: Fatal Financial Pathologies

| Diagnostic Failure | Underlying Error | Algorithmic Correction |
|---|---|---|
| **Profit-Cash Conflation** | Treating net income as cash available to spend | Audit Cash Flow from Operations ($\text{CFO}$). |
| **Balance Sheet Discrepancy**| Total debits do not equal total credits | Locate the omitted offsetting journal entry. |
| **Mystery Discount Rate** | Computing NPV without stating hurdle rate $r$ | Explicitly state $r$ based on WACC or Treasury yield.|
| **APR / EAR Confusion** | Treating nominal APR as effective annual compounding| Convert via $\text{EAR} = (1 + r/m)^m - 1$. |
| **Sunk Cost Fallacy** | Factoring past unrecoverable outlays into NPV | Exclude past costs; evaluate purely incremental cash.|
| **Single-Name Concentration**| Relying on a single asset's past performance | Diversify non-systematic risk; calculate portfolio $\sigma_p$.|
| **Hallucinated Market Data** | Stating a stock price or yield from memory | Fetch live quote from verified host or state DONT_KNOW.|
| **Unauthorized Transfer** | Treating a textbook as a license to move money | Stop. This book does not transfer funds. An admitted, licensed intermediary executes. |

---

## 17. Summary & Closure

Finance connects present decisions to future outcomes through the discipline of accounting and the mathematics of valuation. Verify the identity, name the rate, fetch the price, and ground every claim in verifiable cash.

```
CITE: warehouse/finance/TEXTBOOK.md
```
