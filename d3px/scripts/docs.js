//js d3px/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs", function(DocumentJS){
	DocumentJS('d3px/index.html', {
		out: 'd3px/docs',
		markdown : ['d3px', 'steal', 'jquerypp', 'can', 'funcunit'],
		parent : 'd3px'
	});
});