import type { Question, TrueFalseItem } from '~/features/test/types'

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomItems(arr: Question[], x: number): Question[] {
  const shuffled = shuffleArray(arr)
  return shuffled.slice(0, x)
}

export const getRandomOptions = (correct: string, allSources: string[]): string[] => {
  const options = [correct]
  while (options.length < 4) {
    const random = allSources[Math.floor(Math.random() * allSources.length)]
    if (!options.includes(random)) {
      options.push(random)
    }
  }
  return options.sort(() => Math.random() - 0.5)
}

// Generate True/False data based on a pool to pick wrong targets from
export const generateTrueFalseData = (
  data: Question[],
  pool: Question[],
  trueRatio = 0.4
): TrueFalseItem[] => {
  return data.map((item) => {
    const isCorrect = Math.random() < trueRatio
    if (isCorrect) {
      return { ...item, displayTarget: item.target, isCorrect: true }
    }

    const wrongOptions = pool.filter((d) => d.id !== item.id)
    const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
    return { ...item, displayTarget: randomWrong.target, isCorrect: false }
  })
}
