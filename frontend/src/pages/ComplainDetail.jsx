import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate ,Link} from "react-router-dom";
import api from "../api/axios";
function ComplaintDetail() {

    const { id } = useParams();
   const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);

    useEffect(() => {

        fetchComplaint();

    }, []);

    const fetchComplaint = async () => {

        try {

            const response = await api.get(
                `complaints/${id}/`
            );

            setComplaint(response.data);

        } catch (error) {

            console.log(error);

        }
    }

    if (!complaint) {
        return <h1>Loading...</h1>
    }
   const handleDelete = async () => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this complaint?"
    );
    if (!confirmDelete) return;
    try{
        await api.delete(`complaints/${id}/`)
        navigate("/complaints");

    }
    catch(error){
        console.log(error);
    }
   }
    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <div className="bg-white p-6 rounded-xl shadow">

                <h1 className="text-3xl font-bold mb-4">
                    {complaint.title}
                </h1>

                <p className="text-gray-700 mb-4">
                    {complaint.description}
                </p>

                <span className="bg-yellow-200 px-3 py-1 rounded-full">
                    {complaint.status}
                </span>

                
                


                 <button
                onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                   >
                         Delete Complaint
                    </button>
                        <Link to={`/edit/${id}`}>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                                Edit Complaint
                            </button>
                        </Link>
                
                {
                    complaint.image && (

                        <img
                            src={complaint.image}
                            alt="complaint"
                            className="mt-6 rounded-lg"
                        />
                    )
                }

            </div>

        </div>
    )
}

export default ComplaintDetail