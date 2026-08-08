# Lesson 1: AI Decision Framework - When to Use AI

**One-liner:** Learn a systematic framework to decide when AI is the right solution versus traditional programming.  
**Time:** 25–30 min  
**Deliverable:** AI Suitability Assessment Checklist  
**Prerequisite:** Completion of "AI for Dummies in a Day"

## Learning goal

You will be able to: **Evaluate a business problem and determine whether AI or traditional programming is the appropriate solution, using a systematic five-factor decision framework.**

### Success criteria (observable)
- [ ] You can identify the five key factors that determine AI suitability
- [ ] You can apply the decision framework to evaluate at least three different business scenarios
- [ ] You have created a reusable assessment checklist for your own projects

### Output you will produce
- **Deliverable:** AI Suitability Assessment Checklist
- **Format:** Structured checklist document with scoring criteria
- **Where saved:** Your project planning folder or decision-making toolkit

## Who

**Primary persona:** Product managers, technical leads, and entrepreneurs evaluating technology solutions for business problems  
**Secondary persona(s):** Developers and data analysts who need to recommend appropriate technical approaches  
**Stakeholders:** Business stakeholders funding projects, teams implementing solutions

## What

### What it is
An AI Decision Framework is a systematic methodology for evaluating whether artificial intelligence or traditional rule-based programming is the more appropriate solution for a specific problem. It considers five critical factors: problem type, data availability, accuracy requirements, resource constraints, and business value.

### What it is not
This framework is not a guarantee of project success, nor is it a technical specification. It does not replace domain expertise or eliminate the need for prototyping and testing. It is a decision aid, not a decision replacement.

### 2-minute theory
- **Pattern vs Rules**: AI excels at finding patterns in data; traditional code excels at following explicit rules
- **Data Dependency**: AI requires substantial training data; traditional programming works with zero historical data
- **Probabilistic vs Deterministic**: AI provides 80-99% accuracy with adaptability; traditional code provides 100% accuracy for covered cases
- **Cost-Benefit Tradeoff**: AI has higher upfront costs but adapts over time; traditional code has lower upfront costs but requires manual updates
- **Explainability Spectrum**: Traditional code is fully transparent; AI is often a "black box" requiring trust

### Key terms
- **Pattern Recognition**: AI's ability to identify complex relationships in data without explicit programming
- **Rule-Based System**: Traditional programming where developers write explicit if-then logic
- **Training Data**: Historical examples AI learns from to build its decision-making model
- **Accuracy Threshold**: The minimum acceptable correctness rate for a solution (e.g., 95% correct)
- **Technical Debt**: Long-term maintenance costs accumulated from technology choices

## Where

### Applies in
- Product feature decisions requiring technical approach selection
- Make-vs-buy evaluations for software capabilities
- Resource allocation decisions for development teams
- Technology roadmap planning
- Vendor selection processes for AI vs traditional solutions

### Does not apply in
- Decisions already constrained by regulatory requirements (use mandated approach)
- Pure research projects without business constraints
- Problems with no available data and no rule-based alternative
- Situations where the approach is predetermined by existing architecture

### Touchpoints
- Product planning meetings when defining new features
- Technical design reviews before project kickoff
- Quarterly technology strategy sessions
- Vendor evaluation processes
- Budget approval gates for technical initiatives

## When

### Use it when
- Evaluating a new feature or capability before development begins
- A stakeholder asks, "Should we use AI for this?"
- Comparing multiple technical approaches for the same problem
- You need to justify a technology decision to non-technical stakeholders
- Revisiting an existing solution that may benefit from a different approach

### Frequency
Use this framework once per major feature or project during the planning phase. Revisit annually for existing systems as AI capabilities and costs evolve.

### Late signals
- Project already started with wrong approach, requiring costly rework
- Team debates AI vs traditional mid-development, causing delays
- Solution underperforms because AI was used where rules would work better (or vice versa)
- Budget overruns from underestimating AI data and infrastructure costs

## Why it matters

### Practical benefits
- **Reduces wasted effort**: Avoids spending months on an AI solution when simple code would work
- **Improves success rates**: Matches problem characteristics to appropriate technology strengths
- **Accelerates decisions**: Provides structured criteria instead of gut feelings or hype-driven choices
- **Enables better communication**: Gives non-technical stakeholders concrete reasoning for technical decisions
- **Optimizes resource allocation**: Helps teams invest AI expertise where it provides maximum value

