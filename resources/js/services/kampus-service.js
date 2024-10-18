import Swal from "sweetalert2";
import $ from "jquery";
import "datatables.net";
import "jquery-mask-plugin";

const urlGetKampus = $('#list-kampus').data('get-kampus-url');
function paginationButton(currentPage, lastPage) {
   let paginationButton = $('#pagination-button');
   paginationButton.empty();
   if (currentPage > 1) {
      let prevButton = $('<button class="rounded bg-blue-500 p-2 text-white">Prev</button > ');
      prevButton.on('click', function () {
         getKampus(currentPage - 1);
      });
      paginationButton.append(prevButton);
   }
   let startPage = Math.max(1, currentPage - 2);
   let endPage = Math.min(lastPage, currentPage + 2);
   if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
   }
   for (let i = startPage; i <= endPage; i++) {
      let buttonNumber = $(`
         <button class="rounded px-3 text-white ${i === currentPage ? 'bg-blue-500' : 'bg-slate-300'}">
            ${i}
         </button>`);
      buttonNumber.on('click', function () {
         getKampus(i);
      });
      paginationButton.append(buttonNumber);
   }
   if (currentPage < lastPage) {
      let nextButton = $('<button class="rounded bg-blue-500 p-2 text-white">Next</button > ');
      nextButton.on('click', function () {
         getKampus(currentPage + 1);
      });
      paginationButton.append(nextButton);
   }
}

export function getKampus(page = 1, perPage = 6) {
   $('#loader-kampus').show();
   $('#list-kampus-container').hide();
   $.ajax({
      headers: {
         "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
            "content"
         ),
      },
      url: `${urlGetKampus}?page=${page}&perPage=${perPage}`,
      method: 'GET',
      data: { page, perPage },
      dataType: 'json',
      success: function (response) {
         if (response.status == 'success') {
            $('#loader-kampus').hide();
            $('#list-kampus-container').show();
            $('#list-kampus').html(
               response.data.map(kampus => `
                  <div class="card bg-base-100 shadow-md">
                  <div class="card-body">
                     <h2 class="text-md font-medium">${kampus.nama}</h2>
                     <p>${kampus.kode}</p>
                  </div>
                  </div>
                  `
               ).join('')
            );
            $('#pagination-info').text(`Halaman ${response.pagination.current_page} dari ${response.pagination.last_page}, total ${response.pagination.total} data`);
            paginationButton(response.pagination.current_page, response.pagination.last_page);
         } else {
            $('#loader-kampus').hide();
            console.error(response.error);
         }
      },
      error: function (response) {
         console.error("error wak");
      }
   })
}
