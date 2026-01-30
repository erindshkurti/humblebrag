"use client";

import { useAuth } from "@/lib/AuthContext";
import { createPost, getPosts, getUserProfile, Post, UserProfile } from "@/lib/db";
import { useEffect, useState } from "react";
import styles from "./feed.module.css";
import { useRouter } from "next/navigation";

export default function FeedPage() {
    const { user, loading } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [content, setContent] = useState("");
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            getUserProfile(user.uid).then(setUserProfile);
            loadPosts();
        }
    }, [user, loading, router]);

    const loadPosts = async () => {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
    };

    const handlePost = async () => {
        if (!content.trim() || !userProfile) return;
        setSubmitting(true);
        await createPost(userProfile, content);
        setContent("");
        setSubmitting(false);
        loadPosts();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            {userProfile && (
                <div className={styles.createPost}>
                    <textarea
                        className={styles.textarea}
                        placeholder="What's specifically okay with you today?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button
                        className={styles.button}
                        onClick={handlePost}
                        disabled={!content.trim() || submitting}
                    >
                        {submitting ? "Posting..." : "Post"}
                    </button>
                    <div style={{ clear: "both" }}></div>
                </div>
            )}

            <div className={styles.feed}>
                {posts.map((post) => (
                    <div key={post.id} className={styles.post}>
                        <div className={styles.postHeader}>
                            <img src={post.authorPhoto} alt={post.authorName} className={styles.avatar} />
                            <div>
                                <div className={styles.authorName}>{post.authorName}</div>
                                <div className={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className={styles.content}>{post.content}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
