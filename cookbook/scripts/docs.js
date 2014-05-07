//js cookbook/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs", function(DocumentJS){
	DocumentJS('cookbook/index.html', {
		out: 'cookbook/docs',
		markdown : ['cookbook', 'steal', 'jquerypp', 'can', 'funcunit'],
		parent : 'cookbook'
	});
});