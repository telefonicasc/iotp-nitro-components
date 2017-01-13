define(
    [
        'components/component_manager',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, DataBinding) {
        var dataType = {
            'TEXT': 'Text',
            'QUANTITY': 'Quantity'
        },
            REGEXP_QUANTITY = /^-?\d+(\.\d*)*?$/,
            isIE8 = (function() {
                return !! ((/msie 8./i).test(navigator.appVersion) &&
                    ! (/opera/i).test(navigator.userAgent) &&
                    window.ActiveXObject && XDomainRequest &&
                    ! window.msPerformance);
            })();

        function CardBackText() {

            this.defaultAttrs({
                'dataType': dataType.TEXT
            });

            this.after('initialize', function() {

                this.$node.addClass('m2m-card-text');

                if ($.isArray(this.attr.inputs)) {
                    $.each(this.attr.inputs, $.proxy(this.addInput, this));
                } else {
                    this.addInput(null, this.attr);
                }

                this.$node.on('keyup change', 'input', $.proxy(function(e) {
                    var $ele = $(e.currentTarget),
                        value = $ele.val(),
                        type = $ele.data('dataType');

                    if (isIE8) {
                        if (! this.isValid(type, value)) {
                            $ele.val(value);
                        }
                    }

                    // Testing value REGEXP Validation
                    if ($ele.data('regExp')) {
                        var regExp = new RegExp($ele.data('regExp'), 'i');

                        if (! value.match(regExp)) {
                            $ele.val(value.slice(0, -1));

                            return false;
                        }
                    }

                    // si el input es de tipo "number" devuelve un valor vacío en caso no tener el formato adecuado
                    // dado que el evento "valueChange" redefine el valor (como vacío) no se podía añadir el guión ("-")
                    // para números negativos
                    if ((type === dataType.TEXT) || ((e.keyCode !== 109) && (e.keyCode !== 189))) {
                        this.trigger('valueChange', { value: this.getData() });
                    }

                }, this));

                this.on('valueChange', function(e, o) {
                    var name;
                    if ($.isPlainObject(o.value)) {
                        for (name in o.value) {
                            $('input[name=' + name + ']', this.$node).val(o.value[name]);
                        }
                    } else {
                        $('input', this.$node).val(o.value);
                    }

                });
            });

            this.getData = function() {
                var $inputs = $('input', this.$node),
                    out;

                if ($.isArray(this.attr.inputs)) {
                    out = {};
                    $.each($inputs, function(e) {
                        var name = $(this).attr('name'),
                            val = $(this).val();

                        out[name] = val;
                    });
                } else {
                    out = $inputs.val();
                }

                return out;
            };

            this.addInput = function(index, data) {
                if (data.label) {
                    this.makeLabel(data).appendTo(this.$node);
                }

                this.makeInput(data).appendTo(this.$node);
            };

            this.makeLabel = function(data) {
                var ele = $('<label>').html(data.label);

                return ele;
            };

            this.makeInput = function(data) {
                var ele = $('<input type="text" />');

                if (! isIE8 && data.dataType === dataType.QUANTITY) {
                    ele.attr('type', 'number');
                }

                ele.data('dataType', data.dataType);
                ele.attr('name', data.name || data.label);

                data.placeholder && ele.attr('placeholder', data.placeholder);
                data.regExp && ele.data('regExp', data.regExp);

                return ele;
            };

            this.isValid = function(type, value) {
                var isValid;

                if (value !== '' && type === dataType.QUANTITY) {
                    isValid = REGEXP_QUANTITY.test(value);
                } else {
                    isValid = true;
                }

                return isValid;
            };
        }

        return ComponentManager.create('CardBackText', DataBinding,
            CardBackText);

    }
);
