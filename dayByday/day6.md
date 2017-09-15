## 部署


## [线上地址](http:/xiyuyizhi.xyz:8080)

- ### 装环境

**前提：买个ESC、弹性公网ip、域名**

1. 设置服务器免密登录

*本地应该都有.ssh目录，并且生成了公私钥,将本地id_rsa,id_rsa.pub scp到服务器 /.ssh目录*

*之所以把私钥也上传上去是 要git clone git@github.com的方式克隆仓库*

之后,登录服务器

```
    cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys
```

现在就可以免密登录服务器

2. 服务器所需软件安装 ubuntu


git: apt-get install git

mongodb: apt-get install mongodb [改端口,加认证](day3.md)

redis: apt-get install redis-server


*nvm*

```
    git clone https://github.com/creationix/nvm.git
    .bashrc文件头部添加:
    source ~/nvm/nvm.sh
    nvm install v8.2.1(安装node指定版本)
```

*pm2*

```
    npm install -g pm2

```


- ### pm2部署node

**pm2提供了小巧但强大的部署功能，
它拉取git仓库指定分支的代码 到我们指定的服务器的指定目录，然后执行指定脚本**

本地项目中 在之前介绍的[ecosystem.config.js](day1.md)文件中添加

```
    deploy: {
        "production": {
        user: "root",
        host: ['118.190.208.49'],
        ref: "origin/master",
        repo: "git@github.com:xiyuyizhi/movies.git",
        path: "/root/www/movies_be",
        "post-setup": "ls -la",
        "post-deploy": "cd be && npm install && pm2 kill && pm2 start ecosystem.config.js --env production",
        "env": {
            "NODE_ENV": "production"
        }
        }
  }
```

package.json中添加

```
"scripts": {
    "start": "pm2 start ecosystem.config.js",
    "test": "mocha --watch",
    "setup":"pm2 deploy ecosystem.config.js production setup",
    "deploy":"pm2 deploy ecosystem.config.js production"
  }
```

之后本地

```
npm run setup 初始化远端目录，只需要执行一次
```

之后每次部署只需要执行 npm run deploy就可以了。

- ### 前端

前端webpack构建后的build目录下的文件可以写个脚本scp到服务器，但这里借用一下pm2的部署功能来部署前端代码。

本地前端目录下新建ecosystem.config.js文件

```
module.exports = {

  deploy: {
    "production": {
      user: "root",
      host: ['118.190.208.49'],
      ref: "origin/master",
      repo: "git@github.com:xiyuyizhi/movies.git",
      path: "/root/www/movies_fe",
      "post-setup": "ls -la",
      "post-deploy": "cd /root/www/front && rm -rf * && cd /root/www/movies_fe/current/fe/build && cp -r . /root/www/front",
    }
  }
};
主要是post-deploy中的脚本：将服务器部署目录下的前端build代码复制到nginx要访问的指定目录下

```

实际项目中应使用jenkins等工具。

- ### nginx相关配置

nginx sites-enabled目录下，新建xiyuyizhi.xyz.conf

```
    server{
        listen 8080;
        server_name xiyuyizhi.xyz; //多个域名公用同一个端口，通过这个server_name转向不同路径
        root /root/www/front;
        location / { 
             try_files $uri $uri/ /index.html;
             //找不到页面时转向index页面，解决前端单页面history方式路由问题
        }
        location /api{
            proxy_pass http://localhost:8000;
            //代理的后端服务地址
        }
    }
```

通过域名直接使用80端口要先备案，所以这里使用了8080端口

nginx nginx.conf 中开一下gZip压缩。