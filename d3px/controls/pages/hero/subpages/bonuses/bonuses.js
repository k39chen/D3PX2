steal(
    'can',
    'd3px/controls/pages/hero/subpage/bonuses.ejs',
    'd3px/controls/pages/hero/subpage/bonuses.less',
function(can, bonusesView) {    
    /**
     * The controller for handling the loading and interactions of the bonuses subpage.
     * 
     * @constructor d3px/controls/pages/hero/subpage/bonuses
     * @alias BonusesSubPage
     * @parent d3px
     * @inherits can.Control
     */
    return can.Control(
        {
            defaults: {}
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
