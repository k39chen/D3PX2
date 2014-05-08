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
				console.log("inside");
				var battleTag = 'GummyPower-1650';

			    D3API.getPlayerProfile({battleTag:battleTag, id: 31034077}).done(function(data){
			        // here is the data:
			        console.log(data);
			        // Insert into HTML
					$('#canvas').append(heroesView(data));
			    });
			}
		});
		
	});