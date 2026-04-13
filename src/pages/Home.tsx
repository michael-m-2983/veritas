import { useEffect, useState } from "react";
import { backend } from "../main";
import { Auth } from "@supabase/auth-ui-react";
import { Card, Center, Container, Loader, Space, Text, Title, Button } from "@mantine/core";
import type { SetID } from "../api";
import { Link } from "react-router";

export function HomePage() {
    const user = Auth.useUser();

    return <Container size="lg" py="lg">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem" }}>
            <div>
                <Title order={2}>Veritas</Title>
                <Text c="dimmed">Flash card application</Text>
            </div>
        </div>

        <Space h="md" />

        <Title order={3}>{user.user ? "Your flashcard sets" : "Welcome"}</Title>
        <SetGallery />
    </Container>;
}

function SetGallery() {
    const user = Auth.useUser();
    const [sets, setSets] = useState<[string, string, SetID][]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user.user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        backend.listSets()
            .then(setSets)
            .catch((err) => setError(err?.message ?? "Unable to load your sets."))
            .finally(() => setLoading(false));
    }, [user.user?.id]);

    if (!user.user) {
        return <Center>
            <div style={{ textAlign: "center" }}>
                <Text c="dimmed">Sign in to view and manage your sets.</Text>
                <Space h="sm" />
                <Button component={Link} to="/auth">Sign in</Button>
            </div>
        </Center>;
    }

    if (loading) return <Center><Loader /></Center>;
    if (error) return <Center><Text c="red">{error}</Text></Center>;
    if (sets.length == 0) return <Center><Text c="dimmed">No sets yet. Create one using the button in the header.</Text></Center>;

    return <div style={{ display: "grid", gap: "1rem" }}>
        {sets.map((set: [string, string, SetID]) => <Card key={set[2]} shadow="sm" padding="md" withBorder component={Link} to={`/set/${set[2]}`}>
            <Text fw={700}>{set[0]}</Text>
            <Text c="dimmed">{set[1]}</Text>
        </Card>)}
    </div>;
}
