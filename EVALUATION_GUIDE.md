# DevOps Take-Home Exercise - Evaluation Guide

## Overview
This guide provides evaluation criteria and follow-up discussion topics for the "Buzzer" sports API infrastructure exercise.

## Assessment Criteria

### 1. Problem Diagnosis (25%)
**What to look for:**
- Identifies single point of failure (single ECS Fargate task)
- Recognizes database connection pooling issues
- Understands load balancer configuration gaps
- Identifies missing autoscaling mechanisms

**Red flags:**
- Jumps to solutions without proper analysis
- Misses obvious bottlenecks
- Blames application code without investigating infrastructure

### 2. Solution Architecture (35%)
**Strong candidates will:**
- Implement horizontal scaling (ECS Auto Scaling with multiple tasks)
- Add database read replicas or connection pooling
- Configure proper load balancer health checks
- Utilize Cloudflare CDN for static/cacheable content
- Consider caching strategies (ElastiCache, application-level)

**Evaluation points:**
- **Excellent**: Multi-AZ, autoscaling, proper resource allocation
- **Good**: Basic scaling solution with some redundancy
- **Needs improvement**: Vertical scaling only or incomplete solution

### 3. Monitoring & Observability (20%)
**Must have:**
- CloudWatch dashboards with key metrics
- Alarms for critical thresholds
- Health check endpoints

**Bonus points:**
- Custom application metrics
- Log aggregation strategy
- Distributed tracing setup

### 4. Operational Excellence (20%)
**Documentation quality:**
- Clear deployment procedures
- Rollback plans
- Incident response procedures

**Infrastructure as Code:**
- Well-structured Terraform modules
- Proper variable usage
- Environment separation

## Time Management Assessment
- **Under 3 hours**: Likely experienced, efficient problem-solver
- **3-4 hours**: Good time management, thorough approach
- **Over 4 hours**: May struggle with prioritization in real scenarios

## Follow-Up Interview Questions

### Technical Deep Dive
1. **"Walk me through your root cause analysis. What evidence led you to this conclusion?"**
   - *Assesses analytical thinking and problem-solving methodology*

2. **"Your solution works for 5,000 users. What happens at 50,000? 500,000?"**
   - *Tests scalability thinking and architectural evolution*

3. **"The database is now the bottleneck. How would you address this?"**
   - *Evaluates database scaling knowledge (sharding, read replicas, etc.)*

### Operational Scenarios
4. **"It's 2 AM, championship game, and your primary database just crashed. Walk me through your response."**
   - *Tests incident response and pressure handling*

5. **"The marketing team wants to add real-time fan polls during games. How does this impact your architecture?"**
   - *Assesses adaptability and communication with stakeholders*

### Edge Cases & Push-Back Opportunities
6. **"What if we want 99.99% uptime? What would that cost and is it worth it?"**
   - *Good candidates should push back on unrealistic requirements*

7. **"Can we just throw more servers at this problem instead of your solution?"**
   - *Tests understanding of cost optimization and architectural trade-offs*

8. **"The CEO wants us to handle 1 million concurrent users for the Super Bowl. How quickly can we scale?"**
   - *Should push back on unrealistic timelines and explain capacity planning*

### Cultural Fit
9. **"How would you communicate this technical problem to non-technical stakeholders?"**
   - *Assesses communication skills and business awareness*

10. **"What would you do differently if you had a week instead of 4 hours?"**
    - *Tests long-term thinking and technical debt awareness*

## Red Flags to Watch For

### Technical Red Flags
- Proposes solutions without understanding the problem
- Suggests over-engineering for the scale described
- Ignores cost considerations entirely
- No consideration for operational complexity

### Soft Skills Red Flags
- Doesn't ask clarifying questions
- Can't explain trade-offs in their decisions
- Blames others (previous team, application developers)
- Rigid thinking when presented with constraints

### Positive Indicators
- Asks thoughtful questions about business requirements
- Considers multiple solutions and explains trade-offs
- Demonstrates understanding of operational burden
- Shows awareness of cost implications
- Builds incrementally rather than big-bang approaches

## Scoring Framework

### Exceptional (90-100%)
- Comprehensive solution addressing all requirements
- Demonstrates deep AWS knowledge
- Excellent operational practices
- Clear communication and documentation
- Handles follow-up questions with nuance

### Strong (75-89%)
- Solid solution meeting most requirements
- Good understanding of core concepts
- Some operational considerations
- Can discuss trade-offs intelligently

### Acceptable (60-74%)
- Basic solution that would work
- Understands fundamental concepts
- Limited operational thinking
- Needs guidance on advanced topics

### Needs Development (Below 60%)
- Incomplete or non-functional solution
- Limited understanding of core concepts
- Poor documentation or communication
- Cannot explain architectural decisions

## Additional Evaluation Notes

### What Not to Expect
- Perfect production-ready code (this is a 4-hour exercise)
- Deep application performance optimization
- Advanced Kubernetes or container orchestration (unless they choose it)
- Complex CI/CD improvements (focus should be on infrastructure)

### Bonus Considerations
- Creative solutions that still meet requirements
- Demonstrates knowledge of current DevOps trends
- Shows security awareness
- Considers disaster recovery scenarios

## Next Steps Based on Performance
- **Strong candidates**: Proceed to final interview round
- **Borderline candidates**: Additional technical conversation
- **Weak candidates**: Provide constructive feedback and pass