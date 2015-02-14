function render(message) {
    document.getElementById('example').innerHTML = message;
}

function handleGetPetResponse (err, result, context) {
    
    console.log("handleGetPetResponse", err, result, context);
    
    
    var response = JSON.parse(result);
    
    if (err) {
        return {break: context.next('error retrieving pet')};
    }
    
    if (response.status === 200) {
        var pet = response.body;
        return 'My name is ' + context.personName + '. My pet\'s name is ' + pet.name;
    }
    else {
        return 'My name is ' + context.personName;
    }  
}

var getPet = AsyncChain(function (pets, callback) {
    console.log('getPet', arguments);
    
    client.getPet(pets, callback);
});

function handleGetPersonResponse(err, result, context) {
    
    console.log(err, result, context);
    
    var response = JSON.parse(result);
    
    if (err || response.status !== 200) {
        return {break: context.next('error retrieving person')};
    }
    
    var person = response.body;
    
    context.personName = person.name;
    return person.pets;
}

var getPerson = AsyncChain(function (id, blah, callback) {
    
    console.log('blah', blah);
    client.getPerson(id, callback);
});

function errorHandler(message) {
    render(message);
}

getPerson(5, 6)
    .then(handleGetPersonResponse)
    .then(getPet)
    .then(handleGetPetResponse)
    .then(render)
    .run({next: errorHandler});