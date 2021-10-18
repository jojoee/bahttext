const { bahttext } = require('./index')
const defaultResult = 'ศูนย์บาทถ้วน'
const testCases = require('../misc/testcases.json')
jest.autoMockOff()

describe('misc', () => {
  test('invalid number', () => {
    const zeroText = 'ศูนย์บาทถ้วน'

    expect(bahttext(null)).toBe(zeroText)
    expect(bahttext(true)).toBe(zeroText)
    expect(bahttext(false)).toBe(zeroText)
    expect(bahttext([])).toBe(zeroText)
    expect(bahttext([1, 2, 3])).toBe(zeroText)
    expect(bahttext({})).toBe(zeroText)
    expect(bahttext('')).toBe(zeroText)
    expect(bahttext()).toBe(zeroText)
    expect(bahttext(undefined)).toBe(zeroText)
    expect(bahttext('this-is-not-number')).toBe(zeroText)
    expect(bahttext('it-must-be-number-only')).toBe(zeroText)
  })

  test('less than Number.MIN_SAFE_INTEGER', () => {
    const items = [1, 20, 9451, 5656549]
    for (let i = 0; i < items.length; i++) {
      expect(bahttext(Number.MIN_SAFE_INTEGER - items[i])).toBe(defaultResult)
    }
  })

  test('more than Number.MAX_SAFE_INTEGER', () => {
    const items = [1, 20, 9451, 5656549]
    for (let i = 0; i < items.length; i++) {
      expect(bahttext(Number.MAX_SAFE_INTEGER + items[i])).toBe(defaultResult)
    }
  })
})

describe('number', () => {
  test('imported from Google Sheet', () => {
    for (let i = 0; i < testCases.length; i++) {
      const customMessage = JSON.stringify(testCases[i])
      const number = Number(testCases[i].number)
      expect(bahttext(number), customMessage).toBe(testCases[i].text)
    }
  })
})
