steal(
	'can',
	'../../models/d3api.js',
	'./init.ejs',
	'./init.less', function(can, D3API, careerView) {
		
		return can.Control({
			defaults: {
				data: null
			}
		},
		{
			init: function(element, options) {
				// Loads player data
				$('#mask').fadeOut(500);
				$('#career-pane').html(careerView(this.options.data));
			},
		});
		
	});