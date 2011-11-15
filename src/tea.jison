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
    : Body EOF  {
        return new T.Program($1);
    }
    ;

Body
    : TerminatedStatement {
        $$ = new T.Body();
        if (typeof $1 !== "string") {
            $$.push($1);
        }
    }
    | Body TerminatedStatement {
        if (typeof $2 !== "string") {
            $1.push($2);
//        } else if ($1.length && $1[$1.length - 1][0] !== "linefeed" ) {
//            $$.push([ "linefeed" ]);
        }
        $$ = $1;
    }
    ;

TerminatedStatement
    : Terminator
    | Statement Terminator                   { $$ = $1; }
    ;

Statement
    : FunctionStatement                      { $$ = $1; }
    | Expression                             { $$ = new T.Expression($1); }
    | SelectionStatement                     { $$ = $1; }
    | IterationStatement                     { $$ = $1; }
    | JumpStatement                          { $$ = $1; }
    ;

FunctionStatement
    : DEF Identifier ArgumentDeclaration END {
        $$ = new T.Function($2, $3);
    }
    | DEF Identifier ArgumentDeclaration Body END {
        $$ = new T.Function($2, $3, $4);
    }
    ;

ArgumentDeclaration
    : '(' OptLF ')'                          { $$ = []; }
    | '(' OptLF ArgumentList OptLF ')'       { $$ = $3; }
    | ArgumentList Terminator                { $$ = $1; }
    | Terminator                             { $$ = []; }
    ;

ArgumentList
    : Arguments                              { $$ = $1; }
    | Arguments ',' OptLF ArgumentSplat      { $1.push($4); $$ = $1; }
    | ArgumentSplat                          { $$ = [ $1 ]; }
    ;

Arguments
    : Identifier                             { $$ = [ $1 ]; }
    | ArgumentAssignment                     { $$ = [ $1 ]; }
    | Arguments ',' OptLF Identifier         { $1.push($4); $$ = $1; }
    | Arguments ',' OptLF ArgumentAssignment { $1.push($4); $$ = $1; }
    ;

ArgumentSplat
    : '*' Identifier                         { $$ = new T.Splat($2); }
    ;

ArgumentAssignment
    : Identifier '=' OptLF PostfixExpression {
        $$ = new T.Operation("=", $1, $4);
    }
    ;

Identifier
    : IDENTIFIER                      { $$ = new T.Identifier($1); }
    ;

PrimaryExpression
    : Identifier                      { $$ = $1 }
    | NULL                            { $$ = new T.Keyword("null"); }
    | BOOLEAN                         { $$ = new T.Keyword($1); }
    | NUMBER                          { $$ = new T.Number($1); }
    | CONSTANT                        { $$ = new T.Constant($1); }
    | STRING                          { $$ = new T.String($1); }
    | Array                           { $$ = $1; }
    | Object                          { $$ = $1; }
    | '(' OptLF Expression OptLF ')'  { $$ = new T.Paren($3); }
    ;

PostfixExpression
    : PrimaryExpression {
        $$ = $1;
    }
    | PostfixExpression '.' IDENTIFIER {
        $$ = new T.Dot($1, $3);
    }
    | PostfixExpression '[' Index ']' {
        $$ = new T.Index($1, $3);
    }
    | PostfixExpression '(' OptLF ')' {
        $$ = new T.Call($1);
    }
    | PostfixExpression '(' OptLF ArgumentExpressionList OptLF ')' {
        $$ = new T.Call($1, $4);
    }
    ;

Index
    : Expression OptLF           { $$ = $1; }
    | LF Expression OptLF        { $$ = $2; }
    | Range                      { $$ = $1; }
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
    | '*' ConditionalExpression  { $$ = new T.Splat($2); }
    ;

UnaryExpression
    : PostfixExpression                                     { $$ = $1; }
    | NOT_OP UnaryExpression                                { $$ = new T.UnaryExpression("!", $2); }
    | TYPEOF UnaryExpression                                { $$ = new T.UnaryExpression("typeof", $2); }
    ;

MultiplicativeExpression
    : UnaryExpression                                       { $$ = $1; }
    | MultiplicativeExpression '*' OptLF UnaryExpression    { $$ = new T.Operation("*", $1, $4); }
    | MultiplicativeExpression '/' OptLF UnaryExpression    { $$ = new T.Operation("/", $1, $4); }
    | MultiplicativeExpression '%' OptLF UnaryExpression    { $$ = new T.Operation("%", $1, $4); }
    ;

