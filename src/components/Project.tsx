import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import type * as type from "../../utils/interfaces";

const Project = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<type.Project | null>(null);
  const [tasks, setTasks] = useState<type.getTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectDetails() {
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
          .select(`
            *,
            task_tags (
              tag_id,
              tags ( id, name )
            )
          `)
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
  }, [projectId]);

  if (loading) return (
  <div className="p-5 text-center">Loading project details…</div>
)
  if (error) return (
  <div className="p-5 text-center text-red-600">{error}</div>
  )
  if (!project) return(
  <div className="p-5 text-center">Project not found</div>
  )

  return (
    <div className="do-section-box p-6 w-full mx-auto">
      <h1 className="text-4xl font-bold mb-4">{project.name}</h1>

      <h2 className="text-2xl font-semibold mb-3">Tasks</h2>
      {tasks.length === 0 ? (
        <p className="italic text-gray-500">No tasks assigned to this project.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border-2 ${
                task.status === "Ongoing"
                  ? "bg-yellow-100 border-yellow-300"
                  : "bg-green-100 border-green-300"
              }`}
            >
              <div className="font-semibold text-lg">{task.title}</div>
              <div className="text-gray-700 mt-1">{task.description}</div>
              {task.task_tags && task.task_tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {task.task_tags.map(({ tag_id, tags }) => (
                    <span
                      key={tag_id}
                      className="bg-yellow-200 px-2 py-1 rounded-full text-sm font-medium"
                    >
                      {tags.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Project;
