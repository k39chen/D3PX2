/**
 * Formats a number.
 *
 * @method formatNumber
 * @param num {Number} A number of any type.
 * @param options {Object} A list of options.
 *   - precision {Number} The number of decimal points. [default=0]
 *   - commas {Boolean} Flag to show commas. [default=true]
 *   - prefix {String} An optional prefix. [default='']
 *   - postfix {String} An optional postfix. [default='']
 *   - operation {Function} An optional operation. [default=null]
 * @return {String} The formatted number
 */
function formatNumber(num, options) {
    var o = can.extend({
        precision: 0,
        commas: true,
        prefix: '',
        postfix: '',
        operation: null
    }, options);

    // perform a custom operation
    if (o.operation) {
        num = o.operation(num);
    }
    // apply the precision
    num = num.toFixed(o.precision);

    // apply commas if requested
    if (o.commas) {
        var parts = num.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        num = parts.join(".");
    }
    parts = num.split(',');
    num = (parts.length <= 2) ? parts.join('') : parts.join(',');

    // add pre/postfix
    return o['prefix']+num+o.postfix;
}
/**
 * Reports the number of properties in object
 *
 * @method getSize
 * @param obj {Object} The object.
 * @return {Number} The number of properties in the object.
 */
function getSize(obj) {
    return Object.keys(obj).length;
}