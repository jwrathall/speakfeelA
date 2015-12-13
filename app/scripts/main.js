 //'use strict';	
$(document).ready(function () {
	var forcastKey = 'b5304902651cd612cd747cb5256a1831';
	var currentIP;
	var location;
	
	function GetIPData(){
		$.getJSON('http://jsonip.com/?callback=?', function (data) {
			SetIPData(data);
		});
	}
	function GetGeoData(ip){
		$.getJSON('http://freegeoip.net/json/' + ip + '',function(data){
			SetLocation(data);
		});
	}
	
	function GetForcastData(location){
		var urlPath = 'https://api.forecast.io/forecast/' + forcastKey+ '/' + location.latitude +',' + location.longitude + '';
		 $.ajax({
		     url: urlPath,
		     jsonp: "callback",
		     dataType: "jsonp",
			 data: {
				 units:'si',
				 exclude:'minutely'
			 },
		     success: function( response ) {
				ShowForcast(response);
		     },
			 error:function(e){
				 ShowError();
			 }
		   });
	}
	
	function ShowForcast(response){
		console.log(response);
		//current
		var source   = $("#current-tmpl").html();
		var template = Handlebars.compile(source);
		//daily
		var dailysource   = $("#daily-tmpl").html();
		var dailytemplate = Handlebars.compile(dailysource);
		
		var data = response;
		$('#current').html(template({forcast:data}));
		
		$('#daily').html(dailytemplate({dailyForcast:data}));
	}
	
	function ShowError(){
		var errorSource   = $("#error-tmpl").html();
		var errorTemplate = Handlebars.compile(errorSource);
		$('#error').html(errorTemplate);
		
	}
	
	function SetIPData(json){
		currentIP = json.ip;
		if( currentIP !== 'undefined' ){
			GetGeoData(currentIP);
		}else{
			$('#address').html("Error fetching your IP");
			$('#current').hide();
			$('#daily').hide();	
		}
	}
	function SetLocation(json){
		location = json;

		$('#address').html(location.city + ', '+ location.region_name + ' ' + location.country_name);
		if( location !== 'undefined' ){
			GetForcastData(location);
		}else{
			$('#address').html("Error fetching your Forcast");
			$('#current').hide();
			$('#daily').hide();	
		}
	}
	
	
	GetIPData();
});

Handlebars.registerHelper("average", function(precipProbability) {
  	var average =  parseFloat(precipProbability) *100; 
  	return Math.ceil(average);
});

Handlebars.registerHelper("dateFormat", function(time) {
	var m = moment.unix(time).format("MMM-DD-YYYY");
  	return m;
});

Handlebars.registerHelper("degToDirection",function(windBearing){
	//thank you stack overflow
    var val = Math.floor((parseFloat(windBearing) / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
});
Handlebars.registerHelper("iconClass",function(icon){
	var returnIcon;
	console.log(icon);
	switch(icon){
		case "day-sunny":
			returnIcon = 'wi-forecast-io-clear-day';
			break;
		case "night-clear":
			returnIcon = 'wi-forecast-io-clear-night';
			break;
		case "rain":
			returnIcon = 'wi-forecast-io-rain';
			break;
		case "snow":
			returnIcon = 'wi-forecast-io-snow';
			break;
		case "sleet":
			returnIcon = 'wi-forecast-io-sleet';
			break;
		case "strong-wind":
			returnIcon = 'wi-forecast-io-strong-wind';
			break;
		case "fog":
			returnIcon = 'wi-forecast-io-fog';
			break;
		case "cloudy":
			returnIcon = 'wi-forecast-io-cloudy';
			break;
		case "day-cloudy":
			returnIcon = 'wi-forecast-io-cloudy-day';
			break;
		case "partly-cloudy-day":
			returnIcon = 'wi-forecast-io-partly-cloudy-day';
			break;
		case "partly-cloudy-night":
			returnIcon = 'wi-forecast-io-partly-cloudy-night';
			break;
		default:
			returnIcon = 'wi-no-icon';
		
	}
	console.log(returnIcon);
	return returnIcon;
});

