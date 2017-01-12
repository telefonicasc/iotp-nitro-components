describeComponent('components/card/action/send_email.js', function () {
    var data = {
        cssClass: 'm2m-card-action m2m-card-send-email',
        header: 'Send Email',
        component: 'SendEmail',
        tokens: ['aa', 'bb', 'cc', 'dd']
    };
    var mockData = '{ "type" : "ActionCard" , "actionData" : { "userParams" : [ { "name" : "mail.from" , "value" : ""} , { "name" : "mail.to" , "value" : ""} , { "name" : "mail.subject" , "value" : ""} , { "name" : "mail.message" , "value" : ""}] , "name" : "email" , "type" : "SendEmailAction"} , "id" : "email"}';

    describe('Setup default values', function(){
        var mock = $.extend({}, data, JSON.parse(mockData) );
        var userParams = mock.actionData.userParams;
        var from = userParams[0].value = 'mailfrom@test.com';
        var to = userParams[1].value = 'mailto@test.com';
        var subject = userParams[2].value = 'subjectTest';
        var message = userParams[3].value = 'subjectMessage';
        var $element;

        beforeEach(function(){
            setupComponent(mock);
            $element = this.component.$element;
        });

        it('Front', function(){
            expect($element.front.subject).toHaveText(subject);
            expect($element.front.message).toHaveText(message);

        });
        it('Back', function(){
            var tokens = '+aa+bb+cc+dd';
            expect($element.back.emailAddress).toHaveValue(to);
            expect($element.back.subject).toHaveValue(subject);
            expect($element.back.message).toHaveValue(message);
            expect($element.back.token.text()).toEqual(tokens);
        });
    });

    describe('Change Values', function(){
        var $element = null;
        var spyValueChange = jasmine.createSpy('valueChange');
        // initialize the component and attach it to the DOM
        beforeEach(function(){
            setupComponent(data);
            this.component.$node.on('valueChange', spyValueChange);
            $element = this.component.$element;
        });


        it('Subject', function(){
            var value = 'subjectTest';

            $element.back.subject.val(value);
            $element.back.subject.trigger('change');

            expect(spyValueChange).toHaveBeenCalled();
            expect($element.front.subject).toHaveText(value);
        });

        it('message', function(){
            var value = 'messageTest';

            $element.back.message.val(value);
            $element.back.message.trigger('change');

            expect(spyValueChange).toHaveBeenCalled();
            expect($element.front.message).toHaveText(value);
        });

        it('To', function(){
            var value = 'test@test.com';

            $element.back.emailAddress.val(value);

            expect(spyValueChange).toHaveBeenCalled();
        });
    });

    describe('Method', function(){
        beforeEach(function(){
            setupComponent(data);
        });
        it('validate()', function(){
            var $node = this.component.$node;
            var $element = this.component.$element;

            expect( this.component.validate ).toBeDefined();

            $element.back.emailAddress.val('').change();
            $element.back.subject.val('').change();
            $element.back.message.val('').change();
            $.removeData($node, 'isValid');

            this.component.validate();

            expect(this.component.$node).toHaveData('isValid');
        });

        it('isValid', function(){
            var $back = this.component.$element.back;

            expect( this.component.isValid ).toBeDefined();

            $back.emailAddress.val('test').change();
            $back.subject.val('').change();
            $back.message.val('').change();

            expect( this.component.isValid() ).toEqual(false);

            $back.emailAddress.val('').change();
            $back.subject.val('test').change();
            $back.message.val('').change();

            expect( this.component.isValid() ).toEqual(false);

            $back.emailAddress.val('').change();
            $back.subject.val('').change();
            $back.message.val('test').change();

            expect( this.component.isValid() ).toEqual(false);

            $back.emailAddress.val('tes').change();
            $back.subject.val('test').change();
            $back.message.val('test').change();

            expect( this.component.isValid() ).toEqual(true);
        });

        it('getValue', function(){
            var values = {
                'mail.to':'test.mail.to',
                'mail.subject':'test.mail.subject',
                'mail.message':'test.mail.message'
            };
            var $back = this.component.$element.back;
            var value;

            expect(this.component.getValue).toBeDefined();

            $back.emailAddress.val(values['mail.to']).change();
            $back.subject.val(values['mail.subject']).change();
            $back.message.val(values['mail.message']).change();

            value = this.component.getValue();

            expect( value['value']['userParams'] ).toBeDefined();
            for(var param, i=value.value.userParams.length;i--;){
                param = value.value.userParams[i];
                expect(param.value).toEqual(values[param.name]);
            }
        });

        it('valueChange', function(){
            var spyValueChange = jasmine.createSpy('valueChange');
            this.component.$node.on('valueChange', spyValueChange);

            expect( this.component.valueChange ).toBeDefined();
            this.component.valueChange();
            expect(spyValueChange).toHaveBeenCalled();
        });
    });
});