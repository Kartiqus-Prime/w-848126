
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Search } from 'lucide-react';
import { Recipe } from '@/lib/firestore';
import { RECIPE_CATEGORIES, RecipeCategory } from '@/lib/categories';
import { useProducts } from '@/hooks/useProducts';
import { useVideos } from '@/hooks/useVideos';

interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (data: Omit<Recipe, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ recipe, onSubmit, onCancel, isLoading }) => {
  const { data: products } = useProducts();
  const { data: videos } = useVideos();
  
  const [formData, setFormData] = useState({
    title: recipe?.title || '',
    description: recipe?.description || '',
    image: recipe?.image || '',
    cookTime: recipe?.cookTime || 30,
    servings: recipe?.servings || 4,
    difficulty: recipe?.difficulty || 'Moyen' as const,
    rating: recipe?.rating || 4.0,
    category: recipe?.category || 'Plats traditionnels maliens' as RecipeCategory,
    videoId: recipe?.videoId || '',
    createdBy: recipe?.createdBy || ''
  });

  const [ingredients, setIngredients] = useState(recipe?.ingredients || [
    { productId: '', quantity: '', unit: '' }
  ]);

  const [instructions, setInstructions] = useState(recipe?.instructions || ['']);
  const [productSearch, setProductSearch] = useState('');

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  ) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider que tous les ingrédients ont un produit sélectionné
    const validIngredients = ingredients.filter(ing => 
      ing.productId.trim() !== '' && ing.quantity.trim() !== ''
    );
    
    if (validIngredients.length === 0) {
      alert('Veuillez ajouter au moins un ingrédient avec un produit sélectionné');
      return;
    }

    onSubmit({
      ...formData,
      ingredients: validIngredients,
      instructions: instructions.filter(inst => inst.trim() !== ''),
      videoId: formData.videoId || undefined
    });
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { productId: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const getProductName = (productId: string) => {
    const product = products?.find(p => p.id === productId);
    return product ? product.name : 'Produit non trouvé';
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{recipe ? 'Modifier la recette' : 'Ajouter une recette'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as RecipeCategory})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {RECIPE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="image">URL de l'image *</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="videoId">Vidéo associée (optionnel)</Label>
            <Select value={formData.videoId} onValueChange={(value) => setFormData({...formData, videoId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une vidéo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune vidéo</SelectItem>
                {videos?.map((video) => (
                  <SelectItem key={video.id} value={video.id}>
                    {video.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="cookTime">Temps (min) *</Label>
              <Input
                id="cookTime"
                type="number"
                value={formData.cookTime}
                onChange={(e) => setFormData({...formData, cookTime: parseInt(e.target.value)})}
                required
              />
            </div>
            <div>
              <Label htmlFor="servings">Portions *</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({...formData, servings: parseInt(e.target.value)})}
                required
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulté *</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facile">Facile</SelectItem>
                  <SelectItem value="Moyen">Moyen</SelectItem>
                  <SelectItem value="Difficile">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rating">Note *</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                required
              />
            </div>
          </div>

          <div>
            <Label>Ingrédients * <span className="text-sm text-gray-500">(Sélectionnez des produits existants)</span></Label>
            
            {/* Barre de recherche pour les produits */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Select 
                      value={ingredient.productId} 
                      onValueChange={(value) => updateIngredient(index, 'productId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            <div className="flex items-center space-x-2">
                              <span>{product.name}</span>
                              <span className="text-xs text-gray-500">({product.category})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {ingredient.productId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Produit: {getProductName(ingredient.productId)}
                      </p>
                    )}
                  </div>
                  <Input
                    placeholder="Quantité"
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                    className="w-24"
                  />
                  <Input
                    placeholder="Unité"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addIngredient}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un ingrédient
              </Button>
            </div>
          </div>

          <div>
            <Label>Instructions *</Label>
            <div className="space-y-2">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-sm text-gray-500">Étape {index + 1}</Label>
                    <Textarea
                      placeholder={`Décrivez l'étape ${index + 1}`}
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      rows={2}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeInstruction(index)}
                    className="mt-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addInstruction}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une étape
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : (recipe ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RecipeForm;
