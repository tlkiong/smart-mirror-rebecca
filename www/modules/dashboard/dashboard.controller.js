(function() {
    'use strict';
    
    angular.module('Dashboard')
        .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['$mdDialog', 'commonService', 'dashboardService'];

    function dashboardController($mdDialog, commonService, dashboardService) {
      var vm = this;
      vm.openMediaPlayer = openMediaPlayer;

      /* ======================================== Var ==================================================== */
      vm.misc = {};

      /* ======================================== Services =============================================== */
      var svc = dashboardService;
      var cmnSvc = commonService;
      var mdDialog = $mdDialog;

      /* ======================================== Public Methods ========================================= */
      function openMediaPlayer(ev) {
        mdDialog.show({
          controller: DialogController,
          templateUrl: 'modules/dashboard/mediaPlayer.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: true
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      }


      /* ======================================== Private Methods ======================================== */
      function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
      }

      function init() {
          
      }

      init();
    }
})();