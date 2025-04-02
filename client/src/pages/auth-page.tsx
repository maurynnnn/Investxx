import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth, registerSchema } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [_, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  function onLoginSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  function onRegisterSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-dark-bg text-light-text">
      <Card className="w-full max-w-md backdrop-blur-md bg-dark-card/75 border border-dark-border shadow-xl">
        <CardContent className="p-8 space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <i className="ri-line-chart-fill text-3xl text-primary"></i>
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-display font-bold">InvestX</h1>
            <p className="mt-2 text-muted-foreground">Investimentos futuristas e sustentáveis</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full border-b border-dark-border rounded-none bg-transparent">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-light-text text-muted-foreground rounded-none"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-light-text text-muted-foreground rounded-none"
              >
                Cadastro
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6 space-y-6">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            autoComplete="email" 
                            className="bg-dark-surface border-dark-border text-light-text" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Senha</FormLabel>
                          <a href="#" className="text-sm text-secondary hover:text-opacity-80">
                            Esqueceu a senha?
                          </a>
                        </div>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            autoComplete="current-password" 
                            className="bg-dark-surface border-dark-border text-light-text" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <div className="flex items-center">
                        <span className="mr-2">Entrando</span>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                      </div>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                  
                  {/* Informações sobre acesso administrativo */}
                  <div className="mt-6 p-3 rounded-md bg-secondary/10 border border-secondary/20">
                    <p className="text-xs font-medium text-secondary mb-1">Acesso Administrativo</p>
                    <p className="text-xs text-light-subtext">Para acessar o painel administrativo, utilize:</p>
                    <p className="text-xs text-light-subtext mt-1">Email: <span className="font-medium text-light-text">admin123@gmail.com</span></p>
                    <p className="text-xs text-light-subtext">Senha: <span className="font-medium text-light-text">admin123</span></p>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register" className="mt-6 space-y-6">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-dark-surface border-dark-border text-light-text" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sobrenome</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-dark-surface border-dark-border text-light-text" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome de usuário</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-dark-surface border-dark-border text-light-text" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            autoComplete="email" 
                            className="bg-dark-surface border-dark-border text-light-text" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            className="bg-dark-surface border-dark-border text-light-text" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirme a senha</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            className="bg-dark-surface border-dark-border text-light-text" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="referredBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de indicação (opcional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-dark-surface border-dark-border text-light-text" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-muted-foreground">
                            Concordo com os <a href="#" className="text-secondary">Termos de Serviço</a> e <a href="#" className="text-secondary">Política de Privacidade</a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90" 
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <div className="flex items-center">
                        <span className="mr-2">Cadastrando</span>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                      </div>
                    ) : (
                      "Cadastrar"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center text-muted-foreground text-sm">
        <p>© 2023 InvestX. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}
