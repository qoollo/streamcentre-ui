var streamCentreApp = angular.module('streamCentreApp', ['streamCentreApp.development', 'ngRoute']);

streamCentreApp.config(function($interpolateProvider, $routeProvider) {
    /*$routeProvider.
        when('/', {
            templateUrl: 'partials/stream-list.html',
            controller: 'PhoneListCtrl'
        }).
        when('/phones/:phoneId', {
            templateUrl: 'partials/create-stream.html',
            controller: 'PhoneDetailCtrl'
        }).
            otherwise({
            redirectTo: '/phones'
        });*/
});

streamCentreApp.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
});