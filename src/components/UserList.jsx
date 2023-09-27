import { useState, useEffect } from "react";
import Loading from "../media/Loading.gif";
import { MdEmail } from "react-icons/md";
import { FaSadCry } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { Button, Modal, Form } from "react-bootstrap";

function UserList() {
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    company: {
      name: "",
    },
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
    },
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const imageURL = "https://robohash.org/";

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");

    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
      setFilteredUsers(parsedUsers);
      setLoading(false);
      console.log("Local storage");
    } else {
      fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json())
        .then((data) => {
          setFilteredUsers(data);
          setLoading(false);
          console.log("normal storage");
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  useEffect(() => {
    console.log("Users state updated:", filteredUsers);
  }, [filteredUsers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (newUser.name && newUser.username && newUser.email) {
      console.log("Submitting form...");
      console.log("newUser:", newUser);

      const maxUserId = users.reduce(
        (maxId, user) => (user.id > maxId ? user.id : maxId),
        0
      );
      const newUserId = maxUserId + 1;
      const userWithId = { ...newUser, id: newUserId };

      setUsers((prevUsers) => [...prevUsers, userWithId]);
      console.log("Updated users:", users);

      setFilteredUsers((prevFilteredUsers) => [
        ...prevFilteredUsers,
        userWithId,
      ]);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);

      const updatedUsers = [...filteredUsers, userWithId];
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      handleClose();
      setNewUser({
        name: "",
        username: "",
        email: "",
        phone: "",
        website: "",
        company: {
          name: "",
        },
        address: {
          street: "",
          suite: "",
          city: "",
          zipcode: "",
        },
      });
    } else {
      console.error("Please fill in all required fields.");
    }
  };

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);

    const updatedFilteredUsers = filteredUsers.filter(
      (user) => user.id !== userId
    );

    setUsers(updatedUsers);
    setFilteredUsers(updatedFilteredUsers);
  };

  return (
    <>
      <div className="App">
        <div className="d-flex justify-content-center">
          <div className="m-3 p-4 ">
            <input
              type="text"
              className="form-control p-2 text-center"
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="m-2 p-2 text-center">
              <Button variant="primary mx-2" onClick={handleShow}>
                + Add user
              </Button>
              <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <div className="row">
                      <div className="col">
                        <Form.Group controlId="name">
                          <Form.Label>Name*</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={newUser.name}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group controlId="email">
                          <Form.Label>Email*</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={newUser.email}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="col">
                        <Form.Group controlId="username">
                          <Form.Label>Username*</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={newUser.username}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group controlId="phone">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
                            value={newUser.phone}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </div>
                      <br />
                      <Form.Label>Address</Form.Label>
                      <div className="row">
                        <div className="col">
                          <Form.Group controlId="suite">
                            <Form.Label>Suite</Form.Label>
                            <Form.Control
                              type="text"
                              name="suite"
                              value={newUser.address.suite}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          <Form.Group controlId="city">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              value={newUser.address.city}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </div>
                        <div className="col">
                          <Form.Group controlId="street">
                            <Form.Label>Street</Form.Label>
                            <Form.Control
                              type="text"
                              name="street"
                              value={newUser.address.street}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                          <Form.Group controlId="zipcode">
                            <Form.Label>Zipcode</Form.Label>
                            <Form.Control
                              type="number"
                              name="zipcode"
                              value={newUser.address.zipcode}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </div>
                        <Form.Group controlId="company">
                          <Form.Label>Company Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="company"
                            value={newUser.company.name}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleSubmit}>
                    Save changes
                  </Button>
                </Modal.Footer>
              </Modal>
              <br />
            </div>
            {success ? (
              <span class="bg-success text-white p-2 rounded" role="alert">
                User Added Successfully!
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center">
            <img src={Loading} height="250px" alt="" />
          </div>
        ) : (
          <div>
            <div className="row d-flex justify-content-center">
              {filteredUsers.length === 0 ? (
                <div className="text-center">
                  <FaSadCry id="notFound" />
                  <br />
                  <h3>Oops!</h3>
                  <p>User Not Found</p>
                </div>
              ) : (
                filteredUsers.map((item) => (
                  <div
                    className="col-3 rounded shadow m-3 p-3 bg-dark text-white"
                    key={item.id}
                  >
                    <div className="row">
                      <div className="col-3">
                        <img
                          src={imageURL + item.name}
                          className="userImage"
                          height="80px"
                          alt=""
                        />
                      </div>
                      <div className="col">
                        <span>{item.name}</span>
                        <br />
                        <span className="text-secondary cardFontSize">
                          {"@" + item.username}
                        </span>
                        <br />
                        <span className="cardFontSize">
                          <a href={"mailto:" + item.email}>
                            <MdEmail size={15} color="red" /> {item.email}
                          </a>
                        </span>
                        <br />
                        <span className="cardFontSize">
                          {" "}
                          <a href={"tel:" + item.phone}>
                            <BsFillTelephoneFill size={15} color="lightblue" />{" "}
                            {item.phone}
                          </a>
                        </span>
                        <br />
                        <span className="cardFontSize">
                          <span className="underline">Website:</span>{" "}
                          <a href={item.website} target="blank">
                            {item.website}
                          </a>
                        </span>
                      </div>
                    </div>
                    <hr />
                    <span className="cardFontSize">
                      <span className="underline">Company name:</span>{" "}
                      <span className="p-1">{item.company.name}</span>{" "}
                    </span>{" "}
                    <br />
                    <span className="cardFontSize">
                      <span className="underline">Address: </span>{" "}
                      {item.address.suite +
                        ", " +
                        item.address.street +
                        ", " +
                        item.address.city +
                        " (" +
                        item.address.zipcode +
                        ")"}{" "}
                    </span>
                    <br />
                    <div className="text-center">
                      <button
                        className="btn btn-danger cardFontSize mt-2"
                        onClick={() => handleDeleteUser(item.id)}
                      >
                        Delete User
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserList;
