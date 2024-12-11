# Doc：JWT认证

## **1. 概要**

在本周的学习中，我们将深入探讨如何通过 **JWT (JSON Web Token)**  实现用户认证。JWT 是一种广泛应用于前后端分离架构中的身份认证机制，具有无状态、易于使用的特点。在本章节中，您将学习如何通过前后端协作来实现用户认证，保证系统的安全性和灵活性。

### **JWT 简介**

JWT 是一种紧凑、URL安全的令牌格式，用于在客户端和服务器之间安全地传输信息。它广泛应用于身份验证和信息交换场景中。通过 JWT，前端应用可以在每次请求时附带一个经过加密的令牌，后端则通过验证令牌来确定用户的身份。与传统的基于会话的身份验证方法不同，JWT 认证通常不需要在服务器端维护用户的会话状态，因此具有更高的扩展性和可维护性。

### **前后端合作流程**

JWT 认证系统的工作流程包含两个部分：前端和后端。前端主要负责发送用户的认证信息（如用户名和密码）并存储服务器返回的 JWT，后端则负责验证用户的身份并返回相应的令牌。在这部分内容中，我们将从前后端两方面来学习如何实现 JWT 认证。

* **前端：**  在用户登录时，前端发送包含用户凭证的请求，后端验证后返回 JWT。前端将 JWT 存储在本地（例如 `localStorage`​ 或 `cookies`​），并在后续的请求中将其附加在 HTTP 请求头中。
* **后端：**  后端负责验证用户的登录信息，生成并返回 JWT，此外，还需要提供 API 路由，用于验证 JWT 的有效性，确保只有经过认证的用户才能访问受保护的资源。

### **本章目标**

* 了解 **JWT** 的基本概念和工作原理。
* 掌握前后端如何通过 **JWT** 实现用户认证。
* 学习如何在前端存储和使用 JWT 进行身份验证。
* 理解后端如何生成和验证 JWT。
* 处理 JWT 安全性问题，如密钥管理、过期时间及刷新机制等。

## **2. 新人物介绍**

​![image](../assets/image-20241211105509-wmmh2bb.png)​

**星川莹** 是青叶和宁宁的高中同学，芳文美术大学在读插画师，刚刚回国。星川莹对公司访客预约系统的用户认证产生了浓厚的兴趣。通过与青叶、宁宁和海子的讨论，她了解到公司这是开发一款需要用户登录的web系统，而这个系统的认证方式就是通过 **JWT** 实现。

## **3. 基础知识**

### **3.1 JWT 的基本概念**

**JWT（JSON Web Token）**  是一种用于传递信息的开放标准，通常用于身份认证和信息交换。在 JWT 中，信息被编码成一个简短的字符串，并通过签名进行保护。JWT 由三个部分组成：

1. **Header（头部）**   
    JWT 的头部通常包含两部分信息：令牌的类型（JWT），以及签名使用的算法（如 HMAC SHA256 或 RSA）。  
    示例头部：

    ```json
    {
      "alg": "HS256",
      "typ": "JWT"
    }
    ```
2. **Payload（有效载荷）**   
    有效载荷包含了JWT的主体信息，通常用于存储用户的基本信息（如用户ID、角色、权限等）。这部分数据并未加密，因此，任何人都可以读取它， 但只能通过签名验证其完整性。  
    示例有效载荷：

    ```json
    {
      "sub": "1234567890",
      "name": "John Doe",
      "iat": 1516239022
    }
    ```

    其中，`sub`​ 是用户的唯一标识符，`iat`​ 表示签发时间。
3. **Signature（签名）**   
    签名是用来验证数据完整性和确认数据没有被篡改的。它是通过头部、有效载荷和密钥共同生成的。只有当签名有效时，才能信任这份JWT数据。  
    签名生成过程：

    ```text
    HMACSHA256(
      base64UrlEncode(header) + "." +
      base64UrlEncode(payload),
      secret)
    ```

### **3.2 JWT 工作原理**

JWT 的认证流程如下：

1. **用户登录：**   
    用户通过输入用户名和密码进行登录，前端发送一个 POST 请求到后端，包含用户输入的登录信息。
