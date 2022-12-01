export default function (api, options, dirname) {
  return {
    inherits: parentPlugin,
    manipulateOptions (options, parserOptions) {
      options.xxx = '';
    },
    pre (file) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral (path, state) {
        this.cache.set(path.node.value, 1);
      }
    },
    post (file) {
      console.log(this.cache);
    }
  };
} 