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
                if (is_empty(data)) {
                    return [];
                };
                var post_ids = [];
                data = data.map(function(item){
                    post_ids.push(item.id);
                    item.datetime = get_dateTime(item.datetime);
                    return item;
                });
                //文章标签
                var postTagModel = D('PostTag');
                var postTagPromise = postTagModel.getPostTag(post_ids).then(function(tags){
                    data = data.map(function(item){
                        item.tag = tags[item.id] || [];
                        return item;
                    })
                });
                //文章分类
                var postCateModel = D('PostCate');
                var postCatePromse = postCateModel.getPostCate(post_ids).then(function(cates){
                    data = data.map(function(item){
                        item.cate = cates[item.id] || [];
                        return item;
                    })
                });
                return when.all([postTagPromise]).then(function(){
                    return data;
                })
            })
        },
        /**
         * 删除文章，可以是多个文章
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        _adminDeletePost: function(id){
            var ret = '';
            var where = is_array(id) ? {post_id: ["IN", id]} : {post_id: id};
            var promise = this.delete(id).then(function(rows){
                ret = rows;
            });
            var catePromise = D('PostCate').where(where).delete();
            var tagPromise = D('PostTag').where(where).delete();
            return when.all([
                promise, catePromise, tagPromise
            ]).then(function(){
                return ret;
            });
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
                var ids = http.post.ids || [];
                if (ids.length > 0) {
                    return this._adminDeletePost(ids);
                }else if(id){
                    return this._adminDeletePost(id);
                }else{
                    return get_promise(false);
                }
            };
            //更新或者添加内容
            var data = http.post;
            //获取解析后的内容
            var content = markdown.toHTML(data.markdown_content);
            data.content = content;
            data.datetime = get_dateTime();
            //文章的id
            var postId = data.id;
            var promise = null;
            var self = this;
            if (data.id) {
                promise = this.update(data);
            }else{
                promise = this.add(data).then(function(insertId){
                    return (postId = insertId);
                });
            }
            return promise.then(function(){
                if (!postId) {
                    return get_promise(false);
                };
                var tags = (data.tag || "").split(",");
                var cate_ids = (data.cate_ids || "").split(",");
                D("PostTag").updatePostTag(postId, tags);
                D("PostCate").updatePostCate(postId, cate_ids);
            })
        }
    }
})