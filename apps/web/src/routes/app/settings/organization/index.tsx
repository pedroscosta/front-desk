import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/settings/organization/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/settings/organization/"!</div>
}
