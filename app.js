var myApp = angular.module("myApp", ['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

	if(!$httpProvider.defaults.headers.get) $httpProvider.defaults.headers.get = {};

	// IE 9 浏览器中ajax呼叫时，文件缓存的问题（modify配置文件的时间调制。）
	$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
	$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
	$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

	$urlRouterProvider.when("", "/pagetab");

	$stateProvider.state("history", {
		url: "/history",
		templateUrl: "./view/history.html"
	});
});

myApp.controller('DemoController', function($scope, $timeout, $templateCache) {
	$scope.data = [];

	$scope.pageNum = 0;
	$scope.total = 12;

	$timeout(function() {
		var documentHeight = $(document).outerHeight();
		var headHeight = parseInt($('.global-header').css('height'));
		var filterHeight = parseInt($('.history-filter').css('height'));
		$('.history-top').css('height', documentHeight - headHeight - filterHeight);

		var tpl = $templateCache.get('angular-pull-to-refresh.tpl.html');

		$('#scroller').prepend(tpl);

		var tpl2 = $templateCache.get('angular-infinite-scroll.tpl.html');

		$('#scroller').append(tpl2);
	}, 0);

	$timeout(loaded, 200);

	var myScroll,
		pullDownEl, pullDownOffset,
		pullUpEl, pullUpOffset;

	function one() {
		// 数据加载/刷新 默认显示的数据
		for($scope.pageNum; $scope.pageNum < $scope.total; $scope.pageNum++) {
			$scope.data.push({
				'date': 'Today',
				'time': '13:' + $scope.pageNum,
				'money': '100.00',
				'desciption': 'Deposit',
				'state': 'active',
				'posName': 'posname-' + $scope.pageNum
			});
		}

		$scope.total += 10;
		$timeout(function() {
			myScroll.refresh(); // 加载完成新内容 要记得刷新数据。
		}, 0);
	}

	function pullDownAction() {
		$scope.pageNum = 0;
		$scope.total = 40;
		$timeout(function() { // <-- 这里是模拟假数据的，请实际使用换成 ajax
			$scope.data = [];
			one();
			myScroll.refresh(); // 加载完成新内容 要记得刷新数据。
		}, 1000); // <-- 这里是模拟假数据的，请实际使用换成 ajax
	}

	function pullUpAction() {
		$timeout(function() { // <-- 这里是模拟假数据的，请实际使用换成 ajax
			for($scope.pageNum; $scope.pageNum < $scope.total; $scope.pageNum++) {
				$scope.data.push({
					'date': 'Today',
					'time': '13:' + $scope.pageNum,
					'money': '100.00',
					'desciption': 'Deposit',
					'state': 'active',
					'posName': 'posname-' + $scope.pageNum
				});
			}
			$scope.total += 10;
			$timeout(function() {
				myScroll.refresh(); // 加载完成新内容 要记得刷新数据。
			}, 0);
		}, 1000); // <-- 这里是模拟假数据的，请实际使用换成 ajax
	}

	function loaded() {
		one();

		pullDownEl = document.getElementById('pullDown');
		pullDownOffset = pullDownEl.offsetHeight;
		pullUpEl = document.getElementById('pullUp');
		pullUpOffset = pullUpEl.offsetHeight;

		myScroll = new iScroll('historyTop', {
			useTransition: true,
			topOffset: pullDownOffset,
			onRefresh: function() {
				if(pullDownEl.className.match('loading')) {
					pullDownEl.className = '';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
				} else if(pullUpEl.className.match('loading')) {
					pullUpEl.className = '';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
				}
			},
			onScrollMove: function() {
				if(this.y > 5 && !pullDownEl.className.match('flip')) {
					pullDownEl.className = 'flip';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
					this.minScrollY = 0;
				} else if(this.y < 5 && pullDownEl.className.match('flip')) {
					pullDownEl.className = '';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
					this.minScrollY = -pullDownOffset;
				} else if(this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
					pullUpEl.className = 'flip';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
					this.maxScrollY = this.maxScrollY;
				} else if(this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
					pullUpEl.className = '';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
					this.maxScrollY = pullUpOffset;
				}
			},
			onScrollEnd: function() {
				if(pullDownEl.className.match('flip')) {
					pullDownEl.className = 'loading';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
					pullDownAction();
				} else if(pullUpEl.className.match('flip')) {
					pullUpEl.className = 'loading';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
					pullUpAction();
				}
			}
		});
	}
});
myApp.run(['$templateCache', function($templateCache) {
	var tpl =
		'<div id="pullDown">' +
		'	<span class="pullDownIcon"></span>' +
		'	<span class="pullDownLabel">Pull down to refresh...</span>' +
		'</div>';

	var tpl2 =
		'<div id="pullUp">' +
		'	<span class="pullUpIcon"></span>' +
		'	<span class="pullUpLabel">Pull up to refresh...</span>' +
		'</div>';

	$templateCache.put('angular-pull-to-refresh.tpl.html', tpl);
	$templateCache.put('angular-infinite-scroll.tpl.html', tpl2);
}]);