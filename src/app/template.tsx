'use client';
import {AppShell, Burger} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import Navbar from "@/app/components/Navbar";

export default function Template({children,}: Readonly<{ children: React.ReactNode; }>) {
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

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}