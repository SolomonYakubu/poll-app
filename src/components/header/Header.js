import React from "react";
import { Navbar, Button, Form, Nav, NavDropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
export default function Header() {
  const token = JSON.parse(localStorage.getItem("token"));
  console.log(token);
  const history = useHistory();
  return (
    <>
      <Navbar bg="light" expand="lg" style={{ background: "#282c34" }}>
        <Navbar.Brand href="#home">CYON Odo-aofin Kabba</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            {token ? (
              <Button
                variant="outline-error"
                onClick={() => {
                  localStorage.removeItem("token");
                  history.push("/");
                }}
              >
                Logout
              </Button>
            ) : (
              <Button variant="outline-success">Login</Button>
            )}
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
