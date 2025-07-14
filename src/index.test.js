const {
  test,
  expect,
  describe
} = require('@jest/globals')
const {
  bahttext,
  handleNumericInput,
  handleStringInput,
  formatSatang
} = require('./index')
const defaultResult = 'ศูนย์บาทถ้วน'
const groupedTestCasesKey = 'categoryCase'
const googleSheetTestCases = require('../misc/testcases.json').map(item => {
  item[groupedTestCasesKey] = `${item.category}-${item.case}`
  return item
})

/* eslint-disable-next-line no-undef */
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

describe('handleNumericInput', () => {
  test('should handle valid positive numbers', () => {
    expect(handleNumericInput(123)).toEqual({
      baht: 123,
      bahtStr: '123',
      satang: 0,
      isNegative: false
    })

    expect(handleNumericInput(0)).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 0,
      isNegative: false
    })

    expect(handleNumericInput(1)).toEqual({
      baht: 1,
      bahtStr: '1',
      satang: 0,
      isNegative: false
    })
  })

  test('should handle valid negative numbers', () => {
    expect(handleNumericInput(-123)).toEqual({
      baht: 123,
      bahtStr: '123',
      satang: 0,
      isNegative: true
    })

    expect(handleNumericInput(-0)).toEqual({
      baht: -0,
      bahtStr: '0',
      satang: 0,
      isNegative: false
    })

    expect(handleNumericInput(-1)).toEqual({
      baht: 1,
      bahtStr: '1',
      satang: 0,
      isNegative: true
    })
  })

  test('should handle decimal numbers correctly', () => {
    expect(handleNumericInput(123.45)).toEqual({
      baht: 123,
      bahtStr: '123',
      satang: 45,
      isNegative: false
    })

    expect(handleNumericInput(0.01)).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 1,
      isNegative: false
    })

    expect(handleNumericInput(1.50)).toEqual({
      baht: 1,
      bahtStr: '1',
      satang: 50,
      isNegative: false
    })

    expect(handleNumericInput(-123.45)).toEqual({
      baht: 123,
      bahtStr: '123',
      satang: 45,
      isNegative: true
    })
  })

  test('should handle edge cases with floating point precision', () => {
    expect(handleNumericInput(0.1)).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 10,
      isNegative: false
    })

    expect(handleNumericInput(0.99)).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 99,
      isNegative: false
    })

    expect(handleNumericInput(1.999)).toEqual({
      baht: 1,
      bahtStr: '1',
      satang: 99,
      isNegative: false
    })
  })

  test('should return false for non-finite numbers', () => {
    expect(handleNumericInput(NaN)).toBe(false)
    expect(handleNumericInput(Infinity)).toBe(false)
    expect(handleNumericInput(-Infinity)).toBe(false)
  })

  test('should return false for numbers outside safe integer range', () => {
    expect(handleNumericInput(Number.MIN_SAFE_INTEGER - 1)).toBe(false)
    expect(handleNumericInput(Number.MAX_SAFE_INTEGER + 1)).toBe(false)
  })

  test('should handle safe integer range boundaries', () => {
    expect(handleNumericInput(Number.MIN_SAFE_INTEGER)).toEqual({
      baht: Number.MAX_SAFE_INTEGER,
      bahtStr: Number.MAX_SAFE_INTEGER.toString(),
      satang: 0,
      isNegative: true
    })

    expect(handleNumericInput(Number.MAX_SAFE_INTEGER)).toEqual({
      baht: Number.MAX_SAFE_INTEGER,
      bahtStr: Number.MAX_SAFE_INTEGER.toString(),
      satang: 0,
      isNegative: false
    })
  })
})

