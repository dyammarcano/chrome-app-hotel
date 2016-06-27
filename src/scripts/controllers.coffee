app = angular.module('mainApp.controllers', [])
app.controller 'loginController', ($scope, $timeout, $http, $location, $rootScope) ->
  status = ''
  $rootScope.hideParticles = false
  $scope.buttonText = 'Ingresar'
  $scope.inputName = 'Correo:'
  $scope.inputPass = 'Contraseña:'
  $scope.bigMessage = 'Hotel EuroBuilding Puerto Ordaz'
  $scope.conectionStatus = status.status or 'offline'

  ###chrome.storage.sync.get('status', function(result) {
    status = result;
    console.log('status: ' + status);
  });
  ###

  $scope.linkConnect = false
  $scope.credentials =
    email: 'dyam.marcano@gmail.com'
    password: 'admin'
    remember: true

  $scope.login = (credentials) ->
    $scope.buttonText = 'Verificando'
    $scope.linkConnect = true
    #console.log(credentials);
    $timeout (->
      $scope.buttonText = 'Ingresar'
      $scope.linkConnect = false
      chrome.storage.sync.set 'token': 'super secret token dont share xD'
      if credentials.email == 'dyam.marcano@gmail.com' and credentials.password == 'admin'
        #fake authentication
        $rootScope.user = 'object of user data'
        $rootScope.loggedIn = true
        $location.path '/dashboard'
      return
    ), 1000

    ###$http({
      method: 'POST',
      url: '/api/login',
      data: $.param(credentials),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(data) {
      console.log('data: ' + data);
      if (!data.success) {
        console.log('errors: ' + data.errors);
      } else {
        console.log('message: ' + data.message);
      }
    });
    ###

    return

  return
app.controller 'dashboardController', ($scope, $http, $rootScope, $timeout) ->
  $rootScope.hideParticles = true
  $scope.date = {}

  updateTime = ->
    $scope.date.raw = new Date
    $timeout updateTime, 1000
    return

  updateTime()
  return
