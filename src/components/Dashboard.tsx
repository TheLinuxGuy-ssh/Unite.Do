import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import type * as type from "../../utils/interfaces"
import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Dialog,
    DialogPanel,
    DialogTitle,
    Button,
    Field,
    Input,
    Label,
    Textarea,
    Select,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import AOS from "aos";

const Dashboard = () => {
    const [taskIsOpen, setTaskIsOpen] = useState(false);
    const [tagIsOpen, setTagIsOpen] = useState(false);
    const [projectIsOpen, setProjectIsOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<type.Tag[]>([]);
    const [tagQuery, setTagQuery] = useState("");
    const [users, setUsers] = useState<type.User[]>([]);
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
        assigned_to: ""
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

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.error(error);
        } else {
            setUsers(data || []);
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
        fetchUsers();
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
        if (!taskData.project) {
            console.error("Project must be selected.");
            return;
        }

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
                assigned_to: ""
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

    const handleDone = async (id: string) => {
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

    const handleTagDelete = async (id: string) => {
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

    return (
        <>
            <div className="do-section-box ">
                <div className="flex flex-3 flex-col m-2 p-2.5 py-0 bg-white border-2 border-gray-100 rounded-4xl">
                    <div className="dashboard-card-header flex items-center border-b-3 border-gray-200">
                        <span className="dashboard-card-heading text-xl text-gray-700 mt-5 mx-5 mb-3 font-semibold">
                            Projects
                        </span>
                        <div className="card-header-right ml-auto">
                            <button
                                className="bg-yellow-100 duration-100 border-2 border-yellow-300 hover:bg-[#fcef30] py-2 px-4 rounded-4xl text-black"
                                onClick={() => setProjectIsOpen(true)}
                            >
                                New Project <i className="fa fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div className="projects p-2 mt-4 grid grid-cols-3 gap-4">
                        {projects.map((projectItem) => (
                            <NavLink
                                to={`/project/${projectItem.id}`}
                                key={projectItem.id}
                                className="card flex flex-col w-full overflow-hidden h-full rounded-4xl  bg-white-100 shadow shadow-md duration-100 hover:shadow-lg border border-gray-300"
                            >
                                <div className="project-title p-4 pb-0 text-md font-bold mb-4">
                                    <i className="fa-regular fa-folder mr-2"></i>{" "}
                                    {projectItem.name}
                                </div>
                                <div className="project-content flex flex-col m-2 mt-0 p-4 rounded-4xl bg-gray-100 h-[100%]">
                                    {tasks.filter(
                                        (task) => task.project === projectItem.id
                                    ).length !== 0 ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {tasks
                                                .filter(
                                                    (task) =>
                                                        task.project ===
                                                        projectItem.id
                                                )
                                                .slice(0,4).map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className={`task border-2 w-full h-full dots-bg rounded-2xl p-1 px-2 ${task.status ===
                                                                "Ongoing"
                                                                ? "bg-yellow-100 border-yellow-200"
                                                                : "bg-green-100 border-green-200"
                                                            }`}
                                                    >
                                                        <div className="font-bold text-sm">
                                                            {task.title}
                                                        </div>
                                                        <div className="mt-1  flex flex-wrap gap-1">
                                                            {task.task_tags &&
                                                                task.task_tags.length >
                                                                0 && (
                                                                    <>
                                                                        {task.task_tags.map(
                                                                            ({
                                                                                tag_id,
                                                                                tags,
                                                                            }) => (
                                                                                <span
                                                                                    key={
                                                                                        tag_id
                                                                                    }
                                                                                    className="bg-blue-200 text-xs border-2 border-blue-300 px-1.5 py-1 rounded-2xl font-medium"
                                                                                >
                                                                                    {
                                                                                        tags.name
                                                                                    }
                                                                                </span>
                                                                            )
                                                                        )}
                                                                    </>
                                                                )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="project-subtitle flex items-center justify-center h-full  text-lg font-semibold text-gray-600 my-2">
                                            No Task Assigned
                                        </div>
                                    )}
                                </div>
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="flex flex-1 m-2 h-[87vh] flex-col overflow-hidden rounded-4xl">
                    <div className="dashboard-card mb-2 bg-white  flex-1 overflow-hidden rounded-4xl w-full px-2.5">
                        <div className="dashboard-card-header flex items-center border-b-3 border-gray-200">
                            <span className="dashboard-card-heading text-xl text-gray-700 mt-5 mx-5 mb-3 font-semibold">
                                Tasks
                            </span>
                                                        <button
                                className="bg-yellow-100 ml-auto duration-100 border-2 border-yellow-300 hover:bg-[#fcef30] py-2 px-4 rounded-4xl text-black"
                                onClick={() => setTaskIsOpen(true)}
                            >
                                New Task <i className="fa fa-plus"></i>
                            </button>
                        </div>
                        <div className="dashboard-card-content h-full  flex-1 overflow-y-scroll">
                            <Disclosure defaultOpen={true}>
                                <DisclosureButton className="py-4 px-4 my-2 text-lg font-semibold rounded-4xl w-full border border-gray-200 flex items-center">
                                    <div className="number bg-yellow-200 py-1 px-4 rounded-full mr-6">
                                        {ongoingItemCount}
                                    </div>
                                    OnGoing Tasks{" "}
                                    <i className="fa-solid fa-chevron-down text-right ml-auto"></i>
                                </DisclosureButton>
                                {tasks.map(
                                    (task) =>
                                        task.status === "Ongoing" && (
                                            <DisclosurePanel
                                                key={task.id}
                                                className="card dots-bg w-full border-3 border-yellow-100 bg-yellow-100/50 mt-4 p-5 h-fit h-30 rounded-4xl origin-top transition duration-200 ease-out"
                                            >
                                                <div className="card-header flex">
                                                    <h1 className="title text-xl font-semibold">
                                                        <i className="fa-solid fa-list"></i>{" "}
                                                        {task.title}
                                                    </h1>
                                                    <button
                                                        onClick={() =>
                                                            handleDone(task.id)
                                                        }
                                                        className="py-4 px-6 flex items-center justify-center border-2 duration-100 hover:bg-yellow-300 border-gray-500 rounded-4xl relative ml-auto w-10"
                                                    >
                                                        <i className="fa-solid fa-check"></i>
                                                    </button>
                                                </div>
                                                <p className="text-gray-600 mb-5">
                                                    {task.description}
                                                </p>
                                                {task.task_tags &&
                                                    task.task_tags.length >
                                                    0 && (
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {task.task_tags.map(
                                                                ({
                                                                    tag_id,
                                                                    tags,
                                                                }) => (
                                                                    <span
                                                                        key={
                                                                            tag_id
                                                                        }
                                                                        className="bg-yellow-200 px-2 py-1 rounded-2xl text-sm font-medium"
                                                                    >
                                                                        {
                                                                            tags.name
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                            </DisclosurePanel>
                                        )
                                )}
                            </Disclosure>
                            <Disclosure>
                                <DisclosureButton className="py-4 px-4 my-2 text-lg font-semibold rounded-4xl w-full border border-gray-200 flex items-center">
                                    <div className="number bg-green-200 py-1 px-4 rounded-full mr-6">
                                        {completedItemCount}
                                    </div>
                                    Completed Tasks{" "}
                                    <i className="fa-solid fa-chevron-down text-right ml-auto"></i>
                                </DisclosureButton>
                                {tasks.map(
                                    (task) =>
                                        task.status === "Completed" && (
                                            <DisclosurePanel
                                                key={task.id}
                                                className="card dots-bg w-full border-3 border-green-100 bg-green-100/50 mt-4 p-6 h-fit rounded-4xl"
                                            >
                                                <div className="card-header flex items-center">
                                                    <h1 className="title text-2xl">
                                                        <i className="fa-solid fa-list mr-2"></i>{" "}
                                                        {task.title}
                                                    </h1>
                                                </div>
                                                <p className="text-gray-600">
                                                    {task.description}
                                                </p>
                                                {task.task_tags &&
                                                    task.task_tags.length >
                                                    0 && (
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {task.task_tags.map(
                                                                ({
                                                                    tag_id,
                                                                    tags,
                                                                }) => (
                                                                    <span
                                                                        key={
                                                                            tag_id
                                                                        }
                                                                        className="bg-green-300 px-2 py-1 rounded-2xl text-sm font-medium"
                                                                    >
                                                                        {
                                                                            tags.name
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                            </DisclosurePanel>
                                        )
                                )}
                            </Disclosure>
                        </div>
                    </div>
                    <div className="dashboard-card mt-2 bg-white rounded-4xl flex-1 w-full py-3 px-6">
                        <div className="dashboard-card-header flex items-center border-b-3 border-gray-200 py-1">
                            <span className="dashboard-card-heading font-semibold text-gray-600 text-lg">
                                Tags
                            </span>
                            <div
                                onClick={() => setTagIsOpen(true)}
                                className="dashboard-add-btn border-2 border-gray-300 flex items-center justify-center ml-auto py-2.5 p-2 rounded-full duration-300 hover:border-[#fecf3e] hover:bg-[#fecf3e]"
                            >
                                <i className="fa-regular fa-plus"></i>
                            </div>
                        </div>
                        <div className="dashboard-card-content grid grid-cols-2">
                            {tags.map((tag) => (
                                <div
                                    key={tag.id}
                                    className="tag flex w-full p-3 shadow shadow-sm w-fit m-1.5 border-2 border-gray-200  py-1 text-md rounded-4xl"
                                >
                                    <span className="tag-name  w-full text-center">
                                        {tag.name}
                                    </span>
                                    <div
                                        className=""
                                        onClick={() => handleTagDelete(tag.id)}
                                    >
                                        <i className="fa fa-close text-right"></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {projectIsOpen && (
                    <Dialog
                        open={projectIsOpen}
                        static
                        onClose={() => setProjectIsOpen(false)}
                        className="relative z-50"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/30"
                        >
                            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 transition duration-300 ease-out">
                                <DialogPanel className="w-lg space-y-4 border border-gray-400 rounded-4xl bg-white py-8 px-8">
                                    <form
                                        onSubmit={handleProjectSubmit}
                                        className="block"
                                    >
                                        <DialogTitle className="text-xl font-semibold">
                                            <Field>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Project Name..."
                                                    onChange={
                                                        handleProjectChange
                                                    }
                                                    value={projectData.name}
                                                    className="y-2 border-gray-200 py-3 outline-0 border-0 w-full text-xl text-gray-400 data-focus:text-black hover:text-black"
                                                    required
                                                />
                                            </Field>
                                        </DialogTitle>
                                        <div className="card-footer flex mt-2">
                                            <div className="flex flex-1">
                                                <Button
                                                    onClick={() =>
                                                        setProjectIsOpen(false)
                                                    }
                                                    className="rounded-lg border-3 border-gray-200 text-gray-700 px-6 py-2 text-md"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                            <div className="flex flex-1 justify-end">
                                                <Button
                                                    type="submit"
                                                    className="rounded-lg bg-[#fecf3e] text-gray-700 px-6 py-2 text-md"
                                                >
                                                    Done
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </DialogPanel>
                            </div>
                        </motion.div>
                    </Dialog>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {tagIsOpen && (
                    <Dialog
                        open={tagIsOpen}
                        static
                        onClose={() => setTagIsOpen(false)}
                        className="relative z-50"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/30"
                        >
                            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 transition duration-300 ease-out">
                                <DialogPanel className="w-3xl space-y-4 border border-gray-400 rounded-4xl bg-white py-8 px-8">
                                    <form
                                        onSubmit={handleTagSubmit}
                                        className="block"
                                    >
                                        <DialogTitle className="text-2xl font-semibold">
                                            <Field>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Tag Name..."
                                                    onChange={handleTagChange}
                                                    value={tagData.name}
                                                    className="y-2 border-gray-200 py-3 outline-0 border-0 w-full text-4xl text-gray-400 data-focus:text-black hover:text-black"
                                                    required
                                                />
                                            </Field>
                                        </DialogTitle>
                                        <div className="card-footer flex mt-8">
                                            <div className="flex flex-1">
                                                <Button
                                                    onClick={() =>
                                                        setTagIsOpen(false)
                                                    }
                                                    className="rounded-lg border-3 border-gray-200 text-gray-700 px-10 py-3 text-xl"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                            <div className="flex flex-1 justify-end">
                                                <Button
                                                    type="submit"
                                                    className="rounded-lg bg-[#fecf3e] text-gray-700 px-10 py-3 text-xl"
                                                >
                                                    Done
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </DialogPanel>
                            </div>
                        </motion.div>
                    </Dialog>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {taskIsOpen && (
                    <Dialog
                        open={taskIsOpen}
                        static
                        onClose={() => setTaskIsOpen(false)}
                        className="relative z-50"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/30"
                        >
                            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 transition duration-300 ease-out">
                                <DialogPanel className="w-3xl space-y-4 border border-gray-400 rounded-4xl bg-white py-8 px-8">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="block"
                                    >
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
                                            <Field className="w-50 mx-1">
                                                <Label className="font-semibold text-xl my-2">
                                                    Due Date
                                                </Label>
                                                <Input
                                                    type="date"
                                                    name="due_date"
                                                    className="block mb-4 border-3 text-xl data-focus:outline-[#fecf3e] border-gray-100 py-3 px-4 mt-2 rounded-lg w-full data-focus:bg-gray-100 data-hover:shadow"
                                                    placeholder="Due Date"
                                                    onChange={handleChange}
                                                    value={
                                                        taskData.due_date.split(
                                                            "T"
                                                        )[0]
                                                    }
                                                />
                                            </Field>
                                            <div className="flex w-full">
                                                <Field className="w-60 mx-1">
                                                    <Label className="font-semibold text-xl mr-4">
                                                        Project
                                                    </Label>
                                                    <Select
                                                        name="project"
                                                        value={taskData.project}
                                                        className="block mb-4 border-3 text-xl border-gray-100 py-3 px-4 mt-2 rounded-lg w-full data-focus:bg-gray-100"
                                                        onChange={handleChange}
                                                    >
                                                        <option
                                                            value=""
                                                            selected
                                                        >
                                                            Select Project
                                                        </option>
                                                        {projects.map(
                                                            (project) => (
                                                                <option
                                                                    key={
                                                                        project.id
                                                                    }
                                                                    value={
                                                                        project.id
                                                                    }
                                                                >
                                                                    {
                                                                        project.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </Select>
                                                </Field>
                                                <Field className="ml-8 w-50 mx-1">
                                                    <Label className="font-semibold text-xl mr-4">
                                                        Assign
                                                    </Label>
                                                    <Select
                                                        name="assign"
                                                        className="block mb-4 border-3 text-xl border-gray-100 py-3 px-4 mt-2 rounded-lg w-full data-focus:bg-gray-100"
                                                        onChange={handleChange}
                                                        value={taskData.assigned_to}
                                                    >
                                                        <option>
                                                            Select Member
                                                        </option>
                                                        {users.map((user) => (
                                                            <option value={user.id}>{user.name}</option>
                                                        ))}
                                                    </Select>
                                                </Field>
                                            </div>
                                        </div>
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
                                                            onClick={() =>
                                                                removeTag(
                                                                    tag.id
                                                                )
                                                            }
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
                                                        setTagQuery(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Add tags..."
                                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                                />
                                                <ComboboxOptions className="border border-gray-300 rounded max-h-40 overflow-auto mt-1 bg-white shadow-lg">
                                                    {filteredTags
                                                        .filter(
                                                            (tag) =>
                                                                !selectedTags.some(
                                                                    (t) =>
                                                                        t.id ===
                                                                        tag.id
                                                                )
                                                        )
                                                        .map((tag) => (
                                                            <ComboboxOption
                                                                key={tag.id}
                                                                value={tag}
                                                                className={({
                                                                    active,
                                                                }) =>
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
                                        <Field className="mt-4">
                                            <Label className="text-xl font-semibold">
                                                Description
                                            </Label>
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
                                                <Button
                                                    onClick={() =>
                                                        setTaskIsOpen(false)
                                                    }
                                                    className="rounded-lg border-3 border-gray-200 text-gray-700 px-10 py-3 text-xl"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                            <div className="flex flex-1 justify-end">
                                                <Button
                                                    type="submit"
                                                    className="rounded-lg bg-[#fecf3e] text-gray-700 px-10 py-3 text-xl"
                                                >
                                                    Done
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </DialogPanel>
                            </div>
                        </motion.div>
                    </Dialog>
                )}
            </AnimatePresence>
        </>
    );
};

export default Dashboard;
