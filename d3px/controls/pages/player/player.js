steal(
    'can',
    'd3px/controls/pages/player/player.ejs',
    'd3px/controls/pages/player/player.less',
    'd3px/lib/d3lib.js',
    'd3px/lib/utils.js',
function(can, playerView) {
    /**
     * The controller for handling the loading and interactions of the player page.
     * 
     * @constructor d3px/controls/pages/player
     * @alias PlayerPage
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
                this.element.html(playerView(this.options.data));
            },
            '.herocard mouseover': function(el,ev) {
                el.addClass('hover');
            },
            '.herocard mouseout': function(el,ev) {
                el.removeClass('hover');
            },
            '.herocard click': function(el,ev) {
                var navBar = this.options.D3PX.get('navBar');
                var heroPage = this.options.D3PX.get('heroPage');

                if (navBar) {
                    navBar.selectPage('hero');
                }
                if (heroPage) {
                    heroPage.selectHero(el.attr('heroIndex'));
                }
            },
            '.herorow mouseover': function(el,ev) {
                el.addClass('hover');
            },
            '.herorow mouseout': function(el,ev) {
                el.removeClass('hover');
            },
            '.herorow click': function(el,ev) {
                var navBar = this.options.D3PX.get('navBar');
                var heroPage = this.options.D3PX.get('heroPage');
                
                if (navBar) {
                    navBar.selectPage('hero');
                }
                if (heroPage) {
                    heroPage.selectHero(el.attr('heroIndex'));
                }
            },
        }
    );
});
