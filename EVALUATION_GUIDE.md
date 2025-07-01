# DevOps Take-Home Exercise - Evaluation Guide

## Overview
This guide provides evaluation criteria and follow-up discussion topics for the "Buzzer" sports API infrastructure exercise.

## Intentional Bottlenecks in Provided Code
The skeleton infrastructure contains these deliberate performance issues for candidates to identify:

### Infrastructure Issues:
- **Single ECS Fargate task** (`desired_count = 1`) - no horizontal scaling
- **Minimal resources** - 256 CPU, 512 MB memory (insufficient for load but since we aren't providing a live environment and no metrics to look at for the crash I am not sure what we would expect the right resource specs woudl be)
- **Small database instance** - db.t3.micro (will most likely bottleneck under load) but hard to tell without load testing or specifying the traffic baseline what the instance size whould be 
- **No auto-scaling configuration** - service won't scale with demand
- **Missing comprehensive monitoring** - limited CloudWatch setup would like to see some alarms around CPU/Memory added

### Security/Networkign Issues:
-- ECS task definition using public subnets (better to use private subnets to limit network exposure)
-- RDS/ALB/ECS only specifying 1 subnet instead of the two that are created which is better for high availability
-- On the RDS Security Group traffic is allowed from all sources  0.0.0.0/0, big security risk, rule should be updated to ony be from the ECS task Security Group
-- DB Password is hardcoded as a terraform variable and used in the task definition and the RDS instance resrouce, this should be updated to be pulled from either ssm or parameter store
-- ECS Task Secuirty Group has no egress rule, one should be added for either 0.0.0.0/0 so traffic can reach the database


### CI/CD Issues:
- **Basic deployment strategy** -The current pipeline doesn't even deploy the app, just updates the service but doesn't create a new task definition that pulls the new image
- **Missing Terraform apply** - The teraform should be applied in the pipeline. The ECS task definition is set to use "latest" if this is ran then it will spin up new tasks with the latest image, but the image we actually want is the one built in the pipeline tagged with the commit sha, the better way to do this is to pass a variable to Terraform with the image tag and let the terrafrom apply actually do the deployment. (This should probably be considered a strech goal for them to identify this but would be good to discuss in the interview)
- **Missing health checks** - The load balancer does have a health check which it uses to decide when to update traffic to the new task so you could argue that there is a built in health check but there could be a stage that waits for the service to become stable , or a health check that hits the loadbalancer's DNS record at the /health endpoint.
- **No testing stages** - deploys without validation - though no unit tests exist so would just be good for them to identify that they should be added or E2E tests

## Assessment Criteria

### 1. Problem Diagnosis 
**What to look for:**
- Identifies points of failure (Very small resoruce allocation on ECS and RDS, no autoscaling policy, no read replicas on the DB)
- Identifies Security and Networking Gaps
- Understands load balancer configuration gaps (not sure what these are?)
- Identifies that the github action does not apply terraform changes or actually deploy a new application version

### 2. Solution Architecture
**Strong candidates will:**
- Implement horizontal scaling (ECS Auto Scaling with multiple tasks)
  Look out for what kind of scaling they add, is it step scaling? target scaling? What thersholds do they pick? What metrics are they scaling based off of CPU/Memory/Storage?
- Add database read replicas (Not actually sure that a read replica would be necessary unless load testing was performed, would be good to ask the candidate how they would deterimine if a read replica was needed)
- Fix Github Action and deploys version either using terraform or AWS CLI
- Add Terraform Apply in CI/CD

## Time Management Assessment (Will we even know how long this took them? Are we going to send it out ask ask for it to be sent back right when they are done?)
- **Under 3 hours**: Likely experienced, efficient problem-solver
- **3-4 hours**: Good time management, thorough approach
- **Over 4 hours**: May struggle with prioritization in real scenarios

## Red Flags to Watch For

### Technical Red Flags
- Proposes solutions without understanding the problem
- Suggests over-engineering for the scale described
- Ignores cost considerations entirely (Do we really have any cost considerations they are changing?) 
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
