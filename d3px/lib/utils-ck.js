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
 * @return {String} The formatted number
 */function formatNumber(e,t){var n=can.extend({precision:0,commas:!0,prefix:"",postfix:""},t);e=e.toFixed(n.precision);if(n.commas){var r=e.toString().split(".");r[0]=r[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");return r.join(".")}return n.prefix+e+n.postfix}function getSize(e){return Object.keys(e).length};