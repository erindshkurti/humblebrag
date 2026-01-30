"use client";

import { useAuth } from "@/lib/AuthContext";
import { createUserProfile, getUserProfile, updateUserProfile, UserProfile } from "@/lib/db";
import { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [headline, setHeadline] = useState("");
    const [bio, setBio] = useState("");
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }

        if (user) {
            // Ensure profile exists or fetch it
            createUserProfile(user).then((p) => {
                setProfile(p);
                setHeadline(p.headline || "");
                setBio(p.bio || "");
            });
        }
    }, [user, loading, router]);

    const handleSave = async () => {
        if (!user || !profile) return;
        setSaving(true);
        await updateUserProfile(user.uid, { headline, bio });
        setSaving(false);
        alert("Profile updated!");
    };

    if (loading || !profile) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img src={profile.photoURL} alt={profile.displayName} className={styles.avatar} />
                <div className={styles.info}>
                    <h1 className={styles.name}>{profile.displayName}</h1>
                    <p className={styles.headline}>{headline}</p>
                </div>
            </div>

            <div className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label}>Headline</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. Software Engineer at Tech Corp"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Bio</label>
                    <textarea
                        className={styles.textarea}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                    />
                </div>

                <button className={styles.button} onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Profile"}
                </button>
            </div>
        </div>
    );
}
