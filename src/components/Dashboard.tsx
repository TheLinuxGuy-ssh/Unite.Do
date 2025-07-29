import { Description, Dialog, DialogPanel, DialogTitle, Button } from '@headlessui/react'
import { useEffect, useState } from 'react'
import supabase from '../../utils/supabase';

const Dashboard = () => {
    type Task = {
        id: number,
        title: string,
        description: string,
        task_status: string,
        due_date: string
    }
    type getTask = {
        title: string,
        description: string,
        status: string
    }
    let [isOpen, setIsOpen] = useState(false)
        const [taskData, setTaskData] = useState<Omit<Task, 'id' | 'created_at'>>({
            title: '',
            description: '',
            task_status: 'Ongoing',
            due_date: ''
        })
    const [tasks, setTasks] = useState<getTask[]>([])
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
        useEffect(() => {
    fetchTasks()
    }, [])
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target
            setTaskData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }

        const handleSubmit = async (e: React.FormEvent) => {
            setIsOpen(false)
            e.preventDefault()
            const { data, error } = await supabase
            .from("tasks")
            .insert([
                {
                    title: taskData.title,
                    description: taskData.description,
                    status: taskData.task_status,
                }
            ])
            if (error) {
                console.error(error);
            } else {
                fetchTasks()
                setTaskData({
                    title: '',
                    description: '',
                    task_status: '',
                    due_date: ''
                })
            }
        }

    return (
        <>
        <div className="dashboard bg-gray-200 w-full h-fit p-1 rounded-4xl m-4 ml-0">
        <div className="dashboard-content flex h-[84vh]">
            <div className="flex flex-1 m-2">
                <div className="dashboard-card bg-white rounded-4xl w-full py-8 px-6 h-full">
                    <div className="dashboard-card-header flex items-center">
                        <span className="dashboard-card-heading text-2xl">
                            My Tasks
                        </span>
                        <div onClick={() => setIsOpen(true)} className="dashboard-add-btn border-2 border-gray-300 flex items-center justify-center ml-auto py-2.5 p-2 rounded-full duration-300 hover:border-[#fecf3e] hover:bg-[#fecf3e]">
                            <i className="fa-regular fa-plus"></i>
                        </div>
                    </div>
                    <div className="dashboard-card-content h-full overflow-y-scroll ">
                    {tasks.map((task) => (
                    <div key={task.title} className={`card w-full ${task.status == "Ongoing" ? "bg-yellow-200" : "bg-green-200"} mt-4 p-4 h-30 rounded-4xl`}>
                        <h1>{task.title}</h1>
                        <p>{task.description}</p>
                    </div>
                    ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-2 m-2">
                <div className="flex flex-1">
                    <div className="flex-1">
                        <div className="dashboard-card bg-white rounded-4xl h-full w-full py-8 px-6">
                    <div className="dashboard-card-header flex items-center">
                        <span className="dashboard-card-heading text-2xl">
                            Project Overview
                        </span>
                        <div className="dashboard-add-btn border-2 border-gray-300 flex items-center justify-center ml-auto py-2.5 p-2 rounded-full duration-300 hover:border-[#fecf3e] hover:bg-[#fecf3e]">
                            <i className="fa-regular fa-plus"></i>
                        </div>
                    </div>
                </div>
                    </div>
                    <div className="flex-1 ml-4">
                        <div className="dashboard-card bg-white rounded-4xl h-full w-full py-8 px-6">
                    <div className="dashboard-card-header flex items-center">
                        <span className="dashboard-card-heading text-2xl">
                            My Tasks
                        </span>
                        <div className="dashboard-add-btn border-2 border-gray-300 flex items-center justify-center ml-auto py-2.5 p-2 rounded-full duration-300 hover:border-[#fecf3e] hover:bg-[#fecf3e]">
                            <i className="fa-regular fa-plus"></i>
                        </div>
                    </div>
                </div>
                    </div>
                </div>
                <div className="flex-2 mt-4">
                        <div className="dashboard-card bg-white rounded-4xl h-full w-full py-8 px-6">
                    <div className="dashboard-card-header flex items-center">
                        <span className="dashboard-card-heading text-2xl">
                            Calendar
                        </span>
                        <div className="dashboard-add-btn border-2 border-gray-300 flex items-center justify-center ml-auto py-2.5 p-2 rounded-full duration-300 hover:border-[#fecf3e] hover:bg-[#fecf3e]">
                            <i className="fa-regular fa-plus"></i>
                        </div>
                    </div>
                </div>
                    </div>
            </div>
            <div className="flex flex-1">
                
            </div>

        </div>
        </div>
         <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 duration-200 bg-black/40">
        <DialogPanel className="max-w-lg space-y-4 border rounded-4xl bg-white p-12">
          <DialogTitle>Add Task</DialogTitle>
             <form onSubmit={handleSubmit} className='block'>
      <input
        type="text"
        name="title"
        placeholder="Title"
        className='block'
        onChange={handleChange}
        value={taskData.title}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        value={taskData.description}
      />

      <input 
      type="text" 
      name='due_date' 
      placeholder="Due Date"
      onChange={handleChange} 
      value={taskData.due_date}
      />

      <Button type="submit" className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500">
      Save changes
    </Button>
    </form>
          </DialogPanel>
        </div>
      </Dialog>
        </>
    )
}

export default Dashboard;