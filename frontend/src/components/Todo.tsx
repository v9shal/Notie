import React, { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

interface Todo {
  _id: string;
  title: string;
  description: string;
  status?: string;
}

interface NewTodo {
  title: string;
  description: string;
}

interface ApiError {
  message: string;
  status?: number;
}

const API_BASE_URL = "http://localhost:8080/todos";

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<NewTodo>({ title: "", description: "" });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const axiosConfig = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const handleApiError = (error: AxiosError<ApiError>) => {
    const message = error.response?.data?.message || "An unexpected error occurred";
    setError(message);
    setTimeout(() => setError(""), 5000);
  };

  const fetchTodos = async () => {
    try {
      const response: AxiosResponse<Todo[]> = await axios.get(
        `${API_BASE_URL}/getTodo`,
        axiosConfig
      );
      setTodos(response.data);
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response: AxiosResponse<Todo> = await axios.post(
        `${API_BASE_URL}/addTodo`,
        {
          title: newTodo.title.trim(),
          description: newTodo.description.trim(),
        },
        axiosConfig
      );
      setTodos(prevTodos => [response.data, ...prevTodos]);
      setNewTodo({ title: "", description: "" });
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!id) {
      setError("Invalid todo ID");
      return;
    }

    try {
      const response: AxiosResponse = await axios.delete(
        `${API_BASE_URL}/deleteTodo/${id}`,
        axiosConfig
      );

      if (response.status === 200) {
        setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
      } else {
        throw new Error("Failed to delete todo");
      }
    } catch (error) {
      handleApiError(error as AxiosError<ApiError>);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Todo List
        </h1>
        
        <form onSubmit={addTodo} className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Todo title..."
              value={newTodo.title}
              onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
              disabled={isSubmitting}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Description (optional)"
              value={newTodo.description}
              onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
              disabled={isSubmitting}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newTodo.title.trim()}
            className={`w-full p-3 rounded-lg text-white font-semibold transition-colors duration-200 ${
              isSubmitting || !newTodo.title.trim()
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Todo"}
          </button>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center p-8 bg-gray-800 rounded-lg">
            <p className="text-gray-400 text-lg">No todos yet. Add one above!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:bg-gray-750 transition-colors duration-200"
              >
                <div className="p-5 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-100 truncate">
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="mt-1 text-gray-400 text-sm line-clamp-2">
                        {todo.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoApp;