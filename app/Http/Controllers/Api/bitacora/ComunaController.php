<?php

namespace App\Http\Controllers;
use App\Models\Comuna;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ComunaController extends Controller{
    public function corsAccept(Request $request){
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: OPTIONS, POST");
        header("Access-Control-Allow-Headers: t");
    }

    public function index(Request $request){
        $comunas = DB::select("SELECT id, nombre_comuna FROM comunas");

        return response()->json($comunas);
    }

    public function indexByRegion(Request $request){
        $post = $request->all();

        $comunas = DB::select("SELECT id, nombre_comuna FROM comunas WHERE region_id = " . $post["region_id"]);

        return response()->json($comunas);
    }

    public function indexById(Request $request){
        $post = $request->all();

        $comuna = DB::select("SELECT id, nombre_comuna FROM comunas WHERE id = " . $post["comuna_id"]);

        return response()->json($comuna);
    }
}
