function render(result, options, context) {
    document.getElementById('example').innerHTML = result;
}

function handleGetPetResponse (result, options, context) {
    var response = JSON.parse(result[1]);
    
    if (response.status === 200) {
        var pet = response.body;
        return 'My name is ' + context.personName + '. My pet\'s name is ' + pet.name;
    }
    else {
        return 'My name is ' + context.personName;
    }  
}

var getPet = AsyncChain(function (options, asyncChain, context) {
    client.getPet(context.pets, asyncChain);
});

function handleGetPersonResponse(result, options, context) {
    var response = JSON.parse(result[1]),
        err = result[0];
    
    if (err || response.status !== 200) {
        return {break: context.next('error retrieving person')};
    }
    
    var person = response.body;
    
    context.personName = person.name;
    context.pets = person.pets;
}

var getPerson = AsyncChain(function (options, asyncChain, context) {
    client.getPerson(options.id, asyncChain);
});

function error(message) {
    render(message);
}

getPerson({id: 5})
    .then(handleGetPersonResponse)
    .then(getPet())
    .then(handleGetPetResponse)
    .then(render)
    .run({next: error});