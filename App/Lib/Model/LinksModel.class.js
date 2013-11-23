/**
 * 友情链接模型
 * @return {[type]} [description]
 */
var model = module.exports = Model(function(){
    return {
    	/**
    	 * 获取友情链接列表
    	 * @return {[type]} [description]
    	 */
        getLinks: function(){
        	return this.field("link_url,link_name,link_target").where({
                link_visible: "Y"
            }).cache(3600 * 24).select();
        }
    }
})