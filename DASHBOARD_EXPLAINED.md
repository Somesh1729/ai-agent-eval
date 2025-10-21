# Dashboard Explained: Understanding Your AI Agent Metrics

## Overview

The dashboard displays real-time metrics for all your AI agents. After seeding, you'll see data from 5 different agents with 650+ evaluations.

## Dashboard Components

### 1. KPI Cards (Top Section)

These four cards show key performance indicators:

#### Average Score
- **What it shows**: Overall quality of AI responses (0.0 - 1.0)
- **Seeded value**: ~0.81
- **What's good**: > 0.80 is excellent
- **What's bad**: < 0.60 needs improvement
- **Use case**: Monitor if your AI is getting smarter or dumber over time

#### Average Latency
- **What it shows**: How fast your AI responds (milliseconds)
- **Seeded value**: ~1200ms
- **What's good**: < 1000ms is fast
- **What's bad**: > 3000ms is slow
- **Use case**: Identify performance bottlenecks

#### Redaction Rate
- **What it shows**: % of evaluations where PII was found and redacted
- **Seeded value**: ~30%
- **What's good**: High rate = good privacy protection
- **What's bad**: 0% might mean PII isn't being detected
- **Use case**: Ensure sensitive data is being protected

#### Success Rate
- **What it shows**: % of evaluations without errors
- **Seeded value**: ~95%
- **What's good**: > 95% is excellent
- **What's bad**: < 90% indicates issues
- **Use case**: Identify reliability problems

### 2. Trend Charts (Middle Section)

Two charts showing performance over time:

#### 7-Day Trend
- Shows the last 7 days of data
- Helps identify recent issues
- Good for daily monitoring
- Seeded data: Shows realistic daily variations

#### 30-Day Trend
- Shows the last 30 days of data
- Helps identify long-term trends
- Good for weekly reviews
- Seeded data: Shows seasonal patterns

**What to look for:**
- Upward trend = improving performance
- Downward trend = degrading performance
- Spikes = anomalies or issues
- Flat line = stable performance

### 3. Evaluations Table (Bottom Section)

Lists all individual evaluations with:

| Column | Meaning |
|--------|---------|
| Interaction ID | Unique identifier for this evaluation |
| Prompt | What was asked to the AI |
| Score | Quality rating (0.0-1.0) |
| Latency | Response time in ms |
| Flags | Any issues (success, error, timeout, etc.) |
| Date | When the evaluation occurred |

**Features:**
- **Search**: Find evaluations by interaction ID
- **Sort**: Click column headers to sort
- **Filter**: Use the filter button to narrow results
- **Details**: Click a row to see full prompt/response

## Understanding the Seeded Data

### AI Agents in the Data

1. **Customer Support Bot** (120 evaluations)
   - Handles customer questions
   - High accuracy (~0.85)
   - Fast responses (~800ms)
   - Few errors

2. **Content Generator** (95 evaluations)
   - Creates marketing content
   - Good accuracy (~0.82)
   - Medium speed (~800ms)
   - Occasional quality issues

3. **Code Assistant** (110 evaluations)
   - Helps with programming
   - Good accuracy (~0.80)
   - Slower responses (~2000ms)
   - Complex queries take longer

4. **Data Analyst** (105 evaluations)
   - Analyzes data and trends
   - Good accuracy (~0.80)
   - Medium speed (~1500ms)
   - Handles complex calculations

5. **HR Assistant** (120 evaluations)
   - Answers HR questions
   - Good accuracy (~0.80)
   - Fast responses (~800ms)
   - Consistent performance

### Data Distribution

- **Total Evaluations**: 650+
- **Time Period**: Last 60 days
- **Score Range**: 0.30 - 1.00
- **Latency Range**: 50 - 5000ms
- **Flags**: ~5% have error flags

## How to Use the Dashboard

### Daily Monitoring
1. Check the KPI cards for any red flags
2. Look at the 7-day trend for recent issues
3. Review the evaluations table for errors

### Weekly Review
1. Check the 30-day trend for patterns
2. Compare metrics across agents
3. Identify which agents need improvement

### Troubleshooting
1. If score is low: Check which agent is underperforming
2. If latency is high: Look for slow responses in the table
3. If errors are high: Filter by error flags to see what went wrong

### Performance Optimization
1. Identify your best-performing agent
2. Study what makes it successful
3. Apply those patterns to other agents
4. Monitor improvements over time

## Real-World Example

**Scenario**: Your Customer Support Bot's score dropped from 0.85 to 0.75

**Steps to investigate:**
1. Go to the dashboard
2. Check the 7-day trend - confirm the drop
3. Filter the evaluations table for "Customer Support Bot"
4. Sort by score (lowest first)
5. Click on low-scoring evaluations to see what went wrong
6. Identify the pattern (e.g., "timeout" flag on all low scores)
7. Fix the issue (e.g., increase timeout limit)
8. Monitor the next day's data to confirm improvement

## Metrics Explained in Detail

### Score Interpretation
- **0.90-1.00**: Excellent - AI response is perfect
- **0.80-0.89**: Good - AI response is helpful
- **0.70-0.79**: Fair - AI response has minor issues
- **0.60-0.69**: Poor - AI response has major issues
- **0.00-0.59**: Very Poor - AI response is unusable

### Latency Interpretation
- **< 500ms**: Very Fast - Excellent user experience
- **500-1000ms**: Fast - Good user experience
- **1000-2000ms**: Medium - Acceptable
- **2000-5000ms**: Slow - User might wait
- **> 5000ms**: Very Slow - Poor user experience

### Flags Explained
- **success**: Evaluation completed successfully
- **error**: AI returned an error
- **timeout**: AI took too long to respond
- **rate_limit**: API rate limit was hit
- **validation_error**: Input validation failed
- **warning**: Non-critical issue occurred

## Next Steps

1. **Explore the Data**
   - Click on different evaluations
   - Look for patterns
   - Identify trends

2. **Configure Settings**
   - Go to Settings page
   - Adjust sampling rate (currently 100%)
   - Set daily limits

3. **Send Real Data**
   - Use the API endpoint to send real evaluations
   - Monitor your actual AI agents
   - Compare with seeded data

4. **Set Up Alerts**
   - Monitor for score drops
   - Alert on high latency
   - Track error rates

## Questions?

Refer to `SEED_DATA_GUIDE.md` for seeding questions or `README_COMPLETE.md` for general information.
