module.exports = inherits("Admin/BaseController", function(){
	return {
		navType: "post",
		listAction: function(){

		},
		itemAction: function(){
			this.display();
		}
	}
})