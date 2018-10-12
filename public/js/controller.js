angular.module('b2s.controllers',[])
.controller('userController',function($scope, $rootScope, userService){
    $scope.login = function(){
      userService.login(userLoginData).success(function(response){
         if(response.status){
              
         }
      });
    }
    $scope.register = function($scope, $rootScope, userService){
     userService.register(userRegisterData).success(function(response){
       if(response.status){

       }
     });
    }
});