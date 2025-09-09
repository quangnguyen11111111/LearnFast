
interface InputProps {
    valueInput: string;
    title: string;
    id: string;
    type: string;
    setValueInput: (value: string) => void;
}
const Input = ({valueInput,title,id,type,setValueInput}:InputProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValueInput(e.target.value);
    }
    return (
            <>
        <div className="relative w-full">
            <input type={type}value={valueInput} onChange={handleChange}  placeholder=" " id={id} className="peer w-full h-full text-xl border-b-2 border bg-transparent py-2 text-gray-900 focus:border-blue-500 focus:outline-none " />
            <label htmlFor={id} className="absolute left-0 -top-4 text-sm text-blue-500 transition-all 
               peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
               peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:translate-y-0 ">{title}</label>
        </div>
        </>
    )
}
export default Input