module.exports = function (context: any, options: any) {
    return {
        name: 'feedback-route-plugin',
        async contentLoaded({ actions }: any) {
            const { addRoute } = actions;

            // Add a route that matches /feedback/*
            addRoute({
                path: '/feedback/:pathMatch',
                component: require.resolve('../../components/canny/FeedbackPage.tsx'),
                exact: false,
            });
        },
    };
};
