steal(
    'can',
    'd3px/controls/pages/player/init.ejs',
    'd3px/controls/pages/player/player.less',
    'd3px/lib/d3lib.js',
    'd3px/lib/utils.js',
function(can, initView) {    
    /**
     * The controller for handling the loading and interactions of the player page.
     * 
     * @constructor d3px/controls/pages/player
     * @alias PlayerPage
     * @parent d3px
     * @inherits can.Control
     */
    return can.Control(
        {
            defaults: {
                data: null
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
