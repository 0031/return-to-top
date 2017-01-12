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
<script src="/yourpath/return-to-top/dist/return-to-top.min.js"></script>
<script type="text/javascript">
	window.returnToTop.init();
</script>
```
需要将/yourpath替换为您的本地路径。

更多配置项：  
在/example/example.html文件中给出了不同需求下的相关示例。

## License

MIT
  [NodeJS]: https://nodejs.org/zh-cn/
  [一款简易的网页返回顶部JS原生插件]: http://0031.github.io/2017/01/03/return-to-top-js-plugin/