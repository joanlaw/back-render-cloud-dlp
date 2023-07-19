import { Router } from "express";
import {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
  } from '../controllers/blogs.controller.js';

const router = Router();

router.get('/blogs', getBlogs);
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);
router.get('/blogs/:id', getBlog); // Ruta para obtener un blog por ID o título

export default router;
 