import Blog from "../models/blog.model.js";
import mongoose from "mongoose";

// METODO GET - Obtener todos los blogs con paginación y filtros de consulta
export const getBlogs = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      // Filtros de consulta (opcional)
      const { titulo, categoria, fecha } = req.query;
      const query = {};
  
      if (titulo) {
        query.titulo = { $regex: new RegExp(titulo, "i") };
      }
  
      if (categoria) {
        query.categoria = categoria;
      }
  
      if (fecha) {
        query.fecha = new Date(fecha);
      }
  
      // Calcular el número total de documentos
      const totalDocs = await Blog.countDocuments(query);
      const totalPages = Math.ceil(totalDocs / limit);
  
      // Consulta con paginación y filtros
      const blogs = await Blog.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ fecha: -1 });
  
      res.json({
        data: blogs,
        currentPage: page,
        totalPages: totalPages,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  // METODO GET - Obtener un blog por ID o título
  export const getBlog = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Verificar si el parámetro es un ID válido de MongoDB
      const isMongoId = mongoose.Types.ObjectId.isValid(id);
  
      let blog;
      if (isMongoId) {
        blog = await Blog.findById(id);
      } else {
        blog = await Blog.findOne({ titulo: id });
      }
  
      if (!blog) {
        return res.status(404).json({ message: "Blog no encontrado" });
      }
  
      res.json(blog);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  // METODO POST - Crear un nuevo blog
  export const createBlog = async (req, res) => {
    try {
      const { titulo, cuerpo_blog, fecha, imagen_destacada, categoria } = req.body;
  
      const blog = new Blog({
        titulo,
        cuerpo_blog,
        fecha: new Date(fecha),
        imagen_destacada,
        categoria,
      });
  
      await blog.save();
      res.json(blog);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

// METODO PUT - Actualizar un blog por ID
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el parámetro es un ID válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de blog no válido" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog no encontrado" });
    }

    const {
      titulo,
      cuerpo_blog,
      fecha,
      imagen_destacada,
      categoria,
    } = req.body;

    blog.titulo = titulo;
    blog.cuerpo_blog = cuerpo_blog;
    blog.fecha = fecha;
    blog.imagen_destacada = imagen_destacada;
    blog.categoria = categoria;

    await blog.save();
    res.json(blog);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO DELETE - Eliminar un blog por ID
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el parámetro es un ID válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de blog no válido" });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog no encontrado" });
    }

    await blog.remove();
    res.json({ message: "Blog eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// RESTO DE METODOS DEL CONTROLADOR...
// Por ejemplo, aquí puedes agregar métodos para gestionar comentarios, likes, etc.
