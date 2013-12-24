/**
 * 自定义路由
 * @type {Object}
 */
module.exports = [
	[/^feed/, "index/feed"],
	[/^login\/?$/, "admin/index/login"],
	[/^logout\/?$/, "admin/index/logout"],
	[/^page\/(\d+)/, "index/index?page=:1"],
	[/^index\/(.+)/, "index/:1"],
	[/^archive/, "index/archive"],
	[/^(.*)\.html\/comment-page/, "index/detail?alias_title=:1"],
	[/^(?!admin)(.+)$/, "index/detail?alias_title=:1"]
]