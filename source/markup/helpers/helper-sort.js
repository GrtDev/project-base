/**
 * Created by gfokke on 14/11/14.
 */

module.exports.register = function (Handlebars) {

    /**
     * Sorts array by a given key
     *
     * @function sort_by_key
     * @memberof Handlebars.helpers
     * @param {array} array - The data to sort.
     * @param {string} key - The key to sort by.
     * @param {asc} boolean - Sort order is ascending.
     * @see {@link http://stackoverflow.com/questions/8175093/simple-function-to-sort-an-array-of-objects}
     *
     * @returns void
     */
    Handlebars.registerHelper('sortBy', function (array, key, ascending) {

        if (ascending !== false) ascending = true;

        array.sort(function (a, b) {
            var x = a[key],
                y = b[key];

            return ((x < y) ? -1 : ((x > y) ? 1 : 0)) * (ascending ? 1 : -1);
        });

    });

    Handlebars.registerHelper('withHash', function (options) {
        return options.fn(options.hash);
    });
};