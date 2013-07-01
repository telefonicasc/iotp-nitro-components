define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/mixin/template',
         'components/form/dropdown'
    ],

    
    function(ComponentManager, DataBinding, Template, Dropdown) {

        function CardBackThreshold() {
            this.defaultAttrs({
                phenomenonData: []
            });
           
            tpl = '<div class="m2m-card-threshold">' + 
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
                        label: 'Nivel grave',
                        value: '${device.asset.userProps.umbral.major}'
                    },{
                        label: 'Nivel crítico',
                        value: '${device.asset.userProps.umbral.critical}'
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
                     levelEl.trigger('levelChange', {level: levelEl.find(':selected').text()});
                }, this));
            }); 
            
            function _phenomenonOptions (pheData) {
                var options = [];
                 
                $.each(pheData, function(i, data) {
                    var opt = {
                        label: data.sensorData.measureName,
                        value: data.sensorData.phenomenonApp,
                        attr: JSON.stringify(data)
                    }
                    options.push(opt);
                }); 
                return options;
            }
        }

        return ComponentManager.create('CardBackThreshold', DataBinding, Template, CardBackThreshold);
    }

);