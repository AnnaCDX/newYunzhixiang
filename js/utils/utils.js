var Utils = (function() {

	/**
	 * 根据URL生成参数MAP
	 */
	function generateParameterMapByUrl(url) {
		var resultMap = {};
		if (url.split('?').length == 1) {
			return resultMap;
		}
		$.each(url.split('?')[1].split('&'), function(i, paramExp) {
			var keyAndValueArray = paramExp.split('=');
			resultMap[keyAndValueArray[0]] = keyAndValueArray[1];
		});
		return resultMap;
	}

	/**
	 * 计算两个日期的间隔分钟数.
	 * 
	 * 时间可以是Date对象，或者字符串,如2010-10-12 01:00:00 或者2010/10/12 01:00:00 
	 * 
	 * @param startTime 开始时间
	 * @param endTime 结束时间
	 */
	function dateDiffSeconds(startTime, endTime) {
		if('string' == typeof startTime) {
			startTime = startTime.replace(/\-/g, "/");
			startTime = new Date(startTime);
		}

		if('string' == typeof endTime) {
			endTime = endTime.replace(/\-/g, "/");
			endTime = new Date(endTime);
		}

		return parseInt((endTime.getTime() - startTime.getTime()) / 1000);
	}
	/**
	 * 计算两个日期的间隔分钟数.
	 * 
	 * 时间可以是Date对象，或者字符串,如2010-10-12 01:00:00 或者2010/10/12 01:00:00 
	 * 
	 * @param startTime 开始时间
	 * @param endTime 结束时间
	 */
	function dateDiffMinutes(startTime, endTime) {
		if(string == typeof startTime) {
			startTime = startTime.replace(/\-/g, "/");
			startTime = new Date(startTime);
		}

		if(string == typeof endTime) {
			endTime = endTime.replace(/\-/g, "/");
			endTime = new Date(endTime);
		}

		return parseInt((endTime.getTime() - startTime.getTime()) / 60000);
	}

	/**
	 * 格式化时间间隔.
	 * 
	 * 
	 * @param minutes 分钟数
	 * @return 如： 30天1小时2分钟
	 */
	function formatDateDiff(minutes) {
		var days = Math.floor(minutes / 1440);

		minutes -= days * 1440;
		var hours = Math.floor(minutes / 60);
		minutes -= hours * 60;
		var str = '';
		if(days > 0) {
			str += days + '天';
		}

		if(hours > 0) {
			str += hours + '小时';
		}

		if(minutes > 0) {
			str += minutes + '分钟';
		} else if(days == 0 && hours == 0) {
			str = '一分钟以内';
		}

		return days + '天' + hours + "小时" + minutes + "分钟";
	}

	return {
		dateDiffSeconds: dateDiffSeconds,
		dateDiffMinutes: dateDiffMinutes,
		formatDateDiff: formatDateDiff,
		generateParameterMapByUrl: generateParameterMapByUrl
	}

})();