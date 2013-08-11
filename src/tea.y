%left     '.'
%right    '!' '~' new not typeof delete
%left     '*' '/' '%'
%left     '+' '-'
%left     '<<' '>>' '>>>'
%left     in of instanceof
%left     '==' '!=' '<' '>' '<=' '>='
%left     '&&' '||' '&' '|' '^' and or
%right    '=' OP_ASGN return throw
%right    '..' '...'
%nonassoc '?' ':'

%start PROGRAM

%%

PROGRAM
    : COMPSTMT EOF    { return new Tea.Program($1); }
    ;

ASTMT
    : STMT            { $$ = new Tea.Body($1); }
    | COMPSTMT        -> $1
    | COMPSTMT STMT {
        if (typeof $2 !== "string") {
            $1.push($2);
        }
        $$ = $1;
    }
    |                 { $$ = new Tea.Body(); }
    ;

COMPSTMT
    : TSTMT {
        $$ = new Tea.Body();
        if (typeof $1 !== "string") {
            $$.push($1);
        }
    }
    | COMPSTMT TSTMT {
        if (typeof $2 !== "string") {
            $1.push($2);
        }
        $$ = $1;
    }
    ;

TSTMT
    : LF
    | STMT LF         -> $1
    ;

STMT
    : STMT if EXPR {
        $$ = new Tea.IfStatement($3, new Tea.Body($1));
    }
    | STMT unless EXPR {
        $$ = new Tea.UnlessStatement($3, new Tea.Body($1));
    }
    | STMT while EXPR {
        $$ = new Tea.WhileStatement($3, new Tea.Body($1));
    }
    | STMT until EXPR {
        $$ = new Tea.UntilStatement($3, new Tea.Body($1));
    }
    | STMT for IDENTIFIER of EXPR {
        $$ = new Tea.ForOfStatement($3, null, $5, new Tea.Body($1));
    }
    | STMT for IDENTIFIER ',' IDENTIFIER of EXPR {
        $$ = new Tea.ForOfStatement($3, $5, $7, new Tea.Body($1));
    }
    | STMT for IDENTIFIER in EXPR {
        $$ = new Tea.ForInStatement(false, $3, null, $5, new Tea.Body($1));
    }
    | STMT for IDENTIFIER ',' IDENTIFIER in EXPR {
        $$ = new Tea.ForInStatement(false, $3, $5, $7, new Tea.Body($1));
    }
    | STMT for own IDENTIFIER in EXPR {
        $$ = new Tea.ForInStatement(true, $4, null, $6, new Tea.Body($1));
    }
    | STMT for own IDENTIFIER ',' IDENTIFIER in EXPR {
        $$ = new Tea.ForInStatement(true, $4, $6, $8, new Tea.Body($1));
    }
    | if EXPR THEN ASTMT end {
        $$ = new Tea.IfStatement($2, $4);
    }
    | if EXPR THEN ASTMT else ASTMT end {
        $$ = new Tea.IfStatement($2, $4, [ new Tea.ElseStatement($6) ]);
    }
    | if EXPR THEN ASTMT ELSIF end {
        $$ = new Tea.IfStatement($2, $4, $5);
    }
    | if EXPR THEN ASTMT ELSIF else ASTMT end {
        $5.push(new Tea.ElseStatement($7));
        $$ = new Tea.IfStatement($2, $4, $5);
    }
    | unless EXPR THEN ASTMT end {
        $$ = new Tea.UnlessStatement($2, $4);
    }
    | while EXPR DO ASTMT end {
        $$ = new Tea.WhileStatement($2, $4);
    }
    | until EXPR DO ASTMT end {
        $$ = new Tea.UntilStatement($2, $4);
    }
    | loop DO ASTMT end {
        $$ = new Tea.LoopStatement($3);
    }
    | case EXPR WHEN end {
        $$ = new Tea.CaseStatement($2, $3);
    }
    | case EXPR WHEN else ASTMT end {
        $3.push(new Tea.ElseStatement($5));
        $$ = new Tea.CaseStatement($2, $3);
    }
    | for IDENTIFIER of EXPR DO ASTMT end {
        $$ = new Tea.ForOfStatement($2, null, $4, $6);
    }
    | for IDENTIFIER ',' IDENTIFIER of EXPR DO ASTMT end {
        $$ = new Tea.ForOfStatement($2, $4, $6, $8);
    }
    | for IDENTIFIER in EXPR DO ASTMT end {
        $$ = new Tea.ForInStatement(false, $2, null, $4, $6);
    }
    | for IDENTIFIER ',' IDENTIFIER in EXPR DO ASTMT end {
        $$ = new Tea.ForInStatement(false, $2, $4, $6, $8);
    }
    | for own IDENTIFIER in EXPR DO ASTMT end {
        $$ = new Tea.ForInStatement(true, $3, null, $5, $7);
    }
    | for own IDENTIFIER ',' IDENTIFIER in EXPR DO ASTMT end {
        $$ = new Tea.ForInStatement(true, $3, $5, $7, $9);
    }
    | CLASS                                      -> $1
    | FUNCTION                                   -> $1
    | return                                     { $$ = new Tea.ReturnStatement(); }
    | return EXPR                                { $$ = new Tea.ReturnStatement($2); }
    | delete EXPR                                { $$ = new Tea.DeleteStatement($2); }
    | break                                      { $$ = new Tea.Statement(new Tea.Keyword("break")); }
    | next                                       { $$ = new Tea.Statement(new Tea.Keyword("continue")); }
    | continue                                   { $$ = new Tea.Statement(new Tea.Keyword("continue")); }
    | EXPR                                       { $$ = new Tea.Statement($1); }
    | throw EXPR                                 { $$ = new Tea.ThrowStatement($2); }
    | begin LF ASTMT RESCUE end                  { $$ = new Tea.BeginStatement($3, $4); }
    | begin LF ASTMT RESCUE ensure LF ASTMT end  { $$ = new Tea.BeginStatement($3, $4, $7); }
    | begin LF ASTMT ensure LF ASTMT end         { $$ = new Tea.BeginStatement($3, null, $6); }
    ;

