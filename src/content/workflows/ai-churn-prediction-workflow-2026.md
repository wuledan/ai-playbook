---
title: "AI Churn Prediction & Intervention Workflow 2026 — Predict Who Leaves Before They Go"
date: 2026-06-01
author: "AIPlaybook Editorial Team"
category: "Business"
tags: [workflow, churn-prediction, machine-learning, bigquery, vertex-ai, braze, customer-success]
cover: "/images/workflows/ai-churn-prediction-workflow-2026/cover.png"
meta_description: "Build a production-grade ML-powered churn prediction pipeline using BigQuery ML and Vertex AI. Predict churn 30 days early with 85%+ precision."
---

## Overview

Churn prediction is the most impactful machine learning application for any subscription business — reducing churn from 5% to 4% compounds into massive revenue gains over time. Yet most companies rely on simple rule-based scoring (login frequency, support tickets) that misses the subtle, complex patterns that truly predict churn.

This workflow builds a production-grade churn prediction system using BigQuery ML for feature engineering and model training, with Vertex AI for deployment and serving. The model integrates with Braze for real-time intervention triggering and Looker Studio for executive dashboards.

The system ingests daily snapshots of product usage, billing, support, and account data, trains a gradient-boosted tree model, and serves per-customer churn probabilities in real time. When a customer's probability crosses a configurable threshold, automated retention campaigns fire within minutes.

**Who uses it:** Data science teams, Customer Success Ops, Revenue Operations
**Tools:** Google BigQuery, BigQuery ML, Vertex AI, Braze, Looker Studio, dbt, Airflow
**Time to implement:** 4-6 weeks (including model validation)
**Impact:** 85%+ churn prediction precision at 30 days before churn, 35-50% reduction in actual churn rate

## Tools Used

| Tool | Role | Monthly Cost |
|------|------|-------------|
| **BigQuery** | Data warehouse & ML training | $0 (1TB slot) → ~$300/mo |
| **BigQuery ML** | Model training (Boosted Tree) | Included with BigQuery |
| **Vertex AI** | Model deployment & serving | ~$50/mo (prediction nodes) |
| **Braze** | Real-time campaign triggering | $30/mo (Starter) |
| **dbt** | Data transformation | Free (dbt Cloud Developer) |
| **Airflow / Cloud Composer** | Pipeline orchestration | ~$20/mo (Composer) |
| **Looker Studio** | Executive dashboards | Free |

## The Workflow

### Phase 1: Feature Engineering Pipeline

**Input:** Raw tables — `product_events`, `billing_transactions`, `support_tickets`, `account_profile`
**Output:** `customer_daily_features` table with 50+ engineered features

1. **Define the target variable** — A customer is "churned" if they cancel their subscription (voluntary) or if payment fails for 30+ consecutive days (involuntary). The prediction window is: "Will this customer churn in the next 30 days?"

2. **Build feature sets across four domains:**

   **Engagement features (from `product_events`):**
   - Days since last login, login frequency (7-day, 14-day, 30-day rolling)
   - Feature adoption rate (% of available features used)
   - Session duration (median + trend over 30 days)
   - Key action completion rate (e.g., reports generated, team invites sent)
   - Feature stickiness (DAU/MAU ratio)

   **Billing features (from `billing_transactions`):**
   - Days since last renewal
   - Payment method age
   - Invoice amount trend
   - Discount applied (flag + amount)
   - Subscription tier changes (downgrade signal)

   **Support features (from `support_tickets`):**
   - Ticket count (7-day, 30-day rolling)
   - Average response time
   - Sentiment score from ticket text (use a simple BQ ML text model)
   - Escalation rate
   - CSAT score trend

   **Account features (from `account_profile`):**
   - Account age (days since signup)
   - Company size / team size
   - Industry vertical
   - Plan tier
   - Integration count (other tools connected)

3. **Implement with dbt:** Write dbt models that transform raw event data into the feature table. Example dbt model:
   ```sql
   WITH login_features AS (
     SELECT
       customer_id,
       DATE_DIFF(CURRENT_DATE(), MAX(event_date), DAY) AS days_since_last_login,
       COUNTIF(event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) AS logins_7d,
       COUNTIF(event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) AS logins_30d,
       COUNTIF(event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) /
         NULLIF(COUNTIF(event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)), 0)
       AS login_stickiness
     FROM product_events
     WHERE event_type = 'login'
     GROUP BY customer_id
   )
   SELECT * FROM login_features
   ```

