# Interview Discussion Questions - "The Buzzer" Exercise

## Pre-Interview Preparation
Review the candidate's submission focusing on:
- Architecture diagrams/documentation
- Terraform code structure and quality
- Monitoring setup and alerting strategy
- Operational procedures and incident response plans

## Question Categories

### 1. Solution Walkthrough (10-15 minutes)
**Start here to understand their approach:**

**Q1**: "Walk me through your solution architecture. What was your thought process?"
- *Listen for: Problem identification → solution design → implementation reasoning*

**Q2**: "What was the primary root cause of the championship crash, and how does your solution address it?"
- *Assess: Problem diagnosis skills and solution alignment*

**Q3**: "Show me the most critical piece of your monitoring setup. Why did you choose this metric?"
- *Evaluate: Understanding of system health indicators*

### 2. Scalability & Performance (15-20 minutes)

**Q4**: "Your solution handles 5,000 concurrent users. What happens at 50,000? Walk me through the bottlenecks."
- *Good answer: Database, network, application layer considerations*
- *Red flag: "Just add more servers" without analysis*

**Q5**: "The marketing team wants to add live fan voting during games - potentially 100,000 votes in 30 seconds. How does this change your architecture?"
- *Assess: Real-time data handling, queue systems, database design*

**Q6**: "What if I told you we need sub-second commentary updates instead of 2-3 seconds?"
- *Look for: WebSockets, server-sent events, caching strategies*

### 3. Operational Excellence (10-15 minutes)

**Q7**: "It's 2 AM during the playoffs, and your primary database crashes. Walk me through your incident response."
- *Evaluate: Incident procedures, communication, technical recovery*

**Q8**: "How would you deploy this solution to production with zero downtime?"
- *Assess: Blue-green deployments, rolling updates, health checks*

**Q9**: "What monitoring alerts would wake you up at night? What's just informational?"
- *Good candidates: Distinguish between critical and warning alerts*

### 4. Business Alignment & Trade-offs (10-15 minutes)

**Q10**: "The CEO wants 99.99% uptime for the Super Bowl. What would this cost and is it worth it?"
- *Expect push-back: Cost analysis, business value, realistic expectations*

**Q11**: "Finance says we're spending too much on AWS. Where would you optimize costs in your solution?"
- *Look for: Reserved instances, right-sizing, efficiency improvements*

**Q12**: "How would you explain this technical problem and your solution to our product manager?"
- *Assess: Communication skills, business impact focus*

### 5. Advanced Scenarios & Edge Cases (15-20 minutes)

**Q13**: "What happens if a celebrity breaks news during a game and we get 10x normal social media traffic?"
- *Test: Capacity planning, graceful degradation*

**Q14**: "A DDoS attack targets our API during the championship. How does your architecture respond?"
- *Evaluate: Security awareness, resilience planning*

**Q15**: "We want to expand to international markets. How does your solution handle global traffic?"
- *Look for: CDN strategies, multi-region deployments, latency considerations*

### 6. Technology Choices & Alternatives (10 minutes)

**Q16**: "Why did you choose [their specific technology choice] over alternatives like [suggest alternative]?"
- *Examples: ECS vs EKS, RDS vs DynamoDB, CloudWatch vs third-party monitoring*

**Q17**: "If you had to rebuild this with a completely different cloud provider, what would change?"
- *Assess: Cloud-agnostic thinking, technology abstraction*

### 7. Push-Back Opportunities (Sprinkle throughout)

**Use these to test critical thinking and communication:**

**Unrealistic Requirements:**
- "Can we handle 1 million users by next week?"
- "Make it cost $10/month total"
- "We need 100% uptime, no exceptions"

**Over-Engineering Suggestions:**
- "Shouldn't we use Kubernetes for everything?"
- "What about microservices with 20+ separate APIs?"
- "Let's implement blockchain for the voting feature"

**Good candidates will:**
- Ask clarifying questions
- Explain trade-offs clearly
- Propose realistic alternatives
- Stand firm on technical principles while being diplomatic

## Evaluation During Discussion

### Positive Signals
✅ Asks clarifying questions about business requirements
✅ Explains trade-offs in technical decisions
✅ Shows awareness of operational complexity and costs
✅ Adapts thinking when presented with new constraints
✅ Communicates technical concepts clearly
✅ Demonstrates learning from past experiences

### Warning Signs
❌ Defensive about their solution choices
❌ Can't explain why they made specific decisions
❌ Proposes solutions without understanding requirements
❌ Ignores cost or operational considerations
❌ Blames problems on others (previous team, tools, etc.)
❌ Rigid thinking when constraints change

## Wrap-Up Questions (5 minutes)

**Q18**: "What would you do differently if you had a week instead of 4 hours?"
- *Assess: Technical debt awareness, long-term thinking*

**Q19**: "What part of this exercise did you find most challenging?"
- *Understand: Growth areas, self-awareness*

**Q20**: "Any questions about our infrastructure challenges or the role?"
- *Gauge: Interest level, preparation, cultural fit*

## Scoring Notes

**Time Management:**
- Solution walkthrough should be concise but complete
- Good candidates dive deeper when asked
- Watch for rambling or inability to summarize

**Technical Depth:**
- Should demonstrate understanding beyond their implementation
- Can discuss alternatives and trade-offs
- Shows awareness of production concerns

**Communication:**
- Adjusts technical level based on audience
- Uses examples and analogies effectively
- Listens to questions and answers what was asked

**Problem-Solving:**
- Systematic approach to complex problems
- Considers multiple solutions
- Weighs trade-offs appropriately