/**
 * Handle bar helper function - Logs the current context or value
 * @name: debug
 * @usage: {{debug}} or {{debug someValue}}
 * @see: http://thinkvitamin.com/code/handlebars-js-part-3-tips-and-tricks/
 */
module.exports = function (optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);

        if(optionalValue)
        {
            console.log("Value");
            console.log("====================");
            console.log(optionalValue);
        }
};