/**
Add scroll in child, define in parameter. Use `$.jScrollPane()`;

@name ScrollableMixin
*/
define(
    [
        'libs/jquery.jscrollpane.min'
    ],
    function() {
        function ScrollableMixin() {

            this.bindScroll = function(selector, options){
                var ele = this.$node;
                if( $.type(selector) === 'string' ){
                    ele = ele.find(selector);
                }else if( selector instanceof jQuery ){
                    ele = selector;
                }
                return ele.jScrollPane(options);
            };

            this.defaultAttrs({
                /*
                scroll:{
                    selector:'',
                    options: {}
                }
                */
            });

            this.after('initialize', function() {
                if( this.attr.scroll ){
                    this.bindScroll( this.attr.scroll.selector, this.attr.scroll.options );
                }
            });
        }
        return ScrollableMixin;
    }
);