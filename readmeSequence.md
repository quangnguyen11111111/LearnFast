# LearnFast - Biểu đồ Sequence Diagram (MVC)

Tài liệu này mô tả các Sequence Diagram theo mô hình MVC cho các chức năng chính của ứng dụng LearnFast.

---

## 📋 Mục lục

1. [Quy ước MVC](#quy-ước-mvc)
2. [Authentication - Đăng nhập/Đăng ký](#authentication)
3. [Create Lesson - Tạo bài học](#create-lesson)
4. [Flashcard - Học thẻ ghi nhớ](#flashcard)
5. [Multiple Choice - Trắc nghiệm](#multiple-choice)
6. [Test Exam - Làm bài kiểm tra](#test-exam)
7. [Blocks Game - Trò chơi xếp khối](#blocks-game)
8. [Card Matching - Ghép cặp thẻ](#card-matching)
9. [Library Management - Quản lý thư viện](#library-management)
10. [Progress Sync - Đồng bộ tiến độ](#progress-sync)

---

## Quy ước MVC

### Stereotype UML

| Thành phần | Stereotype | Ký hiệu PlantUML | Ví dụ                  |
| ---------- | ---------- | ---------------- | ---------------------- |
| Actor      | `actor`    | `actor`          | `actor "User" as User` |
| View       | `boundary` | `boundary`       | `:AuthView`            |
| Controller | `control`  | `control`        | `:AuthController`      |
| Model      | `entity`   | `entity`         | `:Users`               |

### Các Model trong hệ thống

- `:Users` - Quản lý người dùng
- `:File` - Quản lý bài học (file)
- `:FileDetail` - Chi tiết thuật ngữ trong bài học
- `:Folder` - Quản lý thư mục
- `:Folder_Items` - Liên kết file-thư mục
- `:Learning_Progress` - Tiến độ học tập
- `:User_File_History` - Lịch sử điểm số/thời gian

---

## Authentication

### Sequence Diagram (MVC): Đăng nhập Google & Local

```plantuml
    @startuml
    title Authentication (MVC) — Google OAuth & Local
    actor "User" as User
    boundary "Auth Page" as View
    control "Auth Controller" as Controller
    entity "Users" as MUsers
    boundary "Google OAuth" as Google

    == Đăng nhập Google ==
    User -> View: 1: Chọn đăng nhập Google
    activate View
    View -> Controller: 1.1: Yêu cầu xác thực Google
    activate Controller
    Controller -> Google: 1.1.1: Gửi idToken để xác thực
    activate Google
    Google --> Controller: 1.1.1.1: Trả về email, thông tin người dùng
    deactivate Google

    Controller -> MUsers: 1.1.2: Tìm người dùng theo email
    activate MUsers

    alt 1.1.2.1: Người dùng đã tồn tại
        MUsers --> Controller: 1.1.2.1: Trả về thông tin người dùng
        deactivate MUsers
        Controller --> View: 1.1.3: Trả về kết quả đăng nhập thành công
        deactivate Controller
        View --> View: 1.1.3.1: Hiển thị thông báo đăng nhập thành công
    else 1.1.2.1': Người dùng chưa tồn tại
        MUsers --> Controller: 1.1.2.1': Không tìm thấy
        Controller -> MUsers: 1.1.2.2: Tạo người dùng mới
        activate MUsers
        MUsers --> Controller: 1.1.2.2.1: Trả về người dùng mới
        deactivate MUsers
        Controller --> View: 1.1.3: Trả về kết quả đăng nhập thành công
        deactivate Controller
        View --> View: 1.1.3.1: Hiển thị thông báo đăng nhập thành công
    end
    deactivate View

    == Đăng nhập Local ==
    User -> View: 2: Nhập email và mật khẩu
    activate View
    View -> Controller: 2.1: Yêu cầu đăng nhập
    activate Controller
    Controller -> MUsers: 2.1.1: Tìm người dùng theo email
    activate MUsers

    alt 2.1.1.1: Người dùng không tồn tại
        MUsers --> Controller: 2.1.1.1: Không tìm thấy
        deactivate MUsers
        Controller --> View: 2.1.2: Trả về lỗi không tìm thấy
        deactivate Controller
        View --> View: 2.1.2.1: Hiển thị thông báo lỗi
    else 2.1.1.1': Người dùng tồn tại
        MUsers --> Controller: 2.1.1.1': Trả về thông tin người dùng
        deactivate MUsers
        Controller --> Controller: 2.1.2: Kiểm tra mật khẩu
        alt 2.1.2.1: Mật khẩu đúng
            Controller --> View: 2.1.3: Trả về kết quả thành công
            deactivate Controller
            View --> View: 2.1.3.1: Hiển thị thông báo đăng nhập thành công
        else 2.1.2.1': Mật khẩu sai
            Controller --> View: 2.1.3: Trả về lỗi sai mật khẩu
            deactivate Controller
            View --> View: 2.1.3.1: Hiển thị thông báo sai mật khẩu
        end
    end
    deactivate View
    @enduml
```

#### Bảng mô tả: Authentication (MVC)

| Bước      | Nội dung message                        | Mô tả                                |
| --------- | --------------------------------------- | ------------------------------------ |
| 1         | Chọn đăng nhập Google                   | User chọn nút đăng nhập Google       |
| 1.1       | Yêu cầu xác thực Google                 | View gửi yêu cầu đến Controller      |
| 1.1.1     | Gửi idToken để xác thực                 | Controller xác thực với Google OAuth |
| 1.1.1.1   | Trả về email, thông tin người dùng      | Google trả về thông tin user         |
| 1.1.2     | Tìm người dùng theo email               | Controller tìm user trong Model      |
| 1.1.2.1   | Trả về thông tin người dùng             | Model trả user cho Controller        |
| 1.1.2.1'  | Không tìm thấy                          | User chưa tồn tại                    |
| 1.1.2.2   | Tạo người dùng mới                      | Controller yêu cầu tạo user mới      |
| 1.1.2.2.1 | Trả về người dùng mới                   | Model trả user mới                   |
| 1.1.3     | Trả về kết quả đăng nhập thành công     | Controller trả kết quả cho View      |
| 1.1.3.1   | Hiển thị thông báo đăng nhập thành công | View hiển thị thông báo              |
| 2         | Nhập email và mật khẩu                  | User nhập thông tin đăng nhập local  |
| 2.1       | Yêu cầu đăng nhập                       | View gọi Controller                  |
| 2.1.1     | Tìm người dùng theo email               | Controller tìm user                  |
| 2.1.1.1   | Không tìm thấy / Trả về thông tin       | Model trả về kết quả                 |
| 2.1.2     | Kiểm tra mật khẩu                       | Controller kiểm tra mật khẩu         |
| 2.1.3     | Trả về kết quả thành công/lỗi           | Controller trả kết quả               |
| 2.1.3.1   | Hiển thị thông báo                      | View hiển thị thông báo              |

---

### Sequence Diagram (MVC): Đăng ký tài khoản Local

```plantuml
@startuml
title Đăng ký tài khoản (MVC) — Local Registration
actor "User" as User
boundary "Register Page" as View
control "Auth Controller" as Controller
entity "Users" as MUsers

== Đăng ký tài khoản mới ==
User -> View: 1: Nhập email, mật khẩu và họ tên
activate View

View -> View: 1.1: Validate dữ liệu đầu vào

alt 1.1.1: Dữ liệu không hợp lệ
    View --> View: 1.1.1: Hiển thị thông báo lỗi validation
    note right of View
        - Email không được để trống
        - Email phải đúng định dạng
        - Email không quá 60 ký tự
        - Mật khẩu ít nhất 6 ký tự
        - Mật khẩu không chứa dấu cách
        - Họ tên không được để trống
    end note
else 1.1.1': Dữ liệu hợp lệ
    View -> Controller: 1.2: Yêu cầu đăng ký tài khoản (email, password, username)
    activate Controller

    Controller -> MUsers: 1.2.1: Kiểm tra email đã tồn tại
    activate MUsers

    alt 1.2.1.1: Email đã tồn tại
        MUsers --> Controller: 1.2.1.1: Trả về email đã được sử dụng
        deactivate MUsers
        Controller --> View: 1.2.2: Trả về lỗi email đã tồn tại
        deactivate Controller
        View --> View: 1.2.2.1: Hiển thị thông báo "Email đã được sử dụng"
    else 1.2.1.1': Email chưa tồn tại
        MUsers --> Controller: 1.2.1.1': Email chưa được sử dụng

        Controller -> Controller: 1.2.2: Mã hóa mật khẩu (hash password)

        Controller -> MUsers: 1.2.3: Tạo người dùng mới
        activate MUsers

        alt 1.2.3.1: Tạo thành công
            MUsers --> Controller: 1.2.3.1: Trả về thông tin người dùng mới
            deactivate MUsers
            Controller --> View: 1.2.4: Trả về kết quả đăng ký thành công (errCode: 0)
            deactivate Controller
            View --> View: 1.2.4.1: Hiển thị thông báo "Tạo tài khoản thành công"
            View -> View: 1.2.4.2: Chuyển hướng về trang đăng nhập
        else 1.2.3.1': Tạo thất bại
            MUsers --> Controller: 1.2.3.1': Trả về lỗi tạo tài khoản
            deactivate MUsers
            Controller --> View: 1.2.4: Trả về lỗi đăng ký thất bại
            deactivate Controller
            View --> View: 1.2.4.1: Hiển thị thông báo "Tạo tài khoản thất bại"
        end
    end
end
deactivate View
@enduml
```

#### Bảng mô tả: Đăng ký tài khoản (MVC)

| Bước     | Nội dung message                                      | Mô tả                                    |
| -------- | ----------------------------------------------------- | ---------------------------------------- |
| 1        | Nhập email, mật khẩu và họ tên                        | User điền thông tin đăng ký              |
| 1.1      | Validate dữ liệu đầu vào                              | View kiểm tra tính hợp lệ của dữ liệu    |
| 1.1.1    | Hiển thị thông báo lỗi validation                     | Dữ liệu không hợp lệ, hiển thị lỗi       |
| 1.1.1'   | Dữ liệu hợp lệ                                        | Tiếp tục xử lý đăng ký                   |
| 1.2      | Yêu cầu đăng ký tài khoản (email, password, username) | View gửi request đến Controller          |
| 1.2.1    | Kiểm tra email đã tồn tại                             | Controller kiểm tra email trong Model    |
| 1.2.1.1  | Trả về email đã được sử dụng                          | Email đã tồn tại trong hệ thống          |
| 1.2.1.1' | Email chưa được sử dụng                               | Email chưa tồn tại, có thể đăng ký       |
| 1.2.2    | Mã hóa mật khẩu (hash password)                       | Controller mã hóa mật khẩu trước khi lưu |
| 1.2.3    | Tạo người dùng mới                                    | Controller yêu cầu Model tạo user mới    |
| 1.2.3.1  | Trả về thông tin người dùng mới                       | Model tạo thành công và trả về user      |
| 1.2.3.1' | Trả về lỗi tạo tài khoản                              | Model tạo thất bại                       |
| 1.2.4    | Trả về kết quả đăng ký thành công/thất bại            | Controller trả kết quả về View           |
| 1.2.4.1  | Hiển thị thông báo                                    | View hiển thị thông báo cho user         |
| 1.2.4.2  | Chuyển hướng về trang đăng nhập                       | Đăng ký thành công, redirect về login    |

#### Các validation rules

| Field    | Rule                 | Thông báo lỗi                        |
| -------- | -------------------- | ------------------------------------ |
| Email    | Không được để trống  | "Email không được để trống"          |
| Email    | Đúng định dạng email | "Email phải đúng định dạng"          |
| Email    | Không quá 60 ký tự   | "Email không được vượt quá 60 ký tự" |
| Password | Ít nhất 6 ký tự      | "Mật khẩu phải có ít nhất 6 ký tự"   |
| Password | Không chứa dấu cách  | "Mật khẩu không được chứa dấu cách"  |
| Username | Không được để trống  | "Họ và tên không được để trống"      |

---

## Create Lesson

### Sequence Diagram (MVC): Tạo bài học

```plantuml
@startuml
title Create Lesson (MVC)
actor "User" as User
boundary "Create Lesson Page" as View
control "Lesson Controller" as Controller
entity "File" as MFile
entity "FileDetail" as MFileDetail

== Tạo bài học mới ==
User -> View: 1: Nhập tiêu đề và mô tả bài học
activate View
View -> Controller: 1.1: Yêu cầu tạo bài học mới
activate Controller
Controller -> MFile: 1.1.1: Lưu thông tin bài học
activate MFile

alt 1.1.1.1: Tạo thành công
    MFile --> Controller: 1.1.1.1: Trả về mã bài học
    deactivate MFile
    Controller --> View: 1.1.2: Trả về kết quả thành công
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị thông báo tạo bài học thành công
else 1.1.1.1': Tạo thất bại
    MFile --> Controller: 1.1.1.1': Trả về lỗi
    deactivate MFile
    Controller --> View: 1.1.2: Trả về lỗi tạo bài học
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị thông báo lỗi
end
deactivate View

== Thêm thuật ngữ ==
loop 2: Với mỗi thuật ngữ cần thêm
    User -> View: 2: Nhập thuật ngữ nguồn và đích
    activate View
    View -> Controller: 2.1: Yêu cầu thêm thuật ngữ
    activate Controller
    Controller -> MFileDetail: 2.1.1: Lưu thuật ngữ vào bài học
    activate MFileDetail

    alt 2.1.1.1: Thêm thành công
        MFileDetail --> Controller: 2.1.1.1: Trả về mã thuật ngữ
        deactivate MFileDetail
        Controller --> View: 2.1.2: Trả về kết quả thành công
        deactivate Controller
        View --> View: 2.1.2.1: Hiển thị thông báo đã thêm thuật ngữ
    else 2.1.1.1': Thêm thất bại
        MFileDetail --> Controller: 2.1.1.1': Trả về lỗi
        deactivate MFileDetail
        Controller --> View: 2.1.2: Trả về lỗi thêm thuật ngữ
        deactivate Controller
        View --> View: 2.1.2.1: Hiển thị thông báo lỗi
    end
    deactivate View
end
@enduml
```

#### Bảng mô tả: Create Lesson (MVC)

| Bước    | Nội dung message                          | Mô tả                           |
| ------- | ----------------------------------------- | ------------------------------- |
| 1       | Nhập tiêu đề và mô tả bài học             | User nhập thông tin bài học     |
| 1.1     | Yêu cầu tạo bài học mới                   | View gửi yêu cầu đến Controller |
| 1.1.1   | Lưu thông tin bài học                     | Controller gọi Model File       |
| 1.1.1.1 | Trả về mã bài học                         | Model trả kết quả               |
| 1.1.2   | Trả về kết quả thành công                 | Controller trả về View          |
| 1.1.2.1 | Hiển thị thông báo tạo bài học thành công | View hiển thị thông báo         |
| 2       | Nhập thuật ngữ nguồn và đích              | User nhập thuật ngữ             |
| 2.1     | Yêu cầu thêm thuật ngữ                    | View gọi Controller             |
| 2.1.1   | Lưu thuật ngữ vào bài học                 | Controller gọi Model FileDetail |
| 2.1.1.1 | Trả về mã thuật ngữ                       | Model trả kết quả               |
| 2.1.2   | Trả về kết quả thành công                 | Controller trả về View          |
| 2.1.2.1 | Hiển thị thông báo đã thêm thuật ngữ      | View hiển thị thông báo         |

---

## Flashcard

### Sequence Diagram (MVC): Flashcard - Learn/Focus/Restart

```plantuml
@startuml
title Flashcard - Learn/Focus/Restart (MVC)
actor "User" as User
boundary "Flashcard Page" as View
control "Flashcard Controller" as Controller
entity "FileDetail" as MFileDetail
entity "Learning_Progress" as MLProgress

== Tải dữ liệu thẻ ==
User -> View: 1: Chọn bài học muốn học Flashcard
activate View
View -> Controller: 1.1: Yêu cầu danh sách thẻ ghi nhớ
activate Controller
Controller -> MFileDetail: 1.1.1: Truy vấn các thẻ của bài học
activate MFileDetail

alt 1.1.1.1: Tải thành công
    MFileDetail --> Controller: 1.1.1.1: Trả về danh sách thẻ
    deactivate MFileDetail
    Controller --> View: 1.1.2: Trả về dữ liệu thẻ
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị danh sách thẻ ghi nhớ
else 1.1.1.1': Tải thất bại
    MFileDetail --> Controller: 1.1.1.1': Trả về lỗi
    deactivate MFileDetail
    Controller --> View: 1.1.2: Trả về lỗi tải dữ liệu
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị thông báo lỗi
end
deactivate View

== Học từng thẻ ==
loop 2: Với mỗi thẻ ghi nhớ
    User -> View: 2: Đánh dấu Đã biết/Chưa biết
    activate View
    View -> Controller: 2.1: Yêu cầu cập nhật trạng thái thẻ
    activate Controller
    Controller -> MLProgress: 2.1.1: Lưu trạng thái học tập
    activate MLProgress

    alt 2.1.1.1: Lưu thành công
        MLProgress --> Controller: 2.1.1.1: Xác nhận đã lưu
        deactivate MLProgress
        Controller --> View: 2.1.2: Trả về kết quả thành công
        deactivate Controller
        View --> View: 2.1.2.1: Hiển thị thông báo đã lưu trạng thái
    else 2.1.1.1': Lưu thất bại
        MLProgress --> Controller: 2.1.1.1': Trả về lỗi
        deactivate MLProgress
        Controller --> View: 2.1.2: Trả về lỗi lưu dữ liệu
        deactivate Controller
        View --> View: 2.1.2.1: Hiển thị thông báo lỗi
    end
    deactivate View
end

== Bật chế độ tập trung ==
User -> View: 3: Chọn chế độ Học tập trung
activate View
View -> Controller: 3.1: Yêu cầu bật chế độ tập trung
activate Controller
Controller -> MLProgress: 3.1.1: Cập nhật trạng thái tập trung cho các thẻ
activate MLProgress

alt 3.1.1.1: Cập nhật thành công
    MLProgress --> Controller: 3.1.1.1: Xác nhận đã cập nhật
    deactivate MLProgress
    Controller --> View: 3.1.2: Trả về kết quả thành công
    deactivate Controller
    View --> View: 3.1.2.1: Hiển thị thông báo đã bật chế độ tập trung
else 3.1.1.1': Cập nhật thất bại
    MLProgress --> Controller: 3.1.1.1': Trả về lỗi
    deactivate MLProgress
    Controller --> View: 3.1.2: Trả về lỗi cập nhật
    deactivate Controller
    View --> View: 3.1.2.1: Hiển thị thông báo lỗi
end
deactivate View

== Học lại từ đầu ==
User -> View: 4: Chọn Học lại từ đầu
activate View
View -> Controller: 4.1: Yêu cầu đặt lại tiến độ học
activate Controller
Controller -> MLProgress: 4.1.1: Đặt lại trạng thái tất cả thẻ về ban đầu
activate MLProgress

alt 4.1.1.1: Đặt lại thành công
    MLProgress --> Controller: 4.1.1.1: Xác nhận đã đặt lại
    deactivate MLProgress
    Controller --> View: 4.1.2: Trả về kết quả thành công
    deactivate Controller
    View --> View: 4.1.2.1: Hiển thị thông báo đã đặt lại tiến độ
else 4.1.1.1': Đặt lại thất bại
    MLProgress --> Controller: 4.1.1.1': Trả về lỗi
    deactivate MLProgress
    Controller --> View: 4.1.2: Trả về lỗi đặt lại
    deactivate Controller
    View --> View: 4.1.2.1: Hiển thị thông báo lỗi
end
deactivate View
@enduml
```

#### Bảng mô tả: Flashcard (MVC)

| Bước    | Nội dung message                           | Mô tả                           |
| ------- | ------------------------------------------ | ------------------------------- |
| 1       | Chọn bài học muốn học Flashcard            | User mở trang Flashcard         |
| 1.1     | Yêu cầu danh sách thẻ ghi nhớ              | View yêu cầu Controller         |
| 1.1.1   | Truy vấn các thẻ của bài học               | Controller gọi Model FileDetail |
| 1.1.1.1 | Trả về danh sách thẻ                       | Model trả kết quả               |
| 1.1.2   | Trả về dữ liệu thẻ                         | Controller trả về View          |
| 1.1.2.1 | Hiển thị danh sách thẻ ghi nhớ             | View hiển thị cho User          |
| 2       | Đánh dấu Đã biết/Chưa biết                 | User đánh dấu thẻ               |
| 2.1     | Yêu cầu cập nhật trạng thái thẻ            | View gọi Controller             |
| 2.1.1   | Lưu trạng thái học tập                     | Controller gọi Model            |
| 2.1.1.1 | Xác nhận đã lưu                            | Model trả kết quả               |
| 2.1.2   | Trả về kết quả thành công                  | Controller trả về View          |
| 2.1.2.1 | Hiển thị thông báo đã lưu trạng thái       | View hiển thị thông báo         |
| 3       | Chọn chế độ Học tập trung                  | User bật chế độ focus           |
| 3.1     | Yêu cầu bật chế độ tập trung               | View gọi Controller             |
| 3.1.1   | Cập nhật trạng thái tập trung cho các thẻ  | Controller gọi Model            |
| 3.1.1.1 | Xác nhận đã cập nhật                       | Model trả kết quả               |
| 3.1.2   | Trả về kết quả thành công                  | Controller trả về View          |
| 3.1.2.1 | Hiển thị thông báo đã bật chế độ tập trung | View hiển thị thông báo         |
| 4       | Chọn Học lại từ đầu                        | User muốn học lại từ đầu        |
| 4.1     | Yêu cầu đặt lại tiến độ học                | View gọi Controller             |
| 4.1.1   | Đặt lại trạng thái tất cả thẻ về ban đầu   | Controller gọi Model            |
| 4.1.1.1 | Xác nhận đã đặt lại                        | Model trả kết quả               |
| 4.1.2   | Trả về kết quả thành công                  | Controller trả về View          |
| 4.1.2.1 | Hiển thị thông báo đã đặt lại tiến độ      | View hiển thị thông báo         |

---

## Multiple Choice

### Sequence Diagram (MVC): Trắc nghiệm + Tự luận

```plantuml
@startuml
title Multiple Choice - Mixed Learning (MVC)
actor "User" as User
boundary "Multiple Choice Page" as View
control "MixedLearning Controller" as Controller
entity "FileDetail" as MFileDetail
entity "Learning_Progress" as MLProgress

== Tải danh sách câu hỏi ==
User -> View: 1: Chọn bài học muốn làm trắc nghiệm
activate View
View -> Controller: 1.1: Yêu cầu danh sách câu hỏi
activate Controller
Controller -> MFileDetail: 1.1.1: Truy vấn các câu hỏi của bài học
activate MFileDetail

alt 1.1.1.1: Tải thành công
    MFileDetail --> Controller: 1.1.1.1: Trả về danh sách câu hỏi
    deactivate MFileDetail
    Controller --> View: 1.1.2: Trả về dữ liệu câu hỏi
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị danh sách câu hỏi trắc nghiệm
else 1.1.1.1': Tải thất bại
    MFileDetail --> Controller: 1.1.1.1': Trả về lỗi
    deactivate MFileDetail
    Controller --> View: 1.1.2: Trả về lỗi tải dữ liệu
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị thông báo lỗi
end
deactivate View

== Trắc nghiệm ==
loop 2: Với mỗi câu trắc nghiệm
    User -> View: 2: Chọn đáp án
    activate View
    alt 2.1: Đáp án đúng
        View -> Controller: 2.1: Yêu cầu cập nhật trạng thái câu hỏi
        activate Controller
        Controller -> MLProgress: 2.1.1: Lưu kết quả trả lời đúng
        activate MLProgress

        alt 2.1.1.1: Lưu thành công
            MLProgress --> Controller: 2.1.1.1: Xác nhận đã lưu
            deactivate MLProgress
            Controller --> View: 2.1.2: Trả về kết quả thành công
            deactivate Controller
            View --> View: 2.1.2.1: Hiển thị thông báo trả lời đúng
        else 2.1.1.1': Lưu thất bại
            MLProgress --> Controller: 2.1.1.1': Trả về lỗi
            deactivate MLProgress
            Controller --> View: 2.1.2: Trả về lỗi lưu dữ liệu
            deactivate Controller
            View --> View: 2.1.2.1: Hiển thị thông báo lỗi
        end
    else 2.1': Đáp án sai
        View --> View: 2.2: Đưa câu hỏi xuống cuối hàng đợi
    end
    deactivate View
end

== Tự luận ==
loop 3: Với mỗi câu tự luận
    User -> View: 3: Nhập câu trả lời
    activate View
    alt 3.1: Câu trả lời đúng
        View -> Controller: 3.1: Yêu cầu cập nhật trạng thái câu hỏi
        activate Controller
        Controller -> MLProgress: 3.1.1: Lưu kết quả trả lời đúng
        activate MLProgress

        alt 3.1.1.1: Lưu thành công
            MLProgress --> Controller: 3.1.1.1: Xác nhận đã lưu
            deactivate MLProgress
            Controller --> View: 3.1.2: Trả về kết quả thành công
            deactivate Controller
            View --> View: 3.1.2.1: Hiển thị thông báo trả lời đúng
        else 3.1.1.1': Lưu thất bại
            MLProgress --> Controller: 3.1.1.1': Trả về lỗi
            deactivate MLProgress
            Controller --> View: 3.1.2: Trả về lỗi lưu dữ liệu
            deactivate Controller
            View --> View: 3.1.2.1: Hiển thị thông báo lỗi
        end
    else 3.1': Câu trả lời sai
        View --> View: 3.2: Yêu cầu nhập lại câu trả lời
    end
    deactivate View
end

== Kết thúc ==
View --> View: 4: Hiển thị kết quả hoàn thành bài học
@enduml
```

#### Bảng mô tả: Multiple Choice (MVC)

| Bước    | Nội dung message                       | Mô tả                             |
| ------- | -------------------------------------- | --------------------------------- |
| 1       | Chọn bài học muốn làm trắc nghiệm      | User mở trang trắc nghiệm         |
| 1.1     | Yêu cầu danh sách câu hỏi              | View yêu cầu Controller           |
| 1.1.1   | Truy vấn các câu hỏi của bài học       | Controller gọi Model FileDetail   |
| 1.1.1.1 | Trả về danh sách câu hỏi               | Model trả kết quả                 |
| 1.1.2   | Trả về dữ liệu câu hỏi                 | Controller trả về View            |
| 1.1.2.1 | Hiển thị danh sách câu hỏi trắc nghiệm | View hiển thị cho User            |
| 2       | Chọn đáp án                            | User chọn đáp án trắc nghiệm      |
| 2.1     | Yêu cầu cập nhật trạng thái câu hỏi    | View gọi Controller (đáp án đúng) |
| 2.1.1   | Lưu kết quả trả lời đúng               | Controller gọi Model              |
| 2.1.1.1 | Xác nhận đã lưu                        | Model trả kết quả                 |
| 2.1.2   | Trả về kết quả thành công              | Controller trả về View            |
| 2.1.2.1 | Hiển thị thông báo trả lời đúng        | View hiển thị thông báo           |
| 2.2     | Đưa câu hỏi xuống cuối hàng đợi        | Đáp án sai, lặp lại               |
| 3       | Nhập câu trả lời                       | User nhập đáp án tự luận          |
| 3.1     | Yêu cầu cập nhật trạng thái câu hỏi    | View gọi Controller (đáp án đúng) |
| 3.1.1   | Lưu kết quả trả lời đúng               | Controller gọi Model              |
| 3.1.1.1 | Xác nhận đã lưu                        | Model trả kết quả                 |
| 3.1.2   | Trả về kết quả thành công              | Controller trả về View            |
| 3.1.2.1 | Hiển thị thông báo trả lời đúng        | View hiển thị thông báo           |
| 3.2     | Yêu cầu nhập lại câu trả lời           | Đáp án sai, lặp lại               |
| 4       | Hiển thị kết quả hoàn thành bài học    | Kết thúc vòng học                 |

---

## Test Exam

### Sequence Diagram (MVC): Bài kiểm tra

```plantuml
@startuml
title Test Exam (MVC)
actor "User" as User
boundary "Test Page" as View
control "Test Controller" as Controller
entity "FileDetail" as MFileDetail

== Tải dữ liệu câu hỏi ==
User -> View: 1: Chọn bài học muốn làm kiểm tra
activate View
View -> Controller: 1.1: Yêu cầu danh sách câu hỏi (fileID, userID)
activate Controller
Controller -> MFileDetail: 1.1.1: Truy vấn chi tiết bài học
activate MFileDetail

alt 1.1.1.1: Tải thành công
    MFileDetail --> Controller: 1.1.1.1: Trả về danh sách câu hỏi (source, target, quizState)
    deactivate MFileDetail
    Controller --> View: 1.1.2: Trả về dữ liệu câu hỏi
    deactivate Controller
    View --> View: 1.1.2.1: Mở modal thiết lập bài kiểm tra
else 1.1.1.1': Tải thất bại
    MFileDetail --> Controller: 1.1.1.1': Trả về lỗi
    deactivate MFileDetail
    Controller --> View: 1.1.2: Trả về lỗi tải dữ liệu
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị thông báo lỗi
end
deactivate View

== Thiết lập bài kiểm tra ==
User -> View: 2: Cấu hình bài kiểm tra (số câu, chế độ)
activate View
View --> View: 2.1: Chọn số lượng câu hỏi (batchSize)
View --> View: 2.2: Bật/tắt chế độ Đúng/Sai (trueFalse)
View --> View: 2.3: Bật/tắt chế độ Trắc nghiệm (multiple)
View --> View: 2.4: Bật/tắt chế độ Tự luận (essay)
User -> View: 2.5: Nhấn bắt đầu kiểm tra
View --> View: 2.5.1: Xáo trộn và chia câu hỏi theo chế độ
View --> View: 2.5.2: Khởi động bộ đếm thời gian
View --> View: 2.5.3: Hiển thị danh sách câu hỏi
deactivate View

== Làm bài - Chế độ Đúng/Sai ==
loop 3: Với mỗi câu Đúng/Sai
    User -> View: 3: Chọn Đúng hoặc Sai
    activate View
    View --> View: 3.1: Kiểm tra đáp án với isCorrect
    View --> View: 3.2: Lưu kết quả vào userAnswers (client)
    View --> View: 3.3: Đánh dấu câu đã trả lời
    View --> View: 3.4: Tự động chuyển câu tiếp theo
    deactivate View
end

== Làm bài - Chế độ Trắc nghiệm ==
loop 4: Với mỗi câu Trắc nghiệm
    User -> View: 4: Chọn đáp án A/B/C/D
    activate View
    View --> View: 4.1: Kiểm tra đáp án với correctSource
    View --> View: 4.2: Lưu kết quả vào userAnswers (client)
    View --> View: 4.3: Đánh dấu câu đã trả lời
    View --> View: 4.4: Tự động chuyển câu tiếp theo
    deactivate View
end

== Làm bài - Chế độ Tự luận ==
loop 5: Với mỗi câu Tự luận
    User -> View: 5: Nhập câu trả lời và nhấn Enter
    activate View
    View --> View: 5.1: So sánh với đáp án đúng (toLowerCase)
    View --> View: 5.2: Lưu kết quả vào userAnswers (client)
    View --> View: 5.3: Đánh dấu câu đã trả lời
    View --> View: 5.4: Tự động chuyển câu tiếp theo
    deactivate View
end

== Nộp bài và xem kết quả ==
User -> View: 6: Nhấn "Gửi bài kiểm tra"
activate View
alt 6.1: Còn câu chưa trả lời
    View --> View: 6.1.1: Hiển thị cảnh báo và scroll đến câu chưa trả lời
else 6.1': Đã trả lời hết
    View --> View: 6.1.2: Dừng bộ đếm thời gian
    View --> View: 6.1.3: Tính số câu đúng/sai từ userAnswers
    View --> View: 6.1.4: Hiển thị kết quả (thời gian, % đúng, chi tiết)
    View --> View: 6.1.5: Mở sidebar tóm tắt kết quả
end
deactivate View

== Làm lại bài kiểm tra ==
User -> View: 7: Mở cài đặt và nhấn bắt đầu lại
activate View
View --> View: 7.1: Reset bộ đếm thời gian
View --> View: 7.2: Xóa toàn bộ userAnswers
View --> View: 7.3: Xáo trộn lại câu hỏi
View --> View: 7.4: Hiển thị bài kiểm tra mới
deactivate View
@enduml
```

#### Bảng mô tả: Test Exam (MVC)

| Bước    | Nội dung message                                     | Mô tả                                           |
| ------- | ---------------------------------------------------- | ----------------------------------------------- |
| 1       | Chọn bài học muốn làm kiểm tra                       | User mở trang Test từ bài học                   |
| 1.1     | Yêu cầu danh sách câu hỏi (fileID, userID)           | View gọi Controller lấy dữ liệu                 |
| 1.1.1   | Truy vấn chi tiết bài học                            | Controller gọi Model FileDetail                 |
| 1.1.1.1 | Trả về danh sách câu hỏi (source, target, quizState) | Model trả kết quả                               |
| 1.1.2   | Trả về dữ liệu câu hỏi                               | Controller trả về View                          |
| 1.1.2.1 | Mở modal thiết lập bài kiểm tra                      | View hiển thị TestSetupModal                    |
| 2       | Cấu hình bài kiểm tra (số câu, chế độ)               | User thiết lập các tùy chọn                     |
| 2.1     | Chọn số lượng câu hỏi (batchSize)                    | Tối đa = tổng số câu trong bài                  |
| 2.2     | Bật/tắt chế độ Đúng/Sai (trueFalse)                  | Toggle on/off                                   |
| 2.3     | Bật/tắt chế độ Trắc nghiệm (multiple)                | Toggle on/off                                   |
| 2.4     | Bật/tắt chế độ Tự luận (essay)                       | Toggle on/off                                   |
| 2.5     | Nhấn bắt đầu kiểm tra                                | User xác nhận cấu hình                          |
| 2.5.1   | Xáo trộn và chia câu hỏi theo chế độ                 | Hook useTestExam xử lý phân chia                |
| 2.5.2   | Khởi động bộ đếm thời gian                           | Hook useTimer bắt đầu đếm                       |
| 2.5.3   | Hiển thị danh sách câu hỏi                           | View render theo dividedData                    |
| 3       | Chọn Đúng hoặc Sai                                   | User trả lời câu Đúng/Sai                       |
| 3.1     | Kiểm tra đáp án với isCorrect                        | So sánh với giá trị isCorrect của TrueFalseItem |
| 3.2     | Lưu kết quả vào userAnswers (client)                 | Lưu local state, không gọi API                  |
| 3.3     | Đánh dấu câu đã trả lời                              | Cập nhật answeredTrueFalse                      |
| 3.4     | Tự động chuyển câu tiếp theo                         | handleNext scroll đến câu kế                    |
| 4       | Chọn đáp án A/B/C/D                                  | User trả lời câu trắc nghiệm                    |
| 4.1     | Kiểm tra đáp án với correctSource                    | So sánh với source gốc                          |
| 4.2     | Lưu kết quả vào userAnswers (client)                 | Lưu local state                                 |
| 4.3     | Đánh dấu câu đã trả lời                              | Cập nhật answeredMultiple                       |
| 4.4     | Tự động chuyển câu tiếp theo                         | handleNext scroll đến câu kế                    |
| 5       | Nhập câu trả lời và nhấn Enter                       | User trả lời câu tự luận                        |
| 5.1     | So sánh với đáp án đúng (toLowerCase)                | So sánh không phân biệt hoa/thường              |
| 5.2     | Lưu kết quả vào userAnswers (client)                 | Lưu local state                                 |
| 5.3     | Đánh dấu câu đã trả lời                              | Cập nhật answeredEssay                          |
| 5.4     | Tự động chuyển câu tiếp theo                         | handleNext scroll đến câu kế                    |
| 6       | Nhấn "Gửi bài kiểm tra"                              | User nộp bài                                    |
| 6.1     | Còn câu chưa trả lời                                 | Kiểm tra answeredTrueFalse/Multiple/Essay       |
| 6.1.1   | Hiển thị cảnh báo và scroll đến câu chưa trả lời     | Alert + scroll tự động                          |
| 6.1.2   | Dừng bộ đếm thời gian                                | stopTimer()                                     |
| 6.1.3   | Tính số câu đúng/sai từ userAnswers                  | Filter userAnswers theo isCorrect               |
| 6.1.4   | Hiển thị kết quả (thời gian, % đúng, chi tiết)       | TestResult component                            |
| 6.1.5   | Mở sidebar tóm tắt kết quả                           | TestSummarySidebar hiển thị                     |
| 7       | Mở cài đặt và nhấn bắt đầu lại                       | User muốn làm lại                               |
| 7.1     | Reset bộ đếm thời gian                               | resetTimer()                                    |
| 7.2     | Xóa toàn bộ userAnswers                              | Clear state về rỗng                             |
| 7.3     | Xáo trộn lại câu hỏi                                 | getRandomItems tạo bộ mới                       |
| 7.4     | Hiển thị bài kiểm tra mới                            | Render lại câu hỏi                              |

#### Ghi chú quan trọng

> **Lưu ý**: Chức năng Test Exam hiện tại **chưa tích hợp lưu kết quả lên server**. Toàn bộ quá trình làm bài và kết quả được xử lý **hoàn toàn phía client (local state)**. Nếu user refresh trang, kết quả sẽ bị mất.
>
> Các tính năng có thể mở rộng trong tương lai:
>
> - Lưu lịch sử làm bài vào Model `HistoryQuizzes`
> - Xem lại kết quả các lần làm bài trước
> - Thống kê tiến độ học tập qua các bài kiểm tra

---

## Blocks Game

### Sequence Diagram (MVC): Trò chơi xếp khối

```plantuml
@startuml
title Blocks Game (MVC)
actor "User" as User
boundary "Blocks Game Page" as View
control "Blocks Controller" as Controller
entity "FileDetail" as MFileDetail
entity "Learning_Progress" as MLProgress

== Tải dữ liệu trò chơi ==
User -> View: 1: Chọn bài học muốn chơi Blocks
activate View
View -> Controller: 1.1: Yêu cầu danh sách thuật ngữ
activate Controller
Controller -> MFileDetail: 1.1.1: Truy vấn các thuật ngữ của bài học
activate MFileDetail

alt 1.1.1.1: Tải thành công
    MFileDetail --> Controller: 1.1.1.1: Trả về danh sách thuật ngữ
    deactivate MFileDetail
    Controller --> View: 1.1.2: Trả về dữ liệu khối đã xáo trộn
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị các khối thuật ngữ
else 1.1.1.1': Tải thất bại
    MFileDetail --> Controller: 1.1.1.1': Trả về lỗi
    deactivate MFileDetail
    Controller --> View: 1.1.2: Trả về lỗi tải dữ liệu
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị thông báo lỗi
end
deactivate View

== Chơi và lưu tiến độ ==
loop 2: Với mỗi lượt ghép
    User -> View: 2: Ghép khối thuật ngữ
    activate View
    alt 2.1: Ghép đúng
        View -> Controller: 2.1: Yêu cầu cập nhật tiến độ (đúng)
    else 2.1': Ghép sai
        View -> Controller: 2.1': Yêu cầu cập nhật tiến độ (sai)
    end
    activate Controller
    Controller -> MLProgress: 2.1.1: Lưu kết quả ghép
    activate MLProgress

    alt 2.1.1.1: Lưu thành công
        MLProgress --> Controller: 2.1.1.1: Xác nhận đã lưu
        deactivate MLProgress
        Controller --> View: 2.1.2: Trả về kết quả thành công
        deactivate Controller
        View --> View: 2.1.2.1: Hiển thị thông báo đã lưu tiến độ
    else 2.1.1.1': Lưu thất bại
        MLProgress --> Controller: 2.1.1.1': Trả về lỗi
        deactivate MLProgress
        Controller --> View: 2.1.2: Trả về lỗi lưu dữ liệu
        deactivate Controller
        View --> View: 2.1.2.1: Hiển thị thông báo lỗi
    end
    deactivate View
end
@enduml
```

#### Bảng mô tả: Blocks Game (MVC)

| Bước    | Nội dung message                    | Mô tả                           |
| ------- | ----------------------------------- | ------------------------------- |
| 1       | Chọn bài học muốn chơi Blocks       | User mở game Blocks             |
| 1.1     | Yêu cầu danh sách thuật ngữ         | View yêu cầu Controller         |
| 1.1.1   | Truy vấn các thuật ngữ của bài học  | Controller gọi Model FileDetail |
| 1.1.1.1 | Trả về danh sách thuật ngữ          | Model trả kết quả               |
| 1.1.2   | Trả về dữ liệu khối đã xáo trộn     | Controller trả về View          |
| 1.1.2.1 | Hiển thị các khối thuật ngữ         | View hiển thị cho User          |
| 2       | Ghép khối thuật ngữ                 | User ghép block                 |
| 2.1     | Yêu cầu cập nhật tiến độ (đúng/sai) | View gọi Controller             |
| 2.1.1   | Lưu kết quả ghép                    | Controller gọi Model            |
| 2.1.1.1 | Xác nhận đã lưu                     | Model trả kết quả               |
| 2.1.2   | Trả về kết quả thành công           | Controller trả về View          |
| 2.1.2.1 | Hiển thị thông báo đã lưu tiến độ   | View hiển thị thông báo         |

---

## Card Matching

### Sequence Diagram (MVC): Ghép cặp thẻ

```plantuml
@startuml
title Card Matching (MVC)
actor "User" as User
boundary "Card Matching Page" as View
control "CardMatching Controller" as Controller
entity "FileDetail" as MFileDetail
entity "User_File_History" as MHistory

== Tải dữ liệu cặp thẻ ==
User -> View: 1: Chọn bài học muốn chơi Card Matching
activate View
View -> Controller: 1.1: Yêu cầu danh sách cặp thẻ
activate Controller
Controller -> MFileDetail: 1.1.1: Truy vấn các cặp thuật ngữ của bài học
activate MFileDetail

alt 1.1.1.1: Tải thành công
    MFileDetail --> Controller: 1.1.1.1: Trả về danh sách cặp thẻ
    deactivate MFileDetail
    Controller --> View: 1.1.2: Trả về dữ liệu cặp thẻ đã xáo trộn
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị các thẻ để ghép cặp
else 1.1.1.1': Tải thất bại
    MFileDetail --> Controller: 1.1.1.1': Trả về lỗi
    deactivate MFileDetail
    Controller --> View: 1.1.2: Trả về lỗi tải dữ liệu
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị thông báo lỗi
end
deactivate View

== Chơi ghép cặp ==
loop 2: Cho đến khi hoàn thành
    User -> View: 2: Chọn cặp thẻ để ghép
    activate View
    alt 2.1: Cặp thẻ khớp nhau
        View --> View: 2.1: Giữ thẻ mở và hiển thị hiệu ứng thành công
    else 2.1': Cặp thẻ không khớp
        View --> View: 2.1': Lật thẻ lại và hiển thị hiệu ứng lắc
    end
    deactivate View
end

== Hoàn thành và hiển thị bảng xếp hạng ==
View -> Controller: 3: Yêu cầu bảng xếp hạng
activate View
activate Controller
Controller -> MHistory: 3.1: Truy vấn top 10 kết quả của bài học
activate MHistory

alt 3.1.1: Tải thành công
    MHistory --> Controller: 3.1.1: Trả về danh sách xếp hạng
    deactivate MHistory
    Controller --> View: 3.2: Trả về dữ liệu bảng xếp hạng
    deactivate Controller
    View --> View: 3.2.1: Hiển thị bảng xếp hạng
else 3.1.1': Tải thất bại
    MHistory --> Controller: 3.1.1': Trả về lỗi
    deactivate MHistory
    Controller --> View: 3.2: Trả về lỗi tải bảng xếp hạng
    deactivate Controller
    View --> View: 3.2.1: Hiển thị thông báo lỗi
end
deactivate View
@enduml
```

#### Bảng mô tả: Card Matching (MVC)

| Bước    | Nội dung message                           | Mô tả                           |
| ------- | ------------------------------------------ | ------------------------------- |
| 1       | Chọn bài học muốn chơi Card Matching       | User mở game ghép thẻ           |
| 1.1     | Yêu cầu danh sách cặp thẻ                  | View yêu cầu Controller         |
| 1.1.1   | Truy vấn các cặp thuật ngữ của bài học     | Controller gọi Model FileDetail |
| 1.1.1.1 | Trả về danh sách cặp thẻ                   | Model trả kết quả               |
| 1.1.2   | Trả về dữ liệu cặp thẻ đã xáo trộn         | Controller trả về View          |
| 1.1.2.1 | Hiển thị các thẻ để ghép cặp               | View hiển thị cho User          |
| 2       | Chọn cặp thẻ để ghép                       | User chọn thẻ để ghép           |
| 2.1     | Giữ thẻ mở và hiển thị hiệu ứng thành công | Cặp thẻ khớp nhau               |
| 2.1'    | Lật thẻ lại và hiển thị hiệu ứng lắc       | Cặp thẻ không khớp              |
| 3       | Yêu cầu bảng xếp hạng                      | View yêu cầu bảng xếp hạng      |
| 3.1     | Truy vấn top 10 kết quả của bài học        | Controller gọi Model History    |
| 3.1.1   | Trả về danh sách xếp hạng                  | Model trả kết quả               |
| 3.2     | Trả về dữ liệu bảng xếp hạng               | Controller trả về View          |
| 3.2.1   | Hiển thị bảng xếp hạng                     | View hiển thị cho User          |

---

## Library Management

### Sequence Diagram (MVC): Quản lý thư viện

```plantuml
@startuml
title Library Management (MVC)
actor "User" as User
boundary "Library Page" as View
control "Folder Controller" as Controller
entity "Folder" as MFolder
entity "Folder_Items" as MFolderItems

== Xem danh sách thư mục ==
User -> View: 1: Mở trang Thư viện (CourseLibaryPage)
activate View
View -> Controller: 1.1: Yêu cầu danh sách thư mục (userID, page, limit)
activate Controller
Controller -> MFolder: 1.1.1: Truy vấn thư mục của người dùng
activate MFolder

alt 1.1.1.1: Tải thành công
    MFolder --> Controller: 1.1.1.1: Trả về danh sách thư mục (folderID, folderName, totalTerms)
    deactivate MFolder
    Controller --> View: 1.1.2: Trả về dữ liệu thư mục + canNextPage
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị danh sách thư mục
else 1.1.1.1': Tải thất bại
    MFolder --> Controller: 1.1.1.1': Trả về lỗi
    deactivate MFolder
    Controller --> View: 1.1.2: Trả về lỗi tải dữ liệu
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị thông báo lỗi
end
deactivate View

== Phân trang - Tải thêm thư mục (Infinite Scroll) ==
User -> View: 2: Cuộn đến cuối danh sách
activate View
View --> View: 2.1: IntersectionObserver phát hiện cuộn cuối
alt 2.1.1: Còn trang tiếp theo (hasMore = true)
    View -> Controller: 2.1.1: Yêu cầu trang tiếp theo (page + 1)
    activate Controller
    Controller -> MFolder: 2.1.1.1: Truy vấn trang tiếp theo
    activate MFolder
    MFolder --> Controller: 2.1.1.2: Trả về thư mục trang mới
    deactivate MFolder
    Controller --> View: 2.1.2: Trả về dữ liệu + canNextPage
    deactivate Controller
    View --> View: 2.1.2.1: Append thư mục mới vào danh sách
else 2.1.1': Không còn trang (hasMore = false)
    View --> View: 2.1.1': Hiển thị "Đã hiển thị tất cả thư mục"
end
deactivate View

== Tạo thư mục mới ==
User -> View: 3: Nhấn nút "Tạo thư mục mới"
activate View
View --> View: 3.1: Mở ModalCreateFolder
User -> View: 3.2: Nhập tên thư mục và xác nhận
View -> Controller: 3.3: Yêu cầu tạo thư mục (folderName, userID)
activate Controller
Controller -> MFolder: 3.3.1: Lưu thông tin thư mục mới
activate MFolder

alt 3.3.1.1: Tạo thành công
    MFolder --> Controller: 3.3.1.1: Trả về folderID, folderName
    deactivate MFolder
    Controller --> View: 3.3.2: Trả về kết quả thành công
    deactivate Controller
    View --> View: 3.3.2.1: Toast "Tạo thư mục thành công"
    View --> View: 3.3.2.2: Navigate đến /course/{folderID}
else 3.3.1.1': Tạo thất bại
    MFolder --> Controller: 3.3.1.1': Trả về lỗi (tên trùng, ...)
    deactivate MFolder
    Controller --> View: 3.3.2: Trả về lỗi tạo thư mục
    deactivate Controller
    View --> View: 3.3.2.1: Toast thông báo lỗi
end
deactivate View

== Xem chi tiết thư mục (Danh sách file trong thư mục) ==
User -> View: 4: Click vào một thư mục
activate View
View --> View: 4.1: Navigate đến /course/{folderID}
View -> Controller: 4.2: Yêu cầu danh sách file trong thư mục (folderID, userID)
activate Controller
Controller -> MFolderItems: 4.2.1: Truy vấn file của thư mục
activate MFolderItems

alt 4.2.1.1: Tải thành công
    MFolderItems --> Controller: 4.2.1.1: Trả về danh sách file (fileID, fileName, termCount)
    deactivate MFolderItems
    Controller --> View: 4.2.2: Trả về dữ liệu file + canNextPage
    deactivate Controller
    View --> View: 4.2.2.1: Hiển thị danh sách học phần trong thư mục
else 4.2.1.1': Tải thất bại
    MFolderItems --> Controller: 4.2.1.1': Trả về lỗi
    deactivate MFolderItems
    Controller --> View: 4.2.2: Trả về lỗi tải dữ liệu
    deactivate Controller
    View --> View: 4.2.2.1: Hiển thị thông báo lỗi
end
deactivate View

== Đổi tên thư mục ==
User -> View: 5: Nhấn nút chỉnh sửa tên thư mục
activate View
View --> View: 5.1: Mở modal chỉnh sửa (điền sẵn tên hiện tại)
User -> View: 5.2: Nhập tên mới và xác nhận
View -> Controller: 5.3: Yêu cầu cập nhật tên (folderID, userID, folderName)
activate Controller
Controller -> MFolder: 5.3.1: Cập nhật tên thư mục
activate MFolder

alt 5.3.1.1: Cập nhật thành công
    MFolder --> Controller: 5.3.1.1: Xác nhận đã cập nhật
    deactivate MFolder
    Controller --> View: 5.3.2: Trả về kết quả thành công
    deactivate Controller
    View --> View: 5.3.2.1: Cập nhật Redux store + Đóng modal
else 5.3.1.1': Cập nhật thất bại
    MFolder --> Controller: 5.3.1.1': Trả về lỗi
    deactivate MFolder
    Controller --> View: 5.3.2: Trả về lỗi cập nhật
    deactivate Controller
    View --> View: 5.3.2.1: Toast thông báo lỗi
end
deactivate View

== Xóa thư mục ==
User -> View: 6: Nhấn nút xóa thư mục
activate View
View --> View: 6.1: Hiển thị xác nhận xóa
User -> View: 6.2: Xác nhận xóa
View -> Controller: 6.3: Yêu cầu xóa thư mục (folderID, userID)
activate Controller
Controller -> MFolder: 6.3.1: Xóa thư mục
activate MFolder

alt 6.3.1.1: Xóa thành công
    MFolder --> Controller: 6.3.1.1: Xác nhận đã xóa
    deactivate MFolder
    Controller --> View: 6.3.2: Trả về kết quả thành công
    deactivate Controller
    View --> View: 6.3.2.1: Toast "Xóa thư mục thành công"
    View --> View: 6.3.2.2: Navigate về trang thư viện
else 6.3.1.1': Xóa thất bại
    MFolder --> Controller: 6.3.1.1': Trả về lỗi
    deactivate MFolder
    Controller --> View: 6.3.2: Trả về lỗi xóa
    deactivate Controller
    View --> View: 6.3.2.1: Toast thông báo lỗi
end
deactivate View

== Thêm file vào thư mục ==
User -> View: 7: Mở modal lưu file vào thư mục (từ trang học phần)
activate View
View -> Controller: 7.1: Yêu cầu danh sách thư mục kèm trạng thái (userID, fileID)
activate Controller
Controller -> MFolder: 7.1.1: Truy vấn thư mục + check file đã lưu
activate MFolder
MFolder --> Controller: 7.1.2: Trả về folders + folderHasFile map
deactivate MFolder
Controller --> View: 7.1.3: Trả về danh sách thư mục với trạng thái đánh dấu
deactivate Controller
View --> View: 7.1.3.1: Hiển thị modal với checkbox cho từng thư mục

User -> View: 7.2: Chọn thư mục để lưu file
View -> Controller: 7.3: Yêu cầu thêm file vào thư mục (folderID, userID, fileID)
activate Controller
Controller -> MFolderItems: 7.3.1: Tạo liên kết file-folder
activate MFolderItems

alt 7.3.1.1: Thêm thành công
    MFolderItems --> Controller: 7.3.1.1: Xác nhận đã thêm
    deactivate MFolderItems
    Controller --> View: 7.3.2: Trả về kết quả thành công
    deactivate Controller
    View --> View: 7.3.2.1: Cập nhật checkbox + Toast thông báo
    View --> View: 7.3.2.2: Dispatch event 'folderFileChanged'
else 7.3.1.1': File đã tồn tại trong thư mục (errCode = 3)
    MFolderItems --> Controller: 7.3.1.1': Trả về lỗi trùng
    deactivate MFolderItems
    Controller --> View: 7.3.2: Trả về thông báo file đã có
    deactivate Controller
    View --> View: 7.3.2.1: Toast "File đã có trong thư mục"
end
deactivate View

== Xóa file khỏi thư mục ==
User -> View: 8: Bỏ chọn thư mục hoặc nhấn xóa file
activate View
View -> Controller: 8.1: Yêu cầu xóa file khỏi thư mục (folderID, userID, fileID)
activate Controller
Controller -> MFolderItems: 8.1.1: Xóa liên kết file-folder
activate MFolderItems

alt 8.1.1.1: Xóa thành công
    MFolderItems --> Controller: 8.1.1.1: Xác nhận đã xóa
    deactivate MFolderItems
    Controller --> View: 8.1.2: Trả về kết quả thành công
    deactivate Controller
    View --> View: 8.1.2.1: Cập nhật UI + Toast thông báo
    View --> View: 8.1.2.2: Dispatch event 'folderFileChanged'
else 8.1.1.1': Xóa thất bại
    MFolderItems --> Controller: 8.1.1.1': Trả về lỗi
    deactivate MFolderItems
    Controller --> View: 8.1.2: Trả về lỗi xóa
    deactivate Controller
    View --> View: 8.1.2.1: Toast thông báo lỗi
end
deactivate View
@enduml
```

#### Bảng mô tả: Library Management (MVC)

| Bước    | Nội dung message                                    | Mô tả                                         |
| ------- | --------------------------------------------------- | --------------------------------------------- |
| 1       | Mở trang Thư viện (CourseLibaryPage)                | User truy cập trang quản lý thư mục           |
| 1.1     | Yêu cầu danh sách thư mục (userID, page, limit)     | Hook useUserFolders gọi Controller            |
| 1.1.1   | Truy vấn thư mục của người dùng                     | Controller gọi getUserFoldersApi              |
| 1.1.1.1 | Trả về danh sách thư mục                            | Model trả kết quả với totalTerms              |
| 1.1.2   | Trả về dữ liệu thư mục + canNextPage                | Controller trả về View                        |
| 1.1.2.1 | Hiển thị danh sách thư mục                          | View render danh sách folders                 |
| 2       | Cuộn đến cuối danh sách                             | User scroll xuống                             |
| 2.1     | IntersectionObserver phát hiện cuộn cuối            | Trigger infinite scroll                       |
| 2.1.1   | Yêu cầu trang tiếp theo (page + 1)                  | loadMore() được gọi                           |
| 2.1.1.1 | Truy vấn trang tiếp theo                            | API call với page mới                         |
| 2.1.2.1 | Append thư mục mới vào danh sách                    | setFolders([...prev, ...newFolders])          |
| 3       | Nhấn nút "Tạo thư mục mới"                          | User muốn tạo thư mục                         |
| 3.1     | Mở ModalCreateFolder                                | setIsModalOpen(true)                          |
| 3.2     | Nhập tên thư mục và xác nhận                        | User nhập và submit                           |
| 3.3     | Yêu cầu tạo thư mục (folderName, userID)            | Hook useCreateFolder gọi createFolderThunk    |
| 3.3.1   | Lưu thông tin thư mục mới                           | Controller gọi createFolderApi                |
| 3.3.1.1 | Trả về folderID, folderName                         | Model trả kết quả tạo mới                     |
| 3.3.2.1 | Toast "Tạo thư mục thành công"                      | toast.success()                               |
| 3.3.2.2 | Navigate đến /course/{folderID}                     | navigate() chuyển trang chi tiết              |
| 4       | Click vào một thư mục                               | User chọn xem chi tiết thư mục                |
| 4.1     | Navigate đến /course/{folderID}                     | Truyền folderName qua route state             |
| 4.2     | Yêu cầu danh sách file trong thư mục                | Hook useFolderFiles gọi getFolderFilesThunk   |
| 4.2.1   | Truy vấn file của thư mục                           | Controller gọi getFolderFilesApi              |
| 4.2.1.1 | Trả về danh sách file                               | Model trả folderFiles từ Folder_Items         |
| 4.2.2.1 | Hiển thị danh sách học phần trong thư mục           | View render files trong folder                |
| 5       | Nhấn nút chỉnh sửa tên thư mục                      | User muốn đổi tên                             |
| 5.1     | Mở modal chỉnh sửa (điền sẵn tên hiện tại)          | openEditModal() với newFolderName             |
| 5.2     | Nhập tên mới và xác nhận                            | User submit form                              |
| 5.3     | Yêu cầu cập nhật tên (folderID, userID, folderName) | handleUpdateFolderName() gọi thunk            |
| 5.3.1   | Cập nhật tên thư mục                                | Controller gọi updateFolderNameApi            |
| 5.3.1.1 | Xác nhận đã cập nhật                                | Model trả kết quả                             |
| 5.3.2.1 | Cập nhật Redux store + Đóng modal                   | Redux auto update folders array               |
| 6       | Nhấn nút xóa thư mục                                | User muốn xóa thư mục                         |
| 6.1     | Hiển thị xác nhận xóa                               | Confirm dialog                                |
| 6.2     | Xác nhận xóa                                        | User confirm                                  |
| 6.3     | Yêu cầu xóa thư mục (folderID, userID)              | deleteFolder() gọi deleteFolderThunk          |
| 6.3.1   | Xóa thư mục                                         | Controller gọi deleteFolderApi                |
| 6.3.1.1 | Xác nhận đã xóa                                     | Model trả kết quả                             |
| 6.3.2.2 | Navigate về trang thư viện                          | Redirect sau khi xóa                          |
| 7       | Mở modal lưu file vào thư mục                       | User muốn lưu học phần vào thư mục            |
| 7.1     | Yêu cầu danh sách thư mục kèm trạng thái            | useFileInFolders check file trong từng folder |
| 7.1.1   | Truy vấn thư mục + check file đã lưu                | Loop qua folders và check files               |
| 7.1.2   | Trả về folders + folderHasFile map                  | Map {folderID -> boolean}                     |
| 7.1.3.1 | Hiển thị modal với checkbox cho từng thư mục        | Checkbox checked nếu file đã có trong folder  |
| 7.2     | Chọn thư mục để lưu file                            | User tick checkbox                            |
| 7.3     | Yêu cầu thêm file vào thư mục                       | addFileToFolder() gọi addFileToFolderThunk    |
| 7.3.1   | Tạo liên kết file-folder                            | Controller gọi addFileToFolderApi             |
| 7.3.1.1 | Xác nhận đã thêm                                    | Model tạo record trong Folder_Items           |
| 7.3.2.2 | Dispatch event 'folderFileChanged'                  | Trigger re-fetch cho các component khác       |
| 8       | Bỏ chọn thư mục hoặc nhấn xóa file                  | User muốn xóa file khỏi thư mục               |
| 8.1     | Yêu cầu xóa file khỏi thư mục                       | removeFileFromFolder() gọi thunk              |
| 8.1.1   | Xóa liên kết file-folder                            | Controller gọi removeFileFromFolderApi        |
| 8.1.1.1 | Xác nhận đã xóa                                     | Model xóa record trong Folder_Items           |
| 8.1.2.2 | Dispatch event 'folderFileChanged'                  | Trigger re-fetch                              |

#### Hooks sử dụng trong Library Management

| Hook                  | File                   | Chức năng                                            |
| --------------------- | ---------------------- | ---------------------------------------------------- |
| `useUserFolders`      | useFolders.ts          | Lấy danh sách thư mục với phân trang infinite scroll |
| `useCreateFolder`     | useCreateFolder.ts     | Tạo thư mục mới + navigate đến trang chi tiết        |
| `useFolderFiles`      | useFolderFiles.ts      | Quản lý file trong thư mục (CRUD)                    |
| `useFolderManagement` | useFolderManagement.ts | Đổi tên, xóa thư mục                                 |
| `useFileInFolders`    | useFileInFolders.ts    | Check file đã lưu trong thư mục nào (cho modal lưu)  |

#### API Endpoints

| API                     | Method | Endpoint           | Mô tả                            |
| ----------------------- | ------ | ------------------ | -------------------------------- |
| getUserFoldersApi       | GET    | /api/folders/user  | Lấy danh sách thư mục của user   |
| getFolderFilesApi       | GET    | /api/folders/files | Lấy danh sách file trong thư mục |
| createFolderApi         | POST   | /api/folders       | Tạo thư mục mới                  |
| updateFolderNameApi     | PUT    | /api/folders/name  | Cập nhật tên thư mục             |
| deleteFolderApi         | DELETE | /api/folders       | Xóa thư mục                      |
| addFileToFolderApi      | POST   | /api/folders/files | Thêm file vào thư mục            |
| removeFileFromFolderApi | DELETE | /api/folders/files | Xóa file khỏi thư mục            |

---

## Progress Sync

### Sequence Diagram (MVC): Đồng bộ tiến độ

```plantuml
@startuml
title Progress Sync (MVC)
actor "User" as User
boundary "Flashcard Page" as View
control "Sync Controller" as Controller
entity "Learning_Progress" as MLProgress

== Đồng bộ tiến độ học tập định kỳ ==
loop 1: Mỗi 10 giây hoặc khi cần đồng bộ
    View -> Controller: 1.1: Yêu cầu đồng bộ các thay đổi
    activate View
    activate Controller
    Controller -> MLProgress: 1.1.1: Lưu hàng loạt các thay đổi tiến độ
    activate MLProgress

    alt 1.1.1.1: Đồng bộ thành công
        MLProgress --> Controller: 1.1.1.1: Xác nhận đã đồng bộ
        deactivate MLProgress
        Controller --> View: 1.1.2: Trả về kết quả thành công
        deactivate Controller
        View --> View: 1.1.2.1: Hiển thị thông báo đã đồng bộ tiến độ
    else 1.1.1.1': Đồng bộ thất bại
        MLProgress --> Controller: 1.1.1.1': Trả về lỗi
        deactivate MLProgress
        Controller --> View: 1.1.2: Trả về lỗi đồng bộ
        deactivate Controller
        View --> View: 1.1.2.1: Hiển thị thông báo lỗi và sẽ thử lại
    end
    deactivate View
end
@enduml
```

#### Bảng mô tả: Progress Sync (MVC)

| Bước    | Nội dung message                      | Mô tả                   |
| ------- | ------------------------------------- | ----------------------- |
| 1       | Loop mỗi 10 giây                      | Chu kỳ đồng bộ định kỳ  |
| 1.1     | Yêu cầu đồng bộ các thay đổi          | View đẩy batch thay đổi |
| 1.1.1   | Lưu hàng loạt các thay đổi tiến độ    | Controller gọi Model    |
| 1.1.1.1 | Xác nhận đã đồng bộ                   | Model trả kết quả       |
| 1.1.2   | Trả về kết quả thành công             | Controller trả về View  |
| 1.1.2.1 | Hiển thị thông báo đã đồng bộ tiến độ | View hiển thị thông báo |

---

## 📝 Hướng dẫn render PlantUML

### VS Code Extensions

- PlantUML extension
- Markdown Preview Enhanced

### Online Tools

- [PlantUML Web Server](http://www.plantuml.com/plantuml)
- [PlantText](https://www.planttext.com/)

---

**Cập nhật lần cuối**: 08/01/2026
