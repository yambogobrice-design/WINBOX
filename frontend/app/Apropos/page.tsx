"use client";
import Image from "next/image";

export default function AproposPage() {
  // Informations du développeur (à personnaliser)
  const developpeur = {
    nom: "YAMBOGO BRICE",
    role: "Élève-Ingénieur  | Ingénieur IA & Data | Développeur Full-Stack | Créateur de WinBox",
    description: "Étudiant passionné par le développement web et l'innovation technologique",
    photo: "/Photo.png",
    email: "yambogobrice@gmail.com.com",
    whatsapp: "+226 65313683",
    linkedin: "https://www.linkedin.com/in/yambogo-brice/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BJRtrHPEkSn2WtZ6PFAWDQA%3D%3D",
    github: "https://github.com/yambogobrice-design",
    skills: [
      "React & Next.js",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "UI/UX Design",
      "API Development",
      "Tailwind CSS",
      "Git & GitHub",
    ],
  };

  const technologies = [
    { nom: "Next.js", icon: "⚛️", description: "Framework React pour le frontend" },
    { nom: "TypeScript", icon: "📘", description: "Typage statique pour JavaScript" },
    { nom: "Tailwind CSS", icon: "🎨", description: "Framework CSS utility-first" },
    { nom: "Node.js", icon: "🟢", description: "Runtime JavaScript pour le backend" },
    { nom: "MongoDB", icon: "🍃", description: "Base de données NoSQL" },
    { nom: "Vercel", icon: "▲", description: "Plateforme de déploiement" },
  ];

  const timeline = [
    {
      date: "Septembre 2026",
      titre: "Conception initiale",
      description: "Idéation et définition des besoins de la plateforme pour faciliter l'accès aux ressources académiques",
    },
    {
      date: "Octobre 2026",
      titre: "Développement du prototype",
      description: "Création des premières maquettes, architecture technique et développement des fonctionnalités principales",
    },
    {
      date: "Novembre 2026",
      titre: "Phase de tests",
      description: "Tests utilisateurs, corrections de bugs et optimisations de performances",
    },
    {
      date: "Janvier 2027",
      titre: "Lancement officiel",
      description: "Mise en ligne de WinBox pour la communauté étudiante",
    },
  ];

  const realisations = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      titre: "Interface intuitive",
      description: "Design moderne et épuré pour une navigation facile",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      titre: "Performance optimale",
      description: "Chargement rapide et expérience utilisateur fluide",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      titre: "Responsive design",
      description: "Adapté à tous les appareils (mobile, tablette, desktop)",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      titre: "Sécurité",
      description: "Protection des données et authentification sécurisée",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black antialiased">
      {/* Hero Section */}
      <div className="relative border-b-2 border-black bg-white overflow-hidden">
        {/* Grille de fond subtile */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-none">
              Créé par un étudiant
              <br />
              <span className="relative inline-block mt-4">
                <span className="relative z-10"> pour des étudiants</span>
                
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-2xl mx-auto font-light">
              WinBox est une plateforme collaborative qui facilite le partage de ressources académiques
              et crée une communauté d&apos;entraide entre étudiants.
            </p>
          </div>
        </div>
      </div>

      {/* Le Créateur */}
      <div className="border-b-2 border-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-block border-b-4 border-black pb-2 mb-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Le créateur de WinBox</h2>
            </div>
            <p className="text-gray-600 text-lg font-light uppercase tracking-wider">
              Passionné par la technologie et l&apos;éducation
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white border-4 border-black p-10 md:p-16 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <div className="relative w-52 h-52 rounded-full overflow-hidden border-8 border-white shadow-[0_0_0_2px_black,0_20px_60px_rgba(0,0,0,0.4)]">
                    <Image
                      src={developpeur.photo}
                      alt={developpeur.nom}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Informations */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">{developpeur.nom}</h3>
                  <div className="mb-6">
                    <p className="text-sm text-gray-900 font-bold uppercase tracking-widest mb-2">{developpeur.role}</p>
                    <div className="w-20 h-1 bg-black mb-4 mx-auto md:mx-0"></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-8 text-lg font-light">
                    {developpeur.description}
                  </p>

                 

                  {/* Liens sociaux */}
                  <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                    <a
                      href={`mailto:${developpeur.email}`}
                      className="px-6 py-3 bg-black text-white text-xs font-black hover:bg-gray-800 transition-all flex items-center gap-2 uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </a>
                    <a
                      href={`https://wa.me/${developpeur.whatsapp.replace(/\s/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 border-2 border-black text-black text-xs font-black hover:bg-black hover:text-white transition-all flex items-center gap-2 uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                    <a
                      href={developpeur.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 border-2 border-black text-black text-xs font-black hover:bg-black hover:text-white transition-all flex items-center gap-2 uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                    <a
                      href={developpeur.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 border-2 border-black text-black text-xs font-black hover:bg-black hover:text-white transition-all flex items-center gap-2 uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="border-b-2 border-black bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border-4 border-white p-10 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.3)] transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-black flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black tracking-tight">Ma Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg font-light">
                Démocratiser l&apos;accès aux ressources pédagogiques et créer un écosystème où chaque étudiant
                peut contribuer, apprendre et progresser ensemble. Je crois en la force du partage de connaissances
                et en l&apos;entraide académique.
              </p>
            </div>

            <div className="bg-black border-4 border-white p-10 text-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.3)] transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white flex items-center justify-center">
                  <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black tracking-tight">Ma Vision</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg font-light">
                Faire de WinBox la référence en matière de plateforme collaborative pour les étudiants, en offrant
                non seulement des ressources de qualité, mais aussi des outils de révision interactifs, un système
                de gamification motivant, et une communauté bienveillante.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-block border-b-4 border-black pb-2 mb-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Parcours de développement</h2>
            </div>
            <p className="text-gray-600 text-lg font-light uppercase tracking-wider">
              De l&apos;idée à la réalisation
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Ligne verticale épaisse */}
              <div className="absolute left-10 top-0 bottom-0 w-1 bg-black" />

              {timeline.map((etape, index) => (
                <div key={index} className="relative pb-16 last:pb-0">
                  <div className="flex items-start gap-8">
                    {/* Point sur la timeline */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-20 h-20 bg-black flex items-center justify-center text-white font-black text-2xl border-4 border-white shadow-[0_0_0_4px_black]">
                        {index + 1}
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 bg-white border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                      <div className="inline-block bg-black text-white px-4 py-1 text-xs font-black mb-3 uppercase tracking-widest">{etape.date}</div>
                      <h3 className="text-2xl font-black mb-3 tracking-tight">{etape.titre}</h3>
                      <p className="text-gray-700 leading-relaxed font-light">{etape.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      

      {/* Contact & Contribution */}
      <div className="bg-white border-t-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-black tracking-tight">Rejoignez l&apos;aventure</h2>
              <div className="w-32 h-1 bg-black mx-auto"></div>
            </div>
            <p className="text-gray-600 text-xl mb-12 font-light leading-relaxed">
              WinBox est un projet en constante évolution. Que vous soyez étudiant, contributeur,
              ou simplement passionné, vous pouvez aider à améliorer la plateforme et la communauté.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <a
                href="/Contribuer"
                className="px-10 py-5 bg-black text-white font-black text-sm hover:bg-gray-800 transition-all uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                Contribuer au projet
              </a>
              <a
                href={`mailto:${developpeur.email}`}
                className="px-10 py-5 border-4 border-black text-black font-black text-sm hover:bg-black hover:text-white transition-all uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                Me contacter
              </a>
            </div>

            <div className="pt-12 border-t-2 border-black/20">
              <p className="text-sm text-gray-500 tracking-wider font-light">
                Version 1.0.0 • © 2026 WinBox
              </p>
              <p className="text-sm text-gray-600 mt-2 font-light">
                Développé avec <span className="text-black">passion</span> par <span className="text-black font-bold">{developpeur.nom}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
