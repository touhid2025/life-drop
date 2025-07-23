import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import { AuthContext } from "../provider/AuthProvider";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const CreateDonation = () => {
  const { userr } = useContext(AuthContext);
  const { districts = [], upazilas = [] } = useLoaderData();

  const [fullUser, setFullUser] = useState(null);
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    address: "",
    bloodGroup: "",
    date: "",
    time: "",
    message: ""
  });

  // Load full user data from backend
  useEffect(() => {
    if (!userr?.email) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        const foundUser = res.data.find(u => u.email === userr.email);
        setFullUser(foundUser || null);

        if (foundUser) {
          setFormData(prev => ({
            ...prev,
            bloodGroup: foundUser.bloodGroup || "",
            recipientDistrict: foundUser.district || "",
            recipientUpazila: foundUser.upazila || ""
          }));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    fetchUser();
  }, [userr]);

  // Filter upazilas based on selected district
  const filteredUpazilas = formData.recipientDistrict
    ? upazilas.filter(
        (u) =>
          u.district_id.toString() ===
          districts.find((d) => d.name === formData.recipientDistrict)?.id?.toString()
      )
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset upazila if district changes
      ...(name === "recipientDistrict" ? { recipientUpazila: "" } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullUser) {
      Swal.fire("Error", "User data not loaded yet.", "error");
      return;
    }

    const payload = {
      ...formData,
      requesterName: fullUser.name,
      requesterEmail: fullUser.email,
      donationStatus: "pending", // default status
    };

    try {
      const res = await axios.post("http://localhost:5000/api/donation-requests", payload);
      if (res.data.success) {
        Swal.fire("Success", "Donation request created!", "success");
        // Reset form, but keep district/upazila and bloodGroup from user
        setFormData({
          recipientName: "",
          recipientDistrict: fullUser.district || "",
          recipientUpazila: fullUser.upazila || "",
          hospitalName: "",
          address: "",
          bloodGroup: fullUser.bloodGroup || "",
          date: "",
          time: "",
          message: ""
        });
      }
    } catch (error) {
      Swal.fire("Error", "Failed to create donation request.", "error");
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-xl shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-center text-red-600">Create Donation Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={fullUser?.name || ""}
          readOnly
          className="input input-bordered w-full bg-gray-100"
          placeholder="Requester Name"
        />
        <input
          type="email"
          value={fullUser?.email || ""}
          readOnly
          className="input input-bordered w-full bg-gray-100"
          placeholder="Requester Email"
        />
        <input
          type="text"
          name="recipientName"
          placeholder="Recipient Name"
          value={formData.recipientName}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <select
          name="recipientDistrict"
          value={formData.recipientDistrict}
          onChange={handleChange}
          className="select select-bordered w-full"
          required
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          name="recipientUpazila"
          value={formData.recipientUpazila}
          onChange={handleChange}
          className="select select-bordered w-full"
          required
          disabled={!formData.recipientDistrict}
        >
          <option value="">Select Upazila</option>
          {filteredUpazilas.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="hospitalName"
          placeholder="Hospital Name"
          value={formData.hospitalName}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Full Address"
          value={formData.address}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          className="select select-bordered w-full"
          required
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Why you need blood?"
          className="textarea textarea-bordered w-full"
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Request
        </button>
      </form>
    </div>
  );
};

export default CreateDonation;
