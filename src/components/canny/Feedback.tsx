import React, { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        Canny: (action: string, options?: CannyOptions) => void;
    }
}

interface CannyOptions {
    boardToken: string;
    basePath?: string;
    ssoToken?: string;
    theme?: "dark" | "light";
}

const BoardToken = '362f9d3c-d201-d4c3-d4d3-d46c7b3e70b9';

const Feedback = () => {
    const sdkLoaded = useRef(false);

    const [theme, setTheme] = useState<"dark" | "light">(
        document.documentElement.getAttribute("data-theme") === "dark"
            ? "dark"
            : "light"
    );

    useEffect(() => {
        if (sdkLoaded.current) return;

        (function (w, d, id) {
            if (d.getElementById(id)) return;

            const script = d.createElement("script");
            script.id = id;
            script.src = "https://canny.io/sdk.js";
            script.async = true;
            d.body.appendChild(script);

            w.Canny =
                w.Canny ||
                function () {
                    (w.Canny as any).q = (w.Canny as any).q || [];
                    (w.Canny as any).q.push(arguments);
                };
        })(window, document, "canny-sdk");

        sdkLoaded.current = true;
    }, []);

    useEffect(() => {
        const tryRender = () => {
            if (window.Canny) {
                window.Canny("render", {
                    boardToken: BoardToken,
                    basePath: "/feedback",
                    ssoToken: null,
                    theme,
                });
            } else {
                setTimeout(tryRender, 100);
            }
        };

        tryRender();
    }, [theme]);

    useEffect(() => {
        const html = document.documentElement;

        const observer = new MutationObserver(() => {
            const htmlTheme = html.getAttribute("data-theme") === "dark"
                ? "dark"
                : "light";
            setTheme(htmlTheme);
        });

        observer.observe(html, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div key={theme} className="canny-feedback-container">
            <div data-canny />
        </div>
    );
};

export default Feedback;
