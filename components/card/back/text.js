define(
    [
        'components/component_manager',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, DataBinding, Template) {
        var dataType = {
            'TEXT':'Text',
            'QUANTITY':'Quantity'
        };
        // CHANGE: IDAS-16037 añadido -? delante 
        var REGEXP_QANTITY = /^-?\d+(\.\d*)*?$/;
        var isIE8 = (function() {
            return !!( (/msie 8./i).test(navigator.appVersion) && !(/opera/i).test(navigator.userAgent) && window.ActiveXObject && XDomainRequest && !window.msPerformance );
        })();

        return ComponentManager.create('CardBackText', DataBinding,
            CardBackText);

        function CardBackText() {

            this.defaultAttrs({
                'dataType': dataType.TEXT
            });

            this.after('initialize', function() {

                this.$node.addClass('m2m-card-text');

                if( $.isArray(this.attr.inputs) ){
                    $.each(this.attr.inputs, $.proxy(this.addInput, this) );
                }else{
                    this.addInput(null, this.attr);
                }

                this.$node.on('keyup change', 'input', $.proxy(function(e) {
                    var $ele = $(e.currentTarget);
                    var value = $ele.val();
                    var type = $ele.data('dataType');
                    if(isIE8){
                        if(!this.isValid(type, value)){
                            $ele.val(value);
                        }
                    }

                    // CHANGE: IDAS-16037
                    // TODO JOHAN: ñapa para que no desaparezca el '-'
                    // habría que buscar mejor opción
                    //
                    // Esto tiene el efecto pernicioso de que si en una tarjeta de 
                    // Quantity dejas sólo un '-', al darle la vuelta no tiene un 0
                    if ( ( type === dataType.TEXT ) || ( ( e.keyCode != 109)  && ( e.keyCode != 189) ) )
                        this.trigger('valueChange', { value: this.getData() });

                }, this));

                this.on('valueChange', function(e,o) {
                    var name;
                    if( $.isPlainObject(o.value) ){
                        for(name in o.value){
                            $('input[name='+name+']', this.$node).val(o.value[name]);
                        }
                    }else{
                        $('input', this.$node).val(o.value);
                    }

                });
            });

            this.getData = function(){
                var $inputs = $('input', this.$node);
                var out;
                if($.isArray(this.attr.inputs)){
                    out = {};
                    $.each($inputs, function(e){
                        var name = $(this).attr('name');
                        var val = $(this).val();
                        out[name] = val;
                    });
                }else{
                    out = $inputs.val();
                }
                return out;
            };

            this.addInput = function(index, data){
                if (data.label) {
                    this.makeLabel(data).appendTo(this.$node);;
                }
                this.makeInput(data).appendTo(this.$node);
            };

            this.makeLabel = function(data){
                var ele = $('<label>')
                    .html(data.label);
                return ele;
            };

            this.makeInput = function(data){
                var ele = $('<input type="text" />');
                if(!isIE8 && data.dataType === dataType.QUANTITY){
                    // CHANGE: IDAS-16037
                    ele.attr('type', 'number')/* .  
                        attr('min', '0'); */
                }
                ele.data('dataType', data.dataType);
                ele.attr('name', data.name || data.label);
                return ele;
            };
            this.isValid = function(type, value){
                var isValid;
                if(value !== '' && type === dataType.QUANTITY){
                    isValid = REGEXP_QANTITY.test(value);
                }else{
                    isValid = true;
                }
                return isValid;
            };
        }

    }
);
