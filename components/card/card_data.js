define(
[],
function() {

    var locales = {
        'true': 'True',
        'false': 'False',
        'value': 'Value',
        'after': 'After',
        'every': 'Every',
        'sendAlarmHeader': 'Create alarm',
        'turnOffAlarmHeader': 'Turn off alarm',
        'sendEmailHeader': 'Send email',
        'subject': 'Subject',
        'to': 'To',
        'thresholdHeader': 'Threshold',
        'criticalLevel': 'Critical level',
        'majorLevel': 'Major level',
        'maxLevel': 'Maximum level',
        'minLevel': 'Minimum level',
        'alarmOffLevel':  'Alarm off level',
        'alarmConditionTxt': 'This condition includes all assets that have at least one active alarm and does not require configuration.',
        'sendAlarmTxt': 'This action will create all active alarms for the assets that meet the formulated conditions and does not require configuration.',
        'turnOffAlarmTxt': 'This action will turn off all active alarms for the assets that meet the formulated conditions and does not require configuration.',
        'alarmHeader': 'Alarm',
        'repeat': 'Repeat',
        'interval': 'Interval',
        'elapsed': 'Elapsed',
        'noSensorSignal': 'No Sensor Signal',
        'sendSMSHeader': 'Send SMS',
        'property': 'Property',
        'name': 'Name',
        'setPropertyHeader' : 'Set property'
    };

    var PHENOMENON_PREFIX = 'urn:x-ogc:def:phenomenon:IDAS:1.0:';

    var cardType = {
        'SENSOR_CARD': 'SensorCard',
        'ACTION_CARD': 'ActionCard',
        'TIME_CARD': 'TimeCard'
    };

    var component = {
        'ANGLE': 'AngleWidget',
        'SLIDER': 'Slider',
        'BATTERY': 'Battery',
        'SEND_EMAIL': 'SendEmail',
        'SEND_SMS':'SendSMS'
    };

    var encodeSensor = {
        'angle': function(card){

            card.front = {
                items: [{
                    component: component.ANGLE
                }]
            };
            card.back = {
                items: [{
                    component: component.SLIDER,
                    label: locales.value
                }]
            };
            card.defaultValue = '0';
            return card;
        },
        'battery': function(card){
            card.front = {
                items: [{
                    component: component.BATTERY
                }]
            };
            card.back = {
                items: [{
                    component: component.SLIDER,
                    label: locales.value
                }]
            };
            card.defaultValue = '0';
            return card;
        },
        'binary': function(card) {
            card.front = {
                items: [{
                    component: 'CardFrontBinary',
                    trueLabel: locales['true'],
                    falseLabel: locales['false']
                }]
            };
            card.back = {
                items: [{
                    component: 'Dropdown',
                    defaultValue: 'false',
                    options: [{
                        label: locales['true'],
                        value: 'true'
                    }, {
                        label: locales['false'],
                        value: 'false'
                    }]
                }]
            };
            card.delimiterList = ['EQUAL_TO', 'DIFFERENT_TO'];
            card.defaultValue = 'false';
            return card;
        },
        'text': function(card) {
            card.front = {
                items: [{
                    component: 'CardFrontText'
                }]
            };
            card.delimiterList = ['EQUAL_TO', 'DIFFERENT_TO'];
            card.back = {
                items: [{
                    component: 'CardBackText',
                    label: locales['value']
                }]
            };
            return card;
        },
        'quantityValue': function(card) {
            card.front = {
                items: [{
                    component: 'CardFrontQuantityValue',
                    units: card.sensorData.uom
                }]
            };
            card.back = {
                items: [{
                    component: 'CardBackText',
                    label: locales['value'],
                    dataType:card.sensorData.dataType
                }]
            };
            return card;
        },
        'noSensorSignal':function(card){
            card.header = locales['noSensorSignal'];
            if( card.sensorData && card.sensorData.measureName && $.isArray(card.configData) ){
                $.map(card.configData, function(option){
                    var measureName = (option.value && option.value.measureName);
                    if(measureName === card.sensorData.measureName){
                        option.selected = true;
                    }
                    return option;
                });
            }

            card.front = {
                items: [{
                    component: 'CardFrontOff'
                }]
            };
            card.back = {
                items: [{
                    component: 'Dropdown',
                    defaultValue: '',
                    options: card.configData
                }]
            };
            card.delimiterList = ['GREATER_THAN'];
            card.delimiterCustomLabels = [
                {
                    valueKey: 'GREATER_THAN',
                    labelKey: 'IS_OFF'
                },
                {
                    valueKey: 'EQUAL_TO',
                    labelKey: 'IS_OFF'
                }
            ];

            return card;
        },
        'alarm' : function (card) {
            var property = card.conditionList && card.conditionList[0];
            card.front = {
                items: [{
                    component: 'CardFrontIcon',
                    iconClass: 'm2m-card-alarm-img'
                }]
            };
            card.back = {
                items: [{
                    component: 'CardBackLabel',
                    labelTxt:  locales['alarmConditionTxt']
                }]
            };
            card.delimiterList = ['EQUAL_TO', 'DIFFERENT_TO'];

            // delimiter options with custom labels
            card.delimiterCustomLabels = [
                {
                    valueKey: 'EQUAL_TO',
                    labelKey: 'IS_ON'
                },
                {
                    valueKey: 'DIFFERENT_TO',
                    labelKey: 'IS_OFF'
                }
            ];

            card.defaultCondition = {
                    scope: 'USER_PROP',
                    parameterValue: 'true',
                    not: false,
                    operator: null,
                    userProp: '${device.asset.UserProps.histeresis}'
            };
            card.header = locales['alarmHeader'];

            if(property){
                card.value = property.parameterValue;
            }
            return card;
        },
        'threshold': function(card) {
            var parameterValue = (card.conditionList && card.conditionList[0] && card.conditionList[0].parameterValue) ? card.conditionList[0].parameterValue : "";
            var phenomenonValue = (card.sensorData && card.sensorData.phenomenonApp) ? card.sensorData.phenomenonApp : "";
            var phenomenonData = (card.configData && card.configData.phenomenons) || '';

            card.front = {
                items: [{
                    component: 'CardFrontThreshold'
                }]
            };
            card.back = {
                items: [{
                    component: 'CardBackThreshold',
                    phenomenonData: phenomenonData,
                    levelVal: parameterValue,
                    phenomenonVal: phenomenonValue,
                    labelCritical: locales['criticalLevel'],
                    labelMajor: locales['majorLevel'],
                    labelAlarmOff: locales ['alarmOffLevel'],
                    labelMax: locales['maxLevel'],
                    labelMin: locales['minLevel']
                }]
            };
            card.header = locales['thresholdHeader'];

            return card;
        },
        'userProperty': function(card){
            var property = card.conditionList && card.conditionList[0];
            if(property){
                card.value = {
                    key: property.userProp.replace(/^\${device\.asset\.UserProps\.(.+)}$/g, '$1'),
                    value: property.parameterValue
                };
            }
            card.header = locales['property'];
            card.front = {
                items: [{
                    component: 'CardFrontText',
                    tpl: '<div class="m2m-card-text">' +
                        '<div class="m2m-card-text-value">{{value.key}}' +
                        '</div>' +
                     '</div>'
                }]
            };
            card.delimiterList = ['EQUAL_TO', 'DIFFERENT_TO'];
            card.back = {
                items: [{
                    component: 'CardBackText',
                    inputs: [
                        {
                            label: locales['name'],
                            name:'key'
                        },
                        {
                            label: locales['value'],
                            name:'value'
                        }
                    ]
                }]
            };
            card.defaultCondition = {
                    scope: 'USER_PROP',
                    parameterValue: null,
                    not: false,
                    operator: null,
                    userProp: ''
            };

            return card;
        },
        'ceprule' : function (card) {
            card.front = {
                items: [{
                    component: 'CardFrontText'
                }]
            };
            card.back = {
                items: [{
                    component: 'CardBackTextarea'
                }]
            };
            card.delimiterList = ['EQUAL_TO'];

            return card;
        }

    };

    var encodeTime = {
        'timeElapsed': function(card){
            card.header = locales['elapsed'];
            card.cssClass = 'm2m-card-time m2m-card-elapsed';
            card.front = {
                items: [{
                    component: 'CardFrontQuantityValue',
                    label: locales['after'],
                    units:'seg'
                }]
            };
            card.back = {
                items: [{
                    component: 'CardBackText',
                    label: locales['value'],
                    dataType: 'Quantity'
                }]
            };
            if( card.timeData && card.timeData.interval ){
                card.value = card.timeData.interval;
            }
            card.defaultValue = '1';
            card.timeCard = true;
            return card;
        },
        'timeInterval': function(card){
            card.header = locales['interval'];
            card.cssClass = 'm2m-card-time m2m-card-interval';

            card.front = {
                items: [{
                    component: 'CardFrontQuantityValue',
                    label: locales['interval'],
                    units:'min'
                }]
            };
            card.back = {
                items: [{
                    component: 'CardBackText',
                    label: locales['value'],
                    dataType: 'Quantity'
                }]
            };

            if( card.timeData && card.timeData.interval ){
                card.value = card.timeData.interval;
            }
            card.defaultValue = '1';
            card.timeCard = true;
            return card;
        }
    };

    var encodeAction = {
        'SendEmailAction': function(card) {
            card.cssClass = 'm2m-card-action m2m-card-send-email action-card';
            card.header = locales.sendEmailHeader;
            card.locales = {
                subject: locales.subject,
                to: locales.to
            }
            card.component = component.SEND_EMAIL;
            card.tokens = ['device_latitude', 'device_longitude', 'measure.value', 'device.asset.name'];
            return card;
        },
        'CreateAlarmAction': function(card){
            card.cssClass = 'm2m-card-action m2m-card-alarm-action action-card';
            card.header = locales.sendAlarmHeader;
            card.actionCard = true;
            card.front = {
                items: [{
                    component: 'CardFrontIcon',
                    iconClass: 'm2m-card-alarm-img'
                }]
            };
            card.back = {
                items: [{
                     component: 'CardBackLabel',
                     labelTxt: locales.sendAlarmTxt
                }]
            };
            return card;
        },
        'TurnOffAlarmAction': function(card){
            card.cssClass = 'm2m-card-action m2m-card-alarm-action action-card';
            card.header = locales.turnOffAlarmHeader;
            card.actionCard = true;
            card.front = {
                items: [{
                    component: 'CardFrontIcon',
                    iconClass: 'm2m-card-alarm-with-x-img'
                }]
            };
            card.back = {
                items: [{
                     component: 'CardBackLabel',
                     labelTxt: locales.turnOffAlarmTxt
                }]
            };
            return card;
        },
        'SendSmsMibAction':function(card){
            card.cssClass = 'm2m-card-action m2m-card-send-sms action-card';
            card.header = locales.sendSMSHeader;
            card.locales = {
                subject: locales.subject,
                to: locales.to
            }
            card.component = component.SEND_SMS;
            card.tokens = ['device_latitude', 'device_longitude', 'measure.value', 'device.asset.name'];
            return card;
        },
        'PropertyAction':function (card){
            card.cssClass   = 'm2m-card-action m2m-card-alarm-action action-card';
            card.header     = locales.setPropertyHeader;
            card.actionCard = true;
            card.front      = {
                items: [{
                    component: 'CardFrontText',
                    tpl: '<dl class="properties">'+
                            '<dt>{{value.value}}</dt>'+
                            '<dd>{{value.name}}</dd>'+
                        '</dl>'
                }]
            };

            card.back       = {
                items: [{
                    component: 'CardBackText',
                    inputs: [
                        {
                            label: locales['name'],
                            name:'name'
                        },
                        {
                            label: locales['value'],
                            name:'value'
                        }
                    ]
                }]
            };

            return card;
        },
        'ceprule': function (card){
            card.cssClass   = 'm2m-card-action action-card';
            card.actionCard = true;
            card.header = 'CEP';
            card.front      = {
                items: [{
                    component: 'CardFrontText',
                    tpl: '<p>{{value}}</p>'
                }]
            };
            card.back       = {
                items: [{
                    component: 'CardBackTextarea'
                }]
            };

            return card;
        }
    };

    var decodeSensor = {
        'noSensorSignal':function(cardConfig, cardData){
            cardConfig.sensorData = cardData;
            cardConfig.conditionList = [{
               'scope':'LAST_MEASURE',
               'not':false,
               'operator': (cardData.dataType === 'Quantity') ? 'GREATER_THAN':'EQUAL_TO' ,
               'parameterValue':'${device.asset.UserProps.reportInterval}'
            }];
            delete cardConfig.configData;
            return cardConfig;
        },
        'userProperty':function(cardConfig, cardData){
            var key = '${device.asset.UserProps.' + cardData.key + '}';
            var condition = cardConfig.conditionList && cardConfig.conditionList[0];
            if(condition){
                condition.scope = 'USER_PROP';
                condition.parameterValue = cardData.value;
                condition.userProp = key;
            }
            delete cardConfig.sensorData;
            return cardConfig;
        }
    };

    var decodeAction = {
        'SendEmailAction': function(cardConfig, cardData) {
            cardConfig.actionData.userParams = cardData.userParams;
            return cardConfig;
        },
        'SendAlarmAction': function(cardConfig, cardData){
            cardConfig.actionData.userParams = cardData.userParams;
            return cardConfig;
        },
        'SendSmsMibAction': function(cardConfig, cardData) {
            cardConfig.actionData.userParams = cardData.userParams;
            return cardConfig;
        },
        'PropertyAction': function (cardConfig, cardData) {
            var up = [];
            $.each(cardData, function (k,v) {
                if(v && k === 'name'){
                    v = '${device.asset.UserProps.' + v + '}';
                }
                up.push({
                    name    : 'property.' + k,
                    value   : v
                });
            });
            cardConfig.actionData.userParams = up;

            return cardConfig;
        }
    };

    var decodeTime = {
        'timeElapsed': function(cardConfig, cardData){
            cardConfig.timeData.interval = cardData;
            cardConfig.timeData.context =  'ASSET';
            cardConfig.timeData.repeat = '0';
            return cardConfig;
        },
        'timeInterval':function(cardConfig, cardData){
            cardConfig.timeData.interval = cardData;
            cardConfig.timeData.repeat = '0';
            cardConfig.timeData.context =  'ASSET';//no debería ser necesario pero BE lo necesita
            return cardConfig;
        }
    };

    var encode = function (card) {
        var adapterMethodName = _getMethodNameForPase(card);
        var adapterMethod;
        card = $.extend({}, card);

        if(card.type === cardType.SENSOR_CARD){
            if (!card.header && card.sensorData) {
                card.header = card.sensorData.measureName || '';
            }
            card = $.extend(card, card.configData);
            adapterMethod = encodeSensor[adapterMethodName];

        }else if(card.type === cardType.ACTION_CARD){
            card = $.extend(card, card.actionData);
            adapterMethod = encodeAction[adapterMethodName];
        }else if(card.type === cardType.TIME_CARD) {
            adapterMethodName = card.configData.timeType;
            adapterMethod = encodeTime[adapterMethodName];
        }
        if( $.isFunction(adapterMethod) ){
            card = adapterMethod(card);
        }
        return card;
    };

    var decode = function(cardConfig, cardData){
        var adapterMethodName = _getMethodNameForPase(cardConfig);
        var adapterMethod;
        cardConfig = $.extend({}, cardConfig);
        if(cardConfig.type === cardType.SENSOR_CARD){
            adapterMethod = decodeSensor[adapterMethodName];

        }else if(cardConfig.type === cardType.ACTION_CARD){
            adapterMethod = decodeAction[adapterMethodName];
        }else if(cardConfig.type === cardType.TIME_CARD) {
            adapterMethod = decodeTime[adapterMethodName];
        }
        if( $.isFunction(adapterMethod) ){
            cardConfig = adapterMethod(cardConfig, cardData);
        }
        return cardConfig;
    };

    var addLocales = function(newLocales){
        $.extend(locales, newLocales);
    };

    var _getMethodNameForPase = function(cardConfig){
        var sensorData      = cardConfig.sensorData,
            patt            = /^\$/g,
            conditionList   = cardConfig.conditionList || [ { parameterValue : ''} ],
            parameterValue  = conditionList[0].parameterValue,
            sensorCardType  = cardConfig.sensorCardType,
            name,
            phenomenon;

        if(cardConfig.type === cardType.SENSOR_CARD){
            phenomenon = (sensorData && sensorData.phenomenon) ?
                sensorData.phenomenon.replace(PHENOMENON_PREFIX, '') : '';
            if(cardConfig.sensorCardType === 'userProperty'){
                name = 'userProperty';
            }else if (cardConfig.model === 'NoSensorSignal') {
                name = 'noSensorSignal';
            } else if (phenomenon === 'angle') {
                name = 'angle';
            } else if (!sensorData){
                name = 'alarm';
            } else if ( sensorCardType === 'threshold' || patt.test(parameterValue)) {
                name = 'threshold';
             }else if ( sensorCardType === 'ceprule' ) {
                name = 'ceprule';
             }else if (phenomenon === 'electricPotential') {
                name = 'battery';
            } else if (sensorData && sensorData.dataType === 'Boolean') {
                name = 'binary';
            } else if (sensorData && sensorData.dataType === 'Quantity') {
                name = 'quantityValue';
            } else {
                name = 'text';
            }
        }else if(cardConfig.type === cardType.ACTION_CARD){
            name = cardConfig.actionData.type;
        }else if(cardConfig.type === cardType.TIME_CARD){
            phenomenon = cardConfig.configData.timeType;
            if (phenomenon === 'timeInterval') {
                name = 'timeInterval';
            } else if (phenomenon === 'timeElapsed') {
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

});