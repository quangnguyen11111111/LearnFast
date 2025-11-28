// Question: Kiểu dữ liệu đại diện cho một "đơn vị học" (từ/cụm từ) trong luồng học hỗn hợp.
// Giải thích các thuộc tính:
// - id: định danh duy nhất để theo dõi trạng thái.
// - source: nội dung gốc (EN / từ nguồn) hiển thị cho người học.
// - target: nghĩa/dịch hoặc đáp án đúng cần ghi nhớ.
// - status: mức độ hoặc độ khó (hiện tại dùng như cờ phụ, có thể mở rộng cho thuật toán lặp lại).
// - statusMode: trạng thái tiến trình theo chế độ học:
//     0 = chưa học qua trắc nghiệm
//     1 = đã trả lời đúng ở Trắc nghiệm và chuyển sang Tự luận
//     2 = đã trả lời đúng ở Tự luận (xem như đã củng cố)
// Hook mixed learning sẽ dựa vào statusMode để quyết định câu nào xuất hiện ở chế độ nào.
export interface Question {
  id: string
  source: string
  target: string
  status: number
  statusMode: number // 0: chưa học, 1: qua trắc nghiệm, 2: qua tự luận
}
