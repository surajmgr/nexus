import React, { useState, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css'; // Just in case, but using standard utils mainly

interface CollapsibleProps {
    title: string | ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export const Collapsible = ({ title, children, defaultOpen = true, className }: CollapsibleProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={clsx('card shadow--md', className)} style={{ border: '1px solid var(--ifm-color-emphasis-200)', marginBottom: '1rem' }}>
            <div
                className="card__header"
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div style={{ flex: 1 }}>{title}</div>
                <button
                    className="button button--secondary button--sm"
                    style={{
                        border: 'none',
                        background: 'transparent',
                        padding: '0.2rem 0.5rem',
                        transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform 0.2s ease',
                    }}
                >
                    ▼
                </button>
            </div>
            {isOpen && <div className="card__body">{children}</div>}
        </div>
    );
};
