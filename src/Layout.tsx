import { ActionIcon, AppShell, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import SetCreator from "./components/SetCreator";
import { Link, Outlet } from "react-router";

export default function Layout() {
    return <AppShell
        padding="md"
        header={{
            height: 60
        }}
    >
        <AppShell.Header>
            <Group justify="space-between" px="md" h="100%">
                <Text component={Link} to="/" fw={500}>
                    Veritas
                </Text>

                <ActionIcon variant="subtle" color="rgba(255, 255, 255, 1)" onClick={() => modals.open({
                    children: <SetCreator />,
                    title: "Create New Set",
                    id: "create-new-set"
                })}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </ActionIcon>
            </Group>

        </AppShell.Header>
        <AppShell.Main>
            <Outlet />
        </AppShell.Main>
    </AppShell>
}