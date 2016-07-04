
var app = angular.module('MainApp', ['btford.socket-io', 'ui.router', 'uiRouterStyles', 'ui.bootstrap']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

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

app.factory('socket', function (socketFactory) {
  return socketFactory({
    ioSocket: io.connect('http://192.168.1.50:3000')
  });
});

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

app.controller('loginController', ['socket', '$scope', '$timeout', '$http', '$rootScope', '$location', function (socket, $scope, $timeout, $http, $rootScope, $location) {

  $scope.messages = [];

  $scope.conectionStatus = false;
  $scope.textStatus ='conectando';
  
  socket.on('connect', function () {

    socket.on('status', function (data) {
      $scope.messages.push(data);
      $scope.conectionStatus = data;
      $scope.textStatus ='conectado';
      //console.log($scope.messages)
    });
  });

  $scope.text = 'login part from controller';
  $scope.date = {};

  var updateTime = function() {
    $scope.date.raw = new Date();
    $timeout(updateTime, 1000);
  };

  updateTime();

  $rootScope.hideParticles = false;
  $scope.buttonText = 'Ingresar';
  $scope.inputName = 'Correo:';
  $scope.inputPass = 'Contraseña:';
  $scope.bigMessage = 'Hotel EuroBuilding Puerto Ordaz';
  $scope.linkConnect = false;

  $scope.statusSection = {
    status: false
  }

  $scope.credentials = {
    email: 'dyam.marcano@gmail.com',
    password: 'admin'
  }

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
}]);

app.controller('dashboardController', ['$scope', function ($scope) {
  $scope.text = 'dashboard part from controller';
}]);


app.controller('dashboardController', ['$scope', '$http', '$location', '$rootScope', '$timeout', function($scope, $http, $location, $rootScope, $timeout) {

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
}]);

app.directive('appVersion', ['version', function(version) {
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
]);