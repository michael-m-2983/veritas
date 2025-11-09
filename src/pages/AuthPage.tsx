import { Container, Loader, Title } from "@mantine/core"
import { Auth } from "@supabase/auth-ui-react"
import { backend } from "../main"
import { ThemeSupa } from '@supabase/auth-ui-shared'

export const AuthPage = () => {
    if (backend == null) return <Loader />

    let auth = <Auth 
        supabaseClient={backend.client} 
        appearance={{ theme: ThemeSupa }}
        dark={true}
        theme="dark"

        providers={['github']}
        //TODO: Consider adding more social logins
        // providers={['google', 'facebook', 'github', 'apple', 'discord']}
        // socialLayout="horizontal"
    />

    return <Container size="sm">
        <Title ta="center">Authentication</Title>
        {auth}
    </Container>
}