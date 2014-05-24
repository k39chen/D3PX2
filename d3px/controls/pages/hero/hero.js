steal(
    'can',
    'd3px/controls/pages/hero/hero.ejs',
    'd3px/controls/pages/hero/hero.less',
function(can, heroView) {    
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
                this.element.html(heroView());
            }
        }
    );
});
