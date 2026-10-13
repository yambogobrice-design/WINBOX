"use client";
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function usePageTransition() {
  const pathname = usePathname();
  const previousPath = useRef<string>('');

  useEffect(() => {
    // Si c'est un changement de page (pas le chargement initial)
    if (previousPath.current && previousPath.current !== pathname) {
      // Scroll instantané vers le haut
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      // Force le navigateur à recalculer le layout pour de meilleures performances
      void document.body.offsetHeight;
      
      // Optionnel : Annoncer le changement de page pour l'accessibilité
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `Page chargée: ${pathname}`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
    
    previousPath.current = pathname;
  }, [pathname]);

  return pathname;
}
