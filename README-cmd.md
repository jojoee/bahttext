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
```
