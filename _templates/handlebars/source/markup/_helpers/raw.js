/**
 * Handlebars helper to prevent handlebars from parsing the code and thus preserving syntax.
 * Useful for AngularJS templates because Angular shares the same syntax as Handlebars.
 * @param options
 * @returns {string}
 */
module.exports = function (options)
{
    var raw = options.fn();

    return raw;
};