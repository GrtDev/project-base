/**
 * Exports the function to register a helper function.
 * @see:    https://www.npmjs.com/package/gulp-hb
 * @param   Handlebars {Handlebars} handlebars framework
 */
module.exports.register = function (Handlebars) {

    /**
     * Handle bar helper function - Logs the current context or value
     * usage: {{debug}} or {{debug someValue}}
     * @see: http://thinkvitamin.com/code/handlebars-js-part-3-tips-and-tricks/
     */
    Handlebars.registerHelper("debug", function (optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);

        if(optionalValue)
        {
            console.log("Value");
            console.log("====================");
            console.log(optionalValue);
        }
    });

}