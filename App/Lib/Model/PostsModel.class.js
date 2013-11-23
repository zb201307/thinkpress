/**
 * 文章模型
 * @return {[type]} [description]
 */
var model = module.exports = Model(function(){
    return {
    	/**
    	 * 获取文章列表
    	 * @param  {[type]} page [description]
    	 * @return {[type]}      [description]
    	 */
        getPostsList: function(page){
        	var where = {
        		"post_status": "publish",
        		"post_type": "post"
        	};
        	var field = "post_date,post_content,post_title,comment_status,post_name,comment_count";
        	return this.field(field).cache(3600 * 24).where(where).order("post_date DESC").page(page).select().then(function(data){
        		var more = "<!--more-->";
        		return data.map(function(item){
        			var content = item.post_content;
        			if (content.indexOf(more) > -1) {
        				content = content.split(more)[0];
        				item.more = true;
        			};
        			content = content.split(/\n/);
        			var flag = false;
        			content = "<p>" + content.map(function(item){
        				var lowItem = item.toLowerCase();
        				if (lowItem.indexOf("<pre") > -1 || lowItem.indexOf("<textarea") > -1) {
        					flag = true;
        					return item + "\n";
        				};
        				if (lowItem.indexOf("</pre>") > -1 || lowItem.indexOf("</textarea>") > -1) {
        					flag = false;
        					return item + "\n";
        				};
        				if (!flag) {
        					return "</p>" + item + "<p>";
        				};
        				return item + "\n";
        			}).join("") + "</p>";
        			item.post_content = content;
        			var date = new Date(item.post_date);
        			var month = date.getMonth() + 1;
        			if (month < 10) {
        				month = "0" + month;
        			};
        			item.md = month + '-' + date.getDate();
        			item.year = date.getFullYear();
        			return item;
        		})
        	});
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