AdditiveExpression
    : MultiplicativeExpression                              { $$ = $1; }
    | AdditiveExpression '+' OptLF MultiplicativeExpression { $$ = new T.Operation("+", $1, $4); }
    | AdditiveExpression '-' OptLF MultiplicativeExpression { $$ = new T.Operation("-", $1, $4); }
    ;

ShiftExpression
    : AdditiveExpression                                    { $$ = $1; }
    | ShiftExpression LEFT_OP  OptLF AdditiveExpression     { $$ = new T.Operation("<<", $1, $4); }
    | ShiftExpression RIGHT_OP OptLF AdditiveExpression     { $$ = new T.Operation(">>", $1, $4); }
    ;

RelationalExpression
    : ShiftExpression                                       { $$ = $1; }
    | RelationalExpression LT_OP OptLF ShiftExpression      { $$ = new T.Operation("<", $1, $4); }
    | RelationalExpression GT_OP OptLF ShiftExpression      { $$ = new T.Operation(">", $1, $4); }
    | RelationalExpression LE_OP OptLF ShiftExpression      { $$ = new T.Operation("<=", $1, $4); }
    | RelationalExpression GE_OP OptLF ShiftExpression      { $$ = new T.Operation(">=", $1, $4); }
    ;

EqualityExpression
    : RelationalExpression                                  { $$ = $1; }
    | EqualityExpression EQ_OP OptLF RelationalExpression   { $$ = new T.Operation("===", $1, $4); }
    | EqualityExpression NE_OP OptLF RelationalExpression   { $$ = new T.Operation("!==", $1, $4); }
    ;

AndExpression
    : EqualityExpression                                    { $$ = $1; }
    | AndExpression '&' OptLF EqualityExpression            { $$ = new T.Operation("&", $1, $4); }
    ;

ExclusiveOrExpression
    : AndExpression                                         { $$ = $1; }
    | ExclusiveOrExpression '^' OptLF AndExpression         { $$ = new T.Operation("^", $1, $4); }
    ;

InclusiveOrExpression
    : ExclusiveOrExpression                                 { $$ = $1; }
    | InclusiveOrExpression '|' OptLF ExclusiveOrExpression { $$ = new T.Operation("|", $1, $4); }
    ;

LogicalAndExpression
    : InclusiveOrExpression                                 { $$ = $1; }
    | LogicalAndExpression AND_OP OptLF InclusiveOrExpression { $$ = new T.Operation("&&", $1, $4); }
    ;

LogicalOrExpression
    : LogicalAndExpression                                 { $$ = $1; }
    | LogicalOrExpression OR_OP OptLF LogicalAndExpression { $$ = new T.Operation("||", $1, $4); }
    ;

ConditionalExpression
    : LogicalOrExpression                                  { $$ = $1; }
    | LogicalOrExpression '?' OptLF Expression OptLF ':' OptLF ConditionalExpression {
        $$ = new T.Condition($1, $4, $8);
    }
    ;

