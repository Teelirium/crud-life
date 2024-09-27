import { ID, Task } from '../types';
import { taskStore } from './Tasks.store';

describe('taskStore', () => {
  const sampleTasks: Task[] = [
    { id: 'task1', title: 'Task 1', content: 'Task 1' },
    { id: 'task2', title: 'Task 2', content: 'Task 2' },
    { id: 'task3', title: 'Task 3', content: 'Task 3' },
    { id: 'task4', title: 'Task 4', content: 'Task 4' },
    { id: 'task5', title: 'Task 5', content: 'Task 5' },
  ];

  const sampleChildren: [ID, ID[]][] = [
    ['task1', ['task2', 'task3']],
    ['task2', ['task4']],
  ];

  const sampleParents: [ID, ID][] = [
    ['task2', 'task1'],
    ['task3', 'task1'],
    ['task4', 'task2'],
  ];

  beforeEach(() => {
    taskStore.tasks = new Map(sampleTasks.map((t) => [t.id, t]));
    taskStore.childrenMap = new Map(sampleChildren);
    taskStore.parentMap = new Map(sampleParents);
    taskStore.selected = new Set();
  });

  describe('selectTask', () => {
    test('should select a task without children or parents', () => {
      taskStore.selectTask('task5');
      expect(taskStore.isSelected('task5')).toBe(true);
    });

    test('should select a task and all its children recursively', () => {
      taskStore.selectTask('task2');
      expect(taskStore.isSelected('task2')).toBe(true);
      expect(taskStore.isSelected('task4')).toBe(true);
    });

    test('should select a task and its parent if all siblings are selected', () => {
      taskStore.selectTask('task3');
      expect(taskStore.isSelected('task3')).toBe(true);
      expect(taskStore.isSelected('task1')).toBe(false);

      taskStore.selectTask('task2');
      expect(taskStore.isSelected('task1')).toBe(true);
      expect(taskStore.isSelected('task2')).toBe(true);
      expect(taskStore.isSelected('task3')).toBe(true);
    });

    test('should throw an error when selecting a nonexistent task', () => {
      expect(() => taskStore.selectTask('nonexistentTask')).toThrowError(
        'Could not select task, it does not exist: nonexistentTask'
      );
    });
  });

  describe('deselectTask', () => {
    test('should deselect a task without children or parents', () => {
      taskStore.selectTask('task5');
      taskStore.deselectTask('task5');
      expect(taskStore.selected.has('task5')).toBe(false);
    });

    test('should deselect a task and all its children recursively', () => {
      taskStore.selectTask('task2');
      taskStore.deselectTask('task2');
      expect(taskStore.selected.has('task2')).toBe(false);
      expect(taskStore.selected.has('task4')).toBe(false);
    });

    test('should deselect a task and its parent if all siblings are selected', () => {
      taskStore.selectTask('task2');
      taskStore.selectTask('task3');
      expect(taskStore.selected.has('task1')).toBe(true);

      taskStore.deselectTask('task2');
      expect(taskStore.selected.has('task1')).toBe(false);
      expect(taskStore.selected.has('task2')).toBe(false);
      expect(taskStore.selected.has('task3')).toBe(true);
    });

    test('should throw an error when deselecting a nonexistent task', () => {
      expect(() => taskStore.deselectTask('nonexistentTask')).toThrowError(
        'Could not deselect task, it does not exist: nonexistentTask'
      );
    });
  });
});
