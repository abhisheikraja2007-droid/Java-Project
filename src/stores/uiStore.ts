import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface UiState {
  quickNotes: string;
  showQuickNotes: boolean;
  notePosition: { x: number; y: number };
  todos: Todo[];
  nextTodoId: number;
  
  setQuickNotes: (notes: string) => void;
  setShowQuickNotes: (show: boolean) => void;
  setNotePosition: (position: { x: number; y: number }) => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      quickNotes: '',
      showQuickNotes: true,
      notePosition: { x: 0, y: 150 },
      todos: [],
      nextTodoId: 1,

      setQuickNotes: (quickNotes: string) => set({ quickNotes }),
      setShowQuickNotes: (showQuickNotes: boolean) => set({ showQuickNotes }),
      setNotePosition: (notePosition: { x: number; y: number }) => set({ notePosition }),
      
      addTodo: (text: string) => set((state) => ({
        todos: [...state.todos, { id: state.nextTodoId, text, completed: false }],
        nextTodoId: state.nextTodoId + 1,
      })),
      
      toggleTodo: (id: number) => set((state) => ({
        todos: state.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
      })),
      
      deleteTodo: (id: number) => set((state) => ({
        todos: state.todos.filter(t => t.id !== id),
      })),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);