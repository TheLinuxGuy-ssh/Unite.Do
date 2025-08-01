import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    return (
        <>
            <div
                className={`do-sidebar group/sidebar m-4 w-[3.75rem] duration-300 ease-in-out overflow-hidden h-dvh hover:w-100`}
            >
                <div className="dashboard-header flex flex-col justify-center h-[75vh]">
                    <NavLink
                        viewTransition
                        to="./"
                        className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]"
                    >
                        <i className="mx-2 fa-solid fa-user"></i>
                        <span className="sidebar-item-title text-xl ml-4">
                            Home
                        </span>
                    </NavLink>
                    <NavLink
                        viewTransition
                        to="./tasks"
                        className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e] "
                    >
                        <i className="mx-2 fa-solid fa-list-check"></i>
                        <span className="sidebar-item-title text-xl ml-4">
                            Tasks
                        </span>
                    </NavLink>
                    <NavLink
                        viewTransition
                        to="./projects"
                        className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]"
                    >
                        <i className="mx-2 fa-regular fa-folder"></i>
                        <span className="sidebar-item-title text-xl ml-4">
                            Projects
                        </span>
                    </NavLink>
                    <NavLink
                        viewTransition
                        to="./team"
                        className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]"
                    >
                        <i className="mx-2 fa-solid fa-people-group"></i>
                        <span className="sidebar-item-title text-xl ml-4">
                            Team
                        </span>
                    </NavLink>
                    <NavLink
                        viewTransition
                        to="./settings"
                        className="sidebar-item flex items-center mb-2 bg-white rounded-4xl py-4 px-3 duration-300 hover:bg-[#fecf3e]"
                    >
                        <i className="mx-2 fa-solid fa-gear"></i>
                        <span className="sidebar-item-title text-xl ml-4">
                            Settings
                        </span>
                    </NavLink>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
