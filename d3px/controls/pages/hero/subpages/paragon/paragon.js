steal(
    'can',
    'd3px/controls/pages/hero/subpages/paragon/paragon.ejs',
    'd3px/controls/pages/hero/subpages/paragon/paragon.less',
function(can, paragonView) {    
    /**
     * The controller for handling the loading and interactions of the paragon subpage.
     * 
     * @constructor d3px/controls/pages/hero/subpages/paragon
     * @alias ParagonSubPage
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
             * Renders the paragon template.
             */
            init: function(){
                this.element.html(paragonView());
            }
        }
    );
});
