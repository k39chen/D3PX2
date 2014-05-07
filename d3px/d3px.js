steal(
	'can',
	'./views/nav/nav.ejs',
    './controls/searchbar/searchbar.js',
    './views/nav/nav.less',
	'./d3px.less',
    './models/fixtures/fixtures.js',
function(can, navView, Searchbar){

    var searchbar = new Searchbar('#searchbar');
    $('body').html(navView({battletag: 'Parallax#1878', catchphrase: 'Stay a while and listen'}));
});
