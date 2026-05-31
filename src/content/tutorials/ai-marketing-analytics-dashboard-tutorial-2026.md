---
title: "Building an AI Marketing Analytics Dashboard 2026 — LangChain + Streamlit"
date: 2026-06-01
author: "AIPlaybook Editorial Team"
category: "Analytics"
tags: [tutorial, marketing-analytics, dashboard, streamlit, langchain, ai, data-visualization]
cover: "/images/tutorials/ai-marketing-analytics-dashboard-tutorial-2026/cover.png"
difficulty: intermediate
meta_description: "Build an AI-powered marketing analytics dashboard with natural language querying, automated insights, and predictive analytics using LangChain, Streamlit, and GPT-4o."
---

## Overview

Marketing teams drown in data — Google Analytics, ad platforms, CRM, email tools, social media — all producing disconnected reports that require manual analysis to connect. This tutorial shows you how to build an AI-powered marketing analytics dashboard that unifies all your data sources and lets you ask questions in plain English. The system uses LangChain to create an agent that queries your marketing database, generates visualizations on the fly, produces automated narratives explaining performance changes, and predicts future trends using time-series models. By the end, you'll have a dashboard where your CMO can type "Why did our conversion rate drop last week?" and get an answer with supporting charts, root cause analysis, and recommended actions — in under 30 seconds.

## Prerequisites

- Python 3.10+
- Streamlit: `pip install streamlit`
- LangChain ecosystem: `pip install langchain langchain-openai langchain-community langchain-experimental`
- Data stack: `pip install pandas sqlalchemy psycopg2-binary plotly prophet scikit-learn`
- OpenAI API key with GPT-4o access
- PostgreSQL database with marketing data (Google Analytics exports, ad spend, email stats)
- Sample dataset: we'll use a generated dataset if you don't have real data
- Basic familiarity with Pandas, SQL, and Streamlit

## Step 1: Set Up the Marketing Data Warehouse

First, create a unified marketing data schema in PostgreSQL:

```sql
-- Campaign performance
CREATE TABLE campaign_metrics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    campaign_name VARCHAR(255),
    channel VARCHAR(50),  -- google_ads, meta, email, organic, direct
    spend DECIMAL(10,2),
    impressions INTEGER,
    clicks INTEGER,
    conversions INTEGER,
    revenue DECIMAL(12,2),
    cost_per_click DECIMAL(6,4),
    conversion_rate DECIMAL(5,4),
    roas DECIMAL(8,2),  -- Return on Ad Spend
    created_at TIMESTAMP DEFAULT NOW()
);

-- Website analytics
CREATE TABLE web_analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    page_path VARCHAR(500),
    source VARCHAR(100),
    sessions INTEGER,
    pageviews INTEGER,
    bounce_rate DECIMAL(5,4),
    avg_session_duration DECIMAL(6,2),
    goal_completions INTEGER
);

-- Email marketing
CREATE TABLE email_metrics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    campaign_id VARCHAR(100),
    subject_line VARCHAR(500),
    sent INTEGER,
    opens INTEGER,
    clicks INTEGER,
    unsubscribes INTEGER,
    open_rate DECIMAL(5,4),
    click_rate DECIMAL(5,4)
);

-- Customer data
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_seen DATE,
    channel VARCHAR(50),
    lifetime_value DECIMAL(12,2),
    orders INTEGER,
    last_order_date DATE
);
```

**Generate sample data if you don't have real data:**
```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sqlalchemy import create_engine

engine = create_engine("postgresql://postgres:password@localhost:5432/marketing_db")

def generate_sample_data(days=365):
    """Generate realistic marketing data for dashboard development."""
    dates = [datetime.now() - timedelta(days=i) for i in range(days)]
    
    # Campaign data
    channels = ['google_ads', 'meta', 'email', 'organic', 'direct']
    campaigns = ['Brand_Awareness_Q1', 'Product_Launch', 'Retargeting', 
                 'Newsletter_Weekly', 'Holiday_Promo', 'Evergreen']
    
    data = []
    for date in dates:
        for channel in channels:
            base_spend = np.random.lognormal(mean=6, sigma=0.5) if channel in ['google_ads', 'meta'] else np.random.lognormal(mean=4, sigma=0.3)
            cpc = np.random.uniform(0.5, 5.0) if channel == 'google_ads' else np.random.uniform(0.2, 2.0)
            impressions = int(base_spend / cpc * np.random.uniform(50, 200))
            clicks = int(impressions * np.random.uniform(0.01, 0.05))
            conversions = int(clicks * np.random.uniform(0.02, 0.08))
            revenue = conversions * np.random.lognormal(mean=4, sigma=0.8)
            
            data.append({
                'date': date,
                'campaign_name': np.random.choice(campaigns),
                'channel': channel,
                'spend': round(base_spend, 2),
                'impressions': impressions,
                'clicks': clicks,
                'conversions': conversions,
                'revenue': round(revenue, 2),
                'cost_per_click': round(cpc, 4),
                'conversion_rate': round(conversions / max(clicks, 1), 4),
                'roas': round(revenue / max(base_spend, 1), 2)
            })
    
    df = pd.DataFrame(data)
    df.to_sql('campaign_metrics', engine, if_exists='replace', index=False)
    print(f"Inserted {len(df)} campaign records")

generate_sample_data()
```

