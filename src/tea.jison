%right and or not typeof instanceof
%right '=' OP_ASGN
%right '..' '...'
%left  '+' '-' '|' '^' '&'
%right '*' '/' '%'
%left  '>' '>=' '<' '<=' '==' '!='
%right '<<' '>>'
%left  '&&' '||'
%left  '?' ':'

%start PROGRAM

%%

PROGRAM
    : COMPSTMT EOF    { return new T.Program($1); }
    ;

ASTMT
    : STMT            { $$ = new T.Body($1); }
    | COMPSTMT        -> $1
    | COMPSTMT STMT   {
        if (typeof $2 !== "string") {
          $1.push($2);
        }
        $$ = $1;
    }
    |                 { $$ = new T.Body(); }
    ;

COMPSTMT
    : TSTMT           {
        $$ = new T.Body();
        if (typeof $1 !== "string") {
            $$.push($1);
        }
    }
    | COMPSTMT TSTMT  {
        if (typeof $2 !== "string") {
          $1.push($2);
        }
        $$ = $1;
    }
    ;

TSTMT
    : LF
    | STMT LF          -> $1
    ;

STMT
    : STMT if EXPR {
        $$ = new T.IfStatement($3, new T.Body($1));
    }
    | STMT unless EXPR {
        $$ = new T.UnlessStatement($3, new T.Body($1));
    }
    | STMT while EXPR {
        $$ = new T.WhileStatement($3, new T.Body($1));
    }
    | STMT until EXPR {
        $$ = new T.UntilStatement($3, new T.Body($1));
    }
    | STMT for IDENTIFIER of EXPR {
        $$ = new T.ForStatement($3, $5, new T.Body($1));
    }
    | STMT for IDENTIFIER in EXPR {
        $$ = new T.ForInStatement(false, $3, null, $5, new T.Body($1));
    }
    | STMT for own IDENTIFIER in EXPR {
        $$ = new T.ForInStatement(true, $4, null, $6, new T.Body($1));
    }
    | if EXPR THEN ASTMT end {
        $$ = new T.IfStatement($2, $4);
    }
    | if EXPR THEN ASTMT else ASTMT end {
        $$ = new T.IfStatement($2, $4, [ new T.ElseStatement($6) ]);
    }
    | if EXPR THEN ASTMT ELSIF_STMT end {
        $$ = new T.IfStatement($2, $4, $5);
    }
    | if EXPR THEN ASTMT ELSIF_STMT else ASTMT end {
        $5.push(new T.ElseStatement($7));
        $$ = new T.IfStatement($2, $4, $5);
    }
    | unless EXPR THEN ASTMT end {
        $$ = new T.UnlessStatement($2, $4);
    }
    | unless EXPR THEN ASTMT else ASTMT end {
        $$ = new T.UnlessStatement($2, $4, new T.ElseStatement($6));
    }
    | while EXPR DO ASTMT end {
        $$ = new T.WhileStatement($2, $4);
    }
    | until EXPR DO ASTMT end {
        $$ = new T.UntilStatement($2, $4);
    }
    | loop DO ASTMT end {
        $$ = new T.LoopStatement($3);
    }
    | case EXPR WHEN_STMT end {
        $$ = new T.CaseStatement($2, $3);
    }
    | case EXPR WHEN_STMT else ASTMT end {
        $3.push(new T.ElseStatement($5));
        $$ = new T.CaseStatement($2, $3);
    }
    | for IDENTIFIER of EXPR DO ASTMT end {
        $$ = new T.ForStatement($2, $4, $6);
    }
    | for IDENTIFIER in EXPR DO ASTMT end {
        $$ = new T.ForInStatement(false, $2, null, $4, $6);
    }
    | for IDENTIFIER ',' IDENTIFIER in EXPR DO ASTMT end {
        $$ = new T.ForInStatement(false, $2, $4, $6, $8);
    }
    | for own IDENTIFIER in EXPR DO ASTMT end {
        $$ = new T.ForInStatement(true, $3, null, $5, $7);
    }
    | for own IDENTIFIER ',' IDENTIFIER in EXPR DO ASTMT end {
        $$ = new T.ForInStatement(true, $3, $5, $7, $9);
    }
    | def IDENTIFIER ARGDECL ASTMT end {
        $$ = new T.Function($2, $3, $4);
    }
    | return       { $$ = new T.ReturnStatement(); }
    | return EXPR  { $$ = new T.ReturnStatement($2); }
    | break        { $$ = new T.Expression(new T.Keyword("break")); }
    | continue     { $$ = new T.Expression(new T.Keyword("continue")); }
    | EXPR         { $$ = new T.Expression($1); }
    ;

