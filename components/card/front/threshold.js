/**
 * @component CardFrontThreshold
 *
 * @event {in} updateLevel. Listen update level value
 * @event {in} updatePhenomenon. Listen update phenomenon value
 *
 * @mixin Template
 * 
 */

define(
    [
        'components/component_manager',
        'components/mixin/template'
    ],

    function(ComponentManager, Template) {
        

        function CardFrontThreshold() {
            
            this.defaultAttrs({
                tpl: '<div class="m2m-card-threshold">' +
                    '<div class="m2m-card-threshold-phenomenon"></div>' +
                    '<div class="m2m-card-threshold-level"></div>' +
                    '</div>'
            });
            
            this.after('initialize', function() {
                this.on('updateLevel', $.proxy(function(e, o) {
                   this.$node.find('.m2m-card-threshold-level').html(o.level);
               }, this));
               
               this.on('updatePhenomenon', $.proxy(function(e, o) {
                   this.$node.find('.m2m-card-threshold-phenomenon').html(o.phenomenon);
               }, this));
            });
        }
             
        return ComponentManager.create('CardFrontThreshold', CardFrontThreshold, Template);
    }
);