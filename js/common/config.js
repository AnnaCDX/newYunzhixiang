$.config = {
	router: false,
	showPageLoadingIndicator: false,
	routerFilter: function($link) {
    // 某个区域的 a 链接不想使用路由功能
    if ($link.is('.disable-router a')) {
        return false;
    }
    return true;
	}
}