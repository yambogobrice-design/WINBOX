// Composants de skeleton réutilisables
export function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`}></div>
  );
}

export function SkeletonText({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-300 rounded h-4 ${className}`}></div>
  );
}

export function SkeletonCircle({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-300 rounded-full ${className}`}></div>
  );
}

// Skeleton pour la page d'accueil (Hero + Aura + Description + Cards + Presentation produits)
export function HomePageSkeleton() {
  return (
    <div className="bg-neutral-cream">
      {/* Hero Skeleton - plein écran */}
      <div className="min-h-screen bg-gradient-to-b from-gray-300 to-gray-200 animate-pulse flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <SkeletonText className="h-16 w-3/4 mx-auto" />
          <SkeletonText className="h-8 w-2/3 mx-auto" />
          <div className="flex gap-4 justify-center mt-8">
            <SkeletonBox className="h-14 w-48" />
            <SkeletonBox className="h-14 w-48" />
          </div>
        </div>
      </div>

      {/* Aura Title */}
      <div className="py-8 bg-gray-100">
        <SkeletonText className="h-10 w-96 mx-auto" />
      </div>

      {/* Description Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="space-y-4">
          <SkeletonText className="h-6 w-full" />
          <SkeletonText className="h-6 w-full" />
          <SkeletonText className="h-6 w-3/4" />
        </div>
      </div>

      {/* Aura Title */}
      <div className="py-8 bg-gray-100">
        <SkeletonText className="h-10 w-80 mx-auto" />
      </div>

      {/* Cards activités - 7 cards en grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="space-y-4">
              <SkeletonBox className="h-64 w-full rounded-lg" />
              <SkeletonText className="h-6 w-3/4" />
              <SkeletonText className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Aura Title */}
      <div className="py-8 bg-gray-100">
        <SkeletonText className="h-10 w-96 mx-auto" />
      </div>

      {/* Présentation produits */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <SkeletonBox className="h-80 w-full rounded-2xl" />
              <SkeletonText className="h-6 w-2/3" />
              <SkeletonBox className="h-12 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Hero competences */}
      <div className="min-h-[60vh] bg-gradient-to-b from-gray-200 to-gray-300 animate-pulse py-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <SkeletonText className="h-12 w-3/4 mx-auto" />
          <SkeletonText className="h-6 w-2/3 mx-auto" />
          <SkeletonBox className="h-14 w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}

// Skeleton pour les pages de domaines
export function DomainePageSkeleton() {
  return (
    <div className="min-h-screen bg-clean-light">
      {/* Hero Skeleton avec image de fond */}
      <div className="min-h-[70vh] bg-gradient-to-b from-gray-300 to-gray-200 animate-pulse">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
          <SkeletonBox className="h-8 w-40 mx-auto rounded-full" />
          <SkeletonText className="h-14 w-3/4 mx-auto" />
          <SkeletonText className="h-6 w-2/3 mx-auto" />
          <div className="grid md:grid-cols-2 gap-6 mt-8 max-w-2xl mx-auto">
            <SkeletonBox className="h-32 w-full rounded-lg" />
            <SkeletonBox className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* Content grid 2 colonnes */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Colonne gauche - expertise */}
          <div className="space-y-6">
            <SkeletonText className="h-10 w-3/4" />
            <SkeletonText className="h-4 w-full" />
            <SkeletonText className="h-4 w-full" />
            <SkeletonText className="h-4 w-5/6" />
            <div className="space-y-4 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3">
                  <SkeletonCircle className="w-2 h-2 mt-2" />
                  <div className="flex-1 space-y-2">
                    <SkeletonText className="h-6 w-48" />
                    <SkeletonText className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne droite - avantages et applications */}
          <div className="space-y-6">
            <SkeletonBox className="h-80 w-full rounded-2xl" />
            <SkeletonBox className="h-48 w-full rounded-2xl" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <SkeletonBox className="h-64 w-full max-w-3xl mx-auto rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

// Skeleton pour la page Solutions
export function SolutionsPageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton avec image de fond */}
      <div className="py-20 bg-gradient-to-b from-gray-300 to-gray-200 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <SkeletonText className="h-12 w-96 mx-auto" />
          <SkeletonText className="h-6 w-2/3 mx-auto" />
        </div>
      </div>

      {/* Navigation tabs sticky */}
      <div className="bg-gray-100 py-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBox key={i} className="h-12 w-44 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Solutions cards - 4 catégories */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {[1, 2].map((cat) => (
          <div key={cat} className="space-y-8">
            <SkeletonText className="h-10 w-72 mx-auto text-center" />
            {/* Card solution avec gradient border */}
            <div className="rounded-2xl bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 p-1">
              <div className="rounded-[calc(1rem-2px)] bg-white p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <SkeletonBox className="h-96 rounded-lg" />
                  <div className="space-y-4">
                    <SkeletonText className="h-8 w-3/4" />
                    <SkeletonText className="h-4 w-full" />
                    <SkeletonText className="h-4 w-full" />
                    <div className="space-y-3 mt-6">
                      <SkeletonText className="h-5 w-32" />
                      <SkeletonText className="h-3 w-full" />
                      <SkeletonText className="h-3 w-full" />
                    </div>
                  </div>
                </div>
                <SkeletonBox className="h-12 w-64 mx-auto rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton pour les pages admin/commerciales dashboards
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <SkeletonText className="h-10 w-64" />
          <SkeletonBox className="h-10 w-32 rounded-lg" />
        </div>

        {/* Stats Cards - 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow space-y-3">
              <SkeletonText className="h-4 w-24" />
              <SkeletonText className="h-8 w-32" />
              <SkeletonText className="h-3 w-20" />
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 space-y-4">
            <SkeletonText className="h-6 w-48" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="grid grid-cols-5 gap-4">
                  <SkeletonText className="h-4 w-full" />
                  <SkeletonText className="h-4 w-full" />
                  <SkeletonText className="h-4 w-full" />
                  <SkeletonText className="h-4 w-full" />
                  <SkeletonBox className="h-8 w-20 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton pour pages de contenu (Conditions, Politique, etc.)
export function ContentPageSkeleton() {
  return (
    <div className="min-h-screen bg-clean-light">
      {/* Hero avec gradient */}
      <div className="bg-gradient-to-r from-gray-300 to-gray-200 py-20 animate-pulse">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <SkeletonText className="h-12 w-2/3 mx-auto" />
          <SkeletonText className="h-6 w-80 mx-auto" />
        </div>
      </div>

      {/* Content avec sections multiples */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-4">
              <SkeletonText className="h-8 w-2/3" />
              <SkeletonText className="h-4 w-full" />
              <SkeletonText className="h-4 w-full" />
              <SkeletonText className="h-4 w-5/6" />
              {i % 3 === 0 && (
                <div className="space-y-2 ml-4">
                  <SkeletonText className="h-3 w-full" />
                  <SkeletonText className="h-3 w-full" />
                  <SkeletonText className="h-3 w-4/5" />
                </div>
              )}
            </div>
          ))}
          <SkeletonBox className="h-12 w-48 mx-auto rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Skeleton pour la page Contact
export function ContactPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <SkeletonText className="h-14 w-96 mx-auto" />
          <SkeletonBox className="h-1 w-24 mx-auto rounded-full" />
          <SkeletonText className="h-6 w-2/3 mx-auto" />
        </div>

        {/* Card principale avec gradient border */}
        <div className="rounded-3xl bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 p-1">
          <div className="rounded-[calc(1.5rem-2px)] bg-base-100 p-12">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Colonne gauche - Infos */}
              <div className="space-y-8">
                <SkeletonText className="h-8 w-64" />
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4 bg-gray-100 rounded-xl p-5">
                      <SkeletonCircle className="w-12 h-12" />
                      <div className="flex-1 space-y-2">
                        <SkeletonText className="h-5 w-32" />
                        <SkeletonText className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                  {/* Réseaux sociaux */}
                  <div className="bg-gray-100 rounded-xl p-5 space-y-3">
                    <SkeletonText className="h-5 w-32" />
                    <div className="flex gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <SkeletonCircle key={i} className="w-12 h-12" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne droite - Formulaire */}
              <div className="space-y-6">
                <SkeletonText className="h-8 w-64" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <SkeletonText className="h-4 w-32" />
                    <SkeletonBox className={`w-full rounded-lg ${i === 5 ? 'h-32' : 'h-12'}`} />
                  </div>
                ))}
                <SkeletonBox className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <SkeletonBox className="h-96 w-full rounded-3xl" />
      </div>
    </div>
  );
}

// Skeleton pour la page About
export function AboutPageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="py-32 bg-gradient-to-b from-gray-300 to-gray-200 animate-pulse">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <SkeletonText className="h-12 w-96 mx-auto" />
          <SkeletonText className="h-6 w-2/3 mx-auto" />
        </div>
      </div>

      {/* Historique */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <SkeletonBox className="h-96 w-full rounded-2xl" />
      </div>

      {/* Vision Mission Valeurs - 3 cards */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <SkeletonText className="h-10 w-96 mx-auto" />
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <SkeletonBox key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>

      {/* RSE */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <SkeletonBox className="h-[600px] w-full rounded-2xl" />
      </div>

      {/* Équipe - 2 cards */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <SkeletonText className="h-10 w-96 mx-auto" />
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-6 bg-white p-8 rounded-2xl">
                <SkeletonCircle className="w-48 h-48 mx-auto" />
                <SkeletonText className="h-6 w-48 mx-auto" />
                <SkeletonText className="h-4 w-32 mx-auto" />
                <SkeletonText className="h-4 w-full" />
                <SkeletonText className="h-4 w-full" />
                <div className="flex gap-4 justify-center">
                  <SkeletonBox className="h-10 w-32 rounded-lg" />
                  <SkeletonBox className="h-10 w-32 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prix - 3 cards */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <SkeletonText className="h-10 w-96 mx-auto" />
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <SkeletonBox key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentPageSkeleton;
