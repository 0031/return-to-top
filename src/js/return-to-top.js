// 使用闭包封装插件
;(function () {
  // 严格模式
  'use strict';
  var defaults = {
    'namespace': 'returnToTop',   // 命名空间，如果需要绑定多个不同的滚动条，则可以使用该参数
  	'bg': {
  		'show': true,			// 默认开启按钮背景
  		'dir': 'images'		// show=true时生效，背景图片文件夹路径，相对于使用该插件的html
  	},
  	'animate': {
  		'show': true,			// 默认开启图标动画，按钮背景show=true时生效，即有动画一定有背景，无背景一定无动画
  		'own': false,			// 如果网页之前已经引入了animate.css，则为true，不会再加载cdn，默认为false
  		'cdn': 'http://cdn.bootcss.com/animate.css/3.5.2/animate.min.css' // show=true时生效，animate.css静态cdn
  	},
    'pos': {          // 自定义返回顶部元素所处位置，相对于浏览器，移动端长度默认缩小为1/2，当然你可以通过外部css控制
      'unit': 'px',   // 默认以像素为单位，可选值：em/%/px 还有其他单位，这里推荐使用这三种
      'top': 0,       // 上，为0时将不加入至css中，必须是数字，否则显示不正常
      'right': 100,   // 右
      'bottom': 80,   // 下
      'left': 0       // 左
    },
    'id': 'return-to-top',  	// 返回顶部元素id
    'scroll': 'window'        // 滚动条基准，默认以浏览器滚动条，当然你可以设置为div的id
  };

  // 核心函数，将会暴露给调用者
  var api = {
    // 初始化
    init: function(ops){
      // 有参数传入,将对象扩展，类似jQuery中$.extend({},defaults, options);
      var options = extend({},defaults,ops);
      // 初始化
      init(options);
      // 设置动画
      animate(options.namespace);
      // 为元素创建样式
      css(options.namespace);
      // 监听滚动条滚动
      scroll(options.namespace);
      // 监听点击事件
      click(options.namespace);
      // 方便生成执行链，由于这里只有一个函数，则无需此步骤
      // return this;  
    }
  };

  // 内部函数
  // 数据初始化
  function init(options){
    // 接收元素
    var elem = document.getElementById(options.id);
    // 接收滚动条基准，默认则是浏览器滚动条
    var scrollElem = window;
    // 元素最初的class内容
    var initClassName = '';
    // 滚动条计时器
    var timeout = false;

    elem = document.getElementById(options.id) || elem;
    if (!elem) {
      console.warn('元素id有误,请检查配置!');
      return;
    }
    if(!isInArr(['px','em','%'],options.pos.unit)){
      options.pos.unit = 'px';
    }
    if (options.scroll != 'window') {
      scrollElem = document.getElementById(options.scroll) || scrollElem;
    }
    initClassName = elem.className;

    var initOps = {
      'elem': elem,
      'scrollElem': scrollElem,
      'initClassName': initClassName,
      'timeout': timeout,
      'options': options,
    };
    // 添加数据至命名空间
    addNamespace(options.namespace,initOps);
  }
  /**
   * 让滚动条缓慢移动到顶部
   * callback 回调函数，回到顶部完成后再执行
   * acceleration 滚动速度，默认0.1
   * stime 滚动间隔时间，值越小越平滑，默认10 ms
   */
  function scrollToTop(ns,callback,acceleration,stime){
    if(hasNamespace(ns)){
      var namespace = getNamespace(ns);
      var scrollElem = namespace.scrollElem;
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
          scrollToTop(ns,callback,acceleration,stime);
        },stime);
      }else{
        if(typeof callback == 'function'){
          callback();
        }
      }
    }
  }

  // 添加动画
  function animate(ns){
    if(hasNamespace(ns)){
      var namespace = getNamespace(ns);
      var options = namespace.options;
      var elem = namespace.elem;

      if(options.bg.show && options.animate.show && !options.animate.own){
        // 首先判断是否已经加载过该样式
        if(document.getElementById('rtt-animate-css')){
          return;
        }
    		var animateNode = document.createElement('link');
        animateNode.id = 'rtt-animate-css';
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
  }
  // 为元素添加样式标签
  function css(ns){
    if(hasNamespace(ns)){
      var namespace = getNamespace(ns);
      var options = namespace.options;
      var elem = namespace.elem;
      var unit = options.pos.unit;
      var top = options.pos.top;
      var right = options.pos.right;
      var bottom = options.pos.bottom;
      var left = options.pos.left;

    	var style = document.createElement("style");
    	style.type = "text/css";
    	style.id = ns + "-rtt-css";
    	var html = [
        '#',options.id,'{',
          'position: fixed;',
          'top: ',top === 0 ? '' : top,unit,';',
          'right: ' ,right === 0 ? '' : right,unit,';',
          'bottom: ',bottom === 0 ? '' : bottom,unit,';',
          'left: ',left === 0 ? '' : left,unit,';',
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
          	'top: ',top === 0 ? '' : top/2,unit,';',
            'right: ' ,right === 0 ? '' : right/2,unit,';',
            'bottom: ',bottom === 0 ? '' : bottom/2,unit,';',
            'left: ',left === 0 ? '' : left/2,unit,';',
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
  }

  // 监听滚动条滚动事件，其中使用到了懒加载
  function scroll(ns){
    if(hasNamespace(ns)){
      var namespace = getNamespace(ns);
      var options = namespace.options;
      var scrollElem = namespace.scrollElem;
      var timeout = namespace.timeout;

      scrollElem.addEventListener('scroll',function(){
          if (timeout)
            clearTimeout(timeout);
          timeout = setTimeout(function(){
            var top = getScrollTop(scrollElem);
            // 距顶部超过300时，显示元素
            if(top > 300){
              show(ns);
            }else{
              hide(ns);
            }
          },1000);   
      });
    }
  }
  // 监听元素点击事件
  function click(ns){
    if(hasNamespace(ns)){
      var namespace = getNamespace(ns);
      var options = namespace.options;
      var elem = namespace.elem;
      var initClassName = namespace.initClassName;

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
            reset(ns);
            setStyle(elem,{
              display: 'none'
            });
        },500);
        // 回到顶部，然后执行回调函数，重置元素状态
        scrollToTop(ns,function(){
          elem.className = namespace.initClassName;
        });
        // 失去焦点，这一点在移动端很重要
        elem.blur();
      });
    }
  }
  // 滚动到0,初始化元素
  function reset(ns){
    var namespace = getNamespace(ns);
    namespace.elem.className = namespace.initClassName;
  }

  // 显示
  function show(ns){
    if(hasNamespace(ns)){
      var namespace = getNamespace(ns);
      var options = namespace.options;
      var elem = namespace.elem;
      var initClassName = namespace.initClassName;

      if (isHidden(ns)) {
        setStyle(elem,{
        	display: 'block'
        });
        // 添加移入动画
        if(options.bg.show){
        	elem.className = initClassName + ' animated bounceInUp';
        }
        // 一段时间后恢复原状
        setTimeout(function(){
        	reset(ns);
        },500);
      }
    }
  }

  // 隐藏
  function hide(ns){
    if (!isHidden(ns)) {
      if(hasNamespace(ns)){
        var namespace = getNamespace(ns);
        var options = namespace.options;
        var elem = namespace.elem;
        var initClassName = namespace.initClassName;
        // 添加移出动画
        if(options.bg.show){
        	elem.className = initClassName + ' animated fadeOutDown';
        }
        setTimeout(function(){
            reset(ns);
            setStyle(elem,{
              display: 'none'
            });
        },500);
      }
    }
  }

  // 判断元素是显示状态还是隐藏状态
  function isHidden(ns){
    if(hasNamespace(ns)){
      var namespace = getNamespace(ns);
      if(namespace.elem.style.display != 'none'){
        return false;
      }
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
  // 判断命名空间是否重复
  function hasNamespace(ns){
    return window.returnToTop.namespace[ns] ? true : false;
  }
  // 添加至命名空间
  function addNamespace(ns,options){
    if(!hasNamespace(ns)){
      window.returnToTop.namespace[ns] = options;
    }
  }
  // 获取命名空间
  function getNamespace(ns){
    return window.returnToTop.namespace[ns];
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
  // 判断是否在数组中
  function isInArr(arr,item){
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
      if(arr[i] == item){
        return true;
      }
    }
    return false;
  }

  // 对象复制，由于默认参数中涉及二级参数，则需要深复制
  function extend() {  
    var _result = {},
            arr = arguments,
            len = arr.length;
    //遍历属性，至后向前
    if (!len){
      return {};
    }
    for (var i = len - 1; i >= 0; i--) {
      _extend(arr[i], _result);
    }
    arr[0] = _result;
    return _result;
  }
  function _extend(dest, source) {
    for (var name in dest) {
      if (dest.hasOwnProperty(name)) {
        //当前属性是否为对象,如果为对象，则进行递归
        if ((dest[name] instanceof Object) && (source[name] instanceof Object)) {
          _extend(dest[name], source[name]);
        }
        //检测该属性是否存在
        if (source.hasOwnProperty(name)) {
          continue;
        } else {
          source[name] = dest[name];
        }
      }
    }
  }
  // 绑定至window对象
  window.returnToTop = api;
  // 命名空间初始为空
  window.returnToTop.namespace = {};

})();