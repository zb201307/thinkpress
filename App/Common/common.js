/**
 * 返回首页
 * @return {[type]} [description]
 */
E("return_home", function(controller, group, http){
	console.log(http.pathname + " not found");
	http.redirect("/");
})
/**
 * 格式化日期
 * @param  {[type]} date    [description]
 * @param  {[type]} pattern [description]
 * @return {[type]}         [description]
 */
Date.format = function (date, pattern) {
	if (!date) {
		date = new Date; 
	}else{
		if(!is_date(date)){
			date = new Date(date);
		}
	}
	pattern = pattern || 'yyyy-MM-dd';
	var y = date.getFullYear().toString();
	var o = {
		M: date.getMonth() + 1, //month
		d: date.getDate(), //day
		h: date.getHours(), //hour
		m: date.getMinutes(), //minute
		s: date.getSeconds() //second
	};
	pattern = pattern.replace(/(y+)/ig, function(a, b) {
		return y.substr(4 - Math.min(4, b.length));
	});
	for (var i in o) {
		pattern = pattern.replace(new RegExp('(' + i + '+)', 'g'), function(a, b) {
			return (o[i] < 10 && b.length > 1) ? '0' + o[i] : o[i];
		});
	}
	return pattern;
}
/**
 * 获取日期
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
global.get_date = function(date){
	return Date.format(date);
}
/**
 * 获取日期和时间
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
global.get_dateTime = function(date){
	return Date.format(date, "yyyy-MM-dd hh:mm:ss");
}