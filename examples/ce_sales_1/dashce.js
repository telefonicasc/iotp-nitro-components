'use strict';

var DashCE = (function () {

	//var apiUrl = 'http://localhost/dashce/';
	var apiUrl = 'http://10.95.28.112:8080/dashce/';

	var doQuery = function(cb, from, to){
		var uris = ['data/bundles.json', 'data/accounts.json'];
      	uris = getAllDataUris();

		if (from && to){
			uris = getDataUris(from, to);
		}

		$.when( $.getJSON(uris[0]), $.getJSON(uris[1]) ).done(function(res1, res2) {
	        var data = createDataObject(res1, res2)
	        cb(data);
	    }).fail(function(e) {
	        alert('Error fetching data from server');
	    });
	};

	var createDataObject = function(bundlesData, accountsData){
		var data = {
		        totalRegistered: [],
		        onlineRegistered: [],
		        visitors: [],
		        registrations: [],
		        deactivations: [],
		        bundleSales: [],
		        bundleSalesSum: []
		      }

		var results = bundlesData[0].results;
		$.each(results, function(i, item) {
		  var obj = { date: item.ts.$date, value:{} };
		  var objSum = { date: item.ts.$date, value: 0 };
		  $.each(item.type, function(j, bundle){
		      obj.value[bundle.name] = bundle.purchased;
		      objSum.value = objSum.value + bundle.purchased;
		  });
		  data['bundleSales'].push(obj);
		  data['bundleSalesSum'].push(objSum);
		});

		results = accountsData[0].results;
		var sumRegistered = 0;
		var sumOnlineRegistered = 0;
		$.each(results, function(i, item) {
		  sumRegistered += item.new_registers.count;
		  sumOnlineRegistered += item.online.count;
		  data['registrations'].push({ date: item.ts.$date, value:item.new_registers.count });
		  data['totalRegistered'].push({ date: item.ts.$date, value:sumRegistered });
		  data['onlineRegistered'].push({ date: item.ts.$date, value:sumOnlineRegistered });
		  data['deactivations'].push({ date: item.ts.$date, value:item.deactivations });
		  data['visitors'].push({ data: item.ts.$date, value: item.visitors.newly_registered})
		});

		return data;
	};

	var getAllDataUris = function(){
		var to = new Date().getTime();
		var uriBundles = encodeURI(apiUrl+'bundles/_find?batch_size=1000&criteria={"ts": {"$lte": {"$date" : '+to+'}}}');
		var uriAccounts = encodeURI(apiUrl+'accounts/_find?batch_size=1000&criteria={"ts": {"$lte": {"$date" : '+to+'}}}');
		return [uriBundles, uriAccounts];
	};

	var getDataUris = function(from, to){
		var uriBundles = encodeURI(url+'bundles/_find?batch_size=1000&criteria={"ts": {"$gte": {"$date" : '+from+'}, "$lte": {"$date" : '+to+'}}}');
        var uriAccounts = encodeURI(url+'accounts/_find?batch_size=1000&criteria={"ts": {"$gte": {"$date" : '+from+'}, "$lte": {"$date" : '+to+'}}}');
        return [uriBundles, uriAccounts];
	};

	return {
		doQuery: doQuery
	}

}());