(function () {
  'use strict';
    
	angular.module('Dashboard', [])
		.config(function ($stateProvider) {
			$stateProvider
				.state('dashboard', {
            url: '/dashboard',
            views: {
              'main': {
                templateUrl: './modules/dashboard/dashboard.html',
                controller: 'dashboardController',
                controllerAs: 'vm'
              }
            }
          });
          /** The below shows how to load a view within 'root.html'
           *  This is because this will be a child state of root.html
           *  params is the way you can pass data around the state.
           *      - To pass the data: $state.go('root.sample', {data: 'lala'});      <= This is handled in commonService.goToPage(...)
           *      - To fetch the data passed to sampleController: $stateParams       <= This is handled in commonService.getStateParam()
           */
          // .state('root.sample', {
          //     url: 'sample',       <= the url here will be: /root/sample
          //     params: {
          //         data: null,
          //     },
          //     views: {
          //         'subMain': {     <= This means load this bottom view into the subMain named ui-view
          //             templateUrl: './modules/sample/sample.html',
          //             controller: 'sampleController',
          //             controllerAs: 'vm'
          //         }
          //     }
          // });
		})
})();