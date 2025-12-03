export const itemSchemas = {
  getAll: {
    description: 'Récupère tous les items',
    tags: ['Items'],
    response: {
      200: {
        description: 'Liste des items',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' }
          }
        }
      }
    }
  },

  getById: {
    description: 'Récupère un item par son ID',
    tags: ['Items'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'ID de l\'item' }
      }
    },
    response: {
      200: {
        description: 'Item trouvé',
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' }
        }
      },
      404: {
        description: 'Item non trouvé',
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  },

  create: {
    description: 'Crée un nouvel item',
    tags: ['Items'],
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Nom de l\'item' },
        description: { type: 'string', description: 'Description de l\'item (optionnel)' },
        price: { type: 'number', description: 'Prix de l\'item' }
      },
      required: ['name', 'price']
    },
    response: {
      201: {
        description: 'Item créé avec succès',
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' }
        }
      },
      400: {
        description: 'Données invalides',
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  },

  update: {
    description: 'Met à jour un item existant',
    tags: ['Items'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'ID de l\'item' }
      }
    },
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Nom de l\'item' },
        description: { type: 'string', description: 'Description de l\'item' },
        price: { type: 'number', description: 'Prix de l\'item' }
      }
    },
    response: {
      200: {
        description: 'Item mis à jour',
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' }
        }
      },
      404: {
        description: 'Item non trouvé',
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  },

  delete: {
    description: 'Supprime un item',
    tags: ['Items'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'ID de l\'item' }
      }
    },
    response: {
      200: {
        description: 'Item supprimé',
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      },
      404: {
        description: 'Item non trouvé',
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
};