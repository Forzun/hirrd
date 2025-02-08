import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container mx-auto font-semibold">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 font-semibold text-center bg-gray-800 mt-10">We Made this To Get You Job</div>
    </div>
  );
};

export default AppLayout;