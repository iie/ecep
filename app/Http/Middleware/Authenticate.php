<?php

namespace App\Http\Middleware;
use Closure;

// use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
    // protected function redirectTo($request, Closure $next)
    // {
    //     return $next($request);
    //     // dd("PASO POR AQUÍ!");
    //     // return route('login');
    // }
    public function handle($request, Closure $next) {
        $token = $request->header('t');
        $msgInvalido = "token invalido";
        $msgExpiracion = "sesion expirada";
		$usuario = \DB::select("SELECT id_usuario FROM core.usuario WHERE token = '".$token."' ");

        if(count($usuario)>0){
			$request->merge(array("id_usuario" => $usuario[0]->id_usuario));
			return $next($request);
		}

        echo $msgInvalido;
        exit;
    }
}
