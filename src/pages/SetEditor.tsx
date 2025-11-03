import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { backend } from "../main";
import type { Set, SetID } from "../api";
import ErrorPopup from "../components/ErrorPopup";
import { ActionIcon, Button, Center, Container, Group, Loader, Paper, Space, Text, Textarea, TextInput, Title } from "@mantine/core";

export default function SetEditorPage() {
    let setId: SetID | undefined = useParams().setId;

    // Maintain the state of local changes to the set
    const [set, setSet] = useState<Set | undefined>(undefined);
    let navigate = useNavigate();

    if (setId == undefined) return <ErrorPopup message="Set does not exist!" />


    useEffect(() => {
        backend.readSet(setId).then((value) => {
            if (value != undefined) {
                setSet(value);
            }
        });
    }, [setId]);

    if (set == undefined) return <Loader />

    return <Container size="lg">
        <Group justify="space-between">
            <Title order={2}>Editing Set</Title>
            <ActionIcon variant="subtle" color="gray" component={Link} to={`/set/${setId}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </ActionIcon>
        </Group>


        <TextInput label="Set Title" value={set.title} onChange={(event) => setSet({ ...set, title: event.currentTarget.value })} />

        <Textarea label="Set Description" value={set.description} onChange={(event) => setSet({ ...set, description: event.currentTarget.value })} />

        <Space h="lg" />

        {set.cards.map((card, index1) => <Paper shadow="md"
            withBorder
            p="sm"
            radius="md"
            mb="md">

            <Group justify="space-between">
                <Text fw={700}>Term #{index1 + 1}</Text>


                <ActionIcon variant="subtle" color="gray" onClick={() => setSet({ ...set, cards: set.cards.filter((_value, index2) => index1 != index2) })}>
                    {/* https://heroicons.com/ trash icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </ActionIcon>
            </Group>

            <TextInput label="Term" value={card.term} onChange={(e) => setSet({
                ...set, cards: set.cards.map((card, index2) => {
                    if (index1 == index2) return { ...card, term: e.currentTarget.value }
                    return card
                })
            })} />
            <TextInput label="Definition" value={card.definition} onChange={(e) => setSet({
                ...set, cards: set.cards.map((card, index2) => {
                    if (index1 == index2) return { ...card, definition: e.currentTarget.value }
                    return card
                })
            })} />
        </Paper>)}

        <Center>
            <Button onClick={() => setSet({ ...set, cards: set.cards.concat([{ term: "", definition: "" }]) })}>
                Add term
            </Button>
        </Center>

        <Button onClick={() => {
            backend.updateSet(set).then(() => navigate(`/set/${setId}`))
        }}>Save</Button>
    </Container>
}
