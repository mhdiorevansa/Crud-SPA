@extends('layout.main')
@section('content')
	<div class="app" data-page="dashboard">
		<button class="fixed left-3 top-3 z-10 rounded bg-red-500 p-2 text-white" id="logout"
			data-logout-url="{{ url('dashboard/logout') }}">Logout</button>
		<header class="mb-5 mt-7 flex flex-col gap-4">
			<h1 class="text-center text-2xl font-semibold uppercase">data barang</h1>
		</header>
		<div class="w-[28rem]">
			<form class="flex flex-col gap-y-5" id="add-barang" autocomplete="off">
				@csrf
				<div class="flex flex-col">
					<label class="text-md mb-2" for="">Nama Barang</label>
					<input class="text-md rounded-md border border-slate-200 p-2 shadow-sm placeholder:capitalize focus:outline-none"
						id="add-nama-barang" name="nama_barang" type="text" placeholder="masukkan nama barang">
					<div class="invalid-feedback text-red-500" id="error-nama-barang"></div>
				</div>
				<div class="flex flex-col">
					<label class="text-md mb-2" for="">Harga Barang</label>
					<input class="text-md rounded-md border border-slate-200 p-2 shadow-sm placeholder:capitalize focus:outline-none"
						id="add-harga-barang" name="harga_barang" type="text" placeholder="masukkan harga barang">
					<div class="invalid-feedback text-red-500" id="error-harga-barang"></div>
				</div>
				<div class="flex flex-col gap-y-4">
					<button class="text-md rounded-md bg-blue-500 p-2 text-white shadow-sm focus:outline-none" id="submit-data-barang"
						data-create-barang-url="{{ url('dashboard/item-create') }}" type="submit">
						<div class="flex items-center justify-center gap-x-2">
							<i class="fa-solid fa-plus"></i>
							<span>Tambah Barang</span>
						</div>
					</button>
				</div>
			</form>
			<div class="my-7">
				<table class="min-w-full divide-gray-300 text-[#353935]" id="table-barang"
					data-get-barang-url="{{ url('dashboard/item-all') }}">
					<thead class="bg-slate-100">
						<tr>
							<th class="py-3 ps-3 text-left font-medium capitalize tracking-wider">No</th>
							<th class="py-3 ps-3 text-left font-medium capitalize tracking-wider">Nama Barang</th>
							<th class="py-3 ps-3 text-left font-medium capitalize tracking-wider">Harga Barang</th>
							<th class="py-3 ps-3 text-left font-medium capitalize tracking-wider">Aksi</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-300 bg-white">
						<!-- Data Table -->
					</tbody>
				</table>
				{{-- modal edit barang --}}
				<dialog class="modal modal-bottom sm:modal-middle" id="edit_modal"
					data-edit-barang-url="{{ url('dashboard/item-edit') }}" data-delete-barang-url="{{ url('dashboard/item-delete') }}">
					<div class="modal-box bg-white">
						<div class="hidden items-center justify-center text-center" id="loader">
							<div class="flex items-center justify-center">
								<i class="fa fa-spinner fa-spin me-2 text-2xl"></i><span>Loading...</span>
							</div>
						</div>
						<div class="hidden" id="modal_content">
							<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2" id="close_modal">✕</button>
							<h3 class="text-lg font-bold">Edit Barang</h3>
							<div class="modal-action mt-4">
								<form class="align-items-center flex w-full flex-col gap-y-4" id="edit-barang">
									@csrf
									<input id="id-edit" name="id" type="hidden">
									<div class="flex flex-col">
										<label class="text-md mb-2" for="">Nama Barang</label>
										<input
											class="text-md rounded-md border border-slate-200 p-2 shadow-sm placeholder:capitalize focus:outline-none"
											id="nama-barang-edit" name="nama_barang" type="text" placeholder="masukkan nama barang">
										<div class="text-red-500" id="error-edit-nama-barang"></div>
									</div>
									<div class="flex flex-col">
										<label class="text-md mb-2" for="">Harga Barang</label>
										<input
											class="text-md rounded-md border border-slate-200 p-2 shadow-sm placeholder:capitalize focus:outline-none"
											id="harga-barang-edit" name="harga_barang" type="text" placeholder="masukkan harga barang">
										<div class="text-red-500" id="error-edit-harga-barang"></div>
									</div>
									<button class="text-md w-32 self-end rounded-md bg-blue-500 p-2 text-white shadow-sm focus:outline-none"
										id="edit-data-barang" data-update-barang-url="{{ url('dashboard/item-update') }}" type="submit">
										<div class="flex items-center justify-center gap-x-2">
											<i class="fa-regular fa-pen-to-square"></i>
											<span>Edit Barang</span>
										</div>
									</button>
								</form>
							</div>
						</div>
					</div>
				</dialog>
			</div>
		</div>
		{{-- chat box --}}
		<div class="dropdown-end dropdown-top dropdown fixed bottom-0 right-0 z-10 m-3">
			<label class="btn my-3 mx-1 bg-white hover:bg-white" id="button-chat-room" tabindex="0">
				<i class="fa-regular fa-comments text-xl"></i>
			</label>
			<div class="menu dropdown-content z-[1] w-[22rem] bg-white shadow-md" id="chat-room" tabindex="0">
				<div class="card h-[55vh] rounded-md">
					<div class="card-body px-6 py-0">
						<h2 class="card-title mt-3" id="title-chat">Live Chat!</h2>
						<hr>
						<div class="h-[33vh] overflow-y-scroll" id="all-user" data-all-user="{{ url('dashboard/get-all-user') }}">
							<!-- User list will be populated here -->
						</div>
						<div class="hidden h-[33vh] overflow-y-scroll" id="chat-box">
							<!-- Chat messages will be displayed here -->
						</div>
						<div class="card-actions absolute bottom-4 mt-3 hidden" id="chat-form">
							<form id="form-chat" autocomplete="off">
								@csrf
								<div class="join">
									<input class="input join-item border border-gray-300 focus:border-gray-300 focus:outline-none"
										id="message-input" name="text" type="text" placeholder="Ketik pesan" />
									<button class="btn join-item border border-gray-300 hover:border-gray-300" id="send-msg"
										type="submit">Kirim</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
@endsection
