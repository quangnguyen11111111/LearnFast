import { Link } from "react-router";


export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/profile">Profile</Link>
    </header>
  );
}
