import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("access_token");

        localStorage.removeItem("refresh_token");
        localStorage.clear();

        navigate("/");
    }

    return (

        <nav className="bg-black text-white p-4 flex justify-between">

            <h1 className="text-xl font-bold">
                Complaint System
            </h1>

            <div className="flex gap-4 items-center">

                <Link to="/complaints">
                    Complaints
                </Link>

                <Link to="/create">
                    Create
                </Link>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-3 py-1 rounded"
                >
                    Logout
                </button>

            </div>

        </nav>
    )
}

export default Navbar