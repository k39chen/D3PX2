steal(
    'can',
    'd3px/controls/navbar/navbar.ejs',
    'd3px/controls/pages/splash/splash.js',
    'd3px/controls/pages/player/player.js',
    'd3px/controls/pages/hero/hero.js',
    'd3px/controls/pages/progression/progression.js',
    'd3px/controls/pages/error/error.js',
    'd3px/controls/navbar/navbar.less',
function(can, navbarView, SplashPage, PlayerPage, HeroPage, ProgressionPage, ErrorPage) {    
    /**
     * The controller for the side navbar that switches pages.
     * 
     * @constructor d3px/controls/navbar
     * @alias NavBar
     * @parent d3px
     * @inherits can.Control
     */
	return can.Control(
        {
            defaults: {
                D3PX: null,
                defaultPage: 'splash',
                width: 82
            }
        },
        {
            /**
             * Renders the initial template.
             */
            init: function(){
                this.element.html(navbarView());
            
                // we initially show the splash page
                this.selectPage(this.options.defaultPage);
                $('#'+this.options.defaultPage+'-page').addClass('selected');
            },
            /**
             * Define basic interactions/events
             */
            '.navitem mouseover': function(el,ev){
                el.addClass('hover');
            },
            '#navhome mouseover': function(el,ev){
                el.addClass('hover');
            },
            '.navitem mouseout': function(el,ev){
                el.removeClass('hover');
            },
            '#navhome mouseout': function(el,ev){
                el.removeClass('hover');
            },
            '.navitem click': function(el,ev){
                this.selectPage(el.attr('page'));
            },
            '#navhome click': function(el,ev){
                var banner = this.options.D3PX.get('banner');

                this.selectPage(el.attr('page'));

                if (banner) {
                    banner.displayGreeting(null);
                }
            },
            /**
             * Selects a page and displays the contents of the page.
             *
             * @method selectPage
             * @param page {String} The page identifier.
             * @param data {Object} The data that is required to load the page.
             */
            selectPage: function(page,data) {
                var self = this;
                var banner = this.options.D3PX.get('banner');

                if (page != 'splash' && page != 'error') {
                    // show the navgroup if it was previously not visible
                    if (!this.isNavGroupVisible()) {
                        this.showNavGroup();
                    }
                    $('.navitem').removeClass('selected');
                    $('.navitem[page="'+page+'"]').addClass('selected');
                } else {
                    // hide the navgroup and show the splash/error screen
                    if (this.isNavGroupVisible()) {
                        this.hideNavGroup();
                    }
                    // unregister the cached battleTag
                    this.options.D3PX.set('battleTag', null);
                    if (banner) {
                        banner.displayGreeting(null);
                    }
                }
                // fade out the pages
                $('.page').css({opacity:1}).stop().animate({opacity:0},200,function(){
                    
                    if ( !$(this).hasClass('selected') ) return;

                    // hide every page
                    $('.page').css({display:'none',opacity:0});

                    // determine which page to populate
                    var currBT = self.options.D3PX.get('battleTag'),
                        prevBT = self.options.D3PX.get('prevBattleTag');
                        
                    if (currBT && currBT != prevBT) {
                        new PlayerPage('#player-page',{D3PX: self.options.D3PX, data:data});
                        new HeroPage('#hero-page',{D3PX: self.options.D3PX, data:data});
                        new ProgressionPage('#progression-page',{D3PX: self.options.D3PX, data:data});
                    } else {
                        // create the splash page
                        new SplashPage('#splash-page',{D3PX: self.options.D3PX, data:data});

                        // create the error page, if requested
                        if (page == 'error') {
                            new ErrorPage('#error-page',{D3PX: self.options.D3PX, data:data});
                        }
                    }
                    // update the battletag flag
                    self.options.D3PX.set('prevBattleTag',currBT);

                    // show the loaded page
                    $('#'+page+'-page').addClass('selected').css({opacity:0,display:'block'}).stop().animate({opacity:1},400);
                });
                // parallel the above animation with updating the banner page title
                var banner = this.options.D3PX.get('banner');
                if (banner) {
                    var title = '';
                    switch (page) {
                        case 'error':
                        case 'splash': title = 'Diablo 3: Profile X'; break;
                        case 'player': title = 'Player Profile'; break;
                        case 'hero': title = 'Hero Profile'; break;
                        case 'progression': title = 'Progression'; break;
                        default: break;
                    }
                    banner.displayPageTitle(title);
                }
            },
            /**
             * Determines whether or not the nav group is currently visible.
             *
             * @method isNavGroupVisible
             * @return {Boolean} The result of the evaluation.
             */
            isNavGroupVisible: function() {
                return $('#navgroup').css('display') == 'block';
            },
            /**
             * Shows the nav group.
             *
             * @method showNavGroup
             * @param page {String} The page identifier (default=null).
             */
            showNavGroup: function(page) {
                if (!$('#navgroup').is(':animated')) {
                    $('#navgroup').css({
                        left: -this.options.width,
                        display: 'block'
                    }).stop().animate({left: 0}, 300);
                }
                if (page) {
                    this.selectPage(page);

                }
            },
            /**
             * Hides the nav group.
             *
             * @method hideNavGroup
             */
            hideNavGroup: function() {
                if (!$('#navgroup').is(':animated')) {
                    $('#navgroup').css({
                        left: 0,
                        display: 'block'
                    }).stop().animate({
                        left: -this.options.width
                    }, 300, function(){
                        $(this).css({display:'none'});
                    });
                }
            }
        }
    );
});
