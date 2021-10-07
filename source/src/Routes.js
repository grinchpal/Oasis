import test from "./TestPage/test";
import test2 from "./TestPage/test2";

const routes = [
    {
        path: '/test',
        component: test,
        routes: [
            {
                path: '/test2',
                component: test2
            }
        ]
    },
];

export default routes;