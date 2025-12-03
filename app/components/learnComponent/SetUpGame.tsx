import Button from "../button/Button";

interface SetUpGameProps {
    handleStartGame: () => void;
    img:string;
    title?:string;
    content?:string;
}
const SetUpGame = ({ handleStartGame, img, title, content }: SetUpGameProps) => {
  return <div className="flex flex-col gap-3 justify-center items-center h-full">
    <img src={img} alt="image" />
    <h2 className="text-2xl font-bold my-4 ">{title}</h2>
    <p className="max-w-[25rem] text-center">{content}</p>
    <Button rounded="rounded-3xl" className="px-20 py-3 font-semibold mt-2" onClick={handleStartGame} >Start Game</Button>
  </div>;
}

export default SetUpGame;