### Risks of ignoring
- **Wrong tool for the job**: Using AI for simple rules-based problems wastes resources; using traditional code for complex patterns creates unmaintainable spaghetti code
- **Unexpected costs**: AI projects without proper data or infrastructure planning exceed budgets by 200-300%
- **Timeline delays**: Mid-project approach changes add 3-6 months to schedules
- **Technical debt**: Poor initial decisions create long-term maintenance burdens
- **Missed opportunities**: Sticking with traditional code when AI could provide adaptive, improving solutions

### Expectations
- **Improves**: Decision quality, stakeholder alignment, project success rates, resource utilization
- **Does not guarantee**: Project success (execution still matters), perfect accuracy (judgment required), zero risk (all projects have uncertainty), that AI is always the answer (often it is not)

## How

### Step-by-step method

**The Five-Factor Decision Framework:**

1. **Problem Type Analysis**
   - Ask: "Is this fundamentally about recognizing patterns or following rules?"
   - If you can write down all the rules clearly → Traditional programming
   - If the rules are fuzzy, complex, or unknown → Consider AI
   - Example: Email format validation = rules; spam detection = patterns

2. **Data Availability Check**
   - Ask: "Do we have enough quality data for AI to learn from?"
   - Minimum thresholds: Simple problems need 100s of examples; complex problems need 1000s+
   - If insufficient data → Traditional programming or data collection first
   - If abundant, quality data → AI becomes viable

3. **Accuracy Requirements**
   - Ask: "What accuracy level is acceptable, and what's the cost of errors?"
   - If need 100% accuracy or errors are catastrophic → Traditional programming
   - If 80-99% accuracy acceptable → AI becomes viable
   - Example: Financial calculations need 100%; product recommendations can tolerate 90%

4. **Resource Assessment**
   - Ask: "Do we have the time, budget, expertise, and infrastructure?"
   - AI costs: Data preparation, ML expertise, computing power, ongoing monitoring
   - Traditional costs: Development time, maintenance updates, edge case handling
   - Compare total cost of ownership over 2-3 years, not just initial build

5. **Business Value Calculation**
   - Ask: "What's the value of getting this right, and what happens if it's wrong?"
   - Calculate: (Problem cost) × (Improvement expected) = Potential value
   - Compare to solution cost including maintenance
   - If ROI clear within 12-18 months → Proceed; if not → Reconsider or simplify

**Decision Matrix:**

| Factor | Traditional Code | AI/ML |
|--------|-----------------|-------|
| Problem Type | Clear, stable rules | Pattern recognition, fuzzy rules |
| Data Available | None needed | 100s to 1000s+ of examples |
| Accuracy Need | 100% required | 80-99% acceptable |
| Resources | Lower upfront cost | Higher upfront, but adapts |
| Business Value | Modest improvements | Significant adaptability value |

**Rule of Thumb**: If 3+ factors point to AI and you have the resources, AI is likely appropriate. If 3+ point to traditional code, start there and revisit later.

### Do and don't

**Do**
- Start with the simplest solution that could work (often traditional code)
- Validate data quality and quantity before committing to AI
- Calculate total cost of ownership including ongoing maintenance
- Build small proofs-of-concept before full AI projects
- Document your decision rationale for future review

**Don't**
- Choose AI just because it's trendy or impressive
- Assume AI is always better or always worse than traditional code
- Skip the data availability check (most common AI project failure)
- Forget to consider hybrid approaches (rules + AI together)
- Make the decision in isolation—involve domain experts and users

### Common mistakes
- **Mistake**: "We should use AI because everyone else is"  
  **Why it happens**: Technology hype, fear of being left behind  
  **Fix**: Focus on your specific problem characteristics, not industry trends

- **Mistake**: "We have data, so let's use AI"  
  **Why it happens**: Overlooking data quality, quantity, and relevance  
  **Fix**: Audit your data first—check for bias, completeness, and representativeness

- **Mistake**: "Traditional code is old-fashioned and should be replaced"  
  **Why it happens**: Misunderstanding that rule-based systems often outperform AI for deterministic problems  
  **Fix**: Respect the strengths of both approaches; traditional code is not obsolete

- **Mistake**: "AI will figure it out on its own"  
  **Why it happens**: Overestimating AI's autonomy and understanding  
  **Fix**: Remember AI is a tool that requires careful design, data, and oversight

## Guided exercise

**Scenario**: Your company's customer support team spends 3 hours daily categorizing incoming support tickets into 5 categories (Billing, Technical, Account, Feature Request, Bug Report) so they can route to the right specialist. You need to decide: AI or traditional code?

