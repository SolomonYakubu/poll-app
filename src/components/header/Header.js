import React from "react";
import { Navbar, Button, Form, Nav, NavDropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
export default function Header() {
  const token = JSON.parse(localStorage.getItem("token"));

  const history = useHistory();
  return (
    <>
      <Navbar color="#fff" bg="dark" expand="lg" style={{ color: "#FFF" }}>
        <Navbar.Brand href="#home" bg="light">
          <div style={{ color: "#fff" }}>Poll Master</div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
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
