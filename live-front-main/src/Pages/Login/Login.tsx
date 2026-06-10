import React, { useState } from "react";
import LoginBG from "@/assets/Images/LoginBG.png";
import LoginBG1 from "@/assets/Images/LoginBG1.png";
import TextInputWithLabel from "@/Components/Input/TextInputWithLabel";
import ButtonsLabel from "@/Components/Buttons/ButtonsLabel";
import Logo from "@/assets/Images/GreensTechLogo.png";
import { useNavigate } from "react-router-dom";
import { RoleList } from "../Routes/AuthContext";
import { AuthenticationService } from "@/Services/AuthenticationService";
import { useAuth } from "../Routes/AuthContext";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const navigate = useNavigate();

  const { setRole, refreshToken } = useAuth();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [handleError, setHandleError] = useState({
    status: false,
    message: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandleError({
      status: false,
      message: "",
    });
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const [successStatus, setSuccessStatus] = useState(false);

  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response: any = await AuthenticationService.login(loginData);

    if (response.status && response.token) {
      const matchedRole =
        RoleList.find((r) => r.id === response.roleId) || null;

      setSuccessStatus(true);
      localStorage.setItem("token", response.token);
      setRole(matchedRole);
      refreshToken();

      setTimeout(() => {
        setSuccessStatus(false);
        if (matchedRole) {
          navigate(`/${String(matchedRole.type)}/`);
        }
      }, 1000);
    } else {
      setHandleError({
        status: true,
        message: response.message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmitLogin}>
      <div
        style={{
          backgroundImage: `url(${LoginBG})`,
          objectFit: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className="h-screen w-full flex justify-center items-center"
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)", // semi-transparent white
            backdropFilter: "blur(5px)", // frosted glass effect
            WebkitBackdropFilter: "blur(5px)", // Safari support
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          className="w-11/12 lg:w-9/12 h-11/12 lg:h-9/12 flex justify-center items-center p-5 lg:p-10"
        >
          <div
            style={{
              backgroundImage: `url(${LoginBG1})`,
              objectFit: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            className="h-full w-4/12  justify-center hidden lg:flex items-center rounded-2xl"
          ></div>
          <div
            className="h-12/12 lg:h-10/12 w-12/12 lg:w-7/12 flex justify-center gap-4 items-center flex-col rounded-l-[12px] lg:rounded-l-none"
            style={{
              backgroundColor: "rgb(232 232 232 / 20%)", // semi-transparent white
              backdropFilter: "blur(20px)", // frosted glass effect
              WebkitBackdropFilter: "blur(10px)", // Safari support
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderTopRightRadius: "12px", // adjust radius as you want
              borderBottomRightRadius: "12px", // adjust radius as you want
            }}
          >
            <img src={Logo} className="h-2/12 block lg:hidden" alt="logo" />
            <h6>Login</h6>
            <div className="flex w-8/12">
              <TextInputWithLabel
                type="text"
                name="username"
                label="Username"
                placeholder=""
                onChange={handleInput}
              />
            </div>
            <div className="flex w-8/12">
              <TextInputWithLabel
                type="password"
                name="password"
                label="Password"
                placeholder=""
                onChange={handleInput}
              />
            </div>
            {handleError.status && (
              <div className="w-8/12 text-[0.8rem] text-[red] font-bold text-center">
                {handleError.message}
              </div>
            )}
            {successStatus && (
              <div className="w-8/12 text-[0.8rem] text-[#008080] font-bold text-center">
                Logged in successfully
              </div>
            )}
            <div className="w-8/12 text-[0.8rem] font-bold text-end">
              Forget Password ?
            </div>
            <div className="w-8/12 lg:w-3/12 flex justify-center items-center">
              <ButtonsLabel variant="primary" type="submit">
                Submit
              </ButtonsLabel>
            </div>
            {/* <div className="w-8/12 text-[0.8rem] font-bold text-center">
            Don’t have an account ?{" "}
            <span className="text-[#008080]">Register</span>
          </div> */}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
