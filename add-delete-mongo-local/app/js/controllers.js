'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {
	  
  }])
  .controller("WeatherCtrl", function ($scope, weatherService){
    //Executes when the controller is created
    $scope.Weather = {};
    $scope.selectedCity = 'Cambridge';
    $scope.getWeather = function(){
        weatherService.getWeather($scope.selectedCity).then(
        		function (data) {
                    $scope.Weather = data;
                });
    }
    $scope.getWeather();
  })

  .controller("MoviesCtrl", function ($scope, $location, moviesService){
    //Executes when the controller is created
    $scope.getMovies = function(){
    	moviesService.getMovies().then(
        		function (data) {
        			$scope.movies = data;
                });
    }
    $scope.getMovies();
    $scope.addNewMovie = function(movie){
        var movie = {name: movie.name,
        			releaseYear: movie.releaseYear,
        			averageRating:movie.averageRating
        			};
        moviesService.addNewMovie(movie).then(function(movie) {
        	$scope.getMovies();
        });
    }
  })
  .controller("MovieEditCtrl", ['$scope','$location', '$routeParams','moviesService', function($scope, $location, $routeParams, moviesService){
	  //Executes when the controller is created
	  var movieId = $routeParams.movieId;
	  console.log("In edit controller");
	  var movie = {id: movieId};
	  moviesService.editMovie(movie).then(function(movie) {
		  var original = movie;
		  $scope.movie = original;
      });
	  $scope.updateMovie = function(movie){
		  movie.put().then(function() {
			  console.log("success put");
			  $location.path('/movies');
		  });
	  }
	  //$scope.getMovies();
	  }])
  .controller("MovieDeleteCtrl", ['$scope','$location', '$routeParams','moviesService', function($scope, $location, $routeParams, moviesService){
	  //Executes when the controller is created
	  console.log("In delete controller");
	  var movieId = $routeParams.movieId;
	  var movie = {id: movieId};
	  moviesService.removeMovie(movie).then(function(movie) {
		  var original = movie;
		  original.remove().then(function() {
			  $location.path('/movies');
		  })
      });
	  //$scope.getMovies();
	  }]);