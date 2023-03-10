import { INavData } from '@coreui/angular';

export interface IRoleNavData extends INavData {
  allowedRoles?: string[];
  children?: IRoleNavData[];
}

export const navItems: IRoleNavData[] = [
  /*{
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    },
    allowedRoles: ["visitor", "user", "principal", "admin"],
  },*/

  {
    name: 'What is the MERLOT Marketplace',
    url: '/about',
    iconComponent: { name: 'cil-pen' },
    allowedRoles: ["visitor", "user", "principal", "admin"],
    children: [
      {
        name: 'About MERLOT',
        url: '/about/merlot',
        allowedRoles: ["visitor", "user", "principal", "admin"],
      },
      // TODO readd this once needed
      /*{
        name: 'Consortium Members',
        url: '/about/consortium',
        allowedRoles: ["visitor", "user", "principal", "admin"],
      },
      {
        name: 'Standard Conditions & Terms',
        url: '/about/terms',
        allowedRoles: ["visitor", "user", "principal", "admin"],
      },*/
    ]
  },
  {
    name: 'Manage Organization',
    url: '/organization',
    iconComponent: { name: 'cil-notes' },
    allowedRoles: ["visitor", "user", "principal", "admin"],
    children: [
      // TODO readd this once needed
      /*{
        name: 'Register My Organization',
        url: '/organization/register',
        allowedRoles: ["principal", "admin"],
      },
      {
        name: 'Edit My Organization',
        url: '/organization/edits',
        allowedRoles: ["principal", "admin"],
      },*/
      {
        name: 'Explore Organizations',
        url: '/organization/explore',
        allowedRoles: ["visitor", "user", "principal", "admin"],
      },
    ]
  },
  {
    name: 'Manage Users',
    url: '/users',
    iconComponent: { name: 'cil-user' },
    allowedRoles: ["user", "principal", "admin"],
    children: [
      // TODO readd this once needed
      /*{
        name: 'Register as Principal',
        url: '/users/register',
        allowedRoles: ["user", "principal", "admin"],
      },
      {
        name: 'Edit User',
        url: '/users/edit',
        allowedRoles: ["user", "principal", "admin"],
      },*/
      {
        name: 'Explore Users',
        url: '/users/explore',
        allowedRoles: ["user", "principal", "admin"],
      },
    ]
  },
  {
    name: 'Manage Service Offerings',
    url: '/service-offerings',
    iconComponent: { name: 'cil-puzzle' },
    allowedRoles: ["visitor", "user", "principal", "admin"],
    children: [
      {
        name: 'Edit Service Offering',
        url: '/service-offerings/edit',
        allowedRoles: ["principal", "admin"],
      },
      {
        name: 'Explore Service Offerings',
        url: '/service-offerings/explore',
        allowedRoles: ["visitor", "user", "principal", "admin"],
      },
    ]
  },

  /*{
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/theme/colors',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Typography',
    url: '/theme/typography',
    linkProps: { fragment: 'someAnchor' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Components',
    title: true
  },
  {
    name: 'Base',
    url: '/base',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Accordion',
        url: '/base/accordion'
      },
      {
        name: 'Breadcrumbs',
        url: '/base/breadcrumbs'
      },
      {
        name: 'Cards',
        url: '/base/cards'
      },
      {
        name: 'Carousel',
        url: '/base/carousel'
      },
      {
        name: 'Collapse',
        url: '/base/collapse'
      },
      {
        name: 'List Group',
        url: '/base/list-group'
      },
      {
        name: 'Navs & Tabs',
        url: '/base/navs'
      },
      {
        name: 'Pagination',
        url: '/base/pagination'
      },
      {
        name: 'Placeholder',
        url: '/base/placeholder'
      },
      {
        name: 'Popovers',
        url: '/base/popovers'
      },
      {
        name: 'Progress',
        url: '/base/progress'
      },
      {
        name: 'Spinners',
        url: '/base/spinners'
      },
      {
        name: 'Tables',
        url: '/base/tables'
      },
      {
        name: 'Tabs',
        url: '/base/tabs'
      },
      {
        name: 'Tooltips',
        url: '/base/tooltips'
      }
    ]
  },
  {
    name: 'Buttons',
    url: '/buttons',
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'Buttons',
        url: '/buttons/buttons'
      },
      {
        name: 'Button groups',
        url: '/buttons/button-groups'
      },
      {
        name: 'Dropdowns',
        url: '/buttons/dropdowns'
      },
    ]
  },
  {
    name: 'Forms',
    url: '/forms',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Form Control',
        url: '/forms/form-control'
      },
      {
        name: 'Select',
        url: '/forms/select'
      },
      {
        name: 'Checks & Radios',
        url: '/forms/checks-radios'
      },
      {
        name: 'Range',
        url: '/forms/range'
      },
      {
        name: 'Input Group',
        url: '/forms/input-group'
      },
      {
        name: 'Floating Labels',
        url: '/forms/floating-labels'
      },
      {
        name: 'Layout',
        url: '/forms/layout'
      },
      {
        name: 'Validation',
        url: '/forms/validation'
      }
    ]
  },
  {
    name: 'Charts',
    url: '/charts',
    iconComponent: { name: 'cil-chart-pie' }
  },
  {
    name: 'Icons',
    iconComponent: { name: 'cil-star' },
    url: '/icons',
    children: [
      {
        name: 'CoreUI Free',
        url: '/icons/coreui-icons',
        badge: {
          color: 'success',
          text: 'FREE'
        }
      },
      {
        name: 'CoreUI Flags',
        url: '/icons/flags'
      },
      {
        name: 'CoreUI Brands',
        url: '/icons/brands'
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/notifications',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Alerts',
        url: '/notifications/alerts'
      },
      {
        name: 'Badges',
        url: '/notifications/badges'
      },
      {
        name: 'Modal',
        url: '/notifications/modal'
      },
      {
        name: 'Toast',
        url: '/notifications/toasts'
      }
    ]
  },
  {
    name: 'Widgets',
    url: '/widgets',
    iconComponent: { name: 'cil-calculator' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Extras'
  },
  {
    name: 'Pages',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/login'
      },
      {
        name: 'Register',
        url: '/register'
      },
      {
        name: 'Error 404',
        url: '/404'
      },
      {
        name: 'Error 500',
        url: '/500'
      }
    ]
  },*/
];