AssignmentExpression
    : ConditionalExpression                                { $$ = $1; }
    | PostfixExpression AssignmentOperator OptLF AssignmentExpression {
        $$ = new T.Operation($2, $1, $4);
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
    : '[' OptLF ']'                                     { $$ = new T.Array(); }
    | '[' OptLF DeclarationList OptLF ']'               { $$ = new T.Array($3); }
    | '[' OptLF DeclarationList ',' OptLF ']'           { $$ = new T.Array($3); }
    | '[' OptLF DeclarationList LF ',' OptLF ']'        { $$ = new T.Array($3); }
    ;

DeclarationList
    : Expression                                        { $$ = [ $1 ]; }
    | DeclarationList ',' Expression                    { $1.push($3); $$ = $1; }
    | DeclarationList ',' LF Expression                 { $1.push($4); $$ = $1; }
    | DeclarationList LF ',' LF Expression              { $1.push($5); $$ = $1; }
    | DeclarationList LF ',' Expression                 { $1.push($4); $$ = $1; }
    ;

Object
    : '{' OptLF '}'                                     { $$ = new T.Object(); }
    | '{' OptLF ObjectDeclarationList OptLF '}'         { $$ = new T.Object($3); }
    | '{' OptLF ObjectDeclarationList ',' OptLF '}'     { $$ = new T.Object($3); }
    | '{' OptLF ObjectDeclarationList LF ',' OptLF '}'  { $$ = new T.Object($3); }
    ;

ObjectDeclarationList
    : ObjectDeclaration                                 { $$ = [ $1 ]; }
    | ObjectDeclarationList ',' ObjectDeclaration       { $1.push($3); $$ = $1; }
    | ObjectDeclarationList ',' LF ObjectDeclaration    { $1.push($4); $$ = $1; }
    | ObjectDeclarationList LF ',' LF ObjectDeclaration { $1.push($5); $$ = $1; }
    | ObjectDeclarationList LF ',' ObjectDeclaration    { $1.push($3); $$ = $1; }
    ;

ObjectDeclaration
    : Expression OptLF ':' OptLF Expression             { $$ = new T.Assoc($1, $5); }
    ;

SelectionStatement
    : IF Expression Then END                                    { $$ = new T.IfStatement($2); }
    | IF Expression Then Statement END                          { $$ = new T.IfStatement($2, new T.Body($4)); }
    | IF Expression Then Body END                               { $$ = new T.IfStatement($2, $4); }
    | IF Expression Then Body ElseStatement END                 { $$ = new T.IfStatement($2, $4, [ $5 ]); }
    | IF Expression Then Body ElsifStatement END                { $$ = new T.IfStatement($2, $4, $5); }
    | IF Expression Then Body ElsifStatement ElseStatement END  { $5.push($6); $$ = new T.IfStatement($2, $4, $5); }
    | UNLESS Expression Then END                                { $$ = new T.UnlessStatement($2); }
    | UNLESS Expression Then Statement END                      { $$ = new T.UnlessStatement($2, new T.Body($4)); }
    | UNLESS Expression Then Body END                           { $$ = new T.UnlessStatement($2, $4); }
    | UNLESS Expression Then Body ElseStatement END             { $$ = new T.UnlessStatement($2, $4, $5); }
    | Statement IF Expression                                   { $$ = new T.IfStatement($3, new T.Body($1)); }
    | Statement UNLESS Expression                               { $$ = new T.UnlessStatement($3, new T.Body($1)); }
    | CASE Expression Terminator WhenStatement END              { $$ = new T.CaseStatement($2, $4); }
    ;

ElsifStatement
    : ELSIF Expression Then Body                        { $$ = [ new T.ElsifStatement($2, $4) ]; }
    | ElsifStatement ELSIF Expression Then Body         { $1.push(new T.ElsifStatement($3, $5)); $$ = $1; }
    ;

ElseStatement
    : ELSE Body                                         { $$ = new T.ElseStatement($2); }
    ;

WhenStatement
    : WHEN DeclarationList Then Body                    { $$ = [ new T.WhenStatement($2, $4) ]; }
    | WhenStatement WHEN DeclarationList Then Body      { $1.push(new T.WhenStatement($3, $5)); $$ = $1; } }
    | WhenStatement ElseStatement                       { $1.push($2); $$ = $1; }
    | ElseStatement                                     { $$ = [ $1 ]; }
    ;

IterationStatement
    : WHILE Expression Do Body END                      { $$ = new T.WhileStatement($2, $4); }
    | UNTIL Expression Do Body END                      { $$ = new T.UntilStatement($2, $4); }
    | FOR Identifier IN '[' Range ']' Do Body END       { $$ = new T.ForStatement($2, $5, $8); }
    | LOOP Do Body END                                  { $$ = new T.LoopStatement($3); }
    | Statement WHILE Expression                        { $$ = new T.WhileStatement($3, new T.Body($1)); }
    | Statement UNTIL Expression                        { $$ = new T.UntilStatement($3, new T.Body($1)); }
    | Statement FOR Identifier IN '[' Range ']'         { $$ = new T.ForStatement($3, $6, new T.Body($1)); }
    ;

Range
    : ConditionalExpression RANGE_INCL ConditionalExpression  { $$ = new T.Range("inclusive", $1, $3); }
    | ConditionalExpression RANGE_EXCL ConditionalExpression  { $$ = new T.Range("exclusive", $1, $3); }
    ;

JumpStatement
    : BREAK                          { $$ = new T.Expression(new T.Keyword("break")); }
    | CONTINUE                       { $$ = new T.Expression(new T.Keyword("continue")); }
    | RETURN                         { $$ = new T.ReturnStatement(); }
    | RETURN Expression              { $$ = new T.ReturnStatement($2); }
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

