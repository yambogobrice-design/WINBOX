/**
 * Accepte les noms de champs français envoyés par le frontend
 * (motDePasse, nouveauMotDePasse…) en plus des noms anglais de l'API.
 * Le reste du code ne manipule que les noms anglais.
 */
const ALIAS = {
  motDePasse: 'password',
  nouveauMotDePasse: 'newPassword',
  ancienMotDePasse: 'currentPassword',
  confirmationMotDePasse: 'passwordConfirmation',
  nouveauMotDePasseConfirmation: 'passwordConfirmation'
};

export const normaliserChamps = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const [alias, cible] of Object.entries(ALIAS)) {
      if (req.body[alias] !== undefined && req.body[cible] === undefined) {
        req.body[cible] = req.body[alias];
      }
    }
  }

  return next();
};

export default normaliserChamps;
