/**
 * @component CardBackThreshold
 *
 * @event {in} change. Listen phenomenon dropdown change
 * @event {in} change. Listen level dropdown change
 *
 * @event {out} valueChange. When phenomenon dropdown change, valueChange in level dropdown is triggered
 * @event {out} phenomenonChange. When phenomenon dropdown change, phenomenonChange is triggered
 * @event {out} levelChange. When level dropdown change, valueChange is levelChange
 *
 * @attr {array} phenomenonData. Array with all phenomenons
 * @attr {String} levelVal. Level value
 * @attr {String} phenomenonVal. Phenomenon value
 * @attr {String} labelCritical.
 * @attr {String} labelMajor.
 * @attr {String} labelAlarmOff.
 *
 */

define(
    [
        'components/component_manager',
         'components/form/dropdown'
    ],

    function(ComponentManager, Dropdown) {

        function CardBackThreshold() {
            this.defaultAttrs({
                phenomenonData: [],
                levelVal: "",
                phenomenonVal: "",
                labelCritical: "",
                labelMajor: "",
                labelAlarmOff: ""
            });

            var tpl = '<div class="m2m-card-threshold">' +
                '<div class="m2m-card-threshold-phenomenon"></div>' +
                '<div class="m2m-card-threshold-level"></div>' +
                '</div>';

            this.after('initialize', function() {

                var phenOptions = _phenomenonOptions(this.attr.phenomenonData);

                this.$node.append(tpl);

                Dropdown.attachTo(this.$node.find('.m2m-card-threshold-phenomenon'), {
                    options: phenOptions
                });

                Dropdown.attachTo(this.$node.find('.m2m-card-threshold-level'), {
                    options: [
                     {
                        label: '',
                        value: ''
                    },
                    {
                        label: this.attr.labelCritical,
                        value: '${device.asset.UserProps.threshold.major}'
                    },{
                        label: this.attr.labelMajor,
                        value: '${device.asset.UserProps.threshold.critical}'
                    },{
                        label: this.attr.labelAlarmOff,
                        value: '${device.asset.UserProps.threshold.alarmOff}'
                    }]
                });

                var phenomenonEl = this.$node.find('.m2m-card-threshold-phenomenon> select');
                var levelEl = this.$node.find('.m2m-card-threshold-level> select');

                phenomenonEl.on('change', $.proxy(function() {
                    this.trigger('phenomenonChange', {
                        phenomenon: phenomenonEl.find(':selected').attr('attr'),
                        value: phenomenonEl.val()
                    });

                    levelEl.trigger('valueChange', {value: levelEl.val()});
                }, this));

                levelEl.on('change', $.proxy(function() {
                     this.trigger('levelChange', {level: levelEl.find(':selected').text()});
                }, this));

                if (this.attr.phenomenonVal && this.attr.levelVal) {
                    // Load card level and card phenomenon in back
                    phenomenonEl.val(this.attr.phenomenonVal);
                    levelEl.val(this.attr.levelVal);

                    // Trigger phenomenon and level dropdowns change, to paint front card
                    setTimeout(function() {
                        phenomenonEl.trigger('change');
                        levelEl.trigger('change');
                    }, 0);
                }
            });

            function _phenomenonOptions (pheData) {
                var options = [];

                $.each(pheData, function(i, data) {
                    var unit = (data.sensorData.uom && data.sensorData.uom != "Unknown") ? ' (' + data.sensorData.uom + ')': '';
                    var opt = {
                        label: data.sensorData.measureName + unit,
                        value: data.sensorData.phenomenonApp,
                        attr: JSON.stringify(data)
                    }
                    options.push(opt);
                });
                options.unshift({
                        label: '',
                        value: '',
                        attr: '{"type": "SensorCard","model": "","sensorData": {"measureName": "","phenomenonApp": "","phenomenon": "","dataType": "","uom": ""}}'
                 });

                return options;
            }

        }

        return ComponentManager.create('CardBackThreshold', CardBackThreshold);
    }

);