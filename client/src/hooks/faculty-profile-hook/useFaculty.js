import { useState, useEffect, useCallback } from 'react';
import { facultyService } from '../../services/faculty-profile-service/facultyService';
import { toast } from 'react-toastify';

export const useFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFaculty = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await facultyService.g