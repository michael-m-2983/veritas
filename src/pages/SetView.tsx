import { Link, useLoaderData } from "react-router";
import ErrorPopup from "../components/ErrorPopup";
import type { Card, Set } from "../api";
import { ActionIcon, Center, Container, Group, Paper, Space, Text, Title, Tooltip, Transition } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { Auth } from "@supabase/auth-ui-react";
import type { CSSProperties } from "react";
import { useState } from "react";

export default function SetViewPage() {
    let loaderData = useLoaderData();
    let set: Set = loaderData.set;
    const [shareMessage, setShareMessage] = useState<string>("");

    if (set == undefined) return <ErrorPopup message={"This set does not exist!"} />

    return <Container size="lg">
        <Title order={2}>{set.title}</Title>

        <Text size='sm'>{set.description}</Text>

        <Space h={20} />

        <ActionButtons set={set} onShare={() => {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                setShareMessage("Link copied to clipboard.");
            }).catch(() => {
                setShareMessage("Copy failed. Please copy the URL manually.");
            });
        }} />

        {shareMessage ? <Text size="sm" c="dimmed">{shareMessage}</Text> : null}

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
            {(styles: CSSProperties) => <Paper
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

function ActionButtons(props: {set: Set; onShare: () => void}) {
    let user = Auth.useUser();

    return <Group justify="center">
        <ShareIcon onShare={props.onShare} />
        {user.user != null && user.user.id == props.set.user ? <ReviewIcon /> : null}
        {user.user != null && user.user.id == props.set.user ? <EditIcon /> : null}
    </Group>
}

function ShareIcon(props: {onShare: () => void}) {
    return <Tooltip label="Share"><ActionIcon variant="outline" color="rgba(255, 255, 255, 1)" onClick={props.onShare}>
        {/* Heroicons share icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
        </svg>
    </ActionIcon></Tooltip>
}

function ReviewIcon() {
    return <Tooltip label="Review"><ActionIcon variant="outline" color="rgba(255, 255, 255, 1)" component={Link} to="review">
        {/* Heroicons light bulb icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
    </ActionIcon></Tooltip>
}

function EditIcon() {
    return <Tooltip label="Edit"><ActionIcon variant="outline" color="rgba(255, 255, 255, 1)" component={Link} to={`edit`}>
        {/* Heroicons edit icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
    </ActionIcon></Tooltip>
}