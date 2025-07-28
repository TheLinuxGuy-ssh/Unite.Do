

const Topbar = () => {
    return (
        <>
        <div className="topbar w-full flex py-8 px-5">
        <div className="topbar-do flex-1">
            {/* <img src="Work.do" alt="" /> */}
            <span className="text-4xl font-bold">Do.</span>
        </div>
        <div className="topbar-days flex flex-1 mx-auto">
            <div className="topbar-days-btn mx-1 border-1 py-2 px-5 rounded-4xl duration-200 hover:bg-[#fecf3e] select-none hover:cursor-pointer">
                Today
            </div>
            <div className="topbar-days-btn mx-1 border-1 py-2 px-5 rounded-4xl duration-200 hover:bg-[#fecf3e] select-none hover:cursor-pointer">
                This Week
            </div>
            <div className="topbar-days-btn mx-1 border-1 py-2 px-5 rounded-4xl duration-200 hover:bg-[#fecf3e] select-none hover:cursor-pointer">
                This Month
            </div>
            <div className="topbar-days-btn mx-1 border-1 py-2 px-5 rounded-4xl duration-200 hover:bg-[#fecf3e] select-none hover:cursor-pointer">
                Reports
            </div>
        </div>
        <div className="topbar-utils flex flex-1 justify-end h-auto">
            <div className="topbar-btn bg-white aspect-square mx-1 w-[2.5rem] rounded-full flex justify-center items-center duration-300 border border-transparent hover:border-[#fecf3e]">
                <i className="fa-regular fa-bell"></i>
            </div>
            <div className="topbar-btn bg-white aspect-square mx-1 w-[2.5rem] rounded-full flex justify-center items-center duration-300 border border-transparent hover:border-[#fecf3e]">
                <i className="fa-solid fa-gear"></i>
            </div>
            <div className="topbar-profile py-1 px-2 rounded-xl flex items-center mx-1 duration-300 hover:bg-[#fecf3e]">
                <img className="h-[2.35rem] mr-2 rounded-full" src="./profile.webp" alt="" />
                <div className="initials">
                    <span className="profile-name block m-0 text-sm ">Rohan Sharma</span>
                    <span className="profile-role block m-0 text-xs text-gray">Project Manager</span>
                </div>
            </div>
        </div>
        </div>
        </>
    )
}

export default Topbar