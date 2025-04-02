import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <div className="flex items-center">
              <i className="ri-line-chart-fill text-2xl text-primary mr-2"></i>
              <span className="font-display font-bold text-xl text-light-text">InvestX</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex justify-center space-x-6">
            <a href="#" className="text-light-subtext hover:text-light-text">
              <i className="ri-instagram-line text-xl"></i>
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="text-light-subtext hover:text-light-text">
              <i className="ri-facebook-circle-line text-xl"></i>
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="text-light-subtext hover:text-light-text">
              <i className="ri-twitter-line text-xl"></i>
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-light-subtext hover:text-light-text">
              <i className="ri-telegram-line text-xl"></i>
              <span className="sr-only">Telegram</span>
            </a>
          </div>
        </div>
        
        <div className="mt-4 border-t border-dark-border pt-4 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left text-light-subtext text-sm">
            &copy; {new Date().getFullYear()} InvestX. Todos os direitos reservados.
          </div>
          <div className="mt-2 md:mt-0 flex flex-wrap justify-center md:justify-end space-x-4 text-sm text-light-subtext">
            <Link href="/terms">
              <a className="hover:text-light-text">Termos de Serviço</a>
            </Link>
            <Link href="/privacy">
              <a className="hover:text-light-text">Política de Privacidade</a>
            </Link>
            <Link href="/support">
              <a className="hover:text-light-text">Suporte</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
