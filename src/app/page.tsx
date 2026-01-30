import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.heroContent}>
        <div className={styles.textContent}>
          <h1 className={styles.title}>
            For the achievements you <br />
            <i>totally</i> didn't want to bring up.
          </h1>
          <p className={styles.subtitle}>
            The professional network for subtle flexes, accidental success,
            and "honored to announce" moments.
          </p>
          <Link href="/login" className={styles.button}>
            Join the Circle
          </Link>
        </div>

        <div className={styles.imageContainer}>
          <img
            src="/hero.png"
            alt="A tiny trophy casting a superhero shadow"
            className={styles.heroImage}
          />
        </div>
      </div>
    </main>
  );
}
