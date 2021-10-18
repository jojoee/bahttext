# bahttext

[![Codecov](https://img.shields.io/codecov/c/github/jojoee/bahttext.svg)](https://codecov.io/github/jojoee/bahttext)
[![Version - npm](https://img.shields.io/npm/v/bahttext.svg)](https://www.npmjs.com/package/bahttext)
[![License - npm](https://img.shields.io/npm/l/bahttext.svg)](http://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release) [![Greenkeeper badge](https://badges.greenkeeper.io/jojoee/bahttext.svg)](https://greenkeeper.io/)

![continuous integration](https://github.com/jojoee/bahttext/workflows/continuous%20integration/badge.svg?branch=master)
![release](https://github.com/jojoee/bahttext/workflows/release/badge.svg?branch=master)
![runnable](https://github.com/jojoee/bahttext/workflows/runnable/badge.svg?branch=master)
![runnable old node](https://github.com/jojoee/bahttext/workflows/runnable%20old%20node/badge.svg?branch=master)

Language: [ไทย](https://github.com/jojoee/bahttext/blob/master/README.md), [English](https://github.com/jojoee/bahttext/blob/master/README-en.md)

Change number to Thai pronunciation string, test against [Google Sheets BAHTTEXT function](https://support.google.com/docs/answer/9982303?hl=en), [Demo page](https://jojoee.github.io/bahttext/)

## Installation

```
// CommonJS
npm install bahttext
const { bahttext } = require('bahttext')

// Bower
bower install bahttext
<script src="bower_components/bahttext/src/index.js"></script>

// githack
<script src="https://raw.githack.com/jojoee/bahttext/master/src/index.js"></script>

// ES6
npm install bahttext
import { bahttext } from "bahttext"
```

## Example usage

```javascript
// หกหมื่นสามพันหนึ่งร้อยสี่สิบเจ็ดบาทแปดสิบเก้าสตางค์
bahttext(63147.89)
```

## Note
- [x] Compatible with all browsers
- [x] Node.js version support: 6-12
- [x] 0 Dependencies
- [x] Unit test
- [ ] Browser compatibility test
- [x] Remove duplication between test code and test-case-csv file
- [x] [Demo page](https://jojoee.github.io/bahttext/)
- [x] Support negative number
- [x] Fix semantic-release

## CMD

```
brew install curl
brew install jq
npm install -g
curl -L -o ./misc/testcases.csv https://docs.google.com/spreadsheets/d/e/2PACX-1vTb8PIKzgo07rn9UpcjqE0YrdMAmf4fyDbL2plUieLCyrn_5O3vDvece7UfkaArWQLUSsaw92jVpY_z/pub?gid=0&single=true&output=csv
csvtojson ./misc/testcases.csv | jq > ./misc/testcases.json
```

## Reference
- [Google Sheets BAHTTEXT function](https://support.google.com/docs/answer/9982303?hl=en)
- [Microsoft Office's BAHTTEXT function](https://support.office.com/en-us/article/BAHTTEXT-function-5ba4d0b4-abd3-4325-8d22-7a92d59aab9c)
- Inspired by [earthchie/BAHTTEXT.js](https://github.com/earthchie/BAHTTEXT.js)