RESCUE
    : rescue LF ASTMT                                    { $$ = [ new Tea.RescueStatement([], null, $3) ]; }
    | rescue '=>' IDENTIFIER LF ASTMT                    { $$ = [ new Tea.RescueStatement([], $3, $5) ]; }
    | rescue RESCUE_ARGS LF ASTMT                        { $$ = [ new Tea.RescueStatement($2, null, $4) ]; }
    | rescue RESCUE_ARGS '=>' IDENTIFIER LF ASTMT        { $$ = [ new Tea.RescueStatement($2, $4, $6) ]; }
    | RESCUE rescue LF ASTMT                             { $1.push(new Tea.RescueStatement([], null, $4)); $$ = $1; }
    | RESCUE rescue '=>' IDENTIFIER LF ASTMT             { $1.push(new Tea.RescueStatement([], $4, $6));   $$ = $1; }
    | RESCUE rescue RESCUE_ARGS LF ASTMT                 { $1.push(new Tea.RescueStatement($3, null, $5)); $$ = $1; }
    | RESCUE rescue RESCUE_ARGS '=>' IDENTIFIER LF ASTMT { $1.push(new Tea.RescueStatement($3, $5, $7));   $$ = $1; }
    ;

RESCUE_ARGS
    : IDENTIFIER                            { $$ = [ $1 ]; }
    | RESCUE_ARGS ',' IDENTIFIER            { $1.push($3); $$ = $1; }
    ;

CLASS
    : class FUNCNAME OSTMT end              { $$ = new Tea.ClassStatement($2, null, $3); }
    | class FUNCNAME INHERIT OSTMT end      { $$ = new Tea.ClassStatement($2, $3, $4); }
    ;

OSTMT
    : OFUNC                                 { $$ = [ $1 ]; }
    | COMPFUNC                              -> $1
    | COMPFUNC OFUNC                        {  $1.push($2); $$ = $1; }
    ;

