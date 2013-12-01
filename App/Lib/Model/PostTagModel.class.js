var model = module.exports = Model(function(){
	return {
		/**
		 * 更新文章的标签
		 * @param  {[type]} tags [description]
		 * @return {[type]}      [description]
		 */
		updatePostTag: function(tags){
			if (!is_array(tags)) {
				return get_promise(false);
			};
			tags.forEach(function(item){
				
			})
		}
	}		
})