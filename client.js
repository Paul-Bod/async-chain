var client = {
    getPerson: function (id, callback) {
        var err = null;
        var res = JSON.stringify({
            body: {
                name: 'Bob',
                pets: 123
            },
            status: 200
        });
        
        return setTimeout(function() {callback(err, res)}, 1000);
    },
    getPet: function (id, callback) {
        var err = null;
        var res = JSON.stringify({
            body: {
                name: 'Verity'
            },
            status: 200
        });
        
        return setTimeout(function() {callback(err, res)}, 500);
    }
};