angular.module('mainApp.controllers', [])
.controller 'loginController', ($scope, $timeout, $http, $location, $rootScope) ->
  status = ''
  $rootScope.hideParticles = false
  $scope.buttonText = 'Ingresar'
  $scope.inputName = 'Correo:'
  $scope.inputPass = 'Contraseña:'
  $scope.bigMessage = 'Hotel EuroBuilding Puerto Ordaz'
  $scope.conectionStatus = status.status or 'offline'

  $scope.linkConnect = false
  $scope.credentials =
    email: 'dyam.marcano@gmail.com'
    password: 'admin'

  $scope.login = (credentials) ->
    $scope.buttonText = 'Verificando'
    $scope.linkConnect = true
    console.log credentials
    $timeout (->
      $scope.buttonText = 'Ingresar'
      $scope.linkConnect = false
      #chrome.storage.sync.set 'token': 'super secret token dont share xD'
      if credentials.email == 'dyam.marcano@gmail.com' and credentials.password == 'admin'
        #fake authentication
        $rootScope.user = 'object of user data'
        $rootScope.loggedIn = true
        $location.path '/dashboard'
      return
    ), 1000

    return
  return
.controller 'dashboardController', ($scope, $http, $location, $rootScope, $timeout) ->
  $rootScope.hideParticles = true
  $scope.date = {}
  $scope.data =
    id: chrome.runtime.id

  $scope.logout = () ->
    $rootScope.loggedIn = false
    $location.path '/'

  updateTime = ->
    $scope.date.raw = new Date
    $timeout updateTime, 1000
    return

  updateTime()
  return
