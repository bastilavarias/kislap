import {
    IconBrowserCheck,
    IconHelp,
    IconLayoutDashboard,
    IconNotification,
    IconPalette,
    IconSettings,
    IconTool,
    IconUserCog,
    IconWorld,
} from '@tabler/icons-react'
import {Command} from 'lucide-react'
import {type SidebarData} from '../types'

export const sidebarData: SidebarData = {
    user: {
        name: 'kislap',
        email: 'main.admin@kislap.com',
        avatar: '/avatars/shadcn.jpg',
    },
    teams: [
        {
            name: 'Kislap',
            logo: Command,
            plan: 'Ideas to Online Presence',
        },
    ],
    navGroups: [
        {
            title: 'General',
            items: [
                {
                    title: 'Dashboard',
                    url: '/',
                    icon: IconLayoutDashboard,
                },
                {
                    title: 'Projects',
                    url: '/apps',
                    icon: IconWorld,
                },
            ],
        },
        {
            title: 'Other',
            items: [
                {
                    title: 'Settings',
                    icon: IconSettings,
                    items: [
                        {
                            title: 'Profile',
                            url: '/settings',
                            icon: IconUserCog,
                        },
                        {
                            title: 'Account',
                            url: '/settings/account',
                            icon: IconTool,
                        },
                        {
                            title: 'Appearance',
                            url: '/settings/appearance',
                            icon: IconPalette,
                        },
                        {
                            title: 'Notifications',
                            url: '/settings/notifications',
                            icon: IconNotification,
                        },
                        {
                            title: 'Display',
                            url: '/settings/display',
                            icon: IconBrowserCheck,
                        },
                    ],
                },
                {
                    title: 'Help Center',
                    url: '/help-center',
                    icon: IconHelp,
                },
            ],
        },
    ],
}
