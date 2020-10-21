# bahttext

[![Travis](https://img.shields.io/travis/jojoee/bahttext.svg)](https://travis-ci.org/jojoee/bahttext)
[![Codecov](https://img.shields.io/codecov/c/github/jojoee/bahttext.svg)](https://codecov.io/github/jojoee/bahttext)
[![Version - npm](https://img.shields.io/npm/v/bahttext.svg)](https://www.npmjs.com/package/bahttext)
[![License - npm](https://img.shields.io/npm/l/bahttext.svg)](http://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release) [![Greenkeeper badge](https://badges.greenkeeper.io/jojoee/bahttext.svg)](https://greenkeeper.io/)

ภาษา: [ไทย](https://github.com/jojoee/bahttext/blob/master/README.md), [English](https://github.com/jojoee/bahttext/blob/master/README-en.md)

เปลี่ยนตัวเลข เป็นคำอ่านภาษาไทย, โมดูลตัวนี้ได้ทำการทดสอบกับ [Microsoft Office's BAHTTEXT function](https://support.office.com/en-us/article/BAHTTEXT-function-5ba4d0b4-abd3-4325-8d22-7a92d59aab9c), [Demo page](https://jojoee.github.io/bahttext/) เรียบร้อยแล้ว

## ติดตั้ง

```
// ติดตั้งด้วย npm
npm install bahttext
const bahttext = require('bahttext')

// ติดตั้งด้วย Bower
bower install bahttext
<script src="bower_components/bahttext/src/index.js"></script>
```

## ตัวอย่างการใช้งาน

```javascript
// หกหมื่นสามพันหนึ่งร้อยสี่สิบเจ็ดบาทแปดสิบเก้าสตางค์
bahttext(63147.89)
```

## ฟีเจอร์
- [x] สามารถใช้งานได้ทุก เบราว์เซอร์
- [x] ทำการทดสอบแบบ unit test
- [ ] ทดสอบบนเบราว์เซอร์ ในแต่ละ เวอร์ชั่น
- [ ] ลดการซ้ำซ้อนของการเขียน ระหว่าง code และ ไฟล์ csv ในการทำการทดสอบ
- [x] [หน้าตัวอย่างการใช้งาน](https://jojoee.github.io/bahttext/)
- [ ] สนับสนุนการใช้งานกับตัวเลขติดลบ

## ร่วมพัฒนา

```
$ npm install -g semantic-release-cli
$ semantic-release-cli setup

Using above command to setup "semantic-release"
```

## อ้างอิง
- [Microsoft Office's BAHTTEXT function](https://support.office.com/en-us/article/BAHTTEXT-function-5ba4d0b4-abd3-4325-8d22-7a92d59aab9c)
- แรงบัลดาลใจจาก [earthchie/BAHTTEXT.js](https://github.com/earthchie/BAHTTEXT.js)
