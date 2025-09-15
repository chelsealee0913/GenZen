import { Link, useLocation } from "wouter";

export function MobileNavigation() {
  const [location] = useLocation();

  const navItems = [
    { href: '/', icon: 'fas fa-home', label: 'Home' },
    { href: '/create', icon: 'fas fa-plus-circle', label: 'Create' },
    { href: '/library', icon: 'fas fa-book', label: 'Library' },
    { href: '/community', icon: 'fas fa-users', label: 'Community' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <button 
              className={`flex flex-col items-center py-2 px-4 transition-colors ${
                location === item.href 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <i className={`${item.icon} text-lg`}></i>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
