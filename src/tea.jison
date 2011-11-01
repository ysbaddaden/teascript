%token LF EOF
%token CONSTANT STRING_LITERAL IDENTIFIER
%token EQ_OP NE_OP LT_OP LE_OP GT_OP GE_OP AND_OP OR_OP
%token END
%token IF UNLESS ELSE ELSEIF
%token WHILE UNTIL LOOP BREAK CONTINUE

%right '=' ADD_ASSIGN SUB_ASSIGN MUL_ASSIGN MOD_ASSIGN AND_ASSIGN OR_ASSIGN XOR_ASSIGN
%left  '+' '-' '*' '/' '%'
%left  '&' '|' '^'
%right EQ_OP NE_OP LT_OP LE_OP GT_OP GE_OP AND_OP OR_OP NOT_OP
%right TYPEOF

%start Program

%%

Program
    : Body EOF {
        return $1
    }
    ;

Body
    : Body Terminator
    | Body Statement Terminator {
        // pushes the statement ($2) to the current body ($1)
        $1.push($2);
        $$ = $1;
    }
    | {
        // empty body => new body!
        $$ = [];
    }
    ;

Statement
    : PrimaryExpression     { $$ = $1; }
    | ConditionalStatement  { $$ = $1; }
    | CaseStatement         { $$ = $1; }
    | LoopStatement         { $$ = $1; }
    | BREAK                 { $$ = [ "keyword", "break" ]; }
    | CONTINUE              { $$ = [ "keyword", "continue" ]; }
    ;

CaseStatement
    : CASE Expression LF WhenStatement END {
        $$ = [ "case", $2, $4 ];
    }
    ;

WhenStatement
    : WHEN DeclarationList LF Body {
        $$ = [ [ "when", $2, $4 ] ];
    }
    | WhenStatement WHEN DeclarationList LF Body {
        $1.push([ "when", $3, $5 ]);
        $$ = $1;
    }
    | WhenStatement ELSE Body {
        $1.push([ "else", $3 ]);
        $$ = $1;
    }
    | ELSE Body {
        $$ = [ [ "else", $2 ] ];
    }
    ;

ConditionalStatement
    : IF PrimaryExpression Body END {
        $$ = [ "if", $2, $3 ];
    }
    | IF PrimaryExpression Body ElseStatement END {
        $$ = [ "if", $2, $3, [ $4 ] ];
    }
    | IF PrimaryExpression Body ElsifStatement END {
        $$ = [ "if", $2, $3, $4 ];
    }
    | IF PrimaryExpression Body ElsifStatement ElseStatement END {
        $4.push($5);
        $$ = [ "if", $2, $3, $4 ];
    }
    | UNLESS PrimaryExpression Body END {
        $$ = [ "unless", $2, $3 ];
    }
    | Statement IF PrimaryExpression {
        $$ = [ "if", $3, [ $1 ] ];
    }
    | Statement UNLESS PrimaryExpression {
        $$ = [ "unless", $3, [ $1 ] ];
    }
    ;

ElseStatement
    : ELSE Body {
        $$ = [ "else", $2 ];
    }
    ;

ElsifStatement
    : ELSIF PrimaryExpression Body {
        $$ = [ [ "elsif", $2, $3 ] ];
    }
    | ELSIF PrimaryExpression Body ElsifStatement {
        $4.unshift([ "elsif", $2, $3 ])
        $$ = $4;
    }
    ;

LoopStatement
    : WHILE PrimaryExpression Body END {
        $$ = [ "while", $2, $3 ];
    }
    | UNTIL PrimaryExpression Body END {
        $$ = [ "until", $2, $3 ];
    }
    | Statement WHILE PrimaryExpression {
        $$ = [ "while", $3, [ $1 ] ];
    }
    | Statement UNTIL PrimaryExpression {
        $$ = [ "until", $3, [ $1 ] ];
    }
    | LOOP Body END {
        $$ = [ "loop", $2 ];
    }
    ;

PrimaryExpression
    : Expression                { $$ = $1; }
    | AssignExpression          { $$ = $1; }
    ;

Expression
    : CONSTANT                  { $$ = [ "const", $1 ]; }
    | IDENTIFIER                { $$ = [ "ident", $1 ]; }
    | Array                     { $$ = $1; }
    | Object                    { $$ = $1; }
    | STRING_LITERAL            { $$ = [ "string", $1 ]; }
    | STRING                    { $$ = [ "string", $1 ]; }
    | MathExpression            { $$ = $1; }
    | BitwiseExpression         { $$ = $1; }
    | LogicalExpression         { $$ = $1; }
    | TYPEOF Expression         { $$ = [ "typeof", $2 ]; }
    | '(' Expression ')'        { $$ = [ "paren",  $2 ]; }
    | '(' Expression LF ')'     { $$ = [ "paren",  $2 ]; }
    | '(' LF Expression LF ')'  { $$ = [ "paren",  $3 ]; }
    | '(' LF Expression ')'     { $$ = [ "paren",  $3 ]; }
    ;

Array
    : '[' ']'                                           { $$ = [ "array" ]; }
    | '[' DeclarationList ']'                           { $$ = [ "array", $2 ]; }
    | '[' DeclarationList LF ']'                        { $$ = [ "array", $2 ]; }
    | '[' LF DeclarationList LF ']'                     { $$ = [ "array", $3 ]; }
    | '[' LF DeclarationList ']'                        { $$ = [ "array", $3 ]; }
    ;

