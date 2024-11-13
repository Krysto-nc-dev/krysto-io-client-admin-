## Clone the project
```
git clone https://gitlab.com/krup1/krup-client-admin.git
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
Lancer le serveur de développement
```
npm run serve -- --port 5003
```


Accédez à l'application en utilisant les liens affichés lorsque la compilation est terminée : 
```
App running at:
  - Local:   http://localhost:5003/ 
  - Network: http://192.168.1.6:5003/
```
### Build for production
Pour mettre en ligne l'application dans sa version finale et optimisée, il est nécessaire de build l'application.

Le build va créer un répertoire /dist qui contient les fichiers compilés.

```
sudo npm run build
```

### Start production server
Ensuite, il faut lancer la commande suivante, pour lancer le serveur de production sur le port souhaité :  


```
#si la commande serve n'est pas installée : 
sudo npm install -g serve
#lancer le serveur 
serve -s dist -p 4000
```

---

### Accès administrateur

Pour accéder à la partie backoffice réservée aux admin, créez un premier compte utilisateur via le formulaire d'inscription, disponible via le bouton "S'inscrire" situé en pied de page.

Le rôle "admin" est automatiquement attribué au premier utilisateur qui s'inscrit. 

Il est possible d'attribuer ce rôle à d'autres utilisateurs par la suite, via un compte admin.

(les inscriptions pourront être désactivées en production)




---

### Configuration (for production)

Description des principaux paramètres du fichier de configuration :

---

### Configuration (for production)

Description des principaux paramètres du fichier de configuration :

| Paramètre | Valeur | Détails |
| ------ | ------ | ------ |
| root_node.url | https://api.krup.nc | Url complète vers l'API |
| root_node.port | 443 | Port pour accéder à l'API |
| clientUrl | https://krup.nc | Url complète vers le client utilisateur |
| websocketUrl | https://krup.nc | Url complète vers le serveur de socket |
| domaineName | krup.nc | Nom de domaine du site utilisateur |

---

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
