
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function Home() {
  return (<>
  <h2 className="text-red-500 text-2xl font-bold">'Hello, React Router!'</h2>
  </>)
}
