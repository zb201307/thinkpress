module.exports = {
    url_resource_on: true,
    "db_host": "127.0.0.1",
    "db_name": "www.welefen.com",
    "db_user": "root",
    "db_pwd": "root",
    "db_prefix": "thinkpress_",
    "db_nums_per_page": 10,
    "admin_username": "admin",
    "admin_password": "admin",
    "show_exec_time": true,
    "use_cluster": false,
    "session_type": "",
    "cache_type": "",
    "html_cache_on": false,
    "html_cache_rules": {
        "home:index:index": ["home_index_index_{page}", 24 * 3600],
        "home:index:detail": ["home_index_detail_{alias_title}", 24 * 3600],
        "home:index:archive": ["home_index_archive", 24 * 3600]
    }
};