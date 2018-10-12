angular.module('b2s',[b2s.controllers,b2s.services,ngRoute])
.config(['routeProvider', function($routeProvider){
$routeProvider
.when('/login',{templateUrl:'views/login.html',controller:'userController'})
.when('/register',{templateUrl:'views/register.html',controller:'userController'})
.otherwise({redirectTo : 'views/home.html'});
}]);