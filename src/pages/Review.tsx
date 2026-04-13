import { Button, Loader, Paper, SimpleGrid, Stack, Table, Text, Title } from "@mantine/core"
import { Link, Outlet, useParams } from "react-router"
import type { Set, SetID } from "../api";
import { useEffect, useMemo, useState } from "react";
import { backend } from "../main";

interface ReviewMethod {
    name: string;
    description: string;
    path: string;
    component: React.ComponentType;
}

export const reviewMethods: ReviewMethod[] = [
    {
        name: "Table",
        description: "View all terms and definitions in a table layout",
        path: "table",
        component: ReviewTable
    },
    {
        name: "Matching",
        description: "Pair each term with its correct definition",
        path: "matching",
        component: ReviewMatching
    },
    {
        name: "MCQ",
        description: "Choose the correct definition for each term",
        path: "mcq",
        component: ReviewMcq
    }
];

function useCurrentSet() {
    let setId: SetID | undefined = useParams().setId;

    const [set, setSet] = useState<Set | undefined>(undefined);

    if(setId == undefined) throw new Error("Set does not exist!");

    useEffect(() => {
        backend.readSet(setId).then((value) => {
            if (value != undefined) {
                setSet(value);
            }
        });
    }, [setId]);

    return set;
}

// This layout is applied to all review methods
export function ReviewLayout() {
    let set: Set | undefined = useCurrentSet();

    if(set == undefined) return <Loader />


    return <Stack>
        <Title order={2}>{set.title}</Title>
        <Outlet />
    </Stack>
}

// This is displayed on the index route. It shows the user a list of review options.
export function ReviewMenu() {
    return <SimpleGrid cols={2}>
        {reviewMethods.map(reviewMethod => <Paper shadow="xs" p="md" radius="md" withBorder component={Link} to={reviewMethod.path}>
            <Text fw="bold" c="white">{reviewMethod.name}</Text>
            <Text c="white">{reviewMethod.description}</Text>
        </Paper>)}
    </SimpleGrid>
}

// Displays a table of terms and definitions
export function ReviewTable() {

    let set = useCurrentSet();
    if(set == undefined) return <Loader />

    return <Table>
        <Table.Thead>
            <Table.Tr>
                {['Term', 'Definition'].map(field => <Table.Th key={field}>{field}</Table.Th>)}
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {set.cards.map((card, index) => <Table.Tr key={index}>
                <Table.Td>{card.term}</Table.Td>
                <Table.Td>{card.definition}</Table.Td>
            </Table.Tr>)}
        </Table.Tbody>
    </Table>
}

function shuffle<T>(items: T[]) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export function ReviewMatching() {
    let set = useCurrentSet();
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [checked, setChecked] = useState(false);
    const definitions = useMemo(() => set ? shuffle(set.cards.map(card => card.definition)) : [], [set]);

    if (set == undefined) return <Loader />

    const score = set.cards.reduce((count, card, index) => count + (answers[index] === card.definition ? 1 : 0), 0);

    return <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Text c="dimmed">Match each term with the correct definition, then check your answers.</Text>
        {set.cards.map((card, index) => <div key={index} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Text fw={600}>{card.term}</Text>
            <select value={answers[index] ?? ""} onChange={(event) => setAnswers({ ...answers, [index]: event.target.value })} style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #555" }}>
                <option value="">Select definition</option>
                {definitions.map((definition, optionIndex) => <option key={`${definition}-${optionIndex}`} value={definition}>{definition}</option>)}
            </select>
            {checked ? <Text c={answers[index] === card.definition ? "green" : "red"} size="sm">
                {answers[index] === card.definition ? "Correct" : `Correct: ${card.definition}`}
            </Text> : null}
        </div>)}
        <Button onClick={() => setChecked(true)}>Check answers</Button>
        {checked ? <Text size="sm">Score: {score}/{set.cards.length}</Text> : null}
    </div>
}

export function ReviewMcq() {
    let set = useCurrentSet();
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const questions = useMemo(() => {
        if (!set) return [];
        const definitions = set.cards.map(card => card.definition);
        return shuffle(set.cards.map(card => {
            const otherAnswers = shuffle(definitions.filter(def => def !== card.definition)).slice(0, 3);
            const options = shuffle([...otherAnswers, card.definition]);
            return { term: card.term, correct: card.definition, options };
        }));
    }, [set]);

    if (set == undefined) return <Loader />
    if (questions.length === 0) return <Text c="dimmed">Not enough cards for MCQ review.</Text>

    const question = questions[index];
    const handleSubmit = () => {
        if (!selected) return;
        if (selected === question.correct) setScore(score + 1);
        if (index + 1 >= questions.length) {
            setFinished(true);
            return;
        }
        setIndex(index + 1);
        setSelected(null);
    };

    return <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Text c="dimmed">Choose the best definition for each term.</Text>
        {finished ? <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Text fw={600}>Finished!</Text>
            <Text>Score: {score}/{questions.length}</Text>
            <Button onClick={() => {
                setIndex(0);
                setScore(0);
                setSelected(null);
                setFinished(false);
            }}>Try again</Button>
        </div> : <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Text fw={600}>{question.term}</Text>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {question.options.map((option, optionIndex) => <Button key={optionIndex} variant={selected === option ? "filled" : "outline"} onClick={() => setSelected(option)}>{option}</Button>)}
            </div>
            <Button disabled={!selected} onClick={handleSubmit}>Submit</Button>
            <Text size="sm">Question {index + 1} of {questions.length}</Text>
        </div>}
    </div>;
}
