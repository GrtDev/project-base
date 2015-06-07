/**
 * Handlebars helper for simple math within templates
 * @param leftValue {number}
 * @param operator {string}
 * @param rightValue {number}
 * @param options {object}
 * @returns {number}
 */
module.exports = function ( leftValue, operator, rightValue, options ) {
    leftValue = parseFloat( leftValue );
    rightValue = parseFloat( rightValue );

    return {
        "+": leftValue + rightValue,
        "-": leftValue - rightValue,
        "*": leftValue * rightValue,
        "/": leftValue / rightValue,
        "%": leftValue % rightValue
    }[ operator ];
};