COMPFUNC
    : TFUNC {
        $$ = [];
        if (typeof $1 !== "string") {
            $$.push($1);
        }
    }
    | COMPFUNC TFUNC {
        if (typeof $2 !== "string") {
            $1.push($2);
        }
        $$ = $1;
    }
    ;

TFUNC
    : LF
    | OFUNC LF                              -> $1
    ;

OFUNC
    : FUNCTION                              -> $1
    ;

FUNCTION
    : def FUNCNAME LF ASTMT end                          { $$ = new Tea.Function($2, null, $4); }
    | def FUNCNAME INHERIT LF ASTMT end                  { $$ = new Tea.Function($2, null, $5, $3); }
    | def FUNCNAME '(' ARGLIST ')' ASTMT end             { $$ = new Tea.Function($2, $4,   $6); }
    | def FUNCNAME '(' ARGLIST ')' INHERIT LF ASTMT end  { $$ = new Tea.Function($2, $4,   $8, $6); }
    | def '-' FUNCNAME LF ASTMT end                      { $$ = new Tea.Function($3, null, $5, null, "-"); }
    | def '-' FUNCNAME '(' ARGLIST ')' ASTMT end         { $$ = new Tea.Function($3, $5,   $7, null, "-"); }
    | def '+' FUNCNAME LF ASTMT end                      { $$ = new Tea.Function($3, null, $5, null, "+"); }
    | def '+' FUNCNAME '(' ARGLIST ')' ASTMT end         { $$ = new Tea.Function($3, $5,   $7, null, "+"); }
    ;

INHERIT
    : '<' FUNCNAME  -> $2
    ;

FUNCNAME
    : IDENTIFIER                            { $$ = $1; }
    | FUNCNAME '.' IDENTIFIER               { $$ = new Tea.Dot($1, $3); }
    ;

ELSIF
    : elsif EXPR THEN ASTMT                 { $$ = [ new Tea.ElsifStatement($2, $4) ]; }
    | ELSIF elsif EXPR THEN ASTMT           { $1.push(new Tea.ElsifStatement($3, $5)); $$ = $1; }
    ;

WHEN
    : when ARGS THEN ASTMT                  { $$ = [ new Tea.WhenStatement($2, $4) ]; }
    | LF when ARGS THEN ASTMT               { $$ = [ new Tea.WhenStatement($3, $5) ]; }
    | WHEN when ARGS THEN ASTMT             { $1.push(new Tea.WhenStatement($3, $5)); $$ = $1; }
    ;

DO   : do   | LF do   | LF ;
THEN : then | LF then | LF ;

EXPR
    : CONDITIONAL                           -> $1
    | LHS '=' EXPR                          { $$ = new Tea.Operation("=", $1, $3); }
    | LHS OP_ASGN EXPR                      { $$ = new Tea.Operation($2,  $1, $3); }
    | EXPR 'instanceof' EXPR                { $$ = new Tea.Operation("instanceof", $1, $3); }
    ;

CONDITIONAL
    : LOGICAL                               -> $1
    | LOGICAL '?' EXPR ':' CONDITIONAL      { $$ = new Tea.Condition($1, $3, $5); }
    ;

LOGICAL
    : RELATIONAL                            -> $1
    | LOGICAL '||' LOGICAL                  { $$ = new Tea.Operation("||", $1, $3); }
    | LOGICAL or   LOGICAL                  { $$ = new Tea.Operation("||", $1, $3); }
    | LOGICAL '&&' LOGICAL                  { $$ = new Tea.Operation("&&", $1, $3); }
    | LOGICAL and  LOGICAL                  { $$ = new Tea.Operation("&&", $1, $3); }
    | LOGICAL '|'  LOGICAL                  { $$ = new Tea.Operation("|",  $1, $3); }
    | LOGICAL '^'  LOGICAL                  { $$ = new Tea.Operation("^",  $1, $3); }
    | LOGICAL '&'  LOGICAL                  { $$ = new Tea.Operation("&",  $1, $3); }
    ;

