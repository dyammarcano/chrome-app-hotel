particlesJS.load('particles', '../config/particles.json');

var app = angular.module('MainApp', ['primus', 'ui.router', 'uiRouterStyles', 'ui.bootstrap']);

app.config(['$stateProvider', '$urlRouterProvider', 'primusProvider', function ($stateProvider, $urlRouterProvider, primusProvider) {

  var url = '192.168.1.50';

  primusProvider.setEndpoint('http://' + url + ':3000');

  primusProvider.setOptions({
    reconnect: {
      minDelay: 100,
      maxDelay: 60000
    }
  });
  primusProvider.setDefaultMultiplex(false);

  $urlRouterProvider.otherwise('/');

  $stateProvider.state('login', {
    url:'/',
    views: {
      'main@': {
        templateUrl: 'login.html',
        controller: 'loginController'
      },
    },
    data: {
      css: ['../styles/login.css']
    }
  });

  $stateProvider.state('dashboard', {
    url:'/dashboard',
    views: {
      'header@dashboard': {
        templateUrl: 'views/header/header.html'
      },
      'content@dashboard': {
        templateUrl: 'views/dashboard/dashboard.html'
      },
      'sidebar@dashboard': {
        templateUrl: 'views/sidebar/sidebar.html'
      },
      data: {
        css: ['../rdash-angular-master/src/components/rdash-ui/dist/css/rdash.min.css']
      }
    },
    controller: 'dashboardController'
  });

}]);

/*app.factory('socket', ['primusProvider', function (primusProvider) {

  var url = '192.168.1.50';

  primusProvider.setEndpoint('http://' + url + ':3000');

  primusProvider.setOptions({
    reconnect: {
      minDelay: 100,
      maxDelay: 60000,
      retries: 100
    }
  });
  primusProvider.setDefaultMultiplex(false);

}]);*/

/*app.factory('Users', ['$http', function($http) {
  return {
    get: function() {
      return $http.get('data.json').then(function(response) {
        return response.data;
      });
    }
  };
  }
]);*/

/*app.factory('Server', function($http) {
  var obj = {};
  obj.method = function() {
    return $http.get('http://api.node05.comxa.com/?device=5AD9420A');
  };
  return obj;
});*/

/*app.factory('Server', ['$http', function ($http) {
  return {
    get: function () {
      return $http.get('http://api.node05.comxa.com/?device=5AD9420A').then(function (response) {
        return response.data;
      });
    }
  };
}]);*/

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

  this.login = function(credentials) {
    return $http.post('http://192.168.1.50:3000/api/login', {
      username: credentials.email,
      password: credentials.password
    });
    $scope.buttonText = 'Verificando';
    $scope.linkConnect = true;
  };
  login = function(credentials) {

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

/*app.controller('dashboardController', ['$scope', function ($scope) {
  $scope.text = 'dashboard part from controller';
}]);*/

/*app.controller('dashboardController', ['$scope', '$http', '$location', '$rootScope', '$timeout', function($scope, $http, $location, $rootScope, $timeout) {

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
}]);*/

/*app.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
      elm.text(version);
    };
  }
]);

app.filter('interpolate', ['version', function(version) {
  return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }
]);*/