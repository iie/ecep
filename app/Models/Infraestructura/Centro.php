<?php
namespace App\Models\Infraestructura;
use Illuminate\Database\Eloquent\Model;

class Centro extends Model
{
	protected $table = 'infraestructura.centro_operaciones';
	protected $primaryKey  = 'id_centro_operaciones';

	public function provincia(){
		$this->hasMany('App\Models\Infraestructura\Provincia');
	}
}