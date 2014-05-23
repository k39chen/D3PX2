steal(
    'can',
    'd3px/controls/pages/hero/init.ejs',
    'd3px/controls/pages/hero/hero.less',
function(can, initView) {    
    /**
     * The controller for handling the loading and interactions of the hero page.
     * 
     * @constructor d3px/controls/pages/hero
     * @alias HeroPage
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
