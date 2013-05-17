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
        'angle':function(card){
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
        'electricPotential':function(card){
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
        var name;
        if(cardConfig.type === cardType.SENSOR_CARD){
            name = cardConfig.sensorData.phenomenon.replace(PHENOMENON_PREFIX, '');
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