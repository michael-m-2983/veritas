import { ActionIcon, AppShell, Burger, Button, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import SetCreator from "./components/SetCreator";
import { Outlet } from "react-router";

export default function Layout() {
    const [opened, { toggle }] = useDisclosure();
    return <AppShell
        padding="md"
        header={{
            height: 60
        }}
        navbar={{
            width: 200,
            breakpoint: 'sm',
            collapsed: {
                mobile: !opened
            }
        }}>
        <AppShell.Header>
            <Group justify="space-between" px="md" h="100%">
                <Group>
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    Veritas
                </Group>

                <ActionIcon variant="subtle" color="gray" onClick={() => modals.open({
                    children: <SetCreator />,
                    title: "Create New Set"
                })}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </ActionIcon>
            </Group>

        </AppShell.Header>
        <AppShell.Navbar p="md">
            <Stack>
                <Button>Home</Button>
                <Button>My sets</Button>
            </Stack>
        </AppShell.Navbar>
        <AppShell.Main>
            <Outlet />
        </AppShell.Main>
    </AppShell>
}