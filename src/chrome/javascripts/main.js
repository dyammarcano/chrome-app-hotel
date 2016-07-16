require('angular');
require('moment');
var _ = require('lodash');
require('angular-sweetalert');
require('angular-bootstrap');
require('angular-ui-router');
require('angular-moment');
require('angular-chrome-messaging');
//var OptionsController = require('./app/main/controllers/OptionsController');


angular.module('MainApp', ['ui.router', 'ui.bootstrap', 'oitozero.ngSweetAlert', 'angularMoment']);

//https://www.youtube.com/watch?v=BNtw6P77qpE
//http://gohooey.com/demo/sidebar/bootstrapnavigation/hoedemo.html

angular.module('MainApp').constant('API', 'http://192.168.1.50:3000');


angular.module('MainApp').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider.state('logout', {
    template: 'redirecting',
    controller: 'LogoutController as vm'
  });

  $stateProvider.state('login', {
    url:'/login',
    views: {
      'content': {
        templateUrl: 'login.html',
        controller: 'loginController as vm'
      }
    }
  });


  $stateProvider.state('dashboard', {
    url:'/dashboard',
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
        controller: 'headerController as vm',
      },
      'content': {
        templateUrl: 'home.html',
        controller: 'homeController as vm',
      },
      'sidebar': {
        //abstract: true,
        templateUrl: 'sidebar.html',
        controller: 'sidebarController as vm',
      }
    }
  });


  $stateProvider.state('home.info', {
    url:'dashboard.info',
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
        controller: 'headerController as vm',
      },
      'content': {
        templateUrl: 'home.html',
        controller: 'homeController as vm',
      },
      'sidebar': {
        //abstract: true,
        templateUrl: 'sidebar.html',
        controller: 'sidebarController as vm',
      }
    }
  });
}]);


angular.module('MainApp').controller('LogoutController', ['$location', '$state', function ($location, $state) {
  console.log("logout route");
  alert($state);
  $rootScope.isLoggedIn = false;
  $location.url('/');
  //$state.go('login', {}, { reload : true });
  //$state.go($state.current, $stateParams, {reload: true, inherit: false});
}]);


angular.module('MainApp').controller('headerController', ['headerButtons', function (headerButtons) {
  this.header  = headerButtons.data;

  this.title = 'Panel de Control';

  this.linkClicked = function(link) {
    $location.path(link);
  };

  //console.log(this.header);

  this.current = function () {
    console.log("current");
  };

  this.logout = function () {
    console.log("logout");
  };
}]);


angular.module('MainApp').controller('sidebarController', ['sidebarButtons', function (sidebarButtons) {
  this.sidebar = sidebarButtons.data[100];
  console.log(this.sidebar);
}]);

angular.module('MainApp').controller('homeController', [function () {
  // body...
}]);


/*angular.module('MainApp').run(['$http', function (amMoment) {
  amMoment.changeLocale('es');
}]);*/

/*angular.module('MainApp').factory('httpRequestInterceptor', function () {
  return {
    request: function (config) {
      config.headers['Authorization'] = 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==';
      config.headers['Accept'] = 'application/json;odata=verbose';
      return config;
    }
  };
});

angular.module('MainApp').config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
});*/


angular.module('MainApp').factory('UserService', function() {
  this.defaults = {
    location: 'autoip'
  };
 
  this.service = {
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
});


angular.module('MainApp').controller('loginController', ['$location', '$timeout', '$http', '$rootScope', 'ChromeBindings', 'ChromeMessaging', function ($location, $timeout, $http, $rootScope, ChromeBindings, ChromeMessaging) {
  this.messages = [];

  //this.conectionStatus = false;
  this.textStatus = 'conectando';

  /*this.text = 'login part from controller';
  this.date = {};

  var updateTime = function() {
    this.date.raw = new Date();
    $timeout(updateTime, 1000);
  };

  updateTime();*/

  $rootScope.hideParticles = false;
  this.buttonText = 'Ingresar';
  this.inputName = 'Correo:';
  this.inputPass = 'Contraseña:';
  this.bigMessage = 'Hotel EuroBuilding Puerto Ordaz';
  this.linkConnect = false;

  /*this.statusSection = {
    status: false
  }*/

  this.credentials = {
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

  $rootScope.isLoggedIn = false;

  this.login = function(credentials) {

    ChromeMessaging.callMethod('ChromeMessagingExample', 'login', {
      username: credentials.email,
      password: credentials.password
    }).then(function (data) {
      console.log('Logged in :', data);
      this.isLoggedIn = data;
    });

    this.buttonText = 'Verificando';
    this.linkConnect = true;

    console.log(credentials);

    $timeout(function() {

      if ($rootScope.loggedIn === true) {
        $location.url('/');
      };

      this.buttonText = 'Ingresar';
      this.linkConnect = false;
      /*if (credentials.email === 'dyam.marcano@gmail.com' && credentials.password === 'admin') {
        $rootScope.user = $rootScope.user;
        $rootScope.loggedIn = true;
        $location.path('/dashboard');
      }*/
    }, 1000);
  };
}]);