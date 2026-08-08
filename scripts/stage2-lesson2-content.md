# Lesson 2: Working with AI Tools - Practical Implementation

**One-liner:** Learn to select, evaluate, and implement AI tools effectively, from simple APIs to custom models.  
**Time:** 30–35 min  
**Deliverable:** AI Tool Selection Matrix with cost-benefit analysis  
**Prerequisite:** Completion of Day 1 (AI Decision Framework)

## Learning goal

You will be able to: **Evaluate AI tool options (off-the-shelf APIs, managed services, custom models) and select the appropriate solution based on technical requirements, business constraints, and team capabilities.**

### Success criteria (observable)
- [ ] You can list pros and cons of three AI tool categories (APIs, platforms, custom models)
- [ ] You can evaluate an AI tool using the six-factor selection matrix
- [ ] You have completed a cost-benefit analysis for at least one real tool option
- [ ] You understand how to pilot and validate AI tools before full deployment

### Output you will produce
- **Deliverable:** AI Tool Selection Matrix
- **Format:** Structured comparison table with cost, capabilities, integration effort, and business fit
- **Where saved:** Your project planning toolkit or decision documentation

## Who

**Primary persona:** Technical leads, product managers, and engineering managers responsible for tool selection and vendor decisions  
**Secondary persona(s):** Developers implementing AI features, procurement teams evaluating vendors  
**Stakeholders:** CTO/VP Engineering (budget and architecture decisions), business stakeholders (ROI and timeline)

## What

### What it is
An AI tool is any software solution that provides artificial intelligence capabilities, ranging from simple API calls (e.g., text translation, image recognition) to managed machine learning platforms (e.g., AWS SageMaker, Google Vertex AI) to fully custom models you build and train yourself. Tool selection is the systematic process of matching your requirements to the appropriate solution category and specific vendor.

### What it is not
AI tool selection is not about choosing "the best AI"—there is no universal best. It is not a one-time decision (tools evolve rapidly). It is not purely technical (business, cost, and team constraints matter as much as features). It does not eliminate the need for testing (all tools require validation with your specific data and use case).

### 2-minute theory
- **API-First Solutions**: Call an AI service with HTTP requests (e.g., OpenAI GPT API, Google Cloud Vision). Fast to integrate, pay-per-use, limited customization.
- **Managed Platforms**: Cloud services that handle infrastructure while you control model training/deployment (e.g., AWS SageMaker, Azure ML). Balance of control and convenience.
- **Custom Models**: Build from scratch using frameworks (TensorFlow, PyTorch). Maximum control, maximum effort. Rarely needed unless requirements are highly specialized.
- **Build vs Buy Tradeoff**: Buying (APIs/platforms) trades control for speed and lower upfront cost. Building (custom models) trades time/money for flexibility and long-term ownership.
- **Total Cost of Ownership (TCO)**: Includes API usage fees, infrastructure, development time, ongoing maintenance, and team expertise acquisition—not just sticker price.

### Key terms
- **API (Application Programming Interface)**: A way to access AI functionality via HTTP requests without managing infrastructure
- **Managed Service**: Cloud platform that handles servers, scaling, and ML infrastructure while you focus on models and data
- **Model Fine-Tuning**: Adapting a pre-trained AI model to your specific data/use case (middle ground between API and custom)
- **Inference Cost**: The cost per AI prediction/request (e.g., $0.002 per API call, compute time for self-hosted models)
- **Latency**: Response time for AI predictions—critical for real-time applications (e.g., <200ms for user-facing features)

## Where

### Applies in
- Technology selection for new AI features during planning
- Vendor evaluations and RFP (Request for Proposal) processes
- Build-vs-buy decisions for product roadmaps
- Platform migration evaluations (e.g., moving from one cloud provider to another)
- Budget planning for AI initiatives

### Does not apply in
- Situations with zero budget (no AI tool is truly free at scale)
- Problems already solved by existing internal tools (no need to evaluate new options)
- Regulatory environments that prohibit third-party AI (must build internal)
- Emergency fixes requiring immediate solutions (no time for proper evaluation)

### Touchpoints
- Product kickoff meetings when defining feature scope
- Architecture review boards evaluating technical approaches
- Procurement processes comparing vendor contracts
- Quarterly budget reviews for ongoing AI services
- Performance review sessions for deployed AI tools

