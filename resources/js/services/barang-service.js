import Swal from "sweetalert2";
import $ from "jquery";
import 'datatables.net';
import 'jquery-mask-plugin';

$('#add-harga-barang, #harga-barang-edit').mask('000.000.000', { reverse: true });

function editDataBarang(id) {
   const urlEditBarang = $('#edit_modal').data('edit-barang-url') + '/' + id;
   $('#edit_modal').addClass('modal-open');
   $('#loader').show();
   $('#modal_content').hide();
   $.ajax({
      headers: {
         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      type: 'GET',
      url: urlEditBarang,
      dataType: 'json',
      success: function (response) {
         if (response.status == 'success') {
            console.log(response.message);
            let data = response.data;
            $('#id-edit').val(id);
            $('#nama-barang-edit').val(data.nama_barang);
            $('#harga-barang-edit').val(data.harga_barang);
            $('#loader').hide();
            $('#modal_content').show();
         } else {
            Swal.fire({
               icon: "error",
               title: response.message,
               toast: true,
               position: "top-end",
               showConfirmButton: false,
               timer: 1500,
               timerProgressBar: true,
            });
         }
      },
      error: function (response) {
         $('#loader').hide();
         errorAjaxResponse(response);
      }
   });
   $('#close_modal').on('click', function () {
      $('#edit_modal').removeClass('modal-open');
      $('#id-edit').val('');
      $('#nama-barang-edit').val('');
      $('#harga-barang-edit').val('');
   });
}
window.editDataBarang = editDataBarang;

let tableBarang;

function deleteBarang(id) {
   const urlDeleteBarang = $('#edit_modal').data('delete-barang-url');
   Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Kamu tidak dapat mengembalikan ini lagi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Iya, hapus",
      cancelButtonText: "Batal",
   }).then((result) => {
      if (result.isConfirmed) {
         $.ajax({
            headers: {
               'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: "POST",
            url: urlDeleteBarang + '/' + id,
            data: {
               _method: 'DELETE'
            },
            success: function (response) {
               if (response.status == 'success') {
                  tableBarang.ajax.reload(null, false);
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
               errorAjaxResponse(response);
            }
         });
      }
   });
}
window.deleteBarang = deleteBarang;

export function getBarang() {
   const urlGetBarang = $('#table-barang').data('get-barang-url');
   tableBarang = $('#table-barang').DataTable({
      "lengthMenu": [7, 15, 20],
      "pageLength": 7,
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
               return val;
            }
         },
         {
            "orderable": false,
            "searchable": false,
            "data": null,
            render: function (data, type, row, meta) {
               return `<div class="dropdown dropdown-left dropdown-end">
                        <div tabindex="0" role="button" class="btn border-0 p-0"><i class="fa-solid fa-ellipsis"></i></div>
                        <ul tabindex="0" class="dropdown-content menu bg-white rounded-box z-[1] w-32 me-2 p-0 shadow-md">
                           <li><a href="javascript:void(0)" onclick="editDataBarang('${row.id}')"><i class="fa-regular fa-pen-to-square"></i>Edit</a></li>
                           <li><a href="javascript:void(0)" onclick="deleteBarang('${row.id}')"><i class="fa-regular fa-trash-can"></i>Hapus</a></li>
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

export function addBarang() {
   const urlCreateBarang = $('#submit-data-barang').data('create-barang-url');
   $("#add-barang").on("submit", function (event) {
      event.preventDefault();
      let button = $('#submit-data-barang');
      let icon = button.find('i');
      let text = button.find('span');
      text.text('Menambahkan...');
      icon.removeClass('fa-plus').addClass('fa-spinner fa-spin');
      button.attr("disabled", true);
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
            tableBarang.ajax.reload(null, false);
            if (response.status == "success") {
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
            text.text('Tambah Barang');
            icon.removeClass('fa-spinner fa-spin').addClass('fa-plus');
            button.removeAttr("disabled");
         },
      });
   });
}

export function updateBarang() {
   $('#edit-barang').on('submit', function (event) {
      event.preventDefault();
      let button = $('#edit-data-barang');
      let icon = button.find('i');
      let text = button.find('span');
      button.attr('disabled', true);
      icon.removeClass('fa-regular fa-pen-to-square').addClass('fa-solid fa-spinner fa-spin');
      text.text('Mengedit...');
      let id = $('#id-edit').val();
      const urlUpdateBarang = button.data('update-barang-url') + '/' + id;
      $('#nama-barang-edit').removeClass('is-invalid');
      $('#harga-barang-edit').removeClass('is-invalid');
      let formdata = new FormData(this);
      formdata.append('_method', 'PUT');
      formdata.append('harga_barang', $('#harga-barang-edit').val().replace(/\D/g, ''));
      $.ajax({
         headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
         },
         cache: false,
         contentType: false,
         processData: false,
         method: 'POST',
         url: urlUpdateBarang,
         data: formdata,
         success: function (response) {
            if (response.status == "success") {
               tableBarang.ajax.reload(null, false);
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
               if (errorResponse.errors && errorResponse.errors.nama_barang) {
                  let errors = errorResponse.errors;
                  $("#edit-nama-barang").addClass("is-invalid");
                  $("#error-edit-nama-barang").html(errors.nama_barang[0]);
               }
               if (errorResponse.errors && errorResponse.errors.harga_barang) {
                  let errors = errorResponse.errors;
                  $("#edit-harga-barang").addClass("is-invalid");
                  $("#error-edit-harga-barang").html(errors.harga_barang[0]);
               }
            } else {
               errorAjaxResponse(response);
            }
         },
         complete: function () {
            $('#edit_modal').removeClass('modal-open');
            button.removeAttr('disabled');
            icon.removeClass('fa-solid fa-spinner fa-spin').addClass('fa-regular fa-pen-to-square');
            text.text('Edit Barang');
         }
      });
   });
}

export function chatUser() {
   const sentMessages = new Set();
   $('#form-chat').on('submit', function (event) {
      event.preventDefault();
      const sendButton = $('#send-msg');
      sendButton.attr('disabled', true);

      let message = $('#message-input').val().trim();
      let token = $('meta[name="csrf-token"]').attr('content');
      let timestamp = new Date().toLocaleTimeString();

      if (sentMessages.has(message) || message === '') {
         sendButton.attr('disabled', false);
         return;
      }
      const messageId = `message-${Date.now()}`;
      const messageHtml = `
      <div class="w-max-full flex flex-col">
         <div class="chat chat-end">
            <div class="flex items-center mb-2" id="${messageId}">
               <span class="message-status me-2">
                  <i class="fas fa-clock loading-icon text-gray-500"></i>
               </span>
               <div class="chat-bubble bg-slate-400 p-2 rounded-lg">
                  <span class="message-content">Anda: ${message}</span>
               </div>
            </div>
         </div>
         <time class="text-xs mb-2 text-end text-gray-500 w-full">${timestamp}</time>
      </div>`;

      $('#chat-box').append(messageHtml);
      $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);

      sentMessages.add(message);

      $.post('/message-sent', { _token: token, message: message }, (response) => {
         if (response.status === 'success') {
            $('#message-input').val('');
         } else {
            sentMessages.delete(message);
            $(`#${messageId}`).remove();
         }
      }).fail((err) => {
         console.log(err);
         sentMessages.delete(message);
         $(`#${messageId}`).remove();
      }).always(() => {
         sendButton.attr('disabled', false);
      });
   });

   window.Echo.private('chats').listen('MessageSent', (e) => {
      $('#send-msg').attr('disabled', false);
      const messageElement = $('#chat-box').find(`.message-content:contains("${e.message}")`).closest('.flex');
      if (sentMessages.has(e.message)) {
         messageElement.find('.loading-icon').removeClass('fa-clock').addClass('fa-check text-green-500');
         sentMessages.delete(e.message);
      } else {
         const receivedMessageHtml = `
         <div class="w-max-full flex flex-col">
            <div class="chat chat-start ps-2">
               <div class="flex items-center mb-2">
                  <div class="chat-bubble bg-slate-400 p-2 rounded-lg">
                     <span class="message-content">${e.name}: ${e.message}</span>
                  </div>
                  <span class="message-status ml-2">
                     <i class="fas fa-check check-icon text-green-500"></i>
                  </span>
               </div>
            </div>
            <time class="text-xs text-start mb-2 text-gray-500 w-full">${new Date().toLocaleTimeString()}</time>
         </div>`;
         $('#chat-box').append(receivedMessageHtml);
         $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
      }
   });
}

