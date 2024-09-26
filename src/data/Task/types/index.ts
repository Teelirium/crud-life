export type Task = {
  id: string;
  title: string;
  content: string;
  subtasks?: Task[];
};
