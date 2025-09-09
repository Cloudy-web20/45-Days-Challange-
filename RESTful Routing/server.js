const express = require('express');
const app = express();
const projects = [
  { id: 1, title: 'E-Commerce Platform', technologies: ['React', 'Node.js'] },
  { id: 2, title: 'Task Management App', technologies: ['Vue.js', 'Express'] }
];
const workExperience = [
  { id: 1, company: 'Tech Corp', position: 'Full Stack Developer' }
];
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    count: projects.length,
    data: projects
  });
});
app.get('/api/experience', (req, res) => {
  res.json({
    success: true,
    count: workExperience.length,
    data: workExperience
  });
});
app.get('/api/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return res.status(404).json({
      success: false,
      error: `Project with id ${req.params.id} not found`
    });
  }

  res.json({
    success: true,
    data: project
  });
});
app.get('/', (req, res) => {
  res.send('<h1>Resume API</h1><p>Try <a href="/api/projects">/api/projects</a> or <a href="/api/experience">/api/experience</a></p>');
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

