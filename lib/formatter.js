var scope = require("./scope");

// Transforms a preformated AST as nested arrays into an correctly indented string.
function indent(ary, deep) {
  var _indent = "";
  for (var i = 0, l = deep * 4; i < l; i++) {
    _indent += " ";
  }
  var rs = [];
  ary.forEach(function (line) {
    if (typeof line.forEach === "function") {
      rs.push(indent(line, deep + 1));
    } else {
      rs.push(_indent + line);
    }
  });
  return rs.join("\n");
}

// Main entry point to compile an AST to JavaScript.
exports.toJavaScript = function (ast) {
  var rs = [];
  rs.push("(function () {");
  rs.push(parseBodyWithScope(ast));
  rs.push("}());");
  return indent(rs, 0);
}

// Same as parseBody except that it pushes the current scope and pulls it back
// before returning, unshifting a var declaration to the body.
function parseBodyWithScope(ast) {
  var body;
  var identifiers = scope.withScope(function () {
    body = parseBody(ast);
  });
  if (identifiers.length) {
    body.unshift("var " + identifiers.sort().join(", ") + ";");
  }
  return body;
}

// Parses statements in a block of code.
function parseBody(ast) {
  var rs = [];
  ast.forEach(function (expr) {
    parseStatement(rs, expr);
  });
  return rs;
}

// Parses a single statement.
function parseStatement(rs, expr) {
  switch (expr[0]) {
  case "case":
    rs.push("switch (" + parseExpression(expr[1]) + ") {");
    if (typeof expr[2] != "undefined") {
      expr[2].forEach(function (stmt) {
        parseWhenStatement(rs, stmt);
      });
    }
    rs.push("}");
    break;
  
  case 'if':
    rs.push("if (" + parseExpression(expr[1]) + ") {");
    rs.push(parseBody(expr[2]));
    
    if (typeof expr[3] != "undefined") {
      expr[3].forEach(function (stmt) {
        parseElseStatement(rs, stmt);
      });
    }
    
    rs.push("}");
    break;
  
  case 'unless':
    rs.push("if (!(" + parseExpression(expr[1]) + ")) {");
    rs.push(parseBody(expr[2]));
    rs.push("}");
    break;
  
  case 'while':
    rs.push("while (" + parseExpression(expr[1]) + ") {");
    rs.push(parseBody(expr[2]));
    rs.push("}");
    break;
  
  case 'until':
    rs.push("while (!(" + parseExpression(expr[1]) + ")) {");
    rs.push(parseBody(expr[2]));
    rs.push("}");
    break;
  
  case 'loop':
    rs.push("while (true) {");
    rs.push(parseBody(expr[1]));
    rs.push("}");
    break;
  
  case 'def':
    parseFunctionDeclaration(rs, expr);
    break;
  
//  case 'linefeed':
//    rs.push("");
//    break;
  
  default:
    rs.push(parseExpression(expr) + ";");
  }
}

// Parses a function declaration with arguments and body.
function parseFunctionDeclaration(rs, expr) {
  scope.withScope(function () { // we scope to skip method arguments
    var args = parseArgumentDeclarations(expr[2]);
    var body = (typeof expr[3] === "undefined") ? [] : parseBodyWithScope(expr[3]);
    
    if (args[1].length) {
      body = args[1].concat(body);
    }
    rs.push("function " + expr[1] + "(" + args[0].join(', ') + ") {" );
    if (body.length > 0) {
      rs.push(body);
    }
    rs.push("}");
  });
}

// Parses the arguments declaration of a function.
function parseArgumentDeclarations(args) {
  var a = [];
  var b = [];
  
  args.forEach(function (arg) {
    var ident, v;
    
    switch (arg[0]) {
    case "assign":
      ident = arg[2][1];
      a.push(ident);
      b.push("if (typeof " + ident + " === 'undefined') {");
      b.push([ parseExpression(arg) + ";" ]);
      b.push("}");
      break;
    
    case "splat":
      scope.pushIdentifier(ident = arg[1][1]);
      v = "Array.prototype.slice.call(arguments, " + a.length + ") || []";
      b.push("var " + ident + " = " + v + ";");
      break;
    
    default:
      a.push(parseExpression(arg));
    }
  });
  return [ a, b ];
}

// Parses elsif/else statements with their bodies.
function parseElseStatement(rs, stmt) {
  switch (stmt[0]) {
  case "else":
    rs.push("} else {");
    if (typeof stmt[1] != "undefined") {
      rs.push(parseBody(stmt[1]));
    }
  break;
  
  case "elsif":
    rs.push("} else if (" + parseExpression(stmt[1]) + ") {");
    if (typeof stmt[2] != "undefined") {
      rs.push(parseBody(stmt[2]));
    }
  break;
  }
}

// Parses when/else statements with their bodies.
function parseWhenStatement(rs, stmt) {
  switch (stmt[0]) {
  case 'when':
    stmt[1].forEach(function (when) {
      rs.push("case " + parseExpression(when) + ":");
    });
    rs.push(parseBody(stmt[2]).concat(['break;']));
    break;
  case 'else':
    rs.push("default:");
    rs.push(parseBody(stmt[1]));
  }
}

