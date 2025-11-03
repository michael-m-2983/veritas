import { Link, useLoaderData } from "react-router";
import ErrorPopup from "../components/ErrorPopup";
import type { Card, Set } from "../api";
import { ActionIcon, Center, Container, Group, Paper, Space, Text, Title, Transition } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

export default function SetViewPage() {
    let loaderData = useLoaderData();

    let set: Set = loaderData.set;

    if (set == undefined) return <ErrorPopup message={"This set does not exist!"} />

    return <Container size="lg">
        <Group justify="space-between">
            <Title order={2}>{set.title}</Title>
            <ActionIcon variant="subtle" color="gray" component={Link} to={`/set/${set.id}/edit`}>
                {/* Heroicons edit icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </ActionIcon>
        </Group>

        <Text size='sm'>{set.description}</Text>

        <Space h={40} />

        <div style={{ margin: 'auto', width: 600, height: 300, display: 'flex' }}>
            <Carousel withControls height="100%" flex={1} emblaOptions={{ loop: true }}>
                {set.cards.map(card => Flashcard(card))}
            </Carousel>
        </div>
    </Container>
}

function Flashcard(card: Card) {

    const [flipped, { toggle }] = useDisclosure(true);
    const [debouncedFlipValue] = useDebouncedValue(flipped, 200);

    return <Carousel.Slide style={{ position: "relative", left: 0, right: 0, top: 0, bottom: 0 }}>
        <Transition
            mounted={flipped == debouncedFlipValue}
            transition="skew-up"
            duration={200}
            timingFunction="ease"
        >
            {styles => <Paper
                shadow="md"
                withBorder
                p="xl"
                radius="md"
                onClick={toggle}
                style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, ...styles }}
            >
                <Center h="100%">
                    <Text ta="center">{flipped ? card.term : card.definition}</Text>
                </Center>
            </Paper>}
        </Transition>
    </Carousel.Slide>
}