2. **后端生成 JWT：**   
    后端验证用户的登录信息（如用户名、密码是否正确），如果验证通过，则生成 JWT。这个 JWT 通常会包括用户的唯一标识（如 `user_id`​）、角色信息、令牌的过期时间等，并用服务器的密钥对其进行签名。
3. **前端存储 JWT：**   
    后端将生成的 JWT 返回给前端。前端可以将 JWT 存储在 `localStorage`​、`sessionStorage`​ 或者 `cookies`​ 中。`localStorage`​ 的优势是跨页面有效，但它容易受到 XSS 攻击；`cookies`​ 则相对更安全，但可能会受到 CSRF 攻击。
4. **后续请求：**   
    在后续的请求中，前端将 JWT 放入 `Authorization`​ 请求头中，以此来证明自己的身份。后端收到请求后，验证 JWT 是否有效（如签名是否正确、是否过期等）。
5. **保护路由：**   
    后端通过中间件对请求中的 JWT 进行验证，只有当 JWT 被验证为有效时，用户才能访问受保护的路由或资源。

### **3.3 JWT 的优势**

* **无状态性：**  JWT 的认证机制不需要在服务器端保存会话信息，所有用户信息都嵌入在 JWT 中，因此能够减少服务器的负担，适合分布式系统。
* **跨平台支持：**  JWT 作为一种标准的身份认证方式，不受平台限制，能够在多个应用程序、服务和设备之间传递认证信息。
* **灵活性：**  JWT 不仅可以用于认证，还可以用于传递其他类型的加密信息，确保数据的安全传输。

### **3.4 安全性考虑**

尽管 JWT 具有很多优势，但我们仍然需要特别注意其安全性。JWT 传输的信息是经过编码的，但并没有加密。因此，存储和传输 JWT 时必须采取以下安全措施：

* **密钥管理：**   
  密钥是生成和验证签名的关键，应该保存在安全的位置，如服务器的环境变量中，而不是代码库里。避免密钥泄露是确保系统安全的前提。
* **过期时间：**   
  JWT 通常设定一个过期时间，过期后 JWT 无效。过期时间要根据应用的需要合理设置，避免过期时间过长导致安全风险。
* **存储位置：**   
  不同的存储方式对安全性有不同的影响。例如，存储在 `localStorage`​ 中的 JWT 容易受到 XSS 攻击，而存储在 `cookies`​ 中则需要防范 CSRF 攻击。

‍

本节介绍了 JWT 的基本概念、工作流程和安全性问题。了解了 JWT 作为一种无状态、跨平台的认证机制，它如何帮助前后端实现高效、安全的用户认证。接下来，我们将深入探讨如何在前端和后端分别实现 JWT 认证。

## **4. 后端实现**

在本节中，我们将学习如何在后端实现 JWT 身份认证机制。后端的任务主要包括：生成和签发 JWT，验证传入的 JWT，并根据验证结果为用户提供访问受保护资源的权限。我们将使用 **Node.js** 和 **Express** 框架来构建后端应用，并且使用 **jsonwebtoken** 库来生成和验证 JWT。

### **4.1 环境搭建与依赖安装**

首先，我们需要设置一个简单的 Node.js + Express 项目，并安装所需的依赖：

1. 创建项目文件夹并初始化 Node.js 项目：

    ```bash
    mkdir jwt-backend
    cd jwt-backend
    npm init -y
    ```
2. 安装所需的依赖：

    ```bash
    npm install express jsonwebtoken dotenv bcryptjs
    ```

    * ​`express`​: 用于创建后端 API。
    * ​`jsonwebtoken`​: 用于生成和验证 JWT。
    * ​`dotenv`​: 用于管理环境变量（如密钥等敏感信息）。
    * ​`bcryptjs`​: 用于加密用户密码。

### **4.2 创建基本的 Express 应用**

目录树如下

```plaintext
jwt-backend/
├── .env                  # 环境变量配置文件，存储JWT密钥等敏感信息
├── node_modules/         # 项目依赖（安装时自动生成）
├── package.json          # Node.js 项目的配置文件
├── package-lock.json     # 依赖锁定文件
└── server.js             # Express 应用的入口文件

```

