(function(){
	'use strict';

	angular.module('Core', [
			'ngSanitize',
			// 'ngTouch', // This is not compatible with ngMaterial
			'ngAnimate',
			'ui.router',
      'pascalprecht.translate',
      'ngMaterial'
		]);
})();