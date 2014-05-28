steal(
    'can',
    'd3px/controls/pages/hero/subpages/bonuses/bonuses.ejs',
    'd3px/controls/pages/hero/subpages/bonuses/bonuses.less',
function(can, bonusesView) {    
    /**
     * The controller for handling the loading and interactions of the bonuses subpage.
     * 
     * @constructor d3px/controls/pages/hero/subpages/bonuses
     * @alias BonusesSubPage
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
             * Renders the bonuses template.
             */
            init: function(){
                this.element.html(bonusesView());
            }
        }
    );
});
