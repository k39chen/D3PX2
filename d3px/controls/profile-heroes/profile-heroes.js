steal(
	'can',
	'../../models/d3api.js',
	'./init.ejs',
	'/d3px/lib/d3lib.js',
	'./init.less', function(can, D3API, heroesView) {
		
		return can.Control({
			defaults: {
				data: null
			}
		},
		{
			init: function(element, options) {
				$('#hero-pane').html(heroesView(this.options.data));
			}
		});
		
	});