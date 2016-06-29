angular.module('mainApp', ['ngRoute', 'routeStyles', 'ui.bootstrap', 'ngAnimate', 'mainApp.controllers', 'mainApp.directives', 'mainApp.filters', 'mainApp.services'])

  .config(['$routeProvider', function($routeProvider, $locationProvider) {
      
    $routeProvider

      .when('/', { 
        templateUrl: 'login.html', 
        controller: 'loginController', 
        css: '../styles/login.css' 
      })

      .when('/dashboard', {
        resolve: {
          'check': function($location, $rootScope) {
            if (!$rootScope.loggedIn) {
              $location.path('/');
            } 
          }
        }, 
        templateUrl: 'dashboard.html', 
        controller: 'dashboardController', 
        css: '../styles/dashboard.css' 
      })

      .otherwise({
        redirectTo: '/' 
      });
  }
]);

angular.module('mainApp.controllers', [])

.controller('loginController', function($scope, $timeout, $http, $location, $rootScope) {
  $rootScope.hideParticles = false;
  $scope.buttonText = 'Ingresar';
  $scope.inputName = 'Correo:';
  $scope.inputPass = 'Contraseña:';
  $scope.bigMessage = 'Hotel EuroBuilding Puerto Ordaz';
  $scope.conectionStatus = 'offline';
  $scope.linkConnect = false;

  $scope.credentials = {
    email: 'dyam.marcano@gmail.com',
    password: 'admin'
  };

  var statusServer = function() {
    chrome.storage.local.get('remote', function(resp) {
      if (resp.remote.local_ip !== undefined) {
        $scope.conectionStatus = 'online';      
      } else {
        $scope.conectionStatus = 'offline';
      }
    });
    
    $timeout(statusServer, 2000);
  };

  statusServer();

  $scope.login = function(credentials) {
    $scope.buttonText = 'Verificando';
    $scope.linkConnect = true;
    console.log(credentials);
    $timeout(function() {
      $scope.buttonText = 'Ingresar';
      $scope.linkConnect = false;
      if (credentials.email === 'dyam.marcano@gmail.com' && credentials.password === 'admin') {
        $rootScope.user = $rootScope.user;
        $rootScope.loggedIn = true;
        $location.path('/dashboard');
      }
    }, 1000);
  };
})

.controller('dashboardController', function($scope, $http, $location, $rootScope, $timeout) {
  $rootScope.hideParticles = !$rootScope.hideParticles;

  $scope.date = {};
  
  $scope.logout = function() {
    $rootScope.loggedIn = false;
    return $location.path('/');
  };
  var updateTime = function() {
    $scope.date.raw = new Date();
    $timeout(updateTime, 1000);
  };
  updateTime();
});

angular.module('mainApp.directives', [])

.directive('appVersion', [
  'version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }
]);

angular.module('mainApp.filters', [])

.filter('interpolate', [
  'version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }
]);

var myModule = angular.module('mainApp.services', []).value('version', '0.1');
