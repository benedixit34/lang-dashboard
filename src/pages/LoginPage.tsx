import { useState, type FormEvent } from "react";

// Point this at wherever the leximatch-api server is running.
// In production, use an environment variable instead.
const API_BASE_URL = "http://localhost:4000";

interface User {
  id?: number | string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface LoginPageProps {
  onSuccess?: (result: LoginResponse) => void;
  onSwitchToSignup?: () => void;
}

export default function LoginPage({
  onSuccess,
  onSwitchToSignup,
}: LoginPageProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Enter an email and password to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const body = (await res.json().catch(() => null)) as
        | LoginResponse
        | { error?: string }
        | null;

      if (!res.ok) {
        const message =
          body && "error" in body && body.error
            ? body.error
            : "Invalid email or password.";

        throw new Error(message);
      }

      if (!body || !("user" in body) || !("token" in body)) {
        throw new Error("Invalid response from the server.");
      }

      onSuccess?.(body);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-neutral-50 px-4 font-sans">
      <div className="w-full max-w-[360px]">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-neutral-950 text-[15px] font-bold text-white">
            L
          </div>

          <h1 className="mt-4 text-[17px] font-semibold tracking-tight text-neutral-900">
            Log in to LexiMatch
          </h1>

          <p className="mt-1 text-[13px] text-neutral-500">
            German A1 admin dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-neutral-600">
              Email
            </span>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@leximatch.app"
              autoComplete="username"
              className="w-full rounded-md border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-[12px] font-medium text-neutral-600">
              Password
            </span>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-md border border-neutral-200 px-3 py-2 text-[13px] text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-100"
            />
          </label>

          {error && (
            <p className="mt-3 text-[12px] font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-md bg-neutral-900 px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>

        <p className="mt-4 text-center text-[12px] text-neutral-500">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-700"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}