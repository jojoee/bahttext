const { performance } = require('perf_hooks')
const fs = require('fs')
const { execSync } = require('child_process')

const { bahttext } = require('./src')

const allTestcases = require('./misc/testcases.json')
const testcases = allTestcases
const numbers = testcases.map(item => parseFloat(item.number))

// Configuration
const nSamples = 10
const nIterations = 10000

// Command line argument for details column
// Usage: node benchmark.js "optimization description"
// Result column is left empty - update manually after comparing with baseline
const args = process.argv.slice(2)
const details = args[0] || ''

// NOTE: No warm-up run implemented. First iteration may include JIT compilation overhead.
// For more accurate results, consider adding warm-up runs in future versions.

/**
 * Format date to yyyyMMdd-HHmmss
 * @param {Date} date
 * @returns {string}
 */
function formatDatetime (date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}-${hours}${minutes}${seconds}`
}

/**
 * Calculate mean of an array
 * @param {number[]} arr
 * @returns {number}
 */
function mean (arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

/**
 * Calculate standard deviation of an array
 * @param {number[]} arr
 * @returns {number}
 */
function std (arr) {
  const m = mean(arr)
  return Math.sqrt(arr.map(x => (x - m) ** 2).reduce((a, b) => a + b, 0) / arr.length)
}

/**
 * Run benchmark and collect samples
 * @returns {{samples: number[], mean: number, std: number, min: number, max: number}}
 */
function runBenchmark () {
  const samples = []

  for (let s = 0; s < nSamples; s++) {
    const start = performance.now()

    for (let i = 0; i < nIterations; i++) {
      for (let j = 0; j < numbers.length; j++) {
        bahttext(numbers[j])
      }
    }

    const elapsed = performance.now() - start
    samples.push(elapsed)
  }

  return {
    samples,
    mean: mean(samples),
    std: std(samples),
    min: Math.min(...samples),
    max: Math.max(...samples)
  }
}

/**
 * Get current git branch name
 * @returns {string}
 */
function getBranchName () {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

/**
 * Ensure CSV file exists with header
 * @param {string} filepath
 */
function ensureCsvHeader (filepath) {
  const header = 'datetime,branch_name,sample,iterations_per_sample,test_cases,mean,std,min,max,details,result\n'
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, header)
  }
}

/**
 * Escape CSV field (wrap in quotes if contains comma or quote)
 * @param {string} field
 * @returns {string}
 */
function escapeCsvField (field) {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return '"' + field.replace(/"/g, '""') + '"'
  }
  return field
}

/**
 * Append benchmark result to CSV
 * @param {string} filepath
 * @param {object} result
 */
function appendToCsv (filepath, result) {
  const datetime = formatDatetime(new Date())
  const branchName = getBranchName()

  const row = [
    datetime,
    branchName,
    nSamples,
    nIterations,
    testcases.length,
    result.mean.toFixed(2),
    result.std.toFixed(2),
    result.min.toFixed(2),
    result.max.toFixed(2),
    escapeCsvField(details),
    '' // result column - update manually after comparing with baseline
  ].join(',') + '\n'

  fs.appendFileSync(filepath, row)
}

// Main execution
const csvPath = 'benchmark-log.csv'

console.log('Running benchmark...')
console.log(`  Samples: ${nSamples}`)
console.log(`  Iterations per sample: ${nIterations}`)
console.log(`  Test cases: ${testcases.length}`)
if (details) console.log(`  Details: ${details}`)
console.log('')

const result = runBenchmark()

console.log('Results:')
console.log(`  Mean: ${result.mean.toFixed(2)} ms`)
console.log(`  Std:  ${result.std.toFixed(2)} ms`)
console.log(`  Min:  ${result.min.toFixed(2)} ms`)
console.log(`  Max:  ${result.max.toFixed(2)} ms`)
console.log('')

ensureCsvHeader(csvPath)
appendToCsv(csvPath, result)

console.log(`Results appended to ${csvPath}`)
