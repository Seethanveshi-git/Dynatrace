terraform {
  required_providers {
    http = {
      source  = "hashicorp/http"
      version = "~> 3.4.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
