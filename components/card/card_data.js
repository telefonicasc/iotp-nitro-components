define(
    [],
    function () {

    var locales = {
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

        encodeSensor = {
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
                                    'Quantity': '^[-+]?([0-9]*?||([0-9]+(\.[0-9]*?)))?$',
                                    'Text': '^(?!.*(_)\\1)[\.a-zA-Z0-9_\-]*$'
                                },
                                regExpTarget: 'thresoldValue'
                            }, {
                                type: 'text',
                                name: 'thresoldValue',
                                label: locales.value,
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
                                regExp: '^(?!.*(_)\\1)[a-zA-Z][\.a-zA-Z0-9_]*$'
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

        encodeTime = {
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

        encodeAction = {
            SendEmailAction: function ( card ) {
                card.cssClass = 'm2m-card-action m2m-card-send-email action-card';
                card.header = locales.sendEmailHeader;
                card.locales = {
                    subject: locales.subject,
                    to: locales.to
                };
                card.component = component.SEND_EMAIL;
                card.tokens = [ 'device_latitude', 'device_longitude', 'measure.value', 'device.asset.name' ];

                return card;
            },

            SendSmsMibAction: function ( card ) {
                card.cssClass = 'm2m-card-action m2m-card-send-sms action-card';
                card.header = locales.sendSMSHeader;
                card.locales = {
                    subject: locales.subject,
                    to: locales.to
                };
                card.component = component.SEND_SMS;
                card.tokens = [ 'device_latitude', 'device_longitude', 'measure.value', 'device.asset.name' ];

                return card;
            },

            updateAttribute: function ( card ) {
                card.cssClass = 'm2m-card-action m2m-card-alarm-action action-card';
                card.header = locales.updateAttribute;
                card.actionCard = true;
                card.front = {
                    items: [ {
                        component: 'CardFrontText',
                        tpl: '<dl class="properties">' +
                                '<dt>{{thresoldName}}</dt>' +
                                '<dd>{{thresoldValue}}</dd>' +
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

                return card;
            }
        },

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
            },

            PropertyAction: function ( cardConfig, cardData ) {
                var up = [];
                $.each( cardData, function ( k, v ) {
                    if ( v && k === 'name' ) {
                        v = '${device.asset.UserProps.' + v + '}';
                    }
                    up.push( {
                        name    : 'property.' + k,
                        value   : v
                    } );
                } );
                cardConfig.actionData.userParams = up;

                return cardConfig;
            }
        },

        decodeTime = {
            timeElapsed: function ( cardConfig, cardData ) {
                cardConfig.timeData.interval = cardData;
                cardConfig.timeData.context = 'ASSET';
                cardConfig.timeData.repeat = '0';

                return cardConfig;
            }
        },

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

        addLocales = function ( newLocales ) {
            $.extend( locales, newLocales );
        },

        _getMethodNameForParse = function ( cardConfig ) {
            var sensorData      = cardConfig.sensorData,
                patt            = /^\$/g,
                conditionList   = cardConfig.conditionList || [ { parameterValue : '' } ],
                parameterValue  = conditionList[0].parameterValue,
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

    return {
        'addLocales': addLocales,
        'encode': encode,
        'decode': decode
    };
} );