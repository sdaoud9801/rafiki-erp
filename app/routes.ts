import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("./welcome/welcome.tsx"),
    route("/edit/:pid","./routes/edit-purchase/EditPurchase.tsx"),
    route('/purchase-form','./routes/purchase-form/purchase-form.tsx'),
    route("/view-purchases", './routes/view-purchases/view-purchases.tsx')
] satisfies RouteConfig;
