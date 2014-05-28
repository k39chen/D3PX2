steal(
    'can',
    'd3px/controls/pages/hero/subpage/attributes.ejs',
    'd3px/controls/pages/hero/subpage/attributes.less',
function(can, attributesView) {    
    /**
     * The controller for handling the loading and interactions of the attributes subpage.
     * 
     * @constructor d3px/controls/pages/hero/subpage/attributes
     * @alias AttributesSubPage
     * @parent d3px
     * @inherits can.Control
     */
    return can.Control(
        {
            defaults: {}
        },
        {
            /**
             * Renders the attributes template.
             */
            init: function(){
                this.element.html(attributesView());
            }
        }
    );
});
