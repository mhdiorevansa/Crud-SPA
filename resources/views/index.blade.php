<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

	<head>
		<meta charset="utf-8">
		<meta name="application-name" content="{{ config('app.name') }}">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="Membuat Crud Single Page Application">
		<meta name="keywords" content="html, css, javascript, laravel, mysql, crud, spa, belajar">
		<meta name="author" content="Muhammad Dio Revansa">
		<meta name="csrf-token" content="{{ csrf_token() }}">
		<link type="image/x-icon" href="{{ asset('storage/img/laravel.svg') }}" rel="icon" />
		<title>{{ config('app.name') }} | {{ $web['title'] }}</title>
		<link href="https://fonts.bunny.net" rel="preconnect">
		<link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
		@vite('resources/css/app.css')
	</head>

	<body>
		<div class="max-w-full px-5 md:px-0" id="app" data-page="dashboard">
			<header class="mb-5 mt-7 flex flex-col gap-4">
				<h1 class="text-center text-2xl font-semibold uppercase">data barang</h1>
			</header>
			<div class="mx-auto w-full md:w-2/5">
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
							data-create-barang-url="{{ url('item-create') }}" type="submit">Tambah Barang</button>
					</div>
				</form>
				<div class="my-7">
					<table class="min-w-full divide-gray-300 overflow-hidden text-[#353935]" id="table-barang"
						data-get-barang-url="{{ url('item') }}">
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
					<dialog class="modal modal-bottom sm:modal-middle" id="edit_modal" data-edit-barang-url="{{ url('item-edit') }}">
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
										<button class="text-md w-20 self-end rounded-md bg-blue-500 p-2 text-white shadow-sm focus:outline-none"
											id="edit-data-barang" data-update-barang-url="{{ url('item-update') }}" type="submit">
											<div class="flex items-center justify-center gap-x-2">
												<i class="fa-regular fa-pen-to-square"></i>
												<span>Edit</span>
											</div>
										</button>
									</form>
								</div>
							</div>
						</div>
					</dialog>
				</div>
			</div>
		</div>

		@vite('resources/js/app.js')
		<script src="https://kit.fontawesome.com/4225da578e.js" crossorigin="anonymous"></script>
	</body>

</html>