在项目根目录下，创建 `server.js`​ 文件，初始化 Express 应用：

```javascript
const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 模拟用户数据库
let users = [];

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

### **4.3 用户注册与登录**

用户在首次登录时需要注册，注册时，我们会将用户密码加密并存储。用户登录时，通过提供的用户名和密码生成 JWT。

#### **4.3.1 用户注册**

创建 `/register`​ 路由，处理用户注册请求。在注册过程中，用户提供的密码会使用 `bcryptjs`​ 库进行加密，并模拟存入数据库。

```javascript
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // 检查用户是否已存在
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  // 加密密码
  const hashedPassword = await bcrypt.hash(password, 10);

  // 模拟存入数据库
  const newUser = { username, password: hashedPassword };
  users.push(newUser);

  res.status(201).send('User registered successfully');
});
```

#### **4.3.2 用户登录**

创建 `/login`​ 路由，处理用户登录请求。在登录过程中，后端将验证用户名和密码，并生成 JWT。

```javascript
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 查找用户
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).send('Invalid credentials');
  }

  // 验证密码
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send('Invalid credentials');
  }

  // 生成 JWT
  const payload = { username: user.username }; // 在 JWT 中存储用户的基本信息
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // 设置过期时间为 1 小时

  res.json({ token });
});
```

在开发过程中，我们通常使用 `.env`​ 文件来存储敏感信息，比如密钥（如 `JWT_SECRET`​），而不把这些信息硬编码在代码里。`.env`​ 文件是一个简单的文本文件，存储的内容格式通常是 `KEY=value`​，例如 `JWT_SECRET=mysecretkey`​。通过这个文件，我们可以在项目中使用 `dotenv`​ 库来加载这些环境变量。在生产环境中，我们不推荐直接使用 `.env`​ 文件，而是应该在操作系统或容器中设置环境变量，这样可以确保生产环境的密钥和配置的安全性。

在操作系统中设置环境变量的方法因系统而异。在 Linux 或 macOS 上，通常可以通过命令行设置环境变量，例如：

```bash
export JWT_SECRET=mysecretkey
```

然后，在应用启动时，环境变量会被加载。

在生产环境中，这些环境变量会被容器或操作系统自动管理，而不需要依赖 `.env`​ 文件。这是因为生产环境需要更高的安全性，而直接在 `.env`​ 文件中存储密钥容易泄露。开发时使用 `.env`​ 文件方便快捷，但在生产环境中，直接设置操作系统或容器的环境变量更加安全和灵活。

​`expiresIn`​ 选项则设置了令牌的有效期为 1 小时。

### **4.4 验证 JWT**

为了保护敏感路由，我们需要创建一个中间件来验证请求中的 JWT 是否有效。此中间件将从请求头中提取 JWT 并进行验证。如果 JWT 有效，用户可以访问受保护的资源；否则，返回 `401 Unauthorized`​ 错误。

#### **4.4.1 创建 JWT 验证中间件**

```javascript
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // 从 Authorization 头部获取 JWT

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 验证 JWT
    req.user = decoded; // 将解码后的用户信息附加到请求对象上
    next(); // 继续处理请求
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};
```

#### **4.4.2 使用中间件保护路由**

我们可以将 `verifyToken`​ 中间件应用到需要保护的路由上。例如，创建一个 `/profile`​ 路由，仅允许认证用户访问：

```javascript
app.get('/profile', verifyToken, (req, res) => {
  // 通过 req.user 获取解码后的用户信息
  res.json({ message: `Welcome ${req.user.username}` });
});
```

在这个例子中，只有在提供了有效的 JWT 的情况下，用户才能访问 `/profile`​ 路由。否则，系统会返回 `401 Unauthorized`​ 或 `400 Invalid token`​ 错误。

### **4.5 使用环境变量存储密钥**

为了保护密钥不被泄露，我们可以将密钥存储在环境变量中。首先，创建一个 `.env`​ 文件，添加以下内容：

```makefile
JWT_SECRET=mysecretkey
```

然后，在 `server.js`​ 中使用 `dotenv`​ 库加载环境变量：

```javascript
dotenv.config();
```

通过这种方式，密钥可以避免硬编码在代码中，增强了安全性。

### **4.6 后端接口总结**

到此为止，我们实现了后端的基本 JWT 用户认证机制，包括用户注册、登录、生成和验证 JWT 以及保护受限资源。整个过程涉及以下几个重要步骤：

1. **用户注册：**  后端接收用户信息并存储，密码进行加密。
2. **用户登录：**  后端验证用户信息，并根据验证结果生成 JWT。
3. **JWT 验证中间件：**  后端通过中间件验证每次请求中的 JWT 是否有效。
4. **保护路由：**  使用 JWT 中间件保护受限资源，只有认证用户才能访问。

通过这种方式，前后端能够安全地共享认证信息，并且避免传统的基于会话的认证所带来的服务器负担。

完整版代码：

```plaintext
const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 加载环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 模拟用户数据库
let users = [];

