/**
 The container Mixin allows you to create components that can contain another
 components inside. There is also a Container component that it is just
 the a component with the container mixin.

 If you pass an *items* attribute when you create an instance of the component,
 it will add those items to node. For example:
 ```javascript
 $('.blabla').m2mContainer({
    items: [{
        html: 'Hello'
    }, {
        tag: 'span'
        html: 'bye'
    }, {
        component: 'Slider',
        maxValue: 0,
        minValue: 100,
        className: 'myitem' //TODO: maybe cssClass is a better name for this
    }]
})
 ```

 It will create the following html

 ```html
 <div class="blabla">
 <div>Hello</div>
 <span>bye</span>
 <div class="myitem m2m-slider">
 <!-- Slider stuff -->
 </div>
 </div>
 ```

 You can nest containers. If an item has another items inside, and no component
 is set for the item, a Container component will be attached to it.

 The mixin calls "renderItems" function. So if you want to dinamically change
 the items before they get render you can use `this.before('renderItems', ...)`
 or if you want to do something after the items finished rendering you can
 do this.after('renderItems',...)`

 Look at components/dashboard/dashboard.js for an example of this.

 name ContainerMixin

 option {String} tag 'div' Type of tag for the node.
 option {String} html '' Html content of the item
 option {Object} style undefined CSS Style properties for the node
 option {String} component 'container' Name of the component to be applied to the node.
 The item object itself will be passed as options for the component.
 option {String} insertPoint '' By default child items will be inserted as direct childs of the container node.
 You can specify an insertPoint as a jquery selector, if you want child items to be inserted somewhere else
 inside the container nodes.
 option {Array} items undefined You can set array of components for add nodes children of this component

 */
define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        function ContainerMixin() {

            this.renderItems = function() {
                $.each(this.attr.items, $.proxy(function(i, item) {
                    var newNode = $('<' + (item.tag || 'div') + '>');

                    if (item.className) {
                        newNode.addClass(item.className);
                    }

                    if (item.html) {
                        newNode.html(item.html);
                    }

                    if (item.style) {
                        newNode.css(item.style);
                    }

                    if ($.isArray(item.component)) {
                        $.each(item.component, $.proxy(function(i, c) {
                            ComponentManager.get(c).attachTo(newNode, item);
                        }, this));
                    } else if (item.component) {
                        ComponentManager.get(item.component).attachTo(newNode, item);
                    } else if (item.items) {
                        ComponentManager.get('container').attachTo(newNode, item);
                    } else {
                        ComponentManager.get('component').attachTo(newNode, item);
                    }

                    if (this.attr.insertionPoint) {
                        newNode.appendTo($(this.attr.insertionPoint, this.$node));
                    } else {
                        newNode.appendTo(this.$node);
                    }

                    // Prevent render event bubbling to avoid infinit loop
                    newNode.on('render', function() {
                        return false;
                    });

                    if (this.rendered) {
                        newNode.trigger('render');
                    } else {
                        this.on('render', function() {
                            newNode.trigger('render');
                            return false;
                        });
                    }
                }, this));
            };

            this.after('initialize', function() {
                this.attr.items = this.attr.items || [];
                this.renderItems();

                this.on('render', function() {
                    this.rendered = true;
                });

                if (jQuery.contains(document.documentElement, this.node)) {
                    this.trigger('render');
                }
            });
        }
        return ContainerMixin;
    }
);
