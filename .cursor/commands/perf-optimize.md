---
description: Systematic performance optimization with benchmark validation
---

# Performance Optimization Workflow

A systematic approach to test performance improvements with benchmark validation.

## Step 1: Analyze Current Code

Identify potential optimizations in the hot path. Common areas to consider:

- String concatenation patterns (array.join vs +=)
- Loop optimizations (modulo vs counter, early exits)
- Type checking simplification
- Regex vs manual parsing
- Lookup table usage
- Function inlining for hot paths

## Step 2: Establish Baseline

Before any changes, run benchmark on master branch:

```bash
cd bahttext && git checkout master && node benchmark.js "baseline measurement"
cd bahttext && git checkout perf/position-counter && node benchmark.js "use decrementing counter instead of modulo"
```

Record the baseline mean and std from `benchmark-log.csv`. Then manually update the `result` column to "baseline".

**Benchmark usage:** `node benchmark.js "<details>"`
- `details`: One sentence describing the optimization concept
- `result` column is left empty, update manually after comparing with baseline

## Step 3: Create Optimization Branch

For each optimization idea, create a dedicated branch:

```bash
git checkout master
git checkout -b perf/<optimization-name>
```

Branch naming convention: `perf/<short-description>`
Examples: `perf/array-join`, `perf/entry-validation`, `perf/regex-to-loop`

## Step 4: Implement Single Change

Make ONE focused change per branch. Keep changes minimal and isolated.

## Step 5: Validate Correctness

Run full validation before benchmarking:

```bash
npm run validate
```

All tests must pass before proceeding.

## Step 6: Run Benchmark

```bash
node benchmark.js "description of optimization"
```

Results are automatically logged to `benchmark-log.csv` with branch name and details. The `result` column is left empty.

## Step 7: Decision Criteria

Compare against master baseline:

| Condition | Action |
|-----------|--------|
| New mean < master mean (by > 1 std) | Create benchmark-note.txt, merge to master |
| New mean ~ master mean (within 1 std) | No improvement, delete branch |
| New mean > master mean | Regression, delete branch |

## Step 8: Handle Results

After comparing benchmark results, update the last row in `benchmark-log.csv` with the result decision.

### If Better (merge):

1. Update CSV result column: `-X.X% faster MERGED`
2. Create benchmark note and merge:

```bash
# Create benchmark note
echo "# Performance Improvement: perf/<name>

## What Changed
<description>

## Benchmark Results
- Master mean: XXX.XX ms
- Optimized mean: XXX.XX ms
- Improvement: X.X% faster
" >> benchmark-note.txt

# Commit and merge
git add -A
git commit -m "perf: <description of optimization>"
git checkout master
git merge perf/<optimization-name>
git branch -d perf/<optimization-name>
```

### If Not Better (delete branch):

1. Update CSV result column: `+X.X% slower REJECTED` or `-X.X% (noise) REJECTED`
2. Delete the branch:

```bash
git checkout master
git branch -D perf/<optimization-name>
```

## Step 9: Iterate

Repeat steps 3-8 for each optimization idea. Always branch from the latest master.

## Key Learnings

Common "optimizations" that often backfire in modern V8:

1. **Array.join() vs string +=**: V8 optimizes += very well for short strings
2. **Avoiding modulo**: Modulo is highly optimized, manual counters add overhead
3. **Regex replacement**: Cached regex is often faster than manual loops
4. **Extra type checks**: typeof comparisons are already very fast

Always benchmark. Intuition about performance is often wrong.
