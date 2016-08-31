(function() {
    'use strict';
    
    angular.module('Dashboard')
        .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['$interval', '$mdDialog', 'commonService', 'dashboardService'];

    function dashboardController($interval, $mdDialog, commonService, dashboardService) {
      var vm = this;
      vm.openMediaPlayer = openMediaPlayer;

      /* ======================================== Var ==================================================== */
      vm.widget = {
        dateTime: {
          date: '',
          time: ''
        }
      }
      vm.misc = {};

      /* ======================================== Services =============================================== */
      var svc = dashboardService;
      var cmnSvc = commonService;
      var mdDialog = $mdDialog;
      var interval = $interval;

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
      function getCurrentDate() {
        vm.widget.dateTime.date = cmnSvc.getDateInDDMMMMYYYY(Date.now());
      }

      function getCurrentTime() {
        var d = new Date();
        vm.widget.dateTime.time = getAs2DigitString(d.getHours()) + ':' + getAs2DigitString(d.getMinutes()) + ':' + getAs2DigitString(d.getSeconds());
      }

      function getAs2DigitString(val) {
        if (val.toString().length == 1) {
          return '0'+val;
        } else {
          return val;
        }
      }

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
        interval(function() {
          getCurrentDate();
          getCurrentTime();
        }, 1000)
      }

      init();
    }
})();