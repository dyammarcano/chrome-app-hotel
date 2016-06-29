/**
 * main angular app 
 */

angular.module('mainApp', ['ui.router', 'uiRouterStyles', 'ui.bootstrap', 'ngAnimate'])

  /*.run(function ($rootScope, $state, AuthService) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      if (toState.authenticate && !AuthService.isAuthenticated()){
        // User isn’t authenticated
        $state.transitionTo("login");
        event.preventDefault(); 
      }
    });
  })*/
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouteProvider) {
      
    $urlRouteProvider.otherwise('/');

    $stateProvider
      .state('startup', { 
        url: '/',
        templateUrl: 'login.html', 
        controller: 'loginController', 
        //authenticate: false,
        data: {
          css: ['../styles/sandstone.css', '../styles/login.css']
        }
      })
      .state('dashboard', {
        resolve: {
          'check': function($location, $rootScope) {
            if (!$rootScope.loggedIn) {
              $location.path('/');
            } 
          }
        }, 
        templateUrl: 'dashboard.html', 
        controller: 'dashboardController', 
        //authenticate: true,
        data: {
          css: ['../styles/sandstone.css', '../styles/dashboard.css']
        }
      });
  }
])
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

  $rootScope.contents = null;

  $http.get('../config/app.json')
    .success(function(data) {
      $rootScope.contents = data;
    })
    .error(function(data,status,error,config){
      $rootScope.contents = [{ heading:"Error", description:"Could not load json   data" }];
    });

  //console.log($rootScope.contents);

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

  console.log($rootScope.contents);
  
  $scope.logout = function() {
    $rootScope.loggedIn = false;
    return $location.path('/');
  };
  var updateTime = function() {
    $scope.date.raw = new Date();
    $timeout(updateTime, 1000);
  };
  updateTime();
})
.directive('appVersion', [
  'version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }
])
.filter('interpolate', [
  'version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }
]);