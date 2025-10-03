import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const AddExpertForm = ({ projectId }) => {
  const { user } = useContext(AuthContext); // Ambil user dari context
  const [availableExperts, setAvailableExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [assignedExperts, setAssignedExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // Untuk notifikasi sukses/gagal

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        // Mengambil semua expert yang tersedia
        const response = await axios.get(`${API_BASE}/api/expert`, { 
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const allExperts = [...response.data.headExperts, ...response.data.regularExperts];
        setAvailableExperts(allExperts);
 
        // Mengambil expert yang sudah ditugaskan ke proyek ini
        const projectResponse = await axios.get(`${API_BASE}/api/project/${projectId}`, {
           headers: { Authorization: `Bearer ${user.token}` }
         });
         // Pastikan data expert ada di response
        if (projectResponse.data) {
          const exArr = projectResponse.data.experts || projectResponse.data.assignedExperts || projectResponse.data.expertList || [];
          const assigned = (Array.isArray(exArr) ? exArr : []).map(exp => {
            const id = exp.idExpert || exp.id || exp._id || exp.id_expert || exp.idProjectExpert;
            const label = exp.nmExpert || exp.name || exp.fullName || exp.username || (typeof exp === 'string' ? exp : '');
            return { value: id || label, label: label || 'Expert' };
          });
          setAssignedExperts(assigned);
        }
 
      } catch (err) {
        setError('Gagal memuat data expert.');
        console.error(err);
      }
    };

    if (user?.token) {
      fetchExperts();
    }
  }, [projectId, user?.token]);
 
  const handleAddExpert = () => {
    if (selectedExpert && !assignedExperts.find(e => e.value === selectedExpert.value)) {
      setAssignedExperts([...assignedExperts, selectedExpert]);
      setSelectedExpert(null);
    }
  };
 
  const handleRemoveExpert = (expertToRemove) => {
    setAssignedExperts(assignedExperts.filter(expert => expert.value !== expertToRemove.value));
  };
 
  const handleSaveChanges = async () => {
    setLoading(true);
    setError('');
    setSaveStatus('');
    try {
      const expertIds = assignedExperts.map(e => e.value);
      await axios.put(
        `${API_BASE}/api/project/${projectId}/experts`,
        { expertIds },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSaveStatus('Perubahan berhasil disimpan!');
    } catch (err) {
      setError('Gagal menyimpan perubahan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  const expertOptions = Array.isArray(availableExperts) ? availableExperts.map(expert => ({
    value: expert.idExpert || expert.id || expert._id,
    label: expert.nmExpert || expert.name || expert.fullName || expert.username || (expert.email ? expert.email.split('@')[0] : 'Expert'),
   })) : [];
 
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">Tambah Expert</h4>
      <div className="flex items-center mb-4">
        <Select
          options={expertOptions}
          value={selectedExpert}
          onChange={setSelectedExpert}
          placeholder="Pilih atau cari expert..."
          className="flex-grow"
          isClearable
        />
        <button
          onClick={handleAddExpert}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={!selectedExpert}
        >
          Tambah
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div>
        <h5 className="text-md font-semibold mb-2">Expert yang Ditugaskan</h5>
        {assignedExperts.length > 0 ? (
          <ul className="space-y-2">
            {assignedExperts.map(expert => (
              <li key={expert.value} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                <span>{expert.label}</span>
                <button
                  onClick={() => handleRemoveExpert(expert)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Belum ada expert yang ditugaskan.</p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end">
        {saveStatus && <p className="text-green-600 mr-4">{saveStatus}</p>}
        <button
          onClick={handleSaveChanges}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
};

export default AddExpertForm;
