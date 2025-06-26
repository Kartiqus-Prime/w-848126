
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, Clock, Users, Star } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { recipeService, Recipe } from '@/lib/firestore';
import RecipeForm from '@/components/admin/RecipeForm';

const RecipeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: recipes, isLoading: recipesLoading, refetch } = useRecipes();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const filteredRecipes = recipes?.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreate = async (data: Omit<Recipe, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const recipeData = {
        ...data,
        createdBy: currentUser.uid
      };
      await recipeService.create(recipeData);
      toast({
        title: "Recette créée",
        description: "La recette a été créée avec succès"
      });
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la recette",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: Omit<Recipe, 'id' | 'createdAt'>) => {
    if (!editingRecipe) return;
    
    setIsLoading(true);
    try {
      await recipeService.update(editingRecipe.id, data);
      toast({
        title: "Recette modifiée",
        description: "La recette a été modifiée avec succès"
      });
      setEditingRecipe(null);
      refetch();
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la recette",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la recette "${title}" ?`)) {
      try {
        await recipeService.delete(id);
        toast({
          title: "Recette supprimée",
          description: `La recette "${title}" a été supprimée avec succès`
        });
        refetch();
      } catch (error) {
        console.error('Error deleting recipe:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la recette",
          variant: "destructive"
        });
      }
    }
  };

  if (recipesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des recettes</h1>
        <Button 
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une recette
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une recette..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recettes ({filteredRecipes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recette</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Difficulté</TableHead>
                <TableHead>Temps</TableHead>
                <TableHead>Portions</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{recipe.title}</p>
                        <p className="text-sm text-gray-500">{recipe.description.slice(0, 50)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{recipe.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      recipe.difficulty === 'Facile' ? 'default' : 
                      recipe.difficulty === 'Moyen' ? 'secondary' : 'destructive'
                    }>
                      {recipe.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{recipe.cookTime} min</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{recipe.servings}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{recipe.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingRecipe(recipe)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(recipe.id, recipe.title)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter une recette</DialogTitle>
          </DialogHeader>
          <RecipeForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog open={!!editingRecipe} onOpenChange={() => setEditingRecipe(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la recette</DialogTitle>
          </DialogHeader>
          {editingRecipe && (
            <RecipeForm
              recipe={editingRecipe}
              onSubmit={handleUpdate}
              onCancel={() => setEditingRecipe(null)}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeManagement;
