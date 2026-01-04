import { useState, useEffect } from 'react'
import type { Question } from './types'
import { getRandomItems, shuffleArray } from '~/utils/testUtils'
import { useTimer } from '~/utils/coutTime'
import { updateGameProgressThunk,getTopUsersThunk } from '~/features/api/file/fileThunk'
import { useAppDispatch } from '~/store/hook'
// Hàm tách dữ liệu thành mảng gồm các object riêng biệt: { id, source } và { id, target }
const getCardPairs = (data: Question[]) => {
  const pairs: Array<{ id: string; data?: string }> = []
  data.forEach((item: Question) => {
    pairs.push({ id: item.id, data: item.source })
    pairs.push({ id: item.id, data: item.target })
  })
  return pairs
}

export default function useCardMatching(
  initialData: Question[],
  sizeCard = 6,
  userID?: string,
  fileID?: string,
  mode?: 'pointBlockGame' | 'pointCardMatching',
  point?: number
) {
  const [dataRandom, setDataRandom] = useState<Question[]>([])

  const [cardPairs, setCardPairs] = useState<Array<{ id: string; data?: string }>>([])

  // State quản lý các thẻ đang được chọn
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])

  // State quản lý các thẻ đã ghép đúng
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set())

  // State quản lý các thẻ bị shake (khi ghép sai)
  const [shakeIndices, setShakeIndices] = useState<number[]>([])

  // State quản lý trạng thái setup game
  const [isSetUpGame, setIsSetUpGame] = useState<boolean>(true)

  // State quản lý trạng thái mở summary
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)

  const dispatch = useAppDispatch()

  // Hook timer để đếm thời gian
  const { startTimer, stopTimer, resetTimer, formatTime, increaseTime, time } = useTimer()

  // Cập nhật bộ dữ liệu khi initialData thay đổi (sau khi tải API)
  useEffect(() => {
    if (!initialData || initialData.length === 0) return

    const randomData = getRandomItems(initialData, sizeCard)
    setDataRandom(randomData)
    setCardPairs(shuffleArray(getCardPairs(randomData)))

    // Reset trạng thái ván chơi khi nhận dữ liệu mới
    setMatchedIds(new Set())
    setSelectedIndices([])
    setShakeIndices([])
    setIsSetUpGame(true)
    setIsSummaryOpen(false)
    resetTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, sizeCard])

  // Hàm xử lý khi người dùng chọn một thẻ
  const handleSelect = (idx: number) => {
    if (cardPairs.length === 0) return
    // Nếu đã matched thì không cho chọn nữa
    if (matchedIds.has(cardPairs[idx].id)) return

    // Nếu đã chọn thẻ này rồi → bỏ chọn
    if (selectedIndices.includes(idx)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== idx))
      return
    }

    const nextSelected = [...selectedIndices, idx].slice(-2) // chỉ giữ 2 lựa chọn
    setSelectedIndices(nextSelected)

    // Khi đủ 2 thẻ → kiểm tra logic
    if (nextSelected.length === 2) {
      const [first, second] = nextSelected
      const isMatch = cardPairs[first].id === cardPairs[second].id

      if (isMatch) {
        // đúng → lưu id đã match
        setTimeout(() => {
          setMatchedIds((prev) => {
            const newMatched = new Set([...prev, cardPairs[first].id])
            // Nếu đã ghép đúng tất cả thẻ → dừng timer
            if (newMatched.size === dataRandom.length) {
              stopTimer()
              if (userID && fileID && mode) {
                dispatch(
                  updateGameProgressThunk({
                    userID: userID,
                    fileID: fileID,
                    point: time,
                    mode: mode
                  })
                )
                  .unwrap()
                  .then((payload) => {
                    if (payload.errCode === 0) {
                      dispatch(
                        getTopUsersThunk({
                          fileID,
                          userID
                        })
                      )
                      console.log('kiểm tra payload: ', payload);
                      
                    }
                  })
                  .catch((err) => {
                    console.error(err)
                  })
              }
              setIsSummaryOpen(true)
              // cập nhật điểm người dùng
            }
            return newMatched
          })
        }, 100)
        // xóa selected sau một chút để animation đẹp hơn
        setSelectedIndices([])
      } else {
        // sai → tạo shake
        setShakeIndices([first, second])
        increaseTime() // tăng thời gian phạt
        // xóa selected sau animation
        setTimeout(() => {
          setShakeIndices([])
          setSelectedIndices([])
        }, 600)
      }
    }
  }

  // Hàm xử lý setup game
  const handleSetUp = () => {
    startTimer()
    setTimeout(() => {
      setIsSetUpGame(false)
    }, 500)
  }

  // Lấy thời gian đã format
  const timeSubmit = formatTime()

  // hàm reset lại game
  const resetGame = () => {
    setIsSetUpGame(true)
    setMatchedIds(new Set())
    setSelectedIndices([])
    setIsSummaryOpen(false)
    resetTimer()
  }

  return {
    cardPairs,
    selectedIndices,
    matchedIds,
    shakeIndices,
    isSetUpGame,
    timeSubmit,
    handleSelect,
    handleSetUp,
    stopTimer,
    resetTimer,
    time,
    isSummaryOpen,
    resetGame,
    setIsSummaryOpen
  }
}
