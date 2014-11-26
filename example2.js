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
    var response = result[1],
        person = JSON.parse(response).body;
    
    context.personName = person.name;
    context.pets = person.pets;
}

var getPerson = AsyncChain(function (options, asyncChain, context) {
    client.getPerson(options.id, asyncChain);
});

var pets = getPet().then(handleGetPetResponse);

getPerson({id: 5})
    .then(handleGetPersonResponse)
    .then(pets)
    .then(render)
    .run();