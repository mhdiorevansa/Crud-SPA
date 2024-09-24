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
      responsive: false,
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
            name: 'nama_barang',
            render: function (val, type, row) {
               return `<span title="${val}">${val.length > 15 ? val.substring(0, 15) + '...' : val}</span>`;
            }
         },
         {
            data: 'harga_barang',
            name: 'harga_barang',
            render: function (val, type, row) {
               return 'Rp. ' + val.toLocaleString('id-ID');
            }
         },
         {
            "orderable": false,
            "searchable": false,
            "data": null,
            render: function (data, type, row, meta) {
               return `<div class="dropdown dropdown-left dropdown-end">
                        <div tabindex="0" role="button" class="btn border-0 p-0"><i class="fa-solid fa-ellipsis"></i></div>
                        <ul tabindex="0" class="dropdown-content menu bg-white rounded-box z-[1] w-32 me-2 p-0 shadow">
                           <li><a>Edit</a></li>
                           <li><a>Hapus</a></li>
                        </ul>
                     </div>`;
            }
         }
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
      columnDefs: [{
         responsivePriority: 1,
         targets: [0, -1]
      }],
   });
}

function reloadHighlightTable() {
   tableBarang.ajax.reload(function () {
      let data = tableBarang.rows().data();
      let maxId = -1;
      let rowIndexWithMaxId = -1;
      data.each(function (value, index) {
         if (value.id > maxId) {
            maxId = value.id;
            rowIndexWithMaxId = index;
         }
      });
      if (rowIndexWithMaxId !== -1) {
         let rowNode = tableBarang.row(rowIndexWithMaxId).node();
         $(rowNode).addClass('transition duration-500 ease-in-out bg-blue-500 text-white opacity-100');
         setTimeout(function () {
            $(rowNode).addClass('opacity-0');
            setTimeout(function () {
               $(rowNode).removeClass('bg-blue-500 text-white opacity-0');
            }, 500);
         }, 2000);
      }
   }, false);
}

const urlCreateBarang = $('#submit-data-barang').data('create-barang-url');
export function addBarang() {
   $("#add-barang").on("submit", function (event) {
      event.preventDefault();
      $("#submit-data-barang").html('<i class="fa-solid fa-spinner animate-spin me-1"></i>Menyimpan Data...').attr("disabled", "disabled");
      $("#add-nama-barang").removeClass("is-invalid");
      $("#add-harga-barang").removeClass("is-invalid");
      $("#error-nama-barang").html('');
      $("#error-harga-barang").html('');
      let formData = new FormData(this);
      formData.append('harga_barang', $("#add-harga-barang").val().replace(/\D/g, ''));
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
               reloadHighlightTable();
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
               });
               $("#add-barang")[0].reset();
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
