const { transformFileSync } = require('@babel/core');
const insertParametersPlugin = require("./learn02_1.js");
const path = require('path');

// console.log(__dirname)
const file = path.resolve(__dirname, './learn02_sourcecode.js');
const { code } = transformFileSync(file, {
  plugins: [insertParametersPlugin],
  parserOpts: {
    sourceType: 'unambiguous',
    plugins: ['jsx']
  }
});

console.log(code);
