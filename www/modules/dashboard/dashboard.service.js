(function() {
	'use strict';
	
	angular.module('Dashboard')
		.service('dashboardService', dashboardService);

		dashboardService.$inject = [];
		function dashboardService() {
			var service = this;

			/* ======================================== Var ==================================================== */

      /* ======================================== Services =============================================== */
      function getCurrentWeather() {
      	var dataObj = {
      		lat: '',
      		lon: '',
      		APPID: '923ac7c7344b6f742666617a0e4bd311',
      		units: 'metric'
      	}
      }
      /* ======================================== Public Methods ========================================= */

      /* ======================================== Private Methods ======================================== */
		}

})();