particlesJS.load 'particles', '../config/particles.json'
app = angular.module('mainApp', [
  'ngRoute'
  'routeStyles'
  'ui.bootstrap'
  'ngAnimate'
  'mainApp.controllers'
  'mainApp.directives'
  'mainApp.filters'
  'mainApp.services'
])
app.config [
  '$routeProvider'
  ($routeProvider) ->
    $routeProvider.when '/',
      templateUrl: 'login.html'
      controller: 'loginController'
      css: '../styles/login.css'
    $routeProvider.when '/dashboard',
      resolve: 'check': ($location, $rootScope) ->
        if !$rootScope.loggedIn
          $location.path '/'
        return
      templateUrl: 'dashboard.html'
      controller: 'dashboardController'
      css: '../styles/dashboard.css'
    $routeProvider.otherwise redirectTo: '/'
    return
]
