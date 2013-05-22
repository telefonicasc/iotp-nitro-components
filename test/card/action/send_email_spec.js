describeComponent('components/card/action/send_email.js', function () {
    var data = {
        cssClass: 'm2m-card-action m2m-card-send-email',
        header: 'Send Email',
        component: 'SendEmail',
        tokens: ['aa', 'bb', 'cc', 'dd']
    };

    var $element = null;
    // initialize the component and attach it to the DOM
    beforeEach(function(){
        setupComponent(data);
        $element = this.component.$element;
    });

    it('has $element attr', function(){
        expect($element).toEqual(jasmine.any(Object));
    });

    it('draw tokens', function(){
        var tokenContainer = $element.back.token;
        var value = '+aa+bb+cc+dd';

        expect(tokenContainer).not.toBeUndefined();
        expect(tokenContainer.text()).toEqual(value);
    });

    it('update emailAddress in front card', function(){
        var value = 'test@test.com';
        $element.back.emailAddress.val(value);
        $element.back.emailAddress.trigger('change');

        expect($element.front.emailAddress).toHaveText(value);

    });

    it('update subject in front card', function(){
        var value = 'subjectTest';
        $element.back.subject.val(value);
        $element.back.subject.trigger('change');

        expect($element.front.subject).toHaveText(value);
    });

    it('update message in front card', function(){
        var value = 'messageTest';
        $element.back.message.val(value);
        $element.back.message.trigger('change');

        expect($element.front.message).toHaveText(value);
    });

});