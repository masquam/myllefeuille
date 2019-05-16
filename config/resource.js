const resource = {
  index: {
    welcome: 'welcome to myllefeuille, a tiny knowledge management system',
    search: 'search',
    newArrival: 'new arraival',
    noKnowledges: 'no knowledges found.',
    more: 'more',
    menu: 'menu',
    reload: 'reload',
    login: 'login'
  },
  number: {
    knowledgeNo: 'Knowledge # ',
    lastUpdate: 'last updated: ',
    author: 'author: ',
    topPage: 'top page'
  },
  search: {
    searchResult: 'search result',
    searchString: 'search strings: ',
    noKnowledges: 'no knowledges found.',
    more: 'more',
    topPage: 'top page'
  },
  login: {
    userId: 'user ID: ',
    password: 'password: ',
    login: 'login',
    topPage: 'top page'
  },
  changepw: {
    changePassword: 'change password',
    changePasswordTo: 'change password to: ',
    password: 'password: ',
    save: 'save',
    passwordPolicy: 'password policy: ',
    passwordPolicy1: 'equal or more than 8 characters and equal or less than 100 characters',
    passwordPolicy2: 'includes capital and small characters',
    passwordPolicy3: 'includes digits',
    passwordPolicy4: 'includes symbols',
    passwordPolicy5: 'do not include space',
    adminMenu: 'admin menu',
    logout: 'logout',
    notSatisfiedPasswordPolicy: 'It do not satisfy the password policy.'
  },
  createuser: {
    createUser: 'create user',
    userId: 'user ID: ',
    displayName: 'display name: ',
    password: 'password: ',
    grantAdmin: 'grant admin (user maintenance) authority',
    create: 'create',
    passwordPolicy: 'password policy: ',
    passwordPolicy1: 'equal or more than 8 characters and equal or less than 100 characters',
    passwordPolicy2: 'includes capital and small characters',
    passwordPolicy3: 'includes digits',
    passwordPolicy4: 'includes symbols',
    passwordPolicy5: 'do not include space',
    adminMenu: 'admin menu',
    logout: 'logout'
  },
  deleteuser: {
    deleteCompleted: 'completed',
    deleteCompletedMessage: 'delete user completed.',
    backToUserSearch: 'back to user search',
    adminMenu: 'admin menu',
    logout: 'logout'
  },
  edit: {
    editKnowledge: 'edit knowledge',
    knowledgeNo: 'knowledge # ',
    title: 'title: ',
    contents: 'contents: ',
    save: 'save',
    adminMenu: 'admin menu',
    logout: 'logout',
    pleaseEnter: 'Please enter the link information',
    strings: 'strings: ',
    uri: 'URI: ',
    insert: 'insert',
    cancel: 'cancel',
    pleaseSpecifyImageFileToUpload: 'Please specify upload image file.',
    upload: 'upload',
    uploading: 'uploading...',
    uploadedSuccessfully: 'uploaded successfully.',
    failedToUpload: 'failed to upload.'
  },
  editconfirm: {
    confirmEdit: 'confirm to edit knowledge',
    save: 'save',
    back: 'back',
    menu: 'menu',
    logout: 'logout'
  },
  edituser: {
    editUser: 'edit user',
    userId: 'user ID: ',
    displayName: 'display name: ',
    grantAdmin: 'grant admin (user maintenance) authority',
    save: 'save',
    delete: 'delete',
    confirmOfDelete: 'confirm of delete',
    areYouSureYouWantToDeleteTheUser: 'Are you sure you want to delete the user?',
    yes: 'yes',
    no: 'no',
    backToUserSearch: 'back to user search',
    adminMenu: 'admin menu',
    logout: 'logout'
  },
  edituser_error: {
    error: 'error',
    userNotFound: 'user not found.',
    adminMenu: 'admin menu',
    logout: 'logout'
  },
  edituserpw: {
    changePasswordOfAUser: 'change password of a user',
    userId: 'user ID: ',
    displayName: 'display name: ',
    authority: 'authority: ',
    adminAuthority: 'administrator',
    onlyCreateEditKnowledges: 'only create/edit knowledges',
    password: 'password: ',
    save: 'save',
    backToUserSearch: 'back to user search',
    adminMenu: 'admin menu',
    logout: 'logout'
  },
  edituserpwresult: {
    changePasswordOfAUser: 'change password of a user',
    changePasswordOfAUserMessage: 'The password of the user is changed.',
    adminMenu: 'admin menu',
    logout: 'logout'
  },
  edituserresult: {
    editUser: 'edit user',
    editUserMessage: 'The user is edited.',
    backToEditUser: 'back to edit user',
    adminMenu: 'admin menu',
    logout: 'logout'
  },
  make: {
    createKnowledge: 'create knowledge',
    title: 'title: ',
    contents: 'contents: ',
    save: 'save',
    adminMenu: 'admin menu',
    logout: 'logout',
    pleaseEnter: 'Please enter the link information',
    strings: 'strings:',
    uri: 'URI:',
    insert: 'insert',
    cancel: 'cancel',
    pleaseSpecifyImageFileToUpload: 'Please specify upload image file.',
    upload: 'upload',
    uploading: 'uploading...',
    uploadedSuccessfully: 'uploaded successfully.',
    failedToUpload: 'failed to upload.'
  },
  makeconfirm: {
    confirmSave: 'confirm to save knowledge',
    save: 'save',
    back: 'back',
    menu: 'menu',
    logout: 'logout'
  },
  menu: {
    adminMenu: 'admin menu',
    userName: 'user name:',
    createKnowledge: 'create knowledge',
    editKnowledge: 'edit knowledge',
    changePassword: 'change password',
    createUser: 'create user',
    editUser: 'edit user',
    changePasswordOfAUser: 'change password of a user',
    logout: 'logout'
  },
  save: {
    saveKnowledge: 'knowledge saved.',
    adminMenu: 'admin menu',
    logout: 'logout'
  },
  savepw: {
    savePassword: 'save password',
    savePasswordMessage: 'password saved.',
    adminMenu: 'admin menu',
    logout: 'logout'
  },
  saveuser: {
    saveUser: 'save user',
    saveUserMessage: 'user saved.',
    adminMenu: 'admin menu',
    logout: 'logout'
  },
  searchuser: {
    searchUserToEdit: 'search user to edit',
    search: 'search',
    searchResult: 'search result',
    userNotFound: 'user not found.',
    adminMenu: 'admin menu',
    logout: 'logout'
  },
  searchuserpw: {
    searchUserToChangePassword: 'search user to change password',
    search: 'search',
    searchResult: 'search result',
    userNotFound: 'user not found.',
    adminMenu: 'admin menu',
    logout: 'logout'
  },
  select: {
    searchKnowledgeToEdit: 'search knowledge to edit',
    search: 'search',
    searchResult: 'search result',
    adminMenu: 'admin menu',
    logout: 'logout'
  },
  selectresult: {
    searchResult: 'search result',
    noKnowledgeFound: 'no knowledges found.',
    more: 'more',
    backToSearch: 'back to search',
    adminMenu: 'admin menu',
    logout: 'logout'
  }
};

module.exports = resource;
