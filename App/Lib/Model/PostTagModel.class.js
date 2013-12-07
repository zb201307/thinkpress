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
			var tagModel = D('Tag');
			return this.where(where).select().then(function(data){
				if (data === false) {
					return false;
				};
				var postTagList = data;
				tag_ids = data.map(function(item){
					return item.tag_id;
				});
				//获取标签id对应的名称
				return tagModel.getNames(tag_ids).then(function(data){
					if (data === false) {
						return false;
					};
					var tags = {};
					data.forEach(function(item){
						tags[item.id] = item.name;
					});
					var postTags = {};
					postTagList.forEach(function(item){
						if (!postTags[item.post_id]) {
							postTags[item.post_id] = [];
						};
						var tag = tags[item.tag_id];
						postTags[item.post_id].push(tag);
					});
					if (is_array(post_id)) {
						return postTags;
					}else{
						return Object.values(postTags)[0];
					}
				})
			})
		}
	}		
})