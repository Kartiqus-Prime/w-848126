
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Book, Package, Video, TrendingUp, ShoppingCart, Clock, Star, Eye, Plus } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { useProducts } from '@/hooks/useProducts';
import { useVideos } from '@/hooks/useVideos';
import { formatPrice } from '@/lib/firestore';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { data: recipes } = useRecipes();
  const { data: products } = useProducts();
  const { data: videos } = useVideos();

  // Calculate statistics
  const totalRecipes = recipes?.length || 0;
  const totalProducts = products?.length || 0;
  const totalVideos = videos?.length || 0;
  const productsInStock = products?.filter(p => p.inStock).length || 0;
  const productsOnPromotion = products?.filter(p => p.promotion).length || 0;
  const averageRating = recipes?.reduce((acc, recipe) => acc + recipe.rating, 0) / totalRecipes || 0;

  const stats = [
    {
      title: 'Recettes totales',
      value: totalRecipes,
      icon: Book,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Produits en stock',
      value: `${productsInStock}/${totalProducts}`,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `${productsOnPromotion} en promo`,
      changeType: 'neutral'
    },
    {
      title: 'Vidéos publiées',
      value: totalVideos,
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Note moyenne',
      value: averageRating.toFixed(1),
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '4.2/5',
      changeType: 'positive'
    }
  ];

  const recentActivity = [
    {
      type: 'recipe',
      title: 'Nouvelle recette "Thieboudienne Royal"',
      time: 'Il y a 2h',
      status: 'success'
    },
    {
      type: 'product',
      title: 'Stock de riz jasmin épuisé',
      time: 'Il y a 4h',
      status: 'warning'
    },
    {
      type: 'video',
      title: 'Vidéo "Techniques de découpe" publiée',
      time: 'Il y a 1j',
      status: 'success'
    },
    {
      type: 'user',
      title: '15 nouveaux utilisateurs inscrits',
      time: 'Il y a 1j',
      status: 'info'
    }
  ];

  const quickActions = [
    { title: 'Ajouter une recette', link: '/admin/recipes', icon: Book },
    { title: 'Gérer les produits', link: '/admin/products', icon: Package },
    { title: 'Publier une vidéo', link: '/admin/videos', icon: Video },
    { title: 'Voir les utilisateurs', link: '/admin/users', icon: Users }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de votre plateforme Recette+</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Rapports
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Actions rapides
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-xs mt-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' :
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.link}>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <Icon className="h-8 w-8 text-orange-500 mb-2" />
                    <p className="text-sm font-medium">{action.title}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge variant={
                    activity.status === 'success' ? 'default' :
                    activity.status === 'warning' ? 'destructive' : 'secondary'
                  }>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Aperçu des performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Vues totales</span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {videos?.reduce((acc, video) => acc + video.views, 0)?.toLocaleString() || '0'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Revenus estimés</span>
                </div>
                <span className="text-xl font-bold text-green-600">
                  {formatPrice(450000)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Utilisateurs actifs</span>
                </div>
                <span className="text-xl font-bold text-purple-600">1,234</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recettes populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recipes?.slice(0, 3).map((recipe) => (
                <div key={recipe.id} className="flex items-center space-x-3">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{recipe.title}</p>
                    <div className="flex items-center space-x-2">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">{recipe.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Produits en vedette</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products?.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center space-x-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">{formatPrice(product.price)}</p>
                  </div>
                  {product.promotion && (
                    <Badge variant="destructive" className="text-xs">
                      Promo
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vidéos récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {videos?.slice(0, 3).map((video) => (
                <div key={video.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <Video className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{video.title}</p>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{video.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
