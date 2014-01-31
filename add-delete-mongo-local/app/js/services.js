'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1')
  .factory("moviesService", function($http, Restangular){
    var _getMovies = function(){
    	var movieData = Restangular.all('wines').getList();
    	return movieData;
    }
    
    var _addNewMovie = function(movie){
    	movie = Restangular.all('wines').post(movie);
    	return movie;
    	
    }
    var _editMovie = function(movie){
    	var originalMovie =  Restangular.one('wines', movie.id).get();
    	var editMovie = Restangular.copy(originalMovie);
    	return editMovie;
    }
    var _removeMovie = function(movie){
    	var originalMovie =  Restangular.one('wines', movie.id).get();
    	return originalMovie;
    }

    return{
        getMovies: _getMovies,
        addNewMovie: _addNewMovie,
        editMovie: _editMovie,
        removeMovie:_removeMovie
    };
});


