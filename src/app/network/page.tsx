"use client";

import { useAuth } from "@/lib/AuthContext";
import { getAllUsers, addPeer, getUserProfile, UserProfile } from "@/lib/db";
import { useEffect, useState } from "react";
import styles from "./network.module.css";
import { useRouter } from "next/navigation";
import InviteSection from "@/components/InviteSection";

export default function NetworkPage() {
    const { user, loading } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            loadData(user.uid);
        }
    }, [user, loading, router]);

    const loadData = async (uid: string) => {
        const [allUsers, currentProfile] = await Promise.all([
            getAllUsers(),
            getUserProfile(uid),
        ]);
        setUsers(allUsers.filter(u => u.uid !== uid));
        setCurrentUserProfile(currentProfile);
    };

    const handleConnect = async (peerId: string) => {
        if (!user || !currentUserProfile) return;

        try {
            await addPeer(user.uid, peerId);
            // Optimistically update local state
            setCurrentUserProfile(prev => prev ? {
                ...prev,
                peers: [...(prev.peers || []), peerId]
            } : null);
        } catch (error) {
            console.error("Failed to add peer:", error);
            alert("Failed to connect. Please try again.");
        }
    };

    const isConnected = (peerId: string) => {
        return currentUserProfile?.peers?.includes(peerId);
    };

    if (loading || !currentUserProfile) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Your Network</h1>

            <div className={styles.grid}>
                {users.map((otherUser) => (
                    <div key={otherUser.uid} className={styles.card}>
                        <img
                            src={otherUser.photoURL || "https://via.placeholder.com/150"}
                            alt={otherUser.displayName}
                            className={styles.avatar}
                        />
                        <h3 className={styles.name}>{otherUser.displayName}</h3>
                        <p className={styles.headline}>{otherUser.headline || "No headline"}</p>
                        <button
                            className={styles.button}
                            onClick={() => handleConnect(otherUser.uid)}
                            disabled={isConnected(otherUser.uid)}
                        >
                            {isConnected(otherUser.uid) ? "Connected" : "Connect"}
                        </button>
                    </div>
                ))}
            </div>

            <InviteSection />
        </div>
    );
}
