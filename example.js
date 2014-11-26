function render(message) {
    document.getElementById('example').innerHTML = message;
}

function handleGetPetResponse (err, res, personName) {
    var response = JSON.parse(res);
    
    if (response.status === 200) {
        var pet = JSON.parse(res).body;
        render('My name is ' + personName + '. My pet\'s name is ' + pet.name);
    }
    else {
        render('My name is ' + personName);
    }
}

function getPet(id) {
    client.getPet(id, function (err, res) {
        handleGetPetResponse(err, res, person.name)
    });
}

function handleGetPersonResponse(err, res) {
    var person = JSON.parse(res).body;
    getPet(person.pets);
}

function person(id) {
    client.getPerson(id, handleGetPersonResponse);
}

person(5);