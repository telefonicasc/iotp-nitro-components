define(
    [],
    function () {

    var locales = {},

        /**
         * RuleEditor atributes configuration
         *
         * @type    object
         */
        options = {
            card : {
                valueThreshold : {
                    // Example of option:
                    //  > regExpQuantity:  '^[-+]?([0-9]*?||([0-9]+(\.[0-9]*?)))?$',
                    //  > regExpText:      '^(?!.*(_)\\1)[\.a-zA-Z0-9_\-]*$'
                },
                attributeThreshold : {
                    // Example of option:
                    //  > regExpValidator: '^(?!.*(_)\\1)[a-zA-Z][\.a-zA-Z0-9_]*$',
                }
            }
        },

        PHENOMENON_PREFIX = 'urn:x-ogc:def:phenomenon:IDAS:1.0:',

        cardType = {
            'SENSOR_CARD': 'SensorCard',
            'ACTION_CARD': 'ActionCard',
            'TIME_CARD': 'TimeCard'
        },

        component = {
            'SEND_EMAIL': 'SendEmail',
            'SEND_SMS': 'SendSMS'
        },

        // --------------------------------------------------------------------

        /**
         * Add Locales
         * Mixes locales from other repositories
         *
         * @param   object  newLocales  A JSON object that holds translated strings
         * @return  object              A JSON that holds all translated strings
         */
        addLocales = function ( newLocales ) {
            $.extend( locales, newLocales );
        },

        // --------------------------------------------------------------------

        /**
         * Encode Sensor
         * Condition cards description and initialized
         *
         * @type    object
         */
        encodeSensor = {
            /**
             * Not Updated Card
             *
             * @param   object  card    The defaults card attributes
             * @return  object          The card composed
             */
            notUpdated: function ( card ) {
                var property = card.conditionList && card.conditionList[ 0 ],
                    sensor = card.sensorData || false,
                    timeData = card.timeData || false;

                if ( property ) {
                    property.parameterValue = {
                        maxTime: property.parameterValue
                    }

                    if ( sensor ) {
                        property.parameterValue.attributeName = sensor.measureName;
                    }

                    if ( timeData ) {
                        property.parameterValue.checkInterval = timeData.interval;
                    }
                }

                card.header = locales.notUpdate;
                card.front = {
                    items: [ {
                        component: 'CardFrontText',
                        tpl: '<div class="thresold-attribs">' +
                                '<span><strong>{{value.checkInterval}}</strong></span>' +
                                '<span>{{value.attributeName}}</span>' +
                                '<span>{{value.maxTime}}</span>' +
                            '</dl>'
                    } ]
                };
                card.back = {
                    items: [
                        {
                            component: 'CardBackTextCombo',
                            inputs: [
                                {
                                    type: 'text',
                                    name: 'checkInterval',
                                    label: locales.checkInterval
                                },
                                {
                                    type: 'text',
                                    name: 'attributeName',
                                    label: locales.attribName
                                },
                                {
                                    type: 'text',
                                    name: 'maxTime',
                                    label: locales.maxTime
                                }
                            ]
                        }
                    ]
                };
                card.delimiterList = [];
                card.defaultCondition = [
                    {
                        scope: 'LAST_MEASURE',
                        not: false,
                        operator: 'EQUAL_TO',
                        parameterValue: ''
                    }
                ];
                card.sensorData = {
                    measureName: '',
                    phenomenonApp: '',
                    phenomenon: '',
                    uom: ''
                };

                return card;
            },

            /**
             * Value Threshold
             *
             * @param   object  card    The defaults card attributes
             * @return  object          The card composed
             */
            valueThreshold: function ( card ) {
                var property = card.conditionList && card.conditionList[ 0 ],
                    sensor = card.sensorData || false,
                    tmpType = 'Quantity';

                if ( property ) {
                    property.parameterValue = {
                        thresoldValue: property.parameterValue
                    }

                    if ( sensor ) {
                        tmpType = sensor.dataType;
                        property.parameterValue.thresoldType = tmpType;
                        property.parameterValue.thresoldName = sensor.measureName;
                    }
                }

                card.header = locales.valueThreshold;
                card.front = {
                    items: [ {
                        component: 'CardFrontText',
                        tpl: '<div class="thresold-attribs">' +
                                '<span><strong>{{value.thresoldName}}</strong></span>' +
                                '<span>{{value.thresoldType}}</span>' +
                                '<span>{{value.thresoldValue}}</span>' +
                            '</dl>'
                    } ]
                };
                card.back = {
                    items: [ {
                        component: 'CardBackTextCombo',
                        inputs: [
                            {
                                type: 'text',
                                name: 'thresoldName',
                                label: locales.name
                            }, {
                                type: 'dropdown',
                                name: 'thresoldType',
                                options: [
                                    {
                                        'label': locales.quantity,
                                        'value': 'Quantity',
                                        'selected': ( tmpType === 'Quantity' ? true : false )
                                    },
                                    {
                                        'label': locales.text,
                                        'value': 'Text',
                                        'selected': ( tmpType === 'Text' ? true : false )
                                    }
                                ],
                                regExp: {
                                    'Quantity': options.card.valueThreshold.regExpQuantity,
                                    'Text': options.card.valueThreshold.regExpText
                                },
                                regExpTarget: 'thresoldValue'
                            }, {
                                type: 'text',
                                name: 'thresoldValue',
                                label: locales.value,

                                regExp: options.card.valueThreshold.regExpText,
                                regExpOrigin: 'thresoldType'
                            }
                        ]
                    } ]
                };
                card.delimiterList = [ 'GREATER_THAN', 'MINOR_THAN', 'EQUAL_TO', 'DIFFERENT_TO' ];
                card.defaultCondition = {
                    scope: 'USER_PROP',
                    parameterValue: null,
                    not: false,
                    operator: null,
                    userProp: ''
                };
                card.sensorData = {
                    measureName: 'acceleration',
                    phenomenonApp: 'myPhenomApp',
                    phenomenon: 'myPhenom',
                    dataType: 'Quantity',
                    uom: 'myUOM'
                };

                return card;
            },

            /**
             * Attribute Threshold
             *
             * @param   object  card    The defaults card attributes
             * @return  object          The card composed
             */
            attributeThreshold: function ( card ) {
                var property = ( card.conditionList && card.conditionList[ 0 ] ) ? card.conditionList[ 0 ] : false,
                    sensor = card.sensorData || false
                    tmpType = 'Quantity';

                if ( property ) {
                    var tmpValue = property.parameterValue,
                        pattern = /\$\{(.*)\}/,
                        matches;

                    if ( matches = tmpValue.match( pattern ) ) {
                        tmpValue = matches[ 1 ];
                    }

                    property.parameterValue = {
                        thresoldValue: tmpValue
                    }

                    if ( sensor ) {
                        tmpType = sensor.dataType;
                        property.parameterValue.thresoldType = tmpType;
                        property.parameterValue.thresoldName = sensor.measureName;
                    }
                }

                card.header = locales.attributeThreshold;
                card.front = {
                    items: [ {
                        component: 'CardFrontText',
                        tpl: '<div class="thresold-attribs">' +
                                '<span><strong>{{value.thresoldName}}</strong></span>' +
                                '<span>{{value.thresoldType}}</span>' +
                                '<span>{{value.thresoldValue}}</span>' +
                            '</dl>'
                    } ]
                };
                card.back = {
                    items: [ {
                        component: 'CardBackTextCombo',
                        inputs: [
                            {
                                type: 'text',
                                name: 'thresoldName',
                                label: locales.name
                            },
                            {
                                type: 'dropdown',
                                name: 'thresoldType',
                                options: [
                                    {
                                        'label': locales.quantity,
                                        'value': 'Quantity',
                                        'selected': ( tmpType === 'Quantity' ? true : false )
                                    },
                                    {
                                        'label': 'Text',
                                        'value': locales.text,
                                        'selected': ( tmpType === 'Text' ? true : false )
                                    }
                                ]
                            },
                            {
                                type: 'text',
                                name: 'thresoldValue',
                                label: locales.value,
                                placeholder: locales.valueAttributeThreshold,
                                regExp: options.card.attributeThreshold.regExpValidator
                            }
                        ]
                    } ]
                };
                card.delimiterList = [ 'GREATER_THAN', 'MINOR_THAN', 'EQUAL_TO', 'DIFFERENT_TO' ];
                card.defaultCondition = {
                    scope: 'USER_PROP',
                    parameterValue: null,
                    not: false,
                    operator: null,
                    userProp: ''
                };

                return card;
            },

            /**
             * CEP Rule
             *
             * @param   object  card    The defaults card attributes
             * @return  object          The card composed
             */
            ceprule: function ( card ) {
                card.front = {
                    items: [ {
                        component: 'CardFrontText'
                    } ]
                };
                card.back = {
                    items: [ {
                        component: 'CardBackTextarea'
                    } ]
                };
                card.delimiterList = [ 'EQUAL_TO' ];

                return card;
            },

            /**
             * RegExp (Alias ID)
             *
             * @param   object  card    The defaults card attributes
             * @return  object          The card composed
             */
            regexp: function ( card ) {
                card.header = locales.regexpTitle;
                card.front = {
                    items: [ {
                        component: 'CardFrontText'
                    } ]
                };
                card.back = {
                    items: [ {
                        component: 'CardBackText',
                        label: locales.regexp
                    } ]
                };

                card.delimiterList = [ 'MATCH' ];

                card.defaultCondition = {
                    scope: 'XPATH',
                    parameterValue: null,
                    parameterName: 'id',
                    not: false,
                    operator: 'MATCH',
                    userProp: ''
                };

                return card;
            },

            /**
             * Type
             *
             * @param   object  card    The defaults card attributes
             * @return  object          The card composed
             */
            type: function ( card ) {
                card.header = locales.type;
                card.front = {
                    items: [ {
                        component: 'CardFrontText'
                    } ]
                };
                card.back = {
                    items: [ {
                        component: 'CardBackText',
                        label: locales.value
                    } ]
                };

                card.delimiterList = [ 'EQUAL_TO', 'DIFFERENT_TO' ];

                card.defaultCondition = {
                    scope: 'XPATH',
                    parameterValue: null,
                    parameterName: 'type',
                    not: false,
                    operator: null,
                    userProp: ''
                };

                card.sensorData = {
                    dataType: 'Text'
                }

                return card;
            }
        },

        // --------------------------------------------------------------------

        /**
         * Encode Time
         * Time based condition cards description and initialized
         *
         * @type    object
         */
        encodeTime = {
            /**
             * Time Elapsed
             *
             * @param   object  card    The defaults card attributes
             * @return  object          The card composed
             */
            timeElapsed: function ( card ) {
                card.header = locales.elapsed;
                card.cssClass = 'm2m-card-time m2m-card-elapsed';

                card.front = {
                    items: [ {
                        component: 'CardFrontQuantityValue',
                        label: locales.after,
                        units: 'seg'
                    } ]
                };
                card.back = {
                    items: [ {
                        component: 'CardBackText',
                        label: locales.value,
                        dataType: 'Quantity'
                    } ]
                };

                if ( card.timeData && card.timeData.interval ) {
                    card.value = card.timeData.interval;
                }
                card.defaultValue = '1';
                card.timeCard = true;

                return card;
            }
        },

        // --------------------------------------------------------------------

        /**
         * Encode Action
         * Action cards description and initialized
         *
         * @type    object
         */
        encodeAction = {
            /**
             * Send Email Action
             *
             * @param   object  card    The defaults card attributes
             * @return  object          The card composed
             */
            SendEmailAction: function ( card ) {
                card.cssClass = 'm2m-card-action m2m-card-send-email action-card';
                card.header = locales.sendEmailHeader;
                card.locales = {
                    subject: locales.subject,
                    to: locales.to,
                    from: locales.from
                };
                card.component = component.SEND_EMAIL;
                card.tokens = [ 'type', 'id' ];

                return card;
            },

            /**
             * Send SMS Action
             *
             * @param   object  card    The defaults card attributes
             * @return  object          The card composed
             */
            SendSmsMibAction: function ( card ) {
                card.cssClass = 'm2m-card-action m2m-card-send-sms action-card';
                card.header = locales.sendSMSHeader;
                card.locales = {
                    subject: locales.subject,
                    to: locales.to
                };
                card.component = component.SEND_SMS;
                card.tokens = [ 'type', 'id' ];

                return card;
            },

            /**
             * Update Attribute
             *
             * @param   object  card    The defaults card attributes
             * @return  object          The card composed
             */
            updateAttribute: function ( card ) {
                var userParams = card.userParams || {};
                card.cssClass = 'm2m-card-action m2m-card-alarm-action action-card';
                card.header = locales.updateAttribute;
                card.actionCard = true;
                card.front = {
                    items: [ {
                        component: 'CardFrontText',
                        tpl: '<dl class="properties">' +
                                '<dt>{{value.name}}</dt>' +
                                '<dd>{{value.value}}</dd>' +
                            '</dl>'
                    } ]
                };

                card.back = {
                    items: [ {
                        component: 'CardBackText',
                        inputs: [
                            {
                                label: locales.name,
                                name: 'name'
                            },
                            {
                                label: locales.value,
                                name: 'value'
                            }
                        ]
                    } ]
                };
                card.value = {
                    name: (userParams.name || '' ) ,
                    value: (userParams.value || '' )
                };

                return card;
            }
        },

        // --------------------------------------------------------------------

        /**
         * Decode Sensor
         * Mapped of data after any kind of condition card modification
         *
         * @type    object
         */
        decodeSensor = {
            notUpdated: function ( cardConfig, cardData ) {
                var condition = cardConfig.conditionList && cardConfig.conditionList[ 0 ];

                if ( condition ) {
                    condition.scope = 'LAST_MEASURE';
                    condition.parameterValue = cardData.maxTime;
                }

                cardConfig.timeData = {
                  'interval': cardData.checkInterval,
                  'repeat': '-1',
                  'context': ''
               };

               cardConfig.sensorData = {
                  'measureName': cardData.attributeName,
                  'phenomenonApp': '',
                  'phenomenon': '',
                  'dataType': '',
                  'uom': ''
               };

                cardConfig.conditionList = condition;
                delete cardConfig.configData;

                return cardConfig;
            },

            valueThreshold: function ( cardConfig, cardData ) {
                var condition = cardConfig.conditionList && cardConfig.conditionList[ 0 ];

                if ( condition ) {
                    condition.scope = 'OBSERVATION';
                    condition.parameterValue = cardData.thresoldValue;

                    delete condition.userProp;
                }

                cardConfig.sensorData = {
                    measureName: cardData.thresoldName,
                    phenomenonApp: '',
                    phenomenon: '',
                    dataType: cardData.thresoldType,
                    uom: ''
                };

                cardConfig.conditionList = condition;
                delete cardConfig.configData;

                return cardConfig;
            },

            attributeThreshold: function ( cardConfig, cardData ) {
                var condition = cardConfig.conditionList && cardConfig.conditionList[ 0 ];

                if ( condition ) {
                    condition.scope = 'OBSERVATION';
                    condition.parameterValue = '${' + cardData.thresoldValue + '}';

                    delete condition.userProp;
                }

                cardConfig.sensorData = {
                    measureName: cardData.thresoldName,
                    phenomenonApp: '',
                    phenomenon: '',
                    dataType: cardData.thresoldType,
                    uom: ''
                };

                cardConfig.conditionList = condition;

                delete cardConfig.configData;

                return cardConfig;
            },

            regexp: function ( cardConfig, cardData ) {
                var key = '^' + cardData + '.*',
                condition = cardConfig.conditionList && cardConfig.conditionList[ 0 ];

                cardConfig.sensorData = {
                    parameterValue: key
                };

                if ( condition ) {
                    condition.userProp = key;
                }

                cardConfig.conditionList = condition;

                return cardConfig;
            },

            type: function ( cardConfig, cardData ) {
                cardConfig.sensorData = {
                    dataType: 'Text'
                };

                return cardConfig;
            },
        },

        // --------------------------------------------------------------------

        /**
         * Decode Action
         * Mapped of data after any kind of action card modification
         *
         * @type    object
         */
        decodeAction = {
            SendEmailAction: function ( cardConfig, cardData ) {
                cardConfig.actionData.userParams = cardData.userParams;

                return cardConfig;
            },

            SendSmsMibAction: function ( cardConfig, cardData ) {
                cardConfig.actionData.userParams = cardData.userParams;

                return cardConfig;
            },

            updateAttribute: function ( cardConfig, cardData ) {
                cardConfig.actionData.userParams = cardData;
                cardConfig.actionData.name = 'updateAttribute';
                cardConfig.actionData.type = 'updateAttribute';

                return cardConfig;
            }
        },

        // --------------------------------------------------------------------

        /**
         * Decode Time
         * Mapped of data after any kind of time based card modification
         *
         * @type    object
         */
        decodeTime = {
            timeElapsed: function ( cardConfig, cardData ) {
                cardConfig.timeData.interval = cardData;
                cardConfig.timeData.context = 'ASSET';
                cardConfig.timeData.repeat = '0';

                return cardConfig;
            }
        },

        // --------------------------------------------------------------------

        encode = function ( card ) {
            var adapterMethodName = _getMethodNameForParse( card ),
                adapterMethod;

            card = $.extend( {}, card );

            if ( card.type === cardType.SENSOR_CARD ) {
                if ( ! card.header && card.sensorData ) {
                    card.header = card.sensorData.measureName || '';
                }
                card = $.extend( card, card.configData );
                adapterMethod = encodeSensor[ adapterMethodName ];
            } else if ( card.type === cardType.ACTION_CARD ) {
                card = $.extend( card, card.actionData );
                adapterMethod = encodeAction[ adapterMethodName ];
            } else if ( card.type === cardType.TIME_CARD ) {
                adapterMethodName = card.configData.timeType;
                adapterMethod = encodeTime[ adapterMethodName ];
            }

            if ( $.isFunction( adapterMethod ) ) {
                card = adapterMethod( card );
            }

            return card;
        },

        decode = function ( cardConfig, cardData ) {
            var adapterMethodName = _getMethodNameForParse( cardConfig ),
                adapterMethod;

            cardConfig = $.extend( {}, cardConfig );

            if ( cardConfig.type === cardType.SENSOR_CARD ) {
                adapterMethod = decodeSensor[ adapterMethodName ];
            } else if ( cardConfig.type === cardType.ACTION_CARD ) {
                adapterMethod = decodeAction[adapterMethodName];
            } else if ( cardConfig.type === cardType.TIME_CARD ) {
                adapterMethod = decodeTime[ adapterMethodName ];
            }

            if ( $.isFunction( adapterMethod ) ) {
                cardConfig = adapterMethod( cardConfig, cardData );
            }

            return cardConfig;
        },

        // --------------------------------------------------------------------

        /**
         * Get Method name for parse
         * Gets a card config data and finds the appropriate method to parse
         * its data.
         *
         * @param  object   cardConfig  The card configuration
         * @return string               The name of the method for parse data
         */
        _getMethodNameForParse = function ( cardConfig ) {
            var sensorData      = cardConfig.sensorData,
                sensorCardType  = cardConfig.sensorCardType,
                name,
                phenomenon;

            if ( cardConfig.type === cardType.SENSOR_CARD ) {
                phenomenon = ( sensorData && sensorData.phenomenon ) ?
                    sensorData.phenomenon.replace( PHENOMENON_PREFIX, '' ) : '';

                switch ( true ) {
                case ( sensorCardType === 'valueThreshold' ):
                    name = 'valueThreshold';
                    break;

                case ( sensorCardType === 'attributeThreshold' ):
                    name = 'attributeThreshold';
                    break;

                case ( sensorCardType === 'type' ):
                    name = 'type';
                    break;

                case ( sensorCardType === 'regexp' ):
                    name = 'regexp';
                    break;

                case ( sensorCardType === 'entityAttrib' ):
                    name = 'entityAttrib';
                    break;

                case ( sensorCardType === 'notUpdated' ):
                    name = 'notUpdated';
                    break;

                case ( sensorCardType === 'ceprule' ):
                    name = 'ceprule';
                    break;

                default:
                    name = 'text';
                    break;
                }
            } else if ( cardConfig.type === cardType.ACTION_CARD ) {
                name = cardConfig.actionData.type;
            } else if ( cardConfig.type === cardType.TIME_CARD ) {
                phenomenon = cardConfig.configData.timeType;
                if ( phenomenon === 'timeElapsed' ) {
                    name = 'timeElapsed';
                }
            }

            return name;
        };

    // Returning public methods
    return {
        'addLocales': addLocales,
        'encode': encode,
        'decode': decode,
        'options': options
    };
} );