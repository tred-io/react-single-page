#!/bin/bash

# Efficient Client Update Script
# Updates only configuration files while template improvements are automatic

CLIENT_NAME="$1"
UPDATE_TYPE="$2"  # 'config' or 'template'

show_usage() {
    echo "Usage: ./update-clients-efficient.sh <client-name|all> <config|template>"
    echo ""
    echo "Examples:"
    echo "  ./update-clients-efficient.sh brown-feed config    # Update only client config"
    echo "  ./update-clients-efficient.sh all template         # Template update affects all"
    echo ""
    echo "Available clients:"
    ls -1 deployments/ 2>/dev/null || echo "No client deployments found"
}

update_client_config() {
    local client="$1"
    local client_dir="deployments/$client"
    
    if [ ! -d "$client_dir" ]; then
        echo "❌ Client directory not found: $client_dir"
        return 1
    fi
    
    echo "🔧 Updating configuration for client: $client"
    
    cd "$client_dir"
    
    # Update template version in client config
    if [ -f "client-config.json" ] && command -v jq >/dev/null 2>&1; then
        jq ".templateVersion = \"1.1.0\" | .updatedAt = \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"" \
            client-config.json > tmp.json && mv tmp.json client-config.json
    fi
    
    # Commit configuration changes
    git add .
    git commit -m "Update client configuration - $(date)" || echo "No changes to commit"
    
    echo "✅ Updated configuration for: $client"
    cd - > /dev/null
}

show_template_update_impact() {
    echo "📋 Template Update Impact Analysis"
    echo "================================="
    echo ""
    echo "Template improvements automatically affect:"
    
    for client_dir in deployments/*/; do
        if [ -d "$client_dir" ]; then
            client=$(basename "$client_dir")
            domain=$(jq -r '.domain // "unknown"' "$client_dir/client-config.json" 2>/dev/null)
            echo "- $client → $domain"
        fi
    done
    
    echo ""
    echo "🚀 Template changes are live immediately for all clients"
    echo "💾 No per-client deployment needed"
    echo "⚡ Zero downtime updates"
}

if [ -z "$CLIENT_NAME" ] || [ -z "$UPDATE_TYPE" ]; then
    show_usage
    exit 1
fi

case "$UPDATE_TYPE" in
    "config")
        if [ "$CLIENT_NAME" = "all" ]; then
            echo "📋 Updating configuration for all clients..."
            for client_dir in deployments/*/; do
                if [ -d "$client_dir" ]; then
                    client=$(basename "$client_dir")
                    update_client_config "$client"
                fi
            done
        else
            update_client_config "$CLIENT_NAME"
        fi
        ;;
    
    "template")
        echo "🔄 Template Update Mode"
        echo "======================"
        echo ""
        echo "Template updates work differently in the efficient system:"
        echo ""
        echo "1. ✅ Make changes to template code (client/, server/, shared/)"
        echo "2. ✅ Commit changes to main template repository"
        echo "3. ✅ Changes are immediately live for ALL clients"
        echo ""
        show_template_update_impact
        ;;
    
    *)
        echo "❌ Invalid update type: $UPDATE_TYPE"
        show_usage
        exit 1
        ;;
esac

echo ""
echo "🎯 Update Summary:"
echo "- Template code: Shared across all clients (instant updates)"
echo "- Client configs: Individual per client (manual updates when needed)"
echo "- Databases: Isolated per client (no cross-contamination)"