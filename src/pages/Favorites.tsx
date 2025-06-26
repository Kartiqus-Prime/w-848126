
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Search, Book, Package, Video, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecipes } from '@/hooks/useRecipes';
import { useProducts } from '@/hooks/useProducts';
import { useVideos } from '@/hooks/useVideos';
import { formatPrice } from '@/lib/firestore';

const Favorites = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: favorites = [], isLoading, removeFavorite } = useFavorites();
  const { data: recipes = [] } = useRecipes();
  const { data: products = [] } = useProducts();
  const { data: videos = [] } = useVideos();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-center text-gray-600 mb-4">
              Veuillez vous connecter pour accéder à vos favoris.
            </p>
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const favoriteRecipes = favorites
    .filter(fav => fav.type === 'recipe')
    .map(fav => recipes.find(recipe => recipe.id === fav.itemId))
    .filter(Boolean)
    .filter(recipe => 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const favoriteProducts = favorites
    .filter(fav => fav.type === 'product')
    .map(fav => products.find(product => product.id === fav.itemId))
    .filter(Boolean)
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const favoriteVideos = favorites
    .filter(fav => fav.type === 'video')
    .map(fav => videos.find(video => video.id === fav.itemId))
    .filter(Boolean)
    .filter(video => 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleRemoveFavorite = (itemId: string, type: string) => {
    removeFavorite({ itemId, type });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center mb-8">
          <Heart className="h-8 w-8 text-orange-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Mes Favoris</h1>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher dans mes favoris..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="recipes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recipes" className="flex items-center space-x-2">
              <Book className="h-4 w-4" />
              <span>Recettes ({favoriteRecipes.length})</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Produits ({favoriteProducts.length})</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Vidéos ({favoriteVideos.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes">
            {favoriteRecipes.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12">
                  <div className="text-center">
                    <Book className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune recette favorite</h3>
                    <p className="text-gray-600 mb-6">Découvrez nos recettes et ajoutez-les à vos favoris</p>
                    <Button 
                      onClick={() => navigate('/recettes')} 
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Voir les recettes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favoriteRecipes.map((recipe) => (
                  <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => handleRemoveFavorite(recipe.id, 'recipe')}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{recipe.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{recipe.description.slice(0, 100)}...</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{recipe.cookTime} min</span>
                        <span>{recipe.servings} pers.</span>
                        <span>{recipe.difficulty}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="products">
            {favoriteProducts.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12">
                  <div className="text-center">
                    <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit favori</h3>
                    <p className="text-gray-600 mb-6">Découvrez nos produits et ajoutez-les à vos favoris</p>
                    <Button 
                      onClick={() => navigate('/produits')} 
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Voir les produits
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favoriteProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => handleRemoveFavorite(product.id, 'product')}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <p className="text-orange-500 font-bold mb-2">{formatPrice(product.price)}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos">
            {favoriteVideos.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12">
                  <div className="text-center">
                    <Video className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune vidéo favorite</h3>
                    <p className="text-gray-600 mb-6">Découvrez nos vidéos et ajoutez-les à vos favoris</p>
                    <Button 
                      onClick={() => navigate('/videos')} 
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Voir les vidéos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favoriteVideos.map((video) => (
                  <Card key={video.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => handleRemoveFavorite(video.id, 'video')}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                        {video.duration}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{video.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{video.description.slice(0, 100)}...</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{video.views.toLocaleString()} vues</span>
                        <span>{video.likes.toLocaleString()} likes</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Favorites;
