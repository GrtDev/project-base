/**
 * Created by gfokke on 7/11/14.
 */

function SVGShape() {

    var test = "test";

    this.getTest = function () {
        var body = window.document.getElementById('content');

        console.log("body")
        console.log(body)
        body.innerHTML += "SVGShape";

        return test;
    }

}

module.exports = SVGShape;