var markdown = require("markdown").markdown;
/**
 * 文章模型
 * @return {[type]} [description]
 */
var model = module.exports = Model(function(){
    return {
        /**
         * 文章列表
         * @param  {[type]} http [description]
         * @return {[type]}      [description]
         */
        _adminPostList: function(http){
            var order = http.get.order || "id DESC";
            return this.field("id,title,status,datetime").page(http.get.page).order(order).select().then(function(data){
                return data.map(function(item){
                    item.datetime = get_dateTime(item.datetime);
                    console.log(item.datetime);
                    return item;
                })
            })
        },
        /**
         * 单个文章提交类操作
         * @param  {[type]} http [description]
         * @return {[type]}      [description]
         */
        _adminItemPost: function(http){
            var id = http.post.id;
            //删除操作
            if (http.post.method === 'delete') {
                var ids = http.post.ids;
                if (ids.length > 0) {
                    return this.where({
                        id: ["IN", ids]
                    }).delete;
                }else if(id){
                    return this.delete(id);
                }else{
                    return get_promise(false);
                }
            };
            //更新或者添加内容
            var data = http.post;
            var content = markdown.toHTML(data.markdown_content);
            data.content = content;
            data.datetime = get_dateTime();
            if (data.id) {
                var id = data.id;
                delete data.id;
                return this.update(data, id).then(function(){

                });
            };
            var self = this;
            return this.add(data).then(function(insertId){
                if (insertId) {
                    var tags = (data.tag || "").split(",");
                    if (tags.length) {
                        D("PostTag").updatePostTag(insertId, tags);
                    };
                };
            });
        }
    }
})