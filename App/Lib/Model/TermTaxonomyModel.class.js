/**
 * 分类之类的关系模型
 * @return {[type]} [description]
 */
var model = module.exports = Model(function(){
    return {
    	/**
    	 * 获取分类列表
    	 * @return {[type]} [description]
    	 */
        getCateList: function(){
        	return this.field("term_id,parent,count").where({
                taxonomy: "category"
            }).cache(3600 * 24).select().then(function(data){
                if (!data) {
                    return data;
                };
                var result = {};
                var termIds = data.map(function(item){
                    result[item.term_id] = item;
                    return item.term_id;
                });
                var model = D("Terms");
                return model.getCateList(termIds).then(function(data){
                    if (!data) {
                        return data;
                    };
                    data.forEach(function(item){
                        result[item.term_id] = extend(result[item.term_id], item);
                    });
                    //将数据转为有级别关系的数据
                    function getData(data, parentId){
                        parentId = parentId || 0;
                        var result = [];
                        for(var key in data){
                            var val = data[key];
                            if (val.parent == parentId) {
                                var children = getData(data, val.term_id);
                                if (children.length) {
                                    //父级的count是子级别之和
                                    val.count = 0;
                                    children.forEach(function(item){
                                        val.count += item.count;
                                    })
                                    val.children = children;
                                };
                                result.push(val);
                                delete data[key];
                            };
                        }
                        return result;
                    }
                    result = getData(result);
                    return result;
                })
            });
        }
    }
})