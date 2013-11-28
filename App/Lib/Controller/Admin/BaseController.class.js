/**
 * 后台controller基类
 * @return {[type]} [description]
 */
module.exports = Controller(function(){
	return {
		init: function(http){
			this.super("init", http);
			if (this.http.action != "login") {
				this.checkLogin();
			};
			if (this.navType) {
				this.assign("navType", this.navType);
			};
		},
		/**
		 * 检测是否登录
		 * @return {[type]} [description]
		 */
		checkLogin: function(){
			
		}
	}
})