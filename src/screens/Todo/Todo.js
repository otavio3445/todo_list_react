import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import './Todo.css';
import {
  Navbar,
  Container,
  Row,
  Col,
  Nav,
  Card,
  Dropdown,
  Button,
  Modal,
  Form
} from 'react-bootstrap';

const Todo = () => {

  const [baseTodos, setBaseTodos] = useState([]);
  const [todos, setTodos] = useState([]);
  const [baseId, setBaseId] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [activeUser, setActiveUser] = useState(1);
  const [modalShow, setModalShow] = React.useState(false);

  const todoRef = useRef(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/todos`).then(async (res) => {
      let response = await res.json();
      setBaseId(response.length);
      setBaseTodos(response);
      setTodos(response.filter((el) => el.completed === false && el.userId === 1));
      setCompletedTodos(response.filter((el) => el.completed === true && el.userId === 1));
    })
  }, []);

  useEffect(() => {
    setTodos(baseTodos.filter((el) => el.completed === false && el.userId === activeUser));
    setCompletedTodos(baseTodos.filter((el) => el.completed === true && el.userId === activeUser));
  }, [activeUser, baseTodos]);

  function checkTodo(id, text) {
    setTodos(todos.filter((el) => el.id !== id))
    setCompletedTodos([{
      "userId": activeUser,
      "id": id,
      "title": text,
      "completed": true
    }, ...completedTodos]);
  }

  function undoTodo(id, text) {
    setCompletedTodos(completedTodos.filter((el) => el.id !== id))
    setTodos([{
      "userId": activeUser,
      "id": id,
      "title": text,
      "completed": false
    }, ...todos]);
  }

  function newTodo(text) {
    let todo = {
      "userId": activeUser,
      "id": (baseId + 1),
      "title": text,
      "completed": false
    }
    
    setBaseId(baseId + 1);

    setTodos([
      todo,
      ...todos
    ]);
  }

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Novo TODO para Usuário 0{activeUser}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicTodo">
              <Form.Label>Texto:</Form.Label>
              <Form.Control ref={todoRef} type="text" placeholder="digite seu todo:" />
            </Form.Group>
            <Button variant="primary" onClick={() => {
              newTodo(todoRef.current.value);
              setModalShow(false);
            }}>
              Cadastrar
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
        <Container>
          <Navbar.Brand href="#">TODO List</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Button variant="primary" onClick={() => setModalShow(true)}>
            Novo Todo para Usuário 0{activeUser}
          </Button>
          <Navbar.Collapse id="navbarScroll" className="justify-content-end">
            <Nav
              navbarScroll
            >
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Usuário 0{activeUser}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setActiveUser(1)}>Usuário 01</Dropdown.Item>
                  <Dropdown.Item onClick={() => setActiveUser(2)}>Usuário 02</Dropdown.Item>
                  <Dropdown.Item onClick={() => setActiveUser(3)}>Usuário 03</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col lg={6}>
            <div className="pending-todos">
              <h4>Para ser feito por Usuário 0{activeUser}:</h4>
              <br />
              {todos.map((item, index) => (
                <div className="space-card" key={index}>
                  <Card>
                    <Card.Header as="h5">Item: {item.id} </Card.Header>
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>
                        Concluído: {item.completed === true ? 'Sim' : 'Não'}
                      </Card.Text>
                      <Button onClick={() => checkTodo(item.id, item.title)}>Concluir</Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </Col>
          <Col lg={6}>
            <div className="done-todos">
              <h4>Feitos por Usuário 0{activeUser}:</h4>
              <br />
              {completedTodos.map((item, index) => (
                <div className="space-card" key={index}>
                  <Card>
                    <Card.Header as="h5">Item: {item.id} </Card.Header>
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>
                        Concluído: {item.completed === true ? 'Sim' : 'Não'}
                      </Card.Text>
                      <Button variant="danger" onClick={() => undoTodo(item.id, item.title)}>Remover</Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </Col>
        </Row>
        <Row>
        </Row>
      </Container>
    </div>
  )
}

export default Todo
