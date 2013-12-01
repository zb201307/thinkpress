$(function(){
	//codemirror编辑器
	var editor = null;
	if ($('#field_content').length) {
		editor = CodeMirror.fromTextArea(document.getElementById("field_content"), {
			lineNumbers: true,
			styleActiveLine: true,
			matchBrackets: true,
			mode: "markdown",
			lineWrapping: true,
			viewportMargin: Infinity
	  	});
	  	editor.setOption("theme", "solarized dark")
	};
	$(document.body).delegates({
		'#field_title': {
			blur: function(){
				if (!$('#field_alias_title').val()) {
					$('#field_alias_title').val(this.value);
				};
			}
		},
		//发表
		'.btn-publish': function(){
			var title = $('#field_title').val();
			var alias_title = $('#field_alias_title').val();
			var content = editor.getValue();
			var data = {
				title: title,
				alias_title: alias_title,
				markdown_content: content
			};
			var tag = [];
			$('.postTagList a.btn span').each(function(){
				tag.push($(this).html());
			});
			data.tag = tag;
			var cate_ids = [];
			$('#cateList input:checked').each(function(){
				cate_ids.push(this.value);
			})
			data.cate_ids = cate_ids;
			$.postData("/admin/post/item", data).then(function(){
				location.href = '/admin/post/list';
			})
		},
		'#field_tag': {
			keypress: function(event){
				if (event.keyCode == 13) {
					var tagList = [];
					var postTagList = $('.postTagList');
					postTagList.find('a.btn span').each(function(){
						tagList.push($(this).html());
					});
					console.log(tagList)
					var value = this.value.trim();
					value = value.split(",").filter(function(item){
						item = item.trim();
						if (item) {
							return item;
						};
					});
					value.forEach(function(item){
						if (tagList.indexOf(item) > -1) {
							return true;
						};
						var tpl = '<a class="btn btn-default"><span>'+item+'</span><sup>x</sup></a>';
						$(tpl).appendTo(postTagList);
					});
					this.value = "";
				};
			}
		},
		'.postTagList a.btn sup': function(){
			$(this).parents("a.btn").remove();
		}
	})
})