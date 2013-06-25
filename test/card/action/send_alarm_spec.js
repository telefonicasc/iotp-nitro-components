describeComponent('components/card/action/send_alarm.js', function () {
    var data = {
        cssClass: 'm2m-card-action m2m-card-send-email',
        header: 'Send alarm',
        component: 'SendAlarm',
        locales: {
            deactivated: 'Off',
            activated: 'On',
            sendAlarmBack: 'Send alarm'
        }
    };
            
    var mockData = '{"type": "ActionCard","actionData": {"userParams": [{"name": "alarm.status","value": "dca_support@tid.es"}],"name": "alarm","type": "SendAlarmAction"},"id": "alarm"}';
    
    describe('Setup DEACTIVATE value', function(){
        var mock = $.extend({}, data, JSON.parse(mockData) );
        var userParams = mock.actionData.userParams;
        var status = userParams[0].value = 'DEACTIVATED';
        var $element;
        
        beforeEach(function(){
            setupComponent(mock);
            $element = this.component;
        });
        
        it('Front', function(){
            expect($element.$front.find('.m2m-action-alarm-img')).toHaveClass('with-x');
        });
        
        it('Back', function(){
          expect($element.$back.find('.m2m-action-alarm> select')).toHaveValue('DEACTIVATED');
        });
    });
    
    describe('Setup ACTIVATE value', function(){
        var mock = $.extend({}, data, JSON.parse(mockData) );
        var userParams = mock.actionData.userParams;
        var status = userParams[0].value = 'ACTIVATED';
        var $element;
        
         beforeEach(function(){
            setupComponent(mock);
            $element = this.component;
        });
        
        it('Front', function(){
            expect($element.$front.find('.m2m-action-alarm-img')).toHaveClass('without-x');
        });
        
        it('Back', function(){
          expect($element.$back.find('.m2m-action-alarm> select')).toHaveValue('ACTIVATED');
        });
        
    });
    
    describe('Change Values', function(){
        var $element = null;
        var spyValueChange = jasmine.createSpy('valueChange');
        
        // initialize the component and attach it to the DOM
        beforeEach(function(){
            setupComponent(data);
            this.component.$node.on('valueChange', spyValueChange);
            $element = this.component;
        });
        
        it('status', function(){
            var value = 'ACTIVATED';

            $element.$back.find('.m2m-action-alarm> select').val(value);
            $element.$back.find('.m2m-action-alarm> select').trigger('change');

            expect(spyValueChange).toHaveBeenCalled();
            expect($element.$back.find('.m2m-action-alarm> select')).toHaveValue(value);
        });
    });
});