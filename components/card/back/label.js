/**
 * @component CardBackLabel
 *
 * @attr {String} labelTxt. Text showed in the card.
 *
 */

define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {
        function CardBackLabel() {
             this.defaultAttrs({
                 labelTxt: ""
             });
            
             var tpl = '<div class="m2m-card-label"></div>';
             
             this.after('initialize', function() {                 
                 this.$node.append(tpl);
                 this.$node.find('.m2m-card-label').html(this.attr.labelTxt)
             });
        }
        
        return ComponentManager.create('CardBackLabel', CardBackLabel);
    }
)