#!/bin/bash

# Update Client Sites Script
# Usage: ./update-clients.sh [client-name] or ./update-clients.sh all

CLIENT_NAME="$1"
TEMPLATE_VERSION="1.0.0"

if [ -z "$CLIENT_NAME" ]; then
    echo "Usage: ./update-clients.sh <client-name|all>"
    echo "Available clients:"
    ls -1 deployments/ 2>/dev/null || echo "No client deployments found"
    exit 1
fi

update_client() {
    local client="$1"
    local client_dir="deployments/$client"
    
    if [ ! -d "$client_dir" ]; then
        echo "❌ Client directory not found: $client_dir"
        return 1
    fi
    
    echo "🔄 Updating client: $client"
    
    # Backup client customizations
    echo "💾 Backing up client customizations..."
    cp "$client_dir/client-config.json" "/tmp/${client}-config-backup.json" 2>/dev/null || true
    cp "$client_dir/.env" "/tmp/${client}-env-backup" 2>/dev/null || true
    
    # Save current git state
    cd "$client_dir"
    git add . 2>/dev/null || true
    git commit -m "Backup before template update" 2>/dev/null || true
    
    # Copy updated template files
    echo "📋 Copying template updates..."
    cp -r ../../* ./ 2>/dev/null || true
    rm -rf node_modules dist .git deployments uploads 2>/dev/null || true
    
    # Restore client customizations
    echo "🔧 Restoring client customizations..."
    cp "/tmp/${client}-config-backup.json" "client-config.json" 2>/dev/null || true
    cp "/tmp/${client}-env-backup" ".env" 2>/dev/null || true
    
    # Update template version in config
    if [ -f "client-config.json" ]; then
        if command -v jq >/dev/null 2>&1; then
            jq ".templateVersion = \"$TEMPLATE_VERSION\" | .updatedAt = \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"" \
                client-config.json > tmp.json && mv tmp.json client-config.json
        fi
    fi
    
    # Commit updates
    git add .
    git commit -m "Update to template v$TEMPLATE_VERSION - $(date)"
    
    echo "✅ Updated client: $client"
    echo "📋 Review changes and deploy when ready"
    echo ""
}

if [ "$CLIENT_NAME" = "all" ]; then
    echo "🔄 Updating all client sites..."
    for client_dir in deployments/*/; do
        if [ -d "$client_dir" ]; then
            client=$(basename "$client_dir")
            update_client "$client"
        fi
    done
else
    update_client "$CLIENT_NAME"
fi

echo "🎉 Update process completed!"
echo ""
echo "Next steps for each client:"
echo "1. cd deployments/<client-name>"
echo "2. Test changes locally: npm run dev"
echo "3. Deploy: git push origin main (if connected to Vercel)"
echo "4. Verify deployment at client domain"