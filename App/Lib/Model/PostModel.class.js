var marked = require("marked");
/**
 * 文章模型
 * @return {[type]} [description]
 */
var model = module.exports = Model("AdvModel", function(){
    return {
        /**
         * 文章列表
         * @param  {[type]} http [description]
         * @return {[type]}      [description]
         */
        _adminPostList: function(http){
            var order = http.get.order || "id DESC";
            return this.field("id,title,status,datetime").where({
                type: "post"
            }).page(http.get.page).order(order).select().then(function(data){
                if (isEmpty(data)) {
                    return [];
                };
                var post_ids = [];
                data = data.map(function(item){
                    post_ids.push(item.id);
                    item.datetime = getDateTime(item.datetime);
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
                return Promise.all([
                    postTagPromise,
                    postCatePromse
                ]).then(function(){
                    return data;
                })
            })
        },
        /**
         * 将文章内容转化为markdown格式
         * @return {[type]} [description]
         */
        contentToMarkdown: function(){
            var self = this;
            var toMarkdown = require('to-markdown').toMarkdown;
            return this.select().then(function(data){
                var promises = [];
                (data || []).forEach(function(item){
                    if (isEmpty(item.markdown_content)) {
                        var markdown_content = toMarkdown(item.content);
                        var promise = self.update({
                            id: item.id,
                            markdown_content: markdown_content
                        });
                        promises.push(promise);
                    };
                });
                return Promise.all(promises);
            })
        },
        /**
         * 将markdown转化为内容
         * @return {[type]} [description]
         */
        markdownToContent: function(){
            var self = this;
            return this.select().then(function(data){
                var promises = [];
                (data || []).forEach(function(item){
                    if (!isEmpty(item.markdown_content)) {
                        var content = marked(item.markdown_content);
                        var promise = self.update({
                            id: item.id,
                            content: content
                        });
                        promises.push(promise);
                    };
                });
                return Promise.all(promises);
            })
        },
        /**
         * 删除文章，可以是多个文章
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        _adminDeletePost: function(id){
            var ret = '';
            var where = isArray(id) ? {post_id: ["IN", id]} : {post_id: id};
            var promise = this.delete(id).then(function(rows){
                ret = rows;
            });
            var catePromise = D('PostCate').where(where).delete();
            var tagPromise = D('PostTag').where(where).delete();
            return Promise.all([
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
                    return get_promise();
                }
            };
            //更新或者添加内容
            var data = http.post;
            //获取解析后的内容
            var content = marked(data.markdown_content);
            data.content = content;
            if (!data.id) {
                data.datetime = getDateTime();
            };
            data.edit_datatime = getDateTime();
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
                    return get_promise();
                };
                var tags = (data.tag || "").split(",");
                var cate_ids = (data.cate_ids || "").split(",");
                D("PostTag").updatePostTag(postId, tags);
                D("PostCate").updatePostCate(postId, cate_ids);
                return 1;
            })
        }
    }
})