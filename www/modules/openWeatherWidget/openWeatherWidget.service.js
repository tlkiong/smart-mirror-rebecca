(function() {
	'use strict';
	
	angular.module('Sample')
		.service('sampleService', sampleService);

		sampleService.$inject = [];
		function sampleService() {
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