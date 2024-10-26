@extends('layout.main')
@section('content')
	<div class="app" data-page="login">
		<div class="card w-96 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">User Login</h2>
				<form id="login-form" autocomplete="off">
					@csrf
					<label class="form-control w-full max-w-xs">
						<div class="label">
							<span class="label-text">What is your name?</span>
						</div>
						<input class="input input-bordered w-full max-w-xs focus:outline-none" id="name" name="name" type="text"
							placeholder="Type here" />
						<div class="invalid-feedback text-red-500" id="error-name-login"></div>
					</label>
					<label class="form-control w-full max-w-xs">
						<div class="label">
							<span class="label-text">
								What is your password?
							</span>
						</div>
						<input class="input input-bordered w-full max-w-xs focus:outline-none" id="password" name="password"
							type="password" placeholder="Type here" />
						<div class="invalid-feedback text-red-500" id="error-password-login"></div>
					</label>
					<div class="card-actions mt-3 max-w-full border">
						<button class="text-md w-full rounded-md bg-blue-500 p-2 text-white shadow-sm focus:outline-none" id="submit-login"
							data-url-login="{{ url('/authenticating') }}" type="submit">
							<i class="fa-solid fa-right-to-bracket me-1"></i>
							<span>Login</span>
						</button>
					</div>
					<div class="card-actions mt-3 max-w-full border">
						<a class="text-md w-full text-center rounded-md bg-red-500 p-2 text-white shadow-sm focus:outline-none" href="{{ url('login/google') }}">
							<i class="fa-brands fa-google me-1"></i>
							<span>Google</span>
						</a>
					</div>
				</form>
				<div class="my-1 flex items-center">
					<div class="flex-grow border-t border-gray-300"></div>
					<span class="px-2 text-sm text-gray-500">OR</span>
					<div class="flex-grow border-t border-gray-300"></div>
				</div>
				<div class="card-actions max-w-full border">
					<button class="text-md btn w-full border-0 bg-slate-600 text-white hover:bg-slate-600">
						Register
					</button>
				</div>
			</div>
		</div>
	</div>
@endsection