## Step 2: Build LangChain SQL Agent for Natural Language Queries

This is the core AI capability — letting users ask questions in plain English:

```python
import streamlit as st
from langchain_openai import ChatOpenAI
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent
from langchain.agents import AgentType
from langchain_core.messages import SystemMessage

# Connect to the database
db = SQLDatabase.from_uri("postgresql://postgres:password@localhost:5432/marketing_db")

# Verify connection
print(f"Database dialect: {db.dialect}")
print(f"Usable tables: {db.get_usable_table_names()}")

# Create the agent
llm = ChatOpenAI(model="gpt-4o", temperature=0)

agent_executor = create_sql_agent(
    llm=llm,
    db=db,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    handle_parsing_errors=True,
    max_iterations=10,
    agent_executor_kwargs={
        "extra_prompt_messages": [
            SystemMessage(content="""
            You are a marketing analytics expert. When answering questions:
            1. Always write valid PostgreSQL queries
            2. Use proper date filtering — today is 2026-06-01
            3. For "trend" questions, group by date and order chronologically
            4. For comparison questions, use week-over-week or month-over-month
            5. When asked "why", look for correlations across channels
            6. Format numbers: currency with $, percentages with %, large numbers with commas
            7. If you can't find enough data, explain what's missing
            
            Table schemas:
            - campaign_metrics: date, campaign_name, channel, spend, impressions, clicks, conversions, revenue, cost_per_click, conversion_rate, roas
            - web_analytics: date, page_path, source, sessions, pageviews, bounce_rate, avg_session_duration, goal_completions
            - email_metrics: date, campaign_id, subject_line, sent, opens, clicks, unsubscribes, open_rate, click_rate
            """)
        ]
    }
)

# Test: ask a question
result = agent_executor.invoke({
    "input": "What was our total ad spend last month compared to the previous month?"
})
print(result["output"])
# Expected: Shows spend comparison with dollar amounts and percentage change
```

## Step 3: Build Automated Insight Generation

Beyond Q&A, the system should proactively surface insights:

```python
def generate_weekly_insights():
    """AI-powered weekly performance review."""
    
    query = """
    Get me all campaign_metrics from the last complete week (Monday-Sunday).
    Compare to the previous week. Group by channel.
    Show: channel, current_week_spend, prev_week_spend, current_conv_rate, 
          prev_conv_rate, current_roas, prev_roas
    """
    
    data_result = agent_executor.invoke({"input": query})
    
    # Now generate narrative insights
    insight_prompt = f"""
    Based on this marketing data from the last two weeks:
    
    {data_result['output']}
    
    Generate a concise weekly marketing performance report with:
    1. **Executive Summary** — one paragraph
    2. **Winners** — top 2 performing channels with data
    3. **Decliners** — channels that dropped with possible reasons
    4. **Anomalies** — any unusual patterns
    5. **Recommendations** — 3 specific actions for next week
    
    Use a professional, data-driven tone.
    """
    
    response = llm.invoke(insight_prompt)
    return response.content

insights = generate_weekly_insights()
print(insights)
```

