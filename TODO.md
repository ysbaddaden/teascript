# TODO

## Ranges

### Array slice: [DONE]

    <enumerable>[<expression>..<expression>]

Example:

    ary = buildSomeArray();
    ary[1...4]             # =>  Array.prototype.slice.call(ary, 1, 4);
    
    $("#tags li")[2..5]    # =>  Array.prototype.slice.call($("#tags li"), 2, 6);

## FOR

### Iterating within a range:

    for <value> in <range> [do]
      <statements>
    end
    
    statement for <value> in <range>

Examples:

    for i in [0...10] do                    # => for (i = 0; i < 10; i++) {
    end                                          }

    for i in [145..9815]                    # => for (i = 145; i <= 9815; i++) {
    end                                          }

### Iterating arrays

    for <value> in [0...<array>.length] [do]
      <statements>
    end

    <array>.forEach ->(item) {
      <statements>
    }

Examples:

    for i in [0...10] do                    # => for (i = 0; i < 10; i++) {
    end                                          }

    for i in [0...ary.length] do            # => for (i = 0; i < ary.length; i++) {
      value = ary[i]                               value = ary[i];
    end                                          }

    ary.forEach ->(item) do                 # => ary.forEach(function (item) {
    end                                          });

## Methods

- methods should always return their latest expression:

      def m1(a, b)                |     function m1(a, b) {
        a || b                    |       return a || b;
      end                         |     }
                                  |
      def m1(a, b, c)             |     function m1(a, b, c) {
        if a                      |       if (a) {
          a                       |         return a;
        elsif b                   |       } else if (b) {
          b                       |         return b;
        else                      |       } else {
          c                       |         return c;
        end                       |       }
      end                         |     }

## Anonymous methods

- regular:

      m1() ->                     |     m1(function () {
      end                         |     });
                                  |
      a.forEach -> |item|         |     a.forEach(function (item) {
      end                         |     });
                                  |
      m2(a, b) -> |x, y|          |     m2(a, b, function (x, y) {
      end                         |     });
                                  |
      elm.on('click') -> |e|      |     elm.on('click', function (event) {
        e.preventDefault()        |       e.preventDefault();
      end                         |     });

- inline:

      elm.click -> |e| e.stop()   |     elm.click(function (e) {
                                  |       e.stop();
                                  |     });
                                  |
      elm.on('click') -> cb()     |     elm.on('click', function () {
                                  |       cb();
                                  |     });
                                  |
      ary.map -> &toString        |     ary.map(function (x) {
                                  |       return x.toString();
                                  |     });

