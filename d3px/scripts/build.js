//js d3px/scripts/build.js

load("steal/rhino/rhino.js");
steal('steal/build',function(){
	steal.build('d3px/scripts/build.html',{to: 'd3px'});
});
