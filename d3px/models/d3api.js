steal('can', function (can) {
    return can.Model({

        findBattletag: function(params) {
            var self = this;
            var url = 'http://us.battle.net/api/d3/profile/'+params.battletag+'/';

            return $.ajax({
                type: 'GET', 
                dataType: 'jsonp', 
                url: url,
            }).then(function(data){
                return self.model(data);
            });
        },


        findAll : "GET /recipes",
        findOne : "GET /recipes/{id}",
        create : "POST /recipes",
        update : "PUT /recipes/{id}",
        destroy : "DELETE /recipes/{id}"
    }, {});
});