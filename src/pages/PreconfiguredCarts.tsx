
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import PreconfiguredCartCard from '@/components/PreconfiguredCartCard';
import { useQuery } from '@tanstack/react-query';
import { preconfiguredCartService } from '@/lib/firestore-cart';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PreconfiguredCarts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addingCartId, setAddingCartId] = useState<string | null>(null);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: carts = [], isLoading, error } = useQuery({
    queryKey: ['preconfiguredCarts'],
    queryFn: preconfiguredCartService.getAll,
    staleTime: 5 * 60 * 1000,
  });

  const categories = Array.from(new Set(carts.map(cart => cart.category)));

  const filteredCarts = carts.filter(cart => {
    const matchesSearch = cart.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cart.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cart.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = async (cartId: string) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setAddingCartId(cartId);
    try {
      await preconfiguredCartService.addToUserCart(currentUser.uid, cartId);
      toast({
        title: "Panier ajouté",
        description: "Le panier a été ajouté à votre panier avec succès",
      });
    } catch (error) {
      console.error('Error adding preconfigured cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le panier",
        variant: "destructive",
      });
    } finally {
      setAddingCartId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des paniers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur lors du chargement des paniers</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Paniers Préconfigurés
          </h1>
          <p className="text-lg text-gray-600">
            Des paniers d'ingrédients sélectionnés pour vos besoins culinaires
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Rechercher un panier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge 
            variant={selectedCategory === 'all' ? 'default' : 'outline'} 
            className="cursor-pointer hover:bg-orange-500 hover:text-white"
            onClick={() => setSelectedCategory('all')}
          >
            Tous
          </Badge>
          {categories.slice(0, 6).map((category) => (
            <Badge 
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-orange-500 hover:text-white"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredCarts.length} paniers disponibles
          </p>
        </div>

        {/* Carts Grid */}
        {filteredCarts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCarts.map((cart) => (
              <PreconfiguredCartCard 
                key={cart.id} 
                {...cart} 
                onAddToCart={handleAddToCart}
                isAdding={addingCartId === cart.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucun panier trouvé avec ces critères</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              variant="outline"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreconfiguredCarts;
