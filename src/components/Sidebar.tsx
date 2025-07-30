import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const [Sidebar, setSidebar] = useState("collapsed");
    return (
        <>
            <div className={`do-sidebar group/sidebar ${Sidebar} m-4 w-[3.75rem] duration-300 ease-in-out overflow-hidden h-dvh hover:w-100`}>
                <div className="dashboard-header flex flex-col justify-center h-[75vh]">
                <NavLink to="./" className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="mx-2 fa-solid fa-user"></i>
                    <span className="sidebar-item-title text-xl ml-4">Home</span>
                </NavLink>
                <NavLink to="./tasks" className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e] ">
                    <i className="mx-2 fa-solid fa-list-check"></i>
                    <span className="sidebar-item-title text-xl ml-4">Tasks</span>
                </NavLink>
                <NavLink to="./projects" className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="mx-2 fa-regular fa-folder"></i>
                    <span className="sidebar-item-title text-xl ml-4">Projects</span>
                </NavLink>
                <NavLink to="./team" className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="mx-2 fa-solid fa-people-group"></i>
                    <span className="sidebar-item-title text-xl ml-4">Team</span>
                </NavLink>
                <NavLink to="./tags" className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="mx-2 fa-solid fa-tags"></i>
                    <span className="sidebar-item-title text-xl ml-4">Tags</span>
                </div>
                <div className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]">
                    <i className="mx-2 fa-solid fa-gear"></i>
                    <span className="sidebar-item-title text-xl ml-4">Settings</span>
                </div>
            </div>
            </div>
        </>
    )
}

export default Sidebar;