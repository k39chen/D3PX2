steal(
    'can',
    'd3px/controls/pages/player/init.ejs',
    'd3px/controls/pages/player/player.less',
    'd3px/plugins/jquery.tableScroll/jquery.tableScroll.js',
    'd3px/plugins/jquery.tableScroll./jquery.tableScroll.css',
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
            defaults: {}
        },
        {
            /**
             * Renders the initial template.
             */
            init: function(){

                this.element.html(initView());



            }
        }
    );
});
