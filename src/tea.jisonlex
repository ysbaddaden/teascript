D  [0-9]
L  [a-zA-Z_]
E  [eE][-+]?{D}+

%{

// put some javascript here if needed

%}

%%

"#".*                                ; // skip comments

"true"                               return 'CONSTANT';
"false"                              return 'CONSTANT';
"null"                               return 'CONSTANT';
[-+~]?{D}+(\.{D}+)?({E})?            return 'CONSTANT';
[-+~]?\.{D}+({E})?                   return 'CONSTANT';
\"(\\.|[^\\"])*\"	                   return 'STRING_LITERAL';
\'(\\.|[^\\'])*\'	                   return 'STRING';

"end"                                return 'END';

"if"                                 return 'IF';
"unless"                             return 'UNLESS';
"else"                               return 'ELSE';
"elsif"                              return 'ELSIF';
"case"                               return 'CASE';
"when"                               return 'WHEN';

"while"                              return 'WHILE';
"until"                              return 'UNTIL';
"loop"                               return 'LOOP';
"break"                              return 'BREAK';
"next"                               return 'CONTINUE';
"continue"                           return 'CONTINUE';

"+="                                 return 'ADD_ASSIGN';
"-="                                 return 'SUB_ASSIGN';
"*="                                 return 'MUL_ASSIGN';
"%="                                 return 'MOD_ASSIGN';
"&="                                 return 'AND_ASSIGN';
"|="                                 return 'OR_ASSIGN';
"^="                                 return 'XOR_ASSIGN';
//"||="                                return 'OR_OR_ASSIGN';
">>="                                return 'RIGHT_ASSIGN';
"<<="                                return 'LEFT_ASSIGN';

"typeof"                             return 'TYPEOF';
"!"                                  return 'NOT_OP';
"not"                                return 'NOT_OP';
"and"                                return 'AND_OP';
"&&"                                 return 'AND_OP';
"or"                                 return 'OR_OP';
"||"                                 return 'OR_OP';
[-+*%/&|^]                           return yytext;
">>"                                 return 'RIGHT_OP';
"<<"                                 return 'LEFT_OP';
"!="                                 return 'NEQ_OP';
"<="                                 return 'LE_OP';
"<"                                  return 'LT_OP';
">="                                 return 'GE_OP';
">"                                  return 'GT_OP';
"=="                                 return 'EQ_OP';
[()=;,:\[\]\{\}]                     return yytext;

{L}({L}|{D})*                        return 'IDENTIFIER';

[ \t]+                               ; // skip whitespace
\n+                                  return 'LF';
<<EOF>>                              return 'EOF';

.                                    throw 'Invalid character: "' + yytext + '"';

%%

