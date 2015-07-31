/**
 * Logical operator in a handlebars
 * @see http://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional
 *
 * example usage:
 *
 * {{#ifCond v1 '===' v2}}
 *      {{v1}} is equal to {{v2}}
 * {{else}}
 *      {{v1}} is not equal to {{v2}}
 * {{/ifCond}}
 *
 * @name: ifCond
 * @param v1
 * @param operator
 * @param v2
 * @returns {boolean}
 */
module.exports = function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
};