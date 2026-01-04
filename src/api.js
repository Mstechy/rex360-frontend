const API_BASE_URL = 'http://localhost:5000';

const api = {
  // Slides
  getSlides: () => fetch(`${API_BASE_URL}/api/slides`).then(res => res.json()),
  addSlide: (slide, token) => fetch(`${API_BASE_URL}/api/slides`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(slide)
  }).then(res => res.json()),
  deleteSlide: (id, token) => fetch(`${API_BASE_URL}/api/slides/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  // Services
  getServices: () => fetch(`${API_BASE_URL}/api/services`).then(res => res.json()),
  updateService: (id, service, token) => fetch(`${API_BASE_URL}/api/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(service)
  }).then(res => res.json()),

  // Applications
  getApplications: (token) => fetch(`${API_BASE_URL}/api/applications`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),
  updateApplicationStatus: (id, status, email, businessName, token) => fetch(`${API_BASE_URL}/api/applications/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ status, email, businessName })
  }).then(res => res.json()),

  // Payments
  initializePayment: (paymentData) => fetch(`${API_BASE_URL}/api/payments/initialize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  }).then(res => res.json()),

  // Posts
  getPosts: () => fetch(`${API_BASE_URL}/api/posts`).then(res => res.json()),
  addPost: (post, token) => fetch(`${API_BASE_URL}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(post)
  }).then(res => res.json()),
  updatePost: (id, post, token) => fetch(`${API_BASE_URL}/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(post)
  }).then(res => res.json()),
  deletePost: (id, token) => fetch(`${API_BASE_URL}/api/posts/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  // Content
  getContent: (token) => fetch(`${API_BASE_URL}/api/content`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),
  addContent: (content, token) => fetch(`${API_BASE_URL}/api/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(content)
  }).then(res => res.json()),
  deleteContent: (id, token) => fetch(`${API_BASE_URL}/api/content/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  // Agent Profile
  getAgentProfile: () => fetch(`${API_BASE_URL}/api/agent-profile`).then(res => res.json()),
  updateAgentProfile: (profile, token) => fetch(`${API_BASE_URL}/api/agent-profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(profile)
  }).then(res => res.json()),

  // Credentials
  getCredentials: () => fetch(`${API_BASE_URL}/api/credentials`).then(res => res.json()),

  // Upload
  uploadMedia: (formData, token) => fetch(`${API_BASE_URL}/api/admin/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  }).then(res => res.json()),

  // Logs
  getLogs: (token) => fetch(`${API_BASE_URL}/api/logs`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json())
};

export default api;
