define(
    [
        'components/component_manager',
        'components/slider'
    ],

    function(ComponentManager, Slider) {

        return ComponentManager.create('RuleEditorToolbar',
            RuleEditorToolbar);

        function RuleEditorToolbar() {

            this.defaultAttrs({

            });

            this.after('initialize', function() {

                this.$node.addClass('rule-bottom-toolbar');
                this.$node.addClass('border-panel vertical-panel');

                this.$cardButtons = $('<div>')
                        .addClass('card-buttons')
                        .appendTo(this.$node);

                this.$conditionsButton = $('<div>')
                        .addClass('conditions-button')
                        .html('Conditions')
                        .appendTo(this.$cardButtons);

                this.$actionsButton = $('<div>')
                        .addClass('actions-button')
                        .html('Actions')
                        .appendTo(this.$cardButtons);

                this.$zoom = $('<div>')
                        .addClass('zoom')
                        .appendTo(this.$node);

                this.$zoomSlider = $('<div>').appendTo(this.$zoom);
                Slider.attachTo(this.$zoomSlider, {
                    showSliderLabel: false,
                    showSliderValue: false,
                    sliderMinLabel: '-',
                    sliderMaxLabel: '+'
                });

                // TODO: Temporaly removed because this is not
                // supported yet
                this.$zoom.hide();

                this.$zoomSlider.on('valueChange', $.proxy(function(e, o) {
                    this.trigger('zoomChange', { zoomLevel: o.value });
                }, this));

                this.$conditionsButton.on('click', $.proxy(function() {
                    this.trigger('conditionsSelected');
                }, this));

                this.$actionsButton.on('click', $.proxy(function() {
                    this.trigger('actionsSelected');
                }, this));

                this.on('conditionsSelected', $.proxy(function() {
                    this.$conditionsButton.toggleClass('selected');
                    this.$actionsButton.removeClass('selected');
                }, this));

                this.on('actionsSelected', $.proxy(function() {
                    this.$conditionsButton.removeClass('selected');
                    this.$actionsButton.toggleClass('selected');
                }, this));

                this.$zoomSlider.trigger('valueChange', { value: 100 });
            });
        }

    }
);
