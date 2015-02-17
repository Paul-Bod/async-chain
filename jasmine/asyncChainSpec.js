describe('AsyncChain', function () {
    var ranSuccessfully = false;
    
    beforeEach(function (done) {
        ranSuccessfully = false;
        done();
    });
    
    it('can be run', function () {
        var async = AsyncChain(function () {
            ranSuccessfully = true;
        });
        async().run();
        expect(ranSuccessfully).toEqual(true);
    });
    
    it('can be run with arguments', function () {
        var async = AsyncChain(function (one, two, three) {
            expect(one).toEqual(1);
            expect(two).toEqual(2);
            expect(three).toEqual(3);
        });
        async(1, 2, 3).run();
    });
    
    it('receives a callback when no chain is defined', function() {
        var async = AsyncChain(function (callback) {
            expect(callback).not.toBeUndefined();
            expect(typeof callback).toEqual('function');
        });
        async().run();
    });
});

describe('AsyncChain with chain', function () {
    var ranSuccessfullyOne = false;
    var ranSuccessfullyTwo = false;
    var ranSuccessfullyThree = false;
    
    beforeEach(function (done) {
        ranSuccessfullyOne = false;
        ranSuccessfullyTwo = false;
        ranSuccessfullyThree = false;
        done();
    });
    
    it('provides the chain as the callback', function (done) {
        var async = AsyncChain(function (callback) {
            setTimeout(function () {callback()}, 1);
        });
        var link = function () {ranSuccessfullyOne = true};
        async().then(link).run();
        
        setTimeout(function () {expect(ranSuccessfullyOne).toEqual(true); done()}, 5);
    });
    
    it('supports multiple links in the chain', function (done) {
        var async = AsyncChain(function (callback) {
            setTimeout(function () {callback()}, 1);
        });
        var linkOne = function () {ranSuccessfullyOne = true};
        var linkTwo = function () {ranSuccessfullyTwo = true};
        var linkThree = function () {ranSuccessfullyThree = true};
        async().then(linkOne).then(linkTwo).then(linkThree).run();
        
        setTimeout(function () {
            expect(ranSuccessfullyOne).toEqual(true);
            expect(ranSuccessfullyTwo).toEqual(true);
            expect(ranSuccessfullyThree).toEqual(true);
            done()
        }, 5);
    });
    
    it('allows arguments to be passed to links', function (done) {
        var async = AsyncChain(function (callback) {
            setTimeout(function () {callback(1, 2, 3)}, 1);
        });
        var link = function (one, two, three) {
            expect(one).toEqual(1);
            expect(two).toEqual(2);
            expect(three).toEqual(3);
            done();
        };
        async().then(link).run();
    })
    
    it('return of one link is passed to the next', function (done) {
        var async = AsyncChain(function (callback) {
            setTimeout(function () {callback(1)}, 1);
        });
        
        var linkOne = function (one) {
            expect(one).toEqual(1);
            return 2;
        };
        
        var linkTwo = function (two) {
            expect(two).toEqual(2);
            return 3;
        };
        
        var linkThree = function (three) {
            expect(three).toEqual(3);
            done();
        };
        async().then(linkOne).then(linkTwo).then(linkThree).run();
    });
});

describe('AsyncChain with context', function () {
    it('receives a default empty context object when none is defined', function () {
        var async = AsyncChain(function (callback, context) {
            expect(context).toEqual({});
        });
        async().run();
    });
    
    it('receives a context object when one is defined', function () {
        var async = AsyncChain(function (callback, context) {
            expect(context).toEqual({context: true});
        });
        async().run({context: true});
    });
    
    it('passes context object to links', function (done) {
        var async = AsyncChain(function (callback, context) {
            setTimeout(function () {callback()}, 1);
        });
        
        var link = function (context) {
            expect(context).toEqual({context: true});
            done();
        };
        async().then(link).run({context: true});
    });
    
    it('maintains changes to context throughout chain', function (done) {
        var async = AsyncChain(function (callback, context) {
            setTimeout(function () {callback()}, 1);
        });
        
        var linkOne = function (context) {
            context.new = true;
        };
        
        var linkTwo = function (context) {
            expect(context).toEqual({context: true, new: true});
            done();
        };
        async().then(linkOne).then(linkTwo).run({context: true});
    });
})