// 用户注册路由
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // 检查用户是否已存在
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  // 加密密码
  const hashedPassword = await bcrypt.hash(password, 10);

  // 模拟存入数据库
  const newUser = { username, password: hashedPassword };
  users.push(newUser);

  res.status(201).send('User registered successfully');
});

// 用户登录路由
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 查找用户
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).send('Invalid credentials');
  }

  // 验证密码
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send('Invalid credentials');
  }

  // 生成 JWT
  const payload = { username: user.username }; // 在 JWT 中存储用户的基本信息
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// JWT 验证中间件
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 验证 JWT
    req.user = decoded; // 将解码后的用户信息附加到请求对象上
    next(); // 继续处理请求
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

// 受保护的用户资料路由
app.get('/profile', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}` });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

```

‍

测试例子：

```bash
# 1. 注册新用户
curl -X POST http://localhost:3000/register \
    -H "Content-Type: application/json" \
    -d '{"username": "testuser", "password": "password123"}'

# 预期响应:
# "User registered successfully"

# 2. 登录用户并获取 JWT
curl -X POST http://localhost:3000/login \
    -H "Content-Type: application/json" \
    -d '{"username": "testuser", "password": "password123"}'

# 预期响应 (示例):
# {
#   "token": "your_jwt_token_here"
# }

# 3. 使用获取到的 JWT 访问受保护的资料
curl -X GET http://localhost:3000/profile \
    -H "Authorization: Bearer your_jwt_token_here"

# 预期响应:
# {
#   "message": "Welcome testuser"
# }

# 4. 尝试用无效的 JWT 访问受保护的资料
curl -X GET http://localhost:3000/profile \
    -H "Authorization: Bearer invalid_token"

# 预期响应:
# "Invalid token"

# 5. 尝试在没有 JWT 的情况下访问受保护的资料
curl -X GET http://localhost:3000/profile

# 预期响应:
# "Access denied. No token provided."
```

1. **注册新用户**：此请求会向服务器发送一个 `POST`​ 请求，注册用户名为 `testuser`​ 和密码为 `password123`​ 的用户。
2. **登录用户**：此请求会使用 `testuser`​ 和 `password123`​ 登录，成功后会返回一个 JWT 令牌。
3. **访问受保护的资料**：这会用从登录响应中获得的 `token`​ 来访问 `/profile`​ 路由。如果 JWT 有效，将返回欢迎信息。
4. **无效的 JWT**：使用无效的 JWT 进行请求会导致返回 `Invalid token`​ 错误。
5. **缺少 JWT**：如果请求头没有提供 JWT，服务器会返回 `Access denied. No token provided.`​ 错误。

‍

本节我们通过 Node.js 和 Express 框架实现了一个简单的 JWT 身份认证后端。我们创建了用户注册与登录功能，并利用 JWT 来保护需要身份验证的路由。后端生成的 JWT 采用了 **HS256** 算法，并通过 `jsonwebtoken`​ 库进行签名和验证。在下节中，我们将介绍如何在前端实现与后端的 JWT 配合使用。

## **5. 前端实现**

