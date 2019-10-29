<!DOCTYPE html>
<html  lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Expires" content="0" />	
	
    <title>Evaluación Nacional Diagnóstica de la Formación Inicial Docente</title>

	<!-- Meta -->
	<meta name="description" content="@yield('meta_description', 'Sistema Monitoreo INICIA')">
	<meta name="author" content="@yield('meta_author', 'IIE')">
	@yield('meta')

    <!-- Favicon-->
    <link rel="icon" href="{{ URL::asset('img/favicon.ico') }}" type="image/x-icon">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin,cyrillic-ext" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Niramit|Open+Sans&display=swap" rel="stylesheet">

    <!-- Fuente Gobierno Chile -->
    <link href="./fonts/gobCL/gobCL_font.css" rel="stylesheet" type="text/css">

    <!-- Fuente Gobierno Chile OLD
    <link rel="stylesheet" type="text/css" href="{{ URL::asset('fonts/gobCL/gobCL_font.css') }}">-->

    <!-- Bootstrap Core Css -->
    <link href="{{ URL::asset('adminbsb/plugins/bootstrap/css/bootstrap.css') }}" rel="stylesheet">

	<!-- Styles -->
	@yield('before-styles')
	
    <!-- Waves Effect Css -->
    <link href="{{ URL::asset('adminbsb/plugins/node-waves/waves.css') }}" rel="stylesheet" />

    <!-- Animation Css -->
    <link href="{{ URL::asset('adminbsb/plugins/animate-css/animate.css') }}" rel="stylesheet" />

    <!-- Bootstrap Select Css -->
    <link href="{{ URL::asset('adminbsb/plugins/bootstrap-select/css/bootstrap-select.css') }}" rel="stylesheet" />

    <!-- style Css -->
    <link href="{{ URL::asset('adminbsb/css/style.css') }}" rel="stylesheet">

	<!-- AdminBSB Themes. You can choose a theme from css/themes instead of get all themes -->
    <link href="{{ URL::asset('adminbsb/css/themes/all-themes.css') }}" rel="stylesheet" />

    <!-- Custom Css -->
    <link href="{{ URL::asset('css/custom.css') }}" rel="stylesheet">

    <!-- really Custom Css -->
    <link href="{{ URL::asset('css/validacion_estudiante.css') }}" rel="stylesheet">
</head>
	<body id="app-layout" class="bg-endfid">
	<section class="xcontent login_bg_2019">
	<div class="">
		@yield('content')
		@yield('footer')
	</div>
	</section>

		@yield('before-scripts')

 		<script src="https://www.google.com/recaptcha/api.js?hl=es" async defer></script>

	    <!-- Jquery Core Js -->
		<script src="{{ URL::asset('adminbsb/plugins/jquery/jquery.min.js') }}"></script>

		<!-- Bootstrap Core Js -->
		<script src="{{ URL::asset('adminbsb/plugins/bootstrap/js/bootstrap.js') }}"></script>

		<!-- Select Plugin Js -->
		<script src="{{ URL::asset('adminbsb/plugins/bootstrap-select/js/bootstrap-select.js') }}"></script>

		<!-- Slimscroll Plugin Js -->
		<script src="{{ URL::asset('adminbsb/plugins/jquery-slimscroll/jquery.slimscroll.js') }}"></script>

		<!-- Jquery Validation Plugin Css -->
		<script src="{{ URL::asset('adminbsb/plugins/jquery-validation/jquery.validate.js') }}"></script>
		<script src="{{ URL::asset('adminbsb/plugins/jquery-validation/localization/messages_es.js') }}"></script>

		<!-- JQuery Steps Plugin Js -->
		<script src="{{ URL::asset('adminbsb/plugins/jquery-steps/jquery.steps.js') }}"></script>

		<!-- Sweet Alert Plugin Js -->
		<script src="{{ URL::asset('adminbsb/plugins/sweetalert/sweetalert.min.js') }}"></script>

		<!-- Waves Effect Plugin Js -->
		<script src="{{ URL::asset('adminbsb/plugins/node-waves/waves.js') }}"></script>

		<script src="{{ URL::asset('adminbsb/plugins/bootstrap-notify/bootstrap-notify.js') }}"></script>
		
		<script type="text/javascript">
	    	//$(document).ready(function(){});
		</script>
		<!-- Custom Js -->
		<script src="{{ URL::asset('adminbsb/js/admin.js') }}"></script>

		<!-- Demo Js -->
		<script src="{{ URL::asset('adminbsb/js/demo.js') }}"></script>

		@yield('after-includescripts')
		@yield('after-scripts')	

</body>
</html>