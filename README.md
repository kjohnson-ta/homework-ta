# Live Sports Commentary API - "The Buzzer" 🏀

## The Story

You're the infrastructure engineer for "The Buzzer" - a real-time sports commentary API that provides live play-by-play data to mobile apps during games. Think of it as the backend that powers those instant notifications when your team scores!

## The Crisis

**What Happened**: During the championship finals last week, the API crashed right as the winning goal was scored. Thousands of fans missed the moment, and social media wasn't kind. The CEO wants this fixed before the next big game in **4 hours~**.

**Current Pain Points**:
- API dies when concurrent users spike above 1,000 during exciting moments
- Commentary updates take 15+ seconds to reach mobile apps during clutch plays
- No way to know if the system is about to crash until it's too late
- Database keeps choking on the rapid-fire score updates
- Error rate hits 25% when games get intense

## Current Infrastructure

The existing setup includes:
- Python Flask API running on ECS Fargate (single task, minimal resources)
- MySQL RDS database storing game events and commentary
- Application Load Balancer (but not really helping much)
- Route 53 DNS setup
- Basic GitHub Actions CI/CD pipeline
- CDN setup (underutilized)

## Your Mission

You have **4 hours maximum** to save the next big game! Your goals:

### 1. **Fix the Crash** 🔥
Diagnose why the API dies under load and implement a solution that can handle 5,000+ concurrent users during peak moments.

### 2. **Speed Up the Action** ⚡
Ensure commentary updates reach fans within 2-3 seconds of real events happening.

### 3. **Get Visibility** 👀
Set up monitoring so the team knows when the system is stressed BEFORE it crashes.

### 4. **Document Everything** 📋
Create operational docs so the team can handle the next crisis without you.

## What You'll Deliver

1. **Infrastructure as Code**: Updated Terraform configurations that can handle the load
2. **Monitoring & Alerting**: CloudWatch dashboards, alarms, and health checks
3. **Crisis Playbook**: 
   - Root cause analysis of the championship crash
   - Your solution architecture and reasoning
   - Operational runbook for game day deployments
4. **Proof of Concept**: Evidence that your solution would handle the load (no actual deployment required)

## Constraints (The Reality Check)

- **Budget**: Startup budget - optimize for cost while solving the problem
- **Timeline**: Must be deployable before the next big game (3 days)
- **Zero Downtime**: Can't take the API down during deployment - fans are watching!
- **Team Size**: Small team - keep solutions maintainable and simple

## Getting Started

1. **Explore the damage**: Check out `terraform/` for current infrastructure
2. **Understand the app**: Review `app/` directory (you don't need to change the Python code)
3. **Check the pipeline**: Look at `.github/workflows/` for deployment process

## Technical Environment

- **Terraform**: Use version 1.5+
- **AWS Region**: `us-east-1` 
- **Existing Services**: ECS Fargate, RDS MySQL, ALB, Route 53, CloudWatch
- **Important**: You do NOT need to deploy to AWS or incur any costs

## Cost-Free Approach

**You are NOT expected to:**
- Deploy infrastructure to AWS (this would cost money)
- Create actual AWS resources
- Set up real monitoring dashboards

**Instead, demonstrate your solution through:**
- `terraform plan` output showing valid configurations
- Architecture diagrams (hand-drawn or digital)
- Detailed documentation of your approach
- Theoretical load testing methodology
- Screenshots of monitoring dashboard designs (mockups are fine)

The goal is to see your problem-solving process and infrastructure knowledge, not to rack up AWS bills!

## The Stakes

Success means thousands of sports fans get their instant notifications when their team scores. Failure means another social media roasting and a very unhappy CEO! 😅

**No pressure, but... good luck! 🚀**

---
*Time Budget: 4 hours maximum | Focus: Infrastructure resilience and observability*
