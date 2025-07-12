import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "swiss-stage-project",
  description: "スイス方式トーナメントの対戦組み合わせを作成するアプリ",
  base: '/swiss-stage-project/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/swiss-stage-project.ico',
    sidebar: [
      {
        text: 'Menu',
        items: [
          { text: 'Feature Overview', link: '/feature-overview' },
          { text: 'Contribution Guide', link: '/contribution-guide' },
          { text: 'Download', link: 'https://github.com/takashi-ebina/swiss-stage-project/releases' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/takashi-ebina/swiss-stage-project' }
    ],
    search: {
      provider: 'local'
    },
    externalLinkIcon: true,
  },
  appearance: 'force-dark',
})
