import React, { JSX } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Home"
      description="Personal documentation hub and portfolio of Suraj Pulami">
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Hello, I'm Suraj <span className={styles.wave}>ツ</span>
          </h1>
          <img src="/authors/surajmgr.png" alt="Suraj Pulami" className={styles.profileImage} />
        </header>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About me</h2>
          <p className={styles.text}>
            I am a software engineer passionate about building scalable systems and writing clear documentation.
            This site serves as my personal knowledge base, where I document my <Link to="/docs/projects" className={styles.link}>projects</Link>.
          </p>
          <p className={styles.text}>
            I am currently working as a Full Stack Developer at <Link to="https://www.linkedin.com/company/sewaverse-official" className={styles.link}>Sewaverse Enterprise</Link>. Here, I am responsible for designing and developing the platform’s core features and API. Before this, I interned at <Link to="https://www.linkedin.com/company/onepointfinserv/" className={styles.link}>OnePoint Financial Services Pvt. Ltd.</Link> as a Golang Developer. I was also part of the QA team responsible for ensuring the functionality of the Laxmi Bank project.
          </p>
          <p className={styles.text}>
            As for my education, I graduated from Tribhuvan University with a Bachelor's degree in Computer Science and Information Technology.
          </p>
          <p className={styles.text}>
            Besides these, I have a strong interest in stories such as novels, manga, and manhwa. I also enjoy reading about history and science.
            In my free time, I enjoy exploring new technologies, especially services that cost little to nothing.
          </p>
        </section>
      </main>
    </Layout>
  );
}
