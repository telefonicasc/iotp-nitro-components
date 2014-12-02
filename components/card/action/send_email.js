define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/card/card',
        'components/flippable'
    ],

    function ( ComponentManager, DataBinding, Card, Flippable ) {

        var defaultAttrs = {
            from: '',
            subject: '',
            emailAddress: '',
            message: '',
            tokens: [],
            actionCard: true,
            actionData: {
                name: '',
                description: '',
                userParams: []
            }

           // Locales defined in card_data (encodeAction --> SendEmailAction)

            // locales: {
            //    subject: 'Subject',
            //    to: 'To'
            // }
        };
        var BACK_TPL = [
            '<div class="card-header">',
                '<label class="email-from-label">From</label>',
                '<input class="email-from">',
                '<label class="email-subject-label">Subject</label>',
                '<input class="email-subject">',
                '<label class="email-address-label">To</label>',
                '<input class="email-address">',
            '</div>',
            '<div class="card-body">',
                '<textarea class="email-message"></textarea>',
            '</div>',
            '<div class="token-selector"></div>'
        ].join( '' ),

            FRONT_TPL = [
                '<i class="email-address"></i>',
                '<h3 class="email-subject"></h3>',
                '<p class="email-message"></p>'
            ].join( '' ),

            TOKEN_TPL = '<div class="token"></div>',
            TOKEN_SYMBOL = '+',
            TOKEN_VALUE_TPL_START = '${',
            TOKEN_VALUE_TPL_END = '}';

        function SendEmail () {
            // this == scope of component
            this.defaultAttrs( $.extend( {}, defaultAttrs ) );
            this.after('initialize', _install);

            this._userParamsObject = {};
            this.$element = null;

            this.validate = function () {
                var isValid = this.isValid();
                this.$node.data( 'isValid', isValid );
            };

            this.getValue = function () {
                this._userParamsObject[ 'mail.from' ] = this.$element.back.from.val();
                this._userParamsObject[ 'mail.subject' ] = this.$element.back.subject.val();
                this._userParamsObject[ 'mail.to' ] = this.$element.back.emailAddress.val();
                this._userParamsObject[ 'mail.message' ] = this.$element.back.message.val();

                var value = {
                        'userParams' : _userParamsObjectToArray( this._userParamsObject )
                    },
                    data = {
                        'value': value
                    };

                return data;
            };

            this.valueChange = function () {
                this.trigger( 'valueChange', this.getValue() );
            };

            this.isValid = function () {
                var userParam = this._userParamsObject,
                    a, b, c, d;

                a = b = c = d = false;

                if (
                    userParam[ 'mail.from' ] &&
                    userParam[ 'mail.subject' ] &&
                    userParam[ 'mail.to' ] &&
                    userParam[ 'mail.message' ]
                ) {
                    a = ( userParam[ 'mail.from' ].length > 0 );
                    b = ( userParam[ 'mail.subject' ].length > 0 );
                    c = ( userParam[ 'mail.to' ].length > 0 );
                    d = ( userParam[ 'mail.message' ].length > 0 );
                }

                return ( a && b && c && d );
            };
        }

        function _install () {
            var frontTpl = $( FRONT_TPL ),
                backTpl = $( BACK_TPL );
            // this == scope of element in component
            this.$front.find( '.body' ).append( frontTpl );
            this.$back.find( '.body' ).append( backTpl );

            var element = this.$element = {
                back : {
                    from : $( backTpl ).find( 'input.email-from' ),
                    subject : $( backTpl ).find( 'input.email-subject' ),
                    emailAddress : $( backTpl ).find( 'input.email-address' ),
                    message : $( backTpl ).find( '.email-message' ),
                    token : $( backTpl[ 2 ] )
                },
                front : {
                    emailAddress : $( frontTpl[ 0 ] ),
                    subject : $( frontTpl[ 1 ] ),
                    message : $( frontTpl[ 2 ] )
                }
            };

            this.$back.find( '.email-subject-label' ).html( this.attr.locales.subject );
            this.$back.find( '.email-address-label' ).html( this.attr.locales.to );

            var userParamsObject = this._userParamsObject = _userParamsToObject( this.attr.actionData.userParams );

            this.$back.on( 'click', _stopPropagation );

            //@TODO
            //hay que ver porque dublica también los elementos creados inicialmente
            //el siguiente método de borrado no debería ser necsario
            element.back.token.html( '' );
            $.each( this.attr.tokens, _addToken( element ) );

            element.back.subject.on( 'change', _updateElementOnChange( element.front.subject ) );
            element.back.message.on( 'change', _updateElementOnChange( element.front.message ) );

            var triggerUpdateOnChange = _triggerUpdateOnChange( this );
            element.back.from.on( 'change',  triggerUpdateOnChange ).keyup( triggerUpdateOnChange );
            element.back.emailAddress.on( 'change',  triggerUpdateOnChange ).keyup( triggerUpdateOnChange );
            element.back.subject.on( 'change', triggerUpdateOnChange ).keyup( triggerUpdateOnChange );
            element.back.message.on( 'change', triggerUpdateOnChange ).keyup( triggerUpdateOnChange );

            //set values
            element.back.from.val( userParamsObject[ 'mail.from' ] );
            element.back.subject.val( userParamsObject[ 'mail.subject' ] );
            element.back.emailAddress.val( userParamsObject[ 'mail.to' ] );
            element.back.message.val( userParamsObject[ 'mail.message' ] );

            element.front.subject.text( userParamsObject[ 'mail.subject' ] );
            element.front.message.text( userParamsObject[ 'mail.message' ] );

            $( '.email-subject-label', this.$node ).html( this.attr.locales.subject );
            $( '.email-address-label', this.$node ).html( this.attr.locales.to );

            var node = this.$node,
                insertInMessage = true;

            $( node.parent() ).on( 'click', function () {
                node.removeClass( 'flip' );
            } );

            $( element.back.subject ).focus( function () {
                insertInMessage = false;
            } );

            $( element.back.message ).focus( function () {
                insertInMessage = true;
            } );

            $( element.back.token ).on( 'click', '.token', function () {
                var token = $( this ).text().replace( TOKEN_SYMBOL,'' ),
                    value = TOKEN_VALUE_TPL_START+token+TOKEN_VALUE_TPL_END,
                    toElement = element.back.message;

                if ( ! insertInMessage ){
                    toElement = element.back.subject;
                }

                _insertAt( toElement[ 0 ], value );
                element.back.message.change();
                toElement.focus();
            } );

            this.validate();
        }

        function _stopPropagation ( e ) {
            e.stopPropagation();
        }

        function _addToken ( element ) {
            return function( index, name ) {
                var ele = _makeSymbolElement( name );
                element.back.token.append( ele );
            };
        }

        function _makeSymbolElement ( name ) {
            var ele = $( TOKEN_TPL ).text( TOKEN_SYMBOL + name );

            return ele;
        }

        function _updateElementOnChange ( elementTo ) {
            var callbackToEvent = function () {
                var value = $( this ).val();
                elementTo.text( value );
            };

            return callbackToEvent;
        }

        function _triggerUpdateOnChange ( card ) {
            return function () {
                card.validate();
                card.valueChange();
            };
        }

        function _insertAt ( element, value ) {
            var sel, startPos, endPos, newPos;
            //IE support
            if ( document.selection ) {
                element.focus();
                sel = document.selection.createRange();
                sel.text = value;
            }
            //MOZILLA and others
            else if ( element.selectionStart || element.selectionStart === '0' ) {
                startPos = element.selectionStart;
                endPos = element.selectionEnd;
                newPos = ( startPos + value.length );
                element.value = [ element.value.slice( 0, startPos ), value, element.value.slice( endPos ) ].join( '' );
                element.selectionStart = element.selectionEnd = newPos;
            } else {
                element.value += value;
            }
        }

        function _userParamsToObject ( params ) {
            var obj = {};
            $.each( params, function ( i,o ) {
                obj[ o.name ] = o.value;
            } );

            return obj;
        }

        function _userParamsObjectToArray ( obj ) {
            var name, arr=[];
            for ( name in obj ) {
                arr.push( {
                    'name': name,
                    'value':obj[ name ]
                } );
            }

            return arr;
        }

        return ComponentManager.extend( Card, 'SendEmail', SendEmail, DataBinding );
    }
);
