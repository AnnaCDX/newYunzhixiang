function _Session() {
	'use strict';
	
	/**
	 * 保存session级别的参数
	 */
	this.setSession = function(name, value) {
		if (window.sessionStorage) {
			if (value == undefined || value == null || value == 'null' || value == '') {
				sessionStorage.removeItem(name);
			} else {
				sessionStorage.setItem(name, value);
			}
		} else {
			if (value == undefined || value == null || value == 'null' || value == '') {
				$.removeCookie(name);
			} else {
				$.cookie(name, value);
			}
		}
	}

	/**
	 * 取得session级别的参数
	 */
	this.getSession = function(name) {
		if (window.sessionStorage) {
			return sessionStorage.getItem(name);
		} else {
			return $.cookie(name);
		}
	}

	/**
	 * 在本地永久保存参数
	 */
	this.setLocal = function(name, value) {
		try {
			if (value) {
				$.cookie(name, value, {
					expires : 3650
				});
			} else {
				$.removeCookie(name);
			}
		} catch (e) {
			$.toast("出现错误", 5000);
		}
	}

	/**
	 * 取得本地永久保存的参数.
	 */
	this.getLocal = function(name, value) {
		return $.cookie(name);
	}

	/**
	 * 设置用户登录token.
	 */
	this.setToken = function(token) {
		this.setSession("token", token);
	}

	/**
	 * 获取用户登录token.
	 */
	this.getToken = function() {
		return this.getSession("token");
	}

	/**
	 * 设置用户登录userid.
	 */
	this.setUserId = function(userid) {
		this.setSession("userid", userid);
	}

	/**
	 * 获取用户登录userid.
	 */
	this.getUserId = function() {
		return this.getSession("userid");
	}

};

var Session = new _Session();
