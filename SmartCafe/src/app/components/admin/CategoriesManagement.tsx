import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save, Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "../../store";

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  color: string;
}

export function CategoriesManagement() {
  const { menuItems } = useStore();

  // Get unique categories from menu items
  const getCategories = (): Category[] => {
    const categoryMap = new Map<string, Category>();

    menuItems.forEach((item) => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, {
          id: item.category.toLowerCase().replace(/\s+/g, '-'),
          name: item.category,
          description: `Delicious ${item.category.toLowerCase()} items`,
          itemCount: 1,
          color: getCategoryColor(item.category),
        });
      } else {
        const cat = categoryMap.get(item.category)!;
        cat.itemCount++;
      }
    });

    return Array.from(categoryMap.values());
  };

  const [categories, setCategories] = useState<Category[]>(getCategories());
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#6F4E37",
  });

  // Update categories when menu items change
  useEffect(() => {
    setCategories(getCategories());
  }, [menuItems]);

  const getCategoryColor = (categoryName: string): string => {
    const colors: Record<string, string> = {
      'Coffee': '#6F4E37',
      'Tea': '#8FBC8F',
      'Snacks': '#FF8C00',
      'Meals': '#DC143C',
      'Desserts': '#FF1493',
      'Beverages': '#4169E1',
    };
    return colors[categoryName] || '#6F4E37';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, name: formData.name, description: formData.description, color: formData.color }
            : cat
        )
      );
    } else {
      const newCategory: Category = {
        id: formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        description: formData.description,
        color: formData.color,
        itemCount: 0,
      };
      setCategories((prev) => [...prev, newCategory]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", color: "#6F4E37" });
    setEditingCategory(null);
    setIsEditing(false);
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category && category.itemCount > 0) {
      alert(`❌ Cannot delete "${category.name}"\n\nThis category contains ${category.itemCount} menu item${category.itemCount > 1 ? 's' : ''}.\n\nPlease reassign or delete those items first from the Menu Management section.`);
      return;
    }
    if (confirm(`🗑️ Delete "${category?.name}" category?\n\nThis action cannot be undone.`)) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-coffee-brown mb-2">Categories Management</h2>
          <p className="text-muted-foreground">
            Organize your menu items into categories
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-coffee-brown text-white rounded-xl hover:bg-coffee-brown/90 transition-all shadow-lg"
          >
            <Plus className="size-5" />
            Add Category
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-strong rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-coffee-brown">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button onClick={resetForm} className="text-muted-foreground hover:text-coffee-brown">
                <X className="size-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-coffee-brown mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown"
                    required
                    placeholder="e.g., Beverages, Snacks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-coffee-brown mb-2">
                    Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="size-12 rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown font-mono"
                      placeholder="#6F4E37"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee-brown mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-brown resize-none"
                  rows={3}
                  placeholder="Brief description of this category"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-coffee-brown text-white rounded-xl hover:bg-coffee-brown/90 transition-all"
                >
                  <Save className="size-5" />
                  {editingCategory ? "Update Category" : "Add Category"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 glass-strong rounded-xl hover:bg-white/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {categories.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-strong rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-coffee-brown/20"
            >
              <div className="flex items-start justify-between mb-4">
                <motion.div
                  className="size-16 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: category.color }}
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Tag className="size-9 text-white" />
                </motion.div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => startEdit(category)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 hover:bg-coffee-brown/10 rounded-xl transition-colors text-coffee-brown shadow-sm hover:shadow-md"
                    title="Edit category"
                  >
                    <Edit className="size-4.5" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(category.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 hover:bg-red-50 rounded-xl transition-all text-red-600 shadow-sm hover:shadow-md hover:ring-2 hover:ring-red-200"
                    title="Delete category"
                  >
                    <Trash2 className="size-4.5" />
                  </motion.button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-coffee-brown mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
                <span className="text-sm text-muted-foreground">Items in category</span>
                <span className="text-2xl font-bold" style={{ color: category.color }}>
                  {category.itemCount}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {categories.length === 0 && (
        <div className="glass-strong rounded-2xl p-12 text-center">
          <Tag className="size-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No categories found. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}
