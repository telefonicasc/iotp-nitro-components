define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('Dropdown', Dropdown);

        function Dropdown() {

            this.defaultAttrs({
                options: []
            });

            this.after('initialize', function() {

                this.$select = $('<select>').appendTo(this.$node);

                $.each(this.attr.options, $.proxy(function(i, option) {
                    var optionEl = $('<option>')
                        .attr('value', option.value)
                        .data('dataValue', option.value)
                        .html(option.label)
                        .appendTo(this.$select);

                   if (option.attr){
                       optionEl.attr('attr', option.attr)
                   }
                }, this));

                this.$select.on('change', $.proxy(function(e, o) {
                    var dataValue = $(':selected', this.$select).data('dataValue');
                    this.trigger('valueChange', { value: dataValue });
                }, this));

                this.$select.val(this.attr.defaultValue);
            });
        }
    }
);
