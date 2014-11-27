var AsyncChain = (function () {
    function AsyncChain(callback) {        
        return function (options) {
            var firstLink = function (context, nextLink) {
                callback(options, function () {
                    if (nextLink !== undefined) {
                        nextLink(arguments, context);
                    }
                }, context);
            };
        
            return addControls(firstLink);
        };
    }
    
    function linkProvided(link) {
        return link !== undefined
    }
    
    function linkStartsNewChain(link) {
        return linkProvided(link) && link.asyncChain !== undefined;
    }
    
    function resultBreaksChain(result) {
        return result !== undefined && result.break !== undefined;
    }
    
    function chainContinues(nextLink) {
        return nextLink !== undefined;
    }
    
    function runNewChain(link, nextLink, context) {
        var finishPreviousChain = function (result, options, context) {
            if (nextLink !== undefined) {
                nextLink(result, context);
            }
        };
        link.then(finishPreviousChain).run(context);
    }
    
    function extendChain(link, previousLinks, options) {        
        return function (context, nextLink) {
            previousLinks(context, function (previousResult, context) {
                if (linkStartsNewChain(link)) {
                    runNewChain(link, nextLink, context);
                }
                else {           
                    var result = [];
                    if (linkProvided(link)) {     
                        result = link(previousResult, options, context);
                        
                        if (resultBreaksChain(result)) {
                            return result.break;
                        }
                    }
                    
                    if (chainContinues(nextLink)) {
                        nextLink(result, context);
                    }
                }
            });
        };
    }
    
    function addControls(previousLinks) {
        return {
            run: function (context) {
                if (context === undefined) {
                    context = {};
                }
                
                previousLinks(context);
            },
            then: function (callback, options) {
                var newChain = extendChain(callback, previousLinks, options);
                return addControls(newChain);
            },
            asyncChain: true
        };
    }
    
    return AsyncChain;
})();