
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-16 mt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo et Description */}
          <div>
            <div className="flex items-center mb-6">
              <img 
                src="/lovable-uploads/fd4068e4-5395-416a-a0d9-2f2084813da4.png" 
                alt="Recette+" 
                className="h-12 w-auto mr-3"
              />
              <h3 className="text-2xl font-bold">Recette+</h3>
            </div>
            <p className="text-white/90 leading-relaxed mb-4">
              Une expérience culinaire fluide et accessible à tous en combinant apprentissage et e-commerce. 
              Nous aidons les utilisateurs à préparer des plats variés sans stress.
            </p>
            <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
              RECETTE+ SARL
            </Badge>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-white/80" />
                <a 
                  href="mailto:contact@recette-plus.com" 
                  className="text-white/90 hover:text-white transition-colors"
                >
                  contact@recette-plus.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-white/80" />
                <div className="text-white/90">
                  <div>+223 78 21 63 98</div>
                  <div>+223 90 74 10 90</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-white/80" />
                <span className="text-white/90">ACI 2000, Bamako - Mali</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-white/80" />
                <span className="text-white/90">www.recette-plus.com</span>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Notre Mission</h4>
            <p className="text-white/90 leading-relaxed mb-4">
              Révolutionner la manière de cuisiner en proposant une plateforme intuitive 
              et connectée à un écosystème d'achat intelligent.
            </p>
            <p className="text-white/90 leading-relaxed">
              Nous centralisons l'expérience culinaire en regroupant des vidéos tutoriels 
              avec un système intégré de commande d'ingrédients.
            </p>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/70 text-sm">
              © 2024 Recette+ SARL. Tous droits réservés.
            </p>
            <p className="text-white/70 text-sm">
              Une solution innovante pour le e-commerce culinaire au Mali
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
