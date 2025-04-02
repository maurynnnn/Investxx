import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, CopyIcon, CheckIcon, Share2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ReferralsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copiedText, setCopiedText] = useState("");

  const { data: referrals, isLoading } = useQuery({
    queryKey: ["/api/referrals"],
  });

  const { data: dashboardData } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  // Generate referral URL
  const baseUrl = window.location.origin;
  const referralUrl = `${baseUrl}/auth?ref=${user?.referralCode}`;

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedText("referral");
    toast({
      title: "Link copiado",
      description: "Link de indicação copiado para a área de transferência.",
    });
    setTimeout(() => setCopiedText(""), 2000);
  }

  function shareReferral() {
    if (navigator.share) {
      navigator.share({
        title: 'InvestX - Plataforma de Investimentos',
        text: 'Junte-se à InvestX e ganhe rendimentos diários de até 25%. Use meu link de indicação:',
        url: referralUrl,
      })
      .then(() => {
        toast({
          title: "Compartilhado com sucesso",
          description: "Seu link de indicação foi compartilhado.",
        });
      })
      .catch((error) => {
        toast({
          title: "Erro ao compartilhar",
          description: "Não foi possível compartilhar seu link de indicação.",
          variant: "destructive",
        });
      });
    } else {
      copyToClipboard(referralUrl);
    }
  }

  return (
    <MainLayout>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Indique e Ganhe</h1>
          <p className="text-muted-foreground mt-1">Receba 5% de comissão sobre cada investimento de seus indicados</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={shareReferral} 
            className="bg-primary hover:bg-primary/90"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar Link
          </Button>
        </div>
      </div>

      {/* Referral Link Card */}
      <Card className="mb-6 backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
        <CardHeader>
          <CardTitle>Seu Link de Indicação</CardTitle>
          <CardDescription>
            Compartilhe este link com seus amigos e ganhe 5% de comissão sobre cada investimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <Input
              value={referralUrl}
              readOnly
              className="flex-grow bg-dark-surface border-dark-border text-light-text rounded-r-none"
            />
            <Button
              onClick={() => copyToClipboard(referralUrl)}
              className="px-3 py-2 bg-primary rounded-l-none text-white hover:bg-primary/90"
            >
              {copiedText === "referral" ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total de Indicados</p>
                <p className="text-2xl font-semibold text-light-text mt-1">
                  {referrals?.length || 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <i className="ri-user-add-line text-primary text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Indicados Ativos</p>
                <p className="text-2xl font-semibold text-light-text mt-1">
                  {referrals?.filter((ref: any) => ref.isActive).length || 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <i className="ri-user-star-line text-secondary text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total de Comissões</p>
                <p className="text-2xl font-semibold text-positive mt-1">
                  R$ {dashboardData?.totalCommissions?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-positive/20 flex items-center justify-center">
                <i className="ri-hand-coin-line text-positive text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals Table */}
      <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
        <CardHeader>
          <CardTitle>Seus Indicados</CardTitle>
          <CardDescription>Lista de pessoas que se cadastraram usando seu link</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : referrals?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-dark-border">
                  <TableHead>Usuário</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Comissão Gerada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral: any) => (
                  <TableRow key={referral.id} className="border-dark-border">
                    <TableCell className="font-medium">
                      {referral.referred.firstName} {referral.referred.lastName}
                    </TableCell>
                    <TableCell>{formatDate(new Date(referral.createdAt))}</TableCell>
                    <TableCell>
                      {referral.isActive ? (
                        <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/50">
                          Inativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-positive">
                      R$ {referral.commission.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Você ainda não tem indicados.</p>
              <p className="mt-2">Compartilhe seu link para começar a ganhar comissões!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="mt-6 backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
        <CardHeader>
          <CardTitle>Como Funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1">
              <span className="text-primary font-medium">1</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-light-text">Compartilhe seu link único</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Envie seu link de indicação para amigos, familiares ou compartilhe nas redes sociais.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1">
              <span className="text-primary font-medium">2</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-light-text">Seus amigos se cadastram</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Quando alguém se cadastra usando seu link, eles são automaticamente vinculados à sua conta.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1">
              <span className="text-primary font-medium">3</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-light-text">Ganhe comissões</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Receba 5% de comissão sobre cada investimento realizado pelos seus indicados, sem limite de tempo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
