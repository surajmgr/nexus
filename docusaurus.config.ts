import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Suraj Nexus',
  tagline: 'Centralized knowledge base for all projects',
  favicon: 'core/favicon.ico',
  future: {
    v4: true,
  },

  url: 'https://surajpulami.com.np',
  baseUrl: '/',

  organizationName: 'surajmgr',
  projectName: 'nexus',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/surajmgr/nexus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/surajmgr/nexus/tree/main/packages/create-docusaurus/templates/shared/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'fortihub',
        path: 'projects/fortihub/docs',
        routeBasePath: 'fortihub',
        sidebarPath: './projects/fortihub/sidebars.ts',
      },
    ],
    './src/plugins/feedback-route-plugin/index.ts',
  ],

  themeConfig: {
    image: 'core/social.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    metadata: [
      {
        name: 'apple-mobile-web-app-title',
        content: 'Nexus',
      },
    ],
    navbar: {
      title: 'SURAJ NEXUS',
      // hideOnScroll: true,
      logo: {
        alt: 'Suraj Nexus Logo',
        srcDark: 'core/logo-white.png',
        src: 'core/logo-black.png',
        style: {
          width: '18px',
          height: '18px',
        },
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guideSidebar',
          position: 'left',
          label: 'Guide',
        },
        {
          type: 'dropdown',
          label: 'Projects',
          position: 'left',
          items: [
            {
              to: '/fortihub/intro',
              label: 'FortiHub',
            },
          ],
        },
        {
          type: 'docsVersionDropdown',
          docsPluginId: 'fortihub',
          position: 'right',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        { to: '/feedback', label: 'Community', position: 'left' },
        {
          href: 'https://github.com/surajmgr',
          position: 'right',
          label: 'GitHub',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          type: 'search',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Adding Projects',
              to: '/docs/projects/adding-projects',
            },
            {
              label: 'Versioning Guide',
              to: '/docs/versioning',
            },
          ],
        },
        {
          title: 'Projects',
          items: [
            {
              label: 'FortiHub',
              to: '/fortihub/intro',
            },
            {
              label: 'All Projects',
              to: '/',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/surajmgr',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Privacy Policy',
              to: '/privacy',
            },
            {
              label: 'Terms of Service',
              to: '/terms',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Suraj Pulami.`,
    },
    // algolia: {
    //   // The application ID provided by Algolia
    //   appId: 'YOUR_APP_ID',

    //   // Public API key: it is safe to commit it
    //   apiKey: 'YOUR_SEARCH_API_KEY',

    //   // The index name to query
    //   indexName: 'YOUR_INDEX_NAME',

    //   // Optional: see doc section below
    //   contextualSearch: true,

    //   // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
    //   externalUrlRegex: 'external\\.com|domain\\.com',

    //   // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
    //   replaceSearchResultPathname: {
    //     from: '/docs/', // or as RegExp: /\/docs\//
    //     to: '/',
    //   },

    //   // Optional: Algolia search parameters
    //   searchParameters: {},

    //   // Optional: path for search page that enabled by default (`false` to disable it)
    //   searchPagePath: 'search',

    //   // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
    //   insights: false,

    //   //... other Algolia params
    // },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        href: '/core/favicon-96x96.png',
        sizes: '96x96',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/core/favicon.svg',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'shortcut icon',
        href: '/core/favicon.ico',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'apple-touch-icon',
        href: '/core/apple-touch-icon.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: '/core/site.webmanifest',
      },
    }
  ],
};

export default config;
