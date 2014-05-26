steal(
    'can',
    'd3px/controls/pages/hero/hero.ejs',
    'd3px/controls/pages/hero/hero.less',
    'd3px/lib/d3lib.js',
    'd3px/lib/utils.js',
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
            defaults: {
                D3PX: null,
                data: null
            }
        },
        {
            /**
             * Renders the initial template.
             */
            init: function(){
                this.element.html(heroView(this.options.data));
            },
            '.herochoice mouseover': function(el,ev) {
                el.addClass('hover');
            },
            '.herochoice mouseout': function(el,ev) {
                el.removeClass('hover');
            },
            '.herochoice click': function(el,ev) {
                this.selectHero(el);
            },
            /**
             * Selects the hero with the corresponding hero array index.
             *
             * @method selectHero
             * @param el {DOM Object} The DOM object that we are trying to select a hero with.
             */
            selectHero: function(el) {
                var heroIndex = el.attr('heroIndex');

                // update the hero selector view.
                $('.herochoice').removeClass('selected');
                $('.herochoice[heroIndex="'+heroIndex+'"]').addClass('selected');
            }
        }
    );
});
