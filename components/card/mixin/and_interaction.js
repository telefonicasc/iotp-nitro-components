define(
  [],

  function() {

    return AndInteraction;

    function AndInteraction() {
      
      this.defaultAttrs({

      });

      this.interactionAreas = [];

      this.after('initialize', function() {
        this.$cardToolbox.on('dragstart', '*', $.proxy(function(e) {
          //console.log('dragStart');
        }, this));

        this.$graphEditor.on('drag', '.node-container > *', $.proxy(function(e) {
          var componentOffset = this.$node.offset()
            , helperOffset = $(e.target).offset()
            , left = helperOffset.left - componentOffset.left
            , top = helperOffset.top - componentOffset.top;

//          console.log(left, top);
        }, this));

        this.$cardToolbox.on('drag', '*', $.proxy(function(e, ui) {
          var componentOffset = this.$node.offset()
            , helperOffset = $(ui.helper).offset()
            , left = helperOffset.left - componentOffset.left
            , top = helperOffset.top - componentOffset.top;

  //        console.log(left, top);
        }, this));
      });
    }
  }
);
