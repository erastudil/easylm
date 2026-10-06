---
title: "EasyLM Serverless Adapter Training: Modal vs RunPod Architectural Evaluation"
version: "1.0.0"
dialect: gfc
status: canon
---

# EasyLM Serverless Adapter Training: Modal vs RunPod Architectural Evaluation

Comparative architectural evaluation of serverless GPU execution substrates for EasyLM discrete LoRA adapter fine-tuning.

## Execution Substrates

### Modal Serverless Infrastructure

Modal provides serverless container execution with sub-second scale-to-zero function invocations. Code defines container images in pure Python using debian-slim environments and mounts local directories directly into container memory space. Hardware targets include NVIDIA A10G and L4 GPUs.

### RunPod On-Demand Pods

RunPod allocates dedicated GPU container instances across community and secure cloud clusters. Pods deploy from standard Docker images such as CUDA-enabled PyTorch containers with configurable persistent network volumes. Hardware targets include NVIDIA GeForce RTX 4090, RTX A4000, and L4 GPUs.

## Comparative Trade-Offs

### Cold Start Latency

Modal reuses container snapshot layers and starts GPU functions within 5 to 15 seconds. Dataset files mount directly from the local workspace without network transfer stages.

RunPod requires full container provisioning, volume binding, and initial image layer downloads. Pod initialization spans 45 to 120 seconds before container bootstrap commands execute.

### Billing Granularity

Modal measures compute by the second. Function execution stops billing immediately upon model weight export. Idle compute registers at zero cost.

RunPod bills on a per-minute or hourly basis. Pods incur continuous charges until an explicit API termination call destroys the allocated instance. Unattended pods generate idle expense when training scripts conclude without self-termination routines.

### Cost Per Adapter Run

Training the 0.5B Hands adapter requires approximately 60 seconds on an A100 or A10G accelerator across 3 epochs.

Modal A10G execution costs 1.10 dollars per hour, resulting in approximately 0.02 dollars per completed adapter run.

RunPod RTX 4090 community cloud instances cost 0.34 dollars per hour. A two-minute pod lifecycle including startup latency costs approximately 0.015 dollars. Persistent volume allocations add 0.10 dollars per gigabyte per month.

## Metrics Summary

| Metric | Google Cloud Vertex AI | Modal Serverless | RunPod On-Demand |
|---|---|---|---|
| Target Accelerator | NVIDIA A100 40GB Spot | NVIDIA A10G / L4 | NVIDIA RTX 4090 / A4000 |
| Provisioning Latency | 30 to 60 seconds | 5 to 15 seconds | 45 to 120 seconds |
| Billing Granularity | Per second | Per second | Per minute / hourly |
| Cost Per 0.5B Run | 0.02 to 0.03 dollars | 0.02 dollars | 0.015 to 0.03 dollars |
| Scale-to-Zero | Native spot job queue | Native serverless | Manual pod termination |
| Dataset Staging | Cloud Storage bucket | Local directory mount | Remote bucket or curl |

## Synthesis

Modal delivers higher developer ergonomics for interactive and batch adapter training through local folder mounting, automated secret injection, and sub-second container termination. RunPod provides the lowest raw hourly compute pricing for sustained multi-hour fine-tuning jobs across larger 7B models when managed with rigorous automated teardown scripts.
