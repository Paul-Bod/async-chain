function handleGetPersonResponse(err, res, callback) {
    var response = JSON.parse(res),
        person = response.body;
    
    if (err || response.status !== 200) {
        return callback('error in getting person');
    }
    
    callback(null, person.pets, person.name);
}

function getPerson(callback){
    client.getPerson(123, function (err, res) {handleGetPersonResponse(err, res, callback)});
}

function handleGetPetResponse(err, res, personName, callback) {
    var response = JSON.parse(res);
    
    if (err) {
        return callback('error in getting pet');
    }
    
    var message = '';
    if (response.status === 200) {
        var pet = JSON.parse(res).body;
        message = 'My name is ' + personName + '. My pet\'s name is ' + pet.name;
    }
    else {
        message = 'My name is ' + personName;
    }
    
    callback(null, message);
}

function getPet(petId, personName, callback){
    client.getPet(petId, function (err, res) {handleGetPetResponse(err, res, personName, callback)});       
}

function render(message, callback){
    document.getElementById('example').innerHTML = message;
}

function errorHandler(message) {
    render(message);   
}

async.waterfall([
    getPerson,
    getPet,
    render
], errorHandler);