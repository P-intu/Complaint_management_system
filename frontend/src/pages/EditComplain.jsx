import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../api/axios";

function EditComplain() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    useEffect(() => {

        fetchComplaint();

    }, []);

    const fetchComplaint = async () => {

        try {

            const response = await api.get(
                `complaints/${id}/`
            );

            setTitle(response.data.title);

            setDescription(
                response.data.description
            );

        } catch (error) {

            console.log(error);

        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.patch(
                `complaints/${id}/`,
                {
                    title,
                    description
                }
            );

            navigate(`/complaints/${id}`);

        } catch (error) {

            console.log(error);

        }
    }

    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white p-8 rounded-xl shadow w-96">

                <h2 className="text-2xl font-bold mb-6">
                    Edit Complaint
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        className="w-full border p-2 rounded mb-4"
                    />

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        className="w-full border p-2 rounded mb-4"
                    />

                    <button
                        type="submit"
                        className="w-full bg-black text-white p-2 rounded"
                    >
                        Update Complaint
                    </button>

                </form>

            </div>

        </div>
    )
}

export default EditComplain