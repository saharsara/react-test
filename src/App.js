import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ListItem from './ListItem';
import loadingGif from './loading.gif';
class App extends Component {
  constructor()
  {
    super();
    this.state={ 
      newTodo:'',
      editing:false,
      editingIndex:null,
      notification:null,
      todos:[],
      loading:true
    };
    this.apiUrl='https://5c4e9c4cd87cab001476ef6c.mockapi.io';
    this.alert=this.alert.bind(this);
    this.handelChange=this.handelChange.bind(this);
    this.addTodo=this.addTodo.bind(this);
    this.deleteTodo=this.deleteTodo.bind(this);
    this.updateTodo=this.updateTodo.bind(this);
    this.generateTodoId=this.generateTodoId.bind(this);
  }
  async componentWillMount()
  {
    const responce = await axios.get(`${this.apiUrl}/todos`);
   setTimeout(()=> {this.setState({
      todos:responce.data,
      loading:false
    })},1000   )
  }
  componentDidMount()
  {
    console.log('i`m mounted!!!!');
  }
  alert(notification)
  {
    this.setState({
      notification,
    });
    setTimeout(()=>{
      this.setState({
        notification:null,
      })
    },2000);
  }
  handelChange(event)
  {
    this.setState({
      newTodo:event.target.value
    })
  }
  generateTodoId()
  {
    const lastTodo = this.state.todos[this.state.todos.length -1];
    if (lastTodo){
      return lastTodo.id+1;
    }
    return 1;
  }

  async addTodo()
  { 
    const responce =await axios.post(`${this.apiUrl}/todos`,
    {
      name:this.state.newTodo

    }) ;
    const todos=this.state.todos;
    todos.push(responce.data);
    this.setState(
      {
        todos: todos,
        newTodo:''
      }
    )
    this.alert('Todo Added successfuly');
  }
  editTodo (index)
  {
    const todo=this.state.todos[index];

    this.setState({
      editing:true,
      newTodo: todo.name,
      editingIndex:index
    });
    
  }
  async updateTodo()
  {
    const todo=this.state.todos[this.state.editingIndex];
    const responce = await axios.put(`${this.apiUrl}/todos/${todo.id}`, {
      name:this.state.newTodo
    })
    //todo.name=this.state.newTodo;
    const todos= this.state.todos;
    todos[this.state.editingIndex]=responce.data;
    this.setState({todos, editing:false,  editingIndex:null, newTodo:' '});
    this.alert('Todo Updated successfuly');
    }
  async deleteTodo (index)
  {
    const todos = this.state.todos;
    const todo = todos[index];
    await axios.delete(`${this.apiUrl}/todos/${todo.id}`);

    delete todos[index];
    this.setState({todos:todos})
    this.alert('Todo Deleted successfuly');
  }


  render() {
    console.log(this.state.newTodo)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            React Learn
          </p>
        </header>
        <div className="container"> 
          {this.state.notification && <div className="alert alert-success">
              <p className="text-center">{this.state.notification}</p>
          </div>}
        <input 
          type="text" 
          name="todo"
          className="my-4 form-control"
          value={this.state.newTodo}
          onChange={this.handelChange}
          />
          <button className="btn-info mb-3 form-control" 
          onClick={this.state.editing? this.updateTodo : this.addTodo}
          disabled={this.state.newTodo.length<5}
          >
            {this.state.editing? 'Update todo' : 'Add todo'}
          </button>
          {
            this.state.loading && <img src={loadingGif} alt=""/>
          }
          {
            (!this.state.editing || this.state.loading) && 
            <ul className="list-group">
            {this.state.todos.map((item, index)=>{
             return <ListItem
                key={item.id}
                item={item}
                editTodo={()=>{this.editTodo(index);}}
                deleteTodo={()=>{this.deleteTodo(index);}}
             />;
            })}
          </ul>
          }          
        </div>
      </div>
    );
  }
}

export default App;