## When

### Use it when
- Starting a new AI project or feature
- Current AI solution underperforms or becomes too expensive
- You need to justify tool/vendor choice to stakeholders
- Comparing multiple vendors or approaches
- Evaluating whether to migrate from one AI tool to another

### Frequency
Use this framework once per major AI feature or annually for existing AI tools (market evolves rapidly). Re-evaluate if costs spike, performance degrades, or business requirements change significantly.

### Late signals
- Chose wrong tool category, leading to 3-6 month delays and re-implementation costs
- API costs exceed budget by 200-300% due to underestimating usage
- Tool cannot scale to production traffic (crashes or becomes prohibitively expensive)
- Vendor lock-in prevents switching despite better options emerging
- Team lacks expertise to operate chosen tool, causing project delays

## Why it matters

### Practical benefits
- **Accelerates time-to-market**: APIs and platforms let you ship AI features in days/weeks instead of months
- **Optimizes costs**: Proper tool selection prevents overpaying for unnecessary capabilities or under-provisioning for scale
- **Reduces technical debt**: Right tool for the job means less rework, fewer hacks, and better maintainability
- **Manages risk**: Piloting and validation catch issues early before full commitment
- **Enables team productivity**: Tools matched to team skills allow faster development and lower training overhead

### Risks of ignoring
- **Wrong tool category**: Using a custom model when an API would suffice wastes 90% of your effort; using an API when customization is needed leads to poor accuracy
- **Vendor lock-in**: Deep integration with one vendor's proprietary features makes switching painfully expensive later
- **Cost explosions**: APIs that cost $50/month in development can cost $5,000/month in production if usage isn't modeled correctly
- **Performance failures**: Tools that work in demos fail under real-world load, latency, or edge cases
- **Opportunity cost**: Building custom models when buying would work means slower delivery and missed market windows

### Expectations
- **Improves**: Decision speed, cost predictability, deployment success rates, team confidence
- **Does not guarantee**: Perfect tool match (requirements evolve), zero migration effort (all tools require integration work), future-proof decisions (AI market changes rapidly), that the first choice is final (iteration is normal)

## How

### Step-by-step method

**The Six-Factor AI Tool Selection Matrix:**

1. **Requirements Analysis**
   - **Question**: What exactly does the AI need to do?
   - Define: Specific inputs, required outputs, accuracy/performance targets, integration points
   - Example: "Extract invoice line items from PDF images with 95%+ accuracy, process 1,000/day, integrate with our Python backend"
   - **Output**: Requirements document with measurable success criteria

2. **Tool Category Selection**
   - **API-First**: Choose if task is common (translation, sentiment analysis, OCR), you need fast integration, and default accuracy is acceptable
   - **Managed Platform**: Choose if you need custom models but want infrastructure managed, have ML expertise, and can invest 4-8 weeks in setup
   - **Custom Model**: Choose only if requirements are highly specialized, no existing tools fit, and you have deep ML expertise + long timeline
   - **Decision shortcut**: Start with APIs if available; only move to platforms/custom if APIs can't meet requirements

3. **Vendor/Tool Research**
   - Identify 3-5 candidate vendors per category (Google Cloud AI, AWS AI Services, OpenAI, Hugging Face, etc.)
   - Check: Capabilities match, pricing transparency, SLA/uptime guarantees, data privacy/compliance, community/support quality
   - Read: Real customer reviews (G2, TrustRadius), not just marketing materials
   - **Output**: Shortlist of 2-3 finalists with pros/cons documented

4. **Cost Modeling**
   - Calculate Total Cost of Ownership (TCO) over 12-24 months:
     - **API costs**: (Expected API calls/month) × (Cost per call) × 12 months
     - **Platform costs**: Monthly subscription + infrastructure (compute, storage) + development time
     - **Custom model costs**: Development (6-12 months engineer time) + infrastructure + ongoing maintenance
   - Add hidden costs: Data preparation, integration development, monitoring, support contracts
   - **Output**: TCO comparison table for each finalist

5. **Proof of Concept (POC)**
   - Never commit without testing with your actual data
   - Build minimal integration (2-5 days effort) with realistic sample data (100-500 examples)
   - Measure: Accuracy/quality, latency, error handling, edge cases
   - **Success criteria**: POC must meet 80%+ of requirements before proceeding
   - **Output**: POC results report with go/no-go recommendation

