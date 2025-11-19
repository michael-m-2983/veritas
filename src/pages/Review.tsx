import { Loader, Paper, SimpleGrid, Stack, Table, Text, Title } from "@mantine/core"
import { Link, Outlet, useParams } from "react-router"
import type { Set, SetID } from "../api";
import { useEffect, useState } from "react";
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
        description: "View all terms and descriptions in a table layout",
        path: "table",
        component: ReviewTable
    },
    // {
    //     name: "Matching",
    //     description: "Match terms and definitions",
    //     path: "matching",
    //     component: ReviewMatching
    // }
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
                {["Term", "Definition"].map(field => <Table.Th>{field}</Table.Th>)}
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {set.cards.map(card => <Table.Tr>
                <Table.Td>{card.term}</Table.Td>
                <Table.Td>{card.definition}</Table.Td>
            </Table.Tr>)}
        </Table.Tbody>
    </Table>
}

// export function ReviewMatching() {
//     return <p>TODO: This allows the user to do matching</p>
// }