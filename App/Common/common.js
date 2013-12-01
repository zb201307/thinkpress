E('return_home', function(controller, group, http){
	console.log(controller, group)
	//http.redirect("http://www.baidu.com")
})
/**
 * 获取日期
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
global.get_date = function(date){
	if (!date) {
		date = new Date;
	}else{
		date = is_date(date) ? date : new Date(date);
	}
	return [
		date.getFullYear(),
		(date.getMonth() >= 9 ? "" : "0") + (date.getMonth() + 1),
		(date.getDate() >= 9 ? "" : "0") + (date.getDate() + 1)
	].join("-");
}