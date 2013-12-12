/*
Tooltip

@name Tooltip
*/
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

            this.on('showTooltip', function(e, o){

                var pos = $(o.elem).offset();
                var offset = (o.offset)? o.offset : 0;

                var css = {
                    top: pos.top,
                    left: pos.left + offset
                };

                var self = this;
                this.tooltip.html(o.html);
                this.tooltip.css(css);

                this.tooltip.show();

                this.on('mouseout', function(d) {
                    var obj = (o.fnHide)? { fn: o.fnHide}: {};
                    self.trigger('hideTooltip',  obj);
                });

                if (o.value)
                    fireEvent(o.value.date, 'mouseover');

                e.stopPropagation();

            });

            this.on('hideTooltip', function(e, o){
                if ( o.fn && $.isFunction(o.fn) ) {
                    o.fn();
                }
                $('.tooltip').hide();
            });

            function fireEvent( elemId, eventName ) {
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