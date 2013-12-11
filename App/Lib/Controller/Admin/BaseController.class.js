/**
 * 后台controller基类
 * @return {[type]} [description]
 */
module.exports = Controller(function(){
	return {
		promise: null,
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
			var self = this;
			var deferred = when.defer();
			this.session("login").then(function(value){
				if (is_empty(value)) {
					deferred.reject();
					return self.redirect("/login");
				};
				deferred.resolve();
			})
			this.promise = deferred.promise;
		}
	}
})