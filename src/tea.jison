%token LF EOF
%token CONSTANT STRING IDENTIFIER
%token EQ_OP NE_OP LT_OP LE_OP GT_OP GE_OP AND_OP OR_OP
%token DEF THEN DO END
%token IF UNLESS ELSE ELSEIF
%token WHILE UNTIL LOOP BREAK CONTINUE

//%right '=' ADD_ASSIGN SUB_ASSIGN MUL_ASSIGN MOD_ASSIGN AND_ASSIGN OR_ASSIGN XOR_ASSIGN
//%left  '+' '-' '*' '/' '%'
//%left  '&' '|' '^'
//%right EQ_OP NE_OP LT_OP LE_OP GT_OP GE_OP AND_OP OR_OP NOT_OP
//%right TYPEOF

%start Program

%%

Program
    : Body EOF  { return $1; }
    ;

Body
    : TerminatedStatement {
        $$ = [];
        if (typeof $1 != "string") {
            $$.push($1);
        }
    }
    | Body TerminatedStatement {
        if (typeof $2 != "string") {
            $1.push($2);
//        } else if ($1.length && $1[$1.length - 1][0] != "linefeed" ) {
//            $$.push([ "linefeed" ]);
        }
        $$ = $1;
    }
    ;

TerminatedStatement
    : Terminator
    | Statement Terminator               { $$ = $1; }
    ;

Statement
    : FunctionStatement                  { $$ = $1; }
    | Expression                         { $$ = $1; }
    | SelectionStatement                 { $$ = $1; }
    | IterationStatement                 { $$ = $1; }
    | JumpStatement                      { $$ = $1; }
    ;

FunctionStatement
    : DEF IDENTIFIER ArgumentDeclaration END {
        $$ = [ "def", $2, $3 ];
    }
    | DEF IDENTIFIER ArgumentDeclaration Body END {
        $$ = [ "def", $2, $3, $4 ];
    }
    ;

ArgumentDeclaration
    : '(' OptLF ')'                      { $$ = []; }
    | '(' OptLF ArgumentList OptLF ')'   { $$ = $3; }
    | ArgumentList Terminator            { $$ = $1; }
    | Terminator                         { $$ = []; }
    ;

ArgumentList
    : Identifier {
        $$ = [ $1 ];
    }
    | '*' Identifier {
        $$ = [ [ "splat", $2 ] ];
    }
    | ArgumentList ',' OptLF Identifier {
        $1.push($4);
        $$ = $1;
    }
    | ArgumentList ',' OptLF Identifier '=' OptLF PrimaryExpression {
        $1.push([ "assign", "=", $4, $7 ]);
    }
    | ArgumentList ',' OptLF '*' Identifier {
        $1.push([ "splat", $5 ]);
        $$ = $1;
    }
    ;

Identifier
    : IDENTIFIER                      { $$ = [ "ident", $1 ]; }
    ;

PrimaryExpression
    : Identifier                      { $$ = $1 }
    | CONSTANT                        { $$ = [ "const",  $1 ]; }
    | STRING                          { $$ = [ "string", $1 ]; }
    | Array                           { $$ = $1; }
    | Object                          { $$ = $1; }
    | '(' OptLF Expression OptLF ')'  { $$ = [ "paren",  $3 ]; }
    ;

PostfixExpression
    : PrimaryExpression {
        $$ = $1;
    }
    | PostfixExpression '.' IDENTIFIER {
        $$ = [ "dot",    $1, $3 ];
    }
    | PostfixExpression '[' OptLF Expression OptLF ']' {
        $$ = [ "access", $1, $4 ];
    }
    | PostfixExpression '(' OptLF ')' {
        $$ = [ "call", $1, [] ];
    }
    | PostfixExpression '(' OptLF ArgumentExpressionList OptLF ')' {
        $$ = [ "call", $1, $4 ];
    }
    ;

ArgumentExpressionList
    : ArgumentExpression {
        $$ = [ $1 ];
    }
    | ArgumentExpressionList OptLF ',' OptLF ArgumentExpression {
        $1.push($5);
        $$ = $1;
    }
    ;

ArgumentExpression
    : AssignmentExpression       { $$ = $1; }
    | '*' ConditionalExpression  { $$ = [ "splat", $2 ]; }
    ;

UnaryExpression
    : PostfixExpression                                     { $$ = $1; }
    | NOT_OP UnaryExpression                                { $$ = [ "not", $2 ]; }
    | TYPEOF UnaryExpression                                { $$ = [ "typeof", $2 ]; }
    ;

