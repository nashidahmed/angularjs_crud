'use strict';

angular.module('customerApp', [
    'ui.router',
    'ui.bootstrap',
    'ngNotify',
    'customerApp.services',
    'customerApp.templates'
])

.config(['$urlRouterProvider', '$locationProvider', '$stateProvider', function($urlRouterProvider, $locationProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.hashPrefix('!');

    $stateProvider
    .state('customers', {
        abstract: true,
        views: {
            header: {
                templateUrl: 'common/partials/header.html'
            },
            main: {
                templateUrl: 'common/partials/main.html'
            },
            footer: {
                templateUrl: 'common/partials/footer.html'
            }
        }
    })
    .state('customers.view', {
        url: '/',
        templateUrl: 'view-customers/view-customers.html',
        controller: 'ViewCustomersCtrl'
    });
}]);