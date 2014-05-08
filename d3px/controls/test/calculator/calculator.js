steal(
    'can', 
    '/d3px/models/d3api.js',
    './init.ejs',
    './calculator.less',
    '/d3px/lib/d3lib.js',
function(can, D3API, initView) {
	return can.Control(
        {
            defaults: {}
        },
        {
            init: function(){
                this.element.html(initView());

                var battleTag = 'gummypower-1650';

                loadCompositePlayerProfile(D3API,battleTag,function(data){
                    console.log(data);
                });


            },
        }
    );
});