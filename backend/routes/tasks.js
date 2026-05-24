const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET all tasks
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET single task
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase.from('tasks').select('*').eq('id', req.params.id).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// CREATE task
router.post('/', async (req, res) => {
  const { title, description, status, due_date } = req.body;
  const { data, error } = await supabase.from('tasks').insert([{ title, description, status, due_date }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// UPDATE task
router.put('/:id', async (req, res) => {
  const { title, description, status, due_date } = req.body;
  const { data, error } = await supabase.from('tasks').update({ title, description, status, due_date }).eq('id', req.params.id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// DELETE task
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('tasks').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Task deleted successfully' });
});

module.exports = router;