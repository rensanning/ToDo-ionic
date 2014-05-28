angular.module('todo.io', ['ionic', 'todo.io.directives', 'todo.io.filters', 'todo.io.services', 'todo.io.controllers', 'nsPopover'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

     .state('tutorial', {
        url: '/',
        templateUrl: 'templates/tutorial.html',
        controller: 'TutorialCtrl'
     })

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.todolist', {
      url: "/todolist/:groupId",
      views: {
        'menuContent' :{
          templateUrl: "templates/todo_list.html",
          controller: 'TodolistsCtrl'
        }
      }
    })

    .state('app.todolistedit', {
      url: "/todolist/edit/:groupId",
      views: {
        'menuContent' :{
          templateUrl: "templates/todo_list_edit.html",
          controller: 'TodolistsEditCtrl'
        }
      }
    })

    .state('app.todoinfo', {
      url: "/todo/:todoId",
      views: {
        'menuContent' :{
          templateUrl: "templates/todo_info.html",
          controller: 'TodoCtrl'
        }
      }
    })

    .state('app.grouplist', {
      url: "/group",
      views: {
        'menuContent' :{
          templateUrl: "templates/group_list.html",
          controller: 'GrouplistCtrl'
        }
      }
    })

    .state('app.groupinfo', {
      url: "/group/:groupId",
      views: {
        'menuContent' :{
          templateUrl: "templates/group_info.html",
          controller: 'GroupCtrl'
        }
      }
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html",
          controller: 'SearchCtrl'
        }
      }
    })

    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "templates/settings.html",
          controller: 'SettingsCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/');
});

