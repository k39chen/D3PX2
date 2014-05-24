steal(
    'can',
    'd3px/controls/searchbar/init.ejs',
    'd3px/models/d3api.js',
    'd3px/lib/d3lib.js',
    'd3px/controls/searchbar/searchbar.less',
function(can, initView, D3API) {    
    /**
     * The controller for the searchbar that queries the Diablo 3 API.
     * 
     * @constructor d3px/controls/searchbar
     * @alias SearchBar
     * @parent d3px
     * @inherits can.Control
     */
    var ENTER_KEY = 13;
	return can.Control(
        {
            defaults: {
                D3PX: null,
                selectedRegion: 'us'
            }
        },
        {
            /**
             * Renders the initial template.
             */
            init: function(){
                // select a default region
                this.element.html(initView({
                    selectedRegion: this.options.selectedRegion,
                    regions: ['us','eu','kr','tw'],
                }));
                this.selectRegion(this.options.selectedRegion);
            },
            /**
             * Define some basic interactions.
             */
            '#region-options mouseover': function(el,ev) {
                $('#region-options').css({height:128});
            },
            '#region-options mouseout': function(el,ev) {
                $('#region-options').css({height:32});
            },
            '.region-option mouseover': function(el,ev){
                el.addClass('hover');
            },
            '.region-option mouseout': function(el,ev){
                el.removeClass('hover');
            },
            '.region-option click': function(el,ev){
                this.selectRegion(el.attr('region'));
                $('#region-options').css({height:32});
            },
            /**
             * Requests player data from the D3 library written here.
             */
            '#search-battletag-value keyup': function(el,ev) {
                if (ev.keyCode === ENTER_KEY) {

                    var value = can.trim(el.val());

                    // clear the input field
                    el.val('');

                    // specify the search parameters
                    var battleTag = value;
                    var region = this.getSelectedRegion();

                    // we will start up the loading bar, and will remove it when the loading has been completed
                    this.showLoading();

                    // perform the search against the D3 API for the corresponding battleTag
                    loadCompositePlayerProfile(D3API, region, battleTag, $.proxy(this.handleLoadedPlayer,this));
                }
            },
            /**
             * Handles the result of the composite player API call.
             * 
             * @method handleLoadedPlayer
             * @param player {Object} The player object.
             */ 
            handleLoadedPlayer: function(player) {
                var banner = this.options.D3PX.get('banner'),
                    navBar = this.options.D3PX.get('navBar');

                // regardless of result, we must remove the loading gif.
                this.hideLoading();

                // handle incorrect battletag
                if (player.error) {
                    if (navBar) {
                        navBar.selectPage('error',player);
                    }
                    return;
                }
                // register this battletag as the currently active one in the D3PX controller
                this.options.D3PX.set('battleTag',player.battleTag);

                // update the banner
                if (banner) {
                    banner.displayGreeting(player.battleTag);
                }
                if (navBar) {
                    navBar.selectPage('player',player);
                }
            },
            /**
             * Show loading gif.
             *
             * @method showLoading
             */
            showLoading: function(){
                $('#page-mask').css({display:'block',opacity:0}).stop().animate({opacity:0.7}, 400);
            },
            /**
             * Hide loading gif.
             *
             * @method hideLoading
             */
            hideLoading: function(){
                $('#page-mask').css({display:'block',opacity:0.7}).stop().animate({opacity:0}, 400, function(){
                    $(this).css({display:'none'});
                });
            },
            /**
             * Gets the currently selected region.
             *
             * @method getSelectedRegion
             * @return {String} The region identifier that is currently selected.
             */
            getSelectedRegion: function(){
                return $('#selected-region-option').attr('region');
            },
            /**
             * Selects a region from the dropdown and manages the dropdown items appropriately.
             *
             * @method selectRegion
             * @param region {String} The region identifier.
             */
            selectRegion: function(region) {
                var sr = $('#selected-region-option');
                sr.attr('region',region);
                $('span',sr).text(region);

                // eliminate this option from the dropdown
                $('.region-option').show();
                $('.region-option[region="'+region+'"]').hide();
            }
        }
    );
});