ELSIF_STMT
    : elsif EXPR THEN ASTMT {
        $$ = [ new T.ElsifStatement($2, $4) ];
    }
    | ELSIF_STMT elsif EXPR THEN ASTMT {
        $1.push(new T.ElsifStatement($2, $4));
        $$ = $1;
    }
    ;

WHEN_STMT
    : when ARGS THEN ASTMT {
        $$ = [ new T.WhenStatement($2, $4) ];
    }
    | LF when ARGS THEN ASTMT {
        $$ = [ new T.WhenStatement($3, $5) ];
    }
    | WHEN_STMT when ARGS THEN ASTMT {
        $1.push(new T.WhenStatement($3, $5));
        $$ = $1;
    }
    ;

DO   : do   | LF do   | LF ;
THEN : then | LF then | LF ;

EXPR
    : LHS '=' EXPR            { $$ = new T.Operation("=", $1, $3); }
    | LHS '=' LAMBDA          { $$ = new T.Operation("=", $1, $3); }
    | LHS OP_ASGN EXPR        { $$ = new T.Operation($2.replace(/\s+$/, ""), $1, $3); }
    | EXPR '..' EXPR          { $$ = new T.Range("inclusive", $1, $3); }
    | EXPR '...' EXPR         { $$ = new T.Range("exclusive", $1, $3); }
    | EXPR '+' EXPR           { $$ = new T.Operation("+", $1, $3); }
    | EXPR '-' EXPR           { $$ = new T.Operation("-", $1, $3); }
    | EXPR '*' EXPR           { $$ = new T.Operation("*", $1, $3); }
    | EXPR '/' EXPR           { $$ = new T.Operation("/", $1, $3); }
    | EXPR '%' EXPR           { $$ = new T.Operation("%", $1, $3); }
    | EXPR '|' EXPR           { $$ = new T.Operation("|", $1, $3); }
    | EXPR '^' EXPR           { $$ = new T.Operation("^", $1, $3); }
    | EXPR '&' EXPR           { $$ = new T.Operation("&", $1, $3); }
    | EXPR '>' EXPR           { $$ = new T.Operation(">", $1, $3); }
    | EXPR '>=' EXPR          { $$ = new T.Operation(">=", $1, $3); }
    | EXPR '<' EXPR           { $$ = new T.Operation("<", $1, $3); }
    | EXPR '<=' EXPR          { $$ = new T.Operation("<=", $1, $3); }
    | EXPR '==' EXPR          { $$ = new T.Operation("===", $1, $3); }
    | EXPR '!=' EXPR          { $$ = new T.Operation("!==", $1, $3); }
    | EXPR '<<' EXPR          { $$ = new T.Operation("<<", $1, $3); }
    | EXPR '>>' EXPR          { $$ = new T.Operation(">>", $1, $3); }
    | EXPR and EXPR           { $$ = new T.Operation("&&", $1, $3); }
    | EXPR or EXPR            { $$ = new T.Operation("||", $1, $3); }
    | not EXPR                { $$ = new T.UnaryExpression("!", $2); }
    | typeof EXPR             { $$ = new T.UnaryExpression("typeof", $2); }
    | instanceof EXPR         { $$ = new T.UnaryExpression("instanceof", $2); }
    | EXPR '?' EXPR ':' EXPR  { $$ = new T.Condition($1, $3, $5); }
    | delete PRIMARY          { $$ = new T.DeleteExpression($2); }
    | PRIMARY                 -> $1
    ;

