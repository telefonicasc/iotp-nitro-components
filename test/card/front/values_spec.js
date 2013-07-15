describeComponent('components/card/front/values.js', function () {
    var data = {
        value:{
            'opt1':1,
            'opt2':'A',
            'opt3': [1,3,5]
        }
    };

    // initialize the component and attach it to the DOM
    beforeEach(function(){
        setupComponent(data);
    });
    describe('Install', function(){
        it('dt installed', function(){
            var elements = $('dt', this.$node);
            expect(elements.length).toEqual(3);
        });
        it('dd installed', function(){
            var elements = $('dd', this.$node);
            expect(elements.length).toEqual(3);
        });
    });
});