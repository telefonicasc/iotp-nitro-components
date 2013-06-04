describeComponent('components/card/rule_editor.js', function () {
    var mock = {
        cards: {
            conditions: {
                label: 'Conditions',
                cards: [
                    {
                        id: '1b4c0bd1-c868-40ee-96c7-015573da030a',
                        type: 'SensorCard',
                        model: 'SemaphoresModel',
                        sensorData: {
                            measureName: 'pitch',
                            phenomenonApp: 'urn:x-ogc:def:phenomenon:IDAS:1.0:angle',
                            phenomenon: 'urn:x-ogc:def:phenomenon:IDAS:1.0:angle',
                            dataType: 'Quantity',
                            uom: 'deg'
                        },
                        configData: {}
                    }
                ]
            },
            actions: {
                label: 'Actions',
                cards: [
                    {
                        type: 'ActionCard',
                        actionData: {
                            userParams: [
                                {
                                    name: 'mail.from',
                                    value: 'dca_support@tid.es'
                                },
                                {
                                    name: 'mail.to',
                                    value: ''
                                },
                                {
                                    name: 'mail.subject',
                                    value: ''
                                },
                                {
                                    name: 'mail.message',
                                    value: ''
                                }
                            ],
                            name: 'email',
                            type: 'SendEmailAction'
                        },
                        id: 'email'
                    }
                ]
            }
        }
    };

    // initialize the component and attach it to the DOM
    beforeEach(function(){
        setupComponent();
        this.component.trigger('optionsChange', $.extend(true, {}, mock));
    });

    describe('Toolbar', function(){

        it('Draw elements section', function(){
            var sections = this.component.$node.find('.card-toolbox-section');
            expect(sections.length).toEqual(2);
        });

        it('Draw actions', function(){
            var sections = this.component.$node.find('.card-toolbox-section');
            var cards = sections.find('.m2m-card-action');

            expect(cards.length).toEqual(mock.cards.actions.cards.length);
        });
        it('Toggle actions', function(){
            var btn = $('.conditions-button');
            var cards;
            btn.trigger('click');
            cards = this.component.$node.find('.card-toolbox-section:visible .m2m-card-action');
            expect(cards.length).toEqual(mock.cards.actions.cards.length);
            btn.click();
            expect(cards.length).toEqual(0);
        });

        it('Draw conditions', function(){
            var sections = this.component.$node.find('.card-toolbox-section');
            var cards = sections.find('.m2m-card-condition');

            expect(cards.length).toEqual(mock.cards.conditions.cards.length);
        });

        it('Toggle conditions', function(){
            var btn = $('.actions-button');
            var cards;
            btn.click();
            cards = this.component.$node.find('.card-toolbox-section:visible .m2m-card-condition');
            expect(cards.length).toEqual(mock.cards.actions.cards.length);
            btn.click();
            expect(cards.length).toEqual(0);
        });
    });

});