import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Button,
    Label,
    Field,
    Textarea,
    Input,
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
} from "@headlessui/react";
import supabase from "../../utils/supabase";
import type * as type from "../../utils/interfaces";

const Project = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<type.Project | null>(null);
    const [tasks, setTasks] = useState<type.getTask[]>([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [editTask, setEditTask] = useState<type.getTask | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<type.getTask>>({});
    const [loading, setLoading] = useState(true);
    const [tagQuery, setTagQuery] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [tags, setTags] = useState<type.Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<type.Tag[]>([]);

    const [tagData, setTagData] = useState<{ name: string }>({ name: "" });

    const fetchTags = async () => {
        const { data, error } = await supabase
            .from("tags")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.error(error);
        } else {
            setTags(data || []);
        }
    };

    const addTag = (tag: type.Tag | null) => {
        if (tag && !selectedTags.some((t) => t.id === tag.id)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const removeTag = (id: string) => {
        setSelectedTags(selectedTags.filter((t) => t.id !== id));
    };

    const filteredTags =
        tagQuery === ""
            ? tags
            : tags.filter((tag) =>
                tag.name.toLowerCase().includes(tagQuery.toLowerCase())
            );
    const fetchProjectDetails = async () => {
        if (!projectId) {
            setError("No project  provided");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const { data: projectData, error: projectError } = await supabase
                .from("projects")
                .select("*")
                .eq("id", projectId)
                .single();

            if (projectError || !projectData) {
                setError("Project not found");
                setLoading(false);
                return;
            }
            setProject(projectData);

            const { data: taskData, error: taskError } = await supabase
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
                .eq("project", projectId)
                .order("created_at", { ascending: false });

            if (taskError) {
                setError("Failed to load tasks");
                setLoading(false);
                return;
            }
            setTasks(taskData || []);
            setError(null);
        } catch (e) {
            setError("Error fetching project details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function fetchProjectDetails() {
            if (!projectId) {
                setError("No project  provided");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const { data: projectData, error: projectError } =
                    await supabase
                        .from("projects")
                        .select("*")
                        .eq("id", projectId)
                        .single();

                if (projectError || !projectData) {
                    setError("Project not found");
                    setLoading(false);
                    return;
                }
                setProject(projectData);

                const { data: taskData, error: taskError } = await supabase
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
                    .eq("project", projectId)
                    .order("created_at", { ascending: false });

                if (taskError) {
                    setError("Failed to load tasks");
                    setLoading(false);
                    return;
                }
                setTasks(taskData || []);
                setError(null);
            } catch (e) {
                setError("Error fetching project details");
            } finally {
                setLoading(false);
            }
        }

        fetchProjectDetails();
        const handleDone = async (id: number) => {
            const { error } = await supabase
                .from("tasks")
                .update({ status: "Completed" })
                .eq("id", id);

            if (error) {
                console.error(error);
                return;
            }
            fetchProjectDetails();
        };
    }, [projectId]);

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
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
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
            project: editFormData.project,
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
        fetchProjectDetails();
    };

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    if (loading)
        return <div className="p-5 text-center">Loading project details…</div>;
    if (error)
        return <div className="p-5 text-center text-red-600">{error}</div>;
    if (!project)
        return <div className="p-5 text-center">Project not found</div>;

    return (
        <div className="do-section-box flex w-full mx-auto">
            <div className="box flex-col bg-white flex-7 rounded-4xl w-full">
                <div className="project-header bg-white p-8 px-8 rounded-t-4xl">
                    <h1 className="text-4xl font-bold mb-4">
                        <span className="text-lg">Projects</span> /{" "}
                        {project.name}
                    </h1>
                </div>
                <div
                    className="project-tasks p-6 grid grid-cols-3 gap-4 grid-rows-3 bg-white"
                    onClick={() => setOpenEdit(false)}
                >
                    {tasks.length === 0 ? (
                        <>
                            <div className="container">
                                <h2 className="text-2xl font-semibold mb-3">
                                    Tasks
                                </h2>
                                <div className="task-container">
                                    <p className="italic text-gray-500">
                                        No tasks assigned to this project.
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {tasks
                                .filter((task) => task.status === "Ongoing")
                                .map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex flex-col duration-100 hover:bg-yellow-200 bg-yellow-100 border-2 border-gray-200 rounded-4xl cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTaskEdit(task.id);
                                        }}
                                    >
                                        <div className="flex flex-1 pt-2 items-center">
                                            <div className="para text-xl mx-2 my-2 h-full bg-gray-100 rounded-4xl shadow shadow-sm bg-yellow-1  py-3 px-4 border-2 border-gray-300 w-full h-full">
                                                <div className="flex font-semibold p-4 items-center text-xl ">
                                                    <span className="ml-2 mr-5">
                                                        <i className="fa-solid fa-list" />
                                                    </span>
                                                    {task.title}
                                                    <div className="ml-5 flex flex-1 items-center">
                                                        <div
                                                            className={`w-fit py-2 px-4 rounded-lg dots-bg font-bold text-white ${(task.status === "Ongoing" &&
                                                                    "bg-yellow-400") ||
                                                                (task.status === "Assigned" &&
                                                                    "bg-red-400") ||
                                                                (task.status === "Completed" &&
                                                                    "bg-green-400")
                                                                }`}
                                                        >
                                                            {task.status}
                                                        </div>
                                                        <div className="profile flex flex-1 justify-end">
                                                            <img src="../../public/profile.webp" className="w-10 rounded-full" alt="profile.webp" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="task-desc mx-2 my-2">
                                                    {task.description}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center py-5 text-gray-800 font-bold text-lg ml-5">
                                            Due Date: {task.due_date?.split("T")[0]}
                                        </div>
                                    </div>
                                ))}
                            {tasks
                                .filter((task) => task.status === "Completed")
                                .map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex flex-col duration-100 hover:bg-green-200 bg-green-100 border-2 border-gray-200 rounded-4xl cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTaskEdit(task.id);
                                        }}
                                    >
                                        <div className="flex flex-1 pt-2 items-center">
                                            <div className="para text-xl mx-2 my-2 h-full bg-gray-100 rounded-4xl shadow shadow-sm bg-yellow-1  py-3 px-4 border-2 border-gray-300 w-full h-full">
                                                <div className="flex font-semibold p-4 items-center text-xl ">
                                                    <span className="ml-2 mr-5">
                                                        <i className="fa-solid fa-list" />
                                                    </span>
                                                    {task.title}
                                                    <div className="ml-5 flex flex-1 items-center">
                                                        <div
                                                            className={`w-fit py-2 px-4 rounded-lg dots-bg font-bold text-white ${(task.status === "Ongoing" &&
                                                                    "bg-yellow-400") ||
                                                                (task.status === "Assigned" &&
                                                                    "bg-red-400") ||
                                                                (task.status === "Completed" &&
                                                                    "bg-green-400")
                                                                }`}
                                                        >
                                                            {task.status}
                                                        </div>
                                                        <div className="profile flex flex-1 justify-end">
                                                            <img src="../../public/profile.webp" className="w-10 rounded-full" alt="profile.webp" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="task-desc mx-2 my-2">
                                                    {task.description}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center py-5 text-gray-800 font-bold text-lg ml-5">
                                            Due Date: {task.due_date?.split("T")[0]}
                                        </div>
                                    </div>
                                ))}
                        </>
                    )}
                </div>
            </div>
            <div
                className={`duration-200 overflow-hidden ${openEdit
                        ? "visible flex flex-2 ml-4 p-6"
                        : "invisible w-[0]"
                    } rounded-4xl bg-white justify-center items-center`}
                onClick={(e) => e.stopPropagation()}
            >
                {editTask && (
                    <form
                        onSubmit={handleEditSubmit}
                        className="flex flex-col space-y-4"
                    >
                        <Field>
                            <Input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={editFormData.title || ""}
                                onChange={handleEditInputChange}
                                className="y-2 border-2 rounded-lg border-gray-200 py-3 outline-0 border-0 w-full text-4xl text-gray-700"
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
                        <Field className="w-full mt-4">
                            <Label className="font-semibold text-xl mb-2 block">
                                Tags
                            </Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedTags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="bg-blue-100 px-2 py-1 rounded flex items-center gap-1"
                                    >
                                        {tag.name}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag.id)}
                                            className="text-red-500 font-bold"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <Combobox<type.Tag | null>
                                value={null}
                                onChange={addTag}
                            >
                                <ComboboxInput
                                    displayValue={() => ""}
                                    onChange={(e) =>
                                        setTagQuery(e.target.value)
                                    }
                                    placeholder="Add tags..."
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
                                <ComboboxOptions className="border border-gray-300 rounded max-h-40 overflow-auto mt-1 bg-white shadow-lg">
                                    {filteredTags
                                        .filter(
                                            (tag) =>
                                                !selectedTags.some(
                                                    (t) => t.id === tag.id
                                                )
                                        )
                                        .map((tag) => (
                                            <ComboboxOption
                                                key={tag.id}
                                                value={tag}
                                                className={({ active }) =>
                                                    `cursor-pointer select-none px-4 py-2 ${active
                                                        ? "bg-yellow-200"
                                                        : ""
                                                    }`
                                                }
                                            >
                                                {tag.name}
                                            </ComboboxOption>
                                        ))}
                                </ComboboxOptions>
                            </Combobox>
                        </Field>
                        <Field>
                            <select
                                name="status"
                                className="py-1 px-2 border-1 border-gray-300 rounded-lg"
                                value={editFormData.status || ""}
                                onChange={handleEditInputChange}
                            >
                                <option
                                    value="Ongoing"
                                    {...(editFormData.status == "Ongoing" ? (
                                        <>selected</>
                                    ) : null)}
                                >
                                    Ongoing
                                </option>
                                <option
                                    value="Completed"
                                    {...(editFormData.status == "Completed" ? (
                                        <>selected</>
                                    ) : null)}
                                >
                                    Completed
                                </option>
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

export default Project;
