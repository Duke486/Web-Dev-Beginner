import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    lastUpdated: true,
    ignoreDeadLinks: true,
    title: "Web-Dev-Beginner",
    description: "Quick start to front & back-end Dev",
    logo: '/assets/logo.png',
    footer: {
        message: '基于 MIT 许可发布', copyright: `版权所有 © 2019-${new Date().getFullYear()} Duke486`
    },


    themeConfig: {
        editLink: {
            pattern: 'https://github.com/Duke486/Web-Dev-Beginner/edit/main/docs/:path'//这里需要修改为自己的仓库地址
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
            {text: 'Github', link: 'https://github.com/Duke486/Web-Dev-Beginner'},
        ],

        sidebar: [
            {
                text: 'Guide',
                items: [
                    {text: '简介', link: '/intro'},
                    {text: '时间表', link: '/schedule'},
                    {text: '基础知识', link: '/basic'},
                    {text: '准备工作', link: '/prepare'},
                    // {text: 'About',link: '/about'}

                ]
            },
            {
                text: 'Week-1',
                items: [
                    {text: 'Doc', link: '/week-1/doc'},
                    {text: 'Lab', link: '/week-1/lab'},
                    {text: 'Homework', link: '/week-1/homework'},
                ]
            },
            {
                text: 'Week-2',
                items: [
                    {text: 'Doc', link: '/week-2/doc'},
                    {text: 'Lab', link: '/week-2/lab'},
                    {text: 'Homework', link: '/week-2/homework'},
                ]
            },
            {
                text: 'Week-3',
                items: [
                    {text: '前端Doc', link: '/week-3/前端doc'},
                    {text: '前端Lab', link: '/week-3/前端lab'},
                    {text: '前端Homework', link: '/week-3/前端homework'},
                    {text: '后端Doc', link: '/week-3/后端doc'},
                    {text: '后端Lab', link: '/week-3/后端lab'},
                    {text: '后端Homework', link: '/week-3/后端homework'},
                ]
            }

        ],

        socialLinks: [{icon: 'github', link: 'https://github.com/Duke486/Web-Dev-Beginner'}//这里需要修改为自己的仓库地址
        ]
    }
})


