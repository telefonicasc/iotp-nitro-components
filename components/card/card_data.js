define(
[],
function() {
    var PHENOMENON_PREFIX = 'urn:x-ogc:def:phenomenon:IDAS:1.0:';
    var cardType = {
        'SENSOR_CARD':'SensorCard',
        'ACTION_CARD':'ActionCard'
    };
    var component = {
        'ANGLE':'AngleWidget',
        'SLIDER':'Slider',
        'BATTERY':'Battery',
        'SEND_EMAIL':'SendEmail'
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
                    component: component.SLIDER
                }]
            };
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
                    component: component.SLIDER
                }]
            };
            return card;
        },
        'binary': function(card) {
            card.front = {
                items: [{
                    component: 'CardFrontBinary'
                }]
            };
            card.back = {
                items: [{
                    component: 'Dropdown',
                    defaultValue: 'false',
                    options: [{
                        label: 'True', 
                        value: 'true'
                    }, {
                        label: 'False', 
                        value: 'false'
                    }]
                }]
            };
            return card;
        },
        'text': function(card) {
            card.front = {
                items: [{
                    component: 'CardFrontText'
                }]
            };
            card.back = {
                items: [{
                    component: 'CardBackText',
                    label: 'Value'
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
                    label: 'Value'
                }]
            };
            return card;
        }
    };

    var encodeAction = {
        'SendEmailAction':function(card){
            card.cssClass = 'm2m-card-action m2m-card-send-email';
            card.header = 'Send Email';
            card.component = component.SEND_EMAIL;
            return card;
        }
    };
    var decodeSensor = {};
    var decodeAction = {
        'SendEmailAction':function(cardConfig, cardData){
            cardConfig.actionData = $.extend(cardConfig.actionData, cardData);
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
        }
        if( $.isFunction(adapterMethod) ){
            cardConfig = adapterMethod(cardConfig, cardData);
        }
        return cardConfig;
    };

    var _getMethodNameForPase = function(cardConfig){
        var sensorData = cardConfig.sensorData,
            name, phenomenon;
        if(cardConfig.type === cardType.SENSOR_CARD){
            phenomenon = sensorData.phenomenon.replace(PHENOMENON_PREFIX, '');
            if (phenomenon === 'angle') {
                name = 'angle';
            } else if (phenomenon === 'electricPotential') {
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
        'encode':encode,
        'decode':decode
    };
});