describe('handleStringInput', () => {
  test('should handle valid positive number strings', () => {
    expect(handleStringInput('123')).toEqual({
      baht: 123,
      bahtStr: '123',
      satang: 0,
      isNegative: false
    })

    expect(handleStringInput('0')).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 0,
      isNegative: false
    })

    expect(handleStringInput('1')).toEqual({
      baht: 1,
      bahtStr: '1',
      satang: 0,
      isNegative: false
    })
  })

  test('should handle valid negative number strings', () => {
    expect(handleStringInput('-123')).toEqual({
      baht: 123,
      bahtStr: '123',
      satang: 0,
      isNegative: true
    })

    expect(handleStringInput('-0')).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 0,
      isNegative: false
    })

    expect(handleStringInput('-1')).toEqual({
      baht: 1,
      bahtStr: '1',
      satang: 0,
      isNegative: true
    })
  })

  test('should handle decimal number strings', () => {
    expect(handleStringInput('123.45')).toEqual({
      baht: 123,
      bahtStr: '123',
      satang: 45,
      isNegative: false
    })

    expect(handleStringInput('0.01')).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 1,
      isNegative: false
    })

    expect(handleStringInput('1.5')).toEqual({
      baht: 1,
      bahtStr: '1',
      satang: 50,
      isNegative: false
    })

    expect(handleStringInput('-123.45')).toEqual({
      baht: 123,
      bahtStr: '123',
      satang: 45,
      isNegative: true
    })
  })

  test('should handle leading zeros correctly', () => {
    expect(handleStringInput('01')).toEqual({
      baht: 1,
      bahtStr: '1',
      satang: 0,
      isNegative: false
    })

    expect(handleStringInput('001.5')).toEqual({
      baht: 1,
      bahtStr: '1',
      satang: 50,
      isNegative: false
    })

    expect(handleStringInput('0001')).toEqual({
      baht: 1,
      bahtStr: '1',
      satang: 0,
      isNegative: false
    })

    expect(handleStringInput('-01')).toEqual({
      baht: 1,
      bahtStr: '1',
      satang: 0,
      isNegative: true
    })

    expect(handleStringInput('-001.5')).toEqual({
      baht: 1,
      bahtStr: '1',
      satang: 50,
      isNegative: true
    })
  })

  test('should handle edge cases with zeros', () => {
    expect(handleStringInput('00')).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 0,
      isNegative: false
    })

    expect(handleStringInput('000')).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 0,
      isNegative: false
    })

    expect(handleStringInput('-00')).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 0,
      isNegative: false
    })

    expect(handleStringInput('-000')).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 0,
      isNegative: false
    })
  })

  test('should handle whitespace', () => {
    expect(handleStringInput(' 123 ')).toEqual({
      baht: 123,
      bahtStr: '123',
      satang: 0,
      isNegative: false
    })

    expect(handleStringInput('  -123.45  ')).toEqual({
      baht: 123,
      bahtStr: '123',
      satang: 45,
      isNegative: true
    })
  })

  test('should handle decimal edge cases', () => {
    expect(handleStringInput('123.')).toEqual({
      baht: 123,
      bahtStr: '123',
      satang: 0,
      isNegative: false
    })

    expect(handleStringInput('.5')).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 50,
      isNegative: false
    })

    expect(handleStringInput('0.1')).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 10,
      isNegative: false
    })

    expect(handleStringInput('0.01')).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 1,
      isNegative: false
    })

    expect(handleStringInput('1.123')).toEqual({
      baht: 1,
      bahtStr: '1',
      satang: 12,
      isNegative: false
    })
  })

  test('should return false for invalid strings', () => {
    expect(handleStringInput('abc')).toBe(false)
    expect(handleStringInput('123abc')).toBe(false)
    expect(handleStringInput('a123')).toBe(false)
    expect(handleStringInput('12.34.56')).toBe(false)
    expect(handleStringInput('--123')).toBe(false)
    expect(handleStringInput('+-123')).toBe(false)
  })

  test('should handle empty and whitespace strings as zero', () => {
    expect(handleStringInput('')).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 0,
      isNegative: false
    })
    expect(handleStringInput('   ')).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 0,
      isNegative: false
    })
    expect(handleStringInput('-')).toEqual({
      baht: 0,
      bahtStr: '0',
      satang: 0,
      isNegative: false
    })
  })

  test('should return false for numbers outside safe integer range', () => {
    const tooLarge = (Number.MAX_SAFE_INTEGER + 1).toString()
    const tooSmall = (Number.MIN_SAFE_INTEGER - 1).toString()
    expect(handleStringInput(tooLarge)).toBe(false)
    expect(handleStringInput(tooSmall)).toBe(false)
  })

  test('should handle safe integer range boundaries', () => {
    const maxSafe = Number.MAX_SAFE_INTEGER.toString()
    const minSafe = Number.MIN_SAFE_INTEGER.toString()

    expect(handleStringInput(maxSafe)).toEqual({
      baht: Number.MAX_SAFE_INTEGER,
      bahtStr: maxSafe,
      satang: 0,
      isNegative: false
    })

    expect(handleStringInput(minSafe)).toEqual({
      baht: Number.MAX_SAFE_INTEGER,
      bahtStr: maxSafe,
      satang: 0,
      isNegative: true
    })
  })
})

describe('formatSatang', () => {
  test('should format satang when both baht and satang exist', () => {
    expect(formatSatang(100, 25)).toBe('บาทยี่สิบห้าสตางค์')
    expect(formatSatang(1, 1)).toBe('บาทหนึ่งสตางค์')
    expect(formatSatang(500, 50)).toBe('บาทห้าสิบสตางค์')
    expect(formatSatang(1000, 99)).toBe('บาทเก้าสิบเก้าสตางค์')
  })

  test('should format satang when only satang exists (no baht)', () => {
    expect(formatSatang(0, 25)).toBe('ยี่สิบห้าสตางค์')
    expect(formatSatang(0, 1)).toBe('หนึ่งสตางค์')
    expect(formatSatang(0, 50)).toBe('ห้าสิบสตางค์')
    expect(formatSatang(0, 99)).toBe('เก้าสิบเก้าสตางค์')
  })

  test('should format specific satang values correctly', () => {
    expect(formatSatang(0, 10)).toBe('สิบสตางค์')
    expect(formatSatang(0, 11)).toBe('สิบเอ็ดสตางค์')
    expect(formatSatang(0, 20)).toBe('ยี่สิบสตางค์')
    expect(formatSatang(0, 21)).toBe('ยี่สิบเอ็ดสตางค์')
    expect(formatSatang(0, 30)).toBe('สามสิบสตางค์')
    expect(formatSatang(0, 31)).toBe('สามสิบเอ็ดสตางค์')
  })

  test('should return "บาทถ้วน" when no satang', () => {
    expect(formatSatang(100, 0)).toBe('บาทถ้วน')
    expect(formatSatang(1, 0)).toBe('บาทถ้วน')
    expect(formatSatang(1000, 0)).toBe('บาทถ้วน')
    expect(formatSatang(0, 0)).toBe('บาทถ้วน')
  })

  test('should handle edge cases with all satang values 1-99', () => {
    // Test all possible satang values
    for (let i = 1; i <= 99; i++) {
      const result = formatSatang(100, i)
      expect(result).toMatch(/^บาท.*สตางค์$/)
      expect(result).toContain('สตางค์')
    }

    // Test with no baht
    for (let i = 1; i <= 99; i++) {
      const result = formatSatang(0, i)
      expect(result).toMatch(/^.*สตางค์$/)
      expect(result).toContain('สตางค์')
      expect(result).not.toContain('บาท')
    }
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
        const number = Number(testCases[i].number)
        expect(bahttext(number)).toBe(testCases[i].text)
      }
    })
  }
})
