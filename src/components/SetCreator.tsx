import { Button, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { backend } from "../main";
import { modals } from "@mantine/modals";

export default function SetCreator() {

    const [name, setName] = useState<string>("");

    const create = () => {
        backend.createSet(name).then((setId) => {
            modals.closeAll();

            window.location.href = `/veritas/#/set/${setId}/edit`;
        });
    };

    return <Stack>
        <TextInput label="Set Name" value={name} onChange={(e) => setName(e.currentTarget.value)} />
        <Button onClick={create}>Create</Button>
    </Stack>
}