const { bahttext } = require('./src')
const THBText = require('thai-baht-text')
const { ThaiBaht } = require('thai-baht-text-ts')
const { convert } = require('baht')

const allTestcases = require('./misc/testcases.json')
const nTestCases = allTestcases.length
const testcases = allTestcases.slice(0, nTestCases)
const numbers = testcases.map(item => parseFloat(item.number))
const nIterations = 10000

const testedLib = {
  bahttext: n => bahttext(n),
  baht: n => convert(n),
  'thai-baht-text': n => THBText(n),
  'thai-baht-text-ts': n => ThaiBaht(n)
}

Object.entries(testedLib).forEach(([name, fn]) => {
  const start = new Date()

  new Array(nIterations).fill(0).forEach(_ => {
    numbers.forEach(number => fn(number))
  })

  const end = new Date()
  const elapsed = end - start
  console.log(`${name}: elapsed: ${elapsed} ms, start: ${start.toISOString()}, end: ${end.toISOString()}`)
})
