# TP Next.js S1 — Du CSR au SSR

## Objectif du TP
Ce TP a pour objectif de transformer notre projet React **TaskFlow** en version **Next.js** afin de comprendre les différences entre **CSR (Client Side Rendering)** et **SSR (Server Side Rendering)**.

L'objectif principal est de maîtriser :
- le routing par dossiers,
- les Server Components et Client Components,
- le fetch sans `useEffect`,
- la différence entre React SPA et Next.js.  
:contentReference[oaicite:19]{index=19}

---

## Stack utilisée
- Next.js 14+
- TypeScript
- json-server  
:contentReference[oaicite:20]{index=20}

---

## Structure principale du projet

- `app/page.tsx` : page d’accueil `/`
- `app/login/page.tsx` : page `/login`
- `app/dashboard/page.tsx` : page `/dashboard`
- `app/projects/[id]/page.tsx` : page dynamique `/projects/:id`
- `app/layout.tsx` : layout global avec Header persistant
- `db.json` : base de données utilisée avec json-server  
:contentReference[oaicite:21]{index=21}

---

## Explication générale

Dans React avec Vite, le routing se fait dans le code avec `react-router-dom`.  
Dans Next.js, le routing se fait directement à partir de la structure des dossiers.

Par exemple :
- `app/login/page.tsx` crée automatiquement la route `/login`
- `app/dashboard/page.tsx` crée automatiquement la route `/dashboard`
- `app/projects/[id]/page.tsx` crée une route dynamique pour chaque projet  
:contentReference[oaicite:22]{index=22}

Le TP montre aussi que dans une page serveur comme le Dashboard, on peut faire un `fetch()` directement dans le composant, sans `useEffect` ni `useState`. Le composant est une fonction `async` et les données sont récupérées côté serveur avant d’être envoyées au navigateur.  
:contentReference[oaicite:23]{index=23}

En revanche, la page Login utilise des interactions utilisateur (`useState`, `onChange`, `onSubmit`), donc elle doit être déclarée comme **Client Component** avec `'use client'`.  
:contentReference[oaicite:24]{index=24}

---

## Réponses aux questions

### Q1. Comparez la structure de votre projet React (Vite) avec Next.js. Quelles différences ?

En React avec Vite, on travaille généralement avec `src/`, `main.tsx`, `App.tsx`, `index.css` et un système de routing écrit dans le code avec `react-router-dom`.

En Next.js, on trouve plutôt `app/`, `layout.tsx`, `page.tsx`, `globals.css` et des dossiers qui représentent directement les routes. La différence principale est que dans React le routing est programmé dans le code, alors qu’en Next.js le routing dépend surtout de la structure des fichiers et dossiers.  
:contentReference[oaicite:25]{index=25}

### Q2. Combien de fichiers avez-vous créé pour cette route ? Comparez avec React Router.

Pour créer la route `/login` en Next.js, j’ai créé **un seul fichier** : `app/login/page.tsx`.

En React Router, il aurait fallu :
- créer le composant,
- l’importer dans `App.tsx`,
- déclarer la route dans le routeur.

Donc Next.js simplifie beaucoup la création des routes.  
:contentReference[oaicite:26]{index=26}

### Q3. En React, on utilisait `useParams()` pour récupérer l’id. En Next.js, comment est-il récupéré ? Quelle différence fondamentale ?

En Next.js, l’identifiant est récupéré grâce à `params`, transmis au composant de page.  
La différence fondamentale est que dans React, `useParams()` est un hook exécuté côté client, alors qu’en Next.js `params` est fourni au composant côté serveur.  
:contentReference[oaicite:27]{index=27}

### Q5. En React SPA, combien de lignes fallait-il pour charger les projets ? Combien ici ?

En React SPA, il fallait plus de code :
- `useState`
- `useEffect`
- `fetch`
- récupération du JSON
- mise à jour avec `setProjects`
- souvent un état `loading`

En Next.js ici, le code est beaucoup plus court : un `fetch`, un `await res.json()` et l’affichage. Il n’y a pas besoin de `useState` ni de `useEffect`.  
:contentReference[oaicite:28]{index=28}

### Q6. Ouvrez F12 > Network. Voyez-vous la requête GET /projects ? Pourquoi ?

