import Blog from "../models/blog.model.js";

// METODO GET - Obtener todos los blogs con paginación
export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalDocs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);

    const blogs = await Blog.find()
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

// RESTO DE METODOS DEL CONTROLADOR...
// METODO POST, METODO PUT, METODO DELETE, ETC.
