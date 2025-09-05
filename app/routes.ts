import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Route có layout chung
  route("", "layouts/MainLayout.tsx", [
    index("routes/homePage.tsx"),
    route("about", "routes/about.tsx"),
  ]),

  // Route không có layout (ví dụ login)
//   route("login", "routes/login.tsx"),
] satisfies RouteConfig;