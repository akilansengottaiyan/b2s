angular.module('b2s.services')
.factory('userServices', function($http){
    login = function(userData){
     return $http.post('/user/login',userData);
    }
    register = function(userData){
    return $http.post('/user/register',userData);
    }

})