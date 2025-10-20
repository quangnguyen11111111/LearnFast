import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cards = [
  { front: "stand near", back: "đứng gần" },
  { front: "run away", back: "chạy trốn" },
  { front: "look for", back: "tìm kiếm" },
];

const Flashcard = () => {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const nextCard = () => {
    if(index==cards.length-1) return
    setDirection(1);
    setIsFlipped(false);
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    if(index==0)return
    setDirection(-1);
    setIsFlipped(false);
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="flex flex-col items-center mt-10 ">
      {/* Thẻ hiển thị */}
      <div className="relative w-full h-100 perspective outline rounded-2xl outline-gray-100">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute w-full h-full"
          >
            <motion.div
              className={`w-full h-full bg-white rounded-2xl shadow-lg flex items-center justify-center cursor-pointer [transform-style:preserve-3d]`}
              animate={{ rotateX: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => setIsFlipped((prev) => !prev)}
            >
              {/* Mặt trước */}
              <div className="absolute backface-hidden text-2xl font-semibold">
                {cards[index].front}
              </div>

              {/* Mặt sau */}
              <div className="absolute rotate-y-180 backface-hidden text-2xl font-semibold bg-yellow-100 w-full h-full flex items-center justify-center rounded-2xl">
                {cards[index].back}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nút điều hướng */}
      <div className="flex justify-between w-80 mt-6">
        <button
          onClick={prevCard}
          className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg font-medium transition"
        >
          ◀ Trước
        </button>
        <div className="text-gray-600 font-semibold">
          {index + 1} / {cards.length}
        </div>
        <button
          onClick={nextCard}
          className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg font-medium transition"
        >
          Tiếp ▶
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
