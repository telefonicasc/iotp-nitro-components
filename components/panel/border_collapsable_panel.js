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

                this.on('expand', function(e, o) {
                    if (!this.expanded) {
                        this.toggle(o && o.duration, o && o.complete);
                    }else if( o && $.isFunction(o.complete) ){
                        o.complete();
                    }
                });

                this.on('collapse', function(e, o) {
                    if (this.expanded) {
                        this.toggle(o && o.duration, o && o.complete);
                    }else if( o && $.isFunction(o.complete) ){
                        o.complete();
                    }
                });

                this.on('toggle', function(e, o) {
                    this.toggle(o && o.duration);
                });
            });

            this.toggle = function(duration, complete) {
                this.expanded = !this.expanded;
                if (this.attr.horizontal) {
                    this.$node.stop(true, true);
                    this.$node.animate({ width: 'toggle' }, {
                        duration: duration,
                        progress: $.proxy(function(anim, progress) {
                            if (this.attr.pushPanel) {
                                this.attr.pushPanel.css({
                                    left: this.$content.width()
                                });
                            }
                        }, this),
                        complete: complete
                    });
                } else {
                    this.$node.animate({ height: 'toggle' });
                }
            };
        }
    }
);
