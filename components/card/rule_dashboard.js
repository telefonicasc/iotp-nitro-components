define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('RuleDashboard', RuleDashboard);

        function RuleDashboard() {

            this.attr('initialize', function() {
                this.on('valueChange', function(e, o) {
                    var rules = o.value;

                    // Use rules data to generate the rules dashboard
                });
            });
        }
   }
);