在本节中，我们将介绍如何在 Vue 项目中实现 JWT 身份认证。主要内容包括：如何发送请求到后端进行登录、如何存储 JWT 以及如何将其添加到每个后续的 API 请求中。我们还会通过保护路由来确保只有经过认证的用户才能访问特定页面。

### **5.1 环境搭建与依赖安装**

首先，创建一个新的 Vue 3 项目并安装需要的依赖。

1. 创建 Vue 项目：

    ```bash
    npm create vue@latest
    ```
2. 进入项目文件夹并安装依赖：

    ```bash
    cd your-vue-project
    pnpm i
    ```
3. 安装 `axios`​，用于发送 HTTP 请求：

    ```bash
    pnpm add axios
    ```
4. 启动开发服务器：

    ```bash
    pnpm run dev
    ```

### **5.2 配置 Axios 实现全局请求**

为了在 Vue 项目中方便地发送 HTTP 请求，我们需要配置 Axios，使得每次发送请求时，都会自动附加上 JWT。

1. 创建 `src/axios.js`​ 文件，用于设置 Axios 实例：

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // 后端 API 基础 URL
  timeout: 10000, // 请求超时设置
});

// 添加请求拦截器，自动在请求头中添加 JWT
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 将 JWT 添加到 Authorization 头部
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器，处理错误
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // 如果 401 错误，说明 JWT 无效或已过期，可以在此进行跳转到登录页
      localStorage.removeItem('jwt_token');
      window.location.href = '/login'; // 跳转到登录页（如果有）
    }
    return Promise.reject(error);
  }
);

export default api;
```

2. 在 `src/main.js`​ 中引入并使用这个配置过的 Axios 实例：

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import api from './axios';

const app = createApp(App);
app.config.globalProperties.$api = api; // 全局注册 api 实例
app.mount('#app');
```

### **5.3 用户登录与 JWT 存储**

用户登录时，前端将发送用户名和密码到后端，后端验证成功后返回 JWT。前端将 JWT 存储在 `localStorage`​ 中，以便后续的 API 请求使用。

1. 创建一个简单的登录页面 `src/views/Login.vue`​：

```vue
<template>
  <div class="login">
    <h2>登录</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">用户名</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div>
        <label for="password">密码</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const router = useRouter();

    const login = async () => {
      try {
        const response = await this.$api.post('/login', {
          username: username.value,
          password: password.value
        });

        // 登录成功后，保存 JWT 到 localStorage
        localStorage.setItem('jwt_token', response.data.token);

        // 跳转到主页或受保护的页面
        router.push('/');
      } catch (error) {
        alert('登录失败，请检查用户名和密码');
      }
    };

    return {
      username,
      password,
      login
    };
  }
};
</script>

<style scoped>
/* 登录页面样式 */
</style>
```

2. 在登录成功后，我们将 `JWT`​ 保存在浏览器的 `localStorage`​ 中。这样，在后续的 API 请求中，JWT 会自动附加到请求头中。

### **5.4 发送带 JWT 的请求**

在登录后，前端会将用户的 JWT 保存在 `localStorage`​ 中，并在发送请求时，通过 Axios 自动将 JWT 加入到请求头部。

在 Vue 组件中，你可以通过 `$api`​ 发送带有 JWT 的请求：

```javascript
// 发送 GET 请求示例
const fetchProfile = async () => {
  try {
    const response = await this.$api.get('/profile');
    console.log('User Profile:', response.data);
  } catch (error) {
    console.error('获取用户资料失败:', error);
  }
};
```

此时，Axios 会自动将 `Authorization`​ 头部加上保存的 `JWT`​，以便后端验证身份。

### **5.5 保护路由**

为了防止未登录用户直接访问受保护的页面，我们可以使用 Vue Router 来保护路由。只有登录并且 JWT 有效的用户才能访问这些路由。

1. 在 `src/router/index.js`​ 中配置路由：

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { 
    path: '/profile', 
    component: Profile, 
    meta: { requiresAuth: true } // 需要认证才能访问
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫，检查是否需要认证
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('jwt_token')) {
    next('/login'); // 如果没有 JWT，重定向到登录页面
  } else {
    next(); // 继续访问目标页面
  }
});

