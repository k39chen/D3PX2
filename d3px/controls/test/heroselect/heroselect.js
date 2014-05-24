steal(
    'can', 
    '/d3px/models/d3api.js', 
    '/d3px/controls/test/itemselect/itemselect.js',
    './heroselect.ejs',
    '/d3px/views/test/heroProfile.ejs',
    '/d3px/views/test/itemProfile.ejs',
    './heroselect.less', 
function(can, D3API, ItemSelect, heroselectView, heroView, itemView) {
	return can.Control(
        {
            defaults: {
                data: null
            },
        },
        {
            init: function(){
                this.element.html(heroselectView(this.options.data));
            },
            'a click': function(el){

                var id = el.attr('data-id'),
                    battleTag = el.attr('data-battleTag');

                D3API.getHeroProfile({battleTag:battleTag.replace(/#/g,'-'),id:id}).done(function(data){
                    console.log('FETCHED HERO DATA: ',data);
                   $('#heroProfile').html(heroView(data));
                    
                    // create the hero select controller
                    var itemSelect = new ItemSelect('#itemselect', {data:data});
                });
            }
        }
    );
});
