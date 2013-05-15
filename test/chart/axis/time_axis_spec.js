describeComponent('components/chart/axis/time_axis', function () {

    var options = { range: [new Date('Tue Jan 01 2013 00:00:00 GMT+0000 (GMT)'),
                            new Date('Tue March 31 2013 00:00:00 GMT+0000 (GMT)')]};

    beforeEach(function(){
        setupComponent();
    });

    it('given stepType is "day", number of ticks as many days within range', function(){
        setupComponent({stepType: 'day'});
        this.component.trigger('rangeChange', options);
        expect($('.tick').length).toEqual(31+28+31);
    });

    it('given stepType is "month", number of ticks as many months within range', function(){
        setupComponent({stepType: 'month'});
        this.component.trigger('rangeChange', options);
        expect($('.tick').length).toEqual(3);
    });

    it('given stepType is "day" and "stepTick", number of ticks as many days within range', function(){
        setupComponent({stepType: 'day', stepTick: 3});
        this.component.trigger('rangeChange', options);
        expect($('.tick').length).toEqual(Math.floor((31+28+31)/3));
    });

    it('given tickFormat, ticks text format written', function(){
        setupComponent({stepType: 'month', tickFormat: '%B'}); //Format just month name
        this.component.trigger('rangeChange', options);
        expect($('.tick text:first').text()).toEqual('January');
    });

    it('resize is triggered', function(){
        setupComponent({stepType: 'month', tickFormat: '%B'}); //Format just month name
        this.component.trigger('resize', {width: 123, height: 456});
        expect(this.component.width).toEqual(123);
        expect(this.component.height).toEqual(456);
    });


});