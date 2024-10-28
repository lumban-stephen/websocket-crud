import './App.css';
import { useEffect, useState } from 'react';
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [formInputs, setFormInputs] = useState({});
  const [crudData, setCrudData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const socket = io("localhost:3000");
  const handleInput = (event) => {
    const { name, value } = event.target;

    let obj = { [name]: value };

    setFormInputs((prev) => ({...prev, ...obj }));
  };

  const handleSubmit = () => {
    console.log("Add Data")
    socket.emit("data", { ...formInputs, id: uuidv4() });

    socket.on("crudData", (response) => {
      setCrudData(response);
    })

    setFormInputs({
      name: '', age: '', phone: ''
    });
  }; 

  const getEditData = (data) => {
    setFormInputs(data);
    setIsEdit(true);
  };

  const handleDelete = (id) => {
    socket.emit('deleteData', id);
  }

  const handleEdit = () => {
     socket.emit('editData', formInputs)

     setFormInputs({
      name: '', age: '', phone: ''
    });
  }

  useEffect(() => {
    socket.on("crudData", (response) => {
      setCrudData(response);
    })
  }, [])

  return (
    <>
      <div className='form-fields'>
      <h1>CRUD OPERATIONS</h1>
        <input 
        onChange={handleInput}
        className='input-field' 
        name='name'
        placeholder='Enter your name'
        value={formInputs.name}
        />
        <input 
        onChange={handleInput}
        className='input-field' 
        name='age'
        placeholder='Enter your age'
        value={formInputs.age}
        />
        <input 
        onChange={handleInput}
        className='input-field' 
        name='phone'
        placeholder='Enter your phone number'
        value={formInputs.phone}
        />

        <button onClick={isEdit ? handleEdit : handleSubmit}>
          { isEdit ? 'Edit' : 'Add'} Data
        </button>
      </div>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
          </tr>
          {crudData.map((data) => (
            <>
              <tr>
                <td>{data.name}</td>
                <td>{data?.age}</td>
                <td>{data?.phone}</td>
                <td><button onClick={() => getEditData(data)}>Edit</button></td>
                <td><button onClick={() => handleDelete}>Delete</button></td>
              </tr>
            </>
          ))
          }
        </tbody>
        
      </table>
    </>
  );
}

export default App;
