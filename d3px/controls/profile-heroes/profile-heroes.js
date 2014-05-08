steal(
	'can',
	'../../models/d3api.js',
	'./init.ejs',
	'./init.less', function(can, D3API, heroesView) {
		
		return can.Control({
			defaults: {}
		},
		{
			init: function() {
				// Get list of heroes from D3API
				var battleTag = 'GummyPower-1650';

			    D3API.getPlayerProfile({battleTag:battleTag}).done(function(data){
			        // here is the data:
			        console.log(data);
			        // Insert into HTML
					$('#canvas').append(heroesView(data));
			    });
			}
		});
		
	});