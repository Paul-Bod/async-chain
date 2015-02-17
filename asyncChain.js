var AsyncChain = (function () {
    function AsyncChain(callback) {        
        var asynChain = function () {
            var callbackArgs = argumentsToArray(arguments);
            var firstLink = function (context, nextLink) {
                callbackArgs.push(function () {
                    if (nextLink !== undefined) {
                        var args = argumentsToArray(arguments);
                        args.splice(args.length, 0, context);
                        nextLink.apply(null, args);
                    }
                });
                callbackArgs.push(context);
                callback.apply(null, callbackArgs);
            };
        
            return addControls(firstLink);
        };
        asynChain.prototype.asyncChain = true;
        return asynChain
    }
    
    function argumentsToArray(args) {
        var argsArr = [];
        for(var i=0; i<args.length; i++) {
            argsArr.push(args[i])
        }
        return argsArr;
    }
    
    function linkProvided(link) {
        return link !== undefined
    }
    
    function linkStartsNewChain(link) {
        return linkProvided(link) && link.prototype.asyncChain !== undefined;
    }
    
    function resultBreaksChain(result) {
        return result !== undefined && result.hasOwnProperty('break');
    }
    
    function chainContinues(nextLink) {
        return nextLink !== undefined;
    }
    
    function runNewChain(previousResult, link, nextLink, context) {
        var finishPreviousChain = function (result, context) {
            if (nextLink !== undefined) {
                nextLink.apply(null, arguments);
            }
        };
        link(previousResult).then(finishPreviousChain).run(context);
    }
    
    function extendChain(link, previousLinks) {        
        return function (context, nextLink) {
            previousLinks(context, function () {
                var previousResult = arguments[0];
                var context = arguments[arguments.length-1];
                
                if (linkStartsNewChain(link)) {
                    runNewChain(previousResult, link, nextLink, context);
                }
                else {
                    var result = [];
                    if (linkProvided(link)) {                        
                        result = link.apply(null, arguments);
                        
                        if (resultBreaksChain(result)) {
                            return result.break;
                        }
                    }
                    
                    if (chainContinues(nextLink)) {
                        var args = [];
                        if (result !== undefined) {
                            args.push(result);
                        }
                        args.push(context);
                        nextLink.apply(null, args);
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
            then: function (callback) {
                var newChain = extendChain(callback, previousLinks);
                return addControls(newChain);
            }
        };
    }
    
    return AsyncChain;
})();