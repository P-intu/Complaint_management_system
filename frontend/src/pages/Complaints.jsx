import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
function Complaints() {

    const [complaints, setComplaints] = useState([]);

    useEffect(() => {

        fetchComplaints();

    }, []);

    const fetchComplaints = async () => {

        try {

            const response = await api.get("complaints/");

            setComplaints(response.data);

        } catch (error) {

            console.log(error);

        }
    }

    return (


    <div className="min-h-screen bg-gray-100 p-6">

        <h1 className="text-3xl font-bold mb-6">
            Complaints
        </h1>

        <div className="grid gap-4">

            {
                complaints.map((complaint) => (
                    <Link to={`/complaints/${complaint.id}`} key={complaint.id}>
                    <div
                        key={complaint.id}
                        className="bg-white p-5 rounded-xl shadow"
                    >

                        <h2 className="text-xl font-semibold">
                            {complaint.title}
                        </h2>

                        <p className="text-gray-600 mt-2">
                            {complaint.description}
                        </p>

                        <div className="mt-3">
                            <span className="bg-yellow-200 px-3 py-1 rounded-full text-sm">
                                {complaint.status}
                            </span>
                        </div>

                    </div>
                    </Link>
                ))
            }

        </div>

    </div>
)
    
}

export default Complaints