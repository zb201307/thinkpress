(function(){
/**
 * 基于配置的事件代理
 * @param  {[type]} configs [description]
 * @return {[type]}         [description]
 */
$.fn.delegates = function(configs){
    el = $(this[0]);
    for(var name in configs){
        var value = configs[name];
        if (typeof value == 'function') {
            var obj = {};
            obj.click = value;
            value = obj;
        };
        for(var type in value){
            el.delegate(name, type, value[type]);
        }
    }
    return this;
}

/**
 * 动态创建一个类
 * @return {[type]} [description]
 */
$.Class = function (prop) {    
    var cls = function () {        
        function T(args) {            
            return this.init.apply(this, args);        
        }        
        var _t = arguments.callee,
            init = _t.prototype.init;
        T.prototype = _t.prototype; 
        T.prototype.init = function () {            
            var args = arguments;          
            if (args.length === 1 && args[0] instanceof _t) {                
                return this;             
            };   
            init && init.apply(this, args);             
            return this;        
        };            
        T.constructor = _t;            
        return new T(arguments);     
    };        
    cls.extend = $.Class.extend;
    if (typeof prop == 'function') {
        prop = prop();
    };
    prop = prop || {};
    for(var name in prop){
        cls.prototype[name] = prop[name];
    }
    return cls;
}
/**
 * 类继承
 * @param  {[type]} prop [description]
 * @return {[type]}      [description]
 */
$.Class.extend = function (prop){
    if (typeof prop == 'function') {
        prop = prop();
    };
    var _super = this.prototype;
    // Instantiate a base Class (but only create the instance,
    // don't run the init constructor)
    var prototype = $.extend({}, _super);
    for (var name in prop) {
        if(typeof prop[name] == "function" && typeof _super[name] == "function"){
            prototype[name] = (function (name, fn) {
                return function () {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    return ret;
                };
            })(name, prop[name]);
        }
        else{
            prototype[name] = prop[name];
        }
    }
    var Class = pp.Class(prototype);
    return Class;
};
/**
 * 将json变为uri参数
 * @param  {[type]} json [description]
 * @return {[type]}      [description]
 */
$.encodeURIJson = function (json){
    var s = [];
    for( var p in json ){
        if(json[p]==null) continue;
        if(json[p] instanceof Array)
        {
            for (var i=0;i<json[p].length;i++) s.push( encodeURIComponent(p) + '=' + encodeURIComponent(json[p][i]));
        }
        else
            s.push( (p) + '=' + encodeURIComponent(json[p]));
    }
    return s.join('&');
}
/**
 * 解析uri里的参数
 * @param  {[type]} url [description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
$.queryUrl = function (url, key) {
    url = url.replace(/^[^?=]*\?/ig, '').split('#')[0]; //去除网址与hash信息
    var json = {};
    //考虑到key中可能有特殊符号如“[].”等，而[]却有是否被编码的可能，所以，牺牲效率以求严谨，就算传了key参数，也是全部解析url。
    url.replace(/(^|&)([^&=]+)=([^&]*)/g, function (a, b, key , value){
        //对url这样不可信的内容进行decode，可能会抛异常，try一下；另外为了得到最合适的结果，这里要分别try
        try {
        key = decodeURIComponent(key);
        } catch(e) {}

        try {
        value = decodeURIComponent(value);
        } catch(e) {}

        if (!(key in json)) {
            json[key] = /\[\]$/.test(key) ? [value] : value; //如果参数名以[]结尾，则当作数组
        }
        else if (json[key] instanceof Array) {
            json[key].push(value);
        }
        else {
            json[key] = [json[key], value];
        }
    });
    return key ? json[key] : json;
}
$.getUrlPath = function(){
    var url = location.protocol + "//"+location.hostname;
    if (location.port!="80") {
        url+= ":"+location.port;
    };
    url += location.pathname;
    return url;
}
/**
 * 分页插件
 * @return {[type]} [description]
 */
$.pager = $.Class(function(){
    function getUrl(page){
        var pars = $.queryUrl(location.href);
        pars.page = page;
        pars = $.encodeURIJson(pars);
        url = $.getUrlPath() + "?"+pars;
        return url;
    }

    return {
        jump: function (){
            var value = document.getElementById("input_num").value;
            location.href = getUrl(value);
        },
        init: function(el, totalPage, currentPage, callback, totalNum){
            this.el = $(el);
            this.totalPage = totalPage;
            if (typeof currentPage == 'function') {
                currentPage = '';
                callback = currentPage;
            };
            this.currentPage = currentPage;
            this.callback = callback;
            this.totalNum = totalNum;
        },
        getHtml: function(){
            var page = 1;
            if (this.currentPage) {
                page = this.currentPage;
            }else{
                var match = location.href.match(/page=(\d+)/);
                if (match) {
                    page = match[1];
                };
            }
            page = parseInt(page, 10);
            if (this.totalPage <= 1) {
                this.el.hide();
                return false;
            };
            if (page > this.totalPage) {
                page = this.totalPage;
            };
            var html = [];
            if(typeof this.totalNum == 'undefined'){
                html.push ("<span class='total-record' >共"+totalNum+"条记录</span>");
            }
            else{
                html.push ("<span class='total-record' >共"+this.totalNum+"条记录</span>");
            }
            if (page > 1) {
                html.push('<a data-page="'+(page - 1)+'" href="'+getUrl(page - 1)+'" class="prev">上一页</a>');
            };
            var num = 3;
            var pageIndex = [];
            for(var i = page - num; i <= page + num; i++){
                if (i >= 1 && i <= this.totalPage) {
                    pageIndex.push(i);
                };
            }
            if (pageIndex[0] > 1) {
                html.push('<a data-page="1" href="'+getUrl(1)+'">1</a>')
            };
            if (pageIndex[0] > 2) {
                html.push('<span>…</span>');
            };
            for(var i=0,length=pageIndex.length;i<length;i++){
                var p = pageIndex[i];
                if (p == page) {
                    html.push('<a href="###" class="current">'+p+'</a>');
                }else{
                    html.push('<a data-page="'+p+'" href="'+getUrl(p)+'">'+p+'</a>');
                }
            }
            if (pageIndex.length > 1) {
                var last = pageIndex[pageIndex.length - 1];
                if (last < (this.totalPage - 1)) {
                    html.push('<span>…</span>');
                };
                if (last < this.totalPage) {
                    html.push('<a data-page="'+(this.totalPage)+'" href="'+getUrl(this.totalPage)+'">'+this.totalPage+'</a>')
                };
            };
            html.push('<input type="text" id="input_num" class="pagination-num" />');

            html.push('<a target="" onclick="$.pager().jump();return false;" href="#">跳转</a>');
            if (page < this.totalPage) {
                html.push('<a data-page="'+(page+1)+'" href="'+getUrl(page + 1)+'" class="next">下一页</a>')
            };



            html = html.join(' ');
            return html;
        },
        run: function(){
            this.bindEvent();
            var html = this.getHtml();
            this.el.html(html);

        },
        bindEvent: function(){
            var instance = this;
            this.el.delegates({
                '.pagination-num': {
                    'keypress': function(e){
                        var self = this;
                        setTimeout(function(){
                            var value = parseInt(self.value, 10) || 1;
                            self.value = value;
                            if (e.keyCode == 13 && value) {
                                if (instance.callback) {
                                    instance.callback(value);
                                }else{
                                    location.href = getUrl(value);
                                }
                            };
                        }, 50)
                    }
                },
                'a': function(event){
                    if (instance.callback) {
                        event.preventDefault();
                        instance.callback($(this).attr('data-page'));
                    };
                }
            })
        }
    }
});



//转码
$.encode4Html = function(s){
    var el = document.createElement('pre');
    var text = document.createTextNode(s);
    el.appendChild(text);
    return el.innerHTML;
}
//弹出层
$.panel = function(configs){
    var content = configs.content;
    content = $('<div>'+content+'</div>');
    configs.width = configs.width || 500;
    configs.title = configs.title || "标题"
    var panel = content.dialog(configs);
    panel.on("dialogclose", function(){
        panel.dialog( "destroy" );
    });
    return panel;
};
$.alert = function(configs){
    configs.buttons = [{
        text: configs.button || "确定",
        click: function(){
            $( this ).dialog( "close" );
        }
    }];
    if (typeof configs.modal == 'undefined') {
        configs.modal = true;
    };
    var panel = $.panel(configs);
    return panel;
}


$.confirm = function(configs, callback){
    configs.buttons = [{
        text: configs.button || "确定",
        click: function(){
            callback && callback(this);
        }
    },{
        text: "取消",
        click: function(){
            $( this ).dialog( "close" );
        }
    }];
    if (typeof configs.modal == 'undefined') {
        configs.modal = true;
    };
    panel = $.panel(configs);
    return panel;
}
//提示面板
$.popup = function(el, content){
    el = $(el);
    if (el.data("open") == 1) {
        return true;
    };
    el.data("open", 1);
    var configs = {
        title: "提示",
        content: '<div style="text-align:center;line-height:35px;">'+content+'</div>',
        width: 200,
        height: 140,
        modal: false,
        position: { my: "bottom", at: "top", of: el }
    };
    var defered = $.Deferred();
    var panel = $.confirm(configs, function(){
        defered.resolve(panel);
    });
    panel.on("dialogclose", function(){
        el.data("open", "0");
    });
    return defered;
}
var tipsTimer = 0;
$.tips = function(message, success){
    var html = ['<div id="tips" class="tips">',
        '<i class="tips-icon"></i>',
            '<span class="tips-txt"></span>',
        '</div>'].join("");
    if ($('#tips').length == 0) {
        $(html).appendTo(document.body);
    };
    var top = Math.max(document.body.scrollTop, document.documentElement.scrollTop, 90);
    $('#tips').css('top', top);
    $('#tips .tips-txt').html(message);
    var type = success ? "success" : "warning";
    $('#tips').show().removeClass('success warning').addClass(type);
    clearTimeout(tipsTimer);
    tipsTimer = setTimeout(function(){
        $('#tips').hide(300);
    }, 2000);
}

//json接口，返回一个promise
$.getJson = function(url, data){
    var defered = $.Deferred();
    $.getJSON(url, data).then(function(data){
        if (data.errno) {
            $.alert({
                title: "错误",
                content: '<div style="line-height:30px;text-align:center">'+(data.errmsg || data.errormsg)+'</div>'
            });
            defered.reject();
        }else{
            defered.resolve(data.data);
        }
    })
    return defered;
}
//提交接口，返回信息为成功或者失败
$.postTip = function(url, data){
    data = data || {};
    data[$('meta[name="csrf-param"]').attr('content')] = $('meta[name="csrf-token"]').attr('content');
    $.post(url, data).then(function(data){
        try{
            if (data.errno) {
                $.tips(data.errmsg || data.errormsg);
            }else{
                $.tips("操作成功", "success");
            }
        }catch(e){
            $.tips("系统错误，请稍后重试");
        }
    });
}
//提交接口，有返回的后续操作
$.postData = function(url, data){
    data = data || {};
  	var defered = $.Deferred();
    $.post(url, data).then(function(data){
        try{
            if (data.errno) {
                $.tips(data.errmsg || data.errormsg);
            }else{
                defered.resolve(data.data);
            }
        }catch(e){
            $.tips("系统错误，请稍后重试");
        }
    }).fail(function(){
        $.tips("系统错误，请稍后重试");
    })
    return defered;
}

//form提交
$.postForm = function(form, data){
    form = $(form);
    data = data || {};
    data[$('meta[name="csrf-param"]').attr('content')] = $('meta[name="csrf-token"]').attr('content');
    for(var name in data){
        var el = form.find('input[name="'+name+'"]');
        if (el.length == 0) {
            $('<input type="hidden" name="'+name+'" value="'+data[name]+'">').appendTo(form);
        }else{
            el.val(data[name]);
        }
    }
    var defered = $.Deferred();
    form.ajaxSubmit(function(data){
        try{
            if (data.errno) {
                $.tips(data.errmsg || data.errormsg);
            }else{
                defered.resolve(data.data);
            }
        }catch(e){
            $.tips("系统错误，请稍后重试");
        }
    });
    return defered;
}

})();