export type Task = {
  id: string;
  title: string;
  content: string;
  subtasks?: Task[];
};

export type TaskFormData = {
  title: string;
  content: string;
};
