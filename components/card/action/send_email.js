define(
    [
        'components/component_manager',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, DataBinding) {
        return ComponentManager.create('SendEmail', DataBinding, SendEmail);

        function SendEmail() {

            this.after('initialize', function() {
                //install
            });
        }
    }
);
