var app = angular.module('MainApp', ['primus', 'ui.router', 'ui.bootstrap', 'oitozero.ngSweetAlert']);

//https://www.youtube.com/watch?v=BNtw6P77qpE
//http://gohooey.com/demo/sidebar/bootstrapnavigation/hoedemo.html

app.constant('API', 'http://192.168.1.50:3000');


app.config(['$stateProvider', '$urlRouterProvider', 'primusProvider', function ($stateProvider, $urlRouterProvider, primusProvider) {

  /*primusProvider.setEndpoint(API);

  primusProvider.setOptions({
    reconnect: {
      minDelay: 100,
      maxDelay: 60000
    }
  });

  primusProvider.setDefaultMultiplex(false);*/

  $urlRouterProvider.otherwise('/home');


  $stateProvider.state('login', {
    url:'/',
    views: {
      'content': {
        templateUrl: 'login/login.html',
        controller: 'loginCtrl'
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
        templateUrl: 'dashboard/header.html',
        controller: 'headerCtrl',
      },
      'content': {
        templateUrl: 'dashboard/home.html',
        controller: 'homeCtrl',
      },
      'sidebar': {
        //abstract: true,
        templateUrl: 'dashboard/sidebar.html',
        controller: 'sidebarCtrl',
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
        templateUrl: 'dashboard/header.html',
        controller: 'headerCtrl',
      },
      'content': {
        templateUrl: 'dashboard/home.html',
        controller: 'homeCtrl',
      },
      'sidebar': {
        //abstract: true,
        templateUrl: 'dashboard/sidebar.html',
        controller: 'sidebarCtrl',
      }
    }
  });

}]);


app.controller('headerCtrl', ['$scope', 'headerButtons', function ($scope, headerButtons) {
  $scope.header  = headerButtons.data;
  //console.log(headerButtons.data);
}]);

app.controller('homeCtrl', ['$scope', function ($scope) {

}]);

app.controller('sidebarCtrl', ['$scope', 'sidebarButtons', function ($scope, sidebarButtons) {
  $scope.sidebar = sidebarButtons.data[200];
  console.log(sidebarButtons.data);
}]);


/*app.run(['$http', function ($http) {
  config.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3N2ExNjE2MzBhMWQ1MWE2NzQ2ZmQ5OSIsImVtYWlsIjoiZHlhbS5tYXJjYW5vQGdtYWlsLmNvbSIsImZpcnN0X25hbWUiOiJkeWFtIiwiZmlyc3Rfc3VybmFtZSI6Im1hcmNhbm8iLCJkZXBhcnRtZW50IjoiaXQiLCJyb2xlIjoxMDAsInN0YXR1cyI6ImFjdGl2ZSIsImV4cCI6MTQ2ODU2Nzc3MjE0OSwiaWF0IjoxNDY3OTYyOTcyfQ.1jXslDmDsoHXRl6q4B2w7rzSnQdbwCImiRF4yimVq1Y';
  config.headers['Accept'] = 'application/json;odata=verbose';

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

app.controller('loginController', ['primus', '$scope', '$timeout', '$http', '$rootScope', '$location', '$httpParamSerializer', '$window', function (primus, $scope, $timeout, $http, $rootScope, $location, $httpParamSerializer, $window) {

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

  this.parseJwt = function(token) {
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
  }

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