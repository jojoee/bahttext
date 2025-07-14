const { bahttext } = require('./src')
const { bahttext: bahttext230 } = require('bahttext230')
const { bahttext: bahttext231 } = require('bahttext231')
const { convert } = require('baht')

const allTestcases = require('./misc/testcases.json')
const nTestCases = allTestcases.length
const testcases = allTestcases.slice(0, nTestCases)
const numbers = testcases.map(item => parseFloat(item.number))
const nIterations = 10000

const testedLib = {
  // baseline
  bahttext230: n => bahttext230(n),

  // others
  bahttext231: n => bahttext231(n),
  bahttext: n => bahttext(n),
  baht: n => convert(n)
}

let baselineElapsed = null // capture baseline elapsed time

Object.entries(testedLib).forEach(([name, fn]) => {
  const start = new Date()

  new Array(nIterations).fill(0).forEach(_ => {
    numbers.forEach(number => fn(number))
  })

  const end = new Date()
  const elapsed = end - start

  if (baselineElapsed === null) {
    // first library is treated as baseline
    baselineElapsed = elapsed
    console.log(`${name}: elapsed: ${elapsed} ms (baseline), start: ${start.toISOString()}, end: ${end.toISOString()}`)
  } else {
    const relative = (elapsed / baselineElapsed).toFixed(2)
    console.log(`${name}: elapsed: ${elapsed} ms (${relative}x), start: ${start.toISOString()}, end: ${end.toISOString()}`)
  }
})
