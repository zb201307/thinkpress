module.exports = inherits("Admin/BaseController", function(){
	return {
		navType: "cate",
		listAction: function(){
			var model = D('Cate');
			var self = this;
			var promise1 = model.count("id").then(function(data){
				if (data === false) {
					console.log(model.getDbError());
					self.end();
				};
				self.assign("count", data);
			});
			var promise2 = model._adminGetList(this.http).then(function(data){
				self.assign("list", data);
			});
			when.all([promise1, promise2]).then(function(){
				self.display();
			})
		},
		itemAction: function(){
			var model = D("Cate");
			console.log(this.http.get);
			return this.end();
			if (this.post("method") === 'delete') {
				var id = this.post("id");
				if (id !== true) {
					id = this.filter(id, 'ids');
				};
				model._adminDelete(id).then(function(rows){
					
				})
			}else if (this.isPost()) {

			}else{

			}
		}
	}
})