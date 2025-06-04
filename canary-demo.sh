#!/bin/bash

# Canary Deployment Demonstration Script

echo "🎯 CANARY DEPLOYMENT DEMONSTRATION"
echo "=================================="
echo ""

# Get list of current clients
CLIENTS=($(ls deployments/ 2>/dev/null | grep -v "^\." || echo ""))
TOTAL_CLIENTS=${#CLIENTS[@]}

if [ $TOTAL_CLIENTS -eq 0 ]; then
    echo "❌ No client deployments found"
    exit 1
fi

echo "📋 Current Client Portfolio:"
for i in "${!CLIENTS[@]}"; do
    client=${CLIENTS[$i]}
    domain=$(jq -r '.domain // "unknown"' "deployments/$client/client-config.json" 2>/dev/null)
    echo "  $((i+1)). $client → $domain"
done
echo ""

# Calculate canary group (5% minimum 1 client)
CANARY_COUNT=$(( TOTAL_CLIENTS > 20 ? TOTAL_CLIENTS * 5 / 100 : 1 ))
CANARY_CLIENTS=(${CLIENTS[@]:0:$CANARY_COUNT})

echo "🐤 CANARY GROUP SELECTION (${CANARY_COUNT}/${TOTAL_CLIENTS} clients)"
echo "Selected for initial deployment:"
for client in "${CANARY_CLIENTS[@]}"; do
    domain=$(jq -r '.domain // "unknown"' "deployments/$client/client-config.json" 2>/dev/null)
    echo "  • $client ($domain)"
done
echo ""

echo "🚀 CANARY DEPLOYMENT PROCESS"
echo ""

# Step 1: Deploy to staging
echo "Step 1: Deploy to Staging Environment"
echo "--------------------------------------"
echo "✓ Building new template version..."
echo "✓ Running automated tests..."
echo "✓ Deploying to template-staging.vercel.app"
echo "✓ Staging health checks passed"
echo ""

# Step 2: Deploy to canary group
echo "Step 2: Deploy to Canary Group"
echo "-------------------------------"
echo "Deploying template update to canary clients..."

for client in "${CANARY_CLIENTS[@]}"; do
    echo "  → Deploying to $client..."
    sleep 1  # Simulate deployment time
    echo "    ✓ Deployment successful"
done
echo ""

# Step 3: Health monitoring
echo "Step 3: Health Monitoring (10-minute observation)"
echo "------------------------------------------------"

for minute in {1..5}; do  # Shortened for demo
    echo "Minute $minute/10:"
    
    # Simulate health checks for canary clients
    healthy_count=0
    for client in "${CANARY_CLIENTS[@]}"; do
        # Simulate health check (randomize for demo)
        if [ $((RANDOM % 100)) -gt 5 ]; then  # 95% success rate
            status="✓ Healthy"
            ((healthy_count++))
        else
            status="⚠ Warning"
        fi
        echo "  $client: $status (Response: ${RANDOM:0:2}ms)"
    done
    
    health_percent=$(( healthy_count * 100 / CANARY_COUNT ))
    echo "  Overall health: $health_percent% ($healthy_count/$CANARY_COUNT healthy)"
    
    if [ $health_percent -lt 95 ]; then
        echo ""
        echo "❌ CANARY DEPLOYMENT FAILED"
        echo "Health threshold not met (< 95%). Aborting rollout."
        echo ""
        echo "🔄 Automatic Rollback Initiated"
        echo "  → Rolling back canary clients to previous version"
        for client in "${CANARY_CLIENTS[@]}"; do
            echo "    ✓ $client rolled back"
        done
        echo ""
        echo "💡 Next Steps:"
        echo "  1. Investigate health check failures"
        echo "  2. Fix issues in template"
        echo "  3. Re-test in staging environment"
        echo "  4. Retry canary deployment"
        exit 1
    fi
    
    sleep 2  # Simulate monitoring interval
done

echo ""
echo "✅ CANARY DEPLOYMENT SUCCESSFUL"
echo ""

# Step 4: Gradual rollout
echo "Step 4: Gradual Rollout to All Clients"
echo "--------------------------------------"

REMAINING_CLIENTS=(${CLIENTS[@]:$CANARY_COUNT})
REMAINING_COUNT=${#REMAINING_CLIENTS[@]}

if [ $REMAINING_COUNT -gt 0 ]; then
    echo "Proceeding with gradual rollout to remaining $REMAINING_COUNT clients:"
    
    # Batch deployment simulation
    batches=(25 50 100)
    deployed_count=$CANARY_COUNT
    
    for batch_percent in "${batches[@]}"; do
        target_count=$(( TOTAL_CLIENTS * batch_percent / 100 ))
        if [ $target_count -le $deployed_count ]; then
            continue
        fi
        
        batch_size=$(( target_count - deployed_count ))
        if [ $batch_size -gt $REMAINING_COUNT ]; then
            batch_size=$REMAINING_COUNT
        fi
        
        echo ""
        echo "Deploying to ${batch_percent}% of clients (${batch_size} additional clients):"
        
        for ((i=0; i<batch_size; i++)); do
            client=${REMAINING_CLIENTS[$i]}
            echo "  → $client"
            sleep 0.5
        done
        
        deployed_count=$target_count
        
        if [ $batch_percent -lt 100 ]; then
            echo "  Monitoring batch for 5 minutes..."
            sleep 2
            echo "  ✓ Batch deployment successful"
        fi
        
        if [ $deployed_count -ge $TOTAL_CLIENTS ]; then
            break
        fi
    done
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE"
echo "====================="
echo ""
echo "📊 Deployment Summary:"
echo "  Total clients: $TOTAL_CLIENTS"
echo "  Canary group: $CANARY_COUNT clients"
echo "  Success rate: 100%"
echo "  Total time: ~25 minutes"
echo ""
echo "✅ All client sites now running new template version"
echo "📈 Zero downtime achieved"
echo "🛡️  Risk minimized through staged deployment"
echo ""
echo "🔍 Post-deployment monitoring continues for 24 hours"