/**
 * Window
 *
 * @name Window
 *
 * @event show undefined Shows the window
 * @event hide undefined Hides the window
 * @event afterShow undefined Triggered after the window is showed
 * @event afterHide undefined Triggered after the window is hidden
 *
 * @option {String} container 'body' CSS selector for the container of the window
 * @option {boolean} showOnInit false True to show the window when initialized
 * @option {boolean} mask true True to show an opacity mask
 *
 */
define(
    [
        'components/component_manager',
        'components/mixin/container',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, Container, DataBinding) {

        var Window = function() {

            this.defaultAttrs({
                container: 'body',
                showOnInit: false,
                mask: true
            });

            this.after('initialize', function() {
                this.attr.insertionPoint = '.m2m-window-content';
                this.$node.addClass('m2m-window fit');
                this.$node.appendTo($(this.attr.container));
                this.$node.append($('<div>').addClass('m2m-window-content'));

                this.on('show', this.show);
                this.on('hide', this.hide);
                this.on('click', this.onClick);

                if (!this.attr.showOnInit) {
                    this.trigger('hide');
                }

                if (this.attr.mask) {
                    this.$node.addClass('mask');
                }
            });

            this.onClick = function(e) {
                if (e.target === this.node) {
                    this.trigger('hide');
                }
            };

            this.show = function() {
                this.$node.show();
                this.trigger('afterShow');
            };

            this.hide = function() {
                this.$node.hide();
                this.trigger('afterHide');
            };
        };

        return ComponentManager.create('Window', Window,
            Container, DataBinding);
    }
);
