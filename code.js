
window.onready = function(){
    const updater = require(`./bazaarupdater/getbazaardata.js`);
    updater.initialize();
	  setInterval(function runupdate() {updater.execute().catch()}, 30 * 1000); //for 30 seconds.
}
