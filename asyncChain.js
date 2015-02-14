var AsyncChain = (function () {
    function AsyncChain(callback) {        
        var asynChain = function () {
            var callbackArgs = [];
            for(var i=0; i<arguments.length; i++) {
                callbackArgs.push(arguments[i])
            }            
            var firstLink = function (context, nextLink) {
                callbackArgs.push(function () {
                    if (nextLink !== undefined) {
                        var args = [];
                        for(var i=0; i<arguments.length; i++) {
                            args.push(arguments[i])
                        }
                        args.splice(args.length, 0, context);
                    
                        console.log('firstlink', args);
                        nextLink.apply(null, args);
                    }
                });
                callbackArgs.push(context);
                console.log('callbackArgs', callbackArgs);
                callback.apply(null, callbackArgs);
            };
        
            return addControls(firstLink);
        };
        asynChain.prototype.asyncChain = true;
        return asynChain
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
        console.log('new chain');
        var finishPreviousChain = function (result, context) {
            console.log(result);
            
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
                console.log('currentLink', arguments);
                
                if (linkStartsNewChain(link)) {
                    runNewChain(previousResult, link, nextLink, context);
                }
                else {
                    var result = [];
                    if (linkProvided(link)) {
                        
                        // options.splice(0,0,previousResult);
                        // options.splice(options.length,0,context);
                        // console.log(options);
                        
                        result = link.apply(null, arguments);
                        
                        if (resultBreaksChain(result)) {
                            return result.break;
                        }
                    }
                    
                    if (chainContinues(nextLink)) {
                        var args = [result, context];
                        console.log('nextLinks', args);
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
                // var callback = arguments[0];
                // var options = [];
                // for(var i=1; i<arguments.length; i++) {
                //     options.push(arguments[i])
                // }
                
                var newChain = extendChain(callback, previousLinks);
                return addControls(newChain);
            },
            asyncChain: true
        };
    }
    
    return AsyncChain;
})();