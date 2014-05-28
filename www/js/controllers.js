angular.module('todo.io.controllers', [])

// *******************
// 向导页面
// *******************
.controller('TutorialCtrl', function($scope, $state, $ionicViewService) {

  window.localStorage['didTutorial'] = false;// For Test

  var startApp = function() {
    $ionicViewService.clearHistory();
    // 默认进入“今天”的任务列表
    $state.go('app.todolist', {groupId: -3});
    window.localStorage['didTutorial'] = true;
  };

  if(window.localStorage['didTutorial'] === "true") {
    console.log('Skip intro');
    // 向导页面只显示一次
    startApp();
  } else {
    setTimeout(function () {
      navigator.splashscreen.hide();
    }, 750);
  }

  // "立即体验"按钮Event
  $scope.gotoMain = function() {
    startApp();
  }

  $scope.slideHasChanged = function(index) {
  };
})

// *******************
// 菜单
// *******************
.controller('AppCtrl', function($scope, $state, MenuService) {

  // 初始化菜单项目
  var findDisplayMenus = function() {
    MenuService.findAll(true).then(function(menus) {
      $scope.menus = menus;
    });
  }
  findDisplayMenus();

  // "设置"按钮Event
  $scope.settings = function() {
    $state.go('app.settings', { });
  }

  // "添加列表"按钮Event
  $scope.addGroup = function() {
    $state.go('app.groupinfo', { });
  }

  // "编辑"按钮Event
  $scope.editGroup = function() {
    $state.go('app.grouplist', { });
  }
})

// *******************
// 任务一览页面
//  $stateParams.groupId
// *******************
.controller('TodolistsCtrl', function($scope, $state, $stateParams, $timeout, 
       $ionicGesture, $ionicActionSheet, $ionicNavBarDelegate,
       MenuService, TodoListService) {

  // 从向导页面跳转过来的话，不显示返回按钮
  $timeout( function() {
    $ionicNavBarDelegate.showBackButton(false);
  }, 0);

  // 根据列表ID显示初始数据
  var findAllTodos = function() {
      MenuService.findGroupName($stateParams.groupId).then(function(group) {
        $scope.groupName = group[0].title;// 列表名
      });
      if ($stateParams.groupId != -2) {
        TodoListService.findByGroupId($stateParams.groupId, 1).then(function(todolists) {
          $scope.todolists = todolists;// 未完成任务
        });
      }
      TodoListService.findByGroupId($stateParams.groupId, 2).then(function(todolists) {
        $scope.todolists_finish = todolists;// 已完成任务
      });
  }
  findAllTodos();

  // "添加"按钮Event
  $scope.add = function() {
    $state.go('app.todoinfo', { });
  }

  // "搜索"Event
  $scope.search = function() {
    $state.go('app.search', { });
  }

  // "排序"Event
  var nonePopover = function() {
    for (var i = 1; i <= 10; i++) {
        var p = angular.element(document.querySelector('#nspopover-' + i ));
        p.css('display', 'none');
    }
  }
  $scope.sort = function() {
    nonePopover();
    $ionicActionSheet.show({
     buttons: [
       { text: '按<b>日期</b>排序' },
       { text: '按<b>标题</b>排序' },
       { text: '按<b>重要度</b>排序' }
     ],
     titleText: '选择排序方法',
     cancelText: '关闭',
     cancel: function() {
       return true;
     },
     buttonClicked: function(index) {
       var sortKey="";
       switch ( index ) {
          case 0: sortKey="date";break;
          case 1: sortKey="title";break;
          case 2: sortKey="importance";break;
          default: sortKey="id";
       }
       TodoListService.findByGroupId($stateParams.groupId, 1, sortKey).then(function(todolists) {
         $scope.todolists = todolists;// 未完成
       });
       return true;
     }
   });
  }

  // 点击Listview跳转到任务详细页面
  $scope.show = function(todoid,type) {
    $state.go('app.todoinfo', { id: todoid });
  }

  // 点击Listview中的Checkbox结束当前任务
  $scope.finish = function(todoid, $event) {
    // TODO
    $event.stopPropagation();
  }

  // 长按Listview跳转到任务批量处理页面
  var element = angular.element(document.querySelector('#todolist'));
  $ionicGesture.on("hold", function (event) {
      $state.go('app.todolistedit', { groupId: $stateParams.groupId });
  }, element);

})

