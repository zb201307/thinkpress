/**
 * 后台controller基类
 * @return {[type]} [description]
 */
module.exports = Controller(function(){
	return {
		init: function(http){
			this.super_("init", http);
			if (this.navType) {
				this.assign("navType", this.navType);
			};
			if (this.http.action != "login") {
				return this.checkLogin();
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
				if (isEmpty(value)) {
					deferred.reject();
					return self.redirect("/login");
				};
				deferred.resolve();
			})
			return deferred.promise;
		}
	}
})