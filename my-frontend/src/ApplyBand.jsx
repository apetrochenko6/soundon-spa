import React, { useState } from 'react';
import './BandForm.css';

const BandForm = ({ isVisible, onClose }) => {
  const [formData, setFormData] = useState({
    band_name: '',
    location: '',
    genre: '',
    demo: '',
    description: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose(); // Close after submission
  };

  if (!isVisible) return null;

  return (
    <div className="form-wrapper band">
      <div className="close-container band-closer" onClick={onClose}>
        <div className="leftright"></div>
        <div className="rightleft"></div>
      </div>
      
      <form className="band-form" onSubmit={handleSubmit}>
       <div className="form-group two-cols">
          <div className="form-control">
            <label>Nazwa zespołu:</label>
            <input 
              type="text" 
              name="band_name" 
              value={formData.band_name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-control">
            <label>Miasto / kraj pochodzenia:</label>
            <input 
              type="text" 
              name="location" 
              value={formData.location}
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <div className="form-control">
          <label>Gatunek muzyczny:</label>
          <select 
            name="genre" 
            value={formData.genre}
            onChange={handleChange}
            required
          >
            <option value="">-- Wybierz --</option>
            <option value="Indie">Indie</option>
            <option value="Rock">Rock</option>
            <option value="Pop">Pop</option>
            <option value="Hip-Hop">Hip-Hop</option>
          </select>
        </div>

        <div className="form-control">
          <label>Link do demo / YouTube / Spotify:</label>
          <input 
            type="url" 
            name="demo" 
            value={formData.demo}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="form-control">
          <label>Opis zespołu:</label>
          <textarea 
            name="description" 
            rows="4"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group two-cols">
          <div className="form-control">
            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-control">
            <label>Telefon:</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="zglos-zespol-band">
          DOŁĄCZ DO NASZEGO FESTIWALU
        </div>

        <div className="form-footer">
          <button type="submit">Zgłoś swój zespół</button>
        </div>
      </form>
    </div>
  );
};

export default BandForm;