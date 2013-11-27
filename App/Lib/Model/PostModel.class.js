/**
 * 文章模型
 * @return {[type]} [description]
 */
var model = module.exports = Model(function(){
    return {
        _adminPostList: function(http){
            return this.page(http.get.page).order(http.get.order).select();
        },
    	/**
    	 * 获取文章列表
    	 * @param  {[type]} page [description]
    	 * @return {[type]}      [description]
    	 */
        getPostList: function(page){
        	var where = {
        		"status": "publish",
        		"type": "post"
        	};
        	var field = "*";
        	return this.field(field).where(where).order("date DESC").page(page).select();
        },
        /**
         * 获取近期文章
         * @return {[type]} [description]
         */
        getRecentPosts: function(){
            var where = {
                "post_status": "publish",
                "post_type": "post"
            };
            var field = "post_title,post_name";
            return this.field(field).where(where).cache(3600).limit(10).order("post_date DESC").select();
        },
        /**
         * 获取一篇博客的详细信息
         * @return {[type]} [description]
         */
        getPostDetail: function(){

        }
    }
})