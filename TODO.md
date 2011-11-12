# TODO

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

