import React, { useState } from 'react';
import './AddInternForm.css';
import axios from 'axios';

function AddInternForm() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age: '',
    presentAddress: '',
    permanentAddress: '',
    mobile: '',
    email: '',
    education: '',
    branch: '',
    grades: '',
    foreignFamily: '',
    prevOrg: '',
    drdoExp: '',
    aadhar: '',
    photo: null
  });

  const [errors, setErrors] = useState({
    email: '',
    mobile: ''
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === 'email') {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setErrors((prev) => ({
        ...prev,
        email: isValidEmail ? '' : 'Invalid email format'
      }));
    }

    if (name === 'mobile') {
      const isValidMobile = /^\d{10}$/.test(value);
      setErrors((prev) => ({
        ...prev,
        mobile: isValidMobile ? '' : 'Mobile number must be 10 digits'
      }));
    }

    if (type === 'file') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.email || errors.mobile) {
      alert('Please fix validation errors before submitting.');
      return;
    }

    try {
      const payload = new FormData();

      for (let key in formData) {
        payload.append(key, formData[key]);
      }

      const response = await axios.post('http://localhost:8080/api/interns/add', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Intern saved:', response.data);
      alert('Intern added successfully!');

      // Reset form
      setFormData({
        name: '',
        dob: '',
        age: '',
        presentAddress: '',
        permanentAddress: '',
        mobile: '',
        email: '',
        education: '',
        branch: '',
        grades: '',
        foreignFamily: '',
        prevOrg: '',
        drdoExp: '',
        aadhar: '',
        photo: null
      });

      setPhotoPreview(null);
    } catch (err) {
      if (err.response) {
        console.error('Server error:', err.response.data);
        alert(`Error: ${err.response.data.message || 'Submission failed.'}`);
      } else {
        console.error('Request error:', err.message);
        alert('Could not connect to server.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Intern</h2>
      <form className="intern-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-grid">
          <div>
            <label>Full Name<span className="required">*</span></label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label>Date of Birth<span className="required">*</span></label>
            <input type="date" name="dob" required value={formData.dob} onChange={handleChange} />
          </div>
          <div>
            <label>Age<span className="required">*</span></label>
            <input type="number" name="age" required value={formData.age} onChange={handleChange} />
          </div>
          <div>
            <label>Mobile Number</label>
            <input type="tel" name="mobile" maxLength="10" required value={formData.mobile} onChange={handleChange} />
            {errors.mobile && <span className="error">{errors.mobile}</span>}
          </div>
          <div>
            <label>Email ID</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div>
            <label>Aadhar Number</label>
            <input type="text" name="aadhar" value={formData.aadhar} onChange={handleChange} />
          </div>
          <div>
            <label>Institute Name<span className="required">*</span></label>
            <input type="text" name="education" required value={formData.education} onChange={handleChange} />
          </div>
          <div>
            <label>Branch</label>
            <input type="text" name="branch" value={formData.branch} onChange={handleChange} />
          </div>
          <div className="full-width">
            <label>Present Address</label>
            <textarea name="presentAddress" value={formData.presentAddress} onChange={handleChange}></textarea>
          </div>
          <div className="full-width">
            <label>Permanent Address</label>
            <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange}></textarea>
          </div>
          <div className="full-width">
            <label>Semester-wise Grades/Marks</label>
            <textarea name="grades" value={formData.grades} onChange={handleChange}></textarea>
          </div>
          <div className="full-width">
            <label>Family members in foreign org/embassies (if any)</label>
            <textarea name="foreignFamily" value={formData.foreignFamily} onChange={handleChange}></textarea>
          </div>
          <div className="full-width">
            <label>Previous work experience in any org (India/Abroad)</label>
            <textarea name="prevOrg" value={formData.prevOrg} onChange={handleChange}></textarea>
          </div>
          <div className="full-width">
            <label>Worked in DRDO Labs/Estts earlier? If yes, provide details</label>
            <textarea name="drdoExp" value={formData.drdoExp} onChange={handleChange}></textarea>
          </div>
          <div className="full-width">
            <label>Upload Photo (Passport Size)</label>
            <input type="file" name="photo" accept="image/*" onChange={handleChange} />
            {photoPreview && (
              <div className="photo-preview">
                <img src={photoPreview} alt="Preview" height="100" />
              </div>
            )}
          </div>
        </div>
        <button type="submit" className="submit-btn">Add Intern</button>
      </form>
    </div>
  );
}

export default AddInternForm;



