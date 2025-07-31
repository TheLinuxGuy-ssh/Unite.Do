import { useState, useEffect } from "react"
import { Checkbox } from '@headlessui/react'
import supabase from "../../utils/supabase"

const Tasks = () => {
    type getTask = {
        id: number,
        title: string,
        description: string,
        status: string,
        due_date: string,
        assigned_to: string
    }
    const [tasks, setTasks] = useState<getTask[]>([])
    const [openEdit, setOpenEdit] = useState(false)
    const [editTask, setEditTask] = useState<getTask>()
    const fetchTasks = async () => {
            const {data, error} = await supabase
            .from("tasks")
            .select('*')
            .order('created_at', { ascending: false })
            if(error){
                console.error(error);
            } else {
                console.log("okay for now bud")
                setTasks(data)
            }
    }
    const handleTaskEdit = async (task: number) => {
        const {data, error} = await supabase.from('tasks').select('*').eq('id', task).single()
        setOpenEdit(true)
        setEditTask(data)
    }
    useEffect(() => {
        fetchTasks();
    })
    return (
        <div className="do-section-box flex" onClick={() => setOpenEdit(false)}>
        <div className="bg-white w-full rounded-4xl flex-7">
        <div className="team team-header bg-white p-5 rounded-t-4xl border-b-2 border-gray-300 w-full h-fit">
            <span className="title text-3xl font-semibold">Manage Your Tasks</span>
        </div> 
        <div className="content grid grid-cols-3 gap-2 my-6 px-4 bg-white w-full ">
    {tasks.filter((task) => task.status == "Ongoing").map((task) => (
        <>
        <div className="flex flex-col p-3 hover:bg-gray-100 border-2 border-gray-200 rounded-4xl flex" onClick={() => handleTaskEdit(task.id)}>
            <div className="flex pt-2">
            <div className="  flex font-semibold items-center text-xl">
                <span className="ml-2 mr-5"><i className="fa-solid fa-list "></i></span>{task.title}</div>
            <div className="ml-5"><div className={`w-fit py-2 px-4 rounded-lg font-bold text-white ${(task.status == 'Ongoing' && 'bg-yellow-400') || (task.status == 'Assigned' && 'bg-red-400') || (task.status == 'Completed' && 'bg-green-400')}`}>{task.status}</div></div>
            
                </div>
            <div className=" text-gray-500 font-bold ml-3">Due Date: {task.due_date}</div>
            <div className="para">{task.description}</div>
            <div className=" py-5">{task.assigned_to}</div> 
        </div>
        </>
    ))}
        </div>
        </div>
        <div className={`duration-200 overflow-hidden ${openEdit ? "visible flex flex-2 ml-4 p-5": "invisible w-0"} rounded-4xl bg-white`}>
            {editTask ? editTask.title : null}
        </div>
        </div>
    )
}

export default Tasks