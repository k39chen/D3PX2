steal(
    'can',
    'd3px/controls/banner/banner.js',
    'd3px/controls/navbar/navbar.js',
    'd3px/controls/searchbar/searchbar.js',
    'd3px/d3px.less',
function(can, Banner, NavBar, SearchBar) {
    /**
     * The controller for the entire D3PX application.
     * 
     * @constructor d3px/controls/d3px
     * @alias D3PX
     * @parent d3px
     * @inherits can.Control
     */
    return can.Control(
        {
            defaults: {
                prevBattleTag: -1,
                battleTag: null,
                navBar: null,
                banner: null,
                searchbar: null,
            }
        },
        {
            // initialize the core components
            init: function() {

                this.options.navBar = new NavBar('#navbar', {D3PX:this});
                this.options.banner = new Banner('#banner', {D3PX:this});
                this.options.searchBar = new SearchBar('#searchbar', {D3PX: this});
            },
            /**
             * A simple options getter method.
             */
            get: function(option) {
                return this.options[option];
            },
            /**
            * A simple options setter method.
            */
            set: function(option,value) {
                this.options[option] = value;
                return this.options[option];
            }
        }
    );
});