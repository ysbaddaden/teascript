var assert = require('assert');
var T = require("../../lib/tea");

exports['test throw'] = function () {
    assert.equal("throw Error('message');", T.compile("throw Error('message')"));
};

exports['test single rescue'] = function () {
    assert.equal("try {\n\n} catch (__ref1) {\n\n}",
        T.compile("begin;rescue;end"));

    assert.equal("try {\n\n} catch (ex) {\n\n}",
        T.compile("begin;rescue => ex;end"));

    assert.equal(
        "try {\n\n" +
        "} catch (ex) {\n" +
        "    if (ex instanceof Error) {\n" +
        "        log.error(ex);\n" +
        "    }\n" +
        "}",
        T.compile("begin;rescue Error => ex;log.error(ex);end"));
};

exports['test multiple rescues'] = function () {
    assert.equal(
        "try {\n\n" +
        "} catch (__ref1) {\n" +
        "    if (__ref1 instanceof Failure) {\n\n" +
        "    } else if (__ref1 instanceof Error) {\n\n" +
        "    }\n" +
        "}",
        T.compile("begin;rescue Failure;rescue Error;end"));

    assert.equal(
        "try {\n\n" +
        "} catch (ex) {\n" +
        "    if (ex instanceof Failure) {\n\n" +
        "    } else if (ex instanceof Error) {\n\n" +
        "    }\n" +
        "}",
        T.compile("begin;rescue Failure => ex;rescue Error => ex;end"));

    assert.equal("var __ref1;\n" +
        "try {\n\n" +
        "} catch (__ref1) {\n" +
        "    if (__ref1 instanceof Failure) {\n" +
        "        ex = __ref1;\n\n" +
        "    } else if (__ref1 instanceof Error) {\n\n" +
        "    }\n" +
        "}",
        T.compile("begin;rescue Failure => ex;rescue Error;end"));
};

exports['test ensure'] = function () {
    assert.equal("try {\n\n} finally {\n\n}",
        T.compile("begin;ensure;end"));
};

exports['test rescue with ensure'] = function () {
    assert.equal("try {\n\n} catch (__ref1) {\n\n} finally {\n\n}",
        T.compile("begin;rescue;ensure;end"));
};

if (module === require.main) {
  require("../test").run(exports);
}