**Steps:**

1. **Problem Type**: Is this pattern recognition or rule-based?
   - Can you write clear rules? (Partially—some tickets are obvious, others ambiguous)
   - Are patterns complex? (Yes—language varies, abbreviations, typos, context matters)
   - **Assessment**: Patterns dominate → +1 for AI

2. **Data Availability**: Do you have training data?
   - Count historical tickets already categorized: 5,000 tickets × 5 categories = substantial data
   - Check data quality: Review 50 random tickets—are categories correct? (Yes, 95%+ accurate)
   - **Assessment**: Sufficient quality data → +1 for AI

3. **Accuracy Requirements**: What accuracy is acceptable?
   - If AI misroutes a ticket, human can correct it (low consequence)
   - Target: 90%+ accuracy to save time; humans catch the rest
   - **Assessment**: 90% acceptable → +1 for AI

4. **Resources**: Can you afford it?
   - AI option: Use existing API service (e.g., classification API), $200/month + 2 weeks setup
   - Traditional option: Write keyword rules, 4 weeks development + 5 hours/month maintenance
   - **Assessment**: Both feasible; AI slightly higher initial cost but lower maintenance → Neutral

5. **Business Value**: What's the ROI?
   - Current cost: 3 hours/day × 22 days × $30/hour = $1,980/month
   - Expected savings: 90% automation = save ~2.7 hours/day = $1,782/month
   - AI cost: $200/month → ROI = $1,582/month, 9-month payback
   - **Assessment**: Strong ROI → +1 for AI

**Expected result**: **Score: 4 out of 5 factors favor AI**. Recommendation: Use an AI classification service. Start with a 30-day trial to validate 90%+ accuracy with your actual tickets before committing.

## Independent exercise

**Your task:** Apply the five-factor framework to evaluate three different scenarios from your work or industry.

**Deliverable:** Complete the AI Suitability Assessment Checklist for each scenario, including:
- Problem description
- Five-factor analysis with your reasoning for each
- Final recommendation (AI, traditional code, or hybrid)
- One-sentence rationale

**Scenarios to evaluate** (or substitute your own):
1. Automating invoice data extraction from PDFs with varying formats
2. Calculating employee payroll based on hours worked and tax rules
3. Recommending relevant blog articles to website visitors based on browsing history

**Time:** 15-20 minutes

## Self-check

Use this checklist to verify your work:

- [ ] I can name all five factors in the decision framework without looking
- [ ] I have applied the framework to at least one real problem from my work
- [ ] My assessment checklist includes clear scoring criteria for each factor
- [ ] I can explain why a high score on some factors might outweigh others (e.g., zero data available overrides other factors)
- [ ] I understand when hybrid approaches (AI + traditional code) might be best
- [ ] I can articulate this framework to a non-technical stakeholder in under 3 minutes

## Bibliography

**Sources used:**
- Ng, Andrew. "AI Transformation Playbook." Stanford University, 2018. https://landing.ai/ai-transformation-playbook/
- Zinkevich, Martin. "Rules of Machine Learning: Best Practices for ML Engineering." Google Research, 2017. https://developers.google.com/machine-learning/guides/rules-of-ml
- Davenport, Thomas H. and Ronanki, Rajeev. "Artificial Intelligence for the Real World." Harvard Business Review, January 2018. https://hbr.org/2018/01/artificial-intelligence-for-the-real-world
- Brynjolfsson, Erik and McAfee, Andrew. "The Business of Artificial Intelligence." Harvard Business Review, July 2017. https://hbr.org/2017/07/the-business-of-artificial-intelligence
- Bughin, Jacques et al. "Notes from the AI frontier: Insights from hundreds of use cases." McKinsey Global Institute, April 2018. https://www.mckinsey.com/capabilities/quantumblack/our-insights/notes-from-the-ai-frontier-applications-and-value-of-deep-learning

## Read more

**For deeper learning:**
- Google's Machine Learning Crash Course – https://developers.google.com/machine-learning/crash-course – Why useful: Free, comprehensive introduction to ML concepts with practical examples
- Stanford AI Index Report (latest edition) – https://aiindex.stanford.edu/ – Why useful: Annual data on AI adoption trends, costs, and capabilities across industries
- "Prediction Machines" by Ajay Agrawal, Joshua Gans, Avi Goldfarb – Why useful: Economic framework for understanding when AI provides business value