PRIMARY
    : '(' EXPR ')'              { $$ = new T.Paren($2); }
    | LITERAL                   -> $1
    | LHS                       -> $1
    | '[' ']'                   { $$ = new T.Array(); }
    | '[' ARGS ']'              { $$ = ($2[0] instanceof T.Range) ? $2[0] : new T.Array($2) ; }
    | '[' ARGS ',' ']'          { $$ = ($2[0] instanceof T.Range) ? $2[0] : new T.Array($2) ; }
    | '{' '}'                   { $$ = new T.Object() }
    | '{' ASSOCS '}'            { $$ = new T.Object($2) }
    | '{' ASSOCS ',' '}'        { $$ = new T.Object($2) }
    | PRIMARY '(' CALL_ARGS ')' { $$ = new T.Call($1, $3); }
    | PRIMARY LAMBDA            {
        if ($1 instanceof T.Call) {
            $1.pushArg($2);
            $$ = $1;
        } else {
            $$ = new T.Call($1, [ $2 ]);
        }
    }
    ;

LAMBDA
    : '->' '{' ASTMT '}'                   { $$ = new T.Function(null, [], $3); }
    | '->' '(' CALL_ARGS ')' '{' ASTMT '}' { $$ = new T.Function(null, $3, $6); }
    ;

LHS
    : VARIABLE                -> $1
    | PRIMARY '[' EXPR ']'    { $$ = new T.Index($1, $3); }
    | PRIMARY '.' IDENTIFIER  { $$ = new T.Dot($1, $3); }
    ;

ARGDECL
    : '(' ARGLIST ')'         -> $2
    | ARGLIST LF              -> $1
    ;

ARGLIST
    : IDENTIFIERS                    { $$ = $1; }
    | IDENTIFIERS ',' '*' IDENTIFIER { $1.push(new T.Splat($4)); $$ = $1; }
    | '*' IDENTIFIER                 { $$ = [ new T.Splat($2) ]; }
    |                                { $$ = []; }
    ;

IDENTIFIERS
    : IDENTIFIER                     { $$ = [ $1 ]; }
    | IDENTIFIER '=' EXPR            { $$ = [ new T.Operation("=", $1, $3) ]; }
    | IDENTIFIERS ',' IDENTIFIER     { $1.push($3); $$ = $1; }
    | IDENTIFIERS ',' IDENTIFIER '=' EXPR {
        $1.push(new T.Operation("=", $3, $5));
        $$ = $1;
    }
    ;

CALL_ARGS
    : EXPR                    { $$ = [ $1 ]; }
    | '*' EXPR                { $$ = [ new T.Splat($2) ]; }
    | LAMBDA                  { $$ = [ $1 ]; }
    | CALL_ARGS ',' EXPR      { $1.push($3); $$ = $1; }
    | CALL_ARGS ',' '*' EXPR  { $1.push(new T.Splat($4)); $$ = $1; }
    | CALL_ARGS ',' LAMBDA    { $1.push($3); $$ = $1; }
    |
    ;

ARGS
    : EXPR                    { $$ = [ $1 ]; }
    | ARGS ',' EXPR           { $1.push($3); $$ = $1; }
    ;

ASSOCS
    : ASSOC                   { $$ = [ $1 ]; }
    | ASSOCS ',' ASSOC        { $1.push($3); $$ = $1; }
    ;

ASSOC
    : EXPR ':' EXPR           { $$ = new T.Assoc($1, $3); }
    ;

VARIABLE
    : IDENTIFIER              -> $1
    | null                    { $$ = new T.Keyword($1); }
    | undefined               { $$ = new T.Keyword($1); }
    | true                    { $$ = new T.Keyword($1); }
    | false                   { $$ = new T.Keyword($1); }
    ;

IDENTIFIER
    : identifier              { $$ = new T.Identifier($1); }
    ;

LITERAL
    : numeric                 { $$ = new T.Number($1); }
    | STRING                  { $$ = new T.String($1); }
    ;

OP_ASGN
    : '+='                    -> $1
    | '-='                    -> $1
    | '*='                    -> $1
    | '/='                    -> $1
    | '%='                    -> $1
    | '|='                    -> $1
    | '&='                    -> $1
    | '^='                    -> $1
    | '>>='                   -> $1
    | '<<='                   -> $1
    ;