DeclarationList
    : PrimaryExpression                                 { $$ = [ $1 ]; }
    | DeclarationList ',' PrimaryExpression             { $1.push($3); $$ = $1; }
    | DeclarationList ',' LF PrimaryExpression          { $1.push($4); $$ = $1; }
    | DeclarationList LF ',' LF PrimaryExpression       { $1.push($5); $$ = $1; }
    | DeclarationList LF ',' PrimaryExpression          { $1.push($4); $$ = $1; }
    ;

Object
    : '{' '}'                                           { $$ = [ "object" ]; }
    | '{' ObjectDeclarationList '}'                     { $$ = [ "object", $2 ]; }
    | '{' ObjectDeclarationList LF '}'                  { $$ = [ "object", $2 ]; }
    | '{' LF ObjectDeclarationList LF '}'               { $$ = [ "object", $3 ]; }
    | '{' LF ObjectDeclarationList '}'                  { $$ = [ "object", $3 ]; }
    ;

ObjectDeclarationList
    : ObjectDeclaration                                 { $$ = [ $1 ]; }
    | ObjectDeclarationList ',' ObjectDeclaration       { $1.push($3); $$ = $1; }
    | ObjectDeclarationList ',' LF ObjectDeclaration    { $1.push($4); $$ = $1; }
    | ObjectDeclarationList LF ',' LF ObjectDeclaration { $1.push($5); $$ = $1; }
    | ObjectDeclarationList LF ',' ObjectDeclaration    { $1.push($4); $$ = $1; }
    ;

ObjectDeclaration
    : Expression ':' Expression                         { $$ = [ "assoc", $1, $3 ]; }
    | Expression ':' LF Expression                      { $$ = [ "assoc", $1, $4 ]; }
    | Expression LF ':' LF Expression                   { $$ = [ "assoc", $1, $5 ]; }
    | Expression LF ':' Expression                      { $$ = [ "assoc", $1, $4 ]; }
    ;

AssignExpression
    : IDENTIFIER '=' Expression           { $$ = [ "assign",  "=",  [ "var", $1 ], $3 ]; }
    | IDENTIFIER ADD_ASSIGN   Expression  { $$ = [ "assign", "+=",  [ "var", $1 ], $3 ]; }
    | IDENTIFIER SUB_ASSIGN   Expression  { $$ = [ "assign", "-=",  [ "var", $1 ], $3 ]; }
    | IDENTIFIER MUL_ASSIGN   Expression  { $$ = [ "assign", "*=",  [ "var", $1 ], $3 ]; }
    | IDENTIFIER MOD_ASSIGN   Expression  { $$ = [ "assign", "%=",  [ "var", $1 ], $3 ]; }
    | IDENTIFIER AND_ASSIGN   Expression  { $$ = [ "assign", "&=",  [ "var", $1 ], $3 ]; }
    | IDENTIFIER OR_ASSIGN    Expression  { $$ = [ "assign", "|=",  [ "var", $1 ], $3 ]; }
    | IDENTIFIER XOR_ASSIGN   Expression  { $$ = [ "assign", "^=",  [ "var", $1 ], $3 ]; }
    | IDENTIFIER RIGHT_ASSIGN Expression  { $$ = [ "assign", ">>=", [ "var", $1 ], $3 ]; }
    | IDENTIFIER LEFT_ASSIGN  Expression  { $$ = [ "assign", "<<=", [ "var", $1 ], $3 ]; }
    ;

MathExpression
    : Expression '+' Expression           { $$ = [ "op", "+", $1, $3 ]; }
    | Expression '-' Expression           { $$ = [ "op", "-", $1, $3 ]; }
    | Expression '*' Expression           { $$ = [ "op", "*", $1, $3 ]; }
    | Expression '/' Expression           { $$ = [ "op", "/", $1, $3 ]; }
    | Expression '%' Expression           { $$ = [ "op", "%", $1, $3 ]; }
    ;

BitwiseExpression
    : Expression '&' Expression           { $$ = [ "op", "&", $1, $3 ]; }
    | Expression '|' Expression           { $$ = [ "op", "|", $1, $3 ]; }
    | Expression '^' Expression           { $$ = [ "op", "^", $1, $3 ]; }
    ;

LogicalExpression
    : Expression EQ_OP  Expression        { $$ = [ "op", "===", $1, $3 ]; }
    | Expression NE_OP  Expression        { $$ = [ "op", "!==", $1, $3 ]; }
    | Expression LT_OP  Expression        { $$ = [ "op", "<",   $1, $3 ]; }
    | Expression LE_OP  Expression        { $$ = [ "op", "<=",  $1, $3 ]; }
    | Expression GT_OP  Expression        { $$ = [ "op", ">",   $1, $3 ]; }
    | Expression GE_OP  Expression        { $$ = [ "op", ">=",  $1, $3 ]; }
    | Expression OR_OP  Expression        { $$ = [ "op", "||",  $1, $3 ]; }
    | Expression AND_OP Expression        { $$ = [ "op", "&&",  $1, $3 ]; }
    | NOT_OP Expression                   { $$ = [ "not", $2 ]; }
    ;

Terminator
    : LF
    | ';'
    ;

%%

