steal(
	'can',
	'./views/nav/nav.ejs',
    './controls/nav-search/nav-search.js',
    './views/toolbar/toolbar.ejs',
    './d3px.less',
    './views/nav/nav.less',
    './controls/nav-search/init.less',
    './views/toolbar/toolbar.less',
function(can, navView, navSearch, toolbar){
	
	//$('#canvas').append(profileCareer());
    $('body').append(navView({battletag: 'Parallax#1878'}));
    $('body').append(toolbar());
    new navSearch('#navbar');
});
