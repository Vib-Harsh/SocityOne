import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      console.log("authorised");
      // const userData = useSelector((state) => state.userData)
      //   navigate("/login");
      // }else{
      //   const allowedRoutes = userData[0].user_role.module
      //   console.log(allowedRoutes)
      // }
    }
  }, [navigate]);
  return children;
};
export default ProtectedRoute;
