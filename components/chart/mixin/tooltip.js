define(
  [],

  function() {

    return Tooltip;

    function Tooltip() {

        this.after('initialize', function() {

            if (this.attr.tooltip) {
                this.tooltip = $('<div>').addClass('tooltip')
                        .appendTo($('body'));
            }

            this.on('showTooltip', function(e, value){

                var pos = $(value.elem).offset();
                var offset = (value.offset)? value.offset : 0;

                var css = {
                    top: pos.top,
                    left: pos.left + offset
                };

                console.log('pos', pos);
                var self = this;
                this.tooltip.html(value.html);
                this.tooltip.css(css);

                this.tooltip.show();

                this.on('mouseout', function(d) {
                    var o = (value.fnHide)? { fn: value.fnHide}: {};
                    self.trigger('hideTooltip',  o);
                });

                if (value.elemId)
                    fireEvent(value.elemId, 'mouseover');

                e.stopPropagation();

            });

            this.on('hideTooltip', function(e, o){
                if ( o.fn && $.isFunction(o.fn) ) {
                    o.fn();
                }
                $('.tooltip').hide();
            });

            function fireEvent( elemId, eventName ) {
                console.log('fire mouseover', elemId);
                
                var elem = document.getElementById(elemId);
                if( elem != null ){   
                    if(elem.fireEvent) {
                        elem.fireEvent('on'+eventName);     
                    }else {   
                        var evObj = document.createEvent('Events');
                        evObj.initEvent(eventName, true, false);
                        elem.dispatchEvent( evObj );
                    }
                }
            }

        });
    }

  }
);  