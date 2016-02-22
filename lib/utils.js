/**
 * Parse route uri to regular expression
 * @param  {String} input Route
 * @return {Object}       A route match object
 */
module.exports.parseRoute = function(input) {
    var has_s, len, origin, output, param_re, re_str;
    output = {};
    origin = input;
    len = input.length;
    has_s = false;
    if ((input.indexOf('/*')) === len - 2) {
        input = input.replace(/\*/, '(.+)');
        has_s = true;
    }
    re_str = '^' + input.replace(/\{[^\}]+}/g, '([^/]+)') + '$';
    output.re = new RegExp(re_str);
    param_re = '^' + origin.replace(/\{[^\}]+}/g, '{([^/]+)}') + '$';
    output.params = input.match(param_re);
    output.params = output.params && output.params.splice(1);
    output.params = output.params || [];
    if (has_s) {
        output.params.push('path');
    }
    return output;
}

module.exports.parseQuery = function(input) {
    var i, item, len1, output, ref;
    output = {};
    ref = input.split('&');
    for (i = 0, len1 = ref.length; i < len1; i++) {
        item = ref[i];
        item = item.split('=');
        output[item[0]] = item[1];
    }
    return output;
};
