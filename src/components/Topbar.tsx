import type { Session } from "@supabase/supabase-js";
import supabase from "../../utils/supabase";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"

type TopbarProps = {
  session: Session | null;
};

const Topbar = ({ session }: TopbarProps) => {
    const signOut = async () => {
                await supabase.auth.signOut()
    }
  return (
    <>
      <div className="topbar w-full flex py-8 px-5">
        <div className="topbar-do flex-1">
          {/* <img src="Work.do" alt="" /> */}
          <span className="text-4xl font-bold">TaskWhirl</span>
        </div>
        <div className="topbar-days flex flex-1 mx-auto">
          <div className="topbar-days-btn flex items-center justify-center mx-1 border-1 py-2 px-5 rounded-4xl duration-200 hover:bg-[#fecf3e] select-none hover:cursor-pointer">
            Today
          </div>
          <div className="topbar-days-btn flex items-center justify-center mx-1 border-1 py-2 px-5 rounded-4xl duration-200 hover:bg-[#fecf3e] select-none hover:cursor-pointer">
            This Week
          </div>
          <div className="topbar-days-btn flex items-center justify-center mx-1 border-1 py-2 px-5 rounded-4xl duration-200 hover:bg-[#fecf3e] select-none hover:cursor-pointer">
            This Month
          </div>
          <div className="topbar-days-btn flex items-center justify-center mx-1 border-1 py-2 px-5 rounded-4xl duration-200 hover:bg-[#fecf3e] select-none hover:cursor-pointer">
            Reports
          </div>
        </div>
        <div className="topbar-utils flex flex-1 justify-end h-auto">
          <div className="topbar-btn bg-white aspect-square mx-1 w-[3.5rem] rounded-full flex justify-center items-center duration-300 border border-transparent hover:border-[#fecf3e]">
            <i className="fa-regular fa-bell"></i>
          </div>
          <Menu>
          <MenuButton className="topbar-profile border-2 border-gray-200 bg-yellow-200 py-1 px-2 rounded-xl flex items-center mx-1 duration-300 hover:bg-[#fecf3e]">
            <img
              className="h-[2.35rem] mr-2 rounded-full"
              src="./profile.webp"
              alt=""
            />
            <div className="initials">
              <span className="profile-name block m-0 text-sm ">
                {session?.user.email}
              </span>
              <span className="profile-role block m-0 text-xs text-gray">
                Project Manager
              </span>
            </div>
          </MenuButton>
          <MenuItems anchor="bottom"
        transition className="origin-top transition duration-100 outline-0 ease-out data-closed:scale-95 data-closed:opacity-0 bg-white text-xl rounded-2xl mx-5 my-2 w-50 border-3 border-gray-300">
        <MenuItem>
          <a className="block p-3 px-10 data-focus:bg-yellow-200" onClick={() => signOut()}>
            Log Out
          </a>
        </MenuItem>
      </MenuItems>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default Topbar;
