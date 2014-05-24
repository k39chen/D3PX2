steal(
    'can',
    'd3px/controls/banner/banner.ejs',
    'd3px/controls/banner/banner.less',
function(can, bannerView) {
    /**
     * The controller for the banner that displays search queries.
     * 
     * @constructor d3px/controls/banner
     * @alias Banner
     * @parent d3px
     * @inherits can.Control
     */
	return can.Control(
        {
            defaults: {
                D3PX: null,
                defaultGreeting: 'Nephalem'
            }
        },
        {
            /**
             * Renders the initial template.
             */
            init: function(){
                // initialize the view with the appropriate values
                this.element.html(bannerView({
                    pageTitle: 'Diablo 3: Profile X',
                    battleTag: 'Nephalem',
                    remark: 'Stay a while and listen...'
                }));
            },
            /**
             * Changes/shows the page title.
             *
             * @method displayPageTitle
             * @param pageTitle
             */
            displayPageTitle: function(pageTitle) {
                if (pageTitle) {
                    $('#page-title').css({opacity:1}).stop().animate({opacity:0},200,function(){
                        $(this).text(pageTitle).css({opacity:0}).stop().animate({opacity:1},400);
                    });

                }
            },
            /**
             * Changes/shows the greeting battleTag.
             *
             * @method displayGreeting
             * @param battleTag {String} The battletag string.
             */
            displayGreeting: function(battleTag) {
                battleTag = (battleTag) ? battleTag : this.options.defaultGreeting;
                $('#greeting-name').css({opacity:1}).animate({opacity:0},200,function(){
                    $('.battleTag',this).text(battleTag);
                    $(this).css({opacity:0}).animate({opacity:1},400);
                });
            }
        }
    );
});
