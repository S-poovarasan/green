import React, { useEffect, useRef, useState, type JSX } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "@/assets/Images/GreensTechLogo.png";
import DefaultProfile from "@/assets/Images/DefaultProfile.jpg";
import { useAuth } from "./AuthContext";
import { Edit, LogOut, Menu, User2Icon } from "lucide-react";
import { Sidebar } from "primereact/sidebar";
import { Dialog } from "primereact/dialog";
import TextInputWithLabel from "@/Components/Input/TextInputWithLabel";

interface MasterHeaderProps { }

const MasterHeader: React.FC<MasterHeaderProps> = () => {
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);

  const [profileMenu, setProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const userData = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if click is outside menu AND profile image
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        imgRef.current &&
        !imgRef.current.contains(event.target as Node)
      ) {
        setProfileMenu(false);
      }
    }

    if (profileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenu]);

  const roleMenus: Record<
    string,
    { label: string; path: string; icon?: JSX.Element }[]
  > = {
    admin: [
      {
        label: "Register",
        path: "/admin/register",
      },
      // {
      //   label: "Mail",
      //   path: "/admin/mail",
      // },
    ],
    headtrainer: [
      {
        label: "Register",
        path: "/headtrainer/register",
      },
      {
        label: "Student",
        path: "/headtrainer/student",
      },
      {
        label: "Filter",
        path: "/headtrainer/filter",
      },
      {
        label: "Sub trainer",
        path: "/headtrainer/subtrainer",
      },
      {
        label: "Syllabus",
        path: "/headtrainer/syllabus",
      },
      {
        label: "Groups",
        path: "/headtrainer/groups",
      },
      {
        label: "Reports",
        path: "/headtrainer/reports",
      },
      {
        label: "Recordings",
        path: "/headtrainer/recordings",
      },
    ],
    subtrainer: [
      {
        label: "Sessions",
        path: "/subtrainer/sessions",
      },
      {
        label: "Permission",
        path: "/subtrainer/permission",
      },
      {
        label: "Reports",
        path: "/subtrainer/reports",
      },
    ],
    student: [
      {
        label: "Dashboard",
        path: "/student/dashboard",
      },
    ],
  };
  const { role, user } = useAuth();

  const menus = role?.type ? roleMenus[role.type] || [] : [];
  const [selectedMenu, setSelectedMenu] = useState<string>("");

  useEffect(() => {
    const currentPath = location.pathname;

    const activeMenu = role?.type
      ? roleMenus[role.type]?.find((menu) => currentPath.startsWith(menu.path))
      : null;

    if (activeMenu) {
      setSelectedMenu(activeMenu.label);
    }
  }, [location.pathname, role?.type]);

  const [profileView, setProfileView] = useState(false);

  return (
    <div>
      <div className="w-full flex justify-between px-2 items-center h-[8vh] bg-white border-1 border-[#99999940]">
        <div className="flex justify-center gap-2 items-center">
          <img src={Logo} className="h-[6vh]" alt="logo" />
          <h6>Greens Technology</h6>
        </div>
        <div className="hidden w-full lg:flex justify-end items-center">
          <div className="flex w-full justify-end items-center gap-4 pr-4">
            {menus.map((menu, index) => (
              <div
                key={index}
                className={`w-auto flex justify-center items-center text-center cursor-pointer ${selectedMenu === menu.label ? "text-[#008080]" : "text-[#000]"
                  }`}
                onClick={() => {
                  setSelectedMenu(menu.label);
                  navigate(menu.path);
                }}
              >
                <p className="font-bold text-sm">{menu.label}</p>
              </div>
            ))}
          </div>
          <img
            src={
              user?.refUserProfile
                ? `data:${user?.profileImgFile?.contentType};base64,${user?.profileImgFile?.base64Data}`
                : DefaultProfile
            }
            onClick={() => {
              setProfileMenu(!profileMenu);
            }}
            className="h-[3rem] w-[3rem] object-cover rounded-full cursor-pointer"
            alt="logo"
            ref={imgRef}
          />
          <div
            onClick={() => {
              setProfileMenu(!profileMenu);
            }}
            className="pl-2 w-m-[100px] cursor-pointer"
          >
            <div className="text-xs font-bold">
              {userData.user?.refUserName}
            </div>
            <div className="text-xs font-bold">
              {userData.user?.refUserCustId}
            </div>
          </div>
          <div
            className={`w-auto flex justify-center items-center text-center cursor-pointer text-[#000]`}
          ></div>
          {profileMenu && (
            <div
              ref={menuRef}
              className="absolute top-[7.5vh] z-50 w-50 right-2 py-2 rounded-xl bg-[#f0f0f0]"
              style={{
                boxShadow:
                  "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
              }}
            >
              <div
                onClick={() => {
                  setProfileView(true);
                  setProfileMenu(!profileMenu);
                }}
                className="px-4 py-2 text-sm font-bold flex gap-2 cursor-pointer"
              >
                <User2Icon width={18} height={18} />
                Profile
              </div>
              <div
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                className="px-4 py-2 text-sm font-bold flex gap-2 cursor-pointer"
              >
                <LogOut width={18} height={18} />
                Logout
              </div>
            </div>
          )}

          <Dialog
            header="Profile"
            visible={profileView}
            className="w-11/12 lg:w-10/12 h-11/12"
            onHide={() => {
              if (!profileView) return;
              setProfileView(false);
            }}
          >
            <div className="w-full px-10 relative">
              <div className="w-6/12 flex justify-center items-center">
                <div className="w-full flex">
                  <div className="w-5/12 flex justify-center items-center">
                    <div className="relative w-[160px]">
                      <img
                        // src={getImageSrc()}
                        alt="profile"
                        className="h-[160px] w-[160px] rounded-full border-[5px] border-[#008080]"
                      />
                      <div
                        className="absolute bottom-2 right-2 p-1 text-[#008080] bg-white rounded-full shadow"
                      // onClick={() => fileInputRef.current?.click()}
                      >
                        <Edit
                          width={30}
                          height={30}
                          className="p-1 cursor-pointer"
                        />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        // ref={fileInputRef}
                        // onChange={(e) => {
                        //   const file = e.target.files?.[0];
                        //   if (file) handleProfileImageUpload(file);
                        // }}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                  <div className="w-7/12 flex flex-col px-5 gap-3">
                    <TextInputWithLabel
                      name="userId"
                      label="User Id"
                      placeholder="Enter your username"
                      // value={formdata.user_custId}
                      readonly={true}
                    />
                    <TextInputWithLabel
                      name="role"
                      label="Role"
                      placeholder="Enter your role"
                      value="Admin"
                      readonly={true}
                    />
                  </div>
                </div>
              </div>

              <form>
                <div className="w-full mt-3 flex justify-center items-center">
                  <div className="w-full flex">
                    <div className="w-7/12 flex flex-col px-3 gap-3">
                      <TextInputWithLabel
                        name="user_name"
                        label="Name"
                        placeholder="Enter your name"
                        // value={formdata.user_name}
                        // onChange={handleInput}
                        required
                      />
                      {/* <TextareaWithLabel
                    name="refUC_address"
                    label="Address"
                    placeholder="Enter your address"
                    value={formdata.refUC_address}
                    onChange={(e) => {
                      setFormdata((prevFormData) => ({
                        ...prevFormData,
                        refUC_address: e.target.value,
                      }));
                    }}
                    rows={2}
                    required
                  /> */}
                    </div>
                    <div className="w-7/12 flex flex-col px-3 gap-3">
                      <TextInputWithLabel
                        name="refUC_phonenumber"
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        // value={formdata.refUC_phonenumber}
                        // onChange={handleInput}
                        required
                      />
                    </div>
                    <div className="w-7/12 flex flex-col px-3 gap-3">
                      <TextInputWithLabel
                        name="refUC_email"
                        label="Email"
                        placeholder="Enter your email"
                        // value={formdata.refUC_email}
                        readonly={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full mt-3 flex justify-center items-center">
                  <div className="w-4/12">
                    {/* <Button
                  type="submit"
                  className="w-full h-10"
                  icon={loadingProfile && "pi pi-spin pi-spinner"}
                  label={!loadingProfile ? "Save" : ""}
                /> */}
                  </div>
                </div>
              </form>
            </div>
          </Dialog>
        </div>
        <div className="lg:hidden flex justify-center items-center">
          <Menu onClick={() => setVisible(true)} />
          <Sidebar
            visible={visible}
            position="right"
            onHide={() => setVisible(false)}
          >
            <div className="flex justify-center items-center">
              <img
                src={DefaultProfile}
                className="h-[5rem] w-[5rem] object-cover rounded-full cursor-pointer"
                alt="logo"
              />
            </div>
            <div className="flex flex-col mt-6 gap-2 pr-4">
              <div className="w-full p-2 rounded-sm px-3  cursor-pointer text-[#000]">
                <p
                  className="font-bold text-sm flex gap-2"
                  onClick={() => {
                    setProfileView(true);
                  }}
                >
                  Profile
                </p>
              </div>
              {menus.map((menu, index) => (
                <div
                  key={index}
                  className={`w-full p-2 rounded-sm px-3 cursor-pointer ${selectedMenu === menu.label
                    ? "text-[#008080]"
                    : "text-[#000]"
                    }`}
                  onClick={() => {
                    setSelectedMenu(menu.label);
                    navigate(menu.path);
                    setVisible(false);
                  }}
                >
                  <p className="font-bold text-sm">{menu.label}</p>
                </div>
              ))}
              <div className="w-full p-2 rounded-sm px-3  cursor-pointer text-[#000]">
                <p
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                  className="font-bold text-sm flex gap-2"
                >
                  Logout
                </p>
              </div>
            </div>
          </Sidebar>
        </div>
      </div>

      {role?.id ? (
        <>
          <div className="w-full h-[89vh] overflow-y-auto">
            <Outlet />
          </div>
          <div className="w-full h-[3vh] flex text-xs justify-between items-center px-10 text-[#374151] border-t-[1px] border-[#efefef]">
            <div>Copyright &copy; Green Technology</div>
            <div>V {import.meta.env.VITE_VERSION}</div>
          </div>
        </>
      ) : (
        <div>No Routes Configured</div>
      )}
    </div>
  );
};

export default MasterHeader;
