// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://dev.api.zeepzoop.com/',
  userId: localStorage.getItem('userId'),
  userName: localStorage.getItem('userName'),
  userEmail: localStorage.getItem('userEmail'),
  userPhone: localStorage.getItem('userPhone'),
  userType: localStorage.getItem('userType'),
  userImage: localStorage.getItem('userPicture'),

};
