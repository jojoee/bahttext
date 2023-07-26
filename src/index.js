const bahtxtConst = {
  defaultResult: 'ศูนย์บาทถ้วน',
  singleUnitStrs: ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'],
  placeNameStrs: ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน']
}

/**
 * @private
 * @param {number[]} nums
 * @returns {string}
 */
function bahtxtNum2Word (nums) {
  let result = ''
  const len = nums.length
  const maxLen = 7

  if (len > maxLen) {
    // more than million
    const overflowIndex = len - maxLen + 1
    const overflowNums = nums.slice(0, overflowIndex)
    const remainingNumbs = nums.slice(overflowIndex)
    return bahtxtNum2Word(overflowNums) + 'ล้าน' + bahtxtNum2Word(remainingNumbs)
  } else {
    for (let i = 0; i < len; i++) {
      const digit = nums[i]
      if (digit > 0) {
        result += bahtxtConst.singleUnitStrs[digit] + bahtxtConst.placeNameStrs[len - i - 1]
      }
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
  return str.replace(/หนึ่งสิบ/g, 'สิบ')
    .replace(/สองสิบ/g, 'ยี่สิบ')
    .replace(/สิบหนึ่ง/g, 'สิบเอ็ด')
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
  if (!num || // no null
    typeof num === 'boolean' || // no boolean
    isNaN(Number(num)) || // must be number only
    num < Number.MIN_SAFE_INTEGER || // not less than Number.MIN_SAFE_INTEGER
    num > Number.MAX_SAFE_INTEGER // no more than Number.MAX_SAFE_INTEGER
  ) {
    return bahtxtConst.defaultResult
  }

  // set
  const positiveNum = Math.abs(num)

  // split baht and satang e.g. 432.214567 >> 432, 21
  const bahtStr = Math.floor(positiveNum).toString()
  /** @type {string} */
  const satangStr = (positiveNum % 1 * 100).toFixed(0)

  /** @type {number[]} */
  const bahtArr = Array.from(bahtStr).map(Number)
  /** @type {number[]} */
  const satangArr = Array.from(satangStr).map(Number)

  // proceed
  let baht = bahtxtNum2Word(bahtArr)
  let satang = bahtxtNum2Word(satangArr)

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
