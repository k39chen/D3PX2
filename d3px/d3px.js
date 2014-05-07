steal(
	'can',
	'./views/nav/nav.ejs',
    './views/nav/nav.less',
	'./d3px.less',
    './models/fixtures/fixtures.js',
function(can, navView){
    $('body').html(navView({battletag: 'Parallax#1878', catchphrase: 'Stay a while and listen'}));
});
