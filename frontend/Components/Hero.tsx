"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Titre from "./Titre";
import Texte from "./Texte";

/**
 * Hero section avec thème énergie renouvelable.
 * - Carousel automatique d'images de fond
 * - Overlay vert naturel au lieu de noir
 * - Titre accrocheur avec appel à l'action
 * - Double CTA : conversion + preuve sociale
 */
const Hero = () => {
  const slides = [
    {
      image: "https://img.freepik.com/premium-photo/renewable-energy-background-with-green-energy-as-wind-turbines-solar-panels_327072-7727.jpg?w=2000",
      title: "Énergies Renouvelables",
      description: "Leader des solutions solaires en Afrique de l'Ouest. Installations photovoltaïques pour ménages, entreprises et institutions."
    },
    {
      image: "https://www.agrimaroc.ma/wp-content/uploads/eau-afrique-rencontre-marrakech.jpg",
      title: "Accès à l'Eau Potable",
      description: "Systèmes de pompage solaire et forages pour l'approvisionnement en eau des zones rurales. Plus de 1000 familles desservies."
    },
    {
      image: "https://perfomaq.cl/wp-content/uploads/2018/01/riego-perfomaq-800x500.jpg",
      title: "Agriculture & Irrigation intelligente",
      description: "Solutions d'irrigation solaire pour améliorer la productivité agricole tout en préservant les ressources naturelles."
    },
    {
      image: "https://th.bing.com/th/id/R.30dfa353315c5f44808f9880e17bda5d?rik=2PetSnCu8reB3A&riu=http%3a%2f%2fwww.fgme.fr%2fwp-content%2fuploads%2f2022%2f08%2fassainissement-savoir.jpg&ehk=A37mlT39kQ6wfsWxLMiNUyHf2WKJYDPZHtghjs9E%2feM%3d&risl=&pid=ImgRaw&r=0",
      title: "Assainissement Écologique",
      description: "Systèmes innovants de traitement des eaux usées et d'assainissement pour un environnement plus sain et durable."
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 7000); // Change d'image toutes les 7 secondes

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="hero min-h-screen relative overflow-hidden">
      {/* Images de fond avec transition */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out"
          style={{
            backgroundImage: `url(${slide.image})`,
            opacity: currentImageIndex === index ? 1 : 0,
            transform: currentImageIndex === index ? 'scale(1)' : 'scale(1.1)',
            zIndex: 0
          }}
        />
      ))}

      {/* Gradient overlay écologique - plus léger pour voir l'image */}
      <div className="absolute inset-0 bg-gradient-to-r from-eco-forest/80 via-eco-forest/40 to-transparent z-10" />

      <div className="hero-content relative z-20 flex items-center min-h-screen px-4 md:px-8">
        <div className="max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Contenu à gauche */}
          <div 
            key={`content-${currentImageIndex}`}
            className="animate-fade-in-up space-y-6"
          >
            

            {/* Catégorie */}
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-solar-gold rounded-full"></div>
              <span className="text-solar-gold font-bold uppercase tracking-widest text-sm">
                {["Expertise", "Innovation", "Durabilité", "Excellence", "Impact"][currentImageIndex]}
              </span>
            </div>

            {/* Titre */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
              {slides[currentImageIndex].title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-white/95 font-light leading-relaxed drop-shadow-lg max-w-2xl">
              {slides[currentImageIndex].description}
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/Contact" 
                className="group relative px-8 py-4 bg-solar-gold hover:bg-solar-amber text-white font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 text-center"
              >
                Contactez nous
              </Link>
              
            </div>
          </div>

          {/* Espace vide à droite pour laisser voir l'image */}
          <div className="hidden md:block"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
