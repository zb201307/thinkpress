var model = module.exports = Model(function(){
	return {
		/**
		 * 获取文章的分类id
		 * @param  {[type]} post_id [description]
		 * @return {[type]}         [description]
		 */
		getCateIds: function(post_id){
			return this.select({
				post_id: post_id
			}).then(function(data){
				data = (data || []).map(function(item){
					return item.cate_id;
				});
				return data;
			})
		},
		/**
		 * 获取多个文章的分类
		 * 支持多个文章获取
		 * @param  {[type]} post_id [description]
		 * @return {[type]}         [description]
		 */
		getPostCate: function(post_id){
			var where = isArray(post_id) ? {post_id: ["IN", post_id]} : {post_id: post_id};
			var postCate = [];
			var postCatePromise = this.where(where).select().then(function(data){
				postCate = data;
			})
			var cateModel = D('Cate');
			var cate = {};
			var catePromise = cateModel._adminGetList(true).then(function(data){
				data.forEach(function(item){
					cate[item.id] = item.name;
				})
			})
			return Promise.all([
				postCatePromise,
				catePromise
			]).then(function(){
				var data = {};
				postCate.forEach(function(item){
					if (!data[item.post_id]) {
						data[item.post_id] = [];
					};
					if (cate[item.cate_id]) {
						data[item.post_id].push(cate[item.cate_id]);
					};
				});
				return isArray(post_id) ? data : data[post_id];
			})
		},
		/**
		 * 更新文章的分类id
		 * @param  {[type]} post_id  [description]
		 * @param  {[type]} cate_ids [description]
		 * @return {[type]}          [description]
		 */
		updatePostCate: function(post_id, cate_ids){
			if (!isArray(cate_ids)) {
				return getPromise();
			};
			var self = this;
			return this.where({
				post_id: post_id
			}).delete().then(function(){
				if (cate_ids.length == 0 ) {
					return getPromise();
				};
				var data = cate_ids.map(function(id){
					return {
						post_id: post_id,
						cate_id: id
					};
				});
				return self.addAll(data);
			})
		}
	}		
})