# TODO

## Ranges

Definition:

    [<expression>..<expression>]    # up or down to the last element (included)
    [<expression>...<expression>]   # up to the n-1 or down to n+1 element

NOTE: expressions are expected to return integers.

Examples:

    [0..5]     # => [ 0, 1, 2, 3, 4, 5 ]
    [0...5]    # => [ 0, 1, 2, 3, 4 ]
    
    [0..100]   # => __a = [];
                    for (i = 0; i <= 100; i++) {
                      __a.push(i))
                    }
    
    [0...100]  # => __b = [];
                    for (i = 0; i < 100; i++) {
                      __b.push(i))
                    }

Array slice:

    <enumerable>[<expression>..<expression>]

Example:

    $("#tags li")[2..5]    # =>  Array.prototype.slice.call($("#tags li"), 2, 5);
    $("#tags li")[1...4]   # =>  Array.prototype.slice.call($("#tags li"), 1, 3);

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

