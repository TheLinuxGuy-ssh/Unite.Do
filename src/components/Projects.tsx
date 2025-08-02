import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import { NavLink } from "react-router-dom";
import AOS from "aos";
import { Checkbox } from "@headlessui/react";
import * as type from "../../utils/interfaces";

const Projects = () => {
    const [taskIsOpen, setTaskIsOpen] = useState(false);
    const [tagIsOpen, setTagIsOpen] = useState(false);
    const [projectIsOpen, setProjectIsOpen] = useState(false);
    const [editIsOpen, setEditIsOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<type.Tag[]>([]);
    const [tagQuery, setTagQuery] = useState("");
    const [tasks, setTasks] = useState<type.getTask[]>([]);
    const [projects, setProjects] = useState<type.Project[]>([]);
    const [tags, setTags] = useState<type.Tag[]>([]);
    const [ongoingItemCount, setOngoingItemCount] = useState<number | null>(
        null
    );
    const [completedItemCount, setCompletedItemCount] = useState<number | null>(
        null
    );

    const [taskData, setTaskData] = useState<Omit<type.Task, "id">>({
        title: "",
        description: "",
        status: "Ongoing",
        due_date: new Date().toISOString(),
        project: "",
        assigned_to: "",
    });

    const [tagData, setTagData] = useState<{ name: string }>({ name: "" });
    const [projectData, setProjectData] = useState<{ name: string }>({
        name: "",
    });

    const fetchTasks = async () => {
        const { data, error } = await supabase
            .from("tasks")
            .select(
                `
    *,
    task_tags (
      tag_id,
      tags (
        id,
        name
      )
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

    const fetchProjects = async () => {
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.error(error);
        } else {
            setProjects(data || []);
        }
    };

    const fetchOngoingItemCount = async () => {
        const { count, error } = await supabase
            .from("tasks")
            .select("*", { count: "exact" })
            .eq("status", "Ongoing");
        if (error) {
            console.error(error);
        } else {
            setOngoingItemCount(count);
        }
    };

    const fetchCompletedItemCount = async () => {
        const { count, error } = await supabase
            .from("tasks")
            .select("*", { count: "exact" })
            .eq("status", "Completed");
        if (error) {
            console.error(error);
        } else {
            setCompletedItemCount(count);
        }
    };

    useEffect(() => {
        AOS.init();
        fetchTasks();
        fetchTags();
        fetchProjects();
        fetchOngoingItemCount();
        fetchCompletedItemCount();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({
            ...prev,
            [name]: name === "due_date" ? new Date(value).toISOString() : value,
        }));
    };
    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setTagData({ name: value });
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setProjectData({ name: value });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTaskIsOpen(false);

        const { data, error } = await supabase
            .from("tasks")
            .insert([
                {
                    title: taskData.title,
                    description: taskData.description,
                    due_date: taskData.due_date,
                    status: taskData.status,
                    project: taskData.project,
                },
            ])
            .select();

        if (error) {
            console.error("Error inserting task:", error);
            return;
        }

        if (data && data.length > 0) {
            const newTask = data[0];

            if (selectedTags.length > 0) {
                const taskTagsInsert = selectedTags.map((tag) => ({
                    task_id: newTask.id,
                    tag_id: tag.id,
                }));

                const { error: joinError } = await supabase
                    .from("task_tags")
                    .insert(taskTagsInsert);

                if (joinError) {
                    console.error("Error inserting task_tags:", joinError);
                }
            }

            await fetchTasks();
            await fetchOngoingItemCount();
            await fetchCompletedItemCount();

            setTaskData({
                title: "",
                description: "",
                status: "Ongoing",
                due_date: new Date().toISOString(),
                project: "",
                assigned_to: "",
            });
            setSelectedTags([]);
        }
    };

    const handleTagSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTagIsOpen(false);

        const { error } = await supabase
            .from("tags")
            .insert([{ name: tagData.name }]);
        if (error) {
            console.error(error);
        } else {
            await fetchTags();
            setTagData({ name: "" });
        }
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProjectIsOpen(false);

        const { error } = await supabase
            .from("projects")
            .insert([{ name: projectData.name }]);
        if (error) {
            console.error(error);
        } else {
            await fetchProjects();
            setProjectData({ name: "" });
        }
    };

    const handleDone = async (id: number) => {
        const { error } = await supabase
            .from("tasks")
            .update({ status: "Completed" })
            .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }
        await fetchTasks();
        await fetchOngoingItemCount();
        await fetchCompletedItemCount();
    };

    const handleTagDelete = async (id: number) => {
        const { error } = await supabase.from("tags").delete().eq("id", id);

        if (error) {
            console.error(error);
            return;
        }
        await fetchTasks();
        await fetchTags();
        await fetchOngoingItemCount();
        await fetchCompletedItemCount();
    };

    //   const handleProjectEdit = async (id: number) => {
    //         const { data, error } = await supabase
    //         .from("projects")
    //         .select('*')
    //         .order("created_at", {ascending: false});
    //         setProjectData(data)
    //   }

    const [openEdit, setOpenEdit] = useState(false);
    const [editTask, setEditTask] = useState<type.getTask | null>(null);

    const [editFormData, setEditFormData] = useState<Partial<type.getTask>>({});

    return (
        <>
            <div
                className="do-section-box bg-[#fff!important]"
                data-aos="fade-right"
            >
                <div className="projects w-full s mt-4 grid grid-cols-3 grid-rows-3 gap-4">
                    {projects.map((projectItem) => (
                        <NavLink
                            to={`/project/${projectItem.id}`}
                            key={projectItem.id}
                            className="card w-full h-fit rounded-4xl bg-white-100 shadow shadow-md duration-100 hover:shadow-lg border border-gray-300"
                        >
                            <div className="project-title p-4 pb-0 text-xl font-semibold mb-5">
                                <i className="fa-regular fa-folder mr-2"></i>{" "}
                                {projectItem.name}
                            </div>
                            {tasks.filter(
                                (task) => task.project == projectItem.id
                            ).length != 0 ? (
                                <>
                                    <div className="project-content rounded-4xl m-2 p-4 grid grid-cols-2 gap-2">
                                        {tasks
                                            .filter(
                                                (task) =>
                                                    task.project ===
                                                    projectItem.id
                                            )
                                            .map((task) => (
                                                <div
                                                    key={task.id}
                                                    className={`task border-2 dots-bg w-full h-full rounded-2xl p-1 px-2 ${task.status ===
                                                            "Ongoing"
                                                            ? "bg-yellow-100 border-yellow-200"
                                                            : "bg-green-100 border-green-200"
                                                        }`}
                                                >
                                                    <div className="font-semibold">
                                                        {task.title}
                                                    </div>
                                                    {task.task_tags &&
                                                        task.task_tags.length >
                                                        0 && (
                                                            <div className="mt-2 p-1 flex flex-wrap gap-2">
                                                                {task.task_tags.map(
                                                                    ({
                                                                        tag_id,
                                                                        tags,
                                                                    }) => (
                                                                        <span
                                                                            key={
                                                                                tag_id
                                                                            }
                                                                            className="bg-yellow-200 border-2 border-yellow-300 px-2 py-1 rounded-2xl text-sm font-medium"
                                                                        >
                                                                            {
                                                                                tags.name
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="project-subtitle mt-5 text-lg font-semibold text-gray-600 my-2">
                                        No Task Assigned
                                    </div>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Projects;
