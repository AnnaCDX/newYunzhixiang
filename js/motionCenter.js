var MotionCenter = function() {
	'use strict';
	
	var vm = undefined;
	/**
	 * 初始化Vue
	 */
	function initVue() {
		var u = navigator.userAgent, app = navigator.appVersion;
	  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
	  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	  

		function PrefixInteger(num, length) {
	 		return (Array(length).join('0') + num).slice(-length);
		}

		// 注册过滤器 米转千米
		Vue.filter('m2km', function (value) {
			if (value == '' || value == null) {
				value = 0;
			}
			value = parseInt(value / 10);
			
			return (value / 100).toFixed(2);
		});
		Vue.filter('sportType', function (value) {
			if (value == '' || value == null) {
				return '';
			}
			//walk 健步,runIn 室内跑步,runOut室外跑步
			var status = { runIn: '室内跑步', walk: '健步走', runOut: '室外跑步'}
			return status[value];
		});
		Vue.filter('sportTypeImage', function (value) {
			if (value == '' || value == null) {
				return '';
			}
			//walk 健步,runIn 室内跑步,runOut室外跑步
			var status = { runIn: 'images/ic_food_type_a1@2x.png', walk: 'images/ic_food_type_a@2x.png', runOut: 'images/ic_food_type_a1@2x.png'}
			return status[value];
		});
		Vue.filter('date', function (value) {
			if (value == '' || value == null) {
				value = 0;
			}
//			$.toast(value);
//			return new Date(value).format('dd日 hh:mm');
			return formatDate(value, 'dd日 hh:mm');
		});
		Vue.filter('time', function (value) {
			if (value == '' || value == null) {
				value = 0;
			}
//      var days=Math.floor(value/3600/24); 
//      var hours=Math.floor((value-days*24*3600)/3600); 
//      var mins=Math.floor((value-days*24*3600-hours*3600)/60); 
//      var secs=Math.floor((value-days*24*3600-hours*3600-mins*60));
      var hours=Math.floor(value/3600); 
      var mins=Math.floor((value-hours*3600)/60); 
      var secs=Math.floor((value-hours*3600-mins*60));
			return PrefixInteger(hours, 2)+ ':' + PrefixInteger(mins, 2) + ':' + PrefixInteger(secs, 2);
		});
		Vue.filter('time1', function (value) {
			if (value == '' || value == null) {
				value = 0;
			}
      var days=Math.floor(value/3600/24); 
      var hours=Math.floor((value-days*24*3600)/3600); 
      var mins=Math.floor((value-days*24*3600-hours*3600)/60); 
      var secs=Math.floor((value-days*24*3600-hours*3600-mins*60));
			return PrefixInteger(mins, 2) + ':' + PrefixInteger(secs, 2);
		});
		Vue.filter('goals', function (value) {
			if (value == 0) {
				return '- -';
			}
			return value;
		});
		Vue.filter('number', function (value) {
			if (value == '') {
				return 0;
			}
			return value;
		});
		Vue.filter('divide30', function (value) {
			if (!value || value == '' || value == null) {
				return 0;
			}
			return parseInt(value / 1000);
		});
		Vue.filter('divide31', function (value) {
			if (!value || value == '' || value == null) {
				return 0;
			}
			value = parseInt(value / 100);
			value = (value / 10).toFixed(1);
			return isNaN(value) ? '0.0' : value;
		});
		Vue.filter('toFixed2', function (value) {
			if (value == '') {
				return 0;
			}
			return value.toFixed(2);
		});

		var motionCenterData = {
			isLogin: false,
			hasSevenDayData: false,
			toDay: '',
			token_yzx: '',				//新长征
			token: "",					//云之享登录令牌
			userId: 0,					//云之享用户ID
			tabList: [							//导航
				{ title : '活动', icon : 'icon-promotion', active : '', url : 'promotionList.html'},
				{ title : '健康资讯', icon : 'icon-article', active : '', url : 'motionCenter.html'},
				{ title : '运动', icon : 'icon-sport', active : 'active', url : 'motion.html'},
			],
			goalList: [
					{goal:1000, active: false},
					{goal:1500, active: false},
					{goal:2000, active: false},
					{goal:2500, active: false},
					{goal:3000, active: false},
					{goal:3500, active: false},
					{goal:4000, active: false},
					{goal:4500, active: false},
					{goal:5000, active: false},
					{goal:5500, active: false},
					{goal:6000, active: false},
					{goal:6500, active: false},
					{goal:7000, active: false},
					{goal:7500, active: false},
					{goal:8000, active: false},
					{goal:8500, active: false},
					{goal:9000, active: false},
					{goal:9500, active: false},
					{goal:10000, active: false},
					{goal:10500, active: false},
					{goal:11000, active: false},
					{goal:11500, active: false},
					{goal:12000, active: false}
			],
			goalRule: [
				{lft: 1, rgt: 3000, level: '初级', info: '(1-3公里)'},
				{lft: 3000, rgt: 9000, level: '中级', info: '(3-8公里)'},
				{lft: 9000, rgt: 12001, level: '高级', info: '(8-12公里)'},
			],
			currentGoal: {
				goal: 0,
				level: '',
				info: ''
			},
			dayGoalsMiles: 0,			//每日目标里程
			totalData: {					//用户运动累计数据
				calorie: "0",			//卡路里
				duration: "0",			//时长
				milesGps: "0",			//gps里程（单位：米）
				milesTotal: "0"			//实际里程数（单位：米）
			},
			detailOnceList: {			//用户当天运动汇总数据
				calorie: 0,				//卡路里
				duration: 0,			//运动时长(单位:秒)
				milesGps: 0,			//里程数（单位：米）（指有GPS时的实测里程值）
				milesTotal: 0,				//里程数（单位：米）(实际里程与换算里程的合计值)
				sportType: "walk",		//运动类型(walk 健步,runIn 室内跑步,runOut室外跑步)
				stepsPe: 0
			},
			sevenDaysMiles: 0,			//7日合计里程
			sportDataOfDayList: [{	//7日数据,按日分组
				dataList: [
//				{
//					calorie: 1950,
//					duration: 37,
//					milesTotal: 46,
//					recordTime: 1543715598000,
//					speed: 1,
//					sportId: 924,
//					sportType: "runIn",
//					isLast: false
//				}
				]
			}]
		}
		
		function compare(a,b) {
			return b - a;
		}
		
		vm = new Vue({
			el : '#motionCenter-page',
			data : motionCenterData,
			methods : {
				checkLogin: function() {
					if(window.gyObject){
						if(window.gyObject.isLogin()){
							//已经登录，可以获取用户登录token
							var token = window.gyObject.getLoginToken();
							return true;
						}
					}
					return false;
				},
				closeMotionCenter: function(){
					if(window.gyObject) {
						window.gyObject.finishPage();
					}
					return false;
				},
				goto: function(index) {
					var self = this;
					var url = '';
					if (self.token_yzx) {
//						window.location.href=self.tabList[index].url + "?token_yzx=" + self.token_yzx;
						url = self.tabList[index].url + "?token_yzx=" + self.token_yzx;
					} else {
//						window.location.href=self.tabList[index].url	;
						url = self.tabList[index].url;
					}
					if (isAndroid) {
						window.location.href = url;
					}
					if (isIOS) {
						window.location.replace(url);	
					}
				},
				changeGoal: function(index) {
					var self = this;
					console.log(self.goalList[index]);
				},
				download: function() {
					var self = this;
					var url = '';
					if (self.token_yzx) {
						url = "download.html?token_yzx=" + self.token_yzx;
					} else {
						url = "download.html";
					}
					if (isAndroid) {
						if(window.gyObject){
	      				if(window.gyObject.checkApp("com.guizhou.pedometer")){
	      					window.gyObject.startUpApp("com.guizhou.pedometer");
	      				} else {
	      					window.location.href = url;
	      				}
	      			}
					}
					if (isIOS) {
						if(window.gyObject){
							if(window.gyObject.checkApp("enjoySport://")){
								self.openApp("enjoySport://");
							} else {
								window.location.replace(url);	
							}
						}
					}
				},
//				download: function() {
//				    if (isAndroid) {
//				       this.downloadAndroid();
//				    }
//				    if (isIOS) {
//							this.downloadIphone();
//				    }
//				},
				downloadIphone : function() {
					var self = this;
					if(window.gyObject){
						if(window.gyObject.checkApp("enjoySport://")){
							self.openApp("enjoySport://");
						} else {
							self.openApp('https://itunes.apple.com/cn/app/%E4%BA%91%E4%B9%8B%E4%BA%AB/id1438846127?l=zh&ls=1&mt=8');
						}
					}
				},
				downloadAndroid: function() {
					var self = this;
					if(window.gyObject){
      				if(window.gyObject.checkApp("com.guizhou.pedometer")){
      					window.gyObject.startUpApp("com.guizhou.pedometer");
      				} else {
      					self.openApp('https://app1yzx.oss-cn-shenzhen.aliyuncs.com/install_app/yunzhixiang.apk');
      				}
      			}
      
				},
				openApp: function (src) {
					window.location.href=src;
				},
				confirmGoal: function() {
					var self = this;
					self.setUserDayGoals();
				},
				getXczInitData: function() {//页面初始请求后台数据.
					var self = this;
					if (!self.token_yzx) {
						return;
					}
					var data = {
						token_yzx: self.token_yzx
					};
					
					var success = function(result){
						if (result.errCode == 0) {
							self.isLogin = true;
							Session.setToken(result.token);
							Session.setUserId(result.userId);
							self.token = result.token;																//云之享登录令牌
							self.userId = result.userId;															//云之享用户ID
				      	console.log(self.token);
				      	console.log(self.userId);
				      	
							self.dayGoalsMiles = result.dayGoalsMiles;									//每日目标里程
							
							if (result.totalData) {
								self.totalData = {};																			//用户运动累计数据
								self.totalData['calorie'] = result.totalData.calorie;					//卡路里
								self.totalData['duration'] = result.totalData.duration;				//时长
								self.totalData['milesGps'] = result.totalData.milesGps;				//gps里程（单位：米）
								self.totalData['milesTotal'] = result.totalData.milesTotal; 	//实际里程数（单位：米）
							} else {
								self.totalData = {//用户运动累计数据
									calorie: "0",			//卡路里
									duration: "0",			//时长
									milesGps: "0",			//gps里程（单位：米）
									milesTotal: "0"		//实际里程数（单位：米）
								};																			
							}
							
							if (result.detailOnceList 
								&& result.detailOnceList.length > 0 
								&& result.detailOnceList[0] 
								&& result.detailOnceList[0] != null) {
									
								self.detailOnceList = {};	//用户当天运动汇总数据
								self.detailOnceList['calorie'] = result.detailOnceList[0].calorie;				//卡路里
								self.detailOnceList['duration'] = result.detailOnceList[0].duration;			//运动时长(单位:秒)
								self.detailOnceList['milesGps'] = result.detailOnceList[0].milesGps;			//里程数（单位：米）（指有GPS时的实测里程值）
								self.detailOnceList['milesTotal'] = result.detailOnceList[0].milesTotal;	//里程数（单位：米）(实际里程与换算里程的合计值)
								self.detailOnceList['sportType'] = result.detailOnceList[0].sportType;		//运动类型(walk 健步,runIn 室内跑步,runOut室外跑步)
								self.detailOnceList['stepsPe'] = result.detailOnceList[0].stepsPe;	//
							} else {
								self.detailOnceList = {
									calorie: 0,				//卡路里
									duration: 0,			//运动时长(单位:秒)
									milesGps: 0,			//里程数（单位：米）（指有GPS时的实测里程值）
									milesTotal: 0,			//里程数（单位：米）(实际里程与换算里程的合计值)
									sportType: "walk",		//运动类型(walk 健步,runIn 室内跑步,runOut室外跑步)
									stepsPe: 0
								};
							}
							
							self.sevenDaysMiles = result.sevenDaysMiles;			//7日合计里程
							var dataMap = {};
							var dataList = result.sportDataOfDayPage.dataList;
							var sportDataOfDayList = [];
							$.each(dataList, function(i, val) { 
								var data = val;
								var date = formatDate(data.recordTime, 'yyyyMMdd');
								if (dataMap[date]) {
									dataMap[date].push.apply(dataMap[date], [data]);
								} else {
									dataMap[date] = [data];
								}
							});
							
							var dayList = [];
							$.each(dataMap, function(i, val) { 
								dayList.push.apply(dayList, [i]);
							});
							dayList.sort(compare);
							
							for (var i = 0; i < dayList.length; i++) {
								var val = dayList[i];
								var item = { dataList: dataMap[val] }
								sportDataOfDayList.push.apply(sportDataOfDayList, [item]);		
							}
							
							self.sportDataOfDayList = sportDataOfDayList;
							if (sportDataOfDayList && sportDataOfDayList.length > 0) {
								self.hasSevenDayData = true;
							} else {
								self.hasSevenDayData = false;
							}
				     
							self.getUserDayGoals();
						} else {
							self.isLogin = false;
						}
					};
					var error = function(result) {

					};
					Api.getXczInitData(data, success, error);
				},
				setUserDayGoals: function() {//上传运动每日目标
					var self = this;
					if (!self.isLogin) {
						$.toast("前往下载");
						self.download();
						return;
					}
					if (self.currentGoal.goal==0) {
						$.toast("请选择目标值");
						return;
					}
					var data = {
						auth: self.userId,
						token: self.token,
						info: {"miles": self.currentGoal.goal}
					};
					var success = function(result){
						if (result.errCode == 0) {
							$.toast("目标设置成功");
							self.dayGoalsMiles = self.currentGoal.goal;
						} else {
							$.toast("目标设置失败:" + result.errCode);
						}
					};
					var error = function(result) {
						$.toast("系统异常");
					};
					Api.setUserDayGoals(data, success, error);
					$.closePanel();
				},
				getUserDayGoals: function() {//获取运动每日目标
					var self = this;
					var data = {
						auth: self.userId,
						token: self.token,
						info: 'N'
					};
					var success = function(result){
						if(result.errCode == 0) {
							self.dayGoalsMiles = result.miles;
							self.setCurrentGoal(result.miles);
						}
					};
					var error = function(result) {

					};
					Api.getUserDayGoals(data, success, error);
				},
				resetGoal: function() {
					var self = this;
					for (var i = 0; i < self.goalList.length;i++) {
						var item=self.goalList[i];
						item.active = false;
					}
				},
				setCurrentGoal: function(goal) {
					var self = this;
					for (var i = 0; i < self.goalRule.length; i++) {
						var item = self.goalRule[i];
						if (item.lft <= goal && item.rgt > goal) {
							self.currentGoal.goal = goal;
							self.currentGoal.level = item.level;
							self.currentGoal.info = item.info;
						}
					}
				},
				selectGoal: function(index) {
					var self = this;
					self.resetGoal();
					self.goalList[index].active = true;
					self.setCurrentGoal(self.goalList[index].goal);
				}
			},
			created: function () {
				var self = this;
				self.toDay = (new Date()).format("MM月dd日");
				self.token_yzx = Utils.generateParameterMapByUrl(document.URL)['token_yzx'];
//				if(self.checkLogin()) {
					
					self.getXczInitData();
//				}
			}
		});

		return vm;
	}

	return {
		init : function() {
			vm = initVue();
			var u = navigator.userAgent, app = navigator.appVersion;
		  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
		  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		  
			function pushHistory() { 
				var state = { 
					title: "title",
					url: location.href
				};
				window.history.pushState(state, "title", "#");
			}
			
			if (isAndroid) {
				pushHistory();
				window.addEventListener("popstate", function(e) {
					if(window.gyObject) {
						window.gyObject.finishPage();
					}
				}, false);
			}
			
			$.init();
			
			var rulerUl = document.getElementById('ruler-ul');
//	    var num = document.getElementById('num');
	    var ruler = document.getElementById('ruler');
			
	    var offsetX = 0;
	    var moveX = 0;
	    var moveBefore = 0;
	    var unit = 0.64;
			
//			ruler.addEventListener('touchstart', function (event) {
//      //手指按下时的坐标
//      offsetX = event.touches[0].clientX;
//      //初始化第一次滑动的距离为0
//      moveBefore = 0;
//	    });
//	
//	    rulerUl.addEventListener('touchmove', function (event) {
//	        //获取滑动时手指的动态坐标
//	        var move = event.touches[0].clientX;
//	        //上一次计算出的刻度尺移动距离
//	        var offset = ruler.dataset.offset;
//	        //原来是string，转换为float方便计算
//	        offset = parseFloat(offset);
//	        var tempMove = 0;
//	        var len = 0;
//	        //相对于手指按下时的距离，除以10是因为要将px转换为rem单位
//	        tempMove = move - offsetX;
//	        tempMove /= 10;
//	        //计算两次滑动间的距离
//	        len = offset + (tempMove - moveBefore);
//	        len = parseFloat(len);
//	        //边界判断，最大偏移长度65rem
//	        if (len - 0.0 < 0 && len > -65) {
//	            //将结果保存下来，下一次滑动时取出参与计算
//	            moveX = tempMove;
//	            ruler.dataset.offset = len;
//	            moveBefore = moveX;
//	            //设置样式
////	            ruler.style = "transform: translateX(" + len + "rem)";
//	            //显示刻度，保留2位小数
////	            num.innerText = -((len / unit).toFixed(2));
//	            console.log( -((len / unit).toFixed(2)));
//	        }
//	    }, false);
//  		
    		
		}
	}

}();