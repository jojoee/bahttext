const bahttext = require('./index')
jest.autoMockOff()

describe('digit', () => {
  test('1, zero', () => {
    expect(bahttext(0)).toBe('ศูนย์บาทถ้วน')
  })

  test('1 digit', () => {
    expect(bahttext(1)).toBe('หนึ่งบาทถ้วน')
    expect(bahttext(2)).toBe('สองบาทถ้วน')
    expect(bahttext(3)).toBe('สามบาทถ้วน')
    expect(bahttext(4)).toBe('สี่บาทถ้วน')
    expect(bahttext(5)).toBe('ห้าบาทถ้วน')
    expect(bahttext(6)).toBe('หกบาทถ้วน')
    expect(bahttext(7)).toBe('เจ็ดบาทถ้วน')
    expect(bahttext(8)).toBe('แปดบาทถ้วน')
    expect(bahttext(9)).toBe('เก้าบาทถ้วน')
  })

  test('2', () => {
    expect(bahttext(37)).toBe('สามสิบเจ็ดบาทถ้วน')
    expect(bahttext(48)).toBe('สี่สิบแปดบาทถ้วน')
  })
})

describe('misc', () => {
  test('invalid number', () => {
    expect(bahttext('invalid number')).toBe('ศูนย์บาทถ้วน')
  })
})
