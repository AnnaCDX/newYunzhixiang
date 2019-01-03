!function(window) {
	
	window.rem2px = function(val) {
		val = parseFloat(val);
		return val * rem;
	}
	
	window.px2rem = function(val) {
		val = parseFloat(val);
		return val / rem;
	}
	
	function rect() {
		var width = element.getBoundingClientRect().width;
		width = parseInt(width) > 720 ? 720 : width;
		var fontSize = width / 18.75;
		if (dpr >= 1 && dpr < 2) {
			dpr = 1;
		}
		if (dpr >= 2 && dpr < 3) {
			dpr = 2;
		}
		if (dpr >= 3) {
			dpr = 3;
		}
		element.setAttribute('style', 'font-size: ' + fontSize + 'px');
		element.setAttribute('data-dpr', dpr);
		element.firstElementChild.appendChild(style);
		style.innerHTML = 'body,html{font-size:' + fontSize + 'px!important;max-width: 720px;height: 100%;margin: 0 auto;}';
		window.dpr = dpr;
		window.rem = fontSize;
	}
	
	var time, 
			document = window.document, 
			element = document.documentElement,
			dpr = window.devicePixelRatio || 1, 
			style = document.createElement('style')
	window.addEventListener("resize", function() {
		clearTimeout(time),
		time = setTimeout(rect, 300)
	}, !1),
	window.addEventListener("pageshow", function(e) {
		e.persisted && (clearTimeout(time),
		time = setTimeout(rect, 300))
  }, !1),
  rect()
}(window);