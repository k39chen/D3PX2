steal(
    './controls/searchbar/searchbar.js',
    './controls/d3api/d3api.js',
	'./less/d3px.less',
    './models/fixtures/fixtures.js',
function(Searchbar, D3API){
	
    var searchbar = new Searchbar('#searchbar');
    var d3api = new D3API('#d3api');

})