var ArticleList = function() {
	'use strict';
	
	var vm = undefined;
	var swiper = undefined;
  
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
			return Api.imagePrefix + imgPath;
		});
		Vue.filter('substr', function (value) {
			if (value == '' || value == null) {
				return '';
			}
			return value.substring(0,20);
		});
		Vue.filter('date', function (value) {
			if (value == '' || value == null) {
				value = 0;
			}
			return formatDate(value, 'yyyy.MM.dd');
		});
		var articleListData = {
			token_yzx: '',				//新长征
			token: '',						//云之享登录令牌
			userId: 0,						//云之享用户ID
			tabList: [							//导航
				{ title : '活动', icon : 'icon-promotion', active : '', url : 'promotionList.html'},
				{ title : '健康资讯', icon : 'icon-article', active : 'active', url : 'motionCenter.html'},
				{ title : '运动', icon : 'icon-sport', active : '', url : 'motion.html'},
			],
			showLoding : false,		//是否显示“查看更多”
			noMore: false,				//是否无有下一页
			showMore: false,			//是否有下一页
			initLoading : false,	//是否初始化
			loadLoading : false, //是否加载
			pageIndex: 0,				//页码
			pageSize: 10,				//页大小
			articleList: [				//资讯列表
			],
			slideList: [					//轮播图列表
			],
			slideLength: 0,
			article: {}					//资讯详情
		}
		
		vm = new Vue({
			el : '#article-page',
			data : articleListData,
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
				closeArticleList: function(){
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
				view: function(index) {
					var self = this;
					
					$.showIndicator();
					
					self.getArticleDetail(self.slideList[index].id, function () {
						$.router.load("#articledetail", true);
						$('.content').scrollTop(0);
		        $.hideIndicator();
		     	});
					
				},
				detail: function(index) {
					var self = this;
					
					$.showIndicator();
					
					self.getArticleDetail(self.articleList[index].id, function () {
						$.router.load("#articledetail", true);
						$('.content').scrollTop(0);
		        $.hideIndicator();
		     	});
//					if (isAndroid) {
//						window.location.href="articleDetail.html?token_yzx=" + self.token_yzx + "&id=" + self.articleList[index].id;
//					}
//					if (isIOS) {
//						var url ="articleDetail.html?token_yzx=" + self.token_yzx + "&id=" + self.articleList[index].id;
//						window.location.replace(url);
//					}
				},
				initSlideList: function() {
					var self = this;
					self.getSlideList();
				},
				getSlideList: function() {
					var self = this;
					var data = {
					};
					var success = function(result){
						if (self.slideList.length > 0) {
			      		self.slideList.splice(0, self.slideList.length);
				      	swiper.removeAllSlides();
				      	self.slideLength = 0;
			      	}
						if (result) {
							if (result.listinfoSelected.length > 0) {
								self.slideLength = result.listinfoSelected.length - 1;
								
				      		self.slideList.push.apply(self.slideList, result.listinfoSelected);
				      		
					      	$.reinitSwiper();
							}
						}
					};
					var error = function(result) {};
					Api.slideShow(data, success, error);
				},
				moreArticle: function(){
					var self = this;
					self.loadArticleList();
				},
				initArticleList: function(callback) {
					var self = this;
					self.pageIndex = 0;
					self.getArticleList(callback);
				},
				loadArticleList: function(callback) {
					var self = this;
					if (self.showMore) {	
						self.showLoding = true;
						self.noMore = false;
						self.showMore = false;
					} else {
						self.loadLoading = false;
						return;
					}
					self.pageIndex ++;
					self.getArticleList(callback);
				},
				getArticleList: function(callback) {
					var self = this;
					var data = {
						currentPage: (self.pageIndex * self.pageSize),
						pageSize: self.pageSize
					};
					var success = function(result){
						if (result) {
							if (result.length > 0) {
								self.articleList.push.apply(self.articleList, result);
								self.initLoding = false;
								self.loadLoding = false;
								
								self.showLoding = false;
								self.noMore = false;
								self.showMore = true;
							} else {
								self.showLoding = false;
								self.noMore = true;
								self.showMore = false;
							}
						}
						if (callback && callback != undefined) {
							callback();
						}
					};
					var error = function(result) {
						if (callback && callback != undefined) {
							callback();
						}
					};
					Api.infoColumnlist(data, success, error);
				},
				getArticleDetail: function(id, callback) {
					var self = this;
					var data = {
						id: id
					};
					var success = function(result){
						if (result) {
							self.article = result;
						}
						
						if (callback && callback != undefined) {
							callback();
						}
					};
					var error = function(result) {
						if (callback && callback != undefined) {
							callback();
						}
					};
					Api.content(data, success, error);
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
				openApp: function (src) {
					window.location.href=src;
				}
			},
			created: function () {
				var self = this;
				self.token_yzx = Utils.generateParameterMapByUrl(document.URL)['token_yzx'];
				self.initSlideList();
				self.initArticleList();
			}
		});

		return vm;
	}

	return {
		init : function() {
			vm = initVue();
			
			var config = {
					pagination: '.swiper-pagination',
			    speed: 400,
			    paginationClickable: true,
			    observer:true,
			    observeParents:true,
//			    loop : true,
			    grabCursor: true,  
			    autoplay : 5000,
	        autoplayDisableOnInteraction : false,
			    onSlideChangeEnd: function(swiper){
	          swiper.update();
	        }
			};
			swiper = $(".swiper-container").swiper(config);
			
			// 添加'refresh'监听器
//			$(document).on("pageInit", "#articlelist",
//					function(e, id, page) {
//						$(page).find(".content").on('refresh', function(e) {
//							if (vm.initLoading)
//								return;
//							vm.initLoading = true;
//							vm.pageIndex = 1;
//							vm.articleList = [];
//							vm.initArticleList(function() {
//								// 加载完毕需要重置
//								$.pullToRefreshDone('.pull-to-refresh-content');
//								vm.initLoading = false;
//							});
//						});
//					});

			// 无限滚动
			$(document).on("pageInit", "#articlelist",
				function(e, id, page) {
					$(page).on('infinite', function() {
						if (vm.loadLoading)
							return;
						vm.loadLoading = true;
						vm.loadArticleList(function(){
							$.refreshScroller();
							vm.loadLoading = false;
						});
					});
			});
			
			function pushHistory() { 
				var state = { 
					title: "title",
					url: location.href
				};
				window.history.pushState(state, "title", "#");
			}
			
			$(document).on("pageInit", function(e, pageId, $page) {
			 	if(pageId == "articlelist") {
//				  		console.log('articlelist');
//						pushHistory(1);
				  }
					
				  if (pageId == "articledetail") {
//				  		console.log('articledetail');
//						pushHistory(2);
				  }
			});
		
//			var u = navigator.userAgent, app = navigator.appVersion;
//		  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
//		  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
//			if (isAndroid) {
//				pushHistory(1);
//				window.addEventListener("popstate", function(e) {
//					
//					console.log(e.state);
//					if(window.gyObject) {
//						window.gyObject.finishPage();
//					}
//				}, false);
//			}
			
			$.init();
		}
	}

}();