define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/card/card',
        'components/flippable'
    ],

    function(ComponentManager, DataBinding, Card, Flippable) {

        var defaultAttrs = {
            tokens: ['Light.ID', 'Light.Location', 'Bulb.Color', 'Light.Pitch', 'Light.Temp']
        };
        var BACK_TPL = $( ['<div class="card-header">',
                '<label class="email-subject-label">Subject</label>',
                '<input class="email-subject">',
                '<label class="email-address-label">To</label>',
                '<input class="email-address">',
            '</div>',
            '<div class="card-body">',
                '<textarea class="email-message"></textarea>',
                '<div class="token-selector"></div>',
            '</div>'].join('') );
        var FRONT_TPL = $( ['<p class="email-address"></p>',
            '<p class="email-subject"></p>',
            '<p class="email-text"></p>'].join('') );
        var element = {
            back : {
                subject : $(BACK_TPL).find('input.email-subject'),
                address : $(BACK_TPL).find('input.email-address'),
                message : $(BACK_TPL).find('email-message'),
                token : $(BACK_TPL).find('token-selector')
            },
            front : {
                address : $(FRONT_TPL).find('email-address'),
                subject : $(FRONT_TPL).find('email-subject'),
                text : $(FRONT_TPL).find('email-text')
            }
        };
        function SendEmail() {
            // this == scope of component
            this.defaultAttrs(defaultAttrs);
            this.after('initialize', _install);
        }

        function _install(){
            // this == scope of element in component
            this.$front.find('.body').append(FRONT_TPL);
            this.$back.find('.body').append(BACK_TPL);

            this.$back.on('click', _stopPropagation);
        }
        function _stopPropagation(e){
            e.stopPropagation();
        }

        return ComponentManager.extend(Card, 'SendEmail', SendEmail, DataBinding);
    }
);
