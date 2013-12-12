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
        setupComponent($.extend(true, {}, mock));
        this.component.trigger('optionsChange', $.extend(true, {}, mock));
    });

    describe('Toolbox Condition', function(){
        var toolBox;
        beforeEach(function(){
            toolBox = this.component.$conditionsToolbox;
        });

        it('Draw Toolbox', function(){
            expect(toolBox).toBeDefined();
            var cards = toolBox.find('.m2m-card-condition');
            // VR crea una CardCondition
            expect(cards.length).toEqual(mock.cards.conditions.cards.length+1);
        });

        it('Toggle', function(){
            var spyCollapse = jasmine.createSpy('collapse');
            var spyExpand = jasmine.createSpy('expand');
            var btn = $('.conditions-button');

            toolBox.on('collapse',spyCollapse);
            toolBox.on('expand',spyExpand);

            btn.click();

            expect(spyCollapse).toHaveBeenCalled();
            expect(spyExpand).not.toHaveBeenCalled();
        });
    });

    describe('Toolbox Action', function(){
        var toolBox;
        beforeEach(function(){
            toolBox = this.component.$actionsToolbox;
        });

        it('Draw Toolbox', function(){
            expect(toolBox).toBeDefined();
            var cards = toolBox.find('.m2m-card-action');
            expect(cards.length).toEqual(mock.cards.actions.cards.length);
        });

        it('Toggle', function(){
            var spyCollapse = jasmine.createSpy('collapse');
            var spyExpand = jasmine.createSpy('expand');
            var btn = $('.actions-button');

            toolBox.on('collapse',spyCollapse);
            toolBox.on('expand',spyExpand);

            btn.click();

            expect(spyCollapse).toHaveBeenCalled();
            expect(spyExpand).not.toHaveBeenCalled();
        });
    });

});
