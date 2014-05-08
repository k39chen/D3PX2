steal(
    'can', 
    '/d3px/models/d3api.js',
    './init.ejs',
    './calculator.less',
    '/d3px/lib/d3lib.js',
    '/d3px/lib/utils.js',
function(can, D3API, initView) {
	return can.Control(
        {
            defaults: {}
        },
        {
            init: function(){
                this.element.html(initView());

                var battleTag = 'gummypower-1650';
                var heroIndex = 0;

                loadCompositePlayerProfile(D3API,battleTag,function(data){


                    console.log( data.heroes[heroIndex].items._data );


                });


            },
        }
    );
});
