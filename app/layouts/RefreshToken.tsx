import { useEffect } from "react";
import { refreshToken } from "~/features/auth/authSlice";
import { useAppDispatch } from "~/store/hook";

const RefreshToken=()=>{
      const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("refreshToken");
    if (token) {
      dispatch(refreshToken(token));
    }
  }, [dispatch]);

    return<></>
}
export default RefreshToken;