RELATIONAL
    : OPERATION                             -> $1
    | RELATIONAL '==' RELATIONAL            { $$ = new Tea.Operation("===", $1, $3); }
    | RELATIONAL '!=' RELATIONAL            { $$ = new Tea.Operation("!==", $1, $3); }
    | RELATIONAL '<'  RELATIONAL            { $$ = new Tea.Operation("<",   $1, $3); }
    | RELATIONAL '>'  RELATIONAL            { $$ = new Tea.Operation(">",   $1, $3); }
    | RELATIONAL '<=' RELATIONAL            { $$ = new Tea.Operation("<=",  $1, $3); }
    | RELATIONAL '>=' RELATIONAL            { $$ = new Tea.Operation(">=",  $1, $3); }
    ;

OPERATION
    : UNARY                                 -> $1
    | OPERATION '<<'  OPERATION             { $$ = new Tea.Operation("<<",  $1, $3); }
    | OPERATION '>>'  OPERATION             { $$ = new Tea.Operation(">>",  $1, $3); }
    | OPERATION '>>>' OPERATION             { $$ = new Tea.Operation(">>>", $1, $3); }
    | OPERATION '+'   OPERATION             { $$ = new Tea.Operation("+",   $1, $3); }
    | OPERATION '-'   OPERATION             { $$ = new Tea.Operation("-",   $1, $3); }
    | OPERATION '*'   OPERATION             { $$ = new Tea.Operation("*",   $1, $3); }
    | OPERATION '/'   OPERATION             { $$ = new Tea.Operation("/",   $1, $3); }
    | OPERATION '%'   OPERATION             { $$ = new Tea.Operation("%",   $1, $3); }
    ;

UNARY
    : PRIMARY                               -> $1
    | '+'    PRIMARY                        { $$ = new Tea.Unary("+",      $2); }
    | '-'    PRIMARY                        { $$ = new Tea.Unary("-",      $2); }
    | '~'    PRIMARY                        { $$ = new Tea.Unary("~",      $2); }
    | '!'    PRIMARY                        { $$ = new Tea.Unary("!",      $2); }
    | not    PRIMARY                        { $$ = new Tea.Unary("!",      $2); }
    | typeof PRIMARY                        { $$ = new Tea.Unary("typeof", $2); }
    | new    PRIMARY                        {
        if ($2 instanceof Tea.Call) {
            $$ = new Tea.NewExpression($2.expression, $2.arguments);
        } else {
            $$ = new Tea.NewExpression($2);
        }
    }
    ;

PRIMARY
    : LHS                                   -> $1
    | LITERAL                               -> $1
    | ARRAY                                 -> $1
    | OBJECT                                -> $1
    | LAMBDA                                -> $1
    | '(' EXPR ')'                          { $$ = new Tea.Paren($2); }
    | PRIMARY '(' CALL_ARGS ')'             { $$ = new Tea.Call($1, $3); }
    ;

ARRAY
    : '[' ']'                               { $$ = new Tea.Array(); }
    | '[' ARGS ']'                          { $$ = new Tea.Array($2); }
    | '[' ARGS ',' ']'                      { $$ = new Tea.Array($2); }
    ;

OBJECT
    : '{' '}'                               { $$ = new Tea.Object(); }
    | '{' ASSOCS '}'                        { $$ = new Tea.Object($2); }
    | '{' ASSOCS ',' '}'                    { $$ = new Tea.Object($2); }
    ;

LAMBDA
    : '->' '{' ASTMT '}'                    { $$ = new Tea.Function(null, [], $3); }
    | '->' '(' ARGLIST ')' '{' ASTMT '}'    { $$ = new Tea.Function(null, $3, $6); }
    ;

RANGE
    : EXPR '..'  EXPR                       { $$ = new Tea.Range("inclusive", $1, $3); }
    | EXPR '...' EXPR                       { $$ = new Tea.Range("exclusive", $1, $3); }
    ;

