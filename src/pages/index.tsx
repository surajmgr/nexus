import React, { JSX } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="hero-banner">
      <div className="container">
        <Heading as="h1" className="hero-title">
          Suraj Pulami <span>Nexus</span>
        </Heading>
        <p className="hero-subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/projects/adding-projects"
            style={{ marginLeft: '1rem' }}>
            Add Project
          </Link>
        </div>
      </div>
    </header>
  );
}

function BentoCard({ title, description, to, icon, className, arrow = true }: {
  title: string;
  description: string;
  to: string;
  icon?: React.ReactNode;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Link to={to} className={clsx('bento-card', className)}>
      {icon && <div className="bento-icon">
        {icon}
      </div>}
      <h3 className="bento-title">{title}</h3>
      <p className="bento-desc">{description}</p>
      {arrow && (
        <div className="bento-arrow">
          Explore <span style={{ fontSize: '1em', lineHeight: 1 }}>→</span>
        </div>
      )}
    </Link>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Centralized documentation hub for all projects">
      <HomepageHeader />
      <main>
        <div className="container margin-bottom--xl">
          <div className="bento-grid">
            {/* Main Guide - Large Card */}
            <BentoCard
              className="bento-card--large"
              title="Nexus Guide"
              description="Everything you need to know about navigating, writing, and maintaining documentation in this hub. Learn about our standards and best practices."
              to="/docs/intro"
            />

            {/* Versioning - Standard Card */}
            <BentoCard
              title="Versioning"
              description="Learn how to manage multiple versions of your documentation."
              to="/docs/versioning"
            />

            {/* FortiHub - Tall Card */}
            <BentoCard
              className="bento-card"
              title="FortiHub"
              description="Complete documentation for FortiHub. Includes API references, integration guides, and tutorials."
              to="/fortihub/intro"
            />

            {/* Add Project - Standard Card */}
            <BentoCard
              title="Add New Project"
              description="Step-by-step guide to add another project in this nexus."
              to="/docs/projects/adding-projects"
            />

            {/* Blog - Standard Card */}
            <BentoCard
              title="Updates & Blog"
              description="Stay updated with the latest changes and announcements."
              to="/blog"
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}
