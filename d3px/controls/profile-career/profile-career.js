steal(
	'can',
	'../../models/d3api.js',
	'./init.ejs',
	'./init.less', function(can, D3API, careerView) {
		
		return can.Control({
			defaults: {}
		},
		{
			init: function() {
				// Get list of heroes from D3API
				var battleTag = 'GummyPower-1650';


				// Loads player data
				loadCompositePlayerProfile(D3API, battleTag, function(data) {
				
					$('#mask').fadeOut(500);
					$('#career-pane').html(careerView(data));
				
				});
			}
		});
		
	});