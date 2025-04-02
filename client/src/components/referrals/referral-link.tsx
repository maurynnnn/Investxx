import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyIcon, CheckIcon, Share2 } from "lucide-react";

interface ReferralLinkProps {
  className?: string;
}

export default function ReferralLink({ className }: ReferralLinkProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copiedText, setCopiedText] = useState("");

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
    <Card className={`backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg ${className}`}>
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
        <Button 
          onClick={shareReferral}
          className="w-full mt-4 bg-primary hover:bg-primary/90"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar Link
        </Button>
      </CardContent>
    </Card>
  );
}
