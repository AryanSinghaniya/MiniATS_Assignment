import api from './axios';

/** Fetch paginated, filtered candidates */
export const getCandidates = (params) => api.get('/candidates', { params });

/** Fetch single candidate by id */
export const getCandidateById = (id) => api.get(`/candidates/${id}`);

/** Create a new candidate */
export const createCandidate = (data) => api.post('/candidates', data);

/** Update all fields on a candidate */
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data);

/** Update only the stage of a candidate */
export const updateCandidateStage = (id, stage) =>
  api.patch(`/candidates/${id}/stage`, { stage });

/** Delete a candidate */
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);

/** Fetch dashboard metrics */
export const getDashboard = () => api.get('/dashboard');
