steal(
	'can',
    'd3px/controls/banner/banner.js',
    'd3px/controls/navbar/navbar.js',
    'd3px/d3px.less',
function(can,Banner,NavBar){

    // initialize the core components
    var navBar = new NavBar('#navbar');
    var banner = new Banner('#banner', {navBar:navBar});

    // let the navbar control the banner
    navBar.options.banner = banner;

});
