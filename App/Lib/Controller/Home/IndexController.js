/**
 * controller
 * @return 
 */
module.exports = Controller(function(){
	return {
		init: function(http){
			this.super_("init", http);
			//设置选项
			this.assign("title", "");
			this.assign("navType", "post");
			this.assign("static_host", C("static_host") || "");
		},
		/**
		 * 文章列表
		 * @return {[type]} [description]
		 */
		indexAction: function(){
			var model = D("Post");
			var self = this;
			var promise = model.page(this.get("page")).limit(20)
			.field("id,datetime,title,alias_title")
			.order("datetime DESC").setRelation(false).where({
				type: "post",
				status: "publish"
			}).select().then(function(data){
				data = data.map(function(item){
					item.datetime = getDate(item.datetime);
					return item;
				})
				self.assign("list", data);
				self.display();
			});
			return promise;
		},
		/**
		 * 详细页面
		 * @param  {[type]} alias_title [description]
		 * @return {[type]}             [description]
		 */
		detailAction: function(){
			var alias_title = this.get('alias_title');
			if (!alias_title) {
				return this.redirect("/");
			};
			var model = D('Post');
			var self = this;
			var specialPage = false;
			if (["about", "links", 'project'].indexOf(alias_title) > -1) {
				specialPage = true;
				self.assign("navType", alias_title);
			}
			var promise = model.where({
				alias_title: alias_title
			}).setRelation(false).field("id,title,content,datetime,type").find().then(function(data){
				if (isEmpty(data)) {
					console.log(alias_title + " not found");
					return self.display("index:404");
				};
				data.datetime = getDate(data.datetime);
				self.assign("detail", data);
				self.assign("title", data.title);
				self.assign("url", specialPage ? "" : alias_title);
				self.display();
			});
			return promise;
		},
		/**
		 * 存档
		 * @return {[type]} [description]
		 */
		archiveAction: function(){
			var self = this;
			var model = D("Post");
			var promise = model.field("title,alias_title,datetime")
			.order("datetime DESC").where({
				type: "post",
				status: "publish"
			}).setRelation(false).select().then(function(data){
				var result = {};
				data.forEach(function(item){
					var year = Date.format(item.datetime, "yyyy") + " ";
					if (!(year in result)) {
						result[year] = [];
					};
					item.datetime = getDate(item.datetime);
					result[year].push(item);
				});
				self.assign("list", result);
				self.display();
			});
			return promise;
		},
		/**
		 * feed
		 * @return {[type]} [description]
		 */
		feedAction: function(){
			var self = this;
			self.header("Content-Type", "text/xml");

			var model = D("Post");
			var promise = model.field("title,alias_title,datetime,content")
			.order("datetime DESC").setRelation(false).where({
				type: "post",
				status: "publish"
			}).limit(20).select().then(function(data){
				self.assign("list", data || []);
				self.display(VIEW_PATH + "/Home/index_feed.xml");
			});
			return promise;
		},
		__call: function(){
			this.redirect("/");
		},
		testAction: function(){
			this.sendTime('Exec-Time');
			this.end(this.ip());
		},
		_404Action: function(){
			return this.redirect("/");
		}
	}
});