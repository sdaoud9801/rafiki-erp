import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("./routes/purchase-form/purchase-form.tsx"),
    route('/purchases','./routes/purchases.tsx')
] satisfies RouteConfig;
