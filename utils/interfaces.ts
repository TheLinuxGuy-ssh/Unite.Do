export type Tag = {
    id: string;
    name: string;
};

export type Project = {
    id: string;
    name: string;
};

export type Task = {
    id: string;
    title: string;
    description: string;
    status: string;
    due_date: string;
    project: string;
};

export type getTask = {
    id: string;
    title: string;
    description: string;
    status: string;
    due_date: string;
    assigned_to: string;
    project: string;
    task_tags?: {
        tag_id: string;
        tags: {
            id: string;
            name: string;
        };
    }[];
};
