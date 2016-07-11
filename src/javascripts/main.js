require('angular');
require('moment');
var _ = require('lodash');
require('angular-sweetalert');
require('angular-bootstrap');
require('angular-ui-router');
require('angular-moment');
require('angular-chrome-messaging');

function OptionsController(ChromeBindings, ChromeMessaging) {
  // Bind `ChromeMessagingExample.user` to `OptionsController.user`
  this.user = {};
  ChromeBindings.bindVariable('ChromeMessagingExample', 'user').to(this, 'user');

  var vm = this;

  vm.inputEmail = '';
  vm.inputName = '';

  vm.login = function () {
    ChromeMessaging.callMethod('ChromeMessagingExample', 'login', {
      email: vm.inputEmail,
      name: vm.inputName
    }).then(function (user) {
      console.log('Logged in as:', user);
    });
  };
}

var app = angular.module('MainApp', ['ui.router', 'ui.bootstrap', 'oitozero.ngSweetAlert', 'angularMoment']);

//https://www.youtube.com/watch?v=BNtw6P77qpE
//http://gohooey.com/demo/sidebar/bootstrapnavigation/hoedemo.html

app.constant('API', 'http://192.168.1.50:3000');


app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');

  //console.log(this);

  $stateProvider.state('login', {
    url:'/',
    views: {
      'content': {
        templateUrl: 'login.html',
        controller: 'loginController'
      }
    }
  });


  $stateProvider.state('home', {
    url:'/home',
    resolve : {
      headerButtons: function ($http) {
        return $http.get('../config/header.json').then(
          function (response) {
            return response;
          });
      },
      sidebarButtons: function ($http) {
        return $http.get('../config/sidebar.json').then(
          function (response) {
            return response;
          });
      }
    },
    views: {
      'header': {
        //abstract: true,
        templateUrl: 'header.html',
        controller: 'headerController',
      },
      'content': {
        templateUrl: 'home.html',
        controller: 'homeController',
      },
      'sidebar': {
        //abstract: true,
        templateUrl: 'sidebar.html',
        controller: 'sidebarController',
      }
    }
  });


  $stateProvider.state('home.info', {
    url:'/info',
    resolve : {
      accountInfo: function ($http) {
        return $http.get(API + '/api/account/user').then(
          function (response) {
            return response;
          });
      }
    },
    views: {
      'header': {
        //abstract: true,
        templateUrl: 'header.html',
        controller: 'headerController',
      },
      'content': {
        templateUrl: 'home.html',
        controller: 'homeController',
      },
      'sidebar': {
        //abstract: true,
        templateUrl: 'sidebar.html',
        controller: 'sidebarController',
      }
    }
  });

}]);


app.controller('headerController', ['$scope', 'headerButtons', function ($scope, headerButtons) {
  $scope.header  = headerButtons.data;
  //console.log(headerButtons.data);
}]);

app.controller('homeController', ['$scope', function ($scope) {

}]);

app.controller('sidebarController', ['$scope', 'sidebarButtons', function ($scope, sidebarButtons) {
  $scope.sidebar = sidebarButtons.data[200];
  console.log(sidebarButtons.data);
}]);


/*app.run(['$http', function (amMoment) {
  amMoment.changeLocale('es');
}]);*/

/*app.factory('httpRequestInterceptor', function () {
  return {
    request: function (config) {
      config.headers['Authorization'] = 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==';
      config.headers['Accept'] = 'application/json;odata=verbose';
      return config;
    }
  };
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
});*/


app.factory('UserService', function() {
  var defaults = {
    location: 'autoip'
  };
 
  var service = {
    user: {},
    save: function() {
      sessionStorage.presently = angular.toJson(service.user);
    },
    restore: function() {
      // Pull from sessionStorage
      service.user = angular.fromJson(sessionStorage.presently) || defaults
 
      return service.user;
    }
  };
  // Immediately call restore from the session storage
  // so we have our user data available immediately
  service.restore();
  return service;
})


app.controller('loginController', ['$scope', '$timeout', '$http', '$rootScope', 'OptionsController', function ($scope, $timeout, $http, $rootScope, OptionsController) {

  //$scope.messages = [];

  //$scope.conectionStatus = false;
  $scope.textStatus = 'conectando';

  var client = primus.channel('client');

  function check () {
    client.send('check', { status: $scope.conectionStatus })
    console.log('status:', $scope.textStatus)
  }

  var apiConnect = $timeout(check, 5000);
  
  client.on('check', function (spark) {
    $scope.conectionStatus = true;
    $scope.textStatus = 'conectado';
    console.log('status:', $scope.textStatus);
    $timeout.cancel(apiConnect);
  });

  client.on('close', function (spark) {
    $scope.conectionStatus = false;
    $scope.textStatus = 'conectando';
    console.log('status:', $scope.textStatus);
    var apiConnect = $timeout(check, 5000);
  });

  /*$scope.text = 'login part from controller';
  $scope.date = {};

  var updateTime = function() {
    $scope.date.raw = new Date();
    $timeout(updateTime, 1000);
  };

  updateTime();*/

  $rootScope.hideParticles = false;
  $scope.buttonText = 'Ingresar';
  $scope.inputName = 'Correo:';
  $scope.inputPass = 'Contraseña:';
  $scope.bigMessage = 'Hotel EuroBuilding Puerto Ordaz';
  $scope.linkConnect = false;

  /*$scope.statusSection = {
    status: false
  }*/

  $scope.credentials = {
    email: 'dyam.marcano@gmail.com',
    password: '0111100101101111'
  }

  /*$rootScope.contents = null;

  $http.get('../config/app.json')
    .success(function(data) {
      $rootScope.contents = data;
    })
    .error(function(data,status,error,config){
      $rootScope.contents = [{ heading:"Error", description:"Could not load json   data" }];
    });

  console.log($rootScope.contents);*/

  /*this.parseJwt = function(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
  }

  this.saveToken = function(token) {
    $window.localStorage['jwtToken'] = token;
  }

  this.getToken = function() {
    return $window.localStorage['jwtToken'];
  }

  this.isAuthed = function() {
    var token = this.getToken();
    if(token) {
      var params = self.parseJwt(token);
      return Math.round(new Date().getTime() / 1000) <= params.exp;
    } else {
      return false;
    }
  }

  this.logout = function() {
    $window.localStorage.removeItem('jwtToken');
  }*/

  this.login = function(credentials) {
    return $http.post(API + '/api/login', {
      username: credentials.email,
      password: credentials.password
    });
    $scope.buttonText = 'Verificando';
    $scope.linkConnect = true;

    console.log(credentials);

    client.send('auth', credentials);

    client.on('auth', function (spark) {
      console.log(spark);
    });

    $timeout(function() {
      $scope.buttonText = 'Ingresar';
      $scope.linkConnect = false;
      /*if (credentials.email === 'dyam.marcano@gmail.com' && credentials.password === 'admin') {
        $rootScope.user = $rootScope.user;
        $rootScope.loggedIn = true;
        $location.path('/dashboard');
      }*/
    }, 1000);
  };
}]);