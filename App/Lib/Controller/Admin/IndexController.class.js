module.exports = inherits("Admin/BaseController", function(){
	return {
		init: function(http){
			this.super("init", http);
		},
		loginAction: function(){
			this.display();
		},
		indexAction: function(){
			this.redirect("/admin/post/list")
		}
	}
})