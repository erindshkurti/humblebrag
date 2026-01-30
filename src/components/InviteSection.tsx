"use client";

import { useState } from "react";
import styles from "./InviteSection.module.css";

export default function InviteSection() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("Join me on HumbleBrag! https://humblebrag.app");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.heading}>Invite Peers</h3>
            <p className={styles.text}>Grow your professional network by inviting colleagues.</p>
            <div className={styles.actions}>
                <button className={styles.button} onClick={handleCopy}>
                    {copied ? "Copied!" : "Copy Invite Link"}
                </button>
                <a
                    href="mailto:?subject=Join me on HumbleBrag&body=I'd like to invite you to join my network on HumbleBrag: https://humblebrag.app"
                    className={styles.linkButton}
                >
                    Send Email
                </a>
            </div>
        </div>
    );
}
