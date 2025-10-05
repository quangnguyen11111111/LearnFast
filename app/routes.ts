import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  // Route có layout chung
  route('', 'layouts/GuestLayout.tsx', [index('routes/guest/homePage.tsx'), route('about', 'routes/about.tsx')]),
  //
  route('', 'layouts/UserLayout.tsx', [
    route('/latest', 'routes/user/homeUserPage.tsx'),
    route('learn-lesson', 'routes/user/course/learn/learnLessonPage.tsx')
  ]),
  //
  route('', 'layouts/CreateLayout.tsx', [
    route('create-lesson', 'routes/user/course/create/createLessonPage.tsx')
  ]),

  // Route không có layout (ví dụ login)
  route('login', 'routes/guest/auth/loginPage.tsx'),
  route('register', 'routes/guest/auth/registerPage.tsx')
] satisfies RouteConfig
