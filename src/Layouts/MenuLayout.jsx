import { Outlet } from "react-router-dom";
import { MenuHeader } from "../components/Header/MenuHeader.jsx";
import { Footer } from "../components/Footer/Footer.jsx";

export function MenuLayout() {
  return (
    <div className="content">
      <MenuHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
