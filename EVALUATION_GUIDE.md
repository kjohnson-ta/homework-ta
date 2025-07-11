# DevOps Take-Home Exercise - Evaluation Guide

## Overview
This guide provides evaluation criteria and follow-up discussion topics for the "Buzzer" sports API infrastructure exercise.

## Intentional Bottlenecks in Provided Code
The skeleton infrastructure contains these deliberate performance issues for candidates to identify:

### Infrastructure Issues:
- **Single ECS Fargate task** (`desired_count = 1`) - no horizontal scaling
- **Minimal resources** - 256 CPU, 512 MB memory (insufficient for load)
- **Small database instance** - db.t3.micro (will bottleneck under load)
- **No auto-scaling configuration** - service won't scale with demand
- **Missing comprehensive monitoring** - limited CloudWatch setup

### Application Issues:
- **No database connection pooling** - creates new connection per request
- **Inefficient queries** - no pagination, expensive joins, full table scans
- **No caching mechanisms** - every request hits database
- **Single Node.js process** - no clustering or PM2 process management
- **Blocking operations** - artificial delays that compound under load
- **Expensive stats endpoint** - runs multiple COUNT queries on every call

### CI/CD Issues:
- **Basic deployment strategy** - no zero-downtime deployment
- **Missing health checks** - during deployments
- **No testing stages** - deploys without validation

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
- Blames Node.js application code without investigating infrastructure

### 2. Solution Architecture (35%)
**Strong candidates will:**
- Implement horizontal scaling (ECS Auto Scaling with multiple tasks)
- Add database read replicas or connection pooling
- Configure proper load balancer health checks
- Utilize CDN for static/cacheable content (CloudFront or similar)
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
- Actual AWS deployment (candidates should not incur costs)
- Deep application performance optimization
- Advanced Kubernetes or container orchestration (unless they choose it)
- Complex CI/CD improvements (focus should be on infrastructure)

## Acceptable Proof of Work
Since candidates won't deploy to AWS, accept these as valid evidence:
- `terraform plan` output showing resource changes
- `terraform apply` with AWS provider mocks (bonus points)
- Architecture diagrams (hand-drawn or digital tools)
- Written analysis of bottlenecks and solutions
- Mockup monitoring dashboards or detailed descriptions
- Cost analysis and resource sizing rationale

### Terraform Mock Provider Bonus
Candidates who use Terraform AWS provider mocks demonstrate:
- Advanced Terraform knowledge
- Understanding of testing methodologies
- Ability to validate configurations beyond syntax checking
- Professional development practices

### Bonus Considerations
- Creative solutions that still meet requirements
- Demonstrates knowledge of current DevOps trends
- Shows security awareness
- Considers disaster recovery scenarios

## Next Steps Based on Performance
- **Strong candidates**: Proceed to final interview round
- **Borderline candidates**: Additional technical conversation
- **Weak candidates**: Provide constructive feedback and pass