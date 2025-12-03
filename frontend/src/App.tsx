import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api/items';

interface Item {
  id: number;
  name: string;
  description: string | null;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface ItemFormData {
  name: string;
  description: string;
  price: string;
}

export default function ItemsManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<ItemFormData>({ name: '', description: '', price: '' });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data: Item[] = await response.json();
      setItems(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLDivElement>): Promise<void> => {
    e.preventDefault();
    try {
      const url = editingItem ? `${API_URL}/${editingItem.id}` : API_URL;
      const method = editingItem ? 'PUT' : 'POST';
      
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price)
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchItems();
        closeModal();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error(err);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet item ?')) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchItems();
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const openModal = (item: Item | null = null): void => {
    setEditingItem(item);
    setFormData(
      item 
        ? { name: item.name, description: item.description || '', price: item.price.toString() }
        : { name: '', description: '', price: '' }
    );
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '' });
    setError('');
  };

  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🛍️ Gestionnaire d'Items</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="text-red-700 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-orange-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="🔍 Rechercher un item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-xl w-full sm:w-auto"
            >
              ➕ Nouvel Item
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-orange-100">
            <p className="text-gray-500 text-lg">
              {searchTerm ? '🔍 Aucun item trouvé' : '📦 Aucun item disponible. Créez-en un !'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-orange-100 hover:border-orange-300"
              >
                <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{item.name}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2 min-h-[3rem]">
                    {item.description || 'Aucune description'}
                  </p>
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-3 mb-4">
                    <p className="text-2xl font-bold text-orange-700">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex gap-2 pt-4 border-t-2 border-orange-100">
                    <button
                      onClick={() => openModal(item)}
                      className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-4 border-orange-200">
              <div className="bg-gradient-to-r from-orange-400 to-red-400 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {editingItem ? '✏️ Modifier l\'item' : '➕ Nouvel Item'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 transition-colors text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6" onSubmit={handleSubmit as any}>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Entrez le nom de l'item"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Entrez une description (optionnel)"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Prix (€) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit as any}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    {editingItem ? '💾 Mettre à jour' : '✨ Créer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}