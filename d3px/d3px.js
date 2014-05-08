steal(
	'can',
	'./views/nav/nav.ejs',
    './controls/nav-search/init.ejs',
    './views/toolbar/toolbar.ejs',
    './controls/profile-heroes/profile-heroes.js',
    './controls/profile-career/profile-career.js',
    './d3px.less',
    './views/nav/nav.less',
    './controls/nav-search/init.less',
    './views/toolbar/toolbar.less',
    './controls/profile-career/init.less',
function(can, navView, navSearch, toolbar, profileHeroes, profileCareer){
	
	//$('#canvas').append(profileCareer());
    $('body').append(navView({battletag: 'Parallax#1878', catchphrase: 'Stay a while and listen'}));
    $('#navbar #search-module').html(navSearch());
    $('body').append(toolbar());
    
    var profileHeroes = new profileHeroes();
    var profileCareer = new profileCareer();
});
