steal(
	'can',
	'../../models/d3api.js',
	'./init.ejs',
	'/d3px/lib/d3lib.js',
	'./init.less', function(can, D3API, heroesView) {
		
		return can.Control({
			defaults: {
				battletag: null
			}
		},
		{
			init: function(element, options) {
				// Get list of heroes from D3API
				
			    D3API.getPlayerProfile({battleTag:this.options.battletag}).done(function(data){
			        // Insert into HTML
					$('#hero-pane').html(heroesView(data));
			    });
			}
		});
		
	});