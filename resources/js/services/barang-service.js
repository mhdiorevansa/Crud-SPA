import Swal from "sweetalert2";
import $ from "jquery";
import 'datatables.net';
import 'jquery-mask-plugin';

$('#add-harga-barang').mask('000.000.000', { reverse: true });

let tableBarang;
const urlGetBarang = $('#table-barang').data('get-barang-url');
export function getBarang() {
   tableBarang = $('#table-barang').DataTable({
      "lengthMenu": [10, 15, 20],
      "pageLength": 10,
      "searching": true,
      responsive: true,
      processing: true,
      serverSide: true,
      ajax: urlGetBarang,
      columns: [
         {
            data: 'DT_RowIndex',
            name: 'DT_RowIndex',
            orderable: false,
            searchable: false
         },
         {
            data: 'nama_barang',
            name: 'nama_barang'
         },
         {
            data: 'harga_barang',
            name: 'harga_barang',
            render: function (val, type, row) {
               return 'Rp. ' + val.toLocaleString('id-ID');
            }
         },
      ],
      dom:
         "<'flex justify-between items-center mb-4'<'flex items-center'l><'flex items-center'f>>" + // Length and search box
         "<'overflow-x-auto text-left tracking-wider font-medium'<'table-responsive'tr>>" +  // Table content
         "<'flex justify-between items-center mt-5'<'flex items-center me-5'i><'flex items-center'p>>", // Info and pagination
      language: {
         search: "",
         searchPlaceholder: "Search...",
      },
      drawCallback: function () {
         // input search
         $('input[type="search"]').addClass('block w-full p-1 placeholder:text-sm placeholder:ps-1 placeholder:text-[#353935] border border-[#353935] rounded-md shadow-sm focus:outline-0');

         // page entries
         $('.dt-length select').addClass('flex p-1 border border-[#353935] rounded-md shadow-sm focus:border-[#353935] focus:outline-0');
         $('.dt-length').addClass('flex items-center gap-2');
         $('.dt-input').addClass('text-sm text-[#353935]');
         $('.dt-length label').addClass('mr-0 text-[#353935]');

         // pagination
         $('.dt-info').addClass('text-[#353935] text-xs');
         $('.dt-paging nav').addClass('inline-flex');
      },
      "initComplete": function (settings, json) {
         $('[data-kt-menu]').each(function () {
            var menu = new KTMenu(this);
         });
      },
      columnDefs: [{
         responsivePriority: 1,
         targets: [0, -1]
      }],
   });
}

function reloadTableBarang() {
   tableBarang.ajax.reload(null, false);
}

const urlCreateBarang = $('#submit-data-barang').data('create-barang-url');
export function addBarang() {
   $("#add-barang").on("submit", function (event) {
      event.preventDefault();
      $("#submit-data-barang").html("Menyimpan Data...").attr("disabled", "disabled");
      $("#add-nama-barang").removeClass("is-invalid");
      $("#add-harga-barang").removeClass("is-invalid");
      $("#error-nama-barang").html('');
      $("#error-harga-barang").html('');
      let formData = new FormData(this);
      $.ajax({
         headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
         },
         cache: false,
         contentType: false,
         processData: false,
         method: "POST",
         url: urlCreateBarang,
         data: formData,
         dataType: "json",
         success: function (response) {
            if (response.status == "success") {
               reloadTableBarang();
               const Toast = Swal.mixin({
                  toast: true,
                  position: "top-end",
                  showConfirmButton: false,
                  timer: 1500,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                     toast.onmouseenter = Swal.stopTimer;
                     toast.onmouseleave = Swal.resumeTimer;
                  },
               });
               Toast.fire({
                  icon: "success",
                  title: response.message,
               }).then((result) => {
                  if (result.isConfirmed) {
                     Swal.close();
                  }
               });
               setTimeout(function () {
                  Swal.close();
                  $("#error-nama-barang").html("");
                  $("#error-harga-barang").html("");
                  $("#add-barang")[0].reset();
               }, 1500);
            } else {
               const Toast = Swal.mixin({
                  toast: true,
                  position: "top-end",
                  showConfirmButton: false,
                  timer: 1500,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                     toast.onmouseenter = Swal.stopTimer;
                     toast.onmouseleave = Swal.resumeTimer;
                  },
               });
               Toast.fire({
                  icon: "error",
                  title: response.message,
               });
            }
         },
         error: function (response) {
            if (response.status == 422) {
               let errorResponse = JSON.parse(response.responseText);
               if (
                  errorResponse.errors &&
                  errorResponse.errors.nama_barang
               ) {
                  let errors = errorResponse.errors;
                  $("#add-nama-barang").addClass("is-invalid");
                  $("#error-nama-barang").html(errors.nama_barang[0]);
               }
               if (
                  errorResponse.errors &&
                  errorResponse.errors.harga_barang
               ) {
                  let errors = errorResponse.errors;
                  $("#add-harga-barang").addClass("is-invalid");
                  $("#error-harga-barang").html(errors.harga_barang[0]);
               }
            } else {
               errorAjaxResponse(response);
            }
         },
         complete: function () {
            $("#submit-data-barang")
               .html("Tambah Barang")
               .removeAttr("disabled");
         },
      });
   });
}
