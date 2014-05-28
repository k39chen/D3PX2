steal(
    'can',
    'd3px/controls/pages/hero/paperdoll/paperdoll.ejs',
    'd3px/controls/pages/hero/paperdoll/paperdoll.less',
function(can, paperDoll) {    
    /**
     * The controller for handling the loading and interactions of the paperdoll.
     * 
     * @constructor d3px/controls/pages/hero/paperdoll
     * @alias PaperDoll
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
             * Renders the paperdoll template.
             */
            init: function(){
                this.element.html(paperDoll(this.options.data));
            }
        }
    );
});
