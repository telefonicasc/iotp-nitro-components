define(
    [
        'components/component_manager',
        'components/mixin/template'
    ],

    function(ComponentManager, Template) {

        return ComponentManager.create('BorderCollapsablePanel',
            Template, SlidingPanel);

        function SlidingPanel() {

            this.defaultAttrs({
                tpl: '<div class="toggle-button"></div>' +
                         '<div class="panel-content"></div>',
                nodes: {
                    'toggle': '.toggle-button',
                    'content': '.panel-content'
                },

                horizontal: true,
                showToggle: false
            });

            this.after('initialize', function() {
                this.$node.addClass('border-panel');

                if (this.attr.horizontal) {
                    this.$node.addClass('horizontal-panel');
                } else {
                    this.$node.addClass('vertical-panel');
                }

                this.expanded = true;

                if (!this.attr.showToggle) {
                    this.$toggle.hide();
                }

                this.$toggle.on('click', $.proxy(function() {
                    this.trigger('toggle');
                }, this));

                this.on('expand', function() {
                    if (!this.expanded) {
                        this.toggle();
                    }
                });

                this.on('collapse', function() {
                    if (this.expanded) {
                        this.toggle();
                    }
                });

                this.on('toggle', function() {
                    this.toggle();
                });
            });

            this.toggle = function() {
                if (this.attr.horizontal) {
                    this.$content.animate({ width: 'toggle' });
                } else {
                    this.$content.animate({ height: 'toggle' });
                }
                this.expanded = !this.expanded;
            };
        }
    }
);
