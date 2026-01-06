import { LANGUAGES } from './constants'

/* ------------------ Language Selector ------------------ */
export interface LanguageSelectorProps {
  sourceLang: string
  targetLang: string
  onSourceLangChange: (value: string) => void
  onTargetLangChange: (value: string) => void
}

const LanguageSelector = ({
  sourceLang,
  targetLang,
  onSourceLangChange,
  onTargetLangChange
}: LanguageSelectorProps) => {
  return (
    <div className='mt-5 p-4 bg-gray-50 rounded-xl border border-gray-200'>
      <p className='text-sm font-semibold text-gray-600 mb-3'>Ngôn ngữ chung cho tất cả thẻ</p>
      <div className='grid grid-cols-2 max-md:grid-cols-1 gap-4'>
        {/* Source Language */}
        <div className='flex items-center gap-3'>
          <label className='text-sm font-medium text-gray-700 whitespace-nowrap'>Thuật ngữ:</label>
          <select
            value={sourceLang}
            onChange={(e) => onSourceLangChange(e.target.value)}
            className='flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm'
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Target Language */}
        <div className='flex items-center gap-3'>
          <label className='text-sm font-medium text-gray-700 whitespace-nowrap'>Định nghĩa:</label>
          <select
            value={targetLang}
            onChange={(e) => onTargetLangChange(e.target.value)}
            className='flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm'
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default LanguageSelector
