/**
 * 选项模型
 * @return {[type]} [description]
 */
var model = module.exports = Model(function(){
    return {
    	/**
    	 * 获取博客相关的信息
    	 * @return {[type]} [description]
    	 */
        getBlogOptions: function(){
        	var where = [
        		"`option_name`='blogname'",
        		"`option_name`='blogdescription'"
        	].join(" OR ");
        	return this.where(where).cache(3600 * 24).field("option_name,option_value").select().then(function(data){
        		var result = {};
        		data.forEach(function(item){
        			result[item.option_name] = item.option_value;
        		})
        		return result;
        	});
        }
    }
})