4. **Daily pipeline orchestration:** Airflow DAG runs at 3 AM daily — dbt transforms → export to training table → run inference → write predictions to Braze.

### Phase 2: Model Training & Validation

**Input:** 90 days of historical `customer_daily_features` + churn labels
**Output:** Trained Boosted Tree model in BigQuery ML

1. **Training data preparation:**
   - Label data: For each customer-day, churn = 1 if churn occurred within next 30 days, else 0
   - Time-based split: Train on months 1-3, validate on month 4
   - Handle class imbalance: Churn is typically 3-8% of population. Use `CLASS_WEIGHTS` in BQ ML or oversample the minority class

2. **Train with BigQuery ML (Boosted Tree):**
   ```sql
   CREATE OR REPLACE MODEL `project.retention.churn_boosted_tree`
   OPTIONS(
     model_type='BOOSTED_TREE_CLASSIFIER',
     BOOSTER_TYPE='GOSS',  -- Gradient-based One-Side Sampling for speed
     MAX_ITERATIONS=100,
     EARLY_STOP=true,
     LEARN_RATE=0.1,
     CLASS_WEIGHTS=[(0, 0.5), (1, 5.0)]  -- Weight churn class higher
   ) AS
   SELECT
     days_since_last_login, logins_7d, logins_30d, login_stickiness,
     feature_adoption_rate, avg_session_duration_minutes,
     days_since_last_ticket, ticket_count_30d, avg_ticket_sentiment,
     account_age_days, plan_tier, company_size,
     CASE WHEN churn_in_next_30_days THEN 1 ELSE 0 END AS label
   FROM `project.retention.training_features`
   WHERE training_date BETWEEN '2026-01-01' AND '2026-03-31'
   ```

3. **Evaluate:**
   - AUC-ROC: Target > 0.85
   - Precision at threshold (top 10% of predictions): Target > 80%
   - Recall: Target > 70% (we want to catch most churners, some false positives are OK)
   - Feature importance analysis: Identify top-10 predictive features

4. **Export to Vertex AI:** BQ ML models can be exported and deployed to Vertex AI for low-latency serving via the Predict API.

### Phase 3: Real-Time Serving & Intervention

**Input:** Daily model predictions (customer_id, churn_probability)
**Output:** Automated retention campaigns in Braze + Slack alerts to CS team

1. **Batch inference at scale:** Run daily prediction query on all active customers:
   ```sql
   SELECT customer_id, predicted_churn_probability
   FROM ML.PREDICT(MODEL `project.retention.churn_boosted_tree`,
     (SELECT * FROM `project.retention.daily_features` WHERE is_active = TRUE))
   ```

2. **Threshold configuration:**
   - Red (Critical): churn_probability > 0.75 — Immediate executive intervention
   - Amber (High): churn_probability 0.50-0.75 — Personal outreach from CSM
   - Yellow (Medium): churn_probability 0.25-0.50 — Automated re-engagement sequence
   - Green (Low): churn_probability < 0.25 — No action, standard nurture

3. **Write predictions to Braze:** Via BigQuery scheduled export → GCS bucket → Braze Cloud Data Import (CDI):
   ```
   BigQuery → GCS (Parquet) → Braze CDI → Customer attribute `churn_probability` updated
   ```
   Braze CDI syncs hourly. New churn_probability values trigger Braze Canvas entry.

4. **Intervention flows in Braze:**
   - **Amber+** triggers a Canvas that: sends personalized email → schedules CSM task in Intercom → posts to #churn-alerts Slack channel
   - **Red** adds: SMS alert to account manager → creates high-priority ticket in Zendesk → flags account in Salesforce for VP of Customer Success review
   - Prediction reason codes are included in each alert (top-3 features driving the score) so CSMs know why a customer is at risk

## Automation Details

The entire pipeline runs on a schedule with zero manual intervention:

**Airflow DAG schedule:** Runs daily at 3:00 AM
```
Task 1: dbt run (refresh feature engineering models) — 30 min
Task 2: dbt test (validate data quality, null checks) — 5 min
Task 3: ML.PREDICT (score all active customers) — 15 min
Task 4: Export predictions to GCS (Parquet format) — 5 min
Task 5: Trigger Braze CDI sync via API → HTTP POST — 1 min
Task 6: Generate Looker Studio report — 5 min
Task 7: Send executive summary email — 1 min
```

**Model retraining schedule:** Weekly model refresh
```
Saturday 6 AM:
  Task 1: dbt run --full-refresh (rebuild training features with latest data)
  Task 2: CREATE OR REPLACE MODEL (retrain with 90-day window)
  Task 3: ML.EVALUATE (validate new model against holdout)
  Task 4: If AUC > previous model, deploy to production; else keep prior
```

