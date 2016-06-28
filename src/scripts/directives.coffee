angular.module('mainApp.directives', []).directive 'appVersion', [
  'version'
  (version) ->
    (scope, elm, attrs) ->
      elm.text version
      return
]