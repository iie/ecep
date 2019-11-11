<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
		$this->mapWebRoutes();
        //$this->mapApiLoginRoutes();
		//$this->mapApiTestLabRoutes();
		//$this->mapApiVisitaTecnicaRoutes();
		$this->mapApiPostulacionRoutes();
        //$this->mapApiBitacoraRoutes();
		$this->mapApiEcepRoutes();
    }
	
    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiEcepRoutes()
    {
        Route::prefix('api')
             ->middleware('api')
             ->namespace($this->namespace)
             ->group(base_path('routes/api/ecep.php'));
    }
	

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */    
	// protected function mapWebRoutes()
    // {
        // Route::middleware('web')
             // ->namespace($this->namespace)
			 // ->group(base_path('routes/web/descarga-pdf.php'));
    // }
	
    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */    
	protected function mapWebRoutes()
    {
        Route::middleware('web')
             ->namespace($this->namespace)
			 ->group(base_path('routes/web.php'));
    }

    
	/**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiPostulacionRoutes()
    {
        Route::prefix('api')
             ->middleware('api')
             ->namespace($this->namespace)
             ->group(base_path('routes/api/postulacion.php'));
    }
	
    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    // protected function mapApiTestLabRoutes()
    // {
        // Route::prefix('api')
             // ->middleware('api')
             // ->namespace($this->namespace)
             // ->group(base_path('routes/api/testlab.php'));
    // }
	
    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    // protected function mapApiVisitaTecnicaRoutes()
    // {
        // Route::prefix('api')
             // ->middleware('api')
             // ->namespace($this->namespace)
             // ->group(base_path('routes/api/infralab.php'));
    // }
	

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    // protected function mapApiLoginRoutes()
    // {
        // Route::prefix('api')
             // ->middleware('api')
             // ->namespace($this->namespace)
             // ->group(base_path('routes/api/login.php'));
    // }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
     // protected function mapApiBitacoraRoutes()
     // {
     //     Route::prefix('api')
     //        ->middleware('api')
     //        ->namespace($this->namespace)
     //        ->group(base_path('routes/api/bitacora.php'));
     // }
}
