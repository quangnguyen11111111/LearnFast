import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <Outlet /> {/* nơi render các route con */}
      </main>
      <Footer />
    </div>
  );
}
