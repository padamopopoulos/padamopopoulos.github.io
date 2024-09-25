// components/SignInButton.js
import { signIn } from "next-auth/react";

export default function SignInButton() {
    return (
        <button onClick={() => signIn("apple")}>
            Sign in with Apple
        </button>
    );
}
