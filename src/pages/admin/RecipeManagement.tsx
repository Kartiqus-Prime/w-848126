
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseRecipes, useCreateSupabaseRecipe, useUpdateSupabaseRecipe, useDeleteSupabaseRecipe, SupabaseRecipe } from '@/hooks/useSupabaseRecipes';
import { useSupabaseUsers } from '@/hooks/useSupabaseUsers';
import RecipeForm from '@/components/admin/RecipeForm';
import { Search, Plus, Filter, ChefHat, Clock, Users, Star, Eye, Edit, Trash2 } from 'lucide-react';

const RecipeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<SupabaseRecipe | null>(null);

  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Hooks pour les données
  const { data: recipes = [], isLoading: recipesLoading, refetch } = useSupabaseRecipes();
  const { data: users = [], isLoading: usersLoading } = useSupabaseUsers();

  // Mutations
  const createRecipeMutation = useCreateSupabaseRecipe();
  const updateRecipeMutation = useUpdateSupabaseRecipe();
  const deleteRecipeMutation = useDeleteSupabaseRecipe();

  // Données calculées
  const categories = useMemo(() => {
    const allCategories = new Set(recipes.map(recipe => recipe.category));
    return Array.from(allCategories).sort();
  }, [recipes]);

  const difficulties = ['Facile', 'Moyen', 'Difficile'];

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || recipe.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'all' || recipe.difficulty === difficultyFilter;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [recipes, searchTerm, categoryFilter, difficultyFilter]);

  // Handlers
  const handleCreate = async (data: Omit<SupabaseRecipe, 'id' | 'created_at'>) => {
    if (!currentUser) return;
    
    try {
      await createRecipeMutation.mutateAsync({
        ...data,
        created_by: currentUser.id
      });
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  const handleUpdate = async (data: Omit<SupabaseRecipe, 'id' | 'created_at'>) => {
    if (!editingRecipe) return;
    
    try {
      await updateRecipeMutation.mutateAsync({
        id: editingRecipe.id,
        data
      });
      setEditingRecipe(null);
      refetch();
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la recette "${title}" ?`)) {
      try {
        await deleteRecipeMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.display_name || user?.email || 'Utilisateur inconnu';
  };

  const isLoading = recipesLoading || usersLoading;
  const isMutating = createRecipeMutation.isPending || updateRecipeMutation.isPending || deleteRecipeMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ChefHat className="h-8 w-8 mr-3 text-orange-500" />
            Gestion des Recettes
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez toutes les recettes de votre plateforme ({recipes.length} recettes)
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une recette
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une recette..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les difficultés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les difficultés</SelectItem>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="text-sm text-gray-600 flex items-center">
              {filteredRecipes.length} recette{filteredRecipes.length !== 1 ? 's' : ''} trouvée{filteredRecipes.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des recettes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Par {getUserName(recipe.created_by)}
                  </p>
                </div>
                {recipe.image && (
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-16 h-16 rounded-lg object-cover ml-3"
                  />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{recipe.category}</Badge>
                {recipe.difficulty && (
                  <Badge variant={
                    recipe.difficulty === 'Facile' ? 'default' : 
                    recipe.difficulty === 'Moyen' ? 'secondary' : 'destructive'
                  }>
                    {recipe.difficulty}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{recipe.cook_time} min</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{recipe.servings} pers.</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>{recipe.rating || 0}/5</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {recipe.description}
              </p>
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingRecipe(recipe)}
                  disabled={isMutating}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(recipe.id, recipe.title)}
                  disabled={isMutating}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecipes.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <ChefHat className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Aucune recette trouvée
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || categoryFilter !== 'all' || difficultyFilter !== 'all'
                ? 'Aucune recette ne correspond aux critères de recherche.'
                : 'Commencez par ajouter votre première recette.'
              }
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une recette
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog pour créer une recette */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter une recette</DialogTitle>
          </DialogHeader>
          <RecipeForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={createRecipeMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog pour modifier une recette */}
      <Dialog open={!!editingRecipe} onOpenChange={() => setEditingRecipe(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la recette</DialogTitle>
          </DialogHeader>
          {editingRecipe && (
            <RecipeForm
              recipe={editingRecipe as any}
              onSubmit={handleUpdate}
              onCancel={() => setEditingRecipe(null)}
              isLoading={updateRecipeMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeManagement;
