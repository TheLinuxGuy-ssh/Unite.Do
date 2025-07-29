import { useState, useEffect } from 'react';
import "./App.css"
import * as comp from "./components";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import supabase from '../utils/supabase';
import type { Session } from '@supabase/supabase-js';

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
    return (
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
    );
  }

  return (
    <>
      <comp.Topbar session={session} />
      <div className="flex">
        <comp.Sidebar />
        <comp.Dashboard />
      </div>
    </>
  );
};

export default App;
