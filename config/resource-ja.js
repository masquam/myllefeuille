const resource = {
  index: {
    welcome: 'myllefeuilleにようこそ',
    search: '検索',
    newArrival: '新着情報',
    noKnowledges: '該当するナレッジがありません。',
    more: 'もっと表示',
    menu: 'メニュー',
    reload: 'リロード',
    login: 'ログイン'
  },
  number: {
    knowledgeNo: 'ナレッジ #',
    lastUpdate: '最終更新日時: ',
    author: '著者: ',
    topPage: 'トップページ'
  },
  search: {
    searchResult: '検索結果',
    searchString: '検索文字列: ',
    noKnowledges: '該当するナレッジがありません。',
    more: 'もっと表示',
    topPage: 'トップページ'
  },
  login: {
    userId: 'ユーザーID: ',
    password: 'パスワード: ',
    login: 'ログイン',
    topPage: 'トップページ'
  },
  changepw: {
    changePassword: 'パスワードの変更',
    changePasswordTo: 'パスワード変更対象ユーザー: ',
    password: 'パスワード: ',
    save: '保存',
    passwordPolicy: 'パスワード・ポリシー',
    passwordPolicy1: '8文字以上100文字まで',
    passwordPolicy2: '英大文字と英小文字を含む',
    passwordPolicy3: '数字を含む',
    passwordPolicy4: 'シンボルを含む',
    passwordPolicy5: '空白を含まない',
    adminMenu: '管理メニュー',
    logout: 'ログアウト',
    notSatisfiedPasswordPolicy: 'パスワード・ポリシーを満たしていません'
  },
  createuser: {
    createUser: 'ユーザーの作成',
    userId: 'ユーザーID: ',
    displayName: '表示用ユーザー名: ',
    password: 'パスワード: ',
    grantAdmin: '管理者(ユーザーメンテナンス)権限を付与',
    create: '作成',
    passwordPolicy: 'パスワード・ポリシー',
    passwordPolicy1: '8文字以上100文字まで',
    passwordPolicy2: '英大文字と英小文字を含む',
    passwordPolicy3: '数字を含む',
    passwordPolicy4: 'シンボルを含む',
    passwordPolicy5: '空白を含まない',
    adminMenu: '管理メニュー',
    logout: 'ログアウト'
  },
  deleteuser: {
    deleteCompleted: 'ユーザー削除完了',
    deleteCompletedMessage: 'ユーザーの削除が完了しました。',
    backToUserSearch: 'ユーザー検索画面に戻る',
    adminMenu: '管理メニュー',
    logout: 'ログアウト'
  },
  edit: {
    editKnowledge: 'ナレッジ編集',
    knowledgeNo: 'ナレッジ # ',
    title: 'タイトル: ',
    contents: '内容: ',
    save: '保存',
    adminMenu: '管理メニュー',
    logout: 'ログアウト',
    pleaseEnter: 'リンク情報を入力してください',
    strings: '文字列: ',
    uri: 'URI: ',
    insert: '挿入',
    cancel: 'キャンセル',
    pleaseSpecifyImageFileToUpload: 'アップロードする画像ファイルを指定してください',
    upload: 'アップロード',
    uploading: 'アップロード中...',
    uploadedSuccessfully: 'アップロードが完了しました。',
    failedToUpload: 'アップロードに失敗しました。'
  },
  editconfirm: {
    confirmEdit: 'ナレッジ編集確認',
    save: '保存',
    back: '戻る',
    menu: 'メニュー',
    logout: 'ログアウト'
  },
  edituser: {
    editUser: 'ユーザーの編集',
    userId: 'ユーザーID: ',
    displayName: '表示用ユーザー名: ',
    grantAdmin: '管理者(ユーザーメンテナンス)権限を付与',
    save: '保存',
    delete: '削除',
    confirmOfDelete: '削除の確認',
    areYouSureYouWantToDeleteTheUser: 'ユーザーを削除してよろしいですか？',
    yes: 'はい',
    no: 'いいえ',
    backToUserSearch: 'ユーザー検索画面に戻る',
    adminMenu: '管理メニュー',
    logout: 'ログアウト'
  },
  edituser_error: {
    error: 'エラー',
    userNotFound: 'ユーザーが見つかりませんでした。',
    adminMenu: '管理メニュー',
    logout: 'ログアウト'
  },
  edituserpw: {
    changePasswordOfAUser: 'ユーザーのパスワード変更',
    userId: 'ユーザーID: ',
    displayName: '表示用ユーザー名: ',
    authority: '権限: ',
    adminAuthority: '管理者権限',
    onlyCreateEditKnowledges: 'ナレッジ作成編集のみ',
    password: 'パスワード: ',
    save: '保存',
    backToUserSearch: 'ユーザー検索画面に戻る',
    adminMenu: '管理メニュー',
    logout: 'ログアウト'
  },
  edituserpwresult: {
    changePasswordOfAUser: 'ユーザーのパスワード変更',
    changePasswordOfAUserMessage: 'ユーザーのパスワードを変更しました。',
    adminMenu: '管理メニュー',
    logout: 'ログアウト'
  },
  edituserresult: {
    editUser: 'ユーザー編集',
    editUserMessage: 'ユーザーを編集しました。',
    backToEditUser: 'ユーザー検索画面に戻る',
    adminMenu: '管理メニュー',
    logout: 'ログアウト'
  },
  make: {
    createKnowledge: 'ナレッジ作成',
    title: 'タイトル: ',
    contents: '内容: ',
    save: '保存',
    adminMenu: '管理メニュー',
    logout: 'ログアウト',
    pleaseEnter: 'リンク情報を入力してください',
    strings: '文字列:',
    uri: 'URI:',
    insert: '挿入',
    cancel: 'キャンセル',
    pleaseSpecifyImageFileToUpload: 'アップロードする画像ファイルを指定してください',
    upload: 'アップロード',
    uploading: 'アップロード中...',
    uploadedSuccessfully: 'アップロードが完了しました。',
    failedToUpload: 'アップロードに失敗しました。'
  },
  makeconfirm: {
    confirmSave: 'ナレッジ保存確認',
    save: '保存',
    back: '戻る',
    menu: 'メニュー',
    logout: 'ログアウト'
  },

};

module.exports = resource;
