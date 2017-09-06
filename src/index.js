/*
step:
1. validate
2. sanitize
3. split
4. proceed
5. grammar
6. combine
*/

const defaultResult = 'ศูนย์บาทถ้วน'
const singleUnitStrs = [
  '',
  'หนึ่ง',
  'สอง',
  'สาม',
  'สี่',
  'ห้า',
  'หก',
  'เจ็ด',
  'แปด',
  'เก้า'
]
const placeNameStrs = [
  '',
  'สิบ',
  'ร้อย',
  'พัน',
  'หมื่น',
  'แสน',
  'ล้าน'
]

/**
 * @param {number[]} nums
 * @returns {string}
 */
function num2Word (nums) {
  let result = ''
  const len = nums.length
  const maxLen = 7

  if (len > maxLen) {
    // more than million
    const overflowIndex = len - maxLen + 1
    const overflowNums = nums.slice(0, overflowIndex)
    const remainingNumbs = nums.slice(overflowIndex)
    return num2Word(overflowNums) + 'ล้าน' + num2Word(remainingNumbs)
  } else {
    for (let i = 0; i < len; i++) {
      const digit = nums[i]
      if (digit > 0) {
        result += singleUnitStrs[digit] + placeNameStrs[len - i - 1]
      }
    }
  }

  return result
}

/**
 * @param {string} str
 * @returns {string}
 */
function grammarFix (str) {
  let result = str

  // "สิบ"
  result = result.replace('หนึ่งสิบ', 'สิบ')
  // "ยี่สิบ"
  result = result.replace('สองสิบ', 'ยี่สิบ')
  // "เอ็ด"
  const neungLen = 5
  if (result.length > neungLen &&
    result.length - result.lastIndexOf('หนึ่ง') === neungLen) {
    result = result.substr(0, result.length - neungLen) + 'เอ็ด'
  }

  return result
}

/**
 * Combine baht and satang
 * and also adding unit
 *
 * @param {string} baht
 * @param {string} satang
 * @returns {string}
 */
function combine (baht, satang) {
  let result = ''

  if (baht === '' && satang === '') {
    result = defaultResult
  } else if (baht !== '' && satang === '') {
    result = baht + 'บาท' + 'ถ้วน'
  } else if (baht === '' && satang !== '') {
    result = satang + 'สตางค์'
  } else {
    result = baht + 'บาท' + satang + 'สตางค์'
  }

  return result
}

/**
 * Change number to Thai pronunciation string
 *
 * @param {number} num
 * @returns {string}
 */
function bahttext (num) {
  let result = defaultResult

  // 1. validate: invalid number
  if (isNaN(num)) return result
  // 1. validate: more than
  if (num >= Number.MAX_SAFE_INTEGER) return result

  // 2. sanitize: ????

  // 3. split: baht and satang
  // e.g. 432.21 >> 432, 21
  // @todo optimize
  /** @type {string} */
  const bahtStr = Math.floor(num).toString()
  /** @type {string} */
  const satangStr = Math.round(num % 1 * 100).toString()

  // 3. split: convert number array
  // @todo optimize it
  /** @type {number[]} */
  const bahtArr = Array.from(bahtStr).map(Number)
  /** @type {number[]} */
  const satangArr = Array.from(satangStr).map(Number)

  // 4. proceed
  let baht = num2Word(bahtArr)
  let satang = num2Word(satangArr)

  // 5. grammar
  baht = grammarFix(baht)
  satang = grammarFix(satang)

  // 6. combine
  result = combine(baht, satang)

  return result
}

if (typeof module !== 'undefined' &&
  module.exports != null) {
  module.exports = bahttext
}
