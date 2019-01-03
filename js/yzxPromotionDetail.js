var YzxPromotionDetail = function() {
	'use strict';
	
	var vm = undefined;
	/**
	 * 初始化Vue
	 */
	function initVue() {
		var u = navigator.userAgent, app = navigator.appVersion;
	  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
	  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

		Vue.filter('isExist', function (value) {
			if (value == '' || value == null) {
				return '';
			}
			var isExist = { "false": "我要报名", "true": "已报名"}
			return isExist[value];
		});
		
		var promotionData = {
			token_yzx: '',
			token: '',
			userId: '',
			activityId: '',
			showShare: false,
			isYunZhiXiang: 0,
			userStatus: {
				isExist: "false",
				isSign: "false",
				takePrize: 0
			}
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
				checkYunZhiXiang: function() {
					var self = this;
					return (self.isYunZhiXiang == "1" || self.isYunZhiXiang == 1) ? true : false;
				},
				backPromotionList: function(){
					var self = this;
					
					if (self.checkYunZhiXiang()) {
						if (isIOS) {
							var obj = new Object();
				      	obj.message="Appear"
				      	window.webkit.messageHandlers.infoMainViewNotify.postMessage(JSON.stringify(obj));
						}
						
						if (isAndroid) {
			      		if (app) {
			        		app.setTopBottomVisible(0)
			        }
						}
					} else {
						if (isIOS) {
							var url = 'promotionList.html?token_yzx=' + self.token_yzx + "&userId=" + self.userId + "&token=" + self.token;
							window.location.replace(url);
						}
						if (isAndroid) {
							window.location.href = 'promotionList.html?token_yzx=' + self.token_yzx + "&userId=" + self.userId + "&token=" + self.token;
						}
					}
//					window.location.href = 'promotionList.html?token_yzx=' + self.token_yzx;
				},
				share: function(){
					var self = this;
//					self.showShare = true;
					if (self.checkYunZhiXiang()) {
//						self.sharePage();
						self.showShare = true;
					} else {
						self.download();
					}
				},
				closeShare: function() {
					var self = this;
					self.showShare = false;
				},
				sharePage: function(type) {// 1: 微信好友, 2: 朋友圈
					var self = this;
					var url = window.location.href;
					var arr = url.split("/");
					var page = arr[arr.length - 1].split('?')[0];
					
//					console.log(page)
	        if(isIOS){
	          var obj = new Object();
	          obj.link="https://app.yunzhixiang.cn:443/f_sport/" + page;
	          obj.name="ClickShareBtn"
	          if (type == 1) {
	          		obj.platform = "WXSceneSession";
	          } else {
	          		obj.platform = "WXSceneTimeline";
	          }
	          window.webkit.messageHandlers.infoMainViewNotify.postMessage(JSON.stringify(obj))
	
	        }
	        if(isAndroid){
//	          	app.shareInfoDetail("https://app.yunzhixiang.cn:443/f_sport/" + page)
						var platform = "";
						if (type == 1) {
	          		platform = "WXSceneSession";
	          	} else {
	          		platform = "WXSceneTimeline";
	          	}
	          	app.shareWX("https://app.yunzhixiang.cn:443/f_sport/" + page, platform)
	          
	        }
				},
				goodFriend: function() {//微信好友
					var self = this;
					self.sharePage(1);
				},
				circleOfFriends: function() {// 朋友圈
					var self = this;
					self.sharePage(2);
				},
				download: function() {
				    if (isAndroid) {
				       this.downloadAndroid();
				    }
				    if (isIOS) {
							this.downloadIphone();
				    }
				},
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
				getActivityUserStatus: function() {
					var self = this;
					if (!self.userId 
						|| !self.token 
						|| !self.activityId) {
						return;
					}
					var data = {
						auth: self.userId,
						token: self.token,
						info: {"activityId": self.activityId}
					};
					var success = function(result){
						if (result) {
							self.userStatus = result.userStatus;
						}
					};
					var error = function(result) {
					};
					Api.getActivityUserStatus(data, success, error);
				},
				reservationActivity: function() {
					var self = this;
//					if (isIOS) {
//						window.location.replace('promotionList.html?token_yzx=' + self.token_yzx);
//					}
//					if (isAndroid) {
//						window.location.href = 'promotionList.html?token_yzx=' + self.token_yzx;
//					}
					window.location.href = 'signup.html?token_yzx=' + self.token_yzx 
					+ "&activityId=" + self.activityId 
					+ "&userId=" + self.userId 
					+ "&token=" + self.token;
				},
				checkIsSignup: function() {
					var self = this;
					if (self.activityId != ''
					  && self.userStatus
						&& self.userStatus.isExist == 'false'
						&& self.userStatus.activeStatus < 6) {
						return true
					}
					return false;
				}
			},
			created: function () {
				var self = this;
				self.token_yzx = Utils.generateParameterMapByUrl(document.URL)['token_yzx'];
				self.activityId = Utils.generateParameterMapByUrl(document.URL)['activityId'];
				self.isYunZhiXiang = Utils.generateParameterMapByUrl(document.URL)['isYunZhiXiang'];
								
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
	      	self.getActivityUserStatus();
			}
		});

		return vm;
	}

	return {
		init : function() {
			vm = initVue();
			
			$.init();
		}
	}

}();