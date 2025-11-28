import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  // layout người chưa đăng nhập
  route('', 'layouts/GuestLayout.tsx', [index('routes/guest/homePage.tsx'), route('about', 'routes/about.tsx')]),
  // layout người dùng đã đăng nhập
  route('', 'layouts/UserLayout.tsx', [
    route('/latest', 'routes/user/homeUserPage.tsx'),
    route('learn-lesson', 'routes/user/course/learn/learnLessonPage.tsx')
  ]),
  // layout người đăng kí khi tạo bài học( thu mục, học phần)
  route('', 'layouts/CreateLayout.tsx', [route('create-lesson', 'routes/user/course/create/createLessonPage.tsx')]),
  // layout người đăng nh
  route('learn-lesson', 'layouts/LearnLayout.tsx', [
    route('flash-card', 'routes/user/course/learn/chooseLearn/flashCardPage.tsx'),
    route('multiple-choice', 'routes/user/course/learn/chooseLearn/multipleChoicePage.tsx'),
    route('test', 'routes/user/course/learn/chooseLearn/testPage.tsx'),
    route('blocks', 'routes/user/course/learn/chooseLearn/blocksGamePage.tsx'),
    
  ]),
  // Route không có layout (ví dụ login)
  route('login', 'routes/guest/auth/loginPage.tsx'),
  route('register', 'routes/guest/auth/registerPage.tsx')
] satisfies RouteConfig
