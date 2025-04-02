import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  MessageCircle, 
  Phone, 
  Mail, 
  HelpCircle,
  ChevronDown
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

export default function SupportPage() {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmitTicket() {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos para enviar seu ticket.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Ticket enviado",
      description: "Recebemos seu ticket e entraremos em contato em breve.",
    });
    
    // Limpar formulário
    setSubject('');
    setMessage('');
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Suporte</h1>
            <p className="text-muted-foreground mt-1">Entre em contato com nosso suporte ou consulte a base de conhecimento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Ticket de Suporte */}
            <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
              <CardHeader>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Enviar Ticket de Suporte</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Assunto
                  </label>
                  <Input
                    id="subject"
                    placeholder="Ex: Dúvida sobre investimentos"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-dark-surface border-dark-border text-light-text"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Mensagem
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Descreva sua dúvida ou problema em detalhes..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-dark-surface border-dark-border text-light-text resize-none"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Responderemos seu ticket em até 24 horas.
                </p>
                <Button
                  onClick={handleSubmitTicket}
                  className="bg-primary hover:bg-primary/90"
                >
                  Enviar Ticket
                </Button>
              </CardFooter>
            </Card>

            {/* Perguntas Frequentes */}
            <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
              <CardHeader>
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Perguntas Frequentes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-dark-border">
                    <AccordionTrigger className="text-sm hover:text-light-text hover:no-underline">
                      Como funcionam os investimentos na plataforma?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-light-subtext">
                      Nossa plataforma oferece diferentes planos de investimento, cada um com rendimentos diários fixos.
                      Você escolhe o plano que melhor se adapta ao seu perfil e realiza o investimento. Os rendimentos
                      são calculados diariamente e adicionados ao seu saldo.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-dark-border">
                    <AccordionTrigger className="text-sm hover:text-light-text hover:no-underline">
                      Quanto tempo leva para processar um saque?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-light-subtext">
                      Os saques são processados em até 24 horas úteis após a solicitação. Após aprovação,
                      o valor é transferido para o método de pagamento escolhido, podendo levar mais tempo
                      dependendo do seu banco ou instituição financeira.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-dark-border">
                    <AccordionTrigger className="text-sm hover:text-light-text hover:no-underline">
                      Como funciona o programa de indicações?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-light-subtext">
                      Ao indicar amigos para a plataforma, você recebe 5% de comissão sobre cada investimento
                      realizado por eles. O link de indicação pode ser encontrado na página "Indicações".
                      As comissões são adicionadas automaticamente ao seu saldo.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4" className="border-dark-border">
                    <AccordionTrigger className="text-sm hover:text-light-text hover:no-underline">
                      Como posso alterar minha senha?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-light-subtext">
                      Para alterar sua senha, acesse a página de Perfil, vá para a aba "Segurança" e
                      utilize o formulário de alteração de senha. Você precisará informar sua senha atual
                      e a nova senha desejada.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5" className="border-dark-border">
                    <AccordionTrigger className="text-sm hover:text-light-text hover:no-underline">
                      O que acontece se eu quiser encerrar um investimento antes do prazo?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-light-subtext">
                      Atualmente não é possível encerrar um investimento antes do prazo determinado. Os investimentos
                      têm duração de 30 dias. Após esse período, o valor investido e os rendimentos são automaticamente
                      disponibilizados no seu saldo.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Contato Direto */}
            <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Contato Direto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium">Telefone</h3>
                    <p className="text-sm text-muted-foreground">+55 (11) 4000-1234</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Segunda a sexta, 9h às 18h
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">suporte@investx.com.br</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Respondemos em até 24 horas
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MessageCircle className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium">Chat</h3>
                    <p className="text-sm text-muted-foreground">Chat ao vivo</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Disponível 24/7
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Iniciar Chat
                </Button>
              </CardFooter>
            </Card>

            {/* Links Úteis */}
            <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Links Úteis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-light-subtext hover:text-light-text hover:bg-dark-surface"
                >
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Termos de Serviço
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-light-subtext hover:text-light-text hover:bg-dark-surface"
                >
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Política de Privacidade
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-light-subtext hover:text-light-text hover:bg-dark-surface"
                >
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Tutoriais em Vídeo
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-light-subtext hover:text-light-text hover:bg-dark-surface"
                >
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Guia do Investidor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}