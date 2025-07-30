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
        <div className="content px-4 bg-white w-full ">
           <table className="w-full mt-4 border-3 border-gray-100 rounded-4xl rounded-4xl">
  <thead className="">
    <tr>
      <th className="border-b text-left  p-5 border-gray-300 ...">Name</th>
      <th className="border-b text-left p-5 border-gray-300 ...">Deadline</th>
      <th className="border-b text-left p-5 border-gray-300">Status</th>
      <th className="border-b text-left p-5 border-gray-300">Assigned</th>
    </tr>
  </thead>
  <tbody>
    {tasks.map((task) => (
        <>
        <tr className="hover:bg-gray-100" onClick={() => handleTaskEdit(task.id)}>
            <td className="p-3 py-5 flex font-semibold items-center text-xl">
                 <Checkbox
      className="group  size-7 mr-4 font-semibold rounded-lg border-3 border-gray-200 bg-white data-checked:border-gray-400 data-checked:bg-[#fecf30]"
    >
      {/* Checkmark icon */}
      <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
        <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Checkbox>
                {task.title}</td>
            <td className="p-3 py-5 text-gray-500 font-bold">{task.due_date}</td>
            <td className="p-3 py-5"><div className={`w-fit py-2 px-4 rounded-lg font-bold text-white ${(task.status == 'Ongoing' && 'bg-yellow-400') || (task.status == 'Assigned' && 'bg-red-400') || (task.status == 'Completed' && 'bg-green-400')}`}>{task.status}</div></td>
            <td className="p-3 py-5">{task.assigned_to}</td> 
        </tr>
        </>
    ))}
  </tbody>
</table>
        </div>
        </div>
        <div className={`duration-200 overflow-hidden ${openEdit ? "visible flex flex-2 ml-4 p-5": "invisible w-0"} rounded-4xl bg-white`}>
            {editTask ? editTask.title : null}
        </div>
        </div>
    )
}

export default Tasks