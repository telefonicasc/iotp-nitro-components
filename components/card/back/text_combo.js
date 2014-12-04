define(
    [
        'components/component_manager',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, DataBinding) {
        var dataType = {
            'TEXT':'Text',
            'QUANTITY':'Quantity'
        },
            REGEXP_QUANTITY = /^-?\d+(\.\d*)*?$/,
            isIE8 = ( function () {
                return !! ( ( /msie 8./i ).test( navigator.appVersion ) && ! ( /opera/i ).test( navigator.userAgent ) && window.ActiveXObject && XDomainRequest && ! window.msPerformance );
            } )();

        return ComponentManager.create( 'CardBackTextCombo', DataBinding,
            CardBackTextCombo );

        function CardBackTextCombo () {

            this.defaultAttrs( {
                'dataType': dataType.TEXT
            } );

            this.after( 'initialize', function () {
                this.$node.addClass( 'm2m-card-text' );

                if ( $.isArray( this.attr.inputs ) ) {
                    $.each( this.attr.inputs, $.proxy( this.addInput, this ) );
                } else {
                    this.addInput( null, this.attr );
                }

                this.$node.on( 'keyup change', 'input, select', $.proxy( function ( e ) {
                    var $ele = $( e.currentTarget ),
                        value = $ele.val(),
                        type = $ele.data( 'dataType' );

                    if ( isIE8 ) {
                        if ( ! this.isValid( type, value ) ) {
                            $ele.val( value );
                        }
                    }

                    // Testing value REGEXP Validation
                    if ( $ele.data( 'regExp' ) ) {
                        var regExp = new RegExp( $ele.data( 'regExp' ), 'i' );

                        if ( ! value.match( regExp ) ) {
                            // We have to clear all text, instead last character inserted,
                            // in order to avoid detected keyboard issues with timings.
                            $ele.val( '' );

                            return false;
                        }
                    }

                    // si el input es de tipo "number" devuelve un valor vacío en caso no tener el formato adecuado
                    // dado que el evento "valueChange" redefine el valor (como vacío) no se podía añadir el guión ("-") para números negativos
                    if ( ( type === dataType.TEXT ) || ( ( e.keyCode != 109 )  && ( e.keyCode != 189 ) ) ) {
                        this.trigger( 'valueChange', { value: this.getData() } );
                    }

                }, this ) );

                this.on( 'valueChange', function ( e, o ) {
                    var name;
                    if ( $.isPlainObject( o.value ) ) {
                        for ( name in o.value ) {
                            $( 'input[name=' + name + ']', this.$node ).val( o.value[ name ] );
                        }
                    } else {
                        $( 'input', this.$node ).val( o.value );
                    }

                } );
            } );

            this.getData = function () {
                var $inputs = $( 'input, select', this.$node ),
                    out;

                if ( $.isArray( this.attr.inputs ) ) {
                    out = {};
                    $.each( $inputs, function ( e ) {
                        var name = $( this ).attr( 'name' ),
                            val = $( this ).val();

                        out[ name ] = val;
                    } );
                } else {
                    out = $inputs.val();
                }

                return out;
            };

            this.addInput = function ( index, data ) {
                if ( data.label ) {
                    this.makeLabel( data ).appendTo( this.$node );
                }

                if ( data.type === 'text' ) {
                    this.makeInput( data ).appendTo( this.$node );
                } else if ( data.type === 'dropdown' ) {
                    this.makeDropDown( data ).appendTo( this.$node );
                }
            };

            this.makeLabel = function ( data ) {
                var ele = $( '<label>' ).html( data.label );

                return ele;
            };

            this.makeInput = function ( data ) {
                var ele = $( '<input type="text" />' );

                if ( ! isIE8 && data.dataType === dataType.QUANTITY ) {
                    ele.attr( 'type', 'number' );
                }

                ele.data( 'dataType', data.dataType );
                ele.attr( 'name', data.name || data.label );

                data.placeholder && ele.attr( 'placeholder', data.placeholder );
                data.regExp && ele.data( 'regExp', data.regExp );

                return ele;
            };

            this.makeDropDown = function ( data ) {
                var $ele = $( '<select>' );

                $ele.attr( {
                  'name': data.name || data.label,
                  'class': 'text_combo'
                }  );

                $.each( data.options, $.proxy( function ( i, option ) {
                    var optionEl = $( '<option>' )
                        .attr( 'value', option.value )
                        .data( 'dataValue', option.value )
                        .html( option.label )
                        .appendTo( $ele );

                    if ( option.attr ) {
                        optionEl.attr( 'attr', option.attr )
                    }
                    if ( option.selected ) {
                        optionEl.attr( 'selected', 'selected' );
                        currentValue = option.value;
                    }
                }, this ) );

                /*$ele.on( 'change', $.proxy( function ( e, o ) {
                    var dataValue = $( ':selected', $ele ).data( 'dataValue' );
                    this.trigger( 'valueChange', { value: dataValue } );
                }, this ) );*/

                if ( ! currentValue ) {
                    $ele.val( this.attr.defaultValue );
                }

                return $ele;
            };

            this.isValid = function ( type, value ) {
                var isValid;

                if ( value !== '' && type === dataType.QUANTITY ) {
                    isValid = REGEXP_QUANTITY.test( value );
                } else {
                    isValid = true;
                }

                return isValid;
            };
        }
    }
);
