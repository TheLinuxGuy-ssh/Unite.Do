import { useState } from "react";

const Projects = () => {



  type Project = {
    id: string,
    name: string
  }
    
  type getTask = {
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
const [taskData, setTaskData] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    status: 'Ongoing',
    due_date: new Date().toISOString(),
    project: ''
  });

  const [tagData, setTagData] = useState<{ name: string }>({ name: '' });
  const [projectData, setProjectData] = useState<{ name: string }>({ name: '' })
    return (
        
        <div className="do-section-box" data-aos="fade-right">
            Projects
        </div>
    )
}

export default Projects