Non, on ne voit pas la requête comme dans une SPA classique, car le `fetch` est exécuté par le serveur Next.js. Le navigateur reçoit directement le HTML déjà rempli avec les projets.  
:contentReference[oaicite:29]{index=29}

### Q7. Pourquoi faut-il `'use client'` ici et pas dans la page Dashboard ?

Il faut `'use client'` dans la page Login parce qu’elle utilise de l’interactivité :
- `useState`
- `onChange`
- `onSubmit`
- redirection avec `useRouter`

La page Dashboard ne fait qu’afficher des données récupérées côté serveur, donc elle peut rester un Server Component.  
:contentReference[oaicite:30]{index=30}

### Q8. En React, on utilisait `useNavigate()` de `react-router-dom`. En Next.js, quel est l’équivalent ?

L’équivalent est `useRouter()` depuis `next/navigation`, puis on utilise `router.push('/dashboard')` pour naviguer.  
:contentReference[oaicite:31]{index=31}

### Q9. En React SPA, que voyez-vous dans le code source HTML ? Y a-t-il les noms des projets ?

Dans React SPA, le code source HTML contient surtout une structure minimale comme `<div id="root"></div>` et les scripts JavaScript. Les noms des projets ne sont pas présents directement dans le HTML initial.  
:contentReference[oaicite:32]{index=32}

### Q10. En Next.js, que voyez-vous cette fois ? Les noms des projets sont-ils dans le HTML ?

Oui. En Next.js, les noms des projets apparaissent déjà dans le HTML. Cela prouve que la page a été rendue côté serveur.  
:contentReference[oaicite:33]{index=33}

### Q11. Le Header dans `layout.tsx` ne se re-monte pas quand on navigue. En React Router, comment faisait-on pour obtenir ce comportement ?

En React Router, pour obtenir ce comportement, on plaçait généralement le Header dans un composant parent commun, souvent un layout global, qui enveloppait les différentes pages. Ainsi, seul le contenu des pages changeait, mais le Header restait affiché.  
:contentReference[oaicite:34]{index=34}

### Q12. En Next.js, si je veux un layout spécifique au Dashboard (avec Sidebar), où est-ce que je crée le fichier ?

Je crée un `layout.tsx` dans le dossier concerné, par exemple dans `app/dashboard/layout.tsx`. Ainsi, ce layout s’appliquera à la partie Dashboard.  
Cette réponse suit la logique du App Router et des layouts par dossier montrée dans le TP.  
:contentReference[oaicite:35]{index=35}

### Q13. Le Dashboard est un Server Component. Peut-il utiliser `onClick` ? Pourquoi ?

Non, un Server Component ne peut pas gérer directement un `onClick`, car les événements interactifs appartiennent au navigateur et nécessitent un composant client. Un Server Component sert surtout à récupérer et afficher les données côté serveur.  
:contentReference[oaicite:36]{index=36}

### Q14. Si je veux ajouter un bouton « + Nouveau projet » sur le Dashboard, dois-je transformer TOUTE la page en Client Component ?

Non. Il n’est pas obligatoire de transformer toute la page en Client Component. La bonne solution est de garder la page Dashboard en Server Component, puis d’ajouter à l’intérieur un petit composant client pour la partie interactive du bouton ou du formulaire.  
:contentReference[oaicite:37]{index=37}

### Q15. `json-server` tourne sur `:4000`. Le fetch dans le Server Component se fait depuis le serveur Next.js. Le navigateur ne voit jamais l’URL `:4000`. Quel avantage de sécurité cela apporte ?

Cela apporte un avantage de sécurité parce que l’URL interne de l’API n’est pas exposée directement au navigateur. Cela limite l’exposition de certains détails techniques, réduit les risques d’appels directs non souhaités depuis le client, et permet de mieux contrôler ce qui est envoyé au front-end.  
:contentReference[oaicite:38]{index=38}

---

## Conclusion

Ce TP m’a permis de comprendre que Next.js ne gère pas les pages comme une SPA React classique.  
Les différences principales sont :

- le routing se fait par dossiers,
- le layout permet de garder une structure persistante,
- les Server Components permettent de faire le fetch côté serveur sans `useEffect`,
- les Client Components sont réservés à l’interactivité,
- le HTML généré par Next.js contient déjà les données, ce qui prouve le SSR.  
:contentReference[oaicite:39]{index=39}