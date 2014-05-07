steal(
	'can',
    './models/d3api.js',
	'./views/nav/nav.ejs',
    './controls/nav-search/init.ejs',
    './views/toolbar/toolbar.ejs',
    './controls/profile-heroes/init.ejs',
    './controls/profile-career/init.ejs',
    './d3px.less',
    './views/nav/nav.less',
    './controls/nav-search/init.less',
    './views/toolbar/toolbar.less',
    './controls/profile-heroes/init.less',
    './controls/profile-career/init.less',
    './models/fixtures/fixtures.js',
function(can, D3API, navView, navSearch, toolbar, profileHeroes, profileCareer){

    var battleTag = 'gummypower-1650';


    D3API.getPlayerProfile({battleTag:battleTag}).done(function(data){
        
        // here is the data:
        console.log(data);

        // it is returned as a CanJS model, so if you want to iterate over the attributes then use: [___]._data
        // ...

    });

	$('#canvas').append(profileHeroes());
	$('#canvas').append(profileCareer());
    $('body').append(navView({battletag: 'Parallax#1878', catchphrase: 'Stay a while and listen'}));
    $('#navbar #search-module').html(navSearch());
    $('body').append(toolbar());
});
