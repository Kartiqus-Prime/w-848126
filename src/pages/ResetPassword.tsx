import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const oobCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');

  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        toast({
          title: "Erreur",
          description: "Code de vérification manquant",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      // Si le mode n'est pas resetPassword, rediriger vers la page appropriée
      if (mode === 'verifyEmail') {
        navigate(`/verify-email?oobCode=${oobCode}`);
        return;
      }

      // Si le mode n'est pas spécifié ou n'est pas resetPassword, supposer que c'est une réinitialisation
      if (mode && mode !== 'resetPassword') {
        navigate(`/verify-email?oobCode=${oobCode}`);
        return;
      }

      try {
        await verifyPasswordResetCode(auth, oobCode);
        setValidCode(true);
      } catch (error: any) {
        let errorMessage = "Code de vérification invalide ou expiré";
        if (error.code === 'auth/invalid-action-code') {
          errorMessage = "Ce lien de réinitialisation a expiré ou a déjà été utilisé";
        } else if (error.code === 'auth/expired-action-code') {
          errorMessage = "Ce lien de réinitialisation a expiré";
        }
        
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive"
        });
        navigate('/forgot-password');
      } finally {
        setVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode, mode, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await confirmPasswordReset(auth, oobCode!, newPassword);
      toast({
        title: "Succès",
        description: "Votre mot de passe a été réinitialisé avec succès"
      });
      navigate('/login');
    } catch (error: any) {
      let errorMessage = "Impossible de réinitialiser le mot de passe";
      if (error.code === 'auth/weak-password') {
        errorMessage = "Le mot de passe est trop faible";
      } else if (error.code === 'auth/invalid-action-code') {
        errorMessage = "Ce lien de réinitialisation a expiré ou a déjà été utilisé";
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
            <p className="text-center text-gray-600">Vérification du lien de réinitialisation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!validCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600 mb-4">
              Lien de réinitialisation invalide ou expiré.
            </p>
            <Link to="/forgot-password">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Demander un nouveau lien
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/fd4068e4-5395-416a-a0d9-2f2084813da4.png" 
              alt="Recette+" 
              className="h-20 w-auto"
            />
          </div>
          <CardTitle className="text-2xl text-gray-900">Nouveau mot de passe</CardTitle>
          <p className="text-gray-600 text-sm">
            Choisissez un nouveau mot de passe sécurisé
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour à la connexion
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
