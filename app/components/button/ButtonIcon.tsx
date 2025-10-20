interface IconProps{
  variant?: "primary" | "secondary";
  size?:number;
  icon: React.ElementType;
   onClick:() => void 
}
 const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary: " text-gray-700 hover:bg-gray-300 disabled:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
  };
/* ------------------ IconButton ------------------ */
const IconButton = ({ icon: Icon, onClick, variant = "primary",size=6 }: IconProps) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full  transition cursor-pointer ${variants[variant]}`}
  >
    <Icon className={`size-${size}`} />
  </button>
)
export default IconButton