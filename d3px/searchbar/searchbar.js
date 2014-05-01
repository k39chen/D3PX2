steal('can', './init.ejs', 'd3px/searchbar/searchbar.less', function(can, initView) {
	return can.Control({
        init: function(){
            this.element.html(initView());
        }
    });
});