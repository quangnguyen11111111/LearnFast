import { GoogleLogin, useGoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { loginWithGoogleAccount } from "~/features/auth/authSlice";
import { useAppDispatch } from "~/store/hook";
interface GoogleButtonProps {
  children?: React.ReactNode;
}
const GoogleButton: React.FC<GoogleButtonProps> =({children}) => {
   const googleRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // ✅ Hàm xử lý login khi Google trả về credential
  const handleLoginWithGoogle = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;
      console.log('kiểm tra token', token);
      
      if (!token) {
        throw new Error("Không lấy được credential từ Google");
      }

      const response = await dispatch(
        loginWithGoogleAccount({ idToken: token }) // gửi idToken lên backend
      ).unwrap();

      if (response.errCode === 0) {
        alert( response.message);
        // điều hướng về trang latest sau khi đăng nhập thành công và không cho người dùng quay lại các trang đã truy cập trước đó
        navigate("/latest", { replace: true });
      } else {
        alert( response.message);
      }
    } catch (error) {
      alert( "Hệ thống bị mất kết nối");
      console.error("đây là lỗi home",error);
    }
  };

  return (
    <>
    <button
      onClick={() => {
          (googleRef.current?.querySelector("div[role=button]") as HTMLElement | null)?.click();

        }}
      className="w-full p-4 bg-gray-200 text-black font-medium rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"
      >
      <img
        src="https://www.svgrepo.com/show/355037/google.svg"
        alt="google"
        className="w-5 h-5"
        />
      {children?children:"Đăng nhập bằng Google"}
    </button>
     {/* GoogleLogin ẩn */}
      <div ref={googleRef} className="hidden">
        <GoogleLogin
          onSuccess={handleLoginWithGoogle}
          onError={() => console.log("Login Failed")}
        />
      </div>
        </>
  );
};
export default GoogleButton;