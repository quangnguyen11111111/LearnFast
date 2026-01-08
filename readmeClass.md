# LearnFast - Biểu đồ Class Diagram (PlantUML)

Tài liệu này mô tả chi tiết các class, attributes và methods cho từng chức năng chính của ứng dụng LearnFast sử dụng định dạng PlantUML.

---

## 📋 Mục lục

1. [Authentication (Xác thực)](#authentication)
2. [Create Lesson (Tạo bài học)](#create-lesson)
3. [Flashcard (Thẻ ghi nhớ)](#flashcard)
4. [Test Exam (Bài kiểm tra)](#test-exam)
5. [Blocks Game (Trò chơi xếp khối)](#blocks-game)
6. [Card Matching (Ghép cặp)](#card-matching)
7. [Library Management (Quản lý thư viện)](#library-management)
8. [Learning Progress (Theo dõi tiến độ)](#learning-progress)

---

## Authentication

### Chức năng: Đăng nhập / Đăng ký / Quản lý phiên

```plantuml
@startuml
skinparam classAttributeIconSize 0

class User {
  - userID: String
  - email: String
  - username: String
  - userPhone: String
  - avatar: String
  - refreshToken: String
  + getUserInfo(): User
  + updateProfile(): void
}

class AuthSlice {
  - user: User
  - loading: boolean
  - accessToken: String
  - error: String
  - errCode: int
  - message: String
  + logout(): void
  + loginWithGoogleAccount(payload): void
  + loginWithLocalAccount(payload): void
  + refreshToken(token): void
  + registerLocalAccount(payload): void
}

class AuthAPI {
  + loginLocalApi(data): Promise
  + loginWithGoogleApi(data): Promise
  + refreshTokenApi(token): Promise
  + registerLocalApi(data): Promise
}

AuthSlice "1" -- "1" User : manages
AuthSlice ..> AuthAPI : calls

@enduml
```

---

## Create Lesson

### Chức năng: Tạo bài học / Tạo flashcard bằng AI

```plantuml
@startuml
skinparam classAttributeIconSize 0

class Lesson {
  - id: String
  - title: String
  - description: String
  - sourceLang: String
  - targetLang: String
  - visibility: Visibility
}

class LessonItem {
  - source: String
  - target: String
  - index: int
  + getSource(): String
  + setSource(value): void
  + getTarget(): String
  + setTarget(value): void
}

class useCreateLesson {
  - title: String
  - description: String
  - lessonItems: LessonItem[]
  - globalSourceLang: String
  - globalTargetLang: String
  - visibility: Visibility
  - isLoading: boolean
  - isAIGenerating: boolean
  - isAIModalOpen: boolean
  + setTitle(value): void
  + setDescription(value): void
  + handleItemChange(index, key, value): void
  + handleAddItem(): void
  + handleDeleteItem(index): void
  + handleAIGenerate(data): void
  + handleSubmitCreateLesson(): void
  + setVisibility(visibility): void
}

class FileAPI {
  + createFileApi(payload): Promise
  + aiGenerateFlashcardsApi(data): Promise
}

Lesson "1" *-- "*" LessonItem
useCreateLesson "1" -- "*" LessonItem
useCreateLesson ..> FileAPI : calls

@enduml
```

---

## Flashcard

### Chức năng: Học thẻ ghi nhớ / Đánh dấu đã biết - chưa biết

```plantuml
@startuml
skinparam classAttributeIconSize 0

class FlashcardItem {
  - id: String
  - source: String
  - target: String
  - status: int
  + getId(): String
  + getSource(): String
  + getTarget(): String
  + getStatus(): int
  + setStatus(status): void
}

note right of FlashcardItem::status
  0: chưa phân loại
  1: đã biết
  2: chưa biết
end note

class useFlashcards {
  - cards: FlashcardItem[]
  - onProgress: boolean
  - knownCount: int
  - unknownCount: int
  - isNavigationPage: boolean
  - demo: boolean
  + toggleProgress(): void
  + markKnown(id): void
  + markUnknown(id): void
  + resetStatuses(): void
  + setIsNavigationPage(value): void
  + getKnownPercentage(): int
}

useFlashcards "1" -- "*" FlashcardItem : manages

@enduml
```

---

## Test Exam

### Chức năng: Kiểm tra Đúng/Sai, Trắc nghiệm, Tự luận

```plantuml
@startuml
skinparam classAttributeIconSize 0

class Question {
  - id: String
  - source: String
  - target: String
  - status: int
  - statusMode: int
  + getId(): String
  + getSource(): String
  + getTarget(): String
  + getStatus(): int
  + getStatusMode(): int
}

class TrueFalseItem {
  - displayTarget: String
  - isCorrect: boolean
  + getDisplayTarget(): String
  + getIsCorrect(): boolean
}

class UserAnswer {
  - id: String
  - mode: Mode
  - userAnswer: String
  - isCorrect: boolean
  - refDivMain: HTMLDivElement
  + getId(): String
  + getMode(): Mode
  + getUserAnswer(): String
  + getIsCorrect(): boolean
}

class useTestExam {
  - ORIGINAL_DATA: Question[]
  - batchSize: int
  - isTestTrueFalse: boolean
  - isTestMultiple: boolean
  - isTestEssay: boolean
  - countEnabled: int
  - dividedData: DividedData
  - multipleOptions: String[][]
  - userAnswers: UserAnswer[]
  - selectedAnswers: Map<String, String>
  - isEndTest: boolean
  - isOpenSetup: boolean
  - isOpenSummary: boolean
  + setBatchSize(value): void
  + setIsTestTrueFalse(value): void
  + setIsTestMultiple(value): void
  + setIsTestEssay(value): void
  + handleSelectAnswer(id, mode, answer, correctAnswer, refDivMain): void
  + handleSubmitEndTest(): void
  + formatTime(): String
  + startTimer(): void
  + stopTimer(): void
  + resetTimer(): void
  + setIsOpenSetup(value): void
  + handleSubmitSetupTest(): void
  + setIsOpenSummary(value): void
  + handleNext(index, ref, answered, mode): void
  + getQuestionCountByMode(): Object
}

useTestExam "1" -- "*" Question : uses
useTestExam "1" -- "*" TrueFalseItem : generates
useTestExam "1" -- "*" UserAnswer : stores

@enduml
```

---

## Blocks Game

### Chức năng: Trò chơi xếp khối kết hợp Q&A

```plantuml
@startuml
skinparam classAttributeIconSize 0

class BlockInstance {
  - id: String
  - type: int
  - rotation: int
  - poolX: int
  - poolY: int
  - cells: int[][]
  + getId(): String
  + getType(): int
  + getRotation(): int
  + getCells(): int[][]
  + setRotation(rotation): void
}

class BoardState {
  - grid: int[][]
  - width: int
  - height: int
  + getGrid(): int[][]
  + setGrid(grid): void
  + getWidth(): int
  + getHeight(): int
}

class DragState {
  - blockId: String
  - offsetX: int
  - offsetY: int
  + getBlockId(): String
  + getOffsetX(): int
  + getOffsetY(): int
}

class GameQuestion {
  - id: String
  - topic: String
  - options: String[]
  - correctAnswer: String
  + getId(): String
  + getTopic(): String
  + getOptions(): String[]
  + getCorrectAnswer(): String
}

class useBlocksGame {
  - isSetUpGame: boolean
  - board: BoardState
  - blocks: BlockInstance[]
  - dragState: DragState
  - score: int
  - bestScore: int
  - gameOver: boolean
  - clearedLines: Object
  - moveSummary: MoveSummary
  - boardMetrics: BoardMetrics
  - poolCellSize: int
  - questionMode: boolean
  - currentQuestion: GameQuestion
  - wrongAttempts: int
  - answerState: String
  + handleDragStart(blockId, x, y): void
  + handleDragMove(x, y): void
  + handleDragEnd(): void
  + handlePlaceBlock(): void
  + handleResetGame(): void
  + handleAnswerQuestion(answer): void
  + handleNextQuestion(): void
  + calculateScore(): int
  + saveBestScore(): void
  + setupGame(): void
}

class BlocksGameUtils {
  + createEmptyBoard(): BoardState
  + generateBlockSet(): BlockInstance[]
  + canPlaceBlock(board, block, x, y): boolean
  + applyPlacement(board, block, x, y): BoardState
  + computeScore(clearedLines): int
  + hasAnyValidPlacement(board, block): boolean
}

useBlocksGame "1" -- "1" BoardState : has
useBlocksGame "1" -- "*" BlockInstance : manages
useBlocksGame "1" -- "0..1" DragState : tracks
useBlocksGame "1" -- "0..1" GameQuestion : displays
useBlocksGame ..> BlocksGameUtils : uses

@enduml
```

---

## Card Matching

### Chức năng: Trò chơi ghép cặp thẻ / Xếp hạng

```plantuml
@startuml
skinparam classAttributeIconSize 0

class MatchingQuestion {
  - id: String
  - source: String
  - target: String
  + getId(): String
  + getSource(): String
  + getTarget(): String
}


class SummaryItem {
  - rank: int
  - userID: String
  - ownerAvatar: String
  - ownerName: String
  - pointCardMatching: int
  + getRank(): int
  + getUserID(): String
  + getOwnerAvatar(): String
  + getOwnerName(): String
  + getPointCardMatching(): int
}

class useCardMatching {
  - cards: MatchingQuestion[]
  - matchedPairs: int
  - attempts: int
  - isGameOver: boolean
  - score: int
  - rankings: SummaryItem[]
  + handleCardSelect(cardId): void
  + handleMatch(card1, card2): void
  + resetGame(): void
  + submitScore(): void
  + fetchRankings(): void
}

useCardMatching "1" -- "*" MatchingQuestion : manages
useCardMatching "1" -- "*" SummaryItem : fetches

@enduml
```

---

## Library Management

### Chức năng: Quản lý thư mục / File / Phân trang / Tìm kiếm

```plantuml
@startuml
skinparam classAttributeIconSize 0

class IFile {
  - fileID: String
  - fileName: String
  - totalWords: int
  - creatorID: String
  - openedAt: String
  - createdAt: String
  - ownerName: String
  - ownerAvatar: String
  - accessCount: int
  - visibility: String
  + getFileID(): String
  + getFileName(): String
  + getTotalWords(): int
  + getCreatorID(): String
  + getOwnerName(): String
  + getVisibility(): String
}

class Pagination {
  - total: int
  - page: int
  - limit: int
  - pageCount: int
  + getTotal(): int
  + getPage(): int
  + getLimit(): int
  + getPageCount(): int
}

class Folder {
  - folderID: String
  - folderName: String
  - creatorID: String
  - createdAt: String
  - updatedAt: String
  + getFolderID(): String
  + getFolderName(): String
  + setFolderName(name): void
  + getCreatorID(): String
}

class useUserFiles {
  - files: IFile[]
  - groupedFiles: IFile[]
  - isLoading: boolean
  - hasMore: boolean
  - currentPage: int
  - filterType: String
  - searchQuery: String
  + setFilterType(type): void
  + setSearchQuery(query): void
  + loadMore(): void
  + fetchFiles(page, isInitial): void
  + groupFilesByMonth(): Object
  + filterFilesBySearch(): IFile[]
}

class useFolderManagement {
  - folderID: String
  - folderName: String
  - isEditModalOpen: boolean
  - newFolderName: String
  - isUpdating: boolean
  - isDeleting: boolean
  + setNewFolderName(name): void
  + openEditModal(): void
  + handleUpdateFolderName(): void
  + deleteFolder(): Promise
  + setIsEditModalOpen(value): void
}

class FileThunk {
  + getUserFilesThunk(payload): Promise
  + getRecentFilesThunk(payload): Promise
  + getFileDetailThunk(fileID): Promise
  + getSimilarFilesThunk(payload): Promise
  + getTop6FilesThunk(userID): Promise
}

class FolderThunk {
  + updateFolderNameThunk(payload): Promise
  + deleteFolderThunk(payload): Promise
  + createFolderThunk(payload): Promise
  + getFoldersThunk(userID): Promise
}

useUserFiles "1" -- "*" IFile : manages
useUserFiles "1" -- "1" Pagination : uses
useFolderManagement "1" -- "1" Folder : manages
useUserFiles ..> FileThunk : calls
useFolderManagement ..> FolderThunk : calls

@enduml
```

---

## Learning Progress

### Chức năng: Theo dõi tiến độ học tập / Đồng bộ dữ liệu

```plantuml
@startuml
skinparam classAttributeIconSize 0

class ProgressData {
  - userID: String
  - fileID: String
  - itemID: String
  - status: int
  - mode: String
  - timestamp: long
  + getUserID(): String
  + getFileID(): String
  + getItemID(): String
  + getStatus(): int
  + getMode(): String
  + getTimestamp(): long
}

note right of ProgressData::mode
  'flashcard'
   'test'
    'matching' | ...
end note

class SyncResult {
  - errCode: int
  - message: String
  - lastSyncTime: String
  + getErrCode(): int
  + getMessage(): String
  + getLastSyncTime(): String
}

class useProgressSync {
  - syncStatus: String
  - lastSyncTime: Date
  - pendingUpdates: Update[]
  - isSyncing: boolean
  + syncProgress(data): void
  + markAsLearned(fileID, itemID): void
  + markAsFailed(fileID, itemID): void
  + getSyncStatus(): String
  + retryFailedSync(): void
  + clearSyncHistory(): void
}

class ProgressAPI {
  + syncProgressApi(payload): Promise
  + getProgressApi(userID): Promise
  + updateProgressApi(fileID, data): Promise
}

useProgressSync "1" -- "*" ProgressData : tracks
useProgressSync "1" -- "1" SyncResult : receives
useProgressSync ..> ProgressAPI : calls

@enduml
```

---

## 📊 Tổng quan Kiến trúc

```plantuml
@startuml
skinparam classAttributeIconSize 0
skinparam packageStyle rectangle

package "Presentation Layer" {
  class Components {
    Header
    Sidebar
    Modal
    Button
    ...
  }
}

package "Container Layer" {
  class Pages {
    learnLessonPage
    testPage
    flashCardPage
    blocksGamePage
    ...
  }
}

package "Logic Layer" {
  class Hooks {
    useFlashcards
    useTestExam
    useBlocksGame
    useCardMatching
    ...
  }
}

package "State Management Layer" {
  class ReduxSlices {
    authSlice
    fileSlice
    folderSlice
    ...
  }
}

package "Service Layer" {
  class APIs {
    authAPI
    fileAPI
    folderAPI
    ...
  }
}

package "HTTP Client" {
  class AxiosClient {
    interceptors
    baseURL
    headers
  }
}

Components --> Pages
Pages --> Hooks
Hooks --> ReduxSlices
ReduxSlices --> APIs
APIs --> AxiosClient

@enduml
```

---

## 🔗 Mối liên kết giữa các module

```plantuml
@startuml
skinparam classAttributeIconSize 0

class Flashcard
class CreateLesson
class TestExam
class BlocksGame
class CardMatching
class LibraryManage
class LearningProgress
class FileData
class Auth

Flashcard --> FileData : uses
CreateLesson --> FileData : creates
TestExam --> FileData : uses
BlocksGame --> FileData : uses
CardMatching --> FileData : uses
LibraryManage --> Auth : manages
LearningProgress --> FileData : syncs

@enduml
```

---

## 📊 Biểu đồ lớp tổng quan dự án (Entity Diagram)

### Mô hình dữ liệu chính của hệ thống LearnFast

```plantuml
@startuml
skinparam classAttributeIconSize 0
skinparam linetype ortho
skinparam class {
  BackgroundColor #ADD8E6
  BorderColor #000080
  ArrowColor #000080
}

title LearnFast - Class Diagram

' ==================== ENTITY CLASSES ====================

class Account {
  -id: int
  -userID: int
  -availableAttempts: int
  -createdAt: DateTime
  -updatedAt: DateTime
  --
  +getAvailableAttemptsAccounts()
}

class User {
  -id: int
  -username: String
  -email: String
  -passwordHash: String
  -role: String
  -otpCode: String
  -otpExpiresAt: DateTime
  --
  +Login()
  +loginWithGoogle()
  +resetPassword()
}

class File {
  -fileID: int
  -fileName: String
  -description: String
  -visibility: String
  -totalWords: int
  -creatorID: int
  -isPublished: boolean
  --
  +createFile()
  +getAllFiles()
  +getFileById()
  +updateFile()
  +deleteFile()
  +generateFileAI()
  +searchFiles()
}

class FileDetail {
  -detailID: int
  -fileID: int
  -source: String
  -target: String
  -flashcardState: int
  -quizState: int
  --
  +createDetail()
  +updateDetail()
  +deleteDetail()
  +getDetailsByFile()
}

class Folder {
  -folderID: int
  -folderName: String
  -userID: int
  -totalTerms: int
  -createdAt: DateTime
  --
  +createFolder()
  +updateFolderName()
  +deleteFolder()
  +searchFolders()
}

class Folder_Items {
  -id: int
  -folderID: int
  -fileID: int
  -addedAt: DateTime
  --
  +addFileToFolder()
  +removeFileFromFolder()
  +getFilesByFolder()
}

class Learning_Progress {
  -progressID: int
  -userID: int
  -fileID: int
  -detailID: int
  -flashcardState: int
  -quizState: int
  -startAt: DateTime
  -endAt: DateTime
  --
  +getProgressByFile()
  +updateProgress()
  +syncProgress()
  +getProgressSummary()
}

class User_File_History {
  -historyID: int
  -userID: int
  -fileID: int
  -gameType: String
  -score: double
  -timeSpent: int
  -completedAt: DateTime
  --
  +recordScore()
  +getBestScore()
  +getHistoryByUser()
  +getRankings()
}

class AIGenerateService {
  --
  +generateFlashcardsFromTopic(topic): FileDetail[]
}

class GoogleOAuthGateway {
  --
  +authenticateWithGoogle(idToken): User
  +processCallback(requestData): User
}

' ==================== RELATIONSHIPS ====================

Account "1" -- "1" User
User "1" -- "0..*" File : creates >
User "1" -- "0..*" Folder : owns >
User "1" -- "0..*" Learning_Progress : has >
User "1" -- "0..*" User_File_History : records >

File "1" -- "0..*" FileDetail : contains >
File "0..*" -- "0..*" Folder_Items : belongs to >
Folder "1" -- "0..*" Folder_Items : contains >

File "1" -- "0..*" Learning_Progress : tracked by >
File "1" -- "0..*" User_File_History : scored in >
FileDetail "1" -- "0..*" Learning_Progress : progress of >

File ..> AIGenerateService : uses
User ..> GoogleOAuthGateway : authenticates

@enduml
```

### Biểu đồ lớp chi tiết (Detailed Class Diagram)

```plantuml
@startuml
skinparam classAttributeIconSize 0
skinparam linetype ortho
skinparam class {
  BackgroundColor #ADD8E6
  BorderColor #000080
  ArrowColor #000080
}
skinparam note {
  BackgroundColor #FFFFCC
  BorderColor #000080
}

title LearnFast - Detailed Class Diagram

' ==================== USER MANAGEMENT ====================

class Account {
  -id: int <<PK>>
  -userID: int <<FK>>
  -availableAttempts: int
  -createdAt: DateTime
  -updatedAt: DateTime
  --
  +getAvailableAttemptsAccounts(): int
}

class User {
  -id: int <<PK>>
  -username: String
  -email: String <<unique>>
  -passwordHash: String
  -avatar: String
  -role: String
  -refreshToken: String
  -otpCode: String
  -otpExpiresAt: DateTime
  --
  +Login(): AuthResponse
  +loginWithGoogle(): AuthResponse
  +resetPassword(): void
  +updateProfile(): void
  +validatePassword(password): boolean
}

' ==================== FILE MANAGEMENT ====================

class File {
  -fileID: int <<PK>>
  -fileName: String
  -description: String
  -visibility: String
  -totalWords: int
  -accessCount: int
  -creatorID: int <<FK>>
  -isPublished: boolean
  -createdAt: DateTime
  -updatedAt: DateTime
  --
  +createFile(): File
  +getAllFiles(): File[]
  +getFileById(): File
  +updateFile(): File
  +deleteFile(): void
  +generateFileAI(): File
  +searchFiles(): File[]
  +incrementAccessCount(): void
}

class FileDetail {
  -detailID: int <<PK>>
  -fileID: int <<FK>>
  -source: String
  -target: String
  -flashcardState: int
  -quizState: int
  -createdAt: DateTime
  --
  +createDetail(): FileDetail
  +updateDetail(): FileDetail
  +deleteDetail(): void
  +getDetailsByFile(): FileDetail[]
}

note right of FileDetail
  flashcardState:
    0: chưa học
    1: đã biết
  quizState:
    0: chưa học
    1: qua trắc nghiệm
    2: qua tự luận
    3: hoàn thành
end note

' ==================== FOLDER MANAGEMENT ====================

class Folder {
  -folderID: int <<PK>>
  -folderName: String
  -userID: int <<FK>>
  -totalTerms: int
  -createdAt: DateTime
  -updatedAt: DateTime
  --
  +createFolder(): Folder
  +updateFolderName(): Folder
  +deleteFolder(): void
  +searchFolders(): Folder[]
  +getTotalTerms(): int
}

class Folder_Items {
  -id: int <<PK>>
  -folderID: int <<FK>>
  -fileID: int <<FK>>
  -addedAt: DateTime
  --
  +addFileToFolder(): void
  +removeFileFromFolder(): void
  +getFilesByFolder(): File[]
}

' ==================== LEARNING & HISTORY ====================

class Learning_Progress {
  -progressID: int <<PK>>
  -userID: int <<FK>>
  -fileID: int <<FK>>
  -detailID: int <<FK>>
  -flashcardState: int
  -quizState: int
  -startAt: DateTime
  -endAt: DateTime
  -lastAccessedAt: DateTime
  --
  +getProgressByFile(): Learning_Progress[]
  +updateProgress(): void
  +syncProgress(): SyncResult
  +getProgressSummary(): ProgressSummary
}

class User_File_History {
  -historyID: int <<PK>>
  -userID: int <<FK>>
  -fileID: int <<FK>>
  -gameType: String
  -score: double
  -timeSpent: int
  -questionsAnswered: String
  -completedAt: DateTime
  --
  +recordScore(): void
  +getBestScore(): double
  +getHistoryByUser(): User_File_History[]
  +getRankings(): RankingItem[]
}

note right of User_File_History
  gameType:
    - blocksGame
    - cardMatching
    - test
    - flashcard
end note

' ==================== EXTERNAL SERVICES ====================

class AIGenerateService <<service>> {
  --
  +generateFlashcardsFromTopic(topic, count, sourceLang, targetLang): FileDetail[]
}

class GoogleOAuthGateway <<service>> {
  --
  +authenticateWithGoogle(idToken): User
  +processCallback(requestData): AuthResponse
}

' ==================== RELATIONSHIPS ====================

Account "1" -right- "1" User

User "1" -- "0..*" File : creates >
User "1" -- "0..*" Folder : owns >
User "1" -- "0..*" Learning_Progress : has >
User "1" -- "0..*" User_File_History : records >

File "1" -- "0..*" FileDetail : contains >
File "0..*" -down- "0..*" Folder_Items : belongs to >
Folder "1" -- "0..*" Folder_Items : contains >

File "1" -- "0..*" Learning_Progress : tracked by >
File "1" -- "0..*" User_File_History : scored in >
FileDetail "1" -- "0..*" Learning_Progress : progress of >

File ..> AIGenerateService : uses
User ..> GoogleOAuthGateway : authenticates

@enduml
```

### Bảng mô tả các Entity

| Entity                | Mô tả                                        | Quan hệ chính                                   |
| --------------------- | -------------------------------------------- | ----------------------------------------------- |
| **Users**             | Quản lý thông tin người dùng                 | Tạo File, Folder, Learning_Progress, History    |
| **File**              | Bài học/Học phần chứa các thuật ngữ          | Thuộc Users, chứa FileDetail                    |
| **FileDetail**        | Chi tiết từng thuật ngữ trong bài học        | Thuộc File, được theo dõi bởi Learning_Progress |
| **Folder**            | Thư mục để tổ chức các bài học               | Thuộc Users, chứa nhiều File qua Folder_Items   |
| **Folder_Items**      | Bảng trung gian liên kết Folder và File      | Liên kết N-N giữa Folder và File                |
| **Learning_Progress** | Tiến độ học tập của user trên từng thuật ngữ | Thuộc Users, theo dõi FileDetail                |
| **User_File_History** | Lịch sử điểm số và thời gian hoàn thành      | Thuộc Users, ghi nhận điểm trên File            |

### Biểu đồ quan hệ (Cardinality)

```plantuml
@startuml
skinparam classAttributeIconSize 0

title LearnFast - Entity Relationship Diagram (ERD)

entity "Users" as users {
  * userID : String <<PK>>
  --
  email : String <<unique>>
  username : String
  password : String
  avatar : String
  refreshToken : String
}

entity "File" as file {
  * fileID : String <<PK>>
  --
  * creatorID : String <<FK>>
  fileName : String
  description : String
  visibility : enum
  totalWords : int
}

entity "FileDetail" as filedetail {
  * detailID : String <<PK>>
  --
  * fileID : String <<FK>>
  * creatorID : String <<FK>>
  source : String
  target : String
  flashcardState : int
  quizState : int
}

entity "Folder" as folder {
  * folderID : String <<PK>>
  --
  * userID : String <<FK>>
  folderName : String
  totalTerms : int
}

entity "Folder_Items" as folder_items {
  * id : String <<PK>>
  --
  * folderID : String <<FK>>
  * fileID : String <<FK>>
  addedAt : DateTime
}

entity "Learning_Progress" as progress {
  * progressID : String <<PK>>
  --
  * userID : String <<FK>>
  * fileID : String <<FK>>
  * detailID : String <<FK>>
  flashcardState : int
  quizState : int
}

entity "User_File_History" as history {
  * historyID : String <<PK>>
  --
  * userID : String <<FK>>
  * fileID : String <<FK>>
  gameType : enum
  score : int
  timeSpent : int
}

users ||--o{ file : "creates"
users ||--o{ folder : "owns"
users ||--o{ progress : "has"
users ||--o{ history : "records"

file ||--o{ filedetail : "contains"
file ||--o{ folder_items : "belongs to"
file ||--o{ progress : "tracked by"
file ||--o{ history : "scored in"

folder ||--o{ folder_items : "contains"

filedetail ||--o{ progress : "progress of"

@enduml
```

### Biểu đồ lớp theo kiến trúc Frontend (MVC Pattern)

```plantuml
@startuml
skinparam classAttributeIconSize 0
skinparam packageStyle rectangle

title LearnFast Frontend - MVC Architecture

package "View Layer (React Components)" <<Frame>> {

  package "Pages" {
    class AuthPage <<boundary>> {
      + LoginPage
      + RegisterPage
    }

    class LessonPage <<boundary>> {
      + CreateLessonPage
      + LearnLessonPage
      + EditLessonPage
    }

    class LearnPage <<boundary>> {
      + FlashCardPage
      + TestPage
      + BlocksGamePage
      + CardMatchingPage
    }

    class LibraryPage <<boundary>> {
      + LessonLibraryPage
      + FolderLibraryPage
      + FolderDetailPage
    }
  }

  package "Shared Components" {
    class UIComponents <<boundary>> {
      + Button
      + Input
      + Modal
      + Loading
      + Header
      + Sidebar
    }

    class LearnComponents <<boundary>> {
      + Flashcard
      + MultipleChoice
      + Essay
      + TestResult
      + ScoreCard
    }
  }
}

package "Controller Layer (Custom Hooks)" <<Frame>> {

  class useCreateLesson <<control>> {
    - title: String
    - lessonItems: LessonItem[]
    - isLoading: boolean
    + handleSubmitCreateLesson()
    + handleAIGenerate()
    + handleItemChange()
  }

  class useFlashcards <<control>> {
    - cards: FlashcardItem[]
    - knownCount: int
    - unknownCount: int
    + markKnown(id)
    + markUnknown(id)
    + resetStatuses()
  }

  class useTestExam <<control>> {
    - dividedData: DividedData
    - userAnswers: UserAnswer[]
    - isEndTest: boolean
    + handleSelectAnswer()
    + handleSubmitEndTest()
    + handleSubmitSetupTest()
  }

  class useBlocksGame <<control>> {
    - blocks: Block[]
    - score: int
    - gameState: GameState
    + moveBlock()
    + rotateBlock()
    + checkLine()
  }

  class useCardMatching <<control>> {
    - cards: MatchingCard[]
    - matchedPairs: int
    - flippedCards: String[]
    + flipCard()
    + checkMatch()
    + resetGame()
  }

  class useFolderManagement <<control>> {
    - folders: IFolder[]
    - isLoading: boolean
    + createFolder()
    + updateFolder()
    + deleteFolder()
  }

  class useProgressSync <<control>> {
    - progressData: ProgressData[]
    - isSyncing: boolean
    + syncProgress()
    + updateLocalProgress()
  }
}

package "Model Layer (Redux State)" <<Frame>> {

  class AuthSlice <<entity>> {
    - user: User
    - accessToken: String
    - loading: boolean
    + loginWithGoogleAccount()
    + loginWithLocalAccount()
    + registerLocalAccount()
    + logout()
  }

  class FileSlice <<entity>> {
    - filesRecent: IFile[]
    - filesTop6: IFile[]
    - fileDetail: FileDetail[]
    - ownerInfo: IOwnerInfo
    + getRecentFiles()
    + getFileDetail()
    + updateGameProgress()
  }

  class FolderSlice <<entity>> {
    - folders: IFolder[]
    - folderFiles: IFolderFile[]
    - pagination: Pagination
    + getUserFolders()
    + getFolderFiles()
    + createFolder()
  }
}

package "Service Layer (API Calls)" <<Frame>> {

  class AuthAPI <<service>> {
    + loginLocalApi()
    + loginWithGoogleApi()
    + registerLocalApi()
    + refreshTokenApi()
  }

  class FileAPI <<service>> {
    + createFileApi()
    + updateFileApi()
    + deleteFileApi()
    + getFileDetailApi()
    + aiGenerateFlashcardsApi()
  }

  class FolderAPI <<service>> {
    + getUserFoldersApi()
    + getFolderFilesApi()
    + createFolderApi()
    + addFileToFolderApi()
    + removeFileFromFolderApi()
  }

  class AxiosClient <<service>> {
    - baseURL: String
    - interceptors: Object
    + get()
    + post()
    + put()
    + delete()
  }
}

' ==================== RELATIONSHIPS ====================

' View -> Controller
AuthPage ..> AuthSlice : uses
LessonPage ..> useCreateLesson : uses
LearnPage ..> useFlashcards : uses
LearnPage ..> useTestExam : uses
LearnPage ..> useBlocksGame : uses
LearnPage ..> useCardMatching : uses
LibraryPage ..> useFolderManagement : uses

' Controller -> Model
useCreateLesson ..> FileSlice : dispatches
useFlashcards ..> FileSlice : reads
useTestExam ..> FileSlice : reads
useFolderManagement ..> FolderSlice : dispatches
useProgressSync ..> FileSlice : updates

' Model -> Service
AuthSlice ..> AuthAPI : calls
FileSlice ..> FileAPI : calls
FolderSlice ..> FolderAPI : calls

' Service -> HTTP Client
AuthAPI ..> AxiosClient : uses
FileAPI ..> AxiosClient : uses
FolderAPI ..> AxiosClient : uses

@enduml
```

### Bảng mô tả kiến trúc MVC

| Layer          | Thành phần        | Vai trò                                        |
| -------------- | ----------------- | ---------------------------------------------- |
| **View**       | Pages, Components | Hiển thị giao diện, nhận input từ người dùng   |
| **Controller** | Custom Hooks      | Xử lý logic nghiệp vụ, điều phối luồng dữ liệu |
| **Model**      | Redux Slices      | Quản lý state, lưu trữ dữ liệu ứng dụng        |
| **Service**    | API modules       | Gọi API backend, xử lý HTTP requests           |

---

**Tài liệu này cập nhật lần cuối**: 08/01/2026
