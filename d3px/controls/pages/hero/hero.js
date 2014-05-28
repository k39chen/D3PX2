steal(
    'can',
    'd3px/controls/pages/hero/hero.ejs',
    'd3px/controls/pages/hero/subpages/attributes/attributes.js',
    'd3px/controls/pages/hero/subpages/skills/skills.js',
    'd3px/controls/pages/hero/subpages/bonuses/bonuses.js',
    'd3px/controls/pages/hero/subpages/paragon/paragon.js',
    'd3px/controls/pages/hero/hero.less',
    'd3px/lib/d3lib.js',
    'd3px/lib/utils.js',
function(can, heroView, AttributesSubPage, SkillsSubPage, BonusesSubPage, ParagonSubPage) {    
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
                defaultSubPage: 'attributes',

                attributesSubPage: null,
                skillsSubPage: null,
                bonusesSubPage: null,
                paragonSubPage: null
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
                $('#'+this.options.defaultSubPage+'-subpage').addClass('selected');
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
             * Initializes all the subpages.
             *
             * @method setHero
             * @param hero {Object} The hero data.
             */
            setHero: function(hero) {
                if (this.options.attributesSubPage) this.options.attributesSubPage.destroy();
                if (this.options.skillsSubPage) this.options.skillsSubPage.destroy();
                if (this.options.bonusesSubPage) this.options.bonusesSubPage.destroy();
                if (this.options.paragonSubPage) this.options.paragonSubPage.destroy();

                this.options.attributesSubPage = new AttributesSubPage('#attributes-subpage',{data:hero});
                this.options.skillsSubPage = new SkillsSubPage('#skills-subpage',{data:hero});
                this.options.bonusesSubPage = new BonusesSubPage('#bonuses-subpage',{data:hero});
                this.options.paragonSubPage = new ParagonSubPage('#paragon-subpage',{data:hero});
            },
            /**
             * Selects the hero with the corresponding hero array index.
             *
             * @method selectHero
             * @param el {DOM Object} The DOM object that we are trying to select a hero with.
             */
            selectHero: function(el) {
                var heroIndex = el.attr('heroIndex'),
                    self = this;

                // update the hero selector view.
                $('.herochoice').removeClass('selected');
                $('.herochoice[heroIndex="'+heroIndex+'"]').addClass('selected');

                // fade out the previous stuff
                $('#hero-info-section > .content').css({opacity:1.0}).stop().animate({opacity:0.0},200,function(){

                    // set the hero in all the subpages
                    self.setHero(self.options.data.heroes[heroIndex]);

                    // fade in the content area again
                    $(this).css({opacity:0.0}).stop().animate({opacity:1.0},200);
                });
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

                // now we have to fade in and out the subpage
                $('.subpage').css({opacity:1.0}).stop().animate({opacity:0.0},200,function(){

                    if ( !$(this).hasClass('selected') ) return;

                    // hide every subpage
                    $('.subpage').css({display:'none',opacity:0});
                    $('.subpage').removeClass('selected');

                    // show the loaded subpage
                    $('#'+subpage+'-subpage').addClass('selected').css({opacity:0,display:'block'}).stop().animate({opacity:1},400);
                });
            }
        }
    );
});
