 export type Tag = {
    id: number;
    name: string;
  }

 export type Project = {
    id: string,
    name: string
  }

 export type Task = {
    id: number;
    title: string;
    description: string;
    status: string;
    due_date: string;
    project: string;
  };

 export type getTask = {
  id: number;
  title: string;
  description: string;
  status: string;
  assigned_to: string;
  project: string;
  task_tags?: {
    tag_id: number;
    tags: {
      id: number;
      name: string;
    };
  }[];
};