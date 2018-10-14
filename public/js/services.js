angular.module('b2s.services',[])
.factory('userServices', ['$http', '$localStorage',function($http, $localStorage){
    login = function(userData, callback){
        $http.post('/user/login',userData).success(response => {
           if(response.body.token){
               $localStorage.currentUser = { email : userData.email, token : response.body.token};
               $http.defaults.headers.common.Authorisation = response.token; 
               callback(response);
           }
           else{
               callback(response);
           }
        })
    }

    register = function(userData, callback){
        $http.post('/user/register',userData).success(response => {
        })
    }
    logout = function(callback){
        $localStorage.currentUser = {};
        $http.default.headers.common.Authorisation = '';
    }

}]);