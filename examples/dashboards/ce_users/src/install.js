ConsumerElectronics.install = function(){
    //Menu
    var menuOptions= {
        name: ConsumerElectronics.PACKAGE_NAME,
        path: ConsumerElectronics.path.DASHBOARD,
        acl: 'dashboard.ce',
        permission: ConsumerElectronics.PERMISSION_GROUP,
        cls: 'btnConsumerElectronic',
        parentCls: ConsumerElectronics.PACKAGE_NAME
    };

    Kermit.menu.add(menuOptions);
    //Dashboard
    var dashboardRouteOptions = {
        'templateUrl':'/packages/' + ConsumerElectronics.PACKAGE_NAME + '/template/dashboard.html',
        'controller':ConsumerElectronics.controller.dashboard
    };
    Kermit.route.addWithTemplate(ConsumerElectronics.path.DASHBOARD, dashboardRouteOptions);
};