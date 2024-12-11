# Doc: 使用Axios发送GET/POST请求

## 1. 概要

在本周的学习中，我们将深入学习如何通过 **Axios** 发送HTTP请求。Axios 是一个非常流行的 JavaScript 库，用于从前端与后端进行通信。通过它，我们可以轻松发送GET、POST请求，获取或提交数据，进而实现与服务器的交互。

**Axios vs XMLHttpRequest &amp; Fetch**  
通常，JavaScript提供了`XMLHttpRequest`​和`fetch`​这两种方式来进行HTTP请求。而 **Axios** 在这些传统方法的基础上，提供了简洁的API和更多的功能，能够更加方便地处理请求和响应。

* **自动解析JSON**：Axios会自动把服务器返回的JSON格式数据转成JavaScript对象，而`fetch`​需要手动解析。
* **简洁的错误处理**：Axios会在HTTP请求失败时自动抛出错误，而`fetch`​只有在请求出现网络错误时才抛出异常，HTTP错误（如404、500）不会被自动视为错误。

**本章目标**

* 学习如何安装和使用Axios。
* 使用Axios发送GET和POST请求。
* 学会在Vue中处理请求和响应。

:::warning

Doc中提到的API都是虚构的，并未实际架设到duke486.com上，请不要直接执行这里的代码。此外，lab与homework中涉及的API在校内培训期间会保持开放，但不保障长期运行。如有需要请借助AI等工具编写测试用的服务端代码，以此检查自己的前端项目能否正常工作。

:::

:::info 跨域问题

前后端运行在不同地址时，**可能会遇到跨域问题。** 例如在自己的电脑上运行前端应用，请求 `duke486.com`​ 时。

### 为什么会有跨域问题？

**跨域资源共享（CORS）**  是浏览器的安全机制，防止一个网站的脚本访问另一个域名下的资源。换句话说，如果你的前端应用（例如 `localhost`​）向 `duke486.com`​ 发送请求，浏览器会认为这是一个 **跨域请求**。

跨域问题的根本原因是：前端应用的源（`localhost`​ 或任何本地开发环境）与后端服务器的源（`duke486.com`​）不同，这时浏览器会阻止前端访问后端的数据，除非后端明确允许跨域请求。

**解决跨域问题：**

1. **服务器端支持 CORS**  
    如果服务器端（`duke486.com`​）在响应头中加入了 CORS 相关的字段，如：

    ```javascript
    Access-Control-Allow-Origin: *
    ```

    或者

    ```javascript
    Access-Control-Allow-Origin: http://localhost:3000
    ```

    那么浏览器就不会阻止跨域请求，前端可以正常获取数据。

    **注意：** 在本Week中 `duke486.com`​ 的 API 已经启用了 CORS
2. **使用代理**  
    如果 `duke486.com`​ 服务器没有启用 CORS，作为前端开发者，你可以使用代理来绕过这个限制。具体做法是在本地开发环境中设置一个代理服务器。这样请求首先会发送到代理服务器，再由代理服务器转发到 `duke486.com`​，从而避免浏览器的跨域限制。

    * **Vite 配置代理**：我们使用的是 Vite+Vue，可以在 `vite.config.js`​ 中配置代理：

      ```js
      // vite.config.js
      export default {
        server: {
          proxy: {
            '/api': 'https://duke486.com',  // 将请求转发到真实的API地址
          },
        },
      };
      ```

      这样，前端请求 `/api`​ 会被代理到 `https://duke486.com/api`​，避免跨域问题。

:::

---

## 2. 新人物介绍

​![image](../assets/image-20241203221742-1m7716q.png)​

**望月红叶**  
红叶是青叶的朋友，温泉旅馆的老板的女儿。她最近向青叶介绍了她们旅馆的自助查询系统，青叶十分好奇这个系统是如何运作的。红叶告诉她，旅馆的自助查询系统是通过一个API接口获取预定信息的，客户只需要输入预定ID，就能看到自己的房间信息。青叶决定也要学习如何通过API请求来实现类似的功能。

截至目前，大家的职位如下：

​![image](../assets/image-20241203225449-ghlmqno.png)​

---

## 3. 基础知识

**3.1 如何安装Axios**

要在Vue项目中使用Axios，我们首先需要安装Axios库。创建一个新的vue项目并进入项目目录。

在终端中执行以下命令来安装Axios：

```bash
pnpm install axios
```

**3.2 在Vue项目中引入Axios**

安装完成后，我们需要在Vue项目中引入Axios。通常，你可以在需要发送请求的组件或文件中引入它。Axios的引入并不需要在`vite.config.js`​中进行配置。直接在你想用Axios的文件中引入即可。

比如，在一个Vue组件中，你可以这样引入：

```javascript
import axios from 'axios';
```

---

**3.3 发送GET请求**

发送GET请求的基本语法如下：

```javascript
axios.get(url)//这是目标URL
  .then(response => {
    console.log(response.data);  // 处理服务器返回的数据
  })
  .catch(error => {
    console.error('请求失败:', error);  // 处理错误
  });
```

**示例：通过GET请求获取数据**

假设我们要从服务器获取某个用户的预定信息。发送的请求代码如下：

```javascript
import axios from 'axios';

axios.get('https://duke486.com/api/reservations/101')
  .then(response => {
  //response是获取到的响应
    console.log('预定信息：', response.data);
  })
  .catch(error => {
    console.error('请求失败:', error);
  });
```

**请求的响应格式**

