define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/card/card',
        'components/flippable'
    ],

    function(ComponentManager, DataBinding, Card, Flippable) {

        var defaultAttrs = {
            tokens: []
        };
        var BACK_TPL = $( ['<div class="card-header">',
                '<label class="email-subject-label">Subject</label>',
                '<input class="email-subject">',
                '<label class="email-address-label">To</label>',
                '<input class="email-address">',
            '</div>',
            '<div class="card-body">',
                '<textarea class="email-message"></textarea>',
            '</div>',
            '<div class="token-selector"></div>'].join('') );
        var FRONT_TPL = $( ['<p class="email-address"></p>',
            '<p class="email-subject"></p>',
            '<p class="email-message"></p>'].join('') );
        var TOKEN_TPL = '<div class="token"></div>';
        var TOKEN_SYMBOL = '+';
        var element = {
            back : {
                subject : $(BACK_TPL).find('input.email-subject'),
                address : $(BACK_TPL).find('input.email-address'),
                message : $(BACK_TPL).find('.email-message'),
                token : $(BACK_TPL[2])
            },
            front : {
                address : $(FRONT_TPL[0]),
                subject : $(FRONT_TPL[1]),
                message : $(FRONT_TPL[2])
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

            //@TODO
            //hay que ver porque dublica también los elementos creados inicialmente
            //el siguiente método de borrado no debería ser necsario
            element.back.token.html('');
            $.each(this.attr.tokens, _addToken);

            element.back.address.on('change', _updateElementOnChange(element.front.addres) );
            element.back.subject.on('change', _updateElementOnChange(element.front.subject) );
            element.back.message.on('change', _updateElementOnChange(element.front.message) );

            var node = this.$node;
            $(node.parent() ).on('click', function(){
                node.removeClass('flip');
            });
        }
        function _stopPropagation(e){
            e.stopPropagation();
        }

        function _addToken(index, name){
            var ele = _makeSymbolElement(name);
            element.back.token.append( ele );
        }

        function _makeSymbolElement(name){
            var ele = $(TOKEN_TPL).text(TOKEN_SYMBOL+name);
            return ele;
        }

        function _updateElementOnChange(elementTo){
            var callbackToEvent = function(){
                var value = $(this).val();
                elementTo.text( value );
            };
            return callbackToEvent;
        }

        return ComponentManager.extend(Card, 'SendEmail', SendEmail, DataBinding);
    }
);