export default router;
```

在这个路由守卫中，我们检查目标路由是否需要认证（通过 `meta.requiresAuth`​ 标识），如果需要认证且用户未登录，则重定向到登录页。

### **5.6 登出功能**

用户登出时，前端需要删除 `localStorage`​ 中的 JWT，并跳转到登录页或主页。

1. 在 Vue 组件中实现登出功能：

```javascript
const logout = () => {
  localStorage.removeItem('jwt_token');
  this.$router.push('/login'); // 跳转到登录页
};
```

### **5.7 前端代码总结**

1. **Axios 配置：**  我们使用 Axios 配置了请求拦截器，将 JWT 添加到每次请求的 `Authorization`​ 头部。
2. **登录：**  用户输入用户名和密码后，前端将其发送到后端，后端返回 JWT，前端将 JWT 存储在 `localStorage`​ 中。
3. **发送请求：**  在发送带 JWT 的请求时，Axios 会自动将 JWT 加入请求头。
4. **保护路由：**  使用 Vue Router 的路由守卫保护需要认证的页面，未认证的用户将被重定向到登录页。
5. **登出：**  用户可以通过登出功能删除 JWT，确保用户退出后无法访问受保护资源。

‍

在本节中，我们介绍了如何在 Vue 3 项目中实现 JWT 身份认证。通过配置 Axios 拦截器、登录、存储 JWT 和保护路由，我们实现了一个基本的前端身份验证流程。接下来，你可以将这些技术与后端配合使用，完成一个完整的 JWT 身份认证系统。

## **6. 测试与调试**

在进行开发时，确保应用的正确性是至关重要的。通过使用合适的测试工具和调试技巧，可以高效地定位问题并确保项目按预期运行。

### **6.1 使用 Postman 测试后端接口**

除了使用curl指令来测试后端接口，我们还有一种更强大的方法。Postman 是一个流行的 API 测试工具，适用于测试 RESTful API 接口。以下是如何使用 Postman 来测试我们实现的后端接口。

1. **安装 Postman：** 前往[Download Postman | Get Started for Free](https://www.postman.com/downloads/) 下载并安装 Postman。
2. **测试登录接口：** 在 Postman 中，选择 `POST`​ 方法并输入登录接口 URL，例如 `http://localhost:3000/login`​。在请求的 `Body`​ 部分，选择 `raw`​，并设置为 `JSON`​ 格式，输入以下内容：

    ```json
    {
      "username": "user1",
      "password": "password123"
    }
    ```
3. **发送请求并获取 JWT：** 点击 "Send" 按钮，后端应该返回一个 JSON 响应，包含一个 JWT。例如：

    ```json
    {
      "token": "your_jwt_token_here"
    }
    ```
4. **使用 JWT 进行认证：** 将获得的 `JWT`​ 复制，并在后续的 API 请求中设置 `Authorization`​ 头，格式如下：

    ```makefile
    Authorization: Bearer your_jwt_token_here
    ```
5. **测试受保护的接口：** 例如，访问 `/profile`​ 接口时，确保在请求头中添加正确的 JWT。点击 "Send" 后，应该能获取到用户的资料。

### **6.2 前端调试技巧**

在开发前端时，调试和测试是确保功能正常的关键步骤。以下是一些有用的前端调试技巧：

1. **浏览器开发者工具：**

    * **Network Tab:**  在浏览器的开发者工具中，选择 `Network`​ 标签，查看所有的网络请求。检查每个请求的 URL、方法、请求头和响应数据，确保接口请求和响应都符合预期。
    * **Console Tab:**  查看控制台中的错误和日志，尤其是在前端开发过程中，使用 `console.log()`​ 输出请求和响应数据。
2. **Axios 请求拦截器调试：** 在配置 Axios 请求时，可以在请求拦截器中添加日志来跟踪每个请求：

    ```javascript
    api.interceptors.request.use(
      config => {
        console.log('请求发送前配置:', config);
        return config;
      },
      error => {
        console.error('请求失败:', error);
        return Promise.reject(error);
      }
    );
    ```
