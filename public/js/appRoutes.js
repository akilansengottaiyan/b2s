angular.module('appRoutes',[])
.config(['$routeProvider', function($routeProvider){
$routeProvider
.when('/login',{templateUrl:'../views/login.html',controller:'userController'})
.when('/register',{templateUrl:'../views/register.html',controller:'userController'});
//.otherwise({redirectTo : '../views/home.html'});
//$locationProvider.html5Mode(true);
}]);
