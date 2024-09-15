import $ from "jquery";
const page = $('#app').data('page');

if(page === 'dashboard'){
   import('./services/barang-service').then(module => {
      module.getBarang();
      module.addBarang();
   });
}
