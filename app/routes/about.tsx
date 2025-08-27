import { useAppDispatch, useAppSelector } from "~/store/hook";
import { login, logout } from "../features/auth/authSlice";

export default function Home() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  return (
    <div className="p-4">
      <h1 className="text-2xl">Trang Home</h1>
      {loading && <p>Đang xử lý...</p>}
      {user ? (
        <div>
          <p>Xin chào {user.email}</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => dispatch(logout())}
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => dispatch(login({ email: "test@mail.com", password: "123456" }))}
        >
          Đăng nhập demo
        </button>
      )}
    </div>
  );
}
