import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Route có layout chung
  route("", "layouts/GuestLayout.tsx", [
    index("routes/guest/homePage.tsx"),
    route("about", "routes/about.tsx"),
  ]),
  route("", "layouts/UserLayout.tsx", [
    route("/latest", "routes/user/homePageUser.tsx"),
  ]),
  route("", "layouts/CreateLayout.tsx", [
   route("create-lesson", "routes/course/CreateLessonPage.tsx"),
  ]),

  // Route không có layout (ví dụ login)
  route("login", "routes/auth/loginPage.tsx"),
  route("register", "routes/auth/registerPage.tsx"),
] satisfies RouteConfig;