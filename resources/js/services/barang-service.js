import Swal from "sweetalert2";
import $ from "jquery";
import 'datatables.net';

const urlGetBarang = $('#table-barang').data('get-barang-url');
export function getBarang() {
   $('#table-barang').DataTable({
      responsive: true,
      processing: true,
      serverSide: true,
      ajax: urlGetBarang,
      columns: [
         { 
            data: 'nama_barang',
            name: 'nama_barang' 
         },
         { 
            data: 'harga_barang', 
            name: 'harga_barang' 
         },
      ],
      dom:
         "<'flex justify-between items-center mb-4'<'flex items-center'l><'flex items-center'f>>" + // Length and search box
         "<'overflow-x-auto text-gray-400 text-left tracking-wider text-sm font-medium'<'table-responsive'tr>>" +  // Table content
         "<'flex justify-between items-center mt-5'<'flex items-center me-5'i><'flex items-center'p>>", // Info and pagination
      language: {
         search: "",
         searchPlaceholder: "Search...",
      },
      drawCallback: function () {
         // input search
         $('input[type="search"]').addClass('block w-full p-1 placeholder:text-sm placeholder:ps-2 placeholder:text-gray-400 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent');
         $('.dt-length select').addClass('flex p-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent');

         // page entries
         $('.dt-length').addClass('flex items-center gap-2');
         $('.dt-input').addClass('text-sm text-gray-400 ps-2');
         $('.dt-length label').addClass('mr-0 text-gray-400');

         // pagination
         $('.dt-info').addClass('text-gray-400 text-xs');
         $('.dt-paging nav').addClass('inline-flex space-x-1');

      },
   });
}

const urlCreateBarang = $('#submit-data-barang').data('create-barang-url');
export function addBarang() {
   $("#add-barang").on("submit", function (event) {
      event.preventDefault();
      $("#submit-data-barang")
         .html("Menyimpan Data...")
         .attr("disabled", "disabled");
      $("#add-nama-barang").removeClass("is-invalid");
      $("#add-harga-barang").removeClass("is-invalid");
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
               const Toast = Swal.mixin({
                  toast: true,
                  position: "top-end",
                  showConfirmButton: false,
                  timer: 2000,
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
               }, 2000);
            } else {
               const Toast = Swal.mixin({
                  toast: true,
                  position: "top-end",
                  showConfirmButton: false,
                  timer: 2000,
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
