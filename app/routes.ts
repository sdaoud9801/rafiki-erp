import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("./routes/login/Login.tsx"),
    route("/edit/:pid","./routes/edit-purchase/EditPurchase.tsx"),
    route('/purchase-form','./routes/purchase-form/purchase-form.tsx'),
    route("/view-purchases", './routes/view-purchases/view-purchases.tsx'),
    route('/approval', './routes/approve-purchase/ApprovePurchase.tsx'),
    route('/create-category', './routes/create-categories/CreateCategories.tsx'),
] satisfies RouteConfig;
