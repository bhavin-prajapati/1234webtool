'use client';
import React, { useState } from "react";
import "./Todo/Todo.css";
import TodoForm from "./Todo/TodoForm";
import TodoItem from "./Todo/TodoItem";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  important: boolean;
};

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    let id = 1;
    if (todos.length > 0) {
      id = todos[0].id + 1
    }
    const todo = { id: id, text: text, completed: false, important: false }
    const newTodos = [todo, ...todos]
    setTodos(newTodos)
  };

  const removeTodo = (id: number) => {
    const updatedTodos = [...todos].filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const completeTodo = (id: number) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  const importantTodo = (id: number) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.important = !todo.important
      }
      return todo
    })

    setTodos(updatedTodos)
  }
  const sortedTodos = [...todos].sort((a, b) => b.important === a.important ? 0 : b.important ? -1 : 1)
  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <TodoForm addTodo={addTodo} />
      <hr className="seperator" />
      {sortedTodos.map((todo) => {
        return (
          <TodoItem removeTodo={removeTodo} completeTodo={completeTodo} importantTodo={importantTodo} todo={todo} key={todo.id} />
        )
      })}
    </div>
  );
}

export default TodoApp;