var AsyncChain = (function () {
    function AsyncChain(callback) {        
        return function (options) {
            var firstLink = function (context, asyncChain) {
                callback(options, function () {
                    if (asyncChain !== undefined) {
                        asyncChain(arguments, context);
                    }
                }, context);
            };
        
            return addControls(firstLink);
        };
    }
    
    function extendChain(link, previousLinks, options) {        
        return function (context, asyncChain) {
            previousLinks(context, function (previousResult, context) {
                if (link.asyncChain !== undefined) {
                    var remainingChain = function (result, options, context) {
                        if (asyncChain !== undefined) {
                            asyncChain(result, context);
                        }
                    };
                    link.then(remainingChain).run(context);
                    return { break: true };
                }
                                
                var result = link(previousResult, options, context);
                
                if (result !== undefined && result.break !== undefined) {
                    return result.break;
                }
                
                if (asyncChain !== undefined) {
                    asyncChain(result, context);
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