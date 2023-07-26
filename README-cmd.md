# bahttext

## CMD

```
brew install curl
brew install jq
npm install -g csvtojson
curl -L -o ./misc/testcases.csv https://docs.google.com/spreadsheets/d/e/2PACX-1vTb8PIKzgo07rn9UpcjqE0YrdMAmf4fyDbL2plUieLCyrn_5O3vDvece7UfkaArWQLUSsaw92jVpY_z/pub?gid=0&single=true&output=csv
csvtojson ./misc/testcases.csv | jq > ./misc/testcases.json

# to update dependency version
npm update --save
npm audit fix --force

# mutation test
npm install -g stryker-cli
stryker init
export STRYKER_DASHBOARD_API_KEY=<the_project_api_token>
echo $STRYKER_DASHBOARD_API_KEY
npx stryker run

## npm
npm run build
npm publish --dry-run
```

## Prompt

``````
I'm software engineer who try to publish npm package with README.md file in many lanauges.
Please help translate this README.md file into list of languages below

- China, 中国大陆 (CN) language
- Korea, 대한민국 (KR) language
- Vietnam, Việ (Nam) language
- Japan, 日本 (JP) language
- Russia, Россия (RU) language
- Spanish, Español (ES) language
- French, Français (FR) language

----------------------------------------------------------------

```
## Note

- Compatible with all browsers
- Node.js version support: 6+
- 0 Dependencies
- Demo page
- Support negative number
```
``````