export function chatRoom() {
   let isOpen = false;
   $('#button-chat-room').on('click', async function (event) {
      event.preventDefault();
      isOpen = !isOpen;
      if (isOpen) {
         $('#chat-room').removeClass('hidden');
         $('#button-chat-room').find('i').removeClass('fa-regular fa-comments').addClass('fa-solid fa-xmark');
         try {
            const response = await $.ajax({
               url: $('#all-user').data('all-user'),
               method: 'GET',
               headers: {
                  'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
               }
            });
            if (response.status === 'success' && Array.isArray(response.data) && response.data.length > 0) {
               const userListHtml = response.data.map(user => `
                  <div class="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer user-chat" data-userid="${user.id}" data-username="${user.name}">
                     <div class="avatar">
                        <div class="w-10 rounded-full">
                           <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="${user.name}" />
                        </div>
                     </div>
                     <span class="text-lg">${user.name}</span>
                  </div>
               `).join('');
               $('#all-user').html(userListHtml);
               $('#all-user').find('.user-chat').on('click', function () {
                  const userId = $(this).data('userid');
                  const userName = $(this).data('username');
                  $('#title-chat').text(userName).addClass('capitalize');
                  $('#chat-box').removeClass('hidden');
                  $('#all-user').addClass('hidden');
                  $('#chat-form').removeClass('hidden');
               });
            } else {
               $('#all-user').html('<p class="text-center p-4">No users found</p>');
            }
         } catch (error) {
            console.error('Error fetching users:', error);
            $('#all-user').html('<p class="text-center p-4">Error loading users</p>');
         }
      } else {
         $('#chat-room').addClass('hidden');
         $('#button-chat-room').find('i').removeClass('fa-solid fa-xmark').addClass('fa-regular fa-comments');
      }
   });
}