LHS
    : IDENTIFIER                            -> $1
    | PRIMARY '.' DOTABLE                   { $$ = new Tea.Dot($1, $3); }
    | PRIMARY '[' EXPR ']'                  { $$ = new Tea.Index($1, $3); }
    | PRIMARY '[' RANGE ']'                 { $$ = new Tea.Index($1, $3); }
    ;

DOTABLE
    : IDENTIFIER                            -> $1
    | delete                                { $$ = new Tea.Identifier('delete'); }
    | loop                                  { $$ = new Tea.Identifier('loop'); }
    | next                                  { $$ = new Tea.Identifier('next'); }
    | object                                { $$ = new Tea.Identifier('object'); }
    | own                                   { $$ = new Tea.Identifier('own'); }
    | then                                  { $$ = new Tea.Identifier('then'); }
    | when                                  { $$ = new Tea.Identifier('when'); }
    ;

ARGLIST
    : SUBARGLIST                            -> $1
    | SUBARGLIST ',' '*' IDENTIFIER         { $1.push(new Tea.Splat($4)); $$ = $1; }
    | '*' IDENTIFIER                        { $$ = [ new Tea.Splat($2) ]; }
    |                                       { $$ = []; }
    ;

SUBARGLIST
    : IDENTIFIER                            { $$ = [ $1 ]; }
    | IDENTIFIER '=' EXPR                   { $$ = [ new Tea.Operation("=", $1, $3) ]; }
    | SUBARGLIST ',' IDENTIFIER             { $1.push($3); $$ = $1; }
    | SUBARGLIST ',' IDENTIFIER '=' EXPR    {
        $1.push(new Tea.Operation("=", $3, $5));
        $$ = $1;
    }
    ;

CALL_ARGS
    : SUB_CALL_ARGS                         -> $1
    | SUB_CALL_ARGS ',' ASSOCS              { $1.push(new Tea.Object($3)); $$ = $1; }
    | ASSOCS                                { $$ = [ new Tea.Object($1) ]; }
    |
    ;

SUB_CALL_ARGS
    : EXPR                                  { $$ = [ $1 ]; }
    | '*' EXPR                              { $$ = [ new Tea.Splat($2) ]; }
    | SUB_CALL_ARGS ',' EXPR                { $1.push($3); $$ = $1; }
    | SUB_CALL_ARGS ',' '*' EXPR            { $1.push(new Tea.Splat($4)); $$ = $1; }
    ;

ARGS
    : EXPR                  { $$ = [ $1 ]; }
    | ARGS ',' EXPR         { $1.push($3); $$ = $1; }
    | ARGS LF* ',' EXPR     { $1.push($4); $$ = $1; }
    | ARGS ',' LF* EXPR     { $1.push($4); $$ = $1; }
    ;

ASSOCS
    : ASSOC                 { $$ = [ $1 ]; }
    | ASSOCS ',' ASSOC      { $1.push($3); $$ = $1; }
    | ASSOCS LF* ',' ASSOC  { $1.push($4); $$ = $1; }
    | ASSOCS ',' LF* ASSOC  { $1.push($4); $$ = $1; }
    ;

ASSOC
    : EXPR ':' EXPR     { $$ = new Tea.Assoc($1, $3); }
    ;

IDENTIFIER
    : identifier        { $$ = new Tea.Identifier($1); }
    ;

LITERAL
    : BOOLEAN           { $$ = new Tea.Keyword($1); }
    | NIL               { $$ = new Tea.Keyword($1); }
    | NUMBER            { $$ = new Tea.Number($1); }
    | STRING            { $$ = new Tea.String($1); }
    | REGEXP            { $$ = new Tea.RegExp($1); }
    ;

OP_ASGN
    : '+='  -> $1
    | '-='  -> $1
    | '*='  -> $1
    | '/='  -> $1
    | '%='  -> $1
    | '|='  -> $1
    | '&='  -> $1
    | '^='  -> $1
    | '>>=' -> $1
    | '<<=' -> $1
    | '||=' -> $1
    ;

