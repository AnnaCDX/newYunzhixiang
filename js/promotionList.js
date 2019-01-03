var PromotionList = function() {
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

		// 注册过滤器 图片
		Vue.filter('image', function (imgPath) {
			if (imgPath == '' || imgPath == null) {
				return '';
			}
			return Api.promotionImagePrefx + imgPath;
		});
		Vue.filter('substr', function (value) {
			if (value == '' || value == null) {
				return '';
			}
			return value.substring(0,20);
		});
		Vue.filter('apply', function (value) {
			if (value == '' || value == null) {
				return '';
			}
			var status = { true: '已报名', false: ''}
			return status[value];
		});
		Vue.filter('sportType', function (value) {
			if (value == '' || value == null) {
				return '';
			}
			var status = { run: '跑步', walk: '健走'}
			return status[value];
		});
		Vue.filter('type', function (value) {
			if (value == '' || value == null) {
				return '';
			}
			var status = { 1: '', 2: '现场签到'}
			return status[value];
		});
		Vue.filter('activeStatus', function (value) {
			if (value == '' || value == null) {
				return '';
			}
			var activeStatus = { 3: 'images/hdbm@2x.png', 5: 'images/hdbm@2x.png', 6: 'images/bmjs.png', 7: 'images/jinxz.png', 8: 'images/hdjs3@2x.png'}
			return activeStatus[value];
		});
		var promotionData = {
			token_yzx: '',				//新长征
			token: '',						//云之享登录令牌
			userId: 0,						//云之享用户ID
			tabList: [							//导航
				{ title : '活动', icon : 'icon-promotion', active : 'active', url : 'promotionList.html'},
				{ title : '健康资讯', icon : 'icon-article', active : '', url : 'motionCenter.html'},
				{ title : '运动', icon : 'icon-sport', active : '', url : 'motion.html'},
			],
			promotionTabList: [							//导航
				{ title : '全部活动', id : 'allPromotion', active : '', url : '#allPromotionTab'},
				{ title : '我的活动', id : 'myPromotion', active : '', url : '#myPromotionTab'}
			],
			allShowLoading : false,		//是否显示“查看更多”
			allNoMore: false,				//是否无有下一页
			allShowMore: false,			//是否有下一页
			allInitLoading : false,	//是否初始化
			allLoadLoading : false, //是否加载
			allPageIndex: 1,				//页码
			allPageSize: 10,				//页大小
			allPromotionList: [				//活动列表
	//				{	
	//					activityId: '1',		//活动id
	//					title: '',					//活动标题
	//					type: '2',					//活动类型(是否需要签到) 1 不需要签到 2 需要签到
	//					sportType: 'walk',			//运动类型: run 跑步,walk 健走
	//					image: 'images/img04.png',//活动横屏图片地址
	//					activeStatus: '7',		//活动状态:1.待提交，即草稿状态；2.待审核，即已提交、尚未审核； 3.审核通过（即可报名，无报名开始时间的限制），这是已审核状态、但只可供特定APP用户使用;4.审核不通过，也是已审核状态； 5.已发布，是审核后经特定用户在APP再次确认无误的状态； 6.报名结束，即已过报名时间、未到活动开始时间 7.进行中； 8.已结束;
	//					isExist: 'true',					//是否报名 	true已报名,false未报名
	//					reportPeople: 1,				//实时报名人数
	//					detailUrl: 'promotionDetail.html',					//活动详情
	//					site: '贵阳市'
	//				}
			],
			myShowLoading : false,		//是否显示“查看更多”
			myNoMore: false,				//是否无有下一页
			myShowMore: false,			//是否有下一页
			myInitLoading : false,	//是否初始化
			myLoadLoading : false, //是否加载
			myPageIndex: 1,				//页码
			myPageSize: 10,				//页大小
			myPromotionList: [				//活动列表
	//				{	
	//					activityId: '1',		//活动id
	//					title: '',					//活动标题
	//					type: '2',					//活动类型(是否需要签到) 1 不需要签到 2 需要签到
	//					sportType: 'walk',	//运动类型: run 跑步,walk 健走
	//					image: 'images/img04.png',//活动横屏图片地址
	//					activeStatus: '7',		//活动状态:1.待提交，即草稿状态；2.待审核，即已提交、尚未审核； 3.审核通过（即可报名，无报名开始时间的限制），这是已审核状态、但只可供特定APP用户使用;4.审核不通过，也是已审核状态； 5.已发布，是审核后经特定用户在APP再次确认无误的状态； 6.报名结束，即已过报名时间、未到活动开始时间 7.进行中； 8.已结束;
	//					isExist: 'true',			//是否报名 	true已报名,false未报名
	//					reportPeople: 1,			//实时报名人数
	//					detailUrl: 'promotionDetail.html',					//活动详情
	//					site: '贵阳市'
	//				}
			],
			myPromotion: {},
			currCity: {},        			//当前活动
			promotion: {},						//活动详情
			cityList: [],
			nowTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
			currentPromotion: {}
		}
		
		vm = new Vue({
			el : '#promotion-page',
			data : promotionData,
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
				closePromotionList: function(){
					if(window.gyObject){
						window.gyObject.finishPage();
					}
					return false;
				},
				to: function (url){
					var self = this;
					
					var data = {};
					if (self.token_yzx) {
						data['token_yzx'] = self.token_yzx;
					}
					if (self.userId && self.userId != 'null') {
						data['userId'] = self.userId;
					}
					if (self.token && self.token != 'null') {
						data['token'] = self.token;
					}
					
					url = url + Api.builderParams(data);
					self.redirect(url);
				},
				redirect: function(url) {
					var self = this;
					if (isAndroid) {
						window.location.href = url;
					}
					if (isIOS) {
						window.location.replace(url);
					}
				},
				goto: function(index) {
					var self = this;
					self.to(self.tabList[index].url);
				},
				gotoAllDetail: function(index) {
					var self = this;
					var promotion = self.allPromotionList[index];
					var detailUrl = promotion.detailUrl;
					if (detailUrl) {
						var params = {};
						if (self.token_yzx) {
							params['token_yzx'] = self.token_yzx;
						}
						if (self.userId) {
							params['userId'] = self.userId;
						}
						if (self.token) {
							params['token'] = self.token;
						}
						params['t'] = new Date().getTime();
						if (detailUrl.split('?').length == 1) {
							detailUrl += Api.builderAppendParams(params);
						} else {
							detailUrl += Api.builderAppendParams(params);
						}
						self.redirect(detailUrl);
					}
				},
				gotoMyDetail: function(index) {
					var self = this;
					var promotion = self.myPromotionList[index];
					var detailUrl = promotion.detailUrl;
					if (detailUrl) {
						var params = {};
						if (self.token_yzx) {
							params['token_yzx'] = self.token_yzx;
						}
						if (self.userId) {
							params['userId'] = self.userId;
						}
						if (self.token) {
							params['token'] = self.token;
						}
						params['t'] = new Date().getTime();
						if (detailUrl.split('?').length == 1) {
							detailUrl += Api.builderAppendParams(params);
						} else {
							detailUrl += Api.builderAppendParams(params);
						}
						self.redirect(detailUrl);
					}
				},
				initList: function(id){
					var self = this;
					if ('allPromotion' == id) {
						self.setCurrentTab(0);
						self.initAllPromotionList();
					}
					
					if ('myPromotion' == id) {
						self.setCurrentTab(1);
						self.initMyPromotionList();
					}
				},
				moreAllPromotion: function(){
					var self = this;
					self.loadAllPromotionList();
				},
				initAllPromotionList: function(callback) {
					var self = this;
					self.allPageIndex = 1;
					self.allPromotionList = [];
					self.getAllPromotionList(callback);
				},
				loadAllPromotionList: function(callback) {
					var self = this;
					if (self.allShowMore) {	
						self.allShowLoading = true;
						self.allNoMore = false;
						self.allShowMore = false;
					} else {
						self.allLoadLoading = false;
						return;
					}
					self.allPageIndex ++;
					self.getAllPromotionList(callback);
				},
				getAllPromotionList: function(callback) {
					var self = this;
//					if (self.userId == '' | self.userId == null || self.token == '' | self.token == null) {
//						self.showLoading = false;
//						self.noMore = true;
//						self.showMore = false;
//						if (callback && callback != undefined) {
//							callback();
//						}
//						return;
//					}
					var data = {
						auth: self.userId,
						token: self.token, 
						info: {"currentPage" : self.allPageIndex , "pageSize" : self.allPageSize }
					};
					var success = function(result){
						if (result && result.nowTime) {
							self.nowTime = result.nowTime;
						}
						if (result && result.pageList && result.pageList.dataList) {
							if (result.pageList.dataList.length > 0) {
								var dataList = [];
								$.each(result.pageList.dataList, function(i, val) {
									val.sportTypeList = [];
									if (val.sportType) {
										val.sportTypeList = val.sportType.split(',');	
									}
//									val.detailUrl="promotionDetail01.html?activityId=" + val.activityId;
									val.detailUrl=val.detailUrl + "?activityId=" + val.activityId;
									dataList.push.apply(dataList, [val]);
								});
								self.allPromotionList.push.apply(self.allPromotionList, dataList);
								self.allInitLoding = false;
								self.allLoadLoding = false;
								
								self.allShowLoading = false;
								self.allNoMore = false;
								if (dataList.length < self.allPageSize) {
									self.allShowMore = false;
								} else {
									self.allShowMore = true;
								}
							} else {
								self.allShowLoading = false;
								self.allNoMore = true;
								self.allShowMore = false;
							}
						} else {
								self.allShowLoading = false;
								self.allNoMore = true;
								self.allShowMore = false;
						}
						if (callback && callback != undefined) {
							callback();
						}
					};
					var error = function(result) {
						if (callback && callback != undefined) {
							callback();
						} else {
							self.allShowLoading = false;
							self.allNoMore = true;
							self.allShowMore = false;
						}
					};
					Api.getActivityListPage(data, success, error);
				},
				moreMyPromotion: function(){
					var self = this;
					self.loadMyPromotionList();
				},
				initMyPromotionList: function(callback) {
					var self = this;
					self.myPageIndex = 1;
					self.myPromotionList = [];
					self.getMyPromotionList(callback);
				},
				loadMyPromotionList: function(callback) {
					var self = this;
					if (self.myShowMore) {	
						self.myShowLoading = true;
						self.myNoMore = false;
						self.myShowMore = false;
					} else {
						self.myLoadLoading = false;
						return;
					}
					self.myPageIndex ++;
					self.getMyPromotionList(callback);
				},
				getMyPromotionList: function(callback) {
					var self = this;
//					if (self.userId == '' | self.userId == null || self.token == '' | self.token == null) {
//						self.showLoading = false;
//						self.noMore = true;
//						self.showMore = false;
//						if (callback && callback != undefined) {
//							callback();
//						}
//						return;
//					}
					var data = {
						auth: self.userId,
						token: self.token, 
						info: {"currentPage" : self.myPageIndex , "pageSize" : self.myPageSize }
					};
					var success = function(result){
						if (result && result.nowTime) {
							self.nowTime = result.nowTime;
						}
						if (result && result.pageList && result.pageList.dataList) {
							if (result.pageList.dataList.length > 0) {
								var dataList = [];
								$.each(result.pageList.dataList, function(i, val) {
									val.sportTypeList = [];
									if (val.sportType) {
										val.sportTypeList = val.sportType.split(',');	
									}
									if (val.isExist == 'true') {//已报名
										val.showModifyCity = false;
									} else {
										if (val.cityNum) {
											var diff = Utils.dateDiffSeconds(val.startTime, result.nowTime);
											if (val.cityNum > 1 && diff > 0) {
												val.showModifyCity = true;
											} else {
												val.showModifyCity = false;
											}
										} else {
											val.showModifyCity = false;
										}
									}
//									val.showModifyCity = true;
//									val.detailUrl="promotionDetail01.html?activityId=" + val.activityId;
									val.detailUrl=val.detailUrl + "?activityId=" + val.activityId;
									dataList.push.apply(dataList, [val]);
								});
								self.myPromotionList.push.apply(self.myPromotionList, dataList);
								self.myInitLoding = false;
								self.myLoadLoding = false;
								
								if (dataList.length < self.myPageSize) {
									self.myShowMore = false;
								} else {
									self.myShowMore = true;
								}
								self.myShowLoading = false;
								self.myNoMore = false;
							} else {
								self.myShowLoading = false;
								self.myNoMore = true;
								self.myShowMore = false;
							}
						} else {
								self.myShowLoading = false;
								self.myNoMore = false;
								self.myShowMore = false;
						}
						if (callback && callback != undefined) {
							callback();
						}
					};
					var error = function(result) {
						if (callback && callback != undefined) {
							callback();
						} else {
								self.myShowLoading = false;
								self.myNoMore = true;
								self.myShowMore = false;
						}
					};
					Api.getMyActivityList(data, success, error);
				},
				getPromotionDetail: function(id) {
					var self = this;
					var data = {
						auth: self.userId,
						token: self.token,
						info: { "activityId": id }
					};
					var success = function(result){
						if (result) {
							self.promotion = result;
						}
					};
					var error = function(result) {};
					Api.content(data, success, error);
				},
				modifyCity: function(index) {
					var self = this;
					var myPromotion = self.myPromotionList[index];
					self.myPromotion = myPromotion;
					
					self.currCity = {
						cityId: '',
						cityName: myPromotion.cityName
					};
					
					$.showIndicator();
					
					self.getActivityCityList(function () {
						$.router.load('#city', false);
		        $.hideIndicator();
		     	});
					
				},
				getActivityCityList: function(callback) {
					var self = this;
					var data = {
						auth: self.userId,
						token: self.token,
						info: {"activityId": self.myPromotion.activityId}
					};
					var success = function(result){
						if (result) {
							self.cityList = result.cityList;
						}
						
						if (callback) {
							callback();
						}
					};
					var error = function(result) {
						if (callback) {
							callback();
						}
					};
					Api.getActivityCityList(data, success, error);
				},
				selCity: function(index) {
					var self = this;
					var city = self.cityList[index];
					self.currCity = {
						cityId: city.cityId,
						cityName: city.cityName
					}
					self.myPromotion.cityName = city.cityName;
					self.modifyReservationCity();
					$.router.back();
				},
				modifyReservationCity: function() {
					var self = this;
					var data = {
						auth: self.userId,
						token: self.token,
						info: {"activityId": self.myPromotion.activityId, "cityId": self.currCity.cityId}
					};
					var success = function(result){
						if (result) {
							self.cityList = result.cityList;
							if (result.errCode == 0) {
								$.toast("修改成功");
							} else {
								$.toast(result.msg);
							}
						}
					};
					var error = function(result) {
					};
					Api.modifyReservationCity(data, success, error);
				},
				signUser: function(index) {
					var self = this;
					var myPromotion = self.myPromotionList[index];
					var data = {
						auth: self.userId,
						token: self.token,
						info: {"activityId": myPromotion.activityId}
					};
					var success = function(result){
						if (result && result.errCode == 0) {
							$.toast("签到成功!");
						} else {
							$.toast(result.msg);
						}
					};
					var error = function(result) {
					};
					Api.signUser(data, success, error);
				},
				checkSign: function(index) {
					var self = this;
					var myPromotion = self.myPromotionList[index];
					if (myPromotion.isSign) {
						return false;
					}
					if (myPromotion.type == '2') {
						if (myPromotion.signStartTime == '' 
							|| myPromotion.signStartTime == null 
							|| myPromotion.signEndTime == ''
							|| myPromotion.signEndTime == null) {
							return false;
						}
						var startDiff = Utils.dateDiffSeconds(myPromotion.signStartTime, self.nowTime);
						var endDiff = Utils.dateDiffSeconds(self.nowTime, myPromotion.signEndTime);
						if (startDiff > 0 && endDiff > 0) {
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				},
				checkActiveStatus: function(myPromotion) {
					var self = this;
					var value = Utils.dateDiffSeconds(self.nowTime, myPromotion.endTime);
					if (value > 0){
			      var days=Math.floor(value/3600/24); 
			      var hours=Math.floor((value-days*24*3600)/3600); 
			      var mins=Math.floor((value-days*24*3600-hours*3600)/60); 
			      var secs=Math.floor((value-days*24*3600-hours*3600-mins*60));
						var str = "";
						if (days > 0) {
							str += days + "天";
						}
						if (hours > 0) {
							str += hours + "小时";
						} else {
							if (mins > 0) {
								str += mins + "分钟";
							}
						}
						str += "后开始";
						return str;
					}
					return '';
				},
				setCurrentTab: function(index) {
					var self = this;
					for (var i = 0; i < self.promotionTabList.length; i++) {
						self.promotionTabList[i].active = '';
					}
					self.promotionTabList[index].active = 'active';
					self.currentPromotion = self.promotionTabList[index]; 
				}
			},
			computed: {
			},
			created: function () {
				var self = this;
				self.token_yzx = Utils.generateParameterMapByUrl(document.URL)['token_yzx'];
				var tab = Utils.generateParameterMapByUrl(document.URL)['tab'];
        	
				var userId = Utils.generateParameterMapByUrl(document.URL)['userId'];
				var token = Utils.generateParameterMapByUrl(document.URL)['token'];
				if (userId) {
					self.userId = userId;
				} else {
        		self.userId = Session.getUserId();
       	}
				
				if (token) {
					self.token = token;
				} else {
        		self.token = Session.getToken();
	      }
//	      	self.token = '96526bd2-92d3-47d1-a71d-13c2ebe6472c';
//	      	self.userId = '262';
				
				if (tab == 'my') {
					var currentTab = self.promotionTabList[1]
					self.setCurrentTab(1);
					self.initList(currentTab.id);
				} else {
					var currentTab = self.promotionTabList[0]
					self.setCurrentTab(0);
					self.initList(currentTab.id);
				}
			}
		});

		return vm;
	}

	return {
		init : function() {
			vm = initVue();
			
			// 添加'refresh'监听器
//			$(document).on("pageInit", "#promotionlist",
//				function(e, id, page) {
//					$(page).find(".content").on('refresh', function(e) {
//						if (vm.allInitLoading)
//							return;
//						vm.allInitLoading = true;
//						vm.allPageIndex = 1;
//						vm.allPromotionList = [];
//						vm.initAllPromotionList(function() {
//							// 加载完毕需要重置
//							$.pullToRefreshDone('.pull-to-refresh-content');
//							vm.allInitLoading = false;
//						});
//					});
//				});
			
			// 无限滚动
			$(document).on("pageInit", "#promotionlist",
				function(e, id, page) {
					$(page).on('infinite', function() {
						if ($("#allPromotion").hasClass('active')) {
							if (vm.allLoadLoading)
								return;
							vm.allLoadLoading = true;
							vm.loadAllPromotionList(function() {
								$.refreshScroller();
								vm.allLoadLoading = false;
							});
						}
						
						if ($("#myPromotion").hasClass('active')) {
							if (vm.myLoadLoading)
								return;
							vm.myLoadLoading = true;
							vm.loadMyPromotionList(function() {
								$.refreshScroller();
								vm.myLoadLoading = false;
							});
						}
					});
				});
				
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
		}
	}

}();