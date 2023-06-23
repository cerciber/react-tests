// Importaciones
import React, { useEffect, useState } from 'react'; // Hocks de React
import axios from 'axios'; // Administrador de peticiones Http
import io from 'socket.io-client';  // Administrador de conexión por sockets

// Información necesaria
const apiUrl = 'http://localhost:3002'  // Url de la API

// Establecer conexión por socket al servidor
const socket = io(apiUrl); 

// Componente App
function App() {

  // Estado para maneja la lsita de registros
  const [todos, setTodos] = useState([]);

  // Estado para manejar el registro nuevo
  const [newTodo, setNewTodo] = useState('');

  // Acciones al iniciar
  useEffect(() => {

    // Cargar los registros de la base de datos
    fetchTodos();

    // Activar evento para detectar cuando se crea un registro
    socket.on('todoCreated', (todo) => {
      // Agregar registro a la lista
      setTodos((prevTodos) => [...prevTodos, todo]);
    });

    // Activar evento para detectar cuando se actualiza un registro
    socket.on('todoUpdated', (updatedTodo) => {
      // Actualizar registro de la lista
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === updatedTodo._id ? updatedTodo : todo
        )
      );
    });

    // Activar evento para detectar cuando se borra un registro
    socket.on('todoDeleted', (deletedTodoId) => {
      // Borrar registro de la lista
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo._id !== deletedTodoId)
      );
    });

    // Acciones al terminar
    return () => {
      // Desactivar evento de detectar cuando se crea un registro
      socket.off('todoCreated');
      // Desactivar evento de detectar cuando se actualiza un registro
      socket.off('todoUpdated');
      // Desactivar evento de detectar cuando se borra un registro
      socket.off('todoDeleted');
    };
  }, []);

  // Cargar los registros de la base de datos
  const fetchTodos = async () => {
    try {
      // Traer registros de la API
      const response = await axios.get(apiUrl + '/api/todos');
      // Actualizar lista de registros
      setTodos(response.data);
    } catch (error) {
      console.error('Error al obtener los todos:', error);
    }
  };

  // Crear registro
  const createTodo = async () => {
    try {
      // Enviar nuevo registro a la API
      const response = await axios.post(apiUrl + '/api/todos', {
        title: newTodo,
        completed: false,
      });

      // Borrar los datos del input del nuevo registro
      setNewTodo('');

      // Emitir evento de cuando se crea un registro
      socket.emit('todoCreated', response.data); 
    } catch (error) {
      console.error('Error al crear el todo:', error);
    }
  };

  // Actualizar registro
  const updateTodo = async (todo) => {
    try {
      // Enviar id y nuevos datos del registro a actualizar a la API
      const response = await axios.put(apiUrl + `/api/todos/${todo._id}`, todo);

      // Emitir evento de cuando se actualiza un registro
      socket.emit('todoUpdated', response.data);
    } catch (error) {
      console.error('Error al actualizar el todo:', error);
    }
  };

  // Borrar registro
  const deleteTodo = async (todo) => {
    try {
      // Enviar id del registro a borrar a la API
      await axios.delete(apiUrl + `/api/todos/${todo._id}`);

      // Emitir evento de cuando se borra un registro
      socket.emit('todoDeleted', todo._id);
    } catch (error) {
      console.error('Error al eliminar el todo:', error);
    }
  };

  // Render del componente
  return (
    <div>
      <h1>Todo List</h1>
      
      {/*Input para detectar el tecto del ususario del nuevo registro*/}
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />

      {/*Botón para guardar un nuevo registro*/}  
      <button onClick={createTodo}>Add Todo</button>

      {/*Lista para mostrar los registros guardados*/}  
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>

            {/*Checkbox para validar una tarea completada (Actualizar registro)*/}  
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
            />
            {todo.title}

            {/*Botón para borrar el registro*/}  
            <button onClick={() => deleteTodo(todo)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;