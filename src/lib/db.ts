import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, orderBy, getDocs, limit, where, arrayUnion } from "firebase/firestore";
import { User } from "firebase/auth";

export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    headline?: string;
    bio?: string;
    peers?: string[]; // array of uids
}

export const createUserProfile = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const newProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
            headline: "New Member",
            bio: "",
            peers: [],
        };
        await setDoc(userRef, newProfile);
        return newProfile;
    }
    return userSnap.data() as UserProfile;
};

export const getUserProfile = async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
    }
    return null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
};

export interface Post {
    id: string;
    authorId: string;
    authorName: string;
    authorPhoto: string;
    content: string;
    createdAt: number;
}

export const createPost = async (user: UserProfile, content: string) => {
    const postsRef = collection(db, "posts");
    await addDoc(postsRef, {
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        content,
        createdAt: Date.now(),
    });
};

export const getPosts = async () => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
};


export const getAllUsers = async () => {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => doc.data() as UserProfile);
};

export const addPeer = async (currentUid: string, peerUid: string) => {
    const currentUserRef = doc(db, "users", currentUid);
    await updateDoc(currentUserRef, {
        peers: arrayUnion(peerUid)
    });
};
