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
      function getVideo() {
        var video = document.getElementById('video');
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var tracker = new tracking.ObjectTracker('face');
        tracker.setInitialScale(4);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);
        tracking.track('#video', tracker, { camera: true });
        tracker.on('track', function(event) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          event.data.forEach(function(rect) {
            context.strokeStyle = '#a64ceb';
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
          });
        });
        var gui = new dat.GUI();
        gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
        gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
        gui.add(tracker, 'stepSize', 1, 5).step(0.1);
      }

      function loadCam() {
        var deferred = cmnSvc.$q.defer();

        var video = document.querySelector("#video");
 
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
         
        if (navigator.getUserMedia) {       
          navigator.getUserMedia({
            video: true
          }, function handleVideo(stream) {
              video.src = window.URL.createObjectURL(stream);
              deferred.resolve();
          }, function videoError(e) {
              // do something
              deferred.reject();
          });
        }

        return deferred.promise;
      }

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

        loadCam().then(function(rs){
          getVideo();
        });
      }

      init();
    }
})();