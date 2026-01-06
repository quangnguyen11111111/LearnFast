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

**Tài liệu này cập nhật lần cuối**: 06/01/2026