假设你向`https://duke486.com/api/reservations/101`​发送了GET请求，服务器的响应（返回的数据）可能是如下的JSON格式：

```json
{
  "status": "success",
  "data": {
    "userId": 101,
    "reservationStartDate": "2024-12-10",
    "reservationEndDate": "2024-12-12",
    "roomType": "B202"
  }
}
```

**如何理解这个响应：**

* ​`status`​: 表示请求的状态，`success`​表示请求成功。
* ​`data`​: 这里包含了具体的预定信息，如用户ID、起始日期、结束日期以及房间类型。

你可以通过`response.data`​来获取这个数据并在页面上展示。

---

**3.4 发送POST请求**

POST请求用于向服务器发送数据。例如，当用户提交表单时，你可能需要使用POST请求将数据发送到服务器。

**发送POST请求的基本语法：**

```javascript
axios.post(url, data)
  .then(response => {
    console.log('服务器响应:', response.data);
  })
  .catch(error => {
    console.error('请求失败:', error);
  });
```

**示例：通过POST请求发送数据**

假设你需要将用户填写的预定信息提交到服务器，代码如下：

```javascript
const reservationData = {
  userId: 101,
  reservationStartDate: '2024-12-10',
  reservationEndDate: '2024-12-12',
  roomType: 'B202'
};

axios.post('https://duke486.com/api/reservations', reservationData)
  .then(response => {
    console.log('预定成功:', response.data);
  })
  .catch(error => {
    console.error('请求失败:', error);
  });
```

**POST请求的响应示例**

服务器可能会返回如下的响应数据：

```json
{
  "status": "success",
  "message": "预定成功",
  "data": {
    "reservationId": 12345,
    "userId": 101,
    "reservationStartDate": "2024-12-10",
    "reservationEndDate": "2024-12-12",
    "roomType": "B202"
  }
}
```

这个响应表明预定已经成功，服务器还返回了一个`reservationId`​，即预定的ID。

---

**3.5 错误处理**

在实际开发中，错误处理是至关重要的，尤其是在进行网络请求时。Axios会捕获请求中的所有错误，无论是网络问题，还是服务器返回错误的状态码（如404或500）。

**如何处理错误**

```javascript
axios.get('https://duke486.com/api/reservations/101')
  .then(response => {
    console.log('预定信息：', response.data);
  })
  .catch(error => {
    if (error.response) {
      // 服务器返回了状态码，且不是2xx的响应
      console.error('响应错误:', error.response.status, error.response.data);
    } else if (error.request) {
      // 请求已经发送，但没有收到响应
      console.error('没有收到响应:', error.request);
    } else {
      // 其他错误
      console.error('请求错误:', error.message);
    }
  });
```

在这个错误处理的示例中：

* ​`error.response`​：表示服务器返回了错误的响应，例如404（未找到）或500（服务器错误）。
* ​`error.request`​：表示请求已成功发送，但没有收到响应。这通常表示网络连接有问题。
* ​`error.message`​：表示发生了其他类型的错误，例如请求的语法错误。

---

## 4. 情景案例

**角色引导：青叶询问红叶如何查询预定日期的API**

青叶好奇地问红叶：旅馆前台有个自助查询系统，用户只需要输入ID就能查询自己的预定信息。这是怎么实现的呢？

红叶则回答道：其实很简单，我们店使用了一个API接口，当用户输入他们的ID时，系统就向我们的服务器发送请求，返回他们的预定信息。

**思考过程：从需求到实现**

青叶决定实现一个简单的API查询系统，来展示用户的预定信息。她需要：

1. 使用GET请求获取某个用户的预定信息。
2. 在Vue组件中展示这些信息。

**步骤讲解：**

1. 设计API接口：API接口通过GET请求获取预定数据，URL为`https://duke486.com/api/reservations/{userId}`​，其中`{userId}`​是用户的ID。
2. 发送GET请求：青叶使用Axios发送GET请求，获取用户的预定信息。
3. 解析返回的数据：获取的数据包括起始日期、结束日期和房间类型等，青叶将这些数据展示在页面上。

**代码：如何在Vue组件中使用Axios完成API请求并显示数据**

```vue
<template>
  <div>
    <h1>用户预定信息</h1>
    <p>房间类型：{{ reservation.roomType }}</p>
    <p>预定日期：{{ reservation.reservationStartDate }} 至 {{ reservation.reservationEndDate }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      reservation: {}  // 用来存储预定数据
    };
  },
  mounted() {
    // 组件加载时发送请求
    axios.get('https://duke486.com/api/reservations/101')
      .then(response => {
        this.reservation = response.data.data;  // 获取数据并赋值
      })
      .catch(error => {
        console.error('请求失败:', error);
      });
  }
};
</script>
```

解析：

```
1. 在`mounted()`​钩子中发送GET请求。
2. 获取到的数据通过`response.data.data`​获取，因为实际的预定信息是在`data`​字段下。
3. 使用`{{ reservation.roomType }}`​和`{{ reservation.reservationStartDate }}`​等绑定数据。
```

## 5. 总结

通过本章的学习，你已经掌握了使用Axios发送GET和POST请求、处理响应数据的基本写法，并在Vue组件中展示它们。同时，我们也学会了如何处理可能出现的请求错误。

* **Axios安装与引入**：通过`pnpm install axios`​安装，并在需要的文件中通过`import axios from 'axios'`​引入。
* **GET与POST请求**：掌握了如何通过Axios发送GET和POST请求，理解请求和响应的数据结构。
* **错误处理**：学会了如何捕获并处理请求中的错误，确保应用稳定运行。
