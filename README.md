# Live Sports Commentary API - Infrastructure Assessment

## Technical Challenge

You are tasked with diagnosing and resolving infrastructure performance issues in a Node.js Express API that crashed during high-traffic events. The API handles live sports commentary and must scale to handle 5,000+ concurrent users during peak sporting events.

## Current Infrastructure

The existing setup includes:
- Node.js Express API running on ECS Fargate
- MySQL RDS database storing game events and commentary
- Application Load Balancer
- Route 53 DNS setup
- Basic GitHub Actions CI/CD pipeline
- CDN setup

## Infrastructure Issues to Identify and Resolve

### Primary Bottlenecks
1. **ECS Service Scaling**: Single task configuration unable to handle concurrent load
2. **Resource Allocation**: Under-provisioned CPU/memory resources 
3. **Database Performance**: RDS instance class insufficient for workload
4. **Auto-scaling Configuration**: Missing or inadequate scaling policies

### Storage and Data Management
1. **S3 Bucket Configuration**: Missing secure file storage for game assets (images, videos, documents)
2. **Backup Strategy**: No automated database backup solution to S3
3. **Static Asset Serving**: Game images and media should be served from S3/CloudFront
4. **Data Archival**: Old commentary data should be archived to S3 for cost optimization

### Advanced Optimizations (Nice to haves)
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

## Getting Started

1. **Infrastructure Analysis**: 
   - Review `terraform/main.tf` for current ECS, RDS, and networking configuration
   - Identify specific bottlenecks in resource allocation and scaling policies
   - Examine security group and load balancer configurations

2. **Application Review**: 
   - The Node.js application (`app/`) is optimized and does not require changes
   - Focus on infrastructure-level scaling and performance improvements
   - Consider how S3 integration would support static asset serving

3. **CI/CD Pipeline**: 
   - Analyze `.github/workflows/deploy.yml` for deployment automation opportunities


## Approach

**You are NOT expected to:**
- Deploy infrastructure to AWS

**Instead, demonstrate your solution through:**
- `terraform plan` output showing valid configurations
- Architecture diagrams (hand-drawn or digital)
- Theoretical load testing methodology

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

**Setup**: See [Using Terraform Mocks](https://developer.hashicorp.com/terraform/language/tests/mocking) for mock configuration details.

## Evaluation Criteria

Your solution will be assessed on:

1. **Technical Accuracy**: Correct identification of infrastructure bottlenecks
2. **Scalability Design**: Appropriate auto-scaling and resource allocation
3. **S3 Integration**: Proper bucket configuration, security, and lifecycle management
4. **Cost Optimization**: Efficient resource usage within budget constraints
5. **Operational Excellence**: Clear documentation and maintainable solutions
6. **Terraform Best Practices**: Proper IaC structure and validation

---