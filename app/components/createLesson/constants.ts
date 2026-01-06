/* ------------------ Language Options ------------------ */
export const LANGUAGES = [
  { code: 'english', name: 'Tiếng Anh' },
  { code: 'vietnam', name: 'Tiếng Việt' },
  { code: 'chinese', name: 'Tiếng Trung' },
  { code: 'japanese', name: 'Tiếng Nhật' },
  { code: 'korean', name: 'Tiếng Hàn' },
  { code: 'french', name: 'Tiếng Pháp' },
  { code: 'german', name: 'Tiếng Đức' },
  { code: 'spanish', name: 'Tiếng Tây Ban Nha' },
  { code: 'russian', name: 'Tiếng Nga' },
  { code: 'thai', name: 'Tiếng Thái' }
]

export type Language = (typeof LANGUAGES)[number]
