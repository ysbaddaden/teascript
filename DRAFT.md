# Draft Syntax

The following statements and expressions described here are a draft of incoming
features.

### Lambdas (anonymous functions)

Definitions:

    -> &<expression>                           |     function (x) {
                                               |       return x.expression;
                                               |     }

    -> &<identifier>                           |     function (x) {
                                               |       return (typeof x.identifier === "function") ? x.identifier() : x.identifier;
                                               |     }

Within method calls:

    method[(][<arguments>][)] -> &statement

Examples:

    users.map -> &name                          # => users.map(function (x) {
                                                       return (typeof x.name === "function") ? x.name() : x.name;
                                                     });

    users.map -> &get('name')                   # => users.map(function (x) {
                                                       return x.get('name');
                                                     });

