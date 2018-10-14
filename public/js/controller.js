angular.module('b2s.controllers',[])
.controller('userController',['$scope','$rootScope','userService',function($scope, $rootScope, userService){
  $scope.status = "";
  $scope.userRegisterData = {};
  $scope.userLoginData = {};
    $scope.login = function(){
      console.log(userLoginData);
      $scope.ended = false;
      userService.login(userLoginData).success(function(response){
         $scope.status = "Login Successful";
         $scope.ended = true;
      });
    }
    $scope.register = function($scope, $rootScope, userService){
      $scope.ended = false;
     userService.register(userRegisterData).success(function(response){ 
       console.log(userRegisterData);
        $scope.ended = true;
      if(response.status == '200')
       $scope.status = "Registration success" ;
      else
       $scope.status = "Registration failed." + response.body;
     });
    }
}]);