describeComponent('components/card/front/values.js', function () {
    var data = {
        value:[
            {name:'opt1', label: 'option', value:0},
            {name:'opt2', label: 'option', value:0},
            {name:'opt3', label: 'option', value:0}
        ]
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