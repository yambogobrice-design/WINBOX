"use client";
import { useState } from "react";

interface User {
  id: number;
  nom: string;
  email: string;
  role: "etudiant" | "contributeur" | "admin";
  filiere: string;
  niveau: string;
  dateInscription: string;
  derniereConnexion: string;
  statut: "actif" | "inactif" | "suspendu";
  contributions: number;
  telechargements: number;
}

type FiltreRole = "tous" | User["role"];
type FiltreStatut = "tous" | User["statut"];

export default function GestionUtilisateurs() {
  const [recherche, setRecherche] = useState("");
  const [filtreRole, setFiltreRole] = useState<FiltreRole>("tous");
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>("tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<User | null>(null);

  // Données de démonstration
  const utilisateurs: User[] = [
    {
      id: 1,
      nom: "Ahmed Benali",
      email: "ahmed.benali@student.um6p.ma",
      role: "contributeur",
      filiere: "MPCI",
      niveau: "Licence 2",
      dateInscription: "2023-09-15",
      derniereConnexion: "2024-01-15 14:30",
      statut: "actif",
      contributions: 15,
      telechargements: 234,
    },
    {
      id: 2,
      nom: "Sarah Martin",
      email: "sarah.martin@student.um6p.ma",
      role: "etudiant",
      filiere: "MPI",
      niveau: "Licence 3",
      dateInscription: "2023-10-01",
      derniereConnexion: "2024-01-14 10:15",
      statut: "actif",
      contributions: 3,
      telechargements: 567,
    },
    {
      id: 3,
      nom: "Karim El Haddad",
      email: "karim.elhaddad@um6p.ma",
      role: "admin",
      filiere: "-",
      niveau: "-",
      dateInscription: "2022-01-10",
      derniereConnexion: "2024-01-15 16:45",
      statut: "actif",
      contributions: 0,
      telechargements: 45,
    },
    {
      id: 4,
      nom: "Fatima Zahra",
      email: "fatima.zahra@student.um6p.ma",
      role: "etudiant",
      filiere: "BCG",
      niveau: "Licence 1",
      dateInscription: "2023-11-20",
      derniereConnexion: "2024-01-10 09:20",
      statut: "inactif",
      contributions: 0,
      telechargements: 12,
    },
    {
      id: 5,
      nom: "Mohammed Alami",
      email: "mohammed.alami@student.um6p.ma",
      role: "etudiant",
      filiere: "MIAS",
      niveau: "Master 1",
      dateInscription: "2023-08-05",
      derniereConnexion: "2023-12-15 18:00",
      statut: "suspendu",
      contributions: 0,
      telechargements: 890,
    },
  ];

  const utilisateursFiltres = utilisateurs.filter((user) => {
    const matchRecherche =
      user.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      user.email.toLowerCase().includes(recherche.toLowerCase());
    const matchRole = filtreRole === "tous" || user.role === filtreRole;
    const matchStatut = filtreStatut === "tous" || user.statut === filtreStatut;

    return matchRecherche && matchRole && matchStatut;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "contributeur":
        return "bg-blue-100 text-blue-800";
      case "etudiant":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "actif":
        return "bg-green-100 text-green-800";
      case "inactif":
        return "bg-yellow-100 text-yellow-800";
      case "suspendu":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur";
      case "contributeur":
        return "Contributeur";
      case "etudiant":
        return "Étudiant";
      default:
        return role;
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "actif":
        return "Actif";
      case "inactif":
        return "Inactif";
      case "suspendu":
        return "Suspendu";
      default:
        return statut;
    }
  };

  const stats = {
    total: utilisateurs.length,
    actifs: utilisateurs.filter((u) => u.statut === "actif").length,
    contributeurs: utilisateurs.filter((u) => u.role === "contributeur").length,
    admins: utilisateurs.filter((u) => u.role === "admin").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des utilisateurs</h1>
        <p className="text-gray-600">Gérez les comptes utilisateurs et leurs permissions</p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Total utilisateurs</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Utilisateurs actifs</p>
          <p className="text-3xl font-bold text-green-600">{stats.actifs}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Contributeurs</p>
          <p className="text-3xl font-bold text-blue-600">{stats.contributeurs}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Administrateurs</p>
          <p className="text-3xl font-bold text-red-600">{stats.admins}</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <select
            value={filtreRole}
            onChange={(e) => setFiltreRole(e.target.value as FiltreRole)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="tous">Tous les rôles</option>
            <option value="etudiant">Étudiants</option>
            <option value="contributeur">Contributeurs</option>
            <option value="admin">Administrateurs</option>
          </select>

          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value as FiltreStatut)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="tous">Tous les statuts</option>
            <option value="actif">Actifs</option>
            <option value="inactif">Inactifs</option>
            <option value="suspendu">Suspendus</option>
          </select>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Liste des utilisateurs ({utilisateursFiltres.length})
          </h2>
          <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            + Ajouter un utilisateur
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filière / Niveau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activité
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {utilisateursFiltres.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {user.nom.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.nom}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadge(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.filiere !== "-" ? `${user.filiere} - ${user.niveau}` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatutBadge(user.statut)}`}>
                      {getStatutLabel(user.statut)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="space-y-1">
                      <p>{user.contributions} contributions</p>
                      <p className="text-xs text-gray-400">{user.telechargements} téléchargements</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setUtilisateurSelectionne(user);
                          setModalOuvert(true);
                        }}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title="Voir détails"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title="Modifier"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {utilisateursFiltres.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      {/* Modal détails utilisateur */}
      {modalOuvert && utilisateurSelectionne && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Détails de l&apos;utilisateur</h3>
              <button
                onClick={() => setModalOuvert(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-600">
                    {utilisateurSelectionne.nom.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{utilisateurSelectionne.nom}</h4>
                  <p className="text-sm text-gray-500">{utilisateurSelectionne.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rôle</p>
                  <span className={`px-3 py-1 text-sm font-medium rounded ${getRoleBadge(utilisateurSelectionne.role)}`}>
                    {getRoleLabel(utilisateurSelectionne.role)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Statut</p>
                  <span className={`px-3 py-1 text-sm font-medium rounded ${getStatutBadge(utilisateurSelectionne.statut)}`}>
                    {getStatutLabel(utilisateurSelectionne.statut)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Filière</p>
                  <p className="text-sm font-medium text-gray-900">{utilisateurSelectionne.filiere}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Niveau</p>
                  <p className="text-sm font-medium text-gray-900">{utilisateurSelectionne.niveau}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date d&apos;inscription</p>
                  <p className="text-sm font-medium text-gray-900">{utilisateurSelectionne.dateInscription}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dernière connexion</p>
                  <p className="text-sm font-medium text-gray-900">{utilisateurSelectionne.derniereConnexion}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h5 className="font-semibold text-gray-900 mb-4">Statistiques</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-600 mb-1">Contributions</p>
                    <p className="text-2xl font-bold text-blue-900">{utilisateurSelectionne.contributions}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-600 mb-1">Téléchargements</p>
                    <p className="text-2xl font-bold text-green-900">{utilisateurSelectionne.telechargements}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 flex gap-3">
                <button className="flex-1 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Modifier le rôle
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                  Suspendre le compte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
