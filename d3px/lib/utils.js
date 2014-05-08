/**
 * Formats a number.
 *
 * @method formatNumber
 * @param num {Number} A number of any type.
 * @param options {Object} A list of options.
 *   - precision {Number} The number of decimal points. [default=0]
 *   - commas {Boolean} Flag to show commas. [default=true]
 * @return {String} The formatted number
 */
function formatNumber(num, options) {
    var o = can.extend({
        precision: 0,
        commas: true
    }, options);

    // apply the precision
    num = num.toFixed(o.precision);

    // apply commas if requested
    if (o.commas) {
        var parts = num.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    // return as a string
    return num+"";
}