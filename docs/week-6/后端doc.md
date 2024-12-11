# Doc: 数据库操作

## 1. 概要

本节课程将带你了解如何在 Express 框架中操作 MongoDB 数据库。在这一过程中，你将学习如何在 Ubuntu 系统中安装 MongoDB，并通过 Express 连接数据库，实现基本的增、查操作。本节的核心目标是让你能够通过 MongoDB 存储和查询用户数据，并能理解 Express 和 MongoDB 之间是如何协作的。

通过一个实际的情景案例，我们将模拟开发一个 **用户预订查询系统**，展示如何通过后端 API 查询存储在 MongoDB 中的用户数据。

## 新人物介绍

​![image](../assets/image-20241203221742-1m7716q.png)​

**望月红叶**  
红叶是青叶的朋友，温泉旅馆的老板的女儿。她最近向青叶介绍了她们旅馆的自助查询系统，青叶十分好奇这个系统是如何运作的。红叶告诉她，旅馆的自助查询系统是通过一个API接口获取数据库中的预定信息的，客户只需要输入自己的用户名，就能看到自己的房间信息。红叶决定给青叶大致讲解一下她是如何从数据库中存取数据的。

截至目前，大家的职位如下：

​![image](../assets/image-20241203225449-ghlmqno.png)​

## 2. 什么是数据库？

数据库是一个用于存储、管理和查询数据的系统。在 Web 开发中，数据库用来存储各种动态数据，如用户信息、商品列表、订单记录等。

### **SQL 与 NoSQL 数据库**

* **SQL（关系型数据库）** ：使用结构化的表格来存储数据，数据之间有着严格的关系和约束（例如，表与表之间有外键关系）。常见的 SQL 数据库有 MySQL、PostgreSQL。
* **NoSQL（非关系型数据库）** ：适合存储非结构化或半结构化的数据，数据存储更加灵活，不需要预先定义表结构。MongoDB 就是一种典型的 NoSQL 数据库，它使用 JSON 样式的文档来存储数据。

### **MongoDB 的特点**

* **文档存储**：MongoDB 使用 BSON（类似 JSON）格式来存储数据，数据可以是嵌套的，非常灵活。
* **无模式**：与 SQL 数据库不同，MongoDB 不需要提前定义表的结构，可以灵活处理数据。
* **高性能**：MongoDB 对大数据量的读写操作优化较好，适合快速开发和处理复杂的查询。

---

## 3. 安装 MongoDB

```bash
# 1. 导入 MongoDB 公共 GPG 密钥并存储到新的密钥环
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo tee /etc/apt/trusted.gpg.d/mongodb.asc

# 2. 添加 MongoDB 仓库到 APT 配置中
echo "deb [arch=amd64] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 3. 更新 APT 软件包列表
sudo apt update

# 4. 安装 MongoDB
sudo apt install -y mongodb-org

# 5. 安装 MongoDB Shell（mongosh）
sudo apt install -y mongodb-org-tools

# 6. 启动 MongoDB 服务
sudo systemctl start mongod

# 7. 设置 MongoDB 开机自动启动
sudo systemctl enable mongod

# 8. 检查 MongoDB 是否正常运行
sudo systemctl status mongod

# 9. 使用 mongosh 连接到 MongoDB
mongosh

# 10. 退出mongo终端
.exit
```

---

## 4. 使用 Express 连接 MongoDB

### **项目初始化**

在本节中，我们将创建一个新的 Express 项目，并将 MongoDB 与项目连接。首先，你需要在 Ubuntu 上创建一个文件夹来存放项目文件。

> 如果你的环境不完整，请安装。
>
> ```bash
> # 删除旧版本的 Node.js 及相关包（如果存在）
> sudo apt-get remove --purge nodejs libnode72
> sudo apt autoremove
>
> curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
> sudo apt install -y nodejs
>
> node -v
> npm -v
>
> npm install -g pnpm
>
> pnpm -v
> ```

1. **创建项目文件夹**

    ```bash
    mkdir week6-database
    cd week6-database
    ```
2. **初始化 Node.js 项目**使用 `pnpm`​ 初始化一个新的 Node.js 项目：

    ```bash
    pnpm init
    ```
3. **安装所需依赖**我们将使用 `express`​ 来搭建服务器，`mongoose`​ 来连接 MongoDB 数据库，`body-parser`​ 来解析请求体中的 JSON 数据：

    ```bash
    pnpm add express mongoose body-parser
    ```

### **文件结构**

以下是我们项目的基本文件结构：

```bash
week6-database/
├── server.js          # 服务器的入口文件
├── models/
│   └── user.js        # 用户模型文件
└── package.json       # 项目的依赖配置文件
```

### **创建服务器并连接 MongoDB**

我们需要在 `server.js`​ 中连接到 MongoDB 并启动 Express 服务器。以下是详细的代码：