**Custom insight detectors — use LangChain's structured output:**
```python
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.output_parsers import PydanticOutputParser

class Insight(BaseModel):
    metric: str = Field(description="The metric being analyzed")
    change_pct: float = Field(description="Percentage change")
    direction: str = Field(description="up or down")
    significance: str = Field(description="low, medium, high")
    narrative: str = Field(description="Human-readable explanation")
    recommended_action: str = Field(description="What to do about it")

class WeeklyReport(BaseModel):
    executive_summary: str
    insights: list[Insight]
    recommendations: list[str]

parser = PydanticOutputParser(pydantic_object=WeeklyReport)

def structured_insights(data: str) -> WeeklyReport:
    prompt = f"""
    Analyze this marketing data and extract structured insights:
    
    {data}
    
    {parser.get_format_instructions()}
    """
    
    response = llm.invoke(prompt)
    return parser.parse(response.content)

report = structured_insights(data_result['output'])
for insight in report.insights:
    icon = "📈" if insight.direction == "up" else "📉"
    print(f"{icon} {insight.metric}: {insight.change_pct:+.1f}% ({insight.significance})")
    print(f"   {insight.narrative}")
```

## Step 4: Build Predictive Analytics with Prophet

Forecast future performance using Meta's Prophet:

```python
from prophet import Prophet
import plotly.graph_objects as go

def forecast_metric(df, metric_col='revenue', periods=30, metric_name='Revenue'):
    """Forecast a marketing metric using Prophet + LLM context."""
    
    # Prepare data for Prophet
    prophet_df = df[['date', metric_col]].rename(
        columns={'date': 'ds', metric_col: 'y'}
    )
    
    # Fit model with seasonality
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False,
        changepoint_prior_scale=0.05
    )
    model.add_seasonality(name='monthly', period=30.5, fourier_order=5)
    model.fit(prophet_df)
    
    # Forecast
    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)
    
    # Generate AI narrative about the forecast
    last_month = df[df['date'] >= df['date'].max() - timedelta(days=30)][metric_col].mean()
    forecast_mean = forecast.tail(periods)['yhat'].mean()
    change_pct = ((forecast_mean - last_month) / last_month) * 100
    
    narrative = llm.invoke(f"""
    Marketing forecast summary:
    - Metric: {metric_name}
    - Last 30 days average: ${last_month:,.0f}
    - Next 30 days forecast: ${forecast_mean:,.0f}
    - Projected change: {change_pct:+.1f}%
    - Confidence interval: ${forecast.tail(periods)['yhat_lower'].mean():,.0f} - ${forecast.tail(periods)['yhat_upper'].mean():,.0f}
    
    Write a 2-sentence narrative explaining this forecast and its implications for marketing strategy.
    """)
    
    return {
        'forecast': forecast,
        'model': model,
        'narrative': narrative.content,
        'change_pct': change_pct
    }

# Example: forecast revenue
df = pd.read_sql("SELECT date, SUM(revenue) as revenue FROM campaign_metrics GROUP BY date ORDER BY date", engine)
forecast_result = forecast_metric(df)
print(forecast_result['narrative'])
```

## Step 5: Build the Main Streamlit Dashboard

Combine everything into a single, powerful dashboard:

