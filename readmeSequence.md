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
boundary "History Page" as View
control "Exam Controller" as Controller
entity "HistoryQuizzes" as MHistory

== Xem lịch sử làm bài ==
User -> View: 1: Chọn đề muốn xem
activate View
View -> Controller: 1.1: Yêu cầu danh sách lịch sử làm bài
activate Controller
Controller -> MHistory: 1.1.1: Truy vấn các lần làm bài
activate MHistory
MHistory --> Controller: 1.1.1.1: Trả về danh sách kết quả
deactivate MHistory
Controller --> View: 1.1.2: Trả về dữ liệu lịch sử
deactivate Controller
View --> View: 1.1.2.1: Hiển thị danh sách các lần làm bài
deactivate View

== Xem chi tiết bài làm ==
User -> View: 2: Chọn lần làm bài cụ thể
activate View
View -> Controller: 2.1: Yêu cầu chi tiết bài làm
activate Controller
Controller -> MHistory: 2.1.1: Truy vấn chi tiết bài làm
activate MHistory
MHistory --> Controller: 2.1.1.1: Trả về dữ liệu chi tiết
deactivate MHistory
Controller --> View: 2.1.2: Trả về chi tiết bài làm
deactivate Controller
View --> View: 2.1.2.1: Hiển thị nội dung bài làm chi tiết
deactivate View
@enduml
```

#### Bảng mô tả: Test Exam (MVC)

| Bước    | Nội dung message                   | Mô tả                               |
| ------- | ---------------------------------- | ----------------------------------- |
| 1       | Chọn đề muốn xem                   | User chọn bài kiểm tra              |
| 1.1     | Yêu cầu danh sách lịch sử làm bài  | View yêu cầu Controller             |
| 1.1.1   | Truy vấn các lần làm bài           | Controller gọi Model HistoryQuizzes |
| 1.1.1.1 | Trả về danh sách kết quả           | Model trả kết quả                   |
| 1.1.2   | Trả về dữ liệu lịch sử             | Controller trả về View              |
| 1.1.2.1 | Hiển thị danh sách các lần làm bài | View hiển thị cho User              |
| 2       | Chọn lần làm bài cụ thể            | User chọn xem chi tiết              |
| 2.1     | Yêu cầu chi tiết bài làm           | View gọi Controller                 |
| 2.1.1   | Truy vấn chi tiết bài làm          | Controller gọi Model                |
| 2.1.1.1 | Trả về dữ liệu chi tiết            | Model trả kết quả                   |
| 2.1.2   | Trả về chi tiết bài làm            | Controller trả về View              |
| 2.1.2.1 | Hiển thị nội dung bài làm chi tiết | View hiển thị cho User              |

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

== Tạo thư mục mới ==
User -> View: 1: Nhập tên thư mục mới
activate View
View -> Controller: 1.1: Yêu cầu tạo thư mục
activate Controller
Controller -> MFolder: 1.1.1: Lưu thông tin thư mục
activate MFolder

alt 1.1.1.1: Tạo thành công
    MFolder --> Controller: 1.1.1.1: Trả về mã thư mục
    deactivate MFolder
    Controller --> View: 1.1.2: Trả về kết quả thành công
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị thông báo tạo thư mục thành công
else 1.1.1.1': Tạo thất bại
    MFolder --> Controller: 1.1.1.1': Trả về lỗi
    deactivate MFolder
    Controller --> View: 1.1.2: Trả về lỗi tạo thư mục
    deactivate Controller
    View --> View: 1.1.2.1: Hiển thị thông báo lỗi
end
deactivate View

== Lưu bài học vào thư mục ==
User -> View: 2: Chọn bài học và thư mục muốn lưu
activate View
View -> Controller: 2.1: Yêu cầu lưu bài học vào thư mục
activate Controller
Controller -> MFolderItems: 2.1.1: Lưu liên kết bài học và thư mục
activate MFolderItems

alt 2.1.1.1: Lưu thành công
    MFolderItems --> Controller: 2.1.1.1: Xác nhận đã lưu
    deactivate MFolderItems
    Controller --> View: 2.1.2: Trả về kết quả thành công
    deactivate Controller
    View --> View: 2.1.2.1: Hiển thị thông báo đã lưu vào thư mục
else 2.1.1.1': Lưu thất bại
    MFolderItems --> Controller: 2.1.1.1': Trả về lỗi
    deactivate MFolderItems
    Controller --> View: 2.1.2: Trả về lỗi lưu vào thư mục
    deactivate Controller
    View --> View: 2.1.2.1: Hiển thị thông báo lỗi
end
deactivate View
@enduml
```

#### Bảng mô tả: Library Management (MVC)

| Bước    | Nội dung message                          | Mô tả                             |
| ------- | ----------------------------------------- | --------------------------------- |
| 1       | Nhập tên thư mục mới                      | User nhập tên thư mục mới         |
| 1.1     | Yêu cầu tạo thư mục                       | View gọi Controller               |
| 1.1.1   | Lưu thông tin thư mục                     | Controller gọi Model Folder       |
| 1.1.1.1 | Trả về mã thư mục                         | Model trả kết quả                 |
| 1.1.2   | Trả về kết quả thành công                 | Controller trả về View            |
| 1.1.2.1 | Hiển thị thông báo tạo thư mục thành công | View hiển thị thông báo           |
| 2       | Chọn bài học và thư mục muốn lưu          | User chọn file và thư mục         |
| 2.1     | Yêu cầu lưu bài học vào thư mục           | View gọi Controller               |
| 2.1.1   | Lưu liên kết bài học và thư mục           | Controller gọi Model Folder_Items |
| 2.1.1.1 | Xác nhận đã lưu                           | Model trả kết quả                 |
| 2.1.2   | Trả về kết quả thành công                 | Controller trả về View            |
| 2.1.2.1 | Hiển thị thông báo đã lưu vào thư mục     | View hiển thị thông báo           |

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
