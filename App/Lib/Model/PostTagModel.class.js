var model = module.exports = Model(function(){
	return {
		/**
		 * 更新文章的标签
		 * @param  {[type]} tags [description]
		 * @return {[type]}      [description]
		 */
		updatePostTag: function(post_id, tags){
			if (!is_array(tags)) {
				return get_promise(false);
			};
			var self = this;
			//删除已有的tag_id
			this.where({
				post_id: post_id
			}).delete();
			D('Tag').getIds(tags).then(function(data){
				var tag_ids = Object.values(data);
				data = tag_ids.map(function(id){
					return {
						post_id: post_id,
						tag_id: id
					};
				});
				return self.addAll(data);
			})
		},
		/**
		 * 获取文章的标签
		 * @param  {[type]} post_id [description]
		 * @return {[type]}         [description]
		 */
		getPostTag: function(post_id){
			var where = is_array(post_id) ? {post_id: ["IN", post_id]} : {post_id: post_id};
			var promise = this.select(where);
		}
	}		
})