```python
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta

st.set_page_config(page_title="AI Marketing Analytics", layout="wide")
st.title("📊 AI Marketing Analytics Dashboard")

# Sidebar configuration
with st.sidebar:
    st.header("Controls")
    date_range = st.date_input(
        "Date Range",
        value=(datetime.now() - timedelta(days=90), datetime.now()),
        max_value=datetime.now()
    )
    channels = st.multiselect(
        "Channels",
        ['google_ads', 'meta', 'email', 'organic', 'direct'],
        default=['google_ads', 'meta', 'email']
    )
    
    st.divider()
    st.subheader("🤖 AI Query")
    use_ai = st.toggle("Enable AI Analysis", value=True)
    auto_insights = st.toggle("Auto-generate Insights", value=True)

# Load data
@st.cache_data(ttl=300)
def load_data(start_date, end_date):
    query = f"""
    SELECT * FROM campaign_metrics 
    WHERE date >= '{start_date}' AND date <= '{end_date}'
    """
    return pd.read_sql(query, engine)

df = load_data(date_range[0], date_range[1])
df_filtered = df[df['channel'].isin(channels)] if channels else df

# Top-level KPIs
col1, col2, col3, col4, col5 = st.columns(5)
total_spend = df_filtered['spend'].sum()
total_revenue = df_filtered['revenue'].sum()
total_conv = df_filtered['conversions'].sum()
avg_roas = total_revenue / total_spend if total_spend > 0 else 0
avg_cvr = df_filtered['conversion_rate'].mean()

col1.metric("Total Spend", f"${total_spend:,.0f}")
col2.metric("Revenue", f"${total_revenue:,.0f}")
col3.metric("Conversions", f"{total_conv:,}")
col4.metric("ROAS", f"{avg_roas:.2f}x")
col5.metric("Avg CVR", f"{avg_cvr:.2%}")

# AI Query Section
with st.expander("🔍 Ask AI About Your Marketing Data", expanded=True):
    st.caption("Ask questions in natural language. Examples: 'Why did conversion rate drop last week?', 'Which channel has the best ROAS?', 'Show me campaign performance by day for the last 30 days'")
    
    user_query = st.text_input("Your question:", placeholder="e.g., What was our best performing campaign last month?")
    
    if user_query and use_ai:
        with st.spinner("AI is analyzing your data..."):
            result = agent_executor.invoke({"input": f"""
                Context: Today is 2026-06-01. Data range: {date_range[0]} to {date_range[1]}.
                Channels: {', '.join(channels)}.
                
                Question: {user_query}
                
                Return: the SQL query used, then the data, then your analysis.
            """})
            
            st.markdown("### 🤖 AI Analysis")
            st.markdown(result["output"])

# Main dashboard tabs
tab1, tab2, tab3, tab4 = st.tabs(["📈 Performance", "🔍 Channel Analysis", "📊 Forecast", "💡 Insights"])

with tab1:
    col_left, col_right = st.columns([2, 1])
    
    with col_left:
        # Daily revenue + spend chart
        daily = df_filtered.groupby('date').agg({
            'revenue': 'sum', 'spend': 'sum'
        }).reset_index()
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=daily['date'], y=daily['revenue'],
                                 mode='lines', name='Revenue', line=dict(color='green', width=2)))
        fig.add_trace(go.Scatter(x=daily['date'], y=daily['spend'],
                                 mode='lines', name='Spend', line=dict(color='red', width=2)))
        fig.update_layout(title='Daily Revenue vs Spend', height=400)
        st.plotly_chart(fig, use_container_width=True)
    
    with col_right:
        # ROAS by channel
        channel_roas = df_filtered.groupby('channel').apply(
            lambda x: x['revenue'].sum() / x['spend'].sum() if x['spend'].sum() > 0 else 0
        ).reset_index(name='ROAS')
        
        fig = px.bar(channel_roas, x='channel', y='ROAS', 
                     title='ROAS by Channel', color='ROAS',
                     color_continuous_scale='RdYlGn')
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)

with tab2:
    # Detailed channel breakdown
    channel_summary = df_filtered.groupby('channel').agg({
        'spend': 'sum', 'impressions': 'sum', 'clicks': 'sum',
        'conversions': 'sum', 'revenue': 'sum'
    }).reset_index()
    channel_summary['CPC'] = channel_summary['spend'] / channel_summary['clicks'].replace(0, 1)
    channel_summary['CVR'] = channel_summary['conversions'] / channel_summary['clicks'].replace(0, 1)
    channel_summary['ROAS'] = channel_summary['revenue'] / channel_summary['spend'].replace(0, 1)
    
    st.dataframe(channel_summary.style.format({
        'spend': '${:,.0f}', 'revenue': '${:,.0f}',
        'CPC': '${:.2f}', 'CVR': '{:.2%}', 'ROAS': '{:.2f}x'
    }), use_container_width=True)
    
    # Campaign comparison
    st.subheader("Campaign Performance Comparison")
    campaign_df = df_filtered.groupby('campaign_name').agg({
        'spend': 'sum', 'conversions': 'sum', 'revenue': 'sum'
    }).reset_index()
    campaign_df['ROAS'] = campaign_df['revenue'] / campaign_df['spend'].replace(0, 1)
    
    fig = px.scatter(campaign_df, x='spend', y='revenue', 
                     size='conversions', color='campaign_name',
                     hover_name='campaign_name', text='campaign_name',
                     title='Campaign ROI Quadrant (Spend vs Revenue)')
    fig.add_hline(y=campaign_df['revenue'].mean(), line_dash="dash", line_color="gray")
    fig.add_vline(x=campaign_df['spend'].mean(), line_dash="dash", line_color="gray")
    st.plotly_chart(fig, use_container_width=True)

with tab3:
    st.subheader("📊 Revenue Forecast (Next 30 Days)")
    
    daily_rev = df_filtered.groupby('date')['revenue'].sum().reset_index()
    forecast = forecast_metric(daily_rev)
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=forecast['forecast']['ds'],
        y=forecast['forecast']['yhat'],
        mode='lines', name='Forecast', line=dict(color='blue')
    ))
    fig.add_trace(go.Scatter(
        x=forecast['forecast']['ds'],
        y=forecast['forecast']['yhat_upper'],
        mode='lines', name='Upper Bound',
        line=dict(color='lightblue', dash='dot')
    ))
    fig.add_trace(go.Scatter(
        x=forecast['forecast']['ds'],
        y=forecast['forecast']['yhat_lower'],
        mode='lines', name='Lower Bound',
        line=dict(color='lightblue', dash='dot'),
        fill='tonexty'
    ))
    # Add actual data
    fig.add_trace(go.Scatter(
        x=daily_rev['date'], y=daily_rev['revenue'],
        mode='markers', name='Actual', marker=dict(color='black', size=4)
    ))
    fig.update_layout(title='Revenue Forecast with Confidence Intervals', height=500)
    st.plotly_chart(fig, use_container_width=True)
    
    st.info(f"🤖 **AI Forecast Narrative:** {forecast['narrative']}")

with tab4:
    if auto_insights:
        with st.spinner("Generating AI insights..."):
            insights = generate_weekly_insights()
            st.markdown(insights)
    
    st.divider()
    
    # Anomaly detection
    st.subheader("🚨 Anomaly Detection")
    daily_stats = df_filtered.groupby('date')['conversions'].sum().reset_index()
    mean = daily_stats['conversions'].mean()
    std = daily_stats['conversions'].std()
    
    anomalies = daily_stats[
        (daily_stats['conversions'] > mean + 2*std) | 
        (daily_stats['conversions'] < mean - 2*std)
    ]
    
    if not anomalies.empty:
        st.warning(f"Found {len(anomalies)} anomalous days in conversion data")
        for _, row in anomalies.iterrows():
            direction = "⬆️ Spike" if row['conversions'] > mean else "⬇️ Drop"
            st.write(f"{direction} on {row['date']}: {row['conversions']} conversions "
                    f"(avg: {mean:.0f} ± {std:.0f})")
    else:
        st.success("✅ No significant anomalies detected in the selected period")
```

