(function() {
    'use strict';
    
    angular.module('Dashboard')
        .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['commonService', 'dashboardService'];

    function dashboardController(commonService, dashboardService) {
      var vm = this;

      /* ======================================== Var ==================================================== */
      vm.misc = {};

      /* ======================================== Services =============================================== */
      var svc = dashboardService;
      var cmnSvc = commonService;

      /* ======================================== Public Methods ========================================= */

      /* ======================================== Private Methods ======================================== */
      function init() {
          
      }

      init();
    }
})();