// *******************
// 任务批量处理页面
//  $stateParams.groupId
// *******************
.controller('TodolistsEditCtrl', function($scope, $state, $stateParams, $timeout, 
        $ionicGesture, $ionicActionSheet, $ionicNavBarDelegate, 
        MenuService, TodoListService) {

  // 当前group所有的任务（包括未完成和已完成）
  $scope.entities = [];

  // 根据列表ID显示初始数据
  var findAllTodos = function() {
      if ($stateParams.groupId != -2) {
        TodoListService.findByGroupId($stateParams.groupId, 1).then(function(todolists) {
          $scope.todolists = todolists;// 未完成
          $scope.entities = $scope.entities.concat(todolists);
        });
      }
      TodoListService.findByGroupId($stateParams.groupId, 2).then(function(todolists) {
        $scope.todolists_finish = todolists;// 已完成
          $scope.entities = $scope.entities.concat(todolists);
      });
  }
  findAllTodos();

  // 选中处理
  $scope.selected = [];
  var updateSelected = function(action, id) {
    if (action === 'add' && $scope.selected.indexOf(id) === -1) {
      $scope.selected.push(id);
    }
    if (action === 'remove' && $scope.selected.indexOf(id) !== -1) {
      $scope.selected.splice($scope.selected.indexOf(id), 1);
    }
  };
  $scope.updateSelection = function($event, id) {
    var checkbox = $event.target;
    var action = (checkbox.checked ? 'add' : 'remove');
    updateSelected(action, id);
    $ionicNavBarDelegate.setTitle("选中"+$scope.selected.length+"项");
  };
  $scope.selectAll = function($event) {
    var action = ($scope.isSelectedAll() ? 'remove' : 'add');
    for ( var i = 0; i < $scope.entities.length; i++) {
      var entity = $scope.entities[i];
      updateSelected(action, entity.id);
    }
    $ionicNavBarDelegate.setTitle("选中"+$scope.selected.length+"项");
  };
  $scope.getSelectedClass = function(entity) {
    return $scope.isSelected(entity.id) ? 'selected' : '';
  };
  $scope.isSelected = function(id) {
    return $scope.selected.indexOf(id) >= 0;
  };
  $scope.isSelectedAll = function() {
    return $scope.selected.length === $scope.entities.length;
  };

  // "批量移动"Event
  $scope.move = function(todoid) {
      alert("move");
  }

  // "批量设置时间"Event
  $scope.setDate = function(todoid) {
      alert("setDate");
  }

  // "批量删除"Event
  $scope.deleteTodo = function(todoid) {
      alert("delete");
  }
})

// *******************
// 搜索页面
// *******************
.controller('SearchCtrl', function($scope, $stateParams, TodoListService) {
  $scope.searchKey = "";

　　// "搜索任务"Event
  $scope.searchToDo = function(searchKey) {
      if (searchKey != undefined && searchKey != "")　{
          TodoListService.findByTitle(searchKey).then(function(todolists) {
            $scope.todolists = todolists;
          });
      }
  }
})

// *******************
// 任务页面
//  $stateParams.todoId
// *******************
.controller('TodoCtrl', function($scope, $state, $stateParams, $ionicActionSheet, $ionicActionSheet) {
  // 任务ID（非空编辑，空的话新建）
  var todoid = $stateParams.todoId;

  $scope.mode = "text";
  $scope.title = "任务（文本）";
  $scope.newItem = '';
  $scope.priority_level = 0;
  $scope.todo_date = Date.today();

  // For test
  $scope.items = [
    {title: '牛奶2盒'},
    {title: '鸡蛋3个'},
    {title: '面包1包'}];
  $scope.images_list = ["img/001.jpg", "img/002.jpg", "img/003.jpg", "img/004.jpg"];

  var nonePopover = function() {
    for (var i = 1; i <= 10; i++) {
        var p = angular.element(document.querySelector('#nspopover-' + i ));
        p.css('display', 'none');
    }
  }

  // "切换模式"Event
  $scope.gotoTextMode = function() {
    nonePopover();
    $scope.mode = "text";
    $scope.title = "任务（文本）";
  }
  $scope.gotoListMode = function() {
    nonePopover();
    $scope.mode = "list";
    $scope.title = "任务（清单）";
  }

  // "添加附件"Event
  $scope.addAttachment = function() {
    nonePopover();
    $ionicActionSheet.show({
     buttons: [
       { text: '相机' },
       { text: '图库' }
     ],
     cancelText: '关闭',
     cancel: function() {
       return true;
     },
     buttonClicked: function(index) {
       return true;
     }
   });
  }

  $scope.priority = function($event) {
    $event.stopPropagation();
  }

  // "设置重要度"Event
  $scope.setPriority = function(p) {
    $scope.priority_level = p;
    nonePopover();
  }

  // "设置时间"Event
  $scope.deadline = function() {
    var options = {
      date: $scope.todo_date,
      mode: 'date'
    };
    datePicker.show(options, function(d) {
      if (!isNaN(d.getTime())) {  // valid date
        $scope.$apply(function () {
          $scope.todo_date = d;
        });
      }
    });
  }

  // "清单模式下回车添加子任务"Event
  $scope.handleKeydown = function(e, newItem) {
    if (e.which == 13) {
      $scope.items.push({title: newItem});
      $scope.newItem = '';
      e.preventDefault();
    }
  }
})

// *******************
// 添加列表页面
// *******************
.controller('GroupCtrl', function($scope, $stateParams) {
})

// *******************
// 列表一览页面
// *******************
.controller('GrouplistCtrl', function($scope, $state, MenuService) {

  // 显示所有列表
  var findDisplayMenus = function() {
      MenuService.findAll().then(function(menus) {
        $scope.menus = menus;
      });
  }
  findDisplayMenus();

  // "删除列表"Event
  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
  };

})

// *******************
// 设置页面
// *******************
.controller('SettingsCtrl', function($scope, $state, $stateParams) {

  $scope.showAbout = false;
  $scope.showBgcolor = false;

  // "设置背景"Event
  $scope.setBgcolor = function(index) {
    alert(index);
  }

})
