# TeaScript

Tea is yet another Ruby inspired language that compiles to JavaScript.

## Features

### Lighter syntax:

- semicolons are really optional;
- parenthesis are only required for method call and expression precedence;
- curly braces are only for object declarations (and maybe lambdas) --blocks
  are delimited with the `end` keyword.

### Richer feature set:

- default values for method arguments;
- argument splats in method definitions and calls;
- strict equality where `==` and `!=` compile to `===` and `!==`;
- automatically scoped variables --to the current function unless the variable
  exists in a parent scope;
- statement modifiers like `a = "0" + a if a < 10`;
- `unless` and `until` statements.

## Syntax

### IF

    if <expression> [then]
      <statements>
    [elsif <expression> [then]
      <statements>]
    [else
      <statements>]
    end
    
    if <expression> then <statement> [elsif <expression> then <statement>] [else <statement>] end
    
    <statement> if <expression>

### UNLESS

    unless <expression> [then]
      <statements>
    [else
      <statements>]
    end
    
    unless <expression> then <statement> [else <statement>] end
    
    <statement> unless <expression>

### CASE

    case <expression>
    when <expression>[, <expression>] [then]
      <statements>
    [else
      <statements>]
    end

### WHILE

    while <expression> [do]
      <statements>
    end
    
    <statement> while <expression>

### UNTIL

    until <expression> [do]
      <statements>
    end
    
    <statement> until <expression>

### LOOP

    loop [do]
      <statements>
    end

### Functions

Definition:

    def identifier[(] [arg][, arg = expression][, *args] [)]
      statements
    end

Call:

    [expression .] identifier([arg][, arg][, *args])

Splat arguments:

There may be only one splat argument in function definition, and it must be the
last of the declaration. Function calls do not have that limitation.

Examples:

    def incr(value)
      return incrby(value, 1)
    end

    def incrby value, by = 1
      return value + by
    end

    def concat(a, b, *ary)
      return [a, b].concat(ary)
    end

    args = [1, 2]
    concat(a, b, *args, *[3, 4, 5])

## Author

- Julien Portalier

