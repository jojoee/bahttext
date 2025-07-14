const EMPTY = ''
const ONE = 'หนึ่ง'
const TWO = 'สอง'
const THREE_TO_NINE = ['สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
const ED = 'เอ็ด'
const YEE = 'ยี่'
const LAN = 'ล้าน'

// Index 0-5 correspond to units,สิบ,ร้อย,พัน,หมื่น,แสน
const DIGIT = [EMPTY, 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน']

// Helpers to build word tables quickly
const ONES = [EMPTY, ED, TWO, ...THREE_TO_NINE]
const TENS = [
  EMPTY,
  ...[EMPTY, YEE, ...THREE_TO_NINE].map(t => t + DIGIT[1]) // "สิบ" family
]
// 0-99 lookup (fast satang conversion)
const SUB_HUNDRED = TENS.reduce(
  (acc, t) => acc.concat(ONES.map(o => t + o)),
  []
)

// Special case: 1 should read "หนึ่ง" not "เอ็ด"
SUB_HUNDRED[1] = ONE

// Single-digit lookup for generic conversion (no suffix)
const SUB_TEN = [EMPTY, ONE, TWO, ...THREE_TO_NINE]

// Pre-compiled constants for frequently used combinations
const YEE_SIB = YEE + DIGIT[1] // "ยี่สิบ"
const SIB = DIGIT[1] // "สิบ"

// Default fallback text used throughout tests
const DEFAULT_RESULT = 'ศูนย์บาทถ้วน'

/**
 * Convert number → Thai Baht text (supports number or numeric string)
 * Mirrors behaviour of previous implementation but with faster core.
 *
 * @public
 * @param {number|string} input
 * @returns {string}
 */
function bahttext (input) {
  // Early invalidation – keep behaviour expected by test suite
  if (input === null || input === undefined ||
    typeof input === 'boolean' || Array.isArray(input) ||
    (typeof input !== 'number' && typeof input !== 'string')) {
    return DEFAULT_RESULT
  }

  const converted = convertInternal(input)
  return converted === false ? DEFAULT_RESULT : converted
}

/**
 * @private
 * @param {string} numStr – e.g. "123" (no sign, may include leading zeros)
 * @returns {string}
 */
function numberToWords (numStr) {
  // Short-circuit trivial "0"
  if (numStr === '0') return ''

  let output = EMPTY
  const len = numStr.length

  for (let i = 0; i < len; i++) {
    const d = numStr[i]
    const di = len - i - 1 // distance from rightmost digit
    const diMod = di % 6 // position inside a 6-digit group

    if (d === '0') {
      // skip zero – no wording
    } else if (diMod === 1) {
      // tens column inside group
      if (d === '1') {
        // "สิบ"
        output += SIB
      } else if (d === '2') {
        // "ยี่สิบ"
        output += YEE_SIB
      } else {
        const digitCode = d.charCodeAt(0) - 48
        output += SUB_TEN[digitCode] + DIGIT[diMod]
      }
    } else if (diMod === 0 && d === '1' && i !== 0) {
      // trailing 1 (in ones place, not first digit in overall number) → "เอ็ด"
      // BUT: if it's a stand-alone digit in hundreds place (like 201), use "หนึ่ง"
      const isStandAloneInHundreds = (di === 0 && len > 1 && numStr[i - 1] === '0')
      output += isStandAloneInHundreds ? ONE : ED
    } else {
      const digitCode = d.charCodeAt(0) - 48 // faster than Number(d)
      output += SUB_TEN[digitCode] + DIGIT[diMod]
    }

    // add "ล้าน" after finishing each 6-digit block (except last group)
    if (diMod === 0 && di) {
      output += LAN
    }
  }

  return output
}

/**
 * @private
 * Handle numeric input and extract baht/satang values
 * @param {number} input - numeric input (positive or negative)
 * @returns {{baht: number, bahtStr: string, satang: number, isNegative: boolean} | false}
 */
function handleNumericInput (input) {
  if (!Number.isFinite(input)) return false
  if (input < Number.MIN_SAFE_INTEGER || input > Number.MAX_SAFE_INTEGER) {
    return false
  }

  const isNegative = input < 0
  if (isNegative) {
    input = -input
  }

  const baht = Math.floor(input)
  const satang = Number.isInteger(input)
    ? 0
    : Math.floor(((input + Number.EPSILON * (baht || 1)) * 100) % 100)
  const bahtStr = baht.toString() // slightly faster than String(baht)

  return { baht, bahtStr, satang, isNegative }
}

/**
 * @private
 * Handle string input and extract baht/satang values
 * @param {string} input - string input (numeric string, positive or negative)
 * @returns {{baht: number, bahtStr: string, satang: number, isNegative: boolean} | false}
 */
function handleStringInput (input) {
  let formatted = input.trim()

  if (formatted.startsWith('-')) {
    formatted = formatted.replace(/^-0+/, '-') // keep sign, drop leading zeros
    if (formatted === '-') formatted = '0' // catch "-" or "-0"
  } else {
    formatted = formatted.replace(/^0+/, '') || '0' // combine with empty check
  }

  // Not a valid number?
  if (formatted === '') formatted = '0'
  let inputNum = Number(formatted)
  if (Number.isNaN(inputNum)) return false

  const isNegative = inputNum < 0
  if (isNegative) {
    inputNum = -inputNum
    // remove sign for string slicing later
    formatted = formatted.slice(1)
  }

  // Safe-range check after absolute value
  if (inputNum < Number.MIN_SAFE_INTEGER || inputNum > Number.MAX_SAFE_INTEGER) {
    return false
  }

  let baht, bahtStr, satang, satangStr

  // Handle decimal part by string slicing to avoid FP errors
  const periodIdx = formatted.lastIndexOf('.')
  if (periodIdx !== -1) {
    bahtStr = formatted.slice(0, periodIdx) || '0'
    baht = Number(bahtStr)

    satangStr = formatted.slice(periodIdx + 1)
    satang = satangStr
      ? Number(satangStr.slice(0, 2)) * (satangStr.length >= 2 ? 1 : [100, 10][satangStr.length])
      : 0
  } else {
    baht = inputNum
    bahtStr = formatted
    satang = 0
  }

  return { baht, bahtStr, satang, isNegative }
}

/**
 * @private
 * Format satang portion of the output
 * @param {number} baht - baht amount
 * @param {number} satang - satang amount
 * @returns {string} formatted satang string
 */
function formatSatang (baht, satang) {
  if (satang) {
    let output = ''
    if (baht) output += 'บาท'
    output += SUB_HUNDRED[satang] + 'สตางค์'
    return output
  } else {
    return 'บาทถ้วน'
  }
}

/**
 * @private
 * Returns false when input cannot be parsed as numeric.
 */
function convertInternal (input) {
  let baht, bahtStr, satang
  let isNegative = false

  if (typeof input === 'number') {
    // Numeric input handling
    const result = handleNumericInput(input)
    if (result === false) return false

    baht = result.baht
    bahtStr = result.bahtStr
    satang = result.satang
    isNegative = result.isNegative
  } else if (typeof input === 'string') {
    // String input handling
    const result = handleStringInput(input)
    if (result === false) return false

    baht = result.baht
    bahtStr = result.bahtStr
    satang = result.satang
    isNegative = result.isNegative
  } else {
    // unreachable due to early guard, but for safety
    return false
  }

  // No value at all → zero
  if (!baht && !satang) {
    return DEFAULT_RESULT
  }

  // Build output
  let output = isNegative ? 'ลบ' : EMPTY

  // Baht part – using fast converter
  const bahtWords = numberToWords(bahtStr)
  output += bahtWords

  // Satang
  output += formatSatang(baht, satang)

  return output
}

module.exports = {
  bahttext,
  // Export private functions for testing
  handleNumericInput,
  handleStringInput,
  formatSatang
}

exports.default = { bahttext }
