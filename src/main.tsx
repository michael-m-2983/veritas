import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import Layout from './Layout.tsx';

import { createHashRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { SupabaseBackend, type SetID } from './api.ts';
import SetViewPage from './pages/SetView.tsx';
import SetEditorPage from './pages/SetEditor.tsx';
import { HomePage } from './pages/Home.tsx';

import { shadcnTheme } from './theme/theme.ts';
import { shadcnCssVariableResolver } from './theme/cssVariableResolver.ts';
import "./theme/style.css"

import { AuthPage } from './pages/AuthPage.tsx';
import { Auth } from '@supabase/auth-ui-react';

export const backend = new SupabaseBackend();

const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: HomePage
      },
      {
        path: "auth",
        Component: AuthPage
      },
      {
        path: "set/:setId",
        children: [
          {
            index: true,
            loader: async ({ params }) => {
              let set = await backend.readSet(params.setId as SetID);

              return { set: set };
            },
            Component: SetViewPage
          },
          {
            path: "edit",
            Component: SetEditorPage
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={shadcnTheme} cssVariablesResolver={shadcnCssVariableResolver}>
      <ModalsProvider>
        <Auth.UserContextProvider supabaseClient={backend.client}>
          <RouterProvider router={router} />
        </Auth.UserContextProvider>
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>,
)
