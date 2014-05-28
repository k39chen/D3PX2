steal(
    'can',
    'd3px/controls/pages/hero/subpages/skills/skills.ejs',
    'd3px/controls/pages/hero/subpages/skills/skills.less',
function(can, skillsView) {    
    /**
     * The controller for handling the loading and interactions of the skills subpage.
     * 
     * @constructor d3px/controls/pages/hero/subpages/skills
     * @alias SkillsSubPage
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
             * Renders the skills template.
             */
            init: function(){
                this.element.html(skillsView());
            }
        }
    );
});
