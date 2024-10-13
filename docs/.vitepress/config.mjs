import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    lastUpdated: true,
    title: "Web-Dev-Beginner",
    description: "Quick start to front & back-end Dev", // logo: '/logo.png',
    footer: {
        message: '基于 MIT 许可发布', copyright: `版权所有 © 2019-${new Date().getFullYear()} Duke486`
    },


    themeConfig: {
        editLink: {
            pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path'//这里需要修改为自己的仓库地址
        },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '页面导航'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },



        search: {
            provider: 'local'
        }, // https://vitepress.dev/reference/default-theme-config


        nav: [
            {text: 'Home', link: '/'},
            {text: 'Schedule', link: '/schedule'},
            {text: 'Github', link: '/intro'},
        ],

        sidebar: [
            {
                text: 'Guide',
                items: [
                    {text: '导入', link: '/intro'},
                    {text: '课程安排', link: '/schedule'},
                    {text: '准备工作', link: '/准备工作'},
                    // {text: 'About',link: '/about'}

                ]
            },
            {
                text: 'Week-1',
                items: [{text: 'Doc', link: '/week-1/doc'}, {text: 'Lab', link: '/week-1/lab'}, {
                    text: 'Homework',
                    link: '/week-1/homework'
                },

                ]
            }

        ],

        socialLinks: [{icon: 'github', link: 'https://github.com/vuejs/vitepress'}//这里需要修改为自己的仓库地址
        ]
    }
})


