## 介绍

基于thinkjs的简单博客系统

## 安装

### 拉取代码

```
git clone git@github.com:welefen/thinkpress.git
```

通过上面的命令拉取最新的代码。

`cd thinkpress`目录下，执行`npm install`安装所需要的依赖。

### 创建数据库

创建Mysql数据库，编码为utf-8，数据名为：`thinkpress`。将`db/`目录下的sql文件导入。

### 修改配置

打开`App/Conf/config.js`文件，修改如下的配置项：

```js
"db_host": "127.0.0.1",
"db_name": "www.welefen.com",
"db_user": "root",
"db_pwd": "root",
```

### 启动服务

`cd www/`目录下，执行`node index.js`，用浏览器访问`http://127.0.0.1:8360/`。

注：如果node是通过apt-get方式安装的，这里可能要执行`nodejs index.js`。

### 后台管理

访问`http://127.0.0.1:8360/admin`，账号和密码都是`admin`（账号、密码可以在App/Conf/config.js里修改），进入后台即可。

