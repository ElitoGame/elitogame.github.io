
var app = angular.module('ng_bazaar_app', []);
app.controller('ng_bazaar_ctrl', function($scope) {
    $scope.firstName= "John";
    $scope.lastName= "Doe";
});

window.onready = function(){
    const updater = require(`./bazaarupdater/getbazaardata.js`);
	updater.initialize();
	setInterval(function runupdate() {updater.execute().catch()}, 30 * 1000); //for 30 seconds.
}