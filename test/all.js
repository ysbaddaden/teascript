var args = (typeof process !== 'undefined') ? process.argv.slice(2) : require("system").args.slice(1);
require("./test").runFiles(args);

