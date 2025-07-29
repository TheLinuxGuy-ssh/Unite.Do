import { useState, useEffect } from "react";

const Sidebar = () => {
    const [Sidebar, setSidebar] = useState("collapsed");
    const handleSidebar = () => {
            Sidebar == "collapsed" ? setSidebar("opened") : setSidebar("collapsed");
    }

    return (
        <>
            <div className={`do-sidebar ${Sidebar} m-4 w-[3.75rem] duration-300 ease-in-out overflow-hidden h-dvh hover:`}>
                <div className="dashboard-header py-5 px-8 mb-5">
            <h1 className={`sidebar-welcome w-100 text-4xl font-bold ${Sidebar}`}>Welcome to <br /> Unite.<span className="text-[#fecf3e]">Do</span></h1>
        </div>
        <div className={`sidebar-collapse-btn bg-[#fecf3e] duration-300 absolute left-[4.75rem] ${Sidebar == "collapsed" ? "" : "left-[21.25rem] rotate-180"} p-2 px-2.5 rounded-lg top-[50%]`} onClick={handleSidebar}>
            <i className="fa-solid fa-chevron-right"></i>
        </div>
                <div className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="mx-2 fa-solid fa-user"></i>
                    <span className="sidebar-item-title ml-4">Home</span>
                </div>
                <div className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e] ">
                    <i className="mx-2 fa-solid fa-list-check"></i>
                    <span className="sidebar-item-title ml-4">Tasks</span>
                </div>
                <div className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="mx-2 fa-regular fa-folder"></i>
                    <span className="sidebar-item-title ml-4">Projects</span>
                </div>
                <div className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="mx-2 fa-solid fa-people-group"></i>
                    <span className="sidebar-item-title ml-4">Team</span>
                </div>
                <div className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="mx-2 fa-solid fa-tags"></i>
                    <span className="sidebar-item-title ml-4">Tags</span>
                </div>
                <div className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="mx-2 fa-solid fa-gear"></i>
                    <span className="sidebar-item-title ml-4">Settings</span>
                </div>
            </div>
        </>
    )
}

export default Sidebar;