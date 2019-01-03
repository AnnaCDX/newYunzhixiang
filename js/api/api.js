function _Api() {
	'use strict';

	this.sendRequest = function(action, message, success, error, complete) {
		var sendmessage = $.extend(true, message, message);

    Vue.http.options.headers = {
      'Content-Type': 'application/json; charset=UTF-8'
    };
    Vue.http.options.emulateHTTP = true;
    Vue.http.options.emulateJSON = true;
    Vue.http.options.crossOrigin = true;
    Vue.http.options.timeout = 30000;
		Vue.http.post(this.baseUrl + action, sendmessage)
			.then(function(data) {
				var response = $.parseJSON(data.bodyText);
				success(response);
			}, error);

	}

  this.builderParams = function(data) {
    if (!data || data.length == 0) {
      return '';
    }
    var params = '';
    var first = true;
    $.each(data, function(key, value){
  			if (value instanceof Object) {
  				value = encodeURI(JSON.stringify(value));
  			}
      if (first) {
        params += '?' + key + '=' + value;
        first = false;
      } else {
        params += '&' + key + '=' + value;
      }
    })
    return params;
  }

  this.builderAppendParams = function(data) {
    if (!data || data.length == 0) {
      return '';
    }
    var params = '';
    $.each(data, function(key, value){
  			if (value instanceof Object) {
  				value = encodeURI(JSON.stringify(value));
  			}
      	params += '&' + key + '=' + value;
    })
    return params;
  }

	/**
	 * 页面初始请求后台数据.
	 */
	this.getXczInitData = function(data, success, error, complete) {
    var params = this.builderParams(data);
		this.sendRequest('/jkzzz/app/user/getXczInitData.do' + params, {}, success, error, complete);
	};

  /**
   * 上传运动每日目标
   */
  this.setUserDayGoals = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jkzzz/app/dailyStepRecord/setUserDayGoals.do' + params, {}, success, error, complete);
  };

  /**
   * 获取运动每日目标
   */
  this.getUserDayGoals = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jkzzz/app/dailyStepRecord/getUserDayGoals.do' + params, {}, success, error, complete);
  };

  /**
   * 获取七天内运动数据（分页）
   */
  this.getSevenDaysSportData = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jkzzz/app/dailyStepRecord/getSevenDaysSportData.do' + params, {}, success, error, complete);
  };

  /**
   * 获取活动列表.
   */
  this.getActivityListPage = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jk_activity/app/activity/getActivityListPage.do' + params, {}, success, error, complete);
  };

  /**
   * 获取活动详情. （暂时不需要开发）
   */
  this.getActivityDetailUrl = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jk_activity/app/activity/getActivityDetailUrl.do' + params, {}, success, error, complete);
  };

  /**
   * 获取我的活动列表. (已开发)
   */
  this.getMyActivityList = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jk_activity/app/activity/myActivityList.do' + params, {}, success, error, complete);
  };

  /**
   * 获取举办活动的城市信息. (未开发)
   * auth=&token=&info={"activityId":""}
   */
  this.getActivityCityList = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jk_activity/app/activity/getActivityCityList.do' + params, {}, success, error, complete);
  };

  /**
   * 活动报名. (未开发)
   */
  this.reservationActivity = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jk_activity/app/activity/reservationActivity.do' + params, {}, success, error, complete);
  };

  /**
   * 活动签到. (未开发)
   *
   * auth=&token=&info={"activityId":""}
   */
  this.signUser = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jk_activity/app/activity/signUser.do' + params, {}, success, error, complete);
  };

  /**
   * 领奖接口. (未开发)
   *
   * auth=&token=&info={"activityId":""}
   */
  this.takeThePrize = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jk_activity/app/activity/takeThePrize.do' + params, {}, success, error, complete);
  };

  /**
   * 修改报名城市. (未开发)
   *
   * auth=&token=&info={"activityId":"", "cityId":""}
   */
  this.modifyReservationCity = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jk_activity/app/activity/modifyReservationCity.do' + params, {}, success, error, complete);
  };

  /**
   * 获取APP用户的活动参与状态. (未开发)
   *
   * auth=&token=&info={"activityId":""}
   */
  this.getActivityUserStatus = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jk_activity/app/activity/getActivityUserStatus.do' + params, {}, success, error, complete);
  };

  /**
   * 获取用户信息. (未开发)
   *
   * auth=&token=&info=N
   */
  this.getUserInfo = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jk_activity/app/activity/getUserInfo.do' + params, {}, success, error, complete);
  };

  /**
   * 获取轮播图.
   */
  this.slideShow = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jk_xdinfo/app/info/slideShow.do' + params, {}, success, error, complete);
  };

  /**
   * 获取资讯列表.
   */
  this.infoColumnlist = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jk_xdinfo/app/info/infoColumnlist.do' + params, {}, success, error, complete);
  };

  /**
   * 获取资讯详情.
   */
  this.content = function(data, success, error, complete) {
    var params = this.builderParams(data);
    this.sendRequest('/jk_xdinfo/app/info/content.do' + params, {}, success, error, complete);
  };

}

var Api = new _Api();
//Api.baseUrl = 'http://39.105.140.12:8080';
//Api.imagePrefix = 'https://app.yunzhixiang.cn';
//Api.promotionImagePrefx = 'http://39.105.140.12:8080/jkzzz/getFile?filename=';
//Api.promotionImagePrefx = 'https://app.yunzhixiang.cn:443/jkzzz/getFile?filename=';
Api.baseUrl = 'https://app.yunzhixiang.cn';
Api.imagePrefix = '';
Api.promotionImagePrefx = 'https://app.yunzhixiang.cn/jkzzz/getFile?filename=';
