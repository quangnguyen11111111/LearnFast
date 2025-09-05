
import type { Route } from './+types/homePage'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router';
import { loginWithGoogleAccount } from '~/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '~/store/hook';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // ✅ Hàm xử lý login khi Google trả về credential
  const handleLoginWithGoogle = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;
      console.log("token nè",token);
      
      if (!token) {
        throw new Error("Không lấy được credential từ Google");
      }

      const response = await dispatch(
        loginWithGoogleAccount({ token }) // gửi token lên backend
      ).unwrap();

      if (response.errCode === 0) {
        alert( response.message);
        navigate("/about"); // dùng React Router navigate
      } else {
        alert( response.message);
      }
    } catch (error) {
      alert( "Hệ thống bị mất kết nối");
      console.error("đây là lỗi home",error);
    }
  };
  return (<>
  <h2 className="text-red-500 text-2xl font-bold">'Hello, React Router!'</h2>
  <GoogleLogin
        onSuccess={handleLoginWithGoogle}
        onError={() => console.log("❌ Lỗi đăng nhập Google")}
      />
  </>)
}
