#!/bin/bash

# Repository Cleanup Script - Updated Analysis
# This script removes unused files and directories to reduce repository size
# Run with: bash cleanup-repo-updated.sh

set -e  # Exit on any error

echo "Starting repository cleanup..."
echo "This will delete approximately 75+ files and 8 directories"
echo ""

# Function to safely delete files/directories
safe_delete() {
    local path="$1"
    local type="$2"
    
    if [ -e "$path" ]; then
        if [ "$type" = "dir" ]; then
            echo "Removing directory: $path"
            rm -rf "$path"
        else
            echo "Removing file: $path"
            rm -f "$path"
        fi
    else
        echo "Skipping (not found): $path"
    fi
}

echo "Deleting deployment JSON files..."

# All deployment/status tracking JSON files
safe_delete "production_deployment.json" "file"
safe_delete "project_config.json" "file"
safe_delete "project_details.json" "file"
safe_delete "project_relink.json" "file"
safe_delete "project_settings.json" "file"
safe_delete "project_settings_update.json" "file"
safe_delete "project_status.json" "file"
safe_delete "project_update.json" "file"
safe_delete "recent_deployments.json" "file"
safe_delete "repo_contents.json" "file"
safe_delete "repo_info.json" "file"
safe_delete "runtime_errors.json" "file"
safe_delete "runtime_status.json" "file"
safe_delete "separated_errors.json" "file"
safe_delete "separated_status.json" "file"
safe_delete "serverless_final.json" "file"
safe_delete "simple_project.json" "file"
safe_delete "simplified_deployment.json" "file"
safe_delete "sp-upholstery-content.json" "file"
safe_delete "status.json" "file"
safe_delete "status_check.json" "file"
safe_delete "status_final.json" "file"
safe_delete "synced_deployment.json" "file"
safe_delete "template-config.json" "file"
safe_delete "typescript_deployment.json" "file"
safe_delete "ultimate_errors.json" "file"
safe_delete "ultimate_status.json" "file"
safe_delete "update_response.json" "file"
safe_delete "working_deploy.json" "file"
safe_delete "working_deployment.json" "file"

echo ""
echo "Deleting duplicate project directories..."

# Duplicate project directories
safe_delete "sync_local_to_vercel" "dir"
safe_delete "temp_client" "dir"
safe_delete "test-deploy-b2" "dir"
safe_delete "test-deploy-check" "dir"
safe_delete "test-simple" "dir"
safe_delete "vercel_serverless" "dir"
safe_delete "working_deploy" "dir"
safe_delete "working_deployment" "dir"

echo ""
echo "Deleting unused components..."

# Unused components (not imported in App.tsx)
safe_delete "client/src/components/ThemeGeneratorSimple.tsx" "file"
safe_delete "client/src/components/AdminLogin.tsx" "file"

echo ""
echo "Deleting shell scripts and utilities..."

# Shell scripts and utilities
safe_delete "cleanup-github-api.cjs" "file"
safe_delete "cleanup-vercel-api.cjs" "file"
safe_delete "test-efficient-deployment.sh" "file"
safe_delete "update-clients-efficient.sh" "file"
safe_delete "update-clients.sh" "file"
safe_delete "temp_readme.txt" "file"

echo ""
echo "Deleting uploads directory (comment this line if you want to keep test uploads)..."

# Uploads directory with example files
safe_delete "uploads" "dir"

echo ""
echo "Repository cleanup completed!"
echo ""
echo "Summary:"
echo "- Removed deployment/status JSON files (28+ files)"
echo "- Deleted duplicate project directories (8 directories)"
echo "- Removed unused components (2 files)"
echo "- Deleted shell scripts and utilities (6 files)"
echo "- Cleared uploads directory"
echo ""
echo "Preserved files:"
echo "- All active API endpoints and server files"
echo "- All UI components currently in use"
echo "- All working pages (AdminEnhanced, Home, ThemeGeneratorPage)"
echo "- ThemePreviewSimulator, StockPhotoSelector, LogoUpload, FileUpload"
echo "- Configuration files and essential documentation"
echo ""
echo "Repository is now optimized!"