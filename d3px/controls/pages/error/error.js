steal(
    'can',
    'd3px/controls/pages/error/init.ejs',
    'd3px/controls/pages/error/error.less',
function(can, initView) {    
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
                this.element.html(initView(this.options.data));
            }
        }
    );
});
