import { useState } from "react";
import { Switch } from "@headlessui/react";
import supabase from "../../utils/supabase";

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) setError(error.message);
        setLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
        else
            setError(
                "Success! Please check your email to verify your account."
            );
        setLoading(false);
    };

    return (
        <div className="min-h-screen dots-log flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full mt-5 bg-white rounded-4xl shadow-lg dark:bg-gray-900/90">
                <div className="p-8">
                    <div className="mb-6 text-center">
                        <a
                            href="#"
                            className="text-yellow-500 text-3xl flex items-center justify-center font-extrabold"
                        >
                            <img src="./logo.png" className="w-15 mr-5" alt="" />
                            Unite.Do
                        </a>
                        <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                            {isSignIn
                                ? "Sign in to your account"
                                : "Create your account"}
                        </h2>
                        {error && (
                            <p
                                className={`mt-2 text-sm ${error.startsWith("Success")
                                        ? "text-green-500"
                                        : "text-red-500"
                                    }`}
                                role="alert"
                            >
                                {error}
                            </p>
                        )}
                    </div>

                    <form
                        onSubmit={isSignIn ? handleSignIn : handleSignUp}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <span className="text-white font-semibold text-lg text-center">
                                Demo Credentials, Or Sign Up!
                            </span>
                            <div className="creds my-3 text-white">
                                <b>Email:</b> microsoft@taskwhirl.com<br />
                                <b>Password:</b> 1122
                            </div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="user@example.com"
                                value={email}
                                disabled={loading}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                value={password}
                                disabled={loading}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <Switch
                                    checked={rememberMe}
                                    onChange={setRememberMe}
                                    className={`${rememberMe
                                            ? "bg-yellow-500"
                                            : "bg-gray-200"
                                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                                >
                                    <span
                                        className={`${rememberMe
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                    />
                                </Switch>
                                <span className="ml-3 text-sm text-gray-900 dark:text-gray-300 select-none">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1"
                        >
                            {loading
                                ? "Loading..."
                                : isSignIn
                                    ? "Sign In"
                                    : "Sign Up"}
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-400">
                        {isSignIn
                            ? "Don't have an account? "
                            : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignIn(!isSignIn);
                                setError(null);
                            }}
                            className="font-semibold text-yellow-400 hover:text-yellow-300 focus:outline-none"
                        >
                            {isSignIn ? "Sign up" : "Sign in"}
                        </button>
                    </p>

                </div>
            </div>
        </div>
    );
}
