/* eslint-disable prettier/prettier */
import CogSVG from './assets/Cog.svg'
import GridSVG from './assets/Grid.svg'
import HeartSVG from './assets/Heart.svg'
import MagnifyingGlassSVG from './assets/MagnifyingGlass.svg'

export type PublicRoute =
  | 'search'
  | 'about'
  | 'developers'
  | 'faq'
  | 'community'
  | 'help'
  | 'governance'
  | 'docs'
export type ConnectedRoute = 'names' | 'profile' | 'favourites' | 'settings'
export type AnyRoute = PublicRoute | ConnectedRoute | 'unknown'

export type RouteItemObj = {
  name: PublicRoute | ConnectedRoute | 'unknown'
  href: string
  label: string
  disabled: boolean
  connected: boolean
  icon?: any
}

export const routes: RouteItemObj[] = [
  {
    name: 'search',
    href: '/',
    label: 'navigation.home',
    disabled: false,
    connected: false,
    icon: MagnifyingGlassSVG,
  },
  {
    name: 'about',
    href: '/about',
    label: 'navigation.about',
    disabled: true,
    connected: true, //
  },
  {
    name: 'developers',
    href: 'https://github.com/op-domains',
    label: 'navigation.developers',
    disabled: false, // make it false to enabe button
    connected: false,
  },
  {
    name: 'community',
    href: 'https://twitter.com/opnamesorg',
    label: 'navigation.community',
    disabled: false, // 
    connected: false,
  },
  {
    name: 'faq',
    href: '/faq',
    label: 'FAQ',
    disabled: false,
    connected: false,
  },
  {
    name: 'help',
    href: 'https://discord.gg/RTayddEKrD',
    label: 'navigation.help',
    disabled: false,
    connected: false, //
  },
  {
    name: 'governance',
    href: '/governance',
    label: 'navigation.governance',
    disabled: true,
    connected: true, // true to hide it
  },
  {
    name: 'docs',
    href: 'https://docs.opnames.org',
    label: 'navigation.docs',
    disabled: false,
    connected: false,
  },
  {
    name: 'names',
    href: '/my/names',
    label: 'navigation.names',
    disabled: false,
    connected: true,
    icon: GridSVG,
  },
  {
    name: 'profile',
    href: '/my/profile',
    label: 'navigation.profile',
    disabled: false,
    connected: true,
  },
  {
    name: 'favourites',
    href: '/my/favourites',
    label: 'navigation.favourites',
    disabled: true,
    connected: true,
    icon: HeartSVG,
  },
  {
    name: 'settings',
    href: '/my/settings',
    label: 'navigation.settings',
    disabled: false,
    connected: true,
    icon: CogSVG,
  },
]

export const getRoute = (name: PublicRoute | ConnectedRoute): RouteItemObj =>
  routes.find((route) => route.name === name) as RouteItemObj
