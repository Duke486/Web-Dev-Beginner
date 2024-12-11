# Lab: 获取API数据并展示在页面上

### 实现目标

本次实验的目标是通过 **Axios** 向 API 发送请求，获取一部推荐的动漫信息，并将数据展示在网页上。你将学习如何在 Vue 组件中发送 HTTP 请求、处理响应数据，并通过数据绑定在页面上展示这些数据。

运行成功后，请务必自己阅读代码并理解实现方式。

​![image](../assets/image-20241203232937-wcyv1we.png)​

‍

---

## 文件结构

```text
/src
  /assets
  /components
    Info.vue       # 用于显示动漫信息的组件
  App.vue          # 根组件
  main.js          # 项目入口文件
```

---

## 步骤一：设置Vue项目环境

首先，创建一个 Vue 3 项目并安装依赖：

```bash
npm create vue@latest  # 创建 Vue 项目
pnpm i                 # 安装依赖
pnpm run dev            # 启动开发服务器
```

---

## 步骤二：安装Axios

安装 **Axios** 用于发送 HTTP 请求：

```bash
pnpm install axios
```

---

## 步骤三：编写 `Info.vue`​ 组件

在 **Info.vue** 中，我们使用 **Axios** 发送 GET 请求，获取推荐的动漫信息，并展示在页面上。

```vue
<template>
    <div class="anime-info">
        <h1>为您推荐的动漫</h1>
        <div v-if="animeData">
            <p><strong>标题：</strong>{{ animeData.title }}</p>
            <p><strong>年份：</strong>{{ animeData.year }}</p>
            <p><strong>类型：</strong>{{ animeData.genre }}</p>
            <img :src="animeData.imageUrl" alt="动漫封面" />
        </div>
        <div v-else>
            <p>加载中...</p>
        </div>
        <div v-if="error" class="error-message">
            <p>获取数据失败，请稍后重试。</p>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
export default {
    name: 'Info',
    setup() {
        const animeData = ref(null);  // 保存API返回的数据
        const error = ref(false);     // 错误状态

        // 获取动漫数据的函数
        const fetchAnimeData = async () => {
            try {
                // 发送GET请求
                const response = await axios.get('https://duke486.com/api/anime');
                animeData.value = response.data;  // 存储API返回的数据
            } catch (err) {
                error.value = true;  // 请求失败，设置错误状态
                console.error('获取数据失败：', err);
            }
        };

        // 页面加载时自动获取数据
        fetchAnimeData();

        return { animeData, error };  // 返回数据供模板使用
    }
};
</script>

<style scoped>
.anime-info {
    font-family: Arial, sans-serif;
    padding: 20px;
    background-color: #f4f4f4;
}

.anime-info img {
    width: 200px;
    margin-top: 10px;
}

.error-message {
    color: red;
    font-weight: bold;
}
</style>
```

---

## 步骤四：将 `Info.vue`​ 组件嵌套到 `App.vue`​

在 `App.vue`​ 中，直接嵌套 `Info.vue`​ 组件，展示动漫信息。

```vue
<template>
  <div id="app">
    <h1>欢迎来到动漫推荐系统</h1>
    <Info />
  </div>
</template>

<script>
// 导入Info组件
import Info from './components/Info.vue';

export default {
  name: 'App',
  components: {
    Info
  }
};
</script>

<style scoped>
#app {
  font-family: 'Arial', sans-serif;
  text-align: center;
  padding: 20px;
}
</style>
```

---

## 步骤五：启动项目

1. 在命令行中运行以下命令来启动开发服务器：

```bash
pnpm run dev
```

2. 打开浏览器，访问 `http://localhost:3000`​，你将看到以下内容：

    * 加载过程中显示 "加载中..."。
    * 数据请求成功后，展示推荐的动漫信息（如标题、年份、类型和封面图片）。
    * 如果请求失败，将显示错误提示。

## 总结

通过这个实验，你已经学会了如何在 Vue 3 中使用 **Axios** 来获取数据并在页面上展示。你不仅学会了如何发送 GET 请求，还学会了如何处理请求中的错误以及如何将请求到的数据通过 Vue 的数据绑定功能展示在模板中。

## 如果还有余力：

* 你可以尝试修改 API 地址，获取不同的数据类型，并展示在页面上。
* 你还可以加入其他功能，例如分页、搜索等，让应用更加丰富。
