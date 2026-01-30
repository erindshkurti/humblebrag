"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push("/feed");
        } catch (err: any) {
            console.error(err);
            setError("Failed to sign in. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Sign in with Google</h1>
                <button onClick={handleGoogleSignIn} className={styles.button}>
                    Continue with Google
                </button>
                {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
            </div>
        </div>
    );
}
