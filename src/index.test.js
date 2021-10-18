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

  test('more than Number.MAX_SAFE_INTEGER', () => {
    expect(bahttext(Number.MAX_SAFE_INTEGER + 1)).toBe(defaultResult)
    expect(bahttext(Number.MAX_SAFE_INTEGER + 20)).toBe(defaultResult)
    expect(bahttext(Number.MAX_SAFE_INTEGER + 987)).toBe(defaultResult)
    expect(bahttext(Number.MAX_SAFE_INTEGER + 54848461)).toBe(defaultResult)
  })
})

describe('Google Sheet', () => {
  test('imported from Google Sheet', () => {
    for (let i = 0; i < testCases.length; i++) {
      const customMessage = JSON.stringify(testCases[i])
      expect(bahttext(Number(testCases[i].number)), customMessage).toBe(testCases[i].text)
    }
  })
})

describe('negative number', () => {

  // test('negative number', () => {

  // })
})
