define(
    [
        'components/component_manager', 
        'components/mixin/data_binding', 
        'components/card/card', 
        'components/flippable',
        'components/form/dropdown'
   ], 
   
   function(ComponentManager, DataBinding, Card, Flippable, Dropdown) {

    var defaultAttrs = {
      
        // Se definene en Card ya que éste componente extiende de Card y no puede heredar el atributo

        // locales: {
        //    subject: 'Subject',
        //    to: 'To'
        // }
    };
    
    function SendAlarm() {
        
        var backTpl = '<div class="card-header"> Envío de alarma </div>' + 
            '<div class="m2m-action-alarm"></div>';
            
        var frontTpl = '<div class="m2m-action-alarm">' +
            '<div class="m2m-action-alarm-img with-x"></div>';

        this.defaultAttrs($.extend({}, defaultAttrs));

        this.after('initialize', function() {
            
            this.$front.find('.body').append(frontTpl);
            this.$back.find('.body').append(backTpl);
      
            Dropdown.attachTo(this.$back.find('.m2m-action-alarm'), {
                options: [
                    {
                        label: 'Desactivada',
                        value: 'DEACTIVATED'
                    },
                    {
                        label: 'Activada',
                        value: 'ACTIVATED'
                    }
                ]
            });
            
            this.on('valueChange', function(e, selectedVal) {
                var divAlarmImg = this.$front.find('.m2m-action-alarm-img');
                
                if (selectedVal.value == 'DEACTIVATED') {
                    divAlarmImg.removeClass('without-x');
                    divAlarmImg.addClass('with-x');
                } else if (selectedVal.value == 'ACTIVATED') {
                    divAlarmImg.removeClass('with-x');
                    divAlarmImg.addClass('without-x');
                }
            }); 
        });
    }

    return ComponentManager.extend(Card, 'SendAlarm', SendAlarm, DataBinding);
});
