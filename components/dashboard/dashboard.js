/*
Este componente crea una interfaz gráfica con tres regiones delimitadas:

```
__________________________________________________________
|                 |                   |                  |
|  $mainContent   |  $overviewPanel   |  $detailsPanel   |
|                 |                   |                  |
|_________________|___________________|__________________|
```

La idea es que el componente sea capaz de gestionar los eventos de 'itemSelected'
ya que cuando hay un elemento seleccionado $overviewPanel se oculta y se muestra $detailsPanel.
Por defecto el dashboard no tiene ningún item seleccionado, para poder seleccionar o
deseleccionar se hará a traves del evento `'itemSelected'`.

Dentro de cada sección podemos insertar cualquier otro componente ya que extienden de ContainerMixin

__$mainContent__
Contenedor de la izquierda que siempre está visible y en el que normalmente se coloca el mapa
**$overviewPanel** Panel de la derecha donde normalmente se coloca un listado
**$detailsPanel**

_**notas**_
* Para poder mantener seleccionado un Asset cuando se refresca los datos es necesario que el modelo contenda el parámetro 'id'

@name dashboard

@mixin ContainerMixin
@mixin DataBinding

@option {Array} mainContent [] Left section. Ej: map
@option {Object} overviewPanel {} Right section. Ej: list of elememts
@option {Object} detailsPanel {} Right section, show when selected item
@option {Function} itemData null Function for filter item selected data

@event itemselected itemData selected item
@event updateData none trigger for update data
*/

define(
    [
        'components/component_manager',
        'components/mixin/container',
        'components/mixin/data_binding',
        'components/container',
        'components/dashboard/overview_panel',
        'components/dashboard/details_panel'
    ],

    function(ComponentManager, ContainerMixin, DataBinding) {

        function Dashboard() {

            this.defaultAttrs({

            });

            this.findById = function(arr, id){
                return arr.filter(function(item){
                    return (item.id === id);
                }).pop();
            };

            this.updateItem = function(data){
                var itemSelectedId = this.$node.data('intemSelectedId');
                var itemSelected = itemSelectedId && this.findById(data, itemSelectedId);
                var itemData = {'item':itemSelected};
                if(itemSelected){
                    this.sendItemSelectedToDetail(null, itemData);
                    this.$mainContent.children().triggerHandler('itemselected', itemData);
                }else{
                    this.unselectItem();
                    this.$detailsPanel.trigger('collapse', { duration: 0 });
                }
            };

            this.unselectItem = function() {
                //$mainContent send trigger to $detailsPanel
                this.$mainContent.children().trigger('itemselected', {item:null});
                this.$node.removeData('intemSelectedId');
            };

            this.updateData = function() {
                this.attr.data($.proxy(function(data) {
                    this.$node.trigger('valueChange', { value: data });
                    this.updateItem(data);
                }, this));
            };

            this.sendItemSelectedToDetail = function(e, o){
                var item = o.item;
                if (item) {
                    if (this.attr.itemData) {
                        this.attr.itemData(item, $.proxy(function(data) {
                            this.$detailsPanel.trigger('valueChange', {
                                value: data, silent: true
                            });
                        }, this));
                    } else {
                        this.$detailsPanel.trigger('valueChange', {
                            value: item, silent: true
                        });
                    }
                    this.$detailsPanel.trigger('expand');
                    this.$node.data('intemSelectedId', item.id);
                } else {
                    this.$detailsPanel.trigger('collapse');
                }
            };

            this.after('initialize', function() {

                this.before('renderItems', function() {

                    this.attr.items = [{
                        component: 'container',
                        className: 'main-content',
                        items: this.attr.mainContent
                    }];

                    this.attr.items.push($.extend({
                            component: 'overviewPanel',
                        }, this.attr.overviewPanel));

                    if (this.attr.detailsPanel) {
                        this.attr.items.push($.extend({
                            component: 'DashboardDetailsPanel',
                        }, this.attr.detailsPanel));
                    }
                });

                this.after('renderItems', function() {
                    this.$detailsPanel = $('.dashboard-details-panel',
                        this.$node);
                    this.$detailsPanel.trigger('collapse', { duration: 0 });
                    this.$overviewPanel = $('.dashboard-overview-panel', this.$node);
                    this.$mainContent =  $('.main-content', this.$node);
                    this.updateData();

                    this.$node.on('click', '.overview-header', $.proxy(this.unselectItem, this));

                    this.$overviewPanel.on('itemselected',
                        $.proxy(function(e, data){
                            this.$mainContent.children().triggerHandler('itemselected', data);
                        }, this));

                    this.$overviewPanel.on('itemselected',
                        $.proxy(this.sendItemSelectedToDetail, this));

                    this.$mainContent.on('itemselected',
                        $.proxy(this.sendItemSelectedToDetail, this));

                });

                this.on('updateData', function () {
                    this.updateData();
                });
            });
        }

        return ComponentManager.create('dashboard',
            Dashboard, ContainerMixin, DataBinding);

    }

);
