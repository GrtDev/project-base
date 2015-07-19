/**
 * Handlebars helper to repeat a block of code
 * @param n
 * @param block
 * @returns {string}
 */
module.exports = function (n, block)
{
    var accum = '';
    for (var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
};