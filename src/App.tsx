import { useState, useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import "./App.css";
import * as comp from "./components";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../utils/supabase";
import type { Session } from "@supabase/supabase-js";

const App = () => {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    if (!session) {
        return <comp.Auth></comp.Auth>;
    }

    return (
        <>
        <SpeedInsights />
            <comp.Topbar session={session} />
            <div className="flex  h-full">
                <comp.Sidebar />
                <Routes>
                    <Route path="/" Component={comp.Dashboard} />
                    <Route path="/tasks" Component={comp.Tasks} />
                    <Route path="/tags" Component={comp.Tags} />
                    <Route path="/projects" Component={comp.Projects} />
                    <Route
                        path="/project/:projectId"
                        Component={comp.Project}
                    />
                    <Route path="/team" Component={comp.Team} />
                    <Route path="/settings" Component={comp.Settings} />
                </Routes>
            </div>
        </>
    );
};

export default App;
