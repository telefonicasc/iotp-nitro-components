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
        'alarmConditionTxt': 'This condition includes all assets that have at least one active alarm and does not require configuration.',
        'sendAlarmTxt': 'This action will create all active alarms for the assets that meet the formulated conditions and does not require configuration.',
        'turnOffAlarmTxt': 'This action will turn off all active alarms for the assets that meet the formulated conditions and does not require configuration.',
        'alarmHeader': 'Alarm'
    };

    var PHENOMENON_PREFIX = 'urn:x-ogc:def:phenomenon:IDAS:1.0:';
    
    var cardType = {
        'SENSOR_CARD': 'SensorCard',
        'ACTION_CARD': 'ActionCard',
        'TIME_CARD': 'timeCard'
    };

    var component = {
        'ANGLE': 'AngleWidget',
        'SLIDER': 'Slider',
        'BATTERY': 'Battery',
        'SEND_EMAIL': 'SendEmail'
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
            card.delimiterList = ['IS_OFF'];
            return card;
        },
        'alarm' : function (card) {
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
            card.defaultCondition = {
                    scope: 'USER_PROP',
                    parameterValue: null,
                    not: false,
                    operator: null,
                    userProp: '${device.asset.UserProps.histeresis}'
            };
            card.defaultValue = true;
            card.header = locales['alarmHeader'];    
            return card;
        },
        'threshold': function(card) {
            var parameterValue = (card.conditionList && card.conditionList[0] && card.conditionList[0].parameterValue) ? card.conditionList[0].parameterValue : "";
            var phenomenonValue = (card.sensorData && card.sensorData.phenomenonApp) ? card.sensorData.phenomenonApp : "";
            
            card.front = {
                items: [{
                    component: 'CardFrontThreshold'
                }]
            };
            card.back = {
                items: [{
                    component: 'CardBackThreshold',
                    phenomenonData: card.configData,
                    levelVal: parameterValue,
                    phenomenonVal: phenomenonValue,
                    labelCritical: locales['criticalLevel'],
                    labelMajor: locales['majorLevel']
                }]
            };  
            card.header = locales['thresholdHeader'];      

            return card;
        }
        
    };

    var encodeTime = {
        'timeElapsed': function(card){
            card.header = 'Elapsed';
            card.front = {
                items: [{
                    component: 'CardFrontQuantityValue',
                    label: locales['after']
                }]
            };
            card.back = {
                items: [{
                    component: 'CardBackText',
                    label: locales['value']
                }]
            };
            card.timeCard = true;
            return card;
        },
        'timeInterval': function(card){
            card.header = 'Interval';
            card.front = {
                items: [{
                    component: 'CardFrontQuantityValue',
                    label: locales['every']
                }]
            };
            card.back = {
                items: [{
                    component: 'CardBackText',
                    label: locales['value']
                }]
            };
            card.timeCard = true;
            return card;
        }
    };
    
    var encodeAction = {
        'SendEmailAction': function(card) {
            card.cssClass = 'm2m-card-action m2m-card-send-email';
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
            card.cssClass = 'm2m-card-action m2m-card-alarm-action';
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
            card.cssClass = 'm2m-card-action m2m-card-alarm-action';
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
        }   
    };
    
    var decodeSensor = {};

    var decodeTime = {};
    
    var decodeAction = {
        'SendEmailAction': function(cardConfig, cardData) {
            cardConfig.actionData.userParams = cardData.userParams;
            return cardConfig;
        }
    };

    var encode = function (card) {
        var adapterMethodName = _getMethodNameForPase(card);
        var adapterMethod;
        card = $.extend({}, card);
    
        if(card.type === cardType.SENSOR_CARD){
            if (!card.header && card.sensorData) {
                card.header = card.sensorData.measureName;
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
        if(cardConfig.type === cardType.SENSOR_CARD){
            adapterMethod = decodeSensor[adapterMethodName];

        }else if(cardConfig.type === cardType.ACTION_CARD){
            adapterMethod = decodeAction[adapterMethodName];
        }else if(cardConfig.type === cardType.TIME_CARD) {
            adapterMethodName = cardConfig.timeType;
            adpaterMethod = decodeTime[adapterMethodName];
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
        var sensorData = cardConfig.sensorData,
            name, phenomenon;
        var parameterValue = ( cardConfig.conditionList && cardConfig.conditionList[0] && cardConfig.conditionList[0].parameterValue)? cardConfig.conditionList[0].parameterValue : "";
        var patt = /^\$/g;
        
        if(cardConfig.type === cardType.SENSOR_CARD){
            phenomenon = (sensorData && sensorData.phenomenon && 
                sensorData.phenomenon.replace(PHENOMENON_PREFIX, ''))? 
                sensorData.phenomenon.replace(PHENOMENON_PREFIX, '') : '';

            //@TODO este nombre de phenomenon es temporal
            if (phenomenon === 'off') {
                name = 'noSensorSignal';
            } else if (phenomenon === 'timeInterval') {
                name = 'timeInterval';
            } else if (phenomenon === 'timeElapsed') {
                name = 'timeElapsed';
            } else if (phenomenon === 'angle') {
                name = 'angle';
            } else if (!sensorData){
                name = 'alarm';
            } else if (cardConfig.sensorCardType && cardConfig.sensorCardType === 'threshold' || patt.test(parameterValue)) {
                name = 'threshold';
             }else if (phenomenon === 'electricPotential') {
                name = 'battery';
            } else if (sensorData.dataType === 'Boolean') {
                name = 'binary';
            } else if (sensorData.dataType === 'Quantity') {
                name = 'quantityValue';
            } else {
                name = 'text';
            }
        }else if(cardConfig.type === cardType.ACTION_CARD){
            name = cardConfig.actionData.type;
        }
        return name;
    };

    return {
        'addLocales': addLocales,
        'encode': encode,
        'decode': decode
    };

});