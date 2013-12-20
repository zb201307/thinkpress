module.exports = inherits("Admin/BaseController", function(){
	return {
		navType: "page",
		/**
		 * 列表
		 * @return {[type]} [description]
		 */
		listAction: function(){
			var self = this;
			D("Post").page(self.get("post")).where({
				type: "page"
			}).order('datetime DESC').select().then(function(data){
				data = (data || []).map(function(item){
					item.datetime = get_date(item.datetime);
					return item;
				})
				self.assign("list", data);
				self.display();
			});
		},
		/**
		 * 单个页面
		 * @return {[type]} [description]
		 */
		itemAction: function(){
			var self = this;
			if (self.isGet()) {
				var id = self.get("id");
				self.assign("item", {});
				if (id) {
					D("post").where({
						id: id,
						type: "page"
					}).find().then(function(data){
						self.assign("item", data || {});
						self.display();
					})
				}else{
					self.display();
				}
			}else if(self.isPost()){
				var data = self.post();
				//删除
				if (data.method === 'delete') {
					var id = data.id;
					if (id) {
						D("Post").where({
							type: "page",
							id: id
						}).delete().then(function(){
							self.end();
						})
					}else{
						this.end();
					}
				}else{
					var promise = null;
					data.type = "page";
					data.edit_dateTime = get_dateTime();
					data.content = require("marked")(data.markdown_content);
					if (data.id) {
						promise = D('Post').save(data);
					}else{
						delete data.id;
						data.datetime = get_dateTime();
						promise = D('Post').add(data);
					}
					promise.then(function(rows){
						self.end(rows);
					})
				}
			}
		}
	}
})