<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

	<head>
		<meta charset="utf-8" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="application-name" content="{{ config('app.name') }}" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="keywords" content="html, css, javascript, laravel, mysql, crud, spa, belajar" />
		<meta name="author" content="Muhammad Dio Revansa" />
		<meta name="publisher" content="Dio Net">
		<meta name="robots" content="all">
		<meta name="csrf-token" content="{{ csrf_token() }}" />
		{!! SEO::generate(true) !!}
		<link type="image/x-icon" href="{{ asset('storage/img/laravel.svg') }}" rel="icon" />
		<title>{{ config('app.name') }} | {{ $web['title'] }}</title>
		<link href="https://fonts.bunny.net" rel="preconnect" />
		<link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
		@vite(['resources/css/app.css', 'resources/js/app.js'])
		@laravelPWA
	</head>

	<body>
		<div class="flex min-h-screen max-w-full items-center justify-center px-5 md:px-0">
			@yield('content')
		</div>
		<script src="https://kit.fontawesome.com/4225da578e.js" crossorigin="anonymous"></script>
	</body>

</html>
