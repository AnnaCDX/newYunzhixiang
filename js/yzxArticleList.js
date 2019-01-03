var YzxArticleList = function() {
	'use strict';
	
	var vm = undefined;
	var swiper = undefined;
	/**
	 * 初始化Vue
	 */
	function initVue() {
		var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    
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
			article: {}					//资讯详情
		}
		
		vm = new Vue({
			el : '#article-page',
			data : articleListData,
			methods : {
				goto: function(index) {
					var self = this;
					if (self.token_yzx) {
						window.location.href=self.tabList[index].url + "?token_yzx=" + self.token_yzx;
					} else {
						window.location.href=self.tabList[index].url	
					}
				},
				backArticleList: function() {
					var self = this;
					
					$.router.back();
					
					if(isiOS){
							var obj = new Object();
							obj.message="Appear"
							window.webkit.messageHandlers.infoMainViewNotify.postMessage(JSON.stringify(obj));
					}
		      if(isAndroid){
//		      		if (app) {
		        		app.setTopBottomVisible(0)
//		        }
		      }
				},
				view: function(index) {
					var self = this;
					$.showIndicator();
					self.getArticleDetail(self.slideList[index].id, function(){
						$.router.load("#articledetail", true);
						$('.content').scrollTop(0);
		        $.hideIndicator();
					});
					
//		      if(isiOS){
//							var obj = new Object();
//							obj.message="DisAppear"
//							window.webkit.messageHandlers.infoMainViewNotify.postMessage(JSON.stringify(obj))
//					}
//		      if(isAndroid){
//		      		if (app) {
//		        		app.setTopBottomVisible(3)
//		        }
//		      }
					
//					window.location.href='yzxArticleDetail.html?id=' + self.slideList[index].id;
				},
				detail: function(index) {
					var self = this;
					
					$.showIndicator();
					
					self.getArticleDetail(self.articleList[index].id, function(){
						$.router.load("#articledetail", true);
						$('.content').scrollTop(0);
		        $.hideIndicator();
					});
//		      
//		      if(isiOS){
//		      		if (window.webkit) {
//							var obj = new Object();
//							obj.message="DisAppear"
//							window.webkit.messageHandlers.infoMainViewNotify.postMessage(JSON.stringify(obj))
//						}
//		
//					}
//		      if(isAndroid){
//		      		if (app) {
//		        		app.setTopBottomVisible(3)
//		        }
//		      }
					
//					window.location.href='yzxArticleDetail.html?id=' + self.articleList[index].id;
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
				      	swiper.removeAllSlides();
			      		self.slideList.splice(0, self.slideList.length);
			      	}
						if (result) {
							if (result.listinfoSelected.length > 0) {
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
						currentPage: self.pageIndex * self.pageSize,
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
				}
			},
			created: function () {
				var self = this;
				self.token_yzx = Utils.generateParameterMapByUrl(document.URL)['token_yzx'];
				self.initSlideList();
				self.initArticleList();
			},
			mounted: function() {
//	      var u = navigator.userAgent;
//	      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
//	      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
//	      if(isiOS){
//						var obj = new Object();
//						obj.message="Appear"
//						window.webkit.messageHandlers.InfoMainViewNotify.postMessage(JSON.stringify(obj));	
//				}
//	      if(isAndroid){
//	      		if (app) {
//	        		app.setTopBottomVisible(0)
//	        }
//	      }
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
					
			$(document).on("pageInit", function(e, pageId, $page) {
	      var u = navigator.userAgent;
	      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			 	if(pageId == "articlelist") {
//			 		console.log("articlelist");
		      if(isiOS){
							var obj = new Object();
							obj.message="Appear"
							window.webkit.messageHandlers.InfoMainViewNotify.postMessage(JSON.stringify(obj));	
					}
		      if(isAndroid){
		      		if (app) {
		        		app.setTopBottomVisible(0)
		        }
		      }
			  }
					
			  if (pageId == "articledetail") {
//			  		console.log("articledetail");
		      if(isiOS){
		      		if (window.webkit) {
							var obj = new Object();
							obj.message="DisAppear"
							window.webkit.messageHandlers.infoMainViewNotify.postMessage(JSON.stringify(obj))
						}
		
					}
		      if(isAndroid){
		      		if (app) {
		        		app.setTopBottomVisible(3)
		        }
		      }
			  }
			});
					
			$.init();
		}
	}

}();