import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import './BandForm.css';

const BandForm = ({ isVisible, onClose }) => {
  const validationSchema = Yup.object().shape({
    band_name: Yup.string()
      .min(2, 'Nazwa zespołu musi mieć co najmniej 2 znaki')
      .max(50, 'Nazwa zespołu może mieć maksymalnie 50 znaków')
      .required('Nazwa zespołu jest wymagana'),
    location: Yup.string()
      .min(2, 'Miejscowość musi mieć co najmniej 2 znaki')
      .required('Miejscowość jest wymagana'),
    genre: Yup.string().required('Gatunek muzyczny jest wymagany'),
    demo: Yup.string()
      .url('Podaj poprawny link (np. https://example.com)')
      .required('Link do demo jest wymagany'),
    description: Yup.string()
      .min(20, 'Opis musi mieć co najmniej 20 znaków')
      .max(500, 'Opis może mieć maksymalnie 500 znaków'),
    email: Yup.string()
      .email('Podaj poprawny adres email')
      .required('Email jest wymagany'),
    phone: Yup.string()
      .matches(/^[0-9]{9,15}$/, 'Podaj poprawny numer telefonu')
  });
  const formik = useFormik({
    initialValues: {
      band_name: '',
      location: '',
      genre: '',
      demo: '',
      description: '',
      email: '',
      phone: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/band-submission`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Success:', data);
        alert('Zgłoszenie zostało wysłane pomyślnie!');
        resetForm();
        onClose();
      } catch (error) {
        console.error('Error:', error);
        alert('Wystąpił błąd podczas wysyłania zgłoszenia. Spróbuj ponownie.');
      } finally {
        setSubmitting(false);
      }
    }
  });

  if (!isVisible) return null;

  return (
    <div className="form-wrapper band">
      <div className="close-container band-closer" onClick={onClose}>
        <div className="leftright"></div>
        <div className="rightleft"></div>
      </div>
      
      <form className="band-form" onSubmit={formik.handleSubmit}>
        <div className="form-group two-cols">
          <div className="form-control">
            <label>Nazwa zespołu:</label>
            <input 
              type="text" 
              name="band_name" 
              value={formik.values.band_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.band_name && formik.errors.band_name ? 'error' : ''}
            />
            {formik.touched.band_name && formik.errors.band_name && (
              <div className="error-message">{formik.errors.band_name}</div>
            )}
          </div>
          <div className="form-control">
            <label>Miasto / kraj pochodzenia:</label>
            <input 
              type="text" 
              name="location" 
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.location && formik.errors.location ? 'error' : ''}
            />
            {formik.touched.location && formik.errors.location && (
              <div className="error-message">{formik.errors.location}</div>
            )}
          </div>
        </div>

        <div className="form-control">
          <label>Gatunek muzyczny:</label>
          <select 
            name="genre" 
            value={formik.values.genre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.genre && formik.errors.genre ? 'error' : ''}
          >
            <option value="">-- Wybierz --</option>
            <option value="Indie">Indie</option>
            <option value="Rock">Rock</option>
            <option value="Pop">Pop</option>
            <option value="Hip-Hop">Hip-Hop</option>
          </select>
          {formik.touched.genre && formik.errors.genre && (
            <div className="error-message">{formik.errors.genre}</div>
          )}
        </div>

        <div className="form-control">
          <label>Link do demo / YouTube / Spotify:</label>
          <input 
            type="url" 
            name="demo" 
            value={formik.values.demo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.demo && formik.errors.demo ? 'error' : ''}
            placeholder="https://example.com"
          />
          {formik.touched.demo && formik.errors.demo && (
            <div className="error-message">{formik.errors.demo}</div>
          )}
        </div>

        <div className="form-control">
          <label>Opis zespołu:</label>
          <textarea 
            name="description" 
            rows="4"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.description && formik.errors.description ? 'error' : ''}
          ></textarea>
          {formik.touched.description && formik.errors.description && (
            <div className="error-message">{formik.errors.description}</div>
          )}
        </div>

        <div className="form-group two-cols">
          <div className="form-control">
            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.email && formik.errors.email ? 'error' : ''}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error-message">{formik.errors.email}</div>
            )}
          </div>
          <div className="form-control">
            <label>Telefon:</label>
            <input 
              type="tel" 
              name="phone" 
              value={formik.values.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                formik.setFieldValue('phone', value);
              }}
              onBlur={formik.handleBlur}
              className={formik.touched.phone && formik.errors.phone ? 'error' : ''}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="error-message">{formik.errors.phone}</div>
            )}
          </div>
        </div>

        <div className="zglos-zespol-band">
          DOŁĄCZ DO NASZEGO FESTIWALU
        </div>

        <div className="form-footer">
          <button 
            type="submit" 
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Wysyłanie...' : 'Zgłoś swój zespół'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BandForm;