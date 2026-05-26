import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
function CreateComplaint() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {

        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);

        if (image) {
            formData.append("image", image);
        }

        try {

            await api.post(
                "complaints/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log("Complaint Created");

            setTitle("");
            setDescription("");
            setImage(null);
             navigate("/complaints");

        } catch (error) {

            console.log(error);

        }
    }

    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white p-8 rounded-xl shadow w-96">

                <h2 className="text-2xl font-bold mb-6">
                    Create Complaint
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Enter title"
                        className="w-full border p-2 rounded mb-4"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        placeholder="Enter description"
                        className="w-full border p-2 rounded mb-4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="file"
                        className="mb-4"
                        onChange={(e) => setImage(e.target.files[0])}
                    />

                    <button
                        type="submit"
                        className="w-full bg-black text-white p-2 rounded"
                    >
                        Submit Complaint
                    </button>

                </form>

            </div>

        </div>
    )
}

export default CreateComplaint