const {
  bahttext,
  bahtxtGrammarFix: grammarFix,
  bahtxtCombine: combine
} = require('./index')
const defaultResult = 'ศูนย์บาทถ้วน'
const groupedTestCasesKey = 'categoryCase'
const googleSheetTestCases = require('../misc/testcases.json').map(item => {
  item[groupedTestCasesKey] = `${item.category}-${item.case}`
  return item
})
jest.autoMockOff()

// TODO: move to somewhere else
// TODO: write test
function groupBy (arr, key) {
  return arr.reduce((acc, curr) => {
    acc[curr[key]] = (acc[curr[key]] || []).concat(curr)
    return acc
  }, {})
}

const groupedTestCases = groupBy(googleSheetTestCases, groupedTestCasesKey)

// TODO: to be implemented
describe('num2Word', () => {
  test('test', () => {
    expect(true).toBeTruthy()
  })
})

describe('grammarFix', () => {
  test('replace "หนึ่งสิบ" with "สิบ"', () => {
    expect(grammarFix('หนึ่งสิบหก')).toBe('สิบหก')
    expect(grammarFix('หนึ่งสิบสี่')).toBe('สิบสี่')
    expect(grammarFix('ห้าร้อยหนึ่งสิบสาม')).toBe('ห้าร้อยสิบสาม')
    expect(grammarFix('สี่หมื่นหนึ่งสิบสาม')).toBe('สี่หมื่นสิบสาม')
  })

  test('replace "สองสิบ" with "ยี่สิบ"', () => {
    expect(grammarFix('ห้าร้อยสองสิบหนึ่ง')).toBe('ห้าร้อยยี่สิบเอ็ด')
    expect(grammarFix('สองสิบสี่')).toBe('ยี่สิบสี่')
    expect(grammarFix('เก้าแสนหกหมื่นสามพันสามร้อยสองสิบสี่')).toBe('เก้าแสนหกหมื่นสามพันสามร้อยยี่สิบสี่')
    expect(grammarFix('เจ็ดหมื่นห้าพันสี่ร้อยสองสิบหนึ่ง')).toBe('เจ็ดหมื่นห้าพันสี่ร้อยยี่สิบเอ็ด')
  })

  test('replace "สิบหนึ่ง" with "สิบเอ็ด"', () => {
    expect(grammarFix('หนึ่งสิบหนึ่ง')).toBe('สิบเอ็ด')
  })
})

describe('combine', () => {
  test('both baht and satang are empty', () => {
    expect(combine('', '')).toBe('ศูนย์บาทถ้วน')
  })

  test('both baht and satang are not empty', () => {
    expect(combine('หนึ่งร้อยยี่สิบสาม', 'ห้าสิบหก')).toBe('หนึ่งร้อยยี่สิบสามบาทห้าสิบหกสตางค์')
  })

  test('has only baht', () => {
    expect(combine('แปดแสนเจ็ดหมื่นสี่พันห้าร้อยหกสิบสาม', '')).toBe('แปดแสนเจ็ดหมื่นสี่พันห้าร้อยหกสิบสามบาทถ้วน')
  })

  test('has only satang', () => {
    expect(combine('', 'ลบสามสิบหก')).toBe('ลบสามสิบหกสตางค์')
  })
})

describe('bahttext', () => {
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
    expect(bahttext('a123')).toBe(zeroText)
  })

  test('leading with zero', () => {
    expect(bahttext('0.1')).toBe('สิบสตางค์')
    expect(bahttext('01.1')).toBe('หนึ่งบาทสิบสตางค์')
    expect(bahttext('-01.1')).toBe('ลบหนึ่งบาทสิบสตางค์')
    expect(bahttext('000.01')).toBe('หนึ่งสตางค์')
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

  // numbers are imported from Google Sheets
  for (const [groupedName, testCases] of Object.entries(groupedTestCases)) {
    test(`imported Google Sheets: ${groupedName}`, () => {
      for (let i = 0; i < testCases.length; i++) {
        const customMessage = JSON.stringify(testCases[i])
        const number = Number(testCases[i].number)
        expect(bahttext(number), customMessage).toBe(testCases[i].text)
      }
    })
  }
})
