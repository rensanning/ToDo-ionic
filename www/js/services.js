angular.module('todo.io.services', [])

.provider('dummyData', function() {
    var menus = [
        { title: '所有任务', badge: 25, groupId: -1, display: true, edit:false},
        { title: '已完成', badge: 6, groupId: -2, display: false, edit:false},
        { title: '今天', badge: 2, groupId: -3, display: true, edit:false},
        { title: '隐私', badge: 5, groupId: 1, display: true, edit:true},
        { title: '购物', badge: 7, groupId: 2, display: true, edit:true},
        { title: '想看的电影', badge: 9, groupId: 3, display: true, edit:true},
        { title: '愿望', badge: 4, groupId: 4, display: true, edit:true},
        { title: '日程安排', badge: 0, groupId: 5, display: true, edit:true}
    ];
    var todos = [
        { id: 1, type: 1, status: 1, groupId: 1, importance: 2, classname: 'checkbox-energized', title: '下午有个会！', date: '2014/01/01' },
        { id: 2, type: 2, status: 1, groupId: 1, importance: 3, classname: 'checkbox-assertive', title: '晚上有个饭局', date: '2014/01/02' },
        { id: 3, type: 1, status: 2, groupId: 3, importance: 0, classname: 'checkbox-calm', title: '《变形金刚4：绝迹重生》', date: '2014/01/03' },
        { id: 4, type: 2, status: 1, groupId: 3, importance: 1, classname: 'checkbox-calm', title: '《X战警：逆转未来》', date: '2014/01/04' },
        { id: 5, type: 1, status: 1, groupId: 2, importance: 0, classname: 'checkbox-stable', title: '买衣服！', date: '2014/01/05' },
        { id: 6, type: 2, status: 1, groupId: 2, importance: 0, classname: 'checkbox-stable', title: '买鞋子', date: '2014/01/06' },
        { id: 7, type: 1, status: 2, groupId: 2, importance: 2, classname: 'checkbox-energized', title: '买巧克力！', date: '2014/01/07' },
        { id: 8, type: 2, status: 1, groupId: 2, importance: 3, classname: 'checkbox-assertive', title: '买玩具！', date: '2014/01/08' },
        { id: 9, type: 1, status: 1, groupId: 2, importance: 0, classname: 'checkbox-calm', title: '买裤子！', date: '2014/01/09' },
        { id: 10, type: 2, status: 2, groupId: 3, importance: 1, classname: 'checkbox-calm', title: '《2012》', date: '2014/01/10' },
        { id: 11, type: 1, status: 1, groupId: 3, importance: 0, classname: 'checkbox-stable', title: '《加勒比海盗》', date: '2014/05/21' },
        { id: 12, type: 2, status: 1, groupId: 3, importance: 0, classname: 'checkbox-stable', title: '《黑客帝国》', date: Date.today().toString("yyyy/MM/dd") },
        { id: 13, type: 1, status: 1, groupId: 3, importance: 2, classname: 'checkbox-energized', title: '《1942》', date: '2014/05/23' },
        { id: 14, type: 2, status: 1, groupId: 4, importance: 3, classname: 'checkbox-assertive', title: '愿望B-太阳从西边出来吧！', date: '2014/05/24' },
        { id: 15, type: 1, status: 1, groupId: 4, importance: 0, classname: 'checkbox-calm', title: '愿望C-捡到一分钱!', date: '2014/05/25' },
        { id: 16, type: 2, status: 2, groupId: 4, importance: 1, classname: 'checkbox-calm', title: '愿望D-彩票中奖！', date: Date.today().toString("yyyy/MM/dd") },
        { id: 17, type: 1, status: 1, groupId: 3, importance: 0, classname: 'checkbox-stable', title: '《建国大业》', date: '2014/05/26' },
        { id: 18, type: 2, status: 2, groupId: 1, importance: 0, classname: 'checkbox-stable', title: '买张彩票', date: '2014/05/28' },
        { id: 19, type: 1, status: 1, groupId: 4, importance: 2, classname: 'checkbox-energized', title: '愿望A-天上掉馅儿饼吧！', date: '2014/05/29' },
        { id: 20, type: 2, status: 1, groupId: 1, importance: 3, classname: 'checkbox-assertive', title: '给老总发个邮件', date: '2014/05/30' },
        { id: 21, type: 1, status: 1, groupId: 1, importance: 0, classname: 'checkbox-calm', title: '早点回家吃饭', date: '2014/08/21' },
        { id: 22, type: 2, status: 2, groupId: 2, importance: 1, classname: 'checkbox-calm', title: '买手表！', date: '2014/08/22' },
        { id: 23, type: 1, status: 1, groupId: 2, importance: 0, classname: 'checkbox-stable', title: '买电脑!', date: '2014/08/23' },
        { id: 24, type: 2, status: 1, groupId: 3, importance: 0, classname: 'checkbox-stable', title: '《蜘蛛侠2》', date: '2014/08/24' },
        { id: 25, type: 1, status: 1, groupId: 3, importance: 0, classname: 'checkbox-stable', title: '《达芬奇密码》', date: '2014/08/25' }
    ];
    this.$get = function() {
        return {menus: menus, todos: todos};
    };
})

.factory('MenuService', function ($q, dummyData) {
  return {
    findAll: function (display) {
        var deferred = $q.defer();
        var results = dummyData.menus.filter(function(element) {
            if (display === undefined) {
                return true;
            } else {
                return display === element.display;
            }
        });
        deferred.resolve(results);
        return deferred.promise;
    },
    findGroupName: function(groupId) {
        var deferred = $q.defer();
        var results = dummyData.menus.filter(function(element) {
            return parseInt(groupId) === element.groupId;
        });
        deferred.resolve(results);
        return deferred.promise;
    }
  }
})

.factory('TodoListService', function ($q, dummyData) {
    return {
        findByGroupId: function (groupId, status, sortKey) {
            var deferred = $q.defer();
            var results = dummyData.todos.filter(function(element) {
                if (groupId == -1) {
                    return parseInt(status) === element.status;
                }
                if (groupId == -2) {
                    return 2 === element.status;
                }
                if (groupId == -3) {
                    return Date.today().equals(Date.parse(element.date, "yyyy/MM/dd"))
                            && parseInt(status) === element.status;
                }
                return parseInt(groupId) === element.groupId 
                        && parseInt(status) === element.status;
            });
            var results = results.sort(function(a, b){
               switch ( sortKey ) {
                  case "date": 
                    return a.date > b.date;
                  case "title": 
                    return a.title > b.title;
                  case "importance": 
                    return parseInt(b.importance) - parseInt(a.importance);
                  default: 
                    return parseInt(a.id) - parseInt(b.id);
               }
            });
            deferred.resolve(results);
            return deferred.promise;
        },
        findByTitle: function (titleKey) {
            var deferred = $q.defer();
            var results = dummyData.todos.filter(function(element) {
                return element.title.indexOf(titleKey) == -1 ? false : true;
            });
            deferred.resolve(results);
            return deferred.promise;
        }
    }
})