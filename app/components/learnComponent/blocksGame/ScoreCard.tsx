import React from 'react'

// ScoreCard: Thẻ nhỏ hiển thị chỉ số (điểm, combo, best...) với chấm màu accent
export function ScoreCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className='flex min-w-[120px] flex-col items-start rounded-2xl bg-white/80 px-4 py-3 shadow'>
      <span className='text-xs font-semibold uppercase tracking-wide text-slate-500'>{label}</span>
      <div className='mt-1 flex items-center gap-2'>
        <span className={`h-2 w-2 rounded-full ${accent}`} />
        <span className='text-xl font-bold tabular-nums'>{value}</span>
      </div>
    </div>
  )
}
