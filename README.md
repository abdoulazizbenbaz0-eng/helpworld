# HelpWorld — MVP reconstruit (26 juillet 2026)

Base minimale : connexion, inscription, liste de missions, détail de mission
(prendre en charge / marquer terminée), profil utilisateur avec note.
Pas encore : chat, paiement, i18n multilingue, upload photo — à ajouter ensuite.

## AVANT DE LANCER — 2 choses à remplir obligatoirement

1. **`utils/firebaseConfig.js`** : remplace les `REMPLACE_MOI` par les vraies
   clés de ton projet Firebase `helpworld-8568e`.
   → Console Firebase > ⚙️ Paramètres du projet > Tes applications > Config SDK

2. **`app.json`** : remplace `REMPLACE_PAR_TON_PROJECT_ID_EAS` par ton
   project ID EAS existant (visible sur expo.dev, projet "monde d'aide").

3. **Active Firestore + Authentication (Email/Password)** dans la console
   Firebase si ce n'est pas déjà fait, et déploie les règles du fichier
   `firestore.rules` (Firestore > Règles > coller le contenu > Publier).

## Installation dans Termux

```bash
cd ~
rm -rf helpworld        # supprime l'ancien dossier vide
# place le nouveau dossier "helpworld" ici (dézippe l'archive téléchargée)
cd helpworld
npm install
```

## Tester en développement

```bash
npx expo start
```

## Builder l'APK/AAB avec EAS

```bash
eas login
eas build --platform android --profile preview     # APK pour tester
eas build --platform android --profile production  # AAB pour le Play Store
```

Si `eas.json` n'existe pas encore, lance d'abord :
```bash
eas build:configure
```

## Prochaines étapes suggérées

- Ajouter le chat privé (collection Firestore `messages` + règles dédiées)
- Ré-ajouter l'i18n (utils/i18n.js) une fois le MVP validé
- Ré-intégrer le upload de photo de profil (base64 ou Firebase Storage)
- Paiement : reprendre l'intégration Flutterwave (FCFA, escrow `solde_fcfa`)
