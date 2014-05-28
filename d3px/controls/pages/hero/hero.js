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
                data: null,
                defaultSubPage: 'attributes'
            }
        },
        {
            /**
             * Renders the initial template.
             */
            init: function(){
                this.element.html(heroView(this.options.data));

                // automatically select the first hero
                if (this.options.data && this.options.data.heroes && this.options.data.heroes.length > 0) {
                    this.selectHero( $('.herochoice').first() );
                }
                // select the default subpage
                this.selectSubPage(this.options.defaultSubPage,this.options.data);

                // we need to set up all the subpages
                // ...
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
            '.subnavitem mouseover': function(el,ev) {
                el.addClass('hover');
            },
            '.subnavitem mouseout': function(el,ev) {
                el.removeClass('hover');
            },
            '.subnavitem click': function(el,ev) {
                this.selectSubPage(el.attr('subpage'));
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
            },
            /**
             * Selects a page and displays the contents of the page.
             *
             * @method selectSubPage
             * @param subpage {String} The page identifier.
             * @param data {Object} The data that is required to load the page.
             */
            selectSubPage: function(subpage,data) {
                // update the navbar for the subpages
                $('.subnavitem').removeClass('selected');
                $('.subnavitem[subpage="'+subpage+'"]').addClass('selected');

                // now we have to fade in and out the page
                // ...
            }
        }
    );
});