// Parses a single expression, subparsing nested expressions if required.
function parseExpression(expr) {
  var rs = [];
  
  switch (expr[0]) {
  case "const":
    if (expr[1][0] == ".") {
      rs.push("0" + expr[1]); // disambiguates float numbers like .125
    } else {
      rs.push(expr[1]);
    }
    break;
  
  case "keyword":
    rs.push(expr[1]);
    break;
  
//  case "var":
//    if (expr[1].match(/^__/)) {
//      throw new Error("Invalid identifier '" + expr[1] + "'; identifiers starting with '__' are reserved.");
//    }
//    scope.pushIdentifier(expr[1]);
//    rs.push(expr[1]);
//    break;
  
  case "ident":
    if (expr[1].match(/^__/)) {
      throw new Error("ERROR: invalid identifier '" + expr[1] + "'; identifiers starting with '__' are reserved.");
//    } else if (!scope.isDefined(expr[1])) {
//      console.warn("WARNING: undefined identifier '" + expr[1] + "'.");
    }
    scope.pushIdentifier(expr[1]);
    rs.push(expr[1]);
    break;
  
  case "string":
    rs.push(expr[1].replace(/\n/g, '\\n'));
    break;
  
  case "array":
    if (typeof expr[1] != "undefined") {
      rs.push("[");
      rs.push(parseDeclarationList(expr[1]));
      rs.push("]");
    } else {
      rs.push("[]");
    }
    break;
  
  case "object":
    if (typeof expr[1] != "undefined") {
      rs.push("{");
      rs.push(parseObjectDeclarationList(expr[1]));
      rs.push("}");
    } else {
      rs.push("{}");
    }
    break;
  
  case "dot":
    rs.push(parseExpression(expr[1]) + '.' + expr[2]);
    break;
  
  case "paren":
    rs.push('(' + parseExpression(expr[1]) + ')');
    break;
  
  case "typeof":
    rs.push('typeof');
    rs.push(parseExpression(expr[1]));
    break;
  
  case "assign":
    rs.push(parseExpression(expr[2]));
    rs.push(expr[1]);
    rs.push(parseExpression(expr[3]));
    break;
  
  case "op":
    rs.push(parseExpression(expr[2]));
    rs.push(expr[1]);
    rs.push(parseExpression(expr[3]));
    break;
  
  case "not":
    rs.push("!" + parseExpression(expr[1]));
    break;
  
  case "cond":
    rs.push(parseExpression(expr[1]));
    rs.push("?")
    rs.push(parseExpression(expr[2]));
    rs.push(":")
    rs.push(parseExpression(expr[3]));
    break;
  
  case "access":
    rs.push(parseExpression(expr[1]) + "[" + parseExpression(expr[2]) + "]");
    break;
  
  case "call":
    rs.push(parseCallExpression(expr));
    break;
  
  case "return":
    rs.push("return");
    if (typeof expr[1] != "undefined") {
      rs.push(parseExpression(expr[1]));
    }
    break;
  }
  
  return rs.join(" ");
}

// Parses a method call expression.
function parseCallExpression(expr) {
  var args  = [];
  var splat = [];
  
  expr[2].forEach(function (decl) {
    if (decl[0] === "splat") {
      if (args.length > 0) {
        splat.push("[" + args.join(", ") + "]");
      }
      splat.push(parseExpression(decl[1]));
      args = [];
    } else {
      args.push(parseExpression(decl));
    }
  });
  
  if (splat.length === 1 && args.length === 0) {
    return parseFunctionName(expr[1]) + ".apply(null, " + splat + ")";
  }
  else if (splat.length > 0) {
    if (args.length > 0) {
      splat.push("[" + args.join(", ") + "]");
    }
    splat = "Array.prototype.concat.call(" + splat.join(", ") + ")";
    return parseFunctionName(expr[1]) + ".apply(null, " + splat + ")";
  } else {
    return parseFunctionName(expr[1]) + "(" + args.join(", ") + ")";
  }
}

function parseFunctionName(expr) {
  return (expr[0] === "ident") ? expr[1] : parseExpression(expr);
}

// Parses a comma separated declaration list. Generally from an Array declaration.
function parseDeclarationList(list) {
  var rs = [];
  list.forEach(function (decl) {
    rs.push(parseExpression(decl));
  });
  return rs.join(", ");
}

// Parses a comma separated object declaration list from an Object declaration.
function parseObjectDeclarationList(list) {
  var rs = [];
  list.forEach(function (decl) {
    rs.push(parseObjectDeclaration(decl));
  });
  return rs.join(", ");
}

// Parses a single object declaration, colon separated.
function parseObjectDeclaration(decl) {
  var left = (decl[1][0] === "ident") ? decl[1][1] : parseExpression(decl[1]);
  return [ left, parseExpression(decl[2]) ].join(": ");
}

