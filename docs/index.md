---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Web-Dev-Beginner"
  text: "Quick start to front & back-end Dev"
  tagline: 本课程旨在通过动手实践，从零基础开始快速学习前端和后端开发。
  actions:
    - theme: brand
      text: Get Started
      link: /intro
    - theme: alt
      text: About
      link: /about
  image:
    src: /assets/logo.png
    alt: Logo

features:
  - title: 从零开始
    details: 无需任何基础，课程将从最基础的概念开始，逐步引导您学习Web开发。
  - title: 体验友好
    details: 通过理论和实践相结合的方式，引导您从基础概念到高级Web开发技术。
  - title: 注重实践
    details: 通过Lab，您将学习如何应用所学知识，从而更好地理解和掌握技术。
---
<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(150deg,#43c6ac,#f8ffae);

  --vp-home-hero-image-background-image: linear-gradient(307deg,#70e1f5,#ffd194);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>