```javascript
// 引入依赖
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// 初始化 Express 应用
const app = express();

// 配置请求体解析中间件，解析 JSON 格式的数据
app.use(bodyParser.json());

// 连接 MongoDB 数据库
mongoose.connect('mongodb://localhost:27017/week6db');

// 获取 MongoDB 连接实例
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB 连接错误:'));
db.once('open', () => {
  console.log('MongoDB 已成功连接！');
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动，访问地址：http://localhost:${PORT}`);
});
```

### **代码讲解**

* **引入依赖**：

  * ​`express`​ 用于创建后端服务器。
  * ​`mongoose`​ 用于连接 MongoDB 并操作数据库。
  * ​`body-parser`​ 用于解析请求体中的 JSON 数据。
* ​**​`app.use(bodyParser.json())`​** ​：

  * 该行代码告诉 Express 服务器：当请求体是 JSON 格式时，我们将自动解析这些数据并将其放在 `req.body`​ 中，方便后续处理。
* ​**​`mongoose.connect()`​** ​：

  * 使用 `mongoose.connect()`​ 连接到本地 MongoDB 数据库 `week6db`​。数据库名可以自定义，如果没有这个数据库，MongoDB 会自动创建它。
  * 参数 `useNewUrlParser`​ 和 `useUnifiedTopology`​ 是为了确保 MongoDB 使用新的连接方式，避免过时的警告。
* ​**​`db.on('error', console.error)`​** ​：

  * 监听数据库连接错误，如果 MongoDB 连接失败，系统会输出错误信息。
* ​**​`db.once('open', () => {...})`​** ​：

  * 当数据库成功连接时，执行回调函数，输出提示信息 `MongoDB 已成功连接！`​。
* ​**​`app.listen()`​** ​：

  * 启动服务器监听 3000 端口，表示后端应用可以接收来自客户端的请求。

---

## 5. 定义数据模型

在 MongoDB 中，我们通过定义模型（Schema）来告诉数据库如何存储数据。接下来，我们将在 `models/user.js`​ 中定义一个简单的用户数据模型，存储用户的名字和预订日期。

在 `models/user.js`​ 文件中添加以下代码(注意，添加到服务器启动代码前面)：

```javascript
const mongoose = require('mongoose');

// 定义用户数据模型
const userSchema = new mongoose.Schema({
  name: String,  // 用户名字
  reservationDate: Date,  // 用户预订日期
});

// 导出模型
module.exports = mongoose.model('User', userSchema);
```

### **代码讲解**

* ​**​`mongoose.Schema()`​** ​：

  * 该函数用于定义数据库文档的结构。我们创建了一个 `userSchema`​，它包含两个字段：

    * ​`name`​：存储用户的名字，类型为 `String`​。
    * ​`reservationDate`​：存储用户的预订日期，类型为 `Date`​。
* ​**​`mongoose.model()`​** ​：

  * ​`mongoose.model('User', userSchema)`​ 通过 `userSchema`​ 创建一个名为 `User`​ 的模型。
  * 我们通过 `User`​ 模型与 MongoDB 数据库进行交互，进行数据增、删、改、查等操作。

---

## 6. 测试和验证

### **测试添加用户数据**

为了验证是否可以正确插入数据，我们可以编写一个简单的路由来添加用户数据。回到 `server.js`​，添加以下代码：

```javascript
const User = require('./models/user');

// 添加用户数据的路由
app.post('/add-user', async (req, res) => {
  const { name, reservationDate } = req.body;  // 从请求体中提取数据

  try {
    // 创建新用户并保存
    const newUser = new User({ name, reservationDate });
    await newUser.save();
    res.status(201).send('用户数据已保存！');
  } catch (err) {
    res.status(500).send('保存失败：' + err.message);
  }
});
```

### **代码讲解**

* ​**​`app.post('/add-user', async (req, res) => {...})`​** ​：

  * 这是一个处理 POST 请求的路由，当用户访问 `/add-user`​ 路径时，后端将会接收到 POST 请求。
* ​**​`new User({...})`​** ​：

  * 使用 `User`​ 模型创建一个新的用户对象，并通过 `save()`​ 方法将其保存到 MongoDB 中。
* ​**​`res.status(201).send()`​** ​：

  * 如果保存成功，返回 HTTP 状态码 201，并发送响应 `用户数据已保存！`​。

### **通过 curl 测试接口**

使用 curl 命令测试 `/add-user`​ 接口：

```bash
curl -X POST http://localhost:3000/add-user \
-H "Content-Type: application/json" \
-d '{"name": "红叶", "reservationDate": "2024-12-25"}'
```

如果数据成功插入，你将收到以下响应：

```bash
用户数据已保存！
```

---

## 7. 总结

本节课程介绍了如何在 Express 中安装和配置 MongoDB，以及如何使用 Mongoose 连接 MongoDB 和执行基本的数据库操作。你学习了如何定义数据模型、保存用户数据，并使用 curl 测试接口。通过这一节的学习，你已经具备了在 Express 项目中集成 MongoDB 的基础知识。

下一步，我们将在 Lab 中深入探讨如何查询数据库中的数据，返回用户预订信息。

‍
