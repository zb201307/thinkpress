module.exports = inherits("Admin/BaseController", function(){
	return {
		init: function(http){
			this.super("init", http);
		},
		loginAction: function(){
			this.redirect("http://www.baidu.com")
			//this.display();
		},
		indexAction: function(){
			var self = this;
			var model = D("Post");
			model._adminPostList(this.http).then(function(data){
				self.assign("post", data || []);
				self.display();
			});
		},
		testAction: function(){
			this.end();
		}
	}
})