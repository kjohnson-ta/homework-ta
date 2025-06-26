# Live Sports Commentary API - Infrastructure Assessment

## Technical Challenge

You are tasked with diagnosing and resolving infrastructure performance issues in a Node.js Express API that crashed during high-traffic events. The API handles live sports commentary and must scale to handle 5,000+ concurrent users during peak sporting events.

## Performance Requirements
- **Concurrent Users**: Must handle 5,000+ simultaneous connections
- **Response Time**: Commentary updates must reach clients within 2-3 seconds
- **Availability**: <5% error rate during peak traffic
- **Zero Downtime**: Deployments must not interrupt service
- **Data Storage**: Implement secure file storage for game assets and backup functionality

## Current Infrastructure

The existing setup includes:
- Node.js Express API running on ECS Fargate (single task, minimal resources)
- MySQL RDS database storing game events and commentary
- Application Load Balancer (but not really helping much)
- Route 53 DNS setup
- Basic GitHub Actions CI/CD pipeline
- CDN setup (underutilized)

## Infrastructure Issues to Identify and Resolve

### Primary Bottlenecks (Critical)
1. **ECS Service Scaling**: Single task configuration unable to handle concurrent load
2. **Resource Allocation**: Under-provisioned CPU/memory resources 
3. **Database Performance**: RDS instance class insufficient for workload
4. **Auto-scaling Configuration**: Missing or inadequate scaling policies

### Storage and Data Management (High Priority)
1. **S3 Bucket Configuration**: Missing secure file storage for game assets (images, videos, documents)
2. **Backup Strategy**: No automated database backup solution to S3
3. **Static Asset Serving**: Game images and media should be served from S3/CloudFront
4. **Data Archival**: Old commentary data should be archived to S3 for cost optimization

### Advanced Optimizations (Medium Priority)
1. **Load Balancer Configuration**: Suboptimal ALB settings for high traffic
2. **Database Read Replicas**: No read scaling for query-heavy workloads
3. **Caching Layer**: Missing Redis/ElastiCache implementation
4. **CDN Integration**: Underutilized CloudFront configuration

## Deliverables

1. **Terraform Infrastructure Updates**:
   - ECS service configuration with proper scaling
   - Auto-scaling policies for dynamic capacity management
   - RDS optimization and read replica configuration
   - Security group and networking improvements

2. **S3 Storage Implementation**:
   - S3 bucket configuration for game assets (images, videos, documents)
   - Automated RDS backup integration with S3
   - Static asset serving via S3/CloudFront
   - Data lifecycle policies for cost optimization

3. **GitHub Actions Workflow**:
   - CI/CD pipeline optimization
   - Infrastructure deployment automation
   - S3 deployment and asset management
   - Testing and validation steps

4. **Documentation**:
   - Infrastructure architecture decisions
   - S3 bucket policies and access patterns
   - Data management and backup strategies
   - Troubleshooting guide for common issues

## Constraints (The Reality Check)

- **Budget**: Startup budget - optimize for cost while solving the problem
- **Timeline**: Must be deployable before the next big game (3 days)
- **Zero Downtime**: Can't take the API down during deployment - fans are watching!
- **Team Size**: Small team - keep solutions maintainable and simple

## Getting Started

1. **Infrastructure Analysis**: 
   - Review `terraform/main.tf` for current ECS, RDS, and networking configuration
   - Identify specific bottlenecks in resource allocation and scaling policies
   - Examine security group and load balancer configurations
   - Note missing S3 storage infrastructure for game assets and backups

2. **Application Review**: 
   - The Node.js application (`app/`) is optimized and does not require changes
   - Focus on infrastructure-level scaling and performance improvements
   - Consider how S3 integration would support static asset serving

3. **CI/CD Pipeline**: 
   - Analyze `.github/workflows/deploy.yml` for deployment automation opportunities
   - Consider adding S3 bucket deployment and asset management steps
   - Infrastructure testing and validation improvements

## Technical Environment

- **Terraform**: Use version 1.7+
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

**Optional**: If you have your own AWS free tier account and want to test actual deployments, that's perfectly fine but not required for evaluation.

## Advanced Testing (Optional)

For candidates familiar with Terraform testing, you can use **Terraform AWS Provider Mocks** to validate your configurations without creating real resources:

```bash
# Example using terraform-aws-provider mocks
terraform init
terraform plan -target=aws_ecs_service.main
terraform apply -target=aws_ecs_service.main  # Uses mocks, no real resources
```

This allows you to:
- Test your Terraform configurations end-to-end
- Validate resource dependencies and references
- Catch configuration errors beyond basic syntax
- Demonstrate working infrastructure code

**Setup**: See [terraform-aws-provider documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/guides/mocking) for mock configuration details.

The goal is to see your problem-solving process and infrastructure knowledge, not to rack up AWS bills!

## Evaluation Criteria

Your solution will be assessed on:

1. **Technical Accuracy**: Correct identification of infrastructure bottlenecks
2. **Scalability Design**: Appropriate auto-scaling and resource allocation
3. **S3 Integration**: Proper bucket configuration, security, and lifecycle management
4. **Cost Optimization**: Efficient resource usage within budget constraints
5. **Operational Excellence**: Clear documentation and maintainable solutions
6. **Terraform Best Practices**: Proper IaC structure and validation

---
*Focus Areas: ECS scaling, S3 storage solutions, Terraform optimization, CI/CD automation*
