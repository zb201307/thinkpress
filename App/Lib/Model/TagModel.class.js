var model = module.exports = Model(function(){
	return {
		/**
		 * 获取标签对应的id
		 * @param  {[type]} tags [description]
		 * @return {[type]}      [description]
		 */
		getIds: function(tags){
			if (!isArray(tags)) {
				return get_promise();
			};
			var self = this;
			var allPromise = [];
			var tag_ids = {};
			tags.forEach(function(item){
				item = item.trim();
				if (!item) {
					return true;
				};
				var promise = self.where({
					name: item
				}).find().then(function(data){
					if(data){
						return tag_ids[item] = data.id;
					}else{
						return self.add({
							name: item,
							alias_name: item
						}).then(function(insertId){
							if (insertId) {
								tag_ids[item] = insertId;
							};
							return true;
						})
					}
				});
				allPromise.push(promise);
			});
			return when.all(allPromise).then(function(){
				return tag_ids;
			});
		},
		/**
		 * 通过id获取标签名
		 * @param  {[type]} ids [description]
		 * @return {[type]}     [description]
		 */
		getNames: function(ids){
			if (!isArray(ids)) {
				return get_promise();
			};
			return this.where({
				id: ["IN", ids]
			}).field("id,name").select();
		}
	}		
})