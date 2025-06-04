#!/bin/bash

# Cleanup script for failed Vercel test projects
# Run this script to remove all test deployments

echo "🧹 Cleaning up Vercel test projects..."

# Install Vercel CLI if not available
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel@latest
fi

# List all projects
echo "📋 Current projects:"
vercel ls --scope "tred-io"

echo ""
echo "⚠️  This will delete ALL projects in your tred-io scope."
echo "Are you sure you want to continue? (y/N)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    # Get list of project names and delete them
    PROJECT_NAMES=$(vercel ls --scope "tred-io" --format json | jq -r '.[].name' 2>/dev/null || vercel ls --scope "tred-io" | tail -n +2 | awk '{print $2}')
    
    for project in $PROJECT_NAMES; do
        if [ ! -z "$project" ] && [ "$project" != "null" ]; then
            echo "🗑️  Deleting project: $project"
            vercel remove "$project" --scope "tred-io" --yes
        fi
    done
    
    echo "✅ Cleanup complete!"
else
    echo "❌ Cleanup cancelled"
fi