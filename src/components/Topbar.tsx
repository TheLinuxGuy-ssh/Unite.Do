import type { Session } from "@supabase/supabase-js";
import supabase from "../../utils/supabase";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

type TopbarProps = {
    session: Session | null;
};

const Topbar = ({ session }: TopbarProps) => {
    const signOut = async () => {
        await supabase.auth.signOut();
    };
    return (
        <>
            <div className="topbar w-full flex py-4 pb-0 items-center px-5">
                <div className="topbar-do flex flex-1">
                    <img src="./logo.png" className="h-8 mr-4" alt="" />
                    <span className="text-2xl font-bold">Unite.Do</span>
                </div>
                <div className="topbar-days flex items-center justify-center flex-1 mx-auto">
                    <a target="_blank" href="https://github.com/TheLinuxGuy-ssh/Unite.Do" className="topbar-days-btn bg-black text-white flex items-center justify-center mx-1 border-1 py-1 px-3 rounded-4xl duration-200 hover:bg-[#fecf3e] hover:text-black select-none hover:cursor-pointer">
                        <i className="fa-brands fa-github mr-4"></i> GitHub
                    </a>
                    <a target="_blank" href="https://unite-do.vercel.app" className="topbar-days-btn flex items-center justify-center mx-1 border-1 border-yellow-400 bg-[#fcef30] py-1 px-3 rounded-4xl duration-200 hover:bg-[#fecf3e] select-none hover:cursor-pointer">
                        Demo Link
                    </a>
                </ div>
                <div className="topbar-utils flex flex-1 justify-end h-auto">
                    <Menu>
                        <MenuButton className="topbar-btn bg-white size-md   rounded-full flex justify-center items-center duration-300 border border-transparent hover:border-[#fecf3e]">
                            <i className="text-sm fa-regular fa-bell"></i>
                        </MenuButton>
                        <MenuItems
                            anchor="bottom"
                            transition
                            className="origin-top flex justify-center w-90 h-90 mt-3 items-center transition duration-100 outline-0 ease-out data-closed:scale-95 data-closed:opacity-0 bg-white text-xl rounded-2xl mx-5 my-2 w-50 border-3 border-gray-300"
                        >
                            No Notications
                        </MenuItems>
                    </Menu>
                    <Menu>
                        <MenuButton className="topbar-profile py-1 border-2 border-yellow-300 outline-0 bg-yellow-200 px-2 rounded-xl flex items-center mx-1 duration-300 hover:bg-[#fecf3e]">
                            <img
                                className="h-[1.75rem] mr-2 rounded-full"
                                src="./profile.webp"
                                alt=""
                            />
                            <div className="initials">
                                <span className="profile-name block m-0 text-sm ">
                                    {session?.user.email}
                                </span>
                            </div>
                        </MenuButton>
                        <MenuItems
                            anchor="bottom"
                            transition
                            className="origin-top transition duration-100 outline-0 ease-out data-closed:scale-95 data-closed:opacity-0 bg-white text-xl rounded-2xl mx-5 my-2 w-50 border-3 border-gray-300"
                        >
                            <MenuItem>
                                <a
                                    className="block p-3 px-10 data-focus:bg-yellow-200"
                                    onClick={() => signOut()}
                                >
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
