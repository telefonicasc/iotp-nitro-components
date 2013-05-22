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
                    $('<option>')
                        .attr('value', option.value)
                        .html(option.label)
                        .appendTo(this.$select);
                }, this));

                this.$select.on('change', $.proxy(function(e, o) {
                    this.trigger('valueChange', { value: this.$select.val() });
                }, this));

                this.$select.val(this.attr.defaultValue);
            });
        }
    }
);