## Step 6: Deploy and Schedule Updates

```bash
# Run the dashboard
streamlit run marketing_dashboard.py

# For production: deploy with Docker
cat > Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8501
CMD ["streamlit", "run", "marketing_dashboard.py", "--server.port=8501", "--server.address=0.0.0.0"]
EOF

# Build and run
docker build -t marketing-ai-dashboard .
docker run -d -p 8501:8501 marketing-ai-dashboard
```

## What You've Built

A complete AI-powered marketing analytics dashboard:
- Natural language query interface to your marketing database (LangChain SQL Agent)
- Automated weekly insights with structured output
- Predictive revenue forecasting using Prophet + AI narrative
- Interactive visualizations with anomaly detection
- Channel performance comparison and campaign ROI analysis
- Docker-ready deployment

The dashboard saves marketing teams 5-10 hours per week on reporting and analysis.

## Troubleshooting

**LangChain agent generates invalid SQL:**
Enable `handle_parsing_errors=True` and reduce `max_iterations` to prevent infinite retry loops. For complex queries, set `agent_type=AgentType.OPENAI_FUNCTIONS` instead of `ZERO_SHOT_REACT_DESCRIPTION`. Add explicit column name hints in the system prompt matching your actual table schema.

**Prophet forecast shows declining trend when data is seasonal:**
Add explicit seasonality: `model.add_seasonality(name='monthly', period=30.5, fourier_order=5)`. For e-commerce data with holiday spikes, add holiday effects: `model.add_country_holidays(country_name='US')`.

**Streamlit dashboard loads slowly on large datasets:**
Add `@st.cache_data(ttl=300)` decorator and consider pre-aggregating data in PostgreSQL views:
```sql
CREATE VIEW daily_summary AS
SELECT date, channel, SUM(spend) as spend, SUM(revenue) as revenue,
       SUM(conversions) as conversions
FROM campaign_metrics GROUP BY date, channel;
```

**OpenAI API costs for frequent queries:**
Use `gpt-4o-mini` for routine insight generation and `gpt-4o` only for complex analytical queries. Implement a rate limiter: `time.sleep(1)` between API calls. Cache common queries by hashing the input.

## Next Steps

- Connect live API sources (Google Analytics 4, Meta Ads, Google Ads) via their API clients
- Add anomaly alerting via Slack/Email webhooks when metrics exceed thresholds
- Implement multi-user authentication with Streamlit's built-in authentication or Auth0
- Build custom report exports (PDF with embedded charts using `weasyprint`)
- Add A/B test result analysis module using Bayesian statistics
- Integrate with Google Looker Studio as a data source connector
