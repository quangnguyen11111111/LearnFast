type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600"
    >
      {children}
    </button>
  );
}
