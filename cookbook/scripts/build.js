//js cookbook/scripts/build.js

load("steal/rhino/rhino.js");
steal('steal/build',function(){
	steal.build('cookbook/scripts/build.html',{to: 'cookbook'});
});