MultiplicativeExpression
    : UnaryExpression                                       { $$ = $1; }
    | MultiplicativeExpression '*' OptLF UnaryExpression    { $$ = [ "op", "*", $1, $4 ]; }
    | MultiplicativeExpression '/' OptLF UnaryExpression    { $$ = [ "op", "/", $1, $4 ]; }
    | MultiplicativeExpression '%' OptLF UnaryExpression    { $$ = [ "op", "%", $1, $4 ]; }
    ;

AdditiveExpression
    : MultiplicativeExpression                              { $$ = $1; }
    | AdditiveExpression '+' OptLF MultiplicativeExpression { $$ = [ "op", "+", $1, $4 ]; }
    | AdditiveExpression '-' OptLF MultiplicativeExpression { $$ = [ "op", "-", $1, $4 ]; }
    ;

ShiftExpression
    : AdditiveExpression                                    { $$ = $1; }
    | ShiftExpression LEFT_OP  OptLF AdditiveExpression     { $$ = [ "op", "<<", $1, $4 ]; }
    | ShiftExpression RIGHT_OP OptLF AdditiveExpression     { $$ = [ "op", ">>", $1, $4 ]; }
    ;

RelationalExpression
    : ShiftExpression                                       { $$ = $1; }
    | RelationalExpression LT_OP OptLF ShiftExpression      { $$ = [ "op", "<", $1, $4 ]; }
    | RelationalExpression GT_OP OptLF ShiftExpression      { $$ = [ "op", ">", $1, $4 ]; }
    | RelationalExpression LE_OP OptLF ShiftExpression      { $$ = [ "op", "<=", $1, $4 ]; }
    | RelationalExpression GE_OP OptLF ShiftExpression      { $$ = [ "op", ">=", $1, $4 ]; }
    ;

EqualityExpression
    : RelationalExpression                                  { $$ = $1; }
    | EqualityExpression EQ_OP OptLF RelationalExpression   { $$ = [ "op", "===", $1, $4 ]; }
    | EqualityExpression NE_OP OptLF RelationalExpression   { $$ = [ "op", "!==", $1, $4 ]; }
    ;

AndExpression
    : EqualityExpression                                    { $$ = $1; }
    | AndExpression '&' OptLF EqualityExpression            { $$ = [ "op", "&", $1, $4 ]; }
    ;

ExclusiveOrExpression
    : AndExpression                                         { $$ = $1; }
    | ExclusiveOrExpression '^' OptLF AndExpression         { $$ = [ "op", "^", $1, $4 ]; }
    ;

InclusiveOrExpression
    : ExclusiveOrExpression                                 { $$ = $1; }
    | InclusiveOrExpression '|' OptLF ExclusiveOrExpression { $$ = [ "op", "|", $1, $4 ]; }
    ;

LogicalAndExpression
    : InclusiveOrExpression                                 { $$ = $1; }
    | LogicalAndExpression AND_OP OptLF InclusiveOrExpression { $$ = [ "op", "&&", $1, $4 ]; }
    ;

LogicalOrExpression
    : LogicalAndExpression                                 { $$ = $1; }
    | LogicalOrExpression OR_OP OptLF LogicalAndExpression { $$ = [ "op", "||", $1, $4 ]; }
    ;

ConditionalExpression
    : LogicalOrExpression                                  { $$ = $1; }
    | LogicalOrExpression '?' OptLF Expression OptLF ':' OptLF ConditionalExpression {
        $$ = [ "cond", $1, $4, $8 ];
    }
    ;

AssignmentExpression
    : ConditionalExpression                                { $$ = $1; }
    | PostfixExpression AssignmentOperator OptLF AssignmentExpression {
        $$ = [ "assign", $2, $1, $4 ];
    }
    ;

AssignmentOperator
    : '='                   { $$ = $1; }
    | MUL_ASSIGN            { $$ = $1; }
    | DIV_ASSIGN            { $$ = $1; }
    | MOD_ASSIGN            { $$ = $1; }
    | ADD_ASSIGN            { $$ = $1; }
    | SUB_ASSIGN            { $$ = $1; }
    | LEFT_ASSIGN           { $$ = $1; }
    | RIGHT_ASSIGN          { $$ = $1; }
    | AND_ASSIGN            { $$ = $1; }
    | XOR_ASSIGN            { $$ = $1; }
    | OR_ASSIGN             { $$ = $1; }
    ;

Expression
    : AssignmentExpression  { $$ = $1; }
    ;

Array
    : '[' ']'                                           { $$ = [ "array" ]; }
    | '[' OptLF DeclarationList OptLF ']'               { $$ = [ "array", $3 ]; }
    | '[' OptLF DeclarationList ',' OptLF ']'           { $$ = [ "array", $3 ]; }
    | '[' OptLF DeclarationList LF ',' OptLF ']'        { $$ = [ "array", $3 ]; }
    ;

