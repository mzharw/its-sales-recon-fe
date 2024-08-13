'use client';

import {AppShell, Burger} from "@mantine/core";
import Navbar from "@/components/Navbar";
import {useDisclosure} from "@mantine/hooks";
import {ReactNode} from "react";

export default function Layout({children}: Readonly<{ children: ReactNode; }>) {
    const [opened, {toggle}] = useDisclosure();

    return (
        <AppShell
            header={{height: 60}}
            navbar={{
                width: 250,
                breakpoint: 'sm',
                collapsed: {mobile: !opened},
            }}
            padding="md"
        >
            <AppShell.Header className={'flex items-center px-4 gap-3'}>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />
                <div>
                    <small>MST</small>
                    <h1 className={'font-bold'}>SalesRecon</h1>
                </div>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Navbar/>
            </AppShell.Navbar>

            <AppShell.Main className={'h-screen'}>{children}</AppShell.Main>
        </AppShell>
    );
}