3. **错误处理：** 在发送请求时，确保捕获错误并显示适当的错误信息。例如，在 `catch`​ 块中处理 Axios 错误，向用户显示友好的提示：

    ```javascript
    try {
      const response = await this.$api.get('/profile');
      console.log('用户资料:', response.data);
    } catch (error) {
      alert('获取资料失败，错误：' + error.message);
    }
    ```
4. **Vue Devtools：** Vue Devtools 是一个非常强大的浏览器插件，可以帮助你查看 Vue 应用的状态、组件树、Vuex 状态管理和路由信息。使用它可以方便地调试 Vue 应用中的数据流。我们可以在pnpm run dev打开的网页底部发现调试按钮。

---

## **7. 部署与上线**

:::tip

这里只简单介绍大体步骤，具体部署过程请阅读本周Lab。

:::

在完成开发后，部署是让应用上线并投入使用的关键步骤，通常分为后端部署和前端部署两个部分。

**后端部署** 首先需要将后端应用部署到服务器上，确保它能处理来自前端的请求。一般的操作流程包括使用像 PM2 这样的进程管理工具来启动和管理 Node.js 应用，确保应用在生产环境中稳定运行。此外，反向代理配置（例如使用 Nginx）可以将前端请求转发给后端服务，确保流量的正确引导。在生产环境中，敏感信息（如数据库连接和密钥）应通过环境变量进行配置，避免硬编码。最后，将代码部署到云服务器上，并配置合适的域名和 HTTPS 以保障安全通信。

**前端部署** 对于前端，首先需要构建应用并生成静态文件。构建完成后，将这些文件上传到静态资源服务器进行托管。常见的部署平台包括 Vercel 和 Netlify，它们提供了简单的配置和快速部署方式。此外，也可以选择 AWS S3 或使用 Nginx/Apache 服务器来托管静态资源。为了确保网站的安全性和加密通信，通常还需要为域名配置 SSL 证书（如通过 Let's Encrypt）。

## **8. 常见问题与解决方案**

### **8.1 跨域问题**

在开发过程中，前后端通常运行在不同的端口或域名上，这可能导致跨域请求问题。我们之前已经将结果，简单回顾下解决方案有：

1. **后端启用 CORS：** 后端服务需要设置 `Access-Control-Allow-Origin`​ 头部，以允许特定的前端域名进行跨域请求。比如：

    ```javascript
    app.use(cors({
      origin: 'http://localhost:3000' // 允许该域名进行跨域请求
    }));
    ```
2. **使用代理：** 在开发环境中，前端应用可以通过代理将请求转发到后端，避免跨域问题。比如，在 Vite 中配置代理：

    ```javascript
    export default {
      server: {
        proxy: {
          '/api': 'http://localhost:3000', // 代理 API 请求
        },
      },
    };
    ```

### **8.2 JWT 无效或过期**

1. **自动刷新 JWT：** 如果 JWT 在一段时间后过期，可以在前端实现自动刷新机制，获取新的 JWT。比如，可以在每次请求时检查 401 错误，如果是 JWT 过期，可以自动重新请求获取新的 JWT。
2. **用户退出：** 用户可以通过登出功能清除浏览器中的 JWT，确保用户登出后无法继续访问需要认证的页面。

### **8.3 请求失败或无响应**

1. **检查 API URL：** 确保前端请求的 API 地址正确，且后端服务已经启动并正常运行。
2. **检查网络连接：** 确保前后端服务都在可访问的网络环境下，特别是在部署到云服务器时，检查防火墙和安全组设置。

## **9. 小结**

本章涵盖了如何在前后端分离的应用中实现 JWT 身份认证。我们从后端实现 JWT 生成与验证、前端发送认证请求、存储 JWT 到浏览器以及前端保护路由等方面进行了详细讲解。此外，还介绍了如何测试、部署和解决开发过程中常见的跨域问题和错误。通过本章的学习，你已经掌握了如何通过 JWT 实现前后端的身份认证，并能够在实际项目中应用这些技术来确保用户安全访问。
