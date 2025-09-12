import { useGoogleLogin } from "@react-oauth/google";
interface GoogleButtonProps {
  children?: React.ReactNode;
}
const GoogleButton: React.FC<GoogleButtonProps> =({children}) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
    onError: () => console.log("❌ Lỗi đăng nhập Google"),
  });

  return (
    <button
      onClick={() => login()}
      className="w-full p-4 bg-gray-200 text-black font-medium rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"
    >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="google"
        className="w-5 h-5"
      />
      {children?children:"Đăng nhập bằng Google"}
    </button>
  );
};
export default GoogleButton;