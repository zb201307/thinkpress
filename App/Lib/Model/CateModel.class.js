/**
 * 分类模型
 * @return {[type]} [description]
 */
var model = module.exports = Model(function(){
    return {
        /**
         * 获取列表
         * @param  {[type]} http [description]
         * @param  {[type]} all  [description]
         * @return {[type]}      [description]
         */
        _adminGetList: function(http){
            if (http === true) {
                return this.select();
            };
            return this.page(http.get.page).order(http.get.order).select();
        },
        /**
         * 删除
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        _adminDelete: function(id){
            if (id === "true") {
                return this.delete();
            }else{
                return this.where({
                    id: ["IN", id]
                }).delete();
            }
        }
    }
})