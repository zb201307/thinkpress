var marked = require("marked");
/**
 * 文章模型
 * @return {[type]} [description]
 */
var model = module.exports = Model("AdvModel", function(){
    return {
        relation: {
            Tag: 4,
            Cate: 4
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
         * 单个文章提交类操作
         * @param  {[type]} http [description]
         * @return {[type]}      [description]
         */
        postItem: function(http){
            var id = http.post.id;
            //删除操作
            if (http.post.method === 'delete') {
                return this.where({id: id}).delete();
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
            data.Tag = (data.tag || "").split(",");
            delete data.tag;
            data.Cate = (data.cate_ids || "").split(",");
            if (data.id) {
                return this.update(data);
            }else{
                return this.add(data);
            }
        }
    }
})