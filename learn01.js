const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const template = require('@babel/template').default;
const sourceCode = `
  console.log(1);

  function func() {
      console.info(2);
  }

  export default class Clazz {
      say() {
          console.debug(3);
      }
      render() {
          return <div>{console.error(4)}</div>
      }
  }
`;

const ast = parser.parse(sourceCode, {// 解析成AST树
  sourceType: 'unambiguous',
  plugins: ['jsx']
});

const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);
// [ 'console.log', 'console.info', 'console.error', 'console.debug' ]

traverse(ast, {
  CallExpression (path, state) {
    if (path.node.isNew)
    {  // 对于已经处理过的节点不再处理
      return;
    }
    const calleeName = generate(path.node.callee).code; // callee下面就是MemberExpression也就是console.log()
    if (targetCalleeName.includes(calleeName))
    {
      const { line, column } = path.node.loc.start;
      const newNode = template.expression(`console.log("filename: (${line}, ${column})")`)();// 创建新节点
      // 新生成节点注意不再进行处理，赋值isNew标记
      newNode.isNew = true;

      if (path.findParent(path => path.isJSXElement()))  // 向上查找是否有JSXElement类型的节点，其中是回调函数
      {
        path.replaceWith(types.arrayExpression([newNode, path.node]))
        path.skip();
      } else  // 没有JSX的情况
      {
        path.insertBefore(newNode);
      }
    }
  }
});

const new_code = generate(ast).code;  // 根据ast来生成代码
console.log(new_code);