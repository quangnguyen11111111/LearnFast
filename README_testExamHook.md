# useTestExam Hook

Hook gom toàn bộ logic trang làm bài kiểm tra (True/False, Multiple Choice, Essay).

## Mục tiêu

- Tách state và xử lý khỏi `testPage.tsx` để giảm độ phình file và tăng khả năng tái sử dụng.
- Dễ mở rộng (thêm lưu kết quả, đồng bộ server, phân trang, v.v.).

## Cách dùng cơ bản

```tsx
import { useTestExam } from '~/features/test/useTestExam'

const {
  ORIGINAL_DATA,
  batchSize,
  setBatchSize,
  isTestTrueFalse,
  setIsTestTrueFalse,
  isTestMultiple,
  setIsTestMultiple,
  isTestEssay,
  setIsTestEssay,
  countEnabled,
  dividedData,
  multipleOptions,
  userAnswers,
  selectedAnswers,
  handleSelectAnswer,
  isEndTest,
  handleSubmitEndTest,
  formatTime,
  startTimer,
  isOpenSetup,
  setIsOpenSetup,
  handleSubmitSetupTest,
  isOpenSummary,
  setIsOpenSummary,
  handleNext,
  refTrueFalse,
  refMultiple,
  refEssay,
  refInputEssay,
  refDivMain,
  refButtonSubmitTest,
  answeredTrueFalse,
  answeredMultiple,
  answeredEssay,
  scrollToTop
} = useTestExam({ initialData })
```

## Tham số

- `initialData: Question[]` dữ liệu đầu vào.
- `defaultBatchSize?: number` tuỳ chọn số câu ban đầu.
- `defaultModes?: { trueFalse?: boolean; multiple?: boolean; essay?: boolean }` bật / tắt mặc định từng chế độ.

## Giá trị trả về chính

- Phân chia dữ liệu: `dividedData.trueFalse | multiple | essay`.
- Sinh đáp án trắc nghiệm: `multipleOptions` (mảng 2D).
- Quản lý chế độ: `isTestTrueFalse / isTestMultiple / isTestEssay` + setters.
- Trả lời: `userAnswers` (chi tiết), `selectedAnswers` (highlight), `handleSelectAnswer()`.
- Điều hướng giữa câu: `handleNext()` (cuộn + focus essay).
- Kết thúc và kiểm tra bỏ sót: `handleSubmitEndTest()`.
- Setup lại toàn bộ test: `handleSubmitSetupTest()`.
- Timer: `startTimer / stopTimer / resetTimer / formatTime`.
- Refs phục vụ scroll / focus: trueFalse, multiple, essay, inputEssay, divMain, buttonSubmit.

## Mở rộng tương lai

- Lưu tiến trình lên server (thêm hàm `syncProgress`).
- Thêm chế độ điền từ (fill-in-the-blank) -> mở rộng type mode & dividedData.
- Hỗ trợ random seed cố định để đảm bảo reproducibility.

## Ghi chú

- Hook không phụ trách render UI hay style.
- Tránh side-effect ngoài phạm vi (ví dụ gọi API) để dễ test.

---

Có thể xoá file README này khi đã nắm rõ hook. Cần thêm gì cứ hỏi.
