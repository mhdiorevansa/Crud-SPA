import $ from "jquery";
let page = $('.app').data('page');

if (page === 'dashboard') {
   import('./services/barang-service').then(module => {
      module.getBarang();
      module.addBarang();
      module.updateBarang();
      module.chatUser();
   });
} else if (page === 'login') {
   import('./services/auth-service').then(module => {
      module.login();
   });
}
