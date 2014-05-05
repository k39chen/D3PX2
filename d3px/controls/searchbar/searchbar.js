steal('can', './init.ejs', './searchbar.less', function(can, initView) {
	return can.Control({
        init: function(){
            this.element.html(initView());
        }
    });
});