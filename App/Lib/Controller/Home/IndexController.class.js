/**
 * controller
 * @return 
 */
module.exports = Controller(function(){
    return {
        getOptions: function(){
            var self = this;
            var model = D('Options');
            return model.getBlogOptions().then(function(data){
                self.assign("options", data || {});
            })
        },
        /**
         * 获取友情连接
         * @return {[type]} [description]
         */
        getLinks: function(){
            var model = D("Links");
            var self = this;
            return model.getLinks().then(function(data){
                self.assign("links", data || []);
            })
        },
        getPosts: function(){
            var model = D("Posts");
            var self = this;
            return model.getPostsList().then(function(data){
                self.assign("posts", data || []);
            })
        },
        /**
         * 最近文章
         * @return {[type]} [description]
         */
        getRecentPosts: function(){
            var model = D("Posts");
            var self = this;
            return model.getRecentPosts().then(function(data){
                self.assign("recentPosts", data || []);
            })
        },
        //获取分类
        getCates: function(){
            var model = D('TermTaxonomy');
            var self = this;
            return model.getCateList().then(function(data){
                
                self.assign("cates", data || []);
            });
        },
        indexAction: function(){
            this.end("index");
        },
        /**
         * 分类
         * @param  {[type]} cate [description]
         * @param  {[type]} page [description]
         * @return {[type]}      [description]
         */
        cateAction: function(cate, page){
            this.end(cate + ":" + page);
        },
        /**
         * 详细页面
         * @return {[type]} [description]
         */
        detailAction: function(){

        },
        /**
         * 标签
         * @param  {[type]} tag  [description]
         * @param  {[type]} page [description]
         * @return {[type]}      [description]
         */
        tagAction: function(tag, page){

        },
        __call: function(){
            this.redirect("/");
        }
    }
});