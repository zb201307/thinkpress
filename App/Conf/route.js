/**
 * 自定义路由
 * @type {Object}
 */
module.exports = {
	//分类
	// "/^category\/(.+?)\/feed\/(feed|rdf|rss|rss2|atom)\/?$/": "",
	// "/^category\/(.+?)\/(feed|rdf|rss|rss2|atom)\/?$/": "",
	// "/^category\/(.+?)\/page\/([0-9]{1,})\/?$/": "index/cate?cate=:1&page=:2",
	// "/^category\/(.+?)\/?$/": "index/cate?cate=:1&page=1",
	// //标签
	// "/^tag\/([^/]+)\/feed\/(feed|rdf|rss|rss2|atom)\/?$/": "",
	// "/^tag\/([^/]+)\/(feed|rdf|rss|rss2|atom)\/?$/": "",
	// "/^tag\/([^/]+)\/page\/?([0-9]{1,})\/?$/": "index/tag?tag=:1&page=:2",
	// "/^tag\/([^/]+)\/?$/": "index/tag?tag=:1&page=1",
	"/^feed/": "index/feed",
	//登录页面
	"/^login\/?$/": "admin/index/login",
	"/^logout\/?$/": "admin/index/logout",
	"/^page\/([0-9]+)/": "index/index?page=:1",
	"/^index\/(.+)/": "index/:1",
	"/^archive/": "index/archive",
	"/^(.*)\.html\/comment-page/": "index/detail?alias_title=:1",
	"/^(?!admin)(.+)$/": "index/detail/?alias_title=:1"
}