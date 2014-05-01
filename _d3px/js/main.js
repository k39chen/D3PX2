/*
steal("steal/less").then(
    "../less/home.less"
);
*/
steal("can", "can/construct", "can/model", "can/util/fixture",
    function(can,Construct,Model,fixture){

        /** CREATE THE PLAYER CONSTRUCT **/
        var Player = Construct({
            init: function(battletag,numHeroes,editable){
                this.battletag = battletag;
                this.numHeroes = numHeroes;
                this.editable = editable;
            },
            getBattletag: function(){return this.battletag;},
            getNumHeroes: function(){return this.numHeroes;},
            isEditable: function(){return this.editable;}
        });
        var PrivatePlayer = Player({
            isEditable: function(){return false;}
        });

        // create an instance of the construct
        var player = new Player("gummypower#1650",3,true);

        /** CREATE A PLAYER MODEL**/
        Hero = can.Model({
            findAll: "GET /hero",
            findOne: "GET /hero/{id}",
            create : "POST /hero",
            update : "PUT /hero/{id}",
            destroy: "DELETE /hero/{id}"
        },
        {});


        var heroes = [
            {name: "Juno1", "class": "Monk"},
            {name: "Juno2", "class": "Monk"},
            {name: "Juno3", "class": "Monk"},
            {name: "Juno4", "class": "Monk"},
            {name: "Juno5", "class": "Monk"},
        ];

        can.fixture(



            "GET /hero", function(request,response){
            return 
        });


        Hero.findAll({});



    }
);