6. **Final Decision & Deployment Plan**
   - Score each option:
     - Requirements fit: 30%
     - Cost: 25%
     - Integration effort: 20%
     - Team capabilities: 15%
     - Vendor reliability: 10%
   - Select highest-scoring option
   - Create deployment plan: Pilot (10% traffic) → Staged rollout (50%) → Full deployment (100%)
   - **Output**: Decision document with selected tool, deployment timeline, rollback plan

**Quick Decision Tree:**

```
Is the task common (translation, OCR, sentiment, etc.)?
├─ YES → Try API-first solutions (fastest path)
└─ NO  → Do you need custom model behavior?
         ├─ YES → Do you have ML expertise in-house?
         │        ├─ YES → Managed Platform
         │        └─ NO  → Partner with ML consultancy or use platform with low-code tools
         └─ NO  → Your requirements may not need AI—revisit problem definition
```

### Do and don't

**Do**
- Start with the simplest tool that could work (usually an API)
- Build a proof-of-concept with real data before committing
- Model costs realistically for production scale (multiply dev usage by 50-100x)
- Plan for vendor failure or price increases (have exit strategy)
- Involve your team in tool selection (they must use and maintain it)

**Don't**
- Choose based on hype, trends, or vendor marketing alone
- Skip the POC phase ("It works in their demo" ≠ it will work for you)
- Ignore data privacy and compliance requirements (can block deployment entirely)
- Lock yourself to proprietary features you can't replicate elsewhere
- Assume your first choice is final (be ready to iterate)

### Common mistakes
- **Mistake**: "This API demo looks perfect, let's use it"  
  **Why it happens**: Vendor demos use curated data; real-world data has noise, edge cases, and surprises  
  **Fix**: Always test with your actual data before deciding

- **Mistake**: "We'll build our own model to avoid vendor lock-in"  
  **Why it happens**: Fear of dependency, overestimating team capabilities  
  **Fix**: Calculate true cost of custom models (usually 10-20x higher than APIs). Lock-in risk often overstated.

- **Mistake**: "The free tier will be enough"  
  **Why it happens**: Underestimating production usage volume  
  **Fix**: Model production usage: (dev usage) × (number of users) × (usage frequency). Add 50% buffer.

- **Mistake**: "We chose the tool, now let's figure out how to use it"  
  **Why it happens**: Tool selection before requirements are clear  
  **Fix**: Always define requirements first, then find tools that fit—not the reverse

## Guided exercise

**Scenario**: Your e-commerce company wants to add an AI feature that automatically categorizes customer support tickets into 5 categories (Shipping, Returns, Product Questions, Account Issues, Technical Problems). You have 10,000 historical tickets already labeled. The system needs to handle 200 tickets/day with 90%+ accuracy.

**Your task**: Use the Six-Factor Selection Matrix to evaluate tool options.

**Steps:**

1. **Requirements Analysis**
   - Input: Email text (subject + body)
   - Output: One of 5 categories
   - Performance: 90%+ accuracy, <5 seconds latency (not user-facing)
   - Volume: 200 tickets/day = ~6,000/month
   - Integration: REST API from Python backend
   - **Documented? ✓**

2. **Tool Category**
   - Task: Text classification (common problem)
   - Data: 10,000 labeled examples (good training set)
   - Accuracy: 90%+ (achievable with APIs or custom models)
   - **Initial choice**: API-first (simplest path) or Managed Platform (more control)

3. **Vendor Research**
   - **Option A**: OpenAI GPT API with prompt engineering (no training needed)
   - **Option B**: Google Cloud Natural Language API (AutoML custom model)
   - **Option C**: AWS Comprehend Custom Classification
   - **Research complete? ✓**

4. **Cost Modeling** (12-month TCO):
   - **Option A (OpenAI GPT-3.5)**:
     - API cost: 6,000 calls/month × $0.002/call = $12/month × 12 = $144/year
     - Integration: 3 days dev time = $3,000
     - **Total Year 1**: $3,144
   
   - **Option B (Google AutoML)**:
     - Training: $50 one-time
     - Prediction: 6,000/month × $0.0015 = $9/month × 12 = $108/year
     - Integration: 5 days dev time = $5,000
     - **Total Year 1**: $5,158
   
   - **Option C (AWS Comprehend)**:
     - Training: $3 per hour × 2 hours = $6
     - Prediction: 6,000/month × $0.0005 = $3/month × 12 = $36/year
     - Integration: 5 days dev time = $5,000
     - **Total Year 1**: $5,042

