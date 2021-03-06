steal(
    'can',
    'd3px/controls/pages/error/error.ejs',
    'd3px/controls/pages/error/error.less',
    'd3px/lib/d3lib.js',
function(can, errorView) {    
    /**
     * The controller for handling the loading and interactions of the error page.
     * 
     * @constructor d3px/controls/pages/error
     * @alias ErrorPage
     * @parent d3px
     * @inherits can.Control
     */
    return can.Control(
        {
            defaults: {
                data: {
                    battleTag: '',
                    region: 'us'
                }
            }
        },
        {
            /**
             * Renders the initial template.
             */
            init: function(){
                this.element.html(errorView(this.options.data));
            }
        }
    );
});
