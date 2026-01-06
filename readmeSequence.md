# LearnFast - Biểu đồ Sequence Diagram (PlantUML)

Tài liệu này phân tích và hướng dẫn vẽ các Sequence Diagram cho từng chức năng chính của ứng dụng LearnFast.

---

## 📋 Mục lục

1. [Giới thiệu về Sequence Diagram](#giới-thiệu-về-sequence-diagram)
2. [Authentication - Đăng nhập/Đăng ký](#authentication)
3. [Create Lesson - Tạo bài học](#create-lesson)
4. [Flashcard - Học thẻ ghi nhớ](#flashcard)
5. [Test Exam - Làm bài kiểm tra](#test-exam)
6. [Blocks Game - Trò chơi xếp khối](#blocks-game)
7. [Card Matching - Ghép cặp thẻ](#card-matching)
8. [Library Management - Quản lý thư viện](#library-management)
9. [Progress Sync - Đồng bộ tiến độ](#progress-sync)

---

## Giới thiệu về Sequence Diagram

### Sequence Diagram là gì?

Sequence Diagram (Biểu đồ tuần tự) là một loại biểu đồ UML mô tả **tương tác giữa các đối tượng theo trình tự thời gian**. Nó cho thấy:

- **Các đối tượng tham gia** (actors, components)
- **Thứ tự các message** được gửi giữa các đối tượng
- **Luồng xử lý** từ đầu đến cuối của một use case

### Ký hiệu cơ bản trong PlantUML

```plantuml
@startuml
' Định nghĩa các participant (đối tượng)
actor User                    ' Actor (người dùng)
participant "Component" as C  ' Component/Class
database "Database" as DB     ' Database
boundary "API" as API         ' API boundary

' Các loại message
User -> C: Synchronous call   ' Gọi đồng bộ (mũi tên đặc)
C --> User: Response          ' Phản hồi (mũi tên đứt)
User ->> C: Async call        ' Gọi bất đồng bộ
C -->> User: Async response   ' Phản hồi bất đồng bộ

' Các khối điều kiện
alt Condition 1               ' Điều kiện rẽ nhánh
  C -> DB: Action 1
else Condition 2
  C -> DB: Action 2
end

opt Optional                  ' Khối tùy chọn
  C -> DB: Optional action
end

loop N times                  ' Vòng lặp
  C -> DB: Repeat action
end

note right of C: Ghi chú     ' Ghi chú
@enduml
```

---

## Authentication

### 1. Đăng nhập bằng Google

**Mô tả luồng:**

1. User click nút "Đăng nhập Google"
2. Component gọi Google OAuth
3. Google trả về idToken
4. Gửi idToken lên Backend API
5. Backend xác thực và trả về user info + tokens
6. Lưu tokens vào localStorage
7. Cập nhật Redux state

```plantuml
@startuml
skinparam sequenceArrowThickness 2
skinparam participantPadding 20

title Sequence Diagram: Đăng nhập bằng Google

actor User
participant "LoginPage" as LP
participant "ButtonLoginGoogle" as BLG
participant "Google OAuth" as Google
participant "authSlice\n(Redux)" as Redux
participant "authAPI" as API
database "Backend Server" as Server
database "localStorage" as LS

User -> LP: 1: Click "Đăng nhập Google"
activate LP

LP -> BLG: 2: Trigger login
activate BLG

BLG -> Google: 2.1: signInWithPopup()
activate Google
Google --> BLG: 2.1.1: idToken
deactivate Google

BLG -> Redux: 2.2: dispatch(loginWithGoogleAccount({idToken}))
activate Redux

Redux -> API: 2.2.1: loginWithGoogleApi({idToken})
activate API

API -> Server: 2.2.1.1: POST /api/auth/google
activate Server

alt Xác thực thành công
    Server --> API: 2.2.1.2: {errCode: 0, data, accessToken, refreshToken}
    API --> Redux: 2.2.1.3: LoginResult

    Redux -> LS: 2.2.2: setItem('accessToken', token)
    Redux -> LS: 2.2.3: setItem('refreshToken', token)

    Redux --> Redux: 2.2.4: updateState({user, accessToken})
    Redux --> BLG: 2.2.5: Success
    deactivate API

    BLG --> LP: 2.3: Login success
    LP --> User: 2.4: Redirect to /user/home

else Xác thực thất bại
    Server --> API: 2.2.1.2: {errCode: 1, message: "Error"}
    deactivate Server
    API --> Redux: 2.2.1.3: rejectWithValue(message)
    Redux --> BLG: 2.2.2: Error
    BLG --> LP: 2.3: Show error toast
    LP --> User: 2.4: Hiển thị lỗi
end

deactivate Redux
deactivate BLG
deactivate LP

@enduml
```

#### Bảng mô tả Sequence Diagram: Đăng nhập bằng Google

| Bước    | Nội dung message                 | Mô tả                                              |
| ------- | -------------------------------- | -------------------------------------------------- |
| 1       | Click "Đăng nhập Google"         | User click vào nút đăng nhập Google trên giao diện |
| 2       | Trigger login                    | LoginPage kích hoạt component ButtonLoginGoogle    |
| 2.1     | signInWithPopup()                | Gọi Google OAuth để hiển thị popup đăng nhập       |
| 2.1.1   | idToken                          | Google trả về idToken sau khi xác thực thành công  |
| 2.2     | dispatch(loginWithGoogleAccount) | Dispatch action Redux với idToken                  |
| 2.2.1   | loginWithGoogleApi({idToken})    | Gọi API service để gửi request                     |
| 2.2.1.1 | POST /api/auth/google            | Gửi request HTTP đến Backend Server                |
| 2.2.1.2 | {errCode, data, tokens}          | Server trả về kết quả xác thực                     |
| 2.2.1.3 | LoginResult / rejectWithValue    | API trả kết quả cho Redux thunk                    |
| 2.2.2   | setItem('accessToken')           | Lưu accessToken vào localStorage                   |
| 2.2.3   | setItem('refreshToken')          | Lưu refreshToken vào localStorage                  |
| 2.2.4   | updateState({user, accessToken}) | Cập nhật Redux state với thông tin user            |
| 2.2.5   | Success                          | Thông báo thành công cho component                 |
| 2.3     | Login success                    | ButtonLoginGoogle thông báo cho LoginPage          |
| 2.4     | Redirect to /user/home           | Chuyển hướng user đến trang chủ                    |

### 2. Đăng nhập bằng Email/Password

```plantuml
@startuml
skinparam sequenceArrowThickness 2

title Sequence Diagram: Đăng nhập Local Account

actor User
participant "LoginPage" as LP
participant "authSlice\n(Redux)" as Redux
participant "authAPI" as API
database "Backend Server" as Server
database "localStorage" as LS

User -> LP: 1: email, password
User -> LP: 2: Login()
activate LP

LP -> LP: 2.1: Validate input
alt [email == null || password == null]
    LP --> User: 2.1.1: Alert("Email hoặc password trống")
else [email != null && password != null]
    LP -> Redux: 2.1.2: Login(email, password)
    activate Redux

    Redux -> API: 2.1.2.1: loginLocalApi({email, password})
    activate API

    API -> Server: 2.1.2.2: POST /api/auth/login
    activate Server

    alt [user == null]
        Server --> API: 2.1.2.3: {errCode: 1, message: "User not found"}
        API --> Redux: 2.1.2.4: rejectWithValue(message)
        Redux --> LP: 2.1.3: Error
        LP --> User: 2.1.4: Alert("Email không tồn tại")

    else [user != null]
        Server -> Server: 2.1.2.3: checkPassword()

        alt [password != user.password]
            Server --> API: 2.1.2.4: {errCode: 1, message: "Wrong password"}
            API --> Redux: 2.1.2.5: rejectWithValue(message)
            Redux --> LP: 2.1.3: Error
            LP --> User: 2.1.4: Alert("Sai mật khẩu")

        else [password == user.password]
            Server --> API: 2.1.2.4: {errCode: 0, data, accessToken, refreshToken}
            deactivate Server
            API --> Redux: 2.1.2.5: LoginResult
            deactivate API

            Redux -> LS: 2.1.3: setItem('accessToken')
            Redux -> LS: 2.1.4: setItem('refreshToken')
            Redux --> Redux: 2.1.5: updateState({user, loading: false})

            Redux --> LP: 2.1.6: Success
            LP --> User: 2.1.7: Alert("Đăng nhập thành công")
            LP --> User: 2.1.8: Redirect(/user/home)
        end
    end
    deactivate Redux
end
deactivate LP

@enduml
```

#### Bảng mô tả Sequence Diagram: Đăng nhập bằng Email/Password

| Bước    | Nội dung message                   | Mô tả                                                      |
| ------- | ---------------------------------- | ---------------------------------------------------------- |
| 1       | email, password                    | User nhập email và password vào form đăng nhập             |
| 2       | Login()                            | Hàm yêu cầu đăng nhập, không tham số, không có kiểu trả về |
| 2.1     | Validate input                     | Hàm kiểm tra email và password có hợp lệ không             |
| 2.1.1   | Alert("Email hoặc password trống") | Thông báo email hoặc password bị null                      |
| 2.1.2   | Login(email, password)             | Hàm xử lý đăng nhập, tham số là email và password          |
| 2.1.2.1 | loginLocalApi({email, password})   | Gọi API đăng nhập với email và password                    |
| 2.1.2.2 | POST /api/auth/login               | Gửi request HTTP đến Backend Server                        |
| 2.1.2.3 | checkPassword() / Response         | Kiểm tra mật khẩu hoặc trả về response                     |
| 2.1.2.4 | LoginResult / rejectWithValue      | API trả kết quả cho Redux thunk                            |
| 2.1.3   | setItem('accessToken') / Error     | Lưu token hoặc báo lỗi                                     |
| 2.1.4   | setItem('refreshToken') / Alert    | Lưu refresh token hoặc hiện thông báo                      |
| 2.1.5   | updateState({user})                | Cập nhật Redux state với thông tin user                    |
| 2.1.6   | Success                            | Thông báo thành công cho component                         |
| 2.1.7   | Alert("Đăng nhập thành công")      | Hiển thị thông báo đăng nhập thành công                    |
| 2.1.8   | Redirect(/user/home)               | Chuyển hướng đến trang chủ user                            |

### 3. Đăng ký tài khoản

```plantuml
@startuml
skinparam sequenceArrowThickness 2

title Sequence Diagram: Đăng ký tài khoản

actor User
participant "RegisterPage" as RP
participant "authSlice\n(Redux)" as Redux
participant "authAPI" as API
database "Backend Server" as Server

User -> RP: 1: email, password, username
User -> RP: 2: Register()
activate RP

RP -> RP: 2.1: ValidateInput(email, password, username)

alt [email == null || password == null || username == null]
    RP --> User: 2.1.1: Alert("Vui lòng điền đầy đủ thông tin")

else [!isValidEmail(email)]
    RP --> User: 2.1.2: Alert("Email không đúng format")

else [password.length < 6]
    RP --> User: 2.1.3: Alert("Password quá ngắn")

else [Input hợp lệ]
    RP -> Redux: 2.1.4: Register(email, password, username)
    activate Redux

    Redux -> API: 2.1.4.1: registerLocalApi({email, password, username})
    activate API

    API -> Server: 2.1.4.2: POST /api/auth/register
    activate Server

    Server -> Server: 2.1.4.3: checkEmailExist(email)

    alt [email đã tồn tại]
        Server --> API: 2.1.4.4: {errCode: 1, message: "Email đã được sử dụng"}
        API --> Redux: 2.1.4.5: rejectWithValue(message)
        Redux --> RP: 2.1.5: Error
        RP --> User: 2.1.6: Alert("Email đã được sử dụng")

    else [email chưa tồn tại]
        Server -> Server: 2.1.4.4: createUser(email, password, username)
        Server --> API: 2.1.4.5: {errCode: 0, message: "Đăng ký thành công"}
        deactivate Server
        API --> Redux: 2.1.4.6: {errCode: 0, message}
        deactivate API

        Redux --> Redux: 2.1.5: updateState({loading: false, message})
        Redux --> RP: 2.1.6: Success

        RP --> User: 2.1.7: Alert("Đăng ký thành công")
        RP --> User: 2.1.8: Redirect(/login)
    end
    deactivate Redux
end
deactivate RP

@enduml
```

#### Bảng mô tả Sequence Diagram: Đăng ký tài khoản

| Bước    | Nội dung message                         | Mô tả                                                    |
| ------- | ---------------------------------------- | -------------------------------------------------------- |
| 1       | email, password, username                | User nhập thông tin đăng ký vào form                     |
| 2       | Register()                               | Hàm yêu cầu đăng ký, không tham số, không có kiểu trả về |
| 2.1     | ValidateInput(email, password, username) | Hàm kiểm tra dữ liệu nhập vào có hợp lệ không            |
| 2.1.1   | Alert("Vui lòng điền đầy đủ thông tin")  | Thông báo khi có trường bị trống                         |
| 2.1.2   | Alert("Email không đúng format")         | Thông báo email không đúng định dạng                     |
| 2.1.3   | Alert("Password quá ngắn")               | Thông báo password ít hơn 6 ký tự                        |
| 2.1.4   | Register(email, password, username)      | Hàm xử lý đăng ký với các tham số                        |
| 2.1.4.1 | registerLocalApi({...})                  | Gọi API đăng ký với thông tin user                       |
| 2.1.4.2 | POST /api/auth/register                  | Gửi request HTTP đến Backend Server                      |
| 2.1.4.3 | checkEmailExist(email)                   | Kiểm tra email đã tồn tại trong database chưa            |
| 2.1.4.4 | createUser() / Response                  | Tạo user mới hoặc trả về lỗi                             |
| 2.1.4.5 | {errCode, message}                       | Server trả về kết quả đăng ký                            |
| 2.1.4.6 | rejectWithValue / Result                 | API trả kết quả cho Redux thunk                          |
| 2.1.5   | updateState() / Error                    | Cập nhật state hoặc báo lỗi                              |
| 2.1.6   | Success / Alert                          | Thông báo kết quả cho component                          |
| 2.1.7   | Alert("Đăng ký thành công")              | Hiển thị thông báo đăng ký thành công                    |
| 2.1.8   | Redirect(/login)                         | Chuyển hướng đến trang đăng nhập                         |

### 4. Refresh Token

```plantuml
@startuml
skinparam sequenceArrowThickness 2

title Sequence Diagram: Refresh Token (Auto)

participant "axiosClient\n(Interceptor)" as Axios
participant "authSlice\n(Redux)" as Redux
participant "authAPI" as API
database "Backend Server" as Server
database "localStorage" as LS

note over Axios: Request gốc bị lỗi 401

Axios -> LS: 1: getItem('refreshToken')
activate LS
LS --> Axios: 1.1: refreshToken
deactivate LS

alt [refreshToken != null]
    Axios -> Redux: 2: dispatch(refreshToken(token))
    activate Redux

    Redux -> API: 2.1: refreshTokenApi(token)
    activate API

    API -> Server: 2.1.1: POST /api/auth/refresh
    activate Server

    Server -> Server: 2.1.2: validateToken(refreshToken)

    alt [token hợp lệ]
        Server --> API: 2.1.3: {errCode: 0, accessToken, data}
        API --> Redux: 2.1.4: RefreshTokenResult
        deactivate API

        Redux -> LS: 2.2: setItem('accessToken', newToken)
        Redux --> Redux: 2.3: updateState({accessToken, user})

        Redux --> Axios: 2.4: New accessToken
        Axios -> Axios: 2.5: Retry original request with new token

    else [token hết hạn / không hợp lệ]
        Server --> API: 2.1.3: {errCode: 1}
        deactivate Server
        API --> Redux: 2.1.4: rejectWithValue

        Redux -> LS: 2.2: removeItem('accessToken')
        Redux -> LS: 2.3: removeItem('refreshToken')
        Redux --> Redux: 2.4: logout()

        Redux --> Axios: 2.5: Redirect to login
    end
    deactivate Redux

else [refreshToken == null]
    Axios --> Axios: 2: Redirect to login
end

@enduml
```

#### Bảng mô tả Sequence Diagram: Refresh Token

| Bước  | Nội dung message                           | Mô tả                                        |
| ----- | ------------------------------------------ | -------------------------------------------- |
| 1     | getItem('refreshToken')                    | Lấy refreshToken từ localStorage             |
| 1.1   | refreshToken                               | localStorage trả về giá trị refreshToken     |
| 2     | dispatch(refreshToken(token))              | Dispatch action để refresh token             |
| 2.1   | refreshTokenApi(token)                     | Gọi API service với refreshToken             |
| 2.1.1 | POST /api/auth/refresh                     | Gửi request HTTP đến Backend Server          |
| 2.1.2 | validateToken(refreshToken)                | Server xác thực refreshToken có hợp lệ không |
| 2.1.3 | {errCode, accessToken} / {errCode: 1}      | Server trả về accessToken mới hoặc lỗi       |
| 2.1.4 | RefreshTokenResult / rejectWithValue       | API trả kết quả cho Redux thunk              |
| 2.2   | setItem('accessToken') / removeItem()      | Lưu token mới hoặc xóa tokens                |
| 2.3   | updateState() / removeItem('refreshToken') | Cập nhật state hoặc xóa refreshToken         |
| 2.4   | logout() / New accessToken                 | Đăng xuất hoặc trả về token mới              |
| 2.5   | Retry request / Redirect to login          | Thử lại request hoặc chuyển đến trang login  |

---

## Create Lesson

### Tạo bài học mới (Manual + AI)

**Mô tả luồng:**

1. User nhập thông tin bài học (title, description)
2. User có thể thêm thẻ thủ công hoặc dùng AI generate
3. Submit tạo bài học
4. Gọi API tạo file
5. Redirect đến trang bài học mới

```plantuml
@startuml
skinparam sequenceArrowThickness 2

title Sequence Diagram: Tạo bài học với AI Generate

actor User
participant "CreateLessonPage" as Page
participant "useCreateLesson\n(Hook)" as Hook
participant "AIModal" as Modal
participant "fileAPI" as API
database "Backend Server" as Server

== Khởi tạo ==
User -> Page: 1: Truy cập /create
activate Page
Page -> Hook: 1.1: useCreateLesson()
activate Hook
Hook --> Page: 1.1.1: {title, lessonItems, handlers...}

== Nhập thông tin cơ bản ==
User -> Page: 2: title, description
Page -> Hook: 2.1: setTitle(), setDescription()

== Thêm thẻ thủ công ==
loop Thêm nhiều thẻ
    User -> Page: 3: Click "Thêm thẻ"
    Page -> Hook: 3.1: handleAddItem()
    Hook --> Page: 3.1.1: Updated lessonItems

    User -> Page: 3.2: source, target
    Page -> Hook: 3.2.1: handleItemChange(index, key, value)
end

== Sử dụng AI Generate ==
User -> Page: 4: Click "Tạo bằng AI"
Page -> Modal: 4.1: Open AIModal
activate Modal

User -> Modal: 4.2: topic, count, languages
User -> Modal: 4.3: Click "Tạo"

Modal -> Hook: 4.3.1: handleAIGenerate({topic, count, sourceLang, targetLang})
deactivate Modal
activate Hook

Hook -> API: 4.3.1.1: aiGenerateFlashcardsApi(data)
activate API

API -> Server: 4.3.1.2: POST /api/files/ai-generate
activate Server

alt [errCode == 0]
    Server --> API: 4.3.1.3: {errCode: 0, data: flashcards[]}
    API --> Hook: 4.3.1.4: AI generated items
    deactivate API

    Hook --> Hook: 4.3.2: setLessonItems(aiItems)
    Hook --> Hook: 4.3.3: setGlobalSourceLang()
    Hook --> Hook: 4.3.4: setGlobalTargetLang()
    Hook --> Page: 4.3.5: Updated state
    Page --> User: 4.4: Hiển thị thẻ AI đã tạo

else [errCode != 0]
    Server --> API: 4.3.1.3: {errCode: 1, message}
    deactivate Server
    API --> Hook: 4.3.1.4: Error
    Hook --> Page: 4.3.2: Toast error
    Page --> User: 4.4: Alert("Không thể tạo thẻ AI")
end

== Submit tạo bài học ==
User -> Page: 5: Click "Tạo bài học"
Page -> Hook: 5.1: handleSubmitCreateLesson()

Hook -> Hook: 5.1.1: Validate (min 4 items)

alt [lessonItems.length >= 4]
    Hook -> API: 5.1.2: createFileApi(payload)
    activate API

    API -> Server: 5.1.2.1: POST /api/files
    activate Server
    Server --> API: 5.1.2.2: {errCode: 0, fileID}
    deactivate Server
    API --> Hook: 5.1.2.3: Success
    deactivate API

    Hook --> Page: 5.1.3: navigate('/learn/' + fileID)
    Page --> User: 5.2: Redirect to lesson page

else [lessonItems.length < 4]
    Hook --> Page: 5.1.2: Toast "Cần ít nhất 4 thẻ"
    Page --> User: 5.2: Alert("Cần ít nhất 4 thẻ")
end

deactivate Hook
deactivate Page

@enduml
```

#### Bảng mô tả Sequence Diagram: Tạo bài học

| Bước    | Nội dung message                    | Mô tả                                      |
| ------- | ----------------------------------- | ------------------------------------------ |
| 1       | Truy cập /create                    | User mở trang tạo bài học                  |
| 1.1     | useCreateLesson()                   | Khởi tạo hook quản lý state tạo bài học    |
| 1.1.1   | {title, lessonItems, handlers}      | Hook trả về state và các handler           |
| 2       | title, description                  | User nhập tiêu đề và mô tả bài học         |
| 2.1     | setTitle(), setDescription()        | Cập nhật state title và description        |
| 3       | Click "Thêm thẻ"                    | User thêm thẻ mới thủ công                 |
| 3.1     | handleAddItem()                     | Thêm một item rỗng vào danh sách           |
| 3.1.1   | Updated lessonItems                 | Trả về danh sách đã cập nhật               |
| 3.2     | source, target                      | User nhập nội dung thẻ (từ nguồn, từ đích) |
| 3.2.1   | handleItemChange(index, key, value) | Cập nhật nội dung thẻ tại index            |
| 4       | Click "Tạo bằng AI"                 | User mở modal AI generate                  |
| 4.1     | Open AIModal                        | Mở modal nhập thông tin AI                 |
| 4.2     | topic, count, languages             | User nhập chủ đề, số lượng, ngôn ngữ       |
| 4.3     | Click "Tạo"                         | User submit yêu cầu AI generate            |
| 4.3.1   | handleAIGenerate({...})             | Gọi handler xử lý AI generate              |
| 4.3.1.1 | aiGenerateFlashcardsApi(data)       | Gọi API service AI                         |
| 4.3.1.2 | POST /api/files/ai-generate         | Gửi request đến server AI                  |
| 4.3.1.3 | {errCode, data}                     | Server trả về kết quả generate             |
| 4.3.1.4 | AI generated items / Error          | API trả kết quả cho hook                   |
| 4.3.2-4 | setLessonItems, setLang             | Cập nhật state với dữ liệu AI              |
| 5       | Click "Tạo bài học"                 | User submit tạo bài học                    |
| 5.1     | handleSubmitCreateLesson()          | Gọi handler submit                         |
| 5.1.1   | Validate                            | Kiểm tra số lượng thẻ >= 4                 |
| 5.1.2   | createFileApi(payload)              | Gọi API tạo file                           |
| 5.1.2.1 | POST /api/files                     | Gửi request tạo file                       |
| 5.1.2.2 | {errCode, fileID}                   | Server trả về fileID mới                   |
| 5.1.3   | navigate('/learn/' + fileID)        | Chuyển hướng đến trang bài học             |

---

## Flashcard

### Học thẻ ghi nhớ

```plantuml
@startuml
skinparam sequenceArrowThickness 2

title Sequence Diagram: Học Flashcard

actor User
participant "FlashcardPage" as Page
participant "Flashcard\nComponent" as FC
participant "useFlashcards\n(Hook)" as Hook
participant "useProgressSync\n(Hook)" as Sync
database "Backend Server" as Server

== 1. Khởi tạo ==
User -> Page: 1: Truy cập /learn/:fileID/flashcard
activate Page

Page -> Hook: 1.1: useFlashcards({initialData, onStatusChange})
activate Hook
Hook --> Page: 1.1.1: return {cards, markKnown, markUnknown, ...}

Page -> Sync: 1.2: useProgressSync({fileID, userID})
activate Sync

== 2. Học thẻ ==
loop Với mỗi thẻ
    Page -> FC: 2.1: Render card[currentIndex]
    activate FC
    FC --> User: 2.1.1: Hiển thị mặt source

    User -> FC: 2.1.2: Click/Swipe để lật thẻ
    FC --> User: 2.1.3: Hiển thị mặt target

    alt [User đánh dấu "Đã biết"]
        User -> FC: 2.2: Click ✓ (Known)
        FC -> Hook: 2.2.1: markKnown(cardId)
        Hook --> Hook: 2.2.1.1: setCards(status=1)
        Hook -> Sync: 2.2.1.2: onStatusChange(id, 1)
        Sync -> Sync: 2.2.1.3: queueChange({detailID, flashcardState: 1})

    else [User đánh dấu "Chưa biết"]
        User -> FC: 2.3: Click ✗ (Unknown)
        FC -> Hook: 2.3.1: markUnknown(cardId)
        Hook --> Hook: 2.3.1.1: setCards(status=2)
        Hook -> Sync: 2.3.1.2: onStatusChange(id, 2)
        Sync -> Sync: 2.3.1.3: queueChange({detailID, flashcardState: 2})
    end

    FC --> Page: 2.4: Next card
    deactivate FC
end

== 3. Auto Sync (mỗi 10 giây) ==
Sync -> Sync: 3.1: setInterval(10000)
activate Sync
Sync -> Server: 3.1.1: PUT /api/files/progress (batch)
Server --> Sync: 3.1.2: return {success: true}
deactivate Sync

== 4. Reset tiến độ ==
opt [User muốn học lại]
    User -> Page: 4.1: Click "Học lại"
    Page -> Hook: 4.1.1: resetStatuses()
    Hook --> Hook: 4.1.1.1: setCards(all status=0)
    Hook -> Sync: 4.1.1.2: onResetAll(ids[])
    Sync -> Sync: 4.1.1.3: queueBatchChanges(resets)
end

== 5. Rời trang ==
User -> Page: 5: Navigate away
Page -> Sync: 5.1: cleanup (beforeunload)
Sync -> Server: 5.1.1: PUT /api/files/progress (remaining)
Server --> Sync: 5.1.2: return {success: true}

deactivate Sync
deactivate Hook
deactivate Page

@enduml
```

#### Bảng mô tả Sequence Diagram: Học Flashcard

| Bước    | Nội dung message                             | Mô tả                                    |
| ------- | -------------------------------------------- | ---------------------------------------- |
| 1       | Truy cập /learn/:fileID/flashcard            | User mở trang học flashcard              |
| 1.1     | useFlashcards({initialData, onStatusChange}) | Page gọi hook khởi tạo flashcard         |
| 1.1.1   | return {cards, markKnown, markUnknown, ...}  | Hook trả về state và handlers            |
| 1.2     | useProgressSync({fileID, userID})            | Khởi tạo hook đồng bộ tiến độ            |
| 2.1     | Render card[currentIndex]                    | Page render thẻ hiện tại                 |
| 2.1.1   | Hiển thị mặt source                          | Hiển thị mặt trước (từ gốc)              |
| 2.1.2   | Click/Swipe để lật thẻ                       | User tương tác lật thẻ                   |
| 2.1.3   | Hiển thị mặt target                          | Hiển thị mặt sau (nghĩa)                 |
| 2.2     | Click ✓ (Known)                              | User đánh dấu đã biết thẻ này            |
| 2.2.1   | markKnown(cardId)                            | Component gọi handler đánh dấu biết      |
| 2.2.1.1 | setCards(status=1)                           | Hook cập nhật status = 1 (Known)         |
| 2.2.1.2 | onStatusChange(id, 1)                        | Hook thông báo Sync về thay đổi          |
| 2.2.1.3 | queueChange({detailID, flashcardState: 1})   | Sync thêm vào queue đồng bộ              |
| 2.3     | Click ✗ (Unknown)                            | User đánh dấu chưa biết thẻ này          |
| 2.3.1   | markUnknown(cardId)                          | Component gọi handler đánh dấu chưa biết |
| 2.3.1.1 | setCards(status=2)                           | Hook cập nhật status = 2 (Unknown)       |
| 2.3.1.2 | onStatusChange(id, 2)                        | Hook thông báo Sync về thay đổi          |
| 2.3.1.3 | queueChange({detailID, flashcardState: 2})   | Sync thêm vào queue đồng bộ              |
| 2.4     | Next card                                    | Component thông báo chuyển thẻ tiếp theo |
| 3.1     | setInterval(10000)                           | Sync thiết lập auto sync mỗi 10 giây     |
| 3.1.1   | PUT /api/files/progress (batch)              | Sync gửi batch tiến độ lên server        |
| 3.1.2   | return {success: true}                       | Server xác nhận đồng bộ thành công       |
| 4.1     | Click "Học lại"                              | User muốn reset tiến độ học              |
| 4.1.1   | resetStatuses()                              | Page gọi hàm reset                       |
| 4.1.1.1 | setCards(all status=0)                       | Hook đặt tất cả thẻ về status = 0        |
| 4.1.1.2 | onResetAll(ids[])                            | Hook thông báo reset tất cả              |
| 4.1.1.3 | queueBatchChanges(resets)                    | Sync queue batch changes để đồng bộ      |
| 5       | Navigate away                                | User rời khỏi trang flashcard            |
| 5.1     | cleanup (beforeunload)                       | Page trigger cleanup khi rời trang       |
| 5.1.1   | PUT /api/files/progress (remaining)          | Sync gửi các thay đổi còn lại            |
| 5.1.2   | return {success: true}                       | Server xác nhận thành công               |

---

## Test Exam

### Làm bài kiểm tra

```plantuml
@startuml
skinparam sequenceArrowThickness 2

title Sequence Diagram: Làm bài kiểm tra (Test Exam)

actor User
participant "TestPage" as Page
participant "SetUpGame\nModal" as Setup
participant "useTestExam\n(Hook)" as Hook
participant "TrueFalse\nComponent" as TF
participant "MultipleChoice\nComponent" as MC
participant "Essay\nComponent" as Essay

== 1. Setup bài kiểm tra ==
User -> Page: 1: Truy cập /learn/:fileID/test
activate Page

Page -> Hook: 1.1: useTestExam({initialData})
activate Hook
Hook --> Page: 1.1.1: return {isOpenSetup: true, ...}

Page -> Setup: 1.2: Render SetUpGame modal
activate Setup

User -> Setup: 1.3: Chọn số câu (batchSize)
Setup -> Hook: 1.3.1: setBatchSize(value)

User -> Setup: 1.4: Toggle True/False mode
Setup -> Hook: 1.4.1: setIsTestTrueFalse(value)

User -> Setup: 1.5: Toggle Multiple Choice mode
Setup -> Hook: 1.5.1: setIsTestMultiple(value)

User -> Setup: 1.6: Toggle Essay mode
Setup -> Hook: 1.6.1: setIsTestEssay(value)

User -> Setup: 1.7: Click "Bắt đầu"
Setup -> Hook: 1.7.1: handleSubmitSetupTest()
deactivate Setup

Hook --> Hook: 1.7.1.1: Chia câu hỏi theo mode
Hook --> Hook: 1.7.1.2: Generate random options
Hook -> Hook: 1.7.1.3: startTimer()
Hook --> Page: 1.7.1.4: return {dividedData, isOpenSetup: false}

== 2. Làm phần True/False ==
loop Với mỗi câu trueFalse
    Page -> TF: 2.1: Render question
    activate TF
    TF --> User: 2.1.1: Hiển thị câu hỏi + 2 options

    User -> TF: 2.1.2: Chọn True/False
    TF -> Hook: 2.1.2.1: handleSelectAnswer(id, 'trueFalse', answer, correct, ref)

    Hook --> Hook: 2.1.2.2: Lưu userAnswer
    Hook --> Hook: 2.1.2.3: Check đúng/sai
    Hook --> Hook: 2.1.2.4: Highlight kết quả

    TF -> Hook: 2.1.3: handleNext(index, ref, answered, 'trueFalse')
    Hook --> Page: 2.1.3.1: Scroll to next question
    deactivate TF
end

== 3. Làm phần Multiple Choice ==
loop Với mỗi câu multiple
    Page -> MC: 3.1: Render question + 4 options
    activate MC
    MC --> User: 3.1.1: Hiển thị câu hỏi

    User -> MC: 3.1.2: Chọn đáp án
    MC -> Hook: 3.1.2.1: handleSelectAnswer(id, 'multiple', answer, correct, ref)
    Hook --> Hook: 3.1.2.2: Lưu và check kết quả

    MC -> Hook: 3.1.3: handleNext(...)
    deactivate MC
end

== 4. Làm phần Essay ==
loop Với mỗi câu essay
    Page -> Essay: 4.1: Render question + input
    activate Essay
    Essay --> User: 4.1.1: Hiển thị câu hỏi

    User -> Essay: 4.1.2: Nhập đáp án
    User -> Essay: 4.1.3: Nhấn Enter/Tab
    Essay -> Hook: 4.1.3.1: handleSelectAnswer(id, 'essay', answer, correct, ref)

    Hook --> Hook: 4.1.3.2: So sánh answer (case-insensitive)
    Hook --> Hook: 4.1.3.3: Lưu kết quả

    Essay -> Hook: 4.1.4: handleNext(...)
    deactivate Essay
end

== 5. Kết thúc bài kiểm tra ==
User -> Page: 5: Click "Nộp bài"
Page -> Hook: 5.1: handleSubmitEndTest()

Hook -> Hook: 5.1.1: stopTimer()
Hook --> Hook: 5.1.2: Calculate score
Hook --> Hook: 5.1.3: setIsEndTest(true)
Hook --> Hook: 5.1.4: setIsOpenSummary(true)

Hook --> Page: 5.1.5: return {isEndTest: true, userAnswers, score}
Page --> User: 5.2: Hiển thị kết quả + summary

deactivate Hook
deactivate Page

@enduml
```

#### Bảng mô tả Sequence Diagram: Làm bài kiểm tra

| Bước    | Nội dung message                                          | Mô tả                                     |
| ------- | --------------------------------------------------------- | ----------------------------------------- |
| 1       | Truy cập /learn/:fileID/test                              | User mở trang bài kiểm tra                |
| 1.1     | useTestExam({initialData})                                | Page gọi hook khởi tạo test               |
| 1.1.1   | return {isOpenSetup: true, ...}                           | Hook trả về state setup ban đầu           |
| 1.2     | Render SetUpGame modal                                    | Page hiển thị modal cài đặt bài test      |
| 1.3     | Chọn số câu (batchSize)                                   | User chọn số lượng câu hỏi                |
| 1.3.1   | setBatchSize(value)                                       | Hook cập nhật số câu hỏi                  |
| 1.4     | Toggle True/False mode                                    | User bật/tắt chế độ Đúng/Sai              |
| 1.4.1   | setIsTestTrueFalse(value)                                 | Hook cập nhật mode True/False             |
| 1.5     | Toggle Multiple Choice mode                               | User bật/tắt chế độ Trắc nghiệm           |
| 1.5.1   | setIsTestMultiple(value)                                  | Hook cập nhật mode Multiple Choice        |
| 1.6     | Toggle Essay mode                                         | User bật/tắt chế độ Tự luận               |
| 1.6.1   | setIsTestEssay(value)                                     | Hook cập nhật mode Essay                  |
| 1.7     | Click "Bắt đầu"                                           | User bắt đầu bài kiểm tra                 |
| 1.7.1   | handleSubmitSetupTest()                                   | Hook xử lý setup và bắt đầu               |
| 1.7.1.1 | Chia câu hỏi theo mode                                    | Phân chia câu hỏi theo từng loại          |
| 1.7.1.2 | Generate random options                                   | Tạo các đáp án ngẫu nhiên                 |
| 1.7.1.3 | startTimer()                                              | Bắt đầu đếm thời gian                     |
| 1.7.1.4 | return {dividedData, isOpenSetup: false}                  | Trả về dữ liệu đã chia và đóng setup      |
| 2.1     | Render question                                           | Page render câu hỏi True/False            |
| 2.1.1   | Hiển thị câu hỏi + 2 options                              | Component hiển thị câu hỏi với 2 lựa chọn |
| 2.1.2   | Chọn True/False                                           | User chọn đáp án Đúng hoặc Sai            |
| 2.1.2.1 | handleSelectAnswer(id, 'trueFalse', answer, correct, ref) | Hook xử lý đáp án đã chọn                 |
| 2.1.2.2 | Lưu userAnswer                                            | Lưu câu trả lời của user                  |
| 2.1.2.3 | Check đúng/sai                                            | So sánh với đáp án đúng                   |
| 2.1.2.4 | Highlight kết quả                                         | Hiển thị màu đúng/sai                     |
| 2.1.3   | handleNext(index, ref, answered, 'trueFalse')             | Xử lý chuyển câu tiếp theo                |
| 2.1.3.1 | Scroll to next question                                   | Cuộn đến câu hỏi tiếp theo                |
| 3.1     | Render question + 4 options                               | Page render câu trắc nghiệm với 4 đáp án  |
| 3.1.1   | Hiển thị câu hỏi                                          | Component hiển thị nội dung câu hỏi       |
| 3.1.2   | Chọn đáp án                                               | User chọn 1 trong 4 đáp án                |
| 3.1.2.1 | handleSelectAnswer(id, 'multiple', answer, correct, ref)  | Hook xử lý đáp án trắc nghiệm             |
| 3.1.2.2 | Lưu và check kết quả                                      | Lưu và kiểm tra kết quả                   |
| 3.1.3   | handleNext(...)                                           | Chuyển câu hỏi tiếp theo                  |
| 4.1     | Render question + input                                   | Page render câu tự luận với ô nhập        |
| 4.1.1   | Hiển thị câu hỏi                                          | Component hiển thị câu hỏi tự luận        |
| 4.1.2   | Nhập đáp án                                               | User nhập câu trả lời                     |
| 4.1.3   | Nhấn Enter/Tab                                            | User xác nhận đáp án                      |
| 4.1.3.1 | handleSelectAnswer(id, 'essay', answer, correct, ref)     | Hook xử lý đáp án tự luận                 |
| 4.1.3.2 | So sánh answer (case-insensitive)                         | So sánh không phân biệt hoa thường        |
| 4.1.3.3 | Lưu kết quả                                               | Lưu kết quả câu trả lời                   |
| 4.1.4   | handleNext(...)                                           | Chuyển câu hỏi tiếp theo                  |
| 5       | Click "Nộp bài"                                           | User nộp bài kiểm tra                     |
| 5.1     | handleSubmitEndTest()                                     | Hook xử lý kết thúc bài test              |
| 5.1.1   | stopTimer()                                               | Dừng đồng hồ đếm giờ                      |
| 5.1.2   | Calculate score                                           | Tính điểm bài kiểm tra                    |
| 5.1.3   | setIsEndTest(true)                                        | Đánh dấu đã kết thúc test                 |
| 5.1.4   | setIsOpenSummary(true)                                    | Mở modal tổng kết                         |
| 5.1.5   | return {isEndTest: true, userAnswers, score}              | Trả về kết quả bài test                   |
| 5.2     | Hiển thị kết quả + summary                                | Hiển thị điểm số và tổng kết chi tiết     |

---

## Blocks Game

### Trò chơi xếp khối

```plantuml
@startuml
skinparam sequenceArrowThickness 2

title Sequence Diagram: Blocks Game

actor User
participant "BlocksGamePage" as Page
participant "useBlocksGame\n(Hook)" as Hook
participant "BoardCanvas" as Board
participant "BlockPool" as Pool
participant "QuestionModal" as QM
participant "fileThunk" as Thunk
database "Backend Server" as Server

== 1. Khởi tạo game ==
User -> Page: 1: Truy cập /learn/:fileID/blocks-game
activate Page

Page -> Hook: 1.1: useBlocksGame({QUESTIONS, initialBestScore})
activate Hook

Hook -> Hook: 1.1.1: createEmptyBoard()
Hook -> Hook: 1.1.2: generateBlockSet()
Hook --> Hook: 1.1.3: setBestScore(initialBestScore)

Hook --> Page: 1.1.4: return {board, blocks, score, bestScore, ...}

== 2. Kéo thả block ==
User -> Pool: 2.1: MouseDown on block
Pool -> Hook: 2.1.1: handleDragStart(blockId, x, y)
Hook --> Hook: 2.1.1.1: setDragState({blockId, offsetX, offsetY})

User -> Pool: 2.2: MouseMove
Pool -> Hook: 2.2.1: handleDragMove(x, y)
Hook --> Hook: 2.2.1.1: Update drag position
Hook --> Board: 2.2.1.2: Show preview position

User -> Board: 2.3: MouseUp (drop)
Board -> Hook: 2.3.1: handleDragEnd()

Hook -> Hook: 2.3.2: canPlaceBlock(board, block, x, y)

alt [Vị trí hợp lệ]
    Hook -> Hook: 2.4: applyPlacement(board, block)
    Hook -> Hook: 2.4.1: Check cleared lines

    opt [Có hàng/cột hoàn thành]
        Hook -> Hook: 2.4.2: computeScore(clearedLines)
        Hook --> Hook: 2.4.2.1: Update score
        Hook --> Hook: 2.4.2.2: Animation clear
    end

    Hook -> Hook: 2.4.3: Remove block from pool

    alt [Đã dùng hết 3 blocks]
        Hook --> Hook: 2.5: setQuestionMode(true)
        Hook --> Hook: 2.5.1: Pick random question
        Hook --> QM: 2.5.2: Show question modal
    else [Còn blocks]
        Hook --> Hook: 2.6: Check game over
    end

else [Vị trí không hợp lệ]
    Hook --> Hook: 2.7: Return block to pool
    Hook --> Pool: 2.7.1: Reset block position
end

== 3. Trả lời câu hỏi ==
activate QM
QM --> User: 3.1: Hiển thị câu hỏi + options

User -> QM: 3.2: Chọn đáp án
QM -> Hook: 3.2.1: handleAnswerQuestion(answer)

alt [Đáp án đúng]
    Hook --> Hook: 3.3: setAnswerState('correct')
    Hook --> Hook: 3.3.1: Bonus score
    QM --> User: 3.3.2: Animation correct

    Hook -> Hook: 3.3.3: generateBlockSet() (new blocks)
    Hook --> Hook: 3.3.4: setQuestionMode(false)
    QM --> Page: 3.3.5: Close modal

else [Đáp án sai (lần 1)]
    Hook --> Hook: 3.4: wrongAttempts++
    Hook --> Hook: 3.4.1: setAnswerState('wrong')
    QM --> User: 3.4.2: Animation wrong
    QM --> User: 3.4.3: "Thử lại!"

else [Đáp án sai (lần 2)]
    Hook --> Hook: 3.5: setAnswerState('revealed')
    QM --> User: 3.5.1: Hiển thị đáp án đúng

    Hook -> Hook: 3.5.2: generateBlockSet()
    Hook --> Hook: 3.5.3: setQuestionMode(false)
end

deactivate QM

== 4. Game Over ==
Hook -> Hook: 4.1: hasAnyValidPlacement() = false
Hook --> Hook: 4.1.1: setGameOver(true)

alt [Score > bestScore]
    Hook --> Hook: 4.2: setBestScore(score)
    Hook -> Thunk: 4.2.1: dispatch(updateGameProgressThunk({fileID, point: score}))
    Thunk -> Server: 4.2.1.1: PUT /api/files/game-progress
    Server --> Thunk: 4.2.1.2: return {success}
end

Hook --> Page: 4.3: return {gameOver: true}
Page --> User: 4.4: Hiển thị Game Over + Score

== 5. Chơi lại ==
User -> Page: 5: Click "Chơi lại"
Page -> Hook: 5.1: handleResetGame()
Hook --> Hook: 5.1.1: Reset all state
Hook --> Page: 5.1.2: Fresh game

deactivate Hook
deactivate Page

@enduml
```

#### Bảng mô tả Sequence Diagram: Blocks Game

| Bước    | Nội dung message                                          | Mô tả                                   |
| ------- | --------------------------------------------------------- | --------------------------------------- |
| 1       | Truy cập /learn/:fileID/blocks-game                       | User mở trang trò chơi Blocks Game      |
| 1.1     | useBlocksGame({QUESTIONS, initialBestScore})              | Page gọi hook khởi tạo game             |
| 1.1.1   | createEmptyBoard()                                        | Tạo board trống 10x10                   |
| 1.1.2   | generateBlockSet()                                        | Tạo set 3 blocks ngẫu nhiên             |
| 1.1.3   | setBestScore(initialBestScore)                            | Lấy điểm cao nhất từ dữ liệu đã load    |
| 1.1.4   | return {board, blocks, score, bestScore, ...}             | Hook trả về state và handlers           |
| 2.1     | MouseDown on block                                        | User bắt đầu kéo block                  |
| 2.1.1   | handleDragStart(blockId, x, y)                            | Pool thông báo bắt đầu kéo              |
| 2.1.1.1 | setDragState({blockId, offsetX, offsetY})                 | Lưu state kéo thả                       |
| 2.2     | MouseMove                                                 | User di chuyển block                    |
| 2.2.1   | handleDragMove(x, y)                                      | Pool cập nhật vị trí kéo                |
| 2.2.1.1 | Update drag position                                      | Cập nhật vị trí hiện tại                |
| 2.2.1.2 | Show preview position                                     | Hiển thị preview trên board             |
| 2.3     | MouseUp (drop)                                            | User thả block                          |
| 2.3.1   | handleDragEnd()                                           | Board thông báo kết thúc kéo            |
| 2.3.2   | canPlaceBlock(board, block, x, y)                         | Kiểm tra vị trí có hợp lệ               |
| 2.4     | applyPlacement(board, block)                              | Đặt block vào board (nếu hợp lệ)        |
| 2.4.1   | Check cleared lines                                       | Kiểm tra hàng/cột hoàn thành            |
| 2.4.2   | computeScore(clearedLines)                                | Tính điểm từ các hàng xóa               |
| 2.4.2.1 | Update score                                              | Cập nhật điểm số                        |
| 2.4.2.2 | Animation clear                                           | Hiệu ứng xóa hàng/cột                   |
| 2.4.3   | Remove block from pool                                    | Xóa block đã dùng khỏi pool             |
| 2.5     | setQuestionMode(true)                                     | Bật chế độ trả lời câu hỏi              |
| 2.5.1   | Pick random question                                      | Chọn câu hỏi ngẫu nhiên                 |
| 2.5.2   | Show question modal                                       | Hiển thị modal câu hỏi                  |
| 2.6     | Check game over                                           | Kiểm tra game over (nếu còn blocks)     |
| 2.7     | Return block to pool                                      | Trả block về pool (vị trí không hợp lệ) |
| 2.7.1   | Reset block position                                      | Reset vị trí block                      |
| 3.1     | Hiển thị câu hỏi + options                                | Modal hiển thị câu hỏi và các đáp án    |
| 3.2     | Chọn đáp án                                               | User chọn đáp án                        |
| 3.2.1   | handleAnswerQuestion(answer)                              | Modal gửi đáp án đến hook               |
| 3.3     | setAnswerState('correct')                                 | Đánh dấu trả lời đúng                   |
| 3.3.1   | Bonus score                                               | Cộng điểm thưởng                        |
| 3.3.2   | Animation correct                                         | Hiệu ứng trả lời đúng                   |
| 3.3.3   | generateBlockSet() (new blocks)                           | Tạo set blocks mới                      |
| 3.3.4   | setQuestionMode(false)                                    | Tắt chế độ câu hỏi                      |
| 3.3.5   | Close modal                                               | Đóng modal câu hỏi                      |
| 3.4     | wrongAttempts++                                           | Tăng số lần sai (trả lời sai lần 1)     |
| 3.4.1   | setAnswerState('wrong')                                   | Đánh dấu trả lời sai                    |
| 3.4.2   | Animation wrong                                           | Hiệu ứng trả lời sai                    |
| 3.4.3   | "Thử lại!"                                                | Thông báo cho user thử lại              |
| 3.5     | setAnswerState('revealed')                                | Đánh dấu đã hiển thị đáp án (sai lần 2) |
| 3.5.1   | Hiển thị đáp án đúng                                      | Hiện đáp án đúng cho user               |
| 3.5.2   | generateBlockSet()                                        | Tạo set blocks mới                      |
| 3.5.3   | setQuestionMode(false)                                    | Tắt chế độ câu hỏi                      |
| 4.1     | hasAnyValidPlacement() = false                            | Không còn vị trí hợp lệ nào             |
| 4.1.1   | setGameOver(true)                                         | Đánh dấu game over                      |
| 4.2     | setBestScore(score)                                       | Cập nhật điểm cao nhất (nếu vượt)       |
| 4.2.1   | dispatch(updateGameProgressThunk({fileID, point: score})) | Dispatch thunk lưu điểm cao             |
| 4.2.1.1 | PUT /api/files/game-progress                              | Gửi request cập nhật điểm lên server    |
| 4.2.1.2 | return {success}                                          | Server xác nhận lưu thành công          |
| 4.3     | return {gameOver: true}                                   | Hook trả về state game over             |
| 4.4     | Hiển thị Game Over + Score                                | Page hiển thị màn hình kết thúc         |
| 5       | Click "Chơi lại"                                          | User muốn chơi lại                      |
| 5.1     | handleResetGame()                                         | Page gọi handler reset                  |
| 5.1.1   | Reset all state                                           | Hook reset toàn bộ state                |
| 5.1.2   | Fresh game                                                | Bắt đầu game mới                        |

---

## Card Matching

### Trò chơi ghép cặp thẻ

```plantuml
@startuml
skinparam sequenceArrowThickness 2

title Sequence Diagram: Card Matching Game

actor User
participant "CardMatchingPage" as Page
participant "useCardMatching\n(Hook)" as Hook
participant "CardGrid" as Grid
participant "fileThunk" as Thunk
database "Backend Server" as Server

== 1. Khởi tạo ==
User -> Page: 1: Truy cập /learn/:fileID/card-matching
activate Page

Page -> Hook: 1.1: useCardMatching(initialData, sizeCard, userID, fileID)
activate Hook

Hook -> Hook: 1.1.1: getRandomItems(data, sizeCard)
Hook -> Hook: 1.1.2: getCardPairs() - tách source/target
Hook -> Hook: 1.1.3: shuffleArray(pairs)
Hook --> Page: 1.1.4: return {cardPairs, matchedIds, handlers...}

Page -> Grid: 1.2: Render card grid (shuffled)

== 2. Setup game ==
User -> Page: 2: Click "Bắt đầu"
Page -> Hook: 2.1: setIsSetUpGame(false)
Hook -> Hook: 2.1.1: startTimer()

== 3. Chơi game ==
loop Cho đến khi ghép hết
    User -> Grid: 3.1: Click card 1
    Grid -> Hook: 3.1.1: handleSelect(idx1)
    Hook --> Hook: 3.1.1.1: selectedIndices = [idx1]
    Grid --> User: 3.1.2: Highlight card 1

    User -> Grid: 3.2: Click card 2
    Grid -> Hook: 3.2.1: handleSelect(idx2)
    Hook --> Hook: 3.2.1.1: selectedIndices = [idx1, idx2]

    Hook -> Hook: 3.3: Check match (same id?)

    alt [Ghép đúng (same id)]
        Hook --> Hook: 3.4: matchedIds.add(id)
        Hook --> Grid: 3.4.1: Mark as matched
        Grid --> User: 3.4.2: Animation success

        alt [Đã ghép hết tất cả]
            Hook -> Hook: 3.5: stopTimer()
            Hook --> Hook: 3.5.1: setIsSummaryOpen(true)

            opt [Có userID & fileID]
                Hook -> Thunk: 3.5.2: updateGameProgressThunk({point: time})
                Thunk -> Server: 3.5.2.1: PUT /api/files/game-progress
                Server --> Thunk: 3.5.2.2: return {success}
            end

            Hook --> Page: 3.5.3: Show summary modal
        end

    else [Ghép sai (different id)]
        Hook --> Hook: 3.6: setShakeIndices([idx1, idx2])
        Grid --> User: 3.6.1: Animation shake

        Hook -> Hook: 3.6.2: setTimeout → clear selection
        Hook --> Hook: 3.6.2.1: selectedIndices = []
        Hook --> Hook: 3.6.2.2: shakeIndices = []
    end
end

== 4. Xem bảng xếp hạng ==
User -> Page: 4: Click "Xếp hạng"
Page -> Thunk: 4.1: dispatch(getTopUsersThunk({fileID, mode}))
activate Thunk

Thunk -> Server: 4.1.1: GET /api/files/rankings
Server --> Thunk: 4.1.2: return {rankings: SummaryItem[]}
Thunk --> Page: 4.1.3: Rankings data

deactivate Thunk
Page --> User: 4.2: Hiển thị bảng xếp hạng

== 5. Chơi lại ==
User -> Page: 5: Click "Chơi lại"
Page -> Hook: 5.1: handleResetGame()
Hook --> Hook: 5.1.1: Shuffle mới
Hook --> Hook: 5.1.2: Reset matchedIds
Hook --> Hook: 5.1.3: resetTimer()
Hook --> Page: 5.1.4: Fresh game state

deactivate Hook
deactivate Page

@enduml
```

#### Bảng mô tả Sequence Diagram: Card Matching Game

| Bước    | Nội dung message                                       | Mô tả                                    |
| ------- | ------------------------------------------------------ | ---------------------------------------- |
| 1       | Truy cập /learn/:fileID/card-matching                  | User mở trang trò chơi ghép thẻ          |
| 1.1     | useCardMatching(initialData, sizeCard, userID, fileID) | Page gọi hook khởi tạo game              |
| 1.1.1   | getRandomItems(data, sizeCard)                         | Chọn ngẫu nhiên số thẻ theo sizeCard     |
| 1.1.2   | getCardPairs() - tách source/target                    | Tách thành cặp thẻ source và target      |
| 1.1.3   | shuffleArray(pairs)                                    | Xáo trộn các thẻ                         |
| 1.1.4   | return {cardPairs, matchedIds, handlers...}            | Hook trả về state và handlers            |
| 1.2     | Render card grid (shuffled)                            | Page render lưới thẻ đã xáo              |
| 2       | Click "Bắt đầu"                                        | User bắt đầu chơi game                   |
| 2.1     | setIsSetUpGame(false)                                  | Tắt chế độ setup                         |
| 2.1.1   | startTimer()                                           | Bắt đầu đếm thời gian                    |
| 3.1     | Click card 1                                           | User chọn thẻ đầu tiên                   |
| 3.1.1   | handleSelect(idx1)                                     | Grid thông báo thẻ được chọn             |
| 3.1.1.1 | selectedIndices = [idx1]                               | Lưu index thẻ đầu tiên                   |
| 3.1.2   | Highlight card 1                                       | Highlight thẻ đã chọn                    |
| 3.2     | Click card 2                                           | User chọn thẻ thứ hai                    |
| 3.2.1   | handleSelect(idx2)                                     | Grid thông báo thẻ thứ hai               |
| 3.2.1.1 | selectedIndices = [idx1, idx2]                         | Lưu cả 2 index                           |
| 3.3     | Check match (same id?)                                 | Kiểm tra 2 thẻ có cùng id không          |
| 3.4     | matchedIds.add(id)                                     | Thêm id vào danh sách đã ghép (nếu đúng) |
| 3.4.1   | Mark as matched                                        | Đánh dấu thẻ đã ghép                     |
| 3.4.2   | Animation success                                      | Hiệu ứng ghép thành công                 |
| 3.5     | stopTimer()                                            | Dừng đồng hồ (ghép hết)                  |
| 3.5.1   | setIsSummaryOpen(true)                                 | Mở modal tổng kết                        |
| 3.5.2   | updateGameProgressThunk({point: time})                 | Gửi điểm lên server                      |
| 3.5.2.1 | PUT /api/files/game-progress                           | Request cập nhật tiến độ                 |
| 3.5.2.2 | return {success}                                       | Server xác nhận                          |
| 3.5.3   | Show summary modal                                     | Hiển thị modal kết quả                   |
| 3.6     | setShakeIndices([idx1, idx2])                          | Đánh dấu 2 thẻ sai để rung               |
| 3.6.1   | Animation shake                                        | Hiệu ứng rung (ghép sai)                 |
| 3.6.2   | setTimeout → clear selection                           | Đợi rồi xóa selection                    |
| 3.6.2.1 | selectedIndices = []                                   | Reset selected indices                   |
| 3.6.2.2 | shakeIndices = []                                      | Reset shake indices                      |
| 4       | Click "Xếp hạng"                                       | User muốn xem bảng xếp hạng              |
| 4.1     | dispatch(getTopUsersThunk({fileID, mode}))             | Gọi thunk lấy rankings                   |
| 4.1.1   | GET /api/files/rankings                                | Request lấy danh sách xếp hạng           |
| 4.1.2   | return {rankings: SummaryItem[]}                       | Server trả về rankings                   |
| 4.1.3   | Rankings data                                          | Truyền data về Page                      |
| 4.2     | Hiển thị bảng xếp hạng                                 | Page render bảng xếp hạng                |
| 5       | Click "Chơi lại"                                       | User muốn chơi lại                       |
| 5.1     | handleResetGame()                                      | Page gọi handler reset                   |
| 5.1.1   | Shuffle mới                                            | Xáo trộn lại thẻ                         |
| 5.1.2   | Reset matchedIds                                       | Reset danh sách đã ghép                  |
| 5.1.3   | resetTimer()                                           | Reset đồng hồ                            |
| 5.1.4   | Fresh game state                                       | Game state mới                           |

---

## Library Management

### Quản lý thư viện file

```plantuml
@startuml
skinparam sequenceArrowThickness 2

title Sequence Diagram: Library Management

actor User
participant "LibraryPage" as Page
participant "useUserFiles\n(Hook)" as FilesHook
participant "useFolderManagement\n(Hook)" as FolderHook
participant "fileThunk" as FileThunk
participant "folderThunk" as FolderThunk
database "Backend Server" as Server

== 1. Load danh sách file ==
User -> Page: 1: Truy cập /user/library
activate Page

Page -> FilesHook: 1.1: useUserFiles('recent')
activate FilesHook

FilesHook -> FileThunk: 1.1.1: dispatch(getRecentFilesThunk({userID, page: 1}))
activate FileThunk

FileThunk -> Server: 1.1.1.1: GET /api/files/recent?page=1&limit=12
Server --> FileThunk: 1.1.1.2: return {files[], pagination}
FileThunk --> FilesHook: 1.1.1.3: files data

deactivate FileThunk

FilesHook --> FilesHook: 1.1.2: setFiles(data)
FilesHook --> FilesHook: 1.1.3: groupFilesByMonth()
FilesHook --> Page: 1.1.4: return {groupedFiles, hasMore, ...}

Page --> User: 1.2: Hiển thị danh sách file theo tháng

== 2. Đổi filter ==
User -> Page: 2: Click tab "Đã tạo"
Page -> FilesHook: 2.1: setFilterType('created')

FilesHook -> FilesHook: 2.1.1: Reset files, page
FilesHook -> FileThunk: 2.1.2: dispatch(getUserFilesThunk({userID, page: 1}))
FileThunk -> Server: 2.1.2.1: GET /api/files/user?page=1
Server --> FileThunk: 2.1.2.2: return {files[]}
FileThunk --> FilesHook: 2.1.2.3: data
FilesHook --> Page: 2.2: Updated files

== 3. Tìm kiếm (client-side) ==
User -> Page: 3: Nhập từ khóa search
Page -> FilesHook: 3.1: setSearchQuery(query)
FilesHook --> FilesHook: 3.1.1: filterFilesBySearch()
FilesHook --> Page: 3.1.2: Filtered files
Page --> User: 3.2: Hiển thị kết quả filter

== 4. Load more (Infinite scroll) ==
User -> Page: 4: Scroll to bottom
Page -> FilesHook: 4.1: loadMore()

alt [hasMore = true]
    FilesHook -> FileThunk: 4.2: dispatch(thunk({page: currentPage + 1}))
    FileThunk -> Server: 4.2.1: GET /api/files?page=2
    Server --> FileThunk: 4.2.2: return {files[], canNextPage}
    FileThunk --> FilesHook: 4.2.3: Append files
    FilesHook --> Page: 4.3: Updated list
else [hasMore = false]
    FilesHook --> Page: 4.4: No action
end

== 5. Quản lý folder ==
Page -> FolderHook: 5: useFolderManagement(folderID, folderName)
activate FolderHook

' Đổi tên folder
User -> Page: 5.1: Click "Đổi tên"
Page -> FolderHook: 5.1.1: openEditModal()
FolderHook --> Page: 5.1.1.1: return {isEditModalOpen: true}

User -> Page: 5.1.2: Nhập tên mới
User -> Page: 5.1.3: Click "Lưu"
Page -> FolderHook: 5.1.3.1: handleUpdateFolderName()

FolderHook -> FolderThunk: 5.1.3.2: dispatch(updateFolderNameThunk({folderID, name}))
FolderThunk -> Server: 5.1.3.3: PUT /api/folders/:id
Server --> FolderThunk: 5.1.3.4: return {success}
FolderThunk --> FolderHook: 5.1.3.5: Updated
FolderHook --> Page: 5.1.4: Close modal + toast success

' Xóa folder
User -> Page: 5.2: Click "Xóa folder"
Page -> FolderHook: 5.2.1: deleteFolder()

FolderHook -> FolderThunk: 5.2.1.1: dispatch(deleteFolderThunk({folderID}))
FolderThunk -> Server: 5.2.1.2: DELETE /api/folders/:id
Server --> FolderThunk: 5.2.1.3: return {success}
FolderThunk --> FolderHook: 5.2.1.4: Deleted
FolderHook --> Page: 5.2.2: navigate back

deactivate FolderHook
deactivate FilesHook
deactivate Page

@enduml
```

#### Bảng mô tả Sequence Diagram: Library Management

| Bước    | Nội dung message                                  | Mô tả                                       |
| ------- | ------------------------------------------------- | ------------------------------------------- |
| 1       | Truy cập /user/library                            | User mở trang thư viện                      |
| 1.1     | useUserFiles('recent')                            | Page gọi hook quản lý files                 |
| 1.1.1   | dispatch(getRecentFilesThunk({userID, page: 1}))  | Hook dispatch thunk lấy file gần đây        |
| 1.1.1.1 | GET /api/files/recent?page=1&limit=12             | Thunk gửi request đến server                |
| 1.1.1.2 | return {files[], pagination}                      | Server trả về danh sách files               |
| 1.1.1.3 | files data                                        | Thunk trả data về hook                      |
| 1.1.2   | setFiles(data)                                    | Hook lưu danh sách files vào state          |
| 1.1.3   | groupFilesByMonth()                               | Hook nhóm files theo tháng                  |
| 1.1.4   | return {groupedFiles, hasMore, ...}               | Hook trả về state đã xử lý                  |
| 1.2     | Hiển thị danh sách file theo tháng                | Page render danh sách files                 |
| 2       | Click tab "Đã tạo"                                | User đổi filter sang tab created            |
| 2.1     | setFilterType('created')                          | Page thay đổi loại filter                   |
| 2.1.1   | Reset files, page                                 | Hook reset state về ban đầu                 |
| 2.1.2   | dispatch(getUserFilesThunk({userID, page: 1}))    | Dispatch thunk lấy files do user tạo        |
| 2.1.2.1 | GET /api/files/user?page=1                        | Thunk gửi request                           |
| 2.1.2.2 | return {files[]}                                  | Server trả về files                         |
| 2.1.2.3 | data                                              | Thunk trả data về hook                      |
| 2.2     | Updated files                                     | Hook cập nhật files mới                     |
| 3       | Nhập từ khóa search                               | User nhập tìm kiếm                          |
| 3.1     | setSearchQuery(query)                             | Page cập nhật query tìm kiếm                |
| 3.1.1   | filterFilesBySearch()                             | Hook filter files theo query (client-side)  |
| 3.1.2   | Filtered files                                    | Hook trả về files đã filter                 |
| 3.2     | Hiển thị kết quả filter                           | Page render kết quả tìm kiếm                |
| 4       | Scroll to bottom                                  | User cuộn xuống cuối trang                  |
| 4.1     | loadMore()                                        | Page gọi hàm load thêm                      |
| 4.2     | dispatch(thunk({page: currentPage + 1}))          | Hook dispatch lấy trang tiếp theo           |
| 4.2.1   | GET /api/files?page=2                             | Thunk gửi request trang 2                   |
| 4.2.2   | return {files[], canNextPage}                     | Server trả về files và thông tin phân trang |
| 4.2.3   | Append files                                      | Thunk append vào danh sách hiện tại         |
| 4.3     | Updated list                                      | Hook cập nhật list mới                      |
| 4.4     | No action                                         | Không làm gì nếu hết dữ liệu                |
| 5       | useFolderManagement(folderID, folderName)         | Khởi tạo hook quản lý folder                |
| 5.1     | Click "Đổi tên"                                   | User muốn đổi tên folder                    |
| 5.1.1   | openEditModal()                                   | Mở modal edit                               |
| 5.1.1.1 | return {isEditModalOpen: true}                    | Hook trả về state modal                     |
| 5.1.2   | Nhập tên mới                                      | User nhập tên folder mới                    |
| 5.1.3   | Click "Lưu"                                       | User xác nhận lưu                           |
| 5.1.3.1 | handleUpdateFolderName()                          | Page gọi handler update                     |
| 5.1.3.2 | dispatch(updateFolderNameThunk({folderID, name})) | Hook dispatch thunk update                  |
| 5.1.3.3 | PUT /api/folders/:id                              | Thunk gửi request update                    |
| 5.1.3.4 | return {success}                                  | Server xác nhận thành công                  |
| 5.1.3.5 | Updated                                           | Thunk thông báo cập nhật                    |
| 5.1.4   | Close modal + toast success                       | Hook đóng modal và hiện thông báo           |
| 5.2     | Click "Xóa folder"                                | User muốn xóa folder                        |
| 5.2.1   | deleteFolder()                                    | Page gọi handler xóa                        |
| 5.2.1.1 | dispatch(deleteFolderThunk({folderID}))           | Hook dispatch thunk xóa                     |
| 5.2.1.2 | DELETE /api/folders/:id                           | Thunk gửi request xóa                       |
| 5.2.1.3 | return {success}                                  | Server xác nhận xóa thành công              |
| 5.2.1.4 | Deleted                                           | Thunk thông báo đã xóa                      |
| 5.2.2   | navigate back                                     | Hook chuyển hướng về trang trước            |

---

## Progress Sync

### Đồng bộ tiến độ học tập

```plantuml
@startuml
skinparam sequenceArrowThickness 2

title Sequence Diagram: Progress Sync

participant "LearningPage" as Page
participant "useProgressSync\n(Hook)" as Hook
participant "pendingChanges\n(Queue)" as Queue
database "Backend Server" as Server

== 1. Khởi tạo ==
Page -> Hook: 1: useProgressSync({fileID, userID, syncInterval: 10000})
activate Hook

Hook -> Hook: 1.1: Setup interval timer
Hook -> Hook: 1.2: Setup beforeunload listener

== 2. Queue thay đổi ==
Page -> Hook: 2.1: queueChange({detailID: "abc", flashcardState: 1})
Hook -> Queue: 2.1.1: pendingChanges.set("abc", change)

Page -> Hook: 2.2: queueChange({detailID: "xyz", flashcardState: 2})
Hook -> Queue: 2.2.1: pendingChanges.set("xyz", change)

note over Queue: Queue: {abc: {...}, xyz: {...}}

== 3. Auto sync (mỗi 10 giây) ==
Hook -> Hook: 3.1: setInterval triggered
activate Hook

alt [Queue không rỗng & không đang sync]
    Hook -> Hook: 3.2: isSyncing = true
    Hook -> Queue: 3.2.1: Get all pending changes
    Queue --> Hook: 3.2.1.1: return changes[]

    Hook -> Server: 3.2.2: PUT /api/files/progress (batch)
    activate Server

    loop Với mỗi change
        Server -> Server: 3.2.2.1: Update progress in DB
    end

    alt [Tất cả thành công]
        Server --> Hook: 3.3: return {success: true, failed: []}
        Hook -> Queue: 3.3.1: Clear all synced items

    else [Một số thất bại]
        Server --> Hook: 3.4: return {success: false, failed: ["xyz"]}
        Hook -> Queue: 3.4.1: Keep failed items for retry
    end

    deactivate Server
    Hook -> Hook: 3.5: isSyncing = false

else [Queue rỗng]
    note over Hook: 3.6: Skip sync
end

deactivate Hook

== 4. Force sync (manual) ==
Page -> Hook: 4: syncNow()
Hook -> Hook: 4.1: Clear interval
Hook -> Hook: 4.2: Immediate sync
Hook -> Server: 4.2.1: PUT /api/files/progress
Server --> Hook: 4.2.2: return {success}
Hook -> Hook: 4.3: Restart interval

== 5. Batch changes (reset all) ==
Page -> Hook: 5: queueBatchChanges([{id1, state:0}, {id2, state:0}, ...])
Hook -> Queue: 5.1: Merge all changes

== 6. Cleanup khi rời trang ==
Page -> Hook: 6: Component unmount / beforeunload
Hook -> Hook: 6.1: clearInterval()

alt [Còn pending changes]
    Hook -> Server: 6.2: PUT /api/files/progress (sync remaining)
    note over Hook: 6.2.1: Sử dụng navigator.sendBeacon()\nđể đảm bảo gửi được
    Server --> Hook: 6.2.2: Acknowledged
end

Hook -> Queue: 6.3: Clear queue
deactivate Hook

@enduml
```

#### Bảng mô tả Sequence Diagram: Progress Sync

| Bước    | Nội dung message                                         | Mô tả                                    |
| ------- | -------------------------------------------------------- | ---------------------------------------- |
| 1       | useProgressSync({fileID, userID, syncInterval: 10000})   | Page khởi tạo hook đồng bộ tiến độ       |
| 1.1     | Setup interval timer                                     | Thiết lập interval sync mỗi 10 giây      |
| 1.2     | Setup beforeunload listener                              | Thiết lập listener khi rời trang         |
| 2.1     | queueChange({detailID: "abc", flashcardState: 1})        | Page thêm thay đổi vào queue             |
| 2.1.1   | pendingChanges.set("abc", change)                        | Hook lưu change vào queue                |
| 2.2     | queueChange({detailID: "xyz", flashcardState: 2})        | Page thêm thay đổi khác                  |
| 2.2.1   | pendingChanges.set("xyz", change)                        | Hook lưu change vào queue                |
| 3.1     | setInterval triggered                                    | Interval timer được trigger              |
| 3.2     | isSyncing = true                                         | Đánh dấu đang sync                       |
| 3.2.1   | Get all pending changes                                  | Lấy tất cả changes chờ sync              |
| 3.2.1.1 | return changes[]                                         | Queue trả về danh sách changes           |
| 3.2.2   | PUT /api/files/progress (batch)                          | Gửi batch request lên server             |
| 3.2.2.1 | Update progress in DB                                    | Server cập nhật từng change vào DB       |
| 3.3     | return {success: true, failed: []}                       | Server phản hồi thành công (tất cả)      |
| 3.3.1   | Clear all synced items                                   | Xóa các items đã sync khỏi queue         |
| 3.4     | return {success: false, failed: ["xyz"]}                 | Server phản hồi có lỗi (một số thất bại) |
| 3.4.1   | Keep failed items for retry                              | Giữ lại items thất bại để retry          |
| 3.5     | isSyncing = false                                        | Đánh dấu hoàn tất sync                   |
| 3.6     | Skip sync                                                | Bỏ qua sync nếu queue rỗng               |
| 4       | syncNow()                                                | Page gọi sync ngay lập tức               |
| 4.1     | Clear interval                                           | Xóa interval hiện tại                    |
| 4.2     | Immediate sync                                           | Thực hiện sync ngay                      |
| 4.2.1   | PUT /api/files/progress                                  | Gửi request sync                         |
| 4.2.2   | return {success}                                         | Server xác nhận                          |
| 4.3     | Restart interval                                         | Khởi động lại interval                   |
| 5       | queueBatchChanges([{id1, state:0}, {id2, state:0}, ...]) | Page queue nhiều changes cùng lúc        |
| 5.1     | Merge all changes                                        | Hook merge tất cả vào queue              |
| 6       | Component unmount / beforeunload                         | Component unmount hoặc user rời trang    |
| 6.1     | clearInterval()                                          | Xóa interval timer                       |
| 6.2     | PUT /api/files/progress (sync remaining)                 | Gửi các changes còn lại (nếu có)         |
| 6.2.1   | Sử dụng navigator.sendBeacon()                           | Dùng sendBeacon đảm bảo gửi được         |
| 6.2.2   | Acknowledged                                             | Server xác nhận nhận được                |
| 6.3     | Clear queue                                              | Xóa queue sau khi cleanup                |

---

## 📝 Hướng dẫn vẽ Sequence Diagram

### Bước 1: Xác định Use Case

- Liệt kê các chức năng chính
- Xác định actor (người dùng, hệ thống)
- Xác định các bước trong luồng

### Bước 2: Xác định Participants

```plantuml
' Các loại participant phổ biến
actor User                    ' Người dùng
participant "Component" as C  ' React Component
participant "Hook" as H       ' Custom Hook
participant "Redux" as R      ' Redux slice/thunk
participant "API" as A        ' API service
database "Server" as S        ' Backend server
database "Storage" as ST      ' localStorage/sessionStorage
```

### Bước 3: Vẽ Messages theo thứ tự thời gian

```plantuml
' Message types
A -> B: Synchronous call     ' Mũi tên đặc (đợi response)
A --> B: Response            ' Mũi tên đứt (trả về)
A ->> B: Async call          ' Bất đồng bộ
A -->> B: Async response
```

### Bước 4: Thêm các khối điều kiện

```plantuml
alt Success case
  A -> B: Action 1
else Failure case
  A -> B: Action 2
end

opt Optional action
  A -> B: Maybe do this
end

loop N times
  A -> B: Repeat
end
```

### Bước 5: Thêm notes và activation

```plantuml
activate A           ' Bắt đầu lifeline
note over A: Comment
note right of A: Side note
deactivate A         ' Kết thúc lifeline
```

---

## 🛠️ Tools để render PlantUML

1. **VS Code Extensions:**
   - PlantUML extension
   - Markdown Preview Enhanced

2. **Online Tools:**
   - [PlantUML Web Server](http://www.plantuml.com/plantuml)
   - [PlantText](https://www.planttext.com/)

3. **Integration:**
   - GitHub: Sử dụng với proxy URL
   - GitLab: Native support
   - Confluence: PlantUML plugin

---

**Tài liệu này cập nhật lần cuối**: 07/01/2026