5. **Proof of Concept**
   - Test all three with 500 historical tickets
   - **Option A**: 92% accuracy, 800ms latency → **PASS**
   - **Option B**: 91% accuracy, 600ms latency → **PASS**
   - **Option C**: 94% accuracy, 400ms latency → **PASS (best accuracy)**
   - **All pass POC threshold ✓**

6. **Final Decision**
   - Scoring (Requirements 30%, Cost 25%, Integration 20%, Team 15%, Vendor 10%):
     - **Option A**: 28 + 23 + 18 + 14 + 9 = **92/100** (best for quick start, team knows OpenAI)
     - **Option B**: 27 + 19 + 16 + 13 + 10 = **85/100** (good, but higher cost)
     - **Option C**: 30 + 25 + 16 + 12 + 9 = **92/100** (tied, best accuracy + cost)

**Expected result**: **Option C (AWS Comprehend)** edges out Option A with better accuracy and lower long-term cost. However, if your team already uses OpenAI APIs elsewhere, Option A reduces integration complexity. **Recommendation**: Start with Option C for production; keep Option A as fallback if AWS has issues.

## Independent exercise

**Your task**: Apply the Six-Factor Selection Matrix to one of these scenarios (or your own):

1. **Scenario A**: Your mobile app needs real-time language translation for user chat messages (50 languages, 100,000 messages/day, <500ms latency).
2. **Scenario B**: A manufacturing company wants to detect product defects from camera images on the assembly line (1,000 images/hour, 98%+ accuracy required, custom defect types).
3. **Scenario C**: Your SaaS product wants an AI coding assistant to autocomplete code in your web IDE (Python/JavaScript, 10,000 users, <200ms latency).

**Deliverable**: Complete AI Tool Selection Matrix including:
- Requirements analysis (inputs, outputs, performance, volume)
- Tool category selection (API / Platform / Custom) with rationale
- 2-3 vendor options researched
- Cost modeling for Year 1 TCO
- POC plan (what you would test, success criteria)
- Final recommendation with scoring

**Time**: 20-25 minutes

## Self-check

Use this checklist to verify your learning:

- [ ] I can explain the difference between API, Managed Platform, and Custom Model approaches
- [ ] I can list at least 3 factors to consider beyond just features (cost, integration, team skills)
- [ ] I understand why POCs with real data are critical before committing
- [ ] I can calculate a realistic TCO for an AI tool over 12 months
- [ ] I know how to score and compare multiple tool options systematically
- [ ] I can explain vendor lock-in risks and how to mitigate them

## Bibliography

**Sources used:**
- Martin, Robert C. "The Decision-Making Toolkit for AI Projects." Google Cloud Architecture Center, 2019. https://cloud.google.com/architecture/ai-infrastructure-reference-pattern
- Ameisen, Emmanuel. "Building Machine Learning Powered Applications." O'Reilly Media, 2020. ISBN: 978-1492045113
- Amazon Web Services. "Machine Learning Lens - AWS Well-Architected Framework." AWS Documentation, 2021. https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/
- Google Cloud. "AI and Machine Learning Products: Decision Guide." Cloud AI Documentation, 2022. https://cloud.google.com/products/ai
- Huyen, Chip. "Designing Machine Learning Systems." O'Reilly Media, 2022. ISBN: 978-1098107963
- OpenAI. "API Pricing and Cost Optimization Best Practices." OpenAI Documentation, 2023. https://openai.com/pricing

## Read more

**For deeper learning:**
- "Machine Learning Engineering" by Andriy Burkov – https://www.mlebook.com/ – Why useful: Comprehensive guide to production ML systems, including tool selection frameworks
- AWS re:Invent ML Sessions – https://www.youtube.com/c/AmazonWebServices (search "ML tool selection") – Why useful: Real-world case studies of tool selection and migration decisions
- "Made With ML" by Goku Mohandas – https://madewithml.com/ – Why useful: Practical tutorials on integrating AI tools and APIs into applications
