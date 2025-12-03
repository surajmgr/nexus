import React, { JSX } from 'react';
import Layout from '@theme/Layout';
import Feedback from '@site/src/components/canny/Feedback';
import styles from './feedback.module.css';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function Home(): JSX.Element {
    return (
        <BrowserOnly fallback={<div>Loading...</div>}>
            {() => (
                <Layout
                    title="Feedback"
                    description="Share your ideas, report bugs, and vote on features for my projects. Your feedback helps me to improve the projects.">
                    <main>
                        <div className={styles.widgetContainer}>
                            <div className="container">
                                <Feedback />
                            </div>
                        </div>
                    </main>
                </Layout>
            )}
        </BrowserOnly>
    );
}
