import { useEffect, useState } from "react";
import axios from "axios";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const SearchDonor = () => {
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);

  // Load districts from JSON
  useEffect(() => {
    axios.get("/districts.json").then(res => setDistricts(res.data));
  }, []);

  // Load upazilas when district changes
  // When district changes, filter upazilas by district_id
useEffect(() => {
  if (selectedDistrict) {
  const selectedDistrictObject = districts.find(d => d.name === selectedDistrict);
const selectedDistrictId = selectedDistrictObject?.id;

axios.get("/upazilas.json").then((res) => {
  const filteredUpazilas = res.data.filter(
    (upa) => upa.district_id === selectedDistrictId
  );
  setUpazilas(filteredUpazilas);
});

  }
}, [selectedDistrict]);


  const handleSearch = () => {
    if (!selectedBloodGroup || !selectedDistrict || !selectedUpazila) return;

    axios
      .get("http://localhost:5000/api/search-donors", {
        params: {
          bloodGroup: selectedBloodGroup,
          district: selectedDistrict,
          upazila: selectedUpazila,
        },
      })
      .then((res) => {
        setDonors(res.data.donors);
        setSearched(true);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Search Blood Donors</h2>

      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select value={selectedBloodGroup} onChange={e => setSelectedBloodGroup(e.target.value)} className="border rounded px-4 py-2">
          <option value="">Select Blood Group</option>
          {bloodGroups.map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <select onChange={(e) => setSelectedDistrict(e.target.value)} className="border rounded px-4 py-2">
  <option value="">Select District</option>
  {districts.map((dist) => (
    <option key={dist.id} value={dist.name}>
      {dist.name}
    </option>
  ))}
</select>



        <select value={selectedUpazila} onChange={e => setSelectedUpazila(e.target.value)} className="border rounded px-4 py-2">
          <option value="">Select Upazila</option>
          {upazilas.map(u => (
            <option key={u.id} value={u.name}>{u.name}</option>
          ))}
        </select>
      </div>

      <div className="text-center">
        <button
          onClick={handleSearch}
          className="bg-red-600 cursor-pointer text-white px-6 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Donor Results */}
      <div className="mt-8">
        {searched && donors.length === 0 && (
          <p className="text-center text-gray-500">No donors found.</p>
        )}

        {donors.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {donors.map((donor) => (
              <div key={donor._id} className="border p-4 rounded shadow">
                <h3 className="font-bold">{donor.name}</h3>
                <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
                <p><strong>Location:</strong> {donor.district}, {donor.upazila}</p>
                <p><strong>Email:</strong> {donor.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDonor;
