const fs = require("fs");
const vsctm = require("vscode-textmate");

/**
 * Utility to read a file as a promise
 */
function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => (error ? reject(error) : resolve(data)));
  });
}

// Create a registry that can create a grammar from a scope name.
const registry = new vsctm.Registry({
  loadGrammar: scopeName => {
    if (scopeName === "source.ocaml") {
      // https://github.com/textmate/javascript.tmbundle/blob/master/Syntaxes/JavaScript.plist
      return readFile("./syntax/ocaml.json").then(data => {
        console.log(vsctm);
        return vsctm.parseRawGrammar(data.toString(), "./syntax/ocaml.json");
      });
    } else if (scopeName === "source.js") {
      // https://github.com/textmate/javascript.tmbundle/blob/master/Syntaxes/JavaScript.plist
      // return readFile('./JavaScript.plist').then(data => vsctm.parseRawGrammar(data.toString()))
      // https://github.com/textmate/javascript.tmbundle/blob/master/Syntaxes/JavaScript.plist
      // return readFile('./JavaScript.plist').then(data => {
      // 	vsctm.parseRawGrammar(data.toString())
      // })
      // var gramfile = './syntax/javascript.json';
      var gramfile = "./JavaScript.plist";
      return readFile("./JavaScript.plist").then(data => {
        return vsctm.parseRawGrammar(data.toString());
      });
    }
    console.log(`Unknown scope name: ${scopeName}`);
    return null;
  }
});

// Load the JavaScript grammar and any other grammars included by it async.
function wrap(lang, text) {
  registry.loadGrammar(lang).then(grammar => {
    // const text = [
    // 	`function sayHello(name) {`,
    // 	`\treturn "Hello, " + name;`,
    // 	`}`
    // ];
    let ruleStack = vsctm.INITIAL;
    for (let i = 0; i < text.length; i++) {
      const line = text[i];
      const lineTokens = grammar.tokenizeLine(line, ruleStack);
      console.log(`\nTokenizing line: ${line}`);
      for (let j = 0; j < lineTokens.tokens.length; j++) {
        const token = lineTokens.tokens[j];
        console.log(
          ` - token from ${token.startIndex} to ${token.endIndex} ` +
            `(${line.substring(token.startIndex, token.endIndex)}) ` +
            `with scopes ${token.scopes.join(", ")}`
        );
      }
      ruleStack = lineTokens.ruleStack;
    }
  });
}

// wrap('source.js',
// 	[
// 		`function sayHello(name) {`,
// 		`\treturn "Hello, " + name;`,
// 		`}`
// 	]
// );

wrap("source.ocaml", [`let x = let_a`]);
