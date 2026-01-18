#!/bin/bash
# Benchmark comparison script
# Usage: ./benchmark-compare.sh <branch1> [branch2]
#   branch1: improvement branch to test
#   branch2: baseline branch (default: master)

set -e

BRANCH1=$1
BRANCH2=${2:-master}

if [ -z "$BRANCH1" ]; then
  echo "Usage: ./benchmark-compare.sh <improvement-branch> [baseline-branch]"
  echo "  improvement-branch: branch to test (required)"
  echo "  baseline-branch: baseline branch (default: master)"
  exit 1
fi

echo "===== Benchmark Comparison ====="
echo "Baseline: $BRANCH2"
echo "Improved: $BRANCH1"
echo ""

# Save current state
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $ORIGINAL_BRANCH"

# Stash changes - exit if fails
echo "Stashing any uncommitted changes..."
if ! git stash push -m "benchmark-compare auto-stash"; then
  echo "Git stash failed. Exiting."
  exit 1
fi

# Track if we actually stashed something
STASH_COUNT_BEFORE=$(git stash list | wc -l)

# Function to restore original state
restore_state() {
  echo ""
  echo "Restoring original state..."
  git checkout "$ORIGINAL_BRANCH" 2>/dev/null || true
  
  STASH_COUNT_AFTER=$(git stash list | wc -l)
  if [ "$STASH_COUNT_AFTER" -gt "$STASH_COUNT_BEFORE" ] || git stash list | head -1 | grep -q "benchmark-compare auto-stash"; then
    git stash pop 2>/dev/null || true
  fi
}

# Set trap to restore state on exit
trap restore_state EXIT

# Run benchmark on baseline (branch2)
echo ""
echo "Benchmarking baseline ($BRANCH2)..."
git checkout "$BRANCH2" || { echo "Failed to checkout $BRANCH2"; exit 1; }
node benchmark.js

# Run benchmark on improvement (branch1)
echo ""
echo "Benchmarking improved ($BRANCH1)..."
git checkout "$BRANCH1" || { echo "Failed to checkout $BRANCH1"; exit 1; }
node benchmark.js

# Disable trap since we'll restore manually
trap - EXIT
restore_state

# ===== Summary =====
echo ""
echo "===== Benchmark Comparison Summary ====="
echo ""

# Parse last 2 entries from benchmark-log.csv
BASELINE=$(tail -2 benchmark-log.csv | head -1)
IMPROVED=$(tail -1 benchmark-log.csv)

# Extract values
BASELINE_MEAN=$(echo "$BASELINE" | cut -d',' -f6)
IMPROVED_MEAN=$(echo "$IMPROVED" | cut -d',' -f6)
BASELINE_BRANCH=$(echo "$BASELINE" | cut -d',' -f2)
IMPROVED_BRANCH=$(echo "$IMPROVED" | cut -d',' -f2)
BASELINE_STD=$(echo "$BASELINE" | cut -d',' -f7)
IMPROVED_STD=$(echo "$IMPROVED" | cut -d',' -f7)

echo "Baseline ($BASELINE_BRANCH):"
echo "  Mean: ${BASELINE_MEAN} ms"
echo "  Std:  ${BASELINE_STD} ms"
echo ""
echo "Improved ($IMPROVED_BRANCH):"
echo "  Mean: ${IMPROVED_MEAN} ms"
echo "  Std:  ${IMPROVED_STD} ms"
echo ""

# Calculate percentage change
CHANGE=$(echo "scale=2; (($BASELINE_MEAN - $IMPROVED_MEAN) / $BASELINE_MEAN) * 100" | bc)

if (( $(echo "$CHANGE > 0" | bc -l) )); then
  echo "Result: ${CHANGE}% FASTER"
elif (( $(echo "$CHANGE < 0" | bc -l) )); then
  CHANGE_ABS=$(echo "$CHANGE * -1" | bc)
  echo "Result: ${CHANGE_ABS}% SLOWER"
else
  echo "Result: NO CHANGE"
fi

echo ""
echo "========================================"
