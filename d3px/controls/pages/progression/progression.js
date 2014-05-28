steal(
    'can',
    'd3px/controls/pages/progression/progression.ejs',
    'd3px/controls/pages/progression/progression.less',
function(can, progressionView) {    
    /**
     * The controller for handling the loading and interactions of the progression page.
     * 
     * @constructor d3px/controls/pages/progression
     * @alias ProgressionPage
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
                this.element.html(progressionView());
            }
        }
    );
});
