steal(
    'can', 
    '/d3px/models/d3api.js', 
    './init.ejs',
    '/d3px/views/test/itemProfile.ejs',
    './itemselect.less', 
function(can, D3API, itemselectView, itemView) {
	return can.Control(
        {
            defaults: {
                data: null
            },
        },
        {
            init: function(){
                this.element.html(itemselectView(this.options.data));
            },
            'a click': function(el){
                var itemdata = el.attr('data-item');

                console.log('FETCHED ITEM DATA: ',data);
                console.log(itemdata);

                D3API.getItemData({itemdata:itemdata}).done(function(data){
                    console.log('FETCHED ITEM DATA: ',data);
                   $('#itemProfile').html(itemView(data));
                });
            }
        }
    );
});
