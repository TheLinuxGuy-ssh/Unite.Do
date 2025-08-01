import { useState, useEffect } from "react";
import { Checkbox, DialogPanel, Field, Input, Button, Textarea } from "@headlessui/react";
import * as type from "../../utils/interfaces";
import supabase from "../../utils/supabase";

const Tasks = () => {
  const [tasks, setTasks] = useState<type.getTask[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editTask, setEditTask] = useState<type.getTask | null>(null);

  const [editFormData, setEditFormData] = useState<Partial<type.getTask>>({});

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        task_tags (
          tag_id,
          tags ( id, name )
        )
        `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setTasks(data || []);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDone = async (id: number) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: "Completed" })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }
    fetchTasks();
  };

  const handleTaskEdit = async (taskId: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        task_tags (
          tag_id,
          tags ( id, name )
        )
        `
      )
      .eq("id", taskId)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setEditTask(data);
    setEditFormData({
      title: data.title,
      description: data.description,
      status: data.status,
      due_date: data.due_date ? data.due_date.split("T")[0] : "",
      project: data.project || "",
      assigned_to: data.assigned_to || "",
    });
    setOpenEdit(true);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTask) return;

    const updatedTask = {
      title: editFormData.title,
      description: editFormData.description,
      status: editFormData.status,
      due_date: editFormData.due_date,
      project: editFormData.project
    };

    const { error } = await supabase
      .from("tasks")
      .update(updatedTask)
      .eq("id", editTask.id);

    if (error) {
      console.error(error);
      return;
    }

    setOpenEdit(false);
    setEditTask(null);
    setEditFormData({});
    fetchTasks();
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="do-section-box flex" onClick={() => setOpenEdit(false)}>
      <div className="bg-white w-full rounded-4xl flex-7">
        <div className="team team-header bg-white p-5 rounded-t-4xl border-b-2 border-gray-300 w-full h-fit">
          <span className="title text-3xl font-semibold">Manage Your Tasks</span>
        </div>
        <div className="content grid grid-cols-3 gap-2 my-6 px-4 bg-white w-full">
          {tasks
            .filter((task) => task.status === "Ongoing")
            .map((task) => (
              <div
                key={task.id}
                className="flex flex-col p-3 hover:bg-gray-100 border-2 border-gray-200 rounded-4xl cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskEdit(task.id);
                }}
              >
                <div className="flex pt-2">
                  <div className="flex font-semibold items-center text-xl">
                    <span className="ml-2 mr-5">
                      <i className="fa-solid fa-list" />
                    </span>
                    {task.title}
                  </div>
                  <div className="ml-5">
                    <div
                      className={`w-fit py-2 px-4 rounded-lg font-bold text-white ${
                        (task.status === "Ongoing" && "bg-yellow-400") ||
                        (task.status === "Assigned" && "bg-red-400") ||
                        (task.status === "Completed" && "bg-green-400")
                      }`}
                    >
                      {task.status}
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 font-bold ml-3">
                  Due Date: {task.due_date?.split("T")[0]}
                </div>
                <div className="para text-xl w-full h-full bg-gray-100 rounded-4xl mt-4 py-3 px-4 border-2 border-gray-300">
                  {task.description}
                </div>
              </div>
            ))}
          {tasks
            .filter((task) => task.status === "Completed")
            .map((task) => (
              <div
                key={task.id}
                className="flex flex-col p-3 hover:bg-gray-100 border-2 border-gray-200 rounded-4xl cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskEdit(task.id);
                }}
              >
                <div className="flex pt-2">
                  <div className="flex font-semibold items-center text-xl">
                    <span className="ml-2 mr-5">
                      <i className="fa-solid fa-list" />
                    </span>
                    {task.title}
                  </div>
                  <div className="ml-5">
                    <div
                      className={`w-fit py-2 px-4 rounded-lg font-bold text-white ${
                        (task.status === "Ongoing" && "bg-yellow-400") ||
                        (task.status === "Assigned" && "bg-red-400") ||
                        (task.status === "Completed" && "bg-green-400")
                      }`}
                    >
                      {task.status}
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 font-bold ml-3">
                  Due Date: {task.due_date?.split("T")[0]}
                </div>
                <div className="para text-xl w-full h-full bg-gray-100 rounded-4xl mt-4 py-3 px-4 border-2 border-gray-300">
                  {task.description}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div
        className={`duration-200 overflow-hidden ${
          openEdit ? "visible flex flex-2 ml-4 p-6" : "invisible w-[0]"
        } rounded-4xl bg-white`}
        onClick={(e) => e.stopPropagation()}
      >
        {editTask && (
          <form onSubmit={handleEditSubmit} className="flex flex-col space-y-4">
            <Field>
              <Input
                type="text"
                name="title"
                placeholder="Title"
                value={editFormData.title || ""}
                onChange={handleEditInputChange}
                className="y-2 border-gray-200 py-3 outline-0 border-0 w-full text-4xl text-gray-700"
                required
              />
            </Field>
            <Field>
              <Input
                type="date"
                name="due_date"
                value={editFormData.due_date || ""}
                onChange={handleEditInputChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
              />
            </Field>
            <Field>
              <select
                name="project"
                value={editFormData.project || ""}
                onChange={handleEditInputChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
              >
                <option value="">Select Project</option>
                {tasks &&
                  tasks.length > 0 &&
                  tasks.map((p) => (
                    <option key={p.id} value={p.project} {...p.status == editFormData.status ? <>selected</> : null}>
                      {p.project}
                    </option>
                  ))}
              </select>
            </Field>
            <Field>
                      <select 
                      name="status"
                      className="py-1 px-2 border-1 border-gray-300 rounded-lg"
                      value={editFormData.status || ""}
                      onChange={handleEditInputChange}
                      >
                          <option value="Ongoing" {...editFormData.status == "Ongoing" ? <>selected</> : null}>Ongoing</option>
                          <option value="Completed" {...editFormData.status == "Completed" ? <>selected</> : null}>Completed</option>
                      </select>
                  </Field>

            <Field>
              <Textarea
                name="description"
                value={editFormData.description || ""}
                onChange={handleEditInputChange}
                placeholder="Description"
                className="border border-gray-300 rounded-lg p-3 w-full min-h-[120px]"
              />
            </Field>

            <div className="flex space-x-4">
              <Button
                type="button"
                onClick={() => {
                  setOpenEdit(false);
                  setEditTask(null);
                }}
                className="bg-gray-300 text-black rounded px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-yellow-400 text-white rounded px-6 py-2"
              >
                Save
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Tasks;
