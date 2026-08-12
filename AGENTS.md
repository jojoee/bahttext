# bahttext

JavaScript library to convert numbers to Thai Baht pronunciation text. Compatible with Google Sheets BAHTTEXT. See [README.md](README.md) for API and usage examples.

## Project structure

```
bahttext/
├── src/
│   ├── index.js       # Main source (all logic)
│   ├── index.d.ts     # TypeScript declarations
│   └── index.test.js  # Jest tests
├── misc/              # Test data from Google Sheets
├── example/           # CommonJS, ES6, HTML examples
├── doc/               # Multi-language README translations
├── .agents/skills/    # Agent skills (project)
└── coverage/          # Test coverage reports
```

## Technology stack

- JavaScript (ES6) with JSDoc type annotations
- Jest for testing (80% coverage threshold)
- Standard.js for linting
- Stryker for mutation testing
- TypeScript (declaration generation only)
- semantic-release for versioning
- Zero runtime dependencies
- Node.js 18+

## Code conventions

- Single source file architecture (`src/index.js`)
- Public function: `bahttext(input)` — accepts number or numeric string
- Helper functions: `numberToWords`, `handleNumericInput`, `handleStringInput`, `formatSatang`
- Lookup tables for Thai words (`ONES`, `TENS`, `SUB_HUNDRED`, `DIGIT`)
- CommonJS module exports with default export
- JSDoc type annotations with `@param`, `@returns`, `@public`, `@private`

## Testing conventions

- Test file: `src/index.test.js`
- Jest with `describe` / `test`
- Import from `@jest/globals`: `const { test, expect, describe } = require('@jest/globals')`
- Cases from Google Sheets: `misc/testcases.json`
- Export private functions for unit testing
- Group tests by function name with `describe` blocks

## Verification steps

Before committing:

1. **Linting**: `npm run standard`
2. **Unit tests**: `npm run test`
3. **Coverage**: `npm run coverage.check` (80% threshold)
4. **Build**: `npm run build` (TypeScript declarations)
5. **Full validation**: `npm run validate` (standard + coverage + build)

## Error handling

- Invalid input (null, undefined, boolean, array, object, non-numeric string) → `"ศูนย์บาทถ้วน"`
- Accept number or numeric string only
- Respect `Number.MIN_SAFE_INTEGER` … `Number.MAX_SAFE_INTEGER`
- Never throw from the public API

## Development commands

### Test data management

Fetch test cases from Google Sheets:

```bash
brew install curl
brew install jq
npm install -g csvtojson
curl -L -o ./misc/testcases.csv https://docs.google.com/spreadsheets/d/e/2PACX-1vTb8PIKzgo07rn9UpcjqE0YrdMAmf4fyDbL2plUieLCyrn_5O3vDvece7UfkaArWQLUSsaw92jVpY_z/pub?gid=0&single=true&output=csv
csvtojson ./misc/testcases.csv | jq > ./misc/testcases.json
```

### Dependency management

```bash
npm update --save
npm audit fix --force
```

### Mutation testing

```bash
npm install -g stryker-cli
stryker init
export STRYKER_DASHBOARD_API_KEY=<the_project_api_token>
echo $STRYKER_DASHBOARD_API_KEY
npx stryker run
```

### Demo testing

```bash
node ./example/commonjs.js
ts-node ./example/es6.ts
(cd example && node remoteCommonjs.js)
(cd example && ts-node remoteEs6.ts)
```

### Publishing

```bash
npm run build
npm publish --dry-run
```

## Benchmark workflow

Before and after performance optimizations:

1. **Run comparison**: `./benchmark-compare.sh <improvement-branch> [baseline-branch]`
   - Default baseline is `master`
   - Results appended to `benchmark-log.csv`
2. **Check results**: Review summary output or `benchmark-log.csv` for improvement percentage
3. **Manual benchmark**: `node benchmark.js` — runs benchmark and logs to CSV

### Benchmark log format

| Column | Description |
|--------|-------------|
| datetime | Timestamp in YYYYMMDD-HHMMSS format |
| branch_name | Git branch being benchmarked |
| sample | Number of sample runs (default: 10) |
| iterations_per_sample | Iterations per sample (default: 10000) |
| test_cases | Number of test cases used |
| mean | Average execution time in ms |
| std | Standard deviation in ms |
| min | Minimum execution time in ms |
| max | Maximum execution time in ms |

### Interpreting results

- Lower `mean` → better performance
- Compare branches by `mean` for the same test configuration
- High `std` → inconsistent performance
- Use `min` for best-case comparison

## Skills

- Performance optimization: [.agents/skills/perf-optimize/SKILL.md](.agents/skills/perf-optimize/SKILL.md)

## Post-work

After implementing a feature:

1. Update [README.md](README.md) (Thai and English) for API or behavior changes
2. Update test cases in `misc/testcases.json` when needed
3. Update `example/` when the API changes
4. Commit with semantic-release prefixes (`feat:`, `fix:`, `docs:`, etc.)
