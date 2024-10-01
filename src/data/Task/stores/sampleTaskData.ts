import { ID, Task } from '../types';

const sampleTasks: [ID, Task][] = [
  {
    id: '1',
    title: 'task 1',
    content: 'task 1...',
  },
  { id: '1.1', title: 'task 1.1', content: 'task 1.1...' },
  {
    id: '1.2',
    title: 'task 1.2',
    content: new Array(100).fill('task 1.2...').join('\n'),
  },
  { id: '1.3', title: 'task 1.3', content: 'task 1.3...' },
  {
    id: '1.4',
    title: 'task 1.4',
    content: 'task 1.4...',
  },
  { id: '1.4.1', title: 'task 1.4.1', content: 'task 1.4.1...' },
  { id: '1.4.2', title: 'task 1.4.2', content: 'task 1.4.2...' },
  { id: '1.4.3', title: 'task 1.4.3', content: 'task 1.4.3...' },
].map((t) => [t.id, t]);

const sampleChildren: [ID, ID[]][] = [
  ['1', ['1.1', '1.2', '1.3', '1.4']],
  ['1.4', ['1.4.1', '1.4.2', '1.4.3']],
];

const sampleParents: [ID, ID][] = [
  ['1.1', '1'],
  ['1.2', '1'],
  ['1.3', '1'],
  ['1.4', '1'],
  ['1.4.1', '1.4'],
  ['1.4.2', '1.4'],
  ['1.4.3', '1.4'],
];

export { sampleChildren, sampleParents, sampleTasks };
