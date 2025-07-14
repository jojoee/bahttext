const bahtxtConst = {
  defaultResult: 'ศูนย์บาทถ้วน',
  singleUnitStrs: ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'],
  placeNameStrs: ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน']
}

const GrammarFixs = [
  { pat: /หนึ่งสิบ/g, replace: 'สิบ' },
  { pat: /สองสิบ/g, replace: 'ยี่สิบ' },
  { pat: /สิบหนึ่ง/g, replace: 'สิบเอ็ด' }
]

/**
 * @private
 * @param {number[]} nums
 * @returns {string}
 */
function bahtxtNum2Word (nums) {
  /**
   * Converts a numeric string (or legacy digit array) into Thai words without unit suffix.
   * The new implementation iterates over the input string directly, eliminating
   * the intermediate `Array.from(...).map(Number)` allocations previously used.
   *
   * @param {string|number[]} nums – string of digits ("123") or array \[1,2,3].
   * @returns {string}
   */
  let numStr = ''

  if (typeof nums === 'string') {
    numStr = nums
  } else if (Array.isArray(nums)) {
    numStr = nums.join('')
  } else {
    return ''
  }

  // Trim leading zeros but leave at least one digit so "0" stays "0"
  numStr = numStr.replace(/^0+/, '') || '0'

  const len = numStr.length
  const maxLen = 7 // handle up to 6-digit group + 1-digit look-ahead for "ล้าน" logic

  if (len > maxLen) {
    const overflowIndex = len - maxLen + 1
    const overflowStr = numStr.slice(0, overflowIndex)
    const remainingStr = numStr.slice(overflowIndex)
    return bahtxtNum2Word(overflowStr) + 'ล้าน' + bahtxtNum2Word(remainingStr)
  }

  let result = ''
  for (let i = 0; i < len; i++) {
    const digit = numStr.charCodeAt(i) - 48 // faster than parseInt(numStr[i], 10)
    if (digit > 0) {
      result +=
        bahtxtConst.singleUnitStrs[digit] +
        bahtxtConst.placeNameStrs[len - i - 1]
    }
  }

  return result
}

/**
 * @private
 * @todo improve performance
 * @param {string} str
 * @returns {string}
 */
function bahtxtGrammarFix (str) {
  for (const GrammarFix of GrammarFixs) {
    str = str.replace(GrammarFix.pat, GrammarFix.replace)
  }
  return str
}

/**
 * bahtxtCombine baht and satang
 * and also adding unit
 *
 * @private
 * @param {string} baht
 * @param {string} satang
 * @returns {string}
 */
function bahtxtCombine (baht, satang) {
  if (!baht && !satang) {
    return bahtxtConst.defaultResult
  } else if (baht && !satang) {
    return baht + 'บาท' + 'ถ้วน'
  } else if (!baht && satang) {
    return satang + 'สตางค์'
  } else {
    return baht + 'บาท' + satang + 'สตางค์'
  }
}

/**
 * Change number to Thai pronunciation string
 *
 * @public
 * @param {number} num
 * @returns {string}
 */
function bahttext (num) {
  if (num === null || num === undefined || // explicit null/undefined check, allow 0
    typeof num === 'boolean' || // no boolean
    isNaN(Number(num)) || // must be numeric coercible
    num < Number.MIN_SAFE_INTEGER || // outside JS safe integer range
    num > Number.MAX_SAFE_INTEGER
  ) {
    return bahtxtConst.defaultResult
  }

  // normalise sign & prepare parts
  const positiveNum = Math.abs(Number(num))

  const bahtPart = Math.floor(positiveNum)

  const bahtStr = String(bahtPart)
  // Keep original rounding behaviour ("toFixed(0)") to avoid output drift
  const satangStr = (positiveNum % 1 * 100).toFixed(0)

  // Convert directly without creating intermediate digit arrays
  let baht = bahtxtNum2Word(bahtStr)
  let satang = bahtxtNum2Word(satangStr)

  // grammar
  baht = bahtxtGrammarFix(baht)
  satang = bahtxtGrammarFix(satang)

  // combine
  const result = bahtxtCombine(baht, satang)

  return num >= 0 ? result : 'ลบ' + result
}

if (typeof module !== 'undefined' &&
  module.exports != null) {
  module.exports = {
    bahttext,

    // export for testing only
    bahtxtNum2Word,
    bahtxtGrammarFix,
    bahtxtCombine
  }
  exports.default = {
    bahttext
  }
}
