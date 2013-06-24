/**
 * @component SendAlarm
 *
 * @event {in} change. Listen dropdown change
 * 
 * @event {out} valueChange. When dropdown change, valueChange is triggered
 * 
 * @mixin Card
 * @mixin DataBinding
 *
 */
define(
    [
        'components/component_manager', 
        'components/mixin/data_binding', 
        'components/card/card', 
        'components/form/dropdown'
   ], 
   
function(ComponentManager, DataBinding, Card, Dropdown) {

    function SendAlarm() {
        var defaultAttrs = {
            actionCard: true,
            actionData: {
                name: '',
                description: '',
                userParams: []
            }
            // Locales defined in card_data (encodeAction --> SendAlarmAction)
            /*,
            locales: {
                'activated': 'Activated',
                'deactivated': 'Deactivated',
                'sendAlarmBack': 'Send alarm'
            }*/
        };

        var backTpl = '<div class="card-header"></div>' + '<div class="m2m-action-alarm"></div>';

        var frontTpl = '<div class="m2m-action-alarm">' + '<div class="m2m-action-alarm-img with-x"></div>';

        this.defaultAttrs($.extend({}, defaultAttrs));
        
        this._userParamsObject = {};

        this.after('initialize', function() {

            this.$front.find('.body').append(frontTpl);
            this.$back.find('.body').append(backTpl);

            Dropdown.attachTo(this.$back.find('.m2m-action-alarm'), {
                options: [{
                    label: this.attr.locales.deactivated,
                    value: 'DEACTIVATED'
                }, {
                    label: this.attr.locales.activated,
                    value: 'ACTIVATED'
                }]
            });
           
           var selectStatus = this.$back.find('.m2m-action-alarm> select'); 
           
           this.$back.find('.card-header').html(this.attr.locales.sendAlarmBack);
            
            selectStatus.on('change', $.proxy(function() {
                _configFrontImg(selectStatus.val(), this);
                this.trigger('valueChange', this.getValue());
                
            }, this)); 
            
            var userParamsObject = this._userParamsObject = _userParamsToObject(this.attr.actionData.userParams);
            
            // set value
            selectStatus.val(userParamsObject['alarm.status']);
            _configFrontImg(userParamsObject['alarm.status'], this);
        });

        // get value
        this.getValue = function() {
            this._userParamsObject['alarm.status'] = this.$back.find('.m2m-action-alarm> select').val();
            
            var value = {
                'userParams': _userParamsObjectToArray(this._userParamsObject)
            };
            var data = {
                'value': value
            };
            return data;
        };
    }

    function _userParamsToObject(params) {
        var obj = {};
        $.each(params, function(i, o) {
            obj[o.name] = o.value;
        });
        return obj;
    }

    function _userParamsObjectToArray(obj) {
        var name, arr = [];
        for (name in obj) {
            arr.push({
                'name': name,
                'value': obj[name]
            });
        }
        return arr;
    }
    
    function _configFrontImg (value, scope) {
        var divAlarmImg = scope.$front.find('.m2m-action-alarm-img');
        
        if (value == 'DEACTIVATED') {
            divAlarmImg.removeClass('without-x');
            divAlarmImg.addClass('with-x');
        } else if (value == 'ACTIVATED') {
            divAlarmImg.removeClass('with-x');
            divAlarmImg.addClass('without-x');
        }
    }

    return ComponentManager.extend(Card, 'SendAlarm', SendAlarm, DataBinding);
}
);
