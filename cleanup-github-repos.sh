#!/bin/bash

# Cleanup script for test GitHub repositories
# Run this script to remove test repositories

echo "🧹 Cleaning up GitHub test repositories..."

# Check for GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI not found. Install with:"
    echo "  macOS: brew install gh"
    echo "  Ubuntu: sudo apt install gh"
    echo "  Or visit: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub CLI first:"
    echo "gh auth login"
    exit 1
fi

# List repositories containing test keywords
echo "📋 Finding test repositories..."
TEST_REPOS=$(gh repo list --limit 100 --json name,url | jq -r '.[] | select(.name | test("test|deploy|client|brown|sp-|b[0-9]")) | .name')

if [ -z "$TEST_REPOS" ]; then
    echo "✅ No test repositories found"
    exit 0
fi

echo "Found test repositories:"
echo "$TEST_REPOS"
echo ""

echo "⚠️  This will DELETE the following repositories:"
echo "$TEST_REPOS"
echo ""
echo "Type 'DELETE' to confirm (case sensitive):"
read -r confirmation

if [ "$confirmation" = "DELETE" ]; then
    echo "🗑️  Deleting repositories..."
    
    for repo in $TEST_REPOS; do
        echo "Deleting: $repo"
        gh repo delete "$repo" --confirm
        sleep 1  # Rate limiting
    done
    
    echo "✅ Cleanup complete!"
else
    echo "❌ Cleanup cancelled - confirmation did not match 'DELETE'"
fi