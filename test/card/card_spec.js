describeComponent('components/card/card.js', function () {
    describe('Install component', function(){
        var MOCK_CARD = {header:'Test'};
        beforeEach(function(){
            setupComponent(MOCK_CARD);
        });

        it('install', function(){
            expect(this.$node).toBeDefined();
        });
    });

    describe('Define value', function(){
        var MOCK_CARD = {
            header:'Test',
            front: {
                items: [{
                    component: 'CardFrontText'
                }]
            },
            back : {
                items: [{
                    component: 'CardBackText',
                    label: 'value'
                }]
            },
            defaultValue:'0',
            value: '96589'
        };

        beforeEach(function(){
            setupComponent(MOCK_CARD);
        });

        it('in front', function(){
            var $nodeValue = $('.m2m-card-text-value', this.$node);
            expect($nodeValue).toHaveText(MOCK_CARD.value);
        });
        it('in back', function(){
            var $nodeValue = $('.m2m-card-text input', this.$node);
            expect($nodeValue).toHaveValue(MOCK_CARD.value);
        });
    });

    describe('Define defaultValue', function(){
        var MOCK_CARD = {
            header:'Test',
            front: {
                items: [{
                    component: 'CardFrontText'
                }]
            },
            back : {
                items: [{
                    component: 'CardBackText',
                    label: 'value'
                }]
            },
            defaultValue:'0'
        };

        beforeEach(function(){
            setupComponent(MOCK_CARD);
        });

        it('in front', function(){
            var $nodeValue = $('.m2m-card-text-value', this.$node);
            expect($nodeValue).toHaveText(MOCK_CARD.defaultValue);
        });
        it('in back', function(){
            var $nodeValue = $('.m2m-card-text input', this.$node);
            expect($nodeValue).toHaveValue(MOCK_CARD.defaultValue);
        });
    });
});