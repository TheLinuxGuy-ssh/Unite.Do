// src/Auth.tsx
import { useState } from "react";
import { Switch } from "@headlessui/react"
import supabase from "../../utils/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  const handleSignIn = async () => {
    setSignInLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    setSignInLoading(false);
  };

  const handleSignUp = async () => {
    setSignUpLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    setSignUpLoading(false);
  };

  return (
    <div>
      <section className="bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-4xl font-semibold text-gray-900 dark:text-white"
          >
            {/* <img className="w-8 h-8 mr-2" src="" alt="logo" /> */}
            Unite.do
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
        placeholder="User@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={signInLoading || signUpLoading}
                    className="bg-gray-50 border border-gray-300 outline-0 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={signInLoading || signUpLoading}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 outline-0 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Switch
      className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
    >
      <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
    </Switch>
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="text-gray-500 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex">
                <button
                onClick={handleSignIn} disabled={signInLoading || signUpLoading}
                  className="w-full flex-1 mr-2 text-white bg-yellow-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {signInLoading ? "Loading..." : "Sign In"}
                </button>
                <button
                  className="w-full flex-1 ml-2 bg-white text-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >{signUpLoading ? "Loading..." : "Sign Up"}</button>
              </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
