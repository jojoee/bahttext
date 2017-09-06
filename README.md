# bahttext

[![Travis](https://img.shields.io/travis/jojoee/bahttext.svg)](https://travis-ci.org/jojoee/bahttext)
[![Codecov](https://img.shields.io/codecov/c/github/jojoee/bahttext.svg)](https://codecov.io/github/jojoee/bahttext)
[![Version - npm](https://img.shields.io/npm/v/bahttext.svg)](https://www.npmjs.com/package/bahttext)
[![License - npm](https://img.shields.io/npm/l/bahttext.svg)](http://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

Change number to Thai pronunciation string, test against [Microsoft Office's BAHTTEXT function](https://support.office.com/en-us/article/BAHTTEXT-function-5ba4d0b4-abd3-4325-8d22-7a92d59aab9c), [Demo page](https://jojoee.github.io/bahttext/)

## Installation

```
// npm
npm install bahttext
const bahttext = require('bahttext')

// Bower
bower install bahttext
<script src="bower_components/bahttext/src/index.js"></script>
```

## Example usage

```javascript
// หกหมื่นสามพันหนึ่งร้อยสี่สิบเจ็ดบาทแปดสิบเก้าสตางค์
bahttext(63147.89)
```

## Note
- [x] Compatible with all browsers
- [x] Unit test
- [ ] Browser compatibility test
- [ ] Remove duplication between test code and test-case-csv file
- [x] [Demo page](https://jojoee.github.io/bahttext/)
- [ ] Support negative number
- [ ] Automatically generate `misc/test.json` from `xlsx` file
- [ ] Lint on `index.html`

## Contribute for owner

```
$ npm install -g semantic-release-cli
$ semantic-release-cli setup

Using above command to setup "semantic-release"
```

## Reference
- [Microsoft Office's BAHTTEXT function](https://support.office.com/en-us/article/BAHTTEXT-function-5ba4d0b4-abd3-4325-8d22-7a92d59aab9c)
- Inspired by [earthchie/BAHTTEXT.js](https://github.com/earthchie/BAHTTEXT.js)
