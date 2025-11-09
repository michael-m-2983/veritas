import { ActionIcon, AppShell, Button, Group, HoverCard, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import SetCreator from "./components/SetCreator";
import { Link, Outlet } from "react-router";
import { Auth } from "@supabase/auth-ui-react";
import { backend } from "./main";

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

                <MenuItems />
            </Group>

        </AppShell.Header>
        <AppShell.Main>
            <Outlet />
        </AppShell.Main>
    </AppShell>
}

/**
 * The actionable buttons in the top right
 */
function MenuItems() {

    const user = Auth.useUser();


    if(user.user == null) {
        return <Button component={Link} to="/auth">Sign in</Button>
    }

    
    
    let createButton = <ActionIcon variant="subtle" color="rgba(255, 255, 255, 1)" onClick={() => modals.open({
        children: <SetCreator />,
        title: "Create New Set",
        id: "create-new-set"
    })}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    </ActionIcon>

    let userDisplay = <HoverCard>
        <HoverCard.Target>
            <p>{user.user.id.split("-")[0]}</p>
        </HoverCard.Target>
        <HoverCard.Dropdown>
            <Stack>
                <Button onClick={() => {
                    backend.client.auth.signOut();
                }}>Logout</Button>
            </Stack>
        </HoverCard.Dropdown>
    </HoverCard>

    return <Group>
        {createButton}
        {userDisplay}
    </Group>
}