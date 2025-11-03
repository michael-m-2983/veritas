import { useEffect, useState } from "react";
import { backend } from "../main";
import { Card, Container, Space, Stack, Text, Title } from "@mantine/core";
import type { SetID } from "../api";
import { Link } from "react-router";

export function HomePage() {
    return <Container size="lg">
        <Title order={2}>Veritas</Title>
        <Text>Flash card application</Text>
        <Space h="lg" />
        
        <Title order={3}>Flashcard Sets</Title>
        <Space h="md" />
        <SetGallery />
    </Container>
}

function SetGallery() {
    const [sets, setSets] = useState<[string, string, SetID][]>([]);

    useEffect(() => {
        backend.listSets().then(setSets);
    }, [setSets]);

    return <Stack>
        {sets.map((set: [string, string, SetID]) => <Card shadow="sm" padding="md" withBorder component={Link} to={`/set/${set[2]}`}>
            <Text fw={700}>{set[0]}</Text>
            <Text>{set[1]}</Text>
        </Card>)}
    </Stack>

}