steal("can","../../models/d3api.js","./init.ejs","./init.less",function(e,t,n){return e.Control({defaults:{}},{init:function(){var e="GummyPower-1650";t.getPlayerProfile({battleTag:e,id:31034077}).done(function(e){console.log(e);$("#canvas").append(n(e))})}})});