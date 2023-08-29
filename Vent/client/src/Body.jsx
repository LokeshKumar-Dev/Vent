import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import AllVents from "./pages/AllVents";
import Lists from "./pages/Lists";
import Dashboard from "./pages/Dashboard";
import NoPage from "./pages/NoPage";

import { useVent } from "./Context";

export default function Body() {
  const { SidebarCtx } = useVent();
  const { sidebar } = SidebarCtx;

  const history = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (window.location.pathname !== "/") {
        history("/");
      }
    };

    window.addEventListener("unload", handleBeforeUnload);

    return () => {
      window.removeEventListener("unload", handleBeforeUnload);
    };
  }, [history]);

  return (
    <>
      <section
        className="content"
        style={{
          flex: sidebar.show
            ? `${100 - sidebar.width}%`
            : sidebar.show2
            ? `${100 - sidebar.width2}%`
            : "100%",
        }}
      >
        <Routes>
          <Route path="/" element={<AllVents />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} /> */}

          <Route path="*" element={<NoPage />} />
        </Routes>
      </section>
      <div
        className="sidebar--template"
        style={{
          flex: sidebar.show ? `${sidebar.width}%` : "0",
        }}
      ></div>
      <div
        className="sidebar--template"
        style={{
          flex: sidebar.show2 ? `${sidebar.width2}%` : "0",
        }}
      ></div>
    </>
  );
}
