var escape, toRegExp, words;
escape = function (str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
toRegExp = function (ary, bound) {
    var map;
    map = ary.map(function (t) {
        return escape(t);
    }).join('|');
    return new RegExp('^(' + map + ')' + (bound ? '\\b' : ''));
};
words = function (str) {
    var ary;
    ary = str.trim().split(/\s+/);
    ary.contains = function (value) {
        return this.indexOf(value) !== -1;
    };
    ary.toRegExp = function (bound) {
        return toRegExp(this, bound);
    };
    return ary;
};
module.exports = words;