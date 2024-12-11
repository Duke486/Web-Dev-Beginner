# Lab：上线服务

## 上线服务

我们开发了自己的Vue前端或Express后端项目，接下来将讲解一种简单的部署上线方法——购买云服务器。

::: warning

**重要提示**：阅读全文后，再进行实际操作。购买并使用云服务需遵守相关法律法规，确保你的操作和内容合法。使用云服务过程中产生的一切责任与本教程编写者无关。

:::

### 好贵，能不能不买

如果仅用于测试目的，可以选择以下几种免费方案在公网提供服务：

1. **使用Sakura FRP等穿透软件**  
    在自己的电脑上安装Sakura FRP或其他穿透软件，选择暴露电脑的某个端口（例如3000），即可获得一个可访问服务的公网地址。
2. **使用Cloudflared创建Tunnel**  
    在电脑上安装Cloudflared，创建一个Tunnel即可从外部访问。具体步骤是：

    * 前往[Cloudflare官网](https://www.cloudflare.com/)注册账户。
    * 下载并安装Cloudflared客户端。
    * 使用命令行创建并配置Tunnel，连接到你的本地服务。
    * 参考[Cloudflare文档](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps)来获得教程。
3. **使用Tailscale或ZeroTier等异地组网工具**  
    这些工具允许你在不同设备间建立虚拟专用网络，仅限自己使用。例如，你可以通过手机流量访问电脑上的网站。

## 购买云服务

接下来，我们将通过购买云服务器的方式来上线我们的应用。这是一种简单且通用的方法，但未必是最合适的选择。根据需求和成本，你可能需要选择不同的部署方式（如虚拟面板、VPS、CF函数计算、K8s集群等）。对于我们的练习来说，购买一台服务器已经完全足够。

### 注册账户

你可以在大型云服务提供商（如阿里云、腾讯云、华为云）或小型服务商（如雨云、星辰云等）的官网注册一个账户并完成实名认证。大型服务商提供全面的服务和稳定性，且有丰富的教程资源，但价格相对较高；小型服务商价格更为实惠，但服务的稳定性和持续性无法完全保障。这里以阿里云为例，详细介绍注册和购买流程。

**步骤如下**：

1. 访问[阿里云官网](https://www.aliyun.com/)。
2. 点击页面右上角的“免费注册”按钮。
3. 填写你的手机号码或邮箱地址，设置密码并完成注册。
4. 根据阿里云的要求，完成实名认证流程，上传身份证照片。

### 选择产品

阿里云为在校学生提供了一张300元的无门槛优惠券，你可以通过网络搜索活动入口进行领取。这笔费用足够你购买一年的非大陆地区轻量应用服务器，或半年的国内普通服务器。接下来，我们需要选择服务器的地区。

**优缺点**：

* **内地服务器**：国内连通性较好，延迟低，但在拉取Docker镜像、npm包、安装各种环境或使用GitHub开源软件时会遇到困难。
* **海外服务器**：避免了内地服务器的这些问题，但在国内的连接稳定性可能较差，影响用户体验。

对于内地服务器的不便之处，我们一般有下面几种方法来解决：

1. **在本地下载资源后传输到服务器**  
    你可以在自己的电脑上下载所需的资源，然后通过SFTP等方式传输到服务器。但这种方法较为繁琐，且在某些场景下无法使用。
2. **切换软件源**  
    更换为国内的镜像源，可以加快包的下载速度。需要在多个软件中更换源，且部分软件包或版本可能不在国内源中。
3. **使用代理服务器**  
    在拉取需要的文件URL前加上代理服务器地址，通过代理进行中转。这需要你拥有一台海外服务器，以覆盖部分场景。
4. 使用**霍格沃茨魔法学校授课内容**  
    奇妙的魔力在这个页面上为我们带来了三串奇奇怪怪的字符，我不知道该如何使用它们。以下是这三串字符：

    * [Linux 命令下安装与使用 Clash 带 UI 管理界面 | AISYUN&apos;s Blog](https://blog.cyida.com/2023/24ANW6D.html)
    * [在Linux上搭建mihomo服务 | 黑软小栈](https://www.ixmu.net/130.html)
    * [web面板 - 虚空终端 Docs](https://wiki.metacubex.one/startup/web/)

非内地服务器不会遇到上述问题，但在国内的连接稳定性可能较差，影响用户体验。你可以通过CDN加速或使用Cloudflare等服务优化连接，这里暂不详细展开。

### 购买

进入阿里云的服务器购买页面后，按照以下步骤选择合适的配置：

1. **选择产品类型**  
    推荐选择“轻量应用服务器”，适合初学者和小型项目。
2. **选择实例规格**

    * **CPU**：2核
    * **内存**：2GB
    * **带宽**：10Mbps  
      这样的配置基本可以满足开发需求，可以满足数个人同时浏览我们的网页。可以适当增减配置。
3. **选择地区和可用区**  
    经济不发达地区可能便宜一些，但是延迟可能会稍高。
4. **选择操作系统**  
    推荐选择Ubuntu 22.04或24.04的64位版本。
5. **确认订单并支付**

::: tip

**注意**：像阿里云这样的云服务商还会区分性能突发型实例、抢占型实例等多种产品。请务必阅读选购页面的详细说明！某些实例在满足特定条件后（例如长时间空闲）可能会被销毁。

:::

## 配置

购买并获取服务器后，按照以下步骤进行配置，你可能会遇到网络困难，请回头阅读“选择产品”章节。

### 连接服务器

1. **获取公网IP地址**
    登录阿里云控制台，在服务器实例详情中找到你的公网IP地址。
2. **使用SSH客户端连接**
    你可以使用Xshell、Termius或OpenSSH等工具连接服务器。

    * **使用Xshell**：

      * 打开Xshell，点击“新建”。
      * 输入主机IP地址、端口号（默认22），并选择SSH协议。
      * 点击“连接”，输入你在购买服务器时设置的密码或使用密钥登录。
    * **使用Termius**：

      * 下载并安装Termius客户端。
      * 添加新主机，填写服务器IP、用户名（通常为`root`​）和密码或密钥。
      * 连接服务器。
    * **使用OpenSSH**（适用于Linux和macOS终端）：

      ```bash
      ssh root@您的公网IP
      ```

      输入密码或使用密钥文件登录。

### 安装Nginx

1. **更新软件包列表**

    ```bash
    sudo apt update
    ```
2. **安装Nginx**

    ```bash
    sudo apt install nginx -y
    ```
3. **启动并设置Nginx开机自启**

    ```bash
    sudo systemctl start nginx
    sudo systemctl enable nginx
    ```

### 配置Nginx

1. **备份默认配置文件**

    ```bash
    sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak
    ```
2. **编辑Nginx配置文件**  
    使用文本编辑器（如nano）打开配置文件：

    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```
3. **修改配置文件**  
    将默认配置修改为以下内容（假设前端静态文件位于`/var/www/myapp/html`​，Express后端运行在端口3000）：

    ```nginx
    server {
        listen 80;
        server_name your_domain_or_IP;

        # 前端静态文件
        location / {
            root /var/www/myapp/html;
            try_files $uri $uri/ /index.html;
        }

        # 后端API代理
        location /api/ {
            proxy_pass http://localhost:3000/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

    将`your_domain_or_IP`​替换为你的域名或服务器IP地址。
4. **保存并退出编辑器**  
    在nano中，按`Ctrl + O`​保存，按`Ctrl + X`​退出。
5. **测试Nginx配置**

    ```bash
    sudo nginx -t
    ```

    如果配置正确，你将看到`syntax is ok`​和`test is successful`​的提示。
6. **重启Nginx服务**

    ```bash
    sudo systemctl restart nginx
    ```

### 安装其他环境

根据项目需求，安装Node.js和MongoDB。

1. **安装Node.js**  
    选择适合的Node.js版本（如LTS版本）。以下以安装Node.js 18为例：

    ```bash
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

    验证安装：

    ```bash
    node -v
    npm -v
    ```
2. **安装MongoDB**

    ```bash
    sudo apt update
    sudo apt install -y mongodb
    ```

    启动并设置MongoDB开机自启：

    ```bash
    sudo systemctl start mongodb
    sudo systemctl enable mongodb
    ```

    验证MongoDB状态：

    ```bash
    sudo systemctl status mongodb
    ```

### 配置安全策略

在阿里云的服务器后台管理页面，设置安全策略，允许80，443，22等我们需要用到的端口进行通信（有的服务商默认允许，但还是建议检查一下）。

## 构建前端项目

按照以下步骤构建并部署你的Vue前端项目：

1. **在本地构建项目**
    确保你已经在本地环境中完成前端项目的开发，并且能够成功运行。然后执行构建命令：

    ```bash
    pnpm run build
    ```

    构建完成后，项目会生成一个`dist`​文件夹，其中包含构建后的静态文件。
2. **本地预览构建结果**  
    使用VSCode打开`dist`​文件夹（注意，仅打开`dist`​文件夹，不要打开整个前端项目），右键点击`index.html`​，选择“Open with Live Server”进行预览。如果浏览器显示空白，可能需要进行以下调整：

    * **修改**​**​`vite.config.js`​**​  
      在`vite.config.js`​中添加`base`​配置：

      ```javascript
      export default defineConfig({
          base: './',
          // 其他配置项
      });
      ```
    * **修改路由配置**  
      在路由配置文件中使用Hash模式：

      ```javascript
      import { createRouter, createWebHashHistory } from 'vue-router';

      const router = createRouter({
        history: createWebHashHistory(),
        routes: [
          // 你的路由配置
        ],
      });

      export default router;
      ```

    如果问题依旧，可以按F12打开浏览器开发者工具，查看控制台报错信息，并根据错误提示在网上寻找解决方案。
3. **上传构建后的静态文件到服务器**  
    使用SFTP工具（如FileZilla、WinSCP）或SSH软件自带的文件传输功能（如Termius、Tabby）将`dist`​文件夹中的所有文件上传到服务器的`/var/www/myapp/html`​目录。具体步骤如下：

    * **使用SFTP工具**：

      * 打开你的SFTP客户端，连接到服务器。
      * 导航到`/var/www`​目录，如果`myapp`​文件夹不存在，创建一个：

        ```bash
        sudo mkdir -p /var/www/myapp/html
        ```
      * 设置适当的权限：

        ```bash
        sudo chown -R $USER:$USER /var/www/myapp/html
        ```
      * 上传`dist`​文件夹中的所有文件到`/var/www/myapp/html`​。
4. **设置正确的权限**  
    确保Nginx可以访问这些文件：

    ```bash
    sudo chmod -R 755 /var/www/myapp/html
    ```
5. **重启Nginx服务**

    ```bash
    sudo systemctl restart nginx
    ```
6. **访问前端应用**  
    在浏览器中访问`http://您的公网IP`​，应该能够看到你的前端应用。如果一切配置正确，页面将正常显示。

## 运行后端项目

接下来，部署并运行Express后端项目：

1. **上传后端项目文件到服务器**  
    使用SFTP工具将后端项目文件夹上传到服务器的`/home/您的用户名`​目录下。例如：

    * 登录服务器，进入主目录：

      ```bash
      cd /home/your_username
      ```
    * 创建项目目录：

      ```bash
      mkdir mybackend
      ```
    * 使用SFTP工具将后端项目文件上传到`/home/your_username/mybackend`​。
2. **安装项目依赖**  
    进入项目目录并安装依赖：

    ```bash
    cd mybackend
    pnpm install
    ```
3. **启动后端服务**  
    运行后端项目：

    ```bash
    node server.js
    ```

    此时，Express后端应在端口3000上运行。
4. **设置始终运行后端服务**  
    为了确保后端服务在服务器重启或进程终止后自动运行，可以使用`pm2`​进行管理。

    * **安装pm2**

      ```bash
      sudo npm install -g pm2
      ```
    * **使用pm2启动后端项目**

      ```bash
      pm2 start server.js --name mybackend
      ```
    * **设置pm2开机自启**

      ```bash
      pm2 startup
      pm2 save
      ```

    这样，后端服务将始终运行，并在服务器重启后自动启动。
5. **验证后端服务**  
    在浏览器中访问`http://您的公网IP/api/`​，应能看到后端服务的响应。

## 使用安全链接HTTPS

为了确保数据传输的安全性，建议为你的网站配置HTTPS。以下是通过购买域名和使用Cloudflare实现HTTPS的步骤。

### 购买域名

1. **选择域名注册商**
    你可以在阿里云、腾讯云等平台购买域名。以阿里云为例：

    * 登录[阿里云官网](https://www.aliyun.com/)。
    * 在搜索栏输入你想要的域名，检查其可用性。
    * 选择可用的域名并完成购买。

### 注册Cloudflare账户并添加域名

1. **注册Cloudflare账户**  
    访问[Cloudflare官网](https://www.cloudflare.com/)并注册一个免费账户。
2. **添加域名到Cloudflare**

    * 登录Cloudflare后，点击“添加站点”。
    * 输入你购买的域名，点击“添加站点”。
    * 选择合适的计划（免费版即可满足基本需求），点击“确认计划”。
3. **配置DNS记录**

    * Cloudflare会自动扫描现有的DNS记录。确认无误后，点击“继续”。
    * 添加A记录，将`www.yourdomain.com`​解析到你的服务器公网IP。
    * 如有需要，可以添加其他子域名的DNS记录。
4. **更改DNS服务器**

    * Cloudflare会提供新的DNS服务器地址。
    * 登录阿里云域名管理控制台，找到你的域名管理页面。
    * 修改域名的DNS服务器地址为Cloudflare提供的地址。
    * 保存更改后，等待DNS解析生效，通常需要几分钟到24小时。

### 申请和配置SSL证书

1. **在Cloudflare中启用SSL**

    * 在Cloudflare控制台，选择你的域名。
    * 点击“SSL/TLS”标签。
    * 选择“完全（严格）”模式，确保数据在Cloudflare和服务器之间也是加密的。
2. **安装Certbot并申请Let's Encrypt证书**

    * **安装Certbot**

      ```bash
      sudo apt update
      sudo apt install -y certbot python3-certbot-nginx
      ```
    * **申请证书**

      ```bash
      sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
      ```

      按照提示完成域名验证和证书申请。
3. **自动续签证书**
    Certbot会自动为你配置续签任务，但你可以手动测试：

    ```bash
    sudo certbot renew --dry-run
    ```

### 修改Nginx配置以支持HTTPS

Certbot在申请证书时通常会自动修改Nginx配置以支持HTTPS。如果需要手动配置，请按照以下步骤：

1. **编辑Nginx配置文件**

    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```
2. **修改配置文件**  
    将`server`​块修改为以下内容：

    ```nginx
    server {
    	#http跳https
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

        # 前端静态文件
        location / {
            root /var/www/myapp/html;
            try_files $uri $uri/ /index.html;
        }

        # 后端API代理
        location /api/ {
            proxy_pass http://localhost:3000/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
3. **测试并重启Nginx**

    ```bash
    sudo nginx -t
    sudo systemctl restart nginx
    ```
4. **访问你的网站**  
    在浏览器中访问`https://yourdomain.com`​，应能通过HTTPS安全访问你的网站。

## 完成

至此，你已经成功部署了自己的Vue前端和Express后端应用，并通过购买域名和配置HTTPS保障了连接的安全性。你拥有了一个属于自己的、安全的在线网站，并可以在此基础上进行更多的扩展和优化。

::: warning

**法律声明**：根据中国法律，所有在中国大陆提供内容的服务器和网站均需进行备案（ICP备案）。未备案的网站可能会被服务器提供商关闭或受到法律处罚。使用海外服务器可以避免备案问题，但依然需要确保你的网站内容符合相关法律法规。

**备案相关注意事项**：

* 备案需要提供**真实**的身份信息和网站信息。
* 购买国内大厂服务器才能备案。
* 未备案域名禁止绑定内地内网穿透等服务，但可以绑定海外的。
* 备案过程可能需要几周时间，请提前规划。
* 备案完成后，务必在阿里云控制台或其他服务商平台完成相关配置。

:::

‍
