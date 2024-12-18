define(
    [
        'components/component_manager',
        'components/mixin/template',
        'components/flippable',
        'components/card/card_side',
        'components/mixin/data_binding',
        'components/card/card_data'
    ],
    function(ComponentManager, Template, Flippable, CardSide, DataBinding, CardData) {
        var ELEMENT_ID_PREFIX = 'card_';
        var id = 0;
        var _getNexId = function() {
            return ELEMENT_ID_PREFIX + (id++);
        };

        function Card() {

            this.defaultAttrs({
                flippable: true,
                tpl: '<div class="front"></div>' +
                         '<div class="back"></div>',
                nodes: {
                    front: '.front',
                    back: '.back'
                },
                front: {
                },
                back: {
                },
                cssClass: 'm2m-card-condition',
                conditionList: [],
                defaultCondition: {
                    'scope': 'OBSERVATION',
                    'parameterValue': null,
                    'parameterName': null,
                    'not': false,
                    'operator': null
                },
                delimiterList: false,
                defaultValue: '',
                locales: {
                    'sensor_name': 'Condition'
                }
            });

            this.after('initialize', function() {
                var elementId = this.attr.id || _getNexId(),
                    dragCheck = false, clickCheck = false;

                this.attr.updateOnValueChange = false;

                if (this.attr.rawCard) {
                    CardData.addLocales(resamplingLocales());
                    $.extend(this.attr, CardData.encode(this.attr.rawCard));
                }

                this.$node.on('click', _stopPropagation);
                this.$node.addClass('card');
                this.$node.addClass(this.attr.cssClass);
                this.$node.attr('id', elementId);

                if (this.attr.header) {
                    this.attr.front.header = this.attr.header;
                    this.attr.back.header = {
                        label: this.attr.locales.sensor_name, // jshint ignore:line
                        value: this.attr.header
                    };
                }
                CardSide.attachTo(this.$front, this.attr.front);
                CardSide.attachTo(this.$back, this.attr.back);

                if (this.attr.flippable) {
                    //Flippable.attachTo(this.node);
                    this.$node.addClass('flippable');

                    this.$front.on('mousedown', function() {
                        clickCheck = true;
                    });

                    this.$front.on('mouseup', $.proxy(function() {
                        var isEditable = this.$node.data('editable') !== false;
                        if (isEditable && !dragCheck && clickCheck) {
                            this.$node.addClass('flip');
                            this.$node.trigger('flipped');
                        }
                        clickCheck = false;
                    }, this));

                    this.on('drag', function() {
                        dragCheck = true;
                    });

                    this.on('dragstop', function() {
                        dragCheck = false;
                    });

                }else {
                    this.$back.hide();
                }

                this.on('valueChange', function(e, o) {
                    if ($.isFunction(this.attr.validator)) {
                        this.$node.data('isValid', this.attr.validator(o.value));
                    }
                    this.$node.data('cardValue', o.value);
                });

                var value = this.attr.value || this.attr.defaultValue || undefined;

                if (value) {
                    this.$node.find('.body > *').trigger('valueChange', { value: value, silent: true });
                    this.$node.data('cardValue', value);
                }

                if (_isSensorCard(this) && this.attr.model !== 'NoSensorSignal') {
                    var condition;
                    if (this.attr.conditionList.length) {
                        condition = this.attr.conditionList[0];
                    }else {
                        condition = $.extend({}, this.attr.defaultCondition);
                    }

                    this.on('conditionOperatorChange', function(e, o) {
                        condition.operator = o;
                        if (condition.parameterValue !== null) {
                            this.$node.data('conditionList', [condition]);
                        }
                    });

                    this.on('valueChange', function(e, o) {
                        condition.parameterValue = o.value;
                        this.$node.data('conditionList', [condition]);
                    });

                    this.on('phenomenonChange', $.proxy(function(e, o) {
                        if (o.phenomenon) {
                            var jsonPhen = JSON.parse(o.phenomenon);
                            this.attr.model = jsonPhen.model;
                            this.attr.sensorData = jsonPhen.sensorData;
                            this.attr.type = jsonPhen.type;

                            if (!this.attr.__cardConfig) {
                                this.attr.__cardConfig = {};
                            }

                            this.attr.__cardConfig.model = jsonPhen.model;
                            this.attr.__cardConfig.sensorData = jsonPhen.sensorData;
                            this.attr.__cardConfig.type = jsonPhen.type;

                            this.$node.data('cardConfig', this.attr.__cardConfig);
                            this.$node.find('.body > *').trigger('updatePhenomenon', {
                                phenomenon: jsonPhen.sensorData.measureName
                            });
                        }
                    }, this));

                    this.on('levelChange', $.proxy(function(e, o) {
                        this.$node.find('.body > *').trigger('updateLevel', o);
                    }, this));
                    if (condition.scope !== 'USER_PROP') {
                        if (condition.parameterValue !== null) {
                            this.$node.find('.body > *')
                                .trigger('valueChange', { value: condition.parameterValue, silent: true });
                        }else {
                            condition.parameterValue = this.attr.defaultValue;
                        }
                    }
                    this.$node.data('conditionList', [condition]);
                    this.$node.data('delimiterList', this.attr.delimiterList);
                    this.$node.data('delimiterCustomLabels', this.attr.delimiterCustomLabels);
                }else if (this.attr.model === 'NoSensorSignal') {
                    this.$node.data('delimiterList', this.attr.delimiterList);
                    this.$node.data('delimiterCustomLabels', this.attr.delimiterCustomLabels);
                }

            });

            function _stopPropagation(e) {
                e.stopPropagation();
            }

            function _isSensorCard(instance) {
                return instance.attr.actionCard !== true &&
                    instance.attr.timeCard !== true;
            }

            /**
             * Resampling Locales
             * Gets the main i18n and extract translations for rules.
             *
             * @return  {object}   obj      The rules translations
             */
            function resamplingLocales() {
                var dataObj = Kermit.i18n.strings,
                    result = {},
                    obj, key;

                for (obj in dataObj) {
                    if (! obj.indexOf('Rules.')) {
                        key = obj.substr(6, obj.length);
                        result[key] = dataObj[obj];
                    }
                }

                return result;
            }
        }

        return ComponentManager.create('Card', Template, Card, DataBinding);
    }
);
