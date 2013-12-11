/**
 * controller
 * @return 
 */
module.exports = Controller(function(){
    return {
        init: function(http){
            this.super("init", http);
            //设置选项
            this.assign("options", {});
        },
        indexAction: function(){
            var model = D("Post");
            var self = this;
            model.page(this.get("page")).limit(20)
            .field("id,datetime,title,alias_title")
            .order("datetime DESC").where({
                type: "post",
                status: "publish"
            }).select().then(function(data){
                data = (data || []).map(function(item){
                    item.datetime = get_date(item.datetime);
                    return item;
                })
                self.assign("list", data);
                self.display();
            });
        },
        convertAction: function(){
            var self = this;
            // D('Post').contentToMarkdown().then(function(){
            //     self.end("finish");
            // })
            D('Post').markdownToContent().then(function(){
                self.end("finish");
            })
        },
        /**
         * 详细页面
         * @param  {[type]} alias_title [description]
         * @return {[type]}             [description]
         */
        detailAction: function(alias_title){
            if (!alias_title) {
                return this.redirect("/");
            };
            var model = D('Post');
            var self = this;
            model.where({
                alias_title: alias_title
            }).field("id,title,content,datetime,type").find().then(function(data){
                if (is_empty(data)) {
                    return self.display("index:404");
                };
                data.datetime = get_date(data.datetime);
                self.assign("detail", data);
                self.display();
            })
        },
        /**
         * 存档
         * @return {[type]} [description]
         */
        archiveAction: function(){
            var self = this;
            D("Post").field("title,alias_title,datetime")
            .order("datetime DESC").where({
                type: "post",
                status: "publish"
            }).select().then(function(data){
                var result = {};
                (data || []).forEach(function(item){
                    var year = Date.format(item.datetime, "yyyy") + " ";
                    if (!(year in result)) {
                        result[year] = [];
                    };
                    item.datetime = get_date(item.datetime);
                    result[year].push(item);
                });
                self.assign("list", result);
                self.display();
            })
        },
        __call: function(){
            console.log(arguments);
            this.redirect("/");
        }
    }
});