DeclarationList
    : Expression                                        { $$ = [ $1 ]; }
    | DeclarationList ',' Expression                    { $1.push($3); $$ = $1; }
    | DeclarationList ',' LF Expression                 { $1.push($4); $$ = $1; }
    | DeclarationList LF ',' LF Expression              { $1.push($5); $$ = $1; }
    | DeclarationList LF ',' Expression                 { $1.push($4); $$ = $1; }
    ;

Object
    : '{' '}'                                           { $$ = [ "object" ]; }
    | '{' OptLF ObjectDeclarationList OptLF '}'         { $$ = [ "object", $3 ]; }
    | '{' OptLF ObjectDeclarationList ',' OptLF '}'     { $$ = [ "object", $3 ]; }
    | '{' OptLF ObjectDeclarationList LF ',' OptLF '}'  { $$ = [ "object", $3 ]; }
    ;

ObjectDeclarationList
    : ObjectDeclaration                                 { $$ = [ $1 ]; }
    | ObjectDeclarationList ',' ObjectDeclaration       { $1.push($3); $$ = $1; }
    | ObjectDeclarationList ',' LF ObjectDeclaration    { $1.push($4); $$ = $1; }
    | ObjectDeclarationList LF ',' LF ObjectDeclaration { $1.push($5); $$ = $1; }
    | ObjectDeclarationList LF ',' ObjectDeclaration    { $1.push($3); $$ = $1; }
    ;

ObjectDeclaration
    : Expression OptLF ':' OptLF Expression             { $$ = [ "assoc", $1, $5 ]; }
    ;

SelectionStatement
    : IF Expression Then Body END                               { $$ = [ "if", $2, $4 ]; }
    | IF Expression Then Body ElseStatement END                 { $$ = [ "if", $2, $4, [ $5 ] ]; }
    | IF Expression Then Body ElsifStatement END                { $$ = [ "if", $2, $4, $5 ]; }
    | IF Expression Then Body ElsifStatement ElseStatement END  { $5.push($6); $$ = [ "if", $2, $4, $5 ]; }
    | UNLESS Expression Then Body END                           { $$ = [ "unless", $2, $4 ]; }
    | UNLESS Expression Then Body ElseStatement END             { $$ = [ "unless", $2, $4, [ $5 ] ]; }
    | Statement IF Expression                                   { $$ = [ "if", $3, [ $1 ] ]; }
    | Statement UNLESS Expression                               { $$ = [ "unless", $3, [ $1 ] ]; }
    | CASE Expression Terminator WhenStatement END              { $$ = [ "case", $2, $4 ]; }
    ;

ElsifStatement
    : ELSIF Expression Then Body                        { $$ = [ [ "elsif", $2, $4 ] ]; }
    | ElsifStatement ELSIF Expression Then Body         { $1.push([ "elsif", $3, $5 ]); $$ = $1; }
    ;

ElseStatement
    : ELSE Body                                         { $$ = [ "else", $2 ]; }
    ;

WhenStatement
    : WHEN DeclarationList Then Body                    { $$ = [ [ "when", $2, $4 ] ]; }
    | WhenStatement WHEN DeclarationList Then Body      { $1.push([ "when", $3, $5 ]); $$ = $1; } }
    | WhenStatement ElseStatement                       { $1.push($2); $$ = $1; }
    | ElseStatement                                     { $$ = [ $1 ]; }
    ;

IterationStatement
    : WHILE Expression Do Body END   { $$ = [ "while", $2, $4 ]; }
    | UNTIL Expression Do Body END   { $$ = [ "until", $2, $4 ]; }
    | Statement WHILE Expression     { $$ = [ "while", $3, [ $1 ] ]; }
    | Statement UNTIL Expression     { $$ = [ "until", $3, [ $1 ] ]; }
    | LOOP Do Body END               { $$ = [ "loop", $3 ]; }
    ;

JumpStatement
    : BREAK                          { $$ = [ "keyword", "break" ]; }
    | CONTINUE                       { $$ = [ "keyword", "continue" ]; }
    | RETURN                         { $$ = [ "return" ]; }
    | RETURN Expression              { $$ = [ "return", $2 ]; }
    ;

Then
    : THEN
    | Terminator
    | Terminator THEN
    ;

Do
    : DO
    | Terminator
    | Terminator DO
    ;

OptLF
    : LF
    | 
    ;

//OptComma
//    : ','
//    | 
//    ;

Terminator
    : LF
    | ';'
    ;

%%