## Key Metrics

| Metric | Baseline | After Workflow |
|--------|----------|----------------|
| Churn prediction lead time | 0 days (reactive) | 30 days (predictive) |
| Prediction precision (top 10%) | N/A | 85%+ |
| Monthly churn rate (voluntary) | 6.5% | 4.2% |
| CS team efficiency | 50 accounts/manual review/day | 500+ scored accounts/automated/day |
| Revenue saved per month (10k base, $50 ARPU) | $0 | ~$95,000 |
| Time to detect churn signal | 14 days post-event | 30 days pre-event |

## Customization Tips

- **For limited compute budget (startups):** Use BigQuery's free tier (1TB/month). Train on 60 days of data instead of 90. Skip Vertex AI — serve predictions via scheduled BQ queries directly to a Google Sheet that CSMs review daily. Total cost: ~$20/month for storage.
- **For high-churn markets (e-commerce, gaming):** Shorten prediction window to 7 days. Add session-level features: time-of-day patterns, purchase frequency deltas, cart abandonment rate. Retrain models daily.
- **For enterprise with strict data governance:** Replace BigQuery with Snowflake — Snowflake has equivalent ML functions (`CREATE SNOWFLAKE.ML.FORECAST` for churn prediction). Vertex AI integration works with Snowflake via Snowflake → GCS export.
- **For non-technical teams:** Use Braze's built-in Predictive Churn feature. It's a no-code UI that auto-trains a churn model on your Braze data. Less customizable but deployable in 2 hours vs. 4 weeks.

## Challenges & Solutions

**1. Cold start problem — new customers have no history**
- *Problem:* Accounts younger than 30 days have zero engagement data for feature engineering, causing the model to predict "unknown" or default values.
- *Solution:* Create a separate "New Account" model using signup attributes only (industry, company size, plan tier, referral source). After 30 days, transition to the full model. For day-0 scoring, use historical churn rates by segment (e.g., "self-serve signups from ads have 18% churn at day 30").

**2. Model drift — customer behavior patterns change over time**
- *Problem:* A model trained on 2025 data fails to catch 2026 churn patterns (e.g., price sensitivity changes post-inflation, competitor enters market).
- *Solution:* Daily drift monitoring via chi-squared test on feature distributions vs. training data. Weekly retraining (as described above). Alert when prediction distribution shifts > 2 standard deviations from baseline. Auto-retrain immediately on drift alert.

**3. False positives causing unnecessary CS outreach**
- *Problem:* A model predicts 80% churn probability, CS sends urgent outreach, but customer was just on vacation.
- *Solution:* Add "suppression signals" as feature inputs: out-of-office auto-reply, known migration window, contract lock-in period. After prediction, apply business rules: if `contract_end_date > 90 days`, suppress Critical alerts regardless of churn score.

**4. Feature data latency — real-time predictions need fresh data**
- *Problem:* BigQuery runs inference on yesterday's data, but customer behavior today could indicate imminent churn.
- *Solution:* Run a second pipeline on event-stream (Pub/Sub → Dataflow → BigQuery) that updates key features every 15 minutes for customers in "Red" status. Only high-churn customers get real-time tracking; the rest stay on daily batch.

## FAQ

**Q: Do I need a data science team to build this?**
A: BigQuery ML allows SQL-only model training — anyone who can write SQL can train a Boosted Tree model. The model tuning step (learning rate, class weights, early stopping) requires some ML intuition but is well-documented in BigQuery docs. If you have a data scientist on staff, they can improve precision by 5-10% with custom feature engineering.

**Q: How much data do I need to start?**
A: Minimum 500 churn events in your training window (90 days) for a reliable model. At a 5% churn rate, that requires 10,000+ active accounts. For smaller datasets, use logistic regression (less data-hungry) instead of boosted trees. BQ ML supports both.

**Q: Should I include price/cost data as features?**
A: Absolutely. Price changes are one of the strongest churn predictors. Include: months since last price change, price-to-usage ratio (how much they pay vs. how much they use), and competitor price deltas (if available). A customer whose usage dropped but price stayed the same is 3x more likely to churn.

**Q: How do I measure the business impact of the prediction model?**
A: Run a 1-month A/B test: randomly split active accounts into control (no predictive intervention, CS works normally) and treatment (predictive alerts trigger automated campaigns). Compare churn rates after 30 and 60 days. Most teams see 25-35% churn reduction in the treatment group.
