
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Users, Star, ArrowRight, Play, Smartphone, Download, Clock, Award, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex justify-center mb-8 animate-fade-in">
            <img 
              src="/lovable-uploads/fd4068e4-5395-416a-a0d9-2f2084813da4.png" 
              alt="Recette+" 
              className="h-24 w-auto"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Bienvenue sur <span className="text-orange-500">Recette+</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            Découvrez les saveurs authentiques du Mali et d'ailleurs. 
            Recettes traditionnelles, produits locaux et vidéos exclusives pour une expérience culinaire unique.
          </p>
          
          {/* App promotion banner */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-xl animate-fade-in">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Smartphone className="h-8 w-8" />
              <div className="text-left">
                <h3 className="text-lg font-semibold">Application mobile bientôt disponible !</h3>
                <p className="text-sm opacity-90">Emportez vos recettes partout avec vous</p>
              </div>
            </div>
            <Link to="/download-app">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 font-semibold">
                <Download className="h-4 w-4 mr-2" />
                En savoir plus
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/recettes">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <ChefHat className="h-5 w-5 mr-2" />
                Découvrir les recettes
              </Button>
            </Link>
            <Link to="/videos">
              <Button size="lg" variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Play className="h-5 w-5 mr-2" />
                Regarder les vidéos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className="py-16 bg-white shadow-inner">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <ChefHat className="h-8 w-8 text-orange-500" />
              </div>
              <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
              <div className="text-gray-600">Recettes authentiques</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-4xl font-bold text-green-500 mb-2">1000+</div>
              <div className="text-gray-600">Utilisateurs actifs</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Play className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-4xl font-bold text-purple-500 mb-2">50+</div>
              <div className="text-gray-600">Vidéos exclusives</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Award className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-4xl font-bold text-blue-500 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction client</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Pourquoi choisir Recette+ ?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Une plateforme complète pour tous vos besoins culinaires
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <ChefHat className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl">Recettes Authentiques</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Découvrez les secrets de la cuisine malienne traditionnelle avec des recettes 
                  transmises de génération en génération par nos chefs experts.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl">Communauté Active</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Rejoignez une communauté passionnée de cuisine et partagez vos créations 
                  avec d'autres amateurs de gastronomie du monde entier.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl">Contenu Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Accédez à des vidéos exclusives, des conseils de chefs professionnels 
                  et des techniques avancées pour perfectionner votre art culinaire.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Categories - Enhanced */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Catégories Populaires
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Explorez nos recettes par catégorie
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Plats principaux", count: "150+ recettes", color: "bg-red-100 text-red-700", icon: ChefHat },
              { name: "Desserts", count: "80+ recettes", color: "bg-pink-100 text-pink-700", icon: Star },
              { name: "Boissons", count: "40+ recettes", color: "bg-blue-100 text-blue-700", icon: Clock },
              { name: "Entrées", count: "60+ recettes", color: "bg-green-100 text-green-700", icon: TrendingUp }
            ].map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <category.icon className="h-6 w-6 text-gray-600" />
                  </div>
                  <Badge className={`${category.color} mb-3 px-3 py-1`}>
                    {category.count}
                  </Badge>
                  <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 text-center max-w-4xl relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à commencer votre aventure culinaire ?
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Rejoignez des milliers d'utilisateurs qui ont déjà découvert le plaisir de cuisiner 
            avec Recette+. C'est gratuit, simple et délicieux !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 hover:text-orange-600 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Créer un compte gratuit
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/download-app">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange-500 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <Smartphone className="h-5 w-5 mr-2" />
                Télécharger l'app
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
