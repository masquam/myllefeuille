# myllefeuille
myllefeuille - a tiny knowledge management system with wiki-like markup

Knowledges are displayed without login. The user authority:
- knowledge create/edit only
- administrator: knowledge plus user create/edit

setup

1. Install node.js, mongodb (and git）
2. Create a directory, and execute git clone git://github.com/masquam/myllefeuille.git 
3. On myllefeuille directory, execute npm install 
4. To use HTTPS, prepare the certificate and key.
5. In config directory, copy config.js.sample to config.js, and edit as nesessary.
6. In tools directory, execute node ./createuser.js , which create a new user(testuser).
7. In myllefeuille directory, execute npm start
