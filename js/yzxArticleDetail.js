var YzxArticleDetail = function() {
	'use strict';
	
	var vm = undefined;
	/**
	 * 初始化Vue
	 */
	function initVue() {

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
		var articleData = {
			token_yzx: '',				//新长征
			token: '',						//云之享登录令牌
			userId: 0,						//云之享用户ID
			id: '',							//资讯ID
			article: {}					//资讯详情
		}
		
		vm = new Vue({
			el : '#article-page',
			data : articleData,
			methods : {
				backArticleList: function() {
//					var self = this;
//					window.location.href = 'articleList.html?token_yzx=' + self.token_yzx;
//					if(window.gyObject){
//						window.gyObject.finishPage();
//					}
//					return false; 
					window.location.replace('yxzArticleList.html');
				},
				getArticleDetail: function(id) {
					var self = this;
					var data = {
						id: id
					};
					var success = function(result){
						if (result) {
							self.article = result;
						}
					};
					var error = function(result) {};
					Api.content(data, success, error);
				}
			},
			created: function () {
				var self = this;
				self.id = Utils.generateParameterMapByUrl(document.URL)['id'];
				self.getArticleDetail(self.id);
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