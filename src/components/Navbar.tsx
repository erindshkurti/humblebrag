"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import styles from "./Navbar.module.css";
import { auth } from "@/lib/firebase";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className={styles.nav}>
            <div className={styles.content}>
                <Link href="/" className={styles.logo}>
                    HumbleBrag
                </Link>
                <div className={styles.links}>
                    {user ? (
                        <>
                            <Link href="/feed" className={styles.link}>
                                Feed
                            </Link>
                            <Link href="/network" className={styles.link}>
                                Network
                            </Link>
                            <Link href="/profile" className={styles.link}>
                                Profile
                            </Link>
                            <button
                                onClick={() => auth.signOut()}
                                className={styles.button}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className={styles.link}>
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
