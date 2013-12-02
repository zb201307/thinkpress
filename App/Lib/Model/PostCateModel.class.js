var model = module.exports = Model(function(){
	return {
		getCateIds: function(post_id){
			return this.select({
				post_id: post_id
			}).then(function(data){
				data = data || [];
				data = data.map(function(item){
					return item.cate_id;
				});
				return data;
			})
		}
	}		
})