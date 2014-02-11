/**
Add scroll;

@name Scroll
*/
define(
    [
        'components/component_manager',
        'components/mixin/template',
        'components/mixin/container',
        'libs/jquery.jscrollpane.min',
        'libs/jquery.mousewheel.min'
    ],
    function(ComponentManager, Template, Container) {
        function Scroll() {

            this.after('initialize', function() {
                var jsp = this.$node.jScrollPane(this.attr.options).data('jsp'),
                    updateFn = function() {
                        jsp && jsp.reinitialise();
                    };
                this.$node.find('[data-bind]').on('valueChange', updateFn);
                this.before('renderItems', updateFn);
                $(window).on('resize', updateFn);
            });
        };

        return ComponentManager.create('scroll', Template, Container, Scroll);
    }
);