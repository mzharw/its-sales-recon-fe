import {
    IconBox, IconChartBar,
    IconLogout,
    IconReportAnalytics,
    IconUsersGroup
} from "@tabler/icons-react";
import {useState} from "react";
import {NavLink} from "@mantine/core";
import Link from "next/link";
import {useRouter} from "next/router";
import {usePathname} from "next/navigation";

const data = [
    {link: '/', label: 'Dashboard', icon: IconChartBar},
    {link: '/barang', label: 'Barang', icon: IconBox},
    {link: '/customer', label: 'Customer', icon: IconUsersGroup},
    {link: '/transaksi', label: 'Transaksi', icon: IconReportAnalytics},
];

export default function Navbar() {
    const pathname = usePathname()
    const links = data.map((item) => (
        <NavLink
            component={Link}
            data-active={item.link === pathname || undefined}
            href={item.link}
            key={item.label}
            leftSection={<item.icon size={20} strokeWidth={1}/>}
            label={item.label}
        />
    ));

    return (
        <nav>
            <div>
                {links}
            </div>
            <div className={'overflow-hidden absolute bottom-10 w-full pr-8 text-center font-light'}>
                <small>
                    &copy;2024 Muhammad Azhari W
                    <p><b>mazhariwirasena@gmail.com</b></p>
                </small>

            </div>
        </nav>
    )
}