import React, { useState } from "react";

export default function TodoForm(props) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input || !input.trim()) return;
    props.addTodo(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="todo-input bg-white text-black"
        placeholder="Add a todo..."
      />
      <button type="submit" className="todo-button">Add Todo</button>
    </form>
  );
}
