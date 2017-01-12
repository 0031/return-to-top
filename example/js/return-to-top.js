// 使用闭包封装插件
;(function () {
  // 严格模式
  'use strict';
  var defaults = {
  	'bg': {
  		'show': true,			// 默认开启按钮背景
  		'dir': 'images'		// show=true时生效，背景图片文件夹路径，相对于使用该插件的html
  	},
  	'animate': {
  		'show': true,			// 默认开启图标动画，按钮背景show=true时生效，即有动画一定有背景，无背景一定无动画
  		'own': false,			// 如果网页之前已经引入了animate.css，则为true，不会再加载cdn，默认为false
  		'cdn': 'http://cdn.bootcss.com/animate.css/3.5.2/animate.min.css' // show=true时生效，animate.css静态cdn
  	},
    'id': 'return-to-top',  	// 返回顶部元素id
    'scroll': 'window'          // 滚动条基准，默认以浏览器滚动条，当然你可以设置为div的id
  };
  // 接收元素
  var elem = document.getElementById(defaults.id);
  // 接收滚动条基准，默认则是浏览器滚动条
  var scrollElem = window;
  // 元素最初的class内容
  var initClassName = '';
  // 滚动条计时器
  var timeout = false;
  // 传入参数
  var options = {};

  // 核心函数，将会暴露给调用者
  var api = {
    // 初始化
    init: function(ops){
      // 有参数传入,将对象扩展，类似jQuery中$.extend({},defaults, options);
      options = extend({},defaults,ops);
      init();
      // 设置动画
      animate();
      // 为元素创建样式
      css();
      // 监听滚动条滚动
      scroll();
      // 监听点击事件
      click();
      // 方便生成执行链，由于这里只有一个函数，则无需此步骤
      // return this;  
    }
  };


  // 内部函数
  // 对象复制，由于默认参数中涉及二级参数，则需要深复制
  function extend() {  
    var _extend = function me(dest, source) {
      for (var name in dest) {
        if (dest.hasOwnProperty(name)) {
          //当前属性是否为对象,如果为对象，则进行递归
          if ((dest[name] instanceof Object) && (source[name] instanceof Object)) {
            me(dest[name], source[name]);
          }
          //检测该属性是否存在
          if (source.hasOwnProperty(name)) {
            continue;
          } else {
            source[name] = dest[name];
          }
        }
      }
    };
    var _result = {},
            arr = arguments;
    //遍历属性，至后向前
    if (!arr.length){
      return {};
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      _extend(arr[i], _result);
    }
    arr[0] = _result;
    return _result;
  }
  // 数据初始化
  function init(){
    elem = document.getElementById(options.id) || elem;
    if (!elem) {
      console.warn('返回顶部元素id有误,请检查配置!');
      return;
    }
    if (options.scroll != 'window') {
      scrollElem = document.getElementById(options.scroll) || scrollElem;
    }
    initClassName = elem.className;
  }
  /**
   * 让滚动条缓慢移动到顶部
   * callback 回调函数，回到顶部完成后再执行
   * acceleration 滚动速度，默认0.1
   * stime 滚动间隔时间，值越小越平滑，默认10 ms
   */
  function scrollToTop(callback,acceleration,stime){
    acceleration = acceleration > 0 ? acceleration : 0.1; // 速度不允许为负数
    stime = stime || 10;
    // 滚动条到页面顶部的水平距离
    var x = getScrollLeft(scrollElem);
    // 滚动条到页面顶部的垂直距离
    var y = getScrollTop(scrollElem);
    // 滚动距离 = 目前距离 / 速度, 因为距离原来越小, 速度是大于 1 的数, 所以滚动距离会越来越小
    var speeding = 1 + acceleration;
    // window对象使用scrollTo方法，HTML元素使用srollLeft与scrollTop方法
    if(scrollElem === window){
      scrollElem.scrollTo(Math.floor(x / speeding) , Math.floor(y / speeding));
    }else{
      scrollElem.scrollLeft = Math.floor(x / speeding);
      scrollElem.scrollTop = Math.floor(y / speeding);
    }
    // 如果距离不为零, 继续调用函数
    if(x > 0 || y > 0) {
      setTimeout(function(){
        scrollToTop(callback,acceleration,stime);
      },stime);
    }else{
      if(typeof callback == 'function'){
        callback();
      }
    }
  }

  // 添加动画
  function animate(){
	if(options.bg.show && options.animate.show && !options.animate.own){
		var animateNode = document.createElement('link');
		animateNode.rel = 'stylesheet';
		animateNode.type = 'text/css';
		animateNode.href = options.animate.cdn;
		document.getElementsByTagName('head')[0].appendChild(animateNode);
	}
	if(options.bg.show){
		// 有背景时，清除元素内部内容
		elem.innerHTML = '';
	}
  }
  // 为元素添加样式标签
  function css(){
  	var style = document.createElement("style");
  	style.type = "text/css";
  	style.id = "return-to-top-css";
  	var html = [
      '#',options.id,'{',
        'position: fixed;',
        'right: 100px;',
        'bottom: 80px;',
        '-webkit-transition: all 0.2s ease-in-out;',
      '}',
      '#',options.id,':hover,#',options.id,'.active{',
        'cursor: pointer;',
      '}',
      '#',options.id,'.active{',
        'display: block;',
      '}',
      '@media screen and (max-width: 800px) {',
        '#',options.id,'{',
        	'right: 50px;',
        	'bottom: 40px;',
        '}',
      '}'
    ].join('');
	if(options.bg.show){
		html += [
      '#',options.id,'{',
        'width: 26px;',
        'height: 62px;',
        'background: url(',options.bg.dir,'/rocket.png) no-repeat 0 0;',
      '}',
      '#',options.id,':hover,#',options.id,'.active{',
        'background: url(',options.bg.dir,'/rocket.png) no-repeat 0 -62px;',
      '}'
    ].join('');
	}
  	style.innerHTML = html;
  	document.getElementsByTagName('head')[0].appendChild(style);
  	// 先默认设置元素不显示
  	setStyle(elem,{
    	display: 'none'
    });
  }

  // 监听滚动条滚动事件，其中使用到了懒加载
  function scroll(){
    scrollElem.addEventListener('scroll',function(){   
        if (timeout)
          clearTimeout(timeout);
        timeout = setTimeout(function(){
          var top = getScrollTop(scrollElem);
          // 距顶部超过300时，显示元素
          if(top > 300){
            show();
          }else{
            hide();
          }
        },1000);   
    });
  }
  // 监听元素点击事件
  function click(){
    // 绑定点击事件
    elem.addEventListener('click', function (e) {
      e.stopPropagation();
      // 开始点击，激活元素
      if(options.bg.show){
      	elem.className = initClassName + ' active animated bounceOutUp';
      }else{
      	elem.className = initClassName + ' active';
      }
      setTimeout(function(){
          reset();
          setStyle(elem,{
            display: 'none'
          });
      },500);
      // 回到顶部，然后执行回调函数，重置元素状态
      scrollToTop(reset);
    });
  }
  // 滚动到0,初始化元素
  function reset(){
    elem.className = initClassName;
  }

  // 显示
  function show(){
    if (isHidden()) {
      setStyle(elem,{
      	display: 'block'
      });
      // 添加移入动画
      if(options.bg.show){
      	elem.className = initClassName + ' animated bounceInUp';
      }
      // 一段时间后恢复原状
      setTimeout(function(){
      	reset();
      },500);
    }
  }

  // 隐藏
  function hide(){
    if (!isHidden()) {
      // 添加移出动画
      if(options.bg.show){
      	elem.className = initClassName + ' animated fadeOutDown';
      }
      setTimeout(function(){
          reset();
          setStyle(elem,{
            display: 'none'
          });
      },500);
    }
  }

  // 判断元素是显示状态还是隐藏状态
  function isHidden(){
    if(elem.style.display != 'none'){
      return false;
    }
    return true;
  }

  // 修改元素样式
  function setStyle (elem, styles) {
    var s = elem.style;
    for (var key in styles) {
      s[key] = styles[key];
    }
  }

  // 获取元素滚动条垂直距离
  function getScrollTop(elem){
    if(!isDom(elem)){
      // 元素不存在默认使用浏览器滚动条
      return getBodyScrollTop();
    }
    return elem.scrollTop;
  }
  // 获取元素滚动条水平距离
  function getScrollLeft(elem){
    if(!isDom(elem)){
      // 元素不存在默认使用浏览器滚动条
      return getBodyScrollLeft();
    }
    return elem.scrollLeft;
  }

  // 获取浏览器滚动条垂直距离
  // 谁的值大说明使用谁，在html中使用document.body，在xhtml中使用document.documentElement
  function getBodyScrollTop(){
    var y1 = document.body.scrollTop;
    var y2 = document.documentElement.scrollTop;
    var y3 = window.scrollY;
    return Math.max(y3,Math.max(y1,y2));
  }
  // 获取浏览器滚动条水平距离
  function getBodyScrollLeft(){
    var x1 = document.body.scrollLeft;
    var x2 = document.documentElement.scrollLeft;
    var x3 = window.scrollX;
    return Math.max(x3,Math.max(x1,x2));
  }
  // 判断是否dom对象
  function isDom(obj){
    // 常规浏览器，typeof HTMLElement === 'object'
    if (typeof HTMLElement === 'object') {
      return obj instanceof HTMLElement;
    }
    // Chrome、Opera浏览器，typeof HTMLElement == 'function' 
    else{
      return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    }
  }
  // 绑定至window对象
  window.returnToTop = api;
})();