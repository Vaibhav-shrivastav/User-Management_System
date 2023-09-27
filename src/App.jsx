import "./App.css";
import Navbar from "./components/Navbar";
import UserList from "./components/UserList";


function App() {
  return (
    <>
      <div className="bg-dark">
        <Navbar />
        <div className="container">
          <UserList/>
        </div>
      </div>
    </>
  );
}

export default App;
