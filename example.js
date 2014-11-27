function render(message) {
    document.getElementById('example').innerHTML = message;
}

function handleGetPetResponse (err, res, personName, next) {
    var response = JSON.parse(res);
    
    if (err) {
        return next('error retrieving pet');
    }
    
    if (response.status === 200) {
        var pet = JSON.parse(res).body;
        render('My name is ' + personName + '. My pet\'s name is ' + pet.name);
    }
    else {
        render('My name is ' + personName);
    }
}

function getPet(id, personName, next) {
    client.getPet(id, function (err, res) {
        handleGetPetResponse(err, res, personName, next)
    });
}

function handleGetPersonResponse(err, res, next) {
    var response = JSON.parse(res);
    
    if (err || response.status !== 200) {
        return next('error retrieving person');
    }
    
    var person = response.body;
    getPet(person.pets, person.name, next);
}

function person(id, next) {
    client.getPerson(id, function (err, res) {
        handleGetPersonResponse(err, res, next)
    });
}

function errorHandler(message) {
    render(message);
}

person(5, errorHandler);