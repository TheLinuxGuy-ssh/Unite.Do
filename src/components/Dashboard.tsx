import { Description, Dialog, Disclosure, DisclosureButton, DisclosurePanel, Textarea, Label, Select, DialogPanel, DialogTitle, Button, Field, Input } from '@headlessui/react'
import { useEffect, useState } from 'react'
import supabase from '../../utils/supabase';
import { AnimatePresence, motion } from 'framer-motion'
import AOS from 'aos';

const Dashboard = () => {
    type Status = {
        id: number
    }
    type Task = {
        id: number,
        title: string,
        description: string,
        task_status: string,
        due_date: string
    }
    type getTask = {
        id: number,
        title: string,
        description: string,
        status: string,
        assigned_to: string
    }
    let [isOpen, setIsOpen] = useState(false)
    const [ongoingItemCount, setOngoingItemCount] = useState<number | null>(null);
    const [completedItemCount, setCompletedItemCount] = useState<number | null>(null);
        const [taskData, setTaskData] = useState<Omit<Task, 'id' | 'created_at'>>({
            title: '',
            description: '',
            task_status: 'Ongoing',
            due_date: new Date().toISOString()
        })
        const [taskStatus, setStatus] = useState({id: 0});
    const [tasks, setTasks] = useState<getTask[]>([])
    const [user, setUser] = useState<getTask[]>([])
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
        const fetchUser = async () => {
        const {data, error} = await supabase.auth.admin.listUsers();
        if(error){
            console.error(error);
        } else {
            console.log("okay for now bud")
       
        }
    }
     const fetchOngoingItemCount = async () => {
      const { count, error } = await supabase.from("tasks").select("*", { count: "exact" }).eq('status', 'Ongoing');
      if (error) {
        console.error("Error fetching item count:", error);
      } else {
        setOngoingItemCount(count);
      }
    };
    const fetchCompletedItemCount = async () => {
      const { count, error } = await supabase.from("tasks").select("*", { count: "exact" }).eq('status', 'Completed');
      if (error) {
        console.error("Error fetching item count:", error);
      } else {
        setCompletedItemCount(count);
      }
    };
        useEffect(() => {
            fetchOngoingItemCount();
            fetchCompletedItemCount();
    fetchTasks()
   
    }, [])
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target
            setTaskData((prev) => ({
                ...prev,
                [name]: name == "due_date" ? new Date(value).toISOString() : value,
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
                    due_date: taskData.due_date,
                    status: taskData.task_status,
                }
            ])
            if (error) {
                console.error(error);
            } else {
                fetchTasks()
                fetchOngoingItemCount();
            fetchCompletedItemCount();
                setTaskData({
                    title: '',
                    description: '',
                    task_status: '',
                    due_date: ''
                })
            }
        }
        const handleDone = async (id: number) => {
                const { data, error } = await supabase
                .from("tasks")
                .update({
                    status: "Completed"
                })
                .eq('id', id)
                .select('*');
                if(error){
                    console.log(error)
                }
                fetchTasks()
                fetchOngoingItemCount();
            fetchCompletedItemCount();
        }
        const signOut = async () => {
            await supabase.auth.signOut()
}
AOS.init();
    return (
        <>
        <div className="do-section-box">
            <div className="flex flex-1 m-2">
                <div className="dashboard-card bg-white overflow-y-scroll h-full rounded-4xl w-full py-8 px-6 h-full">
                    <div className="dashboard-card-header flex items-center">
                        <span className="dashboard-card-heading text-2xl">
                            My Tasks
                        </span>
                        <div onClick={() => setIsOpen(true)} className="dashboard-add-btn border-2 border-gray-300 flex items-center justify-center ml-auto py-2.5 p-2 rounded-full duration-300 hover:border-[#fecf3e] hover:bg-[#fecf3e]">
                            <i className="fa-regular fa-plus"></i>
                        </div>
                    </div>
                    <div className="dashboard-card-content my-6 h-full overflow-hidden">
                        <Disclosure defaultOpen={true}>
                         <DisclosureButton className="py-4 px-4 my-2 text-2xl font-semibold rounded-4xl w-full border border-gray-200 flex items-center">
                            <div className="number bg-yellow-200 py-1 px-4 rounded-full mr-6">{ongoingItemCount}</div>
                            OnGoing Tasks <i className='fa-solid fa-chevron-down text-right ml-auto'></i></DisclosureButton>
                                                {tasks.map((task) => (
                                                    (task.status == "Ongoing" ? (
                    <DisclosurePanel key={task.id} data-open="true" className={`card w-full bg-yellow-100/50 mt-4 p-6 h-30 rounded-4xl origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0`}>
                        <div className="card-header flex">
                        <h1 className='title text-3xl font-semibold'>{task.title}</h1>
                            <button onClick={() => handleDone(task.id)} className='py-3.5 px-6 flex items-center justify-center border-2 border-gray-500 rounded-4xl relative ml-auto w-10'><i className='fa-solid fa-check'></i></button>
                    </div>
                        <p className='text-gray-600'>{task.description}</p>
                    </DisclosurePanel>
                    ) : null)
                    ))}

                        </Disclosure>
                        <Disclosure>
                         <DisclosureButton className="py-4 px-4 my-2 text-2xl font-semibold rounded-4xl w-full border border-gray-200 flex items-center">
                            <div className="number bg-green-200 py-1 px-4 rounded-full mr-6">{completedItemCount}</div>
                            Completed Tasks <i className='fa-solid fa-chevron-down text-right ml-auto'></i></DisclosureButton>
                                                {tasks.map((task) => (
                                                    (task.status == "Completed" ? (
                    <DisclosurePanel key={task.id} className={`card w-full bg-green-100 mt-4 p-4 h-30 rounded-4xl`}>
                        <div className="card-header flex">
                        <h1 className='title text-2xl'>{task.title}</h1>
                    </div>
                        <p className='text-gray-600'>{task.description}</p>
                    </DisclosurePanel>
                    ) : null)
                    ))}

                        </Disclosure>
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
                        <div  className="dashboard-add-btn border-2 border-gray-300 flex items-center justify-center ml-auto py-2.5 p-2 rounded-full duration-300 hover:border-[#fecf3e] hover:bg-[#fecf3e]">
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
        <AnimatePresence>
            {isOpen && (
         <Dialog open={isOpen} static onClose={() => setIsOpen(false)} className="relative z-50">
      <motion.div 
      initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30"
      >
      <div className="fixed inset-0 flex w-screen items-center justify-center  p-4 transition duration-300 ease-out data-closed:opacity-0">
        <DialogPanel className="w-3xl space-y-4 border border-gray-400 rounded-4xl bg-white py-8 px-8">
             <form onSubmit={handleSubmit} className='block'>
                <DialogTitle className="text-2xl font-semibold">
                <Field>
     <Input
        type="text"
        name="title"
        placeholder="Task..."
        onChange={handleChange}
        value={taskData.title}
         className="y-2 border-gray-200 py-3 outline-0 border-0 w-full text-4xl text-gray-400 data-focus:text-black hover:text-black"
        required
      />
    </Field>
        </DialogTitle>
          <div className="content my-2">
            <div className="flex">
    <Field className="w-50 mx-1">
        <Label className="font-semibold text-xl my-2">Due Date</Label>
        <Input 
      type="date" 
      name='due_date'
      className='block mb-4 border-3 text-xl data-focus:outline-[#fecf3e] border-gray-100 py-3 px-4 mt-2 rounded-lg w-full data-focus:bg-gray-100 data-hover:shadow' 
      placeholder="Due Date"
      onChange={handleChange} 
      value={taskData.due_date}
      />
    </Field>
    <Field className="w-70 mx-1">
        <Label className="font-semibold text-xl mr-4">Assign</Label>
        <Select 
      name='assign'
      className='block mb-4 border-3 text-xl  border-gray-100 py-3 px-4 mt-2 rounded-lg w-full data-focus:bg-gray-100 ' 
      onChange={handleChange} 
      value={taskData.due_date}
      >
        <option>Select Member</option>
      </Select>
    </Field>
    </div>
    <Field>
        <Label className="text-xl font-semibold">Description</Label>
      <Textarea
        name="description"
        placeholder="Your Description..."
         className="border-3 border-gray-100 data-focus:outline-[#fecf3e] text-xl my-2 py-3 px-4 min-h-40 rounded-lg w-full data-focus:bg-gray-100 data-hover:shadow"
        onChange={handleChange}
        value={taskData.description}
      />
    </Field>
    <div className="card-footer flex mt-8">
        <div className="flex flex-1">
                    <Button onClick={() => setIsOpen(false)} className="rounded-lg border-3 border-gray-200 text-gray-700 px-10 py-3 text-xl ">
      Cancel
    </Button>
        </div>
        <div className="flex flex-1 justify-end">
      <Button type="submit" className="rounded-lg bg-[#fecf3e] text-gray-700 px-10 py-3 text-xl ">
      Done
    </Button>
    </div>
    </div>
</div>
    </form>
          </DialogPanel>
        </div>
        </motion.div>
      </Dialog>
            )}
      </AnimatePresence>
      </div>
        </>
    )
}

export default Dashboard;