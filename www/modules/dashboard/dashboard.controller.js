(function() {
    'use strict';
    
    angular.module('Dashboard')
        .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['httpRequestService', '$interval', '$mdDialog', 'commonService', 'dashboardService'];

    function dashboardController(httpRequestService, $interval, $mdDialog, commonService, dashboardService) {
      var vm = this;
      vm.openMediaPlayer = openMediaPlayer;

      /* ======================================== Var ==================================================== */
      vm.widget = {
        dateTime: {
          date: '',
          time: ''
        },
        weather: {
          temperature: '', // In degrees Celcius
          humidity: '', // In %
          visibility: '' // In meter
        }
      }
      vm.misc = {
        weatherApiDataObj: {
            lat: '',
            lon: '',
            APPID: '923ac7c7344b6f742666617a0e4bd311',
            units: 'metric'
          }
      };

      /* ======================================== Services =============================================== */
      var svc = dashboardService;
      var cmnSvc = commonService;
      var mdDialog = $mdDialog;
      var interval = $interval;
      var httpReqSvc = httpRequestService;

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
      function getWeatherInformation() {
        httpReqSvc.http('openWeatherApi', undefined, vm.misc.weatherApiDataObj).then(function(rs) {
          vm.widget.weather.temperature = rs.data.main.temp;
          vm.widget.weather.humidity = rs.data.main.humidity;
          vm.widget.weather.visibility = rs.data.main.visibility;
        }, function(er) {});
      }

      function getCurrentLatLon() {
        var deferred = cmnSvc.$q.defer();

        var locationObj = {
          lat: undefined,
          lon: undefined
        }
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function getPosition(position) {
            locationObj.lat = position.coords.latitude;
            locationObj.lon = position.coords.longitude;

            deferred.resolve(locationObj);
          }, function error(error) {
            switch(error.code) {
              case error.PERMISSION_DENIED:
                deferred.reject(undefined);
                break;
              case error.POSITION_UNAVAILABLE:
                httpReqSvc.http('googleLocationSvc').then(function(rs) {
                  locationObj.lat = rs.data.location.lat;
                  locationObj.lon = rs.data.location.lng;
                  deferred.resolve(locationObj);
                })
                break;
              case error.TIMEOUT:
                deferred.reject(undefined);
                break;
              case error.UNKNOWN_ERROR:
                deferred.reject(undefined);
                break;
            }
          })
        }

        return deferred.promise;
      }

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
        getCurrentDate();
        getCurrentTime();

        interval(function() {
          getCurrentDate();
          getCurrentTime();
        }, 1000);

        getCurrentLatLon().then(function(rs) {
          vm.misc.weatherApiDataObj.lat = rs.lat;
          vm.misc.weatherApiDataObj.lon = rs.lon;
          getWeatherInformation();

          var numberOfMinutes = 5 * 60000;

          interval(function() {
            getWeatherInformation();
          }, numberOfMinutes);
        }, function(er) {});
      }

      init();
    }
})();