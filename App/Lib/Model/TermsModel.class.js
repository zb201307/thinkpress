/**
 * 模型
 * @return {[type]} [description]
 */
var model = module.exports = Model(function(){
    return {
    	/**
    	 * 获取分类列表
    	 * @return {[type]} [description]
    	 */
        getCateList: function(cateIds){
            return this.where({
                term_id: ["IN", cateIds]
            }).cache(3600 * 24).select();
        }
    }
})