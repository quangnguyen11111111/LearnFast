export type Question = {
  id: string
  source: string // prompt shown (e.g. English + phonetic)
  target: string // expected typed answer (e.g. Vietnamese)
}

export const QUESTIONS: Question[] = [
  { id: 'q1', source: 'Oven gloves /ˈʌvn glʌvz/', target: 'Găng tay dùng cho lò sưởi' },
  { id: 'q2', source: 'Umbrella /ʌmˈbrɛlə/', target: 'Cái ô' },
  { id: 'q3', source: 'Laptop /ˈlæpˌtɒp/', target: 'Máy tính xách tay' },
  { id: 'q4', source: 'Notebook /ˈnoʊtˌbʊk/', target: 'Sổ tay' },
  { id: 'q5', source: 'Headphones /ˈhɛdˌfoʊnz/', target: 'Tai nghe' },
  { id: 'q6', source: 'Bicycle /ˈbaɪsɪkəl/', target: 'Xe đạp' },
  { id: 'q7', source: 'Backpack /ˈbækˌpæk/', target: 'Ba lô' },
  { id: 'q8', source: 'Calculator /ˈkælkjəˌleɪtər/', target: 'Máy tính' },
  { id: 'q9', source: 'Teapot /ˈtiːpɒt/', target: 'Ấm trà' },
  { id: 'q10', source: 'Scissors /ˈsɪzərz/', target: 'Cái kéo' }
]
