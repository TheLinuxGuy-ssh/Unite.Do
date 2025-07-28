

const Sidebar = () => {
    return (
        <>
            <div className="do-sidebar m-4 w-[2.5rem] duration-300 ease-in-out overflow-hidden hover:w-60 h-dvh">
                <div className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-2 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="fa-solid fa-user"></i>
                    <span className="sidebar-item-title ml-4">Home</span>
                </div>
                <div className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-2 px-3 duration-300 hover:bg-[#fecf3e] ">
                    <i className="fa-solid fa-list-check"></i>
                    <span className="sidebar-item-title ml-4">Tasks</span>
                </div>
                <div className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-2 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="fa-regular fa-folder"></i>
                    <span className="sidebar-item-title ml-4">Projects</span>
                </div>
                <div className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-2 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="fa-solid fa-people-group"></i>
                    <span className="sidebar-item-title ml-4">Team</span>
                </div>
                <div className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-2 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="fa-solid fa-tags"></i>
                    <span className="sidebar-item-title ml-4">Tags</span>
                </div>
                <div className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-2 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="fa-solid fa-gear"></i>
                    <span className="sidebar-item-title ml-4">Settings</span>
                </div>
            </div>
        </>
    )
}

export default Sidebar;