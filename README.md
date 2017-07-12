# ReturnToTop

一款简易的网页返回顶部原生JS插件。  
A simple web page return to the top of JavaScript plug-in.

## 安装（Installation）

如果没有NodeJS环境，直接clone：
``` bash
git clone https://github.com/0031/return-to-top.git
```

为了方便统一管理，建议使用下面的方式：  
插件通过bower打包，因此请先确保[NodeJS]环境。

安装bower
``` bash
$ npm intall -g bower
```

安装return-to-top.js
``` bash
$ bower install return-to-top --save
```
或者
``` bash
$ bower install https://github.com/0031/return-to-top.git --save
```

更多配置技巧请查看我的博客：[一款简易的网页返回顶部JS原生插件]。

## 快速入门（Quick Start）

在需要使用返回顶部插件的html文件中加入如下代码：
``` html
<a id="return-to-top" href="javascript:;" title="点我起飞"></a>
<script src="/yourpath/return-to-top/dist/return-to-top.min.js"></script>
<script type="text/javascript">
	window.returnToTop.init();
</script>
```

动态网站，修改背景图片目录：
``` html
<a id="return-to-top" href="javascript:;" title="点我起飞"></a>
<script src="/yourpath/return-to-top/dist/return-to-top.min.js"></script>
<script type="text/javascript">
	window.returnToTop.init({
		'bg': {
  			'show': true,
  			'dir': '/yourpath/assets/images'
  		}
	});
</script>
```

本地已有animate.css：
``` html
<link  href="/yourpath/css/animate.css" rel="stylesheet" type="text/css">
<a id="return-to-top" href="javascript:;" title="点我起飞"></a>
<script src="/yourpath/return-to-top/dist/return-to-top.min.js"></script>
<script type="text/javascript">
	window.returnToTop.init({
  		'animate': {
	  		'own': true
	  	}
	});
</script>
```

需要修改小火箭相对位置：
``` html
<link  href="/yourpath/css/animate.css" rel="stylesheet" type="text/css">
<a id="return-to-top" href="javascript:;" title="点我起飞"></a>
<script src="/yourpath/return-to-top/dist/return-to-top.min.js"></script>
<script type="text/javascript">
	window.returnToTop.init({
  		'pos': {
			'top': 0,
			'right': 50,
			'bottom': 50,
			'left': 0
		}
	});
</script>
```

需要将/yourpath替换为您的本地路径，即可初始化一个使浏览器返回顶部的小火箭。

更多配置项：  
在/example的静态html文件中给出了不同需求下的相关示例，您可以根据需要修改配置。

## 效果图(Render)

![](https://raw.githubusercontent.com/0031/return-to-top/master/example/images/example.gif)

## 许可(License)

MIT



  [NodeJS]: https://nodejs.org/zh-cn/
  [一款简易的网页返回顶部JS原生插件]: http://0031.github.io/2017/01/03/return-to-top-js-plugin/