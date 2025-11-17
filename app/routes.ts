import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  // layout người chưa đăng ký
  route('', 'layouts/GuestLayout.tsx', [index('routes/guest/homePage.tsx'), route('about', 'routes/about.tsx')]),
  // layout người đăng ký
  route('', 'layouts/UserLayout.tsx', [
    route('/latest', 'routes/user/homeUserPage.tsx'),
    route('learn-lesson', 'routes/user/course/learn/learnLessonPage.tsx')
  ]),
  // layout người đăng kí khi khởi tạo
  route('', 'layouts/CreateLayout.tsx', [
    route('create-lesson', 'routes/user/course/create/createLessonPage.tsx')
  ]),
  // layout người đăng ký khi học
  route('learn-lesson','layouts/LearnLayout.tsx',[
    route('flash-card','routes/user/course/learn/chooseLearn/flashCardPage.tsx'),
    route('multiple-choice','routes/user/course/learn/chooseLearn/multipleChoicePage.tsx'),
    route('test','routes/user/course/learn/chooseLearn/testPage.tsx'),
  ]),
  // Route không có layout (ví dụ login)
  route('login', 'routes/guest/auth/loginPage.tsx'),
  route('register', 'routes/guest/auth/registerPage.tsx')
